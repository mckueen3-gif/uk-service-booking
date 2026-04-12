import * as otplib from 'otplib';
import { generateSecret, generateURI, verify } from 'otplib';

console.log('Namespace:', Object.keys(otplib));
console.log('Named generateSecret:', typeof generateSecret);
console.log('Named generateURI:', typeof generateURI);
console.log('Named verify:', typeof verify);

import * as otplibDefault from 'otplib';
console.log('Default keys:', Object.keys(otplibDefault));
