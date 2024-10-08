<template>
  <form @submit.prevent="onSearch" class="search-container">
    <div class="search-row">
      <div class="input-container">
        <input
          v-model="inputAddress"
          placeholder="ENS or wallet address"
          class="search-input"
        />
        <div v-if="loading" class="loading-bar"></div>
      </div>
      <Button type="submit" class="search-button">
        <Icon type="search" />
        Search
      </Button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <Button v-if="showSuccessButton" @click="goToRepo" class="success-button">
        How to deploy your own ENS vibe card
        <Icon type="github" />
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  initialAddress: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showSuccessButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['search']);

const inputAddress = ref(props.initialAddress);
const errorMessage = ref('');
const showSuccessButton = ref(props.showSuccessButton);

watch(
  () => props.initialAddress,
  (newVal) => {
    inputAddress.value = newVal;
  }
);

const loading = computed(() => props.loading);

watch(inputAddress, () => {
  showSuccessButton.value = false;
});

const onSearch = () => {
  errorMessage.value = '';
  showSuccessButton.value = false; // Hide success button on new search

  if (!inputAddress.value || inputAddress.value.trim() === '') {
    errorMessage.value = 'Please enter a valid wallet address or ENS name.';
    return;
  }

  const identifier = inputAddress.value.trim().toLowerCase();

  const isAddress = identifier.startsWith('0x') && identifier.length === 42;
  const isEnsName = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/.test(identifier);

  if (!isAddress && !isEnsName) {
    errorMessage.value = 'Please enter a valid wallet address or ENS name.';
    return;
  }

  emit('search', identifier);
  showSuccessButton.value = true; // Show success button after successful search
};

const goToRepo = () => {
  window.open('https://github.com/yougogirldoteth/ens-vibe-card', '_blank');
};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 5rem 0;
}

.search-row {
  display: flex;
  align-items: center;
  margin: 2rem auto 4rem;
  position: relative;
}

.input-container {
  position: relative;
  width: 320px;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: var(--dark-bg);
  border: var(--border);
  border-radius: var(--border-radius);
  box-shadow: 0 0.05rem 1rem 0.5rem var(--shadow-1);
  animation: gradient 5s infinite alternate;
  margin-right: 1rem;
}

.search-button {
  margin-left: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: var(--action);
  border: none;
  border-radius: var(--border-radius);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background-color: var(--action-active);
}

.error-message {
  color: red;
  margin-top: 0.5rem;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  text-align: center;
}

.success-button {
  margin-top: 0.5rem;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 0.5rem 1.2rem;
  background-color: var(--action);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background 0.3s;
}

.success-button:hover {
  background-color: var(--action-active);
}

.loading-bar {
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 33.33%;
  height: 4px;
  background: linear-gradient(90deg, rgba(68,147,240,1) 0%, rgba(114,152,248,1) 50%, rgba(160,153,255,1) 100%);
  transform: translateX(-50%);
  animation: loading 2s infinite alternate;
}

@keyframes loading {
  0% {
    transform: translateX(-50%) translateX(-100%);
  }
  100% {
    transform: translateX(-50%) translateX(100%);
  }
}

@keyframes gradient {
    0% {
        box-shadow: 0 0.25rem 3rem 2rem var(--shadow-1);
    }
     50% {
        box-shadow: -0.5rem -0.5rem 3rem 2rem var(--shadow-2);
    }
    100% {
        box-shadow: 1rem 1.45rem 5rem 3.9rem var(--shadow-3);
    }
}

input:focus {
  outline: 0;
}

@media (max-width: 40rem) {
  .search-container {
    margin: 0;
  }
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .input-container {
    width: 100%;
    border-radius: 0;
  }

  .search-button {
    max-width: 100vw;
    min-width: 100vw; 
    width: 100%;
    margin-left: 0;
    border-radius: 0;
  }

  .error-message,
  .success-button {
    position: static;
    width: 100%;
    text-align: center;
    border-radius: 0;
  }
}
</style>
