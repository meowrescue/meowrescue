import { debugLogLatestDonations } from './src/services/finance/donations';
import { debugLogLatestExpenses } from './src/services/finance/expenses';

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
