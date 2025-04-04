/**
 * AI 공무원 보고서 작성 도우미 - 공통 자바스크립트
 */

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    initializeProfileDropdown();
    setupMobileNav();
    setupScrollAnimations();
});

/**
 * 드롭다운 초기화
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggleBtn || !menu) return;
        
        // 클릭으로 드롭다운 토글
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = menu.classList.contains('show');
            
            // 모든 드롭다운 닫기
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
            
            // 현재 드롭다운 토글
            if (!isOpen) {
                menu.classList.add('show');
            }
        });
        
        // 드롭다운 메뉴 항목 클릭 시 메뉴 닫기
        const menuItems = menu.querySelectorAll('.dropdown-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menu.classList.remove('show');
            });
        });
    });
    
    // 문서 클릭 시 모든 드롭다운 닫기
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

/**
 * 프로필 드롭다운 초기화
 */
function initializeProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdownContent = this.querySelector('.dropdown-content');
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
        
        // 문서 클릭 시 프로필 드롭다운 닫기
        document.addEventListener('click', function() {
            const dropdownContent = profileDropdown.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        });
        
        // 드롭다운 내용 클릭 시 이벤트 전파 방지
        const dropdownContent = profileDropdown.querySelector('.dropdown-content');
        if (dropdownContent) {
            dropdownContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
}

/**
 * 모바일 내비게이션 설정
 */
function setupMobileNav() {
    const mobileBreakpoint = 768;
    
    // 화면 크기가 모바일 사이즈일 때 내비게이션 조정
    function adjustNav() {
        const nav = document.querySelector('.main-nav');
        
        if (window.innerWidth <= mobileBreakpoint) {
            if (nav) {
                // 모바일 메뉴 아이콘 추가 (없는 경우에만)
                if (!document.querySelector('.mobile-menu-toggle')) {
                    const mobileMenuToggle = document.createElement('button');
                    mobileMenuToggle.className = 'mobile-menu-toggle';
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    
                    const header = document.querySelector('.header-container');
                    if (header) {
                        header.insertBefore(mobileMenuToggle, nav);
                    }
                    
                    // 모바일 메뉴 토글 클릭 이벤트
                    mobileMenuToggle.addEventListener('click', function() {
                        nav.classList.toggle('active');
                        this.classList.toggle('active');
                    });
                }
            }
        } else {
            // 데스크탑 화면에서는 모바일 메뉴 아이콘 제거
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileMenuToggle) {
                mobileMenuToggle.remove();
            }
            
            // 내비게이션 항상 표시
            if (nav) {
                nav.classList.remove('active');
            }
        }
    }
    
    // 초기 로드 시 실행
    adjustNav();
    
    // 화면 크기 변경 시 실행
    window.addEventListener('resize', adjustNav);
}

/**
 * 스크롤 애니메이션 설정
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    function checkInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + elementHeight;
            
            // 엘리먼트가 화면에 보이는지 확인
            if (elementBottom > windowTop && elementTop < windowBottom) {
                element.classList.add('animated');
            }
        });
    }
    
    // 초기 로드 시 실행
    checkInView();
    
    // 스크롤 시 실행
    window.addEventListener('scroll', checkInView);
}

/**
 * 토스트 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 유형 (success, error, info, warning)
 * @param {number} duration - 표시 지속 시간 (밀리초)
 */
function showToast(message, type = 'info', duration = 3000) {
    // 기존 토스트 컨테이너 확인
    let toastContainer = document.querySelector('.toast-container');
    
    // 컨테이너가 없으면 생성
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // 토스트 엘리먼트 생성
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // 아이콘 설정
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'times-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    // 토스트 내용 설정
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // 컨테이너에 토스트 추가
    toastContainer.appendChild(toast);
    
    // 닫기 버튼 이벤트
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // 일정 시간 후 토스트 자동 제거
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
    
    // 토스트 표시 애니메이션
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 10);
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} 오늘 날짜
 */
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * 로컬 스토리지에 데이터 저장
 * @param {string} key - 저장할 키
 * @param {any} value - 저장할 값
 */
function saveToLocalStorage(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
    } catch (error) {
        console.error('로컬 스토리지 저장 오류:', error);
        return false;
    }
}

/**
 * 로컬 스토리지에서 데이터 로드
 * @param {string} key - 로드할 키
 * @returns {any} 로드된 데이터 또는 null
 */
function loadFromLocalStorage(key) {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) return null;
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('로컬 스토리지 로드 오류:', error);
        return null;
    }
}

/**
 * 로컬 스토리지에서 데이터 삭제
 * @param {string} key - 삭제할 키
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('로컬 스토리지 삭제 오류:', error);
        return false;
    }
}

/**
 * URL 쿼리 파라미터 가져오기
 * @param {string} paramName - 가져올 파라미터 이름
 * @returns {string|null} 파라미터 값 또는 null
 */
function getQueryParam(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

/**
 * 폼 유효성 검사
 * @param {HTMLFormElement} form - 검사할 폼 엘리먼트
 * @returns {boolean} 유효성 검사 통과 여부
 */
function validateForm(form) {
    let isValid = true;
    
    // 필수 입력 필드 검사
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightInvalidField(field);
        } else {
            removeInvalidHighlight(field);
        }
    });
    
    // 이메일 형식 검사
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value.trim() && !isValidEmail(field.value)) {
            isValid = false;
            highlightInvalidField(field);
        }
    });
    
    return isValid;
}

/**
 * 유효하지 않은 필드 강조 표시
 * @param {HTMLElement} field - 강조 표시할 필드
 */
function highlightInvalidField(field) {
    field.classList.add('invalid');
    
    // 오류 메시지가 없으면 추가
    const errorMsgId = `error-${field.id || Math.random().toString(36).substr(2, 9)}`;
    if (!document.getElementById(errorMsgId)) {
        const errorMsg = document.createElement('div');
        errorMsg.id = errorMsgId;
        errorMsg.className = 'error-message';
        errorMsg.textContent = field.dataset.errorMsg || '이 필드는 필수입니다.';
        
        field.parentNode.appendChild(errorMsg);
    }
    
    // 필드 이벤트 리스너 (입력 시 오류 표시 제거)
    field.addEventListener('input', function() {
        removeInvalidHighlight(field);
    });
}

/**
 * 유효하지 않은 필드 강조 표시 제거
 * @param {HTMLElement} field - 강조 표시를 제거할 필드
 */
function removeInvalidHighlight(field) {
    field.classList.remove('invalid');
    
    // 오류 메시지 제거
    const errorMsgId = `error-${field.id || ''}`;
    const errorMsg = document.getElementById(errorMsgId);
    if (errorMsg) {
        errorMsg.remove();
    }
}

/**
 * 이메일 형식 유효성 검사
 * @param {string} email - 검사할 이메일
 * @returns {boolean} 유효성 검사 통과 여부
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 모달 창 열기
 * @param {string} modalId - 모달 엘리먼트 ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
}

/**
 * 모달 창 닫기
 * @param {string} modalId - 모달 엘리먼트 ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

/**
 * 요소가 뷰포트에 있는지 확인
 * @param {HTMLElement} element - 확인할 엘리먼트
 * @returns {boolean} 뷰포트 내에 있는지 여부
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}