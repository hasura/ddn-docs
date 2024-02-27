"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const logic_1 = require("./logic");
async function main() {
    try {
        console.log(process.cwd());
        const schema = JSON.parse((0, fs_1.readFileSync)('../../schema_examples/supergraph_or_subgraph_object.schemajson', 'utf8'));
        const markdown = (0, logic_1.generateMarkdown)(schema);
        (0, logic_1.writeMarkdownToFile)(markdown);
    }
    catch (error) {
        console.error('Error generating markdown:', error);
    }
}
main();
