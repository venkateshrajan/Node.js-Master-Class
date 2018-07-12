/*
 * Main entry for the Assignement #1 project
 * 
 */

// Dependencies
var http = require( 'http' );
var StringDecoder = require( 'string_decoder' ).StringDecoder;
var url = require( 'url' );

// Container for the app
var app = {};

// Configure the server with the path handlers and send hello world response
app.server = http.createServer( function( req, res ) {
    // Get the url and parse it
    var parsedUrl = url.parse( req.url, true );

    // Get the pathname from the parsed url and trim it
    var pathName = parsedUrl.pathname;
    var trimmedPath = pathName.replace( /^\/+|\/+$/g, '' );

    // Get query string object
    var queryStringObject = parsedUrl.query;

    // Not going to use the header and the method. So not getting them.
    // Get the payload
    var decoder = new StringDecoder( 'utf-8' );
    var buffer = '';

    // Collect payload when the data stream is coming
    req.on( 'data', function( chunk ) {
        buffer += decoder.write( chunk );
    } );

    // Once the request has fully come prepare the response
    req.on( 'end', function() {
        buffer += decoder.end();

        // create the data object
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'payload' : app.convertToJsonObject( buffer )
        };

        // Route the request to the correct handler
        var handlerForTheRequest = typeof( app.router[ trimmedPath ] ) !== 'undefined' ? app.router[ trimmedPath ] : app.router.notFound;
        handlerForTheRequest( data, function( statusCode, resPayload ) {
            // collect the response
            statusCode = typeof( statusCode ) == 'number' ? statusCode : 404;
            resPayload = typeof( resPayload ) == 'object' ? resPayload : {};

            // stringify the payload
            var strResPayload = JSON.stringify( resPayload );
            
            // send the response
            res.setHeader( 'Content-Type', 'application/json' );
            res.writeHead( statusCode );
            res.end( strResPayload );

            // log the request and the response
            console.log( 'Request : ', data );
            console.log( 'Response : ', statusCode, resPayload );
        } );
            
    } );

} );

// Start the server for the port 3000.
// Didn't create config.js file as this is a simple hello world application.
app.server.listen( 3000, function() {
    console.log( 'Server is now listening on the port 3000' );
} );

// Utility functions
// Convert To JSON Object
app.convertToJsonObject = function ( str ) {
    try {
        return JSON.parse( str );
    } catch ( e ) {
        return false
    }
};

// Handlers for the requests
app.handlers = {};

// Hello Hanlder
app.handlers.hello = function( data, callback ) {
    // Check if they sent their name as a query string, if so get it and say hello, NAME
    var name = typeof( data.queryStringObject.name ) == 'string' && data.queryStringObject.name.trim().length > 0 ? data.queryStringObject.name.trim() : false;
    
    if ( name ) {
        callback( 200, { 'Message' : 'Hello, ' + name + '!' } );
    } else if ( data.payload ) {
        // Check if they sent any payload, if so get the name from it.
        name = typeof( data.payload.name ) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
        if ( name ) callback( 200, { 'Message' : 'Hello, ' + name + '!' } );
        else callback( 200, { 'Message' : 'Hello World!' } );
    } else {
        callback( 200, { 'Message' : 'Hello World!' } );
    }
    
};

// Not found Handler
app.handlers.notFound = function ( data, callback ) {
    callback( 404 )
;};

// Router that routes all the request paths
app.router = {
    'hello' : app.handlers.hello 
};


// Export the module
module.exports = app;
