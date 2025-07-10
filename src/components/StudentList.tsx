import React, { useState } from 'react';
import { Student } from '../types/student';
import EditStudentModal from './EditStudentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onUpdate: (id: number, studentData: Omit<Student, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<boolean>;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onEdit, 
  onUpdate, 
  onDelete 
}) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleSave = async (studentData: Omit<Student, 'id'>) => {
    if (editingStudent?.id) {
      try {
        await onUpdate(editingStudent.id, studentData);
        handleCloseModal();
      } catch (error) {
        // Error is already handled by the parent component
        console.error('Error in handleSave:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleDeleteClick = (student: Student) => {
    setDeletingStudent(student);
    setShowDeleteModal(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (deletingStudent?.id) {
      try {
        setIsDeleting(true);
        const success = await onDelete(deletingStudent.id);
        if (success) {
          setShowDeleteModal(false);
          setDeletingStudent(null);
        }
      } catch (error) {
        console.error('Error in delete confirmation:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingStudent(null);
  };

  if (students.length === 0) {
    return <div className="alert alert-info">No students found.</div>;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        onEdit(student);
                        handleEditClick(student);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(student);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStudent && (
        <EditStudentModal
          show={showEditModal}
          onHide={handleCloseModal}
          student={editingStudent}
          onSave={handleSave}
          title="Edit Student"
        />
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        studentName={deletingStudent?.name || ''}
      />
    </>
  );
};

export default StudentList;
