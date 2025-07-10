import React, { useState, useEffect } from 'react';
import { Student } from '../types/student';

interface StudentFormProps {
  student: Student | null;
  onSave: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: ''
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      phone: ''
    });
    // Only call onCancel if we're not in edit mode
    if (!student) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          type="tel"
          className="form-control"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mt-auto d-flex justify-content-end gap-2">
        <button 
          type="button" 
          className="btn btn-outline-secondary" 
          onClick={handleClear}
          disabled={!formData.name && !formData.email && !formData.phone}
        >
          Clear
        </button>
        <button type="submit" className="btn btn-primary">
          {student ? 'Update' : 'Add'} Student
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
