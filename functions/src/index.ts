import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import axios from "axios";
import { config } from "dotenv";
import { INaverProfile } from "./types";

config();

const app = express();
app.use(cors({ origin: true }));

function getUniqStateValue() {
    var stat_str = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
    return stat_str;
}

async function getNaverToken(code: string) {
    const state = getUniqStateValue();
    const naver_client_id = process.env.NAVER_CLIENT_ID;
    const naver_client_secret = process.env.NAVER_CLIENT_SECRET;
    const naver_token_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naver_client_id}&client_secret=${naver_client_secret}&code=${code}&state=${state}`;

    try {
        const res = await axios.get(naver_token_url);

        return res.data;
    } catch (error: any) {
        throw Error(error);
    }
}

async function getNaverUser(token: string) {
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const res = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers,
    });

    return res.data;
}

function getAdminApp() {
    const firebaseAccountKey = JSON.parse(
        process.env.FIREBASE_ACCOUNT_KEY || ""
    );

    const app = !admin.apps.length
        ? admin.initializeApp({
              credential: admin.credential.cert(firebaseAccountKey),
          })
        : admin.app();

    return app;
}

async function updateOrCreateUser(user: INaverProfile) {
    const app = getAdminApp();
    const auth = admin.auth(app);

    const naverAccount = user.response;
    const properties = {
        uid: `naver:${naverAccount.id}`,
        provider: "NAVER",
        displayName: naverAccount.name,
        email: naverAccount.email,
        emailVerified: true,
    };

    try {
        return await auth.updateUser(properties.uid, properties);
    } catch (error: any) {
        if (error.code === "auth/user-not-found") {
            return await auth.createUser(properties);
        }
        throw Error(error);
    }
}

app.post("/naver", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            code: 400,
            message: "Code is a required parameter",
        });
    }
    const response = await getNaverToken(code);

    const token = response.access_token;
    const user = await getNaverUser(token);

    const authUser = await updateOrCreateUser(user);
    const firebaseToken = await admin
        .auth()
        .createCustomToken(authUser.uid, { provider: "NAVER" });

    return res.status(200).json({
        firebaseToken,
    });
});

exports.auth = functions
    .runWith({
        secrets: [
            "FIREBASE_ACCOUNT_KEY",
            "NAVER_CLIENT_ID",
            "NAVER_CLIENT_SECRET",
        ],
    })
    .https.onRequest(app);