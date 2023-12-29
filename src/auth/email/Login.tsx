import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { handleLogin } from "../../firebase";

export default function Login() {
    async function handleSubmit(email: string, password: string) {
        try {
            await handleLogin(email, password);
            alert("로그인 완료");
        } catch (error: any) {
            alert(error.code + error.message);
        }
    }

    return (
        <VStack p={50} alignItems={"flex-start"}>
            <Heading mb={5}>로그인</Heading>

            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values) => {
                    const { email, password } = values;

                    await handleSubmit(email, password);
                }}
            >
                <Form>
                    <Field name="email">
                        {({ field }: { field: any }) => (
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input {...field} placeholder="email" />
                            </FormControl>
                        )}
                    </Field>
                    <Box h={5} />
                    <Field name="password">
                        {({ field }: { field: any }) => (
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="password"
                                />
                            </FormControl>
                        )}
                    </Field>

                    <Box h={5} />
                    <Button colorScheme="blue" type="submit">
                        로그인
                    </Button>
                </Form>
            </Formik>
        </VStack>
    );
}
