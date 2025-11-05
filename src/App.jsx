import React, { useState, useMemo } from "react";
import "./App.css"; // Importamos los estilos desde el archivo App.css

// --- IMPORTACIONES DE COMPONENTES ---
import { CalculatorIcon, InfoIcon } from "./components/Icons";
import InputGroup from "./components/InputGroup";

// --- T A B L A S S I M P L I F I C A D A S ---
const COTIZACION_SS_BASE = 0.064; // Cotización SS 6.4%

// Tramos IRPF para 2025 (mismos que 2024)
const TRAMOS_IRPF = [
  { limite: 12450, tipo: 0.19 },
  { limite: 20200, tipo: 0.24 },
  { limite: 35200, tipo: 0.3 },
  { limite: 60000, tipo: 0.37 },
  { limite: 300000, tipo: 0.45 },
  { limite: Infinity, tipo: 0.47 },
];

/**
 * Función que calcula una retención de IRPF estimada de forma más precisa.
 */
const calcularRetencionIRPF = (brutoAnual, hijos, estadoCivil) => {
  if (brutoAnual <= 0) return 0;

  // 1. Reducción por rendimientos del trabajo (RdT) - SIMPLIFICADO
  const reduccionRdT = 2000;

  // 2. Cálculo del Mínimo Personal y Familiar (MPF) - SIMPLIFICADO
  let minimoPersonal = 5550; // Mínimo personal por defecto

  // Mínimo por descendientes (simplificado)
  if (hijos === 1) minimoPersonal += 2400;
  else if (hijos === 2) minimoPersonal += 4800;
  else if (hijos >= 3) minimoPersonal += 7200;

  // Mínimo por estado civil (casado, tributación conjunta simplificada)
  if (estadoCivil === "CASADO") minimoPersonal += 1200;

  // 3. Base Imponible y Base de Gravamen
  const baseImponible = Math.max(0, brutoAnual - reduccionRdT);
  const baseGravamen = Math.max(0, baseImponible - minimoPersonal);

  // 4. Cálculo de la Cuota Íntegra Estimada (Aplicando Tramos a la Base de Gravamen)
  let cuotaAcumulada = 0;
  let tramoAnterior = 0;

  for (const tramo of TRAMOS_IRPF) {
    if (baseGravamen > tramoAnterior) {
      const baseTramo = Math.min(baseGravamen, tramo.limite) - tramoAnterior;
      cuotaAcumulada += baseTramo * tramo.tipo;
    }
    if (baseGravamen <= tramo.limite) break;
    tramoAnterior = tramo.limite;
  }

  // 5. Cálculo del Tipo de Retención Efectivo
  const retencionAnual = cuotaAcumulada;
  const tipoEfectivo = brutoAnual > 0 ? retencionAnual / brutoAnual : 0;

  // Asegura un mínimo (2%) y un máximo (45%)
  return Math.min(0.45, Math.max(0.02, tipoEfectivo));
};

/**
 * Componente principal de la aplicación.
 */
const App = () => {
  // ------------------- ESTADO -------------------
  const [brutoAnual, setBrutoAnual] = useState(30000);
  const [pagas, setPagas] = useState(14);
  const [hijos, setHijos] = useState(0);
  const [estadoCivil, setEstadoCivil] = useState("SOLTERO");

  // ------------------- LÓGICA DE CÁLCULO -------------------
  const resultados = useMemo(() => {
    // ... (El resto de la lógica de useMemo se mantiene igual)
    const numericBrutoAnual = Number(brutoAnual) || 0;

    if (numericBrutoAnual <= 0) {
      return {
        brutoMensual: 0,
        retencionIRPF: 0,
        cotizacionSS: 0,
        netoMensual: 0,
        netoAnual: 0,
        cotizacionSS_Mensual: 0,
        retencionIRPF_Mensual: 0,
      };
    }

    // 1. Calcular el tipo de IRPF estimado (con la lógica mejorada)
    const retencionIRPF_Tipo = calcularRetencionIRPF(
      numericBrutoAnual,
      hijos,
      estadoCivil
    );

    // 2. Calcular la Cotización a la Seguridad Social (SS) anual
    const cotizacionSS_Anual = numericBrutoAnual * COTIZACION_SS_BASE;

    // 3. Calcular la Retención de IRPF anual
    const retencionIRPF_Anual = numericBrutoAnual * retencionIRPF_Tipo;

    // 4. Calcular el Neto Anual
    const netoAnual =
      numericBrutoAnual - retencionIRPF_Anual - cotizacionSS_Anual;

    // 5. Cálculos mensuales
    const numPagas = Number(pagas);
    const netoMensual = netoAnual / numPagas;
    const brutoMensual = numericBrutoAnual / numPagas;
    const cotizacionSS_Mensual = cotizacionSS_Anual / numPagas;
    const retencionIRPF_Mensual = retencionIRPF_Anual / numPagas;

    return {
      brutoMensual,
      retencionIRPF: retencionIRPF_Tipo,
      cotizacionSS: cotizacionSS_Anual,
      netoMensual,
      netoAnual,
      cotizacionSS_Mensual,
      retencionIRPF_Mensual,
    };
  }, [brutoAnual, pagas, hijos, estadoCivil]);

  // ------------------- FUNCIÓN DE FORMATO -------------------
  const formatEuro = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // ------------------- RENDERIZADO PRINCIPAL -------------------
  return (
    <div className="app-container">
      <div className="main-wrapper">
        <header className="app-header">
          <h1 className="main-title">
            <CalculatorIcon className="main-title-icon" />
            Calculadora Sueldo Neto
          </h1>
          <p className="app-subtitle">
            Calculadora rápida y <strong>estimada</strong> de salario neto anual
            en España (2024/2025).
          </p>
        </header>

        <main className="calculator-card">
          {/* Tarjeta de Resultado Principal */}
          <div className="result-box">
            <h2 className="result-label">Tu Sueldo Neto Mensual Estimado</h2>
            <p className="result-neto-mensual">
              {formatEuro(resultados.netoMensual)}
            </p>
            <p className="result-neto-anual">
              (Neto Anual: <strong>{formatEuro(resultados.netoAnual)}</strong>)
            </p>
          </div>

          {/* Sección de Datos de Cálculo */}
          <h3 className="section-title">Datos de Cálculo</h3>

          {/* 1. Sueldo Bruto Anual (AHORA USA EL COMPONENTE IMPORTADO) */}
          <InputGroup
            label="1. Sueldo Bruto Anual (€)"
            value={brutoAnual}
            unit="€"
            onValueChange={setBrutoAnual}
            max={150000}
            step={100}
          />

          {/* 2. Número de Pagas */}
          <div className="mb-6">
            <label className="input-label block mb-2">2. Número de Pagas</label>
            <div className="pagas-buttons">
              {[12, 14].map((num) => (
                <button
                  key={num}
                  onClick={() => setPagas(num)}
                  className={`btn-opcion ${
                    pagas === num ? "active" : "inactive"
                  }`}
                >
                  {num} Pagas
                </button>
              ))}
            </div>
          </div>

          {/* 3. Situación Personal (IRPF Simplificado) */}
          <div className="mb-6">
            <label className="input-label block mb-2">
              3. Situación Personal (IRPF Simplificado)
            </label>
            <div className="estado-civil-buttons">
              {["SOLTERO", "CASADO"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setEstadoCivil(estado)}
                  className={`btn-opcion small ${
                    estadoCivil === estado ? "active" : "inactive"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Número de Hijos */}
          <div className="mb-6">
            <label className="input-label block mb-2">
              4. Número de Hijos Menores de 25
            </label>
            <div className="hijos-controls">
              <button
                onClick={() => setHijos(Math.max(0, hijos - 1))}
                className="hijos-btn"
              >
                −
              </button>
              <span className="hijos-count">{hijos}</span>
              <button onClick={() => setHijos(hijos + 1)} className="hijos-btn">
                +
              </button>
            </div>
          </div>

          {/* Sección de Desglose de Cálculo */}
          <div className="desglose-section">
            <h4 className="desglose-title">
              Desglose Estimado Mensual
              <span
                className="info-icon"
                // Tooltip de información detallada
                title={`
Cálculo de IRPF (Estimado): Utiliza tramos generales 2024/2025. Se aplica una reducción base por rendimientos del trabajo y un mínimo personal/familiar simplificado (según estado civil e hijos) para obtener un tipo de retención efectivo (${Math.round(
                  resultados.retencionIRPF * 100
                )}%).

Cotización S.S. (Fija): Se aplica un 6.4% fijo sobre el Salario Bruto Anual. 

Aviso: El cálculo oficial de nómina es más complejo y depende de tu CCAA y contrato.
                `}
              >
                <InfoIcon />
              </span>
            </h4>
            <div className="desglose-item-list">
              {/* Bruto Mensual */}
              <div className="desglose-item">
                <span>Bruto Mensual ({pagas} Pagas)</span>
                <span>{formatEuro(resultados.brutoMensual)}</span>
              </div>

              {/* Retención IRPF */}
              <div className="desglose-item deduccion item-bruto">
                <span>
                  Retención IRPF ({Math.round(resultados.retencionIRPF * 100)}%
                  est.)
                </span>
                <span>
                  {/* Se muestra en negativo para indicar deducción */}
                  {formatEuro(resultados.retencionIRPF_Mensual * -1)}
                </span>
              </div>

              {/* Cotización S.S. */}
              <div className="desglose-item deduccion">
                <span>Cotización S.S. ({COTIZACION_SS_BASE * 100}%)</span>
                <span>
                  {/* Se muestra en negativo para indicar deducción */}
                  {formatEuro(resultados.cotizacionSS_Mensual * -1)}
                </span>
              </div>

              {/* NETO MENSUAL (Resultado Final) */}
              <div className="neto-final">
                <span>NETO MENSUAL</span>
                <span>{formatEuro(resultados.netoMensual)}</span>
              </div>
            </div>
          </div>

          {/* Aviso Legal */}
          <p className="legal-notice">
            <strong>Aviso:</strong> Esta es una herramienta de estimación. Para
            cálculos oficiales, consulta la Agencia Tributaria o un asesor
            fiscal.
          </p>
        </main>
      </div>
    </div>
  );
};

export default App;
