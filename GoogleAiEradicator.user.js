// ==UserScript==
// @name        Google Ai Eradicator
// @namespace   HanneKaffeekanne
// @license     GPL 3.0
// @match       https://www.google.com/search*
// @match       https://mail.google.com/mail*
// @version     1.0
// @author      Hannes Leonhartsberger
// @description Removes the google ai overview from a search query as it is naturally prone to inaccuracy and pushes any results down further.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// ==/UserScript==

//! Remove ai overview from google search
let targetPath = 'M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.34C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z';

function nodeContainsAiImage(node) {
    let nodeStyle;

    try {
        nodeStyle = getComputedStyle(node);
    } catch (e) {
        return false;
    }

    return nodeStyle["mask-image"].includes(targetPath ) || nodeStyle["-webkit-mask-image"].includes(targetPath) || node.getAttribute("d") === targetPath;
}

function recursiveAiImageCheck(node) {
    if(nodeContainsAiImage(node)) {
        return true;
    }

    for(let childNode of node.childNodes) {
        if(recursiveAiImageCheck(childNode)) {
            return true;
        }
    }

    return false;
}

// Container of main content
for(let node of document.querySelector("div#rcnt > div:has(h1)").children) {
    if(node.id === 'center_col') return;

    if(recursiveAiImageCheck(node)) {
        node.remove();
    }
};

// Main content
document.querySelectorAll("div#rso > div").forEach((node) => {
    if(recursiveAiImageCheck(node)) {
        node.remove();
    }
});

//! Remove Mail Ai
const disconnect = VM.observe(document.body, () => {
    const node = document.querySelector("div:has(> div.r4vW1e.e5IPTd)");

    if(node) {
        node.remove();

        return true;
    }
});
