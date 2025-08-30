import type { Request } from 'express';

export function requestToCurl(req: Request): string {
  const method = req.method.toUpperCase();
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const headers = ['content-type', 'authorization', 'accept']
    .map((h) => {
      const val = req.header(h);
      return val ? `-H "${h}: ${val}"` : null;
    })
    .filter(Boolean)
    .join(' ');

  let body = '';
  if (req.body) {
    if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      body = `--data '${JSON.stringify(req.body)}'`;
    } else if (typeof req.body === 'string' && req.body.trim() !== '') {
      body = `--data '${req.body}'`;
    }
  }

  return `curl -X ${method} ${headers} ${body} "${url}"`.trim();
}
