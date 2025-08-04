<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\UserEmailNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function sendNotification(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'message' => 'required|string',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('notifications');
        }

        $users = User::whereIn('id', $validated['user_ids'])->get();
        Notification::send($users, new UserEmailNotification($validated['message'], $filePath));

        return response()->json(['success' => true]);
    }
}