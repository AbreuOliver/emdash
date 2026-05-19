<script lang="ts">
  import { onMount } from 'svelte';

  type Post = {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    body: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    seoNoIndex: boolean;
    bannerEnabled: boolean;
    bannerStartDate: string;
    bannerEndDate: string;
  };

  const emptyPost = (): Post => ({
    slug: '',
    title: 'Untitled Post',
    excerpt: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    body: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoNoIndex: false,
    bannerEnabled: false,
    bannerStartDate: '',
    bannerEndDate: ''
  });

  let posts = $state<Post[]>([]);
  let selectedIndex = $state(0);
  let revision = $state(0);
  let updatedAt = $state('');
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let saved = $state('');

  const selected = $derived(posts[selectedIndex]);

  function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async function loadPosts() {
    loading = true;
    error = '';
    const res = await fetch('/api/admin/posts');
    const data = await res.json();

    if (!res.ok) {
      loading = false;
      error = data.error || 'Unable to load posts.';
      return;
    }

    posts = data.items ?? [];
    revision = data.meta?.revision ?? 0;
    updatedAt = data.meta?.updatedAt ?? '';
    selectedIndex = 0;
    loading = false;
  }

  function addPost() {
    posts = [...posts, emptyPost()];
    selectedIndex = posts.length - 1;
    saved = '';
  }

  function removeSelectedPost() {
    if (!posts.length) return;
    posts = posts.filter((_, i) => i !== selectedIndex);
    selectedIndex = Math.max(0, selectedIndex - 1);
    saved = '';
  }

  async function savePosts() {
    saving = true;
    error = '';
    saved = '';

    const saveRes = await fetch('/api/admin/posts', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: posts, baseRevision: revision })
    });
    const saveData = await saveRes.json();

    saving = false;

    if (!saveRes.ok || !saveData.ok) {
      error = saveData.error || 'Unable to save posts.';
      return;
    }

    posts = saveData.items ?? posts;
    revision = saveData.meta?.revision ?? revision;
    updatedAt = saveData.meta?.updatedAt ?? updatedAt;
    saved = 'Saved';
  }

  onMount(loadPosts);
</script>

<section class="admin-panel grid gap-4">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Posts</h2>
      <p class="m-0 mt-1 text-xs text-[var(--admin-text-soft)]">Revision {revision}{#if updatedAt} • Updated {new Date(updatedAt).toLocaleString()}{/if}</p>
    </div>
    <div class="flex gap-2">
      {#if saved}<p class="m-0 self-center text-sm text-emerald-600">{saved}</p>{/if}
      <button class="admin-pill-ghost" onclick={addPost}>New Post</button>
      <button class="admin-pill" onclick={savePosts} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </div>
  </div>

  {#if loading}
    <p class="text-[var(--admin-text-soft)]">Loading posts...</p>
  {:else}
    <div class="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside class="grid gap-2">
        {#each posts as post, i}
          <button class={`admin-list-item ${i === selectedIndex ? 'active' : ''}`} onclick={() => (selectedIndex = i)}>
            <strong>{post.title || 'Untitled Post'}</strong>
            <span class="text-xs opacity-70">/{post.slug || 'no-slug'} • {post.publishedAt}</span>
          </button>
        {/each}
      </aside>

      {#if selected}
        <div class="grid gap-3">
          <div class="grid gap-3 md:grid-cols-2">
            <label class="admin-label">Title<input class="admin-input" bind:value={selected.title} /></label>
            <label class="admin-label">Slug
              <div class="flex gap-2">
                <input class="admin-input" bind:value={selected.slug} />
                <button class="admin-pill-ghost" type="button" onclick={() => (selected.slug = slugify(selected.title))}>Auto</button>
              </div>
            </label>
            <label class="admin-label">Published At<input class="admin-input" bind:value={selected.publishedAt} placeholder="YYYY-MM-DD" /></label>
            <label class="admin-label">Excerpt<textarea class="admin-textarea min-h-24" bind:value={selected.excerpt}></textarea></label>
            <label class="admin-label md:col-span-2">Body<textarea class="admin-textarea min-h-48" bind:value={selected.body}></textarea></label>
          </div>

          <div class="grid gap-3 rounded-xl border p-3" style={`border-color: var(--admin-panel-border);`}>
            <p class="m-0 text-sm font-semibold text-[var(--admin-text-strong)]">SEO</p>
            <label class="admin-label">SEO Title<input class="admin-input" bind:value={selected.seoTitle} /></label>
            <label class="admin-label">SEO Description<textarea class="admin-textarea min-h-20" bind:value={selected.seoDescription}></textarea></label>
            <label class="admin-label">SEO Keywords<input class="admin-input" bind:value={selected.seoKeywords} /></label>
            <label class="admin-label"><input type="checkbox" bind:checked={selected.seoNoIndex} /> No index</label>
          </div>

          <div class="grid gap-3 rounded-xl border p-3" style={`border-color: var(--admin-panel-border);`}>
            <label class="admin-label"><input type="checkbox" bind:checked={selected.bannerEnabled} /> Enable banner</label>
            <div class="grid gap-3 md:grid-cols-2">
              <label class="admin-label">Banner Start<input class="admin-input" bind:value={selected.bannerStartDate} placeholder="YYYY-MM-DD" disabled={!selected.bannerEnabled} /></label>
              <label class="admin-label">Banner End<input class="admin-input" bind:value={selected.bannerEndDate} placeholder="YYYY-MM-DD" disabled={!selected.bannerEnabled} /></label>
            </div>
          </div>

          <div class="flex justify-end">
            <button class="admin-icon-danger" onclick={removeSelectedPost} aria-label="Delete post">Delete</button>
          </div>
        </div>
      {:else}
        <p class="text-[var(--admin-text-soft)]">No posts yet. Add one to start.</p>
      {/if}
    </div>

    {#if error}
      <p class="m-0 text-sm text-red-600">{error}</p>
      {#if error.includes('modified by another session')}
        <button class="admin-pill-ghost w-fit" onclick={loadPosts}>Reload Latest</button>
      {/if}
    {/if}
  {/if}
</section>
