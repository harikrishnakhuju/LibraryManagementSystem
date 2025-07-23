<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publisher extends Model
{
    /** @use HasFactory<\Database\Factories\PublisherFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'published_year',
        'publisherContact',
        'publisherAddress',
    ];

    public function bookpublisher()
    {
        return $this->hasMany(Book::class);
    }
}
