/**
 * Evaluates confidence score from the request and sets the confidence level.
 * @param {Request} request - Incoming HTTP request object.
 * @returns {object} jsonResponse - Response object with updated confidence level.
 */
const utils = require('../utils/utils.js');

async function PCS3000_CheckConfidence(request) {
    let confidence = 0.0;
    let confidenceLevel = 'low';
    let parameters = {};
    let jsonResponse = {
        sessionInfo: request.body.sessionInfo,
        fulfillment_response: utils.fulfillment_response(),
    };
    try {
        // Extract parameters if available
        if ('parameters' in request.body.sessionInfo) {
            parameters = request.body.sessionInfo.parameters;
        }
        // Extract confidence score from intentInfo
        if ('intentInfo' in request.body && 'confidence' in request.body.intentInfo) {
            confidence = request.body.intentInfo.confidence;
            console.info('Confidence Score:', confidence);
            // Set confidence level based on score
            confidenceLevel = confidence >= 0.500 ? 'high' : 'low';
            //Hardcode
            confidenceLevel = 'low';
            //Hardcode
        }
        // Update confidence level in response
        jsonResponse.sessionInfo.parameters.confidenceLevel = confidenceLevel;
        console.info('Confidence Level:', confidenceLevel);
    } catch (error) {
        console.error('Error in TC1000_CheckConfidence:', error.message);
    }
    return jsonResponse;
};
module.exports = { PCS3000_CheckConfidence };