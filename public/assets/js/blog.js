const postsContent = document.getElementById('posts-content');

postsContent.style.display = "none";
document.getElementById('loadSpinner').style.display = "flex";

fetch("/posts")
    .then(function (response) { return response.json() })
    .then(function (data) {
        postsContent.style.display = "flex";
        document.getElementById('loadSpinner').style.display = "none";

        if(data?.length) {
            let mainPost;

            data.forEach(post => {
                if(post.isMainPost) mainPost = post;

                postsContent.innerHTML += `
                    <a href="/pages/post.html?id=${post.id}">
                        <div class="post">
                            <div class="image-container" style="background-image: url('${post.images[0]}');"></div>

                            <div>
                                <h5>${post.type}</h5>
                                <h4>${post.title}</h4>
                                <h6>${post.author} - ${post.creationDate}</h6>
                            </div>
                        </div>
                    </a>
                `;
            });

            if (!mainPost?.id) mainPost = data[0];
            document.getElementById('main-post-type').innerHTML = mainPost.title;
            document.getElementById('main-post-title').innerHTML = mainPost.title;
            document.getElementById('main-post-description').innerHTML = mainPost.author + " - " + mainPost.creationDate;

            document.getElementById('main-post-share').innerHTML = `
                <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}"><img src="../assets/images/facebook-icon.svg" alt="Facebook"></a>
                <a href="https://twitter.com/intent/tweet?url=${window.location.href}""><img src="../assets/images/x-icon.svg" alt="X"></a>
                <a href="https://wa.me/?text=Confira%20este%20site%20incr%C3%ADvel!%20${window.location.href}""><img src="../assets/images/whatsapp-icon.png" alt="X"></a>
            `;

            document.getElementById('main-post-image-container').innerHTML = `
                <a href="/pages/post.html?id=${mainPost.id}"> <img id="main-post-image" src="${mainPost.images[0]}" alt="Foto do post principal"> </a>
            `;

        } else {
            postsContent.innerHTML = '<h3 class="text-center">Por enquanto não temos produtos cadastrados.</h3>'
        }
    })
    .catch(error => {
        document.getElementById('events-list-title').style.display = "flex";
        document.getElementById('loadSpinner').style.display = "none";
        alert('Erro ao ler eventos via API JSONServer');
    });