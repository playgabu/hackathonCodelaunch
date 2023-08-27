import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

const $ENV = process.env.env;

export const sns = new AWS.SNS();

export const publishNotification = async(endpointArn, notification) => {
    let messageFormated = {
        "GCM": JSON.stringify(notification)
    }
    let sendParams = {
        Message: JSON.stringify(messageFormated),
        TargetArn: endpointArn,
        MessageStructure: 'json'
    };
    await sns.publish(sendParams).promise();
}

export const addTokenToSNSTopic = async(token) => {
    let params = {
        PlatformApplicationArn: process.env.snsTopicArn,
        Token: token,
    }
    let EndpointArn = await sns.createPlatformEndpoint(params).promise();
    return EndpointArn;
}

export const removeTokenFromSNSTopic = async(arn) => {
    let params = {
        EndpointArn: arn
    };
    await sns.deleteEndpoint(params).promise();
}