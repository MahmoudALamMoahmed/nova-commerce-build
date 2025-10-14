import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EmptyOrders = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{t('orders.noOrders')}</h3>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          {t('orders.noOrdersDesc')}
        </p>
        <Button size="lg" asChild className="px-8">
          <a href="/products">{t('orders.startShopping')}</a>
        </Button>
      </CardContent>
    </Card>
  );
};