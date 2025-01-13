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
            await getMarvelCarachters(query).then (response => {
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

    selectItem(item) {
        this.selectedValue.value = item.id; // Adjust according to your data structure
        this.searchInput.value = item.name; // Adjust according to your data structure
        this.hideResults();
        
        // Trigger change event
        const event = new CustomEvent('item-selected', { 
            detail: item 
        });
        this.searchInput.dispatchEvent(event);
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
       credits: 0
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

