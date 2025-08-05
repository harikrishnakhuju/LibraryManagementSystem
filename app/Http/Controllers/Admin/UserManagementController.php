<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    // List all users (API)
    public function index()
    {
        return response()->json(User::all());
    }

    // Store a new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:student,staff',
            'borrowLimit' => 'nullable|integer',
            'password' => 'required|string|min:6',
        ]);
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function bulkStore(Request $request)
{
    $users = $request->input('users', []);
    if (!is_array($users)) {
        $users = [$users]; // convert single user object into array
    }
    $created = [];
    foreach ($users as $data) {
        $validated = validator($data, [
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:student,staff',
            'borrowLimit' => 'nullable|integer',
            'password' => 'required|string|min:6',
        ])->validate();
        $validated['password'] = Hash::make($validated['password']);
        $created[] = \App\Models\User::create($validated);
    }
    return response()->json($created, 201);
}
    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:student,staff',
            'borrowLimit' => 'nullable|integer',
            'password' => 'nullable|string|min:6',
        ]);
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        $user->update($validated);
        return response()->json($user, 200);
    }

    // Delete a user
    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}