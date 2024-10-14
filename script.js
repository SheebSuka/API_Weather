document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513'; // Reemplaza con tu clave de API
    const formulario = document.getElementById('formulario');
    const climaInfo = document.getElementById('climaInfo');
    const ciudadInput = document.getElementById('ciudadInput');
    const insertarBtn = document.getElementById('insertarBtn');
    const borrarDatosBtn = document.getElementById('borrarDatosBtn');
    const agregarCiudadBtn = document.getElementById('agregarCiudadBtn');
    const restablecerDefaultBtn = document.getElementById('restablecerDefaultBtn');
    const nuevaCiudadInput = document.getElementById('nuevaCiudadInput');
    const resultadoCiudadCaliente = document.getElementById('resultadoCiudadCaliente');
    const ciudadesPorDefecto = document.getElementById('ciudadesPorDefecto');

    let ciudadesBuscadas = []; // Arreglo para almacenar las ciudades buscadas con sus detalles
    let temperaturasPorDefecto = []; // Arreglo para almacenar las temperaturas de las ciudades por defecto
    const ciudadesPorDefectoOriginal = ['Madrid', 'Barcelona', 'Buenos Aires', 'Lima', 'Santiago']; // Ciudades por defecto
    let ciudadesPorDefectoLista = [...ciudadesPorDefectoOriginal]; // Copia del arreglo original

    function mostrarCiudadesPorDefecto() {
        ciudadesPorDefecto.innerHTML = ""; // Limpiar lista antes de mostrar
        temperaturasPorDefecto = []; // Reiniciar el arreglo de temperaturas

        ciudadesPorDefectoLista.forEach(ciudad => {
            fetchDatosClima(ciudad, false, true); // Obtener clima para cada ciudad por defecto
        });
    }

    insertarBtn.addEventListener('click', () => {
        const ciudad = ciudadInput.value.trim();
        if (ciudad === "") {
            alert("Por favor, ingrese el nombre de una ciudad.");
        } else {
            fetchDatosClima(ciudad);
        }
    });

    borrarDatosBtn.addEventListener('click', () => {
        // Limpiar el arreglo de ciudades buscadas
        ciudadesBuscadas = [];

        // Actualizar la interfaz de usuario para eliminar la lista de ciudades
        mostrarListaCiudades();

        // Mostrar el formulario inicial de nuevo
        mostrarFormulario();

        alert("Los datos han sido eliminados.");
    });

    agregarCiudadBtn.addEventListener('click', () => {
        const nuevaCiudad = nuevaCiudadInput.value.trim();

        if (nuevaCiudad === "") {
            alert("Por favor, ingrese el nombre de una nueva ciudad.");
            return;
        }

        if (!ciudadesPorDefectoLista.includes(nuevaCiudad) && !ciudadesBuscadas.some(c => c.nombre === nuevaCiudad)) {
            ciudadesPorDefectoLista.push(nuevaCiudad); // Agregar la nueva ciudad al arreglo
            fetchDatosClima(nuevaCiudad, false, true); // Obtener clima para la nueva ciudad
            nuevaCiudadInput.value = ""; // Limpiar el input
        } else {
            alert("La ciudad ya está en la lista de ciudades por defecto o en la lista de búsqueda.");
        }
    });

    restablecerDefaultBtn.addEventListener('click', () => {
        ciudadesPorDefectoLista = [...ciudadesPorDefectoOriginal]; // Restablecer a las ciudades originales
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
                } else {
                    if (!ciudadesBuscadas.some(c => c.nombre === data.name)) {
                        agregarCiudad(infoClima);
                    } else {
                        alert("La ciudad ya está en la lista de búsqueda.");
                    }
                }
            })
            .catch(error => alert(error.message));
    }

    function agregarCiudad(info) {
        ciudadesBuscadas.push(info);
        mostrarListaCiudades();
    }

    function mostrarListaCiudades() {
        climaInfo.innerHTML = ""; // Limpiar lista antes de mostrar
        ciudadesBuscadas.forEach(ciudad => {
            const div = document.createElement('div');
            div.className = 'city-card';
            div.textContent = `Ciudad: ${ciudad.nombre}, Temperatura: ${ciudad.temperatura}°C, Clima: ${ciudad.clima}`;
            climaInfo.appendChild(div);
        });
    }

    function mostrarCiudadPorDefecto(info) {
        const div = document.createElement('div');
        div.className = 'city-card';
        div.textContent = `Ciudad: ${info.nombre}, Temperatura: ${info.temperatura}°C, Clima: ${info.clima}`;
        ciudadesPorDefecto.appendChild(div);
    }

    function mostrarCiudadMasCaliente() {
        if (temperaturasPorDefecto.length > 0) {
            let ciudadMasCaliente = temperaturasPorDefecto.reduce((max, current) =>
                current.temperatura > max.temperatura ? current : max
            );

            resultadoCiudadCaliente.textContent = `La ciudad más caliente es: ${ciudadMasCaliente.nombre} con ${ciudadMasCaliente.temperatura}°C.`;
        }
    }

    function mostrarFormulario() {
        formulario.style.display = 'block';
        climaInfo.style.display = 'none';
    }

    window.onload = function () {
        mostrarCiudadesPorDefecto();
    };
});