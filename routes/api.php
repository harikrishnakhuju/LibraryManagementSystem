<?php

use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/users', [UserController::class, 'index']);
Route::apiResource('students', StudentController::class);
Route::apiResource('staff', StaffController::class);
// Route::apiResource('books', BookController::class);
Route::apiResource('book-copies',BookCopyController::class);
Route::get('/books', [BookController::class, 'index']);
Route::get('books/${id}',[BookController::class,'show']);
Route::get('/books/search/${query}', [BookController::class, 'search']);

