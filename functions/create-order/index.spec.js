// Declaring environments here so the imported lambda funtion
// would get access to its definitions

const expect = require('chai').expect
const awsMock = require('aws-sdk-mock')
const aws = require('aws-sdk')
const index = require('./index')

// process.env.ORDERS_TABLE = 'empty'
const ordersTable = require('../backend.json').backend.ordersTableName

process.env.ORDERS_TABLE = ordersTable

const region = process.env.REGION || 'us-east-2'
const dynamo = new aws.DynamoDB.DocumentClient({ region })

// console.log('\n\n', ordersTable, '\n\n')

// awsMock.setSDKInstance(aws)
// beforeEach(() => {
//   awsMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
//     console.log(JSON.stringify(params, null, 2))
//     callback(null, 'ok')
//   })
// })

// afterEach(() => {
//   awsMock.restore('DynamoDB.DocumentClient')
// })

describe('Create Order Success', () => {

  const order = {
      // id: '' + Date.now(),
      id: '(>*.*)> ___test',
      customer: '(>*.*)> ___test',
      items: [{ name: 'sample', type: 'sample', qty: 1 }],
      staff: '(>*.*)> ___test'
    }

  const event = {
    body: JSON.stringify(order)
  }


  async function getItem(customer, id) {
    return dynamo.get({
      TableName: ordersTable,
      Key: {customer, id}
    }).promise()
  }

  // after(()=> {
  //   return dynamo.delete({
  //     TableName: ordersTable,
  //     Key: {customer: order.customer, id: order.id}
  //   }).promise()
  // })


  it('Should create an order', async () => {
    const res = await dynamo.scan({
      TableName: ordersTable,
    }).promise()
    console.log('res.Items', res.Items)
    const testItem = await getItem(order.customer, order.id)
    expect(testItem.Item).to.be.undefined
    // // console.table(testItem.Item)
    const result = await index.handler(event)
    console.log('result',result)
    const newItem = await getItem(order.customer, order.id)
    expect(newItem.Item).to.have.property('id').eq(order.id)
    expect(newItem.Item).to.have.property('customer').eq(order.customer)
    expect(newItem.Item).to.have.property('staff').eq(order.staff)
    expect(result.statusCode).to.equal(200)
  }).timeout(5000)

  it('Should return cors headers', async () => {
    const result = await index.handler(event)
    expect(result.headers['Access-Control-Allow-Headers']).to.equal('Content-Type')
    expect(result.headers['Access-Control-Allow-Origin']).to.equal('*')
    expect(result.headers['Access-Control-Allow-Methods']).to.equal('OPTIONS,POST,GET,PUT,PATCH')
  }).timeout(5000)
})
