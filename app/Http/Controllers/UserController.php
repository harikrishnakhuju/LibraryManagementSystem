<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Fetch users based on the request, e.g.

        return response()->json(
            User::select('id','firstName', 'lastName', 'email', 'role')->get());
    }
}
