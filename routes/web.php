<?php


use App\Http\Controllers\AdminLibController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserStatsController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



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
    Route::get('/catalog',function(){
        return Inertia::render('User/Catalogs/catalog');
    });
    Route::get('/catalog/overdue-borrowers', function () {
        return Inertia::render('User/Catalogs/overdueborrower');
    });

    Route::get('/catalog/borrowed-books', function () {
        return Inertia::render('User/Catalogs/borrowedbook');
    });
    
    Route::get('/user/dashboard-stats', [UserStatsController::class, 'index']);

});



// Route::get('/preview-transaction',[UserStatsController::class, 'show']);


require __DIR__ . '/settings.php';
require __DIR__ . '/admin-settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin-auth.php';
