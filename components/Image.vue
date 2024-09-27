<template>
  <article class="image" :class="{ loaded: loaded || isSVG || isVideo }" v-intersection-observer="loadImage">
    <div class="media-wrapper">
      <div class="inner image">
        <iframe 
          v-if="isIframe" 
          :src="image.image_url" 
          frameborder="0" 
          class="full-size-iframe" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
        </iframe>
        <video v-else-if="isVideo" :src="image.image_url" playsinline loop autoplay muted ref="video"></video>
        <img
          v-else-if="image.image_url || hasImageEmbed"
          ref="imageEl"
          :src="hasImageEmbed ? embed : image.image_url"
          @error="loadOriginal"
          @load="imageLoaded"
        >
        <slot />
      </div>
    </div>
  </article>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'
import { imageURI } from '~/helpers/images'

const props = defineProps({
  image: {
    type: Object,
    required: true,
    default: () => ({ image_url: '' })
  },
  version: String,
  embed: String,
  autoEmbed: Boolean,
  isIframe: Boolean, // New prop
});

const uri = ref('')
const loaded = ref(false)
const isVideo = computed(() => ['mp4', 'webm'].includes(props.image?.type))
const isSVG = computed(() => props.image?.type === 'svg')
const hasEmbed = computed(() => props.embed || (uri.value && isSVG.value && props.autoEmbed))
// FIXME: Refactor this...
const hasImageEmbed = computed(() => hasEmbed.value && props.embed?.endsWith('.gif'))
const embedURI = computed(() => props.embed || uri.value)

const loadImage = ([{ isIntersecting }]) => {
  if (!isIntersecting) return

  if (!props.image) return

  uri.value = props.image.image_url
}
const loadOriginal = () => {
  console.log('error')
  uri.value = imageURI(props.image)
}
watch(() => props.image?.uuid, () => loadImage([{ isIntersecting: true }]))

// Image loaded event
const imageLoaded = () => loaded.value = true
</script>

<style lang="postcss">
.media-wrapper {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  height: 0;
  position: relative;
  padding-bottom: 33%;
}

article.image {
  min-height: auto;
  overflow: hidden;
  background-color: var(--gray-z-3);
  position: relative;
  width: 100%;


  .inner {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  }

  video,
  img,
  iframe {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  img {
    transition: transform var(--speed), opacity var(--speed);
  }

  &.loaded img {
    transform: scale(1);
    opacity: 1;
  }

  &.appear {
    transition: opacity var(--speed-slow), transform var(--speed-slow);

    img {
      opacity: 0.001;
    }

    &.up {
      transform: translateY(var(--size-6));
    }

    &.loaded {
      opacity: 1;
      transform: translateY(0);

      img {
        opacity: 1;
      }
    }
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
