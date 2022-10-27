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

    const orders = [{
        id: 'test',
        customer: 'test',
        items: [],
        staff: null
    }]
    
    // [ ] 3.2.1 use table on getOrders - get all orders from dynamodb
    
    return {
        body: JSON.stringify(orders),
        statusCode: 200,
    };
}

module.exports = { handler }
