<script lang="ts">
  import Notifications from "svelte-notifications";
</script>

<Notifications>
  <div class="app">
    <slot />
  </div>
</Notifications>
