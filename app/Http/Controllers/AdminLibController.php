<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AdminLibController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard'); // Check this path!
    }
}
