const venom = require('venom-bot');
const fs = require('fs');

venom
  .create()
  .then((client) => remind(client))
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
