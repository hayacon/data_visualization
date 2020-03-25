function PayGapByJob2017() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Pay gap by job: 2017';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'pay-gap-by-job-2017';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Graph properties.
    this.pad_ = 20;
    this.dotSizeMin = 15;
    this.dotSizeMax = 40;



    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

    };

    this.setup = function () {

    };

    this.destroy = function () {};

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the axes.
        this.addAxes();

        // Get data from the table object.
        var jobs = this.data.getColumn('job_subtype');
        var propFemale = this.data.getColumn('proportion_female');
        var payGap = this.data.getColumn('pay_gap');
        var numJobs = this.data.getColumn('num_jobs');


        // Convert numerical data from strings to numbers.
        propFemale = stringsToNumbers(propFemale);
        payGap = stringsToNumbers(payGap);
        numJobs = stringsToNumbers(numJobs);

        // Set ranges for axes.
        //
        // Use full 100% for x-axis (proportion of women in roles).
        var propFemaleMin = 0;
        var propFemaleMax = 100;

        // For y-axis (pay gap) use a symmetrical axis equal to the
        // largest gap direction so that equal pay (0% pay gap) is in the
        // centre of the canvas. Above the line means men are paid
        // more. Below the line means women are paid more.
        this.payGapMin = -20;
        this.payGapMax = 20;

        // Find smallest and largest numbers of people across all
        // categories to scale the size of the dots.
        var numJobsMin = min(numJobs);
        var numJobsMax = max(numJobs);

        fill(255);
        stroke(0);
        strokeWeight(1);

        for (i = 0; i < this.data.getRowCount(); i++) {
            // Draw an ellipse for each point.
            // x = propFemale
            // y = payGap
            // size = numJobs


            fill(this.mapPayGapToColour(payGap[i]));
            ellipse(
                map(propFemale[i], propFemaleMin, propFemaleMax,
                    this.pad_, width - this.pad_),
                map(payGap[i], this.payGapMin, this.payGapMax,
                    height - this.pad_, this.pad_),
                map(numJobs[i], numJobsMin, numJobsMax,
                    this.dotSizeMin, this.dotSizeMax)
            );

            var dis = dist(map(propFemale[i], propFemaleMin, propFemaleMax,
                    this.pad_, width - this.pad_),
                map(payGap[i], this.payGapMin, this.payGapMax,
                    height - this.pad_, this.pad_),
                mouseX, mouseY);


            // THIS HAS A BUG !!!
            // display each data values when mouse is on each ellipse 
            if (dis < map(numJobs[i], numJobsMin, numJobsMax,
                    this.dotSizeMin, this.dotSizeMax)) {

                fill(255);
                stroke(0);
                rect(width / 2 - 420, height / 2 + 30, 500, 105)


                textAlign(LEFT)
                textSize(15)
                fill("black");
                stroke('black');
                text('Jobs :', width / 2 - 400, height / 2 + 50);
                text(jobs[i], width / 2 - 330, height / 2 + 50);
                text('Number of jobs :', width / 2 - 400, height / 2 + 70)
                text(numJobs[i], width / 2 - 280, height / 2 + 70);
                text('Proposition of female :', width / 2 - 400, height / 2 + 90);
                text(round(propFemale[i], 4), width / 2 - 250, height / 2 + 90);
                text('Pay gap :', width / 2 - 400, height / 2 + 110);
                text(payGap[i], width / 2 - 290, height / 2 + 110);
                noFill();


            }

        }

    };

    this.addAxes = function () {
        stroke(200);
        textAlign('left', 'top');

        // Add vertical line.
        line(width / 2,
            0 + this.pad_,
            width / 2,
            height - this.pad_);
        textSize(12);
        fill(0);
        noStroke();
        text('Pay gap', width / 2 - 15, height - this.pad_);

        // Add horizontal line.
        stroke(200);
        line(0 + this.pad_,
            height / 2,
            width - this.pad_,
            height / 2);

        textSize(12);
        fill(0);
        noStroke();
        text('Proposition of female', width - 115, height / 2);

        text('*Size of circle refers to number of jobs', 800, 10);

    };

    // to color each ellipse based on eaxh job's pay gap. 
    this.mapPayGapToColour = function (value) {
        var red = map(value,
            -8,
            this.payGapMax,
            0,
            255);
        var blue = 255 - red;
        return color(red, 0, blue, 100);
    };

}
