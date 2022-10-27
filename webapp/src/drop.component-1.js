


class DropZone extends HTMLElement {

    constructor() {
        super()
    }

    _render() {
        const inner = html`<div widht="300px" heigth="300px" ><b>Hello There!</b></div>`
        this.innerHTML = ''
        this.appendChild(inner)
        inner.addEventListener('dragover', ev => ev.preventDefault())
        inner.addEventListener('drop', ev => {
            const element = ev.data
            console.log(element)
            inner.appendChild(element)    
            console.log('drop', ev)
        })
    }

    connectedCallback() { this._render() }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) { }

    adoptedCallback() { }

}

window.customElements.define('drop-zone', DropZone)
