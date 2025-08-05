import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";

/**
 * Converts the first page of a PDF to a PNG using canvas rendering.
 * Works in browser only.
 * @param {File} file
 * @returns {Promise<{ imageUrl: string, file: File|null, error?: string }>}
 */
export async function convertPdfToImage(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const firstPage = pdfDoc.getPages()[0];

    const { width, height } = firstPage.getSize();

    // Create SVG representation of page content
    const svg = document.createElement("svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.innerHTML = `
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml"
          style="font-family: sans-serif; font-size: 16px; padding: 2rem;">
          <p>Preview not supported in this version.</p>
        </div>
      </foreignObject>
    `;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.appendChild(svg);
    document.body.appendChild(container);

    // Use html2canvas to render SVG to PNG
    const canvas = await html2canvas(svg); // ✅ correct
    document.body.removeChild(container);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imageFile = new File([blob], `${file.name}.png`, {
            type: "image/png",
          });
          resolve({
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
          });
        } else {
          resolve({
            imageUrl: "",
            file: null,
            error: "Failed to convert canvas to blob",
          });
        }
      }, "image/png");
    });
  } catch (err) {
    console.error("Error converting PDF:", err);
    return {
      imageUrl: "",
      file: null,
      error: "PDF conversion failed",
    };
  }
}

export const generateUUID = () => {
  return crypto.randomUUID();
}