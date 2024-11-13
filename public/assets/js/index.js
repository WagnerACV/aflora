var personData = localStorage.getItem("user");

let invitationSession = document.getElementById('invitationSession');

if (personData && JSON.parse(personData).id) {
    personData = JSON.parse(personData);

    invitationSession.innerHTML = `
        <h3>Indique um conhecido e ganhe ofertas!</h3>
        <p>Caso alguem faça uma compra na nossa loja e informe o seu código, você receberá descontos de até <strong>20%</strong> nas suas próximas compras.</p>
        
        <h6>Seu código de indicação é: <strong>${personData.invitationCode}</strong></h6>

        <button onclick="copyInviteCode()">Copiar código</button>
    `;
} else {
    invitationSession.innerHTML = `
        <h3>Indique um conhecido e ganhe ofertas!</h3>
        <h5>Ao criar uma conta no nosso site você terá um código de indicação só seu!</h5>
        <p>Caso alguem faça uma compra na nossa loja e informe o seu código, você receberá descontos de até <strong>20%</strong> nas suas próximas compras.</p>
        <p>Clique aqui para se cadastrar:</p>

        <button data-bs-target="#loginModal" data-bs-toggle="modal">Entrar / Cadastrar</button>
    `;
}

function copyInviteCode() {
    navigator.clipboard.writeText(personData.invitationCode);

    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
}