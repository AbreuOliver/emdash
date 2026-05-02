<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/admin/dashboard', { replaceState: true });
  });
</script>

<p>Redirecting to dashboard...</p>
