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
    
    
    let wantedProject = await runSQLQuery('Select * from Projects Where name = ' + givenName)
    
    if(wantedProject.length === 0){
        return{
            status: 400,
            body: 'No project with the name ' + givenName + " exists"
        }
    }
    
    await runSQLQuery('Delete from Projects Where name = ' + givenName)
    await runSQLQuery('Delete from Donations Where project_name = ' + givenName)
    await runSQLQuery('Delete from PledgeSupporterRelations Where project_name = ' + givenName)
    await runSQLQuery('Delete from Pledges Where project_name = ' + givenName)
    
  try {
       
   
    
    return{
        statusCode: 200,
        body: givenName + ' is delected YIPEEEE!'
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