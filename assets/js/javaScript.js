let apiURL = "https://mindicador.cl/api/";
let codigoMonedas = ["dolar","euro"];
let grafico;

let inputMontoPeso = document.querySelector("#montoPesos");
let selectMonedaCambio = document.querySelector("#monedaCambio");
let parrafoMensaje = document.querySelector("#mensaje");
let botonBuscar = document.querySelector("#botonBuscar");
let myChart = document.querySelector("#myChart");

renderSelect();

botonBuscar.addEventListener("click",async function(){
    let codigoMoneda = selectMonedaCambio.value;
    let montocl = inputMontoPeso.value;
    let moneda = await getMoneda(codigoMoneda);

    renderGrafico(moneda);
    calculoMonedas(moneda,montocl);

});


async function renderSelect(){
    let monedas = await getMonedas(codigoMonedas);
    let html = ""; 

    for(const moneda of monedas){
        let template = `
        <option value="${moneda.codigo}">${moneda.nombre}</option>
        `;

        html += template;
    }

    selectMonedaCambio.innerHTML = html;
}

async function getMonedas(arrayCodigos){
    let monedas = [];

    for(let i = 0; i < arrayCodigos.length; i ++){
        let moneda = await getMoneda(arrayCodigos[i])
        monedas.push(moneda);
    }

    return monedas;
}

async function getMoneda(codigo){

    try{
        const rest = await fetch(apiURL + codigo);
        let moneda = await rest.json();
        return moneda;
    }catch(error){
        parrafoMensaje.innerHTML = "Error, revisar consulta";
    }
}



function renderGrafico(moneda){
    let serie10last = moneda.serie.slice(0,10);

    const labels = serie10last.map(serie => serie.fecha.slice(0,10)).reverse();

    const data = serie10last.map(serie => serie.valor);

    const datasets = [
        {
            label: "Historial ultimos 10 dias",
            borderColor: "blue",
            data
        }
    ];

    const conf = {
        type: "line",
        data: {
            labels,
            datasets
        }
    };

    myChart.innerHTML = "";

    if(grafico){
        grafico.destroy();
    };

    grafico = new Chart(myChart, conf); 
}


function calculoMonedas(moneda,montocl){
    
    let valor = moneda.serie.valor;
    let calculo ;
    
        calculo = montocl * valor;
        
            //parrafoMensaje.innerHTML="Debes ingresar un monto a calcular"
        
    parrafoMensaje.innerHTML = "Resultado: "+ calculo;
}