# GoKickMe

## Instructions for grader
Calculator: http://deploy-react-app-may.s3-website.us-east-2.amazonaws.com/
Crowd Funding Website (GoKickMe): http://gokickme-bucket.s3-website.us-east-2.amazonaws.com/

Access admin view using the button 'Admin View'. 


## If you're grading, you can ignore the notes below

- If this is your first time in the project/you just did a git clone, make sure to run `npm install` to install all the node_modules
- Then run `npm start` and after some time your browser will launch `localhost:3000` which should run the app.

### Explanations on common things in code
- **Why are we using `useState()`?** When the state changes, it forces the page to refresh. Example: in RegisterDesigner.js, `state` is initialized as `undefined`. When the state is undefined, we render the registration page. Once a user submits the registration form and successfully registers, we add the designer's email to sessionStorage, and set the state as the designer's email. This refreshes RegisterDesigner, and now that the state is !== undefined, the page is redirected to the designer homepage.
- **What are the props in Header?** `showAccountButtons` toggles whether or not to render the buttons on the right side of the screen (ie logging in, registering, logging out, admin view). `loggedIn` determines which buttons to render on the right side of the screen (loggedIn = true means you will render the logout button, loggedIn = false means you'r erender logging in, registering, admin view).