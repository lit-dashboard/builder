const express = require('express')
const app = express()
const port = 3000

// app.get('/', function(req,res) {
//   res.sendfile('build/index.html');
// });

app.use(express.static('build'));
app.use('/node_modules', express.static('node_modules'));
app.use('/widgets', express.static('widgets'));
app.use('/source-providers', express.static('source-providers'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));