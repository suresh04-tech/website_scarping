import { chromium } from 'playwright';

const url = 'https://partners.amazonaws.com/search/partners/';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Page loaded successfully');

        await page.waitForSelector('#awsui-autosuggest-0');
        console.log("Found the search bar");
        
        const companyName = 'Meyi Cloud';
        await page.fill('.global-search > div > awsui-autosuggest > div > div > div > input', companyName);

        const searchButton = 'awsui-button.partner-search__perform-search > button';
         if (searchButton) {
         console.log('Search button found');
          } else {
          console.log('Search button not found'); 
          }

        await page.click(searchButton);
        console.log('Search triggered by clicking the search button');

        await page.waitForSelector('.psf-partner-search-details-card__card', { timeout: 20000 });
        console.log('Search results loaded');

        await page.reload({ waitUntil: 'domcontentloaded' });
        console.log('Page refreshed successfully');
        
        
        const linkSelector = '.psf-partner-search-details-card__card.card .card-body span a';
        await page.waitForSelector(linkSelector, { timeout: 10000 });
        const linkElement = await page.$(linkSelector);

        if (linkElement) {
            const href = await linkElement.getAttribute('href');
            console.log(`Found the link: ${href}`);
            await linkElement.click();
            console.log('Clicked the link');
        } else {
            console.log('No matching link found in the search results');
        }
    } catch (error) {
        console.error('Error:', error);
     } //finally {
    //     await browser.close();
    // }
})();
