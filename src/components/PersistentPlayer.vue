<template>
	<div>
		<span v-if="hidePlayer" @click="hidePlayer = false" class="player-reveal-button cursor-pointer fixed right-0 bottom-0
h-10 w-10"><RevealIcon w="40" h="40" /></span>
		<div :class="hidePlayer ? 'flex flex-row flex-wrap md:flex-no-wrap lg:flex-no-wrap xl:flex-no-wrap fixed bottom-0 left-0 right-0 z-20 min-h-10 persplayrmaxheightsm sm:max-h-persplayrmaxheight md:max-h-persplayrmaxheight lg:max-h-persplayrmaxheight lg:max-h-persplayrmaxheight min-h-persplayrminheight py-0 px-0 mt-0 mr-0 mb-0 ml-0 bg-no-repeat bg-center bg-cover hidden pp' : 'flex flex-row flex-wrap md:flex-no-wrap lg:flex-no-wrap xl:flex-no-wrap fixed bottom-0 left-0 right-0 z-20 min-h-10 persplayrmaxheightsm sm:max-h-persplayrmaxheight md:max-h-persplayrmaxheight lg:max-h-persplayrmaxheight lg:max-h-persplayrmaxheight min-h-persplayrminheight py-0 px-0 mt-0 mr-0 mb-0 ml-0 bg-no-repeat bg-center bg-cover pp'" :style="'background-image:url('+Songs[presentSongId].cover+'); background-repeat: no-repeat; background-position: center; background-size: cover'">
			<span v-if="!hidePlayer" @click="hidePlayer = true" class="player-hide-button absolute cursor-pointer right-0 top-0 h-10 w-10 z-30"><CloseIcon w="30" h="30" /></span>
			<div class="flex-grow-0 p-2 m-0 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 pp-controls">
				<div class="inline-flex flex-col items-center w-full">
					<div class="inline-flex flex-row w-full items-center align-middle justify-around px-4 py-1">
						<div class="flex-1 m-1 justify-center align-middle" @click="prevSong()">
							<SkipBackwardIcon class="cursor-pointer text-white" w="30" h="30" />
						</div>
						<div class="flex-1 m-1 justify-center align-middle" @click="play()">
							<PlayIcon class="cursor-pointer text-white" v-show="!isPlaying && !playerIsBuffering" w="30" h="30"/>
							<PauseIcon class="cursor-pointer text-white" v-show="isPlaying && !playerIsBuffering" w="30" h="30" />
							<BufferingIcon class="text-white cursor-pointer" animate="rotate" v-show="playerIsBuffering" w="30" h="30" />
						</div>
						<div class="flex-1 m-1 justify-center align-middle" @click="stop()">
							<SquareIcon class="cursor-pointer text-white" w="30" h="30" />
						</div>
						<div class="flex-1 m-1 justify-center align-middle" @click="nextSong()">
							<SkipForwardIcon class="cursor-pointer text-white" w="30" h="30"/>
						</div>
		          	</div>
		          	<div class="inline-flex flex-row w-full items-center justify-between px-4 py-1">
						<div class="flex-1 w-3/4">
							<vue-slider :width="150" :duration="0.1" :min="0" :max="1" v-model="playerVolume" :process="true" :interval="0.01"></vue-slider>
						</div>
						<div class="flex-1 w-1/4">
							<span v-tooltip.top-center="continuousPlay ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay()" :class="continuousPlay ? 'bg-transparent float-right text-white text-primary-green' : 'bg-transparent float-right text-white text-white'"><RefreshIcon w="30" h="30"/></span>
						</div>
		            </div>
				</div>
			</div>
			<div class="flex-grow w-full md:w-2/3 lg:w-3/4 xl:w-4/5 playing-progress m-0 px-3 sm:p-12 h-16 sm:h-auto md:h-full lg:h-full xl:h-full">
				<vue-slider @change="scrubChange()" v-model="playerProgressPercent" :process="true" :interval="0.01"></vue-slider>
				<div class="float-right text-2xl text-sm sm:text-lg font-bold text-white"> {{timeBufferMins}} : {{timeBufferSecs | doubleDigits}} - {{currentTrackDuration}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import {mapState, mapGetters } from 'vuex'
import VueSlider from 'vue-slider-component'
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
export default {
  	name: 'PersistentPlayer',
	components: {
	    RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, VueSlider, CloseIcon, RevealIcon, VTooltip, BufferingIcon
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
