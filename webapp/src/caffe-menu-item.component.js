// const html = function (templates, ...values) {
//     const template = document.createElement('template')
//     let str = ''
//     templates.forEach((template, index) => {
//         str += template
//         str = values[index] ? str + values[index] : str
//     })
//     template.innerHTML = str.trim()
//     return template.content.firstChild
//     // return template.content.cloneNode(true)
// }

class CaffeMenuItem extends HTMLElement {

    constructor() {
        super()
        this.name = this.getAttribute('name')
        this.type = this.getAttribute('type')
        this.img = this.getAttribute('img')


    }

    _render() {
        const inner = html`
            <li class="card-product">
                <img src="${this.img}" alt="">
            
                <div class="title">
                    <h4>${this.name}</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            
                <div class="add-more-btn-container">
                    <div class="add-more-btn">
                        <button class="minus-btn">-</button>
                        <p>1</p>
                        <button class="plus-btn">+</button>
                    </div>
                </div>
            
                <div class="add-product-btn-container">
                    <button class="add-product-btn test-coffe-btn" data-name="${this.name}" data-type="${this.type}">Add</button>
                </div>
            
            </li>
        `
        const children = [...this.children]
        if (children.length === 0) this.appendChild(inner)
        else this.replaceChild(inner, children.shift())
    }


    // called every time an element is inserted into the DOM
    connectedCallback() {
        this._render()
        this.querySelector('.add-product-btn').addEventListener('click', event => {
            console.log(event)
            const emitEvent = new CustomEvent('added', {
                bubbles: true,
                cancelable: true,
                detail: { name: this.name, type: this.type, qty: this.qty || 1 },
            })
            console.log(emitEvent)
            this.dispatchEvent(emitEvent)
        })
    }

    // called every time an element is removed from the DOM
    disconnectedCallback() {

    }

    // called every time an attribute is added, removed or updated
    attributeChangedCallback(name, oldValue, newValue) {
        this._render()
    }

    adoptedCallback() {
    }


}

window.customElements.define('caffe-menu-item', CaffeMenuItem)

// const caffeMenu = new CaffeMenuItem()
// document.body.appendChild(caffeMenu)