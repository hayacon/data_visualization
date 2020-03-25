function ElectionResult() {

    //     Name for the visualisation to appear in the menu bar.
    this.name = 'UK General Election Result';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'uk-general-election-result';

    // Property to represent whether data has been loaded.
    this.loaded = false;


    // MAKE THEM NOT GLOBAL !!
    var bubbles = [];
    var years = [];

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added
    this.preload = function () {
        var self = this;
        this.data = loadTable('./data/UK-gov/UK-general-election-result.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.setup = function () {

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // buttons to select year
        this.selectYear();

        for (var i = 0; i < this.data.getRowCount(); i++) {
            var r = this.data.getRow(i);

            var name = r.getString(0);

            if (name != "") {

                var d = [];

                for (var j = 0; j < years.length; j++) {
                    var v = Number(r.get(years[j]));
                    d.push(v);
                };

                // EDIT THESE COLOUR 
                var c = ['red', 'orange', 'green', 'blue', 'pink']

                var b = new this.Bubble(name, d, c[i], years);

                b.setYear(0);
                bubbles.push(b);
            };
        };
    }

    this.draw = function () {

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        push();
        textAlign(CENTER);
        translate(width / 2, height / 2);
        // loops through array of bubbles to draw them
        for (var i = 0; i < bubbles.length; i++) {

            bubbles[i].updateDirection(bubbles);
            bubbles[i].draw();

        }

        pop();

    }


    // function to create buttons woth year selection
    this.selectYear = function () {

        textSize(20);

        // create an array of buttons in order to destroy them when switch to other visualization 
        this.yearbutton = [];

        for (var i = 1; i < this.data.getColumnCount(); i++) {

            var y = this.data.columns[i];
            years.push(y);

            this.button = createButton(y);

            // display buttons vertically 
            this.button.position(340, 10 + 40 * i);
            this.button.size(80, 40);
            var col = color(25, 23, 200, 50);
            this.button.style('background-color', col);
            this.button.style('color', 'blue');

            this.yearbutton.push(this.button);

            this.button.mousePressed(function () {

                // pass a year to bubble in a form of index
                var yearString = this.elt.innerHTML;
                var yearIndex = years.indexOf(yearString);


                for (var i = 0; i < bubbles.length; i++) {
                    bubbles[i].setYear(yearIndex);
                }
            })
        };
    }

    // bubble to show data
    this.Bubble = function (name, _data, colour) {

        this.name = name;
        this.pos = createVector(0, 0);
        this.dir = createVector(0, 0);
        this.bubbleID = getRandomId();

        this.data = _data;

        this.colour = colour;
        this.size = 15;
        this.targetSize = this.size;

        this.draw = function () {

            noStroke();
            fill(this.colour);
            ellipse(this.pos.x, this.pos.y, this.size);

            fill(0)
            text(name, this.pos.x, this.pos.y);

            this.pos.add(this.dir);

            if (this.size < this.targetSize) {
                this.size += 1;

            } else if (this.size > this.targetSize) {
                this.size -= 1;
            }

            textSize(100);
            fill(192, 192, 192, 40);
            text(years[this.yearindex], 0, 0);
            textSize(20);
            fill(0);
        };

        this.setYear = function (year_index) {

            var v = this.data[year_index]
            this.targetSize = map(v, 0, 450, 0, 400);
            this.yearindex = year_index;
        };
        // keep each bubble to not collied each other 
        this.updateDirection = function (bubbles) {

            this.dir = createVector(0, 0);

            for (var i = 0; i < bubbles.length; i++) {
                if (bubbles[i].bubbleID != this.bubbleID) {


                    var v = p5.Vector.sub(this.pos, bubbles[i].pos);
                    var d = v.mag();

                    if (d < this.size / 2 + bubbles[i].size / 2) {

                        // change bubble's direction when bubbles collied //each other 
                        if (d == 0) {
                            this.dir.add(p5.Vector.random2D());

                        } else {

                            this.dir.add(v);
                        }
                    }
                }
            }
            this.dir.normalize();
        }
    };

    this.destroy = function () {

        // remove button when switch to other app
        for (var i = 0; i < this.yearbutton.length; i++) {
            this.yearbutton[i].remove();
        }

        // remove all Bubbles when switching to other app 
        for (var i = 0; i < 10; i++) {
            bubbles.pop();
        }
    };
};

// function to give a random ID to each bubble. 
// it need to be random so none of bubble will have the same ID
function getRandomId() {
    var alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    var s = ""
    for (var i = 0; i < 10; i++) {
        s += alpha[floor(random(0, alpha.length))];
    }

    return s;
};
