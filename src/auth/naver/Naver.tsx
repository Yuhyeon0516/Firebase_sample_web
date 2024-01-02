import { useNavigate, useSearchParams } from "react-router-dom";
import { handleNaverLogin } from "../../firebase";
import { Center, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Naver() {
    const searchParams = useSearchParams();
    const code = searchParams[0].get("code");
    const navigate = useNavigate();

    useEffect(() => {
        handleNaverLogin(code!, navigate);
    }, [code, navigate]);

    return (
        <Center mt={30} h={"100vh"}>
            <Spinner size={"xl"} color="green.400" thickness="10px" />
        </Center>
    );
}
