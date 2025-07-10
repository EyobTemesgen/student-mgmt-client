import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Student Mgmt</h3>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link active">
            <i className="bi bi-house-door me-2"></i>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/students" className="nav-link">
            <i className="bi bi-person-plus me-2"></i>
            Students
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/courses" className="nav-link">
            <i className="bi bi-list-task me-2"></i>
            Courses
          </Link>
        </li>
        <li className="nav-item mt-auto">
          <Link to="/settings" className="nav-link">
            <i className="bi bi-gear me-2"></i>
            Settings
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/logout" className="nav-link">
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
