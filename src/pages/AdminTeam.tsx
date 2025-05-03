
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@integrations/supabase';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Pencil, Trash2, MoveUp, MoveDown } from 'lucide-react';
import SEO from '@/components/SEO';
import ImageUploader from '@/components/ImageUploader';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const AdminTeam = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [teamMemberForm, setTeamMemberForm] = useState<Partial<TeamMember>>({
    id: '',
    name: '',
    title: '',
    bio: '',
    photo_url: '',
    email: '',
    is_active: true,
    display_order: 0
  });

  // Fetch team members
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    }
  });

  // Add team member mutation
  const saveMemberMutation = useMutation({
    mutationFn: async (member: Partial<TeamMember>) => {
      if (isEditMode) {
        // Update existing member
        const { id, ...updateData } = member;
        const { data, error } = await supabase
          .from('team_members')
          .update(updateData)
          .eq('id', id)
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Add new member
        const { data, error } = await supabase
          .from('team_members')
          .insert([member])
          .select();
        
        if (error) throw error;
        return data[0];
      }
    },
    onSuccess: () => {
      toast({
        title: isEditMode ? "Member Updated" : "Member Added",
        description: isEditMode ? "The team member has been updated." : "New team member has been added.",
      });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      resetForm();
      setIsAddMemberOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save team member.",
        variant: "destructive"
      });
    }
  });

  // Delete team member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Member Deleted",
        description: "The team member has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team member.",
        variant: "destructive"
      });
    }
  });

  // Update display order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ display_order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
      return { id, newOrder };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update display order.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setTeamMemberForm({
      id: '',
      name: '',
      title: '',
      bio: '',
      photo_url: '',
      email: '',
      is_active: true,
      display_order: teamMembers?.length || 0
    });
    setIsEditMode(false);
  };

  const handleAddMember = () => {
    setIsEditMode(false);
    setTeamMemberForm({
      name: '',
      title: '',
      bio: '',
      photo_url: '',
      email: '',
      is_active: true,
      display_order: teamMembers?.length || 0
    });
    setIsAddMemberOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setIsEditMode(true);
    setTeamMemberForm({
      id: member.id,
      name: member.name,
      title: member.title,
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      email: member.email || '',
      is_active: member.is_active,
      display_order: member.display_order
    });
    setIsAddMemberOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteMemberMutation.mutate(id);
    }
  };

  const handleMoveUp = (member: TeamMember, index: number) => {
    if (index === 0) return; // Already at the top
    
    const prevMember = teamMembers?.[index - 1];
    if (!prevMember) return;
    
    // Swap orders
    updateOrderMutation.mutate({ id: member.id, newOrder: prevMember.display_order });
    updateOrderMutation.mutate({ id: prevMember.id, newOrder: member.display_order });
  };

  const handleMoveDown = (member: TeamMember, index: number) => {
    if (!teamMembers || index === teamMembers.length - 1) return; // Already at the bottom
    
    const nextMember = teamMembers[index + 1];
    if (!nextMember) return;
    
    // Swap orders
    updateOrderMutation.mutate({ id: member.id, newOrder: nextMember.display_order });
    updateOrderMutation.mutate({ id: nextMember.id, newOrder: member.display_order });
  };

  const handleImageUploaded = (url: string) => {
    setTeamMemberForm({
      ...teamMemberForm,
      photo_url: url
    });
  };

  return (
    <AdminLayout title="Team Management">
      <SEO title="Team Management | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Team Management</h1>
          <Button onClick={handleAddMember}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : teamMembers && teamMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Title</th>
                      <th className="pb-3 text-left">Email</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-center">Order</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member, index) => (
                      <tr key={member.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center">
                            {member.photo_url ? (
                              <img
                                src={member.photo_url}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                <Users className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-4">{member.title}</td>
                        <td className="py-4">{member.email || '-'}</td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveUp(member, index)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveDown(member, index)}
                              disabled={index === teamMembers.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMember(member)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No team members found. Add your first team member to get started.</p>
                <Button className="mt-4" onClick={handleAddMember}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add/Edit Team Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              {isEditMode ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            saveMemberMutation.mutate(teamMemberForm);
          }}>
            <div className="grid gap-6 py-4">
              <div className="flex justify-center">
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImage={teamMemberForm.photo_url || undefined}
                  bucketName="images"
                  folderPath="team"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={teamMemberForm.name}
                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Title/Role</Label>
                  <Input
                    id="title"
                    value={teamMemberForm.title}
                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, title: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={teamMemberForm.email || ''}
                  onChange={(e) => setTeamMemberForm({ ...teamMemberForm, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={teamMemberForm.bio || ''}
                  onChange={(e) => setTeamMemberForm({ ...teamMemberForm, bio: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={teamMemberForm.is_active}
                  onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, is_active: checked })}
                />
                <Label htmlFor="is_active">Show on website</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddMemberOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!teamMemberForm.name || !teamMemberForm.title || saveMemberMutation.isPending}
              >
                {saveMemberMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTeam;
