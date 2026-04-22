import { getDictionary } from '../src/lib/i18n/dictionary';

async function test() {
    try {
        const t = getDictionary('en');
        console.log('Dictionary en loaded');
        console.log('merchant_public keys:', Object.keys(t.merchant_public || {}));
        
        const t2 = getDictionary('zh-TW');
        console.log('Dictionary zh-TW loaded');
        console.log('merchant_public keys:', Object.keys(t2.merchant_public || {}));
        
        if (!t.merchant_public) throw new Error('en.merchant_public missing');
        if (!t2.merchant_public) throw new Error('zh-TW.merchant_public missing');
        
        console.log('Test PASSED');
    } catch (e) {
        console.error('Test FAILED:', e);
    }
}

test();
