var mongoose = require("mongoose"),
  Customer = require("./models/customer"),
  Account = require("./models/account"),
  Admin = require("./models/admin"),
  Transaction = require("./models/transaction"),
  Bill = require("./models/bill"),
  User = require("./models/user"),
  MCB = require("./models/MCB"),
  UBL = require("./models/UBL"),
  HBL = require("./models/HBL"),
  Movie = require("./models/movie");
  passport = require("passport");
  function randomDate(){
    return new Date(Date.now() + Math.random() * (new Date(2018,11,29) - Date.now())).toDateString();
  }
  function randomTime(){
    return (new Date(Date.now() + Math.random() * (new Date(2018,11,29) - Date.now())).getHours())+":"+(new Date(Date.now() + Math.random() * (new Date(2018,11,29) - Date.now())).getMinutes());
  }
  function random(){
    return Math.random() * (100-1) + 1;
  }
  var DateGenerator = require('random-date-generator');

  var startDate = new Date(2019, 2, 2);
  var endDate = new Date(2019, 3, 3);
  
var movies = [{
  name: "Captain America",
  genre: "Action",
  image: "https://earth.callutheran.edu/images/student_calendar/2911.jpg?m=",
  scheduel: []
},{
  name:"Ben is Back",
  genre: "Thriller,Crime",
  image: "https://www.joblo.com/assets/images/joblo/posters/2018/12/ben-is-back-poster_thumb.jpg",
  scheduel: []
},{
  name:"JAWS",
  genre: "Horror",
  image: "https://i.ebayimg.com/images/i/252951607087-0-1/s-l1000.jpg",
  scheduel: []
}
,{
  name:"Venom",
  genre: "Action",
  image: "https://www.joblo.com/assets/images/oldsite/posters/images/full/Venom-poster-6.jpg",
  scheduel: []
},{
  name:"Skyscrapper",
  genre: "Thriller",
  image: "https://static.boredpanda.com/blog/wp-content/uploads/2018/02/dwayne-the-rock-johnson-skyscraper-jump-funny-reactions-1-5a7ab25b4d416__700.jpg",
  scheduel: []
}
// ,{
// name: "Avengers Infinity War",
// genre: "Action",
// image: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
// schedule: []
// }
// ,{
// name: "Black Panther",
// genre: "Action",
// image: "https://images-na.ssl-images-amazon.com/images/I/913P9nWS%2B%2BL._SX342_.jpg",
// schedule: []
// },{
// name: "Mission Impossible Fallout",
// genre: "Action",
// image: "https://upload.wikimedia.org/wikipedia/en/f/ff/MI_%E2%80%93_Fallout.jpg",
// schedule: []
// },{
// name: "Vemon",
// genre: "Action",
// image: "https://i0.wp.com/revengeofthefans.com/wp-content/uploads/2018/09/Venom-Poster-2.jpg?ssl=1",
// schedule: []
// },{
// name: "Deadpool 2",
// genre: "Action",
// image: "https://cdn.traileraddict.com/content/20th-century-fox/deadpool-2-poster-8.jpg",
// schedule: []
// },{
// name: "Incredibles 2",
// genre: "Animated",
// image: "https://i.redd.it/fpp3k01riyq01.jpg",
// schedule: []
// },{
// name: "A Quite Place",
// genre: "Drama",
// image: "https://i0.wp.com/teaser-trailer.com/wp-content/uploads/A-Quiet-Place-Australian-Poster.jpg?ssl=1",
// schedule: []
// }
// ,{
// name: "Jawani Phir Nahi Ani 2",
// genre: "Comedy",
// image: "https://upload.wikimedia.org/wikipedia/en/b/b4/JAWANI_PHIR_NAHI_ANI_2_OFFICIAL_POSTER.png",
// schedule: []
// },{
// name: "Parchi",
// genre: "Action",
// image: "https://media-cache.cinematerial.com/p/500x/1lvpgy5u/parchi-pakistani-movie-poster.jpg",
// schedule: []
// },{
// name: "Parwaaz Hai Janoon",
// genre: "Action",
// image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Parwaaz_Hai_Junoon.jpeg/220px-Parwaaz_Hai_Junoon.jpeg",
// schedule: []
// },{
// name: "Load Wedding",
// genre: "Comedy",
// image: "https://nation.com.pk/print_images/medium/2018-06-15/load-wedding-poster-unveiled-1529008867-3579.jpg",
// schedule: []
// },{
// name: "The Donkey King",
// genre: "Animated",
// image: "https://m.media-amazon.com/images/M/MV5BNzg2MWI2MzgtZjI3ZS00OTAyLTkyNjQtZTQ5MWRmZWM4Y2ZkXkEyXkFqcGdeQXVyMjI2Njg3NjM@._V1_SY1000_SX1000_AL_.jpg",
// schedule: []
// }
];

var PTCLbills = [
  {
    title: "PTCL",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (8000 - 700) + 700)
  },
  {
    title: "PTCL",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (8000 - 700) + 700)
  },
  {
    title: "PTCL",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (8000 - 700) + 700)
  }
];

var KEbills = [
  {
    title: "K.E",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (30000 - 1000) + 1000)
  },
  {
    title: "K.E",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (30000 - 1000) + 1000)
  },
  {
    title: "K.E",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (30000 - 1000) + 1000)
  }
];

var GasBills = [
  {
    title: "GAS",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (5000 - 900) + 900)
  },
  {
    title: "GAS",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (5000 - 900) + 900)
  },
  {
    title: "GAS",
    dueDate: DateGenerator.getRandomDateInRange(startDate, endDate).toDateString(),
    amount: Math.round(Math.random() * (5000 - 900) + 900)
  }
];

var MCBAcc = [
  {accNo: 741 ,amount: 5000},
  {accNo: 852 ,amount: 98500},
  {accNo: 963 ,amount: 878990}];
var HBLAcc = [
  {accNo:147 ,amount: 987455},
  {accNo:258 ,amount: 105000},
  {accNo:369 ,amount: 48000}];
var UBLAcc = [
  {accNo: 321,amount: 587552},
  {accNo: 654,amount: 549982},
  {accNo: 987,amount: 24588}];

var Admins = [{
  Fname: "Zayan",
  Lname: "Tharani",
  age: 25,
  address: "North Nazimabad",
  cellNo: 0315887985
}];

var adminUser = [{
  username: "zayan@hjs.com"
}];
  
var Usernames = [
  {
    username: "hunzilaj@gmail.com"
  },
  {
    username: "sateesh@gmail.com"
  },
  {
    username: "alley@gmail.com"
  }
];

var Customers = [
  {
    Fname: "Hanzala",
    Lname: "Jamash",
    age: 26,
    address: "Landhi",
    cellNo: 03145887546,
    blocked: false
  },
  {
    Fname: "Sateesh",
    Lname: "Mandhan",
    address: "Defence",
    age: 29,
    cellNo: 03145887544,
    blocked: false
  },
  {
    Fname: "Alley",
    Lname: "Mustafa",
    address: "North",
    age: 26,
    cellNo: 03145887543,
    blocked: false
  }
];

var Accounts = [
  {
    accNo: 1,
    cardNo: 123,
    amount: 10000,
    status: false,
    type: "premium",
    limit: 50000
  },
  {
    accNo: 2,
    cardNo: 456,
    amount: 152000,
    status: true,
    type: "gold",
    limit: 100000
  },
  {
    accNo: 3,
    cardNo:789,
    amount: 20000,
    status: true,
    type: "silver",
    limit: 25000
  }
];
 
function seedDB() {
  console.log("Populating data");
  Transaction.deleteMany({},function(err){
    
  });
  Admin.deleteMany({},function(err){
    if (err) {
      console.log(err);
    }
    var j = 0;
    for (var i=0 ; i<Admins.length ; i++){
    Admin.create(Admins[i],function(err, createdAdmin){
      if (err) {
        console.log(err);
      }
      User.register(new User(adminUser[j]), "1234", function(err, newAdmin){
        createdAdmin.user = newAdmin;
        createdAdmin.save();
        j++;
      });
    });
  }
  });  
  Account.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    }
    Customer.deleteMany({}, function(err) {
      if (err) {
        console.log(err);
      }
      User.deleteMany({},function(err){
      for (var i = 0; i < Accounts.length; i++) {
        var j = -1;
        Account.create(Accounts[i], function(err, createdAccount) {
          if (err) {
            console.log(err);
          } else {
            j++;
            var k = j;
            var password = "1234";
            Customer.create(Customers[j], function(err, newCustomer) {
              if (err) {
                console.log(err);
              } else {
                Bill.deleteMany({},function(err){
                Bill.create(PTCLbills[k], function(err, ptclBill){
                  if (err){
                    console.log(err);
                  }
                  
                  Bill.create(KEbills[k],function(err, keBill){
                    if (err){
                      console.log(err);
                    }
                    Bill.create(GasBills[k],function(err, gasBill){
                      if (err){
                        console.log(err);
                      } 
                      ptclBill.customer = newCustomer;
                      ptclBill.save();
                      keBill.customer = newCustomer;
                      keBill.save();
                      gasBill.customer = newCustomer;
                      gasBill.save();
                      // console.log(ptclBill);
                    newCustomer.bills.push(ptclBill);
                    newCustomer.bills.push(keBill);
                    newCustomer.bills.push(gasBill);

                createdAccount.customer = newCustomer;
                createdAccount.save();
                newCustomer.acc = createdAccount;
                newCustomer.save();
                  if(createdAccount.status != false){
                  User.register(new User(Usernames[k]), password, function(err,newUser) {
                  newCustomer.user = newUser;
                  newCustomer.save(function(err, data) {
                    if (err) {
                      console.log(err);
                    } 
                  });
                });
              }
            });
            });
            });
            });
              }
            });
          }
        });
      }
    });
  });

  MCB.deleteMany({},function(err){
  MCBAcc.forEach(function(x){
    Account.create(x,function(err, newAccount){
      if(err){
        console.log(err);
      }
      x.acc = newAccount._id;
      MCB.create(x);
    });
});
});

UBL.deleteMany({},function(err){
UBLAcc.forEach(function(y){
  Account.create(y,function(err, newAccount){
    if(err){
      console.log(err);
    }
    y.acc = newAccount._id;
  UBL.create(y);
});
});
});

HBL.deleteMany({},function(err){
HBLAcc.forEach(function(z){
  Account.create(z,function(err, newAccount){
    if(err){
      console.log(err);
    }
    z.acc = newAccount._id;
  HBL.create(z);
});
});
});

Movie.deleteMany({},function(err){
movies.forEach(function(ticket){
  var m=0;
  for(m=0;m<3;m++){
  var scheduel = {
  date: randomDate(),
  time: randomTime(),
  seatsAvaliable: Math.round(random())
}
// if(ticket.scheduel){
ticket.scheduel.push(scheduel);
// }
}
  Movie.create(ticket, function(err,newTicket){
    // console.log(newTicket);
  });
});
});
});
}
module.exports = seedDB;
