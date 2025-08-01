<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\BookCopy;


class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::factory()->count(10)->create()->each(
            function ($book) {
                for ($i = 0; $i < $book->noOfCopy; $i++) {
                    BookCopy::create([
                        'book_id' => $book->id,
                        'publisher_id' => $book->publisher_id,
                        'status' => 'available',
                        'barcode' => fake()->uuid,
                    ]);
                }
            }
        );
    }
}
