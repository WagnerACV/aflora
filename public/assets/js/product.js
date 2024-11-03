if (!window.location.search || !window.location.search.includes("id=")) window.location = "pages/products.html";

var productId = window.location.search.replaceAll("?id=", "");

const productContainer = document.getElementById('product-container');
productContainer.style.display = "none";

document.getElementById('loadSpinner').style.display = "flex";

fetch("/products/" + productId)
    .then(function (response) { return response.json() })
    .then(function (data) {
        if (data && data.id) {
            productContainer.style.display = "flex";
            document.getElementById('loadSpinner').style.display = "none";

            document.getElementById('product-name').innerHTML = data.name;
            document.getElementById('product-price').innerHTML = "R$ " + data.price;
            document.getElementById('product-description').innerHTML = data.description;
            
            data.images.forEach((image, index) => {
                document.getElementById('carousel-product-images').innerHTML += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <img src="${image}" alt="${data.name}-${index}" onerror="this.onerror=null; this.src='../assets/images/product-1.png'">
                    </div>
                `;
            });

            // document.getElementById('sale-button').onclick;
        } else {
            alert("Produto não encontrado.");
            window.location = "/pages/products.html";
        }
    })
    .catch(error => {
        productContainer.style.display = "flex";
        document.getElementById('loadSpinner').style.display = "none";
        alert('Erro ao ler eventos via API JSONServer');
    });