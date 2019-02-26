<template>
  <li :class="currentTrackId === (count) ? 'list-item playlist-item currently-playing' : 'list-item playlist-item'" @click="$emit('playItem')">{{count+1 + '. '}}<span class="tittle">{{song.tittle}}</span> - <span class="artist">{{song.artist}}</span> {{currentTrackId === (count) ? '' : ''}} <span :class="currentTrackId === (count) ? 'playing' : 'not-playing'">...</span> </li>
</template>

<script>
export default {
  name: 'SongBlock',
  props: ['song', 'count', 'currentTrackId']
}
</script>

<style scoped>
  .playlist-item{
    text-align: left;
    cursor: pointer;
  }
  .playlist-item:hover{
    background: rgba(132, 175, 202, 0.2);
  }
  .currently-playing{
    background: rgba(40, 5, 63, 0.2);
  }
  .artist{
    font-weight: 600;
  }
  .tittle{}
  .playing{
    float: right;
    text-decoration: HighlightText;
    font-style: italic;
    color: rgb(122, 122, 122);
    font-weight: 600;
  }
  .not-playing{
    display: none;
  }
</style>
