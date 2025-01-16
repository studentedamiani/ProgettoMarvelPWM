
class SearchableSelect {
    constructor(config) {
        this.apiUrl = config.apiUrl;
        this.resultsDropdown = document.getElementById('resultsDropdown');
        this.searchResults = document.getElementById('searchResults');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.selectedValue = document.getElementById('selected_Superhero');
        this.searchInput = document.getElementById('select_superhero');
        this.debounceTimeout = null;
        this.minChars = config.minChars || 4;
        this.init();
    }

    init() {
        // Search input event listener
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                const query = this.searchInput.value.trim();
                if (query.length >= this.minChars) {
                    this.performSearch(query);
                } else {
                    this.hideResults();
                }
            }, 300); // Debounce delay
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && 
                !this.resultsDropdown.contains(e.target)) {
                this.hideResults();
            }
        });

        // Show dropdown when focusing on input
        this.searchInput.addEventListener('focus', () => {
            if (this.searchResults.children.length > 0) {
                this.showResults();
            }
        });
    }

    async performSearch(query) {
        try {
            this.showLoading();
            
            // Creation of the query
            query="nameStartsWith="+query+"&orderBy=name&"

            await getMarvelCarachters(query).then (async response  => {
                if (window.location.pathname === '/create_exchange') {
                    const user_Id = localStorage.getItem("_id");
                    const album_ID = localStorage.getItem("album_ID");
                    
                    if (user_Id && album_ID) {
                        const filteredData = [];
                        for (const character of response.data) {
                            try {
                                const checkResponse = await fetch('/check_card_album', {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        user_Id: user_Id,
                                        album_Id: album_ID,
                                        card_Id: character.id
                                    })
                                });
                                const result = await checkResponse.json();
                                if (result.length < 1) {
                                    filteredData.push(character);
                                }
                            } catch (err) {
                                console.error('Error checking card:', err);
                            }
                        }
                        response.data = filteredData;
                    }
                }
                    this.displayResults(response.data);
                if (response.code!=200) {
                throw new Error('Network response was not ok'+response.code);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.displayError('Error fetching results');
            })


        } catch (error) {
            console.error('Error fetching data:', error);
            this.displayError('Error fetching results');
        } finally {
            this.hideLoading();
        }
    }

    displayResults(data) {
        this.searchResults.innerHTML = '';
        if (data.length === 0) {
            const noResults = document.createElement('li');
            noResults.className = 'search-item text-muted';
            noResults.textContent = 'No valid results found';
            this.searchResults.appendChild(noResults);
        } else {
            data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'search-item';
                li.textContent = item.name; // Adjust according to your data structure
                li.dataset.value = item.id; // Adjust according to your data structure
                
                li.addEventListener('click', () => {
                    this.selectItem(item);
                });
                
                this.searchResults.appendChild(li);
            });
        }
        
        this.showResults();
    }

    async selectItem(item) {
        this.selectedValue.value = item.id; // Adjust according to your data structure
        this.searchInput.value = item.name; // Adjust according to your data structure
        this.hideResults();
        
        // Trigger change event
        const event = new CustomEvent('item-selected', { 
            detail: item 
        });
        this.searchInput.dispatchEvent(event);
        if (['/card' ].includes(window.location.pathname))
            {
                document.getElementById('character_details').innerHTML=``;
                var Div_Car =
                '<div class="card card-shine-effect-metal" id="char-'+item.id+'">'+
                    '<div class="card-header">'+
                        item.name+
                    '</div>'+
                    //'<hr>'+
                    '<div class="card-content">'+
                        '<img src="'+item.thumbnail.path.replace(/"/g, "")+'.'+item.thumbnail.extension+'">'+
                    '</div>'+
                    '<div class="card-body">'+
                    item.description+
                    '</div>'+
                    '<div class="card-footer">'+
                    'Data provided by ©Marvel'
                    '</div>'+
                '</div>';
                document.getElementById("CardContainer").innerHTML = Div_Car;
                //If the user is logged and has selected an album and have the card in the album i present all data
                var user_Id = localStorage.getItem("_id");
                var album_ID = localStorage.getItem("album_ID");
                if (!user_Id || !album_ID ) {
                    return;
                }
                try {
                    const response = await fetch('/check_card_album', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user_Id: user_Id,
                            album_Id: album_ID,
                            card_Id: item.id // invio dell'id al posto della password.
                        })
                    });
                    if (!response.ok) {
                        throw new Error("Autenticazione non valida");
                    }
                    const userData = await response.json();
                    if (userData.length>0) {
                    const character_details = document.getElementById('character_details');
                     let seriesHtml=``;
                     let eventsHtml=``;
                     let comicsHtml=``;
                    if ( item.series.available>0 ){
                        seriesHtml = '<hr><h3>Series:</h3><br>';
                        for (let series of item.series.items) {
                            seriesHtml += `<p>${series.name}</p>`;
                        }
                    }
                    if ( item.events.available>0 ){
                        eventsHtml = '<hr><h3>Events:</h3>';
                        for (let events of item.events.items) {
                            eventsHtml += `<p>${events.name}</p>`;
                        }
                    }
                    if ( item.comics.available>0 ){
                        comicsHtml = '<hr><h3>Comics:</h3>';
                        for (let comic of item.comics.items) {
                            comicsHtml += `<p>${comic.name}</p>`;
                        }
                    }
                    character_details.innerHTML = seriesHtml + eventsHtml + comicsHtml;
                }
                    }
                    /*Check the superhero that doesn't work*/
                catch (error) {
                    console.error("Errore!",error);
                    return "ERR";
                }
                //}
            }
    }

    displayError(message) {
        this.searchResults.innerHTML = `
            <li class="search-item text-danger">${message}</li>
        `;
        this.showResults();
    }

    showResults() {
        this.resultsDropdown.classList.add('show');
    }

    hideResults() {
        this.resultsDropdown.classList.remove('show');
    }

    showLoading() {
        this.loadingIndicator.classList.remove('d-none');
    }

    hideLoading() {
        this.loadingIndicator.classList.add('d-none');
    }
    async setSuperheroById(id) {
        try {
            this.showLoading();
            const response = await getSingleHero(id);
            
            if (response.data && response.data.length > 0) {
                const hero = response.data[0];
                this.selectItem(hero);
            } else {
                this.displayError('Superhero not found');
            }
        } catch (error) {
            console.error('Error fetching superhero:', error);
            this.displayError('Error loading superhero');
        } finally {
            this.hideLoading();
        }
    }
}

// Initialize the component
const searchSelect = new SearchableSelect({
    minChars: 4 // Minimum characters before triggering search
});

// Listen for selection
document.getElementById('select_superhero').addEventListener('item-selected', (e) => {
    // Handle the selection here
});

async function register() {
    var email = document.getElementById('email');
    var username = document.getElementById('username');
    var password1 = document.getElementById('password1');
    var password2 = document.getElementById('password2');
    var name = document.getElementById('name');
    var surname = document.getElementById('surname');
    var date_of_birth = document.getElementById('date_of_birth');
    //This hidden item contains the selected superhero
    var selected_Superhero = document.getElementById("selected_Superhero");
    //This item is the one used to select the superhero and is visible
    var superhero_selection = document.getElementById("select_superhero");
    // Check of the password
    if (password1.value != password2.value || password1.value.length < 7) {
       password1.classList.add('border');
       password1.classList.add('border-danger');
       password2.classList.add('border');
       password2.classList.add('border-danger');
       alert("The password must be at least 7 characters long and match the confirmation!");
       return;
    } else {
       password1.classList.remove('border');
       password1.classList.remove('border-danger');
       password2.classList.remove('border');
       password2.classList.remove('border-danger');
    }
    // Check the date of birth with regexp
    var dataPattern = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dataPattern.test(date_of_birth.value)) {
       date_of_birth.classList.add('border');
       date_of_birth.classList.add('border-danger');
       alert("The date of birth must be in the format DD/MM/YYYY!");
       return;
    } else {
       date_of_birth.classList.remove('border');
       date_of_birth.classList.remove('border-danger');
    }
 
    // Check email with regexp
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email.value)) {
       email.classList.add('border');
       email.classList.add('border-danger');
       alert("Insert a valid email address!");
       return;
    } else {
       email.classList.remove('border');
       email.classList.remove('border-danger');
    }
 
    // Check length of username and check with regexp
    var usermanePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (!usermanePattern.test(username.value)) {
        username.classList.add('border');
        username.classList.add('border-danger');
       alert("The username must be between 4 and 16 characters long and contain only letters, numbers and underscores!");
       return;
    } else {
        username.classList.remove('border');
       username.classList.remove('border-danger');
    }
 
    // Check of the angrafic data
    if (!name.value) {
       name.classList.add('border');
       name.classList.add('border-danger');
       alert("Insert your name!");
       return;
    } else {
       name.classList.remove('border');
       name.classList.remove('border-danger');
    }
 
    if (!surname.value) {
       surname.classList.add('border');
       surname.classList.add('border-danger');
       alert("Insert your surname!");
       return;
    } else {
       surname.classList.remove('border');
       surname.classList.remove('border-danger');
    }
 
    //Check if superhero is selected. Only check is selected because the non valid characters are not selectable
    if (!selected_Superhero.value) {
        superhero_selection.classList.add('border');
        superhero_selection.classList.add('border-danger');
        alert("Select a superhero!");
        return;
     } else {
        superhero_selection.classList.remove('border');
        superhero_selection.classList.remove('border-danger');
     }
    var data = {
       name: name.value,
       username: username.value,
       surname: surname.value,
       email: email.value,
       password: password1.value,
       date: date_of_birth.value,
       superhero: selected_Superhero.value, // I set the selected superhero ID
       credits: 0.0
    };
 
    const button = document.querySelector('button');
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrazione...';

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        

        const result = await response;;

        if (!response.ok) {
            if (response.status == 530) {
                throw new Error(result.message || "Username or email already in use");
            } else {
                throw new Error(result.message);
            }
        }
        
        // Clean of localstorage for security
        localStorage.clear();
        //In the modal dialog of login if the modal is closed I redirect to the homepage
        var loginModal = document.getElementById('loginModal');
        loginModal.addEventListener('hidden.bs.modal', function () {
                window.location.href = '/';
        });
        alert("User registered successfully! You can now log in.");
        //Cambio il target, prima mi serviva l'elemento HTML, adeso uso l'oggetto
        loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();


    } catch (error) {
         // Reset button state
         button.disabled = false;
         button.innerHTML = 'Register';
         
         // Show error
         alert('Registration failed. Please try again. ' + error.message);
        console.error('Registration failed:', error);
        // Show error to user
        document.getElementById('error-message').textContent = 
            'Registration failed. Please try again.';
    }
 }


 async function populateUserProfile() {
    var email = localStorage.getItem("email");
    var username = localStorage.getItem("username");
    var _id = localStorage.getItem("_id");
    if (!email || !username || !_id) {
        console.error("Missing required user data in localStorage");
        return;
    }
    try {
        const response = await fetch('/get_user_data', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                username: username,
                _id: _id // invio dell'id al posto della password.
            })
        });
        if (!response.ok) {
            throw new Error("Autenticazione non valida");
        }
        const userData = await response.json();
        // Mostra i dati dell'utente nel profilo
        document.getElementById("username").value = userData.username;
        document.getElementById("email").value = userData.email;
        document.getElementById("name").value = userData.name;
        document.getElementById("surname").value = userData.surname;
        // Get correct select element and update
        const selectElement = document.getElementById('selected_Superhero');
        
        if (selectElement) {
            selectElement.value = userData.superhero;
             // Fetch superhero details using the ID
             try {
                const heroResponse = await getSingleHero(userData.superhero);    
                const searchInput = document.getElementById('select_superhero');
                if (!heroResponse) {
                    throw new Error('No response from hero fetch');
                }
                
                if (heroResponse.data && heroResponse.data.length > 0) {
                    const hero = heroResponse.data[0];
                    // Update the visible search input with the hero name
                    searchInput.value = hero.name;
                } else {
                    console.error("Superhero not found");
                    searchInput.value = "Superhero not found";
                }
            } catch (error) {
                console.error("Error fetching superhero details:", error);
                searchInput.value = "Error loading superhero";
            }
        }
        /*Check the superhero that doesn't work*/
        document.getElementById("date_of_birth").value = userData.date;    }
     catch (error) {
        console.error("Errore!",error);
        return "ERR";
    }
    
}

async function updateUser() {
    var email = document.getElementById('email');
    var username = document.getElementById('username');
    var password1 = document.getElementById('password1');
    var password2 = document.getElementById('password2');
    var name = document.getElementById('name');
    var surname = document.getElementById('surname');
    var date_of_birth = document.getElementById('date_of_birth');
    //This hidden item contains the selected superhero
    var selected_Superhero = document.getElementById("selected_Superhero");
    //This item is the one used to select the superhero and is visible
    var superhero_selection = document.getElementById("select_superhero");
    // Check of the password
    if ((password1.value != password2.value || password1.value.length < 7 ) && password1.value) {
       password1.classList.add('border');
       password1.classList.add('border-danger');
       password2.classList.add('border');
       password2.classList.add('border-danger');
       alert("The password must be at least 7 characters long and match the confirmation!");
       return;
    } else {
       password1.classList.remove('border');
       password1.classList.remove('border-danger');
       password2.classList.remove('border');
       password2.classList.remove('border-danger');
    }
    // Check the date of birth with regexp
    var dataPattern = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dataPattern.test(date_of_birth.value)) {
       date_of_birth.classList.add('border');
       date_of_birth.classList.add('border-danger');
       alert("The date of birth must be in the format DD/MM/YYYY!");
       return;
    } else {
       date_of_birth.classList.remove('border');
       date_of_birth.classList.remove('border-danger');
    }
 
    // Check email with regexp
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email.value)) {
       email.classList.add('border');
       email.classList.add('border-danger');
       alert("Insert a valid email address!");
       return;
    } else {
       email.classList.remove('border');
       email.classList.remove('border-danger');
    }
 
    // Check length of username and check with regexp
    var usermanePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (!usermanePattern.test(username.value)) {
        username.classList.add('border');
        username.classList.add('border-danger');
       alert("The username must be between 4 and 16 characters long and contain only letters, numbers and underscores!");
       return;
    } else {
        username.classList.remove('border');
       username.classList.remove('border-danger');
    }
 
    // Check of the angrafic data
    if (!name.value) {
       name.classList.add('border');
       name.classList.add('border-danger');
       alert("Insert your name!");
       return;
    } else {
       name.classList.remove('border');
       name.classList.remove('border-danger');
    }
 
    if (!surname.value) {
       surname.classList.add('border');
       surname.classList.add('border-danger');
       alert("Insert your surname!");
       return;
    } else {
       surname.classList.remove('border');
       surname.classList.remove('border-danger');
    }
 
    //Check if superhero is selected. Only check is selected because the non valid characters are not selectable
    if (!selected_Superhero.value) {
        superhero_selection.classList.add('border');
        superhero_selection.classList.add('border-danger');
        alert("Select a superhero!");
        return;
     } else {
        superhero_selection.classList.remove('border');
        superhero_selection.classList.remove('border-danger');
     }
    var data = {
       name: name.value,
       _id : localStorage.getItem("_id"),
       username: username.value,
       password: password1.value,
       surname: surname.value,
       email: email.value,
       date: date_of_birth.value,
       superhero: selected_Superhero.value // I set the selected superhero ID
    };
 
    const button = document.querySelector('button');
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrazione...';

    try {
        const response = await fetch('/update-user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        // Save user credentials in LocalStorage using the result data
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        alert("User update successfully! ");
        window.location.reload();
        return;
    } catch (error) {
         // Reset button state
         button.disabled = false;
         button.innerHTML = 'Register';
         
         // Show error
         alert('Update failed failed. Please try again. ' + error.message);
        console.error('Update failed:', error);
        // Show error to user
        document.getElementById('error-message').textContent = 
            'Update failed. Please try again.';
    }
}

async function deleteUser() {
    var _id = localStorage.getItem("_id");
    try{
        const response = await fetch(`../delete-user/${_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        alert("User successfully deleted. Now you will return to homepage");
        localStorage.clear();    
        //Going back to the homepage
        window.location.href = '/';

    } catch (error) {
        console.error("Errore!",error);
        return "ERR";
    }
}