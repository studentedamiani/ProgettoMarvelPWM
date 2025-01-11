
async function generateMenu() {
    const menuElement = document.getElementById("footer");
    menuElement.innerHTML = `
    <div>
    <p class="footer-p">Powered By</p>
    <img src="../images/marvel.png" alt="Marvel Logo" style="width: 100px; height: auto; margin: 10px;">
    <img src="../images/nodejs.png" alt="nodejs Logo" style="width: 50px; height: auto; margin: 10px;">
    <img src="../images/express.png" alt="express Logo" style="width: 15%; height: auto;">
    <img src="../images/mongo.png" alt="mongo Logo" style="width: 15%; height: auto;">
    </div>
 `;
 }
 generateMenu();