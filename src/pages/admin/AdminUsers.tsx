
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Users, Trash2, Shield, ShieldCheck } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

const AdminUsers = () => {
  const { user, userProfile, isLoading } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  // Check if user is admin
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!user || !userProfile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    // Prevent user from removing their own admin status
    if (userId === user.id && currentAdminStatus) {
      toast.error('You cannot remove your own admin status');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentAdminStatus })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User ${!currentAdminStatus ? 'promoted to' : 'demoted from'} admin`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId: string) => {
    // Prevent user from deleting themselves
    if (userId === user.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-gray-600">View and manage registered users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Users ({users.length})
          </CardTitle>
          <CardDescription>
            Manage user accounts, admin permissions, and user data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isUsersLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell className="font-medium">
                      {userItem.email}
                      {userItem.id === user.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          You
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(userItem.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {userItem.is_admin ? (
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <Shield className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={userItem.is_admin}
                          onCheckedChange={() => toggleAdminStatus(userItem.id, userItem.is_admin)}
                          disabled={userItem.id === user.id}
                        />
                        <span className="text-sm text-gray-600">
                          {userItem.is_admin ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(userItem.id)}
                        disabled={userItem.id === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {users.length === 0 && !isUsersLoading && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">No registered users in the system yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
