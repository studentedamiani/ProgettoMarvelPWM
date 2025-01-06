function printNavBar() {
    const basePath = '../images/';
    const userIcon = `${basePath}user-solid.png`;
    const logoIcon = `${basePath}logo.png`;
    const navbarContainer = document.getElementById('NavigationBar');
    var HTML_code;
    //Stampo la prima parte della barra di navigazione
    HTML_code = `
        <!-- Brand/logo -->
            <a class="navbar-brand " href="#">
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
                        <a class="nav-link active" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Services</a>
                    </li>`;
                    //Se l'utente non è loggato stampo il link per il login che apre la modal

                    //Altrimenti stampo il link per visuallizare il profilo
                    
                    HTML_code = HTML_code+    
                    `<li class="nav-item">
                        <a class="nav-link" href="#"> <img src="${userIcon}" alt ="user icon" class="nav-user-icon" ></img></a>
                    </li>`;
                    HTML_code = HTML_code+    
                    `</ul>
                </div>`;
         navbarContainer.innerHTML =HTML_code;

}
// Function to update navigation bar based on login status
function updateNavbar() {
    /*if (isUserLoggedIn() && userDetails) {*/
     /*   navbarContainer.innerHTML = `
            
			  
        `;*/
 /*   } else {
        navbarContainer.innerHTML = `
                			  <!-- Brand/logo -->
			  <a class="navbar-brand " href="#">
				<img src ="./images/logo.png" alt="Logo" height="30">
			  </a>
			  
			  <!-- Hamburger menu button for mobile -->
			  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			  </button>
			  
			  <!-- Navigation links -->
			  <div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ms-auto">
				  <li class="nav-item">
					<a class="nav-link active" href="#">Home</a>
				  </li>
				  <li class="nav-item">
					<a class="nav-link" href="#">About</a>
				  </li>
				  <li class="nav-item">
					<a class="nav-link" href="#">Services</a>
				  </li>
				  <li class="nav-item">
					<a class="nav-link" href="#" id ="user" ></a>
				  </li>
				</ul>
			  </div>
        `;
    }*/
}

// Function to handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Add event listener to update navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', printNavBar);







