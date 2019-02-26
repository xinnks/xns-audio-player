<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4">
          <div :style="'background: url(' + Songs[presentSongId].cover + ');background-size: contain;background-repeat: no-repeat'" class="card play-controls">
            <div class="card-content">
              <div class="columns progress-window">
                <div class="column is-12">
                  <v-circle :percent="progressPercent" stroke-width="6" stroke-linecap="round" :strokeColor="color"/>
                </div>
              </div>
              <div class="level controls-window">
                <div class="level-item">
                  <div class="columns is-mobile">
                    <div class="column">
                      <ion-icon class="play-control-item" @click="prevSong()" size="large" name="skip-backward"></ion-icon>
                    </div>
                    <div class="column">
                      <ion-icon class="play-control-item" @click="play()" size="large" :name="!isPlaying ? 'play' : 'pause'"></ion-icon>
                    </div>
                    <div class="column">
                      <ion-icon class="play-control-item" size="large" @click="stop()" name="square"></ion-icon>
                    </div>
                    <div class="column">
                      <ion-icon class="play-control-item" @click="nextSong()" size="large" name="skip-forward"></ion-icon>
                    </div>
                    <!--<div class="column">
                      <button class="button play-controls-button" @click="prevSong()">{{'<<'}}</button>
                    </div>
                    <div class="column">
                      <button class="button play-controls-button" @click="play()">{{!isPlaying ? ' > ' : ' | | '}}</button>
                    </div>
                    <div class="column">
                      <button class="button play-controls-button" @click="stop()" type="button"> {{'[#]'}} </button>
                    </div>
                    <div class="column">
                      <button class="button play-controls-button" @click="nextSong()">{{'>>'}}</button>
                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="level">
            <div class="level-left">
              <range-slider class="volume" v-model="volume" :min="0" :max="1" :step="0.05"></range-slider>
            </div>
            <div class="level-right">
              <div class="timer">{{timeBufferMins}} : {{timeBufferSecs | doubleDigits}} - {{currentTrackDuration}}</div>
            </div>
          </div>
        </div>
        <div class="column is-8">
          <songs-playlist :current-track-id="presentSongId" @playSelectSong="playSong" :Songs="Songs"></songs-playlist>
            <!--<v-line :percent="progressPercent" stroke-width="4" :strokeColor="color"/>
            <v-circle :percent="progressPercent" stroke-width="6" stroke-linecap="round" :strokeColor="color"/>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongBlock from './components/SongBlock'
import SongsPlaylist from './components/SongsPlaylist'
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
import {VCircle, VLine} from 'v-progress'
export default {
  name: 'App',
  components: {
    SongsPlaylist, SongBlock, RangeSlider, VCircle, VLine
  },
  data () {
    return {
      loading: 'getLoadingState',
      Songs: [
        { audio: 'https://rorg.z1.fm/d/3f/ti_ft_eminem_-_thats_all_she_wrote_(zv.fm).mp3', artist: 'T.I', tittle: 'That\'s All She Wrote (ft. Eminem)', album: '', cover: 'http://images.genius.com/f55abc725080eb05147e45ce3cd406a8.1000x1000x1.jpg' },
        { audio: 'https://dll.z1.fm/music/8/e8/ellie_goulding_feat_diplo__swae_lee_-_close_to_me.mp3', artist: 'Ellie Goulding Feat. Diplo & Swae Lee', tittle: 'Close To Me', album: 'None', cover: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/Ellie_Goulding_and_Diplo_–_Close_to_Me.png/220px-Ellie_Goulding_and_Diplo_–_Close_to_Me.png' },
        { audio: 'https://rorg.z1.fm/8/ff/sia_-_lullaby_zaycevnet_(zv.fm).mp3', artist: 'Sia', tittle: 'Lullaby', album: '', cover: 'https://images.shazam.com/coverart/t54664010-b708389188_s400.jpg' },
        { audio: 'https://muz.z1.fm/6/6f/lp_-_muddy_waters_(zf.fm).mp3', artist: 'LP', tittle: 'Muddy Waters', album: '', cover: 'https://images.shazam.com/coverart/t337772630-i1186767461_s400.jpg' }
        /* { audio: 'http://127.0.0.1:8000/storage/audio/77V_11YC8R147T45X1Z5X84PNMAC6Z.mp3', artist: 'Sia', tittle: 'Lullaby', album: '', cover: 'http://127.0.0.1:8000/storage/photos/default.jpg' },
        { audio: 'http://127.0.0.1:8000/storage/audio/CCP84EMP61920RGI76Y5TXJKSXT04F.mp3', artist: 'T.I', tittle: 'That\'s All She Wrote (ft. Eminem)', album: '', cover: 'http://127.0.0.1:8000/storage/photos/default.jpg' },
        { audio: 'http://127.0.0.1:8000/storage/audio/14AIFFI1PA_6EJ-FLT89JY00T9V89_.mp3', artist: 'LP', tittle: 'Muddy Waters [Live Session]', album: '', cover: 'http://127.0.0.1:8000/storage/photos/SDBPOQCA67XGHGGFMD58.jpg' },
        { audio: 'http://127.0.0.1:8000/storage/audio/LS54Q088NZT5AW14W20CE751262H2F.mp3', artist: 'Kai Honasan', tittle: 'Ngayong Gabi', album: 'In Your Face And Songs About Other Faces', cover: 'http://127.0.0.1:8000/storage/photos/Y584C_68A030RW5_TBZ5.jpg' } */
      ],
      presentSongId: 0,
      lastSongId: 0,
      isPlaying: false,
      audio: new Audio(),
      isPaused: false,
      volume: 0.5,
      //
      timeLapse: false,
      timeBufferSecs: 0,
      timeBufferMins: 0,
      currentTrackTime: 0,
      lastRecordedTrackTime: -1,
      countCheck: 0,
      currentTrackDuration: 0,
      //
      color: '#2aff09',
      progressPercent: 0
    }
  },
  watch: {
    volume () {
      this.audio.volume = this.volume
    },
    timeLapse () {
      if (this.timeLapse) {
        this.timeLapse = false
        this.viewShit()
      }
    },
    audio () {
      this.currentTrackTime = parseInt(this.audio.currentTime)
      this.lastRecordedTrackTime = -1
      console.log('changed Track')
    }
  },
  mounted () {
    let xns = this
    /* $(xns.audio).on('loadedmetadata', function(){
      alert(xns.audio.duration)
    }) */
    setTimeout(function () {
      xns.lastSongId = xns.Songs.length - 1
    }, 1500)
    this.audio.volume = this.volume
  },
  methods: {
    viewShit () {
      let xns = this
      setTimeout(function () {
        xns.currentTrackTime = parseInt(xns.audio.currentTime)
        // console.log('Current Track Time: ' + xns.currentTrackTime + ' lstRecTime: ' + xns.lastRecordedTrackTime)
        xns.progressPercent = (xns.currentTrackTime / xns.audio.duration) * 100
        if (xns.countCheck === 0) { // initializer start check
          // console.log('Current Track Time: ' + xns.currentTrackTime + ' lstRecTime: ' + xns.lastRecordedTrackTime)
          let ctdSecs = (parseInt(xns.audio.duration) % 60) < 10 ? '0' + parseInt(xns.audio.duration) % 60 : (parseInt(xns.audio.duration) % 60)
          xns.currentTrackDuration = parseInt(parseInt(xns.audio.duration) / 60) + ' : ' + ctdSecs
        }
        if (xns.currentTrackTime !== xns.lastRecordedTrackTime) {
          // console.log(parseInt(xns.audio.currentTime))
          if (parseInt(xns.audio.currentTime) >= 60) {
            xns.timeBufferMins = Math.floor(xns.audio.currentTime / 60)
            xns.timeBufferSecs = parseInt(Math.floor(xns.audio.currentTime)) % 60
          } else {
            xns.timeBufferSecs = parseInt(Math.floor(xns.audio.currentTime))
          }
          xns.duration -= 1
          xns.timeLapse = !xns.timeLapse
          xns.timeLapse = true // continue time lapse
          xns.countCheck += 1
          //
          xns.lastRecordedTrackTime = parseInt(Math.floor(xns.audio.currentTime))
        } else {
          if (!xns.audio.paused) {
            xns.isPlaying = true
            xns.isPaused = false
          } else {
            xns.timeBufferMins = 0
            xns.timeBufferSecs = 0
            xns.timeLapse = false // stop time lapse
            this.countCheck = 0 // initializer end
            xns.isPlaying = false
            xns.isPaused = false
          }
        }
      }, 1000)
    },
    playSong (SongId) {
      this.presentSongId = SongId
      this.audio.src = this.Songs[SongId].audio
      this.audio.play()
      this.isPlaying = true
      this.isPaused = false
      //
      this.countCheck = 0
      this.lastRecordedTrackTime = -1
      this.timeBufferMins = 0
      this.viewShit()
    },
    play (songId = this.presentSongId, type = '') {
      if (this.isPlaying && !this.isPaused) {
        if (type !== '') { // next/previous
          this.audio.src = this.Songs[songId].audio
          this.audio.play()
          this.isPlaying = true
          this.isPaused = false
        } else { // pause
          this.audio.pause()
          this.isPlaying = false
          this.isPaused = true
        }
      } else if (!this.isPlaying && this.isPaused) {
        if (type !== '') { // next/previous
          this.audio.src = this.Songs[songId].audio
          this.audio.play()
          this.isPlaying = true
          this.isPaused = false
        } else { // resume playing
          this.audio.play()
          this.isPlaying = true
          this.isPaused = false
        }
      } else if (!this.isPlaying && !this.isPaused) {
        this.audio.src = this.Songs[songId].audio
        this.audio.play()
        this.isPlaying = true
        this.isPaused = false
      }
      //
      this.countCheck = 0
      this.lastRecordedTrackTime = -1
      this.timeBufferMins = 0
      this.viewShit()
    },
    nextSong () {
      if ((this.presentSongId + 1) <= this.lastSongId) {
        this.presentSongId += 1
        this.play(this.presentSongId, 'next')
      } else {
        console.log('We\'ve arrived at the end of the playlist!')
      }
      //
      this.countCheck = 0
      this.lastRecordedTrackTime = -1
      this.timeBufferMins = 0
      this.viewShit()
    },
    prevSong () {
      if ((this.presentSongId - 1) >= 0) {
        this.presentSongId -= 1
        this.play(this.presentSongId, 'prev')
      } else {
        console.log('We\'ve arrived at the start of the playlist!')
      }
      //
      this.countCheck = 0
      this.lastRecordedTrackTime = -1
      this.timeBufferMins = 0
      this.viewShit()
    },
    stop () {
      if (this.audio) {
        this.audio.load()
        this.isPlaying = false
        this.isPaused = false
      } else {
        console.log('Nothing Playing!')
      }
      //
      this.countCheck = 1
      this.lastRecordedTrackTime = -1
      this.timeBufferMins = 0
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.play-controls{
  min-height: 360px;
  background-size: cover;
  background-repeat: no-repeat;
}
.play-controls > div.card-content > div.level.controls-window{
  margin-top: 5%;
}
.play-controls-button{
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}
.timer{
  float: right;
  font-size: large;
  font-weight: 600;
  color: rgba(255, 138, 28, 0.7);
}
.volume{
  float: left;
}
.level.controls-window{
  background: rgba(132, 175, 202, 0.3);
  -webkit-border-radius: 40px;
  -moz-border-radius: 40px;
  border-radius: 40px;
  border: solid 2px rgba(132, 175, 202, .4) ;
}
.level.progress-window{
  padding-top: 5px;
  max-height: 200px;
  max-width: 200px;
  margin: 50px;
}
.play-control-item{
  color: #000;
}
</style>
