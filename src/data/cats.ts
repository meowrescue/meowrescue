
// This is mock data. In a real implementation, this would come from Supabase.

export interface Cat {
  id: string;
  name: string;
  imageUrl: string;
  images: string[];
  age: string;
  gender: 'Male' | 'Female';
  breed: string;
  description: string;
  personality: string[];
  medicalInfo: string;
  status: 'Available' | 'Pending' | 'Adopted';
  intakeDate: string;
  fosterId?: string;
}

export const cats: Cat[] = [
  {
    id: '1',
    name: 'Fluffy',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80',
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    ],
    age: 'Adult',
    gender: 'Male',
    breed: 'Domestic Longhair',
    description: 'Fluffy was found severely injured, likely after a coyote attack. He had puncture wounds and couldn\'t walk. After receiving initial care, he\'s now walking but still has pain in his back right leg. He needs a veterinary assessment, treatment for a skin condition, neutering, and flea treatment.',
    personality: ['Gentle', 'Loving', 'Calm'],
    medicalInfo: 'Recovering from injuries, needs additional vet care and neutering',
    status: 'Available',
    intakeDate: '2025-04-01'
  },
  {
    id: '2',
    name: 'Mittens',
    imageUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1092&q=80',
    images: [
      'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1092&q=80',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80'
    ],
    age: 'Young',
    gender: 'Female',
    breed: 'Domestic Shorthair',
    description: 'Mittens is a playful young cat with striking white paws. She loves to chase toys and is very affectionate. She would do well in a home with other cats or cat-friendly dogs.',
    personality: ['Playful', 'Affectionate', 'Energetic'],
    medicalInfo: 'Spayed, vaccinated, microchipped',
    status: 'Available',
    intakeDate: '2025-03-15'
  },
  {
    id: '3',
    name: 'Shadow',
    imageUrl: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    images: [
      'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
      'https://images.unsplash.com/photo-1606015559732-fab815c9bf0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'
    ],
    age: 'Adult',
    gender: 'Male',
    breed: 'Black Domestic Shorthair',
    description: 'Shadow is a sleek black cat with striking green eyes. He\'s a bit shy at first but warms up quickly and loves to curl up in laps. He would do best in a quiet home.',
    personality: ['Shy', 'Gentle', 'Lap cat'],
    medicalInfo: 'Neutered, vaccinated, microchipped',
    status: 'Pending',
    intakeDate: '2025-02-20'
  },
  {
    id: '4',
    name: 'Luna',
    imageUrl: 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    images: [
      'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    ],
    age: 'Kitten',
    gender: 'Female',
    breed: 'Calico',
    description: 'Luna is a sweet calico kitten with lots of energy. She loves to play and explore. She would do well in a home with children or other pets.',
    personality: ['Curious', 'Playful', 'Friendly'],
    medicalInfo: 'Vaccinated, will be spayed when old enough',
    status: 'Available',
    intakeDate: '2025-03-30'
  },
  {
    id: '5',
    name: 'Oliver',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
      'https://images.unsplash.com/photo-1544816565-aa8c1166648f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    age: 'Young',
    gender: 'Male',
    breed: 'Orange Tabby',
    description: 'Oliver is a handsome orange tabby with a big personality. He\'s very social and loves to be the center of attention. He would do best in a home where he can get lots of love and attention.',
    personality: ['Social', 'Vocal', 'Affectionate'],
    medicalInfo: 'Neutered, vaccinated, microchipped',
    status: 'Available',
    intakeDate: '2025-03-01'
  },
  {
    id: '6',
    name: 'Bella',
    imageUrl: 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80',
    images: [
      'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80',
      'https://images.unsplash.com/photo-1543365067-fa127bcb2303?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80'
    ],
    age: 'Adult',
    gender: 'Female',
    breed: 'Siamese Mix',
    description: 'Bella is a beautiful Siamese mix with striking blue eyes. She\'s a bit shy at first but very affectionate once she warms up. She would do best in a quiet home with no young children.',
    personality: ['Shy', 'Sweet', 'Independent'],
    medicalInfo: 'Spayed, vaccinated, microchipped',
    status: 'Adopted',
    intakeDate: '2025-01-15'
  }
];
