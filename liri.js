require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv[2];
var searchTerm = process.argv[3];


switch (userInput) {
	case "my-tweets":
		console.log("my-tweets");
		myTweets();
		break;
	case "spotify-this-song":
		console.log("spotify-this-song");
		spotifySong(searchTerm);
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

function spotifySong(searchTerm){
	if (!searchTerm){
		searchTerm = "The Sign";
	}

	spotify.search({ type: "track", query: searchTerm}, function(error, data) {
		if (error) {
			return console.log("Error Occured: " + error);
		}
		for (i = 0; i < 20; i++){
			var artistName = data.tracks.items[i].album.artists[0].name;
			var trackName = data.tracks.items[i].name;
			var albumName = data.tracks.items[i].album.name;
			var previewUrl = data.tracks.items[i].preview_url;
			
			console.log(artistName);
			console.log(trackName);
			console.log(albumName);
			console.log(previewUrl);
			console.log("---------------------------");
		}
	})
}

