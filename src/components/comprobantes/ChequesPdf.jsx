import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Roboto-Light.ttf";
import medium from "../../fonts/Roboto-Medium.ttf";
import bold from "../../fonts/Roboto-Bold.ttf";
import { formatearDinero } from "../../helpers/FormatearDinero";
import { updateFecha } from "../../helpers/FechaUpdate";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: normal,
    },
    {
      src: medium,
      fontWeight: "medium",
    },
    {
      src: bold,
      fontWeight: "bold",
    },
  ],
});

export const ChequesPdf = ({
  cheques,
  calcularTotalMovimientos,
  fechaInicioMovimientos,
  fechaFinMovimientos,
}) => {
  // Estilos para el documento PDF
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
  });

  return (
    <Document
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Page size="A4" style={styles.page}>
        <View
          style={{
            padding: "20px 20px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image
              src={logo}
              style={{
                width: 100,
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Roboto",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Bancos resumen/cheques
              </Text>
            </View>
          </View>

          {fechaFinMovimientos}

          <View style={{ marginTop: 20 }}>
            {cheques.map((b) => (
              <View
                key={b._id}
                style={{
                  padding: "5px 5px",
                  border: "1px solid #000",
                  marginTop: "8px",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "semibold",
                    textTransform: "uppercase",
                    fontSize: 12,
                  }}
                >
                  Banco:{" "}
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    {b.nombre}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "semibold",
                    textTransform: "uppercase",
                    fontSize: 12,
                  }}
                >
                  Total en movimientos:
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      fontSize: 12,
                      color: "#3b82f6",
                    }}
                  >
                    {formatearDinero(
                      calcularTotalMovimientos(
                        b,
                        fechaInicioMovimientos,
                        fechaFinMovimientos
                      )
                    )}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
