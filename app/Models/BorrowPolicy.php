<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BorrowPolicy extends Model
{
    protected $fillable = ['role', 'borrow_days', 'borrow_limit'];
    public const ROLE_STUDENT = 'student';
    public const ROLE_STAFF = 'staff';

}