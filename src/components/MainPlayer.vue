<template>
  <div v-if="activePlaylist && (activePlaylist.songs.length > 0)" class="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-flex-col sm:tw-flex-row xl:tw-flex-row sm:tw-items-start tw-m-2 tw-p-2">
    <div class="tw-flex-grow sm:tw-flex-grow-0 md:tw-flex-grow-0 lg:tw-flex-grow-0 xl:tw-flex-grow-0 tw-p-0 tw-m-0 tw-max-h-cover tw-shadow" :style="'background: url(' + activePlaylist.songs[activePlayer.currentTrackId].cover + ');background-repeat: no-repeat;background-position:center;background-size: cover'">
      <div class="tw-relative tw-shadow tw-max-w-full play-controls">
        <div class="tw-flex tw-flex-col tw-items-center tw-p-0 tw-m-0">
          <div class="tw-flex-grow tw-h-full tw-max-h-coverx tw-w-full tw-m-3 tw-items-center tw-align-middle tw-mt-1 tw-mx-auto tw-mb-3 tw-p-2">
            <v-circle :percent="(activePlayer.currentTrackTime/activePlayer.currentTrackDuration * 100)" stroke-width="6" stroke-linecap="round" :strokeColor="progressColor"/>
          </div>
          <div class="tw-inline-flex tw-px-4 tw-py-1 tw-mb-2 tw-align-middle tw-justify-around pctrl tw-rounded-full">
            <div class="tw-mx-4">
              <span @click="playPrevSong()"><SkipBackwardIcon class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span>
            </div>
            <div class="mx-4">
              <span @click="playCurrentSong()">
                <PlayIcon class="tw-text-white tw-cursor-pointer" v-show="!activePlayer.isPlaying && !activePlayer.playerIsLoading" w="30" h="30"/>
              </span>
              <span @click="pauseSong()">
                <PauseIcon class="tw-text-white tw-cursor-pointer" v-show="activePlayer.isPlaying && !activePlayer.playerIsLoading" w="30" h="30" />
              </span>
              <span>
                <BufferingIcon class="tw-text-white tw-cursor-pointer" animate="rotate" v-show="activePlayer.playerIsLoading" w="30" h="30" />
              </span>
            </div>
            <div class="tw-mx-4">
              <span @click="stop()"><SquareIcon class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span>
            </div>
            <div class="tw-mx-4">
              <span @click="playNextSong()"><SkipForwardIcon class="tw-text-white tw-cursor-pointer" w="30" h="30" /></span>
            </div>
          </div>
          <div class="tw-flex-grow tw-w-full track-scrubbing tw-mx-5 pctrl">
            <xns-seek-bar :bar-height="progressHeightMain" :bar-color="progressColor" :bar-shade-color="progressBgColor" :intensity="1" :current-value="activePlayer.currentTrackTime" :total-value="activePlayer.currentTrackDuration" @seekedTo="seekPlayer"></xns-seek-bar>
          </div>
          <div class="tw-inline-flex tw-items-start tw-px-2 tw-mx-0 tw-w-full tw-align-middle tw-justify-around pctrl">
            <div class="tw-inline-flex tw-w-1/2 tw-items-center tw-align-middle tw-m-1">
              <xns-seek-bar @seekedTo="changeVolume" :bar-height="volumeHeightMain" :bar-color="progressColor" :bar-shade-color="progressBgColor" :intensity="1" :current-value="activePlayer.volume" :total-value="1"></xns-seek-bar>
              <span v-tooltip.top-center="activePlayer.continuousPlaybackStatus ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay(!activePlayer.continuousPlaybackStatus)" :class="activePlayer.continuousPlaybackStatus ? 'tw-p-1 tw-bg-transparent tw-text-primary-green tw-cursor-pointer' : 'tw-p-1 tw-bg-transparent tw-text-white tw-cursor-pointer'"><RefreshIcon/></span>
            </div>
            <div class="tw-p-2">
              <div class="tw-text-sm tw-text-white">{{activePlayer.currentTrackTime | doubleDigits }} - {{activePlayer.currentTrackDuration | doubleDigits}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-flex-grow tw-pt-0 tw-pl-0 sm:tw-pl-2 tw-mt-2 sm:tw-mt-0 tw-ml-0 sm:tw-ml-2" v-for="(playlist, key) in playlists" :key="key">
      <songs-playlist :playlist-position="key" :current-track-id="getCurrentTrackId(key)" @play-select-song="playSelectedSong" :playlist="playlist"></songs-playlist>
    </div>
  </div>
</template>

<script>
    import SongsPlaylist from './../components/SongsPlaylist'
    import { VCircle } from 'v-progress'
    import XnsSeekBar from 'xns-seek-bar'
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
    Vue.use(XnsSeekBar)
    export default {
      name: 'MainPlayer',
      components: {
        SongsPlaylist, VCircle, RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, BufferingIcon
      },
      mixins: [PlayerMixin]
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
