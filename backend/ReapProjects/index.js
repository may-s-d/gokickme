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
    let givenDate = formatForSQL(obj.date);
    
    
  try {
       
    let getUpdateProjects = await runSQLQuery('Select * from Projects where launched = true and status = \'incomplete\' and deadline <= ' + givenDate)
    
        for(let i = 0; i < getUpdateProjects.length ; i++){
            let project = getUpdateProjects[i]
            let projectName = formatForSQL(project.name)
            
            //Code taken from ViewProject
            let wantedPledges = await runSQLQuery('Select * from Pledges Where project_name = ' + projectName)
            let pledgesMade = await runSQLQuery('Select pledge_id from PledgeSupporterRelations Where project_name = ' + projectName)
            
            let dontationAmount = await runSQLQuery('Select sum(cost) as funds from Donations where project_name = ' + projectName)
            
            let totalFunded = 0.0
            
            dontationAmount =  dontationAmount[0].funds
            
            if(dontationAmount != null){
                totalFunded += parseFloat(dontationAmount)
            }
        
            let prices = {}
        
            if (pledgesMade.length !== 0){
                
                
                wantedPledges.forEach(pledge =>{
                    prices[pledge.id] = pledge.cost
                })
    
                pledgesMade.forEach(pledge =>{
                    let id = pledge.pledge_id
                    totalFunded += parseFloat(prices[id])
                })
            }
            
            //return totalFunded + " | " + project.goal_amount
            //End of code from ViewProject
            
            let newStatus = parseFloat(project.goal_amount) <= parseFloat(totalFunded) ? formatForSQL('successful') : formatForSQL('failed')
            //'\"incomplete\"\n\"successful\"\n\"failed\"
                
            let updateProject = await runSQLQuery('Update Projects Set status = ' + newStatus + ' where name = ' + projectName)
            
            if (newStatus === formatForSQL('failed')){
                let pledges = await runSQLQuery('Select * from PledgeSupporterRelations where project_name = ' + projectName)
             
                //Return Pledges
                 for(let k = 0;  k < pledges.length; k++){
                     let cost = parseFloat(prices[pledges[k].pledge_id])
                     let supporterEmail = formatForSQL(pledges[k].supporter_email)
                     let budget = await runSQLQuery('Select budget as currentBudget from Supporters where email = ' +  supporterEmail)
                     
                     let newBudget = formatForSQL((cost + parseFloat(budget[0].currentBudget)))
                     
                     let dummy1 = await runSQLQuery('Update Supporters Set budget = ' + newBudget + ' where email = '  +  supporterEmail)
                 }
                 
                 let donations = await runSQLQuery('Select * from Donations where project_name = ' + projectName)
                 
                 //Return Donations
                 for(let j = 0; j < donations.length; j++){
                     let cost = parseFloat(donations[j].cost)
                     let supporterEmail = formatForSQL(donations[j].supporter_email)
                     let budget = await runSQLQuery('Select budget as currentBudget from Supporters where email = ' + supporterEmail)
                     
                     let newBudget = formatForSQL((cost + parseFloat(budget[0].currentBudget)))
                     
                     let dummy2 = await runSQLQuery('Update Supporters Set budget = ' + newBudget + ' where email = '  +  supporterEmail)
                 }
            }
        }
    
    
    let dummy = await runSQLQuery('Select * from Projects;')
    
    return {
      statusCode: 200,
      body: dummy
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