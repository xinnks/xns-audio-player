<template>
  <div class="tw-flex tw-mx-auto">
    <div class="tw-container">
      <div class="tw-flex tw-flex-col tw-items-center tw-mt-4">
        <div class="tw-inline-flex tw-flex-col tw-items-center">
          <div class="tw-inline-flex tw-flex-row">
            <h3 class="player-name">XNS AUDIO PLAYER</h3>
            <img src="./assets/logo.png" alt="logo" class="logo">
          </div>
          <div class="tw-inline-flex tw-flex-row tw-items-center tw-align-middle tw-mt-2">
            <div><router-link to="/">Home</router-link></div>
            <div class="tw-mx-3">|</div>
            <div><router-link to="/about">About</router-link></div>
          </div>
        </div>
      </div>
      <router-view/>
      <div class="w-full tw-text-center tw-mt-8 tw-text-gray-500">
        Royalty Free Music from Bensound
      </div>
    </div>
    <PersistentPlayer/>
  </div>
</template>

<script>
  import PersistentPlayer from './components/PersistentPlayer.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'Player',
    components: {
        PersistentPlayer
    },
    data(){
      return {
        demoPlaylist: [
          { audio: 'https://www.bensound.com/bensound-music/bensound-hey.mp3', artist: 'Benjamin Tissot', title: 'Hey!', album: '', cover: 'https://www.bensound.com/bensound-img/hey.jpg' },
          { audio: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3', artist: 'Benjamin Tissot', title: 'Ukulele', album: '', cover: 'https://www.bensound.com/bensound-img/ukulele.jpg' },
          { audio: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3', artist: 'Benjamin Tissot', title: 'Creative Minds', album: '', cover: 'https://www.bensound.com/bensound-img/creativeminds.jpg' },
          { audio: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3', artist: 'Benjamin Tissot', title: 'Jazzy Frenchy', album: '', cover: 'https://www.bensound.com/bensound-img/jazzyfrenchy.jpg'},
          { audio: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3', artist: 'Benjamin Tissot', title: 'Happy Rock', album: '', cover: 'https://www.bensound.com/bensound-img/happyrock.jpg'},
          { audio: 'https://www.bensound.com/bensound-music/bensound-memories.mp3', artist: 'Benjamin Tissot', title: 'Memories', album: '', cover: 'https://www.bensound.com/bensound-img/memories.jpg'},
          { audio: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3', artist: 'Benjamin Tissot', title: 'Acoustic Breeze', album: '', cover: 'https://www.bensound.com/bensound-img/acousticbreeze.jpg'}
        ]
      }
    },
    mounted(){
      this.addPlaylist({
        title: 'Playlist 1',
        songs: this.demoPlaylist
      })
      this.addPlaylist({
        title: 'Playlist 2',
        songs: this.demoPlaylist
      })
    },
    methods: {
      ...mapActions(['addPlaylist'])
    }
  }
</script>

<style>

  #app {
    tw-font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-tw-font-smoothing: tw-antialiased;
    -motw-z-osx-tw-font-smoothing: grayscale;
    tw-text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .header-wrapper{
    tw-justify-content: center;
    tw-align-items: center
  }
  .logo, .player-name{

  }
  .logo{
    margin-left: 20px;
    height: 40px;
    width: auto;
  }
</style>
