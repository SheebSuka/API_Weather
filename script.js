// Variables
const API_KEY = '9b9a43120a8fe9f9a9edde94b15d8513';
const ciudadInput = document.getElementById('ciudad');
const formularioCiudad = document.getElementById('formulario-ciudad');
const mensajeBienvenida = document.getElementById('mensaje-bienvenida');
const climaCiudad = document.getElementById('clima-ciudad');
const borrarCiudad = document.getElementById('borrar-ciudad');
const listaCiudadesDefault = document.getElementById('lista-ciudades-default');
const formularioAgregarCiudadDefault = document.getElementById('formulario-agregar-ciudad-default');
const listaCiudadesCalientes = document.getElementById('lista-ciudades-calientes');

// Funciones
function getCiudad() {
    // Obtener la ciudad del input
    const ciudad = ciudadInput.value.trim();
    // Validar que la ciudad no esté vacía
    if (ciudad!== '') {
        // Llamar a la API para obtener el clima
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`)
           .then(response => response.json())
           .then(data => {
                // Mostrar el clima
                mostrarClima(data);
                // Guardar la ciudad en localstorage
                guardarCiudad(ciudad);
            })
           .catch(error => console.error('Error:', error));
    } else {
        alert('Por favor, ingresa una ciudad');
    }
}

function mostrarClima(data) {
    // Mostrar el clima
    const temperatura = data.main.temp;
    const descripcion = data.weather[0].description;
    climaCiudad.innerHTML = `El clima en ${data.name} es de ${temperatura}°C con ${descripcion}`;
}

function guardarCiudad(ciudad) {
    // Guardar la ciudad en localstorage
    localStorage.setItem('ciudad', ciudad);
}

function obtenerCiudad() {
    // Obtener la ciudad de localstorage
    const ciudad = localStorage.getItem('ciudad');
    if (ciudad) {
        // Mostrar el mensaje de bienvenida
        mensajeBienvenida.innerHTML = `Bienvenido, el clima de tu ciudad es: ${ciudad}`;
        // Obtener el clima de la ciudad
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`)
          .then(response => response.json())
          .then(data => {
                // Mostrar el clima
                mostrarClima(data);
            })
          .catch(error => console.error('Error:', error));
    }
}

function borrarCiudad() {
    // Borrar la ciudad de localstorage
    localStorage.removeItem('ciudad');
    // Mostrar el formulario para ingresar la ciudad
    formularioCiudad.style.display = 'block';
    // Ocultar el mensaje de bienvenida
    mensajeBienvenida.style.display = 'none';
}

function agregarCiudadDefault() {
    // Obtener la ciudad del input
    const ciudad = ciudadInput.value.trim();
    // Validar que la ciudad no esté vacía
    if (ciudad!== '') {
        // Agregar la ciudad al arreglo de ciudades default
        const ciudadesDefault = obtenerCiudadesDefault();
        ciudadesDefault.push(ciudad);
        // Guardar el arreglo de ciudades default en localstorage
        localStorage.setItem('ciudadesDefault', JSON.stringify(ciudadesDefault));
        // Mostrar las ciudades default
        mostrarCiudadesDefault();
    } else {
        alert('Por favor, ingresa una ciudad');
    }
}

function obtenerCiudadesDefault() {
    // Obtener el arreglo de ciudades default de localstorage
    const ciudadesDefault = localStorage.getItem('ciudadesDefault');
    if (ciudadesDefault) {
        return JSON.parse(ciudadesDefault);
    } else {
        return [];
    }
}

function mostrarCiudadesDefault() {
    // Obtener el arreglo de ciudades default
    const ciudadesDefault = obtenerCiudadesDefault();
    // Mostrar las ciudades default en orden alfabético
    listaCiudadesDefault.innerHTML = '';
    ciudadesDefault.sort().forEach(ciudad => {
        const li = document.createElement('li');
        li.textContent = ciudad;
        listaCiudadesDefault.appendChild(li);
    });
}

function obtenerClimaCiudadesDefault() {
    // Obtener el arreglo de ciudades default
    const ciudadesDefault = obtenerCiudadesDefault();
    // Obtener el clima de cada ciudad y mostrarlo
    ciudadesDefault.forEach(ciudad => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`)
          .then(response => response.json())
          .then(data => {
                // Mostrar el clima
                const temperatura = data.main.temp;
                const descripcion = data.weather[0].description;
                listaCiudadesCalientes.innerHTML += `<li>${ciudad}: ${temperatura}°C con ${descripcion}</li>`;
            })
          .catch(error => console.error('Error:', error));
    });
}

// Eventos
formularioCiudad.addEventListener('submit', e => {
    e.preventDefault();
    getCiudad();
});

borrarCiudad.addEventListener('click', borrarCiudad);

formularioAgregarCiudadDefault.addEventListener('submit', e => {
    e.preventDefault();
    agregarCiudadDefault();
});

// Inicializar
obtenerCiudad();
mostrarCiudadesDefault();
obtenerClimaCiudadesDefault();