// juego.js - Versión final, corregida y optimizada
(() => {
  'use strict';

  const DADO = [
    { id: 1, nombre: "Muda Sorpresa", puntos: -10, nota: "Apareció un nuevo desperdicio." },
    { id: 2, nombre: "Apoyo del Equipo", puntos: +10, nota: "Un compañero ayuda: acción más eficaz." },
    { id: 3, nombre: "Falla de Proveedor", puntos: -15, nota: "Falla de proveedor: activa Plan B." },
    { id: 4, nombre: "Inspección de Cliente", puntos: +5, nota: "Cliente inspecciona: el orden cuenta." },
    { id: 5, nombre: "Idea del Piso", puntos: +15, nota: "Idea del operario: mejora inesperada." },
    { id: 6, nombre: "Cambio de Demanda", puntos: -8, nota: "Demanda cambia: ajusta rápido." }
  ];

  const DILEMAS = [
    { id: 1, nivel: 1, titulo: "La línea se detuvo otra vez", dilema: "Un operario perdió 20 minutos buscando una herramienta.", opciones: [
      { key: "A", text: "Que lo busque mejor", puntos: -10, nota: "+10 min de tiempo muerto." },
      { key: "B", text: "Etiquetamos y organizamos", puntos: +20, nota: "Desbloquea bono 5S en N2." },
      { key: "C", text: "Compramos 3 más", puntos: -5, nota: "Aumenta inventario oculto y costos." }
    ]},
    { id: 2, nivel: 1, titulo: "Pedido enterrado en el almacén", dilema: "Cliente exige entrega en 48h; pedido entre 300 pallets sin etiquetar.", opciones: [
      { key: "A", text: "Revisen uno por uno", puntos: -20, nota: "Cliente insatisfecho." },
      { key: "B", text: "Implementamos FIFO básico", puntos: +15, nota: "Desbloquea flujo visual en N4." },
      { key: "C", text: "Cancelamos", puntos: -30, nota: "Pérdida de ingresos y credibilidad." }
    ]},
    { id: 3, nivel: 2, titulo: "¿Para qué deshacerse?", dilema: "Compañero guarda piezas obsoletas 'por si acaso'.", opciones: [
      { key: "A", text: "Déjalo", puntos: -10, nota: "Espacio útil reducido." },
      { key: "B", text: "Zona cuarentena 30 días", puntos: +12, nota: "Kaizen suave; +liderazgo." },
      { key: "C", text: "Lo tiro sin avisar", puntos: -8, nota: "Conflicto; resistencia futura." }
    ]},
    { id: 4, nivel: 2, titulo: "El piso limpio no dura", dilema: "Después de 5S todo vuelve a desordenarse al día siguiente.", opciones: [
      { key: "A", text: "Yo lo mantengo solo", puntos: -12, nota: "Agotamiento; insostenible." },
      { key: "B", text: "Checklist diario con turnos", puntos: +18, nota: "Cultura de responsabilidad." },
      { key: "C", text: "Instalamos cámaras", puntos: -15, nota: "Clima tóxico; -15 moral." }
    ]},
    { id: 5, nivel: 3, titulo: "¿Por qué falla la máquina?", dilema: "Máquina se recalienta repetidamente.", opciones: [
      { key: "A", text: "Comprar nueva", puntos: -20, nota: "Gasto innecesario." },
      { key: "B", text: "Analizar con 5 por qué", puntos: +25, nota: "Solución sostenible." },
      { key: "C", text: "Poner un ventilador", puntos: 0, nota: "Parche temporal." }
    ]},
    { id: 6, nivel: 3, titulo: "Idea del operario", dilema: "Operario propone cambiar orden de ensamblaje.", opciones: [
      { key: "A", text: "No cambiamos nada", puntos: -8, nota: "Oportunidad perdida." },
      { key: "B", text: "Hacemos prueba en un turno", puntos: +20, nota: "Empoderamiento y mejora." },
      { key: "C", text: "Es trabajo de ingeniería", puntos: -10, nota: "Desmotiva; silencia ideas." }
    ]},
    { id: 7, nivel: 4, titulo: "Proveedor llegó tarde", dilema: "Sin materia prima la línea se paraliza; sugerencia: pedir el doble.", opciones: [
      { key: "A", text: "Stock de seguridad", puntos: -18, nota: "Regresa modelo inventario." },
      { key: "B", text: "Trabajar con proveedor", puntos: +18, nota: "Colaboración Lean." },
      { key: "C", text: "Cambiar proveedor más caro", puntos: -10, nota: "Sube costos; no ataca raíz." }
    ]},
    { id: 8, nivel: 4, titulo: "Vendedor prometió 500", dilema: "Capacidad diaria 300; cliente pide 500 para mañana.", opciones: [
      { key: "A", text: "Prometemos 500", puntos: -20, nota: "Sobrecarga y errores." },
      { key: "B", text: "Negociamos entrega parcial", puntos: +20, nota: "Cumple con Takt Time." },
      { key: "C", text: "Rechazamos pedido", puntos: -5, nota: "Pérdida comercial." }
    ]},
    { id: 9, nivel: 5, titulo: "Nuevo operario no entiende el tablero", dilema: "El operario pregunta '¿Para qué sirve esto?'.", opciones: [
      { key: "A", text: "Alguien lo explicará algún día", puntos: -12, nota: "Pérdida de estándares." },
      { key: "B", text: "Ritual diario: 5 minutos", puntos: +20, nota: "Refuerza cultura visual." },
      { key: "C", text: "Quitamos el tablero", puntos: -25, nota: "Vuelta al caos en 2 semanas." }
    ]},
    { id: 10, nivel: 5, titulo: "¿Eliminamos Kaizen?", dilema: "Gerente pide recortes y sugiere eliminar Kaizen.", opciones: [
      { key: "A", text: "Aceptar recorte", puntos: -20, nota: "Pérdida de momentum." },
      { key: "B", text: "Integrar Kaizen al día a día", puntos: +30, nota: "Kaizen como hábito." },
      { key: "C", text: "Oponerse fuertemente", puntos: +10, nota: "Defiende la cultura." }
    ]}
  ];

  let nivelActual = 0;
  let puntos = 0;
  let historial = [];

  // --- Estado ---
  function saveState() {
    try {
      localStorage.setItem('oe_puntos', String(puntos));
      localStorage.setItem('oe_historial', JSON.stringify(historial));
      localStorage.setItem('oe_nivel', String(nivelActual));
    } catch (e) { console.warn('localStorage no disponible'); }
  }

  function loadState() {
    try {
      const p = parseInt(localStorage.getItem('oe_puntos'), 10);
      if (!isNaN(p)) puntos = p;
      const hist = localStorage.getItem('oe_historial');
      if (hist) historial = JSON.parse(hist);
      const n = parseInt(localStorage.getItem('oe_nivel'), 10);
      if (!isNaN(n)) nivelActual = n;
    } catch (e) { console.warn('Error al cargar'); }
  }

  function lanzarDado() {
    const cara = DADO[Math.floor(Math.random() * DADO.length)];
    puntos += cara.puntos;
    historial.push({ tipo: 'dado', ...cara, nivel: nivelActual + 1 });
    saveState();
    alert(`🎲 Dado Lean: ${cara.nombre}\n${cara.nota}\nPuntos: ${cara.puntos > 0 ? '+' : ''}${cara.puntos}`);
    return cara;
  }

  function mostrarNivel() {
    if (nivelActual >= 5) {
      finalizar();
      return;
    }

    const nivelNum = nivelActual + 1;
    const dilemasNivel = DILEMAS.filter(d => d.nivel === nivelNum);
    if (!dilemasNivel.length) {
      nivelActual++;
      saveState();
      mostrarNivel();
      return;
    }

    // Aleatoriedad: puede repetir dilemas, pero evita el mismo seguido
    const lastDilema = historial.filter(h => h.tipo === 'decision').slice(-1)[0];
    let dilema;
    if (lastDilema && lastDilema.nivel === nivelNum) {
      const otros = dilemasNivel.filter(d => d.id !== lastDilema.dilemaId);
      dilema = otros.length ? otros[Math.floor(Math.random() * otros.length)] : dilemasNivel[0];
    } else {
      dilema = dilemasNivel[Math.floor(Math.random() * dilemasNivel.length)];
    }

    document.getElementById('titulo').textContent = `Nivel ${nivelNum} — ${dilema.titulo}`;
    document.getElementById('instruccion').textContent = dilema.dilema;

    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `<p>${dilema.dilema}</p><div class="opts"></div>`;
    const optsDiv = contenido.querySelector('.opts');

    dilema.opciones.forEach(op => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.innerHTML = `<strong>${op.key})</strong> ${op.text}`;
      btn.onclick = () => procesarOpcion(op, dilema.id, nivelNum);
      optsDiv.appendChild(btn);
    });
  }

  function procesarOpcion(op, dilemaId, nivelNum) {
    puntos += op.puntos;
    historial.push({ tipo: 'decision', dilemaId, opcion: op.key, puntos: op.puntos, nota: op.nota, nivel: nivelNum });
    saveState();

    let lanzar = Math.random() < 0.5;
    if (lanzar) lanzarDado();

    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
      <p><strong>Has elegido ${op.key}:</strong> ${op.nota}</p>
      <p>Tus puntos actuales: <strong>${puntos}</strong></p>
    `;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Siguiente nivel';
    btn.onclick = () => {
      nivelActual++;
      saveState();
      mostrarNivel();
    };
    contenido.appendChild(btn);
  }

  function finalizar() {
    saveState();
    window.location.href = 'final.html';
  }

  // --- Inicialización ---
  window.addEventListener('load', () => {
    loadState();
    const rolSpan = document.getElementById('rolSpan');
    if (rolSpan) rolSpan.textContent = localStorage.getItem('rol') || 'Sin rol';

    document.getElementById('guardar')?.addEventListener('click', () => {
      saveState();
      alert('Progreso guardado en este navegador.');
    });

    document.getElementById('irFinal')?.addEventListener('click', finalizar);

    if (!window.location.pathname.endsWith('final.html')) {
      mostrarNivel();
    }
  });
})();
