# Chat

A chat page built from [aiellie elements](https://elements.aiellie.dev), set up with `npx aiellie init`.

## Run it

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Use `pnpm`, `yarn` or `bun` in place of `npm` if that's what you installed with.

## Connect a model

Replies are simulated for now. The page's state lives in `components/aiellie/chat.tsx`: replace its `stream` function with your model's response and the rest of the page works as it is.

The composer's `status` uses the same names as the AI SDK's `useChat` (`ready`, `submitted`, `streaming`, `error`), so that value can be passed straight in.

## Add more

```bash
npx aiellie add composer
```

Everything in the registry is listed at [elements.aiellie.dev](https://elements.aiellie.dev).

## Update

The chat's files are yours to change. To replace them with the latest version, run:

```bash
npx aiellie add chat --overwrite
```
