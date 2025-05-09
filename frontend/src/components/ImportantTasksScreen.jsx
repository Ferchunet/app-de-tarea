// src/components/ImportantTasksScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import TaskItem from "./TaskItem"; 

function ImportantTasksScreen() {
  const navigate = useNavigate();
  const [importantTasks, setImportantTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar solo las tareas importantes desde la API
  const fetchImportantTasks = () => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks?important=true`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setImportantTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading important tasks:", error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchImportantTasks();
  }, []);

  const handleDeleteTask = (id) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setImportantTasks(importantTasks.filter((task) => task.id !== id));
        } else {
          return response
            .json()
            .then((err) => {
              console.error("API Error deleting task:", err);
              alert(
                "Error al eliminar la tarea: " +
                  (err.error || response.statusText)
              );
            })
            .catch(() => {
              console.error("Error deleting task:", response.statusText);
              alert("Error al eliminar la tarea: " + response.statusText);
            });
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la tarea:", error);
        alert("Error de red al eliminar la tarea: " + error.message);
      });
  };

  const handleUpdateTask = (updatedTaskData) => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${updatedTaskData.id}`,
      {
        method: "PUT", // O PATCH
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(updatedTaskData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .then((err) => {
              console.error("API Error updating task:", err);
              alert(
                "Error al actualizar la tarea: " +
                  (err.error || response.statusText)
              );
            })
            .catch(() => {
              console.error("Error updating task:", response.statusText);
              alert("Error al actualizar la tarea: " + response.statusText);
            });
        }
        return response.json();
      })
      .then((fetchedUpdatedTask) => {
        setImportantTasks((prevTasks) =>
          prevTasks
            .map((task) =>
              task.id === fetchedUpdatedTask.id ? fetchedUpdatedTask : task
            )
            .filter((task) => task.isImportant)
        );
      })
      .catch((error) => {
        console.error("Error al actualizar la tarea:", error);
        alert("Error de red al actualizar la tarea: " + error.message);
      });
  };

  if (loading) {
    return <div>Cargando tareas importantes...</div>;
  }

  if (error) {
    return <div>Error al cargar las tareas: {error.message}</div>;
  }

  return (
    <div className="screen important-tasks-screen">
      <div className="screen-header">
        <h2>Importante</h2>
      </div>

      <div className="screen-content">
        {importantTasks.length === 0 ? (
          <p>No hay tareas marcadas como importantes.</p>
        ) : (
          <ul>
            {importantTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ImportantTasksScreen;
