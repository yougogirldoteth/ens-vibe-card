<template>
  <Button v-if="profile.reddit" :to="`https://reddit.com/user/${profile.reddit}`">
    <Icon type="reddit" />
    <span>{{ profile.reddit }}</span>
  </Button>
</template>

<script setup>
defineProps(['profile'])
</script>
