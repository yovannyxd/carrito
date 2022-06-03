const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchdata()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        diseñoCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)

})

const fetchdata = async () => {
    try{    
        const res = await fetch('productos.json')
        const data = await res.json()
        // console.log(data)
        diseñoCards(data)
    } catch (error) {
        console.log(error)
    }
}

const diseñoCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.Descripcion
        templateCard.querySelector('p1').textContent = producto.Stock
        templateCard.querySelector('p').textContent = producto.Precio
        templateCard.querySelector('img').setAttribute("src", producto.UrlImagen)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        Descripcion: objeto.querySelector('h5').textContent,
        Stock: objeto.querySelector('p1').textContent,
        Precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    diseñoCarrito()

}

const diseñoCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.Descripcion
        templateCarrito.querySelectorAll('td')[1].textContent = producto.Stock
        templateCarrito.querySelectorAll('td')[2].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.Precio * producto.cantidad

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    diseñarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const diseñarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = 'Carrito vacío - comience a comprar!'

        return
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad} ) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, Precio}) => acc + cantidad * Precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        diseñoCarrito()
    })
}

const btnAccion = e => {
    
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto}
        diseñoCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        diseñoCarrito()

    }
    e.stopPropagation()
}
