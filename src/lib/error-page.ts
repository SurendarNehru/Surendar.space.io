export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
<<<<<<< HEAD
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://db.onlinewebfonts.com/c/b440614f80c8a8abc990ba341ae9ddf0?family=CS+Antlia+Demo" rel="stylesheet">
    <link href="https://db.onlinewebfonts.com/c/762a9bb65368774a2ee6737334b50151?family=CS+Robert+Demo" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Pixelify Sans', 'Silkscreen', 'VT323', 'CS Antlia Drawn', 'CS Robert', 'Press Start 2P', monospace, sans-serif; font-size: 15px; line-height: 1.5; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
=======
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
<<<<<<< HEAD
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font-family: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
=======
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
