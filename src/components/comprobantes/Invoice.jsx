import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
    width: "48%",
  },
  text: {
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableHeaderCol: {
    backgroundColor: "#bdbdbd",
  },
  tableCell: {
    fontSize: 10,
    padding: 5,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
  },
});

export const InvoicePDF = () => {
  const invoiceData = {
    customerName: "ECOFERRO",
    invoiceNumber: "0001 00005482",
    invoiceDate: "17/05/2024",
    subtotal: 600000,
    totalAmount: 600000,
    paymentMethod: "Efectivo",
    paymentAmount: 600000,
  };

  const {
    customerName,
    invoiceNumber,
    invoiceDate,
    subtotal,
    totalAmount,
    paymentMethod,
    paymentAmount,
  } = invoiceData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.text}>VIVIENDAS TECNOHOUSE</Text>
          <Text style={styles.text}>VIVIENDAS TECNOHOGAR REMOTO</Text>
          <Text style={styles.text}>CORRIENTES Fábrica</Text>
          <Text style={styles.text}>Av. Independencia 5001 - Corrientes</Text>
        </View>

        <View style={styles.row}>
          <Text>PAGO</Text>
          <Text>Nº {invoiceNumber}</Text>
          <Text>FECHA: {invoiceDate}</Text>
        </View>

        <View style={styles.section}>
          <Text>Señor / Es: {customerName}</Text>
          <Text>Tel: 3624858562 - 3624921495</Text>
          <Text>(3500) Resistencia - Chaco</Text>
        </View>

        <View style={styles.section}>
          <Text>Situación de IVA: Responsable Inscripto</Text>
          <Text>Número de CUIT: XXXXXXXX</Text>
          <Text>Origen</Text>
        </View>

        <View style={styles.section}>
          <Text>
            Hemos abonado al arriba mencionado la suma de Pesos: seiscientos mil
            y 00 / 100 centavos para ser acreditado en su cuenta corriente.
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, styles.tableHeaderCol]}>
              <Text style={styles.tableCell}>Retenciones</Text>
            </View>
            <View style={[styles.tableCol, styles.tableHeaderCol]}>
              <Text style={styles.tableCell}>Efectivo</Text>
            </View>
            <View style={[styles.tableCol, styles.tableHeaderCol]}>
              <Text style={styles.tableCell}>Cheques</Text>
            </View>
            <View style={[styles.tableCol, styles.tableHeaderCol]}>
              <Text style={styles.tableCell}>Tarjeta</Text>
            </View>
            <View style={[styles.tableCol, styles.tableHeaderCol]}>
              <Text style={styles.tableCell}>Banco</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                Pago a Cuenta - Recibo Nº 01-780
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{paymentAmount}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>0.00</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>0.00</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>0.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>Subtotal: {subtotal}</Text>
              <Text>Retenciones: 0.00</Text>
              <Text>Total: {totalAmount}</Text>
            </View>
            <View style={styles.column}>
              <Text>Vueltos:</Text>
              <Text>Vuelto Efectivo: {paymentAmount}</Text>
              <Text>Vuelto Cheques: 0.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Terminal: CORRIENTES-FAB Usuario: Opera</Text>
        </View>
      </Page>
    </Document>
  );
};
