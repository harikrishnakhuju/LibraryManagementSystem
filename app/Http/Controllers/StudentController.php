<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index() {
    return Student::all();
}

public function store(Request $request) {
    return Student::create($request->all());
}

public function show($id) {
    return Student::findOrFail($id);
}

public function update(Request $request, $id) {
    $student = Student::findOrFail($id);
    $student->update($request->all());
    return $student;
}

public function destroy($id) {
    return Student::destroy($id);
}

}
