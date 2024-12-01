var personData = localStorage.getItem("user");
var users;

var usersList = document.getElementById('users-list');
var loadSpinner = document.getElementById('loadSpinner');
var searchInput = document.getElementById('searchInput');
var onlyNewsLettersButton = document.getElementById('onlyNewslettersButton');
var deleteSeachButton = document.getElementById('deleteSeachButton');

if (personData && JSON.parse(personData).userType === "admin") {
    personData = JSON.parse(personData);

    loadUsers();
} else {
    window.location = "/";
}

function loadUsers() {
    usersList.style.display = "none";
    loadSpinner.style.display = "flex";

    fetch("/api/users")
        .then(function (response) { return response.json() })
        .then(function (data) {
            users = data;

            usersList.style.display = "flex";
            loadSpinner.style.display = "none";

            renderUsers(users);
        })
        .catch(error => {
            usersList.style.display = "flex";
            loadSpinner.style.display = "none";
            alert(error);
        });
}

function searchUser() {
    const searchText = searchInput.value.toLowerCase();
    let filteredUsers;

    if(searchText?.length) {
        deleteSeachButton.style.display = "block";

        filteredUsers = users.filter(user => {
            if(user.userType === "admin") return false;

            if(user.name.toLowerCase().indexOf(searchText) !== -1) return true;

            if(user.email.toLowerCase().indexOf(searchText) !== -1) return true;

            if(user.phone.toLowerCase().indexOf(searchText) !== -1) return true;

            if(user.invitationCode.toLowerCase().indexOf(searchText) !== -1) return true;
        });
    } else {
        deleteSeachButton.style.display = "none";

        filteredUsers = users;
    }

    if(onlyNewsLettersButton.checked) filteredUsers = filteredUsers.filter(user => user.subscribedNewsletter);

    renderUsers(filteredUsers);
}

function renderUsers(usersToRender) {
    if(!usersToRender?.length) {
        usersList.innerHTML = "Clientes não encontrados.";
        return;
    }

    usersList.innerHTML = null;

    usersToRender.forEach(user => {
        if (user.userType !== "admin") {
            usersList.innerHTML += `
                <div class="user-container">
                    <h6>Nome: ${user.name}</h6>
                    <p><span>E-mail:</span> ${user.email}</p>
                    <p><span>Telefone:</span> ${user.phone}</p>
                    <p><span>Código de convite:</span> ${user.invitationCode}</p>
                    <p><span>É inscrito na newsletter:</span> ${user.subscribedNewsletter ? "Sim" : "Não"}</p>
                </div>
            `;
        }
    });
}

function deleteSearch() {
    deleteSeachButton.style.display = "none";
    searchInput.value = null;

    let filteredUsers = users;
    if(onlyNewsLettersButton.checked) filteredUsers = filteredUsers.filter(user => user.subscribedNewsletter);

    renderUsers(filteredUsers);
}