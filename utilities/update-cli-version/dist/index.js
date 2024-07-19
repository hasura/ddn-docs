"use strict";
const utilities = require('./utilities');
const main = async () => {
    try {
        await utilities.writeVersionToFile();
        console.log('Version fetched and written to file successfully.');
    }
    catch (error) {
        console.error('Failed to fetch and write version:', error);
    }
};
main();
