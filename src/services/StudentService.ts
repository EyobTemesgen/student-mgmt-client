import { showErrorToast } from '../components/Toast';
import { Student } from '../types/student';

const API_BASE_URL = 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/students`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
  }
  // For 204 No Content responses, return null
  if (response.status === 204) {
    return null;
  }
  // Only try to parse JSON if there's content
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const getStudents = async (): Promise<Student[]> => {
  console.log('Fetching students from:', API_URL);
  const response = await fetch(API_URL);
  const data = await handleResponse(response);
  console.log('Students data:', data);
  return data;
};

export const getStudentById = async (id: number): Promise<Student> => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const createStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  console.log('Creating student:', student);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });
  const data = await handleResponse(response);
  console.log('Created student:', data);
  return data;
};

export const updateStudent = async (id: number, student: Partial<Student>): Promise<Student> => {
  console.log(`Updating student ${id}:`, student);
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });
  const data = await handleResponse(response);
  console.log('Updated student:', data);
  return data;
};

export const deleteStudent = async (id: number): Promise<boolean> => {
  try {
    console.log(`Deleting student ${id}`);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // For DELETE, we don't expect a response body
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `Failed to delete student with ID ${id}`);
    }
    
    console.log(`Student ${id} deleted successfully`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : `Failed to delete student with ID ${id}`;
    console.error(`Error in deleteStudent(${id}):`, error);
    throw new Error(errorMessage);
  }
};

export const searchStudents = async (name: string): Promise<Student[]> => {
  try {
    const url = `${API_URL}/search?name=${encodeURIComponent(name)}`;
    console.log('Searching students with query:', url);
    const response = await fetch(url);
    const data = await handleResponse(response);
    console.log('Search results:', data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search students';
    console.error('Error in searchStudents:', error);
    showErrorToast(errorMessage);
    throw error;
  }
};
