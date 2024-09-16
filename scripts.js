var v = document.getElementById("src");
var v2 = document.getElementById("tgt");

// Variable to prevent infinite loop events
let isSyncing = false;

// Sync Play/Pause both videos
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

// Function to sync time between videos using requestAnimationFrame
function syncTimeWithAnimation() {
  if (!isSyncing && !v.paused && !v2.paused) {
    isSyncing = true;
    // Sync currentTime and playbackRate
    if (v.currentTime !== v2.currentTime) {
      v2.currentTime = v.currentTime;
    }
    isSyncing = false;
    // Continue syncing
    requestAnimationFrame(syncTimeWithAnimation);
  }
}

// Function to start syncing using requestAnimationFrame
function startSyncing() {
  requestAnimationFrame(syncTimeWithAnimation);
}

// Event listeners for syncing on play/pause
v.addEventListener('play', () => {
  syncPlayPause();
  startSyncing();
});
v.addEventListener('pause', syncPlayPause);
v2.addEventListener('play', startSyncing);
v2.addEventListener('pause', syncPlayPause);

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
