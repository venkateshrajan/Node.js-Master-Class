/*
* This file is the starting point of the application
* Author: Venky
* Description: Trying out myself what the lecturer has taught me in this lesson
* Date: 10th July 2018
*
*/

// import the required libraries
var mathLib = require( './lib/math' )
var jokesLib = require( './lib/jokes' )

// app object
var app = {}

// app properties
app.TIMEOUT = 1000

// app methods
app.execute = function() {
    var jokes = jokesLib.allJokes()
    var randomJoke = jokes[ mathLib.getRandomNumber( 0, jokes.length-1 ) ] 
    console.log( randomJoke  )
}

// IndefiniteLoop
app.IndefiniteLoop = function() {
    setInterval( app.execute, app.TIMEOUT )
}

// Invoke the indefiniteLoop
app.IndefiniteLoop()