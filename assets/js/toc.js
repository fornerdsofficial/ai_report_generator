/**
 * AI 공무원 보고서 작성 도우미 - 목차 관련 자바스크립트
 */

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeTocEditor();
    setupTocToggle();
    setupTocDragAndDrop();
    setupTocActions();
    displayReportSummary();
    
    // 목차 생성 시뮬레이션 (실제로는 AI 호출이 필요)
    simulateTocGeneration();
});

/**
 * 목차 에디터 초기화
 */
function initializeTocEditor() {
    const tocEditor = document.getElementById('tocEditor');
    const tocLoading = document.getElementById('tocLoading');
    
    if (!tocEditor || !tocLoading) return;
    
    // 보고서 정보 로드
    const reportInfo = loadReportInfo();
    
    // 저장된 목차 확인
    if (reportInfo && reportInfo.toc) {
        renderToc(reportInfo.toc);
    } else {
        // 목차 로딩 표시 (AI 생성 대기 중)
        tocEditor.style.display = 'none';
        tocLoading.style.display = 'flex';
    }
}

/**
 * 목차 생성 시뮬레이션
 * 실제 구현에서는 AI 서비스 호출로 대체
 */
function simulateTocGeneration() {
    const tocEditor = document.getElementById('tocEditor');
    const tocLoading = document.getElementById('tocLoading');
    
    if (!tocEditor || !tocLoading) return;
    
    // 이미 목차가 로드된 경우 시뮬레이션 건너뛰기
    const reportInfo = loadReportInfo();
    if (reportInfo && reportInfo.toc) {
        return;
    }
    
    // 로딩 시간 시뮬레이션 (실제로는 AI 응답 대기)
    setTimeout(() => {
        // 샘플 목차 데이터 (실제로는 AI 응답)
        const sampleToc = [
            {
                id: 'toc-1',
                title: '서론',
                children: [
                    {
                        id: 'toc-1-1',
                        title: '보고서 개요',
                        children: []
                    },
                    {
                        id: 'toc-1-2',
                        title: '보고 목적',
                        children: []
                    }
                ]
            },
            {
                id: 'toc-2',
                title: '현황 및 배경',
                children: [
                    {
                        id: 'toc-2-1',
                        title: '현재 상황 분석',
                        children: []
                    },
                    {
                        id: 'toc-2-2',
                        title: '관련 통계 자료',
                        children: []
                    }
                ]
            },
            {
                id: 'toc-3',
                title: '주요 추진 실적',
                children: [
                    {
                        id: 'toc-3-1',
                        title: '추진 과제 이행 현황',
                        children: []
                    },
                    {
                        id: 'toc-3-2',
                        title: '주요 성과',
                        children: []
                    }
                ]
            },
            {
                id: 'toc-4',
                title: '향후 계획',
                children: [
                    {
                        id: 'toc-4-1',
                        title: '향후 추진 계획',
                        children: []
                    },
                    {
                        id: 'toc-4-2',
                        title: '기대 효과',
                        children: []
                    }
                ]
            },
            {
                id: 'toc-5',
                title: '결론 및 건의사항',
                children: []
            }
        ];
        
        // 목차 렌더링
        renderToc(sampleToc);
        
        // 목차 데이터 저장
        saveToc(sampleToc);
        
        // 로딩 애니메이션 숨기기
        tocLoading.style.display = 'none';
        tocEditor.style.display = 'block';
        
        // 생성 완료 메시지
        showToast('목차가 성공적으로 생성되었습니다.', 'success');
    }, 2000);
}

/**
 * 목차 렌더링
 * @param {Array} tocData - 목차 데이터
 */
function renderToc(tocData) {
    const tocTree = document.querySelector('.toc-tree');
    
    if (!tocTree) return;
    
    // 트리 초기화
    tocTree.innerHTML = '';
    
    // 목차 항목 생성
    tocData.forEach((item, index) => {
        const tocItem = createTocItem(item, index + 1);
        tocTree.appendChild(tocItem);
    });
}

/**
 * 목차 항목 엘리먼트 생성
 * @param {Object} item - 목차 항목 데이터
 * @param {number} index - 항목 인덱스
 * @param {string} parentIndex - 부모 항목 인덱스 (자식 항목인 경우)
 * @returns {HTMLElement} 목차 항목 엘리먼트
 */
function createTocItem(item, index, parentIndex = '') {
    const li = document.createElement('li');
    li.className = 'toc-item';
    li.dataset.id = item.id;
    
    // 항목 번호 설정
    const itemNumber = parentIndex ? `${parentIndex}.${index}` : `${index}`;
    
    // 자식 항목 확인
    const hasChildren = item.children && item.children.length > 0;
    
    // 항목 헤더 설정
    li.innerHTML = `
        <div class="toc-item-header">
            <span class="item-handle"><i class="fas fa-grip-lines"></i></span>
            <span class="item-toggle ${hasChildren ? 'expanded' : 'no-children'}">
                ${hasChildren ? '<i class="fas fa-caret-down"></i>' : ''}
            </span>
            <span class="item-number">${itemNumber}.</span>
            <input type="text" class="item-title" value="${item.title}">
            <div class="item-actions">
                <button class="action-btn add-sub"><i class="fas fa-plus"></i></button>
                <button class="action-btn delete-item"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // 자식 항목이 있는 경우 하위 트리 생성
    if (hasChildren) {
        const subtree = document.createElement('ul');
        subtree.className = 'toc-subtree';
        
        item.children.forEach((child, childIndex) => {
            const childItem = createTocItem(child, childIndex + 1, itemNumber);
            subtree.appendChild(childItem);
        });
        
        li.appendChild(subtree);
    }
    
    return li;
}

/**
 * 목차 토글 설정
 */
function setupTocToggle() {
    // 이벤트 위임을 사용하여 토글 클릭 처리
    document.addEventListener('click', function(e) {
        const toggleBtn = e.target.closest('.item-toggle');
        
        if (toggleBtn && !toggleBtn.classList.contains('no-children')) {
            const tocItem = toggleBtn.closest('.toc-item');
            const subtree = tocItem.querySelector('.toc-subtree');
            
            if (toggleBtn.classList.contains('expanded')) {
                // 접기
                toggleBtn.classList.remove('expanded');
                toggleBtn.classList.add('collapsed');
                toggleBtn.innerHTML = '<i class="fas fa-caret-right"></i>';
                
                if (subtree) {
                    subtree.style.display = 'none';
                }
            } else {
                // 펼치기
                toggleBtn.classList.remove('collapsed');
                toggleBtn.classList.add('expanded');
                toggleBtn.innerHTML = '<i class="fas fa-caret-down"></i>';
                
                if (subtree) {
                    subtree.style.display = 'block';
                }
            }
        }
    });
}

/**
 * 목차 드래그 앤 드롭 설정
 */
function setupTocDragAndDrop() {
    // 나중에 드래그 앤 드롭 기능 구현
    // (실제 구현에서는 Sortable.js와 같은 라이브러리 사용 권장)
}

/**
 * 목차 액션 버튼 설정
 */
function setupTocActions() {
    // 이벤트 위임을 사용하여 액션 버튼 클릭 처리
    document.addEventListener('click', function(e) {
        // 하위 항목 추가 버튼
        if (e.target.closest('.add-sub')) {
            const tocItem = e.target.closest('.toc-item');
            addSubItem(tocItem);
        }
        
        // 항목 삭제 버튼
        if (e.target.closest('.delete-item')) {
            const tocItem = e.target.closest('.toc-item');
            deleteItem(tocItem);
        }
        
        // 섹션 추가 버튼
        if (e.target.closest('#addSection')) {
            addMainSection();
        }
        
        // 모두 펼치기 버튼
        if (e.target.closest('#expandAll')) {
            expandAll();
        }
        
        // 모두 접기 버튼
        if (e.target.closest('#collapseAll')) {
            collapseAll();
        }
        
        // 목차 재생성 버튼
        if (e.target.closest('#regenerateToc')) {
            regenerateToc();
        }
    });
    
    // 항목 제목 변경 처리
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('item-title')) {
            updateTocData();
        }
    });
}

/**
 * 하위 항목 추가
 * @param {HTMLElement} parentItem - 부모 항목 엘리먼트
 */
function addSubItem(parentItem) {
    // 부모 항목 ID
    const parentId = parentItem.dataset.id;
    
    // 새 항목 ID 생성
    const newItemId = 'toc-' + Date.now();
    
    // 부모의 하위 트리 확인
    let subtree = parentItem.querySelector('.toc-subtree');
    
    // 하위 트리가 없으면 생성
    if (!subtree) {
        subtree = document.createElement('ul');
        subtree.className = 'toc-subtree';
        parentItem.appendChild(subtree);
        
        // 토글 버튼 업데이트
        const toggleBtn = parentItem.querySelector('.item-toggle');
        toggleBtn.classList.remove('no-children');
        toggleBtn.classList.add('expanded');
        toggleBtn.innerHTML = '<i class="fas fa-caret-down"></i>';
    }
    
    // 하위 항목 수 확인
    const childCount = subtree.children.length;
    
    // 부모 항목 번호 가져오기
    const parentNumber = parentItem.querySelector('.item-number').textContent.replace('.', '');
    
    // 새 하위 항목 생성
    const newItem = document.createElement('li');
    newItem.className = 'toc-item';
    newItem.dataset.id = newItemId;
    newItem.innerHTML = `
        <div class="toc-item-header">
            <span class="item-handle"><i class="fas fa-grip-lines"></i></span>
            <span class="item-toggle no-children"></span>
            <span class="item-number">${parentNumber}.${childCount + 1}.</span>
            <input type="text" class="item-title" value="새 항목">
            <div class="item-actions">
                <button class="action-btn add-sub"><i class="fas fa-plus"></i></button>
                <button class="action-btn delete-item"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // 하위 트리에 추가
    subtree.appendChild(newItem);
    
    // 새 항목 제목 포커스
    newItem.querySelector('.item-title').focus();
    
    // 목차 데이터 업데이트
    updateTocData();
    
    // 변경 사항 저장
    showToast('하위 항목이 추가되었습니다.', 'success');
}

/**
 * 항목 삭제
 * @param {HTMLElement} item - 삭제할 항목 엘리먼트
 */
function deleteItem(item) {
    // 전체 목차에 최소 한 개의 항목은 남아있어야 함
    const tocTree = document.querySelector('.toc-tree');
    if (tocTree.children.length <= 1 && item.parentElement === tocTree) {
        showToast('최소 한 개의 항목은 있어야 합니다.', 'error');
        return;
    }
    
    // 부모 엘리먼트
    const parent = item.parentElement;
    
    // 확인 메시지
    if (confirm('이 항목과 모든 하위 항목을 삭제하시겠습니까?')) {
        // 항목 삭제
        parent.removeChild(item);
        
        // 부모가 하위 트리이고 이제 비어있으면, 부모 항목 업데이트
        if (parent.classList.contains('toc-subtree') && parent.children.length === 0) {
            const parentItem = parent.parentElement;
            const toggleBtn = parentItem.querySelector('.item-toggle');
            
            // 토글 버튼 업데이트
            toggleBtn.classList.remove('expanded');
            toggleBtn.classList.add('no-children');
            toggleBtn.innerHTML = '';
            
            // 빈 하위 트리 제거
            parentItem.removeChild(parent);
        }
        
        // 목차 항목 번호 재정렬
        reorderTocItems();
        
        // 목차 데이터 업데이트
        updateTocData();
        
        // 변경 사항 저장
        showToast('항목이 삭제되었습니다.', 'success');
    }
}

/**
 * 메인 섹션 추가
 */
function addMainSection() {
    const tocTree = document.querySelector('.toc-tree');
    
    if (!tocTree) return;
    
    // 새 항목 ID 생성
    const newItemId = 'toc-' + Date.now();
    
    // 기존 항목 수 확인
    const itemCount = tocTree.children.length;
    
    // 새 메인 항목 생성
    const newItem = document.createElement('li');
    newItem.className = 'toc-item';
    newItem.dataset.id = newItemId;
    newItem.innerHTML = `
        <div class="toc-item-header">
            <span class="item-handle"><i class="fas fa-grip-lines"></i></span>
            <span class="item-toggle no-children"></span>
            <span class="item-number">${itemCount + 1}.</span>
            <input type="text" class="item-title" value="새 섹션">
            <div class="item-actions">
                <button class="action-btn add-sub"><i class="fas fa-plus"></i></button>
                <button class="action-btn delete-item"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // 트리에 추가
    tocTree.appendChild(newItem);
    
    // 새 항목 제목 포커스
    newItem.querySelector('.item-title').focus();
    
    // 목차 데이터 업데이트
    updateTocData();
    
    // 변경 사항 저장
    showToast('새 섹션이 추가되었습니다.', 'success');
}

/**
 * 모든 항목 펼치기
 */
function expandAll() {
    const toggleButtons = document.querySelectorAll('.item-toggle:not(.no-children)');
    
    toggleButtons.forEach(toggle => {
        toggle.classList.remove('collapsed');
        toggle.classList.add('expanded');
        toggle.innerHTML = '<i class="fas fa-caret-down"></i>';
        
        const subtree = toggle.closest('.toc-item').querySelector('.toc-subtree');
        if (subtree) {
            subtree.style.display = 'block';
        }
    });
    
    showToast('모든 항목이 펼쳐졌습니다.', 'info');
}

/**
 * 모든 항목 접기
 */
function collapseAll() {
    const toggleButtons = document.querySelectorAll('.item-toggle.expanded');
    
    toggleButtons.forEach(toggle => {
        toggle.classList.remove('expanded');
        toggle.classList.add('collapsed');
        toggle.innerHTML = '<i class="fas fa-caret-right"></i>';
        
        const subtree = toggle.closest('.toc-item').querySelector('.toc-subtree');
        if (subtree) {
            subtree.style.display = 'none';
        }
    });
    
    showToast('모든 항목이 접혔습니다.', 'info');
}

/**
 * 목차 재생성 (AI 생성)
 */
function regenerateToc() {
    if (confirm('목차를 재생성하시겠습니까? 기존에 수정한 내용은 모두 사라집니다.')) {
        const tocEditor = document.getElementById('tocEditor');
        const tocLoading = document.getElementById('tocLoading');
        
        if (!tocEditor || !tocLoading) return;
        
        // 로딩 표시
        tocEditor.style.display = 'none';
        tocLoading.style.display = 'flex';
        
        // 목차 재생성 시뮬레이션 (실제로는 AI 서비스 호출)
        setTimeout(() => {
            // 시뮬레이션을 위해 기존과 다른 목차 생성
            const newToc = [
                {
                    id: 'toc-1',
                    title: '개요',
                    children: [
                        {
                            id: 'toc-1-1',
                            title: '보고 배경',
                            children: []
                        },
                        {
                            id: 'toc-1-2',
                            title: '보고 목적',
                            children: []
                        }
                    ]
                },
                {
                    id: 'toc-2',
                    title: '현황 분석',
                    children: [
                        {
                            id: 'toc-2-1',
                            title: '정책 환경 분석',
                            children: []
                        },
                        {
                            id: 'toc-2-2',
                            title: '주요 이슈',
                            children: []
                        }
                    ]
                },
                {
                    id: 'toc-3',
                    title: '추진 실적',
                    children: [
                        {
                            id: 'toc-3-1',
                            title: '주요 성과',
                            children: []
                        },
                        {
                            id: 'toc-3-2',
                            title: '개선 사항',
                            children: []
                        }
                    ]
                },
                {
                    id: 'toc-4',
                    title: '향후 계획',
                    children: [
                        {
                            id: 'toc-4-1',
                            title: '단기 계획',
                            children: []
                        },
                        {
                            id: 'toc-4-2',
                            title: '중장기 계획',
                            children: []
                        }
                    ]
                },
                {
                    id: 'toc-5',
                    title: '결론',
                    children: []
                }
            ];
            
            // 목차 렌더링
            renderToc(newToc);
            
            // 목차 데이터 저장
            saveToc(newToc);
            
            // 로딩 애니메이션 숨기기
            tocLoading.style.display = 'none';
            tocEditor.style.display = 'block';
            
            // 생성 완료 메시지
            showToast('목차가 성공적으로 재생성되었습니다.', 'success');
        }, 2000);
    }
}

/**
 * 목차 항목 번호 재정렬
 */
function reorderTocItems() {
    const tocTree = document.querySelector('.toc-tree');
    
    if (!tocTree) return;
    
    // 최상위 항목 번호 부여
    const mainItems = tocTree.children;
    
    Array.from(mainItems).forEach((item, index) => {
        const itemNumber = item.querySelector('.item-number');
        if (itemNumber) {
            itemNumber.textContent = `${index + 1}.`;
        }
        
        // 하위 항목 번호 부여
        const subtree = item.querySelector('.toc-subtree');
        if (subtree) {
            const subItems = subtree.children;
            
            Array.from(subItems).forEach((subItem, subIndex) => {
                const subItemNumber = subItem.querySelector('.item-number');
                if (subItemNumber) {
                    subItemNumber.textContent = `${index + 1}.${subIndex + 1}.`;
                }
                
                // 3단계 이상 하위 항목은 생략 (필요시 재귀 함수로 구현)
            });
        }
    });
}

/**
 * 목차 데이터 업데이트 및 저장
 */
function updateTocData() {
    const tocData = extractTocData();
    saveToc(tocData);
}

/**
 * DOM에서 목차 데이터 추출
 * @returns {Array} 목차 데이터
 */
function extractTocData() {
    const tocTree = document.querySelector('.toc-tree');
    if (!tocTree) return [];
    
    // 최상위 항목 데이터 추출
    const mainItems = tocTree.children;
    const tocData = [];
    
    Array.from(mainItems).forEach(item => {
        const itemData = extractItemData(item);
        tocData.push(itemData);
    });
    
    return tocData;
}

/**
 * 목차 항목 데이터 추출
 * @param {HTMLElement} item - 목차 항목 엘리먼트
 * @returns {Object} 항목 데이터
 */
function extractItemData(item) {
    const id = item.dataset.id;
    const title = item.querySelector('.item-title').value;
    
    // 하위 항목 데이터 추출
    const subtree = item.querySelector('.toc-subtree');
    const children = [];
    
    if (subtree) {
        const subItems = subtree.children;
        
        Array.from(subItems).forEach(subItem => {
            const subItemData = extractItemData(subItem);
            children.push(subItemData);
        });
    }
    
    return {
        id,
        title,
        children
    };
}

/**
 * 목차 데이터 저장
 * @param {Array} tocData - 목차 데이터
 */
function saveToc(tocData) {
    // 현재 보고서 정보 로드
    const reportInfo = loadReportInfo();
    
    if (reportInfo) {
        // 목차 데이터 업데이트
        reportInfo.toc = tocData;
        
        // 로컬 스토리지에 저장
        saveToLocalStorage('currentReport', reportInfo);
    }
}

/**
 * 저장된 목차 데이터 로드
 * @returns {Array|null} 목차 데이터 또는 null
 */
function loadToc() {
    const reportInfo = loadReportInfo();
    
    if (reportInfo && reportInfo.toc) {
        return reportInfo.toc;
    }
    
    return null;
}