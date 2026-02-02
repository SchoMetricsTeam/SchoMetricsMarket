import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Text,
    Section,
    Preview,
    Hr,
    Img,
    Link,
    Row,
    Column,
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
}) => {
    const previewText = `Nuevo mensaje de ${nombre} - SchoMetrics`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header con Brand Color */}
                    <Section style={header}>
                        <Heading style={brandTitle}>SchoMetrics</Heading>
                    </Section>

                    {/* Contenido Principal */}
                    <Section style={content}>
                        <Heading style={h1}>Nuevo Contacto Recibido</Heading>
                        <Text style={paragraph}>
                            Un usuario ha completado el formulario de contacto en la plataforma.
                            Aquí están los detalles para su seguimiento.
                        </Text>

                        {/* Tarjeta de Datos */}
                        <Section style={dataBox}>
                            <Row style={row}>
                                <Column style={columnLabel}>Nombre:</Column>
                                <Column style={columnValue}>{nombre}</Column>
                            </Row>
                            <Hr style={divider} />
                            <Row style={row}>
                                <Column style={columnLabel}>Email:</Column>
                                <Column style={columnValue}>
                                    <Link href={`mailto:${email}`} style={link}>
                                        {email}
                                    </Link>
                                </Column>
                            </Row>
                            {institucion && (
                                <>
                                    <Hr style={divider} />
                                    <Row style={row}>
                                        <Column style={columnLabel}>Institución:</Column>
                                        <Column style={columnValue}>{institucion}</Column>
                                    </Row>
                                </>
                            )}
                        </Section>

                        <Text style={labelMessage}>Mensaje:</Text>
                        <Section style={messageBox}>
                            <Text style={messageText}>{mensaje}</Text>
                        </Section>

                        <Text style={footerText}>
                            Este es un mensaje automático enviado desde el servidor de SchoMetrics.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Estilos
const main = {
    backgroundColor: "#f1f5f9",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: "20px 0",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    maxWidth: "600px",
};

const header = {
    backgroundColor: "#10b981", // Emerald 500
    padding: "20px",
    textAlign: "center" as const,
};

const brandTitle = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
    letterSpacing: "0.5px",
};

const content = {
    padding: "30px 40px",
};

const h1 = {
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 15px",
    textAlign: "center" as const,
};

const paragraph = {
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "24px",
    textAlign: "center" as const,
    marginBottom: "25px",
};

const dataBox = {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    padding: "15px 20px",
};

const row = {
    padding: "8px 0",
};

const columnLabel = {
    width: "30%",
    fontWeight: "600",
    color: "#475569",
    fontSize: "14px",
};

const columnValue = {
    width: "70%",
    color: "#1e293b",
    fontSize: "14px",
};

const divider = {
    borderColor: "#e2e8f0",
    margin: "5px 0",
};

const link = {
    color: "#10b981",
    textDecoration: "none",
};

const labelMessage = {
    fontWeight: "600",
    color: "#475569",
    marginTop: "25px",
    marginBottom: "10px",
    fontSize: "15px",
};

const messageBox = {
    backgroundColor: "#f0fdf4", // Verde muy claro
    borderLeft: "4px solid #10b981",
    borderRadius: "4px",
    padding: "15px",
};

const messageText = {
    color: "#334155",
    fontSize: "14px",
    lineHeight: "22px",
    fontStyle: "italic",
    margin: "0",
};

const footerText = {
    color: "#94a3b8",
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "40px",
};