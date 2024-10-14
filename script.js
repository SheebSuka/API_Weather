document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513';
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
    const ciudadesPorDefectoOriginal = ['Nogales', 'Arizona', 'Shibuya', 'Lima', 'Caborca']; // Lista original de ciudades por defecto
    let ciudadesPorDefecto = []; // Arreglo que contendrá las ciudades por defecto actuales

    function guardarCiudadesPorDefecto() {
        // Guarda las ciudades por defecto en el almacenamiento local
        localStorage.setItem('ciudadesPorDefecto', JSON.stringify(ciudadesPorDefecto));
    }

    function cargarCiudadesPorDefecto() {
        // Carga las ciudades por defecto desde el almacenamiento local o usa la lista original si no hay datos guardados
        const ciudadesGuardadas = localStorage.getItem('ciudadesPorDefecto');
        if (ciudadesGuardadas) {
            ciudadesPorDefecto = JSON.parse(ciudadesGuardadas);
        } else {
            ciudadesPorDefecto = [...ciudadesPorDefectoOriginal];
        }
    }

    function mostrarCiudadesPorDefecto() {
        // Muestra las ciudades por defecto en el DOM y obtiene sus datos climáticos
        listaCiudadesPorDefecto.innerHTML = "";
        temperaturasPorDefecto = [];
        ciudadesPorDefecto.forEach(ciudad => {
            fetchDatosClima(ciudad, false, true);
        });
    }

    document.getElementById('insertarBtn').addEventListener('click', () => {
        const ciudad = ciudadInput.value.trim(); // Obtiene y limpia el valor del campo de entrada
        if (ciudad === "") {
            alert("Por favor, ingrese el nombre de una ciudad.");
        } else {
            fetchDatosClima(ciudad); // Llama a la función para obtener datos climáticos de la ciudad ingresada
        }
    });

    document.getElementById('borrarDatosBtn').addEventListener('click', () => {
        // Borra las ciudades buscadas y muestra el formulario nuevamente
        ciudadesBuscadas = [];
        mostrarListaCiudades();
        mostrarFormulario();
        alert("Los datos han sido eliminados.");
    });

    buscarBtn.addEventListener('click', () => {
        const ciudadBuscada = buscarCiudadInput.value.trim(); // Obtiene y limpia el valor del campo de búsqueda
        if (ciudadBuscada === "") {
            alert("Por favor, ingrese el nombre de una ciudad para buscar.");
        } else {
            fetchDatosClima(ciudadBuscada, true); // Llama a la función para buscar datos climáticos de la ciudad ingresada
        }
    });

    document.getElementById('agregarCiudadBtn').addEventListener('click', () => {
        const nuevaCiudad = document.getElementById('nuevaCiudadInput').value.trim(); // Obtiene y limpia el valor del campo para nueva ciudad
        if (nuevaCiudad === "") {
            alert("Por favor, ingrese el nombre de una nueva ciudad.");
            return;
        }
        if (!ciudadesPorDefecto.includes(nuevaCiudad) && !ciudadesBuscadas.some(c => c.nombre === nuevaCiudad)) {
            ciudadesPorDefecto.push(nuevaCiudad); // Agrega la nueva ciudad al arreglo de ciudades por defecto
            guardarCiudadesPorDefecto(); // Guarda la lista actualizada en el almacenamiento local
            fetchDatosClima(nuevaCiudad, false, true); // Obtiene datos climáticos de la nueva ciudad agregada
            document.getElementById('nuevaCiudadInput').value = ""; // Limpia el campo de entrada para nueva ciudad después de agregarla
        } else {
            alert("La ciudad ya está en la lista de ciudades por defecto o en la lista de búsqueda.");
        }
    });

    document.getElementById('restablecerDefaultBtn').addEventListener('click', () => {
        // Restablece las ciudades por defecto a su estado original y actualiza la visualización
        ciudadesPorDefecto = [...ciudadesPorDefectoOriginal];
        guardarCiudadesPorDefecto();
        mostrarCiudadesPorDefecto();
        alert("Las ciudades han sido restablecidas a los valores predeterminados.");
    });

    function fetchDatosClima(ciudad, esBusqueda = false, esDefault = false) {
        // Construye la URL para obtener datos climaticos desde OpenWeatherApi y maneja la respuesta.
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ciudad no encontrada."); // Lanza un error si la respuesta no es correcta
                }
                return response.json(); // Convierte la respuesta a formato JSON.
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
            .catch(error => alert(error.message)); // Captura y muestra cualquier error durante el proceso.
    }

    function agregarCiudad(info) {
        // Agrega una nueva ciudad a la lista de buscadas si no está ya presente.
        if (!ciudadesBuscadas.some(c => c.nombre === info.nombre)) {
            ciudadesBuscadas.push(info);
            mostrarListaCiudades();
        } else {
            alert("La ciudad ya está en la lista de búsqueda.");
        }
    }

    function mostrarListaCiudades() {
        listaCiudades.innerHTML = "";  // Limpia el contenedor de listas de ciudades buscadas.

        ciudadesBuscadas.forEach(ciudad => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `  
                <div class="card border-primary">  
                    <div class="card-body">  
                        <h5 class="card-title">${ciudad.nombre}</h5>  
                        <p class="card-text">Temperatura: ${ciudad.temperatura}°C</p>  
                        <p class="card-text">Clima: ${ciudad.clima}</p>  
                    </div>  
                </div>  
            `;
            listaCiudades.appendChild(card);  // Agrega cada tarjeta al contenedor en el DOM.
        });
    }

    function mostrarCiudadPorDefecto(info) {
        // Crea y muestra una tarjeta con información sobre una ciudad por defecto.
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `  
             <div class="card border-info">  
                 <div class="card-body">  
                     <h5 class="card-title">${info.nombre}</h5>  
                     <p class="card-text">Temperatura: ${info.temperatura}°C</p>  
                     <p class="card-text">Clima: ${info.clima}</p>  
                 </div>  
             </div>  
         `;
        listaCiudadesPorDefecto.appendChild(card);  // Agrega la tarjeta al contenedor correspondiente.
    }

    function mostrarClima(info) {
        resultadoClima.innerHTML = `¡Bienvenido de vuelta! El clima de ${info.nombre}, es:  ${info.temperatura}°C`;
        mostrarClimaInfo();  // Muestra información climática al usuario.
    }

    function mostrarFormulario() {
        formulario.style.display = 'block';
        climaInfo.style.display = 'none';
    }

    function mostrarClimaInfo() {
        formulario.style.display = 'none';  // Oculta el formulario actual.
        climaInfo.style.display = 'block';  // Muestra la sección con información climática al usuario.
    }

    function mostrarCiudadMasCaliente() {
        if (temperaturasPorDefecto.length === ciudadesPorDefecto.length) {
            const ciudadMasCaliente = temperaturasPorDefecto.reduce((prev, current) => {
                return (prev.temperatura > current.temperatura) ? prev : current;
            });
            resultadoCiudadCaliente.innerHTML = `La ciudad con mayor temperatura es ${ciudadMasCaliente.nombre} con ${ciudadMasCaliente.temperatura}°C.`;
        }
    }

    cargarCiudadesPorDefecto();  // Carga las ciudades por defecto al inicio del script.
    mostrarCiudadesPorDefecto();  // Muestra las ciudades por defecto al inicio.

    const climaGuardado = localStorage.getItem('clima');  // Recupera los datos climáticos guardados.

    if (climaGuardado) {  // Si hay datos climáticos guardados,
        mostrarClima(JSON.parse(climaGuardado));  // muestra esos datos.
        mostrarListaCiudades();  // Muestra también la lista actualizada de ciudades buscadas.
    }
});