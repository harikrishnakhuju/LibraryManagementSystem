<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AdminLibController;

// Public Home
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Authenticated User Routes
Route::middleware(['auth', 'verified'])->group(function () {

    // User Dashboard
    Route::get('/dashboard', function () {
        $user = Auth::user();
        return $user->role === 'admin'
            ? redirect('/admin/dashboard')
            : Inertia::render('dashboard');
    })->name('dashboard');

    // User: View books page (React component)
    Route::get('/books', function () {
        return Inertia::render('User/Books/Index');
    })->name('user.books');

    // API route for fetching books (optional, if not using Laravel API routes file)
    Route::get('/home', [BookController::class, 'index']); // consider renaming this to /api/books if API only
});

// Admin Routes
Route::middleware(['auth'])->prefix('admin')->group(function () {

    // Admin dashboard with role check
    Route::get('/dashboard', function () {
        return Auth::user()->role !== 'admin'
            ? Inertia::render('dashboard')
            : Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // Admin Books CRUD
    Route::resource('books', BookController::class);
});

// Additional route files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin-auth.php';
