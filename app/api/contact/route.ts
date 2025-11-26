import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import * as React from "react";
import { ContactTemplate } from "@/app/contacto/ContactTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { nombre, email, institucion, mensaje } = await req.json();

  try {
    const data = await resend.emails.send({
      from: "onboarding@schometrics.com", // This will be replaced with your domain
      to: "contacto@schometrics.com",
      subject: "Nuevo Mensaje de Contacto de SchoMetrics",
      react: ContactTemplate({
        nombre,
        email,
        institucion,
        mensaje,
      }) as React.ReactElement,
    });

    return NextResponse.json({
      message: "Email sent successfully!",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
