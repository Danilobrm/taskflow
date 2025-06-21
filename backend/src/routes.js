import { Router } from "express";
import { AuthController } from "./application/controllers/auth/auth.controller.js";
import { TaskController } from "./application/controllers/tasks/tasks.controller.js";
import { BoardController } from "./application/controllers/board/board.controller.js";
import { BoardMemberController } from "./application/controllers/board-member/board-member.controller.js";
import { CategoryController } from "./application/controllers/category/category.controller.js";

const router = Router();

const authController = new AuthController();
const taskController = new TaskController();
const boardController = new BoardController();
const boardMemberController = new BoardMemberController();
const categoryController = new CategoryController();

export const autenticarToken =
    authController.autenticarToken.bind(authController);

// Auth
router.post("/api/register", authController.register.bind(authController));
router.post("/api/login", authController.login.bind(authController));

router.get("/api/me", authController.getProfile.bind(authController));

// Users (Usuários)
// router.get("/api/users", userController.list.bind(userController));
// router.get("/api/users/:id", userController.get.bind(userController));
// router.put("/api/users/:id", userController.update.bind(userController));
// router.delete("/api/users/:id", userController.delete.bind(userController));

// Boards (Quadros)
router.post(
    "/api/boards",
    autenticarToken,
    boardController.create.bind(boardController)
);
router.get(
    "/api/boards",
    autenticarToken,
    boardController.list.bind(boardController)
);
router.get(
    "/api/boards/:id",
    autenticarToken,
    boardController.get.bind(boardController)
);
router.put(
    "/api/boards/:id",
    autenticarToken,
    boardController.update.bind(boardController)
);
router.delete(
    "/api/boards/:id",
    autenticarToken,
    boardController.delete.bind(boardController)
);

// Users-Boards (Adicionar/Remover usuários em quadros)
router.post(
    "/api/boards/:boardId/users",
    boardMemberController.addMember.bind(boardMemberController)
);
router.delete(
    "/api/boards/:boardId/users/:userId",
    boardMemberController.removeMember.bind(boardMemberController)
);
router.get(
    "/api/boards/:boardId/users",
    boardMemberController.listMembers.bind(boardMemberController)
);

// Categories (Categorias)
router.post(
    "/api/boards/:boardId/categories",
    autenticarToken,
    categoryController.create.bind(categoryController)
);
router.get(
    "/api/boards/:boardId/categories",
    autenticarToken,
    categoryController.listByBoard.bind(categoryController)
);
router.get(
    "/api/categories/:id",
    autenticarToken,
    categoryController.get.bind(categoryController)
);
router.put(
    "/api/categories/:id",
    autenticarToken,
    categoryController.update.bind(categoryController)
);
router.delete(
    "/api/categories/:id",
    autenticarToken,
    categoryController.delete.bind(categoryController)
);

// Tasks (Tarefas)
router.post(
    "/api/boards/:boardId/tasks",
    autenticarToken,
    taskController.create.bind(taskController)
);
router.get(
    "/api/boards/:boardId/tasks",
    autenticarToken,
    taskController.listByBoard.bind(taskController)
);
router.get(
    "/api/tasks/:id",
    autenticarToken,
    taskController.get.bind(taskController)
);
router.put(
    "/api/tasks/:id",
    autenticarToken,
    taskController.update.bind(taskController)
);
router.delete(
    "/api/tasks/:id",
    autenticarToken,
    taskController.delete.bind(taskController)
);

// Comments (Comentários em tarefas)
// router.post("/api/tasks/:taskId/comments", commentController.create.bind(commentController));
// router.get("/api/tasks/:taskId/comments", commentController.listByTask.bind(commentController));
// router.get("/api/comments/:id", commentController.get.bind(commentController));
// router.put("/api/comments/:id", commentController.update.bind(commentController));
// router.delete("/api/comments/:id", commentController.delete.bind(commentController));

// const tasks = [];
// router.get("/api/tasks", (req, res) => {
//   res.json(tasks);
// });
//
// router.post("/api/tasks/new", (req, res) => {
//   const { title, description, date, priority, category } = req.body;
//   const now = new Date();
//   const inputDate = new Date(date);
//
//   if (!title || !date) return res.status(400).json({ error: "Título e data são obrigatórios" });
//   if (title.length > 100) return res.status(400).json({ error: "Título muito longo" });
//   if (inputDate < now) return res.status(400).json({ error: "A data não pode ser anterior a hoje" });
//   if (!["Alta", "Média", "Baixa"].includes(priority)) return res.status(400).json({ error: "Prioridade inválida" });
//
//   const duplicate = tasks.find((t) => t.title === title && t.date === date);
//   if (duplicate) return res.status(400).json({ error: "Já existe uma tarefa com esse título e data" });
//
//   const task = {
//     id: uuidv4(),
//     title,
//     description,
//     date,
//     priority,
//     category: category || "sem classificação",
//     status: "Pendente",
//   };
//
//   tasks.push(task);
//   res.status(201).json(task);
// });

export { router };
