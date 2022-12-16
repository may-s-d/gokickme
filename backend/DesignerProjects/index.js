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
    let givenEmail = "'" + obj.designerEmail + "'";
   try {
       
    let designerProjects = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Projects Where designer_email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    return{
        statusCode: 200,
        body: designerProjects
    }
    
   } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};

