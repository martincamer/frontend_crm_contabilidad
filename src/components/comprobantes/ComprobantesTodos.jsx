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

export const ComprobantesTodos = ({
  empleados,
  selectedQuincena,
  selectedTerminoPago,
}) => {
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

        const quincenaCinco =
          selectedQuincena === "quincena_cinco"
            ? e.sueldo[0].quincena_cinco[0].quincena_cinco
            : "";

        const quincenaCincoDescuentos =
          selectedQuincena === "quincena_cinco"
            ? e.sueldo[0].quincena_cinco[0].descuento_del_cinco
            : "";

        const quincenaVeinte =
          selectedQuincena === "quincena_veinte"
            ? e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte
            : "";

        const quincenaVeinteDescuentos =
          selectedQuincena === "quincena_veinte"
            ? e?.sueldo[1]?.quincena_veinte[0]?.descuento_del_veinte
            : "";

        const sueldoMensualBasico =
          e?.sueldo?.length > 0 ? e?.sueldo[0]?.sueldo_basico : "";

        const descuentosPorFaltasMensual =
          e?.sueldo?.length > 0 ? e?.sueldo[0]?.descuento_del_cinco : "";

        const { years, months } = calculateAntiquity(e.fecha_ingreso);

        let total_antiguedad = 0;

        if (Array.isArray(e?.sueldo)) {
          if (selectedQuincena === "quincena_cinco") {
            if (
              Array.isArray(e.sueldo[0]?.quincena_cinco) &&
              e.sueldo[0]?.quincena_cinco.length > 0
            ) {
              total_antiguedad =
                Number(e.sueldo[0].quincena_cinco[0]?.quincena_cinco || 0) *
                (0.01 * years);
            }
          } else if (selectedQuincena === "quincena_veinte") {
            if (
              Array.isArray(e.sueldo[1]?.quincena_veinte) &&
              e.sueldo[1]?.quincena_veinte.length > 0
            ) {
              total_antiguedad =
                Number(e.sueldo[1].quincena_veinte[0]?.quincena_veinte || 0) *
                (0.01 * years);
            }
          } else {
            total_antiguedad =
              Number(e?.sueldo[0]?.sueldo_basico || 0) * (0.01 * years);
          }
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
                  Pago De Haberes - Comprobante{" "}
                  {selectedQuincena === "quincena_cinco"
                    ? "Quincena del 5"
                    : selectedQuincena === "quincena_veinte"
                    ? "Quincena del 20"
                    : "Mensual"}
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
                  Fábrica o Suc.: {e?.fabrica_sucursal}
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
                  {Number(quincenaCinco)
                    ? formatearDinero(Number(quincenaCinco))
                    : Number(quincenaVeinte)
                    ? formatearDinero(Number(quincenaVeinte))
                    : formatearDinero(Number(sueldoMensualBasico))}
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
                    {e?.termino_pago === "mensual"
                      ? e?.sueldo[0]?.observacion
                      : ""}
                    {selectedQuincena === "quincena_cinco"
                      ? e?.sueldo[0]?.quincena_cinco[0].observacion_cinco
                      : e?.sueldo[1]?.quincena_veinte[0].observacion_veinte ||
                        ""}
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
                    {selectedQuincena === "quincena_cinco"
                      ? formatearDinero(Number(quincenaCinco))
                      : Number(quincenaVeinte)
                      ? formatearDinero(Number(quincenaVeinte))
                      : formatearDinero(Number(sueldoMensualBasico))}
                  </Text>
                  {((selectedQuincena === "quincena_cinco" &&
                    Number(quincenaCincoDescuentos)) ||
                    (selectedQuincena === "quincena_veinte" &&
                      Number(quincenaVeinteDescuentos)) ||
                    (!selectedQuincena &&
                      Number(descuentosPorFaltasMensual))) && (
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
                      {selectedQuincena === "quincena_cinco"
                        ? formatearDinero(Number(quincenaCincoDescuentos))
                        : selectedQuincena === "quincena_veinte"
                        ? formatearDinero(Number(quincenaVeinteDescuentos))
                        : formatearDinero(Number(descuentosPorFaltasMensual))}
                    </Text>
                  )}
                  {selectedQuincena === "quincena_cinco" &&
                    Array.isArray(e?.sueldo[0]?.quincena_cinco) &&
                    e?.sueldo[0]?.quincena_cinco.length > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        COBRADO EN EL BANCO: -
                        {formatearDinero(
                          Number(e?.sueldo[0]?.quincena_cinco[0]?.banco || 0)
                        )}
                      </Text>
                    )}

                  {e?.termino_pago === "mensual" &&
                    Array.isArray(e?.sueldo) &&
                    e?.sueldo[0] && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        COBRADO EN EL BANCO: -
                        {formatearDinero(Number(e?.sueldo[0]?.banco || 0))}
                      </Text>
                    )}

                  {selectedQuincena === "quincena_veinte" &&
                    Array.isArray(e?.sueldo[1]?.quincena_veinte) &&
                    e?.sueldo[1]?.quincena_veinte.length > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        COMIDA: +
                        {formatearDinero(
                          Number(e?.sueldo[1]?.quincena_veinte[0]?.comida || 0)
                        )}
                      </Text>
                    )}

                  {e?.termino_pago === "mensual" &&
                    Array.isArray(e?.sueldo) &&
                    e?.sueldo[0] && (
                      <>
                        {e?.sueldo[0]?.comida > 0 && (
                          <Text
                            style={{
                              fontFamily: "Roboto",
                              fontWeight: "medium",
                              fontSize: 10,
                              textTransform: "uppercase",
                              marginBottom: 2,
                            }}
                          >
                            COMIDA: +
                            {formatearDinero(Number(e?.sueldo[0]?.comida))}
                          </Text>
                        )}
                      </>
                    )}

                  {e?.termino_pago === "mensual" &&
                    Array.isArray(e?.sueldo) &&
                    e?.sueldo[0]?.premio_produccion > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        PREMIO PRODUCCIÓN: +
                        {formatearDinero(
                          Number(e?.sueldo[0]?.premio_produccion)
                        )}
                      </Text>
                    )}

                  {selectedQuincena === "quincena_cinco" &&
                    Array.isArray(e?.sueldo[0]?.quincena_cinco) &&
                    e?.sueldo[0]?.quincena_cinco.length > 0 &&
                    e?.sueldo[0]?.quincena_cinco[0]?.premio_produccion > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        PREMIO PRODUCCIÓN: +
                        {formatearDinero(
                          Number(
                            e?.sueldo[0]?.quincena_cinco[0]?.premio_produccion
                          )
                        )}
                      </Text>
                    )}

                  {e?.termino_pago === "mensual" &&
                    Array.isArray(e?.sueldo) &&
                    e?.sueldo[0]?.premio_asistencia > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        PREMIO ASISTENCIA: +
                        {formatearDinero(
                          Number(e?.sueldo[0]?.premio_asistencia)
                        )}
                      </Text>
                    )}

                  {selectedQuincena === "quincena_cinco" &&
                    Array.isArray(e?.sueldo[0]?.quincena_cinco) &&
                    e?.sueldo[0]?.quincena_cinco.length > 0 &&
                    e?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        PREMIO ASISTENCIA: +
                        {formatearDinero(
                          Number(
                            e?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia
                          )
                        )}
                      </Text>
                    )}

                  {e?.termino_pago === "mensual" &&
                    Array.isArray(e?.sueldo) &&
                    e?.sueldo[0] && (
                      <>
                        {e?.sueldo[0]?.otros > 0 && (
                          <Text
                            style={{
                              fontFamily: "Roboto",
                              fontWeight: "medium",
                              fontSize: 10,
                              textTransform: "uppercase",
                              marginBottom: 2,
                            }}
                          >
                            OTROS: +
                            {formatearDinero(Number(e?.sueldo[0]?.otros))}
                          </Text>
                        )}
                      </>
                    )}

                  {selectedQuincena === "quincena_cinco" &&
                    Array.isArray(e?.sueldo[0]?.quincena_cinco) &&
                    e?.sueldo[0]?.quincena_cinco.length > 0 && (
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "medium",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        OTROS: +
                        {formatearDinero(
                          Number(e?.sueldo[0]?.quincena_cinco[0]?.otros || 0)
                        )}
                      </Text>
                    )}

                  {selectedQuincena === "quincena_cinco" && (
                    <Text
                      style={{
                        fontFamily: "Roboto",
                        fontWeight: "medium",
                        fontSize: 10,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      TOTAL EN ANTIGUEDAD: +
                      {formatearDinero(Number(total_antiguedad || 0))}
                    </Text>
                  )}

                  {e?.termino_pago === "mensual" && (
                    <Text
                      style={{
                        fontFamily: "Roboto",
                        fontWeight: "medium",
                        fontSize: 10,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      TOTAL EN ANTIGUEDAD: +{formatearDinero(total_antiguedad)}
                    </Text>
                  )}
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
                      selectedQuincena === "quincena_cinco"
                        ? Number(
                            e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
                          ) +
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]
                                ?.premio_produccion || 0
                            ) +
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]
                                ?.premio_asistencia || 0
                            ) +
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]?.otros || 0
                            ) +
                            Number(total_antiguedad || 0) -
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]
                                ?.descuento_del_cinco || 0
                            )
                        : selectedQuincena === "quincena_veinte"
                        ? Number(
                            e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte ||
                              0
                          ) +
                          Number(
                            e?.sueldo[1]?.quincena_veinte[0]?.comida || 0
                          ) -
                          Number(
                            e?.sueldo[1]?.quincena_veinte[0]
                              ?.descuento_del_veinte || 0
                          )
                        : Number(e?.sueldo[0]?.sueldo_basico || 0) +
                          Number(e?.sueldo[0]?.comida || 0) +
                          Number(e?.sueldo[0]?.premio_asistencia || 0) +
                          Number(e?.sueldo[0]?.premio_produccion || 0) +
                          Number(total_antiguedad || 0) +
                          Number(e?.sueldo[0]?.otros || 0) -
                          Number(e?.sueldo[0]?.descuentos_del_cinco || 0)
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
                      selectedQuincena === "quincena_cinco"
                        ? Number(
                            e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0
                          ) +
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]
                                ?.premio_produccion || 0
                            ) +
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]
                                ?.premio_asistencia || 0
                            ) +
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]?.otros || 0
                            ) +
                            Number(total_antiguedad || 0) -
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]?.banco || 0
                            ) -
                            Number(
                              e?.sueldo[0]?.quincena_cinco[0]
                                ?.descuento_del_cinco || 0
                            )
                        : selectedQuincena === "quincena_veinte"
                        ? Number(
                            e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte ||
                              0
                          ) +
                          Number(
                            e?.sueldo[1]?.quincena_veinte[0]?.comida || 0
                          ) -
                          Number(
                            e?.sueldo[1]?.quincena_veinte[0]
                              ?.descuento_del_veinte || 0
                          )
                        : Number(e?.sueldo[0]?.sueldo_basico || 0) +
                          Number(e?.sueldo[0]?.comida || 0) +
                          Number(e?.sueldo[0]?.premio_asistencia || 0) +
                          Number(e?.sueldo[0]?.premio_produccion || 0) +
                          Number(e?.sueldo[0]?.otros || 0) +
                          Number(total_antiguedad) -
                          Number(e?.sueldo[0]?.banco || 0) -
                          Number(e?.sueldo[0]?.descuentos_del_cinco || 0)
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
        );
      })}
    </Document>
  );
};
