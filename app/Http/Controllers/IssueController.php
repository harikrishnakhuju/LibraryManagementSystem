<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use App\Models\BookTransaction;
use App\Models\BorrowPolicy;
use Illuminate\Http\Request;
use Carbon\Carbon;

class IssueController extends Controller
{
    public function issueTransaction(Request $request)
    {
        // Validate the request data
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'book_copy_id' => 'required|exists:book_copies,id',
            'issueDate' => 'required|date',
            'user_role' => 'required | string',
        ]);

        $policy = BorrowPolicy::where('role', $request->user_role)->first();
        if (!$policy) {
            return response()->json(['error' => 'No policy found for this role'], 422);
        }

        $dueDate = Carbon::parse($request->issueDate)->addDays($policy->borrow_days); // Default to 15 days
        // Optional: Check if the book copy is already issued
        $isIssued = BookCopy::where('id', $request->book_copy_id)
            ->where('isAvailable', false)
            ->exists();

        if ($isIssued) {
            return response()->json(['error' => 'This book copy is already issued.'], 422);
        }

        // Create the book transaction
        $transaction = BookTransaction::create([
            'user_id' => $request->user_id,
            'book_copy_id' => $request->book_copy_id,
            'issueDate' => $request->issueDate,
            'dueDate' => $dueDate,
        ]);

        // Mark the book copy as unavailable
        BookCopy::where('id', $request->book_copy_id)->update(['isAvailable' => false]);

        return response()->json(['message' => 'Book issued successfully', 'transaction' => $transaction]);
    }

    public function returnTransaction(Request $request)
    {
        // Validate the request data
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'book_copy_id' => 'required|exists:book_copies,id',
            'returnDate' => 'required|date',
            'user_role' => 'required | string',
            'is_Damage' => 'nullable | bool',
            'is_Lost' => 'nullable | bool',
            'remarks' => 'nullable| string',
        ]);

        $transaction = BookTransaction::where('user_id', $request->user_id)
            ->where('book_copy_id', $request->book_copy_id)
            ->orderByDesc('issueDate') // Most recent
            ->whereNull('returnDate') // Only active transactions
            ->first();

        if (!$transaction) {
            return response()->json(['error' => 'No active Transaction found for this book copy and user.'], 422);
        } else {

            $transaction->update([
                'returnDate'  => now(),
                'is_damaged'  => $request->input('is_damaged', 0),
                'is_lost'     => $request->input('is_lost', 0),
                'remarks'     => $request->input('remarks'),
                // 'admin_id'    => auth()->id(),
            ]);

            // Mark the book copy as available
            BookCopy::where('id', $request->book_copy_id)->update(['isAvailable' => true]);
            return response()->json(['message' => 'Book Returned successfully', 'transaction' => $transaction]);
        }
    }
}
