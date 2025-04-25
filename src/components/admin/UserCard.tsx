
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Mail, X, UserPlus, Shield, Clock, UserX, Cat } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/users';
import ImageUploader from '@/components/ImageUploader';

interface UserCardProps {
  user: User;
  onRoleChange: (role: string) => Promise<void>;
  onStatusChange: (isActive: boolean) => Promise<void>;
  refetchUsers: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onRoleChange, onStatusChange, refetchUsers }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [roleTitle, setRoleTitle] = useState(user.role_title || '');
  const [showInTeam, setShowInTeam] = useState(user.show_in_team || false);
  const [firstName, setFirstName] = useState(user.first_name || '');
  const [lastName, setLastName] = useState(user.last_name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');

  const roleColor = {
    admin: 'bg-red-100 text-red-800',
    volunteer: 'bg-blue-100 text-blue-800',
    foster: 'bg-green-100 text-green-800',
    user: 'bg-gray-100 text-gray-800'
  };

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <X className="h-4 w-4 text-red-500" />;
  };

  const handleSaveChanges = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role_title: roleTitle,
          show_in_team: showInTeam,
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          avatar_url: avatarUrl // update avatar url
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile Updated',
        description: 'Team member settings updated successfully.',
      });
      
      setIsEditing(false);
      refetchUsers();
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating the profile.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatarUrl || '/placeholder.svg'} />
              <AvatarFallback>{user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {user.first_name || ''} {user.last_name || ''}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {user.email}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${roleColor[user.role as keyof typeof roleColor]}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Team Member:</span>
            <span className="flex items-center font-medium">
              {getStatusIcon(user.show_in_team)}
              <span className="ml-1">{user.show_in_team ? 'Yes' : 'No'}</span>
            </span>
          </div>
          
          {user.role_title && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Role Title:</span>
              <span className="font-medium">{user.role_title}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <span className="flex items-center font-medium">
              {getStatusIcon(user.is_active)}
              <span className="ml-1">{user.is_active ? 'Active' : 'Inactive'}</span>
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Joined:</span>
            <span className="font-medium">
              {format(new Date(user.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-4 border-t pt-4 space-y-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role Title (shown on About page)</Label>
              <Input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Volunteer Coordinator"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Bio</Label>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio for team page"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <ImageUploader
                currentImage={avatarUrl}
                onImageUploaded={(url) => setAvatarUrl(url)}
                bucketName="profile-photos"
                folderPath={user.id}
                showThumbnailOnly
              />
              <Input
                value={avatarUrl || ""}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="URL to profile image"
                className="mt-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Show on Team Page</Label>
              <Switch
                checked={showInTeam}
                onCheckedChange={setShowInTeam}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="flex-1">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveChanges} className="flex-1">
              Save
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex-1">
              Edit Team Settings
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onStatusChange(!user.is_active)}>
                  {user.is_active ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      <span>Deactivate User</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Activate User</span>
                    </>
                  )}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                
                <DropdownMenuItem onClick={() => onRoleChange('admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Set as Admin</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onRoleChange('volunteer')}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Set as Volunteer</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onRoleChange('foster')}>
                  <Cat className="mr-2 h-4 w-4" />
                  <span>Set as Foster</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onRoleChange('user')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Set as Regular User</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;

