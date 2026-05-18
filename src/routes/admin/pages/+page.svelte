<script lang="ts">
  import { onMount } from 'svelte';

  type Page = { slug: string; title: string };
  let pages = $state<Page[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    const res = await fetch('/api/admin/content');
    const data = await res.json();

    if (!res.ok) {
      loading = false;
      error = data.error || 'Unable to load pages.';
      return;
    }

    pages = data.pages ?? [];
    loading = false;
  });
</script>

<section class="admin-panel grid gap-3">
  <h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Pages</h2>
  <p class="m-0 text-sm text-[var(--admin-text-soft)]">Read-only list for now. Full page CRUD is the next step.</p>

  {#if loading}
    <p class="text-[var(--admin-text-soft)]">Loading pages...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
    <ul class="grid gap-2 list-none p-0">
      {#each pages as entry}
        <li class="rounded-lg border p-3" style={`border-color: var(--admin-panel-border);`}>
          <p class="m-0 font-semibold text-[var(--admin-text-strong)]">{entry.title}</p>
          <p class="m-0 mt-1 text-xs text-[var(--admin-text-soft)]">/{entry.slug}</p>
        </li>
      {/each}
    </ul>
  {/if}
</section>
