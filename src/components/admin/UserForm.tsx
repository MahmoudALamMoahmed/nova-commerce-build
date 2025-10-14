
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  is_admin: z.boolean(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  is_admin: boolean;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onSuccess: () => void;
}

const UserForm = ({ isOpen, onClose, user, onSuccess }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      is_admin: false,
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email,
        is_admin: user.is_admin,
        password: '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        is_admin: false,
        password: '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && user) {
        // Update existing user via edge function
        const { data: result, error } = await supabase.functions.invoke('admin-manage-user', {
          body: {
            action: 'update',
            userId: user.id,
            name: data.name,
            email: data.email,
            isAdmin: data.is_admin,
          },
        });

        if (error) {
          console.error('Error updating user:', error);
          toast.error('Failed to update user');
          return;
        }

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success('User updated successfully!');
      } else {
        // Create new user via edge function
        if (!data.password) {
          toast.error('Password is required for new users');
          return;
        }

        const { data: result, error } = await supabase.functions.invoke('admin-manage-user', {
          body: {
            action: 'create',
            name: data.name,
            email: data.email,
            password: data.password,
            isAdmin: data.is_admin,
          },
        });

        if (error) {
          console.error('Error creating user:', error);
          toast.error('Failed to create user');
          return;
        }

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success('User created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('User operation error:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} user. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update user information and permissions.'
              : 'Add a new user to the system.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" />
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
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="is_admin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Administrator</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Grant admin privileges to this user
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update User' : 'Create User'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
