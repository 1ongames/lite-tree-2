import Alpine from 'alpinejs';

// 전역 상태 관리 Store
Alpine.store('state', {
  // 세션 정보
  session: {
    account: {
      type: null,
      name: null,
      uuid: null
    },
    gravatar_url: null,
    user_document_discuss: false,
    menus: []
  },

  // 페이지 정보
  page: {
    title: '',
    viewName: '',
    data: {
      document: null,
      editable: false,
      edit_acl_message: null,
      headings: [],
      rev: null,
      date: null
    }
  },

  // 최근 변경 목록
  recent: [],

  // 로컬 설정 (localStorage 동기화)
  localConfig: {},

  // 현재 테마
  currentTheme: 'light',

  // 초기화
  init() {
    this.loadLocalConfig();
    this.loadTheme();
    this.loadRecentChanges();
  },

  // localStorage에서 설정 불러오기
  loadLocalConfig() {
    try {
      const stored = localStorage.getItem('wikiConfig');
      if (stored) {
        this.localConfig = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load local config:', e);
    }
  },

  // 로컬 설정 저장
  setLocalConfig(key, value) {
    this.localConfig[key] = value;
    localStorage.setItem('wikiConfig', JSON.stringify(this.localConfig));
    
    // 테마 변경 시 즉시 적용
    if (key === 'wiki.theme') {
      this.currentTheme = value;
      document.documentElement.setAttribute('data-theme', value);
    }
  },

  // 테마 불러오기
  loadTheme() {
    const theme = this.localConfig['wiki.theme'] || 'light';
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  },

  // 최근 변경 목록 불러오기
  async loadRecentChanges() {
    try {
      const response = await fetch('/api/recent-changes?limit=12');
      if (response.ok) {
        this.recent = await response.json();
      }
    } catch (e) {
      console.error('Failed to load recent changes:', e);
    }
  },

  // 설정 모달 열기
  openSettingModal() {
    console.log('Open settings modal');
  },

  // 링크 클릭 핸들러
  aClickHandler(e) {
    // 기본 링크 동작 유지
  }
});

// 스킨 관련 Store
Alpine.store('skin', {
  isShowACLMessage: true,

  hideEditMessage() {
    this.isShowACLMessage = false;
    Alpine.store('state').setLocalConfig('wiki.hide_acl_message', true);
  },

  ringo_opening(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const isHidden = element.style.visibility === 'hidden';
    
    document.querySelectorAll('.header-menu-dropdown').forEach(el => {
      el.style.visibility = 'hidden';
      el.style.transform = 'translateY(6px)';
    });

    if (isHidden) {
      element.style.visibility = 'visible';
      element.style.transform = 'translateY(0)';
    }
  }
});

// 유틸리티 함수
window.doc_action_link = (document, action) => `/w/${encodeURIComponent(document)}?action=${action}`;
window.user_doc = (username) => `사용자:${username}`;
window.contribution_link = (uuid) => `/contribution/${uuid}`;
window.contribution_link_discuss = (uuid) => `/contribution/${uuid}/discuss`;
window.contribution_link_edit_request = (uuid) => `/contribution/${uuid}/edit-request`;

window.getFullDateTag = (date, format = 'full') => {
  const d = new Date(date);
  if (format === 'relative') {
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
    return `${Math.floor(diff / 31536000)}년 전`;
  }
  return d.toLocaleString('ko-KR');
};

window.removeHtmlTags = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

// Alpine 시작
window.Alpine = Alpine;
Alpine.start();
