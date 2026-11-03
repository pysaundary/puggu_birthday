/* ==========================================
   PUGGU POO - MAGICAL BIRTHDAY EXPERIENCE
========================================== */

/* ==========================================
   1. CONFIGURATION
========================================== */

// Add more photos here whenever required.
const photos = ["assets/photos/photo1.png", "assets/photos/photo2.png","assets/photos/photo3.png", "assets/photos/photo4.png", "assets/photos/photo5.png", "assets/photos/photo6.png", "assets/photos/photo7.png", "assets/photos/photo8.png", "assets/photos/photo9.png", "assets/photos/photo10.png", "assets/photos/photo11.png", "assets/photos/photo12.png", "assets/photos/photo13.png", "assets/photos/photo14.jpeg"
];

// Add your AI-generated songs here.
// title can be changed to actual song names.
const songs = [
  {
    title: "song 1",
    file: "assets/music/song1.mp3",
  },
  {
    title: "song 2",
    file: "assets/music/song2.mp3",
  },
  {
    title: "song 3",
    file: "assets/music/song3.mp3",
  },
  {
    title: "song 4",
    file: "assets/music/song4.mp3",
  },
  {
    title: "song 5",
    file: "assets/music/song5.mp3",
  },
  {
    title: "song 6",
    file: "assets/music/song6.mp3",
  },
  {
    title: "song 7",
    file: "assets/music/song7.mp3",
  },
];

const SLIDE_INTERVAL = 1000;

/* ==========================================
   2. SLIDESHOW
========================================== */

const mainImage = document.getElementById("mainImage");
const leftImage = document.getElementById("leftImage");
const rightImage = document.getElementById("rightImage");

const slideDots = document.getElementById("slideDots");
const photoCounter = document.getElementById("photoCounter");

let currentSlide = 0;
let slideTimer = null;

function imageAt(index) {
  return photos[(index + photos.length) % photos.length];
}

function renderSlideshow() {
  if (!photos.length) return;

  const previous = imageAt(currentSlide - 1);
  const current = imageAt(currentSlide);
  const next = imageAt(currentSlide + 1);

  // Fade main image during transition.
  mainImage.style.opacity = "0.25";

  setTimeout(() => {
    mainImage.src = current;
    leftImage.src = previous;
    rightImage.src = next;

    mainImage.onload = () => {
    mainImage.style.opacity = "1";
};

mainImage.onerror = () => {
    mainImage.style.opacity = "1";
};
  }, 180);

  // Photo counter
  photoCounter.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

  // Dots
  slideDots.innerHTML = "";

  photos.forEach((photo, index) => {
    const dot = document.createElement("button");

    dot.className = "dot" + (index === currentSlide ? " active" : "");

    dot.setAttribute("aria-label", `Go to photo ${index + 1}`);

    dot.addEventListener("click", () => {
      goToSlide(index);
    });

    slideDots.appendChild(dot);
  });
}

function goToSlide(index) {
  if (!photos.length) return;

  currentSlide = (index + photos.length) % photos.length;

  renderSlideshow();
  resetSlideTimer();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function previousSlide() {
  goToSlide(currentSlide - 1);
}

function resetSlideTimer() {
  clearInterval(slideTimer);

  if (photos.length > 1) {
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }
}

document.getElementById("nextBtn").addEventListener("click", nextSlide);

document.getElementById("prevBtn").addEventListener("click", previousSlide);

// Initial slideshow
renderSlideshow();
resetSlideTimer();

/* ==========================================
   3. MOBILE SWIPE SUPPORT
========================================== */

const gallery = document.getElementById("galleryWindow");

let touchStartX = 0;
let touchStartY = 0;

gallery.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  },
  { passive: true },
);

gallery.addEventListener(
  "touchend",
  (event) => {
    const diffX = event.changedTouches[0].screenX - touchStartX;
    const diffY = event.changedTouches[0].screenY - touchStartY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }
  },
  { passive: true },
);

/* ==========================================
   4. MUSIC PLAYER
========================================== */

const audio = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const musicPrev = document.getElementById("musicPrev");
const musicNext = document.getElementById("musicNext");

const trackTitle = document.getElementById("trackTitle");
const progressBar = document.getElementById("progressBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const playlist = document.getElementById("playlist");
const playingIndicator = document.getElementById("playingIndicator");

const volumeBar = document.getElementById("volumeBar");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

let currentSong = 0;
let isShuffle = false;
let isRepeat = false;

audio.volume = 0.8;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

// Load selected song
function loadSong(index, autoplay = false) {
  if (!songs.length) return;

  currentSong = (index + songs.length) % songs.length;

  const song = songs[currentSong];

  audio.src = song.file;

  trackTitle.textContent = song.title;

  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  renderPlaylist();

  if (autoplay) {
    playSong();
  } else {
    updatePlayerState();
  }
}

// Play
async function playSong() {
  if (!audio.src && songs.length) {
    loadSong(currentSong);
  }

  try {
    await audio.play();
    updatePlayerState();
  } catch (error) {
    console.log("Music playback needs user interaction.", error);
    updatePlayerState();
  }
}

// Pause
function pauseSong() {
  audio.pause();
  updatePlayerState();
}

// Play / Pause button
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Update player UI
function updatePlayerState() {
  const playing = !audio.paused;

  playBtn.textContent = playing ? "Ⅱ" : "▶";

  playingIndicator.classList.toggle("playing", playing);
}

// Previous song
function previousSong() {
  if (isShuffle && songs.length > 1) {
    let next;

    do {
      next = Math.floor(Math.random() * songs.length);
    } while (next === currentSong);

    loadSong(next, true);
  } else {
    loadSong(currentSong - 1, true);
  }
}

// Next song
function nextSong() {
  if (isShuffle && songs.length > 1) {
    let next;

    do {
      next = Math.floor(Math.random() * songs.length);
    } while (next === currentSong);

    loadSong(next, true);
  } else {
    loadSong(currentSong + 1, true);
  }
}

musicPrev.addEventListener("click", previousSong);
musicNext.addEventListener("click", nextSong);

// Automatically play next song
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else if (isShuffle || currentSong < songs.length - 1) {
    nextSong();
  } else {
    loadSong(0, false);
  }
});

// Playlist UI
function renderPlaylist() {
  playlist.innerHTML = "";

  document.getElementById("songCount").textContent =
    `${String(songs.length).padStart(2, "0")} SONGS`;

  songs.forEach((song, index) => {
    const item = document.createElement("div");

    item.className = "song-item" + (index === currentSong ? " active" : "");

    const number = document.createElement("span");
    number.className = "song-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const name = document.createElement("span");
    name.className = "song-name";
    name.textContent = song.title;

    const status = document.createElement("span");
    status.className = "song-status";
    status.textContent = index === currentSong && !audio.paused ? "♫" : "♪";

    item.append(number, name, status);

    item.addEventListener("click", () => {
      loadSong(index, true);
    });

    playlist.appendChild(item);
  });
}

// Progress bar
audio.addEventListener("timeupdate", () => {
  if (!audio.duration || !Number.isFinite(audio.duration)) return;

  const percentage = (audio.currentTime / audio.duration) * 100;

  progressBar.value = percentage;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// Volume
volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value);
});

// Shuffle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;

  shuffleBtn.classList.toggle("active", isShuffle);
});

// Repeat current song
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;

  repeatBtn.classList.toggle("active", isRepeat);
});

// Player state updates
audio.addEventListener("play", updatePlayerState);
audio.addEventListener("pause", updatePlayerState);

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("error", () => {
  trackTitle.textContent = "Unable to load song";
  updatePlayerState();
});

// Initial playlist
renderPlaylist();

loadSong(0);

// Attempt autoplay.
// Browsers may block audible autoplay until the visitor interacts.
playSong();

/* ==========================================
   5. FIREWORKS & RANDOM STARS
========================================== */

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];
let stars = [];

let lastFrame = 0;
const FRAME_INTERVAL = 1000 / 30;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Stars
  stars = [];

  const starCount = Math.min(100, Math.floor((width * height) / 10000));

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.003,
    });
  }
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

// Create fireworks
function createFirework(x, y) {
  const colors = ["#ffd783", "#ff91c8", "#bd9aff", "#ffffff", "#ffb66d"];

  const color = colors[Math.floor(Math.random() * colors.length)];

  const count = 45 + Math.floor(Math.random() * 35);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;

    const speed = Math.random() * 3.8 + 0.7;

    particles.push({
      x,
      y,

      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,

      life: 1,
      decay: Math.random() * 0.012 + 0.007,

      color,
      radius: Math.random() * 2 + 0.5,
    });
  }
}

// Stars animation
function drawStars() {
  stars.forEach((star) => {
    star.alpha += star.speed;

    if (star.alpha >= 1 || star.alpha <= 0.1) {
      star.speed *= -1;
    }

    ctx.beginPath();

    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(255, 235, 195, ${star.alpha})`;

    ctx.fill();
  });
}

// Fireworks animation
function drawFireworks() {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.985;
    particle.vy *= 0.985;

    particle.vy += 0.025;

    particle.life -= particle.decay;

    ctx.globalAlpha = Math.max(0, particle.life);

    ctx.beginPath();

    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

    ctx.fillStyle = particle.color;

    ctx.fill();
  });

  ctx.globalAlpha = 1;

  particles = particles.filter((p) => p.life > 0);
}

// Main animation loop
function animateSky(timestamp = 0) {
  requestAnimationFrame(animateSky);

  if (timestamp - lastFrame < FRAME_INTERVAL) return;

  lastFrame = timestamp;

  ctx.clearRect(0, 0, width, height);

  drawStars();
  drawFireworks();
}

// Random fireworks
function scheduleFirework() {
  const x = width * (0.12 + Math.random() * 0.76);
  const y = height * (0.08 + Math.random() * 0.42);

  createFirework(x, y);

  const nextTime = 1800 + Math.random() * 2200;

  setTimeout(scheduleFirework, nextTime);
}

// Start background
animateSky();
scheduleFirework();

/* ==========================================
   6. INITIALIZATION
========================================== */

console.log("❤️ Puggu Poo Birthday Experience Ready!");
