// Array en memoria para simular la base de datos
let tasks = [];
let nextId = 1;

// Función para obtener todas las tareas
const getAllTasks = (req, res) => {
    res.json(tasks);
};

// Función para crear una nueva tarea
const createTask = (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const newTask = {
        id: nextId++,
        title,
        description: description || '',
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
};

// Función para actualizar una tarea existente
const updateTask = (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (!title) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description: description || tasks[taskIndex].description,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    };
    res.json(tasks[taskIndex]);
};

// Función para eliminar una tarea
const deleteTask = (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(204).send(); 
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
};