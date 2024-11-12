//settings for cartesian plane
let zoomable = true
let pointerAddPointMode;

export function toggleZoom(){
    if (zoomable) {
        zoomable = false
        return
    }
    zoomable = true
}

export function getZoomable(){
    return zoomable
}


