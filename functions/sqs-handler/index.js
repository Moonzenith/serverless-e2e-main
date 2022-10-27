const aws = require('aws-sdk')
const axios = require('axios').default
const https = ('https')

const ordersQueue = process.env.QUEUE



function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

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
    // [ ] get messages from sqs and auto approve them

    /** @type {Order[]} */
    const orders = event.Records
        .map(record => {
            const order = new Order(JSON.parse(record.body))
            order._filledAt = Date.now() + randomIntFromInterval(1000, 10000)
            return order
        })

    console.log('orders')
    console.log(orders)
    const url = `https://gps0ppz983.execute-api.us-east-2.amazonaws.com/dev/orders`

    // const res = await axios.get(url, {
    //     headers: {
    //         Authorization: 'json.web.token'
    //     }
    // }).then(res => res.data)
    // post to patch and that's it

    const promises = orders.map(order => {
        return axios.patch(`${url}/${order.customer}/${order.id}`, {
            _filledAt: order._filledAt,
            status: 'filled',
        }, {
            headers: {
                Authorization: 'json.web.token'
            }
        })
        .then(res => res.data)
        .catch(err => {
            console.log(err.message)
            return err.message
        })
    })

    const result = await Promise.all(promises)
    console.log(JSON.stringify(result, null, 2))
    return result

    return new Promise((resolve, reject) => {


        // https.req(url, res => {
        //     let data = ''
        //     res.on('data', chunk => data += chunk)
        //     res.on('end', ()=> resolve(data))
        // })



        https.request(
            `https://gps0ppz983.execute-api.us-east-2.amazonaws.com/dev/orders`, {
            method: 'GET',
            headers: {
                Authentication: 'json.web.tokens',
            },
        },
            res => {
                let data = ''
                res.on('data', chunk => data += chunk)
                res.on('end', () => resolve(data))
            })

        // setTimeout(() => {
        //     https.
        //     resolve({
        //         body: JSON.stringify({ json: eventJson }),
        //         statusCode: 200,
        //     })
        // }, randomIntFromInterval(1000, 10000))

    })
        .then(res => {
            console.log('res')
            console.log(JSON.stringify(res, null, 2))
            return res
        })
}

module.exports = { handler }
