/*fetch ('http://localhost:3000/api/products')
    .then(res => console.log(res))*/

//------------------------------------------------------------------------
// Récupération des produits de l'api
//------------------------------------------------------------------------
// On créé la fonction qui appel l'API
//On utilise async/await qui nous permet d'attendre le resultat de la fonction avant d'éxécuter le reste du code
async function getProducts() {
  const response = await fetch("http://localhost:3000/api/products");
  //Instruction if = si ok le navigateur nous retourne le fichier json, sinon il renvoie une erreur
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error);
  }
}

//----------------------------------------------------------------------
// Fonction d'affichage des produits de l'api sur la page index
//----------------------------------------------------------------------

//Fonction qui appel les produits
async function displayProducts() {
  //Appel de l'api (fonction du haut)
  const products = await getProducts();
  //On appel la section
  const target = document.getElementById("items");

  //fragment = une "box" provisoire, pour eviter une exécution 1 puis 1.2 puis 1.2.3 / mais plutot 1.2.3 direct
  const fragment = new DocumentFragment();

  //Pour chaque produits compris dans la list products
  products.forEach((product) => {
    let link = document.createElement("a");
    link.href = `./product.html?id=${product._id}`;
    link.innerHTML = `<article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>`;
    fragment.appendChild(link);
  });
  target.appendChild(fragment);
}
//On appel la fonction produits
displayProducts();
