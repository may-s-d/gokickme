
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
    let givenEmail = '\'' + obj.supporterEmail + '\'';
    let givenID = obj.id;
    let givenProject = "'" + obj.projectName + "'";
    
    
   try {
       
    let foundPledge = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Pledges Where id = ' + givenID +' and project_name =' + givenProject, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (foundPledge.length === 0){
        return {
            statusCode: 400,
            body:"This pledge does not exist"
        }
    } else if (foundPledge.length > 1){
        return {
            statusCode: 400,
            body:"Multiple pledges with the same project and id where found" + foundPledge.length
        }
    }
    
    foundPledge = foundPledge[0]
    
    
    let numberOfClaims = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select count(supporter_email) from PledgeSupporterRelations where pledge_id = ' + givenID +' and project_name =' + givenProject, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    numberOfClaims = numberOfClaims[0]
    
    if (foundPledge.maxSupporters !== 0 && numberOfClaims >= foundPledge.maxSupporters){
        return {
            statusCode: 400,
            body:"Pledge has already been claimed the max number of times"
        }
    }
    
    let supporterBudget = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Supporters where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (supporterBudget.length === 0){
        return {
            statusCode: 400,
            body:"Supporter does not exist"
        }
    }
    
    supporterBudget = supporterBudget[0]
    
    if (supporterBudget.budget < foundPledge.cost){
        return {
            statusCode: 400,
            body:"Supporter does not have enough funds to claim pledge"
        }
    }
    
    //insert into PledgeSupproterRelations
    
    let dummy = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Insert into PledgeSupporterRelations (project_name, pledge_id, supporter_email) Values (' + givenProject + ', ' + givenID + ', ' + givenEmail + ')', function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    let newAmount = supporterBudget.budget - foundPledge.cost
    
    let dummy2 = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Update Supporters set budget = ' + newAmount + ' where email = ' + givenEmail + '', function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    //update Supporets 
    
     let supporter = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Supporters where email = ' + givenEmail, function (err, result) {
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
      body:supporter
   
    }


  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};

