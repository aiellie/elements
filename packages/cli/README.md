# aiellie

Create a chat app from the [aiellie elements](https://elements.aiellie.dev) registry, or add its components to a project you already have.

```bash
npx aiellie init           # a new app in this folder, or the chat in this project
npx aiellie init my-chat   # a new app in ./my-chat
npx aiellie add composer   # any item from the registry
```

## init

- **In an empty folder, or given a new folder name,** it creates a Next.js app that opens on the chat, styled with the aiellie theme.
- **In an existing project,** it sets up shadcn if the project doesn't have it yet, then adds the chat at `/chat`. Your own styles are left alone, and files you already have are kept unless you pass `--overwrite`.

## add

Adds items from the registry by name, along with anything they depend on:

```bash
npx aiellie add message thread
```

## Options

| option | what it does |
| --- | --- |
| `-y, --yes` | Use the defaults instead of asking |
| `-o, --overwrite` | Replace files that already exist |
| `-h, --help` | Show the help |
| `-v, --version` | Show the version |

Everything is installed from the live registry through the shadcn CLI, so new installs always get the latest version of each item.
