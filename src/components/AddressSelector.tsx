
import { useState } from 'react';
import { useAddresses, Address } from '@/context/AddressContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, MapPin } from 'lucide-react';

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
}

const AddressSelector = ({ selectedAddressId, onAddressSelect }: AddressSelectorProps) => {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { addresses, addAddress, isLoading } = useAddresses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    street: '',
    city: '',
    postal_code: '',
    phone_number: ''
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress(formData);
    if (success) {
      setFormData({
        full_name: '',
        street: '',
        city: '',
        postal_code: '',
        phone_number: ''
      });
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div>Loading addresses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('cart.selectShippingAddress')}</h3>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('profile.addAddress')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('profile.addNewAddress')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  {t('profile.fullName')}
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  {t('profile.street')}
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    {t('profile.city')}
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                    {t('profile.postalCode')}
                  </Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  {t('profile.phoneNumber')}
                </Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t('profile.addAddress')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>


      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No addresses saved. Add one to continue.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`cursor-pointer transition-colors ${
                selectedAddressId === address.id 
                  ? 'ring-2 ring-brand-accent bg-brand-accent/5' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onAddressSelect(address.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{address.full_name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.street}<br />
                      {address.city}, {address.postal_code}<br />
                      {address.phone_number}
                    </p>
                  </div>
                  {selectedAddressId === address.id && (
                    <div className="w-4 h-4 rounded-full bg-brand-accent"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
