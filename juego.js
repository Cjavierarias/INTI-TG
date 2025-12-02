const niveles = [
  {
    titulo: "Nivel 1: El Caos Inicial",
    instruccion: "Identifica el desperdicio y toma una decisión.",
    tipo: "dilema",
    dilema: "Un operario pierde 20 min buscando una herramienta.",
    opciones: [
      { texto: "Que lo busque mejor", consecuencia: -10 },
      { texto: "Etiquetamos y organizamos", consecuencia: +20 },
      { texto: "Compramos 3 más", consecuencia: -5 }
    ]
  },
  {
    titulo: "Nivel 2: 5S en Acción",
    instruccion: "Arrastra los objetos a la zona correcta.",
    tipo: "arrastrar",
    tareas: [
      { nombre: "Herramientas", zona: "Seiton" },
      { nombre: "Basura", zona: "Seiri" },
      { nombre: "Limpieza", zona: "Seiso" }
    ]
  },
  {
    titulo: "Nivel 3: Kaizen",
    instruccion: "Elige la causa raíz real.",
    tipo: "dilema",
    dilema: "Una máquina se recalienta. ¿Qué haces?",
    opciones: [
      { texto: "Comprar nueva máquina", consecuencia: -10 },
      { texto: "Analizar con 5 por qué", consecuencia: +20 },
      { texto: "Ponerle un ventilador", consecuencia: 0 }
    ]
  },
  {
    titulo: "Nivel 4: Just in Time",
    instruccion: "Ajusta la producción a la demanda.",
    tipo: "dilema",
    dilema: "El cliente pide 500 unidades, pero solo puedes hacer 300.",
    opciones: [
      { texto: "Prometer 500 y sobrecargar", consecuencia: -15 },
      { texto: "Negociar entrega parcial", consecuencia: +15 },
      { texto: "Rechazar el pedido", consecuencia: -5 }
    ]
  },
  {
    titulo: "Nivel 5: Cultura Lean",
    instruccion: "¿Cómo sostienes la mejora?",
    tipo: "dilema",
    dilema: "El gerente quiere eliminar las reuniones Kaizen.",
    opciones: [
      { texto: "Aceptar para ahorrar tiempo", consecuencia: -20 },
      { texto: "Integrar Kaizen al día a día", consecuencia: +25 },
      { texto: "Oponerte fuertemente", consecuencia: +10 }
    ]
  }
];

let nivelActual = 0;

function mostrarNivel() {
  const nivel = niveles[nivelActual];
  document.getElementById('titulo').textContent = nivel.titulo;
  document.getElementById('instruccion').textContent = nivel.instruccion;
  const contenido = document.getElementById('contenido');
  contenido.innerHTML = '';

  if (nivel.tipo === 'dilema') {
    contenido.innerHTML = `<p>${nivel.dilema}</p>`;
    nivel.opciones.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.textContent = op.texto;
      btn.onclick = () => {
        let puntos = parseInt(localStorage.getItem('puntos')) + op.consecuencia;
        localStorage.setItem('puntos', puntos);
        document.getElementById('siguiente').style.display = 'inline-block';
        contenido.innerHTML = `<p>Decisión registrada. Puntos actuales: ${puntos}</p>`;
      };
      contenido.appendChild(btn);
    });
  }

  if (nivel.tipo === 'arrastrar') {
    const zonas = ['Seiri', 'Seiton', 'Seiso'];
    zonas.forEach(z => {
      const div = document.createElement('div');
      div.className = 'zona';
      div.id = z;
      div.textContent = z;
      div.ondrop = drop;
      div.ondragover = allowDrop;
      contenido.appendChild(div);
    });

    nivel.tareas.forEach(t => {
      const item = document.createElement('div');
      item.className = 'item';
      item.draggable = true;
      item.textContent = t.nombre;
      item.dataset.zona = t.zona;
      item.ondragstart = drag;
      contenido.appendChild(item);
    });

    document.getElementById('siguiente').style.display = 'inline-block';
  }

  // Dado Lean
  if (Math.random() < 0.5) {
    const eventos = [
      "📦 Muda sorpresa: aparece inventario oculto",
      "🤝 Apoyo del equipo: +10 puntos",
      "📉 Falla de proveedor",
      "👀 Cliente inspecciona",
      "💡 Idea de operario",
      "📊 Cambio de demanda"
    ];
    const evento = eventos[Math.floor(Math.random() * 6)];
    alert("🎲 Dado Lean: " + evento);
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.dataset.zona);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  if (data === ev.target.id) {
    let puntos = parseInt(localStorage.getItem('puntos')) + 10;
    localStorage.setItem('puntos', puntos);
    alert("¡Correcto! +10 puntos");
  } else {
    alert("Incorrecto");
  }
}

function siguiente() {
  nivelActual++;
  if (nivelActual < niveles.length) {
    mostrarNivel();
    document.getElementById('siguiente').style.display = 'none';
  } else {
    window.location.href = 'final.html';
  }
}

window.onload = mostrarNivel;
