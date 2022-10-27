/// <reference types="cypress" />

const { webapp } = require('../../webapp.json')

// const url = 'https://' + webapp.webappDnsUrl
const url = 'http://localhost:8080'
// const url = 'https://d1031wyalgn1ok.cloudfront.net/'


describe('Item Selection', () => {
    beforeEach(() => { cy.visit(url) })

    it('should have the <caffe-menu> tag with 5 children', () => {
        cy.get('caffe-menu').should('be.visible')
        cy.get('caffe-menu-item').should('have.length', 5)
    })

    it('should add an existing item to cart', () => {
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 1)

        cy.get('.add-product-btn').first().click()
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 1)
        cy.get('.cart-item-qty').first().should('have.text', '2')
        cy.get('.add-product-btn').first().click()
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 1)
        cy.get('.cart-item-qty').first().should('have.text', '3')
    })

    it('should add a new item to cart', () => {
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 1)
        cy.get('.add-product-btn').eq(1).click()
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 2)
        cy.get('.add-product-btn').eq(2).click()
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 3)
    })

    it('should delete an item from the cart', () => {
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 1)
        cy.get('.cart-remove-item-btn').eq(0).click()
        cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 0)
    })

})



describe('Item Selection', () => {
    beforeEach(() => { cy.visit(url) })

    it('place order, clear order section', () => {
        
        cy.get('#place-order-btn-wc').first().click().then(() => {
            cy.get('.shopping-cart-container caffe-cart-item').should('have.length', 0)
        })
    })


    it('place order, add the new order to the history section', () => {
        // cy.get('#place-order-btn-wc').first().click()
        //     .then(() => {
        //         cy.get('caffe-order-history-item').find('')
        //     })
    })


    it('items on history should not have delete button', () => {
        cy.get('#place-order-btn-wc').first().click()
            .then(() => {
                cy.get('caffe-order-history').get('.cart-remove-item-btn').should('have.length', 0)

            })
    })


})