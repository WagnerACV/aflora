const productsContent = document.getElementById('products-content');

productsContent.style.display = "none";
document.getElementById('loadSpinner').style.display = "flex";

fetch("/products")
    .then(function (response) { return response.json() })
    .then(function (data) {
        productsContent.style.display = "flex";
        document.getElementById('loadSpinner').style.display = "none";

        if(data?.length) {
            data.forEach(product => {
                productsContent.innerHTML += `
                    <a href="/pages/product.html?id=${product.id}">
                        <div class="product">
                            <div class="image-container" style="background-image: url('${product.images[0]}');"></div>

                            <div>
                                <h5>${product.name}</h5>
                                <h4>R$ ${product.price}</h4>
                            </div>
                        </div>
                    </a>
                `;
            });
        } else {
            productsContent.innerHTML = '<h3 class="text-center">Por enquanto não temos produtos cadastrados.</h3>'
        }
    })
    .catch(error => {
        document.getElementById('events-list-title').style.display = "flex";
        document.getElementById('loadSpinner').style.display = "none";
        alert('Erro ao ler eventos via API JSONServer');
    });