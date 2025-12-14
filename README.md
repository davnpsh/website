# Website

Source code and resources of my personal site.

## Develop

Since deployment can happen on Vercel, development should happen on `dev` branch.

Install **Node** and **npm**. Then, install dependencies with:

```sh
npm install
```

Start local dev server at `localhost:4321` with:

```sh
npm run dev
```

## Build

### With `npm`:

```sh
npm run build
```

### With `docker`:

First, build the Docker image:

```sh
docker build -t website-builder .
```

**NOTE to myself:** This is to create a builder container, which is just basically a Node wrapper for not having to install and manage different versions of it.

Then, build the website itself:

```sh
docker run --rm -v ./dist:/app/dist website-builder
```

## Serve

The generated static files are inside `./dist`. Serve using a proxy of some kind.
