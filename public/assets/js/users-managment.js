var personData = localStorage.getItem("user");
var users;

if (personData && JSON.parse(personData).userType === "admin") {
    personData = JSON.parse(personData);

    loadUsers();
} else {
    window.location = "/";
}

function loadUsers() {
    const usersList = document.getElementById('users-list');
    const loadSpinner = document.getElementById('loadSpinner');

    usersList.style.display = "none";
    loadSpinner.style.display = "flex";

    fetch("/users")
        .then(function (response) { return response.json() })
        .then(function (data) {
            users = data;

            usersList.style.display = "flex";
            loadSpinner.style.display = "none";

            users.forEach(user => {
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
        })
        .catch(error => {
            usersList.style.display = "flex";
            loadSpinner.style.display = "none";
            alert(error);
        });
}