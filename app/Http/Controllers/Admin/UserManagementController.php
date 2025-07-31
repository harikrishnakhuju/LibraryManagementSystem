<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\Rules;

class UserManagementController extends Controller
{
    public function index()
    {
        // $users = User::all();
        // return Inertia::render('admin/users/index',['users' => $users]);
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:student,staff',
            'borrowLimit' => 'nullable|integer',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            $validate,
            'password' => bcrypt($validate['password']),
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        // return redirect()->back()->with('success', 'User deleted successfully');
        return response()->json(['message' => 'User deleted successfully']);


    }
}
