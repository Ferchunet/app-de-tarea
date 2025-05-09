import React from "react";
import {
  FaRegCircle,
  FaCheckCircle,
  FaStar,
  FaRegStar,
  FaTrashAlt,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";

import "../styles/styles.css";

const formatDate = (dateString) => {
  if (!dateString) return null;

  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      console.error("Fecha inválida recibida:", dateString);
      return dateString;
    }

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", options);
  } catch (error) {
    console.error("Error formateando fecha:", dateString, error);
    return dateString;
  }
};

function TaskItem({
  task,
  onToggleCompleted,
  onToggleImportant,
  onDeleteTask,
  onEditTask,
}) {
  if (!task) return null;

  const handleToggleCompleted = () => {
    onToggleCompleted(task.id, !task.completed);
  };

  const handleToggleImportant = () => {
    onToggleImportant(task.id, !task.isImportant);
  };

  const handleDelete = () => {
    if (
      window.confirm(`¿Estás seguro de que quieres eliminar "${task.title}"?`)
    ) {
      onDeleteTask(task.id);
    }
  };

  const handleEdit = () => {
    onEditTask(task);
  };

  const formattedDueDate = formatDate(task.dueDate);

  return (
    <li
      className={`task-item ${task.completed ? "completed" : ""} ${
        task.isImportant ? "important" : ""
      }`}
    >
                 {" "}
      <div className="task-item-content">
                       {" "}
        <div className="task-icons-left">
                             {" "}
          <button
            onClick={handleToggleCompleted}
            className="icon-button"
            title={
              task.completed
                ? "Marcar como pendiente"
                : "Marcar como completada"
            }
          >
                                   {" "}
            {task.completed ? <FaCheckCircle /> : <FaRegCircle />}             
                 {" "}
          </button>
                             {" "}
          <button
            onClick={handleToggleImportant}
            className="icon-button important-button"
            title={
              task.isImportant
                ? "Quitar de importante"
                : "Marcar como importante"
            }
          >
                                   {" "}
            {task.isImportant ? <FaStar /> : <FaRegStar />}                   {" "}
          </button>
                         {" "}
        </div>
                       {" "}
        <div className="task-details">
                              <h3 onClick={handleEdit}>{task.title}</h3>       
                      {task.description && <p>{task.description}</p>}           
                 {" "}
          {formattedDueDate && (
            <div className="task-due-date">
                                         {" "}
              <FaCalendarAlt className="date-icon" />                           {" "}
              <span>{formattedDueDate}</span>                       {" "}
            </div>
          )}
                         {" "}
        </div>
                   {" "}
      </div>
                 {" "}
      <div className="task-actions">
                       {" "}
        <button
          onClick={handleDelete}
          className="icon-button"
          title="Eliminar tarea"
        >
                              <FaTrashAlt />               {" "}
        </button>
                   {" "}
      </div>
             {" "}
    </li>
  );
}

export default TaskItem;
