import React, { useEffect, useState } from 'react';
import API from './axios';

interface Student {
  id: number;
  rollno: string;
  department: string;
}

function StudentList() {
const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    API.get('/students')
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteStudent = (id:number) => {
    API.delete(`/students/${id}`)
      .then(() => setStudents(students.filter((s) => s.id !== id)));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.rollno} - {student.department}
            <button onClick={() => deleteStudent(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;
