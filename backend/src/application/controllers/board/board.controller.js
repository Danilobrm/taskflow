import { BoardMemberService } from "../../services/board-member/board-member.service.js";
import { BoardService } from "../../services/board/board.service.js";

export class BoardController {
  constructor() {
    this.boardService = new BoardService();
    this.boardMemberService = new BoardMemberService();
  }

  async create(req, res) {
    const { name, description } = req.body;
    const created_by = req.user.id;

    try {
      const board = await this.boardService.create({
        name,
        description: description || null,
        created_by,
      });

      await this.boardMemberService.addMember(board.id, created_by, "owner");

      return res.status(201).json(board);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async list(req, res) {
    const user_id = req.user.id;
    
    try {
      const boards = await this.boardService.list(user_id);
      return res.status(200).json(boards);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async get(req, res) {
    const { id } = req.params;

    try {
      const board = await this.boardService.getById(id);

      if (!board) {
        return res.status(404).json({ error: "Quadro não encontrado." });
      }

      return res.status(200).json(board);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedBoard = await this.boardService.update(id, updateData);
      return res.status(200).json(updatedBoard);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      await this.boardService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
