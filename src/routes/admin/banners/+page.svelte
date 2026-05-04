<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let banners = $state<Array<Record<string, unknown>>>([]);
  let editing = $state(false);
  let editId = $state('');
  let text = $state('');
  let enabled = $state(false);
  let startDate = $state('');
  let endDate = $state('');
  let variant = $state<'info' | 'warning' | 'success'>('info');
  let saving = $state(false);

  onMount(loadBanners);

  async function loadBanners() {
    try {
      const data = await api.getBanners();
      banners = data as Array<Record<string, unknown>>;
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  function startEdit(b?: Record<string, unknown>) {
    if (b) {
      editing = true;
      editId = b.id as string;
      text = b.text as string;
      enabled = b.enabled as boolean;
      startDate = (b.startDate as string) ?? '';
      endDate = (b.endDate as string) ?? '';
      variant = (b.variant as 'info' | 'warning' | 'success') ?? 'info';
    } else {
      editing = true;
      editId = '';
      text = '';
      enabled = false;
      startDate = '';
      endDate = '';
      variant = 'info';
    }
  }

  async function saveBanner() {
    if (!text.trim()) return;
    saving = true;
    try {
      const data = { text, enabled, startDate: startDate || null, endDate: endDate || null, variant };
      if (editId) {
        await api.updateBanner(editId, data);
        showToast('Banner saved');
      } else {
        await api.createBanner(data);
        showToast('Banner created');
      }
      editing = false;
      await loadBanners();
    } catch (err) {
      showToast(`Save failed: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      saving = false;
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.deleteBanner(id);
      banners = banners.filter((b) => b.id !== id);
      showToast('Banner deleted');
    } catch (err) {
      showToast(`Delete failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  function isActive(b: Record<string, unknown>): boolean {
    if (!b.enabled) return false;
    const now = new Date();
    if (b.startDate && now < new Date(b.startDate as string)) return false;
    if (b.endDate && now > new Date(b.endDate as string)) return false;
    return true;
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>

    Banners
    <button class="btn btn-primary" style="margin-left:1rem;" onclick={() => startEdit()}>New Banner</button>

  {#if editing}
    <div class="card form" style="max-width:500px;">
      <h3>{editId ? 'Edit Banner' : 'New Banner'}</h3>
      <div class="form-group">
        <label for="banner-text">Text *</label>
        <textarea id="banner-text" rows="3" bind:value={text}></textarea>
      </div>
      <div class="form-group">
        <label class="checkbox-label"><input type="checkbox" bind:checked={enabled} /> Enabled</label>
      </div>
      <div class="form-group">
        <label for="banner-start">Start Date (optional)</label>
        <input id="banner-start" type="date" bind:value={startDate} />
      </div>
      <div class="form-group">
        <label for="banner-end">End Date (optional)</label>
        <input id="banner-end" type="date" bind:value={endDate} />
      </div>
      <div class="form-group">
        <label for="banner-variant">Variant</label>
        <select id="banner-variant" bind:value={variant}>
          <option value="info">Info (Blue)</option>
          <option value="warning">Warning (Amber)</option>
          <option value="success">Success (Green)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.5rem;">
        <button class="btn btn-primary" onclick={saveBanner} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button class="btn" onclick={() => editing = false}>Cancel</button>
      </div>
    </div>
  {:else}
    {#if banners.length === 0}
      <div class="card empty-state">
        <h3>No banners yet</h3>
        <p>Create sitewide banners for announcements or promotions.</p>
        <button class="btn btn-primary" onclick={() => startEdit()}>Create Banner</button>
      </div>
    {:else}
      <div class="card">
        <table class="data-table">
          <thead><tr><th>Text</th><th>Status</th><th>Dates</th><th>Variant</th><th>Actions</th></tr></thead>
          <tbody>
            {#each banners as b}
              <tr>
                <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{b.text}</td>
                <td>
                  {#if isActive(b)}
                    <span style="color:#059669;font-weight:500;">Active</span>
                  {:else}
                    <span style="color:#6b7280;">Inactive</span>
                  {/if}
                </td>
                <td>{b.startDate || '—'} {b.endDate ? `→ ${b.endDate}` : ''}</td>
                <td><span class="badge badge-{b.variant}">{b.variant}</span></td>
                <td>
                  <button class="btn" onclick={() => startEdit(b)}>Edit</button>
                  <button class="btn btn-danger" style="margin-left:0.375rem;" onclick={() => deleteBanner(b.id as string)}>Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
