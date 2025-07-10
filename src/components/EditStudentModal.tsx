import React from 'react';
import { Student } from '../types/student';
import { Modal, Button } from 'react-bootstrap';
import StudentForm from './StudentForm';

interface EditStudentModalProps {
  show: boolean;
  onHide: () => void;
  student: Student | null;
  onSave: (studentData: Omit<Student, 'id'>) => Promise<void>;
  title?: string;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  show,
  onHide,
  student,
  onSave,
  title = 'Edit Student'
}) => {
  const handleSave = async (studentData: Omit<Student, 'id'>) => {
    try {
      await onSave(studentData);
      onHide();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h4 className="mb-0">{title}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StudentForm
          student={student}
          onSave={handleSave}
          onCancel={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditStudentModal;
