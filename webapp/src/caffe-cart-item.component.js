
// const html = function (templates, ...values) {
//     const template = document.createElement('template')
//     let str = ''
//     templates.forEach((template, index) => {
//         str += template
//         str = values[index] ? str + values[index] : str
//     })
//     // console.log(str)
//     template.innerHTML = str.trim()
//     return template.content
//     // return template.content.cloneNode(true)
// }


function getEditability(editable) {
    if(editable === undefined) return true
    if(editable === null) return true
    if(editable === 'true') return true
    return false
}

class CaffeCartItem extends HTMLElement {

    static get observedAttributes() { return ['name', 'type', 'qty'] }

    constructor() {
        super()
        this.name = this.getAttribute('name')
        this.editable = getEditability(this.getAttribute('editable'))
        this.type = this.getAttribute('type')
        this.qty = this.getAttribute('qty')
        this.menuItems = []
        this._innerComponents = this.innerHTML

        // const shadow = this.attachShadow({
        //     mode: 'open'
        // })


    }

    _render() {
        /** @type {HTMLElement} */
        const inner = html`
            <li data-type="${this.type}">
                <b class="cart-item-name">
                    ${this.name}
                </b> x <span class="cart-item-qty">${this.qty}</span>
                ${this.editable ? html`<button class="cart-remove-item-btn" data-name="${this.name}">X</button>`.outerHTML :
                ''}
            </li>
        `
        const children = [...this.children]

        if (children.length === 0) this.appendChild(inner)
        else this.replaceChild(inner, children.shift())

        if (!this.editable) return

        inner.querySelector('.cart-remove-item-btn').addEventListener('click', event => {
            // handle click, send a remove event
            console.log('sending event')
            this.dispatchEvent(new CustomEvent('remove-item', { detail: { name: event.target.dataset.name } }))
        })

    }


    // called every time an element is inserted into the DOM
    connectedCallback() {
        // console.log('connectedCallback')
        this._render()
    }

    // called every time an element is removed from the DOM
    disconnectedCallback() {
        // console.log('disconnectedCallback')

    }

    // called every time an attribute is added, removed or updated
    attributeChangedCallback(name, oldValue, newValue) {
        // console.log('attributeChangedCallback', name, oldValue, newValue)

        const qtyEl = this.querySelector('.cart-item-qty')
        const nameEl = this.querySelector('.cart-item-name')

        if (name === 'qty' && qtyEl) {
            console.log('asd', qtyEl)
            qtyEl.textContent = newValue
        } else if (name === 'name' && nameEl) {
            throw new Error('name is a primary key, if you change it is better to remove and create a new item')
            // nameEl.textContent = newValue
        }
    }

    adoptedCallback() {
        console.log('adoptedCallback')
    }


}

window.customElements.define('caffe-cart-item', CaffeCartItem)
