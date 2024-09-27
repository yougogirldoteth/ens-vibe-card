<template>
  <Button v-if="profile.telegram" :to="`https://t.me/${profile.telegram}`">
    <Icon type="telegram" />
    <span>{{ profile.telegram }}</span>
  </Button>
</template>

<script setup>
defineProps(['profile'])
</script>
