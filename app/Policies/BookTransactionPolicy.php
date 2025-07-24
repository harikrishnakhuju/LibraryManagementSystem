<?php

namespace App\Policies;

use App\Models\AdminLib;
use App\Models\BookTransaction;
use Illuminate\Auth\Access\Response;

class BookTransactionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(AdminLib $adminLib): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(AdminLib $adminLib, BookTransaction $bookTransaction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(AdminLib $adminLib): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(AdminLib $adminLib, BookTransaction $bookTransaction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(AdminLib $adminLib, BookTransaction $bookTransaction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(AdminLib $adminLib, BookTransaction $bookTransaction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(AdminLib $adminLib, BookTransaction $bookTransaction): bool
    {
        return false;
    }
}
