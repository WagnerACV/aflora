if (!window.location.search || !window.location.search.includes("id=")) window.location = "pages/products.html";

var productId = window.location.search.replaceAll("?id=", "");

var productContainer = document.getElementById('product-container');
productContainer.style.display = "none";

var loadSpinner = document.getElementById('loadSpinner');
loadSpinner.style.display = "flex";

var productName = document.getElementById('product-name');
var productPrice = document.getElementById('product-price');
var productDescription = document.getElementById('product-description');
var carouselProductImages = document.getElementById('carousel-product-images');
var saleLink = document.getElementById('saleLink');

fetch("/products/" + productId)
    .then(function (response) { return response.json() })
    .then(function (data) {
        if (data && data.id) {
            productContainer.style.display = "flex";
            loadSpinner.style.display = "none";

            productName.innerHTML = data.name;
            productPrice.innerHTML = "R$ " + data.price;
            productDescription.innerHTML = data.description;
            
            data.images.forEach((image, index) => {
                carouselProductImages.innerHTML += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <img src="${image}" alt="${data.name}-${index}" onerror="this.onerror=null; this.src='../assets/images/product-1.png'">
                    </div>
                `;
            });
            
            saleLink.href = `https://wa.me/5531999999999?text=Confira%20este%20site%20incr%C3%ADvel!%20${window.location.href}`;
        } else {
            alert("Produto não encontrado.");
            window.location = "/pages/products.html";
        }
    })
    .catch(error => {
        productContainer.style.display = "flex";
        loadSpinner.style.display = "none";

        alert('Erro ao ler eventos via API JSONServer');
    });