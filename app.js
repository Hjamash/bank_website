var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  flash = require("connect-flash"), 
  delay = require("delay"),
  EmailValidator = require("email-validator");
mongoose.connect(
  "mongodb://localhost/bank",
  { useNewUrlParser: true }
);

var customer = require("./models/customer"),
  account = require("./models/account"),
  admin = require("./models/admin"),
  transaction = require("./models/transaction"),
  User = require("./models/user"),
  MCB = require("./models/MCB"),
  UBL = require("./models/UBL"),
  HBL = require("./models/HBL"),
  Bill = require("./models/bill"),
  movie = require("./models/movie"),
  seedDB = require("./seed.js");

  
app.use(
  require("express-session")({
    secret: "this will be use to decode the info in the session",
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
seedDB();
//  console.log(randomDate());
function randomDate(){
  return new Date(Date.now() + Math.random() * (new Date(2018,11,29) - Date.now())).toDateString();
}
function randomTime(){
  return new Date(Date.now() + Math.random() * (new Date(2018,11,29) - Date.now())).getHours();
}

// Login Page
app.get("/", function(req, res) {
  res.render("login.ejs");
});

app.post("/testing",function(req,res){
  res.send(EmailValidator.validate(req.body.username));
});

// Login post route - verify and redirect to show
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/"
  }),
  function(req, res) {
    if (req.body.username.toString().includes("@hjs.com")){
       return res.redirect("/admin/"+req.body.username);
    }
    User.findOne({ username: req.body.username }, function(err, foundUser) {
      if (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("back");
      }
      // console.log("foundUser"+foundUser);
      // console.log("Currentuser"+req.user);
      customer
        .findOne({ user: foundUser })
        .populate("acc")
        .exec(function(err, foundCustomer) {
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
          } 
          if (foundCustomer.blocked == true){
            req.logout();
            req.flash("error","Sorry, your account has been blocked please contact to the bank for further information.");
            res.redirect(req.header('referer'));
          }
          else {
            req.flash("success", "Welcome!");
            res.redirect("/show/" + foundCustomer._id);
          }
        });
    });
  }
);

// E-banking homepage
app.get("/show/:cid", isLoggedIn, function(req, res) {
  customer
    .findOne({user: req.user})
    .populate("acc")
    .populate("user")
    .populate("transactions")
    .exec(function(err, foundCustomer) {
      res.render("show", { custInfo: foundCustomer });
    });
});

// Registration Page
app.get("/register", function(req, res) {
  res.render("register.ejs");
});

// Register post route - verify account and activate E-banking
app.post("/register", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var accountNo = req.body.accNo;
  account.findOne({ accNo: accountNo }, function(err, foundAccount) {
    if (err) {
      console.log(err);
    } else {
      if (!foundAccount) {
        req.flash("error", "Please enter a valid account number.");
        res.redirect("back");
      } else if (foundAccount.status == false) {
        customer.findOne({ acc: foundAccount }, function(err, foundCustomer) {
          if (err) {
            console.log(err);
          } else {
            if (foundAccount.cardNo != req.body.cardNo) {
              req.flash("error", "Please enter a valid card number.");
              res.redirect("back");
            } else {
              User.register(
                new User({ username: req.body.username }),
                req.body.password,
                function(err, newUser) {
                  if (err) {
                    req.flash(
                      "error",
                      "Username already exists, please enter a different username."
                    );
                    res.redirect("back");
                  } else {
                    // Activate e-Banking for an existing user
                    foundCustomer.user = newUser;
                    foundCustomer.save(function(err, data) {
                      if (err) {
                        req.flash("error", "Something went wrong!");
                        res.redirect("back");
                      } else {
                        foundAccount.status = true;
                        foundAccount.save();
                        req.flash(
                          "success",
                          "Congratulations! Your account has been registered."
                        );
                        res.redirect("/");
                      }
                    });
                  }
                }
              );
            }
          }
        });
      } else {
        req.flash("error", "This account has been already registered.");
        res.redirect("back");
      }
    }
  });
});

// Within-Bank fund transfer
app.get("/withinBankTransfer/:cid",function(req, res){
  customer.findOne({user: req.user},function(err, foundCustomer){
  res.render("fundTransfer.ejs",{custInfo: foundCustomer});
});
});
// Inter-Bank fund transfer
app.get("/interBankTransfer/:cid",function(req, res){
  customer.findOne({user: req.user},function(err, foundCustomer){
  res.render("interTransfer.ejs",{custInfo: foundCustomer});
});
  });

  // Inter-Bank Transaction
  app.post("/interBankTransaction/:cid", isLoggedIn,function(req,res){
  var bank = req.body.bankName.toString();
  customer.findById(req.params.cid).populate("acc").exec(function(err, foundCustomer){
    if (err) {
      console.log(err);
    }
    if(foundCustomer == null){
      req.flash("error","Something went wrong");
      res.redirect("back");
    }
  if (foundCustomer.acc.amount <= req.body.amount) {
    req.flash("error", "You do not have sufficient funds.");
    res.redirect("back");   
  } else {
    account.find({accNo: req.body.accNo},function(err, foundAccount){
  if (bank == "MCB"){
  MCB.findOne({acc: foundAccount}).populate("acc").exec(function(err, foundAccount){
    if (err) {
      console.log(err);
    }
    if (!foundAccount){
      req.flash("error","Account not found!");
      res.redirect("back");
    } else {
    doTransaction(req, res, foundCustomer, foundAccount.acc);
  }  
  });
} else if (bank == "UBL"){
  UBL.findOne({acc: foundAccount}).populate("acc").exec( function(err, foundAccount){
    if (err) {
      console.log(err);
    }
    if (!foundAccount){
      req.flash("error","Account not found!");
      res.redirect("back");
    } else {
      doTransaction(req, res, foundCustomer, foundAccount.acc);
    }
    });
} else if (bank == "HBL"){
  HBL.findOne({acc: foundAccount}).populate("acc").exec( function(err, foundAccount){
    if (err) {
      console.log(err);
    }
    if (!foundAccount){
      req.flash("error","Account not found!");
      res.redirect("back");
    } else {
    doTransaction(req, res, foundCustomer, foundAccount.acc);
  }
  });
  
}
});
}
});
});

// Transaction route
app.post("/transaction/:id", isLoggedIn, function(req, res) {
  customer
    .findById(req.params.id)
    .populate("acc")
    .exec(function(err, foundCustomer) {
      if (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("back");
      }
      if (foundCustomer.acc.amount <= req.body.amount) {
        req.flash("error", "You do not have sufficient funds.");
        res.redirect("back");
      } else {
        account.findOne({ accNo: req.body.accNo }).populate("customer").exec(function(
          err,
          foundAccount
        ) {
          // console.log(foundAccount);
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
          }
          
            doTransaction(req, res, foundCustomer, foundAccount)
          
        });
      }
    });
});

//Admin Page
app.get("/admin/:uname", isLoggedIn ,function(req, res){
  User.findOne({username: req.params.uname},function(err,foundUser){
    if(err){
      console.log(err);
    }
  admin.findOne({user: foundUser},function(err, foundAdmin){
      if(err){
        console.log(err);
      }
      transaction.find({},function(err, Alltransactions){
      customer.find({}).populate("acc").exec(function(err, allCustomers){
        res.render("adminHome.ejs",{trans: Alltransactions,custInfo: allCustomers});
    });
  });
  });
});
});

// admin views payer and beneficiary details
app.post("/admin/:uname/:tid", function(req, res){
transaction.findById(req.params.tid, function(err,trans){
if(err){
  console.log(err);
}
account.findOne({accNo: trans.payer},function(err, payer){
  if(err){
    console.log(err);
  }
  customer.findOne({acc: payer}).populate("acc").exec(function(err, payerInfo){

    account.findOne({accNo: trans.beneficiary},function(err, beneficiary){
      if(err){
        console.log(err);
      }
      customer.findOne({acc: beneficiary}).populate("acc").exec(function(err, beneInfo){
      if(beneInfo){
      res.render("payer_bene.ejs",{beneficiary: beneInfo,payer: payerInfo});
    } else {
      res.render("payer_bene.ejs",{beneficiary: beneficiary,payer: payerInfo});   
    }
  });
  });
});
});
});
});

// Show all transactions
app.get("/admin/:uname/transactions",function(req, res){
  transaction.find({},function(err, allTransactions){
    if (err) {
      console.log(err);
    }
    res.render("transactions.ejs",{trans: allTransactions});
  });
});

// Register a new user
app.get("/admin/:uname/register",function(req,res){
  res.render("newAccount");
});

app.post("/admin/create/account/new",function(req, res){
  account.create(req.body.acc,function(err, newAccount){
    if(err)
    {
      console.log(err);
    }
    customer.create(req.body.cust,function(err, newCustomer){
      if(err)
      {
        console.log(err);
      }
      newCustomer.blocked = false;
      newCustomer.acc = newAccount;           // linking newly created customer with account
      newCustomer.save();
      newAccount.customer = newCustomer;      // linking newly created account with customer
      newAccount.status = false;
      newAccount.save();
      req.flash("success","New account registered!");
      res.redirect("back");
    });
  });
});

//show a customers transaction log
app.get("/admin/:uname/customer/:cid/log",function(req, res){
  customer.findById(req.params.cid).populate("acc").populate("transactions").exec(function(err, foundCustomer){
      if(err){
        console.log(err);
      }
      transaction.find({$or:[{payer: foundCustomer.acc.accNo},{beneficiary: foundCustomer.acc.accNo}]},function(err,transactions){
        if(err){
          console.log(err);
        }
        res.render("log.ejs",{custInfo: foundCustomer, trans: transactions});
    });
  });
});

// Search account on admin page
app.post("/admin/:uname/search/account",function(req, res){
  transaction.find({},function(err, allTransactions){
    if(err){
      req.flash("error","Something went wrong!");
      res.redirect("back");
    }
    else {
      account.findOne({accNo: req.body.search},function(err,foundAccount){
      customer.find({acc: foundAccount}).populate("acc").exec(function(err, allCustomers){
      res.render("adminHome.ejs",{trans: allTransactions, custInfo: allCustomers});
    });
  });
    }
  });
});

// Suspend account
app.get("/admin/:uname/:cid/suspend",function(req, res){
  // console.log(req.params.cid);
  customer.findById(req.params.cid,function(err, foundCustomer){
      if(foundCustomer.blocked == false){
      foundCustomer.blocked = true;
      foundCustomer.save();
      req.flash("error","Account has been blocked!");
      res.redirect("back");
    } else {
      foundCustomer.blocked = false;
      foundCustomer.save();
      req.flash("success","Account has been activated");
      res.redirect("back");
    }
  });
});
// Suspend account(1)
// app.get("/admin/:uname/customer/:cid",function(req,res){
//   // console.log("Hello world");
//   customer.findById(req.params.cid,function(err, foundCustomer){
//     foundCustomer.blocked = true;
//     foundCustomer.save();
//     req.flash("success","Account has been blocked!");
//     res.redirect("back");
// });
// });

// Buy Movie Tickets
app.get("/buyTickets/:cid",function(req, res){
  movie.find({},function(err,allMovies){
res.render("cinema.ejs", {movie: allMovies});
});
});

app.get('/buyTickets/:cid/pay/:mid',function(req, res){
  movie.findById(req.params.mid,function(err, selectedMovie){
    if(err){
      console.log(err);
    }
    res.render("buyTicket",{Ticket: selectedMovie});
  });
});

app.post("/buyTickets/:cid/pay/:mid",function(req, res){
  var sId = req.body.scheduelId;
  customer.findOne({user: req.user}).populate("acc").exec(function(err, foundCustomer){
    if(err){
      console.log(err);
    }
    movie.findById(req.params.mid, function(err, selectedMovie){
      if(err){
        console.log(err);
      }
      var flag=0;
      selectedMovie.scheduel.forEach(function(scheduel){
        if(scheduel._id.equals(sId) ){
          if (foundCustomer.acc.amount < (parseInt(scheduel.seatsAvaliable) * parseInt(req.body.quantity))){
            flag = 1;
          } else if(scheduel.seatsAvaliable == 0 || parseInt(req.body.quantity) > scheduel.seatsAvaliable){
            flag = 2;
          } 
          else{
          // console.log("before");
          // console.log(selectedMovie);
          scheduel.seatsAvaliable = scheduel.seatsAvaliable - parseInt(req.body.quantity);
          scheduel.save({ suppressWarning: true });
        }
        }
      });
      if (flag == 1){
        req.flash("error","Insufficient funds.");
       return res.redirect(req.header('Referer')); 
      } else if (flag == 2){
        req.flash("error","Not enought seats avaliable.");
       return res.redirect(req.header('Referer')); 
      }
      
      var d = new Date();
      d = d.toDateString();
      var trans = new transaction({
        payer: foundCustomer.acc.accNo,
        beneficiary: "CinemaCity",
        amount: selectedMovie.ticketPrice * parseInt(req.body.quantity),
        date: d
      });
      transaction.create(trans,function(err, newTransaction){
        if (err){
          console.log(err);
        }
        foundCustomer.transactions.push(newTransaction);
        foundCustomer.acc.amount = foundCustomer.acc.amount - (selectedMovie.ticketPrice * parseInt(req.body.quantity));
        foundCustomer.acc.save(function(err,savedAccount){
        foundCustomer.save();
      });
        selectedMovie.transactions.push(newTransaction);
        selectedMovie.save();
        req.flash("success","Ticket booked");
        res.redirect("/buyTickets/"+req.user._id);
      });
      });
  });
});

app.get("/billPayment/:cid",function(req, res){
  customer.findOne({user: req.user}).populate("bills").exec(function(err, foundCustomer){
    res.render("billPayment",{custInfo: foundCustomer});
  });
});

app.post("/billPayment/:cid/pay/:billId",function(req, res){
  customer.findById(req.params.cid).populate("acc").populate("bills").exec(function(err, foundCustomer){
    if (err){
      console.log(err);
    }
    // console.log(foundCustomer);
    Bill.findById(req.params.billId).exec(function(err, bill){
      if (err){
        console.log(err);
      }
      if (foundCustomer.acc.amount < bill.amount){
        req.flash("error","Do not have sufficient funds.");
        res.redirect("back");
      } else {

      var d = new Date();
      d = d.toDateString();
      var trans = new transaction({
        payer: foundCustomer.acc.accNo,
        beneficiary: bill.title,
        amount: bill.amount,
        date: d
      });
      transaction.create(trans,function(err, newTransaction){
        if (err){
          console.log(err);
        }
        
      bill.paid = true;
      bill.transaction = newTransaction;
      bill.save();
      foundCustomer.acc.amount = foundCustomer.acc.amount - bill.amount;
      foundCustomer.acc.save();
      foundCustomer.transactions.push(newTransaction);
      foundCustomer.save();
        req.flash("success","Bill paid");
        res.redirect("back");
      });
    }
    });
  });
});

function doTransaction(req, res, foundCustomer, foundAccount){
  // console.log(foundCustomer);
  if (!foundAccount || foundCustomer.acc.accNo == req.body.accNo) {
    req.flash("error", "Please enter a valid account number.");
    return res.redirect(req.header('Referer'));
  }
  else if(foundAccount.customer && foundAccount.customer.blocked == true){
    req.flash("error","Account is blocked");
    return res.redirect(req.header('Referer'));
  }
  foundAccount.amount =
  foundAccount.amount + parseInt(req.body.amount);
  foundAccount.save();
  foundCustomer.acc.amount =
  foundCustomer.acc.amount - parseInt(req.body.amount);
  foundCustomer.acc.save();

  var d = new Date();
  d = d.toDateString();
  var trans = new transaction({
    payer: foundCustomer.acc.accNo,
    beneficiary: foundAccount.accNo,
    amount: req.body.amount,
    date: d
  });
  transaction.create(trans, function(err, newTransaction) {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect(req.header('Referer'));
    } else {
      foundCustomer.transactions.push(newTransaction);
      foundCustomer.save();
      req.flash("success", "Funds Transferred.");
      res.redirect("/show/" + foundCustomer._id);
    }
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/");
}

app.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged out!");
  res.redirect("/");
});

app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server has started!");
});

// module.exports = function Cart(oldCart){
//   this.items= oldCart.items || {};
//   this.totalQty=oldCart.totalQty || 0;
//   this.totalPrice=oldCart.totalPrice || 0;
//   this.add = function(item,id){
//     var storedItem = this.items[id];
//     if(!storedItem){
//       storedItem = this.items[id] = {item:item,qty:0,price:0};
//     }
//     storedItem.qty++;
//     storedItem.price = 100*storedItem.qty;
//     this.totalQty++;
//     this.totalPrice += 100;
//   };
module.exports = function Cart(oldCart){
  this.id= oldCart.id || {};
  this.totalQty=oldCart.totalQty || 0;
  this.totalPrice=oldCart.totalPrice || 0;
  this.add = function(pid){
    var storedItem = this.id[pid];
    if(!storedItem){
      storedItem = this.id[pid] = {id:pid,qty:0,price:0};
    }
    storedItem.qty++;
    storedItem.price = 100*storedItem.qty;
    this.totalQty++;
    this.totalPrice += 100;
  };
  
  this.reduceByOne=function(id){
    this.id[id].qty--;
    this.id[id].price -= 100;
    this.totalQty--;
    this.totalPrice -=100;
    if(this.id[id].qty<=0){
      delete this.id[id];
    }
  };
  this.removeItem = function(id){
    this.totalQty -=this.id[id].qty;
    this.totalPrice -=100;
    delete this.id[id];
  };
  
  this.generateArray = function(){
    var arr = [];
    for(var id in this.id){
      arr.push(this.id[id]);
    }
    return arr;
  };
};