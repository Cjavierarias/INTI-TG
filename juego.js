const datos = {
  '5s': {
    titulo: '5S',
    instruccion: 'Arrastra cada concepto al principio correcto:',
    opciones: ['Clasificar', 'Ordenar', 'Limpiar', 'Estandarizar', 'Disciplina'],
    soluciones: ['Seiri', 'Seiton', 'Seiso', 'Seiketsu', 'Shitsuke']
  },
  'kaizen': {
    titulo: 'Kaizen',
    instruccion: 'Ordena los pasos del ciclo Kaizen:',
    opciones: ['Actuar', 'Planificar', 'Hacer', 'Verificar'],
    soluciones: ['Planificar', 'Hacer', 'Verificar', 'Actuar']
  },
  'kanban': {
    titulo: 'Kanban',
    instruccion: 'Relaciona cada tarjeta con su función:',
    opciones: ['Visualizar flujo', 'Limitar WIP', 'Mejorar flujo'],
    soluciones: ['Tarjeta Kanban', 'Columna WIP', 'Retrospectiva']
  },
  'jit': {
    titulo: 'Just in Time',
    instruccion: 'Relaciona conceptos JIT:',
    opciones: ['Producción exacta', 'Inventario mínimo', 'Entrega a tiempo'],
    soluciones: ['Pull System', 'Stock 0', 'Takt Time']
  },
  'poka': {
    titulo: 'Poka Yoke',
    instruccion: 'Relaciona errores con soluciones Poka Yoke:',
    opciones: ['Evitar error', 'Detectar error', 'Corregir error'],
    soluciones: ['Diseño antiascendente', 'Sensor óptico', 'Bloqueo automático']
  }
};

const tecnologia = localStorage.getItem('tecnologia');
const info = datos[tecnologia];

document.getElementById('titulo').textContent = info.titulo;
document.getElementById('instruccion').textContent = info.instruccion;

const opciones = document.getElementById('opciones');
const soluciones = document.getElementById('soluciones');

info.opciones.forEach((op, i) => {
  const div = document.createElement('div');
  div.className = 'item';
  div.draggable = true;
  div.textContent = op;
  div.dataset.correcto = info.soluciones[i];
  div.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text', e.target.dataset.correcto);
  });
  opciones.appendChild(div);
});

info.soluciones.forEach(sol => {
  const div = document.createElement('div');
  div.className = 'slot';
  div.textContent = sol;
  div.addEventListener('dragover', e => e.preventDefault());
  div.addEventListener('drop', e => {
    const arrastrado = e.dataTransfer.getData('text');
    if (arrastrado === sol) {
      e.target.style.backgroundColor = '#9f9';
    } else {
      e.target.style.backgroundColor = '#f99';
    }
  });
  soluciones.appendChild(div);
});

function verificar() {
  const slots = document.querySelectorAll('.slot');
  let correctos = 0;
  slots.forEach(slot => {
    if (slot.style.backgroundColor === 'rgb(153, 255, 153)') correctos++;
  });
  document.getElementById('resultado').textContent =
    correctos === slots.length ? '¡Perfecto!' : `Tienes ${correctos} de ${slots.length} bien.`;
}
