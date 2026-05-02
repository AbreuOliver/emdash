<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../+layout.svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let posts = $state<Array<Record<string, string>>>([]);
  let loading = $state(true);

  onMount(loadPosts);

  async function loadPosts() {
    try {
      const data = await api.getPosts('draft');
      posts = data as Array<Record<string, string>>;
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      loading = false;
    }
  }

  async function deletePost(slug: string) {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deletePost(slug);
      posts = posts.filter((p) => p.slug !== slug);
      showToast('Post deleted');
    } catch (err) {
      showToast(`Delete failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  function formatDate(d: string) {
    return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>

<Layout>
  <svelte:fragment slot="title">
    Posts
    <a href="/admin/posts/new" class="btn btn-primary" style="margin-left:1rem;">New Post</a>
  </svelte:fragment>

  {#if loading}
    <div class="card" style="text-align:center;padding:2rem;">Loading...</div>
  {:else if posts.length === 0}
    <div class="card empty-state">
      <h3>No posts yet</h3>
      <p>Create your first post to share news and updates.</p>
      <a href="/admin/posts/new" class="btn btn-primary">Create Post</a>
    </div>
  {:else}
    <div class="card">
      <table class="data-table">
        <thead>
          <tr><th>Title</th><th>Slug</th><th>Published</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {#each posts as post}
            <tr>
              <td><a href="/admin/posts/{post.slug}">{post.title}</a></td>
              <td><code>{post.slug}</code></td>
              <td>{formatDate(post.publishedAt ?? '')}</td>
              <td>
                <a href="/admin/posts/{post.slug}" class="btn">Edit</a>
                <button class="btn btn-danger" style="margin-left:0.375rem;" onclick={() => deletePost(post.slug)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</Layout>
