Project objective: An web app for tracking crypto prices.  
Project version: coin gecko v5  
Project Files Structure:  
/coin gecko v5  
 /routes  
  /cryptoRoutes.js  # Routes for handling API requests  
 /jobs  
  /cronJobs.js  # Cron jobs for scheduled tasks  
 /services  
  /fetchCryptoData.js  # Service for fetching and caching data  
  /startApp.js  # Start the initial fetch  
 /config  
  /redisConfig.js  # Redis configuration and setup  
 /server.js  # Main server file  
 package.json  
 /.env  # Environment variables  

Pentru Alexandru:

Am reusit sa instalez Redis pana la urma folosind MacPorts.  
Am parcurs 2 tutoriale ca sa-l pot instala si sa inteleg cum il pot folosi.  
Prin aceasta aplicatie am reusit sa ma conectez la server folosind redisConfig.js  
In cronJobs.js am folosit node-cron pentru a face Fetch datelor de la Coin Gecko o data la 5 minute  
In fetchCryptoData.js am facut Fetch si Cache in Redis datelor de la Coin Gecko  
Am creat startApp.js pentru primul batch de date externe (acestea vor merge simultan si in Redis) dupa care va face fetch cronJobs.  
Am create 2 instante route:  

Pentru a prelua toate cryptocurrencies vs USD (cel mai popular API endpoint al celor de la Coin Gecko)  
Se poate accesa ca GET la adresa http://localhost:3000/api/coins/markets  
Preia doar crypto prezente in query: (una sau mai multe) ex: ?ids=bitcoin,solana  
GET http://localhost:3000/api/coins/markets/query?ids=ethereum,solana,bitcoin  
Am exportat din fiecare modul si le-am apelat pe toate in server.js  