import { Button, VStack } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <VStack p={50} gap={10} alignItems={"flex-start"}>
            <Button onClick={() => navigate("/login")}>로그인</Button>
            <Button onClick={() => navigate("/join")}>회원가입</Button>
            {/* <Button>네이버 로그인</Button>
            <Button>카카오 로그인</Button> */}
        </VStack>
    );
}
