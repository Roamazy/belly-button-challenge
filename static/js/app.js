
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//making charts
function charts(sample) {
    d3.json(url).then((data)=>{
        let samples = data.samples;
        let alltests = samples.filter(sampleObj => sampleObj.id == sample);
        let test = alltests[0];

        let sample_values = test.sample_values;
        let otu_ids = test.otu_ids;
        let otu_labels = test.otu_labels;
        
        //bar
        let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        let bar_xaxis = sample_values.slice(0,10).reverse();
        let bar_text = otu_labels.slice(0,10).reverse();
        let bar = [
            {
                y: yticks,
                x: bar_xaxis,
                text: bar_text,
                type: "bar",
                orientation: "h",

            }
        ];
        let bar_layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };
        
        Plotly.newPlot("bar", bar, bar_layout);

        //bellybutton bubble(chart)gum
        let bub_layout = {
            title: "Bacteria Cultures per Sample",
            margin: {t: 0},
            hovermode: "closest",
            x: {title: "OTU ID"},
            margin: {t: 30}
        };
        let bub = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        Plotly.newPlot("bubble", bub, bub_layout);
    });
}

//metadata
function metadata(sample) {
    d3.json(url).then((data)=> {
        let meta = data.metadata;
        let alltests = meta.filter(sampleObj => sampleObj.id == sample);
        let test = alltests[0];
        let samplemeta = d3.select("#sample-metadata");
        
        //clear the info
        samplemeta.html("");

        for (beep in test){
            samplemeta.append("h6").text(`${beep.toUpperCase()}: ${test[beep]}`);
        };

    });
}

//put it all together and press record
function init() {
    let selector = d3.select("#selDataset");

    d3.json(url).then((data)=>{
        let individuals = data.names;

        for (let i = 0; i < individuals.length; i++) {
            selector
            .append("option")
            .text(individuals[i])
            .property("value", individuals[i]);
        };
        let starter = individuals[0];
        charts(starter);
        metadata(starter);
    });
}

function optionChanged(newSample) {
    charts(newSample);
    metadata(newSample);
}

init();


//
//      BELOW ARE A RECORD OF MY STRUGGLES TO MAKE SENSE OF THIS
//      USING A COMBINATION OF CLASS MATERIALS AND CHATGPT PROMPTS
//      TO FIGURE OUT STRUCTURE AND SYNTAX, ALL HOPELESSLY DOOMED
//
//      THIS PROJECT WAS MADE POSSIBLE THROUGH EXTENSIVE EXTRACURRUCULAR
//      HELP, OFFICE HOURS, AND DONATIONS FROM LISTENERS LIKE YOU
//




//<script src="./static/js/bonus.js"></script>

// Use the D3 library to read in samples.json from the URL

/*const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    console.log(data);
  });
*/

/*Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

    Use sample_values as the values for the bar chart.

    Use otu_ids as the labels for the bar chart.

    Use otu_labels as the hovertext for the chart.
*/


/*
function init() {
    data = [{
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16] }];
  
    Plotly.newPlot("plot", data);
  }
  */


// URL of the JSON data
//const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

/*
// Fetch JSON data from the URL
d3.json(url).then(function(data) {
    // Extract necessary data
    const samples = data.samples;
    console.log(data.samples);
});
*/


// I need to slice the top 10 OTUs for each individual
    // do I need to order ascending, then slice(0, 10) ??
    

/*

    // Function to update bar chart
    function updateBarChart(individualId) {
        // Filter samples data for the selected individual
        const selectedSample = samples.find(sample => sample.id === individualId);


        // Extract top 10 OTUs
        const top10OTUs = selectedSample.otu_ids.slice(0, 10);
        const top10Values = selectedSample.sample_values.slice(0, 10);
        const top10Labels = selectedSample.otu_labels.slice(0, 10);

    

        // Clear existing chart
        //d3.select('#bar-chart').selectAll('*').remove();

        // Define dimensions
        const margin = { top: 20, right: 20, bottom: 20, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(top10Values)])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(top10OTUs.map(d => `OTU ${d}`))
            .range([0, height])
            .padding(0.1);

        // Create SVG element
        const svg = d3.select('#bar-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create bars
        svg.selectAll('.bar')
            .data(top10Values)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', (d, i) => yScale(`OTU ${top10OTUs[i]}`))
            .attr('width', d => xScale(d))
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue')
            .append("title")
            .text((d, i) => top10Labels[i]); // Set hover text

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    }

    // Create dropdown menu
    const dropdown = d3.select('#dropdown');
    dropdown.selectAll('option')
        .data(samples.map(sample => sample.id))
        .enter().append('option')
        .text(d => d)
        .attr('value', d => d);

    // Initial update
    updateBarChart(samples[0].id);

    // Event listener for dropdown change
    dropdown.on('change', function() {
        const selectedIndividual = dropdown.property('value');
        updateBarChart(selectedIndividual);
    });
}).catch(function(error) {
    console.error('Error loading JSON data:', error);
});

*/

///////////////////
/*

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    const individuals = data.names;
    const samples = data.samples;



    // Populate the dropdown menu with options
    const dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
        .data(individuals)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Initialize the chart with the first individual
    optionChanged(individuals[0]);

    // Define function to update the chart based on selected individual
    function optionChanged(selectedIndividual) {
        const selectedSample = samples.find(sample => sample.id === selectedIndividual);
        const otuIds = selectedSample.otu_ids.slice(0, 10);
        const otuLabels = selectedSample.otu_labels.slice(0, 10);
        const sampleValues = selectedSample.sample_values.slice(0, 10);

  
 ///interjection start

// Display the default plot
    function init() {
        let data = [{
        values: sampleValues,
        labels: otuIds,
        type: "bar"
    }];

        let layout = {
        height: 600,
        width: 800
    };

  Plotly.newPlot("bar", data, layout);
    };
}

d3.selectAll("#selDataset").on("change", getData);

// Function called by DOM changes
function getData() {
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a letiable
  let dataset = dropdownMenu.property("value");

  updatePlotly(data);
}

// Update the restyled plot's values
function updatePlotly(newdata) {
  Plotly.restyle("pie", "values", [newdata]);
}

init();

});

 ///interjection end


 
        const svgWidth = 400;
        //const svgHeight = 300;
        const barHeight = 30;

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(sampleValues)])
            .range([0, svgWidth]);

        const svg = d3.select("#bar")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", barHeight * otuIds.length);

        const bars = svg.selectAll("rect")
            .data(sampleValues)
            .enter()
            .append("rect")
            .attr("y", (d, i) => i * barHeight)
            .attr("width", d => xScale(d))
            .attr("height", barHeight - 1)
            .attr("fill", "steelblue")
            .attr("class", "bar")
            .attr("data-otu-label", (d, i) => otuLabels[i]);

        const labels = svg.selectAll("text")
            .data(otuIds)
            .enter()
            .append("text")
            .attr("x", 10)
            .attr("y", (d, i) => i * barHeight + barHeight / 2)
            .attr("dy", ".35em")
            .text(d => "OTU " + d)
            .attr("fill", "white");

        svg.selectAll(".bar")
            .on("mouseover", function() {
                const otuLabel = d3.select(this).attr("data-otu-label");
                d3.select("#sample-metadata").text("OTU Label: " + otuLabel);
            })
            .on("mouseout", function() {
                d3.select("#sample-metadata").text("");
            });
    }
});
*/
