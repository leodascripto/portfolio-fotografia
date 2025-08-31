// src/lib/i18n.ts
export interface Translation {
  welcome: {
    title: string;
    subtitle: string;
    selectLanguage: string;
    enter: string;
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
    imageInfo: string; // "X de Y"
  };
  footer: {
    copyright: string;
  };
  modal: {
    close: string;
    previous: string;
    next: string;
  };
}

export const translations: Record<string, Translation> = {
  pt: {
    welcome: {
      title: "Bem-vindo ao meu Portfolio",
      subtitle: "Fotografia que captura momentos únicos",
      selectLanguage: "Escolha seu idioma",
      enter: "Entrar"
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
    }
  },
  en: {
    welcome: {
      title: "Welcome to my Portfolio",
      subtitle: "Photography that captures unique moments",
      selectLanguage: "Choose your language",
      enter: "Enter"
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
    }
  },
  ja: {
    welcome: {
      title: "私のポートフォリオへようこそ",
      subtitle: "特別な瞬間を捉える写真",
      selectLanguage: "言語を選択してください",
      enter: "入る"
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