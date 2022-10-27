const { handler } = require('./index')

const event = {
    "Records": [
        {
            "eventID": "c0a2a99f4f075f6400296b99f7457214",
            "eventName": "REMOVE",
            "eventVersion": "1.1",
            "eventSource": "aws:dynamodb",
            "awsRegion": "us-east-2",
            "dynamodb": {
                "ApproximateCreationDateTime": 1658791171,
                "Keys": {
                    "id": {
                        "S": "1658791123384"
                    },
                    "customer": {
                        "S": "diegotrs"
                    }
                },
                "OldImage": {

                    "_createdAt": {
                        "N": "1658791123923"
                    },
                    "id": {
                        "S": "1658791123384"
                    },
                    "_filledAt": {
                        "N": "1658791127156"
                    },
                    "items": {
                        "L": [
                            {
                                "M": {
                                    "qty": {
                                        "N": "4"
                                    },
                                    "name": {
                                        "S": "croisant"
                                    },
                                    "type": {
                                        "S": "meal"
                                    }
                                }
                            }
                        ]
                    },
                    "_expireOn": {
                        "N": "1658791723.923"
                    },
                    "customer": {
                        "S": "diegotrs"
                    },
                    "status": {
                        "S": "filled"
                    }
                },
                "SequenceNumber": "94600000000004818821055",
                "SizeBytes": 178,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            },
            "eventSourceARN": "arn:aws:dynamodb:us-east-2:525462356282:table/backend-orders46FA7C19-J0NPZQ1LVYDU/stream/2022-07-25T19:46:03.350"
        }
    ]
}

handler(event)
    .then(console.log)
    .catch(console.error)

