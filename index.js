const functions = require('@google-cloud/functions-framework');
const { PCS3000_MainMenu } = require('./Menu/PCS3000_MainMenu.js');
const { PCS3000_CheckConfidence } = require('./Menu/PCS3000_CheckConfidence.js');
const { PCS3000_ConfirmationMenu } = require('./Menu/PCS3000_ConfirmationMenu.js');
const utils = require('./utils/utils.js');
require('dotenv').config();
const fileName = process.env.fileName;
let promptList = null;

functions.http('corporateServicesWebhook', async (request, response) => {
    let jsonResponse = {
        sessionInfo: request.body.sessionInfo,
        fulfillment_response: utils.fulfillment_response(),
    };
    let tag = request.body.fulfillmentInfo.tag;
    console.log('---------------------------');
    console.log('Tag : ', tag);
    try{
        // Load prompt list if not already loaded
        if (!promptList) {
            promptList = utils.downloadPromptFile(fileName);
            console.log(" ******* Retrieved PromptList ********* ");
        }
        // Route requests based on tag
        if (utils.equalsIgnoreCase(tag , 'CorporateServices_PCS3000_MainMenu')) {
            console.info(' CorporateServices Tag Started ');
            jsonResponse = await PCS3000_MainMenu(request, promptList);
        } else if(utils.equalsIgnoreCase(tag , 'CorporateServices_CheckConfidence')) {
            jsonResponse = await PCS3000_CheckConfidence(request);
        } else if(utils.equalsIgnoreCase(tag , 'CorporateServices_PCS3000_SubMenu_ConfirmationMenu')) {
            jsonResponse = await PCS3000_ConfirmationMenu(request, promptList);
        }else{
            let text = "";
            console.error(`There are no fulfillment responses defined for "${tag}" tag`);
            jsonResponse.fulfillment_response.messages[0].text.text[0] = text;
        }
    }catch (error) {
        console.error('Error in techcentralWebhook:', error.message);
    }
    response.send(jsonResponse);
	
});
