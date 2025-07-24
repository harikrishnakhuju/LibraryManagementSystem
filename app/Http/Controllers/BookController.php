<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Book::all(), 200);
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
    public function store(StoreBookRequest $request)
    {
        $validate = $request->validate([
            'isbn' => 'required | unique:books',
            'title' => 'required| string | max:255',
            'author' => 'required | string',
            'category' => 'required | string',
            'edition' => 'required | integer',
            'price' => 'required | float',
        ]);

        $book = Book::create($validate);
        return response()->json($book, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $book = Book::find($id);
        return $book ? response()->json($book) : response()->json(['message' => 'Book not Found'], 404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $id)
    {
        $book = Book::find($id);
        if(!$book)
        {
            return response()->json(['message' => 'Book not found'], 404);
        }

        $validate = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string',
            'edition' => 'sometimes|required|integer',
            'price' => 'sometimes|required|float',
        ]);

        $book->update($validate);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $book = Book::find($id);
        if(!$book)
        {
            return response()->json(['message' => 'Book not found'], 404);
        }

        $book ->delete();
        return response()->json(['message' => 'Book deleted']);
    }
}
