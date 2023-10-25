
var isSmallSpinning = true;
var smallColor = '#00FA9A';
var smallStroke = 25;

var balaclavaB = new Zdog.Illustration({
    element: '.zdog-canvas-small',
    dragRotate: false,
    zoom: 2.0,

    translate: { x: 0, y: -100 },
    // centered: false,
    // stop spinning when drag starts
    onDragStart: function () {
        isSmallSpinning = false;
    },
});

// First B letter 
var letterSmallB = new Zdog.Shape({
    path: [
        { x: 660, y: 200 },
        { x: 825, y: 120 },
        { x: 675, y: 80 },
        { x: 800, y: 50 },
        { x: 730, y: 0 },
        { x: 700, y: 140 }
    ],
    closed: false,
    stroke: smallStroke,
    color: smallColor,
});

letterSmallB.copy({
    // overwrite original options
    addTo: balaclavaB,
    translate: { x: -750 },
    color: smallColor,
});

function animateSmall() {
    balaclavaB.rotate.y += isSmallSpinning ? 0.02 : 0;
    balaclavaB.updateRenderGraph();
    requestAnimationFrame(animateSmall);
}
animateSmall();