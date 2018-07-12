/*
 * This file contains all the utility functions that are required for this project
 * 
 */

// Dependencies
var crypto = require( 'crypto' );
var config = require( './config' );

// Container object for the library
var helpers = {};

// Hash the input string using SHA256
helpers.hash = function( inputString ) {
    if ( typeof( inputString ) == 'string' && inputString.trim().length > 0 )
        return crypto.createHmac('sha256', config.hasingSecret ).update( inputString.trim() ).digest( 'str' );
    else
        return false;
};

// string to json object
helpers.parseToJsonObject = function( data ) {
    try {
        return JSON.parse( data );
    } catch (e) {
        return false;
    }
};

// Export the module
module.exports = helpers