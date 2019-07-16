<template>
  <div class="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-flex-col sm:tw-flex-row xl:tw-flex-row sm:tw-items-start tw-m-2 tw-p-2">
    <div class="tw-flex-grow sm:tw-flex-grow-0 md:tw-flex-grow-0 lg:tw-flex-grow-0 xl:tw-flex-grow-0 tw-p-0 tw-m-0 tw-max-h-cover tw-shadow" :style="'background: url(' + Songs[presentSongId].cover + ');background-repeat: no-repeat;background-position:center;background-size: cover'">
      <div class="tw-relative tw-shadow tw-max-w-full play-controls">
        <div class="tw-flex tw-flex-col tw-items-center tw-p-0 tw-m-0">
          <div class="tw-flex-grow tw-h-full tw-max-h-coverx tw-w-full tw-m-3 tw-items-center tw-align-middle tw-mt-1 tw-mx-auto tw-mb-3 tw-p-2">
            <v-circle :percent="progressPercent" stroke-width="6" stroke-linecap="round" :strokeColor="color"/>
          </div>
          <div class="tw-inline-flex tw-px-4 tw-py-1 tw-mb-2 tw-align-middle tw-justify-around pctrl tw-rounded-full">
            <div class="tw-mx-4">
              <span @click="prevSong()"><SkipBackwardIcon class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span>
            </div>
            <div class="mx-4">
              <span @click="play()"><PlayIcon class="tw-text-white tw-cursor-pointer" v-show="!isPlaying && !playerIsBuffering" w="30" h="30"/></span>
              <span @click="play()"><PauseIcon class="tw-text-white tw-cursor-pointer" v-show="isPlaying && !playerIsBuffering" w="30" h="30" /></span>
              <span><BufferingIcon class="tw-text-white tw-cursor-pointer" animate="rotate" v-show="playerIsBuffering" w="30" h="30" /></span>
            </div>
            <div class="tw-mx-4">
              <span @click="stop()"><SquareIcon class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span>
            </div>
            <div class="tw-mx-4">
              <span @click="nextSong()"><SkipForwardIcon class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span>
            </div>
          </div>
          <div class="tw-flex-grow track-scrubbing tw-mx-5 pctrl">
            <vue-slider :width="260" @change="scrubChange()" v-model="playerProgressPercent" :process="true" :interval="0.01"></vue-slider>
          </div>
          <div class="tw-inline-flex tw-items-start tw-px-2 tw-mx-0 tw-w-full tw-align-middle tw-justify-around pctrl">
            <div class="tw-inline-flex tw-items-center tw-align-middle tw-m-1">
              <vue-slider :width="120" :duration="0.1" :min="0" :max="1" v-model="playerVolume" :process="true" :interval="0.01"></vue-slider>
              <span v-tooltip.top-center="continuousPlay ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay()" :class="continuousPlay ? 'tw-p-1 tw-bg-transparent tw-text-primary-green' : 'tw-p-1 tw-bg-transparent tw-text-white'"><RefreshIcon/></span>
            </div>
            <div class="tw-p-2">
              <div class="tw-text-sm tw-text-white"> {{timeBufferMins}} : {{timeBufferSecs | doubleDigits}} - {{currentTrackDuration}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-flex-grow tw-pt-0 tw-pl-0 sm:tw-pl-2 tw-mt-2 sm:tw-mt-0 tw-ml-0 sm:tw-ml-2">
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
