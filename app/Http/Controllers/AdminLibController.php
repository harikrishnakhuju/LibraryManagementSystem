<?php

namespace App\Http\Controllers;

use App\Models\AdminLib;
use App\Http\Requests\StoreAdminLibRequest;
use App\Http\Requests\UpdateAdminLibRequest;

class AdminLibController extends Controller
{

//     public function login(Request $request)
// {
//     $credentials = $request->only('email', 'password');

//     if (Auth::guard('adminlib')->attempt($credentials)) {
//         return redirect()->intended('/adminlib/dashboard');
//     }

//     return back()->withErrors([
//         'email' => 'Invalid credentials for admin/librarian.',
//     ]);
// }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
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
        //
    }
}
