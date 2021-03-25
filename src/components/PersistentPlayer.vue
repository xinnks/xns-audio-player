<template>
	<div v-if="activePlaylist.songs && (activePlaylist.songs.length > 0)">
		<span v-if="hidePlayer" @click="hidePlayer = false" class="player-reveal-button tw-cursor-pointer tw-fixed tw-right-0 tw-bottom-0
h-10 w-10"><RevealIcon w="40" h="40" /></span>
		<div :class="hidePlayer ? 'tw-flex tw-flex-row tw-flex-wrap md:tw-flex-no-wrap lg:tw-flex-no-wrap xl:tw-flex-no-wrap tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-z-20 tw-min-h-10 tw-max-h-persplayrmaxheight sm:tw-max-h-persplayrmaxheight md:tw-max-h-persplayrmaxheight lg:tw-max-h-persplayrmaxheight lg:tw-max-h-persplayrmaxheight tw-min-h-persplayrminheight tw-py-0 tw-px-0 tw-mt-0 tw-mr-0 tw-mb-0 tw-ml-0 tw-bg-no-repeat tw-bg-center tw-bg-cover tw-hidden pp' : 'tw-flex tw-flex-row tw-flex-wrap md:tw-flex-no-wrap lg:tw-flex-no-wrap xl:tw-flex-no-wrap tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-z-20 tw-min-h-10 tw-max-h-persplayrmaxheightsm sm:tw-max-h-persplayrmaxheight md:tw-max-h-persplayrmaxheight lg:tw-max-h-persplayrmaxheight lg:tw-max-h-persplayrmaxheight tw-min-h-persplayrminheight tw-py-0 tw-px-0 tw-mt-0 tw-mr-0 tw-mb-0 tw-ml-0 tw-bg-no-repeat tw-bg-center tw-bg-cover pp'" :style="'background-image:url('+activePlaylist.songs[activePlayer.currentTrackId || 0].cover+'); background-repeat: no-repeat; background-position: center; background-size: cover'">
			<span v-if="!hidePlayer" @click="hidePlayer = true" class="player-hide-button tw-absolute tw-cursor-pointer tw-right-0 tw-top-0 tw-h-10 tw-w-10 tw-z-30"><CloseIcon w="30" h="30" /></span>
			<div class="tw-flex-grow-0 tw-p-2 tw-m-0 tw-w-full md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/5 pp-controls">
				<div class="tw-inline-flex tw-flex-col tw-items-center tw-w-full">
					<div class="tw-inline-flex tw-flex-row tw-w-full tw-items-center tw-align-middle tw-justify-around tw-px-4 tw-py-1">
						<div class="tw-flex-1 tw-m-1 tw-justify-center tw-align-middle" @click="playPrevSong()">
							<SkipBackwardIcon class="tw-cursor-pointer tw-text-white" w="30" h="30" />
						</div>
						<div class="tw-flex-1 tw-m-1 tw-justify-center tw-align-middle">
							<span @click="playCurrentSong()">
								<PlayIcon class="tw-cursor-pointer tw-text-white" v-show="!activePlayer.isPlaying && !activePlayer.playerIsLoading" w="30" h="30"/>
							</span>
							<span @click="pauseSong()">
								<PauseIcon class="tw-cursor-pointer tw-text-white" v-show="activePlayer.isPlaying && !activePlayer.playerIsLoading" w="30" h="30" />
							</span>
							<span>
								<BufferingIcon class="tw-text-white tw-cursor-pointer" animate="beat" v-show="activePlayer.playerIsLoading" w="30" h="30" />
							</span>
						</div>
						<div class="tw-flex-1 tw-m-1 tw-justify-center tw-align-middle" @click="stop()">
							<SquareIcon class="tw-cursor-pointer tw-text-white" w="30" h="30" />
						</div>
						<div class="tw-flex-1 tw-m-1 tw-justify-center tw-align-middle" @click="playNextSong()">
							<SkipForwardIcon class="tw-cursor-pointer tw-text-white" w="30" h="30"/>
						</div>
					</div>
					<div class="tw-inline-flex tw-flex-row tw-w-full tw-items-center tw-justify-between px-4 py-1">
						<div class="tw-flex-1 tw-w-3/4">
							<xns-seek-bar @seekedTo="changeVolume" :bar-height="volumeHeightPersistent" :bar-color="progressColor" :bar-shade-color="progressBgColor" :intensity="100" :current-value="activePlayer.volume" :total-value="1"></xns-seek-bar>
						</div>
						<div class="tw-flex-1 tw-w-1/4">
							<span v-tooltip.top-center="activePlayer.continuousPlaybackStatus ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay(!activePlayer.continuousPlaybackStatus)" :class="activePlayer.continuousPlaybackStatus ? 'tw-bg-transparent tw-float-right tw-text-white tw-text-primary-green' : 'tw-bg-transparent tw-float-right tw-text-white'"><RefreshIcon w="30" h="30"/></span>
						</div>
					</div>
				</div>
			</div>
			<div class="tw-flex-1 tw-w-full md:tw-w-2/3 lg:tw-w-3/4 xl:tw-w-4/5 playing-progress tw-m-0 tw-px-3 sm:tw-p-12 tw-h-16 sm:tw-h-auto md:tw-h-full lg:tw-h-full xl:tw-h-full">
				<xns-seek-bar :bar-height="progressHeightPersistent" :bar-color="progressColor" :bar-shade-color="progressBgColor" :intensity="1" :current-value="activePlayer.currentTrackTime" :total-value="activePlayer.currentTrackDuration" @seekedTo="seekPlayer"></xns-seek-bar>
				<div v-if="!isNaN(activePlayer.currentTrackDuration)" class="tw-float-right tw-text-2xl tw-text-sm sm:tw-text-lg tw-font-bold tw-text-white"> {{activePlayer.currentTrackTime | doubleDigits }} - {{activePlayer.currentTrackDuration | doubleDigits}}</div>
				<div v-else class="tw-float-right tw-text-2xl tw-text-sm sm:tw-text-lg tw-font-bold tw-text-white">{{'0 : 00'}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import XnsSeekBar from 'xns-seek-bar'
import VTooltip from 'v-tooltip'
import './../assets/tooltip.css'
import RefreshIcon from 'vue-ionicons/dist/ios-refresh'
import SkipBackwardIcon from 'vue-ionicons/dist/ios-skip-backward'
import PlayIcon from 'vue-ionicons/dist/ios-play'
import PauseIcon from 'vue-ionicons/dist/ios-pause'
import SquareIcon from 'vue-ionicons/dist/ios-square'
import SkipForwardIcon from 'vue-ionicons/dist/ios-skip-forward'
import CloseIcon from 'vue-ionicons/dist/md-close-circle.vue'
import RevealIcon from 'vue-ionicons/dist/ios-arrow-up.vue'
import BufferingIcon from 'vue-ionicons/dist/ios-refresh-circle'
import PlayerMixin from './../mixins/PlayerMixin'
Vue.use(VTooltip);
Vue.use(XnsSeekBar);
export default {
	name: 'PersistentPlayer',
	components: {
		RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, CloseIcon, RevealIcon, BufferingIcon
	},
	mixins: [PlayerMixin]
}
</script>

<style scoped>
	.pp{
		background: #232526;
		background: -webkit-linear-gradient(to right, rgba(35, 37, 38, .8), rgba(65, 67, 69, .8));
		background: linear-gradient(to right, rgba(35, 37, 38, .8), rgba(65, 67, 69, .8));
	}
	.pp-controls{
		background: #303942;
		background: -webkit-linear-gradient(to right, rgba(43, 51, 59, 0.95), rgba(41, 50, 60, .95));
		background: linear-gradient(to right, rgba(43, 51, 59, 0.95), rgba(41, 50, 60, .95));
	}
	.playing-progress{
		background: #000000;
		background: -webkit-linear-gradient(to right, rgba(0,0,0,.6), rgba(67,67,67,.6));
		background: linear-gradient(to right, rgba(0,0,0,.6), rgba(67,67,67,.6));
	}
	.player-reveal-button{
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
		background: #36d1dc;
		background: -webkit-linear-gradient(to right, #c9d6ff, #e2e2e2);
		background: linear-gradient(to right, #c9d6ff, #e2e2e2);
	}
</style>
