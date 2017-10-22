// Requirements
var mysql = require('mysql');
var inquirer = require('inquirer');
var secret_key = require('./keys.js')
var conn = mysql.createConnection(secret_key);


//Connection to DB 

conn.connect(function(err){
	if(err){
		console.log(err);
		throw err;
	}
});

console.log("\nWelcome to the Bamazon Toy Store!");

// Show items in the toysForSale table
var printToyz = function() {
  conn.query('SELECT * FROM toysForSale', function(err, res) {
  		console.log("\nHere are all of the toys on sale\n");
      
      console.log("----------------------------------------------------\n");
      for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
      }
      console.log("----------------------------------------------------\n");
      questions();
  });
};
printToyz();

// This allows the customer to enter the toy they wish to buy by entering the ID and the quantity. 
function questions() {
	inquirer.prompt([
	{
    	type: "input",
    	message: "Enter the ID of the item you would like to purchase? ",
    	name: "item_id"
	},
 	{
    	type:"input",
    	message: "Enter the amount you would like to purchase? (Type Q to Quit) ",
    	name: "quantity"
	}]).then(function(answers) {
    
    if ((answers.quantity == 'Q') || (answers.quantity === 'q') || (answers.quantity == '0')) {
		conn.end();
		process.exit();
		return;
    }
    
    // inputs saved from customer query
    chosenItem = answers.item_id;
    itemQuantity = parseInt(answers.quantity);

    conn.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM toysForSale WHERE item_id= ' + chosenItem, function(err, res) {
		if(err) throw err;

		//Validates the available items in stock and if there is insufficient quantity. 

    	if(res[0].stock_quantity < itemQuantity) {
			inquirer.prompt([{
    			type:"input",
    			message: "Insufficient quantity, not enough of this item in stock. Type 'T' to TRY AGAIN or press 'Q' to QUIT ", 
    			name: "check"
			}]).then(function(answers) {
    			
          // Allows cutomer to quit or start over
    			if ((answers.check === 'Q') || (answers.check === 'q')) {
					conn.end();
					process.exit();
					return;
    			} else { printToyz(); }
    		});
    	}

    	// Customer order completion
     	else {
			conn.query("UPDATE toysForSale SET? WHERE?", [{stock_quantity: res[0].stock_quantity - itemQuantity}, {item_id: chosenItem}], function(err, result){});

			// validates if the toy is greater than available number
			if (itemQuantity >= 1) {
				console.log("\nTOTAL COST: $" + (res[0].price * itemQuantity) + " for buying " + itemQuantity + " toy " + res[0].product_name);
			}
    		
    		//order confirmation
    		console.log("\nYou will receive notification of your shipped order with a tracking ID\n");
    		console.log("\nThe Store has been updated\n");
    		console.log("----------------------------------------------------");
    		
    		// prints the remaining toys after purchases have been made
    		printToyz();
    	}
	});
});
}