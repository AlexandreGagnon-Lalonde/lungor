const express = require('express');

const app = expres();

const PORT = process.env.PORT || 3001;

app.get('/', (req,res) => res.send('helloFromServer'));

app.listen(PORT, () => console.log(`Listening on PORt ${PORT}`))