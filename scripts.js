var v = document.getElementById("src");
var v2 = document.getElementById("tgt");
var speedDisplay = document.getElementById("speed-value");
var separatorLine = document.getElementById("separator-line");

// Flag to prevent looping events
let isSyncing = false;

// Play/Pause both videos in sync
function syncPlayPause() {
  if (!isSyncing) {
    isSyncing = true;
    if (v.paused || v2.paused) {
      v.play();
      v2.play();
    } else {
      v.pause();
      v2.pause();
    }
    isSyncing = false;
  }
}

// Sync video seeking and playback rate
function syncVideos(source, target) {
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

// Event listeners to synchronize the videos
v.addEventListener('play', () => syncPlayPause());
v.addEventListener('pause', () => syncPlayPause());
v2.addEventListener('play', () => syncPlayPause());
v2.addEventListener('pause', () => syncPlayPause());

v.addEventListener('timeupdate', () => syncVideos(v, v2));
v2.addEventListener('timeupdate', () => syncVideos(v2, v));

v.addEventListener('seeking', () => syncVideos(v, v2));
v2.addEventListener('seeking', () => syncVideos(v2, v));

// Function to play or pause both videos
function video_click() {
  syncPlayPause();
}

// Function to track the position of the mouse and adjust the clipper and separator line
var videoContainer = document.getElementById("video-compare-container"),
    videoClipper = document.getElementById("video-clipper"),
    clippedVideo = videoClipper.getElementsByTagName("video")[0];

function trackLocation(e) {
  var rect = videoContainer.getBoundingClientRect(),
      position = ((e.pageX - rect.left) / videoContainer.offsetWidth) * 100;
  if (position <= 100) {
    videoClipper.style.width = position + "%";  // Adjust the width of the clipper
    clippedVideo.style.left = -50 + (position / 2) + "%";  // Adjust the position of the second video
  }
}

videoContainer.addEventListener("mousemove", trackLocation, false);
videoContainer.addEventListener("touchstart", trackLocation, false);
videoContainer.addEventListener("touchmove", trackLocation, false);

// Function to load video from file input and maintain its size
function loadVideo(event, videoId) {
  var video = document.getElementById(videoId);
  var file = event.target.files[0];

  if (file) {
    var fileURL = URL.createObjectURL(file);
    video.src = fileURL;
    video.load();

    video.onloadedmetadata = function () {
      videoContainer.style.width = video.videoWidth + 'px';
      videoContainer.style.height = video.videoHeight + 'px';
      video.play();
    };
  }
}

// Dark/Light Mode Toggle
function toggleMode() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
}

// Custom Play/Pause Control
function controlVideo(action) {
  syncPlayPause();
}

// Volume Control
function setVolume(volume) {
  v.volume = volume;
  v2.volume = volume;
}

// Speed Control
function updateSpeed(speed) {
  v.playbackRate = speed;
  v2.playbackRate = speed;
  document.getElementById("speed-value").textContent = speed + "x";
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

});

v2.addEventListener("timeupdate", function() {
  let progressTgt = document.getElementById("progress-tgt");
  progressTgt.value = (v2.currentTime / v2.duration) * 100;
});
