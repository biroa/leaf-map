$ (function () {
    var color;
    var points;
    var mapBoxTiles = L.tileLayer ('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });

    var map = L.map ('map')
        .addLayer (mapBoxTiles)
        .setView ([ 42.444508, -76.499491 ], 12);

    /**
     * Random color for the Json popUp text
     * @returns {string} color
     */
    function getRandomColor() {
        var varters = '0123456789ABCDEF';
        var color = '#';
        for ( var i = 0; i < 6; i++ ) {
            color += varters[ Math.floor (Math.random () * 16) ];
        }
        return color;
    }


    var colorSelection = $ ("#colorInput");

    /**
     * @param color
     * @returns {*}
     * @description Custom and default marker template
     * https://github.com/lvoogdt/Leafvar.awesome-markers
     */
    var setStyleMarker = function ( color ) {
        var prefix = 'fa';
        var icon = 'code';
        var markerColor = (color) ? color : 'purple';
        return L.AwesomeMarkers.icon ({
            prefix: prefix, icon: icon, markerColor: markerColor
        });
    };
    // Default Marker Color init
    var defaultMarker = setStyleMarker ('orange');

    /**
     * @param {object} leafvarEvent
     * @param color
     * @description Custom Marker Color Based on input selection
     */
    function onMarkerClick( leafvarEvent, color ) {
        var layer = leafvarEvent.target;
        layer.setIcon (setStyleMarker (color));
    }


    /**
     * Load the data place it on the map
     * @param {object} data (json)
     */
    function loadToMap( data ) {
        points = L.geoJson (data, {
            style: function ( feature ) {
                return {
                    weight: 2, opacity: 1, 'marker-color': feature.properties[ "marker-color" ]
                }
            }, pointToLayer: function ( feature, latlng ) {
                return L.marker (latlng, {
                    icon: defaultMarker
                }).on ('click', function ( ev ) {
                    console.log (ev);
                    if ( feature.properties[ "text-color" ] ){
                        this.bindPopup ('<p style="color:' + feature.properties[ "text-color" ] + '">' + feature.properties.Name + '</p>').openPopup ();
                    } else {
                        this.bindPopup ('<p style="color:' + getRandomColor () + ' ">' + feature.properties.Name + '</p>').openPopup ();
                    }
                    onMarkerClick (ev, color);

                })
            }
        })
            .addTo (map);

    }

    function handleFileSelect( evt ) {
        var f, files = evt.target.files; // FileList object
        f = files[ 0 ];

        var reader = new FileReader ();
        // Closure to capture the file information.
        reader.onload = (function () {
            return function ( e ) {
                //console.log ('e readAsText = ', e);
                //console.log ('e readAsText target = ', e.target);
                try {
                    var json = JSON.parse (e.target.result);
                    loadToMap (json);
                    $ ('#list').html (JSON.stringify (json, null, '\t'));
                } catch ( exception ) {
                    console.error (exception)
                }
            }
        }) (f);
        reader.readAsText (evt.target.files[ 0 ]);


    }

    // Clode modal on file selection and proceed with json handling
    $ ("input:file").change (function ( evt ) {
        handleFileSelect (evt);
        $ ('#fileUploadModal').modal ('toggle');
    });

    // Selecting a color element from the list
    colorSelection.change (function ( event ) {
        color = $ (this).val ();
    });

});
