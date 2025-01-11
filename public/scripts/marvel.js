async function getMarvelCarachters(query) {
    return await fetch(`../characters?query=${query}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        
        },
        body: JSON.stringify({a: 1, b: 'Textual content'})
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
        body: JSON.stringify({a: 1, b: 'Textual content'})
        })
        .then(response => response.json())
        .catch(error => console.error(error))

}

async function printPackage() {

await getPackage()
.then(response =>
    {   var i=0;
        var loop_check = 0;
            var Div_Car = document.getElementById("pack_cards");
            response.forEach(item => {
                Div_Car.innerHTML =
                    Div_Car.innerHTML + 
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
            });
        
        }
)
.catch(response => console.error("Calculation error!"+response)) 
}


