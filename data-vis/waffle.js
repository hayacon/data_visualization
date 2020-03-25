function Waffle(_x, _y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues) {

    this._x = _x;
    this._y = _y;
    this._height = height;
    this._width = width;
    this.boxes_across = boxes_across;
    this.boxes_down = boxes_down;

    this.columnHeading = columnHeading;
    this.column = table.getColumn(columnHeading);
    this.possibleValues = possibleValues;


    var _boxes = [];


    this.addCategories = function () {

        // EDIT THESE COLOURS 
        this._colours = ["brown", "red", "yellow", "purple", "blue", "orange", "pink"];

        this.categories = []

        for (var i = 0; i < this.possibleValues.length; i++) {
            this.categories.push({
                "name": this.possibleValues[i],
                "count": table.getNum(i, columnHeading),
                "colours": this._colours[i % this._colours.length],
            })
        }

        // iterate over the categories and add proportions 
        for (var i = 0; i < this.categories.length; i++) 
        {
            this.categories[i].boxes = round(this.categories[i].count);
        }

    }

    this.addBoxes = function () {

        var _currentCategory = 0;
        var _currentCategoryBox = 0;

        var _boxWidth = width / this.boxes_across;
        var _boxHeight = height / this.boxes_down;

        for (var i = 0; i < this.boxes_down; i++) {
            _boxes.push([]);
            for (var j = 0; j < this.boxes_across; j++) {
                if (_currentCategoryBox == this.categories[_currentCategory].boxes) {
                    _currentCategoryBox = 0;
                    _currentCategory++;
                }

                _boxes[i].push(new Box(_x + (j * _boxWidth), _y + (i * _boxHeight), _boxWidth, _boxHeight, this.categories[_currentCategory]));
                _currentCategoryBox++;
            }


        }
    };

    this.addCategories();
    this.addBoxes();

    this.draw = function () {

        for (var i = 0; i < _boxes.length; i++) {
            for (var j = 0; j < _boxes[i].length; j++) {
                if (_boxes[i][j].category != undefined) {
                    _boxes[i][j].draw()
                }
            }
            
            stroke(0);
            textAlign(LEFT, CENTER);
            textSize(25);
            fill(0);
            text(columnHeading, this._x + 40, this._y - 15);
        }
    };

    this.checkMouse = function (mouseX, mouseY) {
        for (var i = 0; i < _boxes.length; i++) {
            for (var j = 0; j < _boxes[i].length; j++) {

                if (_boxes[i][j].category != undefined) {
                    var _mouseOver = _boxes[i][j].mouseOver(mouseX, mouseY);
                    if (_mouseOver != false) {
                        push();
                        fill(0);
                        textSize(20);
                        var tWidth = textWidth(_mouseOver);
                        textAlign(LEFT, TOP);
                        rect(mouseX, mouseY, tWidth + 20, 40);
                        fill(255);
                        text(_mouseOver, mouseX + 10, mouseY + 10);
                        pop();
                        break;
                    }
                }
            }
        }
    };
    
    this.destroy = function(){};
}
