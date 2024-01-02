import { Button, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { handleKakaoLoginRedirect, handleNaverLoginRedirect } from "./firebase";

export default function Home() {
    const navigate = useNavigate();

    return (
        <Center gap={20} mt={30}>
            <Button onClick={() => navigate("/login")}>로그인</Button>
            <Button onClick={() => navigate("/join")}>회원가입</Button>
            <Button onClick={handleNaverLoginRedirect}>네이버 로그인</Button>
            <Button onClick={handleKakaoLoginRedirect}>카카오 로그인</Button>
        </Center>
    );
}
