async function printNavBar() {
    const basePath = '../images/';
    const logoIcon = `${basePath}logo.png`;
    const navbarContainer = document.getElementById('menu');
    var HTML_code;
//I print the first part of the navigation bar; the logo and the mobile menu are always present
//The "Search Superhero" feature is always available, but if I'm not logged in, I only see basic information; if I'm logged in and have that card in the album, I see everything.

    HTML_code = `
        <nav class="navbar navbar-expand-lg " > 
        <div class="container-fluid px-2" id="NavigationBar">
            <!-- Brand/logo -->
                <a class="navbar-brand " href="/">
                <img src ="${logoIcon}" alt="Logo" class="logo nav-logo">
                </a>
                
            <!-- Hamburger menu button for mobile -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            <!-- Navigation links -->
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                            <li class="nav-item ">
                                <a class="nav-link border-link" href="/card">Find superhero</a>
                            </li>`;
                            //If the user is not logged in, I display the login link that opens the modal
                            /*If the user is logged in, I display all the features available for logged-in users, which are:

                            -Purchasing credits
                            -Purchasing packs
                            -Trades (Acceptance + Submission)
                            -Album (View Superhero details + Sell cards). If the superhero is not found, I make it semi-transparent and do not show the details.
                            */
                    if (checkUserLogged() ) {
                        HTML_code = HTML_code+   
                        `
                        <li class="nav-item">
                            <a class="nav-link border-link" href="/album">Album</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link border-link" href="/exchange">Exchange</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link border-link" href="/package">Packages</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link border-link " href="/get-credits"> Credits:<span class="current_credits"> `+ await get_credits()+`</span></a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="userdropdown" role="button" data-bs-toggle="dropdown"> <i alt ="user icon" class="fas fa-user" ></i> `+ localStorage.getItem("name") + `</a> 
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="/user"> <i class= "fas fa-address-card"></i> User profile</a></li>
                                    <li><a class="dropdown-item" role="button" onclick=logout()><i class= "fas fa-right-from-bracket"></i> Logout</a></li>
                                </ul>
                        </li>`;
                    }
                    else
                    {
                        /*If is not logged print the button for login and the modal dialog*/
                        HTML_code = HTML_code+    
                        `<li class="nav-item">
                            <a id="login_Link" data-bs-toggle="modal" data-bs-target="#loginModal" class= "nav-link">Login</a>
                        </li>`;    
                        try {
                            const response = await fetch('/login');
                            const text = await response.text();
                            HTML_code = HTML_code + text;
                        } catch (error) {s
                            console.error('Error fetching login modal:', error);
                        }
                    }
    //Always print the closing of tags
    HTML_code = HTML_code+    
                    `</ul>
                </div>
            </div>
        </nav>`; 
         navbarContainer.innerHTML =HTML_code;
         adaptNavbar();
}

//Theme management
/*Adapting the navbar to the selected theme*/
function adaptNavbar (){
    const navbar = document.querySelector('.navbar');
    if (document.querySelector("html").getAttribute("data-bs-theme") === "dark") {
        navbar.classList.remove('navbar-light', 'bg-light');
        navbar.classList.add('navbar-dark', 'bg-dark');
    } else {
        navbar.classList.remove('navbar-dark', 'bg-dark');
        navbar.classList.add('navbar-light', 'bg-light');
    }
}

async function loadHTML() {
    fetch('/login')
    .then(response => response.text())
    .then(data => {
      htmlContent = data;
    });
}

if (!['/user' ].includes(window.location.pathname))
{   //Only just for
    // Wait for DOM and all resources to load
    window.addEventListener('load', () => {
        printNavBar().catch(error => {
            console.error("Failed to load navbar:", error);
        });
    });       
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
        //If user not logged and I am in a page that requires login I redirect to homepage
        if (['/album', '/get-credits', '/package', '/exchange', '/user', '/sell_cards' , '/create_exchanges' ].includes(window.location.pathname))
        {   //Only just for
            window.location.href = '/';
        }
        return false;
    }
 }

 function logout() {
    localStorage.clear();
    //Going back to the homepage
    window.location.href = '/';
 }

 window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', adaptNavbar)

 async function printCredits() {
    const elements = document.getElementsByClassName('current_credits');
    const credits = await get_credits();
    Array.from(elements).forEach(element => {
        element.textContent = credits;
    });
}


 async function get_credits() {
    return await fetch(`/print-credits/${localStorage.getItem("username")}`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        })
    .then(response => response.json())
    .then(response => response.credits)
 }