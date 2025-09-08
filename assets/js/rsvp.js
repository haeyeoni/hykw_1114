// RSVP 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvpForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = form.querySelector('.submit-btn');

    // Modal refs
    const modal = document.getElementById('rsvpModal');
    function openModal(){ if(modal){ modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); } }
    function closeModal(){ if(modal){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); } }

    // 전화번호 포맷팅
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 11) {
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})/, '$1-');
        }
        e.target.value = value;
    });

    // 폼 제출 처리 (fetch → 제거, UI만 제어)
    form.addEventListener('submit', function() {
        submitBtn.disabled = true;
        submitBtn.textContent = '처리중...';

        // 폼 action으로 전송은 브라우저가 자동 처리
        // 우리는 UX만 제어
        setTimeout(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
            openModal();
        }, 600);
    });
    
    // 모달 닫기 바인딩
    document.addEventListener('click', function(e){
        if (!modal) return;
        if (e.target && e.target.hasAttribute('data-close-modal')) {
            closeModal();
        }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape') closeModal();
    });
    
    // 폼 유효성 검사
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = getCssVar('--line');
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = getCssVar('--line');
            }
        });
    });
    
    // 라디오 버튼 스타일링
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const groupName = this.name;
            const groupRadios = form.querySelectorAll(`input[name="${groupName}"]`);
            groupRadios.forEach(r => {
                r.parentElement.classList.remove('selected');
            });
            if (this.checked) {
                this.parentElement.classList.add('selected');
            }
        });
    });
});

// CSS 변수 접근 헬퍼
function getCssVar(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
}
