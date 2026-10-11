# Shop.Admin

The admin app of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v6-end
```

## At `v6-end`

Two videos changed this repo.

**Docker Compose Include** (`v5.2-end`) — the service is `admin-web`, so the workspace can
`include` this file into one compose project with the other repos. The `Tiltfile` lost
`docker_compose()` and `new_name=`: the workspace loads this compose file through its `include`,
and this `Tiltfile` keeps only the label and the link.

**Parallel Worktree Environments** (`v6-end`) — the `shopnet` alias is `admin-web-${FOLDER:-main}`,
the API addresses are `https://catalog-${FOLDER:-main}.localhost` and
`https://orders-${FOLDER:-main}.localhost`, and the Tilt link is `https://admin-<folder>.localhost`.
`FOLDER` is the workspace folder being run, passed on by the workspace `Tiltfile`; it falls back
to `main`. So each folder's Admin manages its own folder's products.

This repo no longer runs on its own: its database and message broker come from the workspace's
infra, inside each folder's project. Run it from the workspace (`tilt up`, or `tilt up <folder>`).

## Earlier: `v5-end`

Behind **Caddy**. Three changes in `compose.yaml`, one in the `Tiltfile`, nothing in `src/`.

The service joins **`shopnet`** and takes the alias **`admin-web`** there. Caddy — the
workspace's `caddy/` project — is a container on that network, and `admin-web:5174` is where it
forwards every request for `https://admin.localhost`. The alias is needed for the same reason
as the APIs' in video 3: on the shared network `web` alone would collide with the Storefront's `web`.

The two API addresses are the names Caddy answers on, over HTTPS:

```yaml
VITE_CATALOG_URL: "https://catalog.localhost"
VITE_ORDERS_URL: "https://orders.localhost"
```

Still addresses on your machine — the `fetch` runs in the browser — just names instead of ports.
The pages and the APIs are different origins, so the APIs' CORS policy stays.

**`ports:` is gone.** Nothing outside Docker needs this container's door: the browser reaches it
through Caddy, and Caddy reaches it by name on the network. Tilt built its link from the published
port, so the `Tiltfile` now says `links=['https://admin.localhost']` instead.

Vite serves `admin.localhost` without configuration — `.localhost` hosts are allowed by default —
and hot reload's websocket connects through Caddy as `wss://admin.localhost` on its own.

### Running it

From the workspace root, `tilt up`, then **https://admin.localhost** — after trusting Caddy's
root certificate once (the workspace README shows how). `docker compose up` in this folder alone
still works with infra and Caddy up, but there is no `localhost:5174` any more.

## Earlier: `v4-end`

A `Tiltfile`, and nothing else. `compose.yaml` is untouched.

```python
docker_compose('compose.yaml', project_name='shop-admin')

dc_resource('web', new_name='admin-web', labels=['admin'])
```

`tilt up` from this folder runs Admin on its own. From the workspace root, its `Tiltfile`
`include()`s this one, and this repo stays its own compose project either way.

`project_name` is not optional — Tilt does not read the `name:` key in `compose.yaml`.
`new_name` is what Tilt calls each service: resource names are global across every repo the
workspace loads, and `Shop.Storefront` has a `web` too. The service and container names are unchanged.

## Earlier: `v4-start`

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
# http://localhost:5174 at v4-start; https://admin.localhost from v5-end
```

Add a product on the page and Catalog's worker logs it:

```
worker-1  |  📦 product.created — #2 Gooseneck Kettle at 89
```

```
Shop.Admin/
├── compose.yaml                  # web on shopnet as admin-web; VITE_*_URL are the HTTPS names; no ports
├── admin-web.dev.Dockerfile      # node:24, npm ci, vite --host
├── .dockerignore
└── src/
    ├── package.json              # same Vite + React versions as the Storefront
    ├── vite.config.js            # port 5174; polling, for bind-mounted files
    └── src/App.jsx               # the form and the two panels
```

Only `src/src` is bind-mounted — `node_modules` and the config stay in the image.
