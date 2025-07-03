import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodProps {
  method: string;
  compact?: boolean;
}

export const PaymentMethod = ({ method, compact = false }: PaymentMethodProps) => {
  const getPaymentDisplay = (method: string) => {
    switch (method) {
      case 'cash':
        return {
          icon: <Banknote className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />,
          label: compact ? 'Cash' : 'Cash on Delivery'
        };
      case 'online':
        return {
          icon: <CreditCard className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />,
          label: compact ? 'Card' : 'Online Payment'
        };
      default:
        return {
          icon: <Banknote className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />,
          label: compact ? 'Cash' : 'Not specified'
        };
    }
  };

  const payment = getPaymentDisplay(method);

  return (
    <div className={`flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
      {payment.icon}
      <span>{payment.label}</span>
    </div>
  );
};