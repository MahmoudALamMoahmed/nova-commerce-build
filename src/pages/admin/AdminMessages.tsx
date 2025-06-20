
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const AdminMessages = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View contact form submissions and customer messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-500">Message management functionality coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
