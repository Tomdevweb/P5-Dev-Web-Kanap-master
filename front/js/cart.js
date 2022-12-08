const products = JSON.parse(localStorage.getItem("products"));

async function getOneProduct(id) {
  const response = await fetch("http://localhost:3000/api/products/" + id);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error);
  }
}

async function displayInfo() {
  // récupération de la balise ou on va mettre les données final
  const cartItems = document.getElementById("cart__items");
  // création du fragment
  const fragment = new DocumentFragment();

  for await (product of products) {
    console.log(product);
    //On enregistre les infos du produit actuel de la boucle dans une variable, via un appel a l'api
    const productInfo = await getOneProduct(product._id);

    //creation de la balise article
    let article = document.createElement("article");
    article.classList.add("cart_item");
    article.dataset.id;
    article.dataset.color;
    article.innerHTML = `
    <div class="cart__item__img">
      <img src="${productInfo.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${productInfo.name}</h2>
        <p>${product.color}</p>
        <p>${productInfo.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
`;
    fragment.appendChild(article);
  }
  //ajout du fragment sur la page
  cartItems.appendChild(fragment);
}

function getTotal() {
  //Get la balise p prix
  const prices = document.querySelectorAll(
    ".cart__item__content__description p:nth-child(3)"
  );
  //addition des prix
  let total = 0;
  prices.forEach((e) => {
    //Le slice supprime l'espace vide et le symbole euro, et le number() va parser mes deux prix
    total += Number(e.innerHTML.slice(0, -2));
  });
  console.log(total);
  //ajout prix total dans le DOM
  const totalPrices = document.getElementById("totalPrice");
  totalPrices.innerHTML = total;

  //Get la balise input quantités
  const quantity = document.querySelectorAll(
    ".cart__item__content__settings__quantity input:nth-child(2)"
  );
  //addition des quantités
  let totalQtt = 0;
  quantity.forEach((e) => {
    totalQtt += Number(e.value);
  });
  console.log(totalQtt);
  //ajout quantité totale dans le DOM
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = totalQtt;
}

async function main() {
  //await car sinon il va lire getTotal avant d'avoir fini la lecture de displayInfo
  await displayInfo();
  getTotal();
}

main();

///
//probleme : il n'additionne pas le prix lorsque meme canapé en plusieurs quantités
///
/*
products.forEach((product) => {
  //console.log("stored product", product);

  let cartItems = document.getElementById("cart__items");
  let article = document.createElement("article");
  article.data.{nom de data}
  article.innerHTML = `<article class="cart__item" data-id="${product._id}" data-color="${product.color}"> 
  <div class="cart__item__img"><img src="" alt=""></div> <div class="cart__item__content">
  <div class="cart__item__content__description">
 <h2>${product.name}</h2>
    <p>${product.color}</p>
    <p>${product.price}</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>`;
  cartItems.appendChild(article);
});
*/

// console.log(product.color); //appel couleur par local storage
//console.log(productInfo.price); //appel prix par l'api
// création de l'article
//paramettrage de l'article
//innerHTML
//ajout de l'article dans le fragment

//etape 8 = ne pas oublier de faire une fonction pour le prix total.
