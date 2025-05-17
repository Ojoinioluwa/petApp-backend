const User = require("../models/User");
const userController = require("./userCtrl");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


jest.mock("../models/User.js")
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User controller", ()=> {
    let req, res, next;
    beforeEach(()=> {
        req = {body: {}, user: null};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        next = jest.fn()
    })

    afterEach(()=> {
        jest.clearAllMocks()
    })

    // ===================
    // Register
    // =================

    describe("Register", ()=> {
        it("Should register a new User succesfully", async ()=> {
            req.body = {
                name: "Inioluwa",
                email: "ojoinioluwa@gmail.com",
                password: "12345678",
                phoneNumber: "09017889908",
                address: '123 Street',
            }

            User.findOne.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedPassword123")
            User.create.mockResolvedValue({
                _id: "userId123",
                name: "Inioluwa",
                email: "ojoinioluwa@gmail.com",
                password: "hashedPassword123",
                phoneNumber: "09017889908",
                address: '123 Street',
            })
            await userController.register(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({email: req.body.email});
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, "salt");
            expect(User.create).toHaveBeenCalledWith({
                ...req.body,
                password: "hashedPassword123"
            })
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User registered successfully",
                user: {
                    id: 'userId123',
                    name: req.body.name,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                }
            })

        })

        it("Should have returned an error", async()=> {
            req.body = {email: "ojoinioluwa05@gmail.com"}
            User.findOne.mockResolvedValue({email: req.body.email})

            await userController.register(req, res, next).rejects.toThrow("User already exists");

            expect(res.status).toHaveBeenCalledWith(400)
        })
    })
})