/*
* This file has apis to load the jokes
* Author: Venky
* Description: Trying out myself what the lecturer has taught me in this lesson
* Date: 10th July 2018
*
*/

// import fs library to read the jokes file
var fsLib = require( 'fs' )

// create jokes object
var jokes = {}

// this function will read all the jokes from jokes.txt file
jokes.allJokes = function() {
    return fsLib.readFileSync( __dirname+"/jokes.txt", "utf8" ).split( /\r?\n/ )
}

// export jokes object
module.exports = jokes
