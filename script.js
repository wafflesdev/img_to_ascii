document.addEventListener("DOMContentLoaded", function() {
  const ASCII_CHARS = "@%#*+=-:. ";
  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const fileInput = document.getElementById("fileInput");
  const widthInput = document.getElementById("widthInput");
  const asciiDiv = document.getElementById("ascii");
  const imagePreview = document.getElementById("imagePreview");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const brightnessValue = document.getElementById("brightnessValue");

  let currentImage = null;

  fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      imagePreview.src = event.target.result;
      currentImage = new Image();
      currentImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });


  generateBtn.addEventListener("click", function() {
    if (!currentImage) {
      alert("please select an image first!");
      return;
    }

    const width = parseInt(widthInput.value) || 100;

    currentImage.onload = function() {
      const canvas = document.createElement("canvas");
      const aspectRatio = currentImage.height / currentImage.width;
      const newHeight = Math.floor(width * aspectRatio * 0.55);

      canvas.width = width;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(currentImage, 0, 0, width, newHeight);

      const imageData = ctx.getImageData(0, 0, width, newHeight);
      let asciiStr = "";

      for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const r = imageData.data[index];
          const g = imageData.data[index + 1];
          const b = imageData.data[index + 2];
          const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const charIndex = Math.floor(brightness / 255 * (ASCII_CHARS.length - 1));
          asciiStr += ASCII_CHARS[ASCII_CHARS.length - 1 - charIndex];
        }
        asciiStr += "\n";
      }

      asciiDiv.textContent = asciiStr;
    };

    if (currentImage.complete) currentImage.onload();
  });

  clearBtn.addEventListener("click", function() {
    fileInput.value = "";
    widthInput.value = 100;
    imagePreview.src = "";
    asciiDiv.textContent = "";
    currentImage = null;
  });

  brightnessSlider.addEventListener("input", function() {
    const brightness = parseInt(brightnessSlider.value);
    brightnessValue.textContent = brightness;
    imagePreview.style.filter = `brightness(${brightness}%)`;
  });
});
