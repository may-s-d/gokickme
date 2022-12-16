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
    
    let passedEmail = obj.designerEmail;
    let isDesigner = typeof passedEmail !== 'undefined'
    
    if (isDesigner){
      let givenEmail = "'" + obj.designerEmail + "'";
    }
    
  try {
       
    let wantedProject = await runSQLQuery('Select * from Projects Where name = ' + givenName)
      
    wantedProject = wantedProject[0]
    
    
    if (isDesigner && (wantedProject.designer_email !== obj.designerEmail)){
      return {
      statusCode: 400,
      body: "The given designer does not own this project"
    }
    }
    
    let wantedName = await runSQLQuery('Select name from Designers Where email = ' + "'"+ wantedProject.designer_email +"'")
    
    wantedProject.designer_name = wantedName[0].name
    
    let wantedPledges = await runSQLQuery('Select * from Pledges Where project_name = ' + givenName)
    
    
    
    let pledgesMade = await runSQLQuery('Select pledge_id from PledgeSupporterRelations Where project_name = ' + givenName)
    
    let totalFunded = 0.0;
    
    if (pledgesMade.length !== 0){
    
      let prices = {}
      wantedPledges.forEach(pledge =>{
        prices[pledge.id] = pledge.cost
      })
    
      pledgesMade.forEach(pledge =>{
        let id = pledge.pledge_id
        totalFunded += parseFloat(prices[id])
      
      })
    }
    
    let directSupport = await runSQLQuery('Select SUM(cost) as funds from Donations where project_name = ' + givenName)
    let wantedDonations = await runSQLQuery('Select * from Donations where project_name = ' + givenName)
    
    let funds = directSupport[0].funds
    
    if(funds != null){
      totalFunded += parseFloat(funds)
    }
    
    
    wantedProject.totalFunded = totalFunded;  
      

    wantedProject.pledges = wantedPledges
    
    wantedProject.donations = wantedDonations
    
    
    return{
        statusCode: 200,
        body: wantedProject
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
   

