
import React from 'react';
import BackButton from './Header/BackButton';
import ShareButtons from './Header/ShareButtons';
import PageHeader from '@/components/ui/PageHeader';
import { useScrollWithOffset } from '@/hooks/use-scroll-with-offset';

interface CatDetailsHeaderProps {
  name: string;
  age: string;
  gender: string;
}

const CatDetailsHeader: React.FC<CatDetailsHeaderProps> = ({ name, age, gender }) => {
  useScrollWithOffset();

  return (
    <>
      <div className="fixed top-24 left-4 z-30 flex flex-col gap-2">
        <BackButton />
        <ShareButtons name={name} />
      </div>

      <PageHeader
        title={name}
        subtitle={`Meet ${name}, a ${age} ${gender.toLowerCase()} looking for a loving home.`}
      />
    </>
  );
};

export default CatDetailsHeader;
