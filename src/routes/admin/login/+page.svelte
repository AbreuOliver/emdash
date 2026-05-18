<script lang="ts">
  import { page } from '$app/state';
  let { data } = $props();

  let email = $state('');
  let code = $state('');
  let requested = $state(false);
  let error = $state('');
  let info = $state('');
  let isSubmitting = $state(false);

  const next = $derived(page.url.searchParams.get('next') || '/admin');

  async function requestCode() {
    isSubmitting = true;
    error = '';
    info = '';

    const res = await fetch('/api/auth/request-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    isSubmitting = false;

    if (!res.ok || !data.ok) {
      error = data.error || 'Unable to request code.';
      return;
    }

    requested = true;
    info = data.devCode ? `Dev code: ${data.devCode}` : 'Code sent. Check your email.';
  }

  async function verifyCode() {
    isSubmitting = true;
    error = '';

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();
    isSubmitting = false;

    if (!res.ok || !data.ok) {
      error = data.error || 'Unable to verify code.';
      return;
    }

    window.location.href = next;
  }

  async function devSignIn() {
    isSubmitting = true;
    error = '';

    const res = await fetch('/api/auth/dev-login', { method: 'POST' });
    const data = await res.json();

    isSubmitting = false;

    if (!res.ok || !data.ok) {
      error = data.error || 'Dev sign-in is unavailable.';
      return;
    }

    window.location.href = next;
  }
</script>

<div class="admin-theme min-h-screen">
  <section class="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
    <article class="admin-panel w-full max-w-xl border p-8" style={`border-color: var(--admin-panel-border);`}>
      <p class="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-soft)]">Admin Access</p>
      <p
        class="mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
        style={`border-color: ${
          data.devBypassEnabled
            ? 'color-mix(in oklab, var(--admin-success) 36%, #ffffff)'
            : 'color-mix(in oklab, var(--admin-danger) 36%, #ffffff)'
        }; color: ${data.devBypassEnabled ? 'var(--admin-success)' : 'var(--admin-danger)'}; background: ${
          data.devBypassEnabled ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)'
        };`}
      >
        Dev bypass: {data.devBypassEnabled ? 'ON' : 'OFF'}
      </p>
      <h1 class="m-0 mt-2 text-3xl font-semibold text-[var(--admin-text-strong)]">Sign in to your workspace</h1>
      <p class="mt-3 text-sm text-[var(--admin-text-soft)]">Use OTP sign-in. During development, you can also use quick sign-in.</p>

      <label class="admin-label mt-6" for="email">Email</label>
      <input id="email" class="admin-input mt-1" bind:value={email} type="email" placeholder="owner@example.com" />

      {#if requested}
        <label class="admin-label mt-4" for="code">Verification code</label>
        <input id="code" class="admin-input mt-1" bind:value={code} inputmode="numeric" placeholder="123456" />
      {/if}

      {#if error}
        <p class="mt-4 rounded-lg border px-3 py-2 text-sm" style={`border-color: color-mix(in oklab, var(--admin-danger) 36%, #ffffff); color: var(--admin-danger); background: var(--admin-danger-bg);`}>{error}</p>
      {/if}
      {#if info}
        <p class="mt-4 rounded-lg border px-3 py-2 text-sm" style={`border-color: color-mix(in oklab, var(--admin-success) 36%, #ffffff); color: var(--admin-success); background: var(--admin-success-bg);`}>{info}</p>
      {/if}

      <div class="mt-6 flex flex-wrap gap-2">
        <button class="admin-pill" onclick={requestCode} disabled={isSubmitting || !email}>{isSubmitting ? 'Please wait...' : 'Request Code'}</button>
        {#if requested}
          <button class="admin-pill-ghost" onclick={verifyCode} disabled={isSubmitting || !code}>Verify & Sign In</button>
        {/if}
        <button class="admin-pill-ghost" onclick={devSignIn} disabled={isSubmitting}>Dev Quick Sign-In</button>
      </div>
    </article>
  </section>
</div>
