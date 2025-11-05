import React from "react";

// Icono de Calculadora
export const CalculatorIcon = (props) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z"
    />
  </svg>
);

// Icono de Información
export const InfoIcon = (props) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.06 0l.041.02m-1.06 0a.75.75 0 1 1-1.06 0m1.06 0v3.75m0 3.75h.008v.008H12v-.008z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0z"
    />
  </svg>
);
