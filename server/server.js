import { app } from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TerraNex AI API Server listening on http://localhost:${PORT}`);
});
