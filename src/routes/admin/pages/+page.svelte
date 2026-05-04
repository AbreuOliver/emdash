<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let pages = $state<Array<Record<string, string>>>([]);
  let loading = $state(true);

  onMount(loadPages);

  async function loadPages() {
    try {
      const data = await api.getPages('draft');
      pages = data as Array<Record<string, string>>;
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      loading = false;
    }
  }

  async function deletePage(slug: string) {
    if (!confirm('Delete this page?')) return;
    try {
      await api.deletePage(slug);
      pages = pages.filter((p) => p.slug !== slug);
      showToast('Page deleted');
    } catch (err) {
      showToast(`Delete failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>

    Pages
    <a href="/admin/pages/new" class="btn btn-primary" style="margin-left:1rem;">New Page</a>

  {#if loading}
    <div class="card" style="text-align:center;padding:2rem;">Loading...</div>
  {:else if pages.length === 0}
    <div class="card empty-state">
      <h3>No pages yet</h3>
      <p>Create static pages like About, Contact, etc.</p>
      <a href="/admin/pages/new" class="btn btn-primary">Create Page</a>
    </div>
  {:else}
    <div class="card">
      <table class="data-table">
        <thead><tr><th>Title</th><th>Slug</th><th>Actions</th></tr></thead>
        <tbody>
          {#each pages as p}
            <tr>
              <td><a href="/admin/pages/{p.slug}">{p.title}</a></td>
              <td><code>{p.slug}</code></td>
              <td>
                <a href="/admin/pages/{p.slug}" class="btn">Edit</a>
                <button class="btn btn-danger" style="margin-left:0.375rem;" onclick={() => deletePage(p.slug)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
