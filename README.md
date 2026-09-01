# Shop.Admin

The internal admin app of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v4-end
```

## At `v4-end`

A `Tiltfile`, and nothing else. `compose.yaml` is untouched.

```sh
tilt up          # from this folder — Admin on its own
```

One resource, one clickable link, Vite still doing the reloading. The workspace
`Tiltfile` one folder up `include()`s this file, and because
`project_name='shop-admin'` is passed explicitly, Admin stays its own compose
project either way.

---

## Earlier: `v4-start`

A fourth repo, and deliberately the least interesting one in the series. It is a
Vite + React app like `Shop.Storefront`, on port **5174**, in its own compose
project (`shop-admin`), reading both APIs and writing to neither.

```sh
docker compose -f docker/compose.yaml up
# http://localhost:5174
```

It exists to make **four** repos, not three. Three could still be argued into
one compose file; four is the number at which "just start them all" stops being
a thing you do by hand, and that is the problem Video 4 is about.

Nothing here is new material. It is the `v1.2` React container, the `v3` browser
addressing, and nothing else:

- `node_modules` lives in the image. The bind mount is `../src/src:/app/src` —
  only the code you edit — so nothing the container owns reaches your tree.
- The API URLs are **host** addresses, because these `fetch` calls run in your
  browser. `http://catalog-api:5101` would be correct between containers and is
  meaningless here.
- This project does not join `shopnet`, and has no reason to.

### What it looks like when things are down

Each panel fetches on its own, so killing one API leaves the other panel
working and shows the failure in place:

```
http://localhost:5102/orders — Failed to fetch
```

That is the whole demo for Video 4's opening: four repos, ten containers, and
the only thing that tells you which one died is a browser error.

**Prerequisites at this tag:** Docker, and the other three repos running if you
want the panels to fill.
