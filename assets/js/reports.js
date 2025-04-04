/**
 * AI 공무원 보고서 작성 도우미 - 보고서 관련 자바스크립트
 */

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeReportForm();
    setupReportTypeChanges();
    setupSampleDataLoading();
});

/**
 * 보고서 폼 초기화
 */
function initializeReportForm() {
    const reportForm = document.getElementById('reportInfoForm');
    
    // 폼이 있는 경우에만 초기화
    if (!reportForm) return;
    
    // 오늘 날짜로 날짜 필드 초기화
    const dateField = document.getElementById('reportDate');
    if (dateField) {
        dateField.value = getTodayDate();
    }
    
    // 폼 제출 이벤트 핸들러
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 유효성 검사
        if (!validateForm(this)) {
            showToast('필수 항목을 모두 입력해주세요.', 'error');
            return;
        }
        
        // 보고서 정보 저장
        saveReportInfo();
        
        // 다음 페이지로 이동
        window.location.href = 'create-toc.html';
    });
}

/**
 * 보고서 유형 변경 설정
 */
function setupReportTypeChanges() {
    const reportTypeRadios = document.querySelectorAll('input[name="reportType"]');
    
    reportTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFormFieldsBasedOnType(this.value);
        });
    });
}

/**
 * 보고서 유형에 따라 폼 필드 업데이트
 * @param {string} reportType - 보고서 유형 (internal, external, briefing)
 */
function updateFormFieldsBasedOnType(reportType) {
    // 예시: 브리핑 자료인 경우 추가 필드 표시
    const briefingFieldsContainer = document.getElementById('briefingFields');
    
    if (briefingFieldsContainer) {
        if (reportType === 'briefing') {
            briefingFieldsContainer.style.display = 'block';
            
            // 필드에 required 속성 추가
            const fields = briefingFieldsContainer.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                field.setAttribute('required', '');
            });
        } else {
            briefingFieldsContainer.style.display = 'none';
            
            // 필드에서 required 속성 제거
            const fields = briefingFieldsContainer.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                field.removeAttribute('required');
            });
        }
    }
}

/**
 * 샘플 데이터 로드 설정
 */
function setupSampleDataLoading() {
    const loadSampleBtn = document.getElementById('loadSampleData');
    
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', function() {
            loadSampleReportData();
        });
    }
}

/**
 * 샘플 보고서 데이터 로드
 */
function loadSampleReportData() {
    // 샘플 데이터
    const sampleData = {
        reportTitle: '2024년 상반기 업무 보고서',
        authorName: '홍길동',
        authorDepartment: '총무과',
        reportDate: getTodayDate(),
        reportPurpose: '2024년 상반기 동안 추진했던 주요 업무의 진행 상황과 실적을 보고하기 위함',
        reportSummary: '총무과에서 추진 중인 주요 업무와 사업의 추진 현황, 실적, 문제점 및 향후 계획을 종합적으로 정리한 보고서입니다.',
        keyIssues: '예산 집행률 저조 문제, 시스템 개선 필요성 등',
        reportType: 'internal'
    };
    
    // 폼 필드에 샘플 데이터 입력
    for (const field in sampleData) {
        const element = document.getElementById(field);
        if (element) {
            if (element.type === 'radio') {
                // 라디오 버튼인 경우
                document.querySelector(`input[name="${field}"][value="${sampleData[field]}"]`).checked = true;
            } else {
                // 일반 필드인 경우
                element.value = sampleData[field];
            }
        }
    }
    
    showToast('샘플 데이터가 로드되었습니다.', 'success');
}

/**
 * 보고서 정보 저장
 */
function saveReportInfo() {
    const formData = new FormData(document.getElementById('reportInfoForm'));
    const reportInfo = {};
    
    // FormData를 객체로 변환
    for (const [key, value] of formData.entries()) {
        reportInfo[key] = value;
    }
    
    // 로컬 스토리지에 저장
    saveToLocalStorage('currentReport', reportInfo);
}

/**
 * 저장된 보고서 정보 로드
 * @returns {Object|null} 보고서 정보 또는 null
 */
function loadReportInfo() {
    return loadFromLocalStorage('currentReport');
}

/**
 * 보고서 요약 정보 표시
 */
function displayReportSummary() {
    const reportInfo = loadReportInfo();
    
    if (!reportInfo) return;
    
    const summaryContainer = document.querySelector('.report-summary');
    
    if (summaryContainer) {
        const titleElement = summaryContainer.querySelector('h3');
        if (titleElement) {
            titleElement.textContent = reportInfo.reportTitle || '새 보고서';
        }
        
        const authorElement = summaryContainer.querySelector('.summary-item:nth-child(1) .value');
        if (authorElement) {
            authorElement.textContent = `${reportInfo.authorName || '미지정'} (${reportInfo.authorDepartment || '미지정'})`;
        }
        
        const dateElement = summaryContainer.querySelector('.summary-item:nth-child(2) .value');
        if (dateElement) {
            dateElement.textContent = reportInfo.reportDate || getTodayDate();
        }
        
        const formatElement = summaryContainer.querySelector('.summary-item:nth-child(3) .value');
        if (formatElement) {
            const format = reportInfo.documentFormat === 'pdf' ? 'PDF' : '한글(HWP)';
            formatElement.textContent = format;
        }
    }
}

/**
 * 보고서 목록 로드
 * @returns {Array} 보고서 목록
 */
function loadReportList() {
    const reports = loadFromLocalStorage('savedReports') || [];
    return reports;
}

/**
 * 보고서 목록 저장
 * @param {Array} reports - 저장할 보고서 목록
 */
function saveReportList(reports) {
    saveToLocalStorage('savedReports', reports);
}

/**
 * 보고서 저장
 * @param {Object} report - 저장할 보고서 데이터
 */
function saveReport(report) {
    // 보고서 ID 생성 (없는 경우)
    if (!report.id) {
        report.id = 'report_' + Date.now();
    }
    
    // 저장 시간 업데이트
    report.lastSaved = new Date().toISOString();
    
    // 보고서 목록 로드
    const reports = loadReportList();
    
    // 기존 보고서 검색
    const existingIndex = reports.findIndex(r => r.id === report.id);
    
    if (existingIndex !== -1) {
        // 기존 보고서 업데이트
        reports[existingIndex] = report;
    } else {
        // 새 보고서 추가
        reports.push(report);
    }
    
    // 보고서 목록 저장
    saveReportList(reports);
    
    return report.id;
}

/**
 * 보고서 삭제
 * @param {string} reportId - 삭제할 보고서 ID
 * @returns {boolean} 삭제 성공 여부
 */
function deleteReport(reportId) {
    // 보고서 목록 로드
    const reports = loadReportList();
    
    // 삭제할 보고서 인덱스 찾기
    const reportIndex = reports.findIndex(report => report.id === reportId);
    
    if (reportIndex === -1) {
        return false;
    }
    
    // 보고서 삭제
    reports.splice(reportIndex, 1);
    
    // 보고서 목록 저장
    saveReportList(reports);
    
    return true;
}

/**
 * 보고서 상태 업데이트
 * @param {string} reportId - 업데이트할 보고서 ID
 * @param {string} status - 새 상태 (draft, in-progress, completed)
 */
function updateReportStatus(reportId, status) {
    // 보고서 목록 로드
    const reports = loadReportList();
    
    // 업데이트할 보고서 찾기
    const report = reports.find(report => report.id === reportId);
    
    if (report) {
        // 상태 업데이트
        report.status = status;
        report.lastUpdated = new Date().toISOString();
        
        // 보고서 목록 저장
        saveReportList(reports);
        
        return true;
    }
    
    return false;
}

/**
 * 새 보고서 생성
 * @returns {Object} 새 보고서 객체
 */
function createNewReport() {
    // 기본 보고서 템플릿
    const newReport = {
        id: 'report_' + Date.now(),
        reportTitle: '새 보고서',
        authorName: '',
        authorDepartment: '',
        reportDate: getTodayDate(),
        reportPurpose: '',
        reportSummary: '',
        keyIssues: '',
        reportType: 'internal',
        documentFormat: 'hwp',
        status: 'draft',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        content: null,
        toc: null
    };
    
    // 현재 보고서로 설정
    saveToLocalStorage('currentReport', newReport);
    
    return newReport;
}

/**
 * 최근 보고서 목록 표시
 * @param {HTMLElement} container - 보고서 목록을 표시할 컨테이너
 * @param {number} limit - 표시할 최대 보고서 수 (기본값: 4)
 */
function displayRecentReports(container, limit = 4) {
    if (!container) return;
    
    // 보고서 목록 로드
    const reports = loadReportList();
    
    // 날짜순으로 정렬
    reports.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    
    // 최대 개수만큼 자르기
    const recentReports = reports.slice(0, limit);
    
    // 컨테이너 비우기
    container.innerHTML = '';
    
    // 보고서가 없는 경우
    if (recentReports.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-reports-message';
        emptyMessage.textContent = '작성된 보고서가 없습니다. 새 보고서를 작성해보세요.';
        container.appendChild(emptyMessage);
        return;
    }
    
    // 보고서 목록 표시
    recentReports.forEach(report => {
        const reportCard = createReportCard(report);
        container.appendChild(reportCard);
    });
    
    // '새 보고서 작성하기' 카드 추가
    if (recentReports.length < limit) {
        const addNewCard = document.createElement('div');
        addNewCard.className = 'add-new-card';
        addNewCard.innerHTML = `
            <a href="create-report.html" class="add-new-link">
                <div class="add-icon"><i class="fas fa-plus"></i></div>
                <span>새 보고서 작성하기</span>
            </a>
        `;
        container.appendChild(addNewCard);
    }
}

/**
 * 보고서 카드 엘리먼트 생성
 * @param {Object} report - 보고서 데이터
 * @returns {HTMLElement} 보고서 카드 엘리먼트
 */
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.dataset.reportId = report.id;
    
    // 상태에 따른 클래스 및 아이콘 설정
    let statusClass = 'draft';
    let statusIcon = 'pencil-alt';
    let statusText = '초안';
    
    if (report.status === 'in-progress') {
        statusClass = 'in-progress';
        statusIcon = 'clock';
        statusText = '진행중';
    } else if (report.status === 'completed') {
        statusClass = 'completed';
        statusIcon = 'check-circle';
        statusText = '완료';
    }
    
    // 날짜 형식 변환
    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };
    
    // 문서 형식 표시
    const formatLabel = report.documentFormat === 'pdf' ? 'PDF' : '한글파일(HWP)';
    
    // 카드 내용 설정
    card.innerHTML = `
        <div class="report-status ${statusClass}">
            <i class="fas fa-${statusIcon}"></i> ${statusText}
        </div>
        <h3>${report.reportTitle}</h3>
        <div class="report-meta">
            <span><i class="far fa-calendar-alt"></i> ${report.reportDate || formatDate(report.createdAt)}</span>
            <span><i class="far fa-file-alt"></i> ${formatLabel}</span>
        </div>
        <div class="report-actions">
            ${report.status === 'completed' ? 
                `<a href="download-report.html?id=${report.id}" class="btn btn-outline"><i class="fas fa-download"></i> 다운로드</a>` : 
                `<a href="${getReportContinueUrl(report)}" class="btn btn-outline"><i class="fas fa-play"></i> 계속하기</a>`
            }
            ${report.status !== 'completed' ? 
                `<button class="btn btn-outline delete-report" data-id="${report.id}"><i class="fas fa-trash-alt"></i> 삭제</button>` :
                `<a href="create-report.html?clone=${report.id}" class="btn btn-outline"><i class="fas fa-copy"></i> 복제</a>`
            }
        </div>
    `;
    
    // 삭제 버튼 이벤트 핸들러
    const deleteBtn = card.querySelector('.delete-report');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (confirm('이 보고서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                const reportId = this.dataset.id;
                if (deleteReport(reportId)) {
                    card.remove();
                    showToast('보고서가 삭제되었습니다.', 'success');
                } else {
                    showToast('보고서 삭제 중 오류가 발생했습니다.', 'error');
                }
            }
        });
    }
    
    // 카드 클릭 이벤트 (상세 보기)
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.btn')) {
            const reportId = this.dataset.reportId;
            window.location.href = `${getReportContinueUrl(report)}`;
        }
    });
    
    return card;
}

/**
 * 보고서 상태에 따른 계속하기 URL 반환
 * @param {Object} report - 보고서 데이터
 * @returns {string} 이동할 URL
 */
function getReportContinueUrl(report) {
    // 보고서 진행 상태에 따라 적절한 페이지로 이동
    if (!report.toc) {
        return `create-toc.html?id=${report.id}`;
    } else if (!report.template) {
        return `select-template.html?id=${report.id}`;
    } else if (!report.content) {
        return `generate-report.html?id=${report.id}`;
    } else {
        return `download-report.html?id=${report.id}`;
    }
}