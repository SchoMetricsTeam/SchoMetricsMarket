import jsPDF from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LOGO_BASE64, MATERIAL_TYPE_LABELS } from "./constants";
import autoTable from "jspdf-autotable";

interface PurchaseReceiptData {
  purchaseFolio: string;
  totalAmount: number;
  buyerName: string;
  buyerRFC: string;
  buyerAddress: string;
  buyerPhone: string;
  transporterName: string;
  transporterPhone: string;
  transporterCredential: string;
  collectionDate: string;
  collectionTime: string;
  paymentStatus: string;
  createdAt: string;
  material: {
    folio: string;
    title: string;
    materialType: string;
    quantity: number;
    city: string;
    state: string;
    address: string;
    postalCode: string;
    schedule: string;
    location: string;
    status: string;
    user: {
      name: string;
      profile: {
        address: string;
        postalCode: string;
        phone: string;
        cct: string;
        rfc: string;
        city: string;
        state: string;
      };
    };
  };
}
// Para VENDEDOR
export function generateSaleReceiptPDF(
  purchase: PurchaseReceiptData
): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new jsPDF();

    // Configuración de colores
    const primaryColor: [number, number, number] = [92, 62, 148]; // Morado Indigo
    const secondaryColor: [number, number, number] = [71, 85, 105]; // Gris oscuro
    const lightGray: [number, number, number] = [248, 250, 252]; // Gris claro
    const linkColor: [number, number, number] = [34, 197, 94]; // Verde

    // Header con logo y título
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 33, "F");

    doc.setTextColor(255, 255, 255);
    doc.addImage(LOGO_BASE64, "PNG", 20, 3, 50, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Comprobante de Compra Electrónica - VENDEDOR", 20, 29);

    // Información del folio y fecha
    doc.setTextColor(...lightGray);
    doc.setFontSize(10);
    doc.text(`Folio de Validez: ${purchase.material.folio}`, 130, 20);
    doc.text(
      `Fecha: ${format(new Date(purchase.createdAt), "dd/MM/yyyy HH:mm", {
        locale: es,
      })}`,
      130,
      26
    );

    let yPosition = 45;

    // Función helper para agregar secciones
    const addSection = (
      title: string,
      content: string[],
      startY: number
    ): number => {
      doc.setFillColor(...lightGray);
      doc.rect(15, startY - 5, 180, 8, "F");

      doc.setTextColor(...primaryColor);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, startY);

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      let currentY = startY + 8;
      content.forEach((line) => {
        doc.text(line, 20, currentY);
        currentY += 5;
      });

      return currentY + 5;
    };

    // --- INICIO DE MODIFICACIÓN ---
    // Información del Material
    let materialContent = [
      `Título: ${purchase.material.title}`,
      `Tipo: ${
        MATERIAL_TYPE_LABELS[
          purchase.material.materialType as keyof typeof MATERIAL_TYPE_LABELS
        ]
      }`,
      `Cantidad: ${purchase.material.quantity} kg`,
      `Precio Total: $${purchase.totalAmount.toFixed(2)} MXN`,
      `Ubicación: ${purchase.material.address}, ${purchase.material.city}, ${purchase.material.state}`,
      `Código Postal: ${purchase.material.postalCode}`,
      `Horario de Atención: ${purchase.material.schedule}`,
    ];
    yPosition = addSection(
      "INFORMACIÓN DEL MATERIAL",
      materialContent,
      yPosition
    );

    // Añadir el enlace de Google Maps
    const mapsUrl = `${purchase.material.location}`;
    doc.setTextColor(...linkColor);
    doc.setFont("helvetica", "normal");
    // La posición 'y' se ajusta para que aparezca justo después del contenido anterior
    doc.textWithLink("¿Cómo llegar?", 20, yPosition - 5, { url: mapsUrl });
    yPosition += 5; // Ajustamos la posición para la siguiente sección
    // --- FIN DE MODIFICACIÓN ---

    // Información de la Escuela
    yPosition = addSection(
      "INFORMACIÓN DEL VENDEDOR",
      [
        `Nombre: ${purchase.material.user.name}`,
        `Teléfono de Contacto: ${purchase.material.user.profile.phone}`,
        `RFC: ${purchase.material.user.profile.rfc}`,
        `CCT: ${purchase.material.user.profile.cct}`,
        `Dirección: ${purchase.material.user.profile.address}`,
        `Ciudad: ${purchase.material.user.profile.city}, ${purchase.material.user.profile.state}`,
        `Código Postal: ${purchase.material.user.profile.postalCode}`,
      ],
      yPosition
    );

    // Información de la Empresa Compradora
    yPosition = addSection(
      "INFORMACIÓN DEL COMPRADOR",
      [
        `Nombre: ${purchase.buyerName}`,
        `RFC: ${purchase.buyerRFC}`,
        `Dirección: ${purchase.buyerAddress}`,
        `Teléfono: ${purchase.buyerPhone}`,
      ],
      yPosition
    );

    // Información del Transportista
    yPosition = addSection(
      "INFORMACIÓN DEL TRANSPORTISTA",
      [
        `Nombre: ${purchase.transporterName}`,
        `Teléfono: ${purchase.transporterPhone}`,
        `Identificación del Transportista: ${purchase.transporterCredential}`,
      ],
      yPosition
    );

    // Información de Recolección
    yPosition = addSection(
      "INFORMACIÓN DE RECOLECCIÓN",
      [
        `Fecha: ${format(new Date(purchase.collectionDate), "dd/MM/yyyy", {
          locale: es,
        })}`,
        `Hora: ${purchase.collectionTime}`,
        `Zona Horaria: Ciudad de México (GMT-6)`,
      ],
      yPosition
    );

    // Footer
    doc.setFillColor(...primaryColor);
    doc.rect(0, 280, 210, 17, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "SchoMetrics - Promoviendo una sostenibilidad ecológica y económica en México.",
      20,
      290
    );
    doc.text(
      `Generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
      150,
      290
    );

    // Convert to buffer
    const pdfOutput = doc.output("arraybuffer");
    resolve(Buffer.from(pdfOutput));
  });
}

// Para COMPRADOR
export function generatePurchaseReceipt(purchase: PurchaseReceiptData): void {
  const doc = new jsPDF();

  // Configuración de colores
  const primaryColor: [number, number, number] = [34, 197, 94]; // Verde
  const secondaryColor: [number, number, number] = [71, 85, 105]; // Gris oscuro
  const lightGray: [number, number, number] = [248, 250, 252]; // Gris claro
  const linkColor: [number, number, number] = [34, 197, 94]; // Verde

  // Header con logo y título
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 33, "F");

  doc.setTextColor(255, 255, 255);
  doc.addImage(LOGO_BASE64, "PNG", 20, 3, 50, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Comprobante de Compra Electrónica - COMPRADOR", 20, 29);

  // Información del folio y fecha
  doc.setTextColor(...lightGray);
  doc.setFontSize(10);
  doc.text(`Folio de Validez: ${purchase.purchaseFolio}`, 130, 20);
  doc.text(
    `Fecha: ${format(new Date(purchase.createdAt), "dd/MM/yyyy HH:mm", {
      locale: es,
    })}`,
    130,
    26
  );

  let yPosition = 45;

  // Función helper para agregar secciones
  const addSection = (
    title: string,
    content: string[],
    startY: number
  ): number => {
    doc.setFillColor(...lightGray);
    doc.rect(15, startY - 5, 180, 8, "F");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, startY);

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let currentY = startY + 8;
    content.forEach((line) => {
      doc.text(line, 20, currentY);
      currentY += 5;
    });

    return currentY + 5;
  };

  // --- INICIO DE MODIFICACIÓN ---
  // Información del Material
  let materialContent = [
    `Título: ${purchase.material.title}`,
    `Tipo: ${
      MATERIAL_TYPE_LABELS[
        purchase.material.materialType as keyof typeof MATERIAL_TYPE_LABELS
      ]
    }`,
    `Cantidad: ${purchase.material.quantity} kg`,
    `Precio Total: $${purchase.totalAmount.toFixed(2)} MXN`,
    `Ubicación: ${purchase.material.address}, ${purchase.material.city}, ${purchase.material.state}`,
    `Código Postal: ${purchase.material.postalCode}`,
    `Horario de Atención: ${purchase.material.schedule}`,
  ];
  yPosition = addSection(
    "INFORMACIÓN DEL MATERIAL",
    materialContent,
    yPosition
  );

  // Añadir el enlace de Google Maps
  const mapsUrl = `${purchase.material.location}`;
  doc.setTextColor(...linkColor);
  doc.setFont("helvetica", "normal");
  doc.textWithLink("¿Cómo llegar?", 20, yPosition - 5, { url: mapsUrl });
  yPosition += 5; // Ajustamos la posición para la siguiente sección
  // --- FIN DE MODIFICACIÓN ---

  // Información de la Escuela
  yPosition = addSection(
    "INFORMACIÓN DEL VENDEDOR",
    [
      `Nombre: ${purchase.material.user.name}`,
      `Teléfono de Contacto: ${purchase.material.user.profile.phone}`,
      `RFC: ${purchase.material.user.profile.rfc}`,
      `CCT: ${purchase.material.user.profile.cct}`,
      `Dirección: ${purchase.material.user.profile.address}`,
      `Ciudad: ${purchase.material.user.profile.city}, ${purchase.material.user.profile.state}`,
      `Código Postal: ${purchase.material.user.profile.postalCode}`,
    ],
    yPosition
  );

  // Información de la Empresa Compradora
  yPosition = addSection(
    "INFORMACIÓN DEL COMPRADOR",
    [
      `Nombre: ${purchase.buyerName}`,
      `RFC: ${purchase.buyerRFC}`,
      `Dirección: ${purchase.buyerAddress}`,
      `Teléfono: ${purchase.buyerPhone}`,
    ],
    yPosition
  );

  // Información del Transportista
  yPosition = addSection(
    "INFORMACIÓN DEL TRANSPORTISTA",
    [
      `Nombre: ${purchase.transporterName}`,
      `Teléfono: ${purchase.transporterPhone}`,
      `Identificación del Transportista: ${purchase.transporterCredential}`,
    ],
    yPosition
  );

  // Información de Recolección
  yPosition = addSection(
    "INFORMACIÓN DE RECOLECCIÓN",
    [
      `Fecha: ${format(new Date(purchase.collectionDate), "dd/MM/yyyy", {
        locale: es,
      })}`,
      `Hora: ${purchase.collectionTime}`,
      `Zona Horaria: Ciudad de México (GMT-6)`,
    ],
    yPosition
  );

  // Footer
  doc.setFillColor(...primaryColor);
  doc.rect(0, 280, 210, 17, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "SchoMetrics - Promoviendo una sostenibilidad ecológica y económica en México.",
    20,
    290
  );
  doc.text(
    `Generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
    150,
    290
  );

  // Descargar el PDF
  doc.save(`Comprobante_${purchase.purchaseFolio}.pdf`);
}

// Para COMPRADOR - COMPRAS TOTALES
export function generateAllPurchasesReport(
  purchases: PurchaseReceiptData[]
): void {
  const doc = new jsPDF();

  // 1. Filtrar las compras que cumplen con el estado "COMPLETED" y "PURCHASED"
  const filteredPurchases = purchases.filter(
    (p) => p.paymentStatus === "COMPLETED" && p.material.status === "PURCHASED"
  );

  // Configuración de colores
  const primaryColor: [number, number, number] = [5, 12, 156]; // Azul Base
  const greenColor: [number, number, number] = [34, 197, 94]; // Verde
  const sellerColor: [number, number, number] = [92, 62, 148]; // Morado Indigo
  const secondaryColor: [number, number, number] = [71, 85, 105]; // Gris oscuro
  const lightGray: [number, number, number] = [248, 250, 252]; // Gris claro

  // Header (se mantiene igual)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 33, "F");
  doc.setTextColor(255, 255, 255);
  doc.addImage(LOGO_BASE64, "PNG", 20, 3, 50, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Informe de Mis Compras ", 20, 28);
  doc.setTextColor(...lightGray);
  doc.setFontSize(10);

  // 2. Comprobar si hay compras para mostrar después de filtrar
  if (filteredPurchases.length === 0) {
    // --- Bloque para cuando NO hay compras ---
    doc.text(`Total de Compras: 0`, 150, 20);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
      150,
      26
    );

    // Texto explicativo centrado
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const noPurchasesText = "No se encontraron compras finalizadas.";
    const textWidth = doc.getTextWidth(noPurchasesText);
    const centerX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(noPurchasesText, centerX, 140);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const helpText =
      'Solo se muestran las compras con estado de pago "Completado" y material "Comprado".';
    const helpTextWidth = doc.getTextWidth(helpText);
    const helpCenterX = (doc.internal.pageSize.getWidth() - helpTextWidth) / 2;
    doc.text(helpText, helpCenterX, 150);
  } else {
    // --- Bloque para cuando SÍ hay compras (código original) ---
    // IMPORTANTE: Usar 'filteredPurchases' a partir de ahora

    doc.text(`Total de Compras: ${filteredPurchases.length}`, 150, 20);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
      150,
      26
    );

    let yPosition = 45;

    // Resumen Ejecutivo (usando los datos filtrados)
    const totalAmount = filteredPurchases.reduce(
      (sum, p) => sum + p.totalAmount,
      0
    );
    const totalQuantity = filteredPurchases.reduce(
      (sum, p) => sum + p.material.quantity,
      0
    );

    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition - 5, 180, 20, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN EJECUTIVO", 20, yPosition);
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Total Invertido: $${totalAmount.toFixed(2)} MXN`,
      20,
      yPosition + 8
    );
    doc.text(`Total de Material: ${totalQuantity} kg`, 20, yPosition + 13);

    yPosition += 30;

    // Título de la tabla
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLE DE COMPRAS", 15, yPosition);
    yPosition += 8;

    const tableColumns = [
      "FOLIO DE VALIDEZ",
      "Material",
      "Vendedor",
      "Cantidad (kg)",
      "Monto (MXN)",
      "Fecha Compra",
      "Fecha Recolección",
    ];

    // Creación de filas de la tabla (usando los datos filtrados)
    const tableRows = filteredPurchases.map((purchase) => {
      return [
        {
          content: purchase.purchaseFolio,
          styles: { textColor: greenColor, fontStyle: "bold" },
        },
        purchase.material.title,
        {
          content: purchase.material.user.name.toUpperCase(),
          styles: { textColor: sellerColor, fontStyle: "bold" },
        },
        purchase.material.quantity.toString(),
        {
          content: `$${purchase.totalAmount.toFixed(2)}`,
          styles: { textColor: secondaryColor, fontStyle: "bold" },
        },
        format(new Date(purchase.createdAt), "dd/MM/yy", { locale: es }),
        `${format(new Date(purchase.collectionDate), "dd/MM/yy", {
          locale: es,
        })} ${purchase.collectionTime}`,
      ];
    });

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows as [],
      startY: yPosition,
      didDrawPage: (data) => {
        // Footer en cada página
        doc.setFillColor(...primaryColor);
        doc.rect(0, 280, 210, 17, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("SchoMetrics - Informe de Compras", 20, 290);
        doc.text(
          `Página ${data.pageNumber} de ${doc.getNumberOfPages()}`,
          170,
          290
        );
      },
    });
  }

  // El footer se agrega aquí solo para el caso de "no compras".
  // Para el reporte con tabla, el footer se gestiona en el `didDrawPage` de autoTable.
  if (filteredPurchases.length === 0) {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 280, 210, 17, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("SchoMetrics - Informe de Compras", 20, 290);
  }

  doc.save(`Informe_Compras_${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

// Para VENDEDOR - VENTAS TOTALES
export function generateAllSalesReport(purchases: PurchaseReceiptData[]): void {
  const doc = new jsPDF();

  // 1. Filtrar las compras que cumplen con el estado "COMPLETED" y "PURCHASED"
  const filteredPurchases = purchases.filter(
    (p) => p.paymentStatus === "COMPLETED" && p.material.status === "PURCHASED"
  );

  // Configuración de colores
  const primaryColor: [number, number, number] = [5, 12, 156]; // Azul Base
  const greenColor: [number, number, number] = [34, 197, 94]; // Verde
  const schoolColor: [number, number, number] = [22, 153, 118]; // Teal
  const secondaryColor: [number, number, number] = [71, 85, 105]; // Gris oscuro
  const lightGray: [number, number, number] = [248, 250, 252]; // Gris claro

  // Header (se mantiene igual)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 33, "F");
  doc.setTextColor(255, 255, 255);
  doc.addImage(LOGO_BASE64, "PNG", 20, 3, 50, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Informe General de Mis Ventas", 20, 28);
  doc.setTextColor(...lightGray);
  doc.setFontSize(10);

  // 2. Comprobar si hay compras para mostrar después de filtrar
  if (filteredPurchases.length === 0) {
    // --- Bloque para cuando NO hay compras ---
    doc.text(`Total de Ventas: 0`, 150, 20);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
      150,
      26
    );

    // Texto explicativo centrado
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const noPurchasesText = "No se encontraron ventas finalizadas.";
    const textWidth = doc.getTextWidth(noPurchasesText);
    const centerX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(noPurchasesText, centerX, 140);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const helpText =
      'Solo se muestran las ventas con estado de pago "Completado" y material "Comprado".';
    const helpTextWidth = doc.getTextWidth(helpText);
    const helpCenterX = (doc.internal.pageSize.getWidth() - helpTextWidth) / 2;
    doc.text(helpText, helpCenterX, 150);
  } else {
    // --- Bloque para cuando SÍ hay compras (código original) ---
    // IMPORTANTE: Usar 'filteredPurchases' a partir de ahora

    doc.text(`Total de Ventas: ${filteredPurchases.length}`, 150, 20);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
      150,
      26
    );

    let yPosition = 45;

    // Resumen Ejecutivo (usando los datos filtrados)
    const totalAmount = filteredPurchases.reduce(
      (sum, p) => sum + p.totalAmount,
      0
    );
    const totalQuantity = filteredPurchases.reduce(
      (sum, p) => sum + p.material.quantity,
      0
    );

    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition - 5, 180, 20, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN EJECUTIVO", 20, yPosition);
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Total Generado: $${totalAmount.toFixed(2)} MXN`,
      20,
      yPosition + 8
    );
    doc.text(`Total de Material: ${totalQuantity} kg`, 20, yPosition + 13);

    yPosition += 30;

    // Título de la tabla
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLE DE VENTAS", 15, yPosition);
    yPosition += 8;

    const tableColumns = [
      "FOLIO DE VALIDEZ",
      "Material",
      "Comprador",
      "Cantidad (kg)",
      "Monto Pagado por el Comprador (MXN)",
      "Mi Ingreso $ Total Obtenido",
      "Comisión de SchoMetric (20%)",
      "Fecha Compra",
      "Fecha Recolección",
    ];

    const commissionAmount = totalAmount * 0.2; // 20% del total
    const schometricsAmount = commissionAmount;
    const sellerAmount = totalAmount - commissionAmount;

    // Creación de filas de la tabla (usando los datos filtrados)
    const tableRows = filteredPurchases.map((purchase) => {
      return [
        {
          content: purchase.purchaseFolio,
          styles: { textColor: greenColor, fontStyle: "bold" },
        },
        purchase.material.title,
        {
          content: purchase.buyerName.toUpperCase(),
          styles: { textColor: schoolColor, fontStyle: "bold" },
        },
        purchase.material.quantity.toString(),
        {
          content: `$${purchase.totalAmount.toFixed(2)}`,
          styles: { textColor: secondaryColor, fontStyle: "bold" },
        },
        {
          content: `$${sellerAmount.toFixed(2)}`,
          styles: { textColor: greenColor, fontStyle: "bold" },
        },
        {
          content: `$${schometricsAmount.toFixed(2)}`,
          styles: { textColor: secondaryColor, fontStyle: "bold" },
        },
        format(new Date(purchase.createdAt), "dd/MM/yy", { locale: es }),
        `${format(new Date(purchase.collectionDate), "dd/MM/yy", {
          locale: es,
        })} ${purchase.collectionTime}`,
      ];
    });

    autoTable(doc, {
      head: [tableColumns],
      margin: { top: 10, right: 5, bottom: 10, left: 5 },
      headStyles: {
        fontSize: 6,
      },
      body: tableRows as [],
      startY: yPosition,
      didDrawPage: (data) => {
        // Footer en cada página
        doc.setFillColor(...primaryColor);
        doc.rect(0, 280, 210, 17, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("SchoMetrics - Informe de Ventas", 20, 290);
        doc.text(
          `Página ${data.pageNumber} de ${doc.getNumberOfPages()}`,
          170,
          290
        );
      },
    });
  }

  // El footer se agrega aquí solo para el caso de "no compras".
  // Para el reporte con tabla, el footer se gestiona en el `didDrawPage` de autoTable.
  if (filteredPurchases.length === 0) {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 280, 210, 17, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("SchoMetrics - Informe de Ventas", 20, 290);
  }

  doc.save(`Informe_Compras_${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
