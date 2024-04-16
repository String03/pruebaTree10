var data = {
    "name": "America",
    "children": [
        {
            "name": "Argentina",
            "children": [
                {
                    "name": "Buenos Aires"
                }
            ]   
        },
        {
            "name": "EEUU",
            "children": [
                {
                    "name": "Texas"
                }
            ]   
        }
    ]
};

var treeLayout = d3.tree().size([400, 200]);
var root = d3.hierarchy(data);

treeLayout(root);

var svg = document.getElementById('dtree');

svg.onclick = function() {
    var circlesToRemove = d3.selectAll("circle.node").filter((d, i) => i !== 0);
    circlesToRemove.remove();

    var nodesToRemove = d3.selectAll("text.label").filter((d, i) => i !== 0);
    nodesToRemove.remove();

    var linksToRemove = d3.selectAll("line.link");
    linksToRemove.remove();

    let start = Date.now();

    let timer = setInterval(function() {
        let timePassed = Date.now() - start;

        svg.style.left = timePassed / 5 + 'px';

        if (timePassed > 2000) clearInterval(timer);

    }, 20);
}

function update(source) {
    var nodes = root.descendants();
    var links = root.links();
    var nodoArgentina = nodes.find(d => d.data.name === "Argentina");
    var nodoEEUU = nodes.find(d => d.data.name === "EEUU");
    var nodoAmerica = nodes.find(d => d.data.name === "America");  
    var nodoBuenosAires = nodes.find(d => d.data.name === "Buenos Aires");
    var nodoTexas = nodes.find(d => d.data.name === "Texas");
  
    // Calcular la diferencia en la posición y entre los nodos Argentina y América
    var deltaYArgentina = nodoArgentina.y - nodoAmerica.y;
    var deltaYEEUU = nodoEEUU.y - nodoAmerica.y;

    // Obtener la posición x y y del texto del nodo Argentina
    var yArgentina = nodoArgentina.y + 5; // Supongo que el texto está desplazado 10 unidades hacia abajo del centro del círculo
    var yEEUU = nodoEEUU.y + 5; // Supongo que el texto está desplazado 10 unidades hacia abajo del centro del círculo

    // Ajustar la posición y del texto del nodo Argentina para que esté en la misma posición vertical que América
    var newYArgentina = yArgentina - deltaYArgentina;
    var newYEEUU = yEEUU - deltaYEEUU;

    // Ajustar la posición y del nodo Buenos Aires para que esté debajo del nodo Argentina
    var newYBuenosAires = newYArgentina + 100; // Supongamos que queremos que esté 100 unidades debajo de Argentina

    // Ajustar la posición y del nodo Texas para que esté debajo del nodo Argentina
    var newYTexas = newYArgentina + 100; // Supongamos que queremos que esté 200 unidades debajo de Argentina

    d3.select("svg g.nodes")
        .selectAll("circle.node")
        .data(nodes)
        .join("circle")          
        .classed("node", true)            
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 15)          
        .attr("fill", "green");  

    d3.select("svg g.links") 
        .selectAll("line.link")
        .data(links)
        .join("line")
        .classed("link", true)
        .style("stroke", "green")
        .attr('x1', function(d) {return d.source.x;})
        .attr('y1', function(d) {return d.source.y;})
        .attr('x2', function(d) {return d.target.x;})
        .attr('y2', function(d) {return d.target.y;});

    d3.select("svg g.nodes")
        .selectAll("text.label")
        .data(nodes)
        .join("text")
        .classed("label", true)
        .attr("x", function(d) { return d.x + 15;})
        .attr("y", function(d) { return d.y + 10;})
        .text(d => {
            return d.data.name;
        })
        .attr("fill","green")            
        .filter(function(d) { return d === nodoArgentina || d === nodoEEUU || d === nodoBuenosAires || d === nodoTexas; }) // Filtrar para nodos "Argentina", "EEUU", "Buenos Aires" y "Texas"
        .each(function(d) {
            var newY;
            if (d === nodoArgentina)
                newY = newYArgentina;
            else if (d === nodoEEUU)
                newY = newYEEUU;
            else if (d === nodoBuenosAires)
                newY = newYBuenosAires;
            else if (d === nodoTexas)
                newY = newYTexas; 

            d3.select(this)
                .attr("y", newY) // Establecer la posición "y" inicial
                .transition()
                .duration(1000) // Duración de la transición en milisegundos
                .attr("y", newY + 100); // Mover el texto hacia abajo 100 unidades con respecto a la posición inicial de los nodos
        });
}

function toggleCollapse() {
    var nodes = root.descendants();      
    var contadorFlag = 0
   
    
    nodes.forEach(function(d) {    

        if (d.data.name === "Buenos Aires" || d.data.name === "Texas") {
            return; // Ignorar estos nodos
        }
        

        if (d.children) {            
            d._children = d.children;
            d.children = null;
           
        } else {            
            contadorFlag++
            d.children = d._children;
            d._children = null;
        }
        
    });

  

    if(contadorFlag !== 2){
        update(root);
    }

    //if(!(!isFlagFalse && isFlagTrue)){
    //    update(root);
    //}
    
    
}


// Initial rendering
update(root);

// Simulate toggleCollapse every 2 seconds
setInterval(toggleCollapse,1000);