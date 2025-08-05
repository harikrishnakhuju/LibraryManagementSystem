<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

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
        BookTransaction::whereNull('return_date')
        ->where('due_date', '<', Carbon::now())
        ->update(['isOverdue' => true]);

    BookTransaction::whereNull('return_date')
        ->where('due_date', '>=', Carbon::now())
        ->update(['isOverdue' => false]);

    $this->info('Overdue flags updated.');

    }
}
