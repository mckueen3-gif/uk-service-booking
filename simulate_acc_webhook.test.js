async function simulateWebhook() {
  const payload = {
    id: 'evt_test_acc',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_acc_' + Date.now(),
        customer: 'cus_test_acc_customer',
        payment_intent: 'pi_test_acc_' + Date.now(),
        metadata: {
          merchantId: 'cmnqqvmi9000104ksf23q0riw',
          subscription_type: 'accounting_premium',
          customerId: 'cmnvu18y600005cuhgvk2uvzd',
          serviceId: 'cmnvu19gq000b5cuhbdm6k22x',
          serviceName: 'Tax Filing',
          isEducation: 'false',
          totalAmount: '10000', // £100
          depositAmount: '2000',  // £20 (20%)
          balanceAmount: '0',     // Accounting usually only has deposit or fixed fee? 
                                  // User said "會計類 (Accounting): 20% deposit". 
                                  // In some cases, accounting might just be the deposit.
                                  // I'll set balance to 0 for now as per "20% deposit" instruction if that's all.
          scheduledDate: new Date().toISOString()
        }
      }
    }
  };

  console.log('--- Simulating Accounting Webhook (Deposit) ---');
  const response = await fetch('http://localhost:3003/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log('Response:', result);
  console.log('--- Simulation Complete ---');
}

simulateWebhook().catch(console.error);
