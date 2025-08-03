<?php
namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // Show all books
    public function index()
    {
        return Book::all();
    }

    // Store a new book
    public function store(Request $request)
    {
        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    // Show a single book
    public function show($id)
    {
        return Book::findOrFail($id);
    }

    // Update a book
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book, 200);
    }

    // Delete a book
    public function destroy($id)
    {
        Book::destroy($id);
        return response()->json(null, 204);
    }
}
