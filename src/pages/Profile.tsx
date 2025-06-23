
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUser } from '@/context/UserContext';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, logout, userProfile } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
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

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      
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
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
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
                        <FormLabel>Name</FormLabel>
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
                        <FormLabel>Email</FormLabel>
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
