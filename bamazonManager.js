var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");
var request = require('request');

//Prompt the manager to choose the tasks
inquirer.prompt(
        [{
            message: "what would you like to do?",
            type: "list",
            name: "choice",
            choices: ["Add new product", "View inventory", "Add to Inventory", "View products for sale", "Add product for sale"]
        }]
    )
    .then(function (inquirerResponse) {

        //if choice is add new product
        if (inquirerResponse.choice === "Add new product") {
            //ask about the product needs to be added
            /****************************************/
            function addProduct() {
                console.log("entered add product function");
                inquirer.prompt(
                    [{
                            message: "Product Name",
                            type: "input",
                            name: "product_name"
                        },
                        {
                            message: "Product ID",
                            type: "input",
                            name: "item_id"
                        },
                        {
                            message: "Department Name",
                            type: "input",
                            name: "department_name"
                        },
                        {
                            message: "Price",
                            type: "input",
                            name: "price"
                        },
                        {
                            message: "Stock Quantity",
                            type: "input",
                            name: "stock_quantity"
                        },
                        {
                            message: "Is this Product on Sale",
                            type: "input",
                            name: "product_sales"
                        }
                    ]
                ).then(function (inquirerResponse) {
                    //create necessary variables for DB query
                    var product_name = inquirerResponse.product_name;
                    var item_id = inquirerResponse.item_id;
                    var department_name = inquirerResponse.department_name;
                    var price = inquirerResponse.price;
                    var stock_quantity = inquirerResponse.stock_quantity;
                    var product_sales = inquirerResponse.product_sales;

                    console.log("--------------------------------------\nproduct: " + product_name + "\n item ID: " + item_id + "\n department: " + department_name + "\n Price: " + price + "\n Stock Quantity: " + stock_quantity + "\n Product Sale: " + product_sales + "\n--------------------------------------");

                    console.log("mysql loaded");

                    //DB connection and credentials
                    var connection = mysql.createConnection({
                        host: "localhost",
                        port: 3306,

                        user: "sean",
                        password: "CFxrTy6^5L9>8!X26",
                        database: "bamazondb"
                    });
                    //error check DB connection
                    connection.connect(function (err) {
                        if (err) throw err;
                        console.log("connected as id: " + connection.threadId);

                        //initiate adding products
                        console.log("Inserting a new product...\n");
                        //defining variables
                        var dbInsert = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity, product_sales) VALUES";
                        var values = [item_id, "'" + product_name + "'", "'" + department_name + "'", price, stock_quantity, product_sales];
                        console.log(values);
                        var valInsert = dbInsert + "(" + values + ");"
                        //reading the Query
                        console.log("The Insert text is: " + valInsert);

                        //the query for DB
                        var query = connection.query(valInsert, function (err, result) {
                            console.log("Before Errors\n");

                            if (err) throw err;
                            console.log(result.affectedRows + " product inserted!\n");
                            //end DB connection    
                            connection.end();

                        });
                        //////////////////////////////////////////
                        //// END of ADD PRODUCT THEN FUNCTION ////
                    });

                });

                //////// END of FUNCTION ADD PRODUCT ////////////////////////
            }
            addProduct();

            //////////// end of add new product//////////////////
        }
        //if choice is view inventory
        else if (inquirerResponse.choice === "View inventory") {
            console.log("View Inventory");

            function viewInventory() {
                inquirer.prompt(
                    [{
                        message: "Please select category you would like to see?",
                        type: "list",
                        name: "choice",
                        choices: ["Books", "Computers"]
                    }]
                ).then(function (inquirerResponse) {
                    var category = inquirerResponse.choice;
                    //DB connection and credentials
                    var connection = mysql.createConnection({
                        host: "localhost",
                        port: 3306,

                        user: "sean",
                        password: "CFxrTy6^5L9>8!X26",
                        database: "bamazondb"
                    });
                    //error check DB connection
                    connection.connect(function (err) {
                        if (err) throw err;
                        console.log("connected as id: " + connection.threadId);
                        var viewInv = "SELECT * FROM products WHERE department_name = " + "'" + category + "'";
                        var query = connection.query(viewInv, function (err, result) {

                            if (err) throw err;
                            for (i = 0; i < result.length; i++) {
                                console.log(
                                    "----------------------------------------------- \n" +
                                    "Item ID: " + result[i].item_id + "\n" +
                                    "Product Name: " + result[i].product_name + "\n" +
                                    "Department: " + result[i].department_name + "\n" +
                                    "Price: " + result[i].price + "\n" +
                                    "Quantity in Stock: " + result[i].stock_quantity + "\n" +
                                    "Sale Price: " + result[i].product_sales + "\n" +
                                    "----------------------------------------------- \n"
                                );
                            }

                            //end DB connection    
                            connection.end();

                        });//end of query DB
                    });//end of DB connection.connect
                });//end of inquirerResponse
            ////////////////////////////////////////////
            } ///////// END OF View INVENTORY /////////   
            viewInventory();
        } //END of IF
        //////////////////////////////////////////////////////////////////////////////////// 

        //if choice is add to inventory
        else if (inquirerResponse.choice === "Add to Inventory") {
            console.log("Add to Inventory");
            function addInventory(){
            // Select the product to change inventory
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
                    //DB connection and credentials
                    var connection = mysql.createConnection({
                        host: "localhost",
                        port: 3306,
                        user: "sean",
                        password: "CFxrTy6^5L9>8!X26",
                        database: "bamazondb"
                    });
                    //error check DB connection
                    connection.connect(function (err) {
                        if (err) throw err;
                        console.log("add inventory connected as id: " + connection.threadId);
                        var viewInv = "SELECT * FROM products WHERE department_name = " + "'" + category + "'";
                        var query = connection.query(viewInv, function (err, result) {

                            if (err) throw err;                       
                            var productArray = [];
                            for (i = 0; i < result.length; i++) {
                                var product = result[i].product_name;
                                productArray.push(product);
                            }
                            //change the quantity
                            inquirer.prompt(
                                [{
                                        message: "Please select the product that you would like to adjust the inventory?",
                                        type: "list",
                                        name: "choice",
                                        choices: productArray
                                }]).then(function(inquirerResponse){
                                var selectedProduct = inquirerResponse.choice;
                                
                                var query = connection.query(
                                    "SELECT * FROM products WHERE ?",
                                    {product_name: selectedProduct},
                                 function(err, result) {
                                    if (err) throw err;
                                    var availableQuantity = result.stock_quantity;
                                    var productID = result.ID;
console.log("--------------------\navailable quantity: " + availableQuantity +"\n product ID is: " + productID + "\n---------------------\n" );
                                    inquirer.prompt(
                                        [
                                            {
                                                message: "You have currently " + availableQuantity + " for " + selectedProduct + "\n please enter the quantity you would like to add",
                                                type: "input",
                                                name: "quantity"
                                            }
                                        ]
                                    ).then(function(inquirerResponse){
                                        var quantitychoice = inquirerResponse.quantity;
                                        var changeQuantity = "UPDATE `products` SET `stock_quantity`='" + quantitychoice +"' WHERE `ID`='" + productID +"'";
                                        var query = connection.query(changeQuantity, function (result) {
                                            
                                            console.log("the quantity has been updated successfully");
                                    });//end of the third inquirerResponse*/
                                });

                                
                            });//second inquirerResponse
                            
                            //end DB connection    
                            connection.end();

                        });//end of query DB
                    });//end of DB connection.connect

                });//end of InquirerResponse for phase1
            });
            /////////////////////////////////////////
            }// END OF FUNCTION ADD INVENTORY ///////
            addInventory();
            //////////// end of add to inventory//////////////////
        };//END OF IF ADD INVENTORY//////////////
        ///////////////////////////////////////
        
/*
        //if choice is view products for sale
        else if (inquirerResponse.choice === "view products for sale") {
            console.log("view products for sale");
            saleProductView();
            //////////// end of view products for sale//////////////////
        }
        //if choice is add product for sale
        else if (inquirerResponse.choice === "Add product for sale") {
            console.log("Add product for sale");
            addSaleProduct();
            //////////// end of add product for sale//////////////////
        }

        //////////// end of task choice from manager respose
    });
    */
});