import express from 'express';
import { chromium } from 'playwright';

const app = express();
const PORT = 3000;
app.get('/scrape', async (req, res) => {
  try {
      console.log('Launching browser...');
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage();

      console.log('Navigating to URL...');
      const url = 'https://web.pulsepoint.org/?agencies=10100';
      await page.goto(url, { waitUntil: 'load',timeout:60000});

      console.log('Extracting data...');
      const alerts = await page.evaluate(() => {
          const rows = document.querySelectorAll('.ui.basic.stackable.table tbody tr');
          if (!rows.length) {
              throw new Error('No rows found in the table');
          }
          const data = [];
          rows.forEach(row => {
              const columns = row.querySelectorAll('td');
              data.push({
                  id: columns[0]?.textContent.trim(),
                  lat: parseFloat(columns[1]?.textContent.trim()),
                  long: parseFloat(columns[2]?.textContent.trim()),
                  title: columns[3]?.textContent.trim(),
                  timestamp: columns[4]?.textContent.trim()
              });
          });
          return data;
      });

      console.log('Closing browser...');
      await browser.close();

      console.log('Sending response...');
      res.json(alerts);
  } catch (error) {
      console.error('Error in route:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
