export const sounds = {
    hitSound: new Audio("./sound/hitBall2.mp3"),
    hitObstacleSound: new Audio("./sound/ball.wav"),
    hitLavaSound: new Audio("./sound/lava.mp3"),
    loseLife: new Audio("./sound/loseLife.mp3"),
    countdownTimer: new Audio("./sound/countdownTimer.mp3"),
    nextLevel: new Audio("./sound/nextLevelSound.mp3"),
    lastFail: new Audio("./sound/lastFail2.mp3"),
};

const playSound = (sound, volume) => {
    sound.currentTime = 0.0;
    sound.volume = volume;
    sound.play();
};

const throttle = (func, ms) => {
    let isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
};

const throttledPlaySound = throttle((sound, volume) => playSound(sound, volume), 200);

export const playHitObstacleSound = (strength) => {
    const startVolume = 0.05;
    const volume = Math.min(1, startVolume * strength);
    throttledPlaySound(sounds.hitObstacleSound, volume);
};

export const playHitSound = (strength) => {
    const startVolume = 0.1;
    const volume = Math.min(1, startVolume * strength);
    throttledPlaySound(sounds.hitSound, volume);
};

export const playLoseLifeSound = () => {
    throttledPlaySound(sounds.loseLife, 1);
};

export const playCountdownTimerSound = () => {
    throttledPlaySound(sounds.countdownTimer, 0.8);
};

export const playNextLevelSound = () => {
    throttledPlaySound(sounds.nextLevel, 0.6);
};

export const playLavaSound = () => {
    throttledPlaySound(sounds.hitLavaSound, 0.2);
};

export const playLastFailSound = () => {
    throttledPlaySound(sounds.lastFail, 1);
};

export const stopAllSounds = () => {
    Object.values(sounds).forEach((sound) => {
        sound.pause();
        sound.currentTime = 0.0;
    });
};

export const stopAllHitSounds = () => {
    Object.entries(sounds).forEach(([key, sound]) => {
        if (key.includes("hit")) {
            sound.pause();
            sound.currentTime = 0.0;
        }
    });
};
