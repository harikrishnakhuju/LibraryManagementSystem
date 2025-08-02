<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;
    /** @use HasFactory<\Database\Factories\BookFactory> */

    protected $fillable = [
        'isbn',
        'title',
        'author',
        'category',
        'edition',
        'noOfCopy',
        'price',
        'publisher_id',
        'published_year'
    ];

    public function publisher()
    {
        return $this -> belongsTo(Publisher::class);
    }

    public function bookCopies()
    {
        return $this -> hasMany(BookCopy::class);
    }
}
