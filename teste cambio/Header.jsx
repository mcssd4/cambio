import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ onLanguageClick, onLoginClick, onRegisterClick, onAdminClick, currentLanguage, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languageNames = {
    'pt-BR': 'PT',
    'en-US': 'EN',
    'es-ES': 'ES'
  };

  const isAdmin = user?.email === 'admin@cambiomax.com' || user?.role === 'admin';

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">CambioMax</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary transition-colors">
              Início
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageClick}
              className="flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span>{languageNames[currentLanguage] || 'PT'}</span>
            </Button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Olá, {user.name}</span>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onAdminClick}
                      className="flex items-center gap-1"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Sair
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={onLoginClick}>
                    Entrar
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onRegisterClick}>
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <nav className="flex flex-col space-y-2">
                <a href="#home" className="text-gray-700 hover:text-primary transition-colors px-3 py-2">
                  Início
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors px-3 py-2">
                  Como Funciona
                </a>
                <a href="#about" className="text-gray-700 hover:text-primary transition-colors px-3 py-2">
                  Sobre
                </a>
                <a href="#contact" className="text-gray-700 hover:text-primary transition-colors px-3 py-2">
                  Contato
                </a>
              </nav>
              
              <div className="border-t border-gray-200 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLanguageClick}
                  className="flex items-center space-x-1 w-full justify-start px-3"
                >
                  <Globe className="h-4 w-4" />
                  <span>{languageNames[currentLanguage] || 'PT'}</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2">
                {user ? (
                  <div className="flex flex-col w-full space-y-2">
                    <span className="text-sm text-gray-700">Olá, {user.name}</span>
                    <div className="flex space-x-2">
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={onAdminClick}
                          className="flex items-center gap-1 flex-1"
                        >
                          <Settings className="h-4 w-4" />
                          Admin
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="flex-1">
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={onLoginClick}>
                      Entrar
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={onRegisterClick}>
                      Cadastrar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

