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

### Kakao

---

# Firebase Storage(게시판)
