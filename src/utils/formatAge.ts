
export const formatAge = (ageEstimate: string | null, birthday: string | null): string => {
  if (birthday) {
    const years = Math.floor((new Date().getTime() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((new Date().getTime() - new Date(birthday).getTime()) / (30.44 * 24 * 60 * 60 * 1000));
  
    if (years === 0) {
      return `${months} month${months === 1 ? '' : 's'} old`;
    }
    return `${years} year${years === 1 ? '' : 's'} old`;
  }

  if (ageEstimate) {
    const ageText = ageEstimate.toLowerCase();
    if (ageText.includes('month')) return `${ageEstimate} old`;
    if (ageText.includes('year')) return `${ageEstimate} old`;
  }

  return 'Unknown age';
};
