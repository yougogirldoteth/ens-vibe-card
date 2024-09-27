<template>
  <NuxtLink v-if="to" :to="to" class="button" :exact="exact" :target="target"><slot /></NuxtLink>
  <button v-else class="button"><slot /></button>
</template>

<script setup>
defineProps({
  to: [String, Object],
  target: {
    type: String,
    default: '_self',
  },
  exact: Boolean,
})
</script>

<style>
.button {
  position: relative;
  min-width: fit-content;
  width: fit-content;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacer);
  letter-spacing: var(--ui-letter-spacing);
  line-height: var(--ui-line-height);

  background: var(--button-background);
  padding: var(--ui-padding-y) var(--ui-padding-x);
  border: var(--button-border);
  border-radius: var(--button-border-radius);

  &.non-interactive,
  &[disabled]:not([disabled="false"]) {
    pointer-events: none;
  }
  &[disabled]:not([disabled="false"]) {
    color: var(--muted);
  }

  &:--highlight {
    background: var(--button-background-highlight);
  }

  > * {
    display: inline-flex;
    align-items: center; 
  }

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &.link {
    border: 0;
    background: transparent;
    line-height: inherit;
    color: var(--muted);

    &:--highlight {
      background: var(--button-background-highlight);
      color: var(--color);
    }
  }

  &.inline {
    display: inline-flex;
    align-self: baseline;
    align-items: baseline;
    height: inherit;
    margin: 0 !important;
    padding: 0 calc(var(--ui-padding-x)/2) !important;
  }
}
</style>
