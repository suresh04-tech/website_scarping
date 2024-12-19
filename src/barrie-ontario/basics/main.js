try{
const response =await fetch('https://live.sinirji911.com/agency/barrie-ontario-fire-and-emergency-service');
if(!response.ok){
    throw new Error(`Http error:${response.status}`)
}

const data =await response.text();
console.log('Data fetched success',data);
}catch(error){
    console.error('error fetching data',error.message)
}



