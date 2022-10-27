const { handler } = require('./index')

const event = {
    "resource": "/orders",
    "path": "/orders",
    "httpMethod": "GET",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Authorization": "json.web.token",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-ASN": "7018",
        "CloudFront-Viewer-Country": "US",
        "content-type": "text/html",
        "Host": "8t7m526y4i.execute-api.us-east-2.amazonaws.com",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Via": "1.1 0e65005fd8b7270f4abc0c23bd5f2fbc.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "GNpFj1NyOCH2EXxcX3o9r2nL45JBItC3GC4Zu1OKJFtCwaOtfXczEA==",
        "X-Amzn-Trace-Id": "Root=1-62e344a9-7b984da21303b3df0208de1e",
        "X-Forwarded-For": "172.11.78.176, 15.158.2.243",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept": [
            "*/*"
        ],
        "Accept-Encoding": [
            "gzip, deflate, br"
        ],
        "Authorization": [
            "json.web.token"
        ],
        "CloudFront-Forwarded-Proto": [
            "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
            "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
            "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
            "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
            "false"
        ],
        "CloudFront-Viewer-ASN": [
            "7018"
        ],
        "CloudFront-Viewer-Country": [
            "US"
        ],
        "content-type": [
            "text/html"
        ],
        "Host": [
            "8t7m526y4i.execute-api.us-east-2.amazonaws.com"
        ],
        "User-Agent": [
            "Thunder Client (https://www.thunderclient.com)"
        ],
        "Via": [
            "1.1 0e65005fd8b7270f4abc0c23bd5f2fbc.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
            "GNpFj1NyOCH2EXxcX3o9r2nL45JBItC3GC4Zu1OKJFtCwaOtfXczEA=="
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-62e344a9-7b984da21303b3df0208de1e"
        ],
        "X-Forwarded-For": [
            "172.11.78.176, 15.158.2.243"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "resourceId": "ow3xwo",
        "authorizer": {
            "principalId": "apigateway.amazonaws.com",
            "integrationLatency": 0
        },
        "resourcePath": "/orders",
        "httpMethod": "GET",
        "extendedRequestId": "WAeqiFfqiYcF_YQ=",
        "requestTime": "29/Jul/2022:02:23:37 +0000",
        "path": "/dev/orders",
        "accountId": "760178732320",
        "protocol": "HTTP/1.1",
        "stage": "dev",
        "domainPrefix": "8t7m526y4i",
        "requestTimeEpoch": 1659061417625,
        "requestId": "a23d4177-6d46-4e07-af9f-db40876a9a6c",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "172.11.78.176",
            "principalOrgId": null,
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Thunder Client (https://www.thunderclient.com)",
            "user": null
        },
        "domainName": "8t7m526y4i.execute-api.us-east-2.amazonaws.com",
        "apiId": "8t7m526y4i"
    },
    "body": null,
    "isBase64Encoded": false
}

handler(event)
    .then(console.log)
    .catch(console.error)

