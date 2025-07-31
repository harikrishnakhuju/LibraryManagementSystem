<?php

use App\Http\Controllers\admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\admin\Auth\ConfirmablePasswordController;
use App\Http\Controllers\admin\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\admin\Auth\EmailVerificationPromptController;
use App\Http\Controllers\admin\Auth\NewPasswordController;
use App\Http\Controllers\admin\Auth\PasswordResetLinkController;
use App\Http\Controllers\admin\Auth\RegisteredUserController;
use App\Http\Controllers\admin\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AdminLibController;

Route::prefix('admin')->middleware('guest:admin')->group(function () {
    // Route::get('register', [RegisteredUserController::class, 'create'])->name('admin.register');
    // Route::post('register', [RegisteredUserController::class, 'store']);
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

    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

    Route::get('users', [UserManagementController::class, 'index'])->name('admin.user.index');
    Route::post('users', [UserManagementController::class, 'store'])->name('admin.user.store');
    Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('admin.user.destroy');

    Route::get('adminUsers', [AdminLibController::class, 'index'])->name('admin.librarians.index');
    Route::post('adminUsers', [AdminLibController::class, 'store'])->name('admin.librarians.store');
    Route::delete('adminUsers/{librarian}', [AdminLibController::class, 'destroy'])->name('admin.librarians.destroy');



});
