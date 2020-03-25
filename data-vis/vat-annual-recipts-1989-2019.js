function VATAnnualRecipts() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'VAT Annual Recipt : 1989-2019';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'vat-annual-recipts';

    // Title to display above the plot.
    this.title = 'UK VAT : Annual recipt';

    // Names for each axis.
    this.xAxisLabel = 'year';
    this.yAxisLabel = '£ million';

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
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/UK-gov/T1-Table1.csv', 'csv', 'header',
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
        this.endYear = this.data.getNum(this.data.getRowCount() - 1, 0);



        // Find min and max pay gap for mapping to canvas height.
        this.minVat = 0; // VAT equality (zero pay gap).
        // get maximum number of data 
        this.maxVat = max(float(this.data.getColumn('Total_VAT'),
            float(this.data.getColumn('Home_VAT')),
            float(this.data.getColumn('Import_VAT')))) + 826;



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
        drawYAxisTickLabels(this.minVat,
            this.maxVat,
            this.layout,
            this.mapPayGapToHeight.bind(this),
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

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < this.data.getRowCount(); i++) {

            // Create an object to store data for the current year.
            var current = {
                // Convert strings to numbers.
                'year': this.data.getNum(i, 'Financial_year'),
                'totalvat': this.data.getNum(i, 'Total_VAT'),
                'homevat': this.data.getNum(i, 'Home_VAT'),
                'importvat': this.data.getNum(i, 'Import_VAT')
            };

            if (previous != null) {
                // Draw line segment connecting previous year to current
                // Total_VAT .
                stroke(0);
                noFill();
                line(this.mapYearToWidth(previous.year),
                    this.mapPayGapToHeight(previous.totalvat),
                    this.mapYearToWidth(current.year),
                    this.mapPayGapToHeight(current.totalvat));

                strokeWeight(5);
                point(this.mapYearToWidth(current.year),
                    this.mapPayGapToHeight(current.totalvat));
                //label of this line
                noStroke();
                fill(0)
                text("Total VAT",
                    (this.layout.plotWidth() / 1.1) + this.layout.leftMargin,
                    this.layout.topMargin - (this.layout.marginSize / 2) + 50);

                //Home_VAT
                noFill();
                stroke('blue');
                strokeWeight(2);
                line(this.mapYearToWidth(previous.year),
                    this.mapPayGapToHeight(previous.homevat),
                    this.mapYearToWidth(current.year),
                    this.mapPayGapToHeight(current.homevat));


                strokeWeight(5);
                point(this.mapYearToWidth(current.year),
                    this.mapPayGapToHeight(current.homevat))
                // label of this line

                noStroke();
                fill('blue');
                text("Home VAT",
                    (this.layout.plotWidth() / 1.1) + this.layout.leftMargin,
                    this.layout.topMargin - (this.layout.marginSize / 2) + 150);


                //Import_VAT
                noFill();
                stroke('red');
                strokeWeight(2);
                line(this.mapYearToWidth(previous.year),
                    this.mapPayGapToHeight(previous.importvat),
                    this.mapYearToWidth(current.year),
                    this.mapPayGapToHeight(current.importvat));

                strokeWeight(5);
                point(this.mapYearToWidth(current.year),
                    this.mapPayGapToHeight(current.importvat))
                //Label of this line
                noStroke();
                fill('red');
                text("Import VAT",
                    (this.layout.plotWidth() / 1.1) + this.layout.leftMargin,
                    this.layout.topMargin - (this.layout.marginSize / 2) + 370);

                // The number of x-axis labels to skip so that only
                // numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) {
                    drawXAxisTickLabel(previous.year, this.layout,
                        this.mapYearToWidth.bind(this));
                }
            }

            // distance between each data point and mouseX,Y 
            var totalvat_d = dist(this.mapYearToWidth(current.year),
                this.mapPayGapToHeight(current.totalvat),
                mouseX, mouseY);
            var homevat_d = dist(this.mapYearToWidth(current.year),
                this.mapPayGapToHeight(current.homevat),
                mouseX, mouseY);
            var importvat_d = dist(this.mapYearToWidth(current.year),
                this.mapPayGapToHeight(current.importvat),
                mouseX, mouseY);


            // display each year's data when mouse is on the bar graph
            strokeWeight(2);
            if (totalvat_d < 10 || homevat_d < 10 || importvat_d < 10) {

                stroke('red');
                fill('black');
                rect(this.layout.leftMargin + 110, this.layout.topMargin + 35, 110, 100)
                fill('white');
                noStroke();
                text(current.year, this.layout.leftMargin + 160, this.layout.topMargin + 50);
                text('total:', this.layout.leftMargin + 140, this.layout.topMargin + 70);
                text(current.totalvat, this.layout.leftMargin + 190, this.layout.topMargin + 70);
                text('home:', this.layout.leftMargin + 140, this.layout.topMargin + 90);
                text(current.homevat, this.layout.leftMargin + 190, this.layout.topMargin + 90);
                text('import:', this.layout.leftMargin + 140, this.layout.topMargin + 110);
                text(current.importvat, this.layout.leftMargin + 190, this.layout.topMargin + 110);
            }

            // Assign current year to previous year so that it is available
            // during the next iteration of this loop to give us the start
            // position of the next line segment.
            previous = current;
        }
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

    this.mapPayGapToHeight = function (value) {
        return map(value,
            this.minVat,
            this.maxVat,
            this.layout.bottomMargin, // Smaller pay gap at bottom.
            this.layout.topMargin); // Bigger pay gap at top.
    };
}
