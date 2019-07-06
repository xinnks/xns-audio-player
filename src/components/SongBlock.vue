<template>
  <li :class="currentTrackId === count ? 'text-left cursor-pointer bg-gray-300 p-2 hover:bg-green-100 border-t-2 border-gray-200' : 'text-left cursor-pointer p-2 hover:bg-green-100 border-t-2 border-gray-200'" @click="$emit('playItem')">{{count+1 + '. '}}<span class="tittle">{{song.tittle}}</span> - <span class="font-bold">{{song.artist}}</span> {{currentTrackId === (count) ? '' : ''}} <span :class="currentTrackId === count ? 'text-right italic font-bold text-black-500' : 'hidden'">...</span> </li>
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
  .playing{
    text-decoration: HighlightText;
  }
  .not-playing{
    display: none;
  }
</style>
