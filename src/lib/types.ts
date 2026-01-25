export interface ElectionCenter {
  id: string;
  name: string;
  area: string;
  seat_number?: string;
  district?: string;
  division?: string;
  total_voter?: number;
  male_voter?: number;
  female_voter?: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photoUrl: string;
  assignedCenterId: string;
  signId?: string;
}

export interface Sign {
  id: string;
  name: string;
  imageUrl: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'superadmin' | 'admin';
}
