const shelljs = require('shelljs');

const res = shelljs.exec('git fetch', { timeout: 100000 });

console.log(res);
console.log(res.stdout.trim())
console.log(res.stderr.trim())
