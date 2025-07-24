<?php

namespace Database\Factories;

use App\Models\Publisher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $bookCategory = [
            'Civil Engineering',
            'Computer Engineering',
            'Electrical Engineering',
            'nobel',
        ];

        return [
            'isbn' => fake()->isbn13(),
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'category' => Arr::random($bookCategory),
            'edition' =>fake()->numberBetween(1,15),
            'noOfCopy' => fake() -> numberBetween(1, 15),
            'price' =>fake()->numberBetween(100,1500),
            'publisher_id' => Publisher::inRandomOrder()->first()->id,
        ];
    }
}
