import type { Translations } from './ko';

export const en: Translations = {
  // 공통
  common: {
    logo: 'Jungwhan',
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
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    closeModal: 'Close modal',
    prevArtwork: 'Previous artwork',
    nextArtwork: 'Next artwork',
    scrollDown: 'Scroll down',
    viewArtwork: 'View artwork details',
  },

  // Footer
  footer: {
    contact: 'Contact',
    links: 'Links',
    website: 'Website',
    copyright: '© {year} {name}. All rights reserved.',
    notice:
      'All artwork images on this website are copyrighted by the artist {name}. Unauthorized reproduction, distribution, modification, and commercial use of the artwork is prohibited. For inquiries regarding artwork usage, please contact via email.',
    defaultBio: 'Creating artworks that capture the nature and people of Korea.',
    defaultName: 'Jungwhan',
  },

  // About 페이지
  about: {
    education: 'Education',
    exhibitions: 'Exhibitions',
    contact: 'Contact',
    downloadCv: 'DOWNLOAD CV',
    defaultBio: [
      'Enter artist introduction text here.',
      'You can describe your artistic philosophy, sources of inspiration, and artistic journey.',
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
