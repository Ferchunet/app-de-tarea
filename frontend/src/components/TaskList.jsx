import React from "react";
import TaskItem from "./TaskItem";
import "../styles/styles.css";

function TaskList({
  tasks,
  onToggleCompleted,
  onToggleImportant,
  onDeleteTask,
  onEditTask,
}) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return null;
  }

  return (
    <ul className="task-list">
                 {" "}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompleted={onToggleCompleted}
          onToggleImportant={onToggleImportant}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
             {" "}
    </ul>
  );
}

export default TaskList;
