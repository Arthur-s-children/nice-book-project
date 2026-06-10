import React from 'react';
import { TeamMemberCard } from '../../components/shared/TeamMemberCard';
import Team from './people/Team.json';
import './TeamPage.scss';

export interface TeamMember {
  photo: string;
  first_name: string;
  last_name: string;
  role: string;
  quote: string;
}

export const TeamPage: React.FC = () => {
  const teamMembers = Team as TeamMember[];

  return (
    <div className="team-page">
      <div className="team-page__title-section">
        <h1 className="team-page__title">Our Team</h1>
      </div>

      <div className="team-page__grid">
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={`${member.first_name}-${index}`}
            member={member}
          />
        ))}
      </div>
    </div>
  );
};
