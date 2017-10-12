class Sequencer {
  constructor() {
    // this.monoSynth = new Tone.Mono(11, Tone.DuoSynth).toMaster();
    // this.monoSynth = new Tone.MonoSynth(11, Tone.DuoSynth);
    // this.metalSynth = new Tone.MetalSynth(11, Tone.DuoSynth);
    this.synth = new Tone.PolySynth(11, Tone.DuoSynth).toMaster();
    Tone.Master.mute = true;
  }

  start() {
    Tone.Transport.start();
  }

  stop() {
    Tone.Transport.stop();
  }

  listen() {
  }
}

module.exports = Sequencer;
