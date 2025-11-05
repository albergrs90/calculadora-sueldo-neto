import React, { useState, useEffect, useRef } from "react";

/**
 * Componente reutilizable para la entrada de Sueldo Bruto con slider
 */
const InputGroup = ({
  label,
  value,
  unit,
  onValueChange,
  max = 150000,
  step = 100,
}) => {
  // Estado local para el campo de texto (para manejar la entrada sin formato)
  const [textValue, setTextValue] = useState(String(value));
  const inputRef = useRef(null);

  useEffect(() => {
    // Sincroniza el estado global (value) con el estado local de texto (textValue)
    // SOLO si el input no está enfocado
    if (
      String(value) !== textValue &&
      document.activeElement !== inputRef.current
    ) {
      setTextValue(String(value));
    }
  }, [value, textValue]);

  // Maneja el cambio en el campo de texto (solo permite números)
  const handleTextChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, "");
    setTextValue(input);
    const numValue = Number(input);
    // Actualiza el estado global solo si es un número válido
    if (Number.isFinite(numValue)) {
      onValueChange(Math.min(max, Math.max(0, numValue)));
    }
  };

  // Maneja la pérdida de foco (Blur) para normalizar y clamp el valor
  const handleBlur = () => {
    const numValue = Number(textValue) || 0;
    const clamped = Math.min(max, Math.max(0, numValue));
    onValueChange(clamped);
    setTextValue(String(clamped));
  };

  // Maneja el cambio en el slider
  const handleSliderChange = (e) => {
    const numValue = Number(e.target.value);
    onValueChange(numValue);
  };

  return (
    <div className="input-group">
      <label className="input-label flex-between mb-2">{label}</label>

      <div className="input-field-wrapper">
        <input
          ref={inputRef}
          type="text"
          pattern="[0-9]*"
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          min="0"
          max={max}
          step="100"
          className="input-text"
          placeholder="Ej: 25500"
        />
        <span className="input-unit">{unit}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="input-slider"
      />
      <div className="slider-range-labels">
        <span>0 {unit}</span>
        <span>
          {new Intl.NumberFormat("es-ES", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(max)}{" "}
          {unit}
        </span>
      </div>
    </div>
  );
};

export default InputGroup;
