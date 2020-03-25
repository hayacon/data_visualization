function PieChart(x, y, diameter) {

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.labelSpace = 30;

    this.get_radians = function (data) {
        var total = sum(data);
        var radians = [];

        for (let i = 0; i < data.length; i++) {
            radians.push((data[i] / total) * TWO_PI);
        }

        return radians;
    };

    this.draw = function (data, labels, colours, title, company) {

        // Test that data is not empty and that each input array is the
        // same length.
        if (data.length == 0) {
            alert('Data has length zero!');
        } else if (![labels, colours].every((array) => {
                return array.length == data.length;
            })) {
            alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
        }

        // https://p5js.org/examples/form-pie-chart.html

        var angles = this.get_radians(data);
        var lastAngle = 0;
        var colour;

        fill(200, 200, 200);
        stroke(0);
        rect(760, 140, 90, 190)

        for (var i = 0; i < data.length; i++) {
            if (colours) {
                colour = colours[i];
            } else {
                colour = map(i, 0, data.length, 0, 255);
            }

            fill(colour);
            stroke(0);
            strokeWeight(1);

            arc(this.x, this.y,
                this.diameter, this.diameter,
                lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!


            if (labels) {
                this.makeLegendItem(labels[i], i, colour, data[i]);
            }

            lastAngle += angles[i];
        }

        // area to show a data
        // WORK ON THIS

        fill(220, 220, 220);
        stroke(0);
        strokeWeight(2);
        arc(this.x, this.y, this.diameter / 3, this.diameter / 3, 0, TWO_PI);

        var tSize = 25;

        // add some animation


        fill(0);
        noStroke();
        textSize(tSize);
        textAlign('center', 'center');
        text(company, this.x, this.y);



        if (title) {
            fill('black');
            noStroke();
            textAlign('center', 'center');
            textSize(24);
            text(title, this.x, this.y - this.diameter * 0.6);
        }
    };

    this.makeLegendItem = function (label, i, colour, data) {
        var x = this.x + 50 + this.diameter / 2;
        var y = this.y + (this.labelSpace * i) - this.diameter / 3;
        var boxWidth = this.labelSpace / 2;
        var boxHeight = this.labelSpace / 2;
        var data = ceil(data);

        fill(colour);
        rect(x, y, boxWidth, boxHeight);

        fill('black');
        noStroke();
        textAlign('left', 'center');
        textSize(12);
        text(label, x + boxWidth + 10, y + boxWidth / 2);
        text(data, x + boxWidth + 45, y + boxWidth / 2);

    };

}
