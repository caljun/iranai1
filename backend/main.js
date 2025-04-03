require("dotenv").config(); // 環境変数を読み込む
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors()); // フロントエンドとの通信を許可
app.use(bodyParser.json()); // リクエストを解析

// MongoDB に接続
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB に接続成功"))
  .catch(err => console.error("❌ MongoDB 接続エラー:", err));

// **ユーザースキーマとモデル**
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// **ユーザー登録エンドポイント**
app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // **メールアドレスの重複チェック**
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
        }

        // **パスワードをハッシュ化**
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // **ユーザーをデータベースに保存**
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "✅ ユーザー登録完了！" });
    } catch (error) {
        res.status(500).json({ message: "❌ サーバーエラー", error });
    }
});

// **ログインエンドポイント**
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // **ユーザーが存在するか確認**
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ ユーザーが見つかりません。" });
        }

        // **パスワードの確認**
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "❌ パスワードが間違っています。" });
        }

        // **JWT トークンを発行**
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "✅ ログイン成功！", token });
    } catch (error) {
        res.status(500).json({ message: "❌ サーバーエラー", error });
    }
});

// **認証が必要なエンドポイント（例: プロフィール取得）**
app.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: "❌ ユーザーが見つかりません。" });
        }

        res.json({ email: user.email, message: "✅ プロフィール取得成功！" });
    } catch (error) {
        res.status(500).json({ message: "❌ サーバーエラー", error });
    }
});

// **JWT 認証ミドルウェア**
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "❌ アクセス拒否: トークンがありません。" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "❌ 無効なトークンです。" });
        }
        req.user = decoded;
        next();
    });
}

// **サーバー起動**
app.listen(PORT, () => {
    console.log(`🚀 サーバーがポート ${PORT} で起動中`);
});