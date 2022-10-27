

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
        this.id = json.id || '' + Date.now()
        this.customer = json.customer || 'guest'
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

console.log('from the worker')

async function loadApiSettings() {
    const settings = await fetch('/api.json').then(res => res.json())
    console.log('settings', settings)
    return settings.api
}

const refreshOrders = async (apiUrl) => {
    console.log('getting orders')

    console.time('remote orders')
    getOrders(apiUrl).then(orders => {
        this.postMessage({ type: 'getOrders', orders: orders, })
        console.timeEnd('remote orders')
    })

    let db = null
    // const db = await GetIndexedDBInstance()
    try { db = await GetIndexedDBInstance() } catch (err) { console.warn(err.message) }
    if (!db) return

    console.time('local orders')
    const localOrders = await db.getOrders()
    // console.log(localOrders)

    const ordersToDelete = localOrders.filter(order => Date.now() > (Number(order._expireOn) * 1000))
    if (ordersToDelete.length > 0) console.log('deleting', ordersToDelete.length)

    const deletePromises = ordersToDelete.map(order => db.deleteOrder(order.id))
    await Promise.all(deletePromises)

    this.postMessage({
        type: 'getOrders',
        orders: localOrders,
    })
    console.timeEnd('local orders')

}

let token = null

onmessage = async function (event) {
    const { apiUrl } = await loadApiSettings()
    let db = null
    try { db = await GetIndexedDBInstance() } catch (err) { console.warn(err.message) }

    const data = event.data
    console.group('Web Worker')
    console.log(data)

    const eventType = event.data.type

    if (eventType === 'session') return token = event.data.token
    if (eventType === 'getOrders') return refreshOrders(apiUrl)

    if (eventType === 'createOrder') {
        const order = event.data.order
        this.postMessage({
            type: 'createOrder',
            order: await createOrder(`${apiUrl}orders`, order)
        })

        db && db.saveOrder(order).then(res => console.log('saving order on local ddbb'))

        return refreshOrders(apiUrl)
    }

    if (eventType === 'logout') {
        console.log('logging out', token)
        return token = null
    }

    if (eventType === 'login') {
        const { credentials } = event.data
        console.log('logging in with ', credentials)
        await login(`${apiUrl}authenticate`, credentials)
        return
    }


    console.groupEnd()
}

async function login(authUrl, credentials) {
    const { token } = await fetch(authUrl, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    console.log(token)
    this.postMessage({ type: 'loggedin', token, })
    return token
}

async function getOrders(apiUrl) {
    const url = `${apiUrl}orders`
    // [ ] 2.3.1: get orders from api

    console.log('token on get orders', token)
    const orders = await fetch(url,
        // [ ] 5.3.1 use Authorization header on http getOrders
        {
            headers: {
                'Authorization': token, //'json.web.token', 
            }
        }
    ).then(res => res.json())
    return orders
}

async function getOrdersHtml(apiUrl) {
    const url = `${apiUrl}orders`
    // [o] 2.3.1: get orders from api
    const ordersHtml = await fetch(url,
        // [o] 5.3.1 use Authorization header on http getOrders
        {
            headers: {
                'Content-Type': 'text/html',
                'Authorization': token, // 'json.web.token',
            }
        }
    ).then(res => res.text()).catch(err => console.warn(err))
    return ordersHtml
}

/**
    *
    *
    * @param {Order} order
    * @return {*} 
    */
function createOrder(url, order) {
    const { id, customer, items } = order
    // [ ] 2.3.2: send the order to the api
    const options = {
        method: 'POST',
        body: JSON.stringify({ items, customer, id, }),
        headers: {
            'Content-Type': 'application/json',

            // [ ] 5.3.2 use Authorization header on http createOrder
            'Authorization': 'json.web.token'
        }
    }

    
    return fetch(url, options).then(res => res.json())
}




//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


const tableName = 'caffe-db'


async function GetIndexedDBInstance() {
    return new Promise((resolve, reject) => {

        let openRequest = indexedDB.open(tableName, 1)

        openRequest.onupgradeneeded = function (event) {
            console.info('onupgradeneeded')
            const db = event.target.result
            // console.log(db)
            const ordersStore = db.createObjectStore(tableName, { keyPath: 'id' })

            // ordersStore.createIndex('id', 'id', { unique: true })
            ordersStore.createIndex('customer', 'customer', { unique: false })

        }

        openRequest.onerror = function (err) {
            console.error("Error", openRequest.error)
            reject(err)
        }

        openRequest.onsuccess = function () {
            console.info('db connected')
            let db = openRequest.result

            resolve(Object.freeze({
                saveOrder: order => saveLocalOrder(db, order),
                getOrders: query => getLocalOrders(db, query),
                deleteOrder: id => deleteLocalOrder(db, id),
            }))
        }

    })
}




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////






/**
 * @param {IDBDatabase} db
 * @param {*} query
 * @return {*} 
 */
async function getLocalOrders(db, query) {

    return new Promise((resolve, reject) => {
        const tx = db.transaction(tableName, 'readwrite')
        const store = tx.objectStore(tableName)
        const req = store.getAll()

        req.onsuccess = (event) => resolve(event.target.result)
        req.onerror = (err) => reject(err)
        tx.commit()
    })

}


/**
 * @param {IDBDatabase} db
 * @param {Order} order
 * @return {*} 
 */
async function saveLocalOrder(db, order) {
    return new Promise((resolve, reject) => {

        const tx = db.transaction(tableName, 'readwrite')

        tx.oncomplete = (event) => resolve(event)
        tx.onerror = (err) => reject(err)

        const store = tx.objectStore(tableName)
        const req = store.add(order)

        req.onerror = (err) => { console.error(err) }
        req.onsuccess = (res) => { console.log(res) }

        tx.commit()

    })
}

/**
 * @param {IDBDatabase} db
 * @param {id} string
 * @return {*} 
 */
async function deleteLocalOrder(db, id) {
    return new Promise((resolve, reject) => {

        const tx = db.transaction(tableName, 'readwrite')

        tx.oncomplete = (event) => resolve(event)
        tx.onerror = (err) => reject(err)

        const store = tx.objectStore(tableName)
        const req = store.delete(id)

        req.onerror = (err) => { console.error(err) }
        req.onsuccess = (res) => { console.log(res) }


        tx.commit()

    })
}












