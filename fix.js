const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/\\`/g, '`').replace(/\\\${/g, '${');
fs.writeFileSync('app.js', code);
