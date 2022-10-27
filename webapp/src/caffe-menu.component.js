// const html = function (templates, ...values) {
//     const template = document.createElement('template')
//     let str = ''
//     templates.forEach((template, index) => {
//         str += template
//         str = values[index] ? str + values[index] : str
//     })
//     template.innerHTML = str.trim()
//     return template.content
//     // return template.content.cloneNode(true)
// }

const onAdded = 'added'


class CaffeMenu extends HTMLElement {

    get _children() {
        const list = this._list
        if (!list) return []
        return [...list.children]
    }

    get _list() {
        const list = this.querySelector('.caffe-menu-list')
        console.log('list', list)
        // if(!list) throw new Error('list not ready')
        if (!list) return null
        return list
    }

    constructor() {
        super()
        this.storeId = this.getAttribute('store-id')

        Array.from(this.children).forEach(child => {
            child.addEventListener(onAdded, event => {
                this.dispatchEvent(new CustomEvent('item-added', { detail: event.detail }))
            })
        })

    }

    _render() {
        const inner = html`
            <section class="catalog-product">
                <h1>PRODUCTS</h1>
                <ul class="caffe-menu-list">
                    <!-- content -->
                </ul>
            </section>
        `

        const children = [...this.children]

        this.innerHTML = ''
        // document.createElement('div').outerHTML
        this.appendChild(inner)

        const menuList = inner.querySelector('.caffe-menu-list')
        children.forEach(child => menuList.appendChild(child))
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
    }

    adoptedCallback() {
    }
}

window.customElements.define('caffe-menu', CaffeMenu)
