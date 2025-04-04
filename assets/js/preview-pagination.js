/**
 * 보고서 미리보기 페이지네이션 기능
 */
document.addEventListener('DOMContentLoaded', function() {
    initializePreviewPagination();
    initializeZoomControls();
});

/**
 * 미리보기 페이지네이션 초기화
 */
function initializePreviewPagination() {
    const previewPages = document.querySelectorAll('.preview-page');
    const prevButton = document.querySelector('.pagination-btn:first-child');
    const nextButton = document.querySelector('.pagination-btn:last-child');
    const pageIndicator = document.querySelector('.page-indicator');
    
    let currentPage = 0;
    const totalPages = previewPages.length;
    
    // 초기 상태 설정
    updatePreviewDisplay();
    
    // 이전 페이지 버튼 클릭 이벤트
    prevButton.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            updatePreviewDisplay();
        }
    });
    
    // 다음 페이지 버튼 클릭 이벤트
    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePreviewDisplay();
        }
    });
    
    // 미리보기 표시 업데이트
    function updatePreviewDisplay() {
        // 모든 페이지 숨기기
        previewPages.forEach(page => {
            page.style.display = 'none';
        });
        
        // 현재 페이지만 표시
        previewPages[currentPage].style.display = 'block';
        
        // 페이지 표시기 업데이트
        pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
        
        // 버튼 활성화/비활성화 상태 업데이트
        prevButton.disabled = currentPage === 0;
        prevButton.classList.toggle('disabled', currentPage === 0);
        
        nextButton.disabled = currentPage === totalPages - 1;
        nextButton.classList.toggle('disabled', currentPage === totalPages - 1);
    }
}

/**
 * 확대/축소 컨트롤 초기화
 */
function initializeZoomControls() {
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomLevelDisplay = document.querySelector('.zoom-level');
    const previewContent = document.querySelector('.preview-content');
    
    let zoomLevel = 100;
    const zoomStep = 10;
    const minZoom = 50;
    const maxZoom = 200;
    
    // 확대 버튼 클릭 이벤트
    zoomInBtn.addEventListener('click', function() {
        if (zoomLevel < maxZoom) {
            zoomLevel += zoomStep;
            updateZoom();
        }
    });
    
    // 축소 버튼 클릭 이벤트
    zoomOutBtn.addEventListener('click', function() {
        if (zoomLevel > minZoom) {
            zoomLevel -= zoomStep;
            updateZoom();
        }
    });
    
    // 확대/축소 레벨 업데이트
    function updateZoom() {
        zoomLevelDisplay.textContent = `${zoomLevel}%`;
        
        // 모든 미리보기 페이지에 확대/축소 적용
        const previewPages = document.querySelectorAll('.preview-page img');
        previewPages.forEach(page => {
            page.style.width = `${zoomLevel}%`;
        });
    }
}
