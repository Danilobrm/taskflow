1. git clone <link do repositório>

2. cd taskflow

3. cd backend 
3.1 npm install
3.2 npm start

*abra um novo terminal*

4. cd frontend
4.1 npm install
4.2 npm start

✅ Rotas já implementadas

🔐 Autenticação (Auth)
Método	Endpoint	Descrição
POST	/api/register	Registro de novo usuário
POST	/api/login	Login do usuário (retorna JWT)
GET	/api/me	Retorna informações do usuário autenticado

📌 Quadros (Boards)
Todas as rotas de boards requerem autenticação (token JWT).
Método	Endpoint	Descrição
POST	/api/boards	Criar um novo quadro
GET	/api/boards	Listar todos os quadros do usuário
GET	/api/boards/:id	Obter detalhes de um quadro específico
PUT	/api/boards/:id	Atualizar um quadro
DELETE	/api/boards/:id	Excluir um quadro

👥 Membros de Quadros (Board Members)
Método	Endpoint	Descrição
POST	/api/boards/:boardId/users	Adicionar um usuário a um quadro
DELETE	/api/boards/:boardId/users/:userId	Remover um usuário de um quadro
GET	/api/boards/:boardId/users	Listar os membros de um quadro

✅ Tarefas (Tasks)
Método	Endpoint	Descrição
POST	/api/boards/:boardId/tasks	Criar uma nova tarefa em um quadro
GET	/api/boards/:boardId/tasks	Listar todas as tarefas de um quadro
GET	/api/tasks/:id	Obter detalhes de uma tarefa específica
PUT	/api/tasks/:id	Atualizar uma tarefa
DELETE	/api/tasks/:id	Excluir uma tarefa

🚧 Rotas pendentes (A implementar)

👤 Usuários (Users)
Método	Endpoint	Descrição
GET	/api/users	Listar todos os usuários
GET	/api/users/:id	Obter detalhes de um usuário específico
PUT	/api/users/:id	Atualizar um usuário
DELETE	/api/users/:id	Excluir um usuário

🗂️ Categorias (Categories)
Método	Endpoint	Descrição
POST	/api/boards/:boardId/categories	Criar uma nova categoria dentro de um quadro
GET	/api/boards/:boardId/categories	Listar categorias de um quadro
GET	/api/categories/:id	Obter detalhes de uma categoria específica
PUT	/api/categories/:id	Atualizar uma categoria
DELETE	/api/categories/:id	Excluir uma categoria

💬 Comentários em Tarefas (Comments)
Método	Endpoint	Descrição
POST	/api/tasks/:taskId/comments	Criar um comentário em uma tarefa
GET	/api/tasks/:taskId/comments	Listar comentários de uma tarefa
GET	/api/comments/:id	Obter detalhes de um comentário específico
PUT	/api/comments/:id	Atualizar um comentário
DELETE	/api/comments/:id	Excluir um comentário

✅ Legenda:

    Implementadas: Já estão funcionando no backend.

    Pendentes: Comentadas no código, ainda precisam ser desenvolvidas.
