if (!window.location.search || !window.location.search.includes("id=")) window.location = "pages/blog.html";

var postId = window.location.search.replaceAll("?id=", "");

const postHeader = document.getElementById('post-header');
postHeader.style.display = "none";

document.getElementById('loadSpinner').style.display = "flex";

fetch("/posts/" + postId)
    .then(function (response) { return response.json() })
    .then(function (data) {
        if (data && data.id) {
            postHeader.style.display = "flex";
            document.getElementById('loadSpinner').style.display = "none";

            document.getElementById('post-type').innerHTML = data.title;
            document.getElementById('post-title').innerHTML = data.title;
            document.getElementById('post-description').innerHTML = data.creationDate;

            data.images.forEach((image, index) => {
                document.getElementById('carousel-post-images').innerHTML += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <img src="${image}" alt="${data.name}-${index}" onerror="this.onerror=null; this.src='../assets/images/post-1.png'">
                    </div>
                `;
            });

            document.getElementById('post-author').innerHTML = data.author;

            document.getElementById('post-share').innerHTML = `
                <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}"><img src="../assets/images/facebook-icon.svg" alt="Facebook"></a>
                <a href="https://twitter.com/intent/tweet?url=${window.location.href}""><img src="../assets/images/x-icon.svg" alt="X"></a>
                <a href="https://wa.me/?text=Confira%20este%20site%20incr%C3%ADvel!%20${window.location.href}""><img src="../assets/images/whatsapp-icon.png" alt="X"></a>
            `;

            document.getElementById('content').innerHTML = data.postText;
        } else {
            alert("Produto não encontrado.");
            window.location = "/pages/blog.html";
        }
    })
    .catch(error => {
        postHeader.style.display = "flex";
        document.getElementById('loadSpinner').style.display = "none";
        alert(error);
    });

function subscribe() {
    
}