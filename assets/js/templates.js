/**
 * AI 공무원 보고서 작성 도우미 - 템플릿 관련 자바스크립트
 */

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplateSelection();
    setupTemplateFilters();
    setupTemplatePreviewModal();
    displayReportSummary();
});

/**
 * 템플릿 선택 초기화
 */
function initializeTemplateSelection() {
    const templateCards = document.querySelectorAll('.template-card');
    
    if (templateCards.length === 0) return;
    
    // 보고서 정보 로드
    const reportInfo = loadReportInfo();
    
    // 템플릿 카드 클릭 이벤트
    templateCards.forEach(card => {
        // 라디오 버튼
        const radio = card.querySelector('input[type="radio"]');
        
        // 이미 선택된 템플릿 확인
        if (reportInfo && reportInfo.template) {
            if (card.dataset.templateId === reportInfo.template.id) {
                card.classList.add('selected');
                if (radio) radio.checked = true;
            }
        }
        
        // 카드 클릭 이벤트
        card.addEventListener('click', function(e) {
            // 라디오 버튼 클릭 이벤트 중복 방지
            if (e.target === radio) return;
            
            // 모든 카드에서 선택 상태 제거
            templateCards.forEach(c => {
                c.classList.remove('selected');
                const r = c.querySelector('input[type="radio"]');
                if (r) r.checked = false;
            });
            
            // 현재 카드 선택 상태로 변경
            this.classList.add('selected');
            if (radio) radio.checked = true;
            
            // 선택한 템플릿 정보 저장
            saveSelectedTemplate(this);
        });
    });
}

/**
 * 선택한 템플릿 정보 저장
 * @param {HTMLElement} templateCard - 선택한 템플릿 카드
 */
function saveSelectedTemplate(templateCard) {
    // 템플릿 ID
    const templateId = templateCard.dataset.templateId || `template_${Date.now()}`;
    
    // 템플릿 정보 추출
    const templateTitle = templateCard.querySelector('h3').textContent;
    const templateDesc = templateCard.querySelector('p').textContent;
    const templateImg = templateCard.querySelector('img').src;
    
    // 템플릿 데이터
    const templateData = {
        id: templateId,
        title: templateTitle,
        description: templateDesc,
        image: templateImg
    };
    
    // 현재 보고서 정보 로드
    const reportInfo = loadReportInfo();
    
    if (reportInfo) {
        // 템플릿 정보 업데이트
        reportInfo.template = templateData;
        
        // 로컬 스토리지에 저장
        saveToLocalStorage('currentReport', reportInfo);
        
        showToast(`${templateTitle} 템플릿이 선택되었습니다.`, 'success');
    }
}

/**
 * 템플릿 필터 설정
 */
function setupTemplateFilters() {
    const categoryFilter = document.getElementById('templateCategory');
    const sortFilter = document.getElementById('templateSort');
    const searchBox = document.querySelector('.search-box input');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTemplates);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterTemplates);
    }
    
    if (searchBox) {
        // 검색어 입력 시 필터링 (300ms 디바운스)
        let debounceTimer;
        searchBox.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterTemplates, 300);
        });
        
        // 검색 버튼 클릭 시 필터링
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                filterTemplates();
            });
        }
    }
}

/**
 * 템플릿 필터링
 */
function filterTemplates() {
    const categoryFilter = document.getElementById('templateCategory');
    const sortFilter = document.getElementById('templateSort');
    const searchBox = document.querySelector('.search-box input');
    
    const categoryValue = categoryFilter ? categoryFilter.value : 'all';
    const sortValue = sortFilter ? sortFilter.value : 'recommend';
    const searchValue = searchBox ? searchBox.value.toLowerCase() : '';
    
    const templateCards = document.querySelectorAll('.template-card');
    let visibleCount = 0;
    
    // 템플릿 카드 필터링
    templateCards.forEach(card => {
        // 카테고리 필터
        const cardCategory = card.dataset.category || '';
        const categoryMatch = categoryValue === 'all' || cardCategory === categoryValue;
        
        // 검색어 필터
        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardDesc = card.querySelector('p').textContent.toLowerCase();
        const searchMatch = searchValue === '' || 
                           cardTitle.includes(searchValue) || 
                           cardDesc.includes(searchValue);
        
        // 필터 결과 적용
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // 정렬 적용
    if (visibleCount > 1) {
        sortTemplates(sortValue);
    }
    
    // 검색 결과 없음 메시지
    const emptyMessage = document.querySelector('.empty-search-message');
    
    if (visibleCount === 0) {
        if (!emptyMessage) {
            const templatesGrid = document.querySelector('.templates-grid');
            
            if (templatesGrid) {
                const message = document.createElement('div');
                message.className = 'empty-search-message';
                message.textContent = '검색 결과가 없습니다.';
                
                templatesGrid.appendChild(message);
            }
        }
    } else if (emptyMessage) {
        emptyMessage.remove();
    }
}

/**
 * 템플릿 정렬
 * @param {string} sortBy - 정렬 기준 (recommend, popular, newest)
 */
function sortTemplates(sortBy) {
    const templatesGrid = document.querySelector('.templates-grid');
    
    if (!templatesGrid) return;
    
    const templateCards = Array.from(templatesGrid.querySelectorAll('.template-card:not([style*="display: none"])'));
    
    // 정렬 기준에 따라 카드 정렬
    templateCards.sort((a, b) => {
        if (sortBy === 'popular') {
            // 인기순 (다운로드 수)
            const aDownloads = parseInt(a.dataset.downloads || '0');
            const bDownloads = parseInt(b.dataset.downloads || '0');
            return bDownloads - aDownloads;
        } else if (sortBy === 'newest') {
            // 최신순 (날짜)
            const aDate = new Date(a.dataset.date || '2023-01-01');
            const bDate = new Date(b.dataset.date || '2023-01-01');
            return bDate - aDate;
        } else {
            // 추천순 (기본값)
            const aRecommend = parseInt(a.dataset.recommend || '0');
            const bRecommend = parseInt(b.dataset.recommend || '0');
            return bRecommend - aRecommend;
        }
    });
    
    // 정렬된 순서대로 카드 재배치
    templateCards.forEach(card => {
        templatesGrid.appendChild(card);
    });
}

/**
 * 템플릿 미리보기 모달 설정
 */
function setupTemplatePreviewModal() {
    const templateCards = document.querySelectorAll('.template-card');
    const previewModal = document.querySelector('.template-preview-modal');
    
    if (!templateCards.length || !previewModal) return;
    
    // 카드 더블클릭 시 모달 열기
    templateCards.forEach(card => {
        card.addEventListener('dblclick', function() {
            openTemplatePreview(this);
        });
    });
    
    // 모달 닫기 버튼
    const closeBtn = previewModal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }
    
    // 모달 선택 버튼
    const selectBtn = previewModal.querySelector('.template-actions .btn-primary');
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            // 현재 모달에 표시된 템플릿 ID
            const templateId = previewModal.dataset.templateId;
            
            // 해당 템플릿 카드 찾기
            const templateCard = document.querySelector(`.template-card[data-template-id="${templateId}"]`);
            
            if (templateCard) {
                // 모든 템플릿 카드 선택 해제
                templateCards.forEach(card => {
                    card.classList.remove('selected');
                    const radio = card.querySelector('input[type="radio"]');
                    if (radio) radio.checked = false;
                });
                
                // 선택한 템플릿 카드 선택
                templateCard.classList.add('selected');
                const radio = templateCard.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                
                // 템플릿 정보 저장
                saveSelectedTemplate(templateCard);
            }
            
            // 모달 닫기
            previewModal.style.display = 'none';
        });
    }
    
    // 모달 외부 클릭 시 닫기
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
}

/**
 * 템플릿 미리보기 모달 열기
 * @param {HTMLElement} templateCard - 미리보기할 템플릿 카드
 */
function openTemplatePreview(templateCard) {
    const previewModal = document.querySelector('.template-preview-modal');
    
    if (!previewModal) return;
    
    // 템플릿 정보 추출
    const templateId = templateCard.dataset.templateId || '';
    const templateTitle = templateCard.querySelector('h3').textContent;
    const templateImg = templateCard.querySelector('img').src;
    
    // 템플릿 이미지 경로 설정 (assets/images/templates 디렉토리 사용)
    const previewImgPath = `assets/images/templates/template${templateId}.png`;
    
    // 모달 내용 업데이트
    previewModal.dataset.templateId = templateId;
    previewModal.querySelector('h3').textContent = templateTitle;
    previewModal.querySelector('.preview-image img').src = previewImgPath;
    
    // 모달 표시
    previewModal.style.display = 'flex';
}