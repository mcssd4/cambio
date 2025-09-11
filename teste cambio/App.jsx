import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LanguageModal } from './components/LanguageModal';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { AdminPanel } from './components/AdminPanel';
import { CurrencyCalculator } from './components/CurrencyCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Shield, Clock, Users, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [user, setUser] = useState({ 
    email: 'admin@cambiomax.com', 
    name: 'Administrador',
    role: 'admin' 
  });

  useEffect(() => {
    // Mostrar modal de idioma na primeira visita
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowLanguageModal(true);
      localStorage.setItem('hasVisited', 'true');
    } else {
      setShowLanguageModal(false);
    }
  }, []);

  const handleLanguageSelect = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const handleExchange = (exchangeData) => {
    console.log('Exchange data:', exchangeData);
    // Aqui será implementado o fluxo de transação
    alert('Funcionalidade de câmbio será implementada na próxima fase!');
  };

  const handleLogin = (loginData) => {
    console.log('Login data:', loginData);
    // Aqui será implementada a autenticação
    setUser({ email: loginData.email, name: 'Usuário' });
    alert('Login realizado com sucesso!');
  };

  const handleRegister = (registerData) => {
    console.log('Register data:', registerData);
    // Aqui será implementado o registro no Firebase
    alert('Cadastro enviado para aprovação! Você receberá um e-mail em breve.');
  };

  const features = [
    {
      icon: Shield,
      title: 'Segurança Garantida',
      description: 'Transações protegidas com criptografia de ponta e certificações internacionais.'
    },
    {
      icon: TrendingUp,
      title: 'Melhores Taxas',
      description: 'Oferecemos as taxas mais competitivas do mercado com transparência total.'
    },
    {
      icon: Clock,
      title: 'Processamento Rápido',
      description: 'Suas transações são processadas em até 12 horas úteis.'
    },
    {
      icon: Users,
      title: 'Suporte 24/7',
      description: 'Nossa equipe está sempre disponível para ajudar você.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Empresária',
      content: 'Excelente serviço! Consegui fazer meu câmbio com a melhor taxa do mercado.',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Investidor',
      content: 'Processo muito simples e seguro. Recomendo para todos.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Viajante',
      content: 'Perfeito para quem viaja muito. Sempre uso o CambioMax.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Language Modal */}
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onLanguageSelect={handleLanguageSelect}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onLanguageSelect={handleLanguageSelect}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />

      {/* Header */}
      <Header
        onLanguageClick={() => setIsLanguageModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        onAdminClick={() => setIsAdminPanelOpen(true)}
        currentLanguage={currentLanguage}
        user={user}
      />

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Câmbio de Moedas
              <span className="text-primary block">Profissional</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Converta suas moedas com segurança, rapidez e as melhores taxas do mercado. 
              Mais de 100.000 clientes confiam em nossos serviços.
            </p>
          </motion.div>

          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <CurrencyCalculator onExchange={handleExchange} user={user} />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o CambioMax?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em câmbio de moedas com tecnologia de ponta e atendimento personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Processo simples e seguro em apenas 3 passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Calcule e Solicite',
                description: 'Use nossa calculadora para ver a cotação em tempo real e solicite seu câmbio.'
              },
              {
                step: '2',
                title: 'Faça o Pagamento',
                description: 'Realize o pagamento via PIX (Brasil) ou depósito bancário (outros países).'
              },
              {
                step: '3',
                title: 'Receba sua Moeda',
                description: 'Em até 12 horas, você recebe o valor convertido em sua conta.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais de 100.000 clientes satisfeitos confiam em nossos serviços
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para fazer seu câmbio?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de clientes que já economizaram com nossas taxas competitivas.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-primary hover:text-primary/90 font-semibold px-8 py-3 text-lg"
            >
              Começar Agora
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CambioMax</h3>
              <p className="text-gray-400">
                Sua plataforma confiável para câmbio de moedas com segurança e as melhores taxas.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Câmbio de Moedas</li>
                <li>Remessas Internacionais</li>
                <li>Consultoria Financeira</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
                <li>Regulamentações</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CambioMax. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      {isAdminPanelOpen && (
        <AdminPanel
          user={user}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

