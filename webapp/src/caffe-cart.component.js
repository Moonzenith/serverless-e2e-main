// /**
//  *
//  *
//  * @param {string[]} templates
//  * @param {string[]} values
//  * @return {HTMLElement} 
//  */
// const html = function (templates, ...values) {
//     const template = document.createElement('template')
//     let str = ''
//     templates.forEach((template, index) => {
//         str += template
//         str = values[index] ? str + values[index] : str
//     })

//     template.innerHTML = str.trim()
//     return template.content.firstChild
// }


// function importScript(url) {
//     const newScript = document.createElement("script")
//     newScript.src = url //"http://www.example.com/my-script.js"
//     target.appendChild(newScript)

//     // var newScript = document.createElement("script");
//     // var inlineScript = document.createTextNode("alert('Hello World!');");
//     // newScript.appendChild(inlineScript); 
//     // target.appendChild(newScript);

// }



const onPlaceOrder = 'onplaceorder'

class CaffeCart extends HTMLElement {

    _onChildEvent = (event) => {

        console.log(event)
        console.log(event.type)
        console.log(event.detail)

        if (event.type === 'remove-item') this.removeItem(event.detail.name)
    }

    constructor() {
        super()
        this.storeId = this.getAttribute('store-id')
        const children = [...this.children]
        children.forEach(child => child.addEventListener('remove-item', this._onChildEvent))
    }

    get _children() {
        const list = this._list
        if (!list) return []
        return [...list.children]
    }

    get _list() {
        const list = this.querySelector('.shopping-cart')
        // if(!list) throw new Error('list not ready')
        if (!list) return null
        return list
    }

    get items() {
        return this._children.map(child => ({
            name: child.getAttribute('name'),
            type: child.getAttribute('type'),
            qty: Number(child.getAttribute('qty')),
        }))
    }


    _render() {
        /** @type {HTMLElement} */
        const inner = html`
            <section class="shopping-cart-container">
                <!-- <section class=""> -->
                <h1>ORDER</h1>
                <ol class="shopping-cart">
                    <!-- ${this._innerComponents} -->
                </ol>
                <button id="place-order-btn-wc" class="place-order-btn test-place-order-btn">Place order</button>
            </section>
        `

        inner.querySelector(`.place-order-btn`)
            .addEventListener('click', event => {
                console.log(`.place-order-btn`, this.items)
                this.dispatchEvent(new CustomEvent(onPlaceOrder, { detail: this.items }))
            })

        const children = [...this.children]
        children.forEach(child => inner.querySelector('.shopping-cart').appendChild(child))
        this.innerHTML = ''
        this.appendChild(inner)
    }

    addItem(item) {
        console.log('adding item')
        const index = this._children.findIndex(child => child.name === item.name)

        if (index === -1) {

            const newItem = html`<caffe-cart-item name="${item.name}" type="${item.type}" qty="${item.qty}"></caffe-cart-item>`
            newItem.addEventListener('remove-item', this._onChildEvent) // console.log(event)
            this._list.appendChild(newItem)

        } else {
            const itemToUpdate = this._list.querySelector(`caffe-cart-item:nth-child(${index + 1})`)
            const currentQty = itemToUpdate.getAttribute('qty')
            itemToUpdate.setAttribute('qty', Number(item.qty) + Number(currentQty))
        }
    }

    removeItem(name) {
        const index = this._children.findIndex(child => child.name === name)
        console.log(index, this._list, this._list.children[index])
        if (index === -1) return console.warn('no item to remove')
        this._list.removeChild(this._list.children[index])
    }

    clear() {
        this._children.forEach(child => this._list.removeChild(child))
    }


    // called every time an element is inserted into the DOM
    connectedCallback() {
        this._render()
    }

    // called every time an element is removed from the DOM
    disconnectedCallback() {

    }

    // called every time an attribute is added, removed or updated
    attributeChangedCallback(name, oldValue, newValue) {
        // this._render()
    }

    adoptedCallback() {
        console.log('adoptedCallback')
    }


}

window.customElements.define('caffe-cart', CaffeCart)
