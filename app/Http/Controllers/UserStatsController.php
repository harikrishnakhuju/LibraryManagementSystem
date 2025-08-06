<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookTransaction;
use App\Models\Book;

class UserStatsController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Get all transactions for this user, eager loading bookCopy and book
        $transactions = BookTransaction::with(['bookCopy.book'])
            ->where('user_id', $userId)
            ->get();
            
            
        // Group by status
            $borrowedBooksList = [];
            $returnedBooksList = [];
            $overdueBooksList = [];

        foreach ($transactions as $tx) {
            $book = $tx->bookCopy->book ?? null;
            $bookInfo = [
                'transaction_id' => $tx->id,
                'book_title' => $book->title ?? 'Unknown',
                'barcode' => $tx->bookCopy->barcode ?? 'Unknown',
                'status' => null,
                'isOverdue' => $tx->isOverdue,
                'issueDate' => $tx->issueDate,
                'returnDate' => $tx->returnDate,
                'dueDate' => $tx->dueDate,
            ];
            if ($tx->issueDate && !$tx->returnDate) {
                $bookinfo['status'] = 'borrowed';
                $borrowedBooksList[] = $bookInfo;
            } elseif ($tx->returnDate) {
                $bookInfo['status'] = $tx->isOverdue ? 'returned (overdue)' : 'returned';
                $returnedBooksList[] = $bookInfo;
            }
        }

        // Monthly activity (borrowed and returned counts per month)
        $labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $borrowed = array_fill(0, 12, 0);
        $returned = array_fill(0, 12, 0);

        $borrowedMonthly = BookTransaction::selectRaw('MONTH(issueDate) as month, COUNT(*) as count')
            ->where('user_id', $userId)
            ->whereYear('issueDate', now()->year)
            ->whereNotNull('issueDate')
            ->whereNull('returnDate')
            ->groupBy('month')
            ->pluck('count', 'month');

        $returnedMonthly = BookTransaction::selectRaw('MONTH(returnDate) as month, COUNT(*) as count')
            ->where('user_id', $userId)
            ->whereYear('returnDate', now()->year)
            ->whereNotNull('issueDate')
            ->whereNotNull('returnDate')
            ->groupBy('month')
            ->pluck('count', 'month');

        // Get overdue books
        $overdueBooks = BookTransaction::where('user_id', $userId)
            ->where('isOverdue',true)
            ->where('returnDate', '<', now())
            ->with(['bookCopy.book'])
            ->get();

        for ($i = 1; $i <= 12; $i++) {
            $borrowed[$i - 1] = $borrowedMonthly[$i] ?? 0;
            $returned[$i - 1] = $returnedMonthly[$i] ?? 0;
        }

        foreach ($transactions as $tx) {
            if ($tx->status === 'borrowed') {
                $book = $tx->bookCopy->book ?? null;
                $borrowedBooksList[] = [
                    'id' => $tx->id,
                    'book_title' => $book->title ?? 'Unknown',
                    'dueDate' => $tx->dueDate, // or another due date field
                ];
            }
        }


        return response()->json([
            'borrowedBooksCount' => count($borrowedBooksList),
            'returnedBooksCount' => count($returnedBooksList),
            // 'reservedBooksCount' => count($reservedBooks),
            'overdueBooksCount' => count($overdueBooks),
            'borrowedBooksList' => $borrowedBooksList,
            'returnedBooksList' => $returnedBooksList,
            'overdueBooksList' => $overdueBooksList,
            // 'reservedBooksList' => $reservedBooks,
            'monthlyActivity' => [
                'labels' => $labels,
                'borrowed' => $borrowed,
                'returned' => $returned,
            ],
        ]);

        // return response()->json([
        //     'userheid' => $userId,
        //     'transactions' => $transactions,
        // 'bookcopyid' => $book_copy_id,
        // 'borrowedBooks' => $borrowedBooks,
        // 'returnedBooks' => $returnedBooks,
        // 'overdueBooks' => $overdueBooks,
        // 'borrowedBooksList' => $borrowedBooksList,
        // 'returnedBooksList' => $returnedBooksList,
        // 'overdueBooksList' => $overdueBooksList,
        // ]);
    }
}
