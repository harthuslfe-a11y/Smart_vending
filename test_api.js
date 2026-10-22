async function runTests() {
  console.log('--- TEST 1: Password Verification ---');
  let res = await fetch('http://localhost:3000/api/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: '1234', type: 'home_login' })
  });
  console.log('PIN 1234:', await res.json());

  res = await fetch('http://localhost:3000/api/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'open', type: 'home_login' })
  });
  console.log('Voice passphrase "open":', await res.json());

  res = await fetch('http://localhost:3000/api/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'తెరువు', type: 'home_login' })
  });
  console.log('Voice passphrase "తెరువు":', await res.json());

  console.log('\n--- TEST 2: Dispense Product with PIN (Ropes) ---');
  // prod_1 has 14 ropes
  res = await fetch('http://localhost:3000/api/dispense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: 'prod_1',
      quantity: 2,
      password: '1234'
    })
  });
  console.log('Dispense 2 Ropes:', await res.json());

  console.log('\n--- TEST 3: Shift Location (Admin) ---');
  res = await fetch('http://localhost:3000/api/products/prod_1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'Godown 1 - Left Corner (Bay A-01)',
      locationTe: 'గోడౌన్ 1 - ఎడమ మూల (బే A-01)'
    })
  });
  console.log('Shift Location result:', await res.json());

  console.log('\n--- TEST 4: Low Stock Alert Check ---');
  res = await fetch('http://localhost:3000/api/alerts');
  console.log('Active Alerts:', await res.json());
}

runTests();
