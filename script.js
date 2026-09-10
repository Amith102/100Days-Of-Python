/**
 * Band Name Generator - Day 1 of 100 Days of Python
 * Fully Dynamic Concert Studio with Real-Time Synthesis, 3D Card Tilt,
 * Multi-Mode Audio Visualizer, Interactive Vinyl Turntable & Album Art Generator
 */

// --- Web Audio Synthesizer Engine ---
class AudioController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.beatActive = false;
    this.beatInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.beatActive) {
      this.stopBeat();
    }
    return this.enabled;
  }

  // Play an electric power chord / neon synth chime
  playChord(type = 'rock') {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      // Frequencies for an energetic chord progression (E, B, E, G#)
      const freqs = type === 'scratch' ? [120, 240, 180, 360] : [164.81, 246.94, 329.63, 415.30, 493.88]; 

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        if (type === 'scratch') {
          // Pitch slide for turntable scratch effect
          osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.12);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.28);
        }

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 0.65);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'scratch' ? 0.35 : 0.85));

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.9);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play an interactive subtle keystroke click/chime
  playKeyClick() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const tones = [440, 523.25, 587.33, 659.25, 783.99];
      const note = tones[Math.floor(Math.random() * tones.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);
      osc.frequency.exponentialRampToValueAtTime(note * 1.5, now + 0.06);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Play subtle UI blip
  playBlip() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // 120 BPM Kick beat
  startBeat(onBeatCallback) {
    if (!this.enabled) return;
    this.init();
    this.beatActive = true;
    
    // 120 BPM = 500ms per beat
    this.beatInterval = setInterval(() => {
      if (!this.beatActive || !this.enabled) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);

        if (onBeatCallback) onBeatCallback();
      } catch (e) {}
    }, 500);
  }

  stopBeat() {
    this.beatActive = false;
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
  }
}

// --- Multi-Mode Dynamic Canvas Visualizer ---
class DynamicVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'bars'; // 'bars' | 'wave' | 'particles'
    
    this.bars = 54;
    this.heights = new Array(this.bars).fill(10);
    this.boost = 0;

    // Particles for 'particles' mode
    this.particles = [];
    this.initParticles();

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  setMode(newMode) {
    this.mode = newMode;
    this.pulse(1.2);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 70; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * 280,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2,
        color: ['#00f5d4', '#7928ca', '#f72585', '#fee440'][Math.floor(Math.random() * 4)]
      });
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = 280;
  }

  pulse(val = 1.0) {
    this.boost = Math.min(2.0, this.boost + val);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = Date.now() * 0.003;

    if (this.boost > 0) {
      this.boost -= 0.025;
      if (this.boost < 0) this.boost = 0;
    }

    if (this.mode === 'bars') {
      this.drawBars(time);
    } else if (this.mode === 'wave') {
      this.drawWave(time);
    } else if (this.mode === 'particles') {
      this.drawParticles(time);
    }

    requestAnimationFrame(() => this.animate());
  }

  drawBars(time) {
    const barWidth = this.width / this.bars;
    for (let i = 0; i < this.bars; i++) {
      const wave = Math.sin(time + i * 0.22) * 0.5 + 0.5;
      const target = (wave * 60 + Math.random() * 15) * (1 + this.boost * 1.8);
      this.heights[i] += (target - this.heights[i]) * 0.18;

      const x = i * barWidth;
      const h = Math.max(4, this.heights[i]);
      const y = this.height - h;

      const gradient = this.ctx.createLinearGradient(0, y, 0, this.height);
      gradient.addColorStop(0, 'rgba(0, 245, 212, 0.85)');
      gradient.addColorStop(0.5, 'rgba(121, 40, 202, 0.5)');
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + 2, y, barWidth - 4, h);
    }
  }

  drawWave(time) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 3 + this.boost * 3;
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, '#00f5d4');
    gradient.addColorStop(0.5, '#f72585');
    gradient.addColorStop(1, '#7928ca');
    this.ctx.strokeStyle = gradient;

    const baseLine = this.height * 0.65;
    for (let x = 0; x < this.width; x += 6) {
      const wave = Math.sin(x * 0.015 + time * 2) * 40 * (1 + this.boost * 2);
      const wave2 = Math.cos(x * 0.03 - time) * 20 * (1 + this.boost);
      const y = baseLine + wave + wave2;

      if (x === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Fill underneath with translucent glow
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.fillStyle = 'rgba(0, 245, 212, 0.06)';
    this.ctx.fill();
  }

  drawParticles(time) {
    this.particles.forEach(p => {
      p.x += p.vx * (1 + this.boost * 2);
      p.y += p.vy * (1 + this.boost * 2);

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * (1 + this.boost * 0.8), 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    });
    this.ctx.shadowBlur = 0;
  }
}

// --- Confetti Cannon ---
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#00f5d4', '#7928ca', '#f72585', '#fee440', '#ffffff'];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  fire() {
    const count = 75;
    const startX = this.width / 2;
    const startY = this.height * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 9;
      this.particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        size: 5 + Math.random() * 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        life: 0.95 + Math.random() * 0.04
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.alpha *= p.life;

      if (p.alpha <= 0.02 || p.y > this.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// --- Text Scrambler / Decryption Effect ---
class TextScrambler {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHJKMNPQRSTUVWXYZ';
    this.timer = null;
  }

  setText(newText) {
    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);
    let queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 6);
      const end = start + Math.floor(Math.random() * 10);
      queue.push({ from, to, start, end, char: '' });
    }

    cancelAnimationFrame(this.frameRequest);
    let frame = 0;

    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }

      this.element.innerText = output;

      if (complete === queue.length) {
        this.element.classList.remove('scramble');
      } else {
        this.element.classList.add('scramble');
        frame++;
        this.frameRequest = requestAnimationFrame(update);
      }
    };

    update();
  }
}

// --- Dynamic Album Art Generator (Canvas Rendering) ---
class AlbumArtGenerator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
  }

  render(bandName, genre, city, pet) {
    const size = 500;
    this.canvas.width = size;
    this.canvas.height = size;
    const ctx = this.ctx;

    // 1. Dark Concert Background with Gradients
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#0a0b12');
    bgGrad.addColorStop(0.5, '#16192b');
    bgGrad.addColorStop(1, '#05060a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // 2. Glowing Neon Geometric Aura
    const aura = ctx.createRadialGradient(size * 0.5, size * 0.45, 10, size * 0.5, size * 0.45, 240);
    aura.addColorStop(0, 'rgba(0, 245, 212, 0.45)');
    aura.addColorStop(0.5, 'rgba(121, 40, 202, 0.35)');
    aura.addColorStop(0.8, 'rgba(247, 37, 133, 0.2)');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, size, size);

    // 3. Stylized Concentric Vinyl Rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let r = 50; r <= 220; r += 20) {
      ctx.beginPath();
      ctx.arc(size / 2, size * 0.45, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Top Header Banner
    ctx.fillStyle = '#fee440';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL WORLD TOUR &bull; DAY 01', size / 2, 45);

    // 5. Origin Badge (City & Pet)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillText(`HOMETOWN: ${city.toUpperCase()} | PET: ${pet.toUpperCase()}`, size / 2, 70);

    // 6. Central Band Name Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Syne", sans-serif';
    ctx.shadowColor = '#00f5d4';
    ctx.shadowBlur = 18;

    // Wrap long band names
    const words = bandName.split(' ');
    if (words.length > 2) {
      ctx.fillText(words.slice(0, 2).join(' '), size / 2, size * 0.42);
      ctx.fillText(words.slice(2).join(' '), size / 2, size * 0.52);
    } else {
      ctx.fillText(bandName, size / 2, size * 0.46);
    }

    ctx.shadowBlur = 0;

    // 7. Genre Banner
    ctx.fillStyle = '#f72585';
    ctx.font = 'bold 14px "Outfit", sans-serif';
    ctx.fillText(`GENRE: ${genre.toUpperCase()}`, size / 2, size * 0.72);

    // 8. Bottom Barcode / Record Label Stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('STEREO &bull; 100 DAYS PYTHON RECORDS &bull; LP-2026', size / 2, size - 35);

    // Decorative edge frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, size - 36, size - 36);
  }

  download(filename = 'band-album-cover.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

// --- Main Application Lifecycle ---
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cityInput = document.getElementById('city-input');
  const petInput = document.getElementById('pet-input');
  const form = document.getElementById('band-form');
  const generateBtn = document.getElementById('generate-btn');
  const randomizeBtn = document.getElementById('randomize-btn');
  const resultStage = document.getElementById('result-stage');
  const bandNameOutput = document.getElementById('band-name-output');
  const genreTag = document.getElementById('genre-tag');
  const tempoTag = document.getElementById('tempo-tag');
  const copyBtn = document.getElementById('copy-btn');
  const copyText = document.getElementById('copy-text');
  const favoriteBtn = document.getElementById('favorite-btn');
  const replaySoundBtn = document.getElementById('replay-sound-btn');
  const exportArtBtn = document.getElementById('export-art-btn');
  const historyList = document.getElementById('history-list');
  const historyCount = document.getElementById('history-count');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const soundStatusText = document.getElementById('sound-status-text');
  const beatToggleBtn = document.getElementById('beat-toggle-btn');
  const beatStatusText = document.getElementById('beat-status-text');
  const toast = document.getElementById('toast');
  const copyPyCodeBtn = document.getElementById('copy-py-code-btn');
  const generatorCard = document.getElementById('generator-card');
  const cursorSpotlight = document.getElementById('cursor-spotlight');
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylContainer = document.getElementById('vinyl-container');
  const cityTyping = document.getElementById('city-typing');
  const petTyping = document.getElementById('pet-typing');

  // Controllers
  const audio = new AudioController();
  const visualizer = new DynamicVisualizer('visualizer-canvas');
  const confetti = new ConfettiCannon('confetti-canvas');
  const scrambler = new TextScrambler(bandNameOutput);
  const albumArt = new AlbumArtGenerator('album-canvas');

  // State
  let currentBandName = 'Nashville Ziggy';
  let currentStyle = 'classic';
  let currentGenre = 'Indie Alternative';
  let favorites = JSON.parse(localStorage.getItem('band_name_history') || '[]');

  const surpriseCities = [
    'Detroit', 'Austin', 'Seattle', 'Manchester', 'Tokyo', 'Berlin', 
    'Nashville', 'Reykjavik', 'Chicago', 'Melbourne', 'Portland', 'New Orleans', 'London'
  ];
  const surprisePets = [
    'Shadow', 'Ziggy', 'Luna', 'Bowie', 'Thunder', 'Velvet', 
    'Milo', 'Jinx', 'Ghost', 'Bandit', 'Pixel', 'Rocket'
  ];
  const genres = [
    'Garage Punk Revival', 'Neo-Psychedelic Wave', 'Indie Alt-Rock', 
    'Heavy Distortion Metal', 'Synthpop Midnight', 'Lo-Fi Surf Rock', 'Post-Punk Anthem', 'Electro Funk Rock'
  ];

  // Utility: Clean Capitalization
  function formatName(str) {
    if (!str) return '';
    return str.trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Toast
  let toastTimer = null;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  // Band Name Formulation
  function composeBandName(city, pet, style) {
    const c = formatName(city) || 'City';
    const p = formatName(pet) || 'Pet';

    switch (style) {
      case 'the':
        return `The ${c} ${p}s`;
      case 'electric': {
        const adjectives = ['Electric', 'Cosmic', 'Velvet', 'Sonic', 'Midnight', 'Neon'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        return `${adj} ${c} ${p}`;
      }
      case 'metal':
        return `IRON ${c.toUpperCase()} & ${p.toUpperCase()}`;
      case 'classic':
      default:
        return `${c} ${p}`;
    }
  }

  // Update Display & Artwork
  function updateStage(animate = true) {
    const city = cityInput.value.trim() || 'Nashville';
    const pet = petInput.value.trim() || 'Ziggy';
    const bandName = composeBandName(city, pet, currentStyle);
    currentBandName = bandName;

    if (animate) {
      scrambler.setText(bandName);
    } else {
      bandNameOutput.innerText = bandName;
    }

    albumArt.render(bandName, currentGenre, city, pet);
  }

  // Render Favorites
  function renderHistory() {
    historyCount.textContent = favorites.length;
    if (favorites.length === 0) {
      historyList.innerHTML = '<p class="empty-state">No band names saved yet. Hit "Generate" or click "Save" to build your roster!</p>';
      return;
    }

    historyList.innerHTML = favorites.map((item, index) => `
      <div class="history-item">
        <div class="item-left">
          <span class="item-name">${item.name}</span>
          <span class="item-date">&bull; ${item.style}</span>
        </div>
        <div class="item-actions">
          <button type="button" class="small-icon-btn copy-hist-btn" data-index="${index}" title="Copy band name">
            <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button type="button" class="small-icon-btn delete-btn delete-hist-btn" data-index="${index}" title="Remove">
            <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.copy-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        navigator.clipboard.writeText(favorites[idx].name);
        showToast(`Copied "${favorites[idx].name}"!`);
        audio.playBlip();
      });
    });

    document.querySelectorAll('.delete-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.dataset.index);
        favorites.splice(idx, 1);
        localStorage.setItem('band_name_history', JSON.stringify(favorites));
        renderHistory();
        audio.playBlip();
      });
    });
  }

  // Save to Favorites
  function saveToFavorites(name, style) {
    if (!name) return;
    const exists = favorites.some(item => item.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      showToast(`"${name}" is already in your saved list!`);
      return;
    }
    favorites.unshift({
      name: name,
      style: style.toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('band_name_history', JSON.stringify(favorites));
    renderHistory();
    showToast(`Saved "${name}" to roster!`);
  }

  // Live Dynamic Typing Handler
  function handleInputLive(inputEl, indicatorEl) {
    toggleClearBtn(inputEl);
    indicatorEl.classList.add('active');
    indicatorEl.textContent = 'Typing...';

    audio.playKeyClick();
    visualizer.pulse(0.25);

    clearTimeout(inputEl.typingTimeout);
    inputEl.typingTimeout = setTimeout(() => {
      indicatorEl.classList.remove('active');
      indicatorEl.textContent = 'Listening...';
    }, 600);

    updateStage(false);
  }

  // --- Dynamic 3D Card Tilt & Interactive Cursor Spotlight ---
  document.addEventListener('mousemove', (e) => {
    // 1. Cursor Spotlight Position
    cursorSpotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

    // 2. 3D Card Tilt
    if (window.innerWidth > 768 && generatorCard) {
      const rect = generatorCard.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const distX = (e.clientX - cardCenterX) / (rect.width / 2);
      const distY = (e.clientY - cardCenterY) / (rect.height / 2);

      // Only tilt if within reasonable vicinity
      if (Math.abs(distX) < 1.4 && Math.abs(distY) < 1.4) {
        const rotateY = distX * 6;
        const rotateX = -distY * 6;
        generatorCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      } else {
        generatorCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    }
  });

  // --- Interactive Vinyl Scratching ---
  vinylContainer.addEventListener('click', () => {
    vinylDisc.classList.add('scratching');
    audio.playChord('scratch');
    visualizer.pulse(1.4);
    showToast('🎸 Vinyl Scratched! Power Chord Fired!');

    setTimeout(() => {
      vinylDisc.classList.remove('scratching');
    }, 450);
  });

  // --- Visualizer Mode Buttons ---
  document.querySelectorAll('.viz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      visualizer.setMode(btn.dataset.mode);
      audio.playBlip();
      showToast(`Visualizer: ${btn.textContent} mode`);
    });
  });

  // --- Live Dynamic Beat Metronome ---
  beatToggleBtn.addEventListener('click', () => {
    if (audio.beatActive) {
      audio.stopBeat();
      beatToggleBtn.classList.remove('beat-active');
      beatStatusText.textContent = 'Beat: Off';
      showToast('120 BPM Stage Beat stopped');
    } else {
      beatToggleBtn.classList.add('beat-active');
      beatStatusText.textContent = 'Beat: 120 BPM';
      audio.startBeat(() => {
        visualizer.pulse(0.4);
      });
      showToast('120 BPM Stage Beat started 🥁');
    }
    audio.playBlip();
  });

  // --- Generate Flow ---
  function handleGenerate() {
    const city = cityInput.value.trim();
    const pet = petInput.value.trim();

    if (!city) {
      cityInput.focus();
      showToast('Please enter the city you grew up in!');
      return;
    }

    if (!pet) {
      petInput.focus();
      showToast('Please enter your pet\'s name!');
      return;
    }

    currentGenre = genres[Math.floor(Math.random() * genres.length)];
    genreTag.textContent = currentGenre;

    updateStage(true);

    audio.playChord('rock');
    visualizer.pulse(1.6);
    confetti.fire();

    resultStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- Event Listeners ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleGenerate();
  });

  cityInput.addEventListener('input', () => handleInputLive(cityInput, cityTyping));
  petInput.addEventListener('input', () => handleInputLive(petInput, petTyping));

  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.style-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentStyle = btn.dataset.style;
      audio.playBlip();
      updateStage(true);
    });
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const targetId = chip.dataset.input;
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        targetInput.value = chip.dataset.value;
        toggleClearBtn(targetInput);
        audio.playKeyClick();
        visualizer.pulse(0.5);

        if (cityInput.value.trim() && petInput.value.trim()) {
          handleGenerate();
        } else {
          updateStage(true);
        }
      }
    });
  });

  function toggleClearBtn(input) {
    const clearBtn = input.parentElement.querySelector('.clear-input-btn');
    if (clearBtn) {
      if (input.value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
  }

  document.querySelectorAll('.clear-input-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInput = document.getElementById(btn.dataset.target);
      if (targetInput) {
        targetInput.value = '';
        btn.classList.add('hidden');
        targetInput.focus();
        audio.playBlip();
        updateStage(false);
      }
    });
  });

  randomizeBtn.addEventListener('click', () => {
    const randomCity = surpriseCities[Math.floor(Math.random() * surpriseCities.length)];
    const randomPet = surprisePets[Math.floor(Math.random() * surprisePets.length)];

    cityInput.value = randomCity;
    petInput.value = randomPet;
    toggleClearBtn(cityInput);
    toggleClearBtn(petInput);

    handleGenerate();
  });

  copyBtn.addEventListener('click', () => {
    if (!currentBandName) return;
    navigator.clipboard.writeText(currentBandName).then(() => {
      copyText.textContent = 'Copied!';
      showToast(`Copied "${currentBandName}" to clipboard!`);
      audio.playBlip();
      setTimeout(() => {
        copyText.textContent = 'Copy Name';
      }, 2000);
    });
  });

  favoriteBtn.addEventListener('click', () => {
    if (currentBandName) {
      saveToFavorites(currentBandName, currentStyle);
      audio.playBlip();
    }
  });

  replaySoundBtn.addEventListener('click', () => {
    audio.playChord('rock');
    visualizer.pulse(1.3);
  });

  exportArtBtn.addEventListener('click', () => {
    const cleanFileName = (currentBandName || 'band-art').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-cover.png';
    albumArt.download(cleanFileName);
    audio.playBlip();
    showToast('Downloaded High-Res Album Cover! 🎨');
  });

  clearHistoryBtn.addEventListener('click', () => {
    if (favorites.length === 0) return;
    favorites = [];
    localStorage.removeItem('band_name_history');
    renderHistory();
    showToast('Saved list cleared.');
    audio.playBlip();
  });

  soundToggleBtn.addEventListener('click', () => {
    const isAudioOn = audio.toggle();
    if (isAudioOn) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      soundStatusText.textContent = 'FX: On';
      showToast('Sound effects enabled 🎸');
      audio.playBlip();
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
      soundStatusText.textContent = 'FX: Off';
      showToast('Sound effects muted');
    }
  });

  copyPyCodeBtn.addEventListener('click', () => {
    const code = document.getElementById('py-source-code').innerText;
    navigator.clipboard.writeText(code).then(() => {
      showToast('Day 1 Python source copied!');
      audio.playBlip();
    });
  });

  // Initial Load
  cityInput.value = 'Nashville';
  petInput.value = 'Ziggy';
  toggleClearBtn(cityInput);
  toggleClearBtn(petInput);
  updateStage(false);
  renderHistory();
});
