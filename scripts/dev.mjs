import { createServer } from 'vite';

const args = process.argv.slice(2);

const parsed = args.reduce(
  (acc, arg, index) => {
    if (arg === '--port' && typeof args[index + 1] !== 'undefined') {
      acc.port = Number(args[index + 1]);
    }
    if (arg === '--host') {
      const next = args[index + 1];
      acc.host = next && !next.startsWith('--') ? next : true;
    }
    if (arg === '--open') {
      acc.open = true;
    }
    return acc;
  },
  { port: undefined, host: undefined, open: false }
);

const server = await createServer({
  server: {
    port: parsed.port,
    host: parsed.host,
    open: parsed.open,
  },
});

await server.listen();
server.printUrls();

const close = async () => {
  await server.close();
  process.exit(0);
};

process.on('SIGINT', close);
process.on('SIGTERM', close);

