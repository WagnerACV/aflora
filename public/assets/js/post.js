if (!window.location.search || !window.location.search.includes("id=")) window.location = "pages/blog.html";

var personData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
var postId = window.location.search.replaceAll("?id=", "");

var loadSpinner = document.getElementById('loadSpinner');
loadSpinner.style.display = "flex";

var postContainer = document.getElementById('post-container');
var postHeader = document.getElementById('post-header');
var subscriptionContainer = document.getElementById('subscription-container');
var postType = document.getElementById('post-type');
var postTitle = document.getElementById('post-title');
var postDescription = document.getElementById('post-description');
var carouselPostImages = document.getElementById('carousel-post-images');
var postAuthor = document.getElementById('post-author');
var postShare = document.getElementById('post-share');
var postContent = document.getElementById('content');
var updateButton = document.getElementById('updateButton');

var subscribeButton;

fetch("/posts/" + postId)
    .then(function (response) { return response.json() })
    .then(function (data) {
        if (data && data.id) {
            postContainer.style.display = "block";
            loadSpinner.style.display = "none";

            postType.innerHTML = data.title;
            postTitle.innerHTML = data.title;
            postDescription.innerHTML = data.creationDate;

            data.images.forEach((image, index) => {
                carouselPostImages.innerHTML += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <img src="${image}" alt="${data.name}-${index}" onerror="this.onerror=null; this.src='../assets/images/post-1.png'">
                    </div>
                `;
            });

            postAuthor.innerHTML = data.author;

            if(personData?.id) {
                if (personData.subscribedNewsletter) subscriptionContainer.innerHTML = "Já inscrito(a) na newsletter";
                else subscriptionContainer.innerHTML = `<button id="subscribe-button" onclick="subscribe()">Inscrever na newsletter</button>`;

                subscribeButton = document.getElementById('subscribe-button');
            } else {
                subscriptionContainer.innerHTML = `<button id="subscribe-button" data-bs-target="#loginModal" data-bs-toggle="modal">Inscrever na newsletter</button>`;

                subscribeButton = document.getElementById('subscribe-button');
            }

            postShare.innerHTML = `
                <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}"><img src="../assets/images/facebook-icon.svg" alt="Facebook"></a>
                <a href="https://twitter.com/intent/tweet?text=Confira%20este%20produto%20incr%C3%ADvel!%20${window.location.href}"><img src="../assets/images/x-icon.svg" alt="X"></a>
                <a href="https://wa.me/?text=Confira%20este%20produto%20incr%C3%ADvel!%20${window.location.href}""><img src="../assets/images/whatsapp-icon.png" alt="X"></a>
            `;

            postContent.innerHTML = data.postText;
        } else {
            alert("Produto não encontrado.");
            window.location = "/pages/blog.html";
        }
    })
    .catch(error => {
        postContainer.style.display = "block";
        loadSpinner.style.display = "none";

        alert(error);
    });

function subscribe() {
    if (personData?.id) {
        subscribeButton.innerHTML = `
        <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
            <span class="sr-only">Loading...</span>
        </div>
    `;

        fetch("/users/" + personData.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "subscribedNewsletter": true }),
        })
            .then(function (response) { return response.json() })
            .then(function (data) {
                delete data.password;

                localStorage.setItem("user", JSON.stringify(data));

                window.location.reload();
            })
            .catch(error => {
                updateButton.innerHTML = "Editar";
                alert('Erro ao editar perfil via API JSONServer.');
            });
    } else {

    }
}