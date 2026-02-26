// ── State ──
let intervalId  = null;   // holds the setInterval reference
let elapsedMs   = 0;      // total elapsed milliseconds
let startTime   = 0;      // timestamp when timer last started
let running     = false;
let lapCount    = 0;

// ── DOM Elements ──
const minutesEl      = document.getElementById('minutes');
const secondsEl      = document.getElementById('seconds');
const millisecondsEl = document.getElementById('milliseconds');
const startBtn       = document.getElementById('startBtn');
const pauseBtn       = document.getElementById('pauseBtn');
const resetBtn       = document.getElementById('resetBtn');
const lapBtn         = document.getElementById('lapBtn');
const lapList        = document.getElementById('lapList');
const lapSection     = document.getElementById('lapSection');
const lapCountEl     = document.getElementById('lapCount');

// ── Update Display ──
// Converts raw milliseconds into MM:SS.ms and updates the DOM.
function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins  = Math.floor(totalSeconds / 60);
  const secs  = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10); // two-digit ms

  minutesEl.textContent      = pad(mins);
  secondsEl.textContent      = pad(secs);
  millisecondsEl.textContent = pad(millis);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// ── Format Time String ──
// Returns a formatted string like "01:23.45" for lap records.
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins  = Math.floor(totalSeconds / 60);
  const secs  = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);
  return `${pad(mins)}:${pad(secs)}.${pad(millis)}`;
}

// ── Start ──
startBtn.addEventListener('click', function () {
  if (running) return;

  running   = true;
  startTime = Date.now() - elapsedMs; // account for any existing elapsed time

  // setInterval ticks every 10ms for smooth millisecond updates
  intervalId = setInterval(function () {
    elapsedMs = Date.now() - startTime;
    updateDisplay(elapsedMs);
  }, 10);

  // Button state
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled   = false;
});

// ── Pause ──
pauseBtn.addEventListener('click', function () {
  if (!running) return;

  running = false;
  clearInterval(intervalId); // stop the interval, keep elapsedMs intact

  // Button state
  startBtn.disabled = false;
  startBtn.textContent = 'Resume';
  pauseBtn.disabled = true;
  lapBtn.disabled   = true;
});

// ── Reset ──
resetBtn.addEventListener('click', function () {
  // Stop everything
  running = false;
  clearInterval(intervalId);
  elapsedMs  = 0;
  lapCount   = 0;

  // Reset display
  updateDisplay(0);

  // Clear laps
  lapList.innerHTML = '';
  lapSection.classList.remove('visible');
  lapCountEl.textContent = '0 laps';

  // Button state
  startBtn.disabled    = false;
  startBtn.textContent = 'Start';
  pauseBtn.disabled    = true;
  resetBtn.disabled    = true;
  lapBtn.disabled      = true;
});

// ── Lap ──
lapBtn.addEventListener('click', function () {
  if (!running) return;

  lapCount++;

  // Create list item
  const li = document.createElement('li');
  li.innerHTML = `
    <span>Lap ${lapCount}</span>
    <span class="lap-time">${formatTime(elapsedMs)}</span>
  `;

  // Insert newest lap at the top
  lapList.insertBefore(li, lapList.firstChild);

  // Show lap section if hidden
  lapSection.classList.add('visible');
  lapCountEl.textContent = `${lapCount} lap${lapCount > 1 ? 's' : ''}`;
});