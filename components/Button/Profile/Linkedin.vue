<template>
  <Button v-if="profile.linkedin" :to="`https://linkedin.com/in/${profile.linkedin}`">
    <Icon type="linkedin" />
    <span>{{ profile.linkedin }}</span>
  </Button>
</template>

<script setup>
defineProps(['profile'])
</script>
