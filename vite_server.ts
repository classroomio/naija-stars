import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.190.0/http/file_server.ts';

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname.includes('github')) {
    return Response.redirect('https://github.com/classroomio/naija-stars', 302);
  }

  let isIndex = url.pathname === '/' || url.pathname === '/index.html';

  let res = await serveDir(req, {
    fsRoot: 'dist',
  });

  if (res.status == 404) {
    const index = new URL(req.url);
    index.pathname = 'index.html';
    isIndex = true;
    res = await serveDir(new Request(index, req), {
      fsRoot: 'dist',
    });
  }

  if (isIndex) {
    res.headers.set(
      'cache-control',
      'max-age=0, no-cache, no-store, must-revalidate'
    );
    res.headers.set('pragma', 'no-cache');
    res.headers.set('expires', '0');
  }

  return res;
});
