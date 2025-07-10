import React, { useState, useEffect } from 'react';
import { 
  getStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  searchStudents,
} from './services/StudentService';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Sidebar from './components/Sidebar';
import { Student } from './types/student';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert(`Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }
    try {
      setLoading(true);
      const data = await searchStudents(searchTerm);
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching students:', error);
      toast.error('Failed to search students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (studentData: Omit<Student, 'id'>) => {
    try {
      if (editingStudent?.id) {
        await updateStudent(editingStudent.id, studentData);
        toast.success('Student updated successfully');
      } else {
        await createStudent(studentData);
        toast.success('Student created successfully');
      }
      setEditingStudent(null);
      await fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(`Failed to save student: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw to prevent the form from resetting on error
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      // Use the functional update form to ensure we have the latest state
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
      toast.success('Student deleted successfully!');
      return true; // Indicate success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete student';
      console.error('Error deleting student:', error);
      toast.error(errorMessage);
      return false; // Indicate failure
    }
  };

  const handleEdit = (student: Student): void => {
    setEditingStudent(student);
  };

  const handleUpdate = async (id: number, studentData: Omit<Student, 'id'>): Promise<void> => {
    try {
      await updateStudent(id, studentData);
      toast.success('Student updated successfully');
      await fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error(`Failed to update student: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="app-header">
          <h1 className="h4 mb-0">School Management System</h1>
          <form onSubmit={handleSearch} className="d-flex" style={{ maxWidth: '400px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="bi bi-search"></i>
              </button>
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    fetchStudents();
                  }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </form>
        </header>

        <div className="p-4">
          <div className="row g-4">
            {/* Form Column */}
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h5>
                  {editingStudent && (
                    <button 
                      className="btn btn-sm btn-outline-secondary" 
                      onClick={() => setEditingStudent(null)}
                    >
                      <i className="bi bi-plus-lg"></i> New
                    </button>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <StudentForm
                    student={editingStudent}
                    onSave={handleSave}
                    onCancel={() => setEditingStudent(null)}
                  />
                </div>
              </div>
            </div>

            {/* List Column */}
            <div className="col-lg-8">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Students List</h5>
                  <span className="badge bg-primary">{students.length} students</span>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 mb-0">Loading students...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <StudentList
                        students={students}
                        onEdit={handleEdit}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default App;
