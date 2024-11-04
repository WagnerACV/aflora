function signIn() {
    const form = document.getElementById("sign-in-form").getElementsByTagName("input");
    hasError = false;

    if (form && form.length) {
        for (let i = 0; i < form.length; i++) {
            if (!form[i].value || !form[i].value.replaceAll(" ", "")) {
                alert("Campo " + form[i].name + " é obrigatório.");
                hasError = true;
            }
        }

        if (!hasError) {
            document.getElementById('signInButton').innerHTML = `<div class="loader"></div>`;

            fetch("/users")
                .then(function (response) { return response.json() })
                .then(function (data) {
                    let loggedUser = data.find(person => person.email === form[0].value && person.password === form[1].value);

                    if (loggedUser && loggedUser.id) {
                        delete loggedUser.password;
                        delete loggedUser.subscribedNewsletter;
                        delete loggedUser.invitationCode;

                        localStorage.setItem("user", JSON.stringify(loggedUser));
                        
                        window.location.reload();
                    } else {
                        document.getElementById('signInButton').innerHTML = "Entrar";
                        alert("Usuário não encontrado!");
                    }
                })
                .catch(error => {
                    document.getElementById('signInButton').innerHTML = "Entrar";
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
        const userType = formValue.find(el => el.name === 'tipoUsuario');

        if (!userType || !userType.value) {
            alert("O campo \"Eu sou\" é obrigatório.");
            return;
        }

        formValue.every(field => {
            if (field.value === '') {
                if (field.name !== 'cnpj' || (field.name === 'cnpj' && userType.value === 'promotor')) {
                    alert("O campo \"" + field.name.charAt(0).toUpperCase() + field.name.slice(1) + "\" é obrigatório.");
                    hasError = true;
                    return false;
                }
            }

            if (field.name === "email" && !(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i).test(field.value)) {
                alert("Favor inserir um e-mail válido.");
                hasError = true;
                return false;
            } else if (userType.value === 'promotor' && field.name === "cnpj" && !validarCNPJ(field.value)) {
                alert("Favor inserir um CNPJ válido.");
                hasError = true;
                return false;
            } else if (field.name === "interesses") {
                if (userData[field.name] && userData[field.name].length) {
                    userData[field.name].push(field.value);
                } else {
                    userData[field.name] = [field.value];
                }
                hasInterests = true;
            } else if (field.name !== "Repetir senha") {
                userData[field.name] = field.value;
            }

            return true;
        });

        if (!hasError && !hasInterests) {
            if (userType.value === 'promotor') alert("O campo \"Tipos de evento\" é obrigatório.");
            else alert("O campo \"Interesses\" é obrigatório.");
        }

        if (!hasError && hasInterests && userData["password"] !== userData["repetirSenha"]) {
            alert("As senhas devem ser iguais.");
            hasError = true;
        }

        if (!hasError && hasInterests && userData) {
            document.getElementById('signUpButton').innerHTML = `<div class="loader"></div>`;

            fetch("/pessoas?login=" + userData.login)
                .then(function (response) { return response.json() })
                .then(function (data) {
                    if (data && data.length) {
                        alert("Já existe um usuário cadastrado com esse login.");
                    } else if (userType.value === 'promotor') {
                        fetch("/checkCnpj?cnpj=" + userData.cnpj.replace(/[^\d]/g, ""))
                            .then(function (response) { return response.json() })
                            .then(function (data) {
                                if (data.situacao === "ATIVA" && data.atividade_principal) {
                                    createUser(userData);
                                } else {
                                    document.getElementById('signUpButton').innerHTML = "Cadastrar";
                                    alert('CNPJ inválido.');
                                }
                            })
                            .catch(error => {
                                document.getElementById('signUpButton').innerHTML = "Cadastrar";
                                alert('Erro ao criar procurar por CNPJ.');
                            });
                    } else {
                        createUser(userData);
                    }
                })
                .catch(error => {
                    document.getElementById('signUpButton').innerHTML = "Cadastrar";
                    alert('Erro ao ler eventos via API JSONServer');
                });
        }
    }
}

function createUser(userData) {
    userData.id = generateUUID();
    userData.login = userData.email;
    userData.foto = "";
    userData.eventosFavoritos = [];
    userData.eventosCriados = [];

    delete userData.repetirSenha;

    // Cria o novo usuário
    fetch("/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(function (response) { return response.json() })
        .then(function (data) {
            delete userData.login;
            delete userData.password;

            localStorage.setItem("user", JSON.stringify(userData));

            window.location = "/index.html";
        })
        .catch(error => {
            document.getElementById('signInButton').innerHTML = "Cadastrar";
            alert('Erro ao criar usuário via API JSONServer.');
        });
}