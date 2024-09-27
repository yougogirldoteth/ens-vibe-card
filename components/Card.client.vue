<template>
    <div>
      <SearchBar
        v-if="!walletAddress"
        :initialAddress="initialAddress"
        :loading="loading"
        :showSuccessButton="showSuccessButton"
        @search="fetchProfile"
      />
  
      <div class="card">
        <header>
          <Image
            :image="{ image_url: headerImage }"
            :is-iframe="isIframe(headerImage)"
            class="header"
          />
          <img :src="avatarImage" class="pfp" />
        </header>
  
        <section>
          <h1 @click="!hideAddress && copy(userAddress)">
            <div class="user-info">
              <span>{{ displayName }}</span>
              <span v-if="user?.location" class="location">{{ user?.location }}</span>
              <FollowerStats
                :identifier="currentIdentifier"
                :followersCount="followersCount"
                :followingCount="followingCount"
                class="follower-stats"
              />
            </div>
            <small v-if="copied">copied...</small>
            <small v-else-if="!hideAddress">{{ shortAddress(userAddress) }}</small>
          </h1>
  
          <p v-if="user?.description">{{ user.description }}</p>
  
          <ul v-if="hasTags">
            <li v-if="user?.url">
              <ButtonProfileWebsite :profile="user" />
            </li>
            <li v-if="user?.email">
              <ButtonProfileEmail :profile="user" />
            </li>
            <li v-if="user?.twitter">
              <ButtonProfileTwitter :profile="user" />
            </li>
            <li v-if="user?.discord">
              <ButtonProfileDiscord :profile="user" />
            </li>
            <li v-if="user?.telegram">
              <ButtonProfileTelegram :profile="user" />
            </li>
            <li v-if="user?.reddit">
              <ButtonProfileReddit :profile="user" />
            </li>
            <li v-if="user?.linkedin">
              <ButtonProfileLinkedin :profile="user" />
            </li>
            <li v-if="user?.github">
              <ButtonProfileGithub :profile="user" />
            </li>
          </ul>
        </section>
      </div>
    </div>
</template>  

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useRuntimeConfig } from '#imports';
import { useOnchainStore } from '~/composables/profile';

const validateAndTransformUrl = (url, defaultUrl) => {
  if (!url) return defaultUrl;
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  try {
    new URL(url);
    return url;
  } catch (_) {
    return defaultUrl;
  }
};

const config = useRuntimeConfig();
const walletAddress = config.public.walletAddress;

const currentAddress = ref('');
const currentIdentifier = ref('');
const initialAddress = ref('');
const hideAddress = ref(false);

const followersCount = ref(null);
const followingCount = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const showSuccessButton = ref(false);

const shortAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
};

const store = useOnchainStore();

onMounted(() => {
  if (walletAddress) {
    initialAddress.value = walletAddress;
    fetchProfile(walletAddress);
  }
});

const fetchFollowerStats = async (identifier) => {
  if (identifier) {
    try {
      const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${identifier}/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch follower stats: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching follower stats:', error);
      return null;
    }
  }
  return null;
};

const fetchProfile = async (identifier) => {
  if (identifier) {
    loading.value = true;
    errorMessage.value = '';
    showSuccessButton.value = false;
    try {
      const isAddress = identifier.startsWith('0x') && identifier.length === 42;
      const isEnsName = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/.test(identifier);

      if (!isAddress && !isEnsName) {
        errorMessage.value = 'Please enter a valid wallet address or ENS name.';
        loading.value = false;
        return;
      }

      const [user, stats] = await Promise.all([
        store.fetchUserProfile(identifier),
        fetchFollowerStats(identifier),
      ]);

      if (user && user.address) {
        currentAddress.value = user.address;
        currentIdentifier.value = identifier;
        showSuccessButton.value = true;
      } else {
        errorMessage.value = 'User not found for identifier: ' + identifier;
      }

      if (stats) {
        followersCount.value = Number(stats.followers_count);
        followingCount.value = Number(stats.following_count);
      } else {
        followersCount.value = null;
        followingCount.value = null;
      }
    } catch (error) {
      console.error('Error fetching user profile or follower stats:', error);
      errorMessage.value = 'An error occurred while fetching data.';
    } finally {
      loading.value = false;
    }
  }
};

const user = computed(() => store.user(currentAddress.value));
const userAddress = computed(() => currentAddress.value);

const displayName = computed(() => {
    return user.value?.ens || shortAddress(userAddress.value) || currentIdentifier.value || 'Unknown';
});

const { copy, copied } = useClipboard({ source: userAddress });

const hasTags = computed(() => {
    const u = user.value;
    return u && (u.url || u.email || u.twitter || u.github || u.discord || u.telegram || u.reddit || u.linkedin);
});

const avatarImage = ref('default-avatar.svg');
const headerImage = ref('default-header.svg');

watch(
  () => user.value?.avatar,
  (newAvatar) => {
    if (newAvatar) {
      avatarImage.value = validateAndTransformUrl(newAvatar, 'default-avatar.svg');
    } else {
      avatarImage.value = 'default-avatar.svg';
    }
  }
);

watch(
  () => user.value?.header,
  (newHeader) => {
    if (newHeader) {
      headerImage.value = validateAndTransformUrl(newHeader, 'default-header.svg');
    } else {
      headerImage.value = 'default-header.svg';
    }
  }
);

const isIframe = (url) => {
    const iframeDomains = ['youtube.com', 'scapes.punkscape.xyz'];
    try {
        const parsedUrl = new URL(url);
        return iframeDomains.some((domain) => parsedUrl.hostname.includes(domain));
    } catch (_) {
        return false;
    }
};
</script>

<style scoped>
.card {
    max-width: 50rem;
    min-width: 40rem;
    background-color: var(--dark-bg);
    color: white;
    font-family: 'Space Mono', monospace;
    overflow: hidden;
    margin: 2rem auto;
    border: var(--border);
    border-radius: var(--border-radius);
    box-shadow: 0 0.25rem 3rem 2rem rgb(96 195 186 / 9%);
    animation: gradient 5s infinite alternate;
}

@media (max-width: 40rem) {
    .card {
        max-width: 100vw;
        min-width: 100vw;
        border-radius: 0;
        margin: 0;
    }

    .header img:nth-child(2) {
        max-width: 20vw;
    }

    section {
        padding: 1.5rem var(--box-padding) var(--box-padding);
    }

    h1 {
        font-size: 1.2rem;
    }

    p {
        font-size: 0.9rem;
    }

    ul li a {
        padding: 0.4rem 0.8rem;
        font-size: 0.7rem;
    }
}

header {
    background-color: var(--dark-bg);
    position: relative;
    display: flex;
    justify-content: center;
    border-bottom: var(--border);
}

header img:nth-child(1) {
    width: 100%;
}

header img:nth-child(2) {
    border-radius: 50%;
    border: var(--border-dark);
    max-width: 30vw;
    position: absolute;
    bottom: -2rem;
    left: var(--box-padding);
}

section {
    padding: 2.25rem var(--box-padding) var(--box-padding);
}

h1 {
    color: var(--primary);
    font-size: 1.4rem;
    text-transform: uppercase;
    font-style: italic;
    font-weight: 700;
}

h1 .location {
    font-size: 0.7rem;
    margin-left: 0.3rem;
    display: inline;
    color: var(--primary-light);
}

h1 span {
    display: inline;
}

h1 small {
    display: block;
    font-size: 0.8rem;
    margin-top: -0.5rem;
}

p {
    margin-top: 0.5rem;
    opacity: 0.8;
    font-size: 1rem;
}

ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem 0 0;
}

ul li a {
    padding: 0.5rem 1rem;
    letter-spacing: 0.1em;
    background-color: var(--action);
    border-radius: var(--border-radius);
    transition: background .4s;
    text-transform: uppercase;
    font-style: italic;
    font-weight: bold;
    font-size: 0.8rem;
}

ul li a:hover,
ul li a:focus,
ul li a:active {
    background-color: var(--action-active);
}

@media (min-width: 40.5rem) {
    .card {
        background-color: var(--dark-bg);
        margin: 2rem auto 4rem;
        border: var(--border);
        border-radius: var(--border-radius);
        box-shadow: 0 0.25rem 3rem 2rem var(--shadow-1);
        animation: gradient 5s infinite alternate;
    }

    header img:nth-child(2) {
        max-width: 10rem;
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

.user-info {
    display: flex;
    align-items: last baseline;
}

.follower-stats {
    margin-left: auto;
}
</style>