<?php

namespace App\Http\Controllers;

use App\Models\BookTransaction;
use App\Http\Requests\StoreBookTransactionRequest;
use App\Http\Requests\UpdateBookTransactionRequest;

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
}
