class AudioPlayer {
    constructor(audioPath) {
        this.audio = new Audio(audioPath);
        this.audioPath = audioPath;
    }

    play() {
        this.audio.addEventListener('canplaythrough', (event) => {
            this.audio.play();
        });
    }

    stop() {
        this.audio.pause();
    }

    setAudioPath(newAudioPath) {
        this.audioPath = newAudioPath;
        this.audio.src = newAudioPath;
    }

    getAudioPath() {
        return this.audioPath;
    }
}
