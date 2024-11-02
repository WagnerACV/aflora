var productImageBase64;
var personData = localStorage.getItem("user");
var products;

if (personData && JSON.parse(personData).userType === "admin") {
    personData = JSON.parse(personData);
    
    loadProducts();
} else {
    window.location = "/";
}

function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    const loadSpinner = document.getElementById('loadSpinner');

    productsContainer.style.display = "none";
    loadSpinner.style.display = "flex";

    fetch("/products")
        .then(function (response) { return response.json() })
        .then(function (data) {
            products = data;

            productsContainer.style.display = "block";
            loadSpinner.style.display = "none";

            document.getElementById('products-list-title').innerHTML = `Produtos (${products.length})`;

            const productsList = document.getElementById('products-list');
            products.forEach(product => {
                productsList.innerHTML += `
                    <div class="product">
                        <img src="data:image/png;base64, ${product.images[0]}" alt="${product.name}" onerror="this.onerror=null; this.src='../assets/images/product-1.png'">
                        <h5>${product.name}</h5>
                        <h4>R$ ${product.price}</h4>
                        <div class="buttonsContainer">
                            <button class="edit-button" onclick="openCreateEditModal(${product.id})">
                                Editar
                            </button>

                            <button class="delete-button" onclick="openDeleteModal(${product.id})">
                                <i class="fa fa-trash" style="color: white;"></i>
                            </button>
                        </div>
                    </div>
                `; 
            });

            productsContainer.innerHTML += "</div>";
        })
        .catch(error => {
            productsContainer.style.display = "block";
            loadSpinner.style.display = "none";
            alert('Erro ao ler eventos via API JSONServer');
        });
}

function openCreateEditModal(id) {

}

function readFile(el) {
    if (!el.files || !el.files[0]) return;

    const FR = new FileReader();
    FR.addEventListener("load", function (evt) {
        eventImageBase64 = evt.target.result;
    });

    FR.readAsDataURL(el.files[0]);
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}