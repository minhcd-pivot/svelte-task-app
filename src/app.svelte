<script lang="ts">
  import TasksForm from "@/components/task-form.svelte";
  import TasksList from "@/components/task-list.svelte";
  import type { Filter, Task } from "@/lib/types";
  import {
    fetchTasks,
    apiAddTask,
    apiDeleteTask,
    apiUpdateTask,
  } from "@/lib/api";
  import { onMount } from "svelte";

  let currentFilter = $state<Filter>("all");
  let tasks = $state<Task[]>([]);
  let totalDone = $derived(
    tasks.reduce((total, task) => total + Number(task.completed), 0)
  );

  let filteredTasks = $derived.by(() => {
    switch (currentFilter) {
      case "all": {
        return tasks;
      }
      case "done": {
        return tasks.filter((task) => task.completed);
      }
      case "todo": {
        return tasks.filter((task) => !task.completed);
      }
      default: {
        return tasks;
      }
    }
  });

  async function addTask(newTask: string) {
    const task = {
      todo: newTask,
      completed: false,
      userId: 5,
    };

    const { id } = await apiAddTask(task);

    if (id) {
      // Dummy api alwasys returns 255 which make api delete fail
      tasks = [...tasks, { ...task, id: tasks.length + 1 }];
    }
  }

  async function toggleDone(task: Task) {
    const { completed } = await apiUpdateTask(task.id, !task.completed);

    return (task.completed = completed);
  }

  async function removeTask(id: number) {
    const { isDeleted } = await apiDeleteTask(id);

    if (isDeleted) {
      const index = tasks.findIndex((task) => task.id === id);
      tasks.splice(index, 1);
    }
  }

  let isFetching = $state(false);

  onMount(async () => {
    isFetching = true;

    const { todos } = await fetchTasks();
    tasks = [...todos];

    isFetching = false;
  });
</script>

{#snippet filterButton(filter: Filter)}
  <button
    onclick={() => (currentFilter = filter)}
    class:contrast={currentFilter === filter}
    class="secondary filterButton">{filter}</button
  >
{/snippet}

<main>
  <h1>Tasks App</h1>

  <TasksForm {addTask} />

  <p>
    {#if tasks.length}
      {totalDone} / {tasks.length} tasks completed
    {:else if isFetching}
      Loading...
    {:else}
      Add a task to get started.
    {/if}
  </p>

  {#if tasks.length}
    <div class="button-container">
      {@render filterButton("all")}
      {@render filterButton("todo")}
      {@render filterButton("done")}
    </div>
  {/if}

  <TasksList tasks={filteredTasks} {toggleDone} {removeTask} />
</main>

<style>
  main {
    margin: 1rem auto;
    max-width: 800px;
  }

  .button-container {
    display: flex;
    justify-content: end;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .filterButton {
    text-transform: capitalize;
  }
</style>
