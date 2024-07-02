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

export const ComprobantesTodos = ({ empleados }) => {
  console.log(empleados);
  // Estilos para el documento PDF
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    section: {
      padding: 3,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      // flexGrow: 1,
    },
    header: {
      fontSize: 16,
      marginBottom: 10,
    },
    subheader: {
      fontSize: 14,
      marginBottom: 5,
    },
    content: {
      fontSize: 12,
      marginBottom: 5,
    },
  });

  return (
    <Document
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {empleados.map((e) => {
        const calculateAntiquity = (startDate) => {
          const start = new Date(startDate);
          const now = new Date();
          const diffTime = Math.abs(now - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);

          return { years, months };
        };

        // Calcular la antigüedad
        const { years, months } = calculateAntiquity(e?.fecha_ingreso);

        let total_antiguedad = 0;

        if (e?.termino_pago === "mensual") {
          total_antiguedad =
            Number(e?.sueldo[0]?.sueldo_basico || 0) * (0.01 * years);
        } else {
          total_antiguedad =
            (Number(e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
              Number(e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0)) *
            (0.01 * years);
        }

        let sueldo = 0;

        if (e?.termino_pago === "quincenal") {
          // Calcular sueldo quincenal
          sueldo =
            Number(e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
              Number(e?.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
              Number(e?.sueldo[0]?.quincena_cinco[0]?.premio_produccion || 0) +
              Number(e?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia || 0) +
              Number(e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0) +
              Number(e?.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
              Number(total_antiguedad || 0) -
              Number(
                e?.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte || 0
              ) -
              Number(
                e?.sueldo[0]?.quincena_cinco[0]?.descuento_del_cinco || 0
              ) || 0;
        } else if (e?.termino_pago === "mensual") {
          // Calcular sueldo mensual
          sueldo =
            Number(e?.sueldo[0]?.sueldo_basico || 0) +
              Number(total_antiguedad || 0) +
              Number(e?.sueldo[0]?.comida || 0) +
              Number(e?.sueldo[0]?.premio_produccion || 0) +
              Number(e?.sueldo[0]?.premio_asistencia || 0) +
              Number(e?.sueldo[0]?.otros || 0) -
              Number(e?.sueldo[0]?.descuento_del_cinco || 0) || 0;
        }
        return (
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Comprobante de pago
                </Text>
                <Image
                  style={{
                    width: "80px",
                    height: "60px",
                  }}
                  src={logo}
                />
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Fecha: {updateFecha(e?.date)}
                </Text>
              </View>

              <View
                style={{
                  border: "1px solid #000",
                  padding: 10,
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Recibo aguinaldo
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  backgroundColor: "#000",
                  padding: 6,
                  color: "white",
                }}
              >
                Empleado: {e?.nombre} {e?.apellido}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    backgroundColor: "#000",
                    padding: 5,
                    color: "white",
                  }}
                >
                  Fecha de ingreso: {updateFecha(e?.fecha_ingreso)}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    backgroundColor: "#000",
                    padding: 5,
                    color: "white",
                  }}
                >
                  Antigüedad: {`${years} años, ${months} meses`}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    backgroundColor: "#000",
                    padding: 5,
                    color: "white",
                  }}
                >
                  Tipo de sueldo: {e?.termino_pago}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    backgroundColor: "#000",
                    padding: 5,
                    color: "white",
                  }}
                >
                  Fábrica o Suc: {e?.fabrica_sucursal}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    backgroundColor: "#000",
                    padding: 5,
                    color: "white",
                  }}
                >
                  Sector/Rol: {e?.sector_trabajo}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "medium",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    SubTotal
                  </Text>
                  <Text>{formatearDinero(sueldo / 2)}</Text>
                </View>
                <View
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "medium",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Total a cobrar
                  </Text>
                  <Text>{formatearDinero(sueldo / 2)}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                border: "1px solid #000",
              }}
            >
              <Text
                style={{
                  padding: "5px 5px",
                  fontSize: "10px",
                  fontWeight: "medium",
                  fontFamily: "Roboto",
                }}
              >
                Firma o aclaración del empleado
              </Text>
              <View
                style={{
                  padding: "30px 10px",
                  marginTop: "10px",
                }}
              ></View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};
