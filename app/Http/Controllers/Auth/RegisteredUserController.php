<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    
       public function store(Request $request)
{
    $validated = $request->validate([
        'firstName' => 'required|string|max:255',
        'middleName' => 'nullable|string|max:255',
        'lastName' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'address' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'role' => 'required|in:student,staff',
        'borrowLimit' => 'nullable|integer',
        'password' => 'required|string|confirmed|min:8',
    ]);

    $user = User::create([
        'firstName' => $validated['firstName'],
        'middleName' => $validated['middleName'],
        'lastName' => $validated['lastName'],
        'email' => $validated['email'],
        'address' => $validated['address'],
        'phone' => $validated['phone'],
        'role' => $validated['role'],
        'borrowLimit' => $validated['borrowLimit'],
        'password' => Hash::make($validated['password']),
    ]);


        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
