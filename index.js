const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

/// For avoiding idling and down
const reqTimer = setTimeout(function wakeUp() {
  request("https://shounitelegrambot.herokuapp.com/", function() {
     console.log("WAKE UP DYNO");
  });
  return reqTimer = setTimeout(wakeUp, 1200000);
}, 1200000);


const Telegraf = require('telegraf');
const bot = new Telegraf("1051599642:AAGEYITZs_ToOPdLTtVLEEXZykFzmoVPSRw");
const axios = require('axios');
bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('Hello my friend, write anything');
})
bot.on('text', message=> {
  const text = message.message.text;
  if(text==='Dice') {
    let numb = Math.floor(Math.random() * 7);
    return message.reply('Dice says: ' + numb);
  }
  else {
    axios
    .get(`https://reddit.com/r/${text}/top.json?limit=10`)
    .then(res => {
      const data = res.data.data;
      if (data.children.length < 1)
        return message.reply("The search on reddit haven't results.");
      const link = `https://reddit.com/${data.children[0].data.permalink}`;
      return message.reply(link);
    })
    .catch(err => {
      console.log(err);
      return message.reply('try to another search (in english)');
    });
  }
  
    
});
bot.startPolling();