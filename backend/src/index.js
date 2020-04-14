// importando o módulo express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const {setWebSocket} = require('./websocket');

// instânciando o express
const app = express();
const server = http.Server(app);

setWebSocket(server);

mongoose.connect('mongodb+srv://omnistack:4plib8zZ@cluster0-5iufz.mongodb.net/week10?retryWrites=true&w=majority', 
{ useUnifiedTopology: true, useNewUrlParser: true })

// entende request com o formato json
app.use(cors());
app.use(express.json());
app.use(routes);


// servidor express sendo ouvido em 3333
server.listen(3333);

