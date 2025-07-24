<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Publisher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookCopy>
 */
class BookCopyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['available','borrowed','lost','damage','replace']);
        return [
            'book_id' => Book::inRandomOrder()->first()->id,
            'publisher_id' => Publisher::inRandomOrder()->first()->id,
            'barcode' => fake()->uuid(),
            'status' => $status,

        ];
    }
}
