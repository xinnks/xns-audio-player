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
            <div class="tw-mx-3">|</div>
            <div>
              <a href="https://github.com/xinnks/xns-audio-player" title="Github">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" ><title>Github</title><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" fill="#000000"/></svg>
              </a>
            </div>
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
