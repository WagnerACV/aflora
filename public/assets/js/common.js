var personData;
var eventsList;

var loggedContent = document.getElementById('logged-content');
var signInForm = document.getElementById("sign-in-form");
var signInButton = document.getElementById('signInButton');

if (localStorage.getItem("user")) personData = JSON.parse(localStorage.getItem("user"));

loadUserInfo();

function loadUserInfo() {
    if (personData && personData.id) {
        if (personData.userType === "admin") {
            loggedContent.innerHTML += `
                <div class="dropdown manager-dropdown">
                    <a
                        class="btn btn-secondary btn-sm dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Gerenciar
                    </a>

                    <ul class="dropdown-menu">
                        <li> <a class="dropdown-item" href="/gerenciar-produtos">Produtos</a> </li>
                        <li> <a class="dropdown-item" href="/gerenciar-blog">Blog</a></li>
                        <li> <a class="dropdown-item" href="/gerenciar-usuarios">Usuários</a> </li>
                    </ul>
                </div>
            `;
        }

        const userPhoto = personData.photo
            ? `<div data-bs-toggle="dropdown" class="user-dropdown" style="background-image: url('${personData.photo}');"></div>`
            : `<div data-bs-toggle="dropdown" class="user-dropdown">${personData.name.slice(0, 1)}</div>`;

        loggedContent.innerHTML += `
            <div class="dropdown">
                ${userPhoto}
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="/perfil">Perfil</a></li>
                    <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
                </ul>
            </div>
        `;
    } else {
        loggedContent.innerHTML += `<button class="p-0" data-bs-target="#loginModal" data-bs-toggle="modal"> <i class="fa fa-lg fa-user"></i> </button>`;
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}

function signIn() {
    const form = signInForm.getElementsByTagName("input");
    hasError = false;

    if (form && form.length) {
        for (let i = 0; i < form.length; i++) {
            if (!form[i].value || !form[i].value.replaceAll(" ", "")) {
                alert("Campo " + form[i].name + " é obrigatório.");
                hasError = true;
            }
        }

        if (!hasError) {
            signInButton.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            fetch("/api/users")
                .then(function (response) { return response.json() })
                .then(function (data) {
                    let loggedUser = data.find(person => person.email === form[0].value && person.password === form[1].value);

                    if (loggedUser && loggedUser.id) {
                        delete loggedUser.password;

                        localStorage.setItem("user", JSON.stringify(loggedUser));

                        window.location.reload();
                    } else {
                        signInButton.innerHTML = "Entrar";
                        alert("Usuário não encontrado!");
                    }
                })
                .catch(error => {
                    signInButton.innerHTML = "Entrar";
                    alert('Erro ao ler eventos via API JSONServer');
                });
        }
    }
}

function signUp() {
    const formValue = $('#sign-up-form').serializeArray();
    let userData = {};

    let hasError = false;
    let hasInterests = false;

    if (formValue && formValue.length) {
        formValue.every(field => {
            if (field.value === '') {
                let fieldNamePtBr = "";
                switch (field.name) {
                    case 'name': fieldNamePtBr = "Nome completo"; break;
                    case 'email': fieldNamePtBr = "E-mail"; break;
                    case 'phone': fieldNamePtBr = "Telefone"; break;
                    case 'password': fieldNamePtBr = "Senha"; break;
                    case 'repeatPassword': fieldNamePtBr = "Repetir senha"; break;
                }

                alert("O campo \"" + fieldNamePtBr + "\" é obrigatório.");
                hasError = true;
                return false;
            }

            if (field.name === "email" && !(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i).test(field.value)) {
                alert("Favor inserir um e-mail válido.");
                hasError = true;
                return false;
            } else if (field.name === "phone" && !(/\(\d{2}\) \d{5}-\d{4}/i).test(field.value)) {
                alert("Favor inserir um telefone no modelo (99) 99999-9999");
                hasError = true;
                return false;
            }

            userData[field.name] = field.value;

            return true;
        });

        if (!hasError && userData.password !== userData.repeatPassword) {
            alert("As senhas devem ser iguais.");
            hasError = true;
        }

        if (!hasError && userData) {
            signInButton.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;;

            fetch("/api/users?email=" + userData.email)
                .then(function (response) { return response.json() })
                .then(function (data) {
                    if (data && data.length) {
                        alert("Já existe um usuário cadastrado com esse e-mail.");
                        signInButton.innerHTML = "Cadastrar";
                    } else {
                        createUser(userData);
                    }
                })
                .catch(error => {
                    signInButton.innerHTML = "Cadastrar";
                    alert('Erro ao ler eventos via API JSONServer');
                });
        }
    }
}

function createUser(userData) {
    userData.id = generateUUID();
    userData.photo = "";
    userData.userType = "client";
    userData.invitationCode = userData.name.split(" ")[0] + "-" + userData.id.slice(-3);
    subscribedNewsletter = false;

    delete userData.repeatPassword;

    // Cria o novo usuário
    fetch("/api/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(function (response) { return response.json() })
        .then(function (data) {
            delete userData.password;

            localStorage.setItem("user", JSON.stringify(userData));

            window.location.reload();
        })
        .catch(error => {
            signInButton.innerHTML = "Cadastrar";
            alert('Erro ao criar usuário via API JSONServer.');
        });
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

function phoneMask(event) {
    const input = event.target;
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (valor.length > 11) valor = valor.slice(0, 11);

    // Formata o número de acordo com o tamanho
    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        valor = valor.replace(/(\d*)/, '($1');
    }

    input.value = valor;
}