"use client";
import { TaskType } from "@/types/type";
import { getTasks, createTask, updateTask } from "./service/task.service";
import { useState, useEffect } from "react";
import styles from "./styles/taskStyles.module.css";

export default function Home() {
  // Estados
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  // Cargar tareas al iniciar
  useEffect(() => {
    loadTasks();
  }, []);

  // Función para cargar tareas
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar las tareas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar nueva tarea
  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
      alert("Por favor, completa ambos campos");
      return;
    }

    try {
      setError(null);
      const newTask = await createTask(newTaskTitle, newTaskDescription);
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setNewTaskDescription("");

      console.log("Tarea creada:", newTask);
    } catch (err) {
      console.error("Error al crear tarea:", err);
      setError("Error al crear la tarea");
    }
  };

  // Función para marcar como completada
  const handleCompleteTask = async (id: number) => {
    try {
      setError(null);
      console.log(`Marcando tarea ${id} como completada...`);

      const updatedTask = await updateTask(id);
      console.log("Respuesta del servidor:", updatedTask);

      // Actualizar estado local
      setTasks(
        tasks.map((task) => (task.Id === id ? { ...task, Estado: true } : task))
      );

      console.log("Estado actualizado localmente");
    } catch (err) {
      console.error(`Error al actualizar tarea ${id}:`, err);
      setError(
        `Error al marcar como completada: ${
          err instanceof Error ? err.message : "Error desconocido"
        }`
      );
    }
  };

  // Contadores de tareas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.Estado).length;
  const pendingTasks = totalTasks - completedTasks;

  if (loading) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Cargando tareas...</h1>
        <p>Por favor espera</p>
      </main>
    );
  }

  return (
    <main className={styles["task-manager"]}>
      <h1 className={styles["main-title"]}>Gestor de Tareas</h1>
      {/* Mensaje de error */}
      {error && (
        <div className={styles["error-message"]}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Formulario para nueva tarea */}
      <div className={styles["form-section"]}>
        <h2 className={styles["form-title"]}>Agregar Nueva Tarea</h2>
        <div className={styles["form-group"]}>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className={styles["task-input"]}
          />
          <textarea
            placeholder="Descripción"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className={styles["task-textarea"]}
          />
          <button onClick={handleAddTask} className={styles["add-btn"]}>
            + Agregar Tarea
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      <div>
        <h2>
          Lista de Tareas (Total: {tasks.length}, Pendientes: {pendingTasks} y
          Completadas: {completedTasks})
        </h2>
        {tasks.length === 0 ? (
          <p className={styles["empty-task"]}>
            No hay tareas. ¡Agrega una nueva!
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.Id.toString()}
                className={
                  task.Estado
                    ? styles["task-item"] + " " + styles["task-item.completed"]
                    : styles["task-item"]
                }
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "0.5rem",
                    color: task.Estado ? "#2e7d32" : "#333",
                  }}
                >
                  {task.Titulo}
                </h3>

                <p className={styles["task-description"]}>{task.Descripcion}</p>

                <div className={styles["task-footer"]}>
                  {!task.Estado ? (
                    <button
                      onClick={() => handleCompleteTask(task.Id)}
                      className={styles["complete-btn"]}
                    >
                      Marcar como Completada
                    </button>
                  ) : (
                    <span className={styles["completed-status"]}>
                      ✓ Tarea Completada
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
