<template>
  <div>
    <h4 class="tw-text-center tw-font-bold tw-mt-2 tw-mb-2">{{playlist.title}}</h4>
    <ol>
      <song-block v-for="(song, key) in playlist.songs" :song="song" :count="key" :key="key" :playlist-position="playlistPosition" @play-item="$emit('play-select-song',{playerPosition: playlistPosition, trackId: key})"></song-block>
    </ol>
  </div>
</template>

<script>
import SongBlock from './SongBlock'
export default {
  name: 'SongsPlaylist',
  components: {SongBlock},
  props: ['playlist', 'playlistPosition']
}
</script>

<style scoped>
</style>
