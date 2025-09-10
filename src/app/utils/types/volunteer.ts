type Volunteer = {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

type Project = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}