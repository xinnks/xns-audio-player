<template>
  <li :style="'background'" :class="currentTrackId === count ? 'tw-relative hover:tw-bg-green-200 tw-text-left tw-cursor-pointer tw-bg-gray-300 tw-p-2 tw-border-t-2 tw-border-gray-200' : 'tw-relative hover:tw-bg-green-200 tw-text-left tw-cursor-pointer tw-p-2 tw-border-t-2 tw-border-gray-200'" @click="$emit('playItem')">{{count+1 + '. '}}<span class="tittle tw-z-40">{{song.tittle}}</span> - <span class="tw-font-bold tw-z-40">{{song.artist}}</span> {{currentTrackId === count ? '' : ''}} <span :style="'background: rgba(0,255,0, .2); width: '+progressPercent+'%;'" :class="currentTrackId === count ? 'tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-p-0 tw-m-0 tw-h-full tw-w-full tw-z-30 tw-bg-green-100 tw-h-full' : 'tw-hidden'"></span> <span class="tw-absolute tw-py-auto tw-pr-2 tw-right-0" v-if="(currentTrackId === count) && playerIsBuffering"><BufferingIcon animate="beat" class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span> </li>
</template>

<script>
import {mapState} from 'vuex'
import BufferingIcon from 'vue-ionicons/dist/ios-play-circle'
export default {
  name: 'SongBlock',
  props: ['song', 'count', 'currentTrackId'],
  components: {BufferingIcon},
  computed:{
    ...mapState([
      'progressPercent',
      'playerIsBuffering'
    ])
  },
}
</script>

<style scoped>
</style>
