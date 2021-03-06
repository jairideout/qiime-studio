import actions from './';
import { fetchAPI } from '../util/auth';

export const newArtifact = (artifact) => ({
    type: 'NEW_ARTIFACT',
    artifact
});

export const newVisualization = (visualization) => ({
    type: 'NEW_VISUALIZATION',
    visualization
});

export const removedArtifact = (uuid) => ({
    type: 'DELETE_ARTIFACT',
    uuid
});

export const removedVisualization = (uuid) => ({
    type: 'DELETE_VISUALIZATION',
    uuid
});

export const clearArtifacts = () => ({
    type: 'CLEAR_ARTIFACTS'
});

export const deleteArtifact = (uuid) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/artifacts/${uuid}`;
        fetchAPI(secretKey, 'DELETE', url)
        .then(() => dispatch(removedArtifact(uuid)))
        .then(() => dispatch(actions.refreshValidation()));
    };
};

export const deleteVisualization = (uuid) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/visualizations/${uuid}`;
        fetchAPI(secretKey, 'DELETE', url)
        .then(() => {
            dispatch(removedVisualization(uuid));
        });
    };
};

export const refreshArtifacts = () => {
    return (dispatch, getState) => {
        dispatch(clearArtifacts());
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/artifacts`;
        const method = 'GET';
        fetchAPI(secretKey, method, url)
        .then((json) => {
            json.artifacts.forEach(artifact => dispatch(newArtifact(artifact)));
        })
        .then(() => dispatch(actions.checkTypes()));
    };
};

export const refreshVisualizations = () => {
    return (dispatch, getState) => {
        dispatch(clearArtifacts());
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/visualizations`;
        const method = 'GET';
        fetchAPI(secretKey, method, url)
        .then((json) => {
            json.visualizations.forEach(viz => dispatch(newVisualization(viz)));
        });
    };
};
