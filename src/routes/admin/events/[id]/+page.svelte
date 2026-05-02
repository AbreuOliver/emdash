<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Layout from '../../+layout.svelte';
  import { api } from '$lib/admin/api-client';
  import '$lib/admin/admin.css';

  let eventId = $state('');
  let title = $state('');
  let description = $state('');
  let startDateTime = $state('');
  let endDateTime = $state('');
  let location = $state('');
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
    const idParam = pathSegments[pathSegments.length - 1];
    isNew = idParam === 'new';
    if (!isNew) {
      try {
        const evt = await api.getEvent(idParam, 'draft') as Record<string, string>;
        eventId = evt.id;
        title = evt.title;
        description = evt.description || '';
        startDateTime = evt.startDateTime ? evt.startDateTime.substring(0, 16) : '';
        endDateTime = evt.endDateTime ? evt.endDateTime.substring(0, 16) : '';
        location = evt.location || '';
        seoTitle = evt.seoTitle || '';
        seoDescription = evt.seoDescription || '';
        seoKeywords = evt.seoKeywords || '';
        seoNoIndex = evt.seoNoIndex === '1' || evt.seoNoIndex === 'true';
      } catch {
        showToast('Event not found');
      }
    }
  });

  function validate() {
    errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!startDateTime) errors.startDateTime = 'Start date/time is required';
    if (endDateTime && startDateTime && new Date(endDateTime) <= new Date(startDateTime)) {
      errors.endDateTime = 'End must be after start';
    }
    return Object.keys(errors).length === 0;
  }

  async function save() {
    if (!validate()) return;
    saving = true;
    try {
      const data = {
        title, description, startDateTime: startDateTime || null,
        endDateTime: endDateTime || null, location, seoTitle, seoDescription, seoKeywords, seoNoIndex,
      };
      if (isNew) {
        await api.createEvent(data);
        showToast('Event created');
      } else {
        await api.updateEvent(eventId, data);
        showToast('Event saved');
      }
    } catch (err) {
      showToast(`Save failed: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      saving = false;
    }
  }

  function insertMd(prefix: string, suffix?: string) {
    const el = document.getElementById('md-desc') as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = description.substring(start, end);
    const wrap = suffix ?? prefix;
    const replacement = selected ? `${prefix}${selected}${wrap}` : `${prefix}text${wrap}`;
    description = description.substring(0, start) + replacement + description.substring(end);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + replacement.length;
    });
  }

  function showToast(msg: string) {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
  }
</script>

<Layout>
  <svelte:fragment slot="title">{isNew ? 'New Event' : 'Edit Event'}</svelte:fragment>

  <div class="editor-layout">
    <div class="editor-main">
      <div class="card form">
        <div class="form-group">
          <label for="title">Title *</label>
          <input id="title" type="text" bind:value={title} />
          {#if errors.title}<p class="error">{errors.title}</p>{/if}
        </div>
        <div class="form-group">
          <label>Description (Markdown)</label>
          <div class="md-toolbar">
            <button type="button" onclick={() => insertMd('**')} title="Bold"><b>B</b></button>
            <button type="button" onclick={() => insertMd('*')} title="Italic"><i>I</i></button>
            <button type="button" onclick={() => insertMd('## ')} title="Heading">H2</button>
            <button type="button" onclick={() => insertMd('- ')} title="List">•</button>
          </div>
          <textarea id="md-desc" rows="8" bind:value={description} style="font-family:monospace;"></textarea>
        </div>
      </div>
    </div>

    <div class="editor-sidebar">
      <div class="card">
        <h3>Date & Time</h3>
        <div class="form-group">
          <label for="startDateTime">Start *</label>
          <input id="startDateTime" type="datetime-local" bind:value={startDateTime} />
          {#if errors.startDateTime}<p class="error">{errors.startDateTime}</p>{/if}
        </div>
        <div class="form-group">
          <label for="endDateTime">End (optional)</label>
          <input id="endDateTime" type="datetime-local" bind:value={endDateTime} />
          {#if errors.endDateTime}<p class="error">{errors.endDateTime}</p>{/if}
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <input id="location" type="text" bind:value={location} />
        </div>
      </div>

      <div class="card" style="margin-top:1rem;">
        <h3>SEO</h3>
        <div class="form-group"><label for="seoTitle">SEO Title</label><input id="seoTitle" type="text" bind:value={seoTitle} /></div>
        <div class="form-group"><label for="seoDescription">SEO Description</label><textarea id="seoDescription" rows="2" bind:value={seoDescription}></textarea></div>
        <div class="form-group"><label for="seoKeywords">Keywords</label><input id="seoKeywords" type="text" bind:value={seoKeywords} /></div>
        <div class="form-group">
          <label class="checkbox-label"><input type="checkbox" bind:checked={seoNoIndex} /> No index</label>
        </div>
      </div>

      <button class="btn btn-primary" onclick={save} disabled={saving} style="width:100%;margin-top:1rem;">
        {saving ? 'Saving...' : (isNew ? 'Create Event' : 'Save Event')}
      </button>
    </div>
  </div>
</Layout>
