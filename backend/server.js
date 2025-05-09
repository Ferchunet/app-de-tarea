// backend/server.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid"); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Permite requests desde tu frontend
app.use(express.json()); 

const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
    db.run(
      `
CREATE TABLE IF NOT EXISTS tasks (
id TEXT PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
completed INTEGER DEFAULT 0,
isImportant INTEGER DEFAULT 0,
isMyDay INTEGER DEFAULT 0,
dueDate TEXT -- <--- ¡Añadimos la nueva columna dueDate como TEXT!
)
`,
      (createErr) => {
        if (createErr) {
          console.error(
            "Error al crear/verificar la tabla tasks:",
            createErr.message
          );
        } else {
          console.log(
            "CREATE TABLE IF NOT EXISTS tasks ejecutada con éxito (o ya existía)."
          ); 
          db.run(
            `ALTER TABLE tasks ADD COLUMN isImportant INTEGER DEFAULT 0`,
            (alterErr) => {
              if (
                alterErr &&
                !alterErr.message.includes("duplicate column name")
              ) {
                console.error(
                  "Error al añadir columna isImportant:",
                  alterErr.message
                );
              } else if (!alterErr) {
                console.log(
                  "Columna isImportant añadida con éxito (o ya existía)."
                );
              }
            }
          );
          db.run(
            `ALTER TABLE tasks ADD COLUMN isMyDay INTEGER DEFAULT 0`,
            (alterErr) => {
              if (
                alterErr &&
                !alterErr.message.includes("duplicate column name")
              ) {
                console.error(
                  "Error al añadir columna isMyDay:",
                  alterErr.message
                );
              } else if (!alterErr) {
                console.log(
                  "Columna isMyDay añadida con éxito (o ya existía)."
                ); 
              }
            }
          );
          db.run(`ALTER TABLE tasks ADD COLUMN dueDate TEXT`, (alterErr) => {
            if (
              alterErr &&
              !alterErr.message.includes("duplicate column name")
            ) {
              console.error(
                "Error al añadir columna dueDate:",
                alterErr.message
              );
            } else if (!alterErr) {
              console.log("Columna dueDate añadida con éxito (o ya existía).");
            } else {
              if (
                !alterErr ||
                alterErr.message.includes("duplicate column name")
              ) {
                console.log(
                  "Tabla tasks verificada/modificada con columnas isImportant, isMyDay y dueDate."
                ); // Mensaje final
              }
            }
          });
        }
      }
    );
  }
});


app.get("/api/tasks", (req, res) => {
  const filterImportant = req.query.important;
  const filterMyDay = req.query.myDay;
  const filterCompleted = req.query.completed;

  let sql = "SELECT * FROM tasks";
  let params = [];
  let conditions = [];

  if (filterImportant !== undefined) {
    const isImportantFilter = filterImportant.toLowerCase() === "true" ? 1 : 0;
    conditions.push(`isImportant = ?`);
    params.push(isImportantFilter);
  }

  if (filterMyDay !== undefined) {
    const isMyDayFilter = filterMyDay.toLowerCase() === "true" ? 1 : 0;
    conditions.push(`isMyDay = ?`);
    params.push(isMyDayFilter);
  }

  if (filterCompleted !== undefined) {
    const isCompletedFilter = filterCompleted.toLowerCase() === "true" ? 1 : 0;
    conditions.push(`completed = ?`);
    params.push(isCompletedFilter);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY completed ASC, dueDate ASC NULLS LAST, title ASC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Error al obtener tareas:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(
      rows.map((row) => ({
        ...row,
        completed: !!row.completed,
        isImportant: !!row.isImportant,
        isMyDay: !!row.isMyDay,
        dueDate: row.dueDate || null,
      }))
    );
  });
});

// Endpoint GET /api/tasks/:id - Obtener una tarea por ID
app.get("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({ message: "ID de tarea no proporcionado" });
  }

  db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json({
      ...row,
      completed: !!row.completed,
      isImportant: !!row.isImportant,
      isMyDay: !!row.isMyDay,
      dueDate: row.dueDate || null,
    });
  });
});

// Endpoint POST /api/tasks - Crear una nueva tarea
app.post("/api/tasks", (req, res) => {
  const { title, description, isImportant, myDay, dueDate } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "El título es obligatorio" });
  }

  if (myDay !== undefined && typeof myDay !== "boolean") {
    return res
      .status(400)
      .json({ error: "myDay debe ser un valor booleano (true/false)" });
  }
  if (isImportant !== undefined && typeof isImportant !== "boolean") {
    return res
      .status(400)
      .json({ error: "isImportant debe ser un valor booleano (true/false)" });
  }

  if (
    dueDate !== undefined &&
    dueDate !== null &&
    typeof dueDate !== "string"
  ) {
    return res.status(400).json({ error: "dueDate debe ser un string o nulo" });
  }

  const id = uuidv4();
  const isImportantValue = isImportant ? 1 : 0;
  const isMyDayValue = myDay ? 1 : 0;

  db.run(
    "INSERT INTO tasks (id, title, description, completed, isImportant, isMyDay, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      title.trim(),
      description ? description.trim() : null,
      0,
      isImportantValue,
      isMyDayValue,
      dueDate || null,
    ],
    function (err) {
      if (err) {
        console.error("Error al insertar tarea:", err.message);
        return res.status(500).json({ error: err.message });
      }
      db.get("SELECT * FROM tasks WHERE id = ?", [id], (selectErr, row) => {
        if (selectErr) {
          console.error(
            "Error al obtener tarea recién creada:",
            selectErr.message
          );
          return res.status(500).json({ error: selectErr.message });
        }
        res.status(201).json({
          ...row,
          completed: !!row.completed,
          isImportant: !!row.isImportant,
          isMyDay: !!row.isMyDay,
          dueDate: row.dueDate || null,
        });
      });
    }
  );
});

// Endpoint PUT /api/tasks/:id - Actualizar una tarea existente
app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed, isImportant, myDay, dueDate } =
    req.body;

  if (!taskId) {
    return res.status(400).json({ message: "ID de tarea no proporcionado" });
  }

  if (
    title === undefined &&
    description === undefined &&
    completed === undefined &&
    isImportant === undefined &&
    myDay === undefined &&
    dueDate === undefined
  ) {
    return res
      .status(400)
      .json({ message: "No se proporcionaron campos para actualizar" });
  }

  if (myDay !== undefined && typeof myDay !== "boolean") {
    return res
      .status(400)
      .json({ error: "myDay debe ser un valor booleano (true/false)" });
  }
  if (isImportant !== undefined && typeof isImportant !== "boolean") {
    return res
      .status(400)
      .json({ error: "isImportant debe ser un valor booleano (true/false)" });
  }
  if (
    dueDate !== undefined &&
    dueDate !== null &&
    typeof dueDate !== "string"
  ) {
    return res.status(400).json({ error: "dueDate debe ser un string o nulo" });
  }

  let updates = [];
  let params = [];

  if (title !== undefined && title.trim() !== "") {
    updates.push(`title = ?`);
    params.push(title.trim());
  } else if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "El título no puede estar vacío" });
  }

  if (description !== undefined) {
    updates.push(`description = ?`);
    params.push(description ? description.trim() : null);
  }

  if (completed !== undefined) {
    updates.push(`completed = ?`);
    params.push(completed ? 1 : 0);
  }

  if (isImportant !== undefined) {
    updates.push(`isImportant = ?`);
    params.push(isImportant ? 1 : 0);
  }

  if (dueDate !== undefined) {
    updates.push(`dueDate = ?`);
    params.push(dueDate || null);
  }

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ message: "No se proporcionaron campos válidos para actualizar" });
  }

  let sql = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`;
  params.push(taskId);

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error al actualizar tarea:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (selectErr, row) => {
      if (selectErr) {
        console.error("Error al obtener tarea actualizada:", selectErr.message);
        return res.status(500).json({ error: selectErr.message });
      }
      res.json({
        ...row,
        completed: !!row.completed,
        isImportant: !!row.isImportant,
        isMyDay: !!row.isMyDay,
        dueDate: row.dueDate || null,
      });
    });
  });
});

// Endpoint DELETE /api/tasks/:id - Eliminar una tarea
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ message: "ID de tarea no proporcionado" });
  }

  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
    if (err) {
      console.error("Error al eliminar tarea:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Conexión a la base de datos cerrada.");
    process.exit(0);
  });
});
