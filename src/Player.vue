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
          { audio: 'https://rorg.z1.fm/d/3f/ti_ft_eminem_-_thats_all_she_wrote_(zv.fm).mp3', artist: 'T.I', title: 'That\'s All She Wrote (ft. Eminem)', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189593/random/f55abc725080eb05147e45ce3cd406a8.1000x1000x1.jpg' },
          { audio: 'https://dll.z1.fm/music/8/e8/ellie_goulding_feat_diplo__swae_lee_-_close_to_me.mp3', artist: 'Ellie Goulding Feat. Diplo & Swae Lee', title: 'Close To Me', album: 'None', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189716/random/ellie-goulding-close-to-me-lg.jpg' },
          { audio: 'https://rorg.z1.fm/8/ff/sia_-_lullaby_zaycevnet_(zv.fm).mp3', artist: 'Sia', title: 'Lullaby', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189786/random/t54664010-b708389188_s400.jpg' },
          { audio: 'https://muz.z1.fm/6/6f/lp_-_muddy_waters_(zf.fm).mp3', artist: 'LP', title: 'Muddy Waters', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189837/random/t337772630-i1186767461_s400.jpg' },
          { audio: 'https://rorg.z1.fm/f/d6/david_dallas_-_runnin_(zf.fm).mp3', artist: 'David Dallas', title: 'Runnin', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189882/random/t93555159-i1095888717_s400.jpg'},
          { audio: 'https://jt2.z1.fm/f/bf/labrinth_-_vultures_(zvukoff.ru).mp3', artist: 'Labrinth', title: 'Vultures', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189373/random/R-3512282-1392987047-7461.jpeg.jpg'},
          { audio: 'https://muz17.z1.fm/b/10/niall_horan_-_slow_hands_slow_hands_(zf.fm).mp3', artist: 'Niall Horan', title: 'Slow Hands', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551190705/random/niall-horan-slow-hands-audio-02.jpg'},
          { audio: 'https://muz.z1.fm/a/fa/davide_esposito_-_a_cavallo_del_vento_(zf.fm).mp3', artist: 'Davide Esposito', title: 'A Cavallo Del Vento', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551190889/random/500x500.jpg'},
          { audio: 'https://dll.z1.fm/music/9/88/benny_blanco__halsey__khalid_-_eastside.mp3', artist: 'Benny Blanco, Halsey & Khalid', title: 'Eastside', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551192768/random/artworks-000432419499-7ts3gr-t500x500.jpg'}
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
