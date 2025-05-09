import React from "react";
import { Link } from "react-router-dom";
import {
  FaSun,
  FaStar,
  FaTasks,
  FaListAlt,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FaUserCircle className="profile-icon" size={30} />
        <span className="user-name">Usuario</span>
      </div>

      <ul className="sidebar-nav">
        <li>
          <Link to="/my-day">
            <FaSun className="nav-icon" />
            Mi Día
          </Link>
        </li>
        <li>
          <Link to="/important">
            <FaStar className="nav-icon" />
            Importante
          </Link>
        </li>
        <li>
          <Link to="/all-tasks">
            <FaTasks className="nav-icon" />
            Tareas
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
