angular.module('geoApp', []);
angular.module('geoApp').controller('GeofenceController', GeofenceController);

GeofenceController.$inject = ['$scope'];

function GeofenceController($scope) {
    console.log("Saras");
    let div = document.getElementById('map');
    if (navigator.geolocation) {
        console.log("Inside navigator location");
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Inside get Current Position");
            var map = new google.maps.Map(div, {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                zoom: 15
            });
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: map,
                title: 'You are here!'
            });
            var all_overlays = [];
            var selectedShape;
            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.CIRCLE,
                        google.maps.drawing.OverlayType.RECTANGLE,
                    ]
                },
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 0.2,
                    strokeWeight: 3,
                    clickable: true,
                    draggable : true,
                    editable: true,
                    zIndex: 1
                },
                polygonOptions: {
                    clickable: true,
                    draggable: true,
                    editable: true,
                    fillColor: '#ffff00',
                    fillOpacity: 0.5,

                },
                rectangleOptions: {
                    clickable: true,
                    draggable: true,
                    editable: true,
                    fillColor: '#ffff00',
                    fillOpacity: 0.5,
                }
            });

            function clearSelection() {
                if (selectedShape) {
                    selectedShape.setEditable(false);
                    selectedShape = null;
                }
            }

            function setSelection(shape) {
                clearSelection();
                selectedShape = shape;
                shape.setEditable(true);
                // google.maps.event.addListener(selectedShape.getPath(), 'insert_at', getPolygonCoords(shape));
                // google.maps.event.addListener(selectedShape.getPath(), 'set_at', getPolygonCoords(shape));
            }

            function deleteSelectedShape() {
                if (selectedShape) {
                    selectedShape.setMap(null);
                }
            }

            function deleteAllShape() {
                for (var i = 0; i < all_overlays.length; i++) {
                    all_overlays[i].overlay.setMap(null);
                }
                all_overlays = [];
            }

            function CenterControl(controlDiv, map) {

                // Set CSS for the control border.
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = '#fff';
                controlUI.style.border = '2px solid #fff';
                controlUI.style.borderRadius = '3px';
                controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                controlUI.style.cursor = 'pointer';
                controlUI.style.marginBottom = '22px';
                controlUI.style.textAlign = 'center';
                controlUI.title = 'Select to delete the shape';
                controlDiv.appendChild(controlUI);

                // Set CSS for the control interior.
                var controlText = document.createElement('div');
                controlText.style.color = 'rgb(25,25,25)';
                controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
                controlText.style.fontSize = '16px';
                controlText.style.lineHeight = '38px';
                controlText.style.paddingLeft = '5px';
                controlText.style.paddingRight = '5px';
                controlText.innerHTML = 'Delete Selected Area';
                controlUI.appendChild(controlText);

                // Setup the click event listeners: simply set the map to Chicago.
                controlUI.addEventListener('click', function() {
                    deleteSelectedShape();
                });

            }
            drawingManager.setMap(map);

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {

                all_overlays.push(event);
                if (event.type !== google.maps.drawing.OverlayType.MARKER) {
                    drawingManager.setDrawingMode(null);
                    //Write code to select the newly selected object.
                    console.log("Here");
                    var newShape = event.overlay;
                    newShape.type = event.type;
                    console.log(newShape);
                    google.maps.event.addListener(newShape, 'click', function() {
                        setSelection(newShape);
                    });

                    setSelection(newShape);

                }
            });


            var centerControlDiv = document.createElement('div');
            var centerControl = new CenterControl(centerControlDiv, map);

            centerControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
        });

    }
}
