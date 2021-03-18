const venom = require('venom-bot');
const fs = require('fs');

const fs = require('fs');
const venom = require('venom-bot');

venom
  .create(
    'sessionName',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    remind(client);
  })
  .catch((erro) => {
    console.log(erro);
  });



async function remind(client) {
    (async function loop() {
        let now = new Date();
        let delay;
        console.log(now.getHours())
        if (now.getHours() === 17) {
            delay = 8.54e+7 // approximately 0.9 day
            let message = getDeadlines();
            await client
              .sendText('923335123480-1604684138@g.us', message)
              .then((result) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
        } else {
          now = new Date();                  // allow for time passing
          delay = 60000 - (now % 60000); // exact ms to next minute interval
        }
        setTimeout(loop, delay);
    })();
}

function getDeadlines() {
  let rawdata = fs.readFileSync('tasks.json');
  let message = `DEADLINES REMINDER:\n`;
  deadlines = JSON.parse(rawdata);


  for (var subject in deadlines) {
    for (var task in deadlines[subject]) {
      message = message.concat(`Subject: ${subject} ${task}:\n ${deadlines[subject][task]}\n`)
    }
  }
  return message;
}

