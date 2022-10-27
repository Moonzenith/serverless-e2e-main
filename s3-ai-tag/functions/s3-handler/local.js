const handler = require('./index').handler // as
const event = {
    "Records": [
        {
            "eventVersion": "2.1",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-2",
            "eventTime": "2022-09-19T22:41:37.864Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "AWS:AROA3KSBLIMHIHN3KZ36N:diegotrs-Isengard"
            },
            "requestParameters": {
                "sourceIPAddress": "172.11.78.176"
            },
            "responseElements": {
                "x-amz-request-id": "MX1MKFR8J5KY408V",
                "x-amz-id-2": "vgJJh0mtQVEDnw70v05Emf7id4NzmiWSIck+fyAlHUkb0USdVn9CvMinzBeng046WJi57iHcxJds6zySRM/0smnfmjBAG37mdOmqa8VywU4="
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "YTcwMjNjMjctYWZkYi00YjI0LWE1ZGYtNGZkZDQwNWZiMjhj",
                "bucket": {
                    "name": "s3-ai-tag-srcbucketa467747d-yyzd5foph9zm",
                    "ownerIdentity": {
                        "principalId": "A3L4K80ZY6D71F"
                    },
                    "arn": "arn:aws:s3:::s3-ai-tag-srcbucketa467747d-yyzd5foph9zm"
                },
                "object": {
                    "key": "3.jpg",
                    "size": 28869,
                    "eTag": "b047111d720fe1f7d50f8e9ad90b639e",
                    "sequencer": "006328F021C96387D6"
                }
            }
        }
    ]
}



handler(event,  {} )
    .then(res => console.log(res))
    .catch(err => console.error(err))