
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Mail, BellRing, Globe, PaintBucket, Database, Server, Clock } from 'lucide-react';
import SEO from '@/components/SEO';
import { useBusinessHours } from '@/components/BusinessHoursProvider';
import { useToast } from '@/hooks/use-toast';

// Days of the week for business hours
const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" }
];

// Hours for selection
const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`
}));

const AdminSettings: React.FC = () => {
  const { businessHoursSettings, updateBusinessHours } = useBusinessHours();
  const { toast } = useToast();
  const [hoursEnabled, setHoursEnabled] = useState(businessHoursSettings.enabled);
  const [businessHours, setBusinessHours] = useState(businessHoursSettings.hours);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize local state when settings are loaded
  useEffect(() => {
    setHoursEnabled(businessHoursSettings.enabled);
    setBusinessHours(businessHoursSettings.hours);
  }, [businessHoursSettings]);

  const handleAddDay = () => {
    // Find the first day not in the schedule
    const existingDays = businessHours.map(h => h.day);
    const availableDays = DAYS.filter(d => !existingDays.includes(d.value));
    
    if (availableDays.length > 0) {
      setBusinessHours([
        ...businessHours,
        { day: availableDays[0].value, startHour: 9, endHour: 17 }
      ]);
    } else {
      toast({
        title: "All Days Added",
        description: "You've already added all days of the week.",
      });
    }
  };

  const handleRemoveDay = (index: number) => {
    setBusinessHours(businessHours.filter((_, i) => i !== index));
  };

  const handleDayChange = (index: number, day: number) => {
    const newHours = [...businessHours];
    newHours[index].day = day;
    setBusinessHours(newHours);
  };

  const handleStartHourChange = (index: number, hour: number) => {
    const newHours = [...businessHours];
    newHours[index].startHour = hour;
    // Ensure end hour is after start hour
    if (hour >= newHours[index].endHour) {
      newHours[index].endHour = Math.min(hour + 1, 23);
    }
    setBusinessHours(newHours);
  };

  const handleEndHourChange = (index: number, hour: number) => {
    const newHours = [...businessHours];
    newHours[index].endHour = hour;
    setBusinessHours(newHours);
  };

  const handleSaveBusinessHours = async () => {
    setIsSaving(true);
    try {
      await updateBusinessHours({
        enabled: hoursEnabled,
        hours: businessHours
      });
      toast({
        title: "Business Hours Updated",
        description: "Your business hours have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving business hours:", error);
      toast({
        title: "Error Saving Hours",
        description: "There was a problem saving your business hours.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <SEO title="Settings | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
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
                    <Input id="org-name" defaultValue="Meow Rescue" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="org-website">Website URL</Label>
                    <Input id="org-website" defaultValue="https://meowrescue.org" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="org-email">Primary Contact Email</Label>
                    <Input id="org-email" defaultValue="info@meowrescue.org" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="org-phone">Primary Phone Number</Label>
                    <Input id="org-phone" defaultValue="(727) 257-0037" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="org-address">Address</Label>
                    <Textarea id="org-address" defaultValue="123 Paw Street, Catsville, FL 33701" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="org-description">Organization Description</Label>
                    <Textarea 
                      id="org-description" 
                      defaultValue="Meow Rescue is a non-profit cat rescue organization dedicated to finding forever homes for cats in need."
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

          <TabsContent value="business-hours">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-meow-primary" />
                  Business Hours
                </CardTitle>
                <CardDescription>
                  Set your organization's business hours for chat availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="business-hours-enabled" 
                    checked={hoursEnabled}
                    onCheckedChange={setHoursEnabled}
                  />
                  <Label htmlFor="business-hours-enabled">Enable business hours for chat</Label>
                </div>
                
                <div className={hoursEnabled ? '' : 'opacity-50 pointer-events-none'}>
                  <div className="space-y-4">
                    {businessHours.map((hours, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <Select
                            value={hours.day.toString()}
                            onValueChange={(value) => handleDayChange(index, parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map((day) => (
                                <SelectItem key={day.value} value={day.value.toString()}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-3">
                          <Select
                            value={hours.startHour.toString()}
                            onValueChange={(value) => handleStartHourChange(index, parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value.toString()}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-1 text-center">to</div>
                        
                        <div className="col-span-3">
                          <Select
                            value={hours.endHour.toString()}
                            onValueChange={(value) => handleEndHourChange(index, parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem 
                                  key={hour.value} 
                                  value={hour.value.toString()}
                                  disabled={hour.value <= hours.startHour}
                                >
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="col-span-1"
                          onClick={() => handleRemoveDay(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleAddDay}
                      disabled={businessHours.length >= 7}
                    >
                      Add Day
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setHoursEnabled(businessHoursSettings.enabled);
                  setBusinessHours(businessHoursSettings.hours);
                }}>
                  Reset
                </Button>
                <Button onClick={handleSaveBusinessHours} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
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
