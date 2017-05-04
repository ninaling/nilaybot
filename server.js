require('dotenv').config();
var async = require('async');
var http = require("http");
var server = http.createServer(function(request, response) {});

server.listen(process.env.PORT || 8080);

var GroupMe = require('groupme');
var API = GroupMe.Stateless;

var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var BOT_ID = null;
var USER_ID = process.env.USER_ID;
var BOT_NAME = process.env.BOT_NAME;

var incoming = new GroupMe.IncomingStream(ACCESS_TOKEN, USER_ID, null);

incoming.on('connected', function() {
  console.log("[IncomingStream 'connected']");

  API.Bots.index(ACCESS_TOKEN, function(err,ret) {
    if (!err) {
      for (var i = 0; i < ret.length; i++) {
        if (ret[i].name == BOT_NAME) {
          BOT_ID = ret[i].bot_id;
        }
      }
      console.log("[API.Bots.index return] Firing up bot! ID:", BOT_ID);
      (function meetingTimeCheck() {
        if ((new Date()).getDay() == 3 && (new Date()).getHours() == 20) {
          API.Bots.post(ACCESS_TOKEN, BOT_ID, meetingTime[0], {},
            function(err,res) {
              if (err) {
                console.log("[API.Bots.post] Reply Message Error!");
              } else {
                console.log("[API.Bots.post] Reply Message Sent!");
                API.Bots.post(ACCESS_TOKEN, BOT_ID, meetingTime[1], {},
                  function(err,res) {
                    if (err) {
                      console.log("[API.Bots.post] Reply Message Error!");
                    } else {
                      console.log("[API.Bots.post] Reply Message Sent!");
                    }
                  });
              }
            });
        }
         setTimeout(meetingTimeCheck, 1000 * 60 * 60);
      })();
    }
  });
});

incoming.on('message', function(msg) {
  if (msg["data"]
    && msg["data"]["subject"]
    && msg["data"]["subject"]["text"]) {

    if (msg["data"]["subject"]["name"] != BOT_NAME) {
      console.log("[IncomingStream 'message'] Message Received!");
      handleIncomingMessage(msg);
    }
  }
});

incoming.connect();

var handleIncomingMessage = function(msg) {
  console.log(msg["data"]);

  var words;
  if ( words = msg["data"]["subject"]["text"].split(' ') ) {
    if (words[0].toLowerCase() == "nilaybot") {
      if (words[1].toLowerCase() == "stuff") {
        API.Bots.post(ACCESS_TOKEN, BOT_ID, stuff, {},
          function(err,res) {
            if (err) {
              console.log("[API.Bots.post] Reply Message Error!");
            } else {
              console.log("[API.Bots.post] Reply Message Sent!");
            }
          });
      }
      else if (words[1].toLowerCase() == "help") {
        API.Bots.post(ACCESS_TOKEN, BOT_ID, help, {},
          function(err,res) {
            if (err) {
              console.log("[API.Bots.post] Reply Message Error!");
            } else {
              console.log("[API.Bots.post] Reply Message Sent!");
            }
          });
      }
      else if (words[1].toLowerCase() == "hello") {
        API.Bots.post(ACCESS_TOKEN, BOT_ID, hello[Math.floor(Math.random() * hello.length)], {},
          function(err,res) {
            if (err) {
              console.log("[API.Bots.post] Reply Message Error!");
            } else {
              console.log("[API.Bots.post] Reply Message Sent!");
            }
          });
      }
    }
  }
}

var stuff = "Hello, you have reached the official SEP nilaybot. Help yourself to some official stuff:" + '\n'
  + "Constitution: " + process.env.CONSTITUTION + '\n'
  + "Bylaws: " + process.env.BYLAWS  + '\n'
  + "Anonymous Feedback Form: " + process.env.FEEDBACK  + '\n'
  + "Peace out";

var help = "Here are the commands I currently support:" + '\n'
  + "nilaybot hello - ;)" + '\n'
  + "nilaybot help - displays a list of supported commands" + '\n'
  + "nilaybot stuff - displays a list of links to all official documents and an anonymous feedback form";

var hello = [
  "SHUT THE FUCK UP",
  "SIT THE FUCK DOWN",
  "CAVA 4 LYFE",
  "STOP SLEEPING NINA"
];

var meetingTime = ["TIME FOR MEETING", "SHUT THE FUCK UP AND SIT THE FUCK DOWN"];
