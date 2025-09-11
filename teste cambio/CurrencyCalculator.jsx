import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, TrendingUp, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { TransactionModal } from './TransactionModal';

const currencies = [
  { code: 'USD', name: 'Dólar Americano', symbol: '$', rate: 5.20 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 5.65 },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', rate: 6.45 },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥', rate: 0.035 },
  { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$', rate: 3.85 },
  { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', rate: 3.45 },
  { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF', rate: 5.75 },
];

export function CurrencyCalculator({ onExchange, user }) {
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      calculateExchange();
    }
  }, [amount, fromCurrency, toCurrency]);

  const calculateExchange = () => {
    const numAmount = parseFloat(amount) || 0;
    let rate = 1;

    if (fromCurrency === 'BRL' && toCurrency !== 'BRL') {
      const targetCurrency = currencies.find(c => c.code === toCurrency);
      rate = targetCurrency ? 1 / targetCurrency.rate : 1;
    } else if (fromCurrency !== 'BRL' && toCurrency === 'BRL') {
      const sourceCurrency = currencies.find(c => c.code === fromCurrency);
      rate = sourceCurrency ? sourceCurrency.rate : 1;
    } else if (fromCurrency !== 'BRL' && toCurrency !== 'BRL') {
      const sourceCurrency = currencies.find(c => c.code === fromCurrency);
      const targetCurrency = currencies.find(c => c.code === toCurrency);
      if (sourceCurrency && targetCurrency) {
        rate = sourceCurrency.rate / targetCurrency.rate;
      }
    }

    // Aplicar taxa de 0.4%
    const feeRate = rate * 0.996; // 100% - 0.4% = 99.6%
    const converted = numAmount * feeRate;
    
    setExchangeRate(feeRate);
    setConvertedAmount(converted);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleExchange = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    if (!user) {
      alert('Você precisa estar logado para fazer uma transação');
      return;
    }

    const transactionInfo = {
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      convertedAmount: convertedAmount.toFixed(2),
      exchangeRate: exchangeRate.toFixed(4),
      timestamp: new Date().toISOString()
    };

    setTransactionData(transactionInfo);
    setIsTransactionModalOpen(true);
  };

  const getCurrencySymbol = (code) => {
    if (code === 'BRL') return 'R$';
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-primary mb-2">
            Calculadora de Câmbio
          </CardTitle>
          <p className="text-gray-600">
            Converta suas moedas com as melhores taxas do mercado
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">De</label>
            <div className="flex space-x-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-lg"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapCurrencies}
              className="rounded-full p-2 hover:bg-primary/10"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Para</label>
            <div className="flex space-x-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 bg-gray-50 border rounded-md px-3 py-2 text-lg font-semibold text-primary">
                {getCurrencySymbol(toCurrency)} {convertedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {exchangeRate > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-4 rounded-lg border border-blue-200"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Taxa de câmbio:</span>
                <span className="font-semibold">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Taxa aplicada:</span>
                <span className="text-green-600 font-semibold">0.4%</span>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleExchange}
            disabled={!amount || convertedAmount <= 0}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
          >
            Fazer o Câmbio
          </Button>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">100% Seguro</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Melhor Taxa</p>
            </div>
            <div className="text-center">
              <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Rápido</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transactionData={transactionData}
        user={user}
        onTransactionComplete={(transaction) => {
          console.log('Transação criada:', transaction);
          // Aqui você pode adicionar lógica adicional após a transação
        }}
      />
    </div>
  );
}

