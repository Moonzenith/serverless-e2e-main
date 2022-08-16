const aws = require('aws-sdk')

class OrderItem {
    constructor(params) {
        this.name = params.name || ''
        this.type = params.type || ''
        this.qty = Number(params.qty) || 0
    }
}
class Order {
    /** @param {OrderJSON} json */
    constructor(json) {
        this.id = json.id
        this.customer = json.customer
        this.staff = json.staff
        this._createdAt = json._createdAt || Date.now()
        
        this._filledAt = json._createdAt || null
        this._expireOn = json._expireOn || (new Date().getTime() / 1000) + 10 * 60

        /** @param {OrderItem[]} items */
        this.items = Array.isArray(json.items) ?
            json.items.map(item => new OrderItem(item)) : []
    }

    addItem(name, type, qty) {
        this.items.push({ name, type, qty })
    }
}

const ordersTable = process.env.ORDERS_TABLE || require('../backend.json').backend.ordersTableName
const region = process.env.REGION || 'us-east-2'
const dynamo = new aws.DynamoDB.DocumentClient({ region })


/**
 * @api {post} /orders create an order on ddbb =)
 * @apiName CreateOrder
 * @apiGroup CreateOrder
 * @apiVersion  1.1.1
 *
 * @apiBody {OrderJSON} order order
 * @apiSuccess {OrderJSON} log newly created log.
 * @apiSuccessExample {OrderJSON} Success-Response:
 * {
 *    "username": "alejo",
 *    "date": "1656017418934",
 *    "notes": [
 *     "sample text"
 *    ],
 *    "options": {
 *     "bowType": "recurve",
 *     "category": "junior",
 *     "gender": "male"
 *    },
 *    "value": 90,
 *    "_autoapprove": 1656018019
 * }
 * 
 */
async function handler(event) {
    console.log('\n\n', ordersTable, '\n\n')
    const eventJson = JSON.stringify(event, null, 2)

    // console.log(eventJson)
    const order = new Order(JSON.parse(event.body))
    // console.log(order)
    // [ ] 3.2.2: use table on createOrder - put order on dynamodb table

    await dynamo.put({
        TableName: ordersTable,
        Item: order
    }).promise()
    return {
        body: JSON.stringify(order),
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,PATCH"
        },
    }
}

module.exports = { handler }
