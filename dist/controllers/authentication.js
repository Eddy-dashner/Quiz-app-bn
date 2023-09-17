"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.logout = exports.login = void 0;
const users_1 = require("../db/users");
const helpers_1 = require("../helpers");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: "invalid credintials." });
        }
        const user = await (0, users_1.getUserByEmail)(email).select('+Authentication.salt +Authentication.password');
        if (!user) {
            return res.status(400).send({ message: "please signIn before login" });
        }
        const expectedHash = (0, helpers_1.authentication)(user.Authentication.salt, password);
        if (user.Authentication.password != expectedHash) {
            res.status(403).send({ message: "invalid credintials" });
        }
        const salt = (0, helpers_1.random)();
        user.Authentication.sessiontoken = (0, helpers_1.authentication)(salt, user._id.toString());
        await user.save();
        res.cookie('EDDY-AUTH', user.Authentication.sessiontoken, { domain: 'localhost', path: '/' });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.login = login;
//////logout part 
const logout = async (req, res) => {
    try {
        res.clearCookie('EDDY-AUTH', { domain: 'localhost', path: '/' });
        console.log('User logged out:');
        return res.status(200).send({ message: "Logged out successfully." });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.logout = logout;
////sign in part 
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        console.log(req.body);
        if (!email || !password || !username) {
            return res.status(400).send({ message: "forbidden." });
        }
        const existingUser = await (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            console.log('existing');
            return res.status(400).send({ message: "user already exist." });
        }
        const salt = (0, helpers_1.random)();
        const user = await (0, users_1.createUser)({
            email,
            username,
            Authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password)
            }
        });
        return res.status(200).send({ message: "user successfully registered." });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.register = register;
//# sourceMappingURL=authentication.js.map