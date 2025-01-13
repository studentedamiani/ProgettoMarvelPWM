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
        body: JSON.stringify({username: localStorage.getItem("username"), cards:9})
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


