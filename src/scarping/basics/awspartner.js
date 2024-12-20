
import {chromium} from 'playwright';


const url='https://partners.amazonaws.com/search/partners/';

(async ()=>{
    const browser=await chromium.launch({headless:false})
    const page =await browser.newPage();
   


    try{
        await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000})
        console.log('pageloeaded successfully')

        await page.waitForSelector('#awsui-autosuggest-0')
        console.log("find the searchbar")

        const companyName='Meyi Cloud'
        await page.fill('#awsui-autosuggest-0',companyName);
        await page.press('#awsui-autosuggest-0', 'Enter');
        console.log('Search triggered');

        const linkHandle = await page.$(
            '.psf-partner-search-details-card__card.card .card-title.h5 .psf-partner-search-details-card__title span a'
        );

        // if (linkHandle) {
        //     const linkHref = await linkHandle.getAttribute('href');
        //     console.log('Found link:', linkHref);

        //     // Click the link
        //     await linkHandle.click();
        //     console.log('Clicked the link');

        //     // Wait for the new page to load (if applicable)
        //     await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        //     console.log('Navigated to the linked page');
        // } else {
        //     console.log('No link found in the specified structure');
        // }


    }catch(error){
        console.log(error)
    }
})();