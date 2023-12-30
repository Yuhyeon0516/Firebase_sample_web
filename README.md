# Firebase Web 초기 셋팅

1. Firebase Console에서 프로젝트 만들기(https://console.firebase.google.com/?hl=ko)
2. 앱 추가하기에서 Web 추가
3. 앱 이름 작성 후 Firebase SDK 추가에 나타나는 apiKey, authDomain 등 유출되면 위험한 항목들을 `.env` 파일에 아래와 같이 작성해준다.
    ```
    REACT_APP_FIREBASE_API_KEY=
    REACT_APP_FIREBASE_AUTH_DOMAIN=
    REACT_APP_FIREBASE_PROJECT_ID=
    REACT_APP_FIREBASE_STORAGE_BUCKET=
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
    REACT_APP_FIREBASE_APP_ID=
    ```
4. `npm install firebase`
5. `firebase.ts`파일을 `src`폴더에 생성 후 아래와 같이 initial과정을 진행한다.

    ```javascript
    import { initializeApp } from "firebase/app";

    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    ```

# Firebase Auth(회원가입, 로그인)

1. Firebase Console에서 빌드 -> Authentication에서 사용할 로그인 제공업체를 활성화
2. `getAuth` 함수를 이용하여 auth의 정보를 가져옴(매개변수로 이전에 initial해둔 firebase app을 활용)

    ```javascript
    import { getAuth } from "firebase/auth";

    const auth = getAuth(app);
    ```

### Email & Password

-   회원가입

    1. `createUserWithEmailAndPassword` 함수를 이용하여 이전에 만들어둔 auth와 email, password를 매개변수로 하는 함수를 작성

        ```javascript
        import { getAuth } from "firebase/auth";

        export async function handleRegister(email: string, password: string) {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        ```

    2. 아래와 같이 회원가입 버튼이 눌렸을떄 위에 선언한 `handleRegister`를 사용하여 `try-catch`를 활용하여 error가 발생했을때 경우도 대응
        ```javascript
        async function handleSubmit(email: string, password: string) {
            try {
                await handleRegister(email, password);
                alert("회원가입 완료");
            } catch (error: any) {
                alert(error.code + error.message);
            }
        }
        ```

-   로그인

    1. `signInWithEmailAndPassword` 함수를 이용하여 이전에 만들어둔 auth와 입력받은 email, password를 매개변수로 활용하여 아래와 같이 작성

        ```javascript
        export async function handleLogin(email: string, password: string) {
            await signInWithEmailAndPassword(auth, email, password);
        }
        ```

    2. 아래와 같이 로그인 버튼이 눌렸을떄 위에 선언한 `handleLogin`를 사용하여 `try-catch`를 활용하여 error가 발생했을때 경우도 대응
        ```javascript
        async function handleSubmit(email: string, password: string) {
            try {
                await handleLogin(email, password);
                alert("로그인 완료");
            } catch (error: any) {
                alert(error.code + error.message);
            }
        }
        ```

-   회원가입 시 이메일 인증 기능을 사용하고 싶을때

    1. 아래와 같이 Firebase에서 제공해주는 `sendEmailVerification` 함수를 회원 가입 시 같이 사용하여 email을 발송

        ```javascript
        export async function handleRegister(email: string, password: string) {
            await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(auth.currentUser!);
        }
        ```

    2. 해당 인증을 진행하지 않으면 로그인 시 `signInWithEmailAndPassword`함수가 반환해주는 credential값에 emailVerified가 false로 반환이 되며 이를 이용하여 아래 코드와 같이 로그인 시 판단하여 `throw Error`로 대응해주면됨

        ```javascript
        export async function handleLogin(email: string, password: string) {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (!credential.user.emailVerified) {
                throw Error("이메일 인증 후 로그인해주세요.");
            }
        }
        ```

### Naver

1. 네이버 개발자 센터에서 앱 생성 및 로그인 API 권한을 받기(https://developers.naver.com/main/)
2. 앱을 생성하면 Clien ID와 Client Secret이 발급되고, 로그인 API 권한까지 받게되면 Redirect uri까지 필요한 정보가 모두 준비되어 아래와 같이 `.env`에 값을 셋팅한다.
    ```
    REACT_APP_NAVER_CLIENT_ID=
    REACT_APP_NAVER_CLIENT_SECRET=
    REACT_APP_NAVER_REDIRECT_URI=
    ```
3. 네이버 로그인 버튼이 눌리면 아래처럼 Naver 계정 인증 Page로 url을 redirect해준다.

    ```javascript
    export function handleNaverLoginRedirect() {
        const state = getUniqStateValue();
        const redirect_uri = process.env.REACT_APP_NAVER_REDIRECT_URI;
        const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
        const naver_auth_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_client_id}&state=${state}&redirect_uri=${redirect_uri}`;

        window.location.href = naver_auth_url;
    }
    ```

    - 위에 사용된 `state`의 경우 보안을 위한 유니크한 코드로 Naver Login Docs에서 가져온 아래 함수를 이용하여 랜덤하게 생성시킨다.

        ```javascript
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
        ```

4. Naver 인증 Page에서 로그인을 하면 로그인 API 권한을 받을때 사용하였던 redirect uri로 redirect해주면서 `searchParams`에 `code`와 `state`값을 같이 보내준다

    - 일단 이번 프로젝트에서는 redirect uri를 http://localhost:3000/naver로 셋팅함
    - Naver 인증 Page에서 로그인 후 http://localhost:3000/naver?code=xxxxxxxxxxx&state=xxxxxxxxxxx 이러한 uri로 redirect를 시켜줌

5. 그럼 위에서 code와 state의 값을 활용하여 회원 정보 접근을 위한 Token값을 가져오기 위해 아래 `naver_token_url` 형식과 같이 HTTP GET Request를 활용하여 값을 얻어온다.

    ```javascript
    export async function handleGetNaverLoginToken(
        code: string,
        state: string
    ) {
        const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
        const naver_client_secret = process.env.REACT_APP_NAVER_CLIENT_SECRET;
        const naver_token_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naver_client_id}&client_secret=${naver_client_secret}&code=${code}&state=${state}`;

        axios
            .get(naver_token_url)
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
    }
    ```

    - 일단 여기서 CORS 문제가 발생함
    - Naver에서는 보안상의 이슈로 Javascript를 사용하는 Front-end에서 API를 호출하는것을 허용하지 않음(Javascript를 사용하는 Back-end에서 CORS 처리를 하면 가능하다고함)
    - Naver에서 권장하는 시퀀스는 Back-end에 일전에 발급받은 `code`, `state`를 보내주고 Back-end에서 `Token` 정보를 얻고 로그인 관련 정보를 컨트롤하기를 권장하고있으나 현재 프로젝트에는 Front-end만 활용하고 싶은 상황이라 마땅치 않음
    - `cors-anywhere`를 배포 후 활용하여 CORS를 우회해보려했으나 실패(개발 환경에서 사용을 할 수 없음)
    - `http-proxy-middleware` library를 활용하여 아래와 같이 middleware를 구성하여 CORS를 우회해보니 CORS Error는 Clear!

        - `/src/setupProxy.js`

            ```javascript
            const { createProxyMiddleware } = require("http-proxy-middleware");

            module.exports = function (app) {
                app.use(
                    createProxyMiddleware("/token", {
                        target: "https://nid.naver.com",
                        pathRewrite: {
                            "^/token": "",
                        },
                        changeOrigin: true,
                    })
                );
            };
            ```

        - `handleGetNaverLoginToken` 함수내 url 변경

            ```javascript
            export async function handleGetNaverLoginToken(
                code: string,
                state: string
            ) {
                const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
                const naver_client_secret =
                    process.env.REACT_APP_NAVER_CLIENT_SECRET;
                const naver_token_url = `/token/oauth2.0/token?grant_type=authorization_code&client_id=${naver_client_id}&client_secret=${naver_client_secret}&code=${code}&state=${state}`;

                axios
                    .get(naver_token_url)
                    .then((result) => console.log(result))
                    .catch((error) => console.log(error));
            }
            ```

    - 그러나 reponse가 아래의 `Success`의 예시와 같은 json 형태로 전달되어야하는데 `Error`로 전달이 됨

        - Success

        ```json
        {
            "access_token": "AAAAQosjWDJieBiQZc3to9YQp6HDLvrmyKC+6+iZ3gq7qrkqf50ljZC+Lgoqrg",
            "refresh_token": "c8ceMEJisO4Se7uGisHoX0f5JEii7JnipglQipkOn5Zp3tyP7dHQoP0zNKHUq2gY",
            "token_type": "bearer",
            "expires_in": "3600"
        }
        ```

        - Error

        ```json
        {
            "error": "invalid_request",
            "error_description": "no valid data in session"
        }
        ```

    - 추가로 몇가지 테스트 진행 시 이전에 받아둔 `state`를 매개변수로 받아 재사용하면서 발생한 이슈였으며 아래와 같이 함수에서 다시 `state`의 값을 `getUniqStateValue` 함수를 이용하여 새로운 값으로 생성 후 HTTP GET Request 진행 시 아래와 같이 값을 얻을 수 있었다.

        ```json
        {
            "access_token": "AAAAPDnTzCKGLDngsZdAD0dIOYCd9u1Qbcxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "refresh_token": "cBVWvSSBaWQmDU4mHPUMGZahmxxxxxxxxxxxxxxxxxxxxxxx",
            "token_type": "bearer",
            "expires_in": "3600"
        }
        ```

    - 그럼 이제 위 정보를 가지고 Naver 회원 프로필 조회 API에 Request를 보내서 회원 정보를 가져오기로함

        - `src/setupProxy.js`에 하기 `middleware` 추가
            ```javascript
            app.use(
                createProxyMiddleware("/profile", {
                    target: "https://openapi.naver.com",
                    pathRewrite: {
                        "^/profile": "",
                    },
                    changeOrigin: true,
                })
            );
            ```
        - Profile을 가져오는 `getNaverProfile` 함수를 작성

            ```javascript
            async function getNaverProfile(accessToken: string) {
                const get_naver_profile_url = `/profile/v1/nid/me`;
                const headers = {
                    Authorization: "Bearer " + accessToken,
                };

                const result = await axios.get(get_naver_profile_url, {
                    headers,
                });

                return result;
            }
            ```

        - result 확인 시 아래와 같이 회원 정보 잘 가져옴
            ```json
            {
                "resultcode": "00",
                "message": "success",
                "response": {
                    "id": "wiAPIhbNIxxxxxx",
                    "email": "rladbgus0516@naver.com",
                    "mobile": "010-1234-5678",
                    "mobile_e164": "+821012345678",
                    "name": "\uae40\uc720\ud604"
                }
            }
            ```

    - 이제 Firebase에 위에서 얻은 정보를 전달하려고 봤더니 password없이 email만 가지고 로그인하려면 `Firebase-admin` 기능을 사용하여하는데 Front-end단에서 사용하기에 조금 버거운 느낌이 있음
    - 그래서 `Firebase-functions`를 Back-end로 운용해야할듯함
    - 오늘은 여기까지

### Kakao

---

# Firebase Storage(게시판)
