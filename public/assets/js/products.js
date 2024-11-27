var products;

var productsContent = document.getElementById('products-content');
productsContent.style.display = "none";

var loadSpinner = document.getElementById('loadSpinner');
loadSpinner.style.display = "flex";

var searchInput = document.getElementById('searchInput');
var deleteSeachButton = document.getElementById('deleteSeachButton');

fetch("/api/products")
    .then(function (response) { return response.json() })
    .then(function (data) {
        products = data;

        productsContent.style.display = "flex";
        loadSpinner.style.display = "none";

        renderProducts(products);
    })
    .catch(error => {
        productsContent.style.display = "flex";
        loadSpinner.style.display = "none";

        alert(error);
    });

function searchProducts() {
    const searchText = searchInput.value.toLowerCase();

    if (searchText?.length) {
        deleteSeachButton.style.display = "block";

        let filteredProducts = products.filter(product => {
            if (product.name.toLowerCase().indexOf(searchText) !== -1) return true;

            if (product.price.toLowerCase().indexOf(searchText) !== -1) return true;

            if (product.description.toLowerCase().indexOf(searchText) !== -1) return true;
        });

        renderProducts(filteredProducts);
    } else {
        deleteSeachButton.style.display = "none";
        renderProducts(products);
    }
}

function renderProducts(productsToRender) {
    if (!productsToRender?.length) {
        productsContent.innerHTML = '<h3 class="text-center">Nenhum produto encontrado :(</h3>';
        return;
    }

    productsContent.innerHTML = null;

    productsToRender.forEach(product => {
        productsContent.innerHTML += `
            <a href="/produto?id=${product.id}">
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
}

function deleteSearch() {
    deleteSeachButton.style.display = "none";
    searchInput.value = null;

    renderProducts(products);
}