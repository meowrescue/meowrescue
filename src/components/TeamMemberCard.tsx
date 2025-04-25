
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/types/team';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4 text-center">
      <Avatar className="h-24 w-24 border-2 border-meow-primary/20">
        {member.avatar_url ? (
          <AvatarImage 
            src={member.avatar_url} 
            alt={`${member.first_name} ${member.last_name}`} 
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="text-2xl bg-gradient-to-br from-meow-primary/20 to-meow-primary/40 text-meow-primary">
            {getInitials(member.first_name || '', member.last_name || '')}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900">
          {member.first_name} {member.last_name}
        </h3>
        {member.role_title && (
          <p className="text-sm text-gray-500">
            {member.role_title}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
