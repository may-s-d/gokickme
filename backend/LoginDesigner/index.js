
var mysql = require('mysql')

var connection = mysql.createPool({
    "connectionLimit" : 10,
    "host" : "gokickmedb.ct9osjgvash0.us-east-2.rds.amazonaws.com",
    "user" : "DBAdmin",
    "password" : "DBAdminPW",
    "database" : "mydb",
    "port" : "3306"
});

exports.lambdaHandler = async (event) => {
    let obj = JSON.parse(event.body);
    let givenEmail = "'" + obj.email + "'";
   try {
       
    let foundDesignerEntry = await new Promise((resolve, reject) => {
        //resolve(givenEmail)
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Designers Where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (foundDesignerEntry.length === 0) {
        return{
            statusCode: 400,
            body: "error: No designer with email " + givenEmail + " exists"
            
        }
    }else{
        //There is a designer with the given email, so we need to build the return body
        foundDesignerEntry = foundDesignerEntry[0]
        
        //Front end expects a list of all projects that have
    let projectsByDesigner = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Projects Where designer_email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            //console.log("Error->" + err);
            reject(err);
          }
          resolve(result);
        });
      })
    });
    foundDesignerEntry.projects = projectsByDesigner
        
    }
    

    
   
    
    
    return {
      statusCode: 200,
      body:foundDesignerEntry
   
    }


  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};


