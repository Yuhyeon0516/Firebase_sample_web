import { useNavigate, useSearchParams } from "react-router-dom";
import { handleKakaoLogin } from "../../firebase";
import { useEffect } from "react";
import { Center, Spinner } from "@chakra-ui/react";

export default function Kakao() {
    const searchParams = useSearchParams();
    const code = searchParams[0].get("code");
    const navigate = useNavigate();

    useEffect(() => {
        handleKakaoLogin(code!, navigate);
    }, [code, navigate]);

    return (
        <Center mt={30} h={"100vh"}>
            <Spinner size={"xl"} color="yellow.300" thickness="10px" />
        </Center>
    );
}
