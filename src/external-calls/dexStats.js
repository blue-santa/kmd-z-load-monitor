const path = require('path');
const request = require('request');
const http = require('http');
const exec = require('child_process').exec;

const base = 'https://dexstats.info/';
const catchMeIfYouCanSong = '/../assets/audio/catch-me-if-you-can-title.mp3';
const catchMeIfYouCan = 'http://localhost:3001';

let currentStats = {
  before: '',
  after: '',
  coinsMoved: 0,
  timeTotal: 0,
  timePretty: 0,
  periodStart: Date.now(),
  lastMovement: ''
};

const trimFront = (docBody, frontBreak) => {
  let newBody = docBody;
  let front = docBody.indexOf(frontBreak);
  newBody = newBody.slice(front + frontBreak.length);
  return newBody;
};

const trimRear = (docBody, rearBreak) => {
  let newBody = docBody;
  let rear = docBody.indexOf(rearBreak);
  newBody = newBody.slice(0, rear);
  return newBody;
};

const makeInt = (docBody) => {
  let newBody = docBody;
  while (newBody.includes('\'')) {
    let apos = '\'';
    let aposPos = newBody.indexOf(apos);
    let newBodyFront = newBody.slice(0, aposPos);
    newBody = newBody.slice(aposPos + apos.length);
    newBody = newBodyFront + newBody;
  }
  if (typeof newBody === 'string') {
    newBody = parseInt(newBody, 10);
  }
  return newBody;
}

const checkExplorer = (callback) => {
  request.get(base + 'explorers.php', (err, res, body) => {
    let findKMD = 'KMD_snapshot.json';
    let findPrivacyRow = 'badge-dark">';
    if (res === undefined) {
      return console.log(`\n\n...the view is blocked...`);
    }
    if (res.statusCode !== 200) {
      console.log(`...the status code is: ${res.statusCode}`);
      return;
    }
    if (body.includes(findKMD) === false || body.includes(findPrivacyRow) === false) {
      console.log(`...the markers are missing. need to get out and check where they went...`);
      return;
    }
    let dexBody = body;
    let findElementClosure = '</';
    dexBody = trimFront(dexBody, findKMD);
    dexBody = trimFront(dexBody, findPrivacyRow);
    dexBody = trimRear(dexBody, findElementClosure);
    dexBody = makeInt(dexBody);
    callback(dexBody);
  });
  return;
};

const playSong = () => {
  let themeSong = exec(`xdg-open ${catchMeIfYouCan}`, (err, stdout, stderr) => {
    if (err) { console.error(err); };
  });
  themeSong.stderr.on('data', (data) => {
    console.error(data);
  });
  themeSong.stdout.on('data', (data) => {
    console.log(`data: ${data}`);
  });
  themeSong.on('exit', (code) => {
    process.exit();
  });
}

const snap = () => {
  process.stdout.write('\033c');
  captainsLog();
  console.log(`...wake up sleepy...\n\n...we're on the move...`);
  playSong();
}

const captainsLog = () => {
  process.stdout.write('\033c');
  console.log(`...shhh. stay down...`);
  if (currentStats.coinsMoved) {
    console.log(`...z-coins spotted: ${currentStats.coinsMoved}...`);
  }
  if (currentStats.lastMovement) {
    console.log(`...last glimpse of activity: ${currentStats.lastMovement}...`);
  }
  console.log(`...hours passed: ${currentStats.timePretty}...`);
}

const checkHours = (timePassed) => {
  currentStats.timeTotal = timePassed;
  currentStats.timePretty = (timePassed/1000/3600).toFixed(4);
}

function isDifferent() {
  process.stdout.write('\033c');
  console.log(`...peeping...`);
  checkExplorer((dexBody) => {
    currentStats.after = dexBody;
    if (Math.abs(currentStats.before - currentStats.after) < 10) {
      checkHours(Date.now() - currentStats.periodStart);
      captainsLog();
      return;
    } else if (Math.abs(currentStats.before - currentStats.after) > 10 && currentStats.coinsMoved < 200) {
      currentStats.coinsMoved = Math.abs(currentStats.before - currentStats.after);
      currentStats.lastMovement = new Date();
      checkHours(Date.now() - currentStats.periodStart);
      captainsLog();
      return;
    } else if (Math.abs(currentStats.before - currentStats.after) > 10 && currentStats.coinsMoved >= 200) {
      snap();
      return;
    }
  });
};

const stakeout = () => {
  process.stdout.write('\033c');
  console.log(`...turning off the engine...`);
  checkExplorer((dexBody) => {
    currentStats.before = dexBody;
    captainsLog();
    setInterval(isDifferent, 300000);
  });
}

stakeout();

module.exports = {
}
