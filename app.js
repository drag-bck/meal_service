const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const app = express();
const sgMail = require('@sendgrid/mail');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const port = process.env.PORT||3000;
app.use(compression());
app.use(helmet());

const emailList = ["kmr.ammit@gmail.com", "ajayynitkkr@gmail.com"];

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, function () {
  console.log('Preventing WW#3 on port 💣',port);
  cron.schedule('0 0 11 * * *', () => {
    fireAll();
  });
});

function fireAll() {
  axios.get('http://www.randomnumberapi.com/api/v1.0/random?min=0&max=99&count=1')
  .then((res) => {
      emailList.forEach((item) => {
        const message = createMessage(res.data, item);
        mailGun(item, message);
      });
  })
  .catch((err) => {
    console.log("ERROR WHILE FETCHING RANDOM NUMBER: ", err);
    fireAll();
  })
}

function mailGun (mailAddress, message) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: mailAddress,
    from: 'amit.kumar5@1mg.com',
    subject: 'Avoid WW#3',
    text: message,
    html: message,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error('ERROR SGMAIL: ', error)
    })
};

function createMessage (arr, mailId) {
  const foodList = ["lunch", "dinner"];
  if(arr[0] <= 49) {
    if(mailId == emailList[0]) {
      return `You are entitled with ${foodList[0]} 🍖`;
    } else {
      return `You are entitled with ${foodList[1]} 🍖`;
    }
  } else {
    if(mailId == emailList[0]) {
      return `You are entitled with ${foodList[1]} 🍖`;
    } else {
      return `You are entitled with ${foodList[0]} 🍖`;
    }
  }
  return "Fire All!!! 🏹";
};
  
