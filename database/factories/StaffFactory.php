<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Staff>
 */
class StaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $StaffTypes = [
            'teacher',
            'teacher',
            'Hod',
            'other',
            'teacher'
        ];

        $positions = [
            'Assistant Lecturer',
            'Teaching Assistant',
            'Full-time Lecturer',
            'Senior Lecturer'
        ];

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
            'staff_type' => Arr::random($StaffTypes),
            'position' => Arr::random($positions),
            'department' => Arr::random($departments),
        ];
    }
}
