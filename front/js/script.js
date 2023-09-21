// Récupération des produits de l'api
async function getProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

// Affichage des produits

async function displayProducts() {
  const products = await getProducts();
  const target = document.getElementById("items");

  const fragment = new DocumentFragment();
  ("");

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

displayProducts();
