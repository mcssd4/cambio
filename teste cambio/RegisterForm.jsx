import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, User, Mail, Phone, MapPin, Globe, FileText, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService, uploadService } from '@/lib/firebaseService';

const countries = [
  'Brasil', 'Estados Unidos', 'Reino Unido', 'Alemanha', 'França', 'Espanha', 
  'Itália', 'Canadá', 'Austrália', 'Japão', 'China', 'Tailândia', 'Outros'
];

export function RegisterForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    nationality: '',
    idDocument: null,
    selfiePhoto: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.nationality) newErrors.nationality = 'Nacionalidade é obrigatória';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
      if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
      if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
      if (!formData.country) newErrors.country = 'País é obrigatório';
    }

    if (step === 3) {
      if (!formData.idDocument) newErrors.idDocument = 'Documento de identidade é obrigatório';
      if (!formData.selfiePhoto) newErrors.selfiePhoto = 'Selfie é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      setIsSubmitting(true);
      
      try {
        // Upload dos arquivos
        let idDocumentUrl = '';
        let selfiePhotoUrl = '';

        if (formData.idDocument) {
          const idUploadResult = await uploadService.uploadFile(
            formData.idDocument, 
            `documents/${Date.now()}_${formData.idDocument.name}`
          );
          if (idUploadResult.success) {
            idDocumentUrl = idUploadResult.url;
          } else {
            throw new Error('Erro ao fazer upload do documento');
          }
        }

        if (formData.selfiePhoto) {
          const selfieUploadResult = await uploadService.uploadFile(
            formData.selfiePhoto, 
            `selfies/${Date.now()}_${formData.selfiePhoto.name}`
          );
          if (selfieUploadResult.success) {
            selfiePhotoUrl = selfieUploadResult.url;
          } else {
            throw new Error('Erro ao fazer upload da selfie');
          }
        }

        // Preparar dados para envio
        const registrationData = {
          ...formData,
          idDocumentUrl,
          selfiePhotoUrl,
          idDocument: formData.idDocument?.name || '',
          selfiePhoto: formData.selfiePhoto?.name || ''
        };

        // Salvar no Firebase
        const result = await userService.createUserRegistration(registrationData);
        
        if (result.success) {
          onSubmit({ ...registrationData, id: result.id });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Erro ao enviar cadastro:', error);
        setErrors({ submit: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="fullName">Nome Completo *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fullName"
              placeholder="Digite seu nome completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <Label htmlFor="email">E-mail *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="nationality">Nacionalidade *</Label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione sua nacionalidade" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && <p className="text-sm text-red-500 mt-1">{errors.nationality}</p>}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="address">Endereço Completo *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              id="address"
              placeholder="Rua, número, complemento"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`pl-10 min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              placeholder="Cidade"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              placeholder="Estado"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={errors.state ? 'border-red-500' : ''}
            />
            {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">CEP *</Label>
            <Input
              id="zipCode"
              placeholder="00000-000"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className={errors.zipCode ? 'border-red-500' : ''}
            />
            {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
          </div>

          <div>
            <Label htmlFor="country">País *</Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verificação de Identidade</h3>
        <p className="text-sm text-gray-600">
          Para sua segurança, precisamos verificar sua identidade
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Documento de Identidade (RG/CNH) *</Label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            formData.idDocument ? 'border-green-300 bg-green-50' : 
            errors.idDocument ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('idDocument', e.target.files[0])}
              className="hidden"
              id="idDocument"
            />
            <label htmlFor="idDocument" className="cursor-pointer">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.idDocument ? formData.idDocument.name : 'Clique para enviar seu documento'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
            </label>
          </div>
          {errors.idDocument && <p className="text-sm text-red-500 mt-1">{errors.idDocument}</p>}
        </div>

        <div>
          <Label>Selfie para Comparação *</Label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            formData.selfiePhoto ? 'border-green-300 bg-green-50' : 
            errors.selfiePhoto ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('selfiePhoto', e.target.files[0])}
              className="hidden"
              id="selfiePhoto"
            />
            <label htmlFor="selfiePhoto" className="cursor-pointer">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.selfiePhoto ? formData.selfiePhoto.name : 'Clique para enviar sua selfie'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
            </label>
          </div>
          {errors.selfiePhoto && <p className="text-sm text-red-500 mt-1">{errors.selfiePhoto}</p>}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Dicas para uma boa verificação:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Certifique-se de que o documento esteja legível</li>
          <li>• A selfie deve mostrar claramente seu rosto</li>
          <li>• Use boa iluminação para as fotos</li>
          <li>• Evite reflexos ou sombras</li>
        </ul>
      </div>
    </motion.div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Cadastro de Usuário
        </CardTitle>
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600">
            {currentStep === 1 && 'Informações Pessoais'}
            {currentStep === 2 && 'Endereço'}
            {currentStep === 3 && 'Verificação de Identidade'}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Próximo
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

