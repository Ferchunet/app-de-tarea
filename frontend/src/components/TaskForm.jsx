import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import "../styles/styles.css";

function TaskForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isImportant, setIsImportant] = useState(
    initialData?.isImportant || false
  );
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");

      setIsImportant(initialData.isImportant || false);
    } else {
      setTitle("");
      setDescription("");
      setIsImportant(false);
    }

    setTitleError("");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitleError("");

    if (!title.trim()) {
      setTitleError("El título es obligatorio.");
      return;
    }

    const formData = {
      ...(initialData && { id: initialData.id }),
      title: title.trim(),
      description: description.trim(),

      isImportant: isImportant,

      ...(initialData && { completed: initialData.completed }),
    };

    onSubmit(formData);

    if (!initialData) {
      setTitle("");
      setDescription("");
      setIsImportant(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <div className="task-form">
      <h2>{isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {titleError && <p className="error-message">{titleError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            id="isImportant"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
          />
          <label htmlFor="isImportant">Importante</label>
        </div>

        {isEditing && (
          <div className="form-group">
            <input
              type="checkbox"
              id="completed"
              checked={initialData?.completed || false}
              disabled
            />
            <label htmlFor="completed">
              Completada (Gestionar en la lista)
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="button primary">
            {isEditing ? "Guardar Cambios" : "Crear Tarea"}
          </button>

          {onCancel && (
            <button
              type="button"
              className="button secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
