<?php

namespace App\Console\Commands;

use App\Models\BookTransaction;
use App\Models\BorrowPolicy;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;


class CheckOverdueBooks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-overdue-books';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        $feePerDay = 5;




        // Update overdue flag and late fee for overdue books
        $overdueTransactions = BookTransaction::whereNull('returnDate')
            ->where('dueDate', '<', $today)
            ->get();

        foreach ($overdueTransactions as $tx) {
            $user = $tx->user;
            if (!$user) {
            Log::warning("User not found for transaction ID: {$tx->id}");
            continue;
            }
            $role = $user->role;

            $policy = BorrowPolicy::where('role', $role)->first();

        if (!$policy) {
            Log::warning("No borrow policy found for role: {$role}");
            continue;
        }

            $feePerDay = $policy->fine_per_day;

            $daysLate = Carbon::parse($tx->dueDate)->diffInDays($today);
            $tx->isOverdue = true;
            $tx->late_fee = $daysLate * $feePerDay;
            $tx->save();
        }

        //  Reset overdue flag and late fee for non-overdue books
        BookTransaction::whereNull('returnDate')
            ->where('dueDate', '>=', $today)
            ->update([
                'isOverdue' => false,
                'late_fee' => 0,
            ]);

        $this->info("Overdue flags and late fees updated for {$overdueTransactions->count()} transactions.");
    }
}
