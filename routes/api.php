<?php

use App\Http\Controllers\BookController;
use Illuminate\Routing\Route;

Route::apiResources('books', BookController::class);
