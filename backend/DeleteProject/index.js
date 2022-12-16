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
    let givenName = "'" + obj.projectName + "'";
    let givenEmail = "'" + obj.designerEmail + "'";
    
   try {
       
    let wantedProject = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Projects Where name = ' + givenName, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (wantedProject.length === 0){
      return {
            statusCode: 400,
            body: "A project by this name doesn't exist"
        }
    }
    
    wantedProject = wantedProject[0]
    
    if (wantedProject.designer_email !== obj.designerEmail){
        return {
            statusCode: 400,
            body: "The given designer does not owe this project"
        }
    }
    
    if (wantedProject.launched == 'True'){
       return {
            statusCode: 400,
            body: "This project has already been launched, therefore it cannot be deleted"
        }
    }
    
    let dummy = await new Promise((resolve, reject) => {
          connection.getConnection(function (err,connection) {
            if (err) {
              reject(err);
            }
            connection.query('Delete from Projects Where name = ' + givenName, function (err, result) {
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
        body: "Trust me; the project you gave me to delete is long gone. If you see this, dm me the word \'pineapple\' May"
    }
    
   } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};

