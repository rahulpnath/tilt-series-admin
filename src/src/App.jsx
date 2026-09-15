import { useEffect, useState } from 'react'
import './App.css'

// This code runs in the browser, so these are addresses on your machine.
const CATALOG_URL = import.meta.env.VITE_CATALOG_URL
const ORDERS_URL = import.meta.env.VITE_ORDERS_URL

export default function App() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [errors, setErrors] = useState({})
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState('')

  const load = (key, url, set) =>
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        set(data)
        setErrors((e) => ({ ...e, [key]: '' }))
      })
      .catch((e) => setErrors((prev) => ({ ...prev, [key]: `Could not load from ${url} — ${e.message}` })))

  const refresh = () => {
    load('products', `${CATALOG_URL}/products`, setProducts)
    load('orders', `${ORDERS_URL}/orders`, setOrders)
  }

  useEffect(refresh, [])

  const addProduct = async (event) => {
    event.preventDefault()
    try {
      const r = await fetch(`${CATALOG_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: Number(price) }),
      })
      const created = await r.json()
      setStatus(`Added #${created.id} ${created.name}`)
      setName('')
      setPrice('')
      refresh()
    } catch (e) {
      setStatus(`Could not add product at ${CATALOG_URL} — ${e.message}`)
    }
  }

  return (
    <main className="admin">
      <header>
        <h1>Shop Admin</h1>
        <p>Products and orders, for the people running the shop.</p>
      </header>

      <form className="add-product" onSubmit={addProduct}>
        <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button type="submit">Add product</button>
        <button type="button" className="secondary" onClick={refresh}>Refresh</button>
      </form>
      {status && <p className="status">{status}</p>}

      <div className="panels">
        <section className="panel">
          <h2>Products</h2>
          {errors.products && <p className="status status-error">{errors.products}</p>}
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <span>#{p.id} {p.name}</span>
                <span>${p.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Orders</h2>
          {errors.orders && <p className="status status-error">{errors.orders}</p>}
          <ul>
            {orders.map((o) => (
              <li key={o.id}>
                <span>#{o.id} {o.productName} × {o.quantity}</span>
                <span>${(o.unitPrice * o.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
