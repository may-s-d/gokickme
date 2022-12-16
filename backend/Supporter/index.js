
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
    let givenEmail = "'" + obj.supporterEmail + "'";
   try {
       
    let foundSupporterEntry = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Supporters Where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (foundSupporterEntry.length === 0) {
        return{
            statusCode: 400,
            body: "error: No supporter with email " + givenEmail + " exists"
            
        }
    }else{
    
        foundSupporterEntry = foundSupporterEntry[0]
        
        let supportDonations = await new Promise((resolve, reject) => {
            connection.getConnection(function (err,connection) {
            if (err) {
            reject(err);
            }
        connection.query('Select * from Donations Where supporter_email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
   
    for (let i = 0; i < supportDonations.length; i++){
      supportDonations[i].project_status = await runSQLQuery('Select status from Projects where name = ' + "'" + supportDonations[i].project_name + "'")
    }
    
    foundSupporterEntry.donations = supportDonations
    
    let supportPledges = await new Promise((resolve, reject) => {
            connection.getConnection(function (err,connection) {
            if (err) {
            reject(err);
            }
        connection.query('Select * from PledgeSupporterRelations Where supporter_email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    foundSupporterEntry.pledges = supportPledges
        
        
    return {
      statusCode: 200,
      body:foundSupporterEntry
   
    }
        
        
        
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
