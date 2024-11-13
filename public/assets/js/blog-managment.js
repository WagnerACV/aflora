var personData = localStorage.getItem("user");

var posts;
var selectedPostID;
var postImagesBase64;

var postsList = document.getElementById('posts-list');
var loadSpinner = document.getElementById('loadSpinner');
var postListTitle = document.getElementById('posts-list-title');
var createUpdatePostLabel = document.getElementById('createUpdatePostLabel');
var createUpdatePostButton = document.getElementById('createUpdatePostButton');
var postTitleInput = document.getElementById('postTitleInput');
var postTypeInput = document.getElementById('postTypeInput');
var postTextInput = document.getElementById('postTextInput');
var postImageInput = document.getElementById('postImageInput');
var isMainPostEl = document.getElementById('isMainPost');
var isNotMainPostEl = document.getElementById('isNotMainPost');
var deleteButton = document.getElementById('deleteButton');
var createUpdatepostButton = document.getElementById('createUpdatepostButton');

if (personData && JSON.parse(personData).userType === "admin") {
    personData = JSON.parse(personData);

    loadPosts();
} else {
    window.location = "/";
}

function loadPosts() {
    postsList.style.display = "none";
    loadSpinner.style.display = "flex";

    fetch("/api/posts")
        .then(function (response) { return response.json() })
        .then(function (data) {
            posts = data;

            postsList.style.display = "flex";
            loadSpinner.style.display = "none";

            postListTitle.innerHTML = `Posts (${posts.length})`;

            renderPosts(posts);
        })
        .catch(error => {
            postsList.style.display = "flex";
            loadSpinner.style.display = "none";
            alert(error);
        });
}

function openCreatePostModal() {
    selectedPostID = null;

    createUpdatePostLabel.innerHTML = "Cadastrar post";
    createUpdatePostButton.innerHTML = "Cadastrar";
    postTitleInput.value = "";
    postTypeInput.value = "";
    postTextInput.value = "";
    postImageInput.value = null;
    isMainPostEl.checked = false;
    isNotMainPostEl.checked = false;
}

function openEditPostModal(id) {
    selectedPostID = id;
    let postToEdit = posts.find(currentPosts => String(currentPosts.id) === String(selectedPostID));

    createUpdatePostLabel.innerHTML = "Editar post";
    createUpdatePostButton.innerHTML = "Editar";
    postTitleInput.value = postToEdit.title;
    postTypeInput.value = postToEdit.type;
    postTextInput.value = postToEdit.postText;
    postImageInput.value = null;

    if (postToEdit.isMainPost) isMainPostEl.checked = true;
    else isNotMainPostEl.checked = true;
}

function openDeletePostModal(id) {
    selectedPostID = id;
}

function createOrUpdatePost() {
    const formValue = $('#createUpdatePostForm').serializeArray();
    let postData = {};
    let hasError = false;
    let editPost = selectedPostID
        ? posts.find(currentPost => String(currentPost.id) === String(selectedPostID))
        : null;

    if (formValue && formValue.length) {
        formValue.every(field => {
            if (field.value === '' || field.value === null || field.value === undefined) {
                if (field.name === "title") alert("O campo \"Título do post\" é obrigatório.");
                if (field.name === "type") alert("O campo \"Tipo do post\" é obrigatório.");
                if (field.name === "postText") alert("O campo \"Texto do post\" é obrigatório.");

                hasError = true;
                return false;
            }

            postData[field.name] = field.value;

            return true;
        });

        if ((!editPost || !editPost.images || !editPost.images.length) && !postImagesBase64?.length) {
            alert("A imagem do post é obrigatória.");
            hasError = true;
        }

        let isMainPost = isMainPostEl.checked;
        let isNotMainPost = isNotMainPostEl.checked;

        if (!isMainPost && !isNotMainPost) {
            alert("É obrigatório marcar uma das opções do campo \"Definir este post como principal?\"");
            hasError = true;
        } else {
            postData.isMainPost = isMainPost;
        }

        if (!hasError) {
            createUpdatePostButton.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            let currentMainPost = posts.find(post => post.isMainPost);

            // Atualiza post
            if (editPost && editPost.id) {
                postData.id = editPost.id;
                postData.images = postImagesBase64?.length ? postImagesBase64 : editPost.images;
                postData.creationDate = editPost.creationDate;
                postData.author = editPost.author;

                fetch("/api/posts/" + postData.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        if (isMainPost && currentMainPost?.id) {
                            fetch("/api/posts/" + currentMainPost.id, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ isMainPost: false }),
                            })
                                .then(function (response) { return response.json() })
                                .then(function (data) {
                                    window.location.reload();
                                })
                                .catch(error => {
                                    createUpdatepostButton.innerHTML = "Editar post";
                                    alert('Erro ao editar post via API JSONServer.');
                                });
                        } else {
                            window.location.reload();
                        }
                    })
                    .catch(error => {
                        createUpdatepostButton.innerHTML = "Editar post";
                        alert('Erro ao editar post via API JSONServer.');
                    });

            } else {
                postData.id = generateUUID();
                postData.images = postImagesBase64;
                postData.creationDate = new Date().toLocaleDateString();
                postData.author = personData.name;

                // Cria novo post
                fetch("/api/posts", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        if (isMainPost && currentMainPost?.id) {
                            fetch("/api/posts/" + currentMainPost.id, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ isMainPost: false }),
                            })
                                .then(function (response) { return response.json() })
                                .then(function (data) {
                                    window.location.reload();
                                })
                                .catch(error => {
                                    createUpdatepostButton.innerHTML = "Editar post";
                                    alert('Erro ao editar post via API JSONServer.');
                                });
                        } else {
                            window.location.reload();
                        }
                    })
                    .catch(error => {
                        alert('Erro ao criar post via API JSONServer.');
                    });
            }
        }
    }
}

function deletePost() {
    if (selectedPostID) {
        deleteButton.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

        fetch("/api/posts/" + selectedPostID, { method: 'DELETE' })
            .then(function (response) { return response.json() })
            .then(function (data) {
                window.location.reload();
            })
            .catch(error => {
                deleteButton.innerHTML = "Excluir post";
                alert('Erro ao excluir post via API JSONServer');
            });
    } else alert("Post não encontrado.")
}

function readFile(el) {
    if (!el?.files?.length) return;

    postImagesBase64 = [];

    const files = el?.files;

    // Função para converter cada arquivo
    Array.from(files).forEach(file => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target.result;
            postImagesBase64.push(base64String);
        };

        reader.readAsDataURL(file);
    });
}

function searchPosts() {
    const searchText = searchInput.value;

    if (searchText?.length) {
        deleteSeachButton.style.display = "block";

        let filteredPosts = posts.filter(post => {
            if (post.title.indexOf(searchText) !== -1) return true;

            if (post.type.indexOf(searchText) !== -1) return true;

            if (post.postText.indexOf(searchText) !== -1) return true;

            if (post.creationDate.indexOf(searchText) !== -1) return true;
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
        postsList.innerHTML = '<h3 class="text-center">Nenhum post encontrado :(</h3>';
        return;
    }

    postsList.innerHTML = null;

    postsToRender.forEach(post => {
        postsList.innerHTML += `
            <div class="post">
                <a href="/post?id=${post.id}" style="background-image: url('${post.images[0]}');"> </a>

                <div>
                    <h5>${post.type}</h5>
                    <h4>${post.title}</h4>
                    <h6>${post.author} - ${post.creationDate}</h6>
                    <div class="buttonsContainer">
                        <button class="edit-button" onclick="openEditPostModal('${post.id}')" data-bs-target="#createUpdatePostModal" data-bs-toggle="modal">
                            Editar
                        </button>

                        <button class="delete-button" onclick="openDeletePostModal('${post.id}')" data-bs-target="#deletePostModal" data-bs-toggle="modal">
                            <i class="fa fa-trash" style="color: white;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function deleteSearch() {
    deleteSeachButton.style.display = "none";
    searchInput.value = null;

    renderPosts(posts);
}