<template>
	<div>
		<span v-if="hidePlayer" @click="hidePlayer = false" class="player-reveal-button"><RevealIcon w="40" h="40" /></span>
		<div :class="hidePlayer ? 'columns pp hide' : 'columns pp'" :style="'background-image:url('+Songs[presentSongId].cover+')'">
			<span v-if="!hidePlayer" @click="hidePlayer = true" class="player-hide-button"><CloseIcon w="30" h="30" /></span>
			<div class="column is-3 pp-controls">
				<div class="columns is-multiline">
					<div class="column is-12 controls-window">
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
		                      <span @click="nextSong()"><SkipForwardIcon class="play-control-item" w="30" h="30"/></span>
		                    </div>
	                  	</div>
		          	</div>
		          	<div class="column is-12 pp-volume-repeat">
		          		<div class="columns is-mobile">
		          			<div class="column is-8 volume">
				              	<vue-slider :width="150" :duration="0.1" :min="0" :max="1" v-model="playerVolume" :process="true" :interval="0.01"></vue-slider>
			                </div>
			          		<div class="column is-3">
				              	<span v-tooltip.top-center="continuousPlay ? 'Repeat: ALL' : 'Repeat: OFF'" @click="changeContinuousPlay()" :class="continuousPlay ? 'is-small is-transparent continuous-play-on is-pulled-right' : 'is-small is-transparent continuous-play-off is-pulled-right'"><RefreshIcon w="30" h="30"/></span>
			                </div>
		          		</div>
		            </div>
				</div>
			</div>
			<div class="column is-9 playing-progress">
				<vue-slider @change="scrubChange()" v-model="playerProgressPercent" :process="true" :interval="0.01"></vue-slider>
				<div class="timer"> {{timeBufferMins}} : {{timeBufferSecs | doubleDigits}} - {{currentTrackDuration}}</div>
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
import PlayerMixin from './../mixins/PlayerMixin'
Vue.use(VTooltip);
export default {
  	name: 'PersistentPlayer',
	components: {
	    RefreshIcon,SkipBackwardIcon, PlayIcon, PauseIcon, SquareIcon, SkipForwardIcon, VueSlider, CloseIcon, RevealIcon, VTooltip
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

<style scoped>
	.pp{
		display: block;
		position: fixed;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    z-index: 9999;
	    min-height: 50px;
	    max-height: 120px;
	    padding: 0 3;
	    margin:  0 5px 5px 0px;
	    background-repeat: no-repeat !important;
	    background-position: center !important;
	    background-size: cover !important;
	    background: #485563;
		background: -webkit-linear-gradient(to right, rgba(72, 85, 99, .8), rgba(41, 50, 60, .8));
		background: linear-gradient(to right, rgba(72, 85, 99, .8), rgba(41, 50, 60, .8));
	}
	.pp.hide{
		display: none;
	}
	.pp-controls{
		cursor: pointer;
		margin: 0;
		padding: 10px 30px 5px 30px;
		background: #232526;
		background: -webkit-linear-gradient(to right, rgba(35, 37, 38, .9), rgba(65, 67, 69, .9));
		background: linear-gradient(to right, rgba(35, 37, 38, .9), rgba(65, 67, 69, .9));
	}
	.playing-progress{
		cursor: pointer;
		margin: 0;
		padding: 40px 40px;
		background: #000000;
		background: -webkit-linear-gradient(to right, rgba(0,0,0,.6), rgba(67,67,67,.6));
		background: linear-gradient(to right, rgba(0,0,0,.6), rgba(67,67,67,.6));
	}
	.volume{
		padding-top: 23px;
	}
	.pp-volume-repeat{
		padding-top: 5px;
	}
	.player-hide-button{
		cursor: pointer;
		position: absolute;
		right: 0;
		top: 0;
		height: 40px;
		width: 40px;
		z-index: 999999;
	}
	.player-reveal-button{
		cursor: pointer;
		position: fixed;
		right: 20px;
		bottom: 0;
		height: 40px;
		width: 40px;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
		background: #36d1dc;
		background: -webkit-linear-gradient(to right, #c9d6ff, #e2e2e2);
		background: linear-gradient(to right, #c9d6ff, #e2e2e2);
	}
</style>
