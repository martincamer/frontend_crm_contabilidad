import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "../components/comprobantes/Invoice";
const InvoicePage = () => {
  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <InvoicePDF />
    </PDFViewer>
  );
};

export default InvoicePage;
