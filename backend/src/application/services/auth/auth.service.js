import jwt from "jsonwebtoken";
import { UserService } from "../user/user.service.js";
import { supabase } from "../../../config/db.js";

export class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  async register({ name, email, password }) {
    const password_hash = password;
    console.log(password_hash);
    return await this.userService.create({ name, email, password_hash });
  }

  async login(email, password) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password_hash", password)
      .single();

    if (error || !user) {
      throw new Error("Email ou senha inválidos.");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    return { message: "Login realizado com sucesso", token };
  }
}
