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
        $borrowedBooks = BookTransaction::where('status', 'borrowed')->count();
        $returnedBooks = BookTransaction::where('status', 'returned')->count();
        $overdueBooks = BookTransaction::where('status', 'reserved')->count();

        $monthly = BookTransaction::selectRaw('MONTH(created_at) as month, COUNT(*) as borrowed')
            ->whereYear('created_at', now()->year)
            ->where('status', 'borrowed')
            ->groupBy('month')
            ->pluck('borrowed', 'month');


        $returned = BookTransaction::selectRaw('MONTH(created_at) as month, COUNT(*) as returned')
            ->whereYear('created_at', now()->year)
            ->where('status', 'returned')
            ->groupBy('month')
            ->pluck('returned', 'month');

        $labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
