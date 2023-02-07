// 将图片转成base64
function getBase64(image) {
  let canvas = document.getElementById("canvas");
  canvas.height= image.height;
  canvas.width = image.width;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  let ImageData = ctx.getImageData(0, 0, image.width, image.height)

  let ext = image.src.substring(image.src.lastIndexOf('.')+1).toLowerCase();
  let dataUrl = canvas.toDataURL('image/'+ext);
  return dataUrl;    
}


let image = new Image();
image.crossOrigin = 'anonymous';
image.src = './sunflower.png'
image.onload = function () {
    // let base64 = getBase64(image);
    // console.log('base64', base64);

    let myCanvas = document.querySelector("#canvas");
    myCanvas.width = 400;
    myCanvas.height = 300;
    let myContext = myCanvas.getContext("2d");
    // 将图片绘制到画布中
    myContext.drawImage(image, 0, 0, myCanvas.width, myCanvas.height);
    // 获取画布的像素数据
    let imageData = myContext.getImageData(0, 0, myCanvas.width, myCanvas.height);
    // 处理像素数据
    imageData = comicStripFilter(imageData, myContext);
    // 将处理过的像素数据放回画布
    myContext.putImageData(imageData, 0, 0);
}

// 红色滤镜 【绿色滤镜，蓝色滤镜类似】
function redFilter (imageData, ctx) {
    let imageData_length = imageData.data.length / 4; // 4个为一个像素
    for (let i = 0; i < imageData_length; i++) {
        imageData.data[i * 4 + 1] = 0; // 绿色值设置为0
        imageData.data[i * 4 + 2] = 0; // 蓝色值设置为0
    }
    return imageData;
}

// 颜色的RGB设置为相同的值即可使得图片为灰色，我们可以取三个色值的平均值
function grayFilter (imageData, ctx) {
  let imageData_length = imageData.data.length / 4; // 4个为一个像素
  for (let i = 0; i < imageData_length; i++) {
      let newColor = (imageData.data[i * 4] + imageData.data[i * 4 + 1] + imageData.data[i * 4 + 2]) / 3;
      imageData.data[i * 4 + 0] = newColor;
      imageData.data[i * 4 + 1] = newColor;
      imageData.data[i * 4 + 2] = newColor;
  }
  return imageData;
}

// 反向滤镜 就是RGB三种颜色分别取255的差值。
function invertFilter (imageData, ctx) {
    let imageData_length = imageData.data.length / 4; // 4个为一个像素
    for (let i = 0; i < imageData_length; i++) {
        imageData.data[i * 4 + 0] = 255 - imageData.data[i * 4];
        imageData.data[i * 4 + 1] =  255 - imageData.data[i * 4 + 1];
        imageData.data[i * 4 + 2] =  255 - imageData.data[i * 4 + 2];
    }
    return imageData;
}


function filter(imageData) {
  let imageData_length = imageData.data.length / 4; 
  for(let i = 0; i < imageData_length; i++) {
    let avg = Math.floor(
      (Math.min(imageData.data[i * 4 + 0], imageData.data[i * 4 + 1], imageData.data[i * 4 + 2]) + 
        Math.max(imageData.data[i * 4 + 0], imageData.data[i * 4 + 1], imageData.data[i * 4 + 2])) / 2 );
     imageData.data[i * 4 + 0] = avg;
     imageData.data[i * 4 + 1] = avg;
     imageData.data[i * 4 + 2] = avg;
 }
 return imageData;
}

// 怀旧滤镜
function nostalgiaFilter(imageData) {
  let imageData_length = imageData.data.length / 4; 
  for(let i = 0; i < imageData_length; i++) {
    let r = imageData.data[i*4];
    let g = imageData.data[i*4+1];
    let b = imageData.data[i*4+2];
  
    let newR = (0.393 * r + 0.769 * g + 0.189 * b);
    let newG = (0.349 * r + 0.686 * g + 0.168 * b);
    let newB = (0.272 * r + 0.534 * g + 0.131 * b);
    let rgbArr = [newR, newG, newB].map((e) => {
        return e < 0 ? 0 : e > 255 ? 255 : e;
    });
    [imageData.data[i*4], imageData.data[i*4+1], imageData.data[i*4+2]] = rgbArr;
  }
 
  return imageData;
}

// 连环画滤镜
function comicStripFilter(imageData) {
  let imageData_length = imageData.data.length / 4; 
  for(let i = 0; i < imageData_length; i++) {
    let r = imageData.data[i*4];
    let g = imageData.data[i*4+1];
    let b = imageData.data[i*4+2];

    let newR = Math.abs(g - b + g + r) * r / 256;
    let newG = Math.abs(b -g + b + r) * r / 256;
    let newB =  Math.abs(b -g + b + r) * g / 256;
    let rgbArr = [newR, newG, newB];
    [imageData.data[i*4], imageData.data[i*4+1], imageData.data[i*4+2]] = rgbArr;
  }

  return imageData;
}



