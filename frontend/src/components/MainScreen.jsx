import React, { useState } from "react";

import { FaPlus } from "react-icons/fa";
import TaskModalForm from "./TaskModalForm";

import "./MyDayScreen.css";

function MyDayScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("es-ES", dateOptions);

  const handleTaskCreated = (newTask) => {
    setIsModalOpen(false);
    console.log("Tarea creada:", newTask);
  };

  return (
    <div className="screen my-day-screen">
      <h2>Mi Día</h2>
      <p>{formattedDate}</p>

      <div className="my-day-main-content screen-content">
        <p>Aquí aparecerán las tareas que añadas a Mi Día.</p>

        <div className="suggestions-section">
          <h3>Sugerencias</h3>
        </div>

        <button
          className="add-task-button"
          onClick={() => setIsModalOpen(true)}
          title="Agregar nueva tarea"
        >
          <FaPlus /> Agregar tarea
        </button>
      </div>

      <TaskModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

export default MyDayScreen;
