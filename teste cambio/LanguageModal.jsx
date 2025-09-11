import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

const languages = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageModal({ isOpen, onClose, onLanguageSelect }) {
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    onLanguageSelect(languageCode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Selecione seu idioma
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 mt-4">
          {languages.map((language, index) => (
            <motion.div
              key={language.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start h-12 text-left hover:bg-primary/10 transition-colors"
                onClick={() => handleLanguageSelect(language.code)}
              >
                <span className="text-2xl mr-3">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

