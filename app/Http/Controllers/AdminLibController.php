<?php

namespace App\Http\Controllers;

use App\Models\AdminLib;
use App\Http\Requests\StoreAdminLibRequest;
use App\Http\Requests\UpdateAdminLibRequest;
use Illuminate\Validation\Rules;

class AdminLibController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(AdminLib::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminLibRequest $request)
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . AdminLib::class,
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:admin,librarian',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $librarian = AdminLib::create([
            'firstName' => $request->firstName,
            'middleName' => $request->midleName,
            'lastName' => $request->lastName,
            'email' => $request->email,
            'address' => $request->address,
            'phone' => $request->phone,
            'password' => bcrypt($request->password),
            'role' => 'librarian'
        ]);

        return response()->json(["Message" => 'Librarian Created Successfully', 'admin'=>$librarian],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(AdminLib $adminLib)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AdminLib $adminLib)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminLibRequest $request, AdminLib $adminLib)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdminLib $adminLib)
    {
        $adminLib->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
