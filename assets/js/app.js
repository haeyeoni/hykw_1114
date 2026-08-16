// ===== Settings =====
const INVITE_EVENT_ISO = '2026-11-14';             // D-day 날짜 (날짜 선택 기본값)
const INVITE_EVENT_TIME = { h: 19, m: 0, s: 0 };   // 카운트다운 시간 (18:00)
const VENUE = { lat: 37.493310, lng: 127.032314 }; // 강남 구스아일랜드 좌표

// ===== Countdown =====
const dd = document.getElementById('dd');
const hh = document.getElementById('hh');
const mm = document.getElementById('mm');
const ss = document.getElementById('ss');

let targetDate = new Date(INVITE_EVENT_ISO);
function setTargetDate(d){
  targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), INVITE_EVENT_TIME.h, INVITE_EVENT_TIME.m, INVITE_EVENT_TIME.s);
}
setTargetDate(targetDate);

function tick(){
  const now = Date.now();
  const t = targetDate.getTime();
  let diff = Math.max(0, t - now);
  const d = Math.floor(diff/(1000*60*60*24)); diff -= d*24*60*60*1000;
  const h = Math.floor(diff/(1000*60*60)); diff -= h*60*60*1000;
  const m = Math.floor(diff/(1000*60)); diff -= m*60*1000;
  const s = Math.floor(diff/1000);
  dd.textContent = String(d).padStart(2,'0');
  hh.textContent = String(h).padStart(2,'0');
  mm.textContent = String(m).padStart(2,'0');
  ss.textContent = String(s).padStart(2,'0');
}
tick();
setInterval(tick, 1000);

// ===== Calendar (Flatpickr) =====
flatpickr('#calendar', {
  inline: true,
  defaultDate: INVITE_EVENT_ISO,
  clickOpens: false,
  disableMobile: true,
  showMonths: 1,
  locale: 'ko',
  onReady: function(selectedDates, dateStr, instance) {
    // 모든 날짜 셀에 pointer-events 제거
    instance.calendarContainer.querySelectorAll('.flatpickr-day').forEach(el => {
      el.style.pointerEvents = 'none';
    });
  },
  onChange: function(selectedDates){
    if(selectedDates && selectedDates[0]){
      setTargetDate(selectedDates[0]);
      tick();
    }
  },
  minDate: '2026-11-01',
  maxDate: '2026-11-30'
});

// ===== Swiper =====
new Swiper('.swiper', {
  loop: true,
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
});

// 1) SDK를 동적으로 로드(이미 있는 경우 재사용)
function loadKakaoSdk() {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps && kakao.maps.load) {
      // SDK 스크립트가 로드된 상태 -> maps.load로 초기화
      return kakao.maps.load(resolve);
    }
    const s = document.createElement('script');
    s.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=0e1e71838c627fc0407cd4ac1ed31bf3&autoload=false';
    s.onload = () => kakao.maps.load(resolve);
    s.onerror = () => reject(new Error('Kakao SDK failed to load'));
    document.head.appendChild(s);
  });
}

function initMap() {
  const el = document.getElementById('map');
  if (!el) {
    console.error('#map element not found');
    return;
  }
  // 숫자 보장(문자열이면 Number(...)로 변환)
  const center = new kakao.maps.LatLng(Number(VENUE.lat), Number(VENUE.lng));
  const map = new kakao.maps.Map(el, { center, level: 3 });
  new kakao.maps.Marker({ position: center, map });
  console.log('Map initialized');
}

// DOM 준비 후 SDK 확실히 초기화 -> 지도 생성
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadKakaoSdk();
    initMap();
  } catch (e) {
    console.error('Kakao Maps API failed to load:', e);
  }
});

const audio = document.getElementById('bgm');
const btn   = document.getElementById('bgmBtn');

const saved = localStorage.getItem('bgm_on') === 'true';

function setUI(){
  btn.classList.toggle('playing', !audio.paused);
  btn.textContent = audio.paused ? '🎵' : '🔇';
}

async function toggleBgm(){
  if(audio.paused){
    try{
      await audio.play();
      localStorage.setItem('bgm_on','true');
    }catch(e){ console.log('Play blocked:', e); }
  }else{
    audio.pause();
    localStorage.setItem('bgm_on','false');
  }
  setUI();
}

btn.addEventListener('click', toggleBgm);

// 사용자 첫 터치/스크롤 시 자동 재생 복원
const oneShotEnable = async () => {
  if(saved){
    try{ await audio.play(); }catch(e){}
    setUI();
  }
  window.removeEventListener('pointerdown', oneShotEnable);
  window.removeEventListener('touchstart', oneShotEnable);
  window.removeEventListener('scroll', oneShotEnable);
};
window.addEventListener('pointerdown', oneShotEnable, {once:true});
window.addEventListener('touchstart', oneShotEnable, {once:true, passive:true});
window.addEventListener('scroll', oneShotEnable, {once:true, passive:true});

setUI();

// 재생 시 페이드인
function fadeTo(vol=1, ms=600){
  const start = audio.volume, steps=20;
  let i=0; const t=setInterval(()=>{
    i++; audio.volume=start+(vol-start)*(i/steps);
    if(i>=steps) clearInterval(t);
  }, ms/steps);
}
audio.addEventListener('play', ()=>{ audio.volume=0; fadeTo(1,700); });


    
AOS.init({
    duration: 1000,
    once: false
});
(function () {
    const toastEl = document.getElementById('gift-toast');
    let toastTimer;
    function showToast(msg) {
        clearTimeout(toastTimer);
        toastEl.textContent = msg;
        toastEl.classList.add('is-show');
        if (navigator.vibrate) navigator.vibrate(10);
        toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 1800);
    }

    async function copyText(text) {
        try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch (e) { }
        try {
            const ta = document.createElement('textarea');
            ta.value = text; ta.readOnly = true; ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
            const ok = document.execCommand('copy'); ta.remove(); if (ok) return true;
        } catch (e) { }
        try {
            const div = document.createElement('div');
            div.contentEditable = 'true'; div.style.position = 'fixed'; div.style.top = '-1000px'; div.textContent = text;
            document.body.appendChild(div); const sel = window.getSelection(); const range = document.createRange();
            range.selectNodeContents(div); sel.removeAllRanges(); sel.addRange(range);
            const ok = document.execCommand('copy'); sel.removeAllRanges(); div.remove(); if (ok) return true;
        } catch (e) { }
        return false;
    }

    function onClick(e) {
        const btn = e.target.closest('.btn-copy');
        if (!btn) return;
        e.preventDefault(); e.stopPropagation();
        const text = btn.dataset.copy || '';
        if (!text) return;
        copyText(text).then(ok => showToast(ok ? '계좌번호가 복사되었어요' : '복사가 막혀 있어요. 길게 눌러 복사해 주세요'));
    }

    document.addEventListener('click', onClick, { passive: false });
    document.addEventListener('touchend', onClick, { passive: false });
})();
(function () {
    const LEAD_OFFSET_PX = 20; // 이미지가 배지보다 살짝 먼저 시작하도록 하는 오프셋
    function adjustTimelineAlignment() {
        const items = document.querySelectorAll('.timeline__item');
        items.forEach((item) => {
            const badge = item.querySelector('.timeline__text .badge');
            const media = item.querySelector('.timeline__media');
            if (!badge || !media) return;
            // reset before measuring
            media.style.marginTop = '0px';
            const itemTop = item.getBoundingClientRect().top;
            const badgeTop = badge.getBoundingClientRect().top;
            const mediaTop = media.getBoundingClientRect().top;
            const delta = Math.round(badgeTop - itemTop - (mediaTop - itemTop));
            // 이미지가 배지보다 LEAD_OFFSET_PX 만큼 위에서 시작되도록 보정
            const adjusted = delta - LEAD_OFFSET_PX;
            if (adjusted !== 0) {
                media.style.marginTop = `${adjusted}px`;
            }
        });
    }
    window.addEventListener('load', adjustTimelineAlignment);
    window.addEventListener('resize', () => { requestAnimationFrame(adjustTimelineAlignment); });
    document.addEventListener('DOMContentLoaded', adjustTimelineAlignment);
})();