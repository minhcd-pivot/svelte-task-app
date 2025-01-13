import type { AddParams, Task } from "@/lib/types";

const API_BASE_URL = "https://dummyjson.com";

export async function fetchTasks(limit: number = 5) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos?limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

export async function apiAddTask(task: AddParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: task.todo,
        completed: false,
        userId: 5,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add task.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

export async function apiDeleteTask(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

export async function apiUpdateTask(id: number, completed: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completed,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
