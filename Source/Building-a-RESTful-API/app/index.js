/*
* This is the starting file of the API
*
*/

// Dependencies
var http = require( 'http' );
var url = require( 'url' );
var StringDecoder = require( 'string_decoder' ).StringDecoder;
var config = require( './lib/config' );
var https = require( 'https' );
var fs = require( 'fs' );
var handlers = require( './lib/handlers' );
var helpers = require( './lib/helpers' );

// Instantiate the HTTP server
var httpServer = http.createServer( function( req, res ) {
    unifiedServer( req, res );
} );

// Start the HTTP server
httpServer.listen( config.httpPort, function() {
    console.log( "The HTTP server is listening to the port " + config.httpPort );
} );

// Create an option with all the https options
var httpsOptions = {
    'key' : fs.readFileSync( './https/key.pem' ),
    'cert' : fs.readFileSync( './https/cert.pem' )
};

// Instantiate the HTTPS server
var httpsServer = https.createServer( httpsOptions, function( req, res ) {
    unifiedServer( req, res );
} );

// Start the HTTPS server
httpsServer.listen( config.httpsPort, function() {
    console.log( "The HTTPS server is listening to the port " + config.httpsPort );
} );

// Create unifiedServer where all the server logics will go
var unifiedServer = function ( req, res ) {
    // Get the URL and parse it
    var parsedUrl = url.parse( req.url, true );

    // Get the pathname from the parsed URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g, '');

    // Get the query string object from the request
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the request headers
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder( 'utf-8' );
    var buffer = '';
    // collect the payload stream
    req.on( 'data', function( data ){
        buffer += decoder.write( data );
    } );
    // on end of the request
    req.on( 'end', function(){
        buffer += decoder.end();

        // Construct the data object with all the information that we parsed from the request
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseToJsonObject( buffer )
        }

        // route the request to the request handler, or route it to the default handler
        var routedHandler = typeof( router[trimmedPath] ) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // call the routed handler with the data and the callback
        routedHandler( data, function( statusCode, payload ) {
            // if the statusCode is not a number assign a default status code
            statusCode = typeof(statusCode) == 'number' ? statusCode : 404;
            
            // if there is no payload sent then assing an empty object as a payload
            payload = typeof( payload ) == 'object' ? payload : {};

            // convert the payload to a string
            var payloadString = JSON.stringify( payload );

            // Send the response to the caller
            res.setHeader( 'Content-Type', 'application/json' );
            res.writeHead( statusCode );
            res.end( payloadString );

            // Log the request and the response
            console.log( 'Request : ', data );
            console.log( 'Response : ', statusCode, payload );
        });

    } );
};

// Define a router as object
var router = {
    'ping' : handlers.ping,
    'users' : handlers.users
};