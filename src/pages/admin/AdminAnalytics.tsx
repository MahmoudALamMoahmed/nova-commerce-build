import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface StorageUsage {
  usedBytes: number;
  usedMB: number;
  usedGB: number;
  percentage: number;
  totalGB: number;
}

const AdminAnalytics = () => {
  const [storageUsage, setStorageUsage] = useState<StorageUsage>({ 
    usedBytes: 0, usedMB: 0, usedGB: 0, percentage: 0, totalGB: 2 
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStorageUsage = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('product-images')
        .list('', { limit: 1000 });

      if (error) {
        console.error('Error fetching storage files:', error);
        return;
      }

      let totalBytes = 0;
      if (files) {
        for (const file of files) {
          if (file.metadata?.size) {
            totalBytes += file.metadata.size;
          }
        }
      }

      const totalGB = 1; // Supabase free plan limit is 1GB
      const usedMB = totalBytes / (1024 * 1024);
      const usedGB = totalBytes / (1024 * 1024 * 1024);
      const percentage = (usedGB / totalGB) * 100;

      setStorageUsage({
        usedBytes: totalBytes,
        usedMB: Math.round(usedMB * 100) / 100,
        usedGB: Math.round(usedGB * 1000) / 1000,
        percentage: Math.round(percentage * 10) / 10,
        totalGB
      });
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchStorageUsage();
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Monitor your application's storage usage and performance metrics.
        </p>
      </div>

      {/* Storage Usage Card */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Supabase Storage Usage
            </CardTitle>
            <CardDescription>
              Track your storage usage in the product-images bucket
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm text-muted-foreground">
                  {storageUsage.percentage}%
                </span>
              </div>
              <Progress value={storageUsage.percentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {storageUsage.usedMB < 1024 
                    ? `${storageUsage.usedMB} MB used` 
                    : `${storageUsage.usedGB} GB used`
                  }
                </span>
                <span>{storageUsage.totalGB} GB total</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {storageUsage.usedMB < 1024 
                    ? `${storageUsage.usedMB}`
                    : `${storageUsage.usedGB}`
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {storageUsage.usedMB < 1024 ? 'MB' : 'GB'} Used
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {storageUsage.usedMB < 1024 
                    ? `${Math.round(((storageUsage.totalGB * 1024) - storageUsage.usedMB) * 100) / 100}`
                    : `${Math.round((storageUsage.totalGB - storageUsage.usedGB) * 1000) / 1000}`
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {storageUsage.usedMB < 1024 ? 'MB' : 'GB'} Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {storageUsage.totalGB}
                </div>
                <div className="text-xs text-muted-foreground">GB Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for additional analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Usage Trends
            </CardTitle>
            <CardDescription>Storage usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Usage trends coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Application performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Performance metrics coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;