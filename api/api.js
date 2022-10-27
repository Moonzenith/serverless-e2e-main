// using claudia api builder


/**
 * @typedef {{
 *  name: string,
 *  type: string,
 *  qty: number 
 * }} ItemJSON
 */

/**
 * @typedef {{
 *  id: string, 
 *  customer: string, 
 *  items: ItemJSON[],
 *  staff: string
 * }} OrderJSON
 */


const ApiBuilder = require('claudia-api-builder')
const api = new ApiBuilder()
const aws = require('aws-sdk')

const dynamo = new aws.DynamoDB.DocumentClient({region: 'us-east-2'})

module.exports = api

const ordersTable = 'webappStack-orders46FA7C19-EPHWZCG1QZ5'

const orders = [{
    id: 1,
    items: [
        { type: 'food', name: 'croisant', qty: 1 },
        { type: 'drink', name: 'capuccino', qty: 1 },
    ],
    customer: 1, 
    staff: 1
}]

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
        this.items = [ ...json.items ]
        this.staff = json.staff
    }

    addItem(name, type, qty) {
        this.items.push({ name, type, qty })
    }
}

/**
 * 
 * @api {GET} /orders getOrders
 * @apiName AWSomeCafe
 * @apiGroup orders
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} paramName description
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * @apiSuccess (200) {OrdersJSON[]} orders all current orders
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
api.get('/orders', async request => {
    // [x] TODO get all orders from dynamodb
    const res = await dynamo.scan({
        TableName: ordersTable, // 'your-table-name',
    }).promise()
    return res.Items
})

/**
 * 
 * @api {POST} /orders createOrder
 * @apiName AWSomeCafe
 * @apiGroup orders
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {OrderJSON} order the new order to be created
 * 
 * @apiSuccess (200) {OrderJSON} order newly created order
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
api.post('/orders', async request => {
    const order = new Order(request.body)
    console.log(order)
    orders.push(order)
    // [x] TODO save order on dynamodb table
    await dynamo.put({
        TableName: ordersTable,
        Item: order
    }).promise()
    return order
})

/**
 * 
 * @api {PATCH} /orders updateOrderStatus
 * @apiName AWSomeCafe
 * @apiGroup orders
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} paramName orderId
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
api.patch('/orders/{customer}/{id}', async request => {
    
    // const orderIndex = orders.findIndex(order => order.id === orderId)
    // if(orderIndex === -1) return new Error('Not found')
    // orders[orderIndex].status = request.body.status
   
    // [x] TODO: patch an order on dynamodb table
    const orderId = request.pathParams.id
    const cusotmer = request.pathParams.customer 
    const status = request.body.status
    console.log('updating orderId:', orderId)
    const res = await dynamo.update({
        TableName: ordersTable,
        Key: {
            id: orderId,
            customer: cusotmer,
        },
        ExpressionAttributeNames: {'#status': 'status'},
        ExpressionAttributeValues: {':status': status},
        UpdateExpression: `set #status = :status`,

    }).promise()

    return res
})