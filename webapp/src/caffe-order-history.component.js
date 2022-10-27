// const html = function (templates, ...values) {
//     const template = document.createElement('template')
//     let str = ''
//     templates.forEach((template, index) => {
//         str += template
//         str = values[index] ? str + values[index] : str
//     })
//     template.innerHTML = str.trim()
//     return template.content
// }

class CaffeOrderHistory extends HTMLElement {

    constructor() {
        super()
    }

    get _children() {
        const list = this._list
        if (!list) return []
        return [...list.children]
    }

    get _list() {
        const list = this.querySelector('.order-history')
        // if(!list) throw new Error('list not ready')
        if (!list) return null
        return list
    }

    /**
     *
     *
     * @param {{id:string, customer: string, items: {name:string, type: string, qty:number}[]}} order
     * @memberof CaffeOrderHistory
     */
    addItem(order) {
        const orderItem = html`
            <caffe-order-history-item customer="${order.customer}" id="${order.id}">
                ${order.items.map(item => 
                    html`<caffe-cart-item name="${item.name}" type="${item.type}" qty="${item.qty}" editable="false"></caffe-cart-item>`
                    .outerHTML)}
            </caffe-order-history-item>
        `
        // console.log('adding item', orderItem)
        const index = this._children.findIndex(child => child.id === order.id)

        if(index === -1) {
            this._list.appendChild(orderItem)
        }
    }

    clear() {
        this._children.forEach(child => this._list.removeChild(child))
    }

    _render() {
        const inner = html`
            <section id="order-list" class="order-list-container">
                <h1>SHOP RECORD</h1>
                <ol class="order-history">
                    <!-- content -->
                </ol>
            </section>
        `

        const children = [...this.children]
        this.innerHTML = ''
        this.appendChild(inner)
        const list = inner.querySelector('.order-history')
        children.forEach(child => list.appendChild(child))
    }

    connectedCallback() { this._render() }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) { }

    adoptedCallback() { }

}

window.customElements.define('caffe-order-history', CaffeOrderHistory)
