import { useEffect, useRef, useState } from 'react';
import { Feature, Map, Overlay, View } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Button } from './Button';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import SVGPoint from '../static/images/point.svg';
import '../static/styles/Map.css';

// Map based on OpenLayers framework
function OpenLayersMap({ features, reload = () => { } }) {
    const [coordinates, setCoordinates] = useState([32.04371, 54.77944]);
    const [filter, setFilter] = useState({});
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
                center: fromLonLat(coordinates),
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

        featureOverlay.getSource().clear()
        for (const key of Object.keys(features)) {
            if (filter[key] != null && !filter[key]) continue;

            for (var feature of features[key]) {
                const f = new Feature({
                    geometry: new Point(fromLonLat([feature.longitude, feature.latitude])),
                    title: key,
                });
                featureOverlay.getSource().addFeature(f);
            }
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
        map.on('pointerdrag', (e) => {
            setCoordinates(toLonLat(map.getView().getCenter()));
        });

        return () => {
            map.dispose();
        };
    }

    useEffect(initialize, [features, filter]);

    return (
        <div className='map-container'>
            <div className='tooltip' ref={tooltipElement}></div>

            <div className='map-tools'>
                <h3 style={{margin: 0}}>Настройки отображения</h3>

                <FormControl className="form">
                    {
                        Object.keys(features).map((v) =>
                            <FormControlLabel label={v} control={<Checkbox defaultChecked color="custom" style={{ color: "#62A744" }} />} onChange={() => {
                                let newFilter = { ...filter };
                                newFilter[v] = filter[v] == null ? false : !filter[v];
                                setFilter(newFilter);
                            }} />
                        )
                    }

                    <br />
                </FormControl>

                <Button text="Обновить" onClick={reload} isOnBright={true} />
            </div>
            <div className="map" ref={mapRef} />
        </div>
    );
}

export default OpenLayersMap;