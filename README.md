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

    1. `createUserWithEmailAndPassword` 함수를 이용하여 이전에 사용해둔 auth와 email, password를 매개변수로 하는 함수를 작성

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

### Naver

### Kakao

---

# Firebase Storage(게시판)
