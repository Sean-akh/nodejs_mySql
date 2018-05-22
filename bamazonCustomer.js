var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");
var request = require('request');


    // present the categories
    inquirer.prompt(
        [
            {
                message: "Please select category you would like to adjust the inventory?",
                type: "list",
                name: "choice",
                choices: ["Books", "Computers"]
            }
        ]
    ).then(function(inquirerResponse){
        var category = inquirerResponse.choice;
        //connect to DB
        //DB connection and credentials
        var connection = mysql.createConnection({
            host: "localhost",
            port: 3306,

            user: "root",
            password: "CFxrTy6^5L9>8!X26",
            database: "bamazondb"
        });
        //error check DB connection
        connection.connect(function (err) {
            if (err) throw err;
            console.log("connected as id: " + connection.threadId);

            var viewProd = "SELECT * FROM products WHERE department_name = " + "'" + category + "'";
            var query = connection.query(viewProd, function (err, result) {
                //error check
                if (err) throw err;
                //creawte the product array to select from
                var productArray = [];
                var idArray =[];
                for (i = 0; i < result.length; i++) {
                    var product = result[i].product_name;
                    var id = result[i].ID;
                    productArray.push(product);
                    idArray.push(id);
                }
console.log("Product array is: " + productArray + "\nProduct id is: " + idArray +"\n---------------\n");
                inquirer.prompt(
                    [
                        {
                            message: "Please select the product that you would like to adjust the inventory?",
                            type: "list",
                            name: "choice",
                            choices: productArray
                        },
                        {
                            message: "please enter the desired quantity",
                            type: "input",
                            name: "quantity" 
                        }
                    ]
                )
                    .then(function(inquirerResponse){
                        var selectedProduct = inquirerResponse.choice;
                        var selectedQuantity = inquirerResponse.quantity;
console.log("Slected Product is: " + selectedProduct);
                        //get the selected product
                        var viewProd = "SELECT * FROM products WHERE product_name = " + "'" + selectedProduct + "'";
                       // var viewProd = "SELECT * FROM products WHERE department_name = " + "'" + category + "'";
console.log(" select product " + viewProd);
                        var query = connection.query(viewProd, function (result) {
console.log("result is: " + result.product_name);
                            var prodName = result.product_name;
                            var stockQuantity = result.stock_quantity;
                            var id = result.ID;
                            var newStockQuantity = stockQuantity - selectedQuantity;
                            if(newStockQuantity !=0) {
                                console.log("\n--------------------\nYour order is placed.\n Thank you for Shopping.\n------------------\n");
                                var updateDB = "UPDATE products SET stock_quantity = '" + newStockQuantity + "' WHERE ID = " + id;
                                var query = connection.query(updateDB, function(result){

                                    console.log("the database updated successfully");
                                });//update the product table
                            }//end of if
                            else {
                                    console.log("\n--------------------\nYour order cannot be completed with selected Quantity.\nPlease try again\n--------------------\n");
                            }//end of else
                        });//END of SELECTED PRODUCT

                    });//Second Query that product is selected
            })//end of query to see the products

            //end DB connection    
            connection.end();
        });//END of DB Connect
    });//END of First Inquirer.prompt