import { getCommissionRate } from './src/lib/commission';

const testCases = [
    { jobs: 0, expected: 0 },
    { jobs: 5, expected: 0 },
    { jobs: 6, expected: 0.08 },
    { jobs: 55, expected: 0.08 },
    { jobs: 56, expected: 0.09 },
    { jobs: 105, expected: 0.09 },
    { jobs: 106, expected: 0.10 },
    { jobs: 205, expected: 0.11 },
    { jobs: 256, expected: 0.12 },
    { jobs: 1000, expected: 0.12 },
];

console.log('--- Commission Rate Test ---');
let pass = true;
testCases.forEach(({ jobs, expected }) => {
    const rate = getCommissionRate(jobs);
    if (Math.abs(rate - expected) < 0.0001) {
        console.log(`✅ Jobs: ${jobs.toString().padStart(4)} | Rate: ${(rate * 100).toFixed(0)}%`);
    } else {
        console.log(`❌ Jobs: ${jobs.toString().padStart(4)} | Expected: ${(expected * 100).toFixed(0)}% | Got: ${(rate * 100).toFixed(0)}%`);
        pass = false;
    }
});

if (pass) console.log('\n✅ All commission tests passed!');
else process.exit(1);
