
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
    let projectName = "'" + obj.projectName + "'"
    let pledgeId = "'" + obj.id + "'";
   try {
       
    let foundPledge = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Pledges Where project_name = ' + projectName + 'and id = ' + pledgeId, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (foundPledge.length === 0) {
        return{
            statusCode: 400,
            body: "error: No pledge from project " + projectName + " with an id of " + pledgeId+ " exists"
            
        }
    }else{
        //There is a designer with the given email, so we need to build the return body
        foundPledge = foundPledge[0]
        let pledgeClaims = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select supporter_email from PledgeSupporterRelations Where project_name = ' + projectName + 'and pledge_id = ' + pledgeId, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    foundPledge.numSupporters = pledgeClaims.length
    foundPledge.supporterEmails = pledgeClaims
    
    let dummy = await runSQLQuery("Select * from Projects where name = " + projectName);

      dummy = dummy[0]
    
      foundPledge.projectStatus = dummy.status
        
    }
    
    
    return {
      statusCode: 200,
      body:foundPledge
   
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
   
function formatForSQL(input){
    return "'" + input + "'"
}
