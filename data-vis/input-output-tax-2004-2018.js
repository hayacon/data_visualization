function InputOutputTax() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Tax Input and Output: 2004-2019';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'Input-Output-Tax';

    // Title to display above the plot.
    this.title = 'Tax Input and Output (£ million)'

    // Names for each axis.
    this.xAxisLabel = 'year';
    this.yAxisLabel = '';

    var marginSize = 35;

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        marginSize: marginSize,

        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function () {
            return this.rightMargin - this.leftMargin;
        },

        plotHeight: function () {
            return this.bottomMargin - this.topMargin;
        },



        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 13,
        numYTickLabels: 10,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;


    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.

    this.preload = function () {
        var self = this;
        this.data = loadTable('./data/UK-gov/T11-Table1.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.setup = function () {

        // Font defaults.
        textSize(16);
        strokeWeight(1);



        // Set min and max years: assumes data is sorted by date.
        this.startYear = this.data.getNum(0, 0);
        this.endYear = this.data.getNum(this.data.getRowCount() - 1, 0) + 0.3;


        // Find min and max value for mapping to canvas height.
        this.minTax = 0; // Tax equality (zero).
        // get maximum number of data 
        this.maxTax = max(
            float(this.data.getColumn('Total-output-tax'))
        ) + 13480;



    };

    this.destroy = function () {};

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        fill(220, 220, 220)
        noStroke();
        rect(this.layout.leftMargin, this.layout.topMargin, this.layout.rightMargin - marginSize * 2, this.layout.bottomMargin - marginSize);

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minTax,
            this.maxTax,
            this.layout,
            this.mapTaxToHeight.bind(this),
            0);

        // Draw x and y axis.
        drawAxis(this.layout);



        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
            this.yAxisLabel,
            this.layout);

        // Plot all pay gaps between startYear and endYear using the width
        // of the canvas minus margins.
        var previous;
        var numYears = this.endYear - this.startYear;
        var barwidth = 15;

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < this.data.getRowCount(); i++) {

            // Create an object to store data for the current year.
            var current = {
                // Convert strings to numbers.
                'year': this.data.getNum(i, 'year'),
                'Input': this.data.getNum(i, 'Total-input-tax'),
                'Output': this.data.getNum(i, 'Total-output-tax'),
            };

            if (previous != null) {
                // Draw rectangles (bars) to reprsent each data set

                stroke(0);

                //Input tax
                fill('blue');
                rect(this.mapYearToWidth(current.year) - barwidth,
                    this.mapTaxToHeight(current.Input),
                    barwidth,
                    this.layout.bottomMargin - this.mapTaxToHeight(current.Input)
                );


                //Output tax
                fill('red');
                rect(this.mapYearToWidth(current.year),
                    this.mapTaxToHeight(current.Output),
                    barwidth,
                    this.layout.bottomMargin - this.mapTaxToHeight(current.Output)
                );



                // The number of x-axis labels to skip so that only
                // numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) {
                    drawXAxisTickLabel(previous.year, this.layout,
                        this.mapYearToWidth.bind(this));
                }

                // Input data siplaying 
                // new variables to use for displaying a data values
                var input_width = this.mapYearToWidth(current.year) - barwidth;

                // display data values
                if (mouseX < this.mapYearToWidth(current.year) && mouseX > input_width && mouseY < this.layout.bottomMargin && mouseY > this.mapTaxToHeight(current.Input)) {

                    stroke(0);
                    fill('pink');
                    rect(this.layout.leftMargin + 20, this.layout.topMargin + 5, 140, 85);

                    fill('black');
                    noStroke();
                    text(current.year, this.layout.leftMargin + 90, this.layout.topMargin + 20);
                    text('Input:', this.layout.leftMargin + 50, this.layout.topMargin + 35);
                    text(current.Input, this.layout.leftMargin + 110, this.layout.topMargin + 35);
                    text('Output:', this.layout.leftMargin + 50, this.layout.topMargin + 50);
                    text(current.Output, this.layout.leftMargin + 110, this.layout.topMargin + 50);
                    text('Net:', this.layout.leftMargin + 50, this.layout.topMargin + 65);
                    text(current.Input - current.Output, this.layout.leftMargin + 110, this.layout.topMargin + 65);
                    text('(£ million)', this.layout.leftMargin + 60, this.layout.topMargin + 80);
                };

                //Output data displaying
                // new variables to use for displaying a data values
                var output_width = this.mapYearToWidth(current.year) + barwidth;

                // diplay data values 
                if (mouseX > this.mapYearToWidth(current.year) && mouseX < output_width && mouseY < this.layout.bottomMargin && mouseY > this.mapTaxToHeight(current.Output)) {

                    stroke(0);
                    fill('pink');
                    rect(this.layout.leftMargin + 20, this.layout.topMargin + 5, 140, 85);

                    fill('black');
                    noStroke();
                    text(current.year, this.layout.leftMargin + 90, this.layout.topMargin + 20);
                    text('Input:', this.layout.leftMargin + 50, this.layout.topMargin + 35);
                    text(current.Input, this.layout.leftMargin + 110, this.layout.topMargin + 35);
                    text('Output:', this.layout.leftMargin + 50, this.layout.topMargin + 50);
                    text(current.Output, this.layout.leftMargin + 110, this.layout.topMargin + 50);
                    text('Net:', this.layout.leftMargin + 50, this.layout.topMargin + 65);
                    text(current.Input - current.Output, this.layout.leftMargin + 110, this.layout.topMargin + 65);
                    text('(£ million)', this.layout.leftMargin + 60, this.layout.topMargin + 80);
                }
            }
            previous = current;
        }

        // Label that describe what each bar represent 
        fill('red');
        rect(400, 50, 10, 10);
        fill('black');
        text('Tax Output', 450, 55);
        fill('blue');
        rect(400, 70, 10, 10);
        fill('black');
        text('Tax Input', 445, 75)
    };

    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    };

    this.mapYearToWidth = function (value) {
        return map(value,
            this.startYear,
            this.endYear,
            this.layout.leftMargin, // Draw left-to-right from margin.
            this.layout.rightMargin);
    };

    this.mapTaxToHeight = function (value) {
        return map(value,
            this.minTax,
            this.maxTax,
            this.layout.bottomMargin, // Smaller value at bottom.
            this.layout.topMargin); // Bigger value at top.
    };
}
