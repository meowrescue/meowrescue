
export interface Cat {
  id: string;
  name: string;
  age_estimate: string;
  gender: string;
  breed: string;
  description: string;
  photos_urls: string[];
  status: 'Available' | 'Pending' | 'Adopted';
  weight: string | null;
  color: string | null;
  pattern: string | null;
  eye_color: string | null;
  coat_type: string | null;
  special_care_notes: string | null;
  foster_start_date: string | null;
  foster_end_date: string | null;
  vaccination_date: string | null;
  deworming_date: string | null;
  flea_treatment_date: string | null;
  spay_neuter_date: string | null;
  microchip_number: string | null;
  intake_date: string;
  medical_notes: string | null;
  birthday: string | null;
}

export interface MedicalRecord {
  id: string;
  cat_id: string;
  procedure_type: string;
  record_date: string;
  description: string;
  veterinarian?: string;
  notes?: string;
}
