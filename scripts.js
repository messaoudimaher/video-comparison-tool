var v = document.getElementById("src");
var v2 = document.getElementById("tgt");

// Variable to prevent infinite loop events
let isSyncing = false;

// Throttle function to limit the rate at which a function is executed
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Play/Pause both videos in sync
function syncPlayPause() {
  if (!isSyncing) {
    isSyncing = true;
    if (v.paused && v2.paused) {
      v.play();
      v2.play();
    } else {
      v.pause();
      v2.pause();
    }
    isSyncing = false;
  }
}

// Sync the currentTime and playbackRate of both videos
function syncTime(source, target) {
  if (!isSyncing) {
    isSyncing = true;
    target.currentTime = source.currentTime;
    target.playbackRate = source.playbackRate;

    if (source.paused && !target.paused) {
      target.pause();
    } else if (!source.paused && target.paused) {
      target.play();
    }
    isSyncing = false;
  }
}

// Event listeners to handle syncing on play, pause, and time updates
v.addEventListener("play", syncPlayPause);
v.addEventListener("pause", syncPlayPause);
v2.addEventListener("play", syncPlayPause);
v2.addEventListener("pause", syncPlayPause);

// Throttle time synchronization to reduce lag
v.addEventListener("timeupdate", throttle(() => syncTime(v, v2), 200));
v2.addEventListener("timeupdate", throttle(() => syncTime(v2, v), 200));

// Sync seeking actions (jumping to another time in the video)
v.addEventListener("seeking", () => syncTime(v, v2));
v2.addEventListener("seeking", () => syncTime(v2, v));

// Function to play or pause both videos
function video_click() {
  syncPlayPause();
}

// Function to load video from file input and ensure it's paused on load
function loadVideo(event, videoId) {
  var video = document.getElementById(videoId);
  var file = event.target.files[0];

  if (file) {
    var fileURL = URL.createObjectURL(file);
    video.src = fileURL;
    video.load();

    video.onloadedmetadata = function () {
      document.getElementById("video-compare-container").style.width = video.videoWidth + "px";
      document.getElementById("video-compare-container").style.height = video.videoHeight + "px";
      // Ensure videos are paused on load
      v.pause();
      v2.pause();
    };
  }
}

// Volume Control for both videos
function setVolume(volume) {
  v.volume = volume;
  v2.volume = volume;
}

// Speed Control for both videos
function updateSpeed(speed) {
  v.playbackRate = speed;
  v2.playbackRate = speed;
  document.getElementById("speed-value").textContent = speed + "x";
}

// Dark/Light Mode Toggle
function toggleMode() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
}

// Progress Bars for Both Videos
v.addEventListener("timeupdate", function () {
  let progressSrc = document.getElementById("progress-src");
  progressSrc.value = (v.currentTime / v.duration) * 100;
});

v2.addEventListener("timeupdate", function () {
  let progressTgt = document.getElementById("progress-tgt");
  progressTgt.value = (v2.currentTime / v2.duration) * 100;
});
