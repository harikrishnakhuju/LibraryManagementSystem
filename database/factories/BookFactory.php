<?php

namespace Database\Factories;

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
            'edition' =>fake()->numberBetween(1,15),
            'category' => Arr::random($bookCategory),
            'price' =>fake()->numberBetween(100,1500),
        ];
    }
}
