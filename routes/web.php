<?php


use Inertia\Inertia;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AdminLibController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/books', function () {
        return Inertia::render('User/Books/book');
    });
    Route::get('/catalog/overdue-borrowers', function () {
        return Inertia::render('User/Catalogs/overdueborrower');
    });

    Route::get('/catalog/borrowed-books', function () {
        return Inertia::render('User/Catalogs/borrowedbook');
    });
});

// web.php
// Route::middleware(['auth'])->prefix('admin')->group(function () {
//     Route::resource('books', BookController::class);
// });


// All authenticated users
// Route::get('/books', [BookController::class, 'index']);


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin-auth.php';
