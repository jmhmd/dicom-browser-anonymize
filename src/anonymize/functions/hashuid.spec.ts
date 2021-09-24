import hashuid from './hashuid';

const pre = '1.3.6.1.4.1.5962.1.2.1.20040826185059.5457';
const expected = '9999.316688255537661849331321158457344233676';

const result = hashuid('9999', pre);

console.log('hash:', result);
console.log('expected:', expected);
console.log('match:', result === expected);

// MD5: ee3ff07efb18e31f68a4a3b4328990cc
