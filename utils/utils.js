const PropertiesReader = require('properties-reader');
const path = require('path');

/**
 * Generates a standard fulfillment response structure.
 * @returns {object} Fulfillment response template.
 */
function fulfillment_response() {
    return {
        messages: [{
            text: {
                text: [""]
            }
        }]
    };
}

/**
 * Reads a .properties file and converts its contents to a JSON object.
 * @param {string} fileName - The name of the .properties file.
 * @returns {object|null} JSON representation of the properties file, or null if an error occurs.
 */
function downloadPromptFile(fileName) {
    const propertiesJSON = {};
    try {
        const absolutePath = path.resolve(__dirname, 'properties', fileName);
        const properties = PropertiesReader(absolutePath);
        // Convert properties to JSON format
        properties.each((key, value) => {
            propertiesJSON[key] = value;
        });
        console.log(`Data retrieved from /utils/properties/${fileName} using PropertiesReader.`);
        return propertiesJSON;
    } catch (error) {
        console.error(`Error in downloadPromptFile: ${error.message}`);
        return null;
    }
}

/**
 * Constructs the URL for ending a session based on the current page.
 * @param {Request} request - Incoming HTTP request object.
 * @returns {string} URL of the end session page.
 */
function endSessionPageUrl(request) {
    try {
        const currentPage = request.body.pageInfo.currentPage;
        const lastIndex = currentPage.lastIndexOf('/');
        const endSessionPageUrl = currentPage.substring(0, lastIndex) + '/END_SESSION';
        return endSessionPageUrl;
    } catch (error) {
        console.error(`Error in endSessionPageUrl: ${error.message}`);
        return '';
    }
}

/**
 * Compares two strings for equality, ignoring case sensitivity.
 * @param {string} str1 - First string to compare.
 * @param {string} str2 - Second string to compare.
 * @returns {boolean} True if strings are equal (ignoring case), otherwise false.
 */
function equalsIgnoreCase(str1, str2) {
    if (!str1 || !str2) {
        console.error('Invalid strings provided for comparison.');
        return false;
    }
    return str1.toLowerCase() === str2.toLowerCase();
}

/**
 * Constructs a JSON response containing session info and fulfillment messages.
 * Processes prompts to create audio or text-based responses.
 *
 * @param {string[]} prompts - Array of prompt strings.
 * @param {Request} request - Incoming HTTP request object containing session information.
 * @returns {Object} JSON response with session info and fulfillment messages.
 */
function audioFileRead(prompts, request) {
    console.log('Entered audioFileRead');
    // Initialize response object
    let jsonResponse = {
        sessionInfo: request.body.sessionInfo,
        fulfillment_response: fulfillment_response(),
    };
    // Process each prompt
        prompts.forEach(prompt => {
        console.log('Entered loop prompt value is: ' + prompt);
        if (prompt.startsWith("urn")) {
            jsonResponse.fulfillment_response.messages.push({
                playAudio: {
                    audioUri: prompt
                }
            });
        } else {
            jsonResponse.fulfillment_response.messages.push({
                text: {
                    text: [prompt]
                }
            });
        }
    });
    return jsonResponse;
}

module.exports = {
    fulfillment_response,
    downloadPromptFile,
    endSessionPageUrl,
    equalsIgnoreCase,
    audioFileRead,
};