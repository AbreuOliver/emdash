<script lang="ts">
  import { onMount } from 'svelte';

  type SiteForm = {
    title: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    facebookUrl: string;
    instagramUrl: string;
  };

  let form = $state<SiteForm>({
    title: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    facebookUrl: '',
    instagramUrl: ''
  });

  let revision = $state(0);
  let updatedAt = $state('');
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let saved = $state('');

  async function loadProfile() {
    loading = true;
    error = '';

    const res = await fetch('/api/admin/site-profile');
    const data = await res.json();

    if (!res.ok) {
      loading = false;
      error = data.error || 'Unable to load site profile.';
      return;
    }

    form = {
      title: data.item.title ?? '',
      tagline: data.item.tagline ?? '',
      phone: data.item.phone ?? '',
      email: data.item.email ?? '',
      address: data.item.address ?? '',
      facebookUrl: data.item.facebookUrl ?? '',
      instagramUrl: data.item.instagramUrl ?? ''
    };

    revision = data.meta?.revision ?? 0;
    updatedAt = data.meta?.updatedAt ?? '';
    loading = false;
  }

  async function saveProfile() {
    saving = true;
    saved = '';
    error = '';

    const saveRes = await fetch('/api/admin/site-profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ item: form, baseRevision: revision })
    });
    const saveData = await saveRes.json();

    saving = false;

    if (!saveRes.ok || !saveData.ok) {
      error = saveData.error || 'Unable to save site profile.';
      return;
    }

    form = saveData.item;
    revision = saveData.meta?.revision ?? revision;
    updatedAt = saveData.meta?.updatedAt ?? updatedAt;
    saved = 'Saved';
  }

  onMount(loadProfile);
</script>

<section class="admin-panel grid gap-4">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Site Profile</h2>
      <p class="m-0 mt-1 text-xs text-[var(--admin-text-soft)]">Revision {revision}{#if updatedAt} • Updated {new Date(updatedAt).toLocaleString()}{/if}</p>
    </div>
    {#if saved}<p class="m-0 text-sm text-emerald-600">{saved}</p>{/if}
  </div>

  {#if loading}
    <p class="text-[var(--admin-text-soft)]">Loading profile...</p>
  {:else}
    <div class="grid gap-3 md:grid-cols-2">
      <label class="admin-label">Business Name<input class="admin-input" bind:value={form.title} /></label>
      <label class="admin-label">Phone<input class="admin-input" bind:value={form.phone} /></label>
      <label class="admin-label">Tagline<input class="admin-input" bind:value={form.tagline} /></label>
      <label class="admin-label">Email<input class="admin-input" bind:value={form.email} /></label>
      <label class="admin-label md:col-span-2">Address<input class="admin-input" bind:value={form.address} /></label>
      <label class="admin-label">Facebook URL<input class="admin-input" bind:value={form.facebookUrl} /></label>
      <label class="admin-label">Instagram URL<input class="admin-input" bind:value={form.instagramUrl} /></label>
    </div>

    {#if error}
      <p class="m-0 text-sm text-red-600">{error}</p>
      {#if error.includes('modified by another session')}
        <button class="admin-pill-ghost w-fit" onclick={loadProfile}>Reload Latest</button>
      {/if}
    {/if}

    <div class="flex justify-end">
      <button class="admin-pill" onclick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
    </div>
  {/if}
</section>
