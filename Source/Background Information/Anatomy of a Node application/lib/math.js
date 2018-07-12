/*
* This file contains math apis
* Author: Venky
* Description: Trying out myself what the lecturer has taught me in this lesson
* Date: 10th July 2018
*
*/

// math object
var math = {}

math.getRandomNumber = function( min, max ) {
    return min + Math.floor( Math.random() * max )
}

module.exports = math;
