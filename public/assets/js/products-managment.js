var personData = localStorage.getItem("user");

var products;
var selectedProductID;
var productImageBase64;

var productsContainer = document.getElementById('products-container');
var loadSpinner = document.getElementById('loadSpinner');
var productsListTitle = document.getElementById('products-list-title');
var productsList = document.getElementById('products-list');
var createUpdateProductLabel = document.getElementById('createUpdateProductLabel');
var createUpdateProductButton = document.getElementById('createUpdateProductButton');
var productNameInput = document.getElementById('productNameInput');
var productDescriptionInput = document.getElementById('productDescriptionInput');
var productPriceInput = document.getElementById('productPriceInput');
var productImageInput = document.getElementById('productImageInput');
var excluirEventoBotao = document.getElementById('excluirEventoBotao');

if (personData && JSON.parse(personData).userType === "admin") {
    personData = JSON.parse(personData);

    loadProducts();
} else {
    window.location = "/";
}

function loadProducts() {
    productsContainer.style.display = "none";
    loadSpinner.style.display = "flex";

    fetch("/products")
        .then(function (response) { return response.json() })
        .then(function (data) {
            products = data;

            productsContainer.style.display = "block";
            loadSpinner.style.display = "none";

            productsListTitle.innerHTML = `Produtos (${products.length})`;

            products.forEach(product => {
                productsList.innerHTML += `
                    <div class="product">
                        <a href="/pages/product.html?id=${product.id}" style="background-image: url('${product.images[0]}');"> </a>

                        <div>
                            <h5>${product.name}</h5>
                            <h4>R$ ${product.price}</h4>
                            <div class="buttonsContainer">
                                <button class="edit-button" onclick="openEditProductModal('${product.id}')" data-bs-target="#createUpdateProductModal" data-bs-toggle="modal">
                                    Editar
                                </button>

                                <button class="delete-button" onclick="${selectedProductID = product.id})" data-bs-target="#deleteProductModal" data-bs-toggle="modal">
                                    <i class="fa fa-trash" style="color: white;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            productsContainer.style.display = "block";
            loadSpinner.style.display = "none";
            alert(error);
        });
}

function openCreateProductModal() {
    selectedProductID = null;

    createUpdateProductLabel.innerHTML = "Cadastrar Produto";
    createUpdateProductButton.innerHTML = "Cadastrar";
    productNameInput.value = "";
    productDescriptionInput.value = "";
    productPriceInput.value = "";
    productImageInput.value = null;
}

function openEditProductModal(id) {
    selectedProductID = id;
    let productToEdit = products.find(currentProduct => String(currentProduct.id) === String(selectedProductID));

    createUpdateProductLabel.innerHTML = "Editar Produto";
    createUpdateProductButton.innerHTML = "Editar";
    productNameInput.value = productToEdit.name;
    productDescriptionInput.value = productToEdit.description;
    productPriceInput.value = productToEdit.price;
    productImageInput.value = null;
}

function createOrUpdateProduct() {
    const formValue = $('#createUpdateProductForm').serializeArray();
    let productData = {};
    let hasError = false;
    let editProduct = selectedProductID
        ? products.find(currentProduct => String(currentProduct.id) === String(selectedProductID))
        : null;

    if (formValue && formValue.length) {
        formValue.every(field => {
            if (field.value === '' || field.value === null || field.value === undefined) {
                if (field.name === "name") alert("O campo \"Nome do produto\" é obrigatório.");
                if (field.name === "description") alert("O campo \"Descrição do produto\" é obrigatório.");
                if (field.name === "price") alert("O campo \"Preço do produto\" é obrigatório.");

                hasError = true;
                return false;
            }

            productData[field.name] = field.value;

            return true;
        });

        if ((!editProduct || !editProduct.images || !editProduct.images.length) && !productImageBase64) {
            alert("A imagem do produto é obrigatória.");
            hasError = true;
        }

        if (!hasError) {
            createUpdateProductButton.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            // Atualiza produto
            if (editProduct && editProduct.id) {
                productData.id = editProduct.id;
                productData.images = productImageBase64 ? [productImageBase64] : editProduct.images;

                fetch("/products/" + productData.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        window.location.reload();
                    })
                    .catch(error => {
                        createUpdateProductButton.innerHTML = "Editar produto";
                        alert('Erro ao editar produto via API JSONServer.');
                    });

            } else {
                productData.id = generateUUID();
                productData.images = [productImageBase64];

                // Cria novo produto
                fetch("/products", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        window.location.reload();
                    })
                    .catch(error => {
                        alert('Erro ao criar produto via API JSONServer.');
                    });
            }
        }
    }
}

function deleteProduct() {
    if (selectedProductID) {
        fetch("/products/" + selectedProductID, { method: 'DELETE' })
            .then(function (response) { return response.json() })
            .then(function (data) {
                window.location.reload();
            })
            .catch(error => {
                excluirEventoBotao.innerHTML = "Excluir produto";
                alert('Erro ao excluir produto via API JSONServer');
            });
    } else alert("Produto não encontrado.")
}

function readFile(el) {
    if (!el.files || !el.files[0]) return;

    const FR = new FileReader();
    FR.addEventListener("load", function (evt) {
        productImageBase64 = evt.target.result;
    });

    FR.readAsDataURL(el.files[0]);
}