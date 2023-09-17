"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    Authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessiontoken: { type: String, select: false },
    }
});
exports.userModel = mongoose_1.default.model('User', userSchema);
const getUsers = () => exports.userModel.find();
exports.getUsers = getUsers;
const getUserByEmail = (email) => exports.userModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => exports.userModel.findOne({
    'authentication.sessionToken': sessionToken,
});
exports.getUserBySessionToken = getUserBySessionToken;
const getUserById = (id) => exports.userModel.findById(id);
exports.getUserById = getUserById;
const createUser = (values) => new exports.userModel(values)
    .save().then((user) => user.toObject());
exports.createUser = createUser;
const deleteUserById = (id) => exports.userModel.findOneAndDelete({ _id: id });
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => exports.userModel.findByIdAndUpdate(id, values);
exports.updateUserById = updateUserById;
//# sourceMappingURL=users.js.map