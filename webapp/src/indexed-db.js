// run()

async function GetIndexedDBInstance() {

const orders = ['user1', 'user3', 'user2'].map(user => new Order({ customer: user, items: [] }))
console.log(orders)

const tableName = 'caffe-db'


    return new Promise((resolve, reject) => {

        let openRequest = indexedDB.open(tableName, 2)

        openRequest.onupgradeneeded = function (event) {
            const db = event.target.result
            // console.log(db)
            const ordersStore = db.createObjectStore(tableName, { keyPath: 'id' })

            // ordersStore.createIndex('id', 'id', { unique: true })
            ordersStore.createIndex('customer', 'customer', { unique: false })

        }

        openRequest.onerror = function () {
            console.error("Error", openRequest.error)
        }

        openRequest.onsuccess = function () {
            let db = openRequest.result

            resolve(Object.freeze({
                saveOrder: order => saveOrder(db, order),
                getOrders: query => getOrders(db, query),
                deleteOrder: id => deleteOrder(id),
            }))

            // const order = new Order({ customer: 'diegotrs', items: [] })
            // saveOrder(db, order)
            //     // .then(console.log)
            //     .then(() => getOrders(db))
            //     // getOrders()
            //     .then(res => console.log('res', res))
            //     .then(() => console.log('(>*.*)>'))
            //     .catch(console.error)
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
async function getOrders(db, query) {

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
async function saveOrder(db, order) {
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
async function deleteOrder(db, id) {
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










