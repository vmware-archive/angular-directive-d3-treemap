#D3 Treemap Directive
Do you want to display a D3 treemap in an AngularJS application? We do.

## Install
npm install

## Example
If you want to convince yourself to see the directive in action, simply open **index.html**. 

If you want to find out more about the D3 treemap in general, check this [resource](https://github.com/mbostock/d3/wiki/Treemap-Layout).

### Include the source files (d3 and the directive):
    
    <script src=".../d3.js"></script>
    <script src=".../PvtlD3TreemapDirective.js"></script>

Replace the ```...``` with the correct path to the D3 as well as the directive source.

### Register the directive:

    var app = angular.module('yourAppName', ['pvtlD3Treemap']);
    
Replace ```yourAppName``` with the module name you are using.

### Use the directive in your markup:
    
    <pvtl-d3-treemap width="850" height="850" data="treemapData" value="population">
        <div>
            <p>{{propertyName}}</p>
        </div>
    </pvtl-d3-treemap>
    
This would render a **850px x 850px** treemap, with the ```treemapData``` data defined on the scope. 
The property ```population``` will be used by D3 to compute the sizes of the treemap nodes.

Make sure you specify the following directive attributes:

* **width** of treemap.
* **height** of treemap.
* **data** scope variable you want to bind to the treemap.
* **value** property that is used to compute the areas.

### Define the data in the controller:

    $scope.treemapData = {
        prop1: 'value1',
        children: [
            {
                prop1: 'value1'    
            }, 
            {
            ...
            }
        ]
    }

Not sure how the data should look like? Please find a concrete data example [here](http://bl.ocks.org/mbostock/4063582).

**Note**: The directive does not process the input data in anyway. 
It is your responsibility to pass in data that the D3 treemap can read.

### Styling:
Style the nodes of the treemap to your liking:

    .pvtlD3TreemapNode {
        background: darkseagreen;
        border: 3px solid white;
    }

##Disclaimer
The directive was tested with Angular 1.4.1 and D3 3.5.5.