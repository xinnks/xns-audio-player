<template>
  <ol>
    <song-block v-for="(song, key) in Songs" :song="song" :count="key" :key="key" @play-item="$emit('play-select-song',key)"></song-block>
  </ol>
</template>

<script>
import SongBlock from './SongBlock'
export default {
  name: 'SongsPlaylist',
  components: {SongBlock},
  props: ['Songs']
}
</script>

<style scoped>
</style>
