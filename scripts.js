var v = document.getElementById("src");
var v2 = document.getElementById("tgt");

// Variable to prevent infinite loop events
let isSyncing = false;

// Sync Play and Pause between both videos
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

    // Sync play/pause status
    if (source.paused && !target.paused) {
      target.pause();
    } else if (!source.paused && target.paused) {
      target.play();
    }
    isSyncing = false;
  }
}

// Event listeners to handle syncing on play, pause, and time updates
v.addEventListener('play', syncPlayPause);
v.addEventListener('pause', syncPlayPause);
v2.addEventListener('play', syncPlayPause);
v2.addEventListener('pause', syncPlayPause);

// Sync the current time and speed of both videos during playback
v.addEventListener('timeupdate', () => syncTime(v, v2));
v2.addEventListener('timeupdate', () => syncTime(v2, v));

// Sync seeking actions (jumping to another time in the video)
v.addEventListener('seeking', () => syncTime(v, v2));
v2.addEventListener('seeking', () => syncTime(v2, v));

// Function to handle play/pause by clicking on the video
function video_click() {
  syncPlayPause();
}

// Volume control for both videos
function setVolume(volume) {
  v.volume = volume;
  v2.volume = volume;
}

// Speed control for both videos
function updateSpeed(speed) {
  v.playbackRate = speed;
  v2.playbackRate = speed;
  document.getElementById("speed-value").textContent = speed + "x";
}

// Load the video and ensure proper size for both
function loadVideo(event, videoId) {
  var video = document.getElementById(videoId);
  var file = event.target.files[0];

  if (file) {
    var fileURL = URL.createObjectURL(file);
    video.src = fileURL;
    video.load();

    video.onloadedmetadata = function () {
      document.getElementById("video-compare-container").style.width = video.videoWidth + 'px';
      document.getElementById("video-compare-container").style.height = video.videoHeight + 'px';
      video.play();
    };
  }
}

// Dark/Light Mode Toggle
function toggleMode() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
}

// Progress Bars for Both Videos
v.addEventListener("timeupdate", function() {
  let progressSrc = document.getElementById("progress-src");
  progressSrc.value = (v.currentTime / v.duration) * 100;
});

v2.addEventListener("timeupdate", function() {
  let progressTgt = document.getElementById("progress-tgt");
  progressTgt.value = (v2.currentTime / v2.duration) * 100;
});
