// ===== Settings =====
const INVITE_EVENT_ISO = '2025-11-14';             // D-day 날짜 (날짜 선택 기본값)
const INVITE_EVENT_TIME = { h: 18, m: 0, s: 0 };   // 카운트다운 시간 (18:00)
const VENUE = { lat: 37.493402, lng: 127.032182 }; // 강남 구스아일랜드 좌표

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
  }
});

// ===== Swiper =====
new Swiper('.swiper', {
  loop: true,
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
});

// ===== Kakao Map =====
document.addEventListener('DOMContentLoaded', function(){
  // 지도 초기화 함수
  function initMap() {
    if (typeof kakao === 'undefined' || !document.getElementById('map')) {
      console.log('Kakao Maps API not loaded or map element not found');
      return;
    }
    
    try {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakao.maps.LatLng(VENUE.lat, VENUE.lng),
        level: 3
      };
      
      const map = new kakao.maps.Map(mapContainer, mapOption);
      const marker = new kakao.maps.Marker({ 
        position: new kakao.maps.LatLng(VENUE.lat, VENUE.lng) 
      });
      marker.setMap(map);
      
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }
  
  // 카카오맵 API 로드 확인 후 초기화
  if (typeof kakao !== 'undefined') {
    initMap();
  } else {
    // API가 아직 로드되지 않은 경우 잠시 후 재시도
    setTimeout(() => {
      if (typeof kakao !== 'undefined') {
        initMap();
      } else {
        console.error('Kakao Maps API failed to load');
      }
    }, 1000);
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