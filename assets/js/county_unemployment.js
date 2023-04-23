$(document).ready(function() {
    let tarchart = $('#featured_dataviz')
    let fill_color = getComputedStyle(document.documentElement).getPropertyValue('--mauve');
    let axis_color = getComputedStyle(document.documentElement).getPropertyValue('--bar-chart-axis');
    let bar_padding = getComputedStyle(document.documentElement).getPropertyValue('--bar-chart-padding');
    let surface_color = getComputedStyle(document.documentElement).getPropertyValue('--surface0');

    let tooltip_gen = function(mo_event){
        let name = mo_event.srcElement.__data__.properties.NAME
        let value = mo_event.srcElement.__data__.unemp
        return `<h2>${name}</h2>
            <p>Unemployment Rate: <b>${value}%</b></p>`
    }

    let margin = {top: 10, right: 30, bottom: 10, left: 30},
        width = tarchart.width() - margin.left - margin.right,
        height = tarchart.height() - margin.top - margin.bottom;
    let rheight = height + margin.top + margin.bottom;
    let rwidth = width + margin.left + margin.right;

    let tooltip = d3.select(".figure-container")
        .append("div")
        .attr("class", "tooltip")
        .style("z-index", "100")
        .style("position", "relative")
        .style("visibility", "hidden")
        .style("color", axis_color)


    let projection = d3.geoAlbersUsa()
        .scale(rwidth*1.20)
        .translate([rwidth / 2, rheight / 2]);

    let county_shapes = d3.json("/data/uscounties.json")
    let econdata = d3.csv("/data/bls_employment.csv")
    let svg = d3.select('#featured_dataviz')
                .append("svg")
                .attr("viewBox", `0 0 ${rwidth} ${rheight}`)
                .attr("id", "hero-map")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    let setup = function() {

        Promise.all([county_shapes, econdata]).then(function(dl) {

            let margin = {top: 10, right: 30, bottom: 10, left: 30},
                width = tarchart.width() - margin.left - margin.right,
                height = tarchart.height() - margin.top - margin.bottom;

            let rheight = height + margin.top + margin.bottom;
            let rwidth = width + margin.left + margin.right;
            let projection = d3.geoAlbersUsa()
                .scale(rwidth*1.25)
                .translate([rwidth / 2, rheight / 2 - 50]);

            d3.select('#featured_dataviz').selectAll("svg").remove()

            let svg = d3.select('#featured_dataviz')
                        .append("svg")
                        .attr("viewBox", `0 0 ${rwidth} ${rheight}`)
                        .attr("id", "hero-map")
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

            topo = dl[0]
            let data = dl[1]
            let datmap = new Map(Array.from(data, d => [`${d.State}${d.County}`, +d["(%)"]]))

            topo.features = topo.features.filter(d => d.properties.STATE != "02")
            c = d3.scalePow().exponent(0.5).domain(d3.extent(data.map(d => +d["(%)"])))
                .range(["#000000", fill_color])

            svg.selectAll("path")
                .data(topo.features)
                .enter()
                .append("path")
                    .attr("d", d3.geoPath()
                        .projection(projection)
                    )
                    .style("stroke", "#000000")
                    .style("stroke-width", ".3px")
                    .attr("fill", d => {
                        let st = d.properties.STATE;
                        let co = d.properties.COUNTY;
                        d.unemp = datmap.get(st + co);
                        return c(d.unemp);
                    })
                    .attr("class", function(d) { return "County"})
                    .attr("data-name", function(d) {return d.properties.NAME})
                    .on("mouseover", d => {tooltip.html(tooltip_gen(d)); tooltip.style("visibility", "visible")})
                    .on("mousemove", d => {tooltip.style("top", (d3.pointer(d)[1]-rheight) + "px").style("left", d3.pointer(d)[0]+"px");})
                    .on("mouseout", _ => {tooltip.style("visibility", "hidden")})
        }
        )
        console.log("setup run")
    }

    setup()
    //document.getElementById("featured_dataviz").addEventListener("resize", setup);
    window.addEventListener("resize", setup)

});
