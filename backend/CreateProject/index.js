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
    let givenName = formatForSQL(obj.name)
    let givenStory = formatForSQL(obj.story)
    let givenDesignerEmail = formatForSQL(obj.designerEmail)
    let givenType = formatForSQL(obj.type)
    let givenGoalAmount = formatForSQL(obj.amount)
    let givenDeadline = formatForSQL(obj.deadline)
    let status = formatForSQL('incomplete')
    
   try {
       
    let preExistingProjects = await new Promise((resolve, reject) => {
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
    
    if(preExistingProjects.length !== 0){
        return{
            statusCode: 400,
            body: "error: There is already a project with the name " + obj.name
        }
    }else{
        let dummy = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        //INSERT INTO `mydb`.`Projects` (`name`, `story`, `designer_email`, `type`, `goal_amount`, `deadline`, `launched`, `status`) VALUES ('Blah', 'blah', 'blah', 'blah', '100', '2006-03-22', b'1', 'incomplete');
        connection.query('Insert into Projects (name, story, designer_email, type, goal_amount, deadline, launched, status) ' + 
            'Values (' +
            givenName + "," +
            givenStory + "," +
            givenDesignerEmail + "," +
            givenType + "," +
            givenGoalAmount + "," +
            givenDeadline + "," +
            '0,' + status +')'
            , function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    }
    
    return{
        statusCode: 200,
        body: "It was added, Yipeeeeeee!"
    }
    
   } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};

function formatForSQL(input){
    return "'" + input + "'"
}