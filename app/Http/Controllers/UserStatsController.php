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
        $borrowedBooks = [];
        $returnedBooks = [];
        $reservedBooks = [];

        foreach ($transactions as $tx) {
            $book = $tx->bookCopy->book ?? null;
            $bookInfo = [
                'transaction_id' => $tx->id,
                'book_title' => $book->title ?? 'Unknown',
                'barcode' => $tx->bookCopy->barcode ?? 'Unknown',
                'status' => $tx->status,
                'created_at' => $tx->created_at ? $tx->created_at->format('Y-m-d') : null,
                'returnDate' => $tx->returnDate,
                'reserveDate' => $tx->reserveDate,
            ];
            if ($tx->status === 'borrowed') {
                $borrowedBooks[] = $bookInfo;
            } elseif ($tx->status === 'returned') {
                $returnedBooks[] = $bookInfo;
            } elseif ($tx->status === 'reserved') {
                $reservedBooks[] = $bookInfo;
            }
        }

        // Monthly activity (borrowed and returned counts per month)
        $labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $borrowed = array_fill(0, 12, 0);
        $returned = array_fill(0, 12, 0);

        $borrowedMonthly = BookTransaction::selectRaw('MONTH(reserveDate) as month, COUNT(*) as count')
            ->where('user_id', $userId)
            ->whereYear('reserveDate', now()->year)
            ->where('status', 'borrowed')
            ->groupBy('month')
            ->pluck('count', 'month');

        $returnedMonthly = BookTransaction::selectRaw('MONTH(returnDate) as month, COUNT(*) as count')
            ->where('user_id', $userId)
            ->whereYear('returnDate', now()->year)
            ->where('status', 'returned')
            ->groupBy('month')
            ->pluck('count', 'month');

        // Get overdue books
        $overdueBooks = BookTransaction::where('user_id', $userId)
            ->where('status', 'borrowed')
            ->where('returnDate', '<', now())
            ->with(['bookCopy.book'])
            ->get();

        for ($i = 1; $i <= 12; $i++) {
            $borrowed[$i - 1] = $borrowedMonthly[$i] ?? 0;
            $returned[$i - 1] = $returnedMonthly[$i] ?? 0;
        }

        $borrowedBooksList = [];
        foreach ($transactions as $tx) {
            if ($tx->status === 'borrowed') {
                $book = $tx->bookCopy->book ?? null;
                $borrowedBooksList[] = [
                    'id' => $tx->id,
                    'title' => $book->title ?? 'Unknown',
                    'dueDate' => $tx->reserveDate, // or another due date field
                ];
            }
        }


        return response()->json([
            'borrowedBooksCount' => count($borrowedBooks),
            'returnedBooksCount' => count($returnedBooks),
            // 'reservedBooksCount' => count($reservedBooks),
            'overdueBooksCount' => count($overdueBooks),
            'borrowedBooksList' => $borrowedBooksList,
            'returnedBooksList' => $returnedBooks,
            'overdueBooksList' => $overdueBooks,
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
