import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useUser } from '@/context/UserContext';
import { useAddresses } from '@/context/AddressContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Edit2, Trash2, MapPin } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

const addressSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postal_code: z.string().min(3, 'Postal code must be at least 3 characters'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout, userProfile } = useUser();
  const { addresses, addAddress, updateAddress, deleteAddress, isLoading } = useAddresses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: '',
      street: '',
      city: '',
      postal_code: '',
      phone_number: '',
    },
  });

  // Fetch current user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        form.reset({
          name: data.name || user.user_metadata?.name || user.user_metadata?.full_name || '',
          email: data.email || user.email || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update user profile in our users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: data.name,
          email: data.email,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // If email changed, update in Supabase Auth
      if (data.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: data.email,
        });

        if (authError) {
          console.error('Auth email update error:', authError);
          toast.error('Profile updated, but email change requires verification');
        } else {
          toast.success('Profile updated! Please check your email to confirm the new address.');
        }
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAddressSubmit = async (data: AddressFormValues) => {
    // Ensure all required fields are present
    const addressData = {
      full_name: data.full_name,
      street: data.street,
      city: data.city,
      postal_code: data.postal_code,
      phone_number: data.phone_number,
    };

    let success = false;
    
    if (editingAddress) {
      success = await updateAddress(editingAddress.id, addressData);
    } else {
      success = await addAddress(addressData);
    }

    if (success) {
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      addressForm.reset();
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    addressForm.reset({
      full_name: address.full_name,
      street: address.street,
      city: address.city,
      postal_code: address.postal_code,
      phone_number: address.phone_number,
    });
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(addressId);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    addressForm.reset();
    setIsAddressDialogOpen(true);
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('profile.title')}</h1>
      
      <div className="grid md:grid-cols-12 gap-8">
        {/* Left sidebar */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={logout}
                >
                  {t('nav.logout')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-8 space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.name')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-brand-accent hover:bg-brand-accent/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('profile.updateProfile')}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Addresses Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('profile.addresses')}</CardTitle>
                  <CardDescription>
                    Manage your shipping addresses
                  </CardDescription>
                </div>
                <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddNewAddress}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('profile.addAddress')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingAddress ? t('profile.editAddress') : t('profile.addAddress')}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...addressForm}>
                      <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                        <FormField
                          control={addressForm.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.fullName')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addressForm.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.street')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={addressForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('profile.city')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="postal_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('profile.postalCode')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={addressForm.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.phoneNumber')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent/90">
                          {editingAddress ? t('profile.editAddress') : t('profile.addAddress')}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading addresses...</span>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('profile.noAddresses')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{address.full_name}</h4>
                            <p className="text-gray-600 mt-1">
                              {address.street}<br />
                              {address.city}, {address.postal_code}<br />
                              {address.phone_number}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
