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

export const ComprobanteRecursosHumanos = ({ empleados }) => {
  // Estilos para el documento PDF

  return (
    <Document
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {empleados.map((e) => {
        return (
          <Page>
            <View
              style={{
                padding: "30px",
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                Fabrica/Sucursal {e.fabrica_sucursal}
              </Text>
            </View>

            <View
              style={{
                padding: "10px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {e?.empleados.map((empleado) => {
                const calculateAntiquity = (startDate) => {
                  const start = new Date(startDate);
                  const now = new Date();
                  const diffTime = Math.abs(now - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  const years = Math.floor(diffDays / 365);
                  const months = Math.floor((diffDays % 365) / 30);

                  return { years, months };
                };

                const antiquity = calculateAntiquity(empleado?.fecha_ingreso);

                let total_antiguedad = 0;

                total_antiguedad =
                  (Number(
                    empleado?.sueldo[0]?.quincena_cinco[0]?.quincena_cinco
                  ) +
                    Number(
                      empleado?.sueldo[1]?.quincena_veinte[0]?.quincena_veinte
                    )) *
                  (0.01 * antiquity.years);

                console.log("total", total_antiguedad);
                return (
                  <View
                    style={{
                      padding: 5,
                      border: "1px solid #000",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <Text
                        style={{
                          textTransform: "uppercase",
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                          fontSize: "10px",
                        }}
                      >
                        DATOS DEL EMPLEADO
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 4,
                        }}
                      >
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontFamily: "Roboto",
                            fontWeight: "medium",
                            fontSize: "8px",
                          }}
                        >
                          <Text
                            style={{
                              textTransform: "uppercase",
                              fontFamily: "Roboto",
                              fontWeight: "bold",
                              fontSize: "8px",
                            }}
                          >
                            Empleado:
                          </Text>{" "}
                          {empleado.nombre} {empleado.apellido}
                        </Text>
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontFamily: "Roboto",
                            fontWeight: "medium",
                            fontSize: "8px",
                          }}
                        >
                          <Text
                            style={{
                              textTransform: "uppercase",
                              fontFamily: "Roboto",
                              fontWeight: "bold",
                              fontSize: "8px",
                            }}
                          >
                            Sector de trabajo:
                          </Text>{" "}
                          {empleado.sector_trabajo}
                        </Text>
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontFamily: "Roboto",
                            fontWeight: "medium",
                            fontSize: "8px",
                          }}
                        >
                          <Text
                            style={{
                              textTransform: "uppercase",
                              fontFamily: "Roboto",
                              fontWeight: "bold",
                              fontSize: "8px",
                            }}
                          >
                            Termino de pago:
                          </Text>{" "}
                          {empleado.termino_pago}
                        </Text>
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontFamily: "Roboto",
                            fontWeight: "medium",
                            fontSize: "8px",
                          }}
                        >
                          <Text
                            style={{
                              textTransform: "uppercase",
                              fontFamily: "Roboto",
                              fontWeight: "bold",
                              fontSize: "8px",
                            }}
                          >
                            Fecha:
                          </Text>{" "}
                          {updateFecha(empleado?.fecha_ingreso)}
                        </Text>
                        <Text
                          style={{
                            textTransform: "uppercase",
                            fontFamily: "Roboto",
                            fontWeight: "medium",
                            fontSize: "8px",
                          }}
                        >
                          <Text
                            style={{
                              textTransform: "uppercase",
                              fontFamily: "Roboto",
                              fontWeight: "bold",
                              fontSize: "8px",
                            }}
                          >
                            Antiguedad:
                          </Text>{" "}
                          {antiquity.years} años, {antiquity.months}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        marginTop: "10px",
                      }}
                    >
                      <Text
                        style={{
                          textTransform: "uppercase",
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                          fontSize: "10px",
                        }}
                      >
                        DATOS DEL SUELDO
                      </Text>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 4,
                        }}
                      >
                        {empleado.termino_pago === "quincenal" ? (
                          <View>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Quincena del cinco:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[0]?.quincena_cinco[0]
                                    ?.quincena_cinco
                                )
                              )}
                            </Text>

                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Quincena del veinte:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[1]?.quincena_veinte[0]
                                    ?.quincena_veinte
                                )
                              )}
                            </Text>

                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Cobro por banco:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[0]?.quincena_cinco[0]?.banco
                                )
                              )}
                            </Text>

                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Descuentos del cinco:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[0]?.quincena_cinco[0]
                                    ?.descuento_del_cinco
                                )
                              )}
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Descuentos del veinte:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[1]?.quincena_veinte[0]
                                    ?.descuento_del_veinte
                                )
                              )}
                            </Text>

                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Premio asistencia:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[0]?.quincena_cinco[0]
                                    ?.premio_asistencia
                                )
                              )}
                            </Text>

                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Premio producción:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[0]?.quincena_cinco[0]
                                    ?.premio_produccion
                                )
                              )}
                            </Text>

                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Comida:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[1]?.quincena_veinte[0]
                                    ?.comida
                                )
                              )}
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Otros:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[0]?.quincena_cinco[0]?.otros
                                )
                              )}
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Antiguedad:
                              </Text>{" "}
                              {formatearDinero(Number(total_antiguedad))}
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Sueldo del cinco:
                              </Text>{" "}
                              {formatearDinero(
                                Number(total_antiguedad) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.quincena_cinco
                                  ) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.premio_asistencia
                                  ) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.premio_produccion
                                  ) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.otros
                                  ) -
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.banco
                                  ) -
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.descuento_del_cinco
                                  )
                              )}
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Sueldo del veinte:
                              </Text>{" "}
                              {formatearDinero(
                                Number(
                                  empleado?.sueldo[1]?.quincena_veinte[0]
                                    ?.quincena_veinte
                                ) +
                                  Number(
                                    empleado?.sueldo[1]?.quincena_veinte[0]
                                      ?.comida
                                  ) -
                                  Number(
                                    empleado?.sueldo[1]?.quincena_veinte[0]
                                      ?.descuento_del_veinte
                                  )
                              )}
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Observacion del cinco:
                              </Text>{" "}
                              {
                                empleado?.sueldo[0]?.quincena_cinco[0]
                                  ?.observacion_cinco
                              }
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Observacion del veinte:
                              </Text>{" "}
                              {
                                empleado?.sueldo[1]?.quincena_veinte[0]
                                  ?.observacion_veinte
                              }
                            </Text>
                            <Text
                              style={{
                                textTransform: "uppercase",
                                fontFamily: "Roboto",
                                fontWeight: "medium",
                                fontSize: "8px",
                              }}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "bold",
                                  fontSize: "8px",
                                }}
                              >
                                Sueldo final:
                              </Text>{" "}
                              {formatearDinero(
                                Number(total_antiguedad) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.quincena_cinco
                                  ) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.premio_asistencia
                                  ) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.premio_produccion
                                  ) +
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.otros
                                  ) +
                                  Number(
                                    empleado?.sueldo[1]?.quincena_veinte[0]
                                      ?.quincena_veinte
                                  ) +
                                  Number(
                                    empleado?.sueldo[1]?.quincena_veinte[0]
                                      ?.comida
                                  ) -
                                  Number(
                                    empleado?.sueldo[1]?.quincena_veinte[0]
                                      ?.descuento_del_veinte
                                  ) -
                                  Number(
                                    empleado?.sueldo[0]?.quincena_cinco[0]
                                      ?.descuento_del_cinco
                                  )
                              )}
                            </Text>
                          </View>
                        ) : (
                          empleado.termino_pago === "mensual" && (
                            <View>
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Sueldo base:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.sueldo_basico)
                                )}
                              </Text>
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Comida:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.comida)
                                )}
                              </Text>

                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Otros:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.otros)
                                )}
                              </Text>

                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Premio asistencia:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.premio_asistencia)
                                )}
                              </Text>

                              {empleado?.sueldo?.premio_produccion > 0 && (
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "medium",
                                    fontSize: "8px",
                                  }}
                                >
                                  <Text
                                    style={{
                                      textTransform: "uppercase",
                                      fontFamily: "Roboto",
                                      fontWeight: "bold",
                                      fontSize: "8px",
                                    }}
                                  >
                                    Premio producción:
                                  </Text>{" "}
                                  {formatearDinero(
                                    Number(empleado?.sueldo?.premio_produccion)
                                  )}
                                </Text>
                              )}

                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Descuentos:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.descuento_del_cinco)
                                )}
                              </Text>
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Banco:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.banco)
                                )}
                              </Text>

                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Observación:
                                </Text>{" "}
                                {empleado?.sueldo?.observacion}
                              </Text>

                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Roboto",
                                  fontWeight: "medium",
                                  fontSize: "8px",
                                }}
                              >
                                <Text
                                  style={{
                                    textTransform: "uppercase",
                                    fontFamily: "Roboto",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Sueldo neto:
                                </Text>{" "}
                                {formatearDinero(
                                  Number(empleado?.sueldo?.sueldo_basico) +
                                    Number(empleado?.sueldo?.otros) +
                                    Number(empleado?.sueldo?.comida) +
                                    Number(
                                      empleado?.sueldo?.premio_produccion
                                    ) +
                                    Number(empleado?.sueldo?.premio_asistencia)
                                )}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};
