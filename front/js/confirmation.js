// Récupère param 'orderId' de l'URL
let urlOrderId = new URLSearchParams(window.location.search).get("orderId");

//Redirige sur page d'accueil si pas d'orderId
if (urlOrderId === null || urlOrderId === "") {
  alert("Une erreur s'est produite lors de la validation de votre commande. Veuillez nous en excuser !");
  window.location.href = "index.html";
}
//Sinon, affiche confirmation de commande et numéro de commande
else {
  // Vérifie si numéro de commande est déjà dans LS
  let storedOrderId = localStorage.getItem("orderId");

  if (storedOrderId) {
    // Si le numéro de commande est déjà stocké, utilisez-le au lieu d'en générer un nouveau
    urlOrderId = storedOrderId;
  } else {
    // Génère un nouveau numéro de commande et stocke-le dans le stockage local
    urlOrderId = Math.floor(Math.random() * 1000000);
    localStorage.setItem("orderId", urlOrderId);
  }

  // Mise à jour l'URL avec numéro de commande
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("orderId", urlOrderId);
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);

  const idCommande = document.getElementById("orderId");
  idCommande.innerText = urlOrderId;
}
