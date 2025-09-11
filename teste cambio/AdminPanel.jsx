import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userService, transactionService } from '@/lib/firebaseService';

export function AdminPanel({ user, onClose }) {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se o usuário tem permissão de admin
  const isAdmin = user?.email === 'admin@cambiomax.com' || user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [registrationsResult, transactionsResult] = await Promise.all([
        userService.getPendingRegistrations(),
        transactionService.getPendingTransactions()
      ]);

      if (registrationsResult.success) {
        setPendingRegistrations(registrationsResult.data);
      }

      if (transactionsResult.success) {
        setPendingTransactions(transactionsResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRegistration = async (registrationId) => {
    try {
      const result = await userService.updateRegistrationStatus(
        registrationId, 
        'approved', 
        actionNotes
      );
      
      if (result.success) {
        await loadData();
        setIsDetailModalOpen(false);
        setActionNotes('');
        alert('Cadastro aprovado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao aprovar cadastro:', error);
      alert('Erro ao aprovar cadastro');
    }
  };

  const handleRejectRegistration = async (registrationId) => {
    try {
      const result = await userService.updateRegistrationStatus(
        registrationId, 
        'rejected', 
        actionNotes
      );
      
      if (result.success) {
        await loadData();
        setIsDetailModalOpen(false);
        setActionNotes('');
        alert('Cadastro rejeitado');
      }
    } catch (error) {
      console.error('Erro ao rejeitar cadastro:', error);
      alert('Erro ao rejeitar cadastro');
    }
  };

  const handleApproveTransaction = async (transactionId) => {
    try {
      const result = await transactionService.updateTransactionStatus(
        transactionId, 
        'approved'
      );
      
      if (result.success) {
        await loadData();
        setIsDetailModalOpen(false);
        alert('Transação aprovada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao aprovar transação:', error);
      alert('Erro ao aprovar transação');
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    try {
      const result = await transactionService.updateTransactionStatus(
        transactionId, 
        'rejected'
      );
      
      if (result.success) {
        await loadData();
        setIsDetailModalOpen(false);
        alert('Transação rejeitada');
      }
    } catch (error) {
      console.error('Erro ao rejeitar transação:', error);
      alert('Erro ao rejeitar transação');
    }
  };

  const openDetailModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setIsDetailModalOpen(true);
    setActionNotes('');
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Você não tem permissão para acessar o painel administrativo.</p>
            <Button onClick={onClose}>Fechar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Painel Administrativo</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
          <p className="text-gray-600 mt-1">Gerencie cadastros e transações pendentes</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="registrations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registrations" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cadastros Pendentes ({pendingRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transações Pendentes ({pendingTransactions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="registrations" className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : pendingRegistrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum cadastro pendente
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingRegistrations.map((registration) => (
                    <Card key={registration.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{registration.fullName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {registration.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {registration.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                {registration.nationality}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {registration.createdAt?.toDate?.()?.toLocaleDateString() || 'Data não disponível'}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(registration, 'registration')}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : pendingTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma transação pendente
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingTransactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {transaction.fromCurrency} → {transaction.toCurrency}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                              <span>Valor: {transaction.amount} {transaction.fromCurrency}</span>
                              <span>Convertido: {transaction.convertedAmount} {transaction.toCurrency}</span>
                              <span>Taxa: {transaction.exchangeRate}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {transaction.createdAt?.toDate?.()?.toLocaleDateString() || 'Data não disponível'}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(transaction, 'transaction')}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedItem?.type === 'registration' ? 'Detalhes do Cadastro' : 'Detalhes da Transação'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4">
                {selectedItem.type === 'registration' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome Completo</Label>
                        <p className="font-medium">{selectedItem.fullName}</p>
                      </div>
                      <div>
                        <Label>E-mail</Label>
                        <p className="font-medium">{selectedItem.email}</p>
                      </div>
                      <div>
                        <Label>Telefone</Label>
                        <p className="font-medium">{selectedItem.phone}</p>
                      </div>
                      <div>
                        <Label>Nacionalidade</Label>
                        <p className="font-medium">{selectedItem.nationality}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Endereço Completo</Label>
                      <p className="font-medium">{selectedItem.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Cidade</Label>
                        <p className="font-medium">{selectedItem.city}</p>
                      </div>
                      <div>
                        <Label>Estado</Label>
                        <p className="font-medium">{selectedItem.state}</p>
                      </div>
                      <div>
                        <Label>CEP</Label>
                        <p className="font-medium">{selectedItem.zipCode}</p>
                      </div>
                    </div>

                    {selectedItem.idDocumentUrl && (
                      <div>
                        <Label>Documento de Identidade</Label>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedItem.idDocumentUrl, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Ver Documento
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedItem.selfiePhotoUrl && (
                      <div>
                        <Label>Foto Selfie</Label>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedItem.selfiePhotoUrl, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Ver Foto
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Moeda de Origem</Label>
                        <p className="font-medium">{selectedItem.fromCurrency}</p>
                      </div>
                      <div>
                        <Label>Moeda de Destino</Label>
                        <p className="font-medium">{selectedItem.toCurrency}</p>
                      </div>
                      <div>
                        <Label>Valor Original</Label>
                        <p className="font-medium">{selectedItem.amount} {selectedItem.fromCurrency}</p>
                      </div>
                      <div>
                        <Label>Valor Convertido</Label>
                        <p className="font-medium">{selectedItem.convertedAmount} {selectedItem.toCurrency}</p>
                      </div>
                      <div>
                        <Label>Taxa de Câmbio</Label>
                        <p className="font-medium">{selectedItem.exchangeRate}</p>
                      </div>
                      <div>
                        <Label>Data da Transação</Label>
                        <p className="font-medium">
                          {selectedItem.createdAt?.toDate?.()?.toLocaleString() || 'Data não disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Adicione observações sobre esta ação..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      if (selectedItem.type === 'registration') {
                        handleApproveRegistration(selectedItem.id);
                      } else {
                        handleApproveTransaction(selectedItem.id);
                      }
                    }}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (selectedItem.type === 'registration') {
                        handleRejectRegistration(selectedItem.id);
                      } else {
                        handleRejectTransaction(selectedItem.id);
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeitar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

