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
            
            // Creo la query
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
            noResults.textContent = 'No results found';
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
    var nome = document.getElementById('nome');
    var cognome = document.getElementById('cognome');
    var data_di_nascita = document.getElementById('data_di_nascita');
    //Contiene il valore selezionato (nascosto)
    var selected_Superhero = document.getElementById("selected_Superhero");
    //Contiene l'elemento che seleziona (visibile)
    var superhero_selection = document.getElementById("select_superhero");
    // Controllo password
    if (password1.value != password2.value || password1.value.length < 7) {
       password1.classList.add('border');
       password1.classList.add('border-danger');
       password2.classList.add('border');
       password2.classList.add('border-danger');
       alert("La password deve essere lunga almeno 7 caratteri e coincidere nei due campi");
       return;
    } else {
       password1.classList.remove('border');
       password1.classList.remove('border-danger');
       password2.classList.remove('border');
       password2.classList.remove('border-danger');
    }
    // Controllo data di nascita con regexp
    var dataPattern = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dataPattern.test(data_di_nascita.value)) {
       data_di_nascita.classList.add('border');
       data_di_nascita.classList.add('border-danger');
       alert("Data di nascita nel formato sbagliato");
       return;
    } else {
       data_di_nascita.classList.remove('border');
       data_di_nascita.classList.remove('border-danger');
    }
 
    // Controllo email con regexp
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email.value)) {
       email.classList.add('border');
       email.classList.add('border-danger');
       alert("Inserisci un indirizzo email valido!");
       return;
    } else {
       email.classList.remove('border');
       email.classList.remove('border-danger');
    }
 
    // Controllo nickname con lunghezza e regexp
    var nicknamePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (!nicknamePattern.test(username.value)) {
        username.classList.add('border');
        username.classList.add('border-danger');
       alert("Il nome utente deve avere tra 4 e 16 caratteri e contenere solo lettere, numeri e underscore!");
       return;
    } else {
        username.classList.remove('border');
       username.classList.remove('border-danger');
    }
 
    // Controllo altri campi
    if (!nome.value) {
       nome.classList.add('border');
       nome.classList.add('border-danger');
       alert("Inserisci il tuo nome!");
       return;
    } else {
       nome.classList.remove('border');
       nome.classList.remove('border-danger');
    }
 
    if (!cognome.value) {
       cognome.classList.add('border');
       cognome.classList.add('border-danger');
       alert("Inserisci il tuo cognome!");
       return;
    } else {
       cognome.classList.remove('border');
       cognome.classList.remove('border-danger');
    }
 
    //Controllo supereroe (Verifico solo se è selezionato tanto quelli non validi non possono essere selezionati)
    if (!selected_Superhero.value) {
        superhero_selection.classList.add('border');
        superhero_selection.classList.add('border-danger');
        alert("Seleziona un supereroe!");
        return;
     } else {
        superhero_selection.classList.remove('border');
        superhero_selection.classList.remove('border-danger');
     }
    var data = {
       name: nome.value,
       username: username.value,
       surname: cognome.value,
       email: email.value,
       password: password1.value,
       date: data_di_nascita.value,
       superhero: selected_Superhero.value // Setto l'ID del supereroe selezionato
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
        

        const result = await response;

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        
        // Pulisco localStorage per sicurezza
        localStorage.removeItem("_id");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        //Nella pagina di registrazione se per qualsiasi motivo si chiude la modal torno alla pagina iniziale.
        var loginModal = document.getElementById('loginModal');
        loginModal.addEventListener('hidden.bs.modal', function () {
            // Check if login was successful (you can set a flag after successful login)
            // Or any other login success indicator
                window.location.href = '/';
        });
        alert("Registrazione avvenuta con successo, verrai reindirizzato alla pagina di login");
        //Cambio il target, prima mi serviva l'elemento HTML, adeso uso l'oggetto
        loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();


    } catch (error) {
         // Reset button state
         button.disabled = false;
         button.innerHTML = 'Registrati';
         
         // Show error
         alert('Registrazione fallita. Riprova.');
        console.error('Registration failed:', error);
        // Show error to user
        document.getElementById('error-message').textContent = 
            'Registration failed. Please try again.';
    }
 }

