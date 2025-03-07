const fs = require('fs');
const filePath = 'notas.json';

function agregarNota(titulo, contenido) {
  if (!titulo || !contenido) {
    console.log('Debes proporcionar un título y contenido para la nota.');
    return;
  }

  let notas = [];
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      notas = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo JSON. Se reiniciará.');
      notas = [];
    }
  }

  if (notas.some(nota => nota.titulo === titulo)) {
    console.log(`Ya existe una nota con el título "${titulo}". Usa otro título.`);
    return;
  }

  notas.push({ titulo, contenido });

  try {
    fs.writeFileSync(filePath, JSON.stringify(notas, null, 2));
    console.log('Nota agregada con éxito.');
  } catch (error) {
    console.error('Error al escribir en el archivo:', error);
  }
}

function listarNotas() {
  if (!fs.existsSync(filePath)) {
    console.log('No hay notas guardadas.');
    return;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const notas = JSON.parse(data);

    if (notas.length === 0) {
      console.log('No hay notas en el archivo.');
      return;
    }

    console.log('\nNotas guardadas:');
    console.log('──────────────────────────');
    notas.forEach((nota, index) => {
      console.log(`${index + 1}. ${nota.titulo}\n   ${nota.contenido}\n──────────────────────────`);
    });
  } catch (error) {
    console.error('Error al leer las notas:', error);
  }
}

function eliminarNota(titulo) {
  if (!titulo) {
    console.log('Debes proporcionar un título para eliminar una nota.');
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log('No hay notas para eliminar.');
    return;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    let notas = JSON.parse(data);

    const notasRestantes = notas.filter(nota => nota.titulo !== titulo);

    if (notas.length === notasRestantes.length) {
      console.log(`No se encontró una nota con el título "${titulo}".`);
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(notasRestantes, null, 2));
    console.log(`Nota con título "${titulo}" eliminada.`);
  } catch (error) {
    console.error('Error al eliminar la nota:', error);
  }
}

function buscarNota(titulo) {
  if (!titulo) {
    console.log('Debes proporcionar un título para buscar una nota.');
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log('No hay notas guardadas.');
    return;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const notas = JSON.parse(data);
    const notaEncontrada = notas.find(nota => nota.titulo === titulo);

    if (!notaEncontrada) {
      console.log(`No se encontró una nota con el título "${titulo}".`);
      return;
    }

    console.log('\nNota encontrada:');
    console.log('──────────────────────────');
    console.log(`${notaEncontrada.titulo}\n   ${notaEncontrada.contenido}`);
    console.log('──────────────────────────');
  } catch (error) {
    console.error('Error al buscar la nota:', error);
  }
}

module.exports = { agregarNota, listarNotas, eliminarNota, buscarNota };

const [,, action, ...args] = process.argv;
switch (action) {
  case 'agregar':
    agregarNota(args[0], args.slice(1).join(' '));
    break;
  case 'listar':
    listarNotas();
    break;
  case 'eliminar':
    eliminarNota(args[0]);
    break;
  case 'buscar':
    buscarNota(args[0]);
    break;
  default:
    console.log('Comandos disponibles:\n  agregar "titulo" "contenido"\n  listar\n  eliminar "titulo"\n  buscar "titulo"');
}
