async function getMarvelCarachters(query) {
    return await fetch(`../characters?query=${query}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        
        },
        body: JSON.stringify({})
        })
        .then(response => response.json())
        .catch(error => console.error(error))
}
async function getPackage() {
    return await fetch('../package',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: localStorage.getItem("username"), album_id:localStorage.getItem("album_ID"),user_id: localStorage.getItem("_id"),cards:5})
        })
        .then(response => response.json())
        .catch(error => console.error(error))

}

async function getAlbumcardsDB(albumID) {
    return await fetch(`/albums_cards/${albumID}`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        })
        .then(response => response.json())
        .catch(error => console.error(error))

}

async function printPackage() {
await getPackage()
.then(response =>
    {  printCredits();
         var i=0;
            var Div_Car = `<div class="row">
                        <div class="col-md-12 text-center"> `
            response.forEach(item => {
                if (i % 3 ==0 ) {
                    Div_Car = Div_Car + 
                    `   </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 text-center"> `;
                }
                Div_Car =
                    Div_Car + 
                    '<div class="card card-shine-effect-metal" id="char-'+item.data.results[0].id+'">'+
                        '<div class="card-header">'+
                            item.data.results[0].name+
                        '</div>'+
                        //'<hr>'+
                        '<div class="card-content">'+
                            '<img src="'+item.data.results[0].thumbnail.path.replace(/"/g, "")+'.'+item.data.results[0].thumbnail.extension+'">'+
                        '</div>'+
                        '<div class="card-body">'+
                        item.data.results[0].description+
                        '</div>'+
                        '<div class="card-footer">'+
                        item.attributionText+
                        '</div>'+
                    '</div>';
                    i++;
            });
            Div_Car = Div_Car + `   </div>
                                </div>
                                <button onclick=window.location.reload(); class="btn btn-block btn-success w-100">OK</button>`;
            document.getElementById("pack_cards").innerHTML = Div_Car;
        }
)
.catch(response => console.error("Calculation error!"+response)) 
}

async function printAlbumCards(albumId) {
    document.getElementById("pack_cards")
    .innerHTML = '<i class="fas fa-spinner fa-spin fa-3x"></i>';
    await getAlbumcardsDB(albumId)
    .then(response =>
        {   console.log("Response of getAlbumCards--->",response);
             var i=0;
                var Div_Car = `<div class="row">
                            <div class="col-md-12 text-center"> `
                response.forEach(item => {
                    if (i % 3 ==0 ) {
                        Div_Car = Div_Car + 
                        `   </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 text-center"> `;
                    }
                    console.log("Item",item);
                    console.log("Item marvel",item.marvel_data);
                    console.log("item.marvel_data.data[0].id",item.marvel_data.data[0].name);

                    Div_Car =
                        Div_Car + 
                        ' <a href="/card" onclick=localStorage.setItem("heroId","' + item.marvel_data.data[0].id + '")>'
                        +'<div class="card card-shine-effect-metal" id="char-'+item.marvel_data.data[0].id+'">'+
                            '<div class="card-header">'+
                                item.marvel_data.data[0].name+
                            '</div>'+
                            //'<hr>'+
                            '<div class="card-content">'+
                                '<img src="'+item.marvel_data.data[0].thumbnail.path.replace(/"/g, "")+'.'+item.marvel_data.data[0].thumbnail.extension+'">'+
                            '</div>'+
                            '<div class="card-body">'+
                            item.marvel_data.data[0].description+
                            '</div>'+
                            '<div class="card-footer">'+
                            item.marvel_data.attributionText+
                            '</div>'+
                        '</div></a>';
                        i++;
                });
                Div_Car = Div_Car + `   </div>
                                    </div>`;
                document.getElementById("pack_cards").innerHTML = Div_Car;
                document.getElementById("pack_cards").classList.remove("hidden");
            }
    )
    .catch(response => console.error("Calculation error!"+response)) 
}
    



async function getSingleHero(id) {
    try {
        const response = await fetch(`../character/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching hero:', error);
        throw error; // Re-throw to handle it in the calling function
    }
}

async function createAlbum(userid,name) {
    console.log("Funzione JS",userid);
    console.log(name);

    try{
        const response = await fetch(`../create_album`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({userId:userid, name:name})
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let JsonResponse = await response.json();
            console.log("Album_ID",JsonResponse);
        localStorage.setItem("album_ID",JsonResponse.insertedId);
        alert("Album created");
        window.location.reload();
        }
    } catch (error) {
        console.error('Error fetching hero:', error);
        throw error; // Re-throw to handle it in the calling function
    }
}

async function loadCharacterpassed(){
    var heroID = localStorage.getItem("heroId");
    if (heroID) {
    try {
        const heroResponse = await getSingleHero(heroID);    
        const searchInput = document.getElementById('select_superhero');
        if (!heroResponse) {
            throw new Error('No response from hero fetch');
        }
        
        if (heroResponse.data && heroResponse.data.length > 0) {
            const hero = heroResponse.data[0];
            // Update the visible search input with the hero name
            searchInput.value = hero.name;
            /*var item = {
                id: hero.id,
                name: hero.name
            };*/
            console.log(hero);
            var Div_Car =
            '<div class="card card-shine-effect-metal" id="char-'+hero.id+'">'+
                '<div class="card-header">'+
                hero.name+
                '</div>'+
                //'<hr>'+
                '<div class="card-content">'+
                    '<img src="'+hero.thumbnail.path.replace(/"/g, "")+'.'+hero.thumbnail.extension+'">'+
                '</div>'+
                '<div class="card-body">'+
                hero.description+
                '</div>'+
                '<div class="card-footer">'+
                'Data provided by ©Marvel'
                '</div>'+
            '</div>';
            document.getElementById("CardContainer").innerHTML = Div_Car;
            console.log("dopo stampa cont.")
            //If the user is logged and has selected an album and have the card in the album i present all data
            var user_Id = localStorage.getItem("_id");
            var album_ID = localStorage.getItem("album_ID");
            console.log("prima controllo localstorage user_Id",user_Id);
            console.log("prima controllo localstorage album_ID",album_ID);
            if (!user_Id || !album_ID ) {
                return;
            }
            console.log("passato controllo localstorage");
            try {
                const response = await fetch('/check_card_album', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_Id: user_Id,
                        album_Id: album_ID,
                        card_Id: hero.id
                    })
                });
                console.log("partito");
                if (!response.ok) {
                    throw new Error("Autenticazione non valida");
                }
                console.log("partito");
                const userData = await response.json();
                console.log(userData);
                console.log(userData.length);
                if (userData.length>0) {
                    console.log("Hai il personaggio");
                const character_details = document.getElementById('character_details');
                 let seriesHtml=``;
                 let eventsHtml=``;
                 let comicsHtml=``;
                 console.log(userData);
                if ( hero.series.available>0 ){
                    seriesHtml = '<h3>Series:</h3><br><ul>';
                    for (let series of hero.series.items) {
                        seriesHtml += `<li>${series.name}</li>`;
                    }
                    seriesHtml += '</ul>';
                }
                if ( hero.events.available>0 ){
                    eventsHtml = '<h3>Events:</h3>';
                    for (let events of hero.events.items) {
                        eventsHtml += `<p>${events.name}</p>`;
                    }
                }
                if ( hero.comics.available>0 ){
                    comicsHtml = '<h3>Comics:</h3>';
                    for (let comic of hero.comics.items) {
                        comicsHtml += `<p>${comic.name}</p>`;
                    }
                }
                console.log(comicsHtml);
                character_details.innerHTML = seriesHtml + eventsHtml + comicsHtml;
            }
                else
                {
                    console.log("NO");
                }
                }
                /*Check the superhero that doesn't work*/
            catch (error) {
                console.error("Errore!",error);
                return "ERR";
            }        } else {
            console.error("Superhero not found");
            searchInput.value = "Superhero not found";
        }
        localStorage.removeItem("heroId");
    } catch (error) {
        console.error("Error fetching superhero details:", error);
        searchInput.value = "Error loading superhero";
    }
}
}