import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Truck, Package } from 'lucide-react';

interface OrderStatusProps {
  status: string;
}

export const OrderStatus = ({ status }: OrderStatusProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Calendar className="h-4 w-4" />,
          label: 'Pending'
        };
      case 'confirmed':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Confirmed'
        };
      case 'shipped':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Truck className="h-4 w-4" />,
          label: 'Shipped'
        };
      case 'cancelled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <Package className="h-4 w-4" />,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <Package className="h-4 w-4" />,
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.color} flex items-center gap-1.5 w-fit px-3 py-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};