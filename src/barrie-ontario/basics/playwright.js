import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { v5 as uuid } from 'uuid';
import { table, timeStamp } from 'console';
import { title } from 'process';

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; 

const url = 'https://live.sinirji911.com/agency/barrie-ontario-fire-and-emergency-service';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to URL...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Page loaded successfully.');


    console.log('Fetching page content...');
    const content = await page.content();
    console.log(content); 

    console.log('Waiting for the table to appear...');
    await page.waitForSelector('table.ui.basic.stackable.table', {
      state: 'attached',
      timeout: 120000,
    });

    console.log('Table found. Extracting data...');
    const tableData = await page.evaluate(() => {
      const table = document.querySelector('table.ui.basic.stackable.table tbody');
      if (!table) {
        return 'Table not found!';
      }

      const rows = Array.from(table.querySelectorAll('tr'));
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return cells.map(cell => cell.textContent.trim());
      })
    });

    console.log('Extracted Table Data:', tableData);

    const street=tableData[0][0];

    const crossstreet= tableData[0][1]

    const city=tableData[0][2]

    const status=tableData[0][3]

    const Level=tableData[0][4]

    const time=tableData[0][5]

    const respondingunits=tableData[0][6]

    await page.waitForSelector('button:has-text("View Map")', { timeout: 30000 }); 
    await page.click('button:has-text("View Map")'); 

    console.log('"View Map" button clicked.');

  
    await page.waitForSelector('div.gm-style iframe', { timeout: 30000 });

    console.log('Iframe found.');

    
    const iframeHandle = await page.$('div.gm-style iframe');
    const iframeContent = await iframeHandle.contentFrame();

    if (iframeContent) {
      const iframeUrl = await iframeContent.evaluate(() => window.location.href);
      console.log('Iframe URL:', iframeUrl);

      
      const urlParams = new URL(iframeUrl);
      const coordinates = urlParams.pathname.match(/@([-0-9.]+),([-0-9.]+)/);

      if (coordinates) {
        const [_, latitude, longitude] = coordinates;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
      } else {
        console.log('Coordinates not found in iframe URL');
      }
    } else {
      console.log('Iframe content not accessible');
    }

   // used to generate uuid
    // const inputString=tableData.title;
    // console.log(inputString);
    // const generateUUID= uuid(inputString, NAMESPACE);
    // console.log(generateUUID)

    // const final={
    //   "id":generateUUID,
    //   "lat":lat,
    //   "long":long,
    //   "timestamp":time,
    //   "provider":"police",
    //   "title":title,
      
    // }



    writeFileSync('tableData.json', JSON.stringify(tableData, null, 2));
    console.log('Table data saved to tableData.json.',tableData.JSON);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
