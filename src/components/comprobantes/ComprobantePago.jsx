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

export const ComprobantePago = ({ recibo }) => {
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

  const calculateAntiquity = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
  };

  const { years, months } = calculateAntiquity(recibo.fecha_ingreso);

  return (
    <Document
      style={{
        width: "100%",
        height: "100%",
      }}
    >
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
              Comprobante de Pago
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
              Fecha: {updateFecha(recibo?.created_at)}
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
              Pago De Haberes - Comprobante{" "}
              {recibo.sueldo === "quincenal"
                ? recibo.termino_pago === "quincena_veinte"
                  ? "quincena del 20"
                  : "quincena del 5"
                : "mensual"}
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
            Empleado: {recibo.nombre} {recibo.apellido}
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
              Fecha de ingreso: {updateFecha(recibo.fecha_ingreso)}
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
              Tipo de sueldo: {recibo.sueldo}
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
              Fábrica o Suc.: {recibo.fabrica_sucursal}
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
              Sector/Rol: {recibo.sector_trabajo}
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
              Remuneración asignada:{" "}
              {formatearDinero(
                recibo.sueldo === "quincenal"
                  ? recibo.termino_pago === "quincena_veinte"
                    ? Number(recibo?.recibo?.quincena_veinte) +
                      Number(recibo?.recibo?.comida) -
                      Number(recibo?.recibo?.descuento_del_veinte)
                    : Number(recibo?.recibo?.quincena_cinco) +
                      Number(recibo?.recibo?.premio_produccion) +
                      Number(recibo?.recibo?.premio_asistencia) +
                      Number(recibo?.recibo?.otros) +
                      -Number(recibo?.recibo?.descuento_del_cinco)
                  : Number(recibo?.recibo?.sueldo_basico) +
                      Number(recibo?.recibo?.premio_produccion) +
                      Number(recibo?.recibo?.premio_asistencia) +
                      Number(recibo?.recibo?.otros) +
                      Number(recibo?.recibo?.comida) -
                      Number(recibo?.recibo?.descuento_del_cinco)
              )}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: "12px",
                textTransform: "uppercase",
                backgroundColor: "#000",
                padding: "5px 10px",
                color: "white",
                marginBottom: 5,
              }}
            >
              Observaciones
            </Text>
            <View
              style={{
                border: "1px solid #000",
                padding: 10,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "medium",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Observación:{" "}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "medium",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  paddingBottom: 6,
                  borderBottom: "0.5px solid #000",
                }}
              >
                {recibo?.termino_pago === "quincena_veinte"
                  ? recibo?.recibo?.observacion_veinte
                  : ""}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "medium",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Remuneración asignada: +
                {formatearDinero(
                  recibo.sueldo === "quincenal"
                    ? recibo.termino_pago === "quincena_veinte"
                      ? Number(recibo?.recibo?.quincena_veinte)
                      : Number(recibo?.recibo?.quincena_cinco)
                    : Number(recibo?.recibo?.sueldo_basico)
                )}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "medium",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Descuento por faltas/prestamos/otros/etc: -{" "}
                {formatearDinero(
                  Number(
                    recibo?.sueldo === "quincenal"
                      ? recibo?.termino_pago === "quincena_veinte"
                        ? recibo?.recibo?.descuento_del_veinte
                        : recibo?.recibo?.descuento_del_cinco
                      : recibo?.recibo?.descuento_del_cinco
                  ) || 0
                )}
                {/* {recibo?.termino_pago === "quincena_veinte"
                  ? formatearDinero(
                      Number(recibo?.recibo?.descuento_del_veinte)
                    )
                  : ""}
                {recibo?.termino_pago === "quincena_cinco"
                  ? formatearDinero(recibo?.recibo?.descuento_del_cinco)
                  : ""} */}
              </Text>
              {recibo?.recibo?.banco !== undefined && (
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: 10,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  COBRADO EN EL BANCO:{" "}
                  {formatearDinero(Number(recibo.recibo.banco || 0))}
                </Text>
              )}
              {recibo?.recibo?.comida !== undefined && (
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: 10,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  COMIDA: {formatearDinero(Number(recibo.recibo.comida || 0))}
                </Text>
              )}
              {recibo?.recibo?.premio_produccion !== undefined && (
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: 10,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  PREMIO PRODUCCIÓN:{" "}
                  {formatearDinero(
                    Number(recibo.recibo.premio_produccion || 0)
                  )}
                </Text>
              )}
              {recibo?.recibo?.premio_produccion !== undefined && (
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: 10,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  PREMIO PRODUCCIÓN:{" "}
                  {formatearDinero(
                    Number(recibo.recibo.premio_produccion || 0)
                  )}
                </Text>
              )}

              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "medium",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                OTRO IMPORTE:{" "}
                {formatearDinero(Number(recibo?.recibo?.otros || 0))}
              </Text>
              {recibo.termino_pago === "sueldo" ||
              recibo.termino_pago === "quincena_cinco" ? (
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  Antigüedad adicional:{" "}
                  {formatearDinero(Number(recibo.antiguedad_total || 0))} de
                  antigüedad
                </Text>
              ) : null}
            </View>
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
              <Text>
                {formatearDinero(
                  recibo.sueldo === "quincenal"
                    ? recibo.termino_pago === "quincena_veinte"
                      ? Number(recibo?.recibo?.quincena_veinte) +
                        Number(recibo?.recibo?.comida) -
                        Number(recibo?.recibo?.descuento_del_veinte)
                      : Number(recibo?.recibo?.quincena_cinco) +
                        Number(recibo?.recibo?.premio_produccion) +
                        Number(recibo?.recibo?.premio_asistencia) +
                        Number(recibo?.recibo?.otros) +
                        Number(recibo.antiguedad_total) -
                        Number(recibo?.recibo?.descuento_del_cinco)
                    : Number(recibo?.recibo?.sueldo_basico) +
                        Number(recibo?.recibo?.premio_produccion) +
                        Number(recibo?.recibo?.premio_asistencia) +
                        Number(recibo?.recibo?.otros) +
                        Number(recibo?.recibo?.comida) +
                        Number(recibo.antiguedad_total) -
                        Number(recibo?.recibo?.descuento_del_cinco)
                )}
              </Text>
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
                Total a cobrar efectivo/mano{" "}
              </Text>
              <Text>
                {formatearDinero(
                  recibo.sueldo === "quincenal"
                    ? recibo.termino_pago === "quincena_veinte"
                      ? Number(recibo?.recibo?.quincena_veinte) +
                        Number(recibo?.recibo?.comida) -
                        Number(recibo?.recibo?.descuento_del_veinte)
                      : Number(recibo?.recibo?.quincena_cinco) +
                        Number(recibo?.recibo?.premio_produccion) +
                        Number(recibo?.recibo?.premio_asistencia) +
                        Number(recibo.antiguedad_total) +
                        Number(recibo?.recibo?.otros) -
                        Number(recibo?.recibo?.banco) -
                        Number(recibo?.recibo?.descuento_del_cinco)
                    : Number(recibo?.recibo?.sueldo_basico) +
                        Number(recibo?.recibo?.premio_produccion) +
                        Number(recibo?.recibo?.premio_asistencia) +
                        Number(recibo?.recibo?.otros) +
                        Number(recibo?.recibo?.comida) +
                        Number(recibo.antiguedad_total) -
                        Number(recibo?.recibo?.banco) -
                        Number(recibo?.recibo?.descuento_del_cinco)
                )}
              </Text>
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
    </Document>
  );
};
