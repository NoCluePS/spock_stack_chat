<script lang="ts">
  import { currentUser, login, logout } from "./pocketbase";

  let username: string;
  let password: string;
</script>

{#if $currentUser}
  <p>
    Signed in as {$currentUser.username}
    <button on:click={logout} style="margin-left: 10px;">Logout</button>
  </p>
{:else}
  <form on:submit|preventDefault>
    <input placeholder="Username" type="text" bind:value={username} />
    <input placeholder="Password" type="password" bind:value={password} />
    <button on:click={() => login(username, password)}>Login</button>
  </form>
{/if}
