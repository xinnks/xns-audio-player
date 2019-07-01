<template>
  <div class="section">
    <div class="container">
      <div class="level">
        <div class="level-item">
          <h3>XNS AUDIO PLAYER</h3>
        </div>
      </div>
      &nbsp;
      <div class="columns">
        <div :style="'background: url(' + Songs[presentSongId].cover + ');margin-top:12px;background-repeat: no-repeat;background-position:center;background-size: cover'" class="column is-4 cover-overlay">
          <div class="card play-controls">
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
                      <span @click="prevSong()"><SkipBackwardIcon class="play-control-item" w="30" h="30" @click="prevSong()"/></span>
                    </div>
                    <div class="column">
                      <span @click="play()"><PlayIcon class="play-control-item" v-show="!isPlaying" w="30" h="30"/></span>
                      <span @click="play()"><PauseIcon class="play-control-item" v-show="isPlaying" w="30" h="30" @click="play()"/></span>
                    </div>
                    <div class="column">
                      <span @click="stop()"><SquareIcon class="play-control-item" w="30" h="30" @click="stop()"/></span>
                    </div>
                    <div class="column">
                      <span @click="nextSong()"><SkipForwardIcon class="play-control-item" w="30" h="30" @click="nextSong()"/></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns track-scrubbing">
                  <div class="column is-12 track-scrubbing">
                      <vue-slider @change="scrubToTime()" v-model="progressPercent" :process="true" :interval="0.01"></vue-slider>
                  </div>
              </div>
            </div>
          </div>
          <div class="level volume-timer">
            <div class="level-left">
              <range-slider class="volume" v-model="volume" :min="0" :max="1" :step="0.05"></range-slider>
              <span v-tooltip.top-center="continuousPlay ? 'Repeat: ALL' : 'Repeat: OFF'" @click="continuousPlay=!continuousPlay" :class="continuousPlay ? 'is-small is-transparent continuous-play-on' : 'is-small is-transparent continuous-play-off'"><RefreshIcon/></span>
            </div>
            <div class="level-right">
              <div class="timer"> {{timeBufferMins}} : {{timeBufferSecs | doubleDigits}} - {{currentTrackDuration}}</div>
            </div>
          </div>
        </div>
        <div class="column playlist-col is-8">
          <progress-bar bar-color="#333333" size="tiny" :val="audio.currentTime" :max="!audio.duration ? 100 : audio.duration"></progress-bar>
          <songs-playlist :current-track-id="presentSongId" @playSelectSong="playSong" :Songs="Songs"></songs-playlist>
        </div>
      </div>
    </div>
    <PersistentPlayer/>
  </div>
</template>

<script>
    import PersistentPlayer from './components/PersistentPlayer'
    import SongsPlaylist from './components/SongsPlaylist'
    import RangeSlider from 'vue-range-slider'
    import 'vue-range-slider/dist/vue-range-slider.css'
    import VueSlider from 'vue-slider-component'
    import { VCircle } from 'v-progress'
    import ProgressBar from 'vue-simple-progress'
    import Vue from 'vue'
    import VTooltip from 'v-tooltip'
    import './assets/tooltip.css'
    import RefreshIcon from 'vue-ionicons/dist/md-refresh'
    import SkipBackwardIcon from 'vue-ionicons/dist/md-skip-backward'
    import PlayIcon from 'vue-ionicons/dist/md-play'
    import PauseIcon from 'vue-ionicons/dist/md-pause'
    import SquareIcon from 'vue-ionicons/dist/md-square'
    import SkipForwardIcon from 'vue-ionicons/dist/md-skip-forward'
    Vue.use(VTooltip);
    export default {
        name: 'App',
        components: {
            SongsPlaylist, RangeSlider, VCircle, ProgressBar, RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, VueSlider, PersistentPlayer
        },
        data () {
            return {
                loading: 'getLoadingState',
                Songs: [
                    { audio: 'https://rorg.z1.fm/d/3f/ti_ft_eminem_-_thats_all_she_wrote_(zv.fm).mp3', artist: 'T.I', tittle: 'That\'s All She Wrote (ft. Eminem)', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189593/random/f55abc725080eb05147e45ce3cd406a8.1000x1000x1.jpg' },
                    { audio: 'https://dll.z1.fm/music/8/e8/ellie_goulding_feat_diplo__swae_lee_-_close_to_me.mp3', artist: 'Ellie Goulding Feat. Diplo & Swae Lee', tittle: 'Close To Me', album: 'None', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189716/random/ellie-goulding-close-to-me-lg.jpg' },
                    { audio: 'https://rorg.z1.fm/8/ff/sia_-_lullaby_zaycevnet_(zv.fm).mp3', artist: 'Sia', tittle: 'Lullaby', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189786/random/t54664010-b708389188_s400.jpg' },
                    { audio: 'https://muz.z1.fm/6/6f/lp_-_muddy_waters_(zf.fm).mp3', artist: 'LP', tittle: 'Muddy Waters', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189837/random/t337772630-i1186767461_s400.jpg' },
                    { audio: 'https://rorg.z1.fm/f/d6/david_dallas_-_runnin_(zf.fm).mp3', artist: 'David Dallas', tittle: 'Runnin', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189882/random/t93555159-i1095888717_s400.jpg'},
                    { audio: 'https://jt2.z1.fm/f/bf/labrinth_-_vultures_(zvukoff.ru).mp3', artist: 'Labrinth', tittle: 'Vultures', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551189373/random/R-3512282-1392987047-7461.jpeg.jpg'},
                    { audio: 'https://muz17.z1.fm/b/10/niall_horan_-_slow_hands_slow_hands_(zf.fm).mp3', artist: 'Niall Horan', tittle: 'Slow Hands', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551190705/random/niall-horan-slow-hands-audio-02.jpg'},
                    { audio: 'https://muz.z1.fm/a/fa/davide_esposito_-_a_cavallo_del_vento_(zf.fm).mp3', artist: 'Davide Esposito', tittle: 'A Cavallo Del Vento', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551190889/random/500x500.jpg'},
                    { audio: 'https://dll.z1.fm/music/9/88/benny_blanco__halsey__khalid_-_eastside.mp3', artist: 'Benny Blanco, Halsey & Khalid', tittle: 'Eastside', album: '', cover: 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1551192768/random/artworks-000432419499-7ts3gr-t500x500.jpg'}
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
                color: '#8dff97',
                progressPercent: 0,
                continuousPlay: false
            }
        },
        watch: {
            volume () {
                this.audio.volume = this.volume
            },
            timeLapse () {
                let xns = this
                if (this.timeLapse) {
                    this.timeLapse = false;
                    this.viewShit()
                }
                if((this.currentTrackDuration === 'NaN : NaN') || ((this.progressPercent === 'NaN') || (this.progressPercent === 0))){ // fix to displaying track time 'NaN : NaN' & timeBufferMins being stuck at 0
                    this.countCheck = 0
                    this.viewShit()
                    setTimeout(()=>{
                        if((this.progressPercent === 'NaN') || (this.progressPercent === 0)){
                            xns.audio.currentTime = xns.audio.currentTime;
                            xns.viewShit()
                        }
                    }, 2000)
                }
            },
            audio () {
                this.currentTrackTime = parseInt(this.audio.currentTime);
                this.lastRecordedTrackTime = -1
                // console.log('changed Track')
            }
        },
        mounted () {
            let xns = this;
            setTimeout(function () {
                xns.lastSongId = xns.Songs.length - 1
            }, 1500);
            this.audio.volume = this.volume
        },
        methods: {
            viewShit () {
                let xns = this;
                setTimeout(function () {
                    xns.currentTrackTime = parseInt(xns.audio.currentTime);
                    // console.log('Current Track Time: ' + xns.currentTrackTime + ' lstRecTime: ' + xns.lastRecordedTrackTime)
                    xns.progressPercent = (xns.currentTrackTime / xns.audio.duration) * 100;
                    if (xns.countCheck === 0) { // initializer start check
                        // console.log('Current Track Time: ' + xns.currentTrackTime + ' lstRecTime: ' + xns.lastRecordedTrackTime)
                        let ctdSecs = (parseInt(xns.audio.duration) % 60) < 10 ? '0' + parseInt(xns.audio.duration) % 60 : (parseInt(xns.audio.duration) % 60);
                        xns.currentTrackDuration = parseInt(parseInt(xns.audio.duration) / 60) + ' : ' + ctdSecs
                    }
                    if (xns.currentTrackTime !== xns.lastRecordedTrackTime) {
                        // console.log(parseInt(xns.audio.currentTime))
                        if (parseInt(xns.audio.currentTime) >= 60) {
                            xns.timeBufferMins = Math.floor(xns.audio.currentTime / 60);
                            xns.timeBufferSecs = parseInt(Math.floor(xns.audio.currentTime)) % 60
                        } else {
                            xns.timeBufferSecs = parseInt(Math.floor(xns.audio.currentTime))
                        }
                        xns.duration -= 1;
                        xns.timeLapse = !xns.timeLapse;
                        xns.timeLapse = true; // continue time lapse
                        xns.countCheck += 1;
                        //
                        xns.lastRecordedTrackTime = parseInt(Math.floor(xns.audio.currentTime))
                    } else {
                        if (!xns.audio.paused) {
                            xns.isPlaying = true;
                            xns.isPaused = false
                        } else {
                            xns.timeBufferMins = 0;
                            xns.timeBufferSecs = 0;
                            xns.timeLapse = false; // stop time lapse
                            this.countCheck = 0; // initializer end
                            xns.isPlaying = false;
                            xns.isPaused = false;
                            if (xns.continuousPlay) { // if continuous play === true
                                xns.nextSong()
                            }
                        }
                    }
                }, 1000)
            },
            playSong (SongId) {
                console.log(SongId)
                this.presentSongId = SongId;
                this.audio.src = this.Songs[SongId].audio;
                this.audio.play();
                this.isPlaying = true;
                this.isPaused = false;
                //
                this.countCheck = 0;
                this.lastRecordedTrackTime = -1;
                this.timeBufferMins = 0;
                this.viewShit()
            },
            play (songId = this.presentSongId, type = '') {
                if (this.isPlaying && !this.isPaused) {
                    if (type !== '') { // next/previous
                        this.audio.src = this.Songs[songId].audio;
                        this.audio.play();
                        this.isPlaying = true;
                        this.isPaused = false
                    } else { // pause
                        this.audio.pause();
                        this.isPlaying = false;
                        this.isPaused = true
                    }
                } else if (!this.isPlaying && this.isPaused) {
                    if (type !== '') { // next/previous
                        this.audio.src = this.Songs[songId].audio;
                        this.audio.play();
                        this.isPlaying = true;
                        this.isPaused = false
                    } else { // resume playing
                        this.audio.play();
                        this.isPlaying = true;
                        this.isPaused = false
                    }
                } else if (!this.isPlaying && !this.isPaused) {
                    this.audio.src = this.Songs[songId].audio;
                    this.audio.play();
                    this.isPlaying = true;
                    this.isPaused = false
                }
                //
                this.countCheck = 0;
                this.lastRecordedTrackTime = -1;
                this.timeBufferMins = 0;
                this.viewShit()
            },
            nextSong () {
                if ((this.presentSongId + 1) <= this.lastSongId) {
                    this.presentSongId += 1;
                    this.play(this.presentSongId, 'next')
                } else {
                    if (this.continuousPlay) { // if continuous play === true
                        this.play(0) // restart the playlist
                    }
                    // console.log('We\'ve arrived at the end of the playlist!')
                }
                this.countCheck = 0;
                this.lastRecordedTrackTime = -1;
                this.timeBufferMins = 0;
                this.viewShit()
            },
            prevSong () {
                if ((this.presentSongId - 1) >= 0) {
                    this.presentSongId -= 1;
                    this.play(this.presentSongId, 'prev')
                } else {
                    // console.log('We\'ve arrived at the start of the playlist!')
                }
                this.countCheck = 0;
                this.lastRecordedTrackTime = -1;
                this.timeBufferMins = 0;
                this.viewShit()
            },
            stop () {
                if (this.audio) {
                    this.audio.load();
                    this.isPlaying = false;
                    this.isPaused = false;
                    this.continuousPlay = false // halt continuous play
                } else {
                    // console.log('Nothing Playing!')
                }
                this.countCheck = 1;
                this.lastRecordedTrackTime = -1;
                this.timeBufferMins = 0
            },
            scrubToTime(){
                this.audio.currentTime = (this.progressPercent * this.audio.duration) / 100;
                this.viewShit()
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
  /*Track Scrobbing*/
  .track-scrubbing > div{
    padding: 0 !important;
  }
  .play-controls{
    min-height: 360px;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .play-controls > div.card-content > div.level.controls-window{
    margin-top: 10px;
    padding-top: 5px;
  }
  .timer{
    float: right;
    font-size: large;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
  .volume{
    float: left;
  }
  .level.controls-window{
    background: rgba(51, 51, 51, 0.85);
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    border-radius: 40px;
    border: solid 2px rgba(51, 51, 51, .4) ;
  }
  .level.progress-window{
    padding-top: 5px;
    max-height: 200px;
    margin: 50px;
  }
  .play-control-item{
    color: #ffffff;
    cursor: pointer;
  }
  .card.play-controls{
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.2));
  }
  .volume-timer{
    background: rgba(51, 51, 51, 0.85);
  }
  .volume-timer > div.level-right > div.timer{
    padding-right: 5px;
  }
  .list{
    border-radius: 0;
  }
  .is-transparent{
    background-color: transparent !important;
  }
  .continuous-play-on{
    color: #21FB92;
    margin-top: 4px;
    cursor: pointer;
  }
  .continuous-play-off{
    color: #fff;
    margin-top: 4px;
    cursor: pointer;
  }
  .cover-overlay{
    background-color: rgba(0,0,0, .4);
    padding: 0 !important;
    margin: 0 !important;
    max-height: 496px;
  }
  h3{
    font-size: 24px;
    font-family: "Berlin Sans FB";
    font-weight: 800;
  }
  .playlist-col{
    padding-top: 0;
  }
</style>

// ROOT PLAYER NOT IN USE IN THIS VERSION
