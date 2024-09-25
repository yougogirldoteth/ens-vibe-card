<template>
  <Button v-if="validateURI(profile.discord)" :to="validateURI(profile.discord)">
    <Icon type="discord" />
    {{ getMainDomain(profile.discord) }}
  </Button>
</template>

<script setup>
defineProps(['profile'])
</script>
