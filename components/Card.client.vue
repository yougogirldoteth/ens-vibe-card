<template>
    <div v-if="user" class="card">
        <header>
            <img :src="headerImage" :alt="name" class="header"/>
            <img :src="avatarImage" :alt="name" class="pfp"/>
        </header>
  
        <section>
            <h1 @click="() => !hideAddress && copy(userAddress)">
                <span>{{ user.ens }}</span>
                <small v-if="copied">copied...</small>
                <small v-else-if="!hideAddress">{{ shortAddress(userAddress) }}</small>
            </h1>

            <p v-if="description">{{ description }}</p>

            <ul v-if="hasTags">
                <li>
                    <ButtonProfileWebsite :profile="user" />
                </li>
                <li>
                    <ButtonProfileEmail :profile="user" />
                </li>
                <li>
                    <ButtonProfileTwitter :profile="user" />
                </li>
                <li>
                    <ButtonProfileDiscord :profile="user" />
                </li>
                <li>
                    <ButtonProfileGithub :profile="user" />
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useRuntimeConfig } from '#imports'
import { useOnchainStore } from '~/composables/profile'

const validateAndTransformUrl = (url, defaultUrl) => {
  if (!url) return defaultUrl;
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  if (url.startsWith('eip')) {
    return defaultUrl;
  }
  try {
    new URL(url);
    return url;
  } catch (_) {
    return defaultUrl;
  }
};

const config = useRuntimeConfig()
const walletAddress = config.public.walletAddress

const store = useOnchainStore();

onMounted(() => {
    if (walletAddress) {
        store.fetchUserProfile(walletAddress).catch(error => {
            console.error('Error fetching user profile:', error);
        });
    }
});

const user = computed(() => store.user(walletAddress))
const userAddress = computed(() => walletAddress)
const { copy, copied } = useClipboard({ source: userAddress })
const description = computed(() => user.value?.description)

const hasTags = computed(() => user.value?.url ||
  user.value?.email ||
  user.value?.twitter ||
  user.value?.github ||
  user.value?.discord ||
  user.value?.github
)

const headerImage = computed(() => validateAndTransformUrl(user.value?.header, 'default-header.svg'));
const avatarImage = computed(() => validateAndTransformUrl(user.value?.avatar, 'default-avatar.svg'));
</script>

<style scoped>
.card {
    max-width: 50rem;
    min-width: 35rem;
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

header {
    min-height: 10rem;
    background-color: var(-);
    position: relative;
    display: flex;
    justify-content: center;
    border-bottom: var(--border);
}

header img:nth-child(1) {
    width: 100%;
    background-image: linear-gradient(330.4deg, rgb(68, 188, 240) 4.54%, rgb(114, 152, 248) 59.2%, rgb(160, 153, 255) 148.85%);
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

h1 span, h1 small {
    display: block;
}

h1 small {
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
        box-shadow: 0 0.25rem 3rem 2rem rgb(68 147 240 / 4.54%);
        animation: gradient 5s infinite alternate;
    }

    header img:nth-child(2) {
        max-width: 10rem;
    }
}

@keyframes gradient {
    0% {
        box-shadow: 0 0.25rem 3rem 2rem rgb(68 147 240 / 8%);
    }
    50% {
        box-shadow: -0.5rem -0.5rem 3rem 2rem rgba(114, 152, 248, 12%);
    }
    100% {
        box-shadow: 1rem 1.45rem 5rem 3.9rem rgba(160, 153, 255, 17%);
    }
}
</style>