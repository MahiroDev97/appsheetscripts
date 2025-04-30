// Código de paginación para PortadaVRF.html
// Script modificado para evitar símbolos problemáticos en Appsheet

document.addEventListener("DOMContentLoaded", function () {
    var MAX_FILAS_POR_PAGINA = 25;
    
    // Estilizar estados de los equipos
    function estilizarEstados() {
      var filas = document.querySelectorAll(".resumen-activos tbody tr");
      for (var i = 0; i != filas.length; i++) {
        var fila = filas[i];
        var celdaEstado = fila.cells[7];
        if (celdaEstado) {
          var span = document.createElement("span");
          span.textContent = celdaEstado.textContent.trim();
          celdaEstado.textContent = "";
          celdaEstado.appendChild(span);
  
          switch (span.textContent) {
            case "Operativo":
              span.style.color = "#6ec49e";
              span.style.fontWeight = "bold";
              span.textContent = span.textContent.toUpperCase();
              break;
            case "Medianamente Operativo":
              span.style.color = "#f4c004";
              span.style.fontWeight = "bold";
              span.textContent = span.textContent.toUpperCase();
              break;
            case "No operativo":
              span.style.color = "#fe010b";
              span.style.fontWeight = "bold";
              span.textContent = span.textContent.toUpperCase();
              break;
          }
        }
      }
    }
  
    // Función para dividir los elementos en múltiples páginas
    function paginarElementos() {
      // Todas las filas de la tabla principal
      var filasEquipos = Array.from(document.querySelectorAll("#tabla-equipos-principal .fila-equipo"));
      var totalFilas = filasEquipos.length;
      
      // Si no hay suficientes filas, no hacemos paginación (MAX_FILAS_POR_PAGINA es 25)
      if (!(totalFilas > MAX_FILAS_POR_PAGINA)) {
        // Solo actualizamos los números de fila
        for (var j = 0; j != filasEquipos.length; j++) {
          var fila = filasEquipos[j];
          if (fila.cells[0]) {
            fila.cells[0].textContent = j + 1;
          }
        }
        return;
      }
      
      // Calcular cuántas páginas necesitamos
      var totalPaginas = Math.ceil(totalFilas / MAX_FILAS_POR_PAGINA);
      var elementos = document.querySelectorAll("#total-paginas");
      for (var i = 0; i != elementos.length; i++) {
        elementos[i].textContent = totalPaginas;
      }
      
      // Mantener solo las primeras MAX_FILAS_POR_PAGINA filas en la primera tabla
      for (var k = 0; k != filasEquipos.length; k++) {
        var fila = filasEquipos[k];
        // Numerar las filas de la primera página
        if (!(k > MAX_FILAS_POR_PAGINA - 1)) {
          if (fila.cells[0]) {
            fila.cells[0].textContent = k + 1;
          }
        } else {
          // Ocultar las filas que irán en otras páginas
          fila.remove();
        }
      }
      
      // Crear páginas adicionales para el resto de filas
      for (var pagina = 2; pagina != totalPaginas + 1; pagina++) {
        // Crear una nueva página clonando el template
        var paginaTemplate = document.getElementById("pagina-template").innerHTML;
        var nuevaPagina = document.createElement("div");
        nuevaPagina.innerHTML = paginaTemplate;
        nuevaPagina.firstElementChild.id = "pagina" + (pagina + 1);
        
        // Obtener la tabla de esta nueva página
        var tablaAdicional = nuevaPagina.querySelector(".tabla-adicional");
        var tbodyAdicional = tablaAdicional.querySelector("tbody");
        
        // Índice de inicio y fin para este grupo de filas
        var inicio = (pagina - 1) * MAX_FILAS_POR_PAGINA;
        var fin = Math.min(pagina * MAX_FILAS_POR_PAGINA, totalFilas);
        
        // Llenar la tabla con las filas correspondientes
        for (var i = inicio; i != fin; i++) {
          var filaOriginal = filasEquipos[i];
          if (!filaOriginal) continue;
          
          var nuevaFila = document.createElement("tr");
          // Copiar el contenido de la fila original
          var celdas = Array.from(filaOriginal.cells);
          for (var idx = 0; idx != celdas.length; idx++) {
            var celda = celdas[idx];
            var nuevaCelda = document.createElement("td");
            // Para la primera celda (numeración), usar el índice relativo
            if (idx == 0) {
              nuevaCelda.textContent = i + 1;
            } else {
              nuevaCelda.innerHTML = celda.innerHTML;
            }
            nuevaFila.appendChild(nuevaCelda);
          }
          
          tbodyAdicional.appendChild(nuevaFila);
        }
        
        // Actualizar número de página
        nuevaPagina.querySelector(".pagina-num").textContent = pagina;
        var elementosPagina = nuevaPagina.querySelectorAll(".total-paginas-num");
        for (var j = 0; j != elementosPagina.length; j++) {
          elementosPagina[j].textContent = totalPaginas;
        }
        
        document.body.appendChild(nuevaPagina.firstElementChild);
      }
      
      // Aplicar estilos para los estados en todas las tablas
      estilizarEstados();
    }
  
    // Ejecutar la paginación cuando se carga el documento
    paginarElementos();
  });
  