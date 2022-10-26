var express = require("express");
var router = express.Router();
const axios = require("axios");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/payment", async function (req, res, next) {
  console.log("re", req.body);
  try {
    let trns = await axios.post(
      "https://secure.paytabs.sa/payment/request",
      {
        profile_id: "92790",
        cart_amount: req.body.amount,
        cart_currency: "SAR",
        cart_description: "watani booking amount",
        cart_id: `WA${Math.floor(Math.random() * 10000000) + 1}`, //use any uuid
        tran_type: "sale",
        tran_class: "ecom",
        customer_details: {
          name: req.body.name,
          email: req.body.email,
          street1: "404, 11th st, void",
          city: "Dubai",
          state: "DU",
          country: "AE",
          ip: "91.74.146.168",  
        },
        payment_token: req.body.token,
        return: process.env.PAYTAB_REDIRECT_URL, // pick from env, browser redirect url afer success of 3ds
        callback:process.env.PAYTAB_CALLBACK_URL // post request from paytab server to our server with transaction details 
      },
      {
        headers: { authorization: process.env.PAYTAB_SECRET_KEY}, //Secret key 
      }
    );
    res.send({message:"Success",result:trns.data,statusCode:200});
  } catch (error) {
    res.status(400).send({message:"Failure",result:error,statusCode:400});
    console.log("error", error);
  }
  
});

router.post("/updateTransactionStatus", async function (req, res, next) {
  console.log(req.body);
});

module.exports = router;