<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../+layout.svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let events = $state<Array<Record<string, string>>>([]);
  let loading = $state(true);
  let showUpcoming = $state(true);

  onMount(loadEvents);

  async function loadEvents() {
    try {
      const data = await api.getEvents('draft', showUpcoming);
      events = data as Array<Record<string, string>>;
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally { loading = false; }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return;
    try {
      await api.deleteEvent(id);
      events = events.filter((e) => e.id !== id);
      showToast('Event deleted');
    } catch (err) {
      showToast(`Delete failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  function formatDate(d: string) {
    return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>

<Layout>
  <svelte:fragment slot="title">
    Events
    <a href="/admin/events/new" class="btn btn-primary" style="margin-left:1rem;">New Event</a>
  </svelte:fragment>

  <div class="card" style="margin-bottom:1rem;display:flex;gap:0.5rem;">
    <button class="btn {showUpcoming ? 'btn-primary' : ''}" onclick={() => { showUpcoming = true; loadEvents(); }}>Upcoming</button>
    <button class="btn {!showUpcoming ? 'btn-primary' : ''}" onclick={() => { showUpcoming = false; loadEvents(); }}>All</button>
  </div>

  {#if loading}
    <div class="card" style="text-align:center;padding:2rem;">Loading...</div>
  {:else if events.length === 0}
    <div class="card empty-state">
      <h3>No events yet</h3>
      <p>Create events to showcase upcoming activities.</p>
      <a href="/admin/events/new" class="btn btn-primary">Create Event</a>
    </div>
  {:else}
    <div class="card">
      <table class="data-table">
        <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Actions</th></tr></thead>
        <tbody>
          {#each events as event}
            <tr>
              <td><a href="/admin/events/{event.id}">{event.title}</a></td>
              <td>{formatDate(event.startDateTime ?? '')}</td>
              <td>{event.location || '—'}</td>
              <td>
                <a href="/admin/events/{event.id}" class="btn">Edit</a>
                <button class="btn btn-danger" style="margin-left:0.375rem;" onclick={() => deleteEvent(event.id)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</Layout>
