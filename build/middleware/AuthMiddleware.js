import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || '';
export default function AuthMiddleware(req, res, next) {
    var _a;
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
        if (!token) {
            res.status(403).json({ message: 'Not authorized' });
        }
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload.user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Not authorized' });
    }
}
//# sourceMappingURL=AuthMiddleware.js.map