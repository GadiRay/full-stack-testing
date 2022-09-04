"use strict";
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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../db"));
describe('users service', () => {
    describe('POST /users', () => {
        it('should return new user for a valid request', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const data = {
                firstName: 'Gadi',
                lastName: 'Raymond',
                email: 'gadi@wix.com',
            };
            // Act
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/api/v1/users')
                .send(data)
                .expect(200);
            // Assert
            expect(res.body.firstName).toBe(data.firstName);
            expect(res.body.lastName).toBe(data.lastName);
            expect(res.body.email).toBe(data.email);
            expect(res.body.id).toBeGreaterThan(0);
            expect(res.body.bitcoins).toBeGreaterThanOrEqual(0);
            expect(res.body.bitcoins).toBeLessThanOrEqual(10);
        }));
        it('should return bad request when missing required firstName in the request', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const data = { lastName: 'Raymond', email: 'gadi@wix.com' };
            // Act + Assert
            yield (0, supertest_1.default)(app_1.default).post('/api/v1/users').send(data).expect(400);
        }));
        it('should return bad request when email is not valid in the request', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const data = {
                firstName: 'Gadi',
                lastName: 'Raymond',
                email: 'gadi-wix.com',
            };
            // Act + Assert
            yield (0, supertest_1.default)(app_1.default).post('/api/v1/users').send(data).expect(400);
        }));
        it('should return internal server error when pg throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const data = {
                firstName: 'Gadi',
                lastName: 'Raymond',
                email: 'gadi@wix.com',
            };
            const connect = db_1.default.connect;
            const query = db_1.default.query;
            db_1.default.connect = jest.fn();
            db_1.default.query = jest.fn().mockRejectedValue(new Error('db error'));
            // Act + Assert
            yield (0, supertest_1.default)(app_1.default).post('/api/v1/users').send(data).expect(500);
            db_1.default.connect = connect;
            db_1.default.query = query;
        }));
    });
    describe('GET /users/:userId', () => {
        it('should return the same user we insert', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const data = {
                firstName: 'Gadi',
                lastName: 'Raymond',
                email: 'gadi@wix.com',
            };
            const postRes = yield (0, supertest_1.default)(app_1.default)
                .post('/api/v1/users')
                .send(data)
                .expect(200);
            // Act
            const getRes = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/users/${postRes.body.id}`)
                .expect(200);
            // Assert
            expect(getRes.body).toStrictEqual(postRes.body);
        }));
        it('should return 400 when userId is not a number', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const invalidUserId = 'some-user-id';
            // Act + Assert
            yield (0, supertest_1.default)(app_1.default).get(`/api/v1/users/${invalidUserId}`).expect(400);
        }));
        it('should return 404 when user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const notFoundUserId = 99999;
            // Act + Assert
            yield (0, supertest_1.default)(app_1.default).get(`/api/v1/users/${notFoundUserId}`).expect(404);
        }));
    });
});
