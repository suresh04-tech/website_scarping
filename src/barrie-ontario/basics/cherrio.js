import axios from 'axios';
import * as cheerio from 'cheerio';
const url ='https://en.wikipedia.org/wiki/Vijay_(actor)'; 
const scrapeWebsite = async () => {
  try {

    const { data } = await axios.get(url);
    
    const $ = cheerio.load(data);
console.log($)
    const headlines = [];

    $('#mw-content-text > div.mw-content-ltr.mw-parser-output > table').each((index, element) => {
        console.log(element)
      const headlineText = $(element).text().trim();
      headlines.push(headlineText);
    });

    console.log('Headlines:', headlines);

  } catch (error) {
    console.error('Error scraping the website:', error);
  }
};

scrapeWebsite();
