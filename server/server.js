const express = require('express');

const app = express();
const path = require('path');

const PORT = process.env.PORT || 3333;
const { createServer } = require('http');
const generate_id = require('./id_generator.js');

const server = createServer(app);
const socketio = require('socket.io');

const io = socketio(server);

require('dotenv').config();

/**
 * handle parsing request body
 */
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

const groups = {};

// const masterKey = generate_id();
// let masterKey = '123';

// Run Socket
io.on('connection', (socket) => {
  // Welcome current user

  // Listen for the new player joining the game by inputing name on splash page
  socket.on('createGroups', ({ groupNum, hostName, games, groupPassword, gameName }) => {
    // masterKey = groupPassword;
    groups[gameName] = {
      hostName,
      masterKey: groupPassword,
      groups: {},
      finishedGroup: 0
    }
    const colorArr = [
      'Red',
      'Blue',
      'Green',
      'Orange',
      'Purple',
      'Pink',
      'White',
      "Marron",
      "Turquoise"
    ];
    for (let i = 0; i < groupNum; i++) {
      // generate guid
      const gId = generate_id();
      createGroup(gId, colorArr[i]);
    }

    function createGroup(groupId, color) {
      groups[gameName].groups[groupId] = {
        color,
        games,
        hostName,
        fellow: {},
        players: [],
        currentGame: 0,
        startTime: 0,
        duration: 0
      };
    }

    socket.emit('generateGameInfo', groups[gameName].groups, groups[gameName].masterKey, gameName);
  });

  socket.on('joinGroup', ({ groupId, fullName, hostKey, gameName }) => {
    const personId = generate_id();
    socket.join(groupId);
    if (groups[gameName].masterKey === hostKey) {
      groups[gameName].groups[groupId].fellow = { id: personId, fullName };
      socket.emit('Logged In');
      socket.emit('Logged in as fellow', groupId, groups[gameName].groups[groupId], personId, gameName);
    } else {
      groups[gameName].groups[groupId].players.push({ id: personId, fullName });
      socket.emit('Logged In');
      socket.emit('Logged in as student', groupId, groups[gameName].groups[groupId], personId, gameName);
    }
    io.to(groupId).emit('playerJoined', groups[gameName].groups[groupId].players);
    console.log('server.js/joinGroup: ', groups);
  });

  socket.on('requestGame', ({ id, groupId, gameName }) => {
    // When group fellow clicks on 'Start Game',
    // store current time in startTime and emit to group
    if (groups[gameName].groups[groupId].fellow.id === id) {
      console.log('Starting game for team', groups[gameName].groups[groupId].color, '!');
      groups[gameName].groups[groupId].startTime = Date.now();
      io.to(groupId).emit('startGame');
    }
  })

  socket.on('getGroupsStatus', (gameName) => {
    console.log("gameNAMe", gameName)
    console.log('server.js/STATUS ARR1: ', groups[gameName].groups);
    const groupsArr = Object.keys(groups[gameName].groups).reduce((acc, curr) => {
      acc.push({
        'color': groups[gameName].groups[curr].color,
        'status': groups[gameName].groups[curr].currentGame
      });
      return acc;
    }, []);
    console.log('server.js/STATUS ARR2: ', groupsArr);
    io.emit('updateBoard', updateBoard(gameName));
  })

  socket.on('nextChallenge', ({ id, groupId, gameName }) => {
    if (groups[gameName].groups[groupId].fellow.id === id) {
      console.log('server.js/nextChallenge: ', groups[gameName].groups[groupId].color);
      groups[gameName].groups[groupId].currentGame++;

      if (groups[gameName].groups[groupId].currentGame >= groups[gameName].groups[groupId].games.length) {
        const endTime = Date.now();
        const timeDuration_ms = (endTime - groups[gameName].groups[groupId].startTime) / 1000;
        const minutes = Math.floor(timeDuration_ms / 60);
        let seconds = Math.round(timeDuration_ms - minutes * 60).toString();
        if (seconds.length === 1) seconds = '0' + seconds;
        const timeDuration = `${minutes}:${seconds}`;
        groups[gameName].groups[groupId].duration = timeDuration_ms;
        groups[gameName].groups[groupId].currentGame = timeDuration;
        io.to(groupId).emit('endGame');
        io.emit('groupFinished', groupId, groups[gameName].groups[groupId].color, timeDuration); // Sends a broadcast to everyone
        const groupsKeys = Object.keys(groups[gameName].groups);
        if (++(groups[gameName].finishedGroup) === groupsKeys.length) {
          const winnerKey = groupsKeys.reduce( (acc, key) => {
            return acc = (groups[gameName].groups[key].duration < groups[gameName].groups[acc].duration) ?
              key : acc;
          });
          io.emit('winner', `Team ${groups[gameName].groups[winnerKey].color} WINS!`)
        }
      }
      else {
        // Move to the next question and alert team only!
        io.to(groupId).emit('Next Challenge');
        io.emit('updateBoard', updateBoard(gameName));
      }
    }
  });

  function updateBoard(gameName) {
    const groupsArr = Object.keys(groups[gameName].groups).reduce((acc, curr) => {
      acc.push({
        'color': groups[gameName].groups[curr].color,
        'status': groups[gameName].groups[curr].currentGame
      });
      return acc;
    }, []);
    console.log('server.js/updateBoard: ', groupsArr);
    return groupsArr;
  }
});

// route handler to respond with main app
app.use(
  '/bundle.js',
  express.static(path.join(__dirname, '../dist/bundle.js'))
);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

server.listen(process.env.PORT || PORT, () => {
  console.log(`listening Server on ${PORT}`);
});
