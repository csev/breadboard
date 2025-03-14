// Export sound-related functionality
const sound = {
  mute: false
};

sound.playSound = function (s) {
  console.log(s)
  if (!!window.Audio && !sound.mute) {
      s.play();
  }
}

export default sound;
