const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '2mb' }));

app.post('/generate', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'Missing HTML content' });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=output.pdf',
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`PDF service running on port ${port}`));
