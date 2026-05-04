<script lang="ts">
  let { path = '', size = 16, stroke = 'currentColor', viewBox = '0 0 24 24' } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={viewBox} fill="none" stroke={stroke} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {@html path}
</svg>
