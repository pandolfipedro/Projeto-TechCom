document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');

    // Credenciais de login
    const validUsername = "admin";
    const validPassword = "12345";

    // Funções de navegação devem ser definidas globalmente
    window.dashboardScreen = dashboardScreen;
    window.cadastroScreen = cadastroScreen;
    window.estoqueScreen = estoqueScreen;
    window.relatoriosScreen = relatoriosScreen;
    window.crmScreen = crmScreen;
    window.logout = logout;

    // Tela de Login
    function loginScreen() {
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Login</h5>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Usuário</label>
                            <input type="text" class="form-control" id="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Senha</label>
                            <input type="password" class="form-control" id="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Entrar</button>
                        <div id="error-message" class="text-danger mt-2"></div>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === validUsername && password === validPassword) {
                dashboardScreen();
            } else {
                document.getElementById('error-message').innerText = "Usuário ou senha inválidos";
            }
        });
    }

    // Tela de Dashboard
    function dashboardScreen() {
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Dashboard</h5>
                    <div class="list-group">
                        <button class="list-group-item list-group-item-action" id="cadastroBtn">
                            <i class="fas fa-plus-circle"></i> Cadastro de Produtos
                        </button>
                        <button class="list-group-item list-group-item-action" id="estoqueBtn">
                            <i class="fas fa-boxes"></i> Controle de Estoque
                        </button>
                        <button class="list-group-item list-group-item-action" id="relatoriosBtn">
                            <i class="fas fa-chart-line"></i> Relatórios de Vendas
                        </button>
                        <button class="list-group-item list-group-item-action" id="crmBtn">
                            <i class="fas fa-users"></i> Integração com CRM
                        </button>
                    </div>
                    <div class="mt-4">
                        <canvas id="estoqueChart"></canvas>
                    </div>
                    <div class="mt-4">
                        <canvas id="vendasChart"></canvas>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('cadastroBtn').addEventListener('click', cadastroScreen);
        document.getElementById('estoqueBtn').addEventListener('click', estoqueScreen);
        document.getElementById('relatoriosBtn').addEventListener('click', relatoriosScreen);
        document.getElementById('crmBtn').addEventListener('click', crmScreen);

        renderEstoqueChart();
        renderVendasChart();
    }

    // Função para renderizar o gráfico de estoque
    function renderEstoqueChart() {
        const ctx = document.getElementById('estoqueChart').getContext('2d');
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const nomes = produtos.map(produto => produto.nome);
        const quantidades = produtos.map(produto => produto.quantidade);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nomes,
                datasets: [{
                    label: 'Quantidade de Itens em Estoque',
                    data: quantidades,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Função para renderizar o gráfico de vendas
    function renderVendasChart() {
        const ctx = document.getElementById('vendasChart').getContext('2d');
        const vendas = [
            { data: '01/01/2023', total: 1000 },
            { data: '02/01/2023', total: 500 },
            { data: '03/01/2023', total: 1500 }
        ];
        const datas = vendas.map(venda => venda.data);
        const totais = vendas.map(venda => venda.total);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: datas,
                datasets: [{
                    label: 'Relatório de Vendas Diárias',
                    data: totais,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Tela de Cadastro de Produtos
    function cadastroScreen() {
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Cadastro de Produtos</h5>
                    <form id="cadastroForm">
                        <div class="form-group">
                            <label for="produto">Produto</label>
                            <input type="text" class="form-control" id="produto" required>
                        </div>
                        <div class="form-group">
                            <label for="quantidade">Quantidade</label>
                            <input type="number" class="form-control" id="quantidade" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                        <button type="button" class="btn btn-secondary mt-2" id="voltarBtn">Voltar</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('cadastroForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const produto = document.getElementById('produto').value;
            const quantidade = document.getElementById('quantidade').value;

            let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
            produtos.push({ nome: produto, quantidade: parseInt(quantidade) });
            localStorage.setItem('produtos', JSON.stringify(produtos));

            alert('Produto cadastrado com sucesso!');
            dashboardScreen();
        });

        document.getElementById('voltarBtn').addEventListener('click', dashboardScreen);
    }

    // Tela de Controle de Estoque
    function estoqueScreen() {
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Controle de Estoque</h5>
                    <ul id="estoqueList" class="list-group">
                        <!-- Lista de produtos será inserida via JavaScript -->
                    </ul>
                    <button class="btn btn-secondary mt-3" id="voltarBtn">Voltar</button>
                </div>
            </div>
        `;

        const estoqueList = document.getElementById('estoqueList');
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

        produtos.forEach((produto, index) => {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                ${produto.nome} - Quantidade: ${produto.quantidade}
                <span>
                    <button class="btn btn-warning btn-sm mr-2" onclick="editarProduto(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="removerProduto(${index})">Remover</button>
                </span>
            `;
            estoqueList.appendChild(item);
        });

        document.getElementById('voltarBtn').addEventListener('click', dashboardScreen);
    }

    // Editar Produto
    function editarProduto(index) {
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const produto = produtos[index];
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Editar Produto</h5>
                    <form id="editarForm">
                        <div class="form-group">
                            <label for="produto">Produto</label>
                            <input type="text" class="form-control" id="produto" value="${produto.nome}" required>
                        </div>
                        <div class="form-group">
                            <label for="quantidade">Quantidade</label>
                            <input type="number" class="form-control" id="quantidade" value="${produto.quantidade}" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary mt-2" id="cancelarBtn">Cancelar</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('editarForm').addEventListener('submit', function(event) {
            event.preventDefault();
            produto.nome = document.getElementById('produto').value;
            produto.quantidade = parseInt(document.getElementById('quantidade').value);
            produtos[index] = produto;
            localStorage.setItem('produtos', JSON.stringify(produtos));
            alert('Produto atualizado com sucesso!');
            estoqueScreen();
        });

        document.getElementById('cancelarBtn').addEventListener('click', estoqueScreen);
    }

    // Remover Produto
    function removerProduto(index) {
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        if (confirm('Tem certeza que deseja remover este produto?')) {
            produtos.splice(index, 1);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            alert('Produto removido com sucesso!');
            estoqueScreen();
        }
    }

    // Tela de Relatórios de Vendas
    function relatoriosScreen() {
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Relatórios de Vendas</h5>
                    <ul id="relatoriosList" class="list-group">
                        <!-- Lista de relatórios será inserida via JavaScript -->
                    </ul>
                    <button class="btn btn-secondary mt-3" id="voltarBtn">Voltar</button>
                </div>
            </div>
        `;

        const relatoriosList = document.getElementById('relatoriosList');
        // Exemplo de dados de vendas
        const vendas = [
            { data: '01/01/2023', total: 1000 },
            { data: '02/01/2023', total: 500 },
            { data: '03/01/2023', total: 1500 }
        ];

        vendas.forEach(venda => {
            const item = document.createElement('li');
            item.className = 'list-group-item';
            item.textContent = `Data: ${venda.data} - Total: R$ ${venda.total}`;
            relatoriosList.appendChild(item);
        });

        document.getElementById('voltarBtn').addEventListener('click', dashboardScreen);
    }

    // Tela de Integração com CRM
    function crmScreen() {
        app.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Integração com CRM</h5>
                    <p>Funcionalidade de integração com CRM em desenvolvimento.</p>
                    <button class="btn btn-secondary mt-3" id="voltarBtn">Voltar</button>
                </div>
            </div>
        `;

        document.getElementById('voltarBtn').addEventListener('click', dashboardScreen);
    }

    // Função de logout
    function logout() {
        loginScreen();
    }

    // Inicializar com a tela de login
    loginScreen();

    // Expor funções globais para edição e remoção de produtos
    window.editarProduto = editarProduto;
    window.removerProduto = removerProduto;
});
