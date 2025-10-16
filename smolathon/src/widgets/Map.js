import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Feature, Map, Overlay, View } from 'ol';
import { LineString, Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Button } from './Button';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { GeoJSON } from 'ol/format'
import MultiRangeSlider from "multi-range-slider-react";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import SVGPoint from '../static/images/point.svg';
import Stroke from 'ol/style/Stroke';
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
                <h3 style={{ margin: 0 }}>Настройки отображения</h3>

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

// needed for clusters visualization
function _isSubSeqence(sub = [], seq = []) {
    for (let i = 0; i < seq.length - sub.length + 1; i++) {
        let slice = seq.slice(i, i + sub.length);
        if (slice.every(function (value, index) { return value === sub[index] })) {
            return true;
        }
    }
    return false;
}

function isSubSeqence(sub = [], seq = []) {
    return _isSubSeqence(sub, seq) || _isSubSeqence(sub.toReversed(), seq);
}

async function getRoute(lat1, lon1, lat2, lon2, color, map) {
    const i = localStorage.getItem(`${lat1}${lon1}|${lat2}${lon2}`);
    let data;

    if (i === null) {
        const href = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
        data = await (await fetch(href)).json();
        localStorage.setItem(`${lat1}${lon1}|${lat2}${lon2}`, JSON.stringify(data));
    } else {
        data = JSON.parse(i);
    }

    if (data.code === "Ok") {
        const routeGeometry = data.routes[0].geometry;
        const source = new VectorSource({
            features: (new GeoJSON()).readFeatures({ type: "Feature", geometry: routeGeometry }, {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857"
            }),
        });
        const layer = new VectorLayer({
            // map: map,
            source: source,
            style:
                new Style({
                    image: new Icon({
                        opacity: 0.5,
                        src: SVGPoint,
                        scale: 0.4,
                    }),
                    stroke: new Stroke({
                        color: color,
                        width: "10"
                    })
                },)
        });

        console.log("Added!");

        map.addLayer(layer);
    }
}

// Map based on OpenLayers framework
export function OpenLayersMapClusters({ graph, coords, most_used, groups, reload = () => { } }) {
    const [coordinates, setCoordinates] = useState([32.04371, 54.77944]);
    const [isInGroupsMode, setIsInGroupsMode] = useState(false);
    const [sliderVal, setSliderVal] = useState(5);
    const mapRef = useRef(null);


    const initialize = () => {
        if (graph == undefined || coords == undefined || most_used == undefined) return;

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
                minZoom: 12,
            })
        });

        let featureOverlay = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: (feature) => {
                return new Style({
                    image: new Icon({
                        opacity: 0.5,
                        src: SVGPoint,
                        scale: 0.4,
                    }),
                    stroke: new Stroke({
                        color: feature.get("color"),
                        width: "2"
                    })
                })
            },
        });

        let maxMostSLength = -1;
        let maxGroupLength = -1;
        for (const mu of most_used.slice(0, sliderVal)) {
            maxMostSLength = Math.max(maxMostSLength, mu[0].length);
        }
        for (const gr of Object.values(groups)) {
            maxGroupLength = Math.max(maxGroupLength, gr.length);
        }
        
        featureOverlay.getSource().clear()
        for (const from_ of Object.keys(graph)) {
            for (const to of graph[from_]) {
                const [t_lat, t_lon] = coords[to];
                const [f_lat, f_lon] = coords[from_];

                featureOverlay.getSource().addFeature(
                    new Feature(
                        {
                            geometry: new Point(fromLonLat([f_lon, f_lat]))
                        }
                    )
                )

                // const line = new LineString([
                //     fromLonLat([f_lon, f_lat]),
                //     fromLonLat([t_lon, t_lat]),
                // ]);

                // const feature = new Feature(
                //     {
                //         geometry: line,
                //     }
                // );

                let l = 0;

                if (isInGroupsMode) {
                    let ml = 0;
                    for (const gr of Object.values(groups)) {
                        if (isSubSeqence([from_, to], gr)) {
                            ml = Math.max(gr.length, ml);
                            break;
                        }
                    }
                    l = ml;
                } else {
                    for (const mu of most_used.slice(0, sliderVal)) {
                        if (isSubSeqence([from_, to], mu[0])) {
                            l = mu[0].length;
                            break;
                        }
                    }
                }

                const loadValue = Math.floor(l / (isInGroupsMode ? maxGroupLength : maxMostSLength) * 255);
                let color = "";

                if (isInGroupsMode) {
                    color = `rgb(${loadValue}, 0, ${loadValue})`;
                } else {
                    color = `rgb(${loadValue}, ${255 - loadValue}, 120)`;
                }

                getRoute(f_lat, f_lon, t_lat, t_lon, color, map);
                // featureOverlay.getSource().addFeature(feature);
            }
        }

        map.on('pointerdrag', (e) => {
            setCoordinates(toLonLat(map.getView().getCenter()));
        });

        return () => {
            map.dispose();
        };
    }

    useEffect(initialize, [graph, isInGroupsMode, sliderVal]);

    return (
        <div className='map-container'>
            {/* <div className='tooltip' ref={tooltipElement}></div> */}

            <div className='map-tools'>
                <h3 style={{ margin: 0 }}>Настройки отображения</h3>

                <div style={{
                    width: "100%",
                    height: "20px",
                    borderRadius: "5px",
                    background: "linear-gradient(90deg, rgb(0, 255, 120), rgb(100, 200, 120), rgb(200, 100, 120) , rgb(255, 0, 120))"
                }} />
                <div style={{
                    marginBottom: "10px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <p style={{ margin: 0 }}>Свободно</p>
                    <p>Загружено</p>
                </div>

                <h3 style={{ margin: 0 }}>Настройки отображения</h3>

                {/* <FormControl className="form">
                    {
                        // Object.keys(features).map((v) =>
                        //     <FormControlLabel label={v} control={<Checkbox defaultChecked color="custom" style={{ color: "#62A744" }} />} onChange={() => {
                        //         let newFilter = { ...filter };
                        //         newFilter[v] = filter[v] == null ? false : !filter[v];
                        //         setFilter(newFilter);
                        //     }} />
                        // )
                    }

                    <br />
                </FormControl> */}

                <FormLabel style={{ margin: 0 }}>Режим работы</FormLabel>
                <RadioGroup defaultValue="load" onChange={(v) => setIsInGroupsMode(v.target.value !== "load")}>
                    <FormControlLabel control={<Radio />} label="Группы" value="groups" />
                    <FormControlLabel control={<Radio />} label="Загруженность" value="load" />
                    {/* 
                    <MultiRangeSlider style={{ boxShadow: "none" }} step={1}
                        min={0} max={30} minValue={minValue} maxValue={maxValue} onChange={(e) => {
                            setMinValue(e.minValue);
                            setMaxValue(e.maxValue);
                        }} onInput={(e) => {
                            setMinValue(e.minValue);
                            setMaxValue(e.maxValue);
                        }}></MultiRangeSlider> */}
                </RadioGroup>

                <FormLabel style={{ margin: 0 }}>Количество кластеров</FormLabel>
                <Slider min={1} max={30} step={1} shiftStep={1} defaultValue={5} valueLabelDisplay='auto' onChange={(e) => setSliderVal(e.target.value)}></Slider>

                <Button text="Обновить" onClick={reload} isOnBright={true} />
            </div>
            <div className="map" ref={mapRef} />
        </div>
    );
}

export default OpenLayersMap;