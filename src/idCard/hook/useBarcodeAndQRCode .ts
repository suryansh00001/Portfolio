// useBarcodeAndQrTextures.ts
import { useEffect, useState, useMemo } from "react";
import JsBarcode from "jsbarcode";
import QRCodeStyling from "qr-code-styling";
import { CanvasTexture, Texture, TextureLoader } from "three";

const QR_DIMENSIONS = { width: 300, height: 300 };
const BARCODE_DIMENSIONS = { width: 512, height: 100 };

const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
            typeof reader.result === "string"
                ? resolve(reader.result)
                : reject(new Error("Failed to convert blob to base64."));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const createBarcodeTexture = (rollNo: string, color: string): CanvasTexture => {
    const barcodeCanvas = document.createElement("canvas");
    const tempCanvas = document.createElement("canvas");

    Object.assign(barcodeCanvas, BARCODE_DIMENSIONS);

    // Truncate roll number if too long (max 20 chars for CODE128)
    const truncatedRollNo = rollNo.substring(0, 20);
    
    try {
        JsBarcode(tempCanvas, truncatedRollNo, {
            format: "CODE128",
            width: 3,
            height: 30,
            margin: 5,
            displayValue: true,
            textAlign: "center",
            fontSize: 12,
            fontOptions: "bold",
            textMargin: 2,
            font: "sans-serif",
            lineColor: color,
            background: "transparent",
        });
    } catch (error) {
        // Fallback to simple numeric format
        console.warn("CODE128 failed, using fallback:", error);
        try {
            // Try with just numeric part
            const numericOnly = truncatedRollNo.replace(/\D/g, '').substring(0, 12);
            JsBarcode(tempCanvas, numericOnly || "123456789012", {
                format: "CODE128",
                width: 3,
                height: 30,
                margin: 5,
                displayValue: true,
                textAlign: "center",
                fontSize: 12,
                fontOptions: "bold",
                textMargin: 2,
                font: "sans-serif",
                lineColor: color,
                background: "transparent",
            });
        } catch (secondError) {
            console.error("All barcode formats failed:", secondError);
            // Will use text fallback below
        }
    }

    const ctx = barcodeCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);

    // Check if barcode was successfully generated
    if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        const x = (barcodeCanvas.width - tempCanvas.width) / 2;
        const y = (barcodeCanvas.height - tempCanvas.height) / 2;
        ctx.drawImage(tempCanvas, x, y);
    } else {
        // Fallback: draw a simple text if barcode generation fails
        ctx.fillStyle = color;
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(rollNo, barcodeCanvas.width / 2, barcodeCanvas.height / 2);
    }

    const texture = new CanvasTexture(barcodeCanvas);
    texture.needsUpdate = true;
    return texture;
};

export function useBarcodeAndQrTextures({
    rollNo = "123456789012",
    qrData = "https://github.com/Shashank09012003",
    color = "#242424",
}) {
    const [textures, setTextures] = useState<{
        barcodeTexture?: CanvasTexture;
        qrTexture?: Texture;
    }>({});

    const barcodeTexture = useMemo(() =>
        createBarcodeTexture(rollNo, color),
        [rollNo, color]
    );

    useEffect(() => {
        const generateQR = async () => {
            try {
                const qrCanvas = document.createElement("canvas");
                Object.assign(qrCanvas, QR_DIMENSIONS);

                // Create a new QR instance to avoid state conflicts
                const qrInstance = new QRCodeStyling({
                    width: QR_DIMENSIONS.width,
                    height: QR_DIMENSIONS.height,
                    data: qrData,
                    image: "/images/logo.svg",
                    dotsOptions: { 
                        color: "#242424", 
                        type: "rounded" 
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        hideBackgroundDots: true,
                        imageSize: 0.4,
                        margin: 0,
                    },
                    qrOptions: {
                        typeNumber: 4,
                        errorCorrectionLevel: "M", // Changed from H to M for better compatibility
                    },
                    backgroundOptions: {
                        color: "#ffffff",
                        round: 1
                    },
                });

                qrInstance._domCanvas = qrCanvas;
                
                const rawData = await qrInstance.getRawData();
                if (rawData) {
                    const base64Data = await blobToBase64(rawData);
                    const qrTexture = new TextureLoader().load(base64Data);
                    qrTexture.needsUpdate = true;
                    setTextures({ barcodeTexture, qrTexture });
                } else {
                    console.warn('QR generation returned no data, using barcode only');
                    setTextures({ barcodeTexture });
                }
            } catch (error) {
                console.error('Error generating QR texture:', error);
                setTextures({ barcodeTexture }); // Fallback to barcode only
            }
        };

        generateQR();
    }, [rollNo, qrData, barcodeTexture]);

    return textures;
}
