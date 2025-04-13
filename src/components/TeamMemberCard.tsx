
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/types/team';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'volunteer':
        return 'bg-blue-100 text-blue-800';
      case 'foster':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-meow-primary/20">
              <AvatarImage src={member.avatar_url || '/placeholder.svg'} alt={`${member.first_name} ${member.last_name}`} />
              <AvatarFallback className="bg-meow-primary/10 text-meow-primary">
                {getInitials(member.first_name, member.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{member.first_name} {member.last_name}</h3>
              {member.role_title && (
                <p className="text-gray-500">{member.role_title}</p>
              )}
            </div>
          </div>
          {member.role && (
            <Badge className={getRoleBadgeColor(member.role)}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {member.bio && (
          <p className="text-gray-700 mt-2">{member.bio}</p>
        )}
        {member.show_in_team && (
          <div className="mt-4 flex gap-2">
            <Badge variant="outline" className="bg-meow-primary/5">Team Member</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
