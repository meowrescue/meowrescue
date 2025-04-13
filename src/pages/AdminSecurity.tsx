import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Key, 
  Mail, 
  AlertTriangle, 
  LogIn, 
  LogOut, 
  Edit, 
  FileText, 
  PenSquare,
  MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface ActivityLog {
  id: string;
  activity_type: string;
  user_id: string;
  user_email?: string;
  description: string;
  ip_address?: string;
  created_at: string;
  metadata?: any;
}

const AdminSecurity: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch activity logs
  const { data: activityLogs, isLoading, error } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            *,
            profiles:user_id (
              email,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Format the data with user emails
        return data.map(log => ({
          ...log,
          user_email: log.profiles?.email || 'Anonymous',
          user_name: log.profiles?.first_name && log.profiles?.last_name ? 
            `${log.profiles.first_name} ${log.profiles.last_name}` : 
            (log.profiles?.email || 'Anonymous')
        })) as ActivityLog[];
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        return [] as ActivityLog[];
      }
    }
  });
  
  // Get the right icon based on activity type
  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'login':
        return <LogIn className="h-4 w-4 text-blue-600" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-gray-600" />;
      case 'registration':
        return <User className="h-4 w-4 text-green-600" />;
      case 'password_change':
        return <Lock className="h-4 w-4 text-yellow-600" />;
      case 'password_reset':
        return <Key className="h-4 w-4 text-orange-600" />;
      case 'profile_update':
        return <Edit className="h-4 w-4 text-purple-600" />;
      case 'post_created':
        return <PenSquare className="h-4 w-4 text-indigo-600" />;
      case 'post_updated':
        return <FileText className="h-4 w-4 text-cyan-600" />;
      case 'comment_created':
        return <MessageSquare className="h-4 w-4 text-pink-600" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Get background color based on activity type
  const getActivityBgColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'login':
        return 'bg-blue-100';
      case 'logout':
        return 'bg-gray-100';
      case 'registration':
        return 'bg-green-100';
      case 'password_change':
      case 'password_reset':
        return 'bg-yellow-100';
      case 'profile_update':
        return 'bg-purple-100';
      case 'post_created':
      case 'post_updated':
        return 'bg-indigo-100';
      case 'comment_created':
        return 'bg-pink-100';
      case 'failed_login':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Filter activity logs based on search query
  const filteredLogs = activityLogs?.filter(log => 
    log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.activity_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Security">
      <SEO title="Security | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Security</h1>
          <Button variant="outline">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Run Security Check
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Current status of system security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span>Last security check</span>
                  </div>
                  <span className="text-sm font-medium">April 13, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <span>User authentication</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Secure</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <Lock className="h-4 w-4" />
                    </div>
                    <span>Data encryption</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                      <Key className="h-4 w-4" />
                    </div>
                    <span>Two-factor authentication</span>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">Optional</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <span>Weak admin passwords</span>
                  </div>
                  <span className="text-sm text-red-600 font-medium">3 users</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">View Details</Button>
              <Button>Fix Security Issues</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Login Rate Limiting</label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Email Verification</label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Require Strong Passwords</label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Session Timeout (30 min)</label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Require 2FA for Admins</label>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="login">Logins</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="security">Security Events</TabsTrigger>
            </TabsList>
            
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Log</CardTitle>
                <CardDescription>All user activity in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">Error loading activity logs. Please try again later.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>A list of all user activities in the system.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs?.length > 0 ? (
                          filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>{log.user_email}</TableCell>
                              <TableCell>
                                <Badge className={`flex items-center gap-1 ${getActivityBgColor(log.activity_type)} text-gray-800`}>
                                  {getActivityIcon(log.activity_type)}
                                  {log.activity_type.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>{log.description}</TableCell>
                              <TableCell>{log.ip_address || 'Unknown'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No activity logs found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Load More</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <CardDescription>User login and logout events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs?.filter(log => 
                        ['login', 'logout', 'failed_login'].includes(log.activity_type.toLowerCase())
                      ).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>{log.user_email}</TableCell>
                          <TableCell>
                            <Badge className={`flex items-center gap-1 ${getActivityBgColor(log.activity_type)} text-gray-800`}>
                              {getActivityIcon(log.activity_type)}
                              {log.activity_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.ip_address || 'Unknown'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Post Activity</CardTitle>
                <CardDescription>Post creation and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs?.filter(log => 
                        ['post_created', 'post_updated'].includes(log.activity_type.toLowerCase())
                      ).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>{log.user_email}</TableCell>
                          <TableCell>
                            <Badge className={`flex items-center gap-1 ${getActivityBgColor(log.activity_type)} text-gray-800`}>
                              {getActivityIcon(log.activity_type)}
                              {log.activity_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Comment Activity</CardTitle>
                <CardDescription>Comment creation and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs?.filter(log => 
                        ['comment_created'].includes(log.activity_type.toLowerCase())
                      ).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>{log.user_email}</TableCell>
                          <TableCell>
                            <Badge className={`flex items-center gap-1 ${getActivityBgColor(log.activity_type)} text-gray-800`}>
                              {getActivityIcon(log.activity_type)}
                              {log.activity_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Password changes, password resets, and other security-related events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs?.filter(log => 
                        ['password_change', 'password_reset', 'failed_login'].includes(log.activity_type.toLowerCase())
                      ).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>{log.user_email}</TableCell>
                          <TableCell>
                            <Badge className={`flex items-center gap-1 ${getActivityBgColor(log.activity_type)} text-gray-800`}>
                              {getActivityIcon(log.activity_type)}
                              {log.activity_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                          <TableCell>{log.ip_address || 'Unknown'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
