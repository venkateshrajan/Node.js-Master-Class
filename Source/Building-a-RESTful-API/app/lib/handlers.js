/*
 * This file contains the logic of all the request handlers
 *
 */

// Dependencies
var _data = require( './data' );
var helpers = require( './helpers' );

// Define the handlers
var handlers = {};

/*              HANDLER #1 ---> PING                */
// Ping handler
handlers.ping = function( data, callback ) {
    // just send 200 back to say we are alive
    callback( 200 );
};


/*              HANDLER #2 ---> USERS                */
// Define users handlers object
handlers._users = {};

// Users handler
handlers.users = function ( data, callback ) {
    // Check for valid types of request, allow only POST, GET, PUT, DELETE requests
    if( data.method == 'post' || data.method == 'get' || data.method == 'put' || data.method == 'delete' ) {
        handlers._users[data.method]( data, function( err, payload ) {
            callback( err, payload );
        });
    } else {
        callback( 400, {'Error' : 'Invalid request type'} );
    }
};

// Users - POST
// Required fields : firstName, lastName, phone, password, tosAgreement
// Optional fields : none
handlers._users.post = function( data, callback ) {
    var firstName = typeof( data.payload.firstName ) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof( data.payload.lastName ) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof( data.payload.phone ) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof( data.payload.password ) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof( data.payload.tosAgreement ) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if( firstName && lastName && phone && password && tosAgreement) {
        // Check if the user is already present, if so throw an error at them
        _data.read('users', phone, function( err, dataRead ) {
            if( err ) {
                // Create an user and update the hashed password, Don't store the raw password
                var hashedPassword = helpers.hash( password );
                if ( hashedPassword ) {
                    var userData = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : tosAgreement
                    };

                    // update the data to db
                    _data.create('users', phone, userData, function( err ) {
                        if ( !err ) callback( 200 );
                        else callback( 500, {'Error' : 'Cannot create the user'} );
                    });
                } else {
                    callback( 500, {'Error' : 'Couldn\'t hash the given password'} );
                }
            } else {
                callback( 400, {'Error' : 'User with this phone number already exists'} );
            }
        });
    }
    else {
        callback( 400, {'Error' : 'Missing required fields'} );
    }
};

// Users - GET
// Required fiedls : phone
// Optional fiedls : none
// @TODO Only authenticated users should access their information.
handlers._users.get = function( data, callback ) {
    var phone = typeof( data.queryStringObject.phone ) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if( phone ) {
        _data.read('users', phone, function( err, dataRead ) {
            if( !err ) {
                delete dataRead.hashedPassword;
                callback( 200, dataRead );
            } else {
                callback( 500, 'cannot find the user with this phone number. Error: ', err);
            }
        });
    } else {
        callback( 400, {'Error' : 'Missing required fields'} );
    }
};

// Users - PUT
// Required fields : phone
// Optional fields : firstName, lastName, password
// @TODO Only authenticated users should update their information
handlers._users.put = function( data, callback ) {
    var phone = typeof( data.payload.phone ) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    if( phone ) {
        var firstName = typeof( data.payload.firstName ) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        var lastName = typeof( data.payload.lastName ) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        var password = typeof( data.payload.password ) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

        if( firstName || lastName || password ) {
            // Check if the user is already present, if so throw an error at them
            _data.read('users', phone, function( err, dataRead ) {
                if( !err ) {
                    if( firstName )
                        dataRead.firstName = firstName;
                    if( lastName )
                        dataRead.lastName = lastName;
                    if( password ) {
                        var hashedPassword = helpers.hash( password );
                        if ( hashedPassword ) {
                            dataRead.hashedPassword = hashedPassword;
                        } else {
                            callback( 500, {'Error' : 'Couldn\'t hash the given password'} );
                        }        
                    }
                    // update the data to db
                    _data.update('users', phone, dataRead, function( err ) {
                        if ( !err ) callback( 200 );
                        else callback( 500, {'Error' : 'Cannot create the user'} );
                    });
                } else {
                    callback( 400, {'Error' : 'Cannot find the user with this phone number ' + phone + '. Error: ', err} );
                }
            });
        }
        else {
            callback( 400, {'Error' : 'No information has been given to update the user details'} );
        }
    } else {
        callback( 400, {'Error' : 'Missing required fields'} );
    }  
};

// Users - DELETE
// Required fields : phone
// Optional fields : none
// @TODO Only authenticated users should be able to delete their account
// @TODO Whenever the user account is getting deleted we should delete all its associated information
handlers._users.delete = function( data, callback ) {
    var phone = typeof( data.queryStringObject.phone ) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if( phone ) {
        _data.read('users', phone, function( err, dataRead ) {
            if( !err ) {
                _data.delete('users', phone, function( err ) {
                    if( !err ) {
                        callback( 200 );
                    } else {
                        callback( 500, 'Cannot delete the user with the phone ' + phone + '. Error: ', err );
                    }
                });
            } else {
                callback( 500, 'cannot find the user with this phone number. Error: ', err);
            }
        });
    } else {
        callback( 400, {'Error' : 'Missing required fields'} );
    }
};


/*              HANDLER #2 ---> TOKENS                */

// Not found handler
handlers.notFound = function( data, callback ) {
    // send 404 status code
    callback( 404 );
};

// Export the module
module.exports = handlers
