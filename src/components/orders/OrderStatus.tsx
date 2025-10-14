import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Truck, Package, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderStatusProps {
  status: string;
}

export const OrderStatus = ({ status }: OrderStatusProps) => {
  const { t } = useTranslation();
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          variant: 'warning' as const,
          icon: <Calendar className="h-4 w-4" />,
          label: t('orders.pending')
        };
      case 'confirmed':
        return {
          variant: 'info' as const,
          icon: <CheckCircle className="h-4 w-4" />,
          label: t('orders.confirmed')
        };
      case 'shipped':
        return {
          variant: 'secondary' as const,
          icon: <Truck className="h-4 w-4" />,
          label: t('orders.shipped')
        };
      case 'cancelled':
        return {
          variant: 'destructive' as const,
          icon: <XCircle className="h-4 w-4" />,
          label: t('orders.cancelled')
        };
      case 'delivered':
        return {
          variant: 'success' as const,
          icon: <CheckCircle className="h-4 w-4" />,
          label: t('orders.delivered')
        };
      default:
        return {
          variant: 'outline' as const,
          icon: <Package className="h-4 w-4" />,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className="flex items-center gap-1.5 w-fit px-3 py-1.5 transition-all duration-200 hover:scale-105 hover:shadow-md"
    >
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
};