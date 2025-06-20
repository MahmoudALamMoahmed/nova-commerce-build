
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-500">User management functionality coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
