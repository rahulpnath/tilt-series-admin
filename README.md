# Shop.Admin

The admin app of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v4-start
```

## At `v4-start`

A second React app, for the people running the shop. It adds products through Catalog's API
and lists the products and the orders that have come in. Same shape as `Shop.Storefront`: a
Vite dev image, a compose file, one service called `web`, on port **5174**, in its own
compose project (`shop-admin`).

The two API addresses are `localhost` and a published port, because this code runs in your
browser, not in a container — the same reason the Storefront's are. This project does not
join `shopnet`; nothing in a container calls it, and it calls nothing by container name.

### Running it

Infra, Catalog and Orders first (see the workspace README), then here:

```sh
docker compose up
# http://localhost:5174
```

Add a product on the page and Catalog's worker logs it:

```
worker-1  |  📦 product.created — #2 Gooseneck Kettle at 89
```

```
Shop.Admin/
├── compose.yaml                  # web on :5174; VITE_*_URL point at the published API ports
├── admin-web.dev.Dockerfile      # node:24, npm ci, vite --host
├── .dockerignore
└── src/
    ├── package.json              # same Vite + React versions as the Storefront
    ├── vite.config.js            # port 5174; polling, for bind-mounted files
    └── src/App.jsx               # the form and the two panels
```

Only `src/src` is bind-mounted — `node_modules` and the config stay in the image.
