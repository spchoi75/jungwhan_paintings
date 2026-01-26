export const ko = {
  // 공통
  common: {
    logo: '정환',
  },

  // 네비게이션
  nav: {
    home: 'Home',
    portfolio: 'Portfolio',
    about: 'About',
    exhibitions: 'Exhibitions',
    contact: 'Contact',
  },

  // 접근성 (aria-label)
  aria: {
    openMenu: '메뉴 열기',
    closeMenu: '메뉴 닫기',
    closeModal: '모달 닫기',
    prevArtwork: '이전 작품',
    nextArtwork: '다음 작품',
    scrollDown: '아래로 스크롤',
    viewArtwork: '작품 상세 보기',
  },

  // Footer
  footer: {
    contact: '연락처',
    links: '링크',
    website: '웹사이트',
    copyright: '© {year} {name}. All rights reserved.',
    notice:
      '본 웹사이트에 게시된 모든 작품 이미지의 저작권은 작가 {name}에게 있습니다. 작품의 무단 복제, 배포, 수정 및 상업적 이용을 금지합니다. 작품 사용에 관한 문의는 이메일로 연락 바랍니다.',
    defaultBio: '한국의 자연과 인물을 담은 작품 활동을 하고 있습니다.',
    defaultName: '정환',
  },

  // About 페이지
  about: {
    education: 'Education',
    exhibitions: 'Exhibitions',
    contact: 'Contact',
    downloadCv: 'DOWNLOAD CV',
    defaultBio: [
      '작가 소개 텍스트를 여기에 입력하세요.',
      '작업 철학, 영감의 원천, 예술적 여정 등을 기술할 수 있습니다.',
    ],
  },

  // Exhibitions 페이지
  exhibitions: {
    title: 'Exhibitions',
    soloExhibitions: 'Selected Solo Exhibitions',
    groupExhibitions: 'Selected Group Exhibitions',
    noExhibitions: 'No exhibitions to display',
  },

  // Contact 페이지
  contact: {
    title: 'Contact',
    email: 'Email',
    noContact: 'Contact information not available',
    inquiryNotice:
      'For inquiries about artworks, exhibitions, or collaborations, please feel free to reach out via email.',
  },

  // Portfolio 페이지
  portfolio: {
    title: 'Portfolio',
    backToPortfolio: 'Back to Portfolio',
    noCategories: 'No categories yet',
    noArtworks: 'No artworks in this category',
  },

  // Landing 페이지
  landing: {
    selectedWorks: 'Selected Works',
    viewAllWorks: 'View All Works',
    noArtworks: 'No artworks to display',
  },

  // 언어 선택
  language: {
    korean: '한국어',
    english: 'English',
  },
};

export type Translations = typeof ko;
