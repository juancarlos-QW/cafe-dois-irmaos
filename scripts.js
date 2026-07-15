const searchIcon = document.querySelector('.icons img[alt="search--v1"]');
const cartIcon = document.querySelector('.icons img[alt="shopping-cart"]');
const menuButtons = document.querySelectorAll('.menu .box .btn');
const produtos = document.querySelectorAll('.menu .box');
const navbar = document.querySelector('.navbar');
const icons = document.querySelector('.icons');

const numeroWhatsApp = '5554999999999';
const chavePix = 'sua-chave-pix-aqui';

let carrinho = JSON.parse(localStorage.getItem('carrinhoCafe')) || [];
let favoritos = JSON.parse(localStorage.getItem('favoritosCafe')) || [];
let desconto = 0;
let taxaEntrega = 0;

const bairrosTaxa = {
    centro: 5,
    'bela vista': 8,
    'são josé': 10,
    'sao jose': 10
};

const cupons = {
    CAFE10: 10,
    PRIMEIRACOMPRA: 15,
    CLIENTEVIP: 20
};

const menuMobile = document.createElement('div');
menuMobile.className = 'menu-mobile';
menuMobile.innerHTML = '☰';
icons.appendChild(menuMobile);

menuMobile.onclick = () => navbar.classList.toggle('active');

const contadorCarrinho = document.createElement('span');
contadorCarrinho.className = 'contador-carrinho';
contadorCarrinho.innerText = '0';
cartIcon.parentElement.appendChild(contadorCarrinho);

const banner = document.createElement('div');
banner.className = 'banner-promocao';
banner.innerText = '☕ Café especial da semana';
document.body.prepend(banner);

const banners = [
    '☕ Café especial da semana',
    '🍰 Combo café + brownie',
    '🚚 Entrega grátis acima de R$50',
    '💳 Aceitamos PIX, cartão e dinheiro'
];

let bannerIndex = 0;

setInterval(() => {
    bannerIndex = (bannerIndex + 1) % banners.length;
    banner.innerText = banners[bannerIndex];
}, 3000);

const statusBox = document.createElement('div');
statusBox.className = 'status-loja';
document.body.appendChild(statusBox);

function atualizarStatusLoja() {
    const agora = new Date();
    const hora = agora.getHours();

    if (hora >= 8 && hora < 19) {
        statusBox.innerHTML = '🟢 Aberto agora - Fecha às 19:00';
    } else {
        statusBox.innerHTML = '🔴 Fechado - Abrimos às 08:00';
    }
}

atualizarStatusLoja();

const searchBox = document.createElement('div');
searchBox.className = 'search-box';
searchBox.innerHTML = `
    <input type="text" id="search-input" placeholder="Pesquisar produto...">
`;
document.body.appendChild(searchBox);

const cartBox = document.createElement('div');
cartBox.className = 'cart-box';
cartBox.innerHTML = `
    <h3>Meu Carrinho</h3>

    <input type="text" id="nome-cliente" placeholder="Seu nome">

    <select id="tipo-entrega">
        <option value="retirada">Retirar no balcão</option>
        <option value="entrega">Entrega</option>
    </select>

    <input type="text" id="bairro-cliente" placeholder="Bairro">

    <input type="text" id="endereco-cliente" placeholder="Endereço para entrega">

    <textarea id="observacao-cliente" placeholder="Observações do pedido"></textarea>

    <input type="text" id="cupom-cliente" placeholder="Cupom de desconto">

    <button class="btn aplicar-cupom">Aplicar Cupom</button>

    <select id="forma-pagamento">
        <option value="pix">PIX</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="cartao">Cartão</option>
    </select>

    <div class="pix-box">
        <p>Chave PIX:</p>
        <strong>${chavePix}</strong>
        <button class="btn copiar-pix">Copiar PIX</button>
    </div>

    <div class="cart-items"></div>

    <p class="cart-total">Total: R$ 0,00</p>

    <button class="btn finalizar-pedido">Finalizar Pedido</button>
    <button class="btn limpar-carrinho">Limpar Carrinho</button>
`;
document.body.appendChild(cartBox);

const bairroInput = document.querySelector('#bairro-cliente');
const enderecoInput = document.querySelector('#endereco-cliente');
const pixBox = document.querySelector('.pix-box');

bairroInput.style.display = 'none';
enderecoInput.style.display = 'none';

document.querySelector('#tipo-entrega').onchange = function () {
    const entrega = this.value === 'entrega';
    bairroInput.style.display = entrega ? 'block' : 'none';
    enderecoInput.style.display = entrega ? 'block' : 'none';
    atualizarCarrinho();
};

document.querySelector('#forma-pagamento').onchange = function () {
    pixBox.style.display = this.value === 'pix' ? 'block' : 'none';
};

document.querySelector('.copiar-pix').onclick = () => {
    navigator.clipboard.writeText(chavePix);
    mostrarNotificacao('Chave PIX copiada');
};

const notificacao = document.createElement('div');
notificacao.className = 'notificacao-carrinho';
document.body.appendChild(notificacao);

const categorias = document.createElement('div');
categorias.className = 'categorias-menu';
categorias.innerHTML = `
    <button data-categoria="todos" class="active">Todos</button>
    <button data-categoria="cafes">Cafés</button>
    <button data-categoria="doces">Doces</button>
    <button data-categoria="salgados">Salgados</button>
    <button data-categoria="favoritos">Favoritos ❤️</button>
`;

document.querySelector('.menu .heading').insertAdjacentElement('afterend', categorias);

produtos.forEach((produto, index) => {
    if (index <= 2) produto.dataset.categoria = 'cafes';
    if (index === 3 || index === 4) produto.dataset.categoria = 'doces';
    if (index >= 5) produto.dataset.categoria = 'salgados';

    const fav = document.createElement('button');
    fav.className = 'favorito-btn';
    fav.innerHTML = '♡';
    produto.appendChild(fav);

    const nome = produto.querySelector('h3').innerText;

    if (favoritos.includes(nome)) {
        fav.innerHTML = '❤️';
    }

    fav.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (favoritos.includes(nome)) {
            favoritos = favoritos.filter(item => item !== nome);
            fav.innerHTML = '♡';
        } else {
            favoritos.push(nome);
            fav.innerHTML = '❤️';
        }

        localStorage.setItem('favoritosCafe', JSON.stringify(favoritos));
    };
});

document.querySelectorAll('.categorias-menu button').forEach((btn) => {
    btn.onclick = () => {
        document.querySelectorAll('.categorias-menu button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const categoria = btn.dataset.categoria;

        produtos.forEach((produto) => {
            const nome = produto.querySelector('h3').innerText;

            if (categoria === 'todos') {
                produto.style.display = 'block';
            } else if (categoria === 'favoritos') {
                produto.style.display = favoritos.includes(nome) ? 'block' : 'none';
            } else {
                produto.style.display = produto.dataset.categoria === categoria ? 'block' : 'none';
            }
        });
    };
});

searchIcon.onclick = () => {
    searchBox.classList.toggle('active');
    cartBox.classList.remove('active');
};

cartIcon.onclick = () => {
    cartBox.classList.toggle('active');
    searchBox.classList.remove('active');
};

menuButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        const box = button.closest('.box');
        const nome = box.querySelector('h3').innerText;
        const precoTexto = box.querySelector('.price').childNodes[0].textContent.trim();

        const preco = Number(
            precoTexto.replace('R$', '').replace('$', '').replace(',', '.')
        );

        abrirModalProduto(nome, preco);
    });
});

function abrirModalProduto(nome, preco) {
    const modal = document.createElement('div');
    modal.className = 'modal-produto active';

    modal.innerHTML = `
        <div class="modal-content">
            <button class="fechar-modal">X</button>

            <h2>${nome}</h2>
            <p>Produto especial da Café Dois Irmãos.</p>

            <label>Tamanho:</label>
            <select id="tamanho-produto">
                <option value="P" data-extra="0">Pequeno</option>
                <option value="M" data-extra="3">Médio + R$3</option>
                <option value="G" data-extra="6">Grande + R$6</option>
            </select>

            <label>Adicionais:</label>

            <label><input type="checkbox" class="adicional" value="Chantilly" data-preco="2"> Chantilly + R$2</label>
            <label><input type="checkbox" class="adicional" value="Leite vegetal" data-preco="3"> Leite vegetal + R$3</label>
            <label><input type="checkbox" class="adicional" value="Calda de chocolate" data-preco="2"> Calda de chocolate + R$2</label>
            <label><input type="checkbox" class="adicional" value="Café extra" data-preco="4"> Café extra + R$4</label>

            <button class="btn confirmar-produto">Adicionar ao Carrinho</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.fechar-modal').onclick = () => modal.remove();

    modal.querySelector('.confirmar-produto').onclick = () => {
        const tamanhoSelect = modal.querySelector('#tamanho-produto');
        const tamanho = tamanhoSelect.value;
        const extraTamanho = Number(tamanhoSelect.options[tamanhoSelect.selectedIndex].dataset.extra);

        let adicionais = [];
        let precoAdicionais = 0;

        modal.querySelectorAll('.adicional:checked').forEach((item) => {
            adicionais.push(item.value);
            precoAdicionais += Number(item.dataset.preco);
        });

        const nomeFinal = `${nome} (${tamanho})${adicionais.length ? ' + ' + adicionais.join(', ') : ''}`;
        const precoFinal = preco + extraTamanho + precoAdicionais;

        const itemExistente = carrinho.find(item => item.nome === nomeFinal);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({
                nome: nomeFinal,
                preco: precoFinal,
                quantidade: 1
            });
        }

        salvarCarrinho();
        atualizarCarrinho();
        mostrarNotificacao(`${nome} adicionado ao carrinho`);
        modal.remove();
    };
}

function atualizarCarrinho() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');

    cartItems.innerHTML = '';

    let subtotalGeral = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        cartItems.innerHTML = `<p class="carrinho-vazio">Carrinho vazio</p>`;
    }

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;

        subtotalGeral += subtotal;
        quantidadeTotal += item.quantidade;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.nome}</strong><br>
                    Qtd: ${item.quantidade}<br>
                    R$ ${item.preco.toFixed(2).replace('.', ',')} cada<br>
                    Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}
                </div>

                <div class="cart-actions">
                    <button class="qtd-btn" onclick="diminuirQuantidade(${index})">-</button>
                    <button class="qtd-btn" onclick="aumentarQuantidade(${index})">+</button>
                    <button class="remover-btn" onclick="removerItem(${index})">X</button>
                </div>
            </div>
        `;
    });

    taxaEntrega = 0;

    if (document.querySelector('#tipo-entrega')?.value === 'entrega') {
        const bairro = document.querySelector('#bairro-cliente').value.toLowerCase().trim();
        taxaEntrega = bairrosTaxa[bairro] || 0;
    }

    const valorDesconto = subtotalGeral * (desconto / 100);
    const totalFinal = subtotalGeral - valorDesconto + taxaEntrega;

    cartTotal.innerHTML = `
        Subtotal: R$ ${subtotalGeral.toFixed(2).replace('.', ',')}<br>
        Desconto: R$ ${valorDesconto.toFixed(2).replace('.', ',')}<br>
        Entrega: R$ ${taxaEntrega.toFixed(2).replace('.', ',')}<br>
        <strong>Total: R$ ${totalFinal.toFixed(2).replace('.', ',')}</strong>
    `;

    contadorCarrinho.innerText = quantidadeTotal;
    contadorCarrinho.style.display = quantidadeTotal > 0 ? 'flex' : 'none';
}

function salvarCarrinho() {
    localStorage.setItem('carrinhoCafe', JSON.stringify(carrinho));
}

window.aumentarQuantidade = function (index) {
    carrinho[index].quantidade++;
    salvarCarrinho();
    atualizarCarrinho();
};

window.diminuirQuantidade = function (index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
    atualizarCarrinho();
};

window.removerItem = function (index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao('Item removido');
};

document.querySelector('.limpar-carrinho').onclick = () => {
    carrinho = [];
    desconto = 0;
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao('Carrinho limpo');
};

document.querySelector('.aplicar-cupom').onclick = () => {
    const cupom = document.querySelector('#cupom-cliente').value.trim().toUpperCase();

    if (cupons[cupom]) {
        desconto = cupons[cupom];
        mostrarNotificacao(`Cupom aplicado: ${desconto}%`);
    } else {
        desconto = 0;
        mostrarNotificacao('Cupom inválido');
    }

    atualizarCarrinho();
};

bairroInput.addEventListener('input', atualizarCarrinho);

document.querySelector('.finalizar-pedido').onclick = () => {
    if (carrinho.length === 0) {
        mostrarNotificacao('Carrinho vazio');
        return;
    }

    const nome = document.querySelector('#nome-cliente').value.trim();
    const tipoEntrega = document.querySelector('#tipo-entrega').value;
    const bairro = document.querySelector('#bairro-cliente').value.trim();
    const endereco = document.querySelector('#endereco-cliente').value.trim();
    const observacao = document.querySelector('#observacao-cliente').value.trim();
    const formaPagamento = document.querySelector('#forma-pagamento').value;

    if (tipoEntrega === 'entrega' && endereco === '') {
        mostrarNotificacao('Informe o endereço');
        return;
    }

    let subtotalGeral = 0;
    let mensagem = `☕ *Pedido Café Dois Irmãos*%0A%0A`;

    if (nome) mensagem += `👤 Cliente: ${nome}%0A`;

    mensagem += `📦 Tipo: ${tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada no balcão'}%0A`;

    if (tipoEntrega === 'entrega') {
        mensagem += `📍 Bairro: ${bairro}%0A`;
        mensagem += `🏠 Endereço: ${endereco}%0A`;
    }

    mensagem += `💳 Pagamento: ${formaPagamento.toUpperCase()}%0A`;

    if (formaPagamento === 'pix') {
        mensagem += `🔑 Chave PIX: ${chavePix}%0A`;
    }

    mensagem += `%0A*Itens do pedido:*%0A%0A`;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        subtotalGeral += subtotal;

        mensagem += `${index + 1}. ${item.nome}%0A`;
        mensagem += `Quantidade: ${item.quantidade}%0A`;
        mensagem += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}%0A%0A`;
    });

    const valorDesconto = subtotalGeral * (desconto / 100);
    const totalFinal = subtotalGeral - valorDesconto + taxaEntrega;

    mensagem += `Subtotal: R$ ${subtotalGeral.toFixed(2).replace('.', ',')}%0A`;
    mensagem += `Desconto: R$ ${valorDesconto.toFixed(2).replace('.', ',')}%0A`;
    mensagem += `Entrega: R$ ${taxaEntrega.toFixed(2).replace('.', ',')}%0A`;
    mensagem += `💰 *Total: R$ ${totalFinal.toFixed(2).replace('.', ',')}*`;

    if (observacao) {
        mensagem += `%0A%0A📝 Observação: ${observacao}`;
    }

    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, '_blank');
};

document.querySelector('#search-input').addEventListener('input', function () {
    const termo = this.value.toLowerCase();

    produtos.forEach((produto) => {
        const nome = produto.querySelector('h3').innerText.toLowerCase();
        produto.style.display = nome.includes(termo) ? 'block' : 'none';
    });
});

document.querySelectorAll('.navbar a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const destino = document.querySelector(link.getAttribute('href'));

        destino.scrollIntoView({
            behavior: 'smooth'
        });

        navbar.classList.remove('active');
    });
});

const voltarTopo = document.createElement('button');
voltarTopo.className = 'voltar-topo';
voltarTopo.innerHTML = '↑';
document.body.appendChild(voltarTopo);

window.addEventListener('scroll', () => {
    voltarTopo.classList.toggle('active', window.scrollY > 400);
});

voltarTopo.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

function mostrarNotificacao(texto) {
    notificacao.innerText = texto;
    notificacao.classList.add('active');

    setTimeout(() => {
        notificacao.classList.remove('active');
    }, 2500);
}

atualizarCarrinho();