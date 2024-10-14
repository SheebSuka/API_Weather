document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513'; // Reemplaza con tu clave de API
    const formulario = document.getElementById('formulario');
    const climaInfo = document.getElementById('climaInfo');
    const ciudadInput = document.getElementById('ciudadInput');
    const resultadoClima = document.getElementById('resultadoClima');
    const buscarCiudadInput = document.getElementById('buscarCiudadInput');
    const buscarBtn = document.getElementById('buscarBtn');
    const listaCiudades = document.getElementById('listaCiudades');
    const listaCiudadesPorDefecto = document.getElementById('listaCiudadesPorDefecto');
    const resultadoCiudadCaliente = document.getElementById('resultadoCiudadCaliente');

    let ciudadesBuscadas = []; // Arreglo para almacenar las ciudades buscadas
    let temperaturasPorDefecto = []; // Arreglo para almacenar las temperaturas de las ciudades por defecto
    const ciudadesPorDefecto = ['Madrid', 'Barcelona', 'Buenos Aires', 'Lima', 'Santiago']; // Ciudades por defecto

    // Mostrar las ciudades por defecto al cargar la página
    function mostrarCiudadesPorDefecto() {
        listaCiudadesPorDefecto.innerHTML = ""; // Limpiar lista antes de mostrar
        temperaturasPorDefecto = []; // Reiniciar el arreglo de temperaturas

        ciudadesPorDefecto.forEach(ciudad => {
            fetchDatosClima(ciudad, false, true); // Obtener clima para cada ciudad por defecto
        });
    }

    document.getElementById('insertarBtn').addEventListener('click', () => {
        const ciudad = ciudadInput.value.trim(); // Eliminar espacios en blanco
        if (ciudad === "") {
            alert("Por favor, ingrese el nombre de una ciudad.");
        } else {
            fetchDatosClima(ciudad);
        }
    });

    document.getElementById('borrarDatosBtn').addEventListener('click', () => {
        localStorage.removeItem('clima');
        mostrarFormulario();
    });

    buscarBtn.addEventListener('click', () => {
        const ciudadBuscada = buscarCiudadInput.value.trim();
        if (ciudadBuscada === "") {
            alert("Por favor, ingrese el nombre de una ciudad para buscar.");
        } else {
            fetchDatosClima(buscarCiudadInput.value.trim(), true);
        }
    });

    // Agregar evento para el nuevo botón "Agregar Ciudad"
    document.getElementById('agregarCiudadBtn').addEventListener('click', () => {
        const nuevaCiudad = document.getElementById('nuevaCiudadInput').value.trim();

        if (nuevaCiudad === "") {
            alert("Por favor, ingrese el nombre de una nueva ciudad.");
            return;
        }

        if (!ciudadesPorDefecto.includes(nuevaCiudad)) {
            ciudadesPorDefecto.push(nuevaCiudad); // Agregar la nueva ciudad al arreglo
            fetchDatosClima(nuevaCiudad, false, true); // Obtener clima para la nueva ciudad
            document.getElementById('nuevaCiudadInput').value = ""; // Limpiar el input
        } else {
            alert("La ciudad ya está en la lista de ciudades por defecto.");
        }
    });

    function fetchDatosClima(ciudad, esBusqueda = false, esDefault = false) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ciudad no encontrada.");
                }
                return response.json();
            })
            .then(data => {
                const temperatura = Math.round(data.main.temp);
                const clima = data.weather[0].description;
                const infoClima = `Ciudad: ${data.name}, Temperatura: ${temperatura}°C, Clima: ${clima}`;

                if (esDefault) {
                    temperaturasPorDefecto.push({ ciudad: data.name, temperatura }); // Almacenar temperatura y ciudad
                    mostrarCiudadPorDefecto(infoClima); // Mostrar solo en la sección de ciudades por defecto
                    mostrarCiudadMasCaliente(); // Actualizar la ciudad más caliente
                } else if (esBusqueda) {
                    // Solo agregar si no está en las ciudades por defecto
                    if (!ciudadesPorDefecto.includes(data.name)) {
                        agregarCiudad(infoClima);
                    }
                } else {
                    localStorage.setItem('clima', infoClima);
                    mostrarClima(infoClima);
                }
            })
            .catch(error => alert(error.message)); // Mostrar error si la ciudad no existe
    }

    function agregarCiudad(info) {
        ciudadesBuscadas.push(info);
        ciudadesBuscadas.sort(); // Ordenar alfabéticamente
        mostrarListaCiudades();
    }

    function mostrarListaCiudades() {
        listaCiudades.innerHTML = ""; // Limpiar lista antes de mostrar
        ciudadesBuscadas.forEach(ciudad => {
            const li = document.createElement('li');
            li.textContent = ciudad;
            listaCiudades.appendChild(li);
        });
    }

    function mostrarCiudadPorDefecto(info) {
        const li = document.createElement('li');
        li.textContent = info; // Mostrar la información del clima
        listaCiudadesPorDefecto.appendChild(li); // Agregar a la lista de ciudades por defecto
    }

    function mostrarCiudadMasCaliente() {
        if (temperaturasPorDefecto.length > 0) {
            let ciudadMasCaliente = temperaturasPorDefecto.reduce((max, current) =>
                current.temperatura > max.temperatura ? current : max
            );

            resultadoCiudadCaliente.textContent = `La ciudad más caliente es: ${ciudadMasCaliente.ciudad} con ${ciudadMasCaliente.temperatura}°C.`;
        }
    }

    function mostrarClima(info) {
        formulario.style.display = 'none';  // Ocultar el primer formulario
        climaInfo.style.display = 'block';  // Mostrar la sección del clima

        // Actualizar el H1 con el mensaje deseado
        resultadoClima.textContent = `Bienvenido de vuelta, su ciudad y clima es: ${info}`;
    }

    function mostrarFormulario() {
        formulario.style.display = 'block';  // Mostrar el primer formulario
        climaInfo.style.display = 'none';     // Ocultar la sección del clima
    }

    // Al cargar la página, verificar si hay datos en localStorage y mostrar ciudades por defecto
    window.onload = function () {
        const climaGuardado = localStorage.getItem('clima');

        if (climaGuardado) {
            mostrarClima(climaGuardado);
            mostrarListaCiudades(); // Asegúrate de mostrar la lista de ciudades si hay datos guardados.
        }

        mostrarCiudadesPorDefecto(); // Mostrar las ciudades por defecto
    };
});