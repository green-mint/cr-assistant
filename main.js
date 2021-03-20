const venom = require("venom-bot");
const utils = require("./utils")

venom
  .create()
  .then((client) => remind(client))
  .catch((erro) => {
    console.log(erro);
  });

async function remind(client) {
  const offset = 0; // caters for the difference in time zones. 
  const group = "923335123480-1604684138@g.us"; // groupID for sending the reminder
  const remindHr = 19; // 7pm

  (async function loop() {
    let now = new Date();
    now.setHours(now.getHours() + offset) // converting the time to Pakistan Standard Time
    let delay;
  
    if (now.getHours() === remindHr) {
      delay = 8.54e7; // approximately 0.9 day
      let message = utils.getDeadlinesMessage(now);

      await client
        .sendText(group, message)
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });

    } else {
      now = new Date(); // allow for time passing
      delay = 60000 - (now % 60000); // exact ms to next minute interval
    }
    setTimeout(loop, delay);
  })();
}