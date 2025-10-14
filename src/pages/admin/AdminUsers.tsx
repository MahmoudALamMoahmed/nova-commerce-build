
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Users, Trash2, Shield, ShieldCheck, Edit, Plus } from 'lucide-react';
import UserForm from '@/components/admin/UserForm';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  is_admin: boolean;
  created_at: string;
}

const AdminUsers = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { user, userProfile, isLoading } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

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
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        toast.error('Failed to fetch users');
        return;
      }

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'admin');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      // Create a set of admin user IDs for quick lookup
      const adminUserIds = new Set(rolesData?.map(r => r.user_id) || []);

      // Combine user data with admin status
      const usersWithRoles = (usersData || []).map(user => ({
        ...user,
        is_admin: adminUserIds.has(user.id)
      }));

      setUsers(usersWithRoles);
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
      if (!currentAdminStatus) {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
        toast.success('User promoted to admin');
      } else {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
        toast.success('User demoted from admin');
      }

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
      const { data: result, error } = await supabase.functions.invoke('admin-manage-user', {
        body: {
          action: 'delete',
          userId: userId,
        },
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleEditUser = (userToEdit: UserProfile) => {
    setEditingUser(userToEdit);
    setShowUserForm(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleFormClose = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleFormSuccess = () => {
    fetchUsers();
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-gray-600">View and manage registered users</p>
          </div>
          <Button 
            onClick={handleCreateUser}
            className="bg-brand-accent hover:bg-brand-accent/90"
          >
            <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            Create New User
          </Button>
        </div>
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
                  <TableHead className={`${isRTL ? "text-right" : "text-left"}`}>Name</TableHead>
                  <TableHead className={`${isRTL ? "text-right" : "text-left"}`}>Email</TableHead>
                  <TableHead className={`${isRTL ? "text-right" : "text-left"}`}>Registration Date</TableHead>
                  <TableHead className={`${isRTL ? "text-right" : "text-left"}`}>Admin Status</TableHead>
                  <TableHead className={`${isRTL ? "text-right" : "text-left"}`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell className="font-medium">
                      {userItem.name || 'No name set'}
                      {userItem.id === user.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          You
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{userItem.email}</TableCell>
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
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(userItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(userItem.id)}
                          disabled={userItem.id === user.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

      <UserForm
        isOpen={showUserForm}
        onClose={handleFormClose}
        user={editingUser}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AdminUsers;
