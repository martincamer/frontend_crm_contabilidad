import React, { useEffect, useState } from "react";
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

export const ComprobantesTodos = ({ empleados, selectedMes }) => {
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

  const [fechaHoy, setFechaHoy] = useState("");

  useEffect(() => {
    const obtenerFechaHoy = () => {
      const hoy = new Date(); // Obtener la fecha de hoy
      const dia = hoy.getDate(); // Obtener el día del mes (1 al 31)
      const mes = hoy.getMonth() + 1; // Obtener el mes (0 a 11, por eso se suma 1)
      const anio = hoy.getFullYear(); // Obtener el año (ej. 2024)

      // Construir la fecha en el formato "D/MM/YYYY"
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      setFechaHoy(fechaFormateada); // Actualizar el estado con la fecha formateada
    };

    obtenerFechaHoy(); // Llamar a la función al montar el componente
  }, []);

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

        // Función para calcular los meses de antigüedad desde la fecha de ingreso
        const calcularMesesAntiguedad = (fechaIngreso) => {
          const fechaIngresoDate = new Date(fechaIngreso);
          const fechaActual = new Date();

          // Calcular diferencia en meses
          const diff =
            (fechaActual.getFullYear() - fechaIngresoDate.getFullYear()) * 12 +
            (fechaActual.getMonth() - fechaIngresoDate.getMonth());

          return diff;
        };

        const calcularAntiguedad = (fechaIngreso) => {
          const fechaIngresoDate = new Date(fechaIngreso);
          const fechaActual = new Date();

          // Calcular años y meses de diferencia
          let yearsDiff =
            fechaActual.getFullYear() - fechaIngresoDate.getFullYear();
          let monthsDiff = fechaActual.getMonth() - fechaIngresoDate.getMonth();

          // Ajustar si la fecha actual es anterior al día de ingreso en el mismo mes
          if (
            monthsDiff < 0 ||
            (monthsDiff === 0 &&
              fechaActual.getDate() < fechaIngresoDate.getDate())
          ) {
            yearsDiff--;
            monthsDiff += 12; // Sumar 12 meses para ajustar la diferencia negativa
          }

          return { years: yearsDiff, months: monthsDiff };
        };

        const calcularAntiguedadDelEmpleado = calcularAntiguedad(
          e.fecha_ingreso
        );

        // Inicializar sueldo y aguinaldoProporcional
        let sueldo = 0;
        let aguinaldoProporcional = 0;

        // Calcular la antigüedad en meses
        const antiguedadEnMeses = calcularMesesAntiguedad(e.fecha_ingreso);

        if (e?.termino_pago === "quincenal") {
          // Calcular sueldo quincenal

          sueldo =
            Number(e?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco || 0) +
              Number(e?.sueldo[0]?.quincena_cinco[0]?.otros || 0) +
              Number(e?.sueldo[0]?.quincena_cinco[0]?.premio_produccion || 0) +
              Number(e?.sueldo[0]?.quincena_cinco[0]?.premio_asistencia || 0) +
              Number(e?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte || 0) +
              Number(e?.sueldo[1]?.quincena_veinte[0]?.comida || 0) +
              Number(total_antiguedad || 0) || 0;

          // Verificar si la fecha de ingreso es menor a 6 meses
          if (antiguedadEnMeses < 6) {
            aguinaldoProporcional = (sueldo / 12) * antiguedadEnMeses;
          }
        } else if (e?.termino_pago === "mensual") {
          // Calcular sueldo mensual
          sueldo =
            Number(e?.sueldo[0]?.sueldo_basico || 0) +
              Number(total_antiguedad || 0) +
              Number(e?.sueldo[0]?.comida || 0) +
              Number(e?.sueldo[0]?.premio_produccion || 0) +
              Number(e?.sueldo[0]?.premio_asistencia || 0) +
              Number(e?.sueldo[0]?.otros || 0) || 0;

          // Verificar si la fecha de ingreso es menor a 6 meses
          if (antiguedadEnMeses < 6) {
            aguinaldoProporcional = (sueldo / 12) * antiguedadEnMeses;
          }
        }

        // Determinar el sueldo final basado en la antigüedad del empleado
        if (antiguedadEnMeses < 6) {
          // Si la fecha de ingreso es menor a 6 meses, se utiliza aguinaldo proporcional
          sueldo = aguinaldoProporcional;
        } else {
          // Si no, se utiliza la mitad del sueldo
          sueldo /= 2;
        }

        let aguinadlNew = 0;
        if (e?.termino_pago === "quincenal") {
          // Calcular sueldo quincenal
          aguinadlNew =
            Number(
              e?.sueldo[0]?.quincena_cinco[0]?.aguinaldo_proporcional || 0
            ) || 0;
        } else if (e?.termino_pago === "mensual") {
          // Calcular sueldo mensual
          aguinadlNew = Number(e?.sueldo[0]?.aguinaldo_proporcional || 0) || 0;
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
                  Fecha: {fechaHoy}
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
                  Recibo aguinaldo {selectedMes}
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
                  Fecha de ingreso: {updateFecha(e?.fecha_ingreso)}{" "}
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
                  {/* Antigüedad: {`${years} años, ${months} meses`}{" "} */}
                  Antiguedad: {calcularAntiguedadDelEmpleado?.years} Años /{" "}
                  {antiguedadEnMeses} Meses{" "}
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

              {/* <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Observación
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {e?.sueldo &&
                    (Number(e?.sueldo[0]?.aguinaldo_proporcional || 0) > 0 ||
                    (e?.sueldo[0]?.quincena_cinco?.[0]
                      ?.aguinaldo_proporcional || 0) > 0
                      ? `Se descontó del aguinaldo por cobrar proporcional en el banco de ${formatearDinero(
                          Number(e?.sueldo[0]?.aguinaldo_proporcional || 0) ||
                            Number(
                              e?.sueldo[0]?.quincena_cinco?.[0]
                                ?.aguinaldo_proporcional || 0
                            )
                        )}`
                      : "")}
                </Text>
              </View> */}

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
                    BANCO
                  </Text>

                  <Text
                    style={{
                      color: "rgba(185 28 28)",
                    }}
                  >
                    - {formatearDinero(Number(aguinadlNew))}
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
                    Total a cobrar
                  </Text>
                  <Text>
                    {formatearDinero(Number(sueldo) - Number(aguinadlNew))}
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
