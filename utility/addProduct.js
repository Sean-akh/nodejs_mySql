 /****************************************/
 function addProduct() {
console.log("entered add product function");
    inquirer.prompt(
        [
            {
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
 //module.exports = addProduct;
/////////////////////////////////////////////////////////////

