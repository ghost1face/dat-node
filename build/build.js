const { compile } = require('nexe')

return compile({
    input: './src/app.js',
    output: './lib/dat',
    name: 'dat'
}).then(() => {
    console.log('success')
})
.catch(err => {
    console.log(err);
})