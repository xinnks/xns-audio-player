<template>
  <li :style="'background'" :class="currentTrackId === count ? 'relative hover:bg-green-200 text-left cursor-pointer bg-gray-300 p-2 border-t-2 border-gray-200' : 'relative hover:bg-green-200 text-left cursor-pointer p-2 border-t-2 border-gray-200'" @click="$emit('playItem')">{{count+1 + '. '}}<span class="tittle z-40">{{song.tittle}}</span> - <span class="font-bold z-40">{{song.artist}}</span> {{currentTrackId === count ? '' : ''}} <span :style="'background: rgba(0,255,0, .2); width: '+progressPercent+'%;'" :class="currentTrackId === count ? 'absolute top-0 bottom-0 left-0 right-0 p-0 m-0 h-full w-full z-30 bg-green-100 h-full' : 'hidden'"></span> </li>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'SongBlock',
  props: ['song', 'count', 'currentTrackId'],
  computed:{
    ...mapState([
      'progressPercent'
    ])
  },
}
</script>

<style scoped>
</style>
