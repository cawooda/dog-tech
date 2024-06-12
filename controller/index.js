const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const postRoutes = require('./postRoutes');
const dayjs = require('dayjs');

const demoTickers = require('./demoTicker.json');

// async function tickerData(req, res, next) {
//   console.log(req.session);
//   // console.log(req.session.tickers.timeStamp);
//   if (req.session.tickers) {
//   }
//   // console.log(dayjs(req.session.tickers.timeStamp).diff(dayjs(new Date())));
//   // if (dayjs(req.session.tickers?. this checks whether it exists first.
//   // if (dayjs(req.session.tickers?.timeStamp).diff(dayjs(new Date()))) {
//   // }

//   var request = require("request");
//   const tickers = ["BTC", "ETH", "SOL"];
//   const urls = tickers.map((ticker) => {
//     return `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${ticker}&to_currency=EUR&apikey=${process.env.TICKERAPIKEY}`;
//   });

//   // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
//   // const results = urls.map(async (url) => {
//   //   await request.get(
//   //     {
//   //       url: url,
//   //       json: true,
//   //       headers: { "User-Agent": "request" },
//   //     },
//   //     (err, res, data) => {
//   //       if (err) {
//   //         console.log("Error:", err);
//   //       } else if (res.statusCode !== 200) {
//   //         console.log("Status:", res.statusCode);
//   //       } else {
//   //         // data is successfully parsed as a JSON object:
//   //         console.log(data);
//   //       }
//   //     }
//   //   );
//   // });

//   req.session.tickers = {
//     timeStamp: dayjs(new Date()).toString(),
//     results: demoTickers,
//   };

//   console.log(req.session.tickers.timeStamp);
//   console.log(req.session.tickers.results);
//   next();
// }

// router.use(tickerData);

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
