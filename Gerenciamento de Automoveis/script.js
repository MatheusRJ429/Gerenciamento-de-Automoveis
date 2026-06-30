const menuItems = document.querySelectorAll(".menu-item");
const shortcutButtons = document.querySelectorAll(".menu-shortcut");
const screens = document.querySelectorAll(".screen");
const pageTitle = document.querySelector("#page-title");

const titles = {
  inicio: "Inicio",
  clientes: "Cadastro de clientes",
  carros: "Cadastro de carros",
  precos: "Tabela de precos",
  documentacao: "Documentacao",
  suporte: "Suporte",
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return map[char];
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function openScreen(target) {
  menuItems.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === target);
  });

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === target);
  });

  pageTitle.textContent = titles[target];
}

menuItems.forEach((item) => {
  item.addEventListener("click", () => openScreen(item.dataset.screen));
});

shortcutButtons.forEach((button) => {
  button.addEventListener("click", () => openScreen(button.dataset.screen));
});

document.querySelectorAll(".clear-form").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.form}`).reset();
  });
});

document.querySelector("#cliente-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.querySelector("#cliente-nome").value;
  const telefone = document.querySelector("#cliente-telefone").value;
  const modelo = document.querySelector("#cliente-modelo").value;
  const status = document.querySelector("#cliente-status").value;
  const tabela = document.querySelector("#clientes-tabela");

  tabela.insertAdjacentHTML(
    "afterbegin",
    `<tr>
      <td>${escapeHtml(nome)}</td>
      <td>${escapeHtml(telefone)}</td>
      <td>${escapeHtml(modelo)}</td>
      <td><span class="tag available">${escapeHtml(status)}</span></td>
    </tr>`
  );

  const totalClientes = document.querySelector("#stat-clientes");
  totalClientes.textContent = Number(totalClientes.textContent) + 1;
  event.target.reset();
  alert("Cliente salvo com sucesso na Drive X.");
});

document.querySelector("#carro-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const marca = document.querySelector("#carro-marca").value;
  const modelo = document.querySelector("#carro-modelo").value;
  const ano = document.querySelector("#carro-ano").value;
  const cor = document.querySelector("#carro-cor").value;
  const km = document.querySelector("#carro-km").value;
  const preco = document.querySelector("#carro-preco").value;
  const entrada = document.querySelector("#carro-entrada").value;
  const parcelas = document.querySelector("#carro-parcelas").value;
  const status = document.querySelector("#carro-status").value;
  const today = new Date();
  const isoDate = today.toISOString().slice(0, 10);
  const visibleDate = formatDate(today);

  document.querySelector("#carros-grid").insertAdjacentHTML(
    "afterbegin",
    `<article class="car-card">
      <div class="car-visual generic-car"></div>
      <span class="brand-badge">${escapeHtml(marca)}</span>
      <h3>${escapeHtml(modelo)}</h3>
      <p>${escapeHtml(ano)} | ${escapeHtml(cor)} | ${escapeHtml(km)}</p>
      <ul class="price-list">
        <li><span>Entrada</span><strong>${escapeHtml(entrada)}</strong></li>
        <li><span>Parcelas</span><strong>${escapeHtml(parcelas)}</strong></li>
        <li><span>A vista</span><strong>${escapeHtml(preco)}</strong></li>
      </ul>
    </article>`
  );

  document.querySelector("#precos-tabela").insertAdjacentHTML(
    "afterbegin",
    `<tr data-date="${isoDate}">
      <td>${visibleDate}</td>
      <td>${escapeHtml(marca)}</td>
      <td>${escapeHtml(modelo)}</td>
      <td>${escapeHtml(ano)}</td>
      <td>${escapeHtml(entrada)}</td>
      <td>${escapeHtml(parcelas)}</td>
      <td>${escapeHtml(preco)}</td>
      <td>A calcular</td>
      <td><span class="tag available">${escapeHtml(status)}</span></td>
    </tr>`
  );

  const totalCarros = document.querySelector("#stat-carros");
  totalCarros.textContent = Number(totalCarros.textContent) + 1;
  event.target.reset();
  alert("Carro salvo e adicionado ao estoque.");
});

document.querySelector("#suporte-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.target.reset();
  alert("Chamado enviado para o suporte Drive X.");
});

document.querySelector("#gerar-protocolo").addEventListener("click", () => {
  const checkedDocs = document.querySelectorAll("#documentacao .check-card input:checked");
  const protocolNumber = `DX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const protocolBox = document.querySelector("#protocolo-box");

  protocolBox.innerHTML = `
    <strong>Protocolo gerado: ${protocolNumber}</strong>
    <span>Data e hora: ${formatDateTime(new Date())}</span>
    <span>Documentos conferidos: ${checkedDocs.length} de 9</span>
  `;
});

document.querySelector("#filtrar-precos").addEventListener("click", () => {
  const start = document.querySelector("#filtro-data-inicio").value;
  const end = document.querySelector("#filtro-data-fim").value;
  const rows = document.querySelectorAll("#precos-tabela tr");

  rows.forEach((row) => {
    const rowDate = row.dataset.date;
    const afterStart = !start || rowDate >= start;
    const beforeEnd = !end || rowDate <= end;
    row.hidden = !(afterStart && beforeEnd);
  });
});

document.querySelector("#limpar-filtro-precos").addEventListener("click", () => {
  document.querySelector("#filtro-data-inicio").value = "";
  document.querySelector("#filtro-data-fim").value = "";
  document.querySelectorAll("#precos-tabela tr").forEach((row) => {
    row.hidden = false;
  });
});