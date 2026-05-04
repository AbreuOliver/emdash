<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { api } from '$lib/admin/api-client';
  import IconLayoutDashboard from '@tabler/icons-svelte/icons/layout-dashboard';
  import IconArticle from '@tabler/icons-svelte/icons/article';
  import IconRosetteDiscount from '@tabler/icons-svelte/icons/rosette-discount';
  import IconClockHour4 from '@tabler/icons-svelte/icons/clock-hour-4';
  import IconPhoto from '@tabler/icons-svelte/icons/photo';
  import IconUserCircle from '@tabler/icons-svelte/icons/user-circle';
  import IconFileText from '@tabler/icons-svelte/icons/file-text';
  import IconPalette from '@tabler/icons-svelte/icons/palette';
  import IconSeo from '@tabler/icons-svelte/icons/seo';
  import IconHelpCircle from '@tabler/icons-svelte/icons/help-circle';
  import IconHeadset from '@tabler/icons-svelte/icons/headset';
  import IconExternalLink from '@tabler/icons-svelte/icons/external-link';
  import IconMenu2 from '@tabler/icons-svelte/icons/menu-2';
  import '$lib/admin/admin.css';
  let { children } = $props();

  let hasUnpublishedChanges = $state(false);
  let showPublishDialog = $state(false);
  let publishChanges = $state<string[]>([]);
  let publishLoading = $state(false);
  let publishing = $state(false);
  let sidebarCollapsed = $state(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', section: 'content', icon: IconLayoutDashboard },
    { id: 'posts', label: 'Posts', href: '/admin/posts', section: 'content', icon: IconArticle },
    { id: 'promotions', label: 'Promotions', href: '/admin/banners', section: 'content', icon: IconRosetteDiscount },
    { id: 'hours', label: 'Hours', href: '/admin/settings', section: 'content', icon: IconClockHour4 },
    { id: 'photos', label: 'Photos', href: '/admin/media', section: 'content', icon: IconPhoto },
    { id: 'site-profile', label: 'Site Profile', href: '/admin/settings', section: 'settings', icon: IconUserCircle },
    { id: 'pages', label: 'Pages', href: '/admin/pages', section: 'settings', icon: IconFileText },
    { id: 'appearance', label: 'Appearance', href: '/admin/template', section: 'settings', icon: IconPalette },
    { id: 'settings-seo', label: 'Settings & SEO', href: '/admin/settings', section: 'settings', icon: IconSeo }
  ];
  const topTabs = [
    { label: 'Site Profile', href: '/admin/settings' },
    { label: 'Pages', href: '/admin/pages' },
    { label: 'Posts', href: '/admin/posts' },
    { label: 'Promotions', href: '/admin/banners' },
    { label: 'Appearance', href: '/admin/template' }
  ];

  const activePath = $derived.by(() => {
    const pathName = page.url.pathname;
    if (pathName.startsWith('/admin/posts')) return '/admin/posts';
    if (pathName.startsWith('/admin/pages')) return '/admin/pages';
    if (pathName.startsWith('/admin/banners')) return '/admin/banners';
    if (pathName.startsWith('/admin/template')) return '/admin/template';
    if (pathName.startsWith('/admin/dashboard')) return '/admin/dashboard';
    return '/admin/settings';
  });
  const pageTitle = $derived(topTabs.find((item) => item.href === activePath)?.label ?? 'Site Profile');
  const activeSidebarId = $derived.by(() => {
    if (activePath === '/admin/dashboard') return 'dashboard';
    if (activePath === '/admin/posts') return 'posts';
    if (activePath === '/admin/banners') return 'promotions';
    if (activePath === '/admin/pages') return 'pages';
    if (activePath === '/admin/template') return 'appearance';
    return 'site-profile';
  });
  const sidebarStorageKey = 'symballo:admin:sidebar-collapsed';

  onMount(async () => {
    sidebarCollapsed = localStorage.getItem(sidebarStorageKey) === 'true';

    await checkUnpublished();
    window.addEventListener('open-publish', openPublishDialog);
    window.addEventListener('publish-complete', async () => {
      await checkUnpublished();
    });
  });

  $effect(() => {
    localStorage.setItem(sidebarStorageKey, String(sidebarCollapsed));
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
      window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Published successfully' }));
      window.dispatchEvent(new CustomEvent('publish-complete'));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `Publish failed: ${err instanceof Error ? err.message : 'unknown'}` }));
    } finally { publishing = false; }
  }

  function handleViewSite() { window.open('/', '_blank'); }
</script>

<div class="admin-shell" class:sidebar-collapsed={sidebarCollapsed}>
  <aside class="left-rail" class:collapsed={sidebarCollapsed} role="navigation" aria-label="Admin navigation">
    <div class="rail-brand">
      <div class="brand-title">Arthur's Hot Dogs</div>
      <div class="brand-subtitle">Clayton, NC</div>
    </div>
    <section class="rail-group">
      <div class="rail-section-title">General</div>
      <nav class="rail-nav">
        {#each navItems.filter((item) => item.section === 'content') as item}
          <a href={item.href} class="nav-link" class:active={activeSidebarId === item.id}>
            <item.icon size={16} stroke={1.8} />
            <span class="nav-label">{item.label}</span>
          </a>
        {/each}
      </nav>
    </section>
    <section class="rail-group">
      <div class="rail-section-title">Site</div>
      <nav class="rail-nav">
        {#each navItems.filter((item) => item.section === 'settings') as item}
          <a href={item.href} class="nav-link" class:active={activeSidebarId === item.id}>
            <item.icon size={16} stroke={1.8} />
            <span class="nav-label">{item.label}</span>
          </a>
        {/each}
      </nav>
    </section>
    <section class="rail-group">
      <div class="rail-section-title">Workspace</div>
      <nav class="rail-nav">
        <a class="nav-link" href="/account"><IconUserCircle size={16} stroke={1.8} /><span class="nav-label">Account</span></a>
        <a class="nav-link" href="/admin/settings"><IconHelpCircle size={16} stroke={1.8} /><span class="nav-label">Guide</span></a>
        <a class="nav-link" href="/admin/settings"><IconHeadset size={16} stroke={1.8} /><span class="nav-label">Support</span></a>
        <button class="nav-link rail-action" type="button" onclick={handleViewSite}><IconExternalLink size={16} stroke={1.8} /><span class="nav-label">Open site</span></button>
      </nav>
    </section>
    <div class="rail-account">
      <div class="rail-account-title">Your Symballo Account</div>
      <a class="nav-link" href="/admin/settings"><IconUserCircle size={16} stroke={1.8} /><span>Account Settings</span></a>
    </div>
    <div class="rail-footer">Powered by Symballo</div>
  </aside>

  <section class="center-shell">
    <header class="center-topbar">
      <div class="topbar-actions">
        <button
          class="btn btn-secondary icon-only"
          aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          onclick={() => (sidebarCollapsed = !sidebarCollapsed)}
        >
          <IconMenu2 size={16} stroke={1.8} />
        </button>
        <h1 class="app-section-title">{pageTitle}</h1>
      </div>
      <div class="topbar-meta">
        {#if hasUnpublishedChanges}
          <span class="unsaved">Unsaved changes</span>
          <button class="btn btn-primary" onclick={openPublishDialog}>Save Changes</button>
        {/if}
      </div>
    </header>

    <main class="center-main">
      <section class="content">
        {@render children?.()}
      </section>
    </main>
  </section>
</div>

{#if showPublishDialog}
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Publish changes">
    <div class="dialog" tabindex="-1">
      <h2>Publish Changes</h2>
      {#if publishLoading}
        <p>Loading changes...</p>
      {:else if publishChanges.length === 0}
        <p class="text-muted">No unpublished changes detected.</p>
      {:else}
        <ul class="change-list">
          {#each publishChanges as change}<li>{change}</li>{/each}
        </ul>
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
