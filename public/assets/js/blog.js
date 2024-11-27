var posts;
var mainPost;

var postsContainer = document.getElementById('postsContainer');

var loadSpinner = document.getElementById('loadSpinner');
loadSpinner.style.display = "flex";

var postsContent = document.getElementById('posts-content');
var mainPostType = document.getElementById('main-post-type');
var mainPostTitle = document.getElementById('main-post-title');
var mainPostDescription = document.getElementById('main-post-description');
var mainPostShare = document.getElementById('main-post-share');
var mainPostImageContainer = document.getElementById('main-post-image-container');

fetch("/api/posts")
    .then(function (response) { return response.json() })
    .then(function (data) {
        posts = data;

        postsContainer.style.display = "block";
        loadSpinner.style.display = "none";

        if (posts?.length) {
            mainPost = posts.find(post => post.isMainPost);
            if (!mainPost?.id) mainPost = data[0];

            mainPostType.innerHTML = mainPost.title;
            mainPostTitle.innerHTML = mainPost.title;
            mainPostDescription.innerHTML = mainPost.author + " - " + mainPost.creationDate;

            mainPostShare.innerHTML = `
                <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}"><img src="../assets/images/facebook-icon.svg" alt="Facebook"></a>
                <a href="https://twitter.com/intent/tweet?text=Confira%20este%20produto%20incr%C3%ADvel!%20${window.location.href}"><img src="../assets/images/x-icon.svg" alt="X"></a>
                <a href="https://wa.me/?text=Confira%20este%20produto%20incr%C3%ADvel!%20${window.location.href}""><img src="../assets/images/whatsapp-icon.png" alt="X"></a>
            `;

            mainPostImageContainer.innerHTML = `
                <a href="/post?id=${mainPost.id}"> <img id="main-post-image" src="${mainPost.images[0]}" alt="Foto do post principal"> </a>
            `;
        }

        renderPosts(posts);
    })
    .catch(error => {
        postsContainer.style.display = "block";
        loadSpinner.style.display = "none";

        alert('Erro ao ler eventos via API JSONServer');
    });

function searchPosts() {
    const searchText = searchInput.value.toLowerCase();

    if (searchText?.length) {
        deleteSeachButton.style.display = "block";

        let filteredPosts = posts.filter(post => {
            if (post.title.toLowerCase().indexOf(searchText) !== -1) return true;

            if (post.type.toLowerCase().indexOf(searchText) !== -1) return true;

            if (post.postText.toLowerCase().indexOf(searchText) !== -1) return true;

            if (post.creationDate.toLowerCase().indexOf(searchText) !== -1) return true;
        });

        renderPosts(filteredPosts);
    } else {
        deleteSeachButton.style.display = "none";
        renderPosts(posts);
    }
}

function renderPosts(postsToRender) {
    console.log(postsToRender)
    if (!postsToRender?.length) {
        postsContent.innerHTML = '<h3 class="text-center">Nenhum post encontrado :(</h3>';
        return;
    }

    postsContent.innerHTML = null;

    postsToRender.forEach(post => {
        postsContent.innerHTML += `
                <a href="/post?id=${post.id}">
                    <div class="post">
                        <div class="image-container" style="background-image: url('${post.images[0]}'); width: 100%;"></div>

                        <div class="p-2">
                            <h5>${post.type}</h5>
                            <h4>${post.title}</h4>
                            <h6>${post.author} - ${post.creationDate}</h6>
                        </div>
                    </div>
                </a>
            `;
    });
}

function deleteSearch() {
    deleteSeachButton.style.display = "none";
    searchInput.value = null;

    renderPosts(posts);
}