const { debugLogLatestDonations } = require('./dist/services/finance/donations');
const { debugLogLatestExpenses } = require('./dist/services/finance/expenses');

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
