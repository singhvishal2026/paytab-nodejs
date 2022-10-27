var express = require("express");
var router = express.Router();
const axios = require("axios");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/payment", async function (req, res, next) {
  // Store initial transaction details in db mark it as pending state
  // Add user id & own db transaction id into user defined field
  let payload={
    profile_id: process.env.PAYTAB_PROFILE_ID,
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
  }

  if(req.body.saveCard==true)
  {
    payload.tokenise=2;
    // payload.tran_class='recurring';
  }

  try {
    let trns = await axios.post(
      "https://secure.paytabs.sa/payment/request",
      payload,
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
  // Update the complete transaction details in db mark it as approved/denied state  according to the response & values in user defined fields
  // If card is tokenized save it into database the token,the hidden card number referencing the user id
  console.log('updated transaction output',req.body);
  res.status(200).send();
});

router.post("/hosted-payment", async function (req, res, next) {
  // Store initial transaction details in db mark it as pending state
  // Add user id & own db transaction id into user defined field
  let payload={
    profile_id: process.env.PAYTAB_PROFILE_ID,
    cart_amount: req.body.amount,
    cart_currency: "SAR",
    cart_description: "watani booking amount",
    cart_id: `WA${Math.floor(Math.random() * 10000000) + 1}`, //use any uuid
    tran_type: "sale",
    tran_class: "ecom",
    hide_shipping: true,
    tokenise: 2,
    show_save_card: true,
    paypage_lang: "en",
    customer_details: {
      name: req.body.name,
      email: req.body.email,
      street1: "404, 11th st, void",
      city: "Dubai",
      state: "DU",
      country: "AE",
      ip: "91.74.146.168",  
    },
    user_defined:{
      udf1:"user1",
      udf2:"trans1"
    },
    return: `${process.env.PAYTAB_REDIRECT_URL}`, // pick from env, browser redirect url afer success of 3ds
    callback:process.env.PAYTAB_CALLBACK_URL // post request from paytab server to our server with transaction details 
  }
  console.log('py',payload)
  try {
    let trns = await axios.post(
      "https://secure.paytabs.sa/payment/request",
      payload,
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

router.post("/transaction-details",async function(req,res,next){
  let payload={
    profile_id: process.env.PAYTAB_PROFILE_ID,
    tran_ref:req.body.tran_ref 
  }
  console.log('py',payload)
  try {
    let trns = await axios.post(
      "https://secure.paytabs.sa/payment/query",
      payload,
      {
        headers: { authorization: process.env.PAYTAB_SECRET_KEY}, //Secret key 
      }
    );
    res.send({message:"Success",result:trns.data,statusCode:200});
  } catch (error) {
    res.status(400).send({message:"Failure",result:error,statusCode:400});
    console.log("error", error);
  }
})

router.post("/refund",async function(req,res,next){
  // Fetch other details on the basis of transfer reference  from database
  let payload={
    profile_id: process.env.PAYTAB_PROFILE_ID,
    tran_type: "refund",
    tran_class: "ecom",
    cart_id: "WA1694193",
    cart_currency: "SAR",
    cart_amount: 500,
    cart_description: "Booking refund due to cancellation",
    tran_ref: req.body.tran_ref
  }
  console.log('py',payload)
  try {
    let trns = await axios.post(
      "https://secure.paytabs.sa/payment/request",
      payload,
      {
        headers: { authorization: process.env.PAYTAB_SECRET_KEY}, //Secret key 
      }
    );
    res.send({message:"Success",result:trns.data,statusCode:200});
  } catch (error) {
    res.status(400).send({message:"Failure",result:error,statusCode:400});
    console.log("error", error);
  }
})



module.exports = router;
