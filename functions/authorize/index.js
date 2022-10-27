const aws = require('aws-sdk')

const region = process.env.REGION || 'us-east-2'

const dynamo = new aws.DynamoDB.DocumentClient({ region })

async function handler(event) {
    const eventJson = JSON.stringify(event, null, 2)
    console.log(eventJson)
    const token = event.authorizationToken
    console.log('token', token)

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: token ? 'Allow' : 'Deny',
            // Effect: token === process.env.MAINTENANCE_API_KEY ? 'Allow' : 'Deny',
            Resource: `arn:aws:execute-api:${region}:*:*`,
          },
        ],
      }
    
      console.log(policyDocument, token)
    
      return {
        policyDocument,
        principalId: 'apigateway.amazonaws.com',
      }
}

module.exports = { handler }
