// ===== Settings =====
const INVITE_EVENT_ISO = '2025-11-14';             // D-day 날짜 (날짜 선택 기본값)
const INVITE_EVENT_TIME = { h: 18, m: 0, s: 0 };   // 카운트다운 시간 (18:00)
const VENUE = { lat: 37.504799, lng: 127.025493 }; // 강남 구스아일랜드 좌표

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
  if (typeof kakao === 'undefined' || !document.getElementById('map')) return;
  const map = new kakao.maps.Map(document.getElementById('map'), {
    center: new kakao.maps.LatLng(VENUE.lat, VENUE.lng),
    level: 3
  });
  const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(VENUE.lat, VENUE.lng) });
  marker.setMap(map);
});
