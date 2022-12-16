var mysql = require('mysql')

var connection = mysql.createPool({
    "connectionLimit" : 10,
    "host" : "gokickmedb.ct9osjgvash0.us-east-2.rds.amazonaws.com",
    "user" : "DBAdmin",
    "password" : "DBAdminPW",
    "database" : "mydb",
    "port" : "3306"
});

exports.handler = async (event) => {
    let obj = JSON.parse(event.body);
    let givenAmount = parseFloat(obj.amount);
    let passedEmail = "'" + obj.supporterEmail + "'";
    
    
  try {
       
     
    if (getSupporter.length == 0){
        return {
            statusCode: 400,
            body: "A supporter with that email does not exist"
        }
    }
    
    getSupporter = getSupporter[0]
    
    let newBudget = (parseFloat(getSupporter.budget) + givenAmount).toString()
    
    let dummy1 = await runSQLQuery('Update Supporters set budget = ' + newBudget + ' Where email = ' + passedEmail)
    
    let dummy2 = await runSQLQuery('Select * from Supporters Where email = ' + passedEmail)
    
    dummy2 = dummy2[0]
    
    return {
      statusCode: 200,
      body: dummy2
    }
    
  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};


function runSQLQuery (query) {
   return new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        connection.query(query, function(err, result){
          connection.release()
          if(err){reject(err)};
          resolve(result)
        })
        
        if(err){reject(err)};
      }
      );
   }
   );
}
   

