/*
* Library for data manipulation
*
*/

// Dependencies
var fs = require( 'fs' );
var path = require( 'path' );
var helpers = require( './helpers' );

// Container for the library
var lib = {};

// Get the base directory in which all the files has to be created
lib.baseDir = path.join( __dirname, '/../.data/' );

// Create a file and add data to it
lib.create = function( dir, file, data, callback ) {
    var fileName = this.baseDir + dir + '/' + file + '.json';

    fs.open( fileName, 'wx', function( err, fileDescriptor ) {
        if( !err && fileDescriptor ) {
            // Write the data and close the file
            var stringData = JSON.stringify( data );
            fs.writeFile( fileDescriptor, stringData, function( err ) {
                if( !err ) {
                    fs.close( fileDescriptor, function( err ) {
                        if( !err ) {
                            callback( false );
                        } else {
                            callback( 'Error failed to close new file [' + fileName + ']. Error: ', err );
                        }
                    });
                } else {
                    callback( 'Error write failed to new file[' + fileName + ']. Error: ', err );
                }
            });
        } else {
            callback( 'Could not create file [' + fileName + ']. File may already exists')
        }
    });
};

// Read the file that has been already created
lib.read = function( dir, file, callback ) {
    var fileName = this.baseDir + dir + '/' + file + '.json';

    fs.readFile( fileName, 'utf8', function(err, data) {
        if ( !err ) {
            var obj = helpers.parseToJsonObject( data );
            if ( obj ) {
                callback( false, obj );
            } else {
                callback( 'Cannot parse the read data as json object' );
            }
        } else {
            callback( err, data );
        }
    });
};

// Update the existing file with the new data
lib.update = function( dir, file, data, callback ) {
    var fileName = this.baseDir + dir + '/' + file + '.json';

    fs.open( fileName, 'r+', function( err, fileDescriptor ) {
        if( !err && fileDescriptor ) {
            // Write the data and close the file
            var stringData = JSON.stringify( data );
            fs.truncate( fileDescriptor, function( err ) {
                if ( !err ) {
                    fs.writeFile( fileDescriptor, stringData, function( err ) {
                        if( !err ) {
                            fs.close( fileDescriptor, function( err ) {
                                if( !err ) {
                                    callback( false );
                                } else {
                                    callback( 'Error failed to close new file [' + fileName + ']. Error: ', err );
                                }
                            });
                        } else {
                            callback( 'Error write failed to new file[' + fileName + ']. Error: ', err );
                        }
                    });
                } else {
                    callback( 'Error truncate failed to new file[' + fileName + ']. Error: ', err );
                }
            });
            
        } else {
            callback( 'Could not create file [' + fileName + ']. File may already exists')
        }
    });
};

// Delete the file
lib.delete = function( dir, file, callback ) {
    var fileName = this.baseDir + dir + '/' + file + '.json';

    fs.unlink( fileName, function( err ) {
        if ( !err ) {
            callback( false );
        } else {
            callback( 'Error failed to unline the file [' + fileName + ']. Error: ' + err );
        }
    });
};


// Export the container object
module.exports = lib;