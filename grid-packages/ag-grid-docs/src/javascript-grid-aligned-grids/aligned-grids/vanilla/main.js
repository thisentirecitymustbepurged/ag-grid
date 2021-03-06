var columnDefs = [
    {field: "athlete"},
    {field: "age"},
    {field: "country"},
    {field: "year"},
    {field: "date"},
    {field: "sport"},
    // in the total col, we have a value getter, which usually means we don't need to provide a field
    // however the master/slave depends on the column id (which is derived from the field if provided) in
    // order to match up the columns
    {
        headerName: 'Medals',
        children: [
            {
                columnGroupShow: 'closed', field: "total",
                valueGetter: "data.gold + data.silver + data.bronze"
            },
            {columnGroupShow: 'open', field: "gold"},
            {columnGroupShow: 'open', field: "silver"},
            {columnGroupShow: 'open', field: "bronze"}
        ]
    }
];

// this is the grid options for the top grid
var gridOptionsTop = {
    defaultColDef: {
        editable: true,
        sortable: true,
        resizable: true,
        filter: true,
        flex: 1,
        minWidth: 100
    },
    columnDefs: columnDefs,
    rowData: null,
    debug: true,
    alignedGrids: []
};

// this is the grid options for the bottom grid
var gridOptionsBottom = {
    defaultColDef: {
        editable: true,
        sortable: true,
        resizable: true,
        filter: true,
        flex: 1,
        minWidth: 100
    },
    columnDefs: columnDefs,
    rowData: null,
    debug: true,
    alignedGrids: []
};

gridOptionsTop.alignedGrids.push(gridOptionsBottom);
gridOptionsBottom.alignedGrids.push(gridOptionsTop);

function onCbAthlete(value) {
    // we only need to update one grid, as the other is a slave
    gridOptionsTop.columnApi.setColumnVisible('athlete', value);
}

function onCbAge(value) {
    // we only need to update one grid, as the other is a slave
    gridOptionsTop.columnApi.setColumnVisible('age', value);
}

function onCbCountry(value) {
    // we only need to update one grid, as the other is a slave
    gridOptionsTop.columnApi.setColumnVisible('country', value);
}

function setData(rowData) {
    gridOptionsTop.api.setRowData(rowData);
    gridOptionsBottom.api.setRowData(rowData);
    gridOptionsTop.api.sizeColumnsToFit();
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDivTop = document.querySelector('#myGridTop');
    new agGrid.Grid(gridDivTop, gridOptionsTop);

    var gridDivBottom = document.querySelector('#myGridBottom');
    new agGrid.Grid(gridDivBottom, gridOptionsBottom);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            setData(httpResult);
        }
    };
});
