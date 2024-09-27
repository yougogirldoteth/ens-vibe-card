<template>
    <a
      :href="`https://ethfollow.xyz/${identifier}`"
      target="_blank"
      v-if="followersCount !== null && followingCount !== null && (followersCount !== 0 || followingCount !== 0)"
      class="stats"
      data-tooltip="Ethereum Follow Protocol">
        <Icon type="efp" />
        <div class="stat">
            <span class="stat-number">{{ followersCount }}</span>
            <span class="stat-label">Followers</span>
        </div>
        <div class="stat">
            <span class="stat-number">{{ followingCount }}</span>
            <span class="stat-label">Following</span>
        </div>
    </a>
</template>


<script setup>
const props = defineProps({
  identifier: {
    type: String,
    required: true,
  },
  followersCount: {
    type: Number,
    default: null,
  },
  followingCount: {
    type: Number,
    default: null,
  },
});
</script>
  
<style scoped>
.stats {
  display: flex;
  gap: 1rem;
  border: 1px solid var(--shadow-2);
  border-radius: var(--border-radius);
  align-items: center;
  padding: 0.5rem;
  transition: background-color 0.3s;
  position: relative;
}

.stats:hover {
  background-color: var(--shadow-1);
  cursor: pointer;
}

.stats[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: -1.7rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 0.4rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  font-size: 0.75rem;
  z-index: 10;
}

.stat {
  display: flex;
  flex-direction: row;
  justify-content: center; 
  align-items: center;
}

.stat-number {
  font-size: 1rem;
  font-weight: bold;
  color: var(--primary);
  align-self: last baseline;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--primary-light);
  align-self: last baseline;
}

@media (max-width: 40rem) {
  .stats {
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .stat {
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  }

  .stat-number {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--primary);
  }

  .stat-label {
    font-size: 0.5rem;
    color: var(--primary-light);
  }
}
</style>