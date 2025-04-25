
import React from 'react';
import { Cat, MedicalRecord } from '@/types/cat';
import AboutCatSection from './InfoSections/AboutCatSection';
import SpecialCareSection from './InfoSections/SpecialCareSection';
import IntakeSection from './InfoSections/IntakeSection';
import MedicalHistorySection from './InfoSections/MedicalHistorySection';

interface CatInfoSectionProps {
  cat: Cat;
  medicalRecords: MedicalRecord[];
}

const CatInfoSection = ({ cat, medicalRecords }: CatInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <AboutCatSection {...cat} />
      <SpecialCareSection medical_notes={cat.medical_notes} />
      <IntakeSection intake_date={cat.intake_date} />
      <MedicalHistorySection medicalRecords={medicalRecords} />
    </div>
  );
};

export default CatInfoSection;
