async function simulateWebhook() {
  const payload = {
    id: 'evt_test_repair',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_repair_123',
        customer: 'cus_test_repair_customer',
        payment_intent: 'pi_test_repair_deposit',
        metadata: {
          merchantId: 'cmnvu199a00065cuhu8qhv5ak',
          customerId: 'cmnvu18y600005cuhgvk2uvzd',
          serviceId: 'cmnvu19a600075cuhd2c4rg58',
          serviceName: 'Leak Repair',
          isEducation: 'false',
          totalAmount: '10000', // £100
          depositAmount: '2000',  // £20 (20%)
          balanceAmount: '8000',  // £80 (80%)
          scheduledDate: new Date().toISOString()
        }
      }
    }
  };

  console.log('--- Simulating Repair Webhook (Deposit) ---');
  const response = await fetch('http://localhost:3002/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log('Response:', result);
  console.log('--- Simulation Complete ---');
}

simulateWebhook().catch(console.error);
