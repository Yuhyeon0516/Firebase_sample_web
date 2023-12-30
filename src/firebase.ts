import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function handleRegister(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(auth.currentUser!);
}

export async function handleLogin(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (!credential.user.emailVerified) {
        throw Error("이메일 인증 후 로그인해주세요.");
    }
}

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

export function handleNaverLoginRedirect() {
    const state = getUniqStateValue();
    const redirect_uri = process.env.REACT_APP_NAVER_REDIRECT_URI;
    const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
    const naver_auth_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_client_id}&state=${state}&redirect_uri=${redirect_uri}`;

    window.location.href = naver_auth_url;
}

async function getNaverProfile(accessToken: string) {
    const get_naver_profile_url = `/profile/v1/nid/me`;
    const headers = {
        Authorization: "Bearer " + accessToken,
    };

    const result = await axios.get(get_naver_profile_url, { headers });

    return result;
}

export async function handleGetNaverLoginToken(code: string) {
    const state = getUniqStateValue();
    const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
    const naver_client_secret = process.env.REACT_APP_NAVER_CLIENT_SECRET;
    const naver_token_url = `/token/oauth2.0/token?grant_type=authorization_code&client_id=${naver_client_id}&client_secret=${naver_client_secret}&code=${code}&state=${state}`;

    const result = await axios.get(naver_token_url);

    return result;
}

interface IProfile {
    data: {
        response: {
            email: string;
            id: string;
            mobile: string;
            name: string;
        };
    };
}

export async function handleNaverLogin(code: string) {
    try {
        const token: any = await handleGetNaverLoginToken(code);
        const profile: IProfile = await getNaverProfile(
            token.data.access_token
        );
    } catch (error: any) {
        alert(error.message);
    }
}
