<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookTransaction extends Model
{
    /** @use HasFactory<\Database\Factories\BookTransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'book_copy_id',
        'user_id',
        'reserveDate',
        'returnDate',
        'status',
        'late_fee',
        'is_damaged',
        'is_lost',
        'remarks',
    ];
    public function bookCopy()
    {
        return $this->belongsTo(bookCopy::class);
    }

    public function user()
    {
        return $this->belongsTo(user::class);
    }
}
