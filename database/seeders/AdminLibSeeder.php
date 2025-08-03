<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdminLib;
use Illuminate\Support\Facades\Hash;

class AdminLibSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminLib::create([
            'firstName' => 'Hari12',
            'middleName' => 'Krishna',
            'lastName' => 'Khuju',
            'email' => 'admin@library.com',
            'address' => 'Kathmandu, Nepal',
            'phone' => '9800000001',
            'role' => 'Admin',
            'password' => Hash::make('12345678'),
        ]);

        AdminLib::create([
            'firstName' => 'Suresh',
            'middleName' => null,
            'lastName' => 'Shreshta',
            'email' => 'librarian@library.com',
            'address' => 'Lalitpur, Nepal',
            'phone' => '9800000002',
            'role' => 'Librarian',
            'password' => Hash::make('12345678'),
        ]);

    }
}
