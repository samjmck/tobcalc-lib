import { fillPdf, updatePdfMeta } from "./pdf.ts";

declare function postMessage(message: any): void;

let previousObjectUrl: string;
const workerMessageEventListener = async (
  event: MessageEvent,
): Promise<void> => {
  const parameters = <Parameters<typeof fillPdf>> event.data;
  const filledPdfBytes = await fillPdf(...parameters);
  const updatedMetadataPdfBytes = await updatePdfMeta(filledPdfBytes);
  const pdfObjectUrl = URL.createObjectURL(
    new Blob([updatedMetadataPdfBytes], { type: "application/pdf" }),
  );
  if (previousObjectUrl !== undefined) {
    URL.revokeObjectURL(previousObjectUrl);
  }
  previousObjectUrl = pdfObjectUrl;
  postMessage(pdfObjectUrl);
};

export { workerMessageEventListener };
