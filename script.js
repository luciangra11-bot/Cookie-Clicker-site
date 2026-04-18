const cookieCountEl = document.getElementById('cookieCount');
const cpsEl = document.getElementById('cps');
const cpcEl = document.getElementById('cpc');
const cursorCountEl = document.getElementById('cursorCount');
const grandmaCountEl = document.getElementById('grandmaCount');
const strengthCountEl = document.getElementById('strengthCount');
const cookieButton = document.getElementById('cookieButton');
const buyCursorButton = document.getElementById('buyCursor');
const buyGrandmaButton = document.getElementById('buyGrandma');
const buyStrengthButton = document.getElementById('buyStrength');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');
const saveStatusEl = document.getElementById('saveStatus');

const STORAGE_KEY = 'cookieClickerSave';
let audioCtx = null;
let cookies = 0;
let cps = 0;
let cpc = 1;
let cursorCount = 0;
let grandmaCount = 0;
let strengthCount = 0;
let prices = {
  cursor: 15,
  grandma: 100,
  strength: 50,
};

function getAudioContext() {
  if (audioCtx) return audioCtx;
  const constructor = window.AudioContext || window.webkitAudioContext;
  if (!constructor) return null;
  audioCtx = new constructor();
  return audioCtx;
}

function playTone(frequency, duration = 0.14, type = 'sine', volume = 0.12) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
  gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration + 0.02);
}

function clickSound() {
  playTone(420, 0.14, 'sine', 0.07);
}

function purchaseSound() {
  playTone(560, 0.16, 'sine', 0.1);
}

function saveSound() {
  playTone(380, 0.18, 'sine', 0.09);
}

function getSaveData() {
  return {
    cookies,
    cps,
    cpc,
    cursorCount,
    grandmaCount,
    strengthCount,
    prices,
  };
}

function updatePriceLabels() {
  buyCursorButton.textContent = `Buy (${prices.cursor} cookies)`;
  buyGrandmaButton.textContent = `Buy (${prices.grandma} cookies)`;
  buyStrengthButton.textContent = `Buy (${prices.strength} cookies)`;
}

function updateUI() {
  cookieCountEl.textContent = Math.floor(cookies);
  cpsEl.textContent = cps.toFixed(1);
  cpcEl.textContent = cpc;
  cursorCountEl.textContent = cursorCount;
  grandmaCountEl.textContent = grandmaCount;
  strengthCountEl.textContent = strengthCount;
  buyCursorButton.disabled = cookies < prices.cursor;
  buyGrandmaButton.disabled = cookies < prices.grandma;
  buyStrengthButton.disabled = cookies < prices.strength;
  updatePriceLabels();
}

function addCookies(amount) {
  cookies += amount;
  updateUI();
}

function recalcCPS() {
  cps = cursorCount * 1 + grandmaCount * 5;
}

function showSaveMessage(message) {
  saveStatusEl.textContent = message;
}

function saveGame(manual = false) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getSaveData()));
    if (manual) {
      showSaveMessage('Progress saved!');
      saveSound();
      setTimeout(() => {
        showSaveMessage('Autosaves every 5 seconds.');
      }, 1500);
    }
  } catch (error) {
    showSaveMessage('Could not save progress.');
  }
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    cookies = Number(data.cookies) || 0;
    cpc = Number(data.cpc) || 1;
    cursorCount = Number(data.cursorCount) || 0;
    grandmaCount = Number(data.grandmaCount) || 0;
    strengthCount = Number(data.strengthCount) || 0;
    prices = {
      cursor: Number(data.prices?.cursor) || 15,
      grandma: Number(data.prices?.grandma) || 100,
      strength: Number(data.prices?.strength) || 50,
    };
    recalcCPS();
    updateUI();
    showSaveMessage('Progress loaded.');
    setTimeout(() => {
      showSaveMessage('Autosaves every 5 seconds.');
    }, 1400);
  } catch (error) {
    console.warn('Failed to parse save data.', error);
  }
}

function resetGame() {
  if (!confirm('Reset progress and start over?')) return;
  cookies = 0;
  cps = 0;
  cpc = 1;
  cursorCount = 0;
  grandmaCount = 0;
  strengthCount = 0;
  prices = {
    cursor: 15,
    grandma: 100,
    strength: 50,
  };
  saveGame(true);
  updateUI();
  showSaveMessage('Game reset.');
}

cookieButton.addEventListener('click', () => {
  addCookies(cpc);
  clickSound();
});

buyCursorButton.addEventListener('click', () => {
  if (cookies < prices.cursor) return;
  cookies -= prices.cursor;
  cursorCount += 1;
  prices.cursor = Math.floor(prices.cursor * 1.15);
  recalcCPS();
  updateUI();
  purchaseSound();
  saveGame();
});

buyGrandmaButton.addEventListener('click', () => {
  if (cookies < prices.grandma) return;
  cookies -= prices.grandma;
  grandmaCount += 1;
  prices.grandma = Math.floor(prices.grandma * 1.18);
  recalcCPS();
  updateUI();
  purchaseSound();
  saveGame();
});

buyStrengthButton.addEventListener('click', () => {
  if (cookies < prices.strength) return;
  cookies -= prices.strength;
  strengthCount += 1;
  cpc += 1;
  prices.strength = Math.floor(prices.strength * 1.22);
  updateUI();
  purchaseSound();
  saveGame();
});

saveButton.addEventListener('click', () => {
  saveGame(true);
});

resetButton.addEventListener('click', resetGame);

setInterval(() => {
  if (cps > 0) {
    cookies += cps / 10;
    updateUI();
  }
}, 100);

setInterval(() => {
  saveGame();
}, 5000);

loadGame();
updateUI();
