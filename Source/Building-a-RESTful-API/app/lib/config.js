/*
* This file has different configurations and exports one that the use chooses
*
*/

// Create an object which holds all the environment
var environments = {}

// Create staging environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hasingSecret' : 'ThisIsASecret'
}

// Create production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hasingSecret' : 'ThisIsAlsoASecret'
}

// Get the environment name to export
var envNameToExport = typeof( process.env.NODE_ENV ) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

// Get the environment object to export
var environmentToExport = typeof ( environments[ envNameToExport ] ) == 'object' ? environments[envNameToExport] : {};

// Export the environment
module.exports = environmentToExport;