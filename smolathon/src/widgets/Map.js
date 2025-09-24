import { useEffect, useRef, useState } from 'react';
import { Feature, Map, Overlay, View } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import SVGPoint from '../static/images/point.svg';
import '../static/styles/Map.css';
import { Button } from './Button';

// let features = [
//     {
//         "longitude": 32.04371,
//         "latitude": 54.77944
//     }
// ];

function OpenLayersMap({ features, reload = () => {} }) {
    const tooltipElement = useRef(null);
    const mapRef = useRef(null);

    const initialize = () => {
        let map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM({
                        attributions: ""
                    }),
                }),
            ],

            view: new View({
                center: fromLonLat([32.04371, 54.77944]),
                zoom: 14,
                maxZoom: 14,
                minZoom: 14,
            })
        });

        let featureOverlay = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: new Style({
                image: new Icon({
                    opacity: 1,
                    src: SVGPoint,
                    scale: 1,
                })
            }),
        });

        for (var feature of features) {
            const f = new Feature({
                geometry: new Point(fromLonLat([feature.longitude, feature.latitude])),
                title: "Авария",
            });
            featureOverlay.getSource().addFeature(f);
        }

        let tooltipOverlay = new Overlay({
            element: tooltipElement.current,
            offset: [10, 0],
            positioning: 'center-left'
        });
        map.addOverlay(tooltipOverlay);

        let hoveredFeature = null;

        const handler = (e) => {
            const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);

            if (feature !== hoveredFeature) {
                tooltipOverlay.setPosition(undefined);
                tooltipElement.current.style.display = 'none';
            }

            if (feature) {
                const geomerty = feature.get("geometry");
                const coord = geomerty.getCoordinates();
                tooltipOverlay.setPosition(coord);

                const props = feature.getProperties();
                tooltipElement.current.innerHTML = `<div style="">${props.title}</div>`

                tooltipElement.current.style.display = 'block';
                tooltipElement.current.style.backgroundColor = "white";
                tooltipElement.current.style.padding = "6px";
                tooltipElement.current.style.borderRadius = "6px";
            }

            hoveredFeature = feature;
        };

        map.on('pointermove', handler);
        map.on('click', handler);

        return () => {
            map.dispose();
        };
    }

    useEffect(initialize, [features]);

    return (
        <div className='map-container'>
            <div className='tooltip' ref={tooltipElement}></div>

            <div className='map-tools'>
                <h3>Настройки отображения</h3>
                
                <br />

                <Button text="Обновить" onClick={reload} isOnBright={true} />
            </div>
            <div className="map" ref={mapRef} />
        </div>
    );
}

export default OpenLayersMap;