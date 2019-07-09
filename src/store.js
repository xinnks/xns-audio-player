import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* eslint-disable */

export default new Vuex.Store({
  state: {
	Songs: [
        { audio: 'http://127.0.0.1:8000/storage/audio/77V_11YC8R147T45X1Z5X84PNMAC6Z.mp3', artist: 'Sia', tittle: 'Lullaby', album: '', cover: 'http://127.0.0.1:8000/storage/photos/default.jpg' },
        { audio: 'http://127.0.0.1:8000/storage/audio/CCP84EMP61920RGI76Y5TXJKSXT04F.mp3', artist: 'T.I', tittle: 'That\'s All She Wrote (ft. Eminem)', album: '', cover: 'http://127.0.0.1:8000/storage/photos/default.jpg' },
        { audio: 'http://127.0.0.1:8000/storage/audio/14AIFFI1PA_6EJ-FLT89JY00T9V89_.mp3', artist: 'LP', tittle: 'Muddy Waters [Live Session]', album: '', cover: 'http://127.0.0.1:8000/storage/photos/SDBPOQCA67XGHGGFMD58.jpg' },
        { audio: 'http://127.0.0.1:8000/storage/audio/LS54Q088NZT5AW14W20CE751262H2F.mp3', artist: 'Kai Honasan', tittle: 'Ngayong Gabi', album: 'In Your Face And Songs About Other Faces', cover: 'http://127.0.0.1:8000/storage/photos/Y584C_68A030RW5_TBZ5.jpg' }
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
  },
  getters: {
  	getSongs: (state) => state.Songs,
  	getVolume: (state) => state.volume,
  	getProgresssPercent: (state) => state.progressPercent,
  	getTimeLapse: (state) => state.timeLapse
  },
  mutations: {
  	updateLastSongId(state, payload){
  		state.lastSongId = payload.lastSongId
  	},
  	changeVolume(state, payload){
  		state.volume = payload.volume
  		state.audio.volume = state.volume
  	},
  	updateTimeLapse(state, payload){
  		state.timeLapse = payload.timeLapse
  	},
  	updateCountCheck(state, payload){
  		state.countCheck = payload.countCheck
  	},
  	updateAudioCurrentTime(state, payload){
  		state.audio.currentTime = payload.currentTime
  	},
  	updateProgressPercent(state, payload){
  		state.audio.currentTime = payload.percent
  	},
  	updateContinuousPlay(state, payload){
  		state.continuousPlay = payload.status
  	},
    play (state,payload/*songId = this.presentSongId, type = ''*/) {
        if (state.isPlaying && !state.isPaused) {
            if (payload.type !== '') { // next/previous
                state.audio.src = state.Songs[payload.songId].audio;
                state.audio.play();
                state.isPlaying = true;
                state.isPaused = false
            } else { // pause
                state.audio.pause();
                state.isPlaying = false;
                state.isPaused = true
            }
        } else if (!state.isPlaying && state.isPaused) {
            if (payload.type !== '') { // next/previous
                state.audio.src = state.Songs[payload.songId].audio;
                state.audio.play();
                state.isPlaying = true;
                state.isPaused = false
            } else { // resume playing
                state.audio.play();
                state.isPlaying = true;
                state.isPaused = false
            }
        } else if (!state.isPlaying && !state.isPaused) {
            state.audio.src = state.Songs[payload.songId].audio;
            state.audio.play();
            state.isPlaying = true;
            state.isPaused = false
        }
        //
        state.countCheck = 0;
        state.lastRecordedTrackTime = -1;
        state.timeBufferMins = 0;
    },
    prevSong () {
        if ((this.presentSongId - 1) >= 0) {
            this.presentSongId -= 1;
            this.play(this.presentSongId, 'prev')
        } else {
            // We\'ve arrived at the start of the playlist!
        }
        this.countCheck = 0;
        this.lastRecordedTrackTime = -1;
        this.timeBufferMins = 0;
    },
    stop (state, payload) {
        if (state.audio) {
            state.audio.load();
            state.isPlaying = false;
            state.isPaused = false;
            state.continuousPlay = false // halt continuous play
        } else {
            // Nothing Playing!
        }
        state.countCheck = 1;
        state.lastRecordedTrackTime = -1;
        state.timeBufferMins = 0
    },
    scrubToTime(state, payload){
        state.audio.currentTime = (payload.percent * state.audio.duration) / 100;
    }
  },
  actions: {
    viewShit({ dispatch, commit, state }){
    	setTimeout(() => {
            state.currentTrackTime = parseInt(state.audio.currentTime);
            state.progressPercent = (state.currentTrackTime / state.audio.duration) * 100;
            if (state.countCheck === 0) { // initializer start check
                let ctdSecs = (parseInt(state.audio.duration) % 60) < 10 ? '0' + parseInt(state.audio.duration) % 60 : (parseInt(state.audio.duration) % 60);
                state.currentTrackDuration = parseInt(parseInt(state.audio.duration) / 60) + ' : ' + ctdSecs
            }
            if (state.currentTrackTime !== state.lastRecordedTrackTime) {
                if (parseInt(state.audio.currentTime) >= 60) {
                    state.timeBufferMins = Math.floor(state.audio.currentTime / 60);
                    state.timeBufferSecs = parseInt(Math.floor(state.audio.currentTime)) % 60
                } else {
                    state.timeBufferSecs = parseInt(Math.floor(state.audio.currentTime))
                }
                state.duration -= 1;
                // state.timeLapse = !state.timeLapse;
                commit('updateTimeLapse',{timeLapse: true}); // continue time lapse
                state.countCheck += 1;
                //
                state.lastRecordedTrackTime = parseInt(Math.floor(state.audio.currentTime))
            } else {
                if (!state.audio.paused) {
                    state.isPlaying = true;
                    state.isPaused = false
                } else {
                    state.timeBufferMins = 0;
                    state.timeBufferSecs = 0;
                    state.timeLapse = false; // stop time lapse
                    state.countCheck = 0; // initializer end
                    state.isPlaying = false;
                    state.isPaused = false;
                    if (state.continuousPlay) { // if continuous play === true
                        dispatch('nextSong')
                    }
                }
            }
        }, 1000)
    },
	playSong({ dispatch, commit, state }, songId){
        state.presentSongId = songId;
        state.audio.src = state.Songs[songId].audio;
        state.audio.play();
        state.isPlaying = true;
        state.isPaused = false;
        //
        state.countCheck = 0;
        state.lastRecordedTrackTime = -1;
        state.timeBufferMins = 0;
        dispatch('viewShit')
	},
	play({ dispatch, commit, state }, type = ''){
		commit('play',{songId: state.presentSongId, type: type})
		dispatch('viewShit')
	},
	igniteNextSong({ dispatch, commit, state }){
		return new Promise((resolve, reject) => {
	      setTimeout(() => {
	      	if ((state.presentSongId + 1) <= state.lastSongId) {
	            state.presentSongId += 1;
				dispatch('play', 'next')
	        } else {
	            if (state.continuousPlay) { // if continuous play === true
	            state.presentSongId = 0;
					dispatch('play') // restart the playlist
	            }
	            // We\'ve arrived at the end of the playlist!
	        }
	        state.countCheck = 0;
	        state.lastRecordedTrackTime = -1;
	        state.timeBufferMins = 0;
	        resolve()
	      }, 10)
	    })
	},
	nextSong({ dispatch, commit, state }){
		return dispatch('igniteNextSong').then(()=>{
			dispatch('viewShit')
		})
	},
	ignitePrevSong({ dispatch, commit, state }){
		return new Promise((resolve, reject) => {
	      setTimeout(() => {
	      	if ((state.presentSongId - 1) >= 0) {
	            state.presentSongId -= 1;
	            dispatch('play','prev')
	        } else {
	            // We\'ve arrived at the start of the playlist!
	        }
	        state.countCheck = 0;
	        state.lastRecordedTrackTime = -1;
	        state.timeBufferMins = 0;
	        resolve()
	      }, 10)
	    })
	},
	prevSong({ dispatch, commit }){
		return dispatch('ignitePrevSong').then(()=>{
			dispatch('viewShit')
		})
	},
	igniteScrubToTime({ commit }, percent = 0){
		return new Promise((resolve, reject) => {
	      setTimeout(() => {
	        commit('scrubToTime',{percent: percent})
	        resolve()
	      }, 10)
	    })
	},
	scrubToTime({ dispatch, commit }, percent = 0){
		return dispatch('igniteScrubToTime', percent).then(()=>{
			dispatch('viewShit')
		})
	},
	updateTimeLapse({ dispatch, commit }, timeLapse){
		if(!timeLapse){
			commit('updateTimeLapse',{timeLapse: timeLapse})
			dispatch('viewShit')
		}
	},
	stop({ commit }){
		commit('stop')
	}
  }
})
