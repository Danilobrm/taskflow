

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUserByEmail(req, res) {
    const { email } = req.body;

    try {
      const user = await this.userService.getByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
