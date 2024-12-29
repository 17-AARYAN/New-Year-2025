// Access DOM elements
const captureBtn = document.getElementById('capture-btn');
const cameraInterface = document.getElementById('camera-interface');
const camera = document.getElementById('camera');
const snapBtn = document.getElementById('snap-btn');
const snapshot = document.getElementById('snapshot');
const context = snapshot.getContext('2d');

// Reference image for matching
const referenceImage = new Image();
referenceImage.src = './assets/preeti.jpg';

// Open the camera interface
captureBtn.addEventListener('click', () => {
    cameraInterface.classList.remove('hidden');
    startCamera();
});

// Start the camera
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    camera.srcObject = stream;
}

// Capture photo and compare
snapBtn.addEventListener('click', async () => {
    snapshot.width = camera.videoWidth;
    snapshot.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);

    const capturedImageData = snapshot.toDataURL();
    const matches = await compareImages(referenceImage, capturedImageData);

    if (matches) {
        alert("Happy NEW YEAR 2025");
    } else {
        alert("Face not recognized. Try again!");
    }

    cameraInterface.classList.add('hidden');
});

// Dummy comparison function (replace with a better algorithm for production)
async function compareImages(refImg, capImg) {
    return new Promise((resolve) => {
        const refCanvas = document.createElement('canvas');
        const refCtx = refCanvas.getContext('2d');
        refCanvas.width = refImg.width;
        refCanvas.height = refImg.height;
        refCtx.drawImage(refImg, 0, 0);

        const refData = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
        const capCtx = snapshot.getContext('2d');
        const capData = capCtx.getImageData(0, 0, snapshot.width, snapshot.height);

        // Compare pixel-by-pixel (basic comparison for simplicity)
        resolve(refData.data.toString() === capData.data.toString());
    });
}
