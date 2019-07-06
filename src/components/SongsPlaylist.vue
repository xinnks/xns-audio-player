<template>
  <ol>
    <song-block :current-track-id="currentTrackId" v-for="(song, key) in Songs" :song="song" :count="key" :key="key" @playItem="$emit('playSelectSong',key)"></song-block>
  </ol>
</template>

<script>
import SongBlock from './SongBlock'
export default {
  name: 'SongsPlaylist',
  components: {SongBlock},
  props: ['Songs', 'currentTrackId']
}
</script>

<style scoped>
</style>
