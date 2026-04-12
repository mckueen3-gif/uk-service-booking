// Using native fetch in Node.js 25
async function simulateWebhook() {
  const payload = {
    id: 'evt_test_123',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_abc',
        customer: 'cus_test_789',
        payment_intent: 'pi_test_edu_booking',
        metadata: {
          merchantId: 'cmnvu192g00025cuha1j2t9vj',
          customerId: 'cmnvu18y600005cuhgvk2uvzd',
          serviceId: 'cmnvu193i00035cuhh6nletza',
          serviceName: 'Core Math',
          isEducation: 'true',
          totalAmount: '10000',
          depositAmount: '10000',
          balanceAmount: '0',
          scheduledDate: new Date().toISOString()
        }
      }
    }
  };

  console.log('--- Simulating Education Webhook ---');
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
