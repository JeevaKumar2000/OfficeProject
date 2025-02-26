/**
 * Handles the main menu logic based on the retry counter and updates session parameters accordingly.
 *
 * @param {Request} request - The incoming request object.
 * @param {object} promptProperty - Contains prompt strings for different scenarios.
 * @returns {object} jsonResponse - The JSON response with updated session info and fulfillment response.
 */
const utils = require('../utils/utils.js');

async function PCS3000_MainMenu(request, promptProperty) {
    let parameters = {};
    let prompts = [];
    let jsonResponse = {
        sessionInfo: request.body.sessionInfo,
        fulfillment_response: utils.fulfillment_response(),
    };
    try {
        // Extract parameters from sessionInfo if available
        if ('parameters' in (request.body.sessionInfo)) {
            parameters = request.body.sessionInfo.parameters;
        }

        //let dyna = CorporateServices_PCS3000_MainMenu;
        console.log('To  prompt  :', promptProperty);
        // Determine response text and update retry counter
        switch (parameters.menuRetryCounter){
            case '0':
                console.info('ConversationId:', parameters.ConversationId || 'N/A');
                prompts = [promptProperty.CorporateServices_PCS3000_MainMenu];
                jsonResponse = utils.audioFileRead(prompts, request);
                jsonResponse.sessionInfo.parameters.menuRetryCounter = '1';
                break;
            case '1':
                prompts = [promptProperty.CorporateServices_PCS3000_CommonRetry1,
                promptProperty.CorporateServices_PCS3000_NINM1_MainMenu];
                jsonResponse = utils.audioFileRead(prompts, request);
                jsonResponse.sessionInfo.parameters.menuRetryCounter = '2';
                break;
            case '2':
                prompts = [promptProperty.CorporateServices_PCS3000_CommonRetry2,
                promptProperty.CorporateServices_PCS3000_NINM2_MainMenu];
                jsonResponse = utils.audioFileRead(prompts, request);
                jsonResponse.sessionInfo.parameters.menuRetryCounter = '3';
                break;
            default:
                jsonResponse.targetPage = utils.endSessionPageUrl(request); // Get end session URL
                jsonResponse.sessionInfo.parameters.inquiryType = "max_attempt";
                break;
        }

        
    }catch(e){
        console.error(e.message);
    }
    return jsonResponse;
};
module.exports = { PCS3000_MainMenu };