<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let title = $state('');
  let slug = $state('');
  let excerpt = $state('');
  let body = $state('');
  let publishedAt = $state('');
  let seoTitle = $state('');
  let seoDescription = $state('');
  let seoKeywords = $state('');
  let seoNoIndex = $state(false);
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});
  let isNew = $state(true);

  onMount(async () => {
    const p = $page;
    const pathSegments = p.url.pathname.split('/').filter(Boolean);
    const slugParam = pathSegments[pathSegments.length - 1];
    isNew = slugParam === 'new';

    if (!isNew) {
      try {
        const post = await api.getPost(slugParam, 'draft') as Record<string, string>;
        title = post.title;
        slug = post.slug;
        excerpt = post.excerpt || '';
        body = post.body || '';
        publishedAt = post.publishedAt || '';
        seoTitle = post.seoTitle || '';
        seoDescription = post.seoDescription || '';
        seoKeywords = post.seoKeywords || '';
        seoNoIndex = post.seoNoIndex === '1' || post.seoNoIndex === 'true';
      } catch {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Post not found' }));
      }
    }
  });

  function generateSlug() {
    if (isNew && title && !slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
  }

  function validate(): boolean {
    errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!slug.trim()) errors.slug = 'Slug is required';
    return Object.keys(errors).length === 0;
  }

  async function save() {
    if (!validate()) return;
    saving = true;
    try {
      const data = { title, slug, excerpt, body, publishedAt: publishedAt || null, seoTitle, seoDescription, seoKeywords, seoNoIndex };
      if (isNew) {
        await api.createPost(data);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Post created' }));
      } else {
        await api.updatePost(slug, data);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Post saved' }));
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `Save failed: ${err instanceof Error ? err.message : 'unknown'}` }));
    } finally {
      saving = false;
    }
  }

  function insertMd(prefix: string, suffix?: string) {
    const el = document.getElementById('md-body') as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.substring(start, end);
    const wrap = suffix ?? prefix;
    const replacement = selected ? `${prefix}${selected}${wrap}` : `${prefix}text${wrap}`;
    body = body.substring(0, start) + replacement + body.substring(end);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + replacement.length;
    });
  }
</script>

<div class="editor-layout">
  <div class="editor-main">
    <div class="card form">
      <div class="form-group">
        <label for="title">Title *</label>
        <input id="title" type="text" bind:value={title} oninput={generateSlug} />
        {#if errors.title}<p class="error">{errors.title}</p>{/if}
      </div>
      <div class="form-group">
        <label for="slug">Slug *</label>
        <input id="slug" type="text" bind:value={slug} />
        {#if errors.slug}<p class="error">{errors.slug}</p>{/if}
      </div>
      <div class="form-group">
        <label for="excerpt">Excerpt</label>
        <textarea id="excerpt" rows="2" bind:value={excerpt}></textarea>
      </div>
      <div class="form-group">
        <label for="md-body">Body (Markdown)</label>
        <div class="md-toolbar">
          <button type="button" onclick={() => insertMd('**')} title="Bold"><b>B</b></button>
          <button type="button" onclick={() => insertMd('*')} title="Italic"><i>I</i></button>
          <button type="button" onclick={() => insertMd('## ')} title="Heading">H2</button>
          <button type="button" onclick={() => insertMd('[', ']()')} title="Link">Link</button>
          <button type="button" onclick={() => insertMd('- ')} title="List">•</button>
          <button type="button" onclick={() => insertMd('1. ')} title="Numbered List">1.</button>
          <button type="button" onclick={() => insertMd('> ')} title="Quote">❝</button>
        </div>
        <textarea id="md-body" rows="16" bind:value={body} style="font-family:monospace;"></textarea>
      </div>
    </div>
  </div>

  <div class="editor-sidebar">
    <div class="card">
      <h3>Publishing</h3>
      <div class="form-group">
        <label for="publishedAt">Publish Date</label>
        <input id="publishedAt" type="date" bind:value={publishedAt} />
      </div>
      <button class="btn btn-primary" onclick={save} disabled={saving} style="width:100%;">
        {saving ? 'Saving...' : (isNew ? 'Create Post' : 'Save Post')}
      </button>
    </div>

    <div class="card" style="margin-top:1rem;">
      <h3>SEO</h3>
      <div class="form-group">
        <label for="seoTitle">SEO Title</label>
        <input id="seoTitle" type="text" bind:value={seoTitle} />
      </div>
      <div class="form-group">
        <label for="seoDescription">SEO Description</label>
        <textarea id="seoDescription" rows="2" bind:value={seoDescription}></textarea>
      </div>
      <div class="form-group">
        <label for="seoKeywords">Keywords</label>
        <input id="seoKeywords" type="text" bind:value={seoKeywords} />
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={seoNoIndex} />
          No index (hide from search engines)
        </label>
      </div>
    </div>
  </div>
</div>
