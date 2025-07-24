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
        Schema::create('book_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_copy_id')->constrained('book_copies')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('reserveDate')->nullable();
            $table->date('returnDate')->nullable();
            $table->enum('status', ['reserved', 'borrowed', 'returned', 'cancelled'])->default('reserved');
            $table->decimal('late_fee', 8, 2)->default(0);
            $table->boolean('is_damaged')->default(false);
            $table->boolean('is_lost')->default(false);
            $table->text('remarks')->nullable(); // Optional notes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_transactions');
    }
};
