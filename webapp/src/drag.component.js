


class DragZone extends HTMLElement {

    constructor() {
        super()
        console.log('on drag zone')
    }

    _render() {
        const inner = html`<div></div>`
        const children = [...this.children]

        this.innerText = ''
        console.log(children)
        children.forEach(child => {
            child.setAttribute('draggable', true)
            // child.addEventListener('drag', ev => console.log('drag', ev))
            inner.appendChild(child)
        })

        this.appendChild(inner)
    }

    connectedCallback() { this._render() }

    disconnectedCallback() { }

    attributeWChangedCallback(name, oldValue, newValue) { }

    adoptedCallback() { }

}

window.customElements.define('drag-zone', DragZone)

