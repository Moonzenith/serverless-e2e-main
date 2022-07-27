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

/**
 * @api {post} /orders create an order on ddbb
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiBody {OrderJSON} order order
 * @apiSuccess {OrderJSON} log newly created log.
 * @apiSuccessExample {type} Success-Response:
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
    const eventJson = JSON.stringify(event, null, 2)
    console.log(eventJson)
    const order = new Order(JSON.parse(event.body))

    // [ ] 3.2.2: use table on createOrder - save order on dynamodb table

    
    return {
        body: JSON.stringify(order),
        statusCode: 200,
    };
}

module.exports = { handler }
