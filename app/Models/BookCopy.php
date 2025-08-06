<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookCopy extends Model
{
    /** @use HasFactory<\Database\Factories\BookCopyFactory> */
    use HasFactory;

    protected $fillable = [
        'book_id',
        'barcode',
        'publisher_id',
        'isAvailable',
    ];

    public function book()
    {
        return $this -> belongsTo(Book::class);
    }

    public function transaction()
    {
        return $this-> hasMany(BookTransaction::class);
    }
}
