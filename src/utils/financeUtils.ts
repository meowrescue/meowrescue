
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

// Calculate projected annual amount based on current month
export const calculateAnnualProjection = (amountToDate: number): number => {
  const now = new Date();
  const monthsPassed = now.getMonth() + 1; // getMonth() is 0-indexed
  
  // Calculate projected annual amount
  return (amountToDate / monthsPassed) * 12;
};

// Format number as percentage
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Calculate budget allocation based on cat count and item cost
export const calculateCatBudget = (
  catCount: number, 
  itemCostPerUnit: number, 
  unitsPerDay: number, 
  daysPerYear: number = 365
): number => {
  // Add 10% buffer to account for unexpected needs
  return Math.ceil(catCount * itemCostPerUnit * unitsPerDay * daysPerYear * 1.1);
};

// Automatically categorize expenses based on keywords
export const categorizeExpense = (description: string, vendor: string): string => {
  const text = (description + ' ' + vendor).toLowerCase();
  
  // Medical/veterinary expenses
  if (/vet|veterinary|clinic|hospital|medical|medicine|exam|surgery|treatment/.test(text)) {
    return 'Medical';
  }
  
  // Food expenses
  if (/food|feed|kibble|wet food|dry food|treats|cat food|kitten|nutrition/.test(text)) {
    return 'Food';
  }
  
  // Supplies
  if (/litter|toy|bed|carrier|supplies|bowl|collar|brush|nail|comb/.test(text)) {
    return 'Supplies';
  }
  
  // Transport
  if (/transport|travel|gas|fuel|mileage|car|vehicle|uber|lyft|taxi/.test(text)) {
    return 'Transport';
  }
  
  // Spay/neuter
  if (/spay|neuter|sterilization|castration|fix/.test(text)) {
    return 'Spay/Neuter';
  }
  
  // Vaccinations
  if (/vaccine|vaccination|shot|booster|immunization|fvrcp|rabies|distemper/.test(text)) {
    return 'Vaccinations';
  }
  
  // Microchipping
  if (/microchip|chip|scan|id/.test(text)) {
    return 'Microchipping';
  }
  
  // Rent/facilities
  if (/rent|lease|facility|mortgage|utilities|water|electric|power|gas bill|internet/.test(text)) {
    return 'Facilities';
  }
  
  // Administration
  if (/admin|office|paper|ink|printer|software|subscription|website|hosting/.test(text)) {
    return 'Administration';
  }
  
  // Fallback
  return 'Operations';
};

// Check if a budget is at risk of being exceeded
export const isBudgetAtRisk = (spent: number, budgeted: number): boolean => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12 
  const monthlyBudget = budgeted / 12;
  const spendingRate = spent / currentMonth;
  
  // If we're spending at a rate that would exceed annual budget
  return spendingRate > monthlyBudget * 1.1; // 10% buffer
};

// Recommend budget adjustments based on spending patterns
export const recommendBudgetAdjustments = (
  categories: Array<{name: string, budgeted: number, spent: number}>
): Array<{category: string, action: 'increase'|'decrease'|'maintain', amount: number, reason: string}> => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const monthsRemaining = 12 - currentMonth;
  
  return categories.map(cat => {
    const monthlySpend = cat.spent / currentMonth;
    const projectedAnnual = monthlySpend * 12;
    const difference = projectedAnnual - cat.budgeted;
    const percentDiff = (difference / cat.budgeted) * 100;
    
    if (percentDiff > 15) {
      // We're projected to exceed budget by more than 15%
      return {
        category: cat.name,
        action: 'increase',
        amount: Math.ceil(difference),
        reason: `Current spending rate will exceed budget by ${Math.round(percentDiff)}%`
      };
    } 
    else if (percentDiff < -20) {
      // We're projected to spend 20% less than budgeted
      return {
        category: cat.name,
        action: 'decrease',
        amount: Math.floor(Math.abs(difference)),
        reason: `Current spending is ${Math.round(Math.abs(percentDiff))}% below budget`
      };
    }
    
    return {
      category: cat.name,
      action: 'maintain',
      amount: 0,
      reason: 'Current budget is appropriate for spending pattern'
    };
  });
};
