// frontend/src/components/MyDayScreen.jsx
import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSun, FaEllipsisH } from "react-icons/fa";
import TaskModalForm from "./TaskModalForm";
import TaskList from "./TaskList";

import "./MyDayScreen.css";

import "../styles/styles.css";

function MyDayScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar si el modal está abierto
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskToEdit, setTaskToEdit] = useState(null);

  // Obtener la fecha actual formateada
  const today = new Date();

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("es-ES", dateOptions);

  // --- Función para obtener las tareas de Mi Día desde la API ---
  const fetchMyDayTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("[MyDayScreen] Fetching My Day tasks...");
      const response = await fetch("/api/tasks?myDay=true");

      if (!response.ok) {
        // Manejo de errores de la API, incluyendo respuestas no JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(
            `Error al obtener tareas de Mi Día: ${response.statusText} - ${
              errorData.message || "Error desconocido"
            }`
          );
        } else {
          throw new Error(
            `Error al obtener tareas de Mi Día: Respuesta no es JSON (Estado: ${response.status})`
          );
        }
      }

      const data = await response.json();
      setTasks(data); // Actualiza el estado con las tareas obtenidas
      console.log("[MyDayScreen] Tareas de Mi Día obtenidas:", data);
    } catch (err) {
      console.error("[MyDayScreen] Error fetching tasks:", err);
      if (
        err instanceof SyntaxError &&
        err.message.includes("Unexpected token")
      ) {
        setError(
          "Error al procesar la respuesta del servidor al cargar tareas de Mi Día. Asegúrate que el backend esté corriendo y la ruta API es correcta."
        );
      } else {
        setError(`Error al cargar las tareas de Mi Día: ${err.message}`);
      }

      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDayTasks();
  }, []);

  // --- Lógica del Modal ---
  // Función para abrir el modal para crear una tarea
  const handleOpenModalForCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleOpenModalForEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Función llamada por el modal cuando una tarea se guarda/crea con éxito
  const handleTaskSavedInModal = (savedTask) => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    fetchMyDayTasks();
    console.log("[MyDayScreen] Tarea guardada (desde modal):", savedTask);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleToggleCompleted = async (taskId, isCompleted) => {
    console.log(
      `[MyDayScreen] Intentando actualizar tarea ${taskId}: completed = ${isCompleted}`
    );
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT", // O PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isCompleted }),
      });
      if (!response.ok) {
        const errorData = await response.json(); // Asume respuesta JSON de error
        throw new Error(
          `API Error: ${response.statusText} - ${
            errorData.message || "Error desconocido"
          }`
        );
      }
      console.log(
        `[MyDayScreen] Tarea ${taskId} completada/pendiente actualizada en backend.`
      );
      fetchMyDayTasks();
    } catch (error) {
      console.error(
        "[MyDayScreen] Error al actualizar estado completado:",
        error
      );
      setError(`Error al actualizar tarea: ${error.message}`);
    }
  };

  const handleToggleImportant = async (taskId, isImportant) => {
    console.log(
      `[MyDayScreen] Intentando actualizar tarea ${taskId}: isImportant = ${isImportant}`
    );
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT", // O PATCH
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ isImportant: isImportant }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.statusText} - ${
            errorData.message || "Error desconocido"
          }`
        );
      }
      console.log(
        `[MyDayScreen] Tarea ${taskId} importancia actualizada en backend.`
      );
    } catch (error) {
      console.error(
        "[MyDayScreen] Error al actualizar estado importante:",
        error
      );
      setError(`Error al actualizar tarea: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log(`[MyDayScreen] Intentando eliminar tarea ${taskId}`);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${response.statusText} - ${errorData.message || ""}`
          );
        } else {
          throw new Error(`API Error: Estado ${response.status}`);
        }
      }
      console.log(`[MyDayScreen] Tarea ${taskId} eliminada en backend.`);
      fetchMyDayTasks();
    } catch (error) {
      console.error("[MyDayScreen] Error al eliminar tarea:", error);
      setError(`Error al eliminar tarea: ${error.message}`);
    }
  };

  return (
    <div className="screen my-day-screen">
      <div className="my-day-header-visual">
        <div className="screen-header">
          <div className="title-and-date">
            <h2>Mi Día</h2>
            <p>{formattedDate}</p>
          </div>

          <div className="header-icons"></div>
        </div>
      </div>
               {" "}
      <div className="my-day-main-content screen-content">
               {" "}
        <button
          className="add-task-button"
          onClick={handleOpenModalForCreate}
          title="Agregar nueva tarea"
        >
                      <FaPlus /> Agregar tarea        {" "}
        </button>
        {loading && <p>Cargando tareas...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            onToggleCompleted={handleToggleCompleted}
            onToggleImportant={handleToggleImportant}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenModalForEdit}
          />
        )}
               
        {!loading && !error && tasks.length === 0 && (
          <div className="suggestions-section">
                      <h3>Sugerencias</h3>         {" "}
            <p>Parece que hoy no tienes tareas en Mi Día. ¡Añade algunas!</p>   
               {" "}
          </div>
        )}
             {" "}
      </div>
           {" "}
      {isModalOpen && (
        <TaskModalForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTaskSaved={handleTaskSavedInModal}
          initialData={taskToEdit}
        />
      )}
    </div>
  );
}

export default MyDayScreen;
