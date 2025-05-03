
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useOrders, Order } from '@/context/OrderContext';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Orders = () => {
  const { user } = useUser();
  const { orders } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <a href="/products">Start Shopping</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>
                      Placed on {format(new Date(order.date), 'PPP')}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 md:items-center">
                    <Badge className={cn("w-fit", getStatusColor(order.status))}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <div>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between py-6 rounded-none border-t"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <span>
                    {expandedOrder === order.id ? 'Hide' : 'Show'} order details ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                  </span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedOrder === order.id && "transform rotate-180"
                  )} />
                </Button>
                
                {expandedOrder === order.id && (
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                  <span>{item.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={2} className="font-bold text-right">Total</TableCell>
                            <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
