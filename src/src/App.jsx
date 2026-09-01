import { useEffect, useState } from 'react'

// Where the browser looks for the two APIs, set by compose.yaml. Host addresses
// and published ports, because this code runs in your browser.
const CATALOG_URL = import.meta.env.VITE_CATALOG_URL
const ORDERS_URL = import.meta.env.VITE_ORDERS_URL

function Panel({ title, url, rows, error, render }) {
  return (
    <section>
      <h2>{title}</h2>
      <p className="hint">
        <code>{url}</code>
      </p>
      {error && <p className="status err">{error}</p>}
      <ul>
        {rows.map(render)}
        {rows.length === 0 && !error && <li>Nothing yet.</li>}
      </ul>
    </section>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [errors, setErrors] = useState({})

  const load = () => {
    const fetchInto = (key, url, set) =>
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          set(data)
          setErrors((e) => ({ ...e, [key]: null }))
        })
        .catch((e) => setErrors((prev) => ({ ...prev, [key]: `${url} — ${e.message}` })))

    fetchInto('catalog', `${CATALOG_URL}/products`, setProducts)
    fetchInto('orders', `${ORDERS_URL}/orders`, setOrders)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main>
      <h1>⚙️ Shop Admin</h1>
      <p className="hint">Read-only. Two APIs, two panels, one page.</p>
      <button onClick={load}>Refresh</button>

      <Panel
        title="Products"
        url={`${CATALOG_URL}/products`}
        rows={products}
        error={errors.catalog}
        render={(p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <span>${p.price}</span>
          </li>
        )}
      />

      <Panel
        title="Orders"
        url={`${ORDERS_URL}/orders`}
        rows={orders}
        error={errors.orders}
        render={(o) => (
          <li key={o.id}>
            <span>#{o.id} {o.productName}</span>
            <span>×{o.quantity}</span>
          </li>
        )}
      />
    </main>
  )
}

export default App
