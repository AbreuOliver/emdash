<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../+layout.svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  const defaultHours = [
    { label: 'Monday', opens: '09:00', closes: '17:00', closed: false },
    { label: 'Tuesday', opens: '09:00', closes: '17:00', closed: false },
    { label: 'Wednesday', opens: '09:00', closes: '17:00', closed: false },
    { label: 'Thursday', opens: '09:00', closes: '17:00', closed: false },
    { label: 'Friday', opens: '09:00', closes: '17:00', closed: false },
    { label: 'Saturday', opens: '10:00', closes: '15:00', closed: false },
    { label: 'Sunday', opens: '', closes: '', closed: true },
    { label: 'Christmas', opens: '', closes: '', closed: true },
  ];

  let title = $state('');
  let tagline = $state('');
  let phone = $state('');
  let email = $state('');
  let address = $state('');
  let facebookUrl = $state('');
  let instagramUrl = $state('');
  let hours = $state<Array<Record<string, string | boolean | number>>>(defaultHours.map((h, i) => ({ ...h, sortOrder: i })));
  let loading = $state(true);
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});
  let activeTab = $state<'identity' | 'hours'>('identity');

  onMount(async () => {
    try {
      const [settings, hoursData] = await Promise.all([api.getSettings('draft'), api.getHours('draft')]);
      const s = settings as Record<string, string>;
      if (Object.keys(s).length > 0) {
        title = s.title ?? ''; tagline = s.tagline ?? ''; phone = s.phone ?? '';
        email = s.email ?? ''; address = s.address ?? ''; facebookUrl = s.facebookUrl ?? ''; instagramUrl = s.instagramUrl ?? '';
      }
      const h = hoursData as Array<Record<string, string | boolean>>;
      if (h.length > 0) hours = h;
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      loading = false;
    }
  });

  function validateIdentity(): boolean {
    errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
    if (facebookUrl && !/^https?:\/\/.+/.test(facebookUrl)) errors.facebookUrl = 'Must be a valid URL';
    if (instagramUrl && !/^https?:\/\/.+/.test(instagramUrl)) errors.instagramUrl = 'Must be a valid URL';
    return Object.keys(errors).length === 0;
  }

  async function saveIdentity() {
    if (!validateIdentity()) return;
    saving = true;
    try {
      await api.saveSettings({ title, tagline, phone, email, address, facebookUrl, instagramUrl });
      showToast('Settings saved');
    } catch (err) {
      showToast(`Save failed: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      saving = false;
    }
  }

  async function saveHours() {
    saving = true;
    try {
      const hoursData = hours.map((h, i) => ({
        label: h.label as string,
        opens: (h.closed ? '' : h.opens) as string,
        closes: (h.closed ? '' : h.closes) as string,
        closed: h.closed as boolean,
        sortOrder: i,
      }));
      await api.saveHours(hoursData);
      showToast('Hours saved');
    } catch (err) {
      showToast(`Save failed: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      saving = false;
    }
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>

<Layout>
  <svelte:fragment slot="title">Settings</svelte:fragment>

  {#if loading}
    <div class="card" style="text-align:center;padding:2rem;">Loading...</div>
  {:else}
    <div class="tabs">
      <button class="tab {activeTab === 'identity' ? 'active' : ''}" onclick={() => activeTab = 'identity'}>Business Identity</button>
      <button class="tab {activeTab === 'hours' ? 'active' : ''}" onclick={() => activeTab = 'hours'}>Hours</button>
    </div>

    {#if activeTab === 'identity'}
      <div class="card form">
        <div class="form-group">
          <label for="title">Business Name *</label>
          <input id="title" type="text" bind:value={title} />
          {#if errors.title}<p class="error">{errors.title}</p>{/if}
        </div>
        <div class="form-group">
          <label for="tagline">Tagline</label>
          <input id="tagline" type="text" bind:value={tagline} />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input id="phone" type="tel" bind:value={phone} />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" bind:value={email} />
          {#if errors.email}<p class="error">{errors.email}</p>{/if}
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input id="address" type="text" bind:value={address} />
        </div>
        <div class="form-group">
          <label for="facebookUrl">Facebook URL</label>
          <input id="facebookUrl" type="url" placeholder="https://facebook.com/..." bind:value={facebookUrl} />
          {#if errors.facebookUrl}<p class="error">{errors.facebookUrl}</p>{/if}
        </div>
        <div class="form-group">
          <label for="instagramUrl">Instagram URL</label>
          <input id="instagramUrl" type="url" placeholder="https://instagram.com/..." bind:value={instagramUrl} />
          {#if errors.instagramUrl}<p class="error">{errors.instagramUrl}</p>{/if}
        </div>
        <button class="btn btn-primary" onclick={saveIdentity} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    {:else}
      <div class="card">
        <div class="hours-list">
          {#each hours as h, i (h.label)}
            <div class="hours-row">
              <span class="hours-label">{h.label}</span>
              <label class="toggle">
                <input type="checkbox" bind:value={h.closed} />
                <span class="toggle-label">{h.closed ? 'Closed' : 'Open'}</span>
              </label>
              {#if !h.closed}
                <input type="time" bind:value={h.opens} aria-label="{h.label} opens" />
                <span>to</span>
                <input type="time" bind:value={h.closes} aria-label="{h.label} closes" />
              {/if}
            </div>
          {/each}
        </div>
        <div style="margin-top:1rem;">
          <button class="btn btn-primary" onclick={saveHours} disabled={saving}>
            {saving ? 'Saving...' : 'Save Hours'}
          </button>
        </div>
      </div>
    {/if}
  {/if}
</Layout>
