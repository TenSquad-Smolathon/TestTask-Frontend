import { OpenLayersMapClusters } from '../../widgets/Map';

export const ClusterVizualizer = ({ data }) => {
    const { coords, most_used, graph, groups } = data;

    return (
        <div>
            <OpenLayersMapClusters graph={graph} coords={coords} most_used={most_used} groups={groups} />
        </div>
    )
}