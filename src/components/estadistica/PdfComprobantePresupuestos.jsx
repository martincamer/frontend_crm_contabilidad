import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Roboto-Light.ttf";
import medium from "../../fonts/Roboto-Medium.ttf";
import bold from "../../fonts/Roboto-Bold.ttf";
import React from "react";

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

export const PdfComprobantePresupuestos = ({
  datos,
  presupuestoAsignado,
  canjes,
  data,
  month,
  obtenerMes,
}) => {
  const totalUtilizadoCanjes = canjes?.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue?.utilizado, 10);
  }, 0);

  const totalUtilizadoNormal = datos?.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue?.utilizado, 10);
  }, 0);

  return (
    <Document>
      <Page
        style={{
          padding: "30x 30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
        size="A4"
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Image
            style={{
              width: "100px",
            }}
            src={logo}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Roboto",
                textTransform: "uppercase",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {obtenerMes(data?.data?.date || month)}
            </Text>
          </View>
          <View
            style={{
              border: "1px solid #000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "8px",
                padding: "5px",
                fontFamily: "Roboto",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                width: "100%",
              }}
            >
              Presupuesto{" "}
              <Text
                style={{
                  fontWeight: "medium",
                  textDecoration: "underline",
                }}
              >
                {obtenerMes(data?.data?.date || month)}
              </Text>
            </Text>
            <View
              style={{
                fontWeight: "bold",
                fontSize: "8px",
                fontFamily: "Roboto",
                textTransform: "uppercase",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  padding: "0px 5px",
                }}
              >
                Recaudación efectivo + bancos + notas de credito
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "9px",
                  borderLeft: "1px solid #000",
                  paddingHorizontal: "5px",
                  padding: "5px",
                }}
              >
                {Number(presupuestoAsignado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            border: "1px solid #000",
          }}
        >
          <View
            style={{
              padding: "10px",
              borderBottom: "1px solid #000",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              TIPO DE EGRESO
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "40%",
              }}
            >
              OBS
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "10%",
              }}
            >
              %
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              PRESUPUESTO
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              UTILIZADO REAL
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              DIFERENCIA
            </Text>
          </View>
          {datos.map((egreso) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  textTransform: "uppercase",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                {egreso.tipo}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  textTransform: "uppercase",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "40%",
                }}
              >
                {egreso.obs}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "10%",
                }}
              >
                {egreso.porcentaje}%
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                {Number(
                  (egreso.porcentaje * presupuestoAsignado) / 100
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                  backgroundColor: "#0001",
                  paddingVertical: "5px",
                  textAlign: "center",
                }}
              >
                {Number(egreso.utilizado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "20%",
                  backgroundColor: "#0001",
                  paddingVertical: "5px",
                  margin: "0px 2px",
                  textAlign: "center",
                }}
              >
                {Number(
                  Number((egreso.porcentaje * presupuestoAsignado) / 100) -
                    egreso.utilizado
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </View>
          ))}
        </View>
      </Page>
      <Page
        style={{
          padding: "30px 30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
        size="A4"
      >
        <View>
          <Text
            style={{
              fontSize: "9px",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontFamily: "Roboto",
              textDecoration: "underline",
            }}
          >
            Egresos por Canjes
          </Text>
        </View>

        <View
          style={{
            border: "1px solid #000",
          }}
        >
          <View
            style={{
              padding: "10px",
              borderBottom: "1px solid #000",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              TIPO DE CANJE
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "40%",
              }}
            >
              OBS
            </Text>

            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              UTILIZADO EN CANJES
            </Text>
          </View>
          {canjes.map((canje) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  textTransform: "uppercase",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                {canje.tipo}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  textTransform: "uppercase",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "40%",
                }}
              >
                {canje.obs}
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                  backgroundColor: "#0001",
                  paddingVertical: "5px",
                  textAlign: "center",
                }}
              >
                {Number(canje.utilizado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            padding: "10px 5px",
            border: "1px solid #000",
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto",
              textTransform: "uppercase",
              fontSize: "9px",
              paddingHorizontal: "5px",
              fontWeight: "medium",
            }}
          >
            TOTAL UTILIZADO FINAL {"  "}
            <Text
              style={{
                fontFamily: "Roboto",
                textTransform: "uppercase",
                fontSize: "9px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
              }}
            >
              {Number(
                totalUtilizadoCanjes + totalUtilizadoNormal
              ).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
