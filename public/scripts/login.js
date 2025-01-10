/**
 * @description Handles the login process for users.
 *
 * This function validates the inputs,
 * and sends a POST request to the server for login. If login is successful, it stores user information
 * in local storage and displays a success message; otherwise, it displays an error message.
 */
function login() {
    if (!validateForm())return;
    var usernameOrEmail = document.getElementById('usernameOrEmail');
    var password = document.getElementById('password');
    var data = {
       email: usernameOrEmail.value,
       username: usernameOrEmail.value,
       password: password.value
    };
    // POST REQUEST
    let container = document.getElementsByClassName('container')[0];
    container.innerHTML += ``
    fetch("/login", {
       method: "POST",
       headers: {
          "Content-Type": "application/json"
       },
       body: JSON.stringify(data)
    }).then(response => {
       if (response.ok) {
          response.json().then(responseData => {
             container.innerHTML += `
                 <div class="alert alert-success" role="alert" aria-hidden="true">
                   <h4 class="alert-heading">Succesfully logged in!</h4>
                 </div>`
 
             // Save user_id in localStorage
             localStorage.setItem("_id", responseData._id);
             // Save user credentials in LocalStorage
             localStorage.setItem("email", responseData.email);
             localStorage.setItem("username", responseData.username);
             setTimeout(() => {window.location.href = '/'}, 2000);
          });
       } else {
          container.innerHTML += `
             <div class="alert alert-danger" role="alert" aria-hidden="true">
               <h4 class="alert-heading">Failed to log in! Check your credentials</h4>
             </div>`
       }
    });
 }
 /**
  * Validates user input for login.
  *
  * This function retrieves user input for a username or email and password, validates the inputs,
  * and returns `true` if the inputs are valid, indicating that the form can be submitted. If the inputs
  * are invalid, it adds error classes to the respective input elements and displays an error message.
  *
  * @returns {boolean} `true` if the inputs are valid and the form can be submitted; otherwise, `false`.
  */
 function validateForm() {
    var usernameOrEmail = document.getElementById('usernameOrEmail');
    var password = document.getElementById('password');
    // Remove error classes
    usernameOrEmail.classList.remove('border', 'border-danger');
    password.classList.remove('border', 'border-danger');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(usernameOrEmail.value);
    if (!isValidEmail && (
       !usernameOrEmail.value ||
       usernameOrEmail.value.length < 4 ||
       usernameOrEmail.value.length > 16)) {
       usernameOrEmail.classList.add('border', 'border-danger');
       alert("username / Email is not valid!");
       return false;
    }
    if (!password.value || password.value.length < 7) {
       password.classList.add('border', 'border-danger');
       alert("Passwords must have at least 7 characters!");
       return false;
    }
    return true;
 }
/**
 * Checks if a user is already logged in and redirects them if necessary.
 *
 * This function checks if user credentials are stored in local storage, indicating that the user
 * is already logged in. If both email and username are found in local storage, the user is redirected
 * to their profile page. Used also for fallback in case the user is logged but the navbar printed the wrong enter
 *
 * @returns {boolean} `true` if the user is logged in; otherwise, `false`.
 */
function checkUserLogged() {
    var id = localStorage.getItem("_id");
    var email = localStorage.getItem("email");
    var username = localStorage.getItem("username");
    if (email && username && id) {
       // User is logged, bring him to profile page
       return true;
    }
    else
    {
        return false;
    }
 }

 function logout() {
    localStorage.removeItem('_id');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    //Torno alla pagina iniziale
    window.location.href = '/';
 }