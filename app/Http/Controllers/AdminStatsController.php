<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use App\Models\BookTransaction;
use App\Models\User;
use Illuminate\Http\Request;

class AdminStatsController extends Controller
{
    public function index()
    {
        // Fetch statistics from the database or any other source
        $totalUsers = User::count();
        $totalBooks = BookCopy::count();
        // Total borrowed books (currently borrowed)
        $borrowedBooks = BookTransaction::whereNull('returnDate')->whereNotNull('issueDate')->count();

        // Total returned books
        $returnedBooks = BookTransaction::whereNotNull('returnDate')->count();

        // Total overdue books
        $overdueBooks = BookTransaction::where('isOverdue', true)->count();
        // $borrowedBooks = BookTransaction::where('transactionType', 'borrow')->count();
        // $returnedBooks = BookTransaction::where('transactionType', 'return')->count();
        // $overdueBooks = BookTransaction::where('transactionType', 'overdue')->count();

        $monthly = BookTransaction::selectRaw('MONTH(issueDate) as month, COUNT(*) as borrowed')
            ->whereYear('issueDate', now()->year)
            ->groupBy('month')
            ->pluck('borrowed', 'month');


        $returned = BookTransaction::selectRaw('MONTH(returnDate) as month, COUNT(*) as returned')
            ->whereYear('returnDate', now()->year)
            ->groupBy('month')
            ->pluck('returned', 'month');

        $labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $borrowedArr = [];
        $returnedArr = [];
        for ($i = 1; $i <= 12; $i++) {
            $borrowedArr[] = $monthly[$i] ?? 0;
            $returnedArr[] = $returned[$i] ?? 0;
        }
        return response()->json([
            'totalUsers' => $totalUsers,
            'totalBooks' => $totalBooks,
            'borrowedBooks' => $borrowedBooks,
            'returnedBooks' => $returnedBooks,
            'overdueBooks' => $overdueBooks,
            'monthlyActivity' => [
                'labels' => $labels,
                'borrowed' => $borrowedArr,
                'returned' => $returnedArr,
            ],
            // Add other statistics as needed
        ]);
    }
}
