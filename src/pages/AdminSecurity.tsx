
import React from 'react';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, User, Lock, Key, Mail, AlertTriangle } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminSecurity: React.FC = () => {
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
                  <span className="text-sm font-medium">April 10, 2025</span>
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
        
        <Card>
          <CardHeader>
            <CardTitle>User Activity Log</CardTitle>
            <CardDescription>Recent security-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin login from new device</p>
                  <p className="text-xs text-gray-500">patrick@meowrescue.org • April 13, 2025 • 10:23 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-full mt-1">
                  <Lock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Password changed</p>
                  <p className="text-xs text-gray-500">admin@meowrescue.org • April 12, 2025 • 3:45 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full mt-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Failed login attempts (5)</p>
                  <p className="text-xs text-gray-500">volunteer@meowrescue.org • April 11, 2025 • 7:12 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Recovery email updated</p>
                  <p className="text-xs text-gray-500">info@meowrescue.org • April 10, 2025 • 11:05 AM</p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Log</Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
