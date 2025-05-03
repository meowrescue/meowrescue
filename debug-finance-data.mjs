import { debugLogLatestDonations } from './dist/services/finance/donations.js';
import { debugLogLatestExpenses } from './dist/services/finance/expenses.js';

async function main() {
  console.log('--- Debug: Latest Donations ---');
  await debugLogLatestDonations();
  console.log('--- Debug: Latest Expenses ---');
  await debugLogLatestExpenses();
  console.log('--- Debug complete ---');
}

main().catch((err) => {
  console.error('Error running debug script:', err);
});
