<?php

namespace Database\Factories;

use App\Models\BookCopy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookTransaction>
 */
class BookTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // $status = $this->faker->randomElement(['reserved','borrowed','returned']);
        // $reserveDate = $this->faker->dataTimeBetween('-30 days','now');
        // $returnDate = $status === 'returned' ? $this->faker->dataTimeBetween($reserveDate, 'now'):null;
        // return [
        //     'book_copy_id' => BookCopy::inRandomOrder()->first()->id,
        //     'user_id' => User::inRandomOrder()->first()->id,
        //     'reserveDate' => $reserveDate,
        //     'returnDate' => $returnDate,
        //     'status' => $status,
        //     'late_fee' => $status === 'returned' && $this->faker->boolean(30) ? $this->faker->randomFloat(2,1,50): 0,
        //     'is_damaged' => $this->faker->boolean(10),
        //     'is_lost' => $this->faker->boolean(5),
        //     'remarks' => $this->faker->optional()->sentence(),
        // ];

        $status = $this->faker->randomElement(['reserved', 'borrowed', 'returned']);
        $reserveDate = $this->faker->dateTimeBetween('-30 days', 'now');
        $returnDate = $status === 'returned' ? $this->faker->dateTimeBetween($reserveDate, 'now') : null;

        return [
            'book_copy_id' => BookCopy::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'reserveDate' => $reserveDate,
            'returnDate' => $returnDate,
            'status' => $status,
            'late_fee' => $status === 'returned' && $this->faker->boolean(30) ? $this->faker->randomFloat(2, 1, 50) : 0,
            'is_damaged' => $this->faker->boolean(10),
            'is_lost' => $this->faker->boolean(5),
            'remarks' => $this->faker->optional()->sentence(),
        ];
    }
}
