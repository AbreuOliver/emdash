<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let templates = $state<Array<Record<string, unknown>>>([]);
  let currentTemplate = $state('default');
  let loading = $state(true);
  let saving = $state(false);

  onMount(async () => {
    try {
      const [t, s] = await Promise.all([api.getTemplates(), api.getSettings('published')]);
      templates = t as Array<Record<string, unknown>>;
      currentTemplate = (s as Record<string, string>)?.template || 'default';
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      loading = false;
    }
  });

  async function selectTemplate(id: string) {
    saving = true;
    try {
      await api.saveSettings({ template: id });
      currentTemplate = id;
      showToast('Template saved (unpublished)');
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


  {#if loading}
    <div class="card" style="text-align:center;padding:2rem;">Loading...</div>
  {:else}
    <p style="margin-bottom:1rem;color:#6b7280;font-size:0.875rem;">Choose a template for your website. Changes are saved as draft — publish to apply.</p>
    <div class="template-grid">
      {#each templates as t}
        <div class="template-card" class:active={t.id === currentTemplate}>
          <button class="template-btn" onclick={() => selectTemplate(t.id as string)} disabled={saving}>
            <div class="template-preview"></div>
            <h3>{t.displayName || t.id}</h3>
            <p>{t.description || 'A template for your business.'}</p>
            {#if t.id === currentTemplate}
              <span class="current-badge">Current</span>
            {/if}
          </button>
        </div>
      {/each}
    </div>
  {/if}
