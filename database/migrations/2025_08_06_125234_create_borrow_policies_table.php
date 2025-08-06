<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrow_policies', function (Blueprint $table) {
            $table->id();
            $table->string('role'); // e.g., student, staff
            $table->integer('borrow_days'); // number of days a book can be borrowed
            $table->integer('borrow_limit'); // maximum number of books that can be borrowed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrow_policies');
    }
};
