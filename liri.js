require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv[2];


switch (userInput) {
	case "my-tweets":
		console.log("my-tweets");
		myTweets();
		break;
	case "spotify-this-song":
		console.log("spotify-this-song");
		spotifySong();
		break;
	default:
		console.log("no user input match");
}

function myTweets(){
	var twitterHandle = {screen_name: "funkyfreshmonke"};
	client.get("statuses/user_timeline", twitterHandle, function(error, tweets, response) {
		if (!error){
			for (i = 0; i < 20; i++){
				console.log(tweets[i].text);	
			}
		}
	})
}

function spotifySong(){

}

