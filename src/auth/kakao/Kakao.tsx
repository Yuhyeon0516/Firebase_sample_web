import { useSearchParams } from "react-router-dom";
import { handleKakaoLogin } from "../../firebase";

export default function Kakao() {
    const searchParams = useSearchParams();
    const code = searchParams[0].get("code");

    handleKakaoLogin(code!);

    return <div>Kakao</div>;
}
