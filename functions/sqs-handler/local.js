const { handler } = require('./index')


const event = {
    "Records": [
        {
            "messageId": "cd70fa9c-f7d7-4629-93e3-7d3a2ddc16a8",
            "receiptHandle": "AQEBgWXUQ8ZeGwGO+X85+FNJSga9ADzvHjrgnl3U5+7VlIUUNnmd93YajXGuB69Q4xH0iWLhwoMk6RLnoUj01vqVEhO2AP/jtE7IbrTwm3P97tvScALtGDN2qfLzvTof51pE2GEm50CtYUSFhHJiPjHbC0wS3HSSUlZnJsaCS/lJLcLprz3fRhnNkgVmnXW2eFyPic+rW2LPB8jDRyDy4ihktaXFrv0ntk6GrcNHkeJ7dzEJjD1TkTeKSHJC/F6KFh0nqnv0ROqMixKhnf01zoxk6qifG+CwO9B1N9kkj7MrXTRIwIk/D29UQJcsbGkK3trxsiz8WII8BHc/4/aE+YvZ4vsQ7h6kxbXwtBYb8K4rHWKmJzrSO8E52szUcaOSRpBsn6bX1A/e76rv1tM2m/85h3nOEiMrYTWyhjMGAX9jXtw=",
            "body": "{\"_procecedAt\":null,\"_createdAt\":1658785738027,\"id\":\"1658785737819\",\"_filledAt\":null,\"items\":[{\"qty\":6,\"name\":\"avocado toast\",\"type\":\"meal\"}],\"_expireOn\":1658786338.027,\"customer\":\"diegotrs\"}",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1658785738954",
                "SenderId": "AROAXUV77IE5OMMLSPXRB:backend-dynamoHandler15FDB600-pBtCP7wwUTTZ",
                "ApproximateFirstReceiveTimestamp": "1658785738957"
            },
            "messageAttributes": {},
            "md5OfBody": "c3047332f4849f9fe431b08d418cfda2",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-2:525462356282:backend-ordersQueueD9D34795-txcw3TjlzCgR",
            "awsRegion": "us-east-2"
        }
    ]
}


handler(event)
    .then(console.log)
    .catch(console.error)