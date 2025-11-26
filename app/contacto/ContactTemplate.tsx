import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Text,
    Section,
} from "@react-email/components";
import * as React from "react";

interface ContactTemplateProps {
    nombre: string;
    email: string;
    institucion?: string;
    mensaje: string;
}

export const ContactTemplate: React.FC<Readonly<ContactTemplateProps>> = ({
    nombre,
    email,
    institucion,
    mensaje,
}) => (
    <Html>
        <Head />
        <Body
            style={{
                backgroundColor: "#ffffff",
                fontFamily:
                    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
            }}
        >
            <Container
                style={{
                    margin: "0 auto",
                    padding: "20px 0 48px",
                    width: "580px",
                }}
            >
                <Heading
                    style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Nuevo Mensaje de Contacto
                </Heading>
                <Section>
                    <Text>
                        Has recibido un nuevo mensaje a través del formulario de contacto de
                        SchoMetrics.
                    </Text>
                    <Text>
                        <strong>Nombre:</strong> {nombre}
                    </Text>
                    <Text>
                        <strong>Email:</strong> {email}
                    </Text>
                    {institucion && (
                        <Text>
                            <strong>Institución:</strong> {institucion}
                        </Text>
                    )}
                    <Text>
                        <strong>Mensaje:</strong>
                    </Text>
                    <Text>{mensaje}</Text>
                </Section>
            </Container>
        </Body>
    </Html>
);