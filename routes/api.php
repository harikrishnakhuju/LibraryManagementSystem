<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('students', StudentController::class);
Route::apiResource('staff', StaffController::class);
Route::apiResource('books', BookController::class);
Route::middleware('auth:sanctum')->get('/books', [BookController::class, 'index']);
Route::get('books/${id}',[BookController::class,'show']);
Route::get('/books/search/${query}', [BookController::class, 'search']);

