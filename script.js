/* ====== CONFIG: EDIT BAGIAN INI ====== */
const CONFIG = {
  names: 'Dia & Kamu',                 // contoh: 'Budi & Siti'
  targetDate: '2026-10-10T00:00:00',   // web baru bisa dimulai pada tanggal ini (hitung mundur)
  pin: '201010',                       // PIN untuk membuka amplop
  pinClue: 'Anniversary Date',            // petunjuk di bawah keypad
  paper: [                             // isi kertas ucapan (satu baris = satu paragraf)
    'Happy Anniversary yg ke 6 tahun sayangkuuu 💖',
    'Semoga kita sehat selalu, makin sayang satu sama lain, semoga semua rencana dan tujuan kita tercapai yashh sayangg.',
    'Walaupun banyak kesulitan, kita harus tetep lewatin semuanya bareng bareng yaa bebe, jangan menyerah sama keadaan pokoknyaaa.',
    'I Love You Sayangg!!! ❤️'
  ],
  askTitle: 'Kita mau main ga?',                      // pertanyaan setelah bar sayang
  whereTitle: 'Mau kemana nih mainnya?',
  places: [                            // pilihan tujuan main
    { emoji: '☕', name: 'Caffe', reply: 'Oke, ngopi bareng yaa! Bapi catat ☕💖' },
    { emoji: '📸', name: 'Photo booth', reply: 'Siap, kita foto-foto lagi yaa! 📸💖' },
    { emoji: '🧺', name: 'Piknik', reply: 'Yeay piknik! Kita siapin bekalnya 🧺💖' },
    { emoji: '🤷', name: 'Gimana nanti', reply: 'Hehe, gimana nanti aja deh, asal sama kamu 🤷💖' }
  ],
  finale: [                            // kata-kata penutup (baris dengan {choice} dilewati kalau belum memilih)
    'Enam tahun yang lalu, bapi kenal kamu...',
    'Dan sekarang kita udah sejauh ini 💞',
    'Bapi bakal selalu sayang sama kamu',
    'Rencana Kita: {choice}',
    'Happy 6th Anniversary, sayang 💖\nI love you, today and always.'
  ],
  loveTitle: 'Seberapa sayang kamu sama bapiii!!!',   // judul bar sayang
  words: ['HAPPY', 'ANNIVERSARY', 'SAYANG!!!'], // kata yang muncul satu per satu setelah 3-2-1, lalu ♥
  rainText: 'Happy Anniversary',       // tulisan yang jatuh di latar hitung 3-2-1
  // Taruh foto di folder img/, lalu tulis nama filenya. Jika file tidak ada, tampil emoji.
  photos: [
    { src: 'img/1.jpg', caption: 'Selfie malam', emoji: '🌙' },
    { src: 'img/2.jpg', caption: 'Nongkrong bareng', emoji: '🌿' },
    { src: 'img/3.jpg', caption: 'Photobox', emoji: '📸' },
    { src: 'img/4.jpg', caption: 'Kondangan', emoji: '👗' },
    { src: 'img/5.jpg', caption: 'Bianglala', emoji: '🎡' },
    { src: 'img/6.jpg', caption: 'Topi kembaran', emoji: '🧢' },
    { src: 'img/7.jpg', caption: 'Studio foto', emoji: '🤠' },
    { src: 'img/8.jpg', caption: 'Ngopi di alam', emoji: '☕' },
    { src: 'img/9.jpg', caption: 'Duduk berdua', emoji: '🫶' },
    { src: 'img/10.jpg', caption: 'Jalan sore', emoji: '🌇' },
    { src: 'img/11.jpg', caption: 'Dinner', emoji: '🍽️' }
  ],
};
/* ====================================== */

const $ = id => document.getElementById(id);
document.title = `6 Tahun ${CONFIG.names} 💖`;


// Hitung 3-2-1 dengan hujan tulisan "HAPPY ANNIVERSARY" (jalan otomatis saat web dibuka)
function startMatrix() {
  const box = $('matrix'), c = $('rain'), g = c.getContext('2d'), num = $('mxNum');
  c.width = innerWidth; c.height = innerHeight;
  const chars = CONFIG.rainText.replace(/\s/g, '').toUpperCase().split('');
  // Hujan tulisan "HAPPY ANNIVERSARY" jatuh ke bawah (seperti awal)
  const size = 16, cols = Math.ceil(c.width / size);
  const drops = Array.from({ length: cols }, () => Math.random() * -50);
  const rainTimer = setInterval(() => {
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 0, c.width, c.height);
    g.font = `bold ${size}px monospace`;
    drops.forEach((y, i) => {
      g.fillStyle = Math.random() < .08 ? '#ffd6e8' : '#ff4d8d';
      g.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
      drops[i] = y * size > c.height && Math.random() > .975 ? 0 : y + 1;
    });
  }, 50);
  const rain = { stop: () => clearInterval(rainTimer) };

  let n = 3;
  (function tick() {
    if (n === 0) return showWords();
    show(n, '');
    n--; setTimeout(tick, 1600);
  })();

  function show(text, cls) {
    num.className = 'mx-num ' + cls;
    num.textContent = text;
    void num.offsetWidth; num.classList.add('pop');
  }
  // Setelah 1: HAPPY → ANNIVERSARY → nama → ♥ zoom in → amplop naik dari bawah
  function showWords() {
    let i = 0;
    (function next() {
      if (i >= CONFIG.words.length) return showHeart();
      show(CONFIG.words[i++], 'word');
      setTimeout(next, 2500);
    })();
  }

  function showHeart() {
    const heart = $('mxHeart');
    setTimeout(() => {
      heart.classList.add('on');
      burst(innerWidth / 2, innerHeight / 2, 40);
      // ♥ berdenyut sebentar, lalu zoom in halus sampai menutupi layar
      setTimeout(() => {
        heart.classList.add('zoom');
        // amplop mulai naik sedikit sebelum zoom selesai agar transisi tidak terputus
        setTimeout(() => {
          $('intro').classList.remove('hidden');
          requestAnimationFrame(() => requestAnimationFrame(() => $('intro').classList.add('show')));
          box.classList.add('out');
          setTimeout(() => rain.stop(), 1200);
        }, 1700);
      }, 1400);
    }, 0);
  }
}

// Musik
const bgm = $('bgm'), musicBtn = $('musicBtn');
musicBtn.onclick = () => {
  if (bgm.paused) bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => { });
  else { bgm.pause(); musicBtn.classList.remove('playing'); }
};

// Buka kejutan
const envelope = $('envelope');
function openEnvelope() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  const r = envelope.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 40);
  bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => { });
  $('tapHint').classList.add('hidden');
  setTimeout(flyPhotos, 900);
}

// Foto-foto keluar dari amplop dan tersebar di layar
// Perbesar foto (klik/Esc untuk menutup)
function openLightbox(src, caption) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<figure><img src="${src}" alt="${caption}"><figcaption>${caption}</figcaption></figure>`;
  const close = () => { lb.classList.remove('show'); setTimeout(() => lb.remove(), 250); document.removeEventListener('keydown', onKey); };
  const onKey = e => e.key === 'Escape' && close();
  lb.onclick = close;
  document.addEventListener('keydown', onKey);
  document.body.appendChild(lb);
  requestAnimationFrame(() => lb.classList.add('show'));
}

function flyPhotos() {
  const fly = $('fly'), r = envelope.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const W = innerWidth, H = innerHeight, n = CONFIG.photos.length;
  const pw = W < 600 ? 84 : 130;                       // lebar polaroid
  const ph = pw * 1.2;                                 // tinggi polaroid
  // area terlarang: judul + amplop + surat yang naik + tombol "Lanjut"
  const hr = document.querySelector('.intro-box h2').getBoundingClientRect();
  const ex = { l: r.left - 24, r: r.right + 24, t: Math.min(hr.top, r.top - 130) - 10, b: r.bottom + 110 };
  const hitEx = (x, y) => x + pw / 2 > ex.l && x - pw / 2 < ex.r && y + ph / 2 > ex.t && y - ph / 2 < ex.b;
  const overlap = (a, b) => {                          // porsi tumpang tindih dua foto (0..1)
    const w = Math.min(a.x, b.x) + pw - Math.max(a.x, b.x), h = Math.min(a.y, b.y) + ph - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? (w * h) / (pw * ph) : 0;
  };
  const spots = [];
  for (let i = 0; i < n; i++) {
    let best = null, bestOv = 9;
    for (let t = 0; t < 250; t++) {
      const x = pw / 2 + 6 + Math.random() * (W - pw - 12), y = ph / 2 + 6 + Math.random() * (H - ph - 12);
      if (hitEx(x, y)) continue;
      const ov = Math.max(0, ...spots.map(s => overlap({ x: x - pw / 2, y: y - ph / 2 }, { x: s.x - pw / 2, y: s.y - ph / 2 })));
      if (ov < bestOv) { best = { x, y }; bestOv = ov; }
      if (ov < .1) break;
    }
    // jika tidak ada ruang kosong, taruh di tepi atas/bawah layar
    spots.push(best || { x: pw / 2 + Math.random() * (W - pw), y: i % 2 ? H - ph / 2 : ph / 2 });
  }
  CONFIG.photos.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'fp';
    el.style.width = pw + 'px';
    el.innerHTML = `<div class="fp-img"><span>${p.emoji}</span><img src="${p.src}" alt="${p.caption}" onerror="this.remove()"></div>`;
    el.style.left = cx - pw / 2 + 'px';
    el.style.top = cy - pw / 2 + 'px';
    el.style.transform = 'scale(.2)';
    fly.appendChild(el);
    el.onclick = () => { if (el.querySelector('img')) openLightbox(p.src, p.caption); };
    // mendarat di area kosong, tidak menutupi amplop/surat
    const dx = spots[i].x - cx, dy = spots[i].y - cy;
    const rot = (Math.random() - .5) * 28;
    setTimeout(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1)`;
      el.style.opacity = 1;
    }, 150 + i * 160);
  });
  setTimeout(() => $('continueBtn').classList.remove('hidden'), 150 + n * 160 + 900);
}

// Klik "Lanjut" → kertas ucapan keluar dari amplop
$('continueBtn').onclick = () => {
  $('continueBtn').classList.add('hidden');
  $('fly').classList.add('dim');
  document.querySelector('.intro-box').classList.add('fade');
  const paper = $('paper'), card = $('paperText');
  const seg = s => window.Intl && Intl.Segmenter ? [...new Intl.Segmenter().segment(s)].map(x => x.segment) : [...s];
  const penSvg = '<svg viewBox="0 0 32 32"><path d="M2 30 6 20 24 2 30 8 12 26Z" fill="#e0245e"/><path d="M2 30 6 20 12 26Z" fill="#4a1a35"/><path d="M22 4 28 10" stroke="#fff" stroke-opacity=".5" stroke-width="2"/></svg>';
  // tiap huruf dibungkus <span> agar bisa "ditulis" satu per satu; tata letak sudah terkunci sejak awal
  card.innerHTML = `<div class="pen" id="pen">${penSvg}</div>` + CONFIG.paper.map((t, i) =>
    `<p class="${i === CONFIG.paper.length - 1 ? 'last' : ''}">` +
    t.split(' ').map(w => `<span class="w">${seg(w).map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ') +
    '</p>').join('');
  paper.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => paper.classList.add('show')));

  const pen = $('pen'), chars = [...card.querySelectorAll('.ch')];
  let k = 0, skipped = false;
  const movePen = c => {
    pen.style.left = c.offsetLeft + c.offsetWidth + 'px';
    pen.style.top = c.offsetTop + c.offsetHeight * .85 + 'px';
  };
  const finish = () => {
    pen.classList.add('off');
    burst(innerWidth / 2, innerHeight / 2, 50);
    setTimeout(() => $('paperBtn').classList.remove('hidden'), 700);
  };
  card.onclick = () => { skipped = true; };   // klik kertas = lewati animasi tulis
  function write() {
    if (skipped) { chars.forEach(c => c.classList.add('on', 'quick')); return finish(); }
    if (k >= chars.length) return finish();
    const c = chars[k++];
    c.classList.add('on');
    movePen(c);
    setTimeout(write, 55 + (/[.,!?]/.test(c.textContent) ? 260 : 0) + (k % 9 === 0 ? 40 : 0));
  }
  setTimeout(write, 1700);   // tunggu kertas selesai keluar dulu
};

// Setelah kertas ucapan → bar "seberapa sayang" yang bisa digeser
$('paperBtn').onclick = () => {
  $('paper').classList.add('leave');
  $('fly').classList.add('gone');
  setTimeout(() => {
    $('paper').classList.add('hidden');
    $('love').classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => $('love').classList.add('show')));
  }, 600);
};

(function initLove() {
  const range = $('loveRange'), heart = $('loveHeart'), val = $('loveVal'), msg = $('loveMsg');
  $('loveTitle').textContent = CONFIG.loveTitle;
  const stages = [
    [0, '💔', 'Geser ke kanan dong sayang...'],
    [1, '🥺', 'Cuma segitu? 🥺'],
    [21, '🤨', 'Hmm, masa cuma segitu?'],
    [41, '🙂', 'Lumayan deh~'],
    [61, '😊', 'Nahh gitu dong bebe, makin sayang!'],
    [81, '😍', 'Sikit lagi penuh nih bebee!'],
    [100, '💖', 'Penuh sih tapi si jali juga segini sih ini mah 😏'],
    [121, '💕', 'Lebih dari jali nihh!'],
    [151, '💞', 'Ayoo dong, penuhin terusss~'],
    [181, '🔥', 'sampe max dong bebee!'],
    [200, '💖', 'Naaahhh!!! gitu dongg Sayang banget Mwah Mwahhh!!! 💖']
  ];
  const MAX = +range.max;
  let moved = false, hit100 = false, full = false;
  function update() {
    const v = +range.value;
    range.style.setProperty('--v', v / MAX * 100 + '%');
    val.textContent = v + '%';
    const st = [...stages].reverse().find(s => v >= s[0]);
    heart.textContent = st[1]; msg.textContent = st[2];
    heart.style.transform = `scale(${.8 + v / MAX * 1.5})`;
    if (v === MAX && !moved) { moved = true; $('loveNext').classList.remove('hidden'); }   // tombol Lanjut baru muncul setelah mencapai 200%
    const r = range.getBoundingClientRect();
    if (v >= 100 && !hit100) { hit100 = true; burst(r.left + r.width / 2, r.top, 40); }
    else if (v < 100) hit100 = false;
    if (v === MAX && !full) {
      full = true; msg.classList.add('big');
      burst(r.left + r.width / 2, r.top, 90);
    } else if (v < MAX) { full = false; msg.classList.remove('big'); }
  }
  range.addEventListener('input', update);
  update();
})();

// Setelah bar sayang → pertanyaan "mau main ga?"
$('loveNext').onclick = () => {
  $('love').classList.remove('show');
  setTimeout(() => {
    $('love').classList.add('hidden');
    $('ask').classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => $('ask').classList.add('show')));
  }, 600);
};

(function initAsk() {
  const no = $('noBtn'), yes = $('yesBtn'), msg = $('askMsg');
  $('askTitle').textContent = CONFIG.askTitle;
  const noMsgs = [
    'Yakin gamau? 🥺', 'Ayolahh sayang...', 'Please deh 🥹',
    'Masa gamau sih?', 'Tombol gamau nya ngambek 😭', 'Yaudah, tinggal Gasss aja yaa 😤'
  ];
  let fsNo = 1.1, fsYes = 1.1, clicks = 0;      // ukuran font (rem)
  no.onclick = () => {
    clicks++;
    fsNo *= .72; fsYes = Math.min(fsYes * 1.18, 2.6);
    no.style.fontSize = fsNo + 'rem'; yes.style.fontSize = fsYes + 'rem';
    msg.textContent = noMsgs[Math.min(clicks - 1, noMsgs.length - 1)];
    if (fsNo < .45) {                            // sudah terlalu kecil → hilang
      no.classList.add('gone');
      setTimeout(() => no.remove(), 500);
    }
  };
  yes.onclick = e => {
    burst(e.clientX, e.clientY, 60);
    $('ask').classList.remove('show');
    setTimeout(() => {
      $('ask').classList.add('hidden');
      $('where').classList.remove('hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => $('where').classList.add('show')));
    }, 600);
  };
})();

// Pilihan tujuan main → lanjut ke isi web
(function initWhere() {
  const grid = $('whereGrid'), msg = $('whereMsg');
  $('whereTitle').textContent = CONFIG.whereTitle;
  grid.innerHTML = CONFIG.places.map((p, i) =>
    `<button class="place" data-i="${i}"><span>${p.emoji}</span><b>${p.name}</b></button>`).join('');
  let chosen = false;
  grid.querySelectorAll('.place').forEach(b => b.onclick = e => {
    if (chosen) return;
    chosen = true;
    const p = CONFIG.places[+b.dataset.i];
    b.classList.add('picked');
    grid.classList.add('done');
    msg.textContent = p.reply;
    CONFIG.chosen = p;
    burst(e.clientX, e.clientY, 60);
    setTimeout(startFinale, 2200);
  });
})();

// Penutup: langit malam + kembang api (ada yang berbentuk hati) + kata-kata, klik layar untuk kembang api
function startFinale() {
  const box = $('finale'), c = $('fw'), g = c.getContext('2d'), line = $('finLine');
  const W = c.width = innerWidth, H = c.height = innerHeight;
  box.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('show')));

  const pal = ['#ff4d8d', '#ff8fb3', '#ffd6e8', '#ffffff', '#ffcf5a', '#ff6aa2'];
  const stars = Array.from({ length: 130 }, () => ({ x: Math.random() * W, y: Math.random() * H * .85, r: Math.random() * 1.5 + .4, ph: Math.random() * 6.28 }));
  let rockets = [], parts = [], count = 0, run = true;

  function launch(x, ty) {
    rockets.push({
      x, y: H + 10, vy: -(8 + Math.random() * 3), ty: ty ?? H * (.15 + Math.random() * .35),
      col: pal[Math.floor(Math.random() * pal.length)], heart: count++ % 3 === 2
    });
  }
  function explode(r) {
    const n = r.heart ? 90 : 70;
    for (let i = 0; i < n; i++) {
      let vx, vy;
      if (r.heart) {                                   // ledakan berbentuk hati
        const t = i / n * Math.PI * 2, k = .2;
        vx = 16 * Math.pow(Math.sin(t), 3) * k;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k;
      } else {
        const a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 3.5;
        vx = Math.cos(a) * s; vy = Math.sin(a) * s;
      }
      parts.push({ x: r.x, y: r.y, vx, vy, life: 1, dec: .007 + Math.random() * .007, col: r.col });
    }
  }
  function frame(now) {
    if (!run) return;
    g.globalCompositeOperation = 'destination-out';   // jejak memudar ke transparan agar latar CSS tetap terlihat
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#fff';
    for (const s of stars) { g.globalAlpha = .35 + .65 * Math.abs(Math.sin(now / 800 + s.ph)); g.fillRect(s.x, s.y, s.r, s.r); }
    g.globalCompositeOperation = 'lighter';
    rockets = rockets.filter(r => {
      r.y += r.vy; r.vy *= .985;
      g.globalAlpha = 1; g.fillStyle = r.col; g.fillRect(r.x, r.y, 2.5, 9);
      if (r.y <= r.ty || r.vy > -1.2) { explode(r); return false; }
      return true;
    });
    parts = parts.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .985; p.vy *= .985; p.life -= p.dec;
      if (p.life <= 0) return false;
      g.globalAlpha = p.life; g.fillStyle = p.col;
      g.beginPath(); g.arc(p.x, p.y, 2.1, 0, 6.283); g.fill();
      return true;
    });
    g.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  [0, 350, 700].forEach(d => setTimeout(() => launch(W * (.2 + Math.random() * .6)), d));
  const auto = setInterval(() => launch(W * (.12 + Math.random() * .76)), 700);
  box.addEventListener('pointerdown', e => { if (!e.target.closest('button')) launch(e.clientX, e.clientY); });

  // Kata-kata muncul satu per satu, yang terakhir bertahan
  const ch = CONFIG.chosen;
  const lines = CONFIG.finale
    .filter(t => ch || !t.includes('{choice}'))
    .map(t => t.replace('{choice}', ch ? `${ch.emoji} ${ch.name}` : ''));
  let i = 0;
  (function next() {
    const last = i === lines.length - 1;
    line.className = 'fin-line';
    void line.offsetWidth;
    line.textContent = lines[i++];
    line.className = 'fin-line in' + (last ? ' last' : '');
    if (last) return;                 // kalimat terakhir bertahan, kembang api terus menyala
    setTimeout(() => { line.classList.add('out'); setTimeout(next, 800); }, 3000);
  })();
}

// PIN sebelum amplop terbuka
const pinBox = $('pin'), pinDots = [...document.querySelectorAll('.pin-dots i')];
let pinVal = '', pinBusy = false;
$('pinClue').textContent = 'clue : ' + CONFIG.pinClue;
pinDots.forEach((d, i) => d.style.display = i < CONFIG.pin.length ? '' : 'none');

function askPin() {
  if (envelope.classList.contains('open')) return;
  pinVal = ''; renderPin();
  pinBox.classList.remove('hidden');
  requestAnimationFrame(() => pinBox.classList.add('show'));
}
function renderPin() { pinDots.forEach((d, i) => d.classList.toggle('on', i < pinVal.length)); }
function pinKey(k) {
  if (pinBusy) return;
  if (k === 'del') pinVal = pinVal.slice(0, -1);
  else if (pinVal.length < CONFIG.pin.length) pinVal += k;
  renderPin();
  if (pinVal.length < CONFIG.pin.length) return;
  pinBusy = true;
  if (pinVal === CONFIG.pin) {
    $('pinTitle').textContent = 'Benar! 💖';
    setTimeout(() => {
      pinBox.classList.remove('show');
      setTimeout(() => { pinBox.classList.add('hidden'); pinBusy = false; openEnvelope(); }, 350);
    }, 500);
  } else {
    const card = pinBox.querySelector('.pin-card');
    card.classList.add('shake');
    $('pinTitle').textContent = 'PIN salah, coba lagi';
    setTimeout(() => {
      card.classList.remove('shake'); pinVal = ''; renderPin(); pinBusy = false;
      $('pinTitle').textContent = 'Masukkan PIN';
    }, 700);
  }
}
document.querySelectorAll('.pin-keys button').forEach(b => b.onclick = () => pinKey(b.dataset.k));
addEventListener('keydown', e => {
  if (pinBox.classList.contains('hidden')) return;
  if (/^\d$/.test(e.key)) pinKey(e.key);
  else if (e.key === 'Backspace') pinKey('del');
  else if (e.key === 'Escape' && !pinBusy) { pinBox.classList.remove('show'); setTimeout(() => pinBox.classList.add('hidden'), 350); }
});
pinBox.addEventListener('click', e => { if (e.target === pinBox && !pinBusy) { pinBox.classList.remove('show'); setTimeout(() => pinBox.classList.add('hidden'), 350); } });

envelope.onclick = askPin;
envelope.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && askPin();

// Hati melayang + ledakan hati
const cv = $('hearts'), ctx = cv.getContext('2d');
let hearts = [];
function resize() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', resize); resize();

function spawn(x, y, burstMode) {
  hearts.push({
    x, y,
    s: 8 + Math.random() * 18,
    vx: burstMode ? (Math.random() - .5) * 8 : (Math.random() - .5) * .6,
    vy: burstMode ? -Math.random() * 7 - 2 : -(.5 + Math.random() * 1.2),
    a: 1, g: burstMode ? .15 : 0,
    c: ['#ff4d8d', '#ff8fb3', '#ffc2d9', '#fff'][Math.floor(Math.random() * 4)]
  });
}
function burst(x, y, n) { for (let i = 0; i < n; i++) spawn(x, y, true); }

function drawHeart(h) {
  ctx.save(); ctx.globalAlpha = Math.max(h.a, 0); ctx.fillStyle = h.c;
  ctx.translate(h.x, h.y); ctx.scale(h.s / 20, h.s / 20);
  ctx.beginPath(); ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-14, -6, -6, -16, 0, -8);
  ctx.bezierCurveTo(6, -16, 14, -6, 0, 6);
  ctx.fill(); ctx.restore();
}
(function loop() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (Math.random() < .08) spawn(Math.random() * cv.width, cv.height + 20, false);
  hearts = hearts.filter(h => h.a > 0 && h.y > -40);
  hearts.forEach(h => {
    h.x += h.vx; h.y += h.vy; h.vy += h.g;
    h.a -= h.g ? .008 : .0015;
    drawHeart(h);
  });
  requestAnimationFrame(loop);
})();

// Layar awal: hitung mundur menuju tanggal anniversary. Saat waktunya tiba, muncul "Ketuk untuk mulai"
// (satu ketukan dibutuhkan karena browser tidak mengizinkan lagu diputar otomatis tanpa klik),
// lalu lagu diputar dan hitungan 3-2-1 dimulai. Tambahkan ?preview di URL untuk melewati hitung mundur saat testing.
(function initSplash() {
  const splash = $('splash'), target = new Date(CONFIG.targetDate);
  $('spDate').textContent = target.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  let unlocked = false, started = false, timer;

  function unlock() {
    if (unlocked) return;
    unlocked = true; clearInterval(timer);
    $('spIcon').textContent = '💖';
    $('spTitle').textContent = 'Waktunya tiba! 🎉';
    $('spSub').classList.add('hidden');
    $('spCount').classList.add('hidden');
    splash.classList.add('ready');
    setTimeout(() => go(), 3000);                     // tahan 3 detik, lalu langsung mulai (tanpa ketukan)
  }
  function update() {
    const diff = target - new Date();
    if (diff <= 0 || location.search.includes('preview')) return unlock();
    $('sDays').textContent = Math.floor(diff / 864e5);
    $('sHours').textContent = Math.floor(diff % 864e5 / 36e5);
    $('sMins').textContent = Math.floor(diff % 36e5 / 6e4);
    $('sSecs').textContent = Math.floor(diff % 6e4 / 1e3);
  }
  update(); timer = setInterval(update, 1000);

  const go = () => {
    if (!unlocked || started) return;
    started = true;
    bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => { });
    splash.classList.add('out');
    setTimeout(() => splash.remove(), 900);
    startMatrix();
  };
  splash.onclick = go;                          // boleh ketuk untuk mempercepat setelah waktunya tiba
  splash.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && go();
  splash.focus();

  // Browser memblokir lagu otomatis tanpa interaksi. Kalau lagu gagal diputar saat mulai,
  // lagu dinyalakan pada sentuhan/klik pertama (mis. saat menekan PIN atau membuka amplop).
  const kick = e => {
    if (e.target.closest && e.target.closest('#musicBtn')) return;
    removeEventListener('pointerdown', kick); removeEventListener('keydown', kick);
    if (bgm.paused) bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => { });
  };
  addEventListener('pointerdown', kick); addEventListener('keydown', kick);
})();
