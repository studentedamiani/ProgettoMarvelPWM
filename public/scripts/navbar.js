async function printNavBar() {
    const basePath = '../images/';
    const userIcon = `${basePath}user-solid.png`;
    const logoIcon = `${basePath}logo.png`;
    const navbarContainer = document.getElementById('menu');
    var HTML_code;
    //Stampo la prima parte della barra di navigazione, il logo e il menu mobile sono sempre presenti
    //È sempre disponibile Cerca Supereroe solo che se non sono loggato vedo solo info base, se sono loggato e ho quella carta nell'album vedo tutto

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
                            <li class="nav-item">
                                <a class="nav-link" href="/card">Cerca SuperEroe</a>
                            </li>`;
                    //Se l'utente non è loggato stampo il link per il login che apre la modal
                    /*Se l'utente è loggato stampo il tutte le funzionalità da utente loggato
                        Che sono:
                            -Acquisto crediti
                            -Acquisto pacchetti
                            -Scambi (Accettazione + Inserimento)
                            -Album (Vedi Supereroe dett+ Vendita carte) Se supereroe non trovato lo opacizzo e non faccio vedere dettaglio
                    */
                    if (checkUserLogged() ) {
                        HTML_code = HTML_code+   
                        `
                        <li class="nav-item">
                            <a class="nav-link" href="#">Album</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Scambi</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Pacchetti</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Acquista crediti</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#"> <img src="${userIcon}" alt ="user icon" class="nav-user-icon" ></img> `+ localStorage.getItem("username") + `</a> 
                        </li>`;
                    }
                    else
                    {
                        /*Se non è loggato stampo il bottone per il login e anche la modal*/
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
    //Stampo sempre la chiusura.
    HTML_code = HTML_code+    
                    `</ul>
                </div>
            </div>
        </nav>`; 
         navbarContainer.innerHTML =HTML_code;
    //Gestisco il tema

        /*Adatto la barra di navigazione al tema scelto*/
        const navbar = document.querySelector('.navbar');
        if (document.querySelector("html").getAttribute("data-bs-theme") === "dark") {
            navbar.classList.remove('navbar-light', 'bg-light');
            navbar.classList.add('navbar-dark', 'bg-dark');
        } else {
            navbar.classList.remove('navbar-dark', 'bg-dark');
            navbar.classList.add('navbar-light', 'bg-light');
        }
}

// Function to handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

async function loadHTML() {
    fetch('/login')
    .then(response => response.text())
    .then(data => {
      htmlContent = data;
    });
}

// Add event listener to update navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', printNavBar);
