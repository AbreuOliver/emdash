<script lang="ts">
  import { onMount } from 'svelte';

  type HoursEntry = { label: string; opens: string; closes: string; closed: boolean };

  let rows = $state<HoursEntry[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let saved = $state('');

  async function loadHours() {
    loading = true;
    error = '';

    const res = await fetch('/api/admin/content');
    const data = await res.json();

    if (!res.ok) {
      loading = false;
      error = data.error || 'Unable to load hours.';
      return;
    }

    rows = data.site.hours ?? [];
    loading = false;
  }

  async function saveHours() {
    saving = true;
    error = '';
    saved = '';

    const currentRes = await fetch('/api/admin/content');
    const current = await currentRes.json();

    if (!currentRes.ok) {
      saving = false;
      error = current.error || 'Unable to load current CMS data.';
      return;
    }

    const payload = {
      ...current,
      site: {
        ...current.site,
        hours: rows
      }
    };

    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    saving = false;

    if (!res.ok || !data.ok) {
      error = data.error || 'Unable to save hours.';
      return;
    }

    saved = 'Saved';
  }

  onMount(loadHours);
</script>

<section class="admin-panel grid gap-4">
  <div class="flex items-center justify-between">
    <h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Hours</h2>
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

    {#if error}<p class="m-0 text-sm text-red-600">{error}</p>{/if}

    <div class="flex justify-end">
      <button class="admin-pill" onclick={saveHours} disabled={saving}>{saving ? 'Saving...' : 'Save Hours'}</button>
    </div>
  {/if}
</section>
