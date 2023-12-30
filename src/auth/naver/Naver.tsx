import { useSearchParams } from "react-router-dom";
import { handleNaverLogin } from "../../firebase";

export default function Naver() {
    const searchParams = useSearchParams();
    const code = searchParams[0].get("code");

    handleNaverLogin(code!);

    return <div>Naver</div>;
}
