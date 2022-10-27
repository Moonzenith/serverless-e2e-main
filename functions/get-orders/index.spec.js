// Declaring environments here so the imported lambda funtion
// would get access to its definitions

// process.env.ORDERS_TABLE = 'empty'
process.env.ORDERS_TABLE = require('../backend.json').backend.ordersTableName

const expect = require('chai').expect
const awsMock = require('aws-sdk-mock')
const aws = require('aws-sdk')
const index = require('./index')

awsMock.setSDKInstance(aws)

describe('Get Orders Success', () => {

  const event = {}

  beforeEach(() => {
    awsMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      console.log(JSON.stringify(params, null, 2))
      callback(null, [{ name: 'diego' }, { name: 'alejo' }])
    })
  })

  afterEach(() => {
    awsMock.restore('DynamoDB.DocumentClient')
  })

  it('Should get current orders', async () => {
    const result = await index.handler(event)
    console.log('result', result)
    expect(result.statusCode).to.equal(200)
  }).timeout(5000)

  it('Should return cors headers', async () => {
    const result = await index.handler(event)
    expect(result.headers['Access-Control-Allow-Headers']).to.equal('Content-Type')
    expect(result.headers['Access-Control-Allow-Origin']).to.equal('*')
    expect(result.headers['Access-Control-Allow-Methods']).to.equal('OPTIONS,POST,GET,PUT,PATCH')
  }).timeout(5000)
})
