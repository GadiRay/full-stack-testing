"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const Joi = __importStar(require("joi"));
const express_joi_validation_1 = require("express-joi-validation");
const db_1 = __importDefault(require("./db"));
const usersService_1 = require("./usersService");
const app = (0, express_1.default)();
const validator = (0, express_joi_validation_1.createValidator)();
const userParamsSchema = Joi.object({
    userId: Joi.number().required(),
});
const userBodySchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
});
const port = 3001;
const usersService = new usersService_1.UsersService(db_1.default);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.post('/api/v1/users', validator.body(userBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersService.addUser(req.body);
        return res.json(user);
    }
    catch (error) {
        return next(error);
    }
}));
app.get('/api/v1/users/:userId', validator.params(userParamsSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersService.getUser(req.params.userId);
        if (!user) {
            return res.status(404).send(`user ${req.params.userId} not found`);
        }
        return res.json(user);
    }
    catch (error) {
        return next(error);
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
exports.default = app;
