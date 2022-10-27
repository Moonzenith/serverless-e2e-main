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

async function handler(event) {
    const eventJson = JSON.stringify(event, null, 2)
    console.log(eventJson)
    const orderId = event.pathParameters.id
    const cusotmer = event.pathParameters.customer 
    const status = JSON.parse(event.body).status

    // [ ] 3.2.3: use table on updateOrder - patch an order on dynamodb table
    return {
        body: JSON.stringify({orderId, cusotmer, status}),
        statusCode: 200,
    };
}

module.exports = { handler }
