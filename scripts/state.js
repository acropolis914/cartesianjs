import { createStore } from 'zustand/vanilla';
import { Point, Line, Circle, Parabola } from './types.js';
import { plotPoint } from './points.js';

const localStorageKey = 'cartesian-store';


const useCartesianStore = createStore(() => ({
    svg: null,
    xScale: null,
    yScale: null,
    figures: [],  
}));

export default useCartesianStore;


export function setSvgAndScales(svg, xScale, yScale) {
    useCartesianStore.setState({ svg, xScale, yScale });
}


export function addFigure(figure) {
    const { figures } = useCartesianStore.getState();
    const updatedFigures = [...figures, figure];

    
    if (figure.type === 'point') {
        plotPoint(figure);
    }

    
    useCartesianStore.setState({ figures: updatedFigures });
    saveData();  
}


export function removeFigure(figure) {
    const { figures } = useCartesianStore.getState();
    const updatedFigures = figures.filter(fig => fig.id !== figure.id);

    
    useCartesianStore.setState({ figures: updatedFigures });
    saveData();  
}


export function removeAllFigures() {
    useCartesianStore.setState({ figures: [] });
    saveData();  
}


export function loadData() {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
        const { figures } = JSON.parse(storedData);
        const deserializedFigures = figures.map((fig) => {
            switch (fig.type) {
                case 'point':
                    plotPoint(fig);
                    return new Point(fig.x, fig.y, fig.id);
                case 'line':
                    return new Line(fig.m, fig.b, fig.id);
                case 'circle':
                    return new Circle(fig.h, fig.k, fig.radius, fig.id);
                case 'parabola':
                    return new Parabola(fig.a, fig.b, fig.c, fig.id);
                default:
                    return fig;
            }
        });

        useCartesianStore.setState({ figures: deserializedFigures });
    }
}


export function saveData() {
    const { figures } = useCartesianStore.getState();
    localStorage.setItem(localStorageKey, JSON.stringify({ figures }));
}