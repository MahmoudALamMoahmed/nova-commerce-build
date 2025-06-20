
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage application settings and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-500">Settings management functionality coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
