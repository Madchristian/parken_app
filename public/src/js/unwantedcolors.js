import { scanLicensePlate } from "./licensePlateScanner.js";


function isUnwantedColor(color, unwantedColors) {
    return unwantedColors.some((unwantedColor) => {
        return color.every((channel, index) => channel !== unwantedColor[index]);
    });
}


export function getBlueBarBounds(image) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let top = Infinity;
    let bottom = 0;
    let left = Infinity;
    let right = 0;

    for (let i = 0; i < pixels.length; i += 4) {
        const color = [pixels[i], pixels[i + 1], pixels[i + 2]];
        if (!isUnwantedColor(color, unwantedColors)) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor(i / 4 / canvas.width);
            if (color[2] > color[0] && color[2] > color[1]) {
                if (y < top) {
                    top = y;
                }
                if (y > bottom) {
                    bottom = y;
                }
                if (x < left) {
                    left = x;
                }
                if (x > right) {
                    right = x;
                }
            }
        }
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
}
