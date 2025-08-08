<?php

namespace App\Http\Controllers;

use App\Models\BookTransaction;
use App\Http\Requests\StoreBookTransactionRequest;
use App\Http\Requests\UpdateBookTransactionRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class BookTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BookTransaction $bookTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookTransaction $bookTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookTransactionRequest $request, BookTransaction $bookTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BookTransaction $bookTransaction)
    {
        //
    }

    public function returnBook($bookId, $userId)
    {
        $borrowTransaction = BookTransaction::where('book_id', $bookId)
            ->where('user_id', $userId)
            ->whereNull('return_date')
            ->latest('created_at') // or borrow_date
            ->first();

        if ($borrowTransaction) {
            $borrowTransaction->return_date = now();
            $borrowTransaction->save();
            return response()->json(['message' => 'Book returned successfully']);
        }

        return response()->json(['error' => 'No active borrow found'], 404);
    }

    public function previewReturn(Request $request)
    {
        try{

            $userId = $request->query('user_id');
            $bookCopyId = $request->query('book_copy_id');
    
            $transaction = BookTransaction::where('user_id', $userId)
                ->where('book_copy_id', $bookCopyId)
                ->whereNull('returnDate') // still active
                ->latest('issueDate')
                ->first();
    
            if(!$transaction) {
                return response()->json(['error' => 'No active transaction found'], 404);
            }
            $dueDate = Carbon::parse($transaction->dueDate);
            $now = Carbon::now();
            $daysLate = (int) $dueDate->diffInDays($now);
    
            return response()->json([
                'dueDate' => $transaction->dueDate,
                'late_fee' => $transaction->late_fee,
                'isOverdue' => $transaction->isOverdue,
                'issueDate' => $transaction->issueDate,
                'daysLate' => $daysLate,
                // 'remarks' => $transaction->remarks,
            ]);
        } catch (\Throwable $e){
            Log::error('PreviewReturn Failed: '. $e -> getMessage());
            return response()->json(['error' => 'Internal Server error'], 500);
        }

    }
}
