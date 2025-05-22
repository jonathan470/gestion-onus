require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_KEY = process.env.SMARTOLT_API_KEY;
const DOMAIN = process.env.SMARTOLT_DOMAIN;

const endpoints = {
  enable: 'onu/bulk_enable',
  disable: 'onu/bulk_disable',
  enableCatv: 'onu/bulk_enable_catv',
  disableCatv: 'onu/bulk_disable_catv'
};

app.post('/api/:action', async (req, res) => {
  const { action } = req.params;
  const ids = req.body.ids;

  if (!endpoints[action]) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const response = await fetch(`https://${DOMAIN}/api/${endpoints[action]}`, {
      method: 'POST',
      headers: {
        'X-Token': API_KEY
      },
      body: new URLSearchParams({ 'onus_external_ids': ids.join(',') })
    });

    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
