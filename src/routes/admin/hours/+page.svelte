<script lang="ts">
  import { onMount } from 'svelte';

  type HoursEntry = { label: string; opens: string; closes: string; closed: boolean };

  let rows = $state<HoursEntry[]>([]);
  let revision = $state(0);
  let updatedAt = $state('');
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let saved = $state('');

  async function loadHours() {
    loading = true;
    error = '';

    const res = await fetch('/api/admin/hours');
    const data = await res.json();

    if (!res.ok) {
      loading = false;
      error = data.error || 'Unable to load hours.';
      return;
    }

    rows = data.items ?? [];
    revision = data.meta?.revision ?? 0;
    updatedAt = data.meta?.updatedAt ?? '';
    loading = false;
  }

  async function saveHours() {
    saving = true;
    error = '';
    saved = '';

    const res = await fetch('/api/admin/hours', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: rows, baseRevision: revision })
    });
    const data = await res.json();

    saving = false;

    if (!res.ok || !data.ok) {
      error = data.error || 'Unable to save hours.';
      return;
    }

    rows = data.items ?? rows;
    revision = data.meta?.revision ?? revision;
    updatedAt = data.meta?.updatedAt ?? updatedAt;
    saved = 'Saved';
  }

  onMount(loadHours);
</script>

<section class="admin-panel grid gap-4">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Hours</h2>
      <p class="m-0 mt-1 text-xs text-[var(--admin-text-soft)]">Revision {revision}{#if updatedAt} • Updated {new Date(updatedAt).toLocaleString()}{/if}</p>
    </div>
    {#if saved}<p class="m-0 text-sm text-emerald-600">{saved}</p>{/if}
  </div>

  {#if loading}
    <p class="text-[var(--admin-text-soft)]">Loading hours...</p>
  {:else}
    <div class="grid gap-2">
      {#each rows as row, i}
        <div class="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 rounded-lg border p-2" style={`border-color: var(--admin-panel-border);`}>
          <input class="admin-input" bind:value={row.label} />
          <input class="admin-input" bind:value={row.opens} disabled={row.closed} />
          <input class="admin-input" bind:value={row.closes} disabled={row.closed} />
          <label class="text-sm"><input type="checkbox" bind:checked={rows[i].closed} /> Closed</label>
        </div>
      {/each}
    </div>

    {#if error}
      <p class="m-0 text-sm text-red-600">{error}</p>
      {#if error.includes('modified by another session')}
        <button class="admin-pill-ghost w-fit" onclick={loadHours}>Reload Latest</button>
      {/if}
    {/if}

    <div class="flex justify-end">
      <button class="admin-pill" onclick={saveHours} disabled={saving}>{saving ? 'Saving...' : 'Save Hours'}</button>
    </div>
  {/if}
</section>
