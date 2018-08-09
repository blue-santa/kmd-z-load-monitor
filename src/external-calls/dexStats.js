const path = require('path');
const request = require('request');
const http = require('http');
const exec = require('child_process').exec;

const base = 'https://dexstats.info/';
const catchMeIfYouCanSong = '/../assets/audio/catch-me-if-you-can-title.mp3';
const catchMeIfYouCan = 'http://localhost:3001';

let minionsMoving = {
  before: '',
  after: '',
  minions: 0,
  moonlightTotal: 0,
  moonlightPretty: 0,
  engineShutDown: Date.now(),
  lastGlimpse: ''
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
    let dexBody = body;
    let findKMD = 'KMD_snapshot.json';
    let findPrivacyRow = 'badge-dark">';
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
  if (minionsMoving.minions) {
    console.log(`...minions moved: ${minionsMoving.minions}`);
  }
  if (minionsMoving.lastGlimpse) {
    console.log(`...last glimpse: ${minionsMoving.lastGlimpse}`);
  }
  console.log(`...moonlight traveled: ${minionsMoving.moonlightPretty}`);
}

const captureMoonlight = (moonlightCaptured) => {
  minionsMoving.moonlightTotal = moonlightCaptured;
  minionsMoving.moonlightPretty = (moonlightCaptured/1000/360/60).toFixed(4);
}

function isDifferent() {
  process.stdout.write('\033c');
  console.log(`...peeping...`);
  checkExplorer((dexBody) => {
    minionsMoving.after = dexBody;
    if (Math.abs(minionsMoving.before - minionsMoving.after) < 10) {
      captureMoonlight(Date.now() - minionsMoving.engineShutDown);
      captainsLog();
      return;
    } else if (Math.abs(minionsMoving.before - minionsMoving.after) > 10 && minionsMoving.minions < 200) {
      minionsMoving.minions = Math.abs(minionsMoving.before - minionsMoving.after);
      minionsMoving.lastGlimpse = new Date();
      captureMoonlight(Date.now() - minionsMoving.engineShutDown);
      captainsLog();
      return;
    } else if (Math.abs(minionsMoving.before - minionsMoving.after) > 10 && minionsMoving.minions >= 200) {
      snap();
      return; 
    }
  });
};

const stakeout = () => {
  process.stdout.write('\033c');
  console.log(`...turning off the engine...`);
  checkExplorer((dexBody) => {
    minionsMoving.before = dexBody;
    captainsLog();
    setInterval(isDifferent, 300000);
  });
}

stakeout();

module.exports = {
}
