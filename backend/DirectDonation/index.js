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
    let passedAmount = parseFloat(obj.amount)
    let givenEmail = "'" +obj.supporterEmail + "'";
    let givenProjectName = "'" + obj.projectName + "'";
    
    
  try {
       
    let wantedProject = await runSQLQuery('Select * from Projects Where name = ' + givenProjectName)
    
    if(wantedProject.length === 0){
        return{
            statusCode: 400,
            body: "error: No project with the name " + givenProjectName + " exists"
        }
    }
    wantedProject = wantedProject[0]
    if(wantedProject.launched == false){
        return{
            statusCode: 400,
            body: "error: " + givenProjectName + " has not been launched"
        }
    }else if(wantedProject.status !== 'incomplete'){
        return{
            statusCode: 400,
            body: "error: " + givenProjectName + "'s status does not allow for this action"
        }
    }
    
    let wantedSupporter = await runSQLQuery('Select * from Supporters where email = ' + givenEmail)
    
    if(wantedSupporter.length === 0){
        return{
            statusCode: 400,
            body: "error: No supporter with the email " + givenEmail + " exists"
        }
    }
    
    let availableBudget = parseFloat(wantedSupporter[0].budget)
    if (passedAmount > availableBudget){
        return{
            statusCode: 400,
            body: "error: tried to spend " + passedAmount + " when the supporter only has " + availableBudget + " to spend"
        }
    }
    
    let newBudget = (availableBudget - passedAmount).toString()
    
    await runSQLQuery('Update Supporters set budget = ' + newBudget + ' Where email = ' + givenEmail)
    
    await runSQLQuery('Insert into Donations (supporter_email, project_name, cost) VALUES (' + givenEmail +"," + givenProjectName +"," +passedAmount.toString() + ")")
    
    
    
  
    
    return{
        statusCode: 200,
        body: newBudget
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