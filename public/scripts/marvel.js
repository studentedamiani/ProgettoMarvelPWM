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