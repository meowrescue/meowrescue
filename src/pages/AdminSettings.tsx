
import React from 'react';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Mail, BellRing, Globe, PaintBucket, Database, Server } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminSettings: React.FC = () => {
  return (
    <AdminLayout title="Settings">
      <SEO title="Settings | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Settings</h1>
          <Button>
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-meow-primary" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Manage basic organization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" value="Meow Rescue" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="org-website">Website URL</Label>
                    <Input id="org-website" value="https://meowrescue.org" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="org-email">Primary Contact Email</Label>
                    <Input id="org-email" value="info@meowrescue.org" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="org-phone">Primary Phone Number</Label>
                    <Input id="org-phone" value="(727) 257-0037" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="org-address">Address</Label>
                    <Textarea id="org-address" value="123 Paw Street, Catsville, FL 33701" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="org-description">Organization Description</Label>
                    <Textarea 
                      id="org-description" 
                      value="Meow Rescue is a non-profit cat rescue organization dedicated to finding forever homes for cats in need."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-meow-primary" />
                  Email Settings
                </CardTitle>
                <CardDescription>
                  Configure email templates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email-sender">Email Sender Name</Label>
                  <Input id="email-sender" value="Meow Rescue" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="reply-to">Reply-To Email</Label>
                  <Input id="reply-to" value="info@meowrescue.org" />
                </div>
                <div className="space-y-3">
                  <Label>Email Templates</Label>
                  <Select defaultValue="welcome">
                    <SelectTrigger>
                      <SelectValue placeholder="Select email template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="adoption">Adoption Confirmation</SelectItem>
                      <SelectItem value="password-reset">Password Reset</SelectItem>
                      <SelectItem value="donation">Donation Receipt</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email-footer">Email Footer Text</Label>
                  <Textarea 
                    id="email-footer" 
                    value="Meow Rescue | 123 Paw Street, Catsville, FL 33701 | (727) 257-0037 | info@meowrescue.org"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-meow-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Manage notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New User Registrations</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify admins when new users register
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Adoption Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when new adoption applications are submitted
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Donations</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify on new donations
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Forum Posts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify on new forum posts or comments
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify on system issues or updates
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PaintBucket className="h-5 w-5 text-meow-primary" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input id="primary-color" value="#FF6B6B" />
                      <div className="w-10 h-10 rounded bg-meow-primary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input id="secondary-color" value="#4ECDC4" />
                      <div className="w-10 h-10 rounded bg-meow-secondary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Font Family</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                        <SelectItem value="lato">Lato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Button Style</Label>
                    <Select defaultValue="rounded">
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="pill">Pill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-meow-primary" />
                  API Settings
                </CardTitle>
                <CardDescription>
                  Manage API integrations and keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" value="••••••••••••••••••••••••••••••" type="password" />
                    <Button variant="outline">Show</Button>
                    <Button variant="outline">Generate New</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>API Access</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="read-access">Read Access</Label>
                      <Switch id="read-access" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="write-access">Write Access</Label>
                      <Switch id="write-access" checked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delete-access">Delete Access</Label>
                      <Switch id="delete-access" checked={false} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Webhook URL</Label>
                  <Input value="https://webhook.meowrescue.org/notifications" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-meow-primary" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Advanced system configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Environment</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Cache Settings</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue placeholder="Select cache setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Log Level</Label>
                  <Select defaultValue="error">
                    <SelectTrigger>
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode for the website
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive">Clear Cache</Button>
                <div className="space-x-2">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
