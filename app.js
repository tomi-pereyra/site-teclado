/**
 * LOGITECH MX KEYS S - INTERACTIVE EXPERIENCE ENGINE
 * Crafted with Taste-Skill v2 principles.
 */

// ============================================================================
// 1. SOUND SYNTHESIS ENGINE (Web Audio API - Low Profile Scissor Switch)
// ============================================================================
class KeyboardAcousticEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.keyPressCount = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Accurate acoustic simulation of a damped scissor switch hitting aluminum plate
  playKeystroke(isSpace = false) {
    if (!this.enabled) return;
    this.init();

    const now = this.ctx.currentTime;
    
    // 1. Noise transient (the fingertip striking the dished keycap)
    const bufferSize = this.ctx.sampleRate * 0.025; // 25ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(isSpace ? 1400 : 2200, now);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noiseSource.start(now);

    // 2. Structural thud (the rigid aluminum base resonance)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = isSpace ? 110 : 160;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.035);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);

    this.keyPressCount++;
    const counterEl = document.getElementById('keyCounter');
    if (counterEl) {
      counterEl.textContent = `${this.keyPressCount} toque${this.keyPressCount > 1 ? 's' : ''} registrado${this.keyPressCount > 1 ? 's' : ''}`;
    }
  }
}

const audio = new KeyboardAcousticEngine();

// ============================================================================
// 2. HERO PINNED SCROLL-DRIVEN VIDEO EXPLOSION ENGINE
// ============================================================================
function initHeroScrollVideo() {
  const wrapper = document.getElementById('heroScrollPin');
  const video = document.getElementById('heroExplosionVideo');
  const timeDisplay = document.getElementById('videoTimeDisplay');
  const progressBar = document.getElementById('videoProgressBar');
  const phaseTitle = document.getElementById('heroPhaseTitle');
  const hudMarkers = document.getElementById('heroHudMarkers');
  const phaseMetrics = document.getElementById('heroPhaseMetrics');

  if (!wrapper || !video) return;

  // Ensure video is muted and paused for scroll scrubbing
  video.muted = true;
  video.pause();

  let duration = 6.0;
  let targetTime = 0;
  let currentTime = 0;

  function onMetadata() {
    if (video.duration && !isNaN(video.duration)) {
      duration = video.duration;
    }
    updateScroll();
  }

  video.addEventListener('loadedmetadata', onMetadata);
  if (video.readyState >= 1) {
    onMetadata();
  }

  function updateScroll() {
    const rect = wrapper.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = wrapper.offsetHeight - windowH;
    
    // Scrolled distance within the pinned wrapper
    const scrolled = -rect.top;
    let progress = 0;
    if (totalDist > 0) {
      progress = Math.max(0, Math.min(1, scrolled / totalDist));
    }

    // Map progress to video duration (keep slightly below end to prevent black frame)
    targetTime = progress * Math.max(0.1, duration - 0.04);

    // Update time & progress bar UI
    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${targetTime.toFixed(1)}s / ${duration.toFixed(1)}s`;
    }

    // Phase 1: Main Hero Title (0% - 22% scroll)
    if (phaseTitle) {
      if (progress < 0.22) {
        const titleOpacity = Math.max(0, 1 - (progress / 0.16));
        const titleTranslateY = -progress * 90;
        phaseTitle.style.opacity = titleOpacity.toFixed(2);
        phaseTitle.style.transform = `translateY(${titleTranslateY}px)`;
        phaseTitle.style.pointerEvents = titleOpacity > 0.4 ? 'auto' : 'none';
      } else {
        phaseTitle.style.opacity = '0';
        phaseTitle.style.pointerEvents = 'none';
      }
    }

    // Phase 2: HUD Mechanical Layer Markers (22% - 75% scroll)
    if (hudMarkers) {
      if (progress >= 0.20 && progress <= 0.78) {
        let hudOpacity = 0;
        if (progress < 0.32) {
          hudOpacity = (progress - 0.20) / 0.12;
        } else if (progress <= 0.65) {
          hudOpacity = 1;
        } else {
          hudOpacity = 1 - (progress - 0.65) / 0.13;
        }
        hudMarkers.style.opacity = Math.max(0, Math.min(1, hudOpacity)).toFixed(2);
      } else {
        hudMarkers.style.opacity = '0';
      }
    }

    // Phase 3: Completion Metrics Bar (75% - 100% scroll)
    if (phaseMetrics) {
      if (progress > 0.72) {
        const metricsOpacity = Math.min(1, (progress - 0.72) / 0.16);
        const metricsTranslateY = (1 - metricsOpacity) * 25;
        phaseMetrics.style.opacity = metricsOpacity.toFixed(2);
        phaseMetrics.style.transform = `translateY(${metricsTranslateY}px)`;
        phaseMetrics.style.pointerEvents = metricsOpacity > 0.4 ? 'auto' : 'none';
      } else {
        phaseMetrics.style.opacity = '0';
        phaseMetrics.style.transform = 'translateY(25px)';
        phaseMetrics.style.pointerEvents = 'none';
      }
    }
  }

  // Smooth render loop for frame-accurate 60fps scrubbing
  function renderLoop() {
    const diff = targetTime - currentTime;
    if (Math.abs(diff) > 0.005) {
      currentTime += diff * 0.35; // responsive, snappy scrub
      if (video.readyState >= 2) {
        video.currentTime = currentTime;
      }
    } else if (Math.abs(diff) > 0.0001) {
      currentTime = targetTime;
      if (video.readyState >= 2) {
        video.currentTime = currentTime;
      }
    }

    requestAnimationFrame(renderLoop);
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);

  updateScroll();
  requestAnimationFrame(renderLoop);
}

// ============================================================================
// 3. PRODUCT VARIANT & 360° PERSPECTIVE STUDIO
// ============================================================================
const studioData = {
  graphite: {
    sku: '920-011563',
    title: 'MX Keys S — Grafite',
    sustainability: 'Construção com alumínio de baixo carbono na placa estrutural interna e 26% de plástico reciclado pós-consumo certificado.',
    images: {
      '3qtr': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/graphite/mx-keys-s-keyboard-3qtr-graphite-us.png',
      'top': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/migration-assets-for-delorean-2025/gallery/mx-keys-s-top-view-graphite-us.png',
      'side': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/graphite/mx-keys-s-keyboard-side-graphite-us.png',
      'bottom': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/graphite/mx-keys-s-keyboard-bottom-graphite-us.png'
    }
  },
  'pale-gray': {
    sku: '920-011564',
    title: 'MX Keys S — Cinza-Claro (Pale Gray)',
    sustainability: 'Acabamento minimalista em tons prateados com 11% de plástico reciclado pós-consumo e placa de alumínio renovável.',
    images: {
      '3qtr': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/pale-grey/mx-keys-s-keyboard-3qtr-pale-grey-us.png',
      'top': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/migration-assets-for-delorean-2025/gallery/mx-keys-s-top-view-pale-gray-us.png',
      'side': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/pale-grey/mx-keys-s-keyboard-side-pale-grey-us.png',
      'bottom': 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/pale-grey/mx-keys-s-keyboard-bottom-pale-grey-us.png'
    }
  }
};

let currentStudioColor = 'graphite';
let currentStudioAngle = '3qtr';

function initStudioVisualizer() {
  const viewerImg = document.getElementById('studioViewerImg');
  const titleEl = document.getElementById('studioModelTitle');
  const skuEl = document.getElementById('studioSku');
  const sustEl = document.getElementById('sustainabilityText');
  const colorBtns = document.querySelectorAll('.color-tab-btn');
  const angleBtns = document.querySelectorAll('.angle-btn');

  function updateStudio() {
    const data = studioData[currentStudioColor];
    if (!data) return;

    if (viewerImg) {
      viewerImg.style.opacity = '0.3';
      viewerImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        viewerImg.src = data.images[currentStudioAngle];
        viewerImg.style.opacity = '1';
        viewerImg.style.transform = 'scale(1)';
      }, 150);
    }

    if (titleEl) titleEl.textContent = data.title;
    if (skuEl) skuEl.textContent = data.sku;
    if (sustEl) sustEl.textContent = data.sustainability;
  }

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStudioColor = btn.dataset.color;
      updateStudio();
    });
  });

  angleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      angleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStudioAngle = btn.dataset.angle;
      updateStudio();
    });
  });
}

// ============================================================================
// 4. INTERACTIVE KEYBOARD TESTER (Physical + Virtual Keys)
// ============================================================================
function initKeyboardTester() {
  const virtualKeys = document.querySelectorAll('.interactive-key');

  virtualKeys.forEach(btn => {
    btn.addEventListener('click', () => {
      const isSpace = btn.dataset.key === 'space';
      audio.playKeystroke(isSpace);
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 120);
    });
  });

  // Physical keyboard listener
  window.addEventListener('keydown', (e) => {
    // Avoid interfering when typing in potential input fields
    if (['input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;

    const keyName = e.key.toLowerCase();
    const isSpace = keyName === ' ';

    audio.playKeystroke(isSpace);

    // Highlight matching virtual key if visible
    const match = Array.from(virtualKeys).find(k => {
      if (isSpace && k.dataset.key === 'space') return true;
      if (keyName === 'enter' && k.dataset.key === 'enter') return true;
      return k.dataset.key === keyName;
    });

    if (match) {
      match.classList.add('pressed');
      setTimeout(() => match.classList.remove('pressed'), 120);
    }
  });

  // Sound toggle button in header
  const soundBtn = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  if (soundBtn && soundLabel) {
    soundBtn.addEventListener('click', () => {
      const active = audio.toggle();
      soundLabel.textContent = active ? 'Som Tátil Ativo' : 'Som Mudo';
      soundBtn.style.opacity = active ? '1' : '0.5';
    });
  }
}

// ============================================================================
// 5. SMART ACTIONS AUTOMATION PLAYGROUND
// ============================================================================
const macroDefinitions = {
  coding: {
    name: 'Dev Flow',
    key: 'F1',
    steps: [
      { text: 'Detectando gatilho Smart Action: Tecla F1 pressionada', delay: 100 },
      { text: 'Iniciando Visual Studio Code (Workspace: site-luxpryme)...', delay: 350 },
      { text: 'Abrindo Terminal zsh com ambiente Node 22 configurado', delay: 650 },
      { text: 'Subindo containers Docker (PostgreSQL & Redis)', delay: 1000 },
      { text: 'Iniciando playlist "Lofi Beats - Coding Focus" no Spotify', delay: 1300 },
      { text: '✔ Estado de Flow ativado com sucesso em 1.4s!', delay: 1600 }
    ]
  },
  meeting: {
    name: 'Modo Reunião',
    key: 'F2',
    steps: [
      { text: 'Detectando gatilho Smart Action: Tecla F2 pressionada', delay: 100 },
      { text: 'Silenciando microfone do sistema (Atalho MX Mute ativo)', delay: 300 },
      { text: 'Ativando modo "Não Perturbe" no macOS / Windows', delay: 600 },
      { text: 'Abrindo Google Meet na janela de conferência dedicada', delay: 950 },
      { text: '✔ Setup de reunião pronto e protegido sem ruídos.', delay: 1300 }
    ]
  },
  creative: {
    name: 'Design Sprint',
    key: 'F3',
    steps: [
      { text: 'Detectando gatilho Smart Action: Tecla F3 pressionada', delay: 100 },
      { text: 'Iniciando Figma Desktop App no Monitor 1', delay: 350 },
      { text: 'Carregando biblioteca de componentes Logitech Master Series', delay: 750 },
      { text: 'Minimizando mensageiros corporativos (Slack, Discord)', delay: 1100 },
      { text: '✔ Workspace imersivo de design preparado.', delay: 1450 }
    ]
  }
};

let activeMacroKey = 'coding';
let isRunningMacro = false;

function initSmartActions() {
  const cards = document.querySelectorAll('.macro-card');
  const triggerBtn = document.getElementById('triggerMacroBtn');
  const terminal = document.getElementById('terminalOutput');
  const statusEl = document.getElementById('macroStatusText');
  const progressBar = document.getElementById('macroProgressBar');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (isRunningMacro) return;
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeMacroKey = card.dataset.macro;
      const def = macroDefinitions[activeMacroKey];
      if (triggerBtn) {
        triggerBtn.querySelector('span').textContent = `Disparar Macro (${def.key})`;
      }
    });
  });

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      if (isRunningMacro) return;
      runMacroSequence();
    });
  }

  function runMacroSequence() {
    const def = macroDefinitions[activeMacroKey];
    if (!def) return;

    isRunningMacro = true;
    audio.playKeystroke();
    triggerBtn.disabled = true;
    triggerBtn.style.opacity = '0.5';
    statusEl.textContent = `Executando ${def.name}...`;
    statusEl.className = 'text-yellow-400';
    progressBar.style.width = '0%';

    terminal.innerHTML = '';

    def.steps.forEach((step, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'text-xs flex items-center gap-2 animate-fade-in';
        
        if (index === def.steps.length - 1) {
          line.innerHTML = `<span class="text-accent font-bold">✔</span> <span class="text-white font-bold">${step.text}</span>`;
          statusEl.textContent = 'Automação Concluída';
          statusEl.className = 'text-accent font-bold';
          progressBar.style.width = '100%';
          isRunningMacro = false;
          triggerBtn.disabled = false;
          triggerBtn.style.opacity = '1';
        } else {
          line.innerHTML = `<span class="text-accent">❯</span> <span class="text-zinc-300">${step.text}</span>`;
          const progress = Math.round(((index + 1) / def.steps.length) * 100);
          progressBar.style.width = `${progress}%`;
        }

        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
      }, step.delay);
    });
  }
}

// ============================================================================
// 6. ILLUMINATION CONTROLLER SIMULATOR
// ============================================================================
function initIlluminationController() {
  const nearBtn = document.getElementById('proximityNearBtn');
  const awayBtn = document.getElementById('proximityAwayBtn');
  const slider = document.getElementById('brightnessSlider');
  const sliderText = document.getElementById('sliderValueText');
  const ambientBtns = document.querySelectorAll('.ambient-btn');
  const batteryEstimate = document.getElementById('batteryEstimate');

  if (nearBtn && awayBtn) {
    nearBtn.addEventListener('click', () => {
      nearBtn.className = 'px-4 py-3 rounded-xl border border-accent bg-accent/10 text-white font-medium text-xs flex items-center justify-center gap-2';
      awayBtn.className = 'px-4 py-3 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 font-medium text-xs flex items-center justify-center gap-2';
      if (slider) {
        slider.value = 85;
        sliderText.textContent = '85%';
      }
      batteryEstimate.textContent = '10 Dias com Luz Contínua';
    });

    awayBtn.addEventListener('click', () => {
      awayBtn.className = 'px-4 py-3 rounded-xl border border-accent bg-accent/10 text-white font-medium text-xs flex items-center justify-center gap-2';
      nearBtn.className = 'px-4 py-3 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 font-medium text-xs flex items-center justify-center gap-2';
      if (slider) {
        slider.value = 0;
        sliderText.textContent = '0%';
      }
      batteryEstimate.textContent = 'Até 5 Meses de Autonomia';
    });
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      sliderText.textContent = `${val}%`;
      if (val == 0) {
        batteryEstimate.textContent = 'Até 5 Meses (Luz Desligada)';
      } else {
        const days = Math.max(8, Math.round(15 - (val / 100) * 7));
        batteryEstimate.textContent = `Aprox. ${days} Dias de Carga`;
      }
    });
  }

  ambientBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ambientBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ============================================================================
// 7. EASY-SWITCH DEVICE SELECTOR
// ============================================================================
function initEasySwitch() {
  const pills = document.querySelectorAll('.device-pill');
  const channelDisplay = document.getElementById('activeChannel');

  const channelNames = {
    '1': '1 (MacBook Pro M3)',
    '2': '2 (Workstation Windows 11)',
    '3': '3 (iPad Pro / Linux)'
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      audio.playKeystroke();
      const ch = pill.dataset.channel;
      if (channelDisplay && channelNames[ch]) {
        channelDisplay.textContent = channelNames[ch];
      }
    });
  });
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeroScrollVideo();
  initStudioVisualizer();
  initKeyboardTester();
  initSmartActions();
  initIlluminationController();
  initEasySwitch();
  console.log('Logitech MX Keys S Experience initialized successfully.');
});

