"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeVersionToFile = void 0;
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const writeVersionToFile = async () => {
    const version = await getLatestVersion();
    const versionData = { tag_name: version || 'v1.0.0' };
    const filePath = path.resolve(__dirname, '../latest-version.json');
    fs.writeFileSync(filePath, JSON.stringify(versionData, null, 2));
    console.log('Latest version written to', filePath);
};
exports.writeVersionToFile = writeVersionToFile;
const getLatestVersion = async () => {
    const URL = process.env.V3_CLI_RELEASE_URL;
    const TOKEN = process.env.GH_CLI_VERSION_TOKEN;
    // We'll appease the compiler of any non-string possibilities
    if (!URL || !TOKEN) {
        throw new Error(`Environment variables V3_CLI_RELEASE_URL and GH_CLI_VERSION_TOKEN must be defined in this utility's .env`);
    }
    try {
        const response = await fetch(URL, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: 'application/vnd.github+json',
                'X-Github-Api-Version': '2022-11-28',
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching latest release: ${response.statusText}`);
        }
        const release = await response.json();
        return release.tag_name;
    }
    catch (error) {
        console.error('Error retrieving latest release:', error);
        return null;
    }
};
(0, exports.writeVersionToFile)();
