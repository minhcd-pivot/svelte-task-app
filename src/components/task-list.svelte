<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Task, Filter } from "@/lib/types";
  import { tasks } from "@/stores/tasks.svelte";
  import { apiDeleteTask, apiUpdateTask } from "@/lib/api";

  let currentFilter = $state<Filter>("all");
  let filteredTasks = $derived.by(() => {
    switch (currentFilter) {
      case "all": {
        return tasks();
      }
      case "done": {
        return tasks().filter((task) => task.completed);
      }
      case "todo": {
        return tasks().filter((task) => !task.completed);
      }
      default: {
        return tasks();
      }
    }
  });
  let totalDone = $derived(
    tasks().reduce((total, task) => total + Number(task.completed), 0)
  );

  async function toggleDone(task: Task) {
    const { completed } = await apiUpdateTask(task.id, !task.completed);

    return (task.completed = completed);
  }

  async function removeTask(id: number) {
    const { isDeleted } = await apiDeleteTask(id);

    if (isDeleted) {
      const index = tasks().findIndex((task) => task.id === id);
      tasks().splice(index, 1);
    }
  }
</script>

{#snippet filterButton(filter: Filter)}
  <button
    onclick={() => (currentFilter = filter)}
    class:contrast={currentFilter === filter}
    class="secondary filterButton">{filter}</button
  >
{/snippet}

<section>
  <p>
    {#if tasks().length}
      {totalDone} / {tasks().length} tasks completed
    {:else}
      Add a task to get started.
    {/if}
  </p>

  {#if tasks().length}
    <div class="button-container">
      {@render filterButton("all")}
      {@render filterButton("todo")}
      {@render filterButton("done")}
    </div>
  {/if}

  {#each filteredTasks as task}
    <article class="task" transition:fade>
      <label>
        <input
          checked={task.completed}
          onchange={() => toggleDone(task)}
          type="checkbox"
        />
        <span class:done={task.completed}>{task.todo}</span>
      </label>
      <button onclick={() => removeTask(task.id)} class="outline">Remove</button
      >
    </article>
  {/each}
</section>

<style>
  .done {
    text-decoration: line-through;
  }

  .task {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
