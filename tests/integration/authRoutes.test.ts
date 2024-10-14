import mongoose from "mongoose";
import User from "../../src/models/User";
import request from "supertest";
import app from "../../src/index";
import bcrypt from "bcrypt";

describe("admin routes", () => {
  beforeAll(async () => {
    console.log("admin routes tests");
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "peoples_testr",
    });

    console.log(" test db connected");

    await User.deleteMany({});
    const pass = await bcrypt.hash("123456", 10);
    User.create({
      username: "admin",
      first_name: "johhny",
      last_name: "monny",
      email: "admin@peoples.com",
      password: pass,
      role: "ADMIN",
    });
    console.log("test admin created succesfully");

    const user_pass = await bcrypt.hash("123456", 10);
    const regularUser = await User.create({
      username: "user",
      email: "user@peoples.com",
      password: user_pass,
      first_name: "priya",
      last_name: "johny",
      role: "USER",
    });

    console.log("test user created succesfully");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      //  const  pass = await bcrypt.hash("123456", 10);
      const res = await request(app).post("/api/v1/auth/register").send({
        username: "testuser",
        first_name: "test",
        last_name: "user",
        email: "test@example.com",
        password: "123456",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.user.username).toBe("testuser");
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should return 400 if user already exists", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        first_name: "test",
        last_name: "user",
        password: "123456",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User with this email already exists");
    });
  });

  describe("POST  /api/v1/auth/login", () => {
    it("should login the test user", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        username: "user",
        password: "123456",
      });
      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});
