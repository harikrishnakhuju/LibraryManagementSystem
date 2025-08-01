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
        $user = Auth::user();

        // Redirect admin to /admin/dashboard
        if ($user->role === 'admin') {
            return redirect('/admin/dashboard');
        }

        // Other roles go to normal dashboard
        return Inertia::render('dashboard');
    })->name('dashboard');

});

// web.php
// Route::middleware(['auth'])->prefix('admin')->group(function () {
//     Route::resource('books', BookController::class);
// });


// All authenticated users
// Route::get('/books', [BookController::class, 'index']);

Route::get('/books', function () {
    return Inertia::render('User/Books/book');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin-auth.php';
