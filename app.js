// jshint esversion:6

const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const app=express(); 
const mongoose=require("mongoose");


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true

});

const customerSchema={
    name:String,
    email:String,
    amount:Number,


};
const Customer=mongoose.model("Customer",customerSchema);
 const historySchema=mongoose.Schema({
     receiver:String,
     amount:Number,
     
 },{
     timestamps:true
 })
 const History=mongoose.model("History",historySchema);

// const customer1=new Customer({
//     name:"Vaibhav",
//     email:"starryvaibh786@gmail.com",
//     amount:50000
// });
// const customer2=new Customer({
//     name:"Divyansh",
//     email:"divyansh75@gmail.com",
//     amount:13000
// });
// const customer3=new Customer({
//     name:"Ajay",
//     email:"jay86@gmail.com",
//     amount:10000
// });
// const customer4=new Customer({
//     name:"Tanishka",
//     email:"tanishka98@gmail.com",
//     amount:5500
// });
// const customer5=new Customer({
//     name:"Agrim",
//     email:"adarsh23@gmail.com",
//     amount:7600
// });
// const customer6=new Customer({
//     name:"Pratham",
//     email:"vishu2@gmail.com",
//     amount:4500
// });
// const customer7=new Customer({
//     name:"Ashi",
//     email:"ashi35@gmail.com",
//     amount:6000
// });
// const customer8=new Customer({
//     name:"Ashutosh",
//     email:"ashu56@gmail.com",
//     amount:12000
// });
// const customer9=new Customer({
//     name:"Akash",
//     email:"akkav78@gmail.com",
//     amount:15000
// });
// const customer10=new Customer({
//     name:"Rohit",
//     email:"shrma@25gmail.com",
//     amount:9000
// });
//  const defaultCustomers=[customer1,customer2,customer3,customer4,customer5,customer6,customer7,customer8,customer9,customer10];
//  Customer.insertMany(defaultCustomers,function(err)
 
//  {
//     if(err)
//     {
//         console.log(err);
//     }
//     else{
//         console.log("successfully saved default customers  to database");
//     }
//  });
 

 


app.get("/",function(req,res){
    res.render("home");
}); 

app.get("/customer",function(req,res){
    Customer.find({},function(err,foundCustomers)
    {
        res.render("customer",{newListCustomers:foundCustomers});
    }
    );

}); 

app.get("/history",function(req,res){
    History.find({},function(err,foundCustomers)
    {
        res.render("history",{newListCustomers:foundCustomers});
    }
    );

}); 
app.post("/transaction", async function(req,res){
    const amt=Number(req.body.amount);
    const customer=await Customer.findOne({
        email:"starryvaibh786@gmail.com"
    });
    const receiver=await Customer.findOne({
        email:req.body.receiver
    })
    if(amt<=customer.amount && amt!=0)
    {
      customer.amount-=amt;
      receiver.amount+=amt;
      await customer.save();
      await receiver.save();
      const history= new History(req.body);
      await history.save();
    }
   
    History.find({},function(err,foundCustomers)
    {
        res.render("history",{newListCustomers:foundCustomers});
    }
    );
})

app.get("/transaction",function(req,res){
    res.render("transaction");
}); 




app.listen(process.env.PORT,function(){
    console.log("server started on port 3000")
});

