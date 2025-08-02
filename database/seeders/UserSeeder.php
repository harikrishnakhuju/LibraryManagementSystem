<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Arr;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            'Computer',
            'Electrical',
            'Civil',
            'Mechanical',
            'Architecture'
        ];

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

        User::factory()->count(10)->create()->each(function ($user) use ($departments,$StaffTypes,$positions) {
            if ($user->role === 'student') {
                Student::create([
                    'user_id' => $user->id,
                    'rollno' => fake()->numberBetween(1, 100),
                    'department' => Arr::random($departments),
                ]);
            } else {
                Staff::create([
                    'user_id' => $user->id,
                    'staff_type' => Arr::random($StaffTypes),
                    'position' => Arr::random($positions),
                    'department' => Arr::random($departments),
                ]);
            }
        });

        User::create([
            'firstName' => 'Suresh',
            'middleName' => null,
            'lastName' => 'Shreshta',
            'email' => 'sureshteacher@library.com',
            'address' => 'Lalitpur, Nepal',
            'phone' => '9800000002',
            'borrowLimit' => 5,
            'role' => 'staff',
            'password' => Hash::make('12345678'),
        ]);

    }
}
