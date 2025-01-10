import mongoose from "mongoose";
import User from "../../src/models/User";
import request from "supertest";
import app from "../../src/index";
import bcrypt from "bcrypt";
import exp from "constants";

describe("admin model routes", () => {
  let adminCookie: string[] = [];

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "peoples_models_test",
    });
    await User.deleteMany({});
    const  pass = await bcrypt.hash("123456", 10);
    User.create({
      username: "admin2",
      first_name:"johhny2",
      last_name:"monny2",
      email: "admin2@peoples.com",
      password: pass,
      role: "ADMIN",
    });
    console.log("test admin created succesfully");
    const  user_pass = await bcrypt.hash("123456", 10);
    const regularUser = await User.create({
      username: "user",
      email: "user@peoples.com",
      password: user_pass,
      first_name:"priya",
      last_name:"johny",
      role: "USER",
    });

    console.log("test user created succesfully");
  });

  afterAll(async () => {
    

 
    await mongoose.connection.close();
  });



  describe("GET /api/v1/models",()=>{
    it("should login the admin and get all the models", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
          username: "admin2",
          password: "123456",
        });
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
        adminCookie = Array.isArray(res.headers["set-cookie"])
          ? res.headers["set-cookie"]
          : [res.headers["set-cookie"]];

          const result = await request(app)
          .get(`/api/v1/models`)
          .set("Cookie", adminCookie);

          expect(result.status).toBe(200)
         
      });
  
  })

  describe("POST /api/v1/models",()=>{
    it("should login the admin and create a model", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
          username: "admin2",
          password: "123456",
        });
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
        adminCookie = Array.isArray(res.headers["set-cookie"])
          ? res.headers["set-cookie"]
          : [res.headers["set-cookie"]];

          const result = await request(app)
          .post(`/api/v1/models`).send({
            name: "TestModel",
          })
          .set("Cookie", adminCookie);

          expect(result.status).toBe(200)
          expect(result.body.message).toBe('Model created successfully')
         
      });
  
  })

  describe("POST /api/v1/models",()=>{
    it("should login the admin and add a feild rollNumber to testModal", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
          username: "admin2",
          password: "123456",
        });
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
        adminCookie = Array.isArray(res.headers["set-cookie"])
          ? res.headers["set-cookie"]
          : [res.headers["set-cookie"]];

          const result = await request(app)
          .post(`/api/v1/models/TestModel__Dyn/fields`).send({
        
          
              "type":"Number",
              "name":"rollNumber",
              "required":true,
         
            
         
        
          })
          .set("Cookie", adminCookie);

          expect(result.status).toBe(200)
          expect(result.body.message).toBe('Field added successfully')
         
      });
  
  })

  describe("POST /api/v1/models",()=>{
    it("should login the admin and add a record  to testModal", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
          username: "admin2",
          password: "123456",
        });
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
        adminCookie = Array.isArray(res.headers["set-cookie"])
          ? res.headers["set-cookie"]
          : [res.headers["set-cookie"]];

          const result = await request(app)
          .post(`/api/v1/records/`).send({
        
          
              "type":"Number",
              "name":"rollNumber",
              "required":true,
         
            
         
        
          })
          .set("Cookie", adminCookie);

          expect(result.status).toBe(200)
          expect(result.body.message).toBe('Field added successfully')
         
      });
  
  })

  // describe("GET /api/v1/records/",()=>{
  //   it("should login the admin and get all records from testModal", async () => {
  //     const res = await request(app).post("/api/v1/auth/login").send({
  //       username: "admin2",
  //       password: "123456",
  //     });
  //     expect(res.status).toBe(200);
  //     expect(res.headers["set-cookie"]).toBeDefined();
  //     adminCookie = Array.isArray(res.headers["set-cookie"])
  //       ? res.headers["set-cookie"]
  //       : [res.headers["set-cookie"]];

  //       const result = await request(app)
  //       .post(`/api/v1/records/`).send({
      
        
  //           "type":"Number",
  //           "name":"rollNumber",
  //           "required":true,
       
          
       
      
  //       })
  //       .set("Cookie", adminCookie);

  //       expect(result.status).toBe(200)
  //   })
  // })


});
