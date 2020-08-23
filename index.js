require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send('Hello Codemates api') })


app.listen(process.env.PORT, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})