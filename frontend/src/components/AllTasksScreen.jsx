import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";

import TaskList from "./TaskList";
import TaskModalForm from "./TaskModalForm";

import "./AllTasksScreen.css";
import "../styles/styles.css";

function AllTasksScreen() {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async (completedFilter = "all") => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/tasks";
      if (completedFilter === "completed") {
        url += "?completed=true";
      } else if (completedFilter === "incomplete") {
        url += "?completed=false";
      }

      console.log(
        `[AllTasksScreen] Fetching tasks with filter: ${completedFilter} at ${url}`
      );
      const response = await fetch(url);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(
            `Error al obtener tareas: ${response.statusText} - ${
              errorData.message || "Error desconocido"
            }`
          );
        } else {
          throw new Error(
            `Error al obtener tareas: Respuesta no es JSON (Estado: ${response.status})`
          );
        }
      }

      const data = await response.json();
      setAllTasks(data);
      console.log(
        `[AllTasksScreen] Tareas obtenidas (filtro: ${completedFilter}):`,
        data
      );
    } catch (err) {
      console.error("[AllTasksScreen] Error fetching tasks:", err);
      if (
        err instanceof SyntaxError &&
        err.message.includes("Unexpected token")
      ) {
        setError(
          "Error al procesar la respuesta del servidor al cargar tareas. Asegúrate que el backend esté corriendo y la ruta API es correcta."
        );
      } else {
        setError(`Error al cargar las tareas: ${err.message}`);
      }
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filterStatus);
  }, [filterStatus]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return allTasks;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (task.description &&
          task.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [allTasks, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setSearchTerm("");
  };

  const handleToggleCompleted = async (taskId, isCompleted) => {
    console.log(
      `[AllTasksScreen] Intentando actualizar tarea ${taskId}: completed = ${isCompleted}`
    );
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isCompleted }),
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
        `[AllTasksScreen] Tarea ${taskId} completada/pendiente actualizada en backend.`
      );
      fetchTasks(filterStatus);
    } catch (error) {
      console.error(
        "[AllTasksScreen] Error al actualizar estado completado:",
        error
      );
      setError(`Error al actualizar tarea: ${error.message}`);
    }
  };

  const handleToggleImportant = async (taskId, isImportant) => {
    console.log(
      `[AllTasksScreen] Intentando actualizar tarea ${taskId}: isImportant = ${isImportant}`
    );
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
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
        `[AllTasksScreen] Tarea ${taskId} importancia actualizada en backend.`
      );
    } catch (error) {
      console.error(
        "[AllTasksScreen] Error al actualizar estado importante:",
        error
      );
      setError(`Error al actualizar importancia: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log(`[AllTasksScreen] Intentando eliminar tarea ${taskId}`);
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
      console.log(`[AllTasksScreen] Tarea ${taskId} eliminada en backend.`);
      fetchTasks(filterStatus);
    } catch (error) {
      console.error("[AllTasksScreen] Error al eliminar tarea:", error);
      setError(`Error al eliminar tarea: ${err.message}`);
    }
  };

  const handleOpenModalForCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleTaskSavedInModal = (savedTask) => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    fetchTasks(filterStatus);
    console.log("Tarea guardada desde modal (en AllTasksScreen):", savedTask);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="screen all-tasks-screen">
                   
      <div className="screen-header">
                       {" "}
        <div className="title-and-date">
                               <h2>Tareas</h2>               {" "}
        </div>
                     
      </div>
                   
      <div className="screen-content">
                         
        <div className="search-bar">
                              <FaSearch className="search-icon" />
                             {" "}
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
                           
        </div>
                         
        <div className="filter-controls">
                               
          <button
            className={`button secondary ${
              filterStatus === "all" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("all")}
          >
                                     Todas                      
          </button>
                               
          <button
            className={`button secondary ${
              filterStatus === "completed" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("completed")}
          >
                                     Completadas                      
          </button>
                               
          <button
            className={`button secondary ${
              filterStatus === "incomplete" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("incomplete")}
          >
                                     Incompletas                      
          </button>
                           
        </div>
                         {loading && <p>Cargando tareas...</p>}                 
        {error && <p style={{ color: "red" }}>{error}</p>}                 
        {!loading && !error && filteredTasks.length > 0 && (
          <TaskList
            tasks={filteredTasks}
            onToggleCompleted={handleToggleCompleted}
            onToggleImportant={handleToggleImportant}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenModalForEdit}
          />
        )}
                         
        {!loading &&
          !error &&
          filteredTasks.length === 0 &&
          allTasks.length > 0 && (
            <p>
              No se encontraron tareas que coincidan con los filtros o la
              búsqueda.
            </p>
          )}
                         
        {!loading && !error && allTasks.length === 0 && (
          <p>
            Aún no tienes tareas.{" "}
            <button
              className="add-list-button"
              onClick={handleOpenModalForCreate}
            >
              Agrega una
            </button>
          </p>
        )}
                     
      </div>
                   
      {isModalOpen && (
        <TaskModalForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTaskSaved={handleTaskSavedInModal}
          initialData={taskToEdit}
        />
      )}
             {" "}
    </div>
  );
}

export default AllTasksScreen;
