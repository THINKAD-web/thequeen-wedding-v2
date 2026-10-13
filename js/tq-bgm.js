(function () {
  var TRACKS = [
    { src: '/Sunlight.mp3', title: 'Sunlight' },
    { src: '/April%20in%20Your%20Eyes.mp3', title: 'April in Your Eyes' }
  ];
  var UNLOCK_EVENTS = ['pointerdown', 'touchstart', 'touchend', 'click', 'scroll', 'wheel', 'keydown'];
  var TARGET_VOLUME = 0.55;
  var unlocked = false;
  var started = false;
  var idx = 0;
  var audio = document.getElementById('tqBgm');
  var btn = document.getElementById('tqMusicBtn');
  var title = document.getElementById('tqMusicTitle');
  var hint = document.getElementById('tqMusicHint');
  if (!audio || !btn) return;

  audio.loop = false;
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');

  function loadTrack(i) {
    idx = (i % TRACKS.length + TRACKS.length) % TRACKS.length;
    var next = TRACKS[idx].src;
    var file = next.split('/').pop();
    var cur = audio.currentSrc || audio.src || '';
    if (!cur || (cur.indexOf(file) === -1 && cur.indexOf(decodeURIComponent(file)) === -1)) {
      audio.src = next;
      audio.load();
    }
    if (title) title.textContent = TRACKS[idx].title;
  }

  function fadeTo(target, duration, done) {
    var start = audio.volume;
    var t0 = performance.now();
    function step(t) {
      var p = Math.min(1, (t - t0) / duration);
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * p));
      if (p < 1) requestAnimationFrame(step);
      else if (done) done();
    }
    requestAnimationFrame(step);
  }

  function markPlaying() {
    btn.classList.add('playing');
    btn.classList.remove('waiting');
    btn.setAttribute('aria-label', '배경 음악 일시정지');
  }

  function markPaused() {
    btn.classList.remove('playing', 'waiting');
    btn.setAttribute('aria-label', '배경 음악 재생');
  }

  function markWaiting() {
    btn.classList.add('waiting');
  }

  function hideHint() {
    if (hint) hint.classList.add('hidden');
  }

  function showHint() {
    if (hint) hint.classList.remove('hidden');
  }

  function removeUnlockListeners() {
    UNLOCK_EVENTS.forEach(function (ev) {
      document.removeEventListener(ev, unlockAudio, true);
    });
  }

  function beginAudible() {
    unlocked = true;
    started = true;
    removeUnlockListeners();
    hideHint();
    audio.muted = false;
    markPlaying();
    if (audio.volume < 0.05) fadeTo(TARGET_VOLUME, 1600);
  }

  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    removeUnlockListeners();
    hideHint();
    audio.muted = false;
    markPlaying();
    if (audio.paused) {
      audio.volume = 0;
      audio.play().then(function () {
        fadeTo(TARGET_VOLUME, 1200);
      }).catch(function () {});
    } else if (audio.volume < 0.05) {
      fadeTo(TARGET_VOLUME, 800);
    }
  }

  function bindUnlockListeners() {
    UNLOCK_EVENTS.forEach(function (ev) {
      document.addEventListener(ev, unlockAudio, { capture: true, passive: true });
    });
  }

  function startPlayback() {
    loadTrack(0);
    audio.muted = false;
    audio.volume = 0;
    return audio.play();
  }

  window.tqToggleMusic = function () {
    unlocked = true;
    removeUnlockListeners();
    hideHint();
    if (audio.paused) {
      audio.muted = false;
      if (!audio.src) loadTrack(0);
      audio.volume = 0;
      audio.play().then(function () {
        markPlaying();
        fadeTo(TARGET_VOLUME, 1200);
      }).catch(function () {});
    } else {
      fadeTo(0, 600, function () {
        audio.pause();
        markPaused();
      });
    }
  };

  audio.addEventListener('ended', function () {
    loadTrack(idx + 1);
    audio.volume = 0;
    audio.muted = false;
    audio.play().then(function () { fadeTo(TARGET_VOLUME, 1600); }).catch(function () {});
  });

  function tryMutedAutoplay() {
    audio.muted = true;
    audio.volume = 0;
    return audio.play().then(function () {
      started = true;
      markPlaying();
      markWaiting();
      showHint();
      bindUnlockListeners();
    });
  }

  function tryAutoplay() {
    if (started) return;
    loadTrack(0);

    // 1) volume 0 + unmuted — 일부 브라우저에서 소리 없이 autoplay 허용
    audio.muted = false;
    audio.volume = 0;
    audio.play().then(function () {
      beginAudible();
    }).catch(function () {
      // 2) muted autoplay — 대부분 허용, 첫 터치/스크롤에 unmute
      tryMutedAutoplay().catch(function () {
        markWaiting();
        showHint();
        bindUnlockListeners();
      });
    });
  }

  function initWhenReady() {
    if (audio.readyState >= 2) {
      tryAutoplay();
      return;
    }
    audio.addEventListener('canplaythrough', tryAutoplay, { once: true });
    audio.addEventListener('canplay', function fallback() {
      if (!started) tryAutoplay();
    }, { once: true });
    loadTrack(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted && audio.paused) tryAutoplay();
  });
})();
