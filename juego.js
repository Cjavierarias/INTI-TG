// juego.js - lógica completa para Operación Eficiencia (cliente-side solamente)
// Guarda estado en localStorage para continuidad y compatibilidad con GitHub Pages.


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
{key:"B", text:"Analizar con 5 por qué", puntos:+25, nota:"Solución sostenible; desbloquea autonomto."},
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
{key:"B", text:"Integrar Kaizen al día a día", p
