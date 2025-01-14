<script lang="ts">
  import { tasks, setTasks } from "@/stores/tasks.svelte";
  import { apiAddTask } from "@/lib/api";

  let newTask = $state("");

  function formSubmitted(e: SubmitEvent) {
    e.preventDefault();
    addTask(newTask);
    newTask = "";
  }

  async function addTask(newTask: string) {
    const task = {
      todo: newTask,
      completed: false,
      userId: 5,
    };

    const { id } = await apiAddTask(task);

    if (id) {
      // Dummy api alwasys returns 255 which make api delete fail
      setTasks([...tasks(), { ...task, id: tasks().length + 1 }]);
    }
  }
</script>

<form onsubmit={formSubmitted}>
  <label>
    Task
    <input name="newTask" bind:value={newTask} />
  </label>
  <div class="button-container">
    <button disabled={!newTask}>Add</button>
  </div>
</form>

<style>
  form {
    margin-bottom: 1rem;
  }
  .button-container {
    display: flex;
    justify-content: end;
  }
</style>
