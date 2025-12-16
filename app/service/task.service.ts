import { TaskType } from "@/types/type";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
// Funcion para obtener todas las tareas
export async function getTasks(): Promise<TaskType[]> {
  const response = await fetch(`/api/tasks`);
  const data = await response.json();
  return data;
}
// Funcion para crear una nueva tarea
export async function createTask(
  Titulo: string,
  Descripcion: string
): Promise<TaskType> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      Titulo: Titulo,
      Descripcion: Descripcion,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error creating task: ${error}`);
  }

  return response.json();
}
// Funcion para actualizar una tarea (marcar como completada)
export async function updateTask(Id: number): Promise<TaskType> {
  console.log(`Updating task with Id: ${Id}`);
  const response = await fetch(`${API_BASE_URL}/tasks/${Id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id: Id }),
  });
  if (!response) {
    console.log("Sucedio un error al actualizar la tarea.");
  }
  const data = await response.json();
  return data;
}
