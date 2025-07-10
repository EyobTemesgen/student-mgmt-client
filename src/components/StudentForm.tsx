import React, { useState, useEffect } from 'react';
import { Student } from '../types/student';

interface StudentFormProps {
  student: Student | null;
  onSave: (student: Omit<Student, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (err) {
      // Error is already handled by the parent component
      // We just need to prevent the form from resetting
      console.error('Error in form submission:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
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
      
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
      <div className="mt-auto d-flex justify-content-end gap-2">
        <button 
          type="button" 
          className="btn btn-outline-secondary" 
          onClick={handleClear}
          disabled={!formData.name && !formData.email && !formData.phone}
        >
          Clear
        </button>
        <div style={{ width: '100px' }}>
          <button 
            type="submit" 
            className="btn btn-primary w-100 position-relative"
            disabled={isSubmitting}
            style={{ minHeight: '38px' }}
          >
            <span 
              style={{
                visibility: isSubmitting ? 'hidden' : 'visible',
                display: 'inline-block',
                width: '100%'
              }}
            >
              {student ? 'Update' : 'Save'}
            </span>
            {isSubmitting && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <span 
                  className="spinner-border spinner-border-sm" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
