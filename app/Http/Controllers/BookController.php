<?php
namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // Show all books (API)
    public function index()
    {
        return response()->json(Book::all());
    }

    // Store a new book
    public function store(Request $request)
    {
        $validated = $request->validate([
            'isbn' => 'required|string|unique:books,isbn',
            'title' => 'required|string',
            'author' => 'required|string',
            'category' => 'nullable|string',
            'edition' => 'required|integer',
            'noOfCopy' => 'nullable|integer',
            'price' => 'required|numeric',
            'publisher_id' => 'nullable|exists:publishers,id',
            'published_year' => 'nullable|string',
        ]);
        $book = Book::create($validated);
        return response()->json($book, 201);
    }

    // Bulk store books (for CSV)
    public function bulkStore(Request $request)
    {
        $books = $request->input('books', []);
        $created = [];
        foreach ($books as $data) {
            $validated = validator($data, [
                'isbn' => 'required|string|unique:books,isbn',
                'title' => 'required|string',
                'author' => 'required|string',
                'category' => 'nullable|string',
                'edition' => 'required|integer',
                'noOfCopy' => 'nullable|integer',
                'price' => 'required|numeric',
                'publisher_id' => 'nullable|exists:publishers,id',
                'published_year' => 'nullable|string',
            ])->validate();
            $created[] = Book::create($validated);
        }
        return response()->json($created, 201);
    }

    // Show a single book
    public function show($id)
    {
        return response()->json(Book::findOrFail($id));
    }

    // Update a book
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $validated = $request->validate([
            'isbn' => 'required|string|unique:books,isbn,' . $id,
            'title' => 'required|string',
            'author' => 'required|string',
            'category' => 'nullable|string',
            'edition' => 'required|integer',
            'noOfCopy' => 'nullable|integer',
            'price' => 'required|numeric',
            'publisher_id' => 'nullable|exists:publishers,id',
            'published_year' => 'nullable|string',
        ]);
        $book->update($validated);
        return response()->json($book, 200);
    }

    // Delete a book
    public function destroy($id)
    {
        Book::destroy($id);
        return response()->json(null, 204);
    }
}
