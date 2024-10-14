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

    let ciudadesBuscadas = []; // Arreglo para almacenar las ciudades buscadas con sus detalles
    let temperaturasPorDefecto = []; // Arreglo para almacenar las temperaturas de las ciudades por defecto
    const ciudadesPorDefectoOriginal = ['Madrid', 'Barcelona', 'Buenos Aires', 'Lima', 'Santiago']; // Ciudades por defecto
    let ciudadesPorDefecto = [...ciudadesPorDefectoOriginal]; // Copia del arreglo original

    function mostrarCiudadesPorDefecto() {
        listaCiudadesPorDefecto.innerHTML = ""; // Limpiar lista antes de mostrar
        temperaturasPorDefecto = []; // Reiniciar el arreglo de temperaturas

        ciudadesPorDefecto.forEach(ciudad => {
            fetchDatosClima(ciudad, false, true); // Obtener clima para cada ciudad por defecto
        });
    }

    document.getElementById('insertarBtn').addEventListener('click', () => {
        const ciudad = ciudadInput.value.trim();
        if (ciudad === "") {
            alert("Por favor, ingrese el nombre de una ciudad.");
        } else {
            fetchDatosClima(ciudad);
        }
    });

    document.getElementById('borrarDatosBtn').addEventListener('click', () => {
        // Limpiar el arreglo de ciudades buscadas
        ciudadesBuscadas = [];

        // Actualizar la interfaz de usuario para eliminar la lista de ciudades
        mostrarListaCiudades();

        // Mostrar el formulario inicial de nuevo
        mostrarFormulario();

        alert("Los datos han sido eliminados.");
    });

    buscarBtn.addEventListener('click', () => {
        const ciudadBuscada = buscarCiudadInput.value.trim();
        if (ciudadBuscada === "") {
            alert("Por favor, ingrese el nombre de una ciudad para buscar.");
        } else {
            fetchDatosClima(ciudadBuscada, true);
        }
    });

    document.getElementById('agregarCiudadBtn').addEventListener('click', () => {
        const nuevaCiudad = document.getElementById('nuevaCiudadInput').value.trim();

        if (nuevaCiudad === "") {
            alert("Por favor, ingrese el nombre de una nueva ciudad.");
            return;
        }

        if (!ciudadesPorDefecto.includes(nuevaCiudad) && !ciudadesBuscadas.some(c => c.nombre === nuevaCiudad)) {
            ciudadesPorDefecto.push(nuevaCiudad); // Agregar la nueva ciudad al arreglo
            fetchDatosClima(nuevaCiudad, false, true); // Obtener clima para la nueva ciudad
            document.getElementById('nuevaCiudadInput').value = ""; // Limpiar el input
        } else {
            alert("La ciudad ya está en la lista de ciudades por defecto o en la lista de búsqueda.");
        }
    });

    document.getElementById('restablecerDefaultBtn').addEventListener('click', () => {
        ciudadesPorDefecto = [...ciudadesPorDefectoOriginal]; // Restablecer a las ciudades originales
        mostrarCiudadesPorDefecto(); // Mostrar las ciudades por defecto actualizadas
        alert("Las ciudades han sido restablecidas a los valores predeterminados.");
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
                const infoClima = {
                    nombre: data.name,
                    temperatura,
                    clima
                };

                if (esDefault) {
                    temperaturasPorDefecto.push(infoClima);
                    mostrarCiudadPorDefecto(infoClima);
                    mostrarCiudadMasCaliente();
                } else if (esBusqueda) {
                    if (!ciudadesBuscadas.some(c => c.nombre === data.name) && !ciudadesPorDefecto.includes(data.name)) {
                        agregarCiudad(infoClima);
                    } else {
                        alert("La ciudad ya está en la lista de búsqueda o en las ciudades por defecto.");
                    }
                } else {
                    if (!ciudadesBuscadas.some(c => c.nombre === data.name)) {
                        localStorage.setItem('clima', JSON.stringify(infoClima));
                        mostrarClima(infoClima);
                    } else {
                        alert("La ciudad ya está en la lista de búsqueda.");
                    }
                }
            })
            .catch(error => alert(error.message));
    }

    function agregarCiudad(info) {
        if (!ciudadesBuscadas.some(c => c.nombre === info.nombre)) {
            ciudadesBuscadas.push(info);
            mostrarListaCiudades();
        } else {
            alert("La ciudad ya está en la lista de búsqueda.");
        }
    }

    function mostrarListaCiudades() {
        listaCiudades.innerHTML = ""; // Limpiar lista antes de mostrar
        ciudadesBuscadas.forEach(ciudad => {
            const li = document.createElement('li');
            li.textContent = `Ciudad: ${ciudad.nombre}, Temperatura: ${ciudad.temperatura}°C, Clima: ${ciudad.clima}`;
            listaCiudades.appendChild(li);
        });
    }

    function mostrarCiudadPorDefecto(info) {
        const li = document.createElement('li');
        li.textContent = `Ciudad: ${info.nombre}, Temperatura: ${info.temperatura}°C, Clima: ${info.clima}`;
        listaCiudadesPorDefecto.appendChild(li);
    }

    function mostrarCiudadMasCaliente() {
        if (temperaturasPorDefecto.length > 0) {
            let ciudadMasCaliente = temperaturasPorDefecto.reduce((max, current) =>
                current.temperatura > max.temperatura ? current : max
            );

            resultadoCiudadCaliente.textContent = `La ciudad más caliente es: ${ciudadMasCaliente.nombre} con ${ciudadMasCaliente.temperatura}°C.`;
        }
    }

    function mostrarClima(info) {
        formulario.style.display = 'none';
        climaInfo.style.display = 'block';
        resultadoClima.textContent = `Bienvenido de vuelta, su ciudad y clima es: Ciudad: ${info.nombre}, Temperatura: ${info.temperatura}°C, Clima: ${info.clima}`;
    }

    function mostrarFormulario() {
        formulario.style.display = 'block';
        climaInfo.style.display = 'none';
    }

    window.onload = function () {
        const climaGuardado = localStorage.getItem('clima');

        if (climaGuardado) {
            mostrarClima(JSON.parse(climaGuardado));
            mostrarListaCiudades();
        }

        mostrarCiudadesPorDefecto();
    };
});
