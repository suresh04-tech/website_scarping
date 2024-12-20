import {chromium} from 'playwright';

const url='https://web.pulsepoint.org/?agencies=10100';

(async ()=>{
    const browser =await chromium.launch({headless:false});
    const page =await browser.newPage();

    try{
        console.log('Navigating to url');
        await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
        console.log('pageloaded successfully');

        await page.click('text=Recent Incident');
        console.log('it switch navigation success')

        await page.waitForSelector('.pp_incident_item_container',{timeout:30000})
        console.log('finded the classses')

        const incidentData = await page.evaluate(() => {
            const incidents = [];
            const titles = document.querySelectorAll('.pp_incident_item_description_title');
            const locations= document.querySelectorAll('.pp_incident_item_description_location');

            const timestamps = document.querySelectorAll('.pp_incident_item_timestamp');
            
            titles.forEach((title, index) => {
                incidents.push({
                    title: title.innerText.trim(),
                    location: locations[index]?.innerText.trim() || 'No location available',
                    timestamp: timestamps[index]?.innerText.trim() || 'No timestamp available',
                });
            });
            return incidents;
        });
        console.log(incidentData)


        const ddElement = await page.$('dd:nth-of-type(2)');
        if (ddElement) {
            const secondDiv = await ddElement.$('div:nth-of-type(1)');
            if (secondDiv) {
                await secondDiv.click();
                console.log('Clicked the second div successfully');
            } else {
                console.log('Second div not found');
            }
        } else {
            console.log('pp_incident_item_dd not found');
        }



    }catch(error){
        console.error('Error:',error)
    }

})();