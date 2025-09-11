import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RegisterForm } from './RegisterForm';

export function RegisterModal({ isOpen, onClose, onRegister }) {
  const handleRegister = (formData) => {
    console.log('Registration data:', formData);
    onRegister(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <RegisterForm onSubmit={handleRegister} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}

