// src/lib/i18n.ts

export interface Translation {
  welcome: {
    title: string;
    subtitle: string;
    selectLanguage: string;
    enter: string;
    professionalTitle: string;
    tagline: string;
    education: string;
    location: string;
    experience: string;
    languageNote: string;
  };
  navigation: {
    portfolio: string;
    all: string;
  };
  gallery: {
    mobileInstructions: {
      tap: string;
      swipe: string;
    };
    swipeHint: string;
    imageInfo: string;
  };
  footer: {
    copyright: string;
  };
  modal: {
    close: string;
    previous: string;
    next: string;
  };
  header: {
    mainTagline: string;
    subTagline: string;
    credentials: string;
  };
  cta: {
    scheduleBadge: string;
    inlineTitle: string;
    inlineSubtitle: string;
    inlineButton: string;
    stickyTitle: string;
    stickySubtitle: string;
  };
  availability: {
    limited: string;
    available: string;
    busy: string;
  };
}

export const translations: Record<string, Translation> = {
  pt: {
    welcome: {
      title: "Bem-vindo ao meu Portfolio",
      subtitle: "Fotografia que captura momentos únicos",
      selectLanguage: "Escolha seu idioma",
      professionalTitle: "Leo Oli",
      tagline: "Transformo momentos em arte que conta histórias",
      education: "Formado em Fotografia Digital - FIAP",
      location: "São Paulo, Brasil",
      experience: "Especialista em Retratos & Ensaios",
      enter: "Ver Meus Trabalhos",
      languageNote: "Idioma detectado automaticamente • Altere no menu"
    },
    navigation: {
      portfolio: "Portfolio",
      all: "Todos"
    },
    gallery: {
      mobileInstructions: {
        tap: "Toque para ampliar",
        swipe: "Deslize para navegar"
      },
      swipeHint: "Deslize para navegar",
      imageInfo: "de"
    },
    footer: {
      copyright: "Todos os direitos reservados."
    },
    modal: {
      close: "Fechar",
      previous: "Anterior",
      next: "Próxima"
    },
    header: {
      mainTagline: "Fotógrafo Profissional em São Paulo",
      subTagline: "Ensaios • Eventos • Retratos Artísticos",
      credentials: "Formado em Fotografia Digital pela FIAP"
    },
    cta: {
      scheduleBadge: "Agendar Sessão",
      inlineTitle: "Gostou do que viu?",
      inlineSubtitle: "Vamos criar algo incrível juntos!",
      inlineButton: "Chamar no WhatsApp",
      stickyTitle: "Pronto para sua sessão?",
      stickySubtitle: "Fale comigo agora!"
    },
    availability: {
      limited: "Vagas Limitadas - Janeiro 2025",
      available: "Disponível Agora",
      busy: "Agenda Cheia - Fevereiro Disponível"
    }
  },
  en: {
    welcome: {
      title: "Welcome to my Portfolio",
      subtitle: "Photography that captures unique moments",
      selectLanguage: "Choose your language",
      professionalTitle: "Leo Oli",
      tagline: "I transform moments into art that tells stories",
      education: "Graduated in Digital Photography - FIAP",
      location: "São Paulo, Brazil",
      experience: "Specialist in Portraits & Photoshoots",
      enter: "View My Work",
      languageNote: "Language auto-detected • Change in menu"
    },
    navigation: {
      portfolio: "Portfolio",
      all: "All"
    },
    gallery: {
      mobileInstructions: {
        tap: "Tap to enlarge",
        swipe: "Swipe to navigate"
      },
      swipeHint: "Swipe to navigate",
      imageInfo: "of"
    },
    footer: {
      copyright: "All rights reserved."
    },
    modal: {
      close: "Close",
      previous: "Previous",
      next: "Next"
    },
    header: {
      mainTagline: "Professional Photographer in São Paulo",
      subTagline: "Photoshoots • Events • Artistic Portraits",
      credentials: "Graduated in Digital Photography from FIAP"
    },
    cta: {
      scheduleBadge: "Schedule Session",
      inlineTitle: "Liked what you saw?",
      inlineSubtitle: "Let's create something amazing together!",
      inlineButton: "WhatsApp Me",
      stickyTitle: "Ready for your session?",
      stickySubtitle: "Talk to me now!"
    },
    availability: {
      limited: "Limited Spots - January 2025",
      available: "Available Now",
      busy: "Fully Booked - February Available"
    }
  },
  ja: {
    welcome: {
      title: "私のポートフォリオへようこそ",
      subtitle: "特別な瞬間を捉える写真",
      selectLanguage: "言語を選択してください",
      professionalTitle: "レオ・オリ",
      tagline: "物語を語る芸術に瞬間を変える",
      education: "FIAP デジタル写真学科卒業",
      location: "サンパウロ、ブラジル",
      experience: "ポートレート＆撮影スペシャリスト",
      enter: "作品を見る",
      languageNote: "言語自動検出 • メニューで変更"
    },
    navigation: {
      portfolio: "ポートフォリオ",
      all: "すべて"
    },
    gallery: {
      mobileInstructions: {
        tap: "タップして拡大",
        swipe: "スワイプして移動"
      },
      swipeHint: "スワイプして移動",
      imageInfo: "の"
    },
    footer: {
      copyright: "全著作権所有。"
    },
    modal: {
      close: "閉じる",
      previous: "前へ",
      next: "次へ"
    },
    header: {
      mainTagline: "サンパウロのプロカメラマン",
      subTagline: "フォトシュート • イベント • アート写真",
      credentials: "FIAP デジタル写真学科卒業"
    },
    cta: {
      scheduleBadge: "予約する",
      inlineTitle: "気に入りましたか？",
      inlineSubtitle: "一緒に素晴らしいものを作りましょう！",
      inlineButton: "WhatsAppで連絡",
      stickyTitle: "撮影の準備はできましたか？",
      stickySubtitle: "今すぐお話ししましょう！"
    },
    availability: {
      limited: "限定枠 - 2025年1月",
      available: "現在利用可能",
      busy: "満席 - 2月利用可能"
    }
  }
};

export const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

export const getTranslation = (language: string): Translation => {
  return translations[language] || translations.pt;
};