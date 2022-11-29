//An abstract class that represents a user in GoKickMe
export class User {
    User(email, name){
        //If the class that is calling this construct is User
        if (this.constructor == User) {
            //Throw an error as User is abstract and cannot be instantiated 
            throw new Error("Instantiation of an Abstract Class");
        }

        //Save user's email and name
        this.email = email
        this.name = name
    }

    //get a user's email
    getEmail(){
        return this.email
    }

    //get a user's name
    getName(){
        return this.name
    }
}

//a class (extending User) that represent an dmin in GoKickMe
export class Admin extends User {
    Admin(email, name){
        //call the higher class' constructor 
        super(email, name)
    }
}

//a class (extending User) that represent a supporter in GoKickMe
export class Supporter extends User {
    Supporter(email, name, budget){
        //call the higher class' constructor 
        super(email, name)

        //save supporter's budget
        this.budget = budget

        //Create list for suppoerter's pledges and support
        this.sucessfulPledges = new []
        this.directSupports = new []
    }

    //get a supporter's budget
    export getBudget(){
        return this.budget
    }

    //get a supporter's pledges
    export getSucessfulPledges(){
        return this.sucessfulPledges
    }

    //get a supporter's support
    export getDirectSupports(){
        return this.directSupports
    }
}

//a class (extending User) that represent a design in GoKickMe
export class Designer extends User {
    Designer(email, name){
        //call the higher class' constructor 
        super(email, name)

        //Create list for designer's projects
        this.projects = new []
    }
}