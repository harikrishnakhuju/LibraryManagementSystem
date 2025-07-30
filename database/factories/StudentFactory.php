<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = [
            'Computer',
            'Electrical',
            'Civil',
            'Mechanical',
            'Architecture'
        ];

        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'rollno' => fake()->numberBetween(1, 100),
            'department' => Arr::random($departments),
        ];
    }
}
