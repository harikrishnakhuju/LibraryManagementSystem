<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AdminLibController;
use App\Http\Controllers\StudentController;

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

// Admin only route, protected by inline role check
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', function () {
        if (Auth::user()->role !== 'admin') {
              return Inertia::render('dashboard');
        }
        return Inertia::render('AdminDashboard');
    })->name('admindashboard');
});

// All authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [BookController::class, 'index']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';