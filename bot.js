var restclient = require('node-restclient');
var Twit = require('twit');
var app = require('express').createServer();
var Request = require("request");


// Provide the twitter app info here
var T = new Twit({
  consumer_key:         'PUT YOUR INFO HERE', 
  consumer_secret:     'PUT YOUR INFO HERE',
  access_token:         'PUT YOUR INFO HERE',
  access_token_secret:  'PUT YOUR INFO HERE',
  timeout_ms:           60 * 1000,
});



var getQuoteURL = "http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en&key=457653";

function getQuote() {
    
   Request.get("http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en&key=457653", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(body);

T.post(
  'statuses/update',
  { status: body},
  (err, data, response) => {
    console.log(err, data, response);
  }
)


});

}


function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('Got some RTs'); 
  });
}

//Set the time interval as per wish for the bot to tweet

setInterval(function() {
  try {
    getQuote();
  }
 catch (e) {
    console.log(e);
  }
},360);

// Check for Retweets and favorite for  that quote every time interval. Currently set to 1 hour
setInterval(function() {
  try {
    favRTs();
  }
 catch (e) {
    console.log(e);
  }
},600*60*1);
