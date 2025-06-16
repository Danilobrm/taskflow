import { BoardMemberService } from "../../services/board-member/board-member.service.js";
import { UserService } from "../../services/user/user.service.js";

export class BoardMemberController {
  constructor() {
    this.boardMemberService = new BoardMemberService();
    this.userService = new UserService();
  }

  async addMember(req, res) {
    const { boardId } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: "O email do usuário é obrigatório." });
    }

    const user = await this.userService.findByEmail(email);
    const userId = user ? user.id : null;

    if (!userId) {
      return res.status(400).json({ error: "Usuário não encontrado com o email fornecido." });
    }

    const memberIsInBoard = await this.boardMemberService.isMemberInBoard(boardId, userId);

    if (memberIsInBoard) {
      return res.status(400).json({ error: "Usuário já é membro deste board." });
    }

    try {
      const member = await this.boardMemberService.addMember(boardId, userId, role);
      return res.status(201).json(member);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async removeMember(req, res) {
    const { boardId, userId } = req.params;

    try {
      await this.boardMemberService.removeMember(boardId, userId);
      return res.status(200).json({ message: "Membro removido com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async listMembers(req, res) {
    const { boardId } = req.params;

    try {
      const members = await this.boardMemberService.listMembers(boardId);
      return res.status(200).json(members);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
