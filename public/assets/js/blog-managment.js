var postImageBase64;
var personData = localStorage.getItem("user");
var posts;

var selectedPostID;

if (personData && JSON.parse(personData).userType === "admin") {
    personData = JSON.parse(personData);

    loadPosts();
} else {
    window.location = "/";
}

function loadPosts() {
    const postsList = document.getElementById('posts-list');
    const loadSpinner = document.getElementById('loadSpinner');

    postsList.style.display = "none";
    loadSpinner.style.display = "flex";

    fetch("/posts")
        .then(function (response) { return response.json() })
        .then(function (data) {
            posts = data;

            postsList.style.display = "flex";
            loadSpinner.style.display = "none";

            document.getElementById('posts-list-title').innerHTML = `Posts (${posts.length})`;

            posts.forEach(post => {
                postsList.innerHTML += `
                    <div class="post">
                        <a href="/pages/post.html?id=${post.id}" style="background-image: url('${post.images[0]}');"> </a>

                        <div>
                            <h5>${post.title}</h5>
                            <h4>R$ ${post.postText}</h4>
                            <div class="buttonsContainer">
                                <button class="edit-button" onclick="openEditPostModal('${post.id}')" data-bs-target="#createUpdatePostModal" data-bs-toggle="modal">
                                    Editar
                                </button>

                                <button class="delete-button" onclick="${selectedPostID = post.id})" data-bs-target="#deletePostModal" data-bs-toggle="modal">
                                    <i class="fa fa-trash" style="color: white;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            postsList.style.display = "flex";
            loadSpinner.style.display = "none";
            alert(error);
        });
}

function openCreatePostModal() {
    selectedPostID = null;

    document.getElementById('createUpdatePostLabel').innerHTML = "Cadastrar post";
    document.getElementById('createUpdatePostButton').innerHTML = "Cadastrar";

    document.getElementById('postTitleInput').value = "";
    document.getElementById('postTypeInput').value = "";
    document.getElementById('postTextInput').value = "";
    document.getElementById('postImageInput').value = null;
}

function openEditPostModal(id) {
    selectedPostID = id;
    let postToEdit = posts.find(currentPosts => String(currentPosts.id) === String(selectedPostID));

    document.getElementById('createUpdatePostLabel').innerHTML = "Editar post";
    document.getElementById('createUpdatePostButton').innerHTML = "Editar";

    document.getElementById('postTitleInput').value = postToEdit.title;
    document.getElementById('postTypeInput').value = postToEdit.type;
    document.getElementById('postTextInput').value = postToEdit.postText;
    document.getElementById('postImageInput').value = null;
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
                if(field.name === "title") alert("O campo \"Título do post\" é obrigatório.");
                if(field.name === "type") alert("O campo \"Tipo do post\" é obrigatório.");
                if(field.name === "postText") alert("O campo \"Texto do post\" é obrigatório.");

                hasError = true;
                return false;
            }

            postData[field.name] = field.value;

            return true;
        });

        if ((!editPost || !editPost.images || !editPost.images.length) && !postImageBase64) {
            alert("A imagem do post é obrigatória.");
            hasError = true;
        }

        if (!hasError) {
            document.getElementById('createUpdatePostButton').innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            // Atualiza post
            if (editPost && editPost.id) {
                postData.id = editPost.id;
                postData.images = postImageBase64 ? [postImageBase64] : editPost.images;

                fetch("/posts/" + postData.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        window.location.reload();
                    })
                    .catch(error => {
                        document.getElementById('createUpdatepostButton').innerHTML = "Editar post";
                        alert('Erro ao editar post via API JSONServer.');
                    });

            } else {
                postData.id = generateUUID();
                postData.images = [postImageBase64];

                // Cria novo post
                fetch("/posts", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        window.location.reload();
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
        fetch("/posts/" + selectedPostID, { method: 'DELETE' })
            .then(function (response) { return response.json() })
            .then(function (data) {
                window.location.reload();
            })
            .catch(error => {
                document.getElementById('excluirEventoBotao').innerHTML = "Excluir post";
                alert('Erro ao excluir post via API JSONServer');
            });
    } else alert("Post não encontrado.")
}

function readFile(el) {
    if (!el.files || !el.files[0]) return;

    const FR = new FileReader();
    FR.addEventListener("load", function (evt) {
        postImageBase64 = evt.target.result;
    });

    FR.readAsDataURL(el.files[0]);
}