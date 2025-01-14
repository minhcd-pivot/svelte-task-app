import type { Task } from "@/lib/types";

let value = $state<Task[]>([]);

export function tasks() {
  return value;
}

export function setTasks(data: Task[]) {
  value = data;
}
