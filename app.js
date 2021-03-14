var express = require('express');
var cron = require('node-cron');
const axios = require('axios');
var app = express();
const sgMail = require('@sendgrid/mail');

const emailList = ["kmr.ammit@gmail.com", "ajayynitkkr@gmail.com"];

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
  console.log(process.env.SENDGRID_API_KEY);
  console.log('Example app listening on port 3000!');
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
  
