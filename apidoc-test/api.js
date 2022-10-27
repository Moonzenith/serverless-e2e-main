/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
function getOrders() {
    return []
}

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */



// --------------------------------------
// create
/**
 * @api {post} /orders create an order on ddbb =)
 * @apiName CreateOrder
 * @apiGroup Orders
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


// get orders

/**
 * 
 * @api {get} /orders getOrders
 * @apiName GetOrders
 * @apiGroup Orders
 * @apiVersion  1.1.1
 * 
 * 
 * @apiSuccess (200) {type} list of orders
 * 
 * 
 * @apiSuccessExample {OrderJSON[]} Success-Response:
 * [{
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
 * }]
 * 
 * 
 */


// update

/**
 * 
 * @api {patch} /orders/:customer/:id updateOrder
 * @apiName UpdateOrder
 * @apiGroup Orders
 * @apiVersion  1.1.1
 * 
 * 
 * @apiParam  {String} customer customer id
 * @apiParam  {String} id order id
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     status: 'done'
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true
 * }
 * 
 * 
 */