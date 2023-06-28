//récupération de l'id du produit via l'URL
function getUrlParams(param) {
  let url = new URL(window.location.href);
  return url.searchParams.get(param);
}

//On rappel l'API mais cette fois par produit
async function getOneProduct(id) {
  const response = await fetch("http://localhost:3000/api/products/" + id);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error);
  }
}
//On appel les infos de chaque produits par l'Id
async function displayInfo() {
  let idProduct = getUrlParams("id"); // choppe la valeur id dans l'url
  let product = await getOneProduct(idProduct);
  console.log(product);

  // ajouter la ref de l'id du produit sur le boutton
  const addToCart = document.getElementById("addToCart");
  // creation d'une dataset sur le boutton (data-id-product = id du produit)
  addToCart.dataset.idProduct = product._id;

  // On insert le nom du produit dans la balise avec id "title"
  let productTitle = document.getElementById("title");
  console.log(productTitle);
  productTitle.innerText = product.name;

  // On insert le prix du produit dans la balise avec id "price"
  let productPrice = document.getElementById("price");
  console.log(productPrice);
  productPrice.innerText = product.price;

  // On insert la description du produit dans la balise avec id "description"
  let productDescription = document.getElementById("description");
  console.log(productDescription);
  productDescription.innerText = product.description;

  // OPTIONNEL A FAIRE : UTILISER FRAGMENT POUR COLORS ET IMAGES

  // On insert les couleurs du produit
  let productColors = document.getElementById("colors");
  // On creer une boucle car plusieurs choix de couleurs
  for (let color of product.colors) {
    productColors.innerHTML += `<option value="${color}">${color}</option>`;
  }

  //On insert l'image + balise img dans la div (vu chez github du mec)
  let imageAlt = document.querySelector(".item__img");
  imageAlt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}

displayInfo();

// ----------------------------------------------------------
// Condition de validation du clic bouton ajouter au panier
// ----------------------------------------------------------

//Fonction utilitaire reutilisable
const storeProducts = (products) => {
  if (!products) {
    alert("Attention!");
    return;
  }
  //serialisation JSON.stringify va transformer mes données complexes tableau/objet en chaine de caracteres
  localStorage.setItem("products", JSON.stringify(products));
};
// Retrouver les produits déjà persistés en localStorage. Renvoie un tableau vide si il ne trouve rien
const getProducts = () => {
  const _products = localStorage.getItem("products");
  if (!_products || _products === "undefined") {
    return [];
  }
  //JSON.parse transforme la chaine de caractere en tableau/object
  return JSON.parse(_products);
};

const addProductToCart = (productData) => {
  const productsInLS = getProducts();
  console.log(productsInLS);

  // Si pas encore de produit
  if (!productsInLS.length) {
    // Créé un array
    const products = [];
    // Ajout du produit et persist dans l'array
    products.push(productData);
    // Persiste l'array
    storeProducts(products);
  }
  // Produit deja stocké dans le LS
  else {
    const productWithSameIdAndColor = productsInLS.find((_prod) => {
      const sameId = _prod._id === productData._id;
      const sameColor = _prod.color === productData.color;
      const isSameIdAndColor = sameId && sameColor;
      return isSameIdAndColor;
    });
    if (productWithSameIdAndColor) {
      //console.log("Produit deja stocké dans LS mais meme couleur = incrémente");
      let newValue = productWithSameIdAndColor.quantity + productData.quantity;
      if (newValue < 101) {
        productWithSameIdAndColor.quantity += productData.quantity; // Increment quantity
        storeProducts(productsInLS);
      } else {
        alert("la quantité max ne peut pas dépassé 100");
      }
    } else {
      //console.log("produit pas stocké dans LS => ajout du produit");
      productsInLS.push(productData);
      storeProducts(productsInLS);
    }
  }
};

addToCart.addEventListener("click", (event) => {
  // Retrouve l'id du produit
  const productId = event.target.getAttribute("data-id-product");
  //parseInt = converti un string en chiffre
  const itemsQuantity = parseInt(document.getElementById("quantity").value);
  if (itemsQuantity > 0 && itemsQuantity < 101) {
    alert("Le produit a bien été ajouté au panier");
  } else {
    return alert("La quantité saisie n'est pas correct!");
  }
  // Choppe la couleur selectionnée
  const color = document.getElementById("colors").value;
  // Sauvegarde dans LS
  const productData = {
    _id: productId,
    quantity: itemsQuantity,
    color: color,
  };
  addProductToCart(productData);
});
