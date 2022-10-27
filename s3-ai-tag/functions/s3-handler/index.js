//https://constructs.dev/contribute

const aws = require('aws-sdk')
const { log, warn, error } = console
// asd
const rekognition = new aws.Rekognition()
const s3 = new aws.S3()

exports.handler = async function (event, context) {

    log(JSON.stringify(event, undefined, 2))

    for (let record of event.Records) {
        console.log(JSON.stringify(record, undefined, 2))
        const { bucket, object } = record.s3
        const objectKey = decodeURIComponent(object.key).replace(/[+]/g, ' ')

        // [ ] use rekognition to get content moderation


        // [x] use rekognition to get labels
        const params = {
            Image: {
                S3Object: {
                    Bucket: bucket.name,
                    Name: objectKey,
                },
            },
        }

        console.log(params)

        // labels
        async function getAITags(params) {

            const res = await rekognition.detectLabels({ ...params, MaxLabels: 7}).promise()

            console.log(res)
            console.log(res.Labels)
            console.log(res.LabelModelVersion)

            // [ ] add this labels as tags on the s3 object
            const TagSet = res.Labels.map(label => ({ Key: `ai-tag:${label.Name}`, Value: `${label.Confidence}` }))
            const tagParams = {
                Bucket: bucket.name,
                Key: objectKey,
                Tagging: {
                    TagSet,
                }
            }
            return tagParams
        }
        // labels

        // moderation labels
        async function getModerationTags(params) {
            const res = await rekognition.detectModerationLabels(params).promise()

            console.log(res)
            console.log(res.ModerationLabels)
            console.log(res.LabelModelVersion)

            // // [ ] add this labels as tags on the s3 object
            const TagSet = res.ModerationLabels.map(label => ({ Key: `ai-moderation:${label.Name}`, Value: `${label.Confidence}` }))
            const tagParams = {
                Bucket: bucket.name,
                Key: objectKey,
                Tagging: {
                    TagSet,
                }
            }
            return tagParams

        }


        const tagParams = await getAITags(params)
        const moderationTagParams = await getModerationTags(params)
        console.log(JSON.stringify(tagParams, undefined, 2))
        console.log(JSON.stringify(moderationTagParams, undefined, 2))
        await s3.putObjectTagging(tagParams).promise()
        await s3.putObjectTagging(moderationTagParams).promise()



        // moderation labels


    }

    return {
        body: JSON.stringify({
            success: true,
            // bucket,
            // object,
            // res,
            // tagRes,
        }),
        status: 200,
    }

}

