<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    protected $fillable = [
        'isbn',
        'title',
        'author',
        'edition',
        'price',
        'published_year',
    ];

    public function publisherDetails()
    {
        return $this -> belongsTo(Publisher::class);
    }

    public function bookCopies()
    {
        return $this -> hasMany(BookCopy::class);
    }
}
