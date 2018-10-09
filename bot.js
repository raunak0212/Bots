var restclient = require('node-restclient');
var Twit = require('twit');
var app = require('express').createServer();
var Request = require("request");


// Provide the twitter app info here
var T = new Twit({
  consumer_key:         'A5h1YPENCeRxLsGBpC1sQStJa', 
  consumer_secret:      'ENTupBRf7kWAmqV5QIKqS9kHJl8yqDBotiePeLO5pCAdYWoVNZ',
  access_token:         '2915717846-bdKrQ0vgj3s9xA6r7mX1nyE2Lm1gMHhm16ZRrba',
  access_token_secret:  'NwMsR3mijbiQXlUiqwEBxjTMCrHBAaGdaOrIYriee6qwc',
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

// every 1 hour, create motivation tweet
// wrapped in a try/catch in case Twitter is unresponsive, don't really care about error
// handling. it just won't tweet.
setInterval(function() {
  try {
    getQuote();
  }
 catch (e) {
    console.log(e);
  }
},360);

// every 5 hours, check for people who have RTed a quote, and favorite that quote
setInterval(function() {
  try {
    favRTs();
  }
 catch (e) {
    console.log(e);
  }
},600*60*5);
