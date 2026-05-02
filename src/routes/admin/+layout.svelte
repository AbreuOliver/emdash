<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let hasUnpublishedChanges = $state(false);
  let showPublishDialog = $state(false);
  let publishChanges = $state<string[]>([]);
  let publishLoading = $state(false);
  let publishing = $state(false);
  let toast = $state('');

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '◉' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙' },
    { label: 'Posts', href: '/admin/posts', icon: '✎' },
    { label: 'Pages', href: '/admin/pages', icon: '☰' },
    { label: 'Events', href: '/admin/events', icon: '◷' },
    { label: 'Banners', href: '/admin/banners', icon: '▬' },
    { label: 'Media', href: '/admin/media', icon: '▣' },
    { label: 'Template', href: '/admin/template', icon: '▧' },
  ];

  onMount(async () => {
    await checkUnpublished();
    window.addEventListener('open-publish', openPublishDialog);
    window.addEventListener('show-toast', (e: Event) => {
      showToast((e as CustomEvent).detail);
    });
    window.addEventListener('publish-complete', async () => {
      await checkUnpublished();
    });
  });

  async function checkUnpublished() {
    try {
      const [dp, pp, dpg, ppg] = await Promise.all([
        api.getPosts('draft'), api.getPosts('published'),
        api.getPages('draft'), api.getPages('published'),
      ]);
      const draftBanners = await api.getBanners();
      const publishedBanners = await api.getBanners();
      hasUnpublishedChanges = JSON.stringify(dp) !== JSON.stringify(pp) ||
        JSON.stringify(dpg) !== JSON.stringify(ppg) ||
        (draftBanners as Array<unknown>).length !== (publishedBanners as Array<unknown>).length;
    } catch { hasUnpublishedChanges = false; }
  }

  async function openPublishDialog() {
    showPublishDialog = true;
    publishLoading = true;
    try {
      const data = await api.getDiff() as { changes: string[] };
      publishChanges = data.changes || [];
    } catch { publishChanges = ['Unable to load changes']; }
    finally { publishLoading = false; }
  }

  function closePublishDialog() { showPublishDialog = false; }

  async function confirmPublish() {
    publishing = true;
    try {
      await api.publish({ type: 'all' });
      showPublishDialog = false;
      showToast('Published successfully');
      await checkUnpublished();
    } catch (err) {
      showToast(`Publish failed: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally { publishing = false; }
  }

  function handlePreview() { window.open(api.previewUrl(), '_blank'); }
  function showToast(msg: string) { toast = msg; setTimeout(() => (toast = ''), 3000); }
</script>

<svelte:head><title>EmDash Admin</title></svelte:head>

<div class="admin-shell">
  <aside class="sidebar" role="navigation" aria-label="Admin navigation">
    <div class="sidebar-header"><a href="/admin" class="logo">EmDash</a></div>
    <nav>
      <ul>
        {#each navItems as item}
          <li>
            <a href={item.href} class="nav-link">
              <span class="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    <div class="sidebar-footer"><a href="/" target="_blank" class="view-site">View Site ↗</a></div>
  </aside>

  <div class="main-content">
    <header class="admin-header">
      <div class="header-left"><h1 class="page-title"><slot name="title" /></h1></div>
      <div class="header-right">
        {#if hasUnpublishedChanges}
          <span class="unpublished-indicator">Unpublished changes</span>
          <button class="btn btn-secondary" onclick={openPublishDialog}>Publish</button>
        {/if}
        <button class="btn btn-secondary" onclick={handlePreview}>Preview</button>
      </div>
    </header>
    <main class="content"><slot /></main>
  </div>
</div>

{#if showPublishDialog}
  <div class="overlay" onclick={closePublishDialog} role="dialog" aria-modal="true" aria-label="Publish changes">
    <div class="dialog" onclick={(e) => e.stopPropagation()} tabindex="-1">
      <h2>Publish Changes</h2>
      {#if publishLoading}
        <p>Loading changes...</p>
      {:else if publishChanges.length === 0}
        <p style="color:#6b7280;">No unpublished changes detected.</p>
      {:else}
        <ul class="change-list">{#each publishChanges as change}<li>{change}</li>{/each}</ul>
      {/if}
      <div class="dialog-actions">
        <button class="btn" onclick={closePublishDialog} disabled={publishing}>Cancel</button>
        <button class="btn btn-primary" onclick={confirmPublish} disabled={publishing || publishChanges.length === 0}>
          {publishing ? 'Publishing...' : 'Publish All'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if toast}<div class="toast">{toast}</div>{/if}


