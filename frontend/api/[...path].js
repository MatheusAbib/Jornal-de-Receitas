export default async function handler(req, res) {
  const path = req.url.replace(/^\/api/, '');
  const target = `http://64.227.6.51:8082/api${path}`;

  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;

  const options = {
    method: req.method,
    headers,
    redirect: 'manual',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    options.body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  try {
    const upstream = await fetch(target, options);

    res.status(upstream.status);

    upstream.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (k === 'transfer-encoding') return;
      if (k === 'content-encoding') return;
      if (k === 'content-length') return;
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    res.status(502).json({ error: 'Bad gateway', message: err.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
