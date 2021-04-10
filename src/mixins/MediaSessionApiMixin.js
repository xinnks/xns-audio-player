const MediaSessionApiMixin = {
  watch: {
    volume(){ this.changeVolume(this.volume) }
  },
  mounted(){
    this.checkMediaSessionSupport()
  },
  methods: {
    checkMediaSessionSupport(){
      if('mediaSession' in navigator){
        this.UpdateMediaSessionAPI({support: true})
      } else {
        this.UpdateMediaSessionAPI({support: false})
      }
    },
    // mediaSessionAPI Controller
    mediaSessionController(data){
      this.UpdateMediaSessionAPI({data: data})
    },
  }
};

export default MediaSessionApiMixin
