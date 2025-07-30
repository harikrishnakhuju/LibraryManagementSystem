<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\AdminLib;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('admin/auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.AdminLib::class,
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:admin,librarian',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $admin = AdminLib::create([
            'firstName' => $request->firstName,
            'middleName' => $request -> midleName,
            'lastName' => $request -> lastName,
            'email' => $request->email,
            'address' => $request->address,
            'phone' => $request->phone,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($admin));

        Auth::guard('admin')->login($admin);

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }
}
