<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use Illuminate\Http\Request;

class BookCopyController extends Controller
{
    public function index()
    {
        // Include related book data
        return BookCopy::with('book')->get(['id', 'barcode', 'book_id', 'isAvailable']);
    }

    // Optional: show a single book copy
    public function show($id)
    {
        return BookCopy::with('book')->findOrFail($id);
    }
}
