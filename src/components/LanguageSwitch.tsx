type LanguageSwitchProps = {
  language: 'en' | 'ru';
  onLanguageChange: (language: 'en' | 'ru') => void;
};

export function LanguageSwitch({ language, onLanguageChange }: LanguageSwitchProps) {
  return (
    <div className="language-switch" aria-label="Language switch">
      <button className={language === 'en' ? 'active' : ''} type="button" onClick={() => onLanguageChange('en')}>
        English
      </button>
      <button className={language === 'ru' ? 'active' : ''} type="button" onClick={() => onLanguageChange('ru')}>
        Русский
      </button>
    </div>
  );
}
