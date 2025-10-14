import { CreditCard, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentMethodProps {
  method: string;
  compact?: boolean;
}

export const PaymentMethod = ({ method, compact = false }: PaymentMethodProps) => {
  const { t } = useTranslation();
  
  const getPaymentDisplay = (method: string) => {
    switch (method) {
      case 'cash':
        return {
          icon: <Banknote className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />,
          label: compact ? t('cart.cash') : t('cart.cashOnDelivery')
        };
      case 'online':
        return {
          icon: <CreditCard className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />,
          label: compact ? t('cart.card') : t('cart.onlinePayment')
        };
      default:
        return {
          icon: <Banknote className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />,
          label: compact ? t('cart.cash') : t('cart.notSpecified')
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