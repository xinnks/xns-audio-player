<template>
  <ol class="list">
    <song-block :current-track-id="currentTrackId" class="list-item" v-for="(song, key) of Songs" :song="song" :count="key" :key="key" @playItem="$emit('playSelectSong',key)"></song-block>
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
  .align-left{
    text-align: left;
  }
</style>
