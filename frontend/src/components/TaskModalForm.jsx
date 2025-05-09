import React, { useState, useEffect } from "react";
import "./TaskModalForm.css";
import "../styles/styles.css";

function TaskModalForm({
  isOpen,
  onClose,
  onTaskSaved,
  initialData,
  taskToEdit,
}) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isMyDay, setIsMyDay] = useState(true);
  const [dueDate, setDueDate] = useState("");

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    setFormError(null);
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title || "");
      setTaskDescription(taskToEdit.description || "");
      setIsImportant(taskToEdit.isImportant || false);
      setIsMyDay(taskToEdit.isMyDay || false);
      setDueDate(taskToEdit.dueDate || "");
    } else if (initialData) {
      setTaskTitle(initialData.title || "");
      setIsMyDay(initialData.myDay || true);
      setTaskDescription(initialData.description || "");
      setIsImportant(initialData.important || false);
      setDueDate(initialData.dueDate || "");
    } else {
      setTaskTitle("");
      setTaskDescription("");
      setIsImportant(false);
      setIsMyDay(true);
      setDueDate("");
    }
  }, [initialData, taskToEdit]);

  useEffect(() => {
    if (!isOpen) {
      setTaskTitle("");
      setTaskDescription("");
      setIsImportant(false);
      setIsMyDay(true);
      setDueDate("");
      setFormError(null);
    }
  }, [isOpen]);

  const handleSaveTask = async (e) => {
    if (!taskTitle.trim()) {
      setFormError("El título de la tarea es obligatorio.");
      return;
    }
    setFormError(null);

    const taskDataForAPI = {
      id: taskToEdit?.id,
      title: taskTitle.trim(),
      description:
        taskDescription.trim() === "" ? null : taskDescription.trim(),
      isImportant: isImportant,
      myDay: isMyDay,
      dueDate: dueDate || null,
    };

    const url = taskToEdit ? `/api/tasks/${taskToEdit.id}` : "/api/tasks";
    const method = taskToEdit ? "PUT" : "POST";

    try {
      console.log(
        `[Modal] Llamando a la API: ${method} ${url} con datos:`,
        taskDataForAPI
      );
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDataForAPI),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error("[Modal] Error API:", errorData);
          setFormError(
            `Error al guardar tarea: ${
              errorData.message || "Error desconocido"
            }`
          );
        } else {
          console.error(
            "[Modal] Error API (No JSON):",
            response.status,
            response.statusText
          );
          setFormError(
            `Error al guardar tarea: Estado ${response.status} - ${response.statusText}`
          );
        }
        return;
      }

      if (response.status === 204) {
        console.log(
          "Operación de guardado (PUT) exitosa sin contenido de respuesta."
        );
        if (onTaskSaved) {
          onTaskSaved(taskToEdit ? { ...taskToEdit, ...taskDataForAPI } : null);
        }
      } else {
        const savedTask = await response.json();
        console.log("Tarea guardada exitosamente via API:", savedTask);

        if (onTaskSaved) {
          onTaskSaved(savedTask);
        }
      }
    } catch (error) {
      console.error("[Modal] Error during task save API call:", error);
      setFormError(`Error al guardar: ${error.message}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
                 {" "}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{taskToEdit ? "Editar Tarea" : "Agregar Tarea"}</h2>
                       {" "}
        <div className="form-group">
                              <label htmlFor="taskTitle">Título</label>
                             {" "}
          <input
            type="text"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Título de la tarea"
            required
          />
                         {" "}
        </div>
                       {" "}
        <div className="form-group">
                             {" "}
          <label htmlFor="taskDescription">Descripción (Opcional)</label>
                             {" "}
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Detalles o notas"
          />
                         {" "}
        </div>
                       {" "}
        <div className="form-group">
                             {" "}
          <label htmlFor="dueDate">Fecha de vencimiento (Opcional)</label>
                             {" "}
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
                         {" "}
        </div>
                         
        <div className="form-group">
                               
          <label>
                                     
            <input
              type="checkbox"
              checked={isMyDay}
              onChange={(e) => setIsMyDay(e.target.checked)}
            />
                                     Agregar a Mi Día                      
          </label>
                           
        </div>
                         
        <div className="form-group">
                               
          <label>
                                     
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
            />
                                     Marcar como importante                    
             
          </label>
                           
        </div>
                         
        {formError && (
          <p className="error-message" style={{ textAlign: "center" }}>
            {formError}
          </p>
        )}
                       {" "}
        <div className="form-actions">
                             {" "}
          <button className="button secondary" onClick={onClose}>
            Cancelar
          </button>
                             {" "}
          <button className="button primary" onClick={handleSaveTask}>
            Guardar
          </button>
                         {" "}
        </div>
                   {" "}
      </div>
             {" "}
    </div>
  );
}

export default TaskModalForm;
