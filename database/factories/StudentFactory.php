<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use App\Models\User;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            'user_id' => User::inRandomOrder()->first()->id,
=======
             'user_id' => User::factory(), 
>>>>>>> Stashed changes
            'rollno' => fake()->numberBetween(1, 100),
            'department' => Arr::random($departments),
        ];
    }
}
