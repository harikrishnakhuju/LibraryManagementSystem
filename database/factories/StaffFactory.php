<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

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
            'teacher',
            'librarian',
            'admin',
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
            'staff_type' => Arr::random($StaffTypes),
            'postition' => Arr::random($positions),
            'department' => Arr::random($departments),
        ];
    }
}
