const utils = require('../utils/utils.js');

async function PCS3000_ConfirmationMenu(request, promptProperty) {
    let parameters = {};
    let prompts = [];
    let jsonResponse = {
        sessionInfo: request.body.sessionInfo,
        fulfillment_response: utils.fulfillment_response(),
    };

    try {
        if ('parameters' in (request.body.sessionInfo)) {
            parameters = request.body.sessionInfo.parameters;
        }

        switch (parameters.confirmMenuRetryCount) {
            case '0':
                prompts = [
                    promptProperty.CorporateServices_PCS3000_SubMenu_ConfirmationMenu1,
                    promptProperty[parameters.intentName],
                    promptProperty.CorporateServices_PCS3000_SubMenu_IsThatRight
                ];
                jsonResponse = utils.audioFileRead(prompts, request);
                jsonResponse.sessionInfo.parameters.confirmMenuRetryCount = '1';
                break;
            case '1':
                prompts = [
                    promptProperty.CorporateServices_PCS3000_CommonRetry1,
                    promptProperty.CorporateServices_PCS3000_SubMenu_ConfirmationMenu1,
                    promptProperty[parameters.intentName],
                    promptProperty.CorporateServices_PCS3000_SubMenu_IsThatRight,
                    promptProperty.CorporateServices_PCS3000_SubMenu_Confirm1
                ];
                jsonResponse = utils.audioFileRead(prompts, request);
                jsonResponse.sessionInfo.parameters.confirmMenuRetryCount = '2';
                break;
            case '2':
                prompts = [
                    promptProperty.CorporateServices_PCS3000_CommonRetry2,
                    promptProperty.CorporateServices_PCS3000_SubMenu_ConfirmationMenu1,
                    promptProperty[parameters.intentName],
                    promptProperty.CorporateServices_PCS3000_SubMenu_IsThatRight,
                    promptProperty.CorporateServices_PCS3000_SubMenu_Confirm2
                ];
                jsonResponse = utils.audioFileRead(prompts, request);
                jsonResponse.sessionInfo.parameters.confirmMenuRetryCount = '3';
                break;
            default:
                jsonResponse.targetPage = utils.endSessionPageUrl(request); // End session URL
                jsonResponse.sessionInfo.parameters.inquiryType = "max_attempt";
                break;
        }
        
    } catch (e) {
        console.error('Error:', e);
    }
    return jsonResponse;
}

module.exports = { PCS3000_ConfirmationMenu };
