var userImageBase64;
var personData = localStorage.getItem("user");

if (personData && JSON.parse(personData).id) {
    personData = JSON.parse(personData);
} else {
    window.location = "/";
}

var updateButton = document.getElementById('updateButton');

if (personData.photo) {
    const profilePhotoContainer = document.getElementById('user-photo');

    profilePhotoContainer.innerHTML = null;
    profilePhotoContainer.style.setProperty("background-image", `url('${personData.photo}')`);
}

document.getElementById('user-name').innerHTML = personData.name;

document.getElementById('user-email').innerHTML += personData.email;
document.getElementById('user-phone').innerHTML += personData.phone;

document.getElementById('user-invite-code').innerHTML = personData.invitationCode;

function openUpdateModal() {
    document.getElementById('editEmailInput').value = personData.email;
    document.getElementById('editPhoneInput').value = personData.phone;
}

function updateProfile() {
    const formValue = $('#updateProfileForm').serializeArray();

    let profileData = {};

    let hasError = false;

    if (formValue && formValue.length) {
        formValue.every(field => {
            if (field.value === '' || field.value === null || field.value === undefined) {
                if (field.name === "email") alert("O campo \"E-mail\" é obrigatório.");
                if (field.name === "phone") alert("O campo \"Telefone\" é obrigatório.");

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

            profileData[field.name] = field.value;

            return true;
        });

        if (!hasError) {
            updateButton.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            if(userImageBase64) profileData.photo = userImageBase64;

            fetch("/users/" + personData.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
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
        }
    }
}

function copyInviteCode() {
    navigator.clipboard.writeText(personData.invitationCode);

    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
}

function readFile(el) {
    if (!el.files || !el.files[0]) return;

    const FR = new FileReader();
    FR.addEventListener("load", function (evt) {
        userImageBase64 = evt.target.result;
    });

    FR.readAsDataURL(el.files[0]);
}