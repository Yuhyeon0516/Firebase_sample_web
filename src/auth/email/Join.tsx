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
import { handleRegister } from "../../firebase";

export default function Join() {
    async function handleSubmit(email: string, password: string) {
        try {
            await handleRegister(email, password);
            alert("회원가입 완료");
        } catch (error: any) {
            alert(error.code + error.message);
        }
    }

    return (
        <VStack p={50} alignItems={"flex-start"}>
            <Heading mb={5}>회원가입</Heading>

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
                        회원가입
                    </Button>
                </Form>
            </Formik>
        </VStack>
    );
}
