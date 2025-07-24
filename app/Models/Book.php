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
        'category',
        'edition',
        'noOfCopy',
        'price',
<<<<<<< Updated upstream
        'publisher_id',
=======
        'published_year'
>>>>>>> Stashed changes
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
