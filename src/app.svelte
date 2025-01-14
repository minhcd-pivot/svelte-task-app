<script lang="ts">
  import TasksForm from "@/components/task-form.svelte";
  import TasksList from "@/components/task-list.svelte";
  import { fetchTasks } from "@/lib/api";
  import { onMount } from "svelte";
  import { setTasks } from "@/stores/tasks.svelte";

  let isFetching = $state(false);

  onMount(async () => {
    isFetching = true;

    const { todos } = await fetchTasks();
    setTasks(todos);

    isFetching = false;
  });
</script>

<main>
  <h1>Tasks App</h1>

  <TasksForm />

  {#if isFetching}
    <p>Loading tasks...</p>
  {:else}
    <TasksList />
  {/if}
</main>

<style>
  main {
    margin: 1rem auto;
    max-width: 800px;
  }
</style>
