<template>
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
                  <span @click="prevSong()"><SkipBackwardIcon class="play-control-item" w="30" h="30" /></span>
                </div>
                <div class="column">
                  <span @click="play()"><PlayIcon class="play-control-item" v-show="!isPlaying" w="30" h="30"/></span>
                  <span @click="play()"><PauseIcon class="play-control-item" v-show="isPlaying" w="30" h="30" /></span>
                </div>
                <div class="column">
                  <span @click="stop()"><SquareIcon class="play-control-item" w="30" h="30" /></span>
                </div>
                <div class="column">
                  <span @click="nextSong()"><SkipForwardIcon class="play-control-item" w="30" h="30" /></span>
                </div>
              </div>
            </div>
          </div>
          <div class="columns track-scrubbing">
              <div class="column is-12 track-scrubbing">
                  <vue-slider @change="scrubChange()" v-model="playerProgressPercent" :process="true" :interval="0.01"></vue-slider>
              </div>
          </div>
        </div>
      </div>
      <div class="level volume-timer">
        <div class="level-left volume-repeat">
          <vue-slider :width="150" :duration="0.1" :min="0" :max="1" v-model="playerVolume" :process="true" :interval="0.01"></vue-slider>
          <span v-tooltip.top-center="continuousPlay ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay()" :class="continuousPlay ? 'is-small is-transparent continuous-play-on' : 'is-small is-transparent continuous-play-off'"><RefreshIcon/></span>
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
</template>

<script>
    import {mapState, mapGetters } from 'vuex'
    import SongsPlaylist from './../components/SongsPlaylist'
    import VueSlider from 'vue-slider-component'
    import { VCircle } from 'v-progress'
    import ProgressBar from 'vue-simple-progress'
    import Vue from 'vue'
    import VTooltip from 'v-tooltip'
    import './../assets/tooltip.css'
    import RefreshIcon from 'vue-ionicons/dist/md-refresh'
    import SkipBackwardIcon from 'vue-ionicons/dist/md-skip-backward'
    import PlayIcon from 'vue-ionicons/dist/md-play'
    import PauseIcon from 'vue-ionicons/dist/md-pause'
    import SquareIcon from 'vue-ionicons/dist/md-square'
    import SkipForwardIcon from 'vue-ionicons/dist/md-skip-forward'
    import PlayerMixin from './../mixins/PlayerMixin'
    Vue.use(VTooltip);
    export default {
        name: 'MainPlayer',
        components: {
            SongsPlaylist, VCircle, ProgressBar, RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, VueSlider
        },
        mixins: [PlayerMixin],
        data(){
            return { playerVolume: 0, playerProgressPercent: 0, hidePlayer: false}
        },
        computed:{
            ...mapState([
                'Songs',
                'presentSongId',
                'lastSongId',
                'isPlaying',
                'audio',
                'isPaused',
                'timeBufferSecs',
                'timeBufferMins',
                'currentTrackTime',
                'lastRecordedTrackTime',
                'countCheck',
                'currentTrackDuration',
                'color',
                'progressPercent',
                'continuousPlay',
                'timeLapse',
                'volume'
        ]),
            ...mapGetters({getVolume: 'getVolume'})
        },
    }
</script>

<style scopped>
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
  .volume-timer{
    padding-right: 5px;
    padding-left: 5px;
  }
  .list{
    border-radius: 0;
  }
  .is-transparent{
    background-color: transparent !important;
  }
  .continuous-play-on, .continuous-play-off {
    margin-left: 10px;
    margin-top: 4px;
    cursor: pointer;
  }
  .continuous-play-on{
    color: #21FB92;
  }
  .continuous-play-off{
    color: #fff;
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
