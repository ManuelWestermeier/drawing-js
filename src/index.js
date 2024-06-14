import "./index.css"

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

var offsetX = 0
var offsetY = 0

var cursorX = 0
var cursorY = 0

var drawCursorSize = 8
var deleteCursorSize = drawCursorSize * 4

var globalScale = 1

const scale = num => num * globalScale
const getPosX = (x) => scale(x + offsetX)
const getPosY = (y) => scale(y + offsetY)

const rect = (x, y, w, h, method = "fillRect") =>
    ctx[method](getPosX(x), getPosY(y), scale(w), scale(h))


var points = JSON.parse(
    localStorage.getItem("data-drawing") || "[]"
)

function drawCursor() {
    rect(cursorX - drawCursorSize / 2, cursorY - drawCursorSize / 2, drawCursorSize, drawCursorSize, "strokeRect")
    rect(cursorX - deleteCursorSize / 2, cursorY - deleteCursorSize / 2, deleteCursorSize, deleteCursorSize, "strokeRect")
}

function Update() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawCursor()

    grid(12, 12, 2)

    points.forEach((p) => rect(p.offsetX - drawCursorSize / 2, p.offsetY - drawCursorSize / 2, drawCursorSize, drawCursorSize))

    localStorage.setItem("data-drawing", JSON.stringify(points))

    requestAnimationFrame(Update);
}

function grid(w, h, b) {
    const partWidth = canvas.width / w
    const partHeight = canvas.height / h

    for (let index = 0; index < w + 1; index++) {
        const posX = partWidth * index
        rect(posX, 0, b, canvas.height)
    }

    for (let index = 0; index < h + 1; index++) {
        const posY = partHeight * index
        rect(0, posY, canvas.width, b)
    }
}


Update();

canvas.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

canvas.onwheel = e => {
    e.preventDefault();
    if (e.ctrlKey) {
        const additionalScale = (e.deltaX + e.deltaY) / -200
        globalScale += additionalScale;
        // offsetX -= canvas.width * additionalScale / 2
        // offsetY -= canvas.height * additionalScale / 2
        return
    }
    offsetX -= e.deltaX;
    offsetY -= e.deltaY;
}

canvas.onmousemove = e => {
    cursorX = (e.offsetX - scale(offsetX)) / globalScale
    cursorY = (e.offsetY - scale(offsetY)) / globalScale

    if (e.buttons != 1 && !e.altKey) return

    if (e.altKey) {

        points = points.filter(p =>
            !((p.offsetX > cursorX - deleteCursorSize / 2 && p.offsetX < cursorX + deleteCursorSize / 2) &&
                (p.offsetY > cursorY - deleteCursorSize / 2 && p.offsetY < cursorY + deleteCursorSize / 2))
        )
        return
    }

    points.push({
        offsetX: cursorX,
        offsetY: cursorY
    });
}

canvas.onresize()