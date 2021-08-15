import {apiBase, intents, symblAppId, symblAppSecret, summaryEmails} from "../config";
import sdk from "symbl-node/build/client.sdk.min"; //Attaches the Symbl Client SDK to window

const clientSDK = new window.ClientSDK();

let stopEndpointTimeoutRef = null;

export const startEndpoint = async (phoneNumber, callback, endCallAfterInSeconds = 300) => {
    try {
        await clientSDK.init({
            appId: symblAppId,
            appSecret: symblAppSecret,
            basePath: apiBase
        });

        const connection = await clientSDK.startEndpoint({
            endpoint: {
                type: 'pstn',
                phoneNumber
            },
            intents,
            actions: [{
                "invokeOn": "stop",
                "name": "sendSummaryEmail",
                "parameters": {
                    "emails": summaryEmails // Add array of emails to which the email is to be sent at the end of the call
                }
            }],
            data: {
                session: {
                    name: `Live Intent Detection Demo - ${phoneNumber}` // Title of the Meeting, this will be reflected in summary email if configured.
                }
            }
        }, callback);

        const connectionId = connection.connectionId;
        console.log('Call established for connectionId: ' + connectionId);

        stopEndpointTimeoutRef = setTimeout(async () => {
            clearTimeout(stopEndpointTimeoutRef);
            stopEndpointTimeoutRef = null;
            await stopEndpoint(connectionId);
        }, endCallAfterInSeconds * 1000);

        return connectionId;
    } catch (e) {
        console.error('Error in establishing startEndpoint call with SDK', e);
        throw e;
    }
};

export const stopEndpoint = async (connectionId) => {
    console.log('Stopping connection for ' + connectionId);

    if (stopEndpointTimeoutRef) {
        clearTimeout(stopEndpointTimeoutRef);
        stopEndpointTimeoutRef = null;
    }

    try {
        const connection = await clientSDK.stopEndpoint({
            connectionId
        });

        console.log('Summary Info:', connection.summaryInfo);
        console.log('Conversation ID:', connection.conversationId);

        return {
            summaryInfo: connection.summaryInfo,
            conversationId: connection.conversationId
        };
    } catch (e) {
        console.error('Error while stopping the connection.', e);
        throw e;
    }
};
