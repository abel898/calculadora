function detectarTipoCircuito(R, L, C) {
    if (R > 0 && L > 0 && C > 0) {
        return 'RLC';
    } else if (R > 0 && L > 0) {
        return 'RL';
    } else if (R > 0 && C > 0) {
        return 'RC';
    } else if (L > 0 && C > 0) {
        return 'LC';
    } else {
        alert("Ingrese al menos dos componentes (R, L, o C) con valores mayores a cero.");
        return null;
    }
}

function calcularImpedancia() {
    const configuracion = document.getElementById('tipoCircuito').value;
    if (configuracion === 'serie') {
        calcularImpedanciaSerie();
    } else if (configuracion === 'paralelo') {
        calcularImpedanciaParalelo();
    }
}

function obtenerValores() {
    return {
        R: parseFloat(document.getElementById('resistencia').value) * parseFloat(document.getElementById('unidadR').value),
        f: parseFloat(document.getElementById('frecuencia').value) * parseFloat(document.getElementById('unidadF').value),
        L: parseFloat(document.getElementById('inductancia').value) * parseFloat(document.getElementById('unidadL').value),
        C: parseFloat(document.getElementById('capacitancia').value) * parseFloat(document.getElementById('unidadC').value),
        V: parseFloat(document.getElementById('voltaje').value) * parseFloat(document.getElementById('unidadV').value)
    };
}

function calcularImpedanciaSerie() {
    const { R, f, L, C, V } = obtenerValores();
    const tipoCircuito = detectarTipoCircuito(R, L, C);
    if (!tipoCircuito) return;

    const XL = 2 * Math.PI * f * L;  // Reactancia inductiva
    const XC = C !== 0 ? 1 / (2 * Math.PI * f * C) : 0;  // Reactancia capacitiva

    let Z, anguloZ;
    if (tipoCircuito === 'RL') {
        Z = Math.sqrt(R**2 + XL**2);
        anguloZ = Math.atan(XL / R) * (180 / Math.PI);
    } else if (tipoCircuito === 'RC') {
        Z = Math.sqrt(R**2 + XC**2);
        anguloZ = -Math.atan(XC / R) * (180 / Math.PI);
    } else if (tipoCircuito === 'LC') {
        Z = Math.abs(XL - XC);
        anguloZ = XL > XC ? 90 : -90;
    } else if (tipoCircuito === 'RLC') {
        Z = Math.sqrt(R**2 + (XL - XC)**2);
        anguloZ = Math.atan((XL - XC) / R) * (180 / Math.PI);
    }

    const I = V / Z;  // Corriente (magnitud), utilizando solo la magnitud de Z sin el ángulo
    const anguloI = -anguloZ;  // Ángulo de fase de la corriente es opuesto al de la impedancia

    mostrarResultados(Z, anguloZ, I, anguloI, `${tipoCircuito} en Serie`);
}

function calcularImpedanciaParalelo() {
    const { R, f, L, C, V } = obtenerValores();
    const tipoCircuito = detectarTipoCircuito(R, L, C);
    if (!tipoCircuito) return;

    const XL = 2 * Math.PI * f * L;  // Reactancia inductiva
    const XC = C !== 0 ? 1 / (2 * Math.PI * f * C) : 0;  // Reactancia capacitiva

    let Z, anguloZ;
    if (tipoCircuito === 'RL') {
        const G = 1 / R, BL = 1 / XL;
        const Y = Math.sqrt(G**2 + BL**2);
        Z = 1 / Y;
        anguloZ = -Math.atan(BL / G) * (180 / Math.PI);
    } else if (tipoCircuito === 'RC') {
        const G = 1 / R, BC = 1 / XC;
        const Y = Math.sqrt(G**2 + BC**2);
        Z = 1 / Y;
        anguloZ = -Math.atan(BC / G) * (180 / Math.PI);
    } else if (tipoCircuito === 'LC') {
        Z = Math.abs(1 / XL - 1 / XC);
        anguloZ = XL > XC ? 90 : -90;
    } else if (tipoCircuito === 'RLC') {
        const G = 1 / R, BL = 1 / XL, BC = 1 / XC;
        const Y = Math.sqrt(G**2 + (BC - BL)**2);
        Z = 1 / Y;
        anguloZ = -Math.atan((BC - BL) / G) * (180 / Math.PI);
    }

    const I = V / Z;  // Corriente (magnitud)
    const anguloI = -anguloZ;  // Ángulo de fase de la corriente es opuesto al de la impedancia

    mostrarResultados(Z, anguloZ, I, anguloI, `${tipoCircuito} en Paralelo`);
}

function mostrarResultados(Z, anguloZ, I, anguloI, tipoCircuito) {
    document.getElementById('impedanciaTotal').textContent = `Z = ${Z.toFixed(2)} ∠ ${anguloZ.toFixed(2)}° Ω`;
    
    // Solo se muestra el ángulo de desfase invertido (sin mostrar el ángulo original)
    document.getElementById('angulo').textContent = `Ángulo de desfase = ${(-anguloZ).toFixed(2)}°`;
    
    document.getElementById('corrienteTotal').textContent = `I = ${I.toFixed(2)} ∠ ${anguloI.toFixed(2)}° A`;
    document.getElementById('tipoCircuitoResultante').textContent = `Tipo de Circuito: ${tipoCircuito}`;
}
