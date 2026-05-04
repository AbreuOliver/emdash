<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let posts = $state<Array<Record<string, string>>>([]);
  let events = $state<Array<Record<string, string>>>([]);
  let banners = $state<Array<Record<string, unknown>>>([]);
  let settings = $state<Record<string, string>>({});
  let loading = $state(true);

  onMount(async () => {
    try {
      const [p, e, b, s] = await Promise.all([
        api.getPosts('published'),
        api.getEvents('published', true),
        api.getBanners(),
        api.getSettings('published'),
      ]);
      posts = p as Array<Record<string, string>>;
      events = e as Array<Record<string, string>>;
      banners = b as Array<Record<string, unknown>>;
      settings = s as Record<string, string>;
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `Failed to load: ${err instanceof Error ? err.message : 'unknown'}` }));
    } finally {
      loading = false;
    }
  });

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function handlePublish() {
    window.dispatchEvent(new CustomEvent('open-publish'));
  }
</script>

{#if loading}
  <div class="card" style="text-align:center;padding:2rem;">Loading...</div>
{:else}
  <div class="dashboard-grid">
    <div class="card stat">
      <h3>{posts.length}</h3>
      <p>Published Posts</p>
    </div>
    <div class="card stat">
      <h3>{events.length}</h3>
      <p>Upcoming Events</p>
    </div>
    <div class="card stat">
      <h3>{banners.filter((b) => b.isActive).length}</h3>
      <p>Active Banners</p>
    </div>
  </div>

  <div class="section">
    <h2>Quick Actions</h2>
    <div class="quick-actions">
      <a href="/admin/posts/new" class="btn btn-primary">New Post</a>
      <a href="/admin/settings" class="btn">Edit Hours</a>
      <button class="btn btn-primary" onclick={handlePublish}>Publish Changes</button>
    </div>
  </div>

  <div class="section">
    <h2>Recent Posts</h2>
    {#if posts.length === 0}
      <div class="empty-state">
        <h3>No posts yet</h3>
        <p><a href="/admin/posts/new">Create your first post</a></p>
      </div>
    {:else}
      <table class="data-table">
        <thead><tr><th>Title</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {#each posts.slice(0, 5) as post}
            <tr>
              <td><a href="/admin/posts/{post.slug}">{post.title}</a></td>
              <td>{post.publishedAt ? formatDate(post.publishedAt) : '—'}</td>
              <td><a href="/admin/posts/{post.slug}" class="btn">Edit</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <div class="section">
    <h2>Upcoming Events</h2>
    {#if events.length === 0}
      <p class="text-muted">No upcoming events.</p>
    {:else}
      <table class="data-table">
        <thead><tr><th>Title</th><th>Date</th><th>Location</th></tr></thead>
        <tbody>
          {#each events.slice(0, 5) as event}
            <tr>
              <td><a href="/admin/events/{event.id}">{event.title}</a></td>
              <td>{event.startDateTime ? formatDate(event.startDateTime) : '—'}</td>
              <td>{event.location || '—'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
{/if}
