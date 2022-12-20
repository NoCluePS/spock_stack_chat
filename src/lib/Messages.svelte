<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { pb, currentUser } from "./pocketbase";
  import "./Messages.css";

  let newMessage: string;
  let messages = [];
  let unsubscribe: any;

  onMount(async () => {
    const resultList = await pb.collection("messages").getList(1, 50, {
      sort: "created",
      expand: "user",
    });

    messages = resultList.items;

    unsubscribe = pb.collection("messages").subscribe("*", async ({ action, record }) => {
        if (action === 'created') {
            const user = await pb.collection('users').getOne(record.user)
            record.expand = { user }
            messages = [...messages, record]
        }
        if (action === 'delete') {
            messages = messages.filter((m) => m.id !== record.id)
        }
    });
  });

  onDestroy(() => {
    unsubscribe?.();
  })

  const sendMessage = async () => {
    const data = {
      text: newMessage,
      user: $currentUser.id,
    };
    pb.collection("messages").create(data);
    newMessage = "";
  };
</script>

<div class="container">
  <div class="messages">
    {#each messages as message (message.id)}
      <div class="msg">
        <img
          class="avatar"
          src={`https://avatars.dicebear.com/api/pixel-art/${message.expand?.user?.username}.svg`}
          alt="avatar"
          width="60px"
        />
        <div class="msg-container">
          <small
            >Sent by @{message.expand?.user?.username === $currentUser.username
              ? "Me"
              : message.expand?.user?.username}</small
          >
          <p class="msg-text">{message.text}</p>
        </div>
      </div>
    {/each}
  </div>
  <form class="send-msg-form" on:submit|preventDefault={sendMessage}>
    <input
      bind:value={newMessage}
      placeholder="Something cool to add..."
      type="text"
    />
    <button type="submit">Send</button>
  </form>
</div>
