<?php

use App\Http\Controllers\admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\admin\Auth\ConfirmablePasswordController;
use App\Http\Controllers\admin\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\admin\Auth\EmailVerificationPromptController;
use App\Http\Controllers\admin\Auth\NewPasswordController;
use App\Http\Controllers\admin\Auth\PasswordResetLinkController;
use App\Http\Controllers\admin\Auth\RegisteredUserController;
use App\Http\Controllers\admin\Auth\VerifyEmailController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AdminLibController;
use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\BookController;
use App\Models\Book;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::prefix('admin')->middleware('guest:admin')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('admin.password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('admin.password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('admin.password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('admin.password.store');
});

Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)->name('admin.verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['signed', 'throttle:6,1'])->name('admin.verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware('throttle:6,1')->name('admin.verification.send');
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('admin.password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::get('dashboard', fn() => Inertia::render('admin/dashboard'))->name('admin.dashboard');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

    // User Management (for both page and API)
    Route::get('users', [UserManagementController::class, 'index'])->name('admin.user.index');
    Route::post('users/bulk', [UserManagementController::class, 'bulkStore'])->name('admin.user.bulkStore');
    Route::put('users/{id}', [UserManagementController::class, 'update'])->name('admin.user.update');
    Route::delete('users/{id}', [UserManagementController::class, 'destroy'])->name('admin.user.destroy');
    Route::get('users/list', [UserManagementController::class, 'index']); // API for React

    //Event Management
     Route::get('events', function () {
        $events = Event::all();
        return Inertia::render('admin/Event/event', ['events' => $events]);
    });
    Route::post('events/notify', [EventController::class, 'sendNotification'])->name('admin.event.notify');
    // Librarian Management
    Route::get('adminUsers', [AdminLibController::class, 'index'])->name('admin.librarians.index');
    Route::post('adminUsers', [AdminLibController::class, 'store'])->name('admin.librarians.store');
    Route::delete('adminUsers/{librarian}', [AdminLibController::class, 'destroy'])->name('admin.librarians.destroy');

    // Book Management
    Route::get('users', function () {
        $users = User::all();
        return Inertia::render('admin/Users/user', ['users' => $users]);
    });
    Route::get('books', function () {
        $books = Book::all();
        return Inertia::render('admin/Books/book', ['books' => $books]);
    });
    Route::get('books/list', [BookController::class, 'index']);
    Route::post('books/bulk', [BookController::class, 'bulkStore']);
    Route::resource('books', BookController::class)->except(['index', 'create', 'edit', 'show']);
    Route::get('/dashboard-stats', [AdminStatsController::class, 'index']);
});
