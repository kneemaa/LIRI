require("dotenv").config();

var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv[2];
var searchTerm = process.argv[3];
var logOutput = "*---------------------------------------------------*\n";



if (searchTerm){
	logOutput += userInput + " " + searchTerm + "\n";
} else {
	logOutput += userInput + "\n";
}

switch (userInput) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifySong(searchTerm);
		break;
	case "do-what-it-says":
		random();
		break;
	case "movie-this":
		movieSearch(searchTerm);
		break;
	case "--help":
		help();
		break;
	default:
		console.log("Type --help to get a list of commands");
}

function help(){
	console.log("usage: node liri.js [option] [searchTerm] \n \
	my-tweets : gets the last 20 tweets for user 'funkyfreshmonke' \n \
	spotify-this-song : searches for a song by keywords \n \
		input your search parameters enclosed with quotes as the searchTerm \n \
	movie-this : search for a movie by the movie name\n \
		input your search parameters enclosed with quotes as the searchTerm \n \
	do-what-it-says : randomly searches for a song in spotify based off parameters set in random.txt")
}

function myTweets(){
	var twitterHandle = {screen_name: "funkyfreshmonke"};
	client.get("statuses/user_timeline", twitterHandle, function(error, tweets, response) {
		if (!error){
			for (i = 0; i < 20; i++){
				var tweet = tweets[i].text;
				logOutput += tweet + "\n";
				console.log(tweet);	
			}
		}
		log();
	})

}

function spotifySong(searchTerm){
	if (!searchTerm){
		searchTerm = "The Sign Ace of Base";
	}

	spotify.search({ type: "track", query: searchTerm}, function(error, data) {
		if (error) {
			logOutput += "Error Occured: " + error + "\n";
			return console.log("Error Occured: " + error);
		}
		
		var artistName = data.tracks.items[0].album.artists[0].name;
		var trackName = data.tracks.items[0].name;
		var albumName = data.tracks.items[0].album.name;
		var previewUrl = data.tracks.items[0].preview_url;
		
		logOutput += "Artist: " + artistName + "\n";
		logOutput += "Track: " + trackName + "\n";
		logOutput += "Album: " + albumName + "\n";
		logOutput += "Preview Url: " + previewUrl + "\n";

		console.log("Artist: " + artistName);
		console.log("Track: " + trackName);
		console.log("Album: " + albumName);
		console.log("Preview Url: " + previewUrl);
		log();
	})
}


function movieSearch(searchTerm) {
	if (!searchTerm){
		searchTerm = "Mr. Nobody";
	}

	request("http://www.omdbapi.com/?t="+searchTerm+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
	
	if (JSON.parse(body).Response === "False"){
		return console.log("Movie not found!");
	}

	if (!error && response.statusCode === 200) {

	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Year Released: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
	    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
	    console.log("Country of Production: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors);

	    logOutput += "Title: " + JSON.parse(body).Title + "\n";
	    logOutput += "Year Released: " + JSON.parse(body).Year + "\n";
	    logOutput += "IMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\n";
	    logOutput += "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n";
	    logOutput += "Country of Production: " + JSON.parse(body).Country + "\n";
	    logOutput += "Language: " + JSON.parse(body).Language + "\n";
	    logOutput += "Plot: " + JSON.parse(body).Plot + "\n";
	    logOutput += "Actors: " + JSON.parse(body).Actors + "\n";
	  }

	log();
	});
}


function random(){
	fs.readFile("random.txt", "utf-8", function(error, data){
		if (error) {
			console.log(error);
			return;
		}

		var values = data.split(",");

		switch (values[0]){
			case "spotify-this-song":
				spotifySong(values[1]);
				break;
			case "my-tweets":
				myTweets();
				break;
			default:
				console.log("Unknown Input in random.txt");
		}

	})
}

function log(){
	logOutput += "*---------------------------------------------------*\n";
	fs.appendFile("log.txt", logOutput, function(error){
		if (error) {
			console.log(error);
		}
	})
}

