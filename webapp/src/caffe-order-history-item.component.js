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

class CaffeOrderHistoryItem extends HTMLElement {

    constructor() {
        super()
        this.id = this.getAttribute('id')
        this.customer = this.getAttribute('customer')
    }

    _render() {
        const inner = html`
            <li data-id="${this.id}" data-customer="${this.customer}">
                <b>Customer:</b> <span>${this.customer}</span>
                <br>
                <b>Items:</b>
                <ol>
                    <!-- <li data-name="croisant" data-type="meal" data-qty="1">croissant x 1</li>
                    <li data-name="hot chocolate" data-type="beberage" data-qty="2">hot chocolate x 2</li> -->
                </ol>
            </li>
        `

        const children = [...this.children]
        this.innerHTML = ''
        this.appendChild(inner)
        
        const list = inner.querySelector('ol')
        children.forEach(child => list.appendChild(child))

    }

    connectedCallback() { this._render() }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) { }

    adoptedCallback() { }

}

window.customElements.define('caffe-order-history-item', CaffeOrderHistoryItem)
