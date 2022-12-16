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
    let obj = JSON.parse(event.body)
    let givenCost = formatForSQL(obj.cost)
    let givenDescription = formatForSQL(obj.description)
   // let givenDesignerEmail = formatForSQL(obj.designerEmail)
    let givenMaxSupporters = formatForSQL(obj.maxSupporters)
    let givenProjectName = formatForSQL(obj.projectName)
    
    
   try {
       
       let currentMax = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select Max(id) as MaxID from Pledges Where project_name = ' + givenProjectName, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    let nextId = formatForSQL(currentMax[0].MaxID + 1)
       
   let dummy = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Insert into Pledges (id, project_name, cost, description, maxSupporters) ' + 
            'Values (' +
            nextId + ',' +
            givenProjectName + ',' +
            givenCost + ',' +
            givenDescription + ',' +
            givenMaxSupporters + 
            ')'
            , function (err, result) {
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
        body: "It was added, Yipeeeeeee!"
    }
    
   } catch (err) {
    return {
      statusCode: 400,
      body: err.message + "it was me, alex!"
    }
  }
};

function formatForSQL(input){
    return "'" + input + "'"
}