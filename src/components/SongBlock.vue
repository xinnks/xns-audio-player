<template>
  <li :style="'background'" :class="(activePlayer.currentTrackId === count) && (activePlaylist.position === playlistPosition) ? 'tw-relative hover:tw-bg-green-200 tw-text-left tw-cursor-pointer tw-bg-gray-300 tw-p-2 tw-border-t-2 tw-border-gray-200' : 'tw-relative hover:tw-bg-green-200 tw-text-left tw-cursor-pointer tw-p-2 tw-border-t-2 tw-border-gray-200'" @click="$emit('play-item')">{{count+1 + '. '}}<span class="title tw-z-40">{{song.title}}</span> - <span class="tw-font-bold tw-z-40">{{song.artist}}</span> {{(activePlayer.currentTrackId === count) && (activePlaylist.position === playlistPosition) ? '' : ''}} <span :style="'background: rgba(0,255,0, .2); width: '+(currentTrackTime/currentTrackDuration * 100)+'%;'" :class="(activePlayer.currentTrackId === count) && (activePlaylist.position === playlistPosition) ? 'tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-p-0 tw-m-0 tw-h-full tw-w-full tw-z-30 tw-bg-green-100 tw-h-full' : 'tw-hidden'"></span> <span class="tw-absolute tw-py-auto tw-pr-2 tw-right-0" v-if="((activePlayer.currentTrackId === count) && (activePlaylist.position === playlistPosition)) && playerIsLoading"><BufferingIcon animate="beat" class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span> </li>
</template>

<script>
import BufferingIcon from 'vue-ionicons/dist/ios-play-circle'
import PlayerMixin from './../mixins/PlayerMixin'
export default {
  name: 'SongBlock',
  props: ['song', 'count', 'playlistPosition'],
  components: {BufferingIcon},
	mixins: [PlayerMixin]
}
</script>

<style scoped>
</style>
