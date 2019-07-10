<template>
  <div class="flex flex-wrap sm:flex-no-wrap flex-col sm:flex-row xl:flex-row sm:items-start m-2 p-2">
    <div class="flex-grow sm:flex-grow-0 md:flex-grow-0 lg:flex-grow-0 xl:flex-grow-0 p-0 m-0 max-h-cover shadow" :style="'background: url(' + Songs[presentSongId].cover + ');background-repeat: no-repeat;background-position:center;background-size: cover'">
      <div class="relative shadow max-w-full play-controls">
        <div class="flex flex-col items-center p-0 m-0">
          <div class="flex-grow h-full max-h-coverx w-full m-3 items-center align-middle mt-1 mx-auto mb-3 p-2">
            <v-circle :percent="progressPercent" stroke-width="6" stroke-linecap="round" :strokeColor="color"/>
          </div>
          <div class="inline-flex px-4 py-1 mb-2 align-middle justify-around pctrl rounded-full">
            <div class="mx-4">
              <span @click="prevSong()"><SkipBackwardIcon class="text-white cursor-pointer" w="30" h="30" /></span>
            </div>
            <div class="mx-4">
              <span @click="play()"><PlayIcon class="text-white cursor-pointer" v-show="!isPlaying && !playerIsBuffering" w="30" h="30"/></span>
              <span @click="play()"><PauseIcon class="text-white cursor-pointer" v-show="isPlaying && !playerIsBuffering" w="30" h="30" /></span>
              <span><BufferingIcon class="text-white cursor-pointer" animate="rotate" v-show="playerIsBuffering" w="30" h="30" /></span>
            </div>
            <div class="mx-4">
              <span @click="stop()"><SquareIcon class="text-white cursor-pointer" w="30" h="30" /></span>
            </div>
            <div class="mx-4">
              <span @click="nextSong()"><SkipForwardIcon class="text-white cursor-pointer" w="30" h="30" /></span>
            </div>
          </div>
          <div class="flex-grow track-scrubbing mx-5 pctrl">
            <vue-slider :width="260" @change="scrubChange()" v-model="playerProgressPercent" :process="true" :interval="0.01"></vue-slider>
          </div>
          <div class="inline-flex items-start px-2 mx-0 w-full align-middle justify-around pctrl">
            <div class="inline-flex items-center align-middle m-1">
              <vue-slider :width="120" :duration="0.1" :min="0" :max="1" v-model="playerVolume" :process="true" :interval="0.01"></vue-slider>
              <span v-tooltip.top-center="continuousPlay ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay()" :class="continuousPlay ? 'p-1 bg-transparent text-primary-green' : 'p-1 bg-transparent text-white'"><RefreshIcon/></span>
            </div>
            <div class="p-2">
              <div class="text-sm text-white"> {{timeBufferMins}} : {{timeBufferSecs | doubleDigits}} - {{currentTrackDuration}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow pt-0 pl-0 sm:pl-2 mt-2 sm:mt-0 ml-0 sm:ml-2">
      <!--<progress-bar bar-color="#333333" size="tiny" :val="audio.currentTime" :max="!audio.duration ? 100 : audio.duration"></progress-bar>-->
      <songs-playlist :current-track-id="presentSongId" @playSelectSong="playSong" :Songs="Songs"></songs-playlist>
    </div>
  </div>
</template>

<script>
    import {mapState, mapGetters } from 'vuex'
    import SongsPlaylist from './../components/SongsPlaylist'
    import VueSlider from 'vue-slider-component'
    import { VCircle } from 'v-progress'
    /*import ProgressBar from 'vue-simple-progress'*/
    import Vue from 'vue'
    import VTooltip from 'v-tooltip'
    import './../assets/tooltip.css'
    import RefreshIcon from 'vue-ionicons/dist/md-refresh'
    import SkipBackwardIcon from 'vue-ionicons/dist/md-skip-backward'
    import PlayIcon from 'vue-ionicons/dist/md-play'
    import PauseIcon from 'vue-ionicons/dist/md-pause'
    import SquareIcon from 'vue-ionicons/dist/md-square'
    import SkipForwardIcon from 'vue-ionicons/dist/md-skip-forward'
    import BufferingIcon from 'vue-ionicons/dist/md-refresh'
    import PlayerMixin from './../mixins/PlayerMixin'
    Vue.use(VTooltip);
    export default {
        name: 'MainPlayer',
        components: {
            SongsPlaylist, VCircle, /*ProgressBar,*/ RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, VueSlider, BufferingIcon
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
                'volume',
                'playerIsBuffering'
        ]),
            ...mapGetters({getVolume: 'getVolume'})
        },
    }
</script>

<style scopped>
  .vue-progress-circle{
    width: fit-content !important;
    width: -moz-fit-content !important;
  }
  .track-scrubbing > div{
    padding: 0 !important;
  }
  .pctrl{
    background: rgba(51, 51, 51, 0.85);
    border: solid 1px rgba(51, 51, 51, .4) ;
  }
  .play-controls{
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.2));
  }
  h3{
    font-size: 24px;
    font-family: "Berlin Sans FB";
    font-weight: 800;
  }
</style>
