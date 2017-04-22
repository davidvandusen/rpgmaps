const packageJson = require('./package.json');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bundlePrefix = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8080/';
const bundleSuffix = process.env.NODE_ENV === 'production' ? `-${packageJson.version}.min.js` : `-${packageJson.version}.js`;

server.listen(process.env.PORT || 3000);

app.set('view engine', 'ejs');

app.use(express.static('build'));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.version = packageJson.version;
  next();
});

app.get('/', (req, res) => {
  res.redirect(Math.floor(Math.random() * 0xffffffff) + '/edit');
});

app.get('/:room', (req, res) => {
  res.render('index', {bundleSrc: bundlePrefix + 'play' + bundleSuffix});
});

app.get('/:room/edit', (req, res) => {
  res.render('index', {bundleSrc: bundlePrefix + 'edit' + bundleSuffix});
});

io.on('connection', socket => {
  socket.on('joinRoom', message => {
    socket.join(message.roomName);
    socket.broadcast.in(message.roomName).emit('joinedRoom', {to: message.to});
    socket.in(message.roomName).on('publishMap', mapData => {
      socket.broadcast.in(message.roomName).emit('publishMap', mapData);
    });
  });
});
