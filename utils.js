const fs = require("fs");

function getDeadlinesMessage(currentTime) {
  let deadlineData = JSON.parse(fs.readFileSync("tasks.json"));
  let taskMessages = [];

  for (var task in deadlineData) {
    remTime = getRemainingTime(parseDate(deadlineData[task]),currentTime);
    if (remTime[0] <= 0) {
      delete deadlineData[task]
    } else {
      taskMessages.push({
        "task": task,
        "timeMilli": remTime[0],
        "timeWords": remTime[1]
      })
    }
  }
  taskMessages.sort((a,b) => {
    return a.timeMilli - b.timeMilli
  })

  fs.writeFile('tasks.json', JSON.stringify(deadlineData, null, ' '), (err) => {
    if (err) {
        throw err;
    }
    console.log("Deadlines data is saved.");
    });

  return createMessage(taskMessages)
}

function getRemainingTime(deadlineTime, currentTime) {
  let millis = deadlineTime - currentTime;
  let days = Math.floor(millis / 8.64e7);
  let hours = Math.floor((millis - days * 8.64e7) / 3.6e6);
  let minutes = Math.floor((millis - days * 8.64e7 - hours * 3.6e6) / 60000);

  timeRemaining = [millis, `${days} days ${hours} hours ${minutes} mins`];

  return timeRemaining;
}

function parseDate(strDate) {
  /* TODO: verify that the data provided is valid or not */
  let date = new Date(strDate);
  return date;
}

function createMessage(taskMessages) {
  let message = `*-----DEADLINES-----*:\n\n`
  for (var i in taskMessages) {
    message = message.concat(
      `${taskMessages[i].task}:\n*${taskMessages[i].timeWords}* left\n\n`
    )
  }
  message = message.concat(
    `Message was compiled by a bot, developers will not be responsible for any consequence`
  )
  return message
}

module.exports = { getDeadlinesMessage };
