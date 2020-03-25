

function Corona() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Corona: number of cases';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'corona';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    var marginSize = 20;


    this.layout = {
        marginSize: marginSize,
        leftMargin: marginSize,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize,
        pad: 5,

    };

    this.preload = function () {

        var self = this;
        this.dataCase = loadTable('./data/corona/total_cases.csv', 'csv', 'header',
            function (table) {
                self.loaded = true;
            });

        this.dataDeath = loadTable('./data/corona/total_deaths.csv', 'csv', 'header',
            function (table) {
                self.loaded = true;
            });

    };

    this.setup = function () {

        this.country = [];
        this.date = [];
        this.countryCase = [];
        this.countryDeath = [];

        //create array of country 
        for (var i = 2; i < this.dataCase.columns.length; i++) {

            this.country.push(this.dataCase.columns[i]);
        };


        // create array of date
        for (var i = 0; i < this.dataCase.getRowCount(); i++) {

            this.date.push(this.dataCase.getString(i, 0));

        };
        
        for(var i = 0; i < this.date.length; i++){
                
                var cases = [];
                cases.push(this.dataCase.getRow(i));
                
            
            this.countryCase.push(cases);
        };
        
        console.log(this.countryCase[0][0]);
        
        // set max value of data
 
        this.allCase = []; 
        
        for(var i = 2 ; i < this.countryCase.length ; i ++){
            for(var j = 0; j < this.date.length ; j++){
            
            this.all = this.countryCase[j][0][i];
            this.allCase.push(this.all);
            }
        };
        

        
        this.maxCase = max(this.allCase);

    };

    this.draw = function () {

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // draw x-axis

        
        
        
        


//                for(var i = 2; i < this.countryCase.length; i++)
//                {
//                    
//                    var x = this.layout.leftMargin + 3 + 6*i;
//                    var y1 = this.layout.bottomMargin;
//                    var y2 =  map( insertionSort(
//                        this.countryCase[i][0][45]), 
//                                   0,
//                                   this.maxCase - 60000,
//                                this.layout.bottomMargin,
//                                   this.layout.topMargin,
//                                   ); 
//        
//                    line(x, y1, x, y2);
//                    
//                    
//                }




    };
    
    
}

    // sorting data in decending order. 

function insertionSort(array){
    
    for(var i = 1; i < array.length ; i++){
        
        let  j = i - 1; 
        let temp = array[i]; 
        
        while(j >= 0 && array[j] > temp){
            array[j + 1] = array[j];
            j-- 
        }
        
        array[j+1] = temp
    }

    return array

}





