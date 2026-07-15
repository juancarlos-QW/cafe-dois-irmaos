# ☕ Café Dois Irmãos

Site institucional e cardápio online de uma cafeteria, com carrinho de compras e envio do pedido direto para o WhatsApp. Feito com **HTML, CSS e JavaScript puro** (sem frameworks).

🔗 **Site no ar:** [juancarlos-qw.github.io/cafe-dois-irmaos](https://juancarlos-qw.github.io/cafe-dois-irmaos/)

## ✨ Funcionalidades

- 🛒 **Carrinho de compras** com quantidade, subtotal e total em tempo real (salvo no navegador via `localStorage`)
- 📱 **Finalização do pedido pelo WhatsApp** com resumo completo dos itens
- 🔖 **Modal de produto** com escolha de tamanho (P/M/G) e adicionais
- ❤️ **Favoritos** e filtro por categorias (Cafés, Doces, Salgados)
- 🔍 **Busca** de produtos
- 🎟️ **Cupons de desconto** e cálculo de **taxa de entrega** por bairro
- 💳 Formas de pagamento (PIX, dinheiro, cartão) com chave PIX copiável
- 🟢 **Status da loja** (aberto/fechado) conforme o horário
- 📢 Banner promocional rotativo
- 📱 Layout **responsivo** e tema escuro

## 🗂️ Estrutura

```
├── index.html      # Estrutura da página
├── style.css       # Estilos (tema escuro)
├── scripts.js      # Toda a lógica (carrinho, modal, WhatsApp, etc.)
└── images/         # Imagens do site
```

## 🚀 Como usar

Acesse a versão publicada em [juancarlos-qw.github.io/cafe-dois-irmaos](https://juancarlos-qw.github.io/cafe-dois-irmaos/) ou, localmente, basta abrir o arquivo `index.html` no navegador — não há dependências nem build.

## ⚙️ Configuração

Antes de publicar, ajuste em `scripts.js`:

- `numeroWhatsApp` — número da loja para receber os pedidos
- `chavePix` — chave PIX real para pagamentos

---

Feito com carinho para a Café Dois Irmãos.
