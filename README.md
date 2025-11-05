# 🇪🇸 Calculadora de Sueldo Neto Estimado (IRPF)

Una aplicación web rápida y sencilla, construida con **React y Vite**, para estimar el salario neto mensual y anual en España a partir del salario bruto anual, teniendo en cuenta las deducciones simplificadas de IRPF y Seguridad Social (SS).

---

## 💡 Características Principales

* **Cálculo Estimado de Neto:** Convierte el Salario Bruto Anual a Neto Mensual/Anual.
* **Ajuste IRPF Simplificado:** El cálculo de la retención de IRPF es dinámico y se ajusta según:
    * Sueldo Bruto Anual (Tramos IRPF 2024/2025).
    * Número de Pagas (12 o 14).
    * Situación Personal (Soltero/Casado).
    * Número de Hijos.
* **Deducción Fija de SS:** Aplica una cotización fija del 6.4% sobre el salario bruto.
* **Desglose Detallado:** Muestra el desglose de deducciones de IRPF y SS.

---

## 🛠️ Stack Tecnológico

* **Framework:** [React](https://reactjs.org/)
* **Herramientas de Build:** [Vite](https://vitejs.dev/)
* **Lenguaje:** JavaScript / JSX
* **Estilos:** CSS puro (Separado en `App.css` para una mejor organización).

---

## 🚀 Cómo Empezar

Sigue estos pasos para clonar el repositorio y ejecutar la aplicación en tu entorno local.

### Prerrequisitos

Asegúrate de tener [Node.js](https://nodejs.org/es/) instalado.

### Instalación

1.  Clona este repositorio:
    ```bash
    git clone [https://github.com/TU_USUARIO/calculadora-sueldo-neto.git](https://github.com/albergrs90/calculadora-sueldo-neto.git)
    ```
2.  Navega al directorio del proyecto:
    ```bash
    cd calculadora-sueldo-neto
    ```
3.  Instala las dependencias:
    ```bash
    npm install
    ```

### Ejecución Local

1.  Inicia el servidor de desarrollo con Vite:
    ```bash
    npm run dev
    ```
2.  La aplicación se abrirá en tu navegador.
