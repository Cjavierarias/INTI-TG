// juego.js - versión mejorada para "Operación Eficiencia"
const DADO = [
  { id:1, nombre:"Muda Sorpresa", efecto: (ctx)=> { ctx.logEvent("Muda Sorpresa"); ctx.modifyPoints(-10); ctx.note="Apareció un nuevo desperdicio."; } },
  { id:2, nombre:"Apoyo del Equipo", efecto: (ctx)=> { ctx.logEvent("Apoyo del Equipo"); ctx.modifyPoints(+10); ctx.note="Un compañero ayuda: acción 50% menos esfuerzo."; } },
  { id:3, nombre:"Falla de Proveedor", efecto: (ctx)=> { ctx.logEvent("Falla de Proveedor"); ctx.modifyPoints(-15); ctx.note="Falla de proveedor: activa Plan B."; } },
  { id:4, nombre:"Inspección de Cliente", efecto: (ctx)=> { ctx.logEvent("Inspección de Cliente"); ctx.modifyPoints(+5); ctx.note="Inspección: se premia el orden si estás listo."; } },
  { id:5, nombre:"Idea del Piso", efecto: (ctx)=> { ctx.logEvent("Idea del Piso"); ctx.modifyPoints(+15); ctx.note="Idea del operario: mejora gratuita si la adoptas."; } },
  { id:6, nombre:"Cambio de Demanda", efecto: (ctx)=> { ctx.logEvent("Cambio de Demanda"); ctx.modifyPoints(-8); ctx.note="Cambio de demanda: ajusta producción en 24h."; } }
];

const DILEMAS = [
  { id:1, nivel:1, titulo:"La línea se detuvo otra vez", dilema:"Un operario perdió 20 minutos buscando una herramienta.", opciones:[
    {key:"A", text:"Que lo busque mejor", puntos:-10, nota:"+10 min de tiempo muerto."},
    {key:"B", text:"Etiquetamos y organizamos", puntos:+20, nota:"Desbloquea bono 5S en N2."},
    {key:"C", text:"Compramos 3 más", puntos:-5, nota:"Aumenta inventario oculto y costos."}
  ]},
  { id:2, nivel:1, titulo:"Pedido enterrado en el almacén", dilema:"Cliente exige entrega en 48h; pedido entre 300 pallets sin etiquetar.", opciones:[
    {key:"A", text:"Revisen uno por uno", puntos:-20, nota:"Cliente insatisfecho."},
    {key:"B", text:"Implementamos FIFO básico", puntos:+15, nota:"Desbloquea flujo visual en N4."},
    {key:"C", text:"Cancelamos", puntos:-30, nota:"Pérdida de ingresos y credibilidad."}
  ]},
  { id:3, nivel:2, titulo:"¿Para qué deshacerse?", dilema:"Compañero guarda piezas obsoletas 'por si acaso'.", opciones:[
    {key:"A", text:"Déjalo", puntos:-10, nota:"Espacio útil reducido."},
    {key:"B", text:"Zona cuarentena 30 días", puntos:+12, nota:"Kaizen suave; +liderazgo."},
    {key:"C", text:"Lo tiro sin avisar", puntos:-8, nota:"Conflicto; resistencia futura."}
  ]},
  { id:4, nivel:2, titulo:"El piso limpio no dura", dilema:"Después de 5S todo vuelve a desordenarse al día siguiente.", opciones:[
    {key:"A", text:"Yo lo mantengo solo", puntos:-12, nota:"Agotamiento; insostenible."},
    {key:"B", text:"Checklist diario con turnos", puntos:+18, nota:"Cultura de responsabilidad."},
    {key:"C", text:"Instalamos cámaras", puntos:-15, nota:"Clima tóxico; -15 moral."}
  ]},
  { id:5, nivel:3, titulo:"¿Por qué falla la máquina?", dilema:"Máquina se recalienta repetidamente.", opciones:[
    {key:"A", text:"Comprar nueva", puntos:-20, nota:"Gasto innecesario."},
    {key:"B", text:"Analizar con 5 por qué", puntos:+25, nota:"Solución sostenible; desbloquea autonmto."},
    {key:"C", text:"Poner un ventilador", puntos:0, nota:"Parche temporal."}
  ]},
  { id:6, nivel:3, titulo:"Idea del operario", dilema:"Operario propone cambiar orden de ensamblaje.", opciones:[
    {key:"A", text:"No cambiamos nada", puntos:-8, nota:"Oportunidad perdida."},
    {key:"B", text:"Hacemos prueba en un turno", puntos:+20, nota:"Empoderamiento y mejora."},
    {key:"C", text:"Es trabajo de ingeniería", puntos:-10, nota:"Desmotiva; silencia ideas."}
  ]},
  { id:7, nivel:4, titulo:"Proveedor llegó tarde", dilema:"Sin materia prima la línea se paraliza; sugerencia: pedir el doble.", opciones:[
    {key:"A", text:"Stock de seguridad", puntos:-18, nota:"Regresa modelo inventario; pierde JIT."},
    {key:"B", text:"Trabajar con proveedor", puntos:+18, nota:"Colaboración Lean."},
    {key:"C", text:"Cambiar proveedor más caro", puntos:-10, nota:"Sube costos; no ataca raíz."}
  ]},
  { id:8, nivel:4, titulo:"Vendedor prometió 500", dilema:"Capacidad diaria 300; cliente pide 500 para mañana.", opciones:[
    {key:"A", text:"Prometemos 500", puntos:-20, nota:"Sobrecarga y errores."},
    {key:"B", text:"Negociamos entrega parcial", puntos:+20, nota:"Cumple con Takt Time y transparencia."},
    {key:"C", text:"Rechazamos pedido", puntos:-5, nota:"Pérdida comercial."}
  ]},
  { id:9, nivel:5, titulo:"Nuevo operario no entiende el tablero", dilema:"El operario pregunta '¿Para qué sirve esto?'.", opciones:[
    {key:"A", text:"Alguien lo explicará algún día", puntos:-12, nota:"Pérdida de estándares."},
    {key:"B", text:"Ritual diario: 5 minutos", puntos:+20, nota:"Refuerza cultura visual."},
    {key:"C", text:"Quitamos el tablero", puntos:-25, nota:"Vuelta al caos en 2 semanas."}
  ]},
  { id:10, nivel:5, titulo:"¿Eliminamos Kaizen?", dilema:"Gerente pide recortes y sugiere eliminar Kaizen.", opciones:[
    {key:"A", text:"Aceptar recorte", puntos:-20, nota:"Pérdida de momentum."},
    {key:"B", text:"Integrar Kaizen al día a día", puntos:+30, nota:"Kaizen como hábito; máximo puntaje."},
    {key:"C", text:"Oponerse fuertemente", puntos:+10, nota:"Riesgo de conflicto; defiende cultura."}
  ]}
];

let nivelActual = 0;
let puntos = 0;
let historial = [];

function saveState() {
  localStorage.setItem('oe_puntos', puntos);
  localStorage.setItem('oe_historial', JSON.stringify(historial));
  localStorage.setItem('oe_nivel', nivelActual);
}

function loadState() {
  const p = parseInt(localStorage.getItem('oe_puntos'));
  if (!isNaN(p)) puntos = p;
  const hist = localStorage.getItem('oe_historial');
  if (hist) historial = JSON.parse(hist);
  const n = parseInt(localStorage.getItem('oe_nivel'));
  if (!isNaN(n)) nivelActual = n;
}

// Context object passed to dado effects
function createContext() {
  return {
    modifyPoints: (delta)=> { puntos += delta; },
    logEvent: (txt)=> { historial.push({tipo:'dado', texto:txt, nivel:nivelActual+1, ts:Date.now()}); },
    note: ''
  };
}

// Lanza el dado y aplica efecto
function lanzarDado() {
  const idx = Math.floor(Math.random()*DADO.length);
  const cara = DADO[idx];
  const ctx = createContext();
  cara.efecto(ctx);
  // registro visible
  alert(`🎲 Dado Lean: ${cara.nombre}\n${ctx.note}`);
  saveState();
  return cara;
}

function mostrarNivel() {
  const nivelesTotales = 5;
  if (nivelActual >= nivelesTotales) {
    finalizar();
    return;
  }
  // Elegir uno de los dilemas del nivel actual (aleatorio entre los de ese nivel)
  const nivelNum = nivelActual + 1;
  const opcionesNivel = DILEMAS.filter(d => d.nivel === nivelNum);
  const dilema = opcionesNivel[Math.floor(Math.random()*opcionesNivel.length)];

  // insertar en DOM
  const titulo = document.getElementById('titulo');
  const instruccion = document.getElementById('instruccion');
  const contenido = document.getElementById('contenido');
  titulo.textContent = `Nivel ${nivelNum} — ${dilema.titulo}`;
  instruccion.textContent = `Objetivo del nivel ${nivelNum}. ${dilema.dilema}`;
  contenido.innerHTML = '';

  const pDilema = document.createElement('p');
  pDilema.textContent = dilema.dilema;
  contenido.appendChild(pDilema);

  const divOpts = document.createElement('div');
  divOpts.style.display = 'flex';
  divOpts.style.gap = '10px';
  dilema.opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = `${op.key}) ${op.text}`;
    btn.onclick = () => {
      puntos += op.puntos;
      historial.push({tipo:'decision', nivel:nivelNum, dilemaId:dilema.id, opcion:op.key, puntos:op.puntos, nota:op.nota, ts:Date.now()});
      saveState();
      // al elegir, lanzar dado (regla: 50% de prob)
      if (Math.random() < 0.5) {
        const cara = lanzarDado();
        // algunos dados pueden alterar la consecuencia: ejemplo Apoyo reduce penalización a la mitad
        if (cara.id === 2) {
          alert("Efecto: Apoyo del equipo aplica - tu acción costó 50% menos esfuerzo (aplicando efecto de mitigación si corresponde).");
        }
      }
      // mostrar feedback
      contenido.innerHTML = `<p>Has elegido ${op.key}. ${op.nota} <br><strong>Puntos actuales:</strong> ${puntos}</p>`;
      const seguir = document.createElement('button');
      seguir.textContent = 'Siguiente nivel';
      seguir.onclick = ()=> { nivelActual++; saveState(); mostrarNivel(); };
      contenido.appendChild(seguir);
    };
    divOpts.appendChild(btn);
  });
  contenido.appendChild(divOpts);
}

function finalizar() {
  // Evaluación final basada en puntos
  saveState();
  const total = puntos;
  let nivel='';
  if (total >= 90) nivel = 'Cinturón Negro Lean';
  else if (total >= 75) nivel = 'Cinturón Verde';
  else if (total >= 60) nivel = 'Aprendiz Lean';
  else nivel = 'Modo Sobrevivencia';

  // resumen sencillo de KPIs (a partir de historial podemos inferir)
  const decisions = historial.filter(h=>h.tipo==='decision');
  const usadasKaizen = decisions.filter(d=>d.nota && d.nota.toLowerCase().includes('kaizen')).length;
  const resumen = {
    puntos: total,
    nivel: nivel,
    decisiones: decisions.length,
    eventosDado: historial.filter(h=>h.tipo==='dado').length,
    mejorasKaizen: usadasKaizen
  };

  // mostrar en final.html (si existe) o en DOM
  if (window.location.pathname.endsWith('final.html')) {
    // la final.html ya espera usar localStorage; dejamos los datos ahí
    localStorage.setItem('oe_resumen', JSON.stringify(resumen));
    window.location.href = 'final.html';
    return;
  }

  const contenido = document.getElementById('contenido');
  const titulo = document.getElementById('titulo');
  titulo.textContent = '🏁 Resultado Final';
  contenido.innerHTML = `<p>Puntos: ${resumen.puntos} — ${resumen.nivel}</p>
    <p>Decisiones tomadas: ${resumen.decisiones} — Eventos Dado: ${resumen.eventosDado} — Intervenciones Kaizen detectadas: ${resumen.mejorasKaizen}</p>
    <pre style="text-align:left; font-size:12px; background:#f7f9fb; padding:8px; border-radius:6px; overflow:auto;">Historial:\n${JSON.stringify(historial, null, 2)}</pre>
    <button onclick="reiniciar()">Reiniciar juego</button>`;
}

function reiniciar() {
  puntos = 0;
  nivelActual = 0;
  historial = [];
  saveState();
  mostrarNivel();
}

// helpers para inicializar
window.onload = function(){
  loadState();
  // initialize UI elements if not present
  if (!document.getElementById('titulo')) {
    // fallback para páginas que no tengan los mismos elementos
    document.body.innerHTML = `<h1 id="titulo"></h1><p id="instruccion"></p><div id="contenido"></div>`;
  }
  mostrarNivel();
};
