<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let images = $state<Array<Record<string, unknown>>>([]);
  let uploading = $state(false);

  onMount(loadImages);

  async function loadImages() {
    try {
      const data = await api.getImages();
      images = data as Array<Record<string, unknown>>;
    } catch (err) {
      showToast(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  async function handleUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    uploading = true;
    try {
      await api.uploadImage(file);
      showToast('Image uploaded');
      await loadImages();
    } catch (err) {
      showToast(`Upload failed: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      uploading = false;
      input.value = '';
    }
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>


  <div class="card" style="margin-bottom:1rem;">
    <label class="upload-zone" class:uploading>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onchange={handleUpload} hidden />
      {#if uploading}
        <p>Uploading...</p>
      {:else}
        <p>Click or drag an image to upload</p>
        <p style="font-size:0.75rem;color:#6b7280;">Max 10MB • JPEG, PNG, WebP, GIF, AVIF</p>
      {/if}
    </label>
  </div>

  {#if images.length === 0}
    <div class="card empty-state">
      <h3>No images yet</h3>
      <p>Upload images to use in posts, pages, and events.</p>
    </div>
  {:else}
    <div class="media-grid">
      {#each images as img}
        <div class="media-item">
          <img src={img.imagekitUrl as string} alt={img.originalFilename as string || 'Image'} loading="lazy" />
        </div>
      {/each}
    </div>
  {/if}
