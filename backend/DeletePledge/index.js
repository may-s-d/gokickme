
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
    let givenID = obj.id;
    let givenProject = "'" + obj.projectName + "'";
    
   try {
       
     let project = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Projects where name = ' + givenProject + ' and designer_email = ' + givenEmail + ' and launched = false', function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    
    if(project.length === 0){
        return {
        statusCode: 400,
        body: "Project either does not exist or has already been launched " + givenEmail 
        }
    }
    
    project = project[0]
    
    let pledge = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Pledges where project_name = ' + givenProject + ' and id = ' + givenID, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (pledge.length === 0){
         return {
            statusCode: 400,
            body: "Pledge does not exist"
        }
    }
    
    
    let dummy = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        
        connection.query('Delete from Pledges where project_name = ' + givenProject + ' and id = ' + givenID, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    return {
      statusCode: 200,
      body: project
   
    }


  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};

