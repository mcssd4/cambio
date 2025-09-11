import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  CreditCard, 
  Building, 
  Clock, 
  Shield, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { transactionService } from '@/lib/firebaseService';

export function TransactionModal({ 
  isOpen, 
  onClose, 
  transactionData, 
  user, 
  onTransactionComplete 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    cpf: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateBankDetails = () => {
    const newErrors = {};
    
    if (!bankDetails.bankName.trim()) {
      newErrors.bankName = 'Nome do banco é obrigatório';
    }
    
    if (!bankDetails.accountNumber.trim()) {
      newErrors.accountNumber = 'Número da conta é obrigatório';
    }
    
    if (!bankDetails.accountHolder.trim()) {
      newErrors.accountHolder = 'Nome do titular é obrigatório';
    }
    
    if (!bankDetails.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(bankDetails.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitTransaction = async () => {
    if (!validateBankDetails()) return;

    setIsSubmitting(true);
    
    try {
      const fullTransactionData = {
        ...transactionData,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous@email.com',
        paymentMethod,
        bankDetails,
        transactionId: `TXN-${Date.now()}`,
        estimatedCompletion: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 horas
      };

      const result = await transactionService.createTransaction(fullTransactionData);
      
      if (result.success) {
        setCurrentStep(3);
        onTransactionComplete({
          ...fullTransactionData,
          id: result.id
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Confirme sua Transação</h3>
        <p className="text-gray-600">Revise os detalhes e escolha o método de pagamento</p>
      </div>

      {/* Resumo da Transação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Resumo da Conversão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {transactionData?.amount} {transactionData?.fromCurrency}
              </p>
              <p className="text-sm text-gray-600">Você envia</p>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400" />
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {transactionData?.convertedAmount} {transactionData?.toCurrency}
              </p>
              <p className="text-sm text-gray-600">Você recebe</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Taxa de câmbio:</span>
              <span className="font-medium">{transactionData?.exchangeRate}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de serviço:</span>
              <span className="font-medium">R$ 0,00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total a pagar:</span>
              <span>{transactionData?.amount} {transactionData?.fromCurrency}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pagamento */}
      <div className="space-y-3">
        <h4 className="font-semibold">Escolha o método de pagamento:</h4>
        
        <Button
          variant="outline"
          className="w-full h-auto p-4 justify-start"
          onClick={() => handlePaymentMethodSelect('bank_transfer')}
        >
          <Building className="h-5 w-5 mr-3" />
          <div className="text-left">
            <p className="font-medium">Transferência Bancária</p>
            <p className="text-sm text-gray-600">PIX ou TED - Processamento em até 12h</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4 justify-start"
          onClick={() => handlePaymentMethodSelect('credit_card')}
        >
          <CreditCard className="h-5 w-5 mr-3" />
          <div className="text-left">
            <p className="font-medium">Cartão de Crédito</p>
            <p className="text-sm text-gray-600">Processamento instantâneo</p>
          </div>
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <Shield className="h-4 w-4 text-blue-600" />
        <span>Suas informações estão protegidas com criptografia de ponta</span>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Dados Bancários</h3>
        <p className="text-gray-600">Informe os dados da conta que receberá o valor convertido</p>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="bankName">Nome do Banco *</Label>
          <Input
            id="bankName"
            placeholder="Ex: Banco do Brasil, Itaú, Bradesco..."
            value={bankDetails.bankName}
            onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
            className={errors.bankName ? 'border-red-500' : ''}
          />
          {errors.bankName && <p className="text-sm text-red-500 mt-1">{errors.bankName}</p>}
        </div>

        <div>
          <Label htmlFor="accountNumber">Número da Conta *</Label>
          <Input
            id="accountNumber"
            placeholder="Agência e conta (ex: 1234-5 / 12345-6)"
            value={bankDetails.accountNumber}
            onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
            className={errors.accountNumber ? 'border-red-500' : ''}
          />
          {errors.accountNumber && <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>}
        </div>

        <div>
          <Label htmlFor="accountHolder">Nome do Titular *</Label>
          <Input
            id="accountHolder"
            placeholder="Nome completo do titular da conta"
            value={bankDetails.accountHolder}
            onChange={(e) => handleBankDetailsChange('accountHolder', e.target.value)}
            className={errors.accountHolder ? 'border-red-500' : ''}
          />
          {errors.accountHolder && <p className="text-sm text-red-500 mt-1">{errors.accountHolder}</p>}
        </div>

        <div>
          <Label htmlFor="cpf">CPF do Titular *</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={bankDetails.cpf}
            onChange={(e) => handleBankDetailsChange('cpf', e.target.value)}
            className={errors.cpf ? 'border-red-500' : ''}
          />
          {errors.cpf && <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <span>Verifique os dados bancários. Informações incorretas podem atrasar o processo.</span>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button
          onClick={handleSubmitTransaction}
          disabled={isSubmitting}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Confirmar Transação'
          )}
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">Transação Enviada!</h3>
        <p className="text-gray-600">
          Sua solicitação de câmbio foi enviada para análise. Você receberá um e-mail com as instruções de pagamento.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>ID da Transação:</span>
              <span className="font-mono">{transactionData?.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant="outline" className="text-yellow-600">Pendente</Badge>
            </div>
            <div className="flex justify-between">
              <span>Prazo estimado:</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                12 horas úteis
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onClose}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Fechar
      </Button>
    </motion.div>
  );

  if (!transactionData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 && 'Confirmar Transação'}
            {currentStep === 2 && 'Dados Bancários'}
            {currentStep === 3 && 'Transação Enviada'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress Indicator */}
        {currentStep < 3 && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}

