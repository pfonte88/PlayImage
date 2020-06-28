let canvas;
let button;
let button1;
let back;
let inputF;
let img;
let legen;

let checkEvent = false;

let sound = new p5.SoundFile();
let sound1 = new p5.SoundFile();
let fftSize = 4 * 1024; // ver como fazer. ter em conta que os pixeis vão apenas de 0 a 255
let sampleRate = 44100; // nao verifiquei isto, e assumido!
let repeatSegment = 1;

let iScale = 1; //fator de diminuição de resolução

let d = 5;

let lastDragged = 0;
let dragDelta = 50;

let ramp = [];

let allOscs = [];
let oscCount = 9;

let env;
let t1 = 0.001; // attack time in seconds
let l1 = 0.05; // attack level 0.0 to 1.0
let t2 = 1; // decay time in seconds
let l2 = 0.0; // decay level  0.0 to 1.0
let radio;
let radioGlobal;
let radio1;
let frequen;
let inp;
let inp2;
let fmin;
let fmax;

let para1;
let para2;
let para3;

let aKey = 0;
let sKey = 0;
let dKey = 0;
let fKey = 0;

let keyCounter = 0;
let alertCounter = 0;

let texts1;
let texts2;
let texts3;
let texts4;
let texts5;
let texts6;
let texts7;
let texts8;
let texts9;
let texts10;
let texts11;

function setup() {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
  } else {
    alert('This website will not work properly in this browser. Please use Chrome');
  }
  canvas = createCanvas(int(windowWidth * 3 / 5), int((windowWidth * 3 / 5) * 9 / 16));
  canvas.position(450, 100);

  pixelDensity(1);

  back = select('#Text');
  back.position(50, 10);
  back.mouseOver(Show);
  back.mouseOut(Hide);

  background(120);
  legen = createP('Select Image');
  legen.position(10, 350);
  inputF = createFileInput(handleFile);
  inputF.position(10, 400);
  inputF.changed(reDraw);
  inputF.style('font-family', 'Roboto Mono');
  //inputF.hide();

  for (let i = 0; i < 100; i++) {
    ramp.push(i * 0.01);
  }

  for (let i = 0; i < oscCount; i++) {
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(0);
    // scale amplitude to number of oscillators
    osc.amp(0.3 / oscCount);
    osc.start();
    allOscs.push(osc);
    env = new p5.Envelope(t1, l1, t2, l2);
  }

  radio = createRadio();
  radio.option('Red  ', 1);
  radio.option('Green', 2);
  radio.option('Blue ', 3);
  radio.option('Gray ', 4);
  radio.changed(reDraw);
  radio.style('width', '69px');
  radio.position(10, 150);

  radio1 = createRadio();
  radio1.option('Red  ', 1);
  radio1.option('Green', 2);
  radio1.option('Blue ', 3);
  radio1.option('Gray ', 4);
  radio1.changed(reDraw);
  radio1.style('width', '69px');
  radio1.position(137, 150);

  radioGlobal = createRadio();
  radioGlobal.option('Spectrogram', 1);
  radioGlobal.option('Freqency', 2);
  radioGlobal.option('No Filter (No Sound)', 3);
  radioGlobal.changed(reDraw);
  radioGlobal.position(10, 115);

  para1 = createP('Frequency Range (20Hz-5000Hz)');
  para1.position(137, 230);
  para2 = createP('Min. Freqency');
  para2.position(137, 260);
  inp = createInput('', 'number');
  inp.position(137, 300);
  para3 = createP('Max Frequency');
  para3.position(137, 310);
  inp2 = createInput('', 'number');
  inp2.position(137, 350);

  button = createButton('?');
  button.style('font-family', 'Roboto Mono');
  button.position(10, 440);
  button.mousePressed(inst);

  texts1 = createP('D').hide();
  texts1.style('font-family', 'Roboto Mono');
  texts9 = createP('o').hide();
  texts9.style('font-family', 'Roboto Mono');
  texts10 = createP('u').hide();
  texts10.style('font-family', 'Roboto Mono');
  texts2 = createP('b').hide();
  texts2.style('font-family', 'Roboto Mono');
  texts3 = createP('l').hide();
  texts3.style('font-family', 'Roboto Mono');
  texts11 = createP('e').hide();
  texts11.style('font-family', 'Roboto Mono');
  texts4 = createP('C').hide();
  texts4.style('font-family', 'Roboto Mono');
  texts5 = createP('l').hide();
  texts5.style('font-family', 'Roboto Mono');
  texts6 = createP('i').hide();
  texts6.style('font-family', 'Roboto Mono');
  texts7 = createP('c').hide();
  texts7.style('font-family', 'Roboto Mono');
  texts8 = createP('k').hide();
  texts8.style('font-family', 'Roboto Mono');
}

function mousePressed() {
  userStartAudio();
}

function draw() {
  //background(120);

  if (img) {
    if (img.width > img.height * 16 / 9) {
      img.resize(width, 0);
    } else {
      img.resize(0, height);
    }
    background(120);
    imageMode(CENTER);
    let val = radio.value();
    let valT = radioGlobal.value();
    let valF = radio1.value();

    if (valT) {
      image(img, width / 2, height / 2);
      if (valT == 1) {
        if (val) {
          if (val == 1) {
            tint(255, 0, 0, 255);
            image(img, width / 2, height / 2);
          } else if (val == 2) {
            tint(0, 255, 0, 255);
            image(img, width / 2, height / 2);
          } else if (val == 3) {
            tint(0, 0, 255, 255);
            image(img, width / 2, height / 2);
          } else if (val == 4) {
            noTint();
            image(img, width / 2, height / 2);
            filter(GRAY);
          }
        }

      } else if (valT == 2) {
        if (valF) {
          if (valF == 1) {
            tint(255, 0, 0, 255);
            image(img, width / 2, height / 2);
          } else if (valF == 2) {
            tint(0, 255, 0, 255);
            image(img, width / 2, height / 2);
          } else if (valF == 3) {
            tint(0, 0, 255, 255);
            image(img, width / 2, height / 2);
          } else if (valF == 4) {
            noTint();
            image(img, width / 2, height / 2);
            filter(GRAY);
          }
        }

      } else if (valT == 3) {
        noTint();
        image(img, width / 2, height / 2);
      }

    } else {
      image(img, width / 2, height / 2);
    }

    if (checkEvent && valT == 1) {
      if (mouseIsPressed && millis() > lastDragged + dragDelta) {
        if (mouseY > (height - img.height) / 2 && mouseY < height - (height - img.height) / 2 && mouseX > (width - img.width) / 2 && mouseX < width - (width - img.width) / 2) {
          mouseFreezed();
          noLoop();
          sound1.setLoop(true);
        }
      }
    }
  }
}

function mouseDragged() {

  if (mouseY > (height - img.height) / 2 && mouseY < height - (height - img.height) / 2 && mouseX > (width - img.width) / 2 && mouseX < width - (width - img.width) / 2) {
    sound1.setLoop(false);
    let val = radio.value();
    let valT = radioGlobal.value();
    let valF = radio1.value();

    //Spectrogram
    if (valT == 1) {
      if (val) {

        let a = []; //array com todos os pixeis verdes neste caso
        let a2d = []; //matriz com a divisão dos elementos de 'a' por linhas
        let a2dt = [];

        let real = new Float32Array(fftSize);
        let buffer = new Float32Array(fftSize);
        let buffers = new Float64Array(fftSize * 2 * d);

        //tratamento dos pixeis da imagem
        img.loadPixels();
        loadPixels(); //faz load da array com info de todos os pixeis

        //percorrer todos pixeis da imagem, tendo em conta que por cada pixel existem 4 elementos RGBA
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            let index = (x + y * img.width) * 4;
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let colorAverage = (r + g + b) / 3;

            if (val == 1) {
              a[index / 4] = r;
            } else if (val == 2) {
              a[index / 4] = g;
            } else if (val == 3) {
              a[index / 4] = b;
            } else if (val == 4) {
              a[index / 4] = colorAverage;
            }
          }
        }

        //subdivisão da array em matriz por linhas(trocar 19 por img.width?)
        for (let i = 0; i < a.length; i += img.width) {
          // indicar cada elemento da array como uma array ficando assim com 2d array ou seja matrix  (trocar 19 por img.width?)
          a2d[i / img.width] = a.slice(i, i + img.width);
        }

        //cria matriz transposta, array de colunas, usando a libraria math.js
        a2dt = math.transpose(a2d);

        //percorrer as colunas que existem na matriz dos pixeis verdes 'a2dt'
        //indo coluna a coluna (elemento de 'a2dt')
        for (j = 0; j < 2 * d; j++) {
          //  em cada coluna j percorre a coluna toda
          for (let i = (mouseY - int((height - img.height) / 2)) - d; i < (mouseY - int((height - img.height) / 2)) + d; i++) {
            let pos = int(map(i, 0, img.height, 100, 1)); // o bin não está relacionado com a posição do rato mas sim com a posição em cada coluna
            real[pos] = (a2dt[((mouseX - int((width - img.width) / 2)))][i]) / 255; //  uso o valor de cada elemento para dar diferentes intesidades a cada bin
            real[real.length - pos] = (a2dt[((mouseX - int((width - img.width) / 2)))][i]) / 255;
          }

          let imag = new Float32Array(fftSize);
          let fft = new FFT(fftSize, sampleRate);
          buffer = fft.inverse(real, imag);

          // normalize
          let max = 0.0;
          for (let i = 0; i < buffer.length; i++) {
            if (abs(buffer[i]) > max) {
              max = abs(buffer[i]);
            }
          }

          for (let i = 0; i < buffer.length; i++) {
            buffer[i] = buffer[i] / max;
          }

          // por cada coluna (elemento j de 'a2dt') o buffer criado é copiado para um buffer maior no sítio certo
          //j é a coluna a copiar
          for (let i = 0; i < buffer.length; i++) {
            for (let k = 0; k < repeatSegment; k++) {
              buffers[(j * buffer.length * repeatSegment) + (k * buffer.length) + i] = buffer[i];
            }
          }
        }

        for (let i = 0; i < 100; i++) {
          buffers[i] = buffers[i] * ramp[i];
          buffers[buffers.length - 1 - i] = buffers[buffers.length - 1 - i] * ramp[i];
        }

        sound.setBuffer([buffers]);
        //sound.setLoop(true);
        sound.playMode('sustain');
        sound.setVolume(0.1);
        sound.play();
        //myEnvelope.play(sound);
        lastDragged = millis();
        loop();
      }
    }
    //Freqency
    if (valT == 2) {
      if (valF) {

        fmin = constrain(float(inp.value()), 20, 5000);
        fmax = constrain(float(inp2.value()), 20, 5000);

        if (fmin && fmax) {
          for (let i = 0; i < oscCount; i++) {
            //allOscs[i].amp(0.3 / oscCount, 0.5);
          }
          if (checkEvent) {
            for (let i = 0; i < oscCount; i++) {
              allOscs[i].amp(0.3 / oscCount, 0.5);
            }
          }
          let G = [];

          img.loadPixels()
          loadPixels();
          for (let y = (mouseY - int((height - img.height) / 2)) - 2; y < (mouseY - int((height - img.height) / 2)) + 1; y++) {
            for (let x = (mouseX - int((width - img.width) / 2)) - 2; x < (mouseX - int((width - img.width) / 2)) + 1; x++) {
              let index = (x + y * img.width) * 4;
              let r = img.pixels[index + 0];
              let g = img.pixels[index + 1];
              let b = img.pixels[index + 2];
              let colorAverage = (r + g + b) / 3;

              if (valF == 1) {
                frequen = map(r, 0, 255, fmin, fmax);
              } else if (valF == 2) {
                frequen = map(g, 0, 255, fmin, fmax);
              } else if (valF == 3) {
                frequen = map(b, 0, 255, fmin, fmax);
              } else if (valF == 4) {
                frequen = map(colorAverage, 0, 255, fmin, fmax);
              }

              G.push(frequen);
            }
          }

          for (let i = 0; i < oscCount; i++) {
            allOscs[i].freq(G[i], 0.01);
            if (!checkEvent) {
              env.play(allOscs[i]);
            }
          }
        }
        lastDragged = millis();
        loop();
      }
    }
  } else {
    sound.stop();
    sound1.stop();
    for (let i = 0; i < oscCount; i++) {
      allOscs[i].freq(0, 0.1);
      if (checkEvent) {
        allOscs[i].amp(0, 0.5);
      }
    }
  }
}

function mouseFreezed() {

  if (mouseY > (height - img.height) / 2 && mouseY < height - (height - img.height) / 2 && mouseX > (width - img.width) / 2 && mouseX < width - (width - img.width) / 2) {
    let val = radio.value();
    if (val) {
      let a = []; //array com todos os pixeis verdes neste caso
      let a2d = []; //matriz com a divisão dos elementos de 'a' por linhas
      let a2dt = [];
      let real = new Float32Array(fftSize);
      let buffer = new Float32Array(fftSize);
      let buffers = new Float64Array(fftSize); // poder modificar isto de antemão???está a ser multiplicado pela width da imagem e dividido pelo fator da diminuição da resolução apenas para teste

      //tratamento dos pixeis da imagem
      img.loadPixels();
      loadPixels(); //faz load da array com info de todos os pixeis

      //percorrer todos pixeis da imagem, tendo em conta que por cada pixel existem 4 elementos RGBA
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          let index = (x + y * img.width) * 4;
          let r = img.pixels[index + 0];
          let g = img.pixels[index + 1];
          let b = img.pixels[index + 2];
          let colorAverage = (r + g + b) / 3;

          if (val == 1) {
            a[index / 4] = r;
          } else if (val == 2) {
            a[index / 4] = g;
          } else if (val == 3) {
            a[index / 4] = b;
          } else if (val == 4) {
            a[index / 4] = colorAverage;
          }
        }
      }

      //subdivisão da array em matriz por linhas(trocar 19 por img.width?)
      for (let i = 0; i < a.length; i += img.width) {
        // indicar cada elemento da array como uma array ficando assim com 2d array ou seja matrix  (trocar 19 por img.width?)
        a2d[i / img.width] = a.slice(i, i + img.width);
      }

      //cria matriz transposta, array de colunas, usando a libraria math.js
      a2dt = math.transpose(a2d);

      //percorrer as colunas que existem na matriz dos pixeis verdes 'a2dt'
      //indo coluna a coluna (elemento de 'a2dt')
      for (j = 0; j < 1; j++) {
        //  em cada coluna j percorre a coluna toda
        for (let i = (mouseY - int((height - img.height) / 2)) - d; i < (mouseY - int((height - img.height) / 2)) + d; i++) {
          let pos = int(map(i, 0, img.height, 100, 1)); // o bin não está relacionado com a posição do rato mas sim com a posição em cada coluna
          real[pos] = (a2dt[((mouseX - int((width - img.width) / 2)))][i]) / 255; //  uso o valor de cada elemento para dar diferentes intesidades a cada bin
          real[real.length - pos] = (a2dt[((mouseX - int((width - img.width) / 2)))][i]) / 255;
        }

        let imag = new Float32Array(fftSize);
        let fft = new FFT(fftSize, sampleRate);
        buffer = fft.inverse(real, imag);

        // normalize
        let max = 0.0;
        for (let i = 0; i < buffer.length; i++) {
          if (abs(buffer[i]) > max) {
            max = abs(buffer[i]);
          }
        }

        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = buffer[i] / max;
        }

        // por cada coluna (elemento j de 'a2dt') o buffer criado é copiado para um buffer maior no sítio certo
        for (let i = 0; i < buffer.length; i++) {
          for (let k = 0; k < repeatSegment; k++) {
            buffers[(j * buffer.length * repeatSegment) + (k * buffer.length) + i] = buffer[i];
          }
        }
      }

      for (let i = 0; i < 100; i++) {
        buffers[i] = buffers[i] * ramp[i];
        buffers[buffers.length - 1 - i] = buffers[buffers.length - 1 - i] * ramp[i];
      }

      sound1.setBuffer([buffers]);
      sound1.playMode('restart');
      sound1.setVolume(0.1);
      sound1.play();
    }
  }
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = loadImage(file.data, reDraw);
    loop();

  } else {
    img = null;
  }
}

function mouseReleased() {
  sound.stop();
  sound1.stop();
  for (let i = 0; i < oscCount; i++) {
    allOscs[i].freq(0, 0.1);
    if (checkEvent) {
      allOscs[i].amp(0, 0.5);
    }
  }
}

function reDraw() {
  redraw();
}

function doubleClicked() {
  if (mouseY > (height - img.height) / 2 && mouseY < height - (height - img.height) / 2 && mouseX > (width - img.width) / 2 && mouseX < width - (width - img.width) / 2) {
    if (!checkEvent) {
      checkEvent = true;
    } else {
      checkEvent = false;
    }
    console.log(checkEvent);
  }
}

function inst() {
  alert("1st - Import your imaGe\n2nd - ChooSe reaDinG moDe\n3rd - Select which color to reaD\n4th - Have Fun DraGGinG your mouSe arounD\n\n\n\n\nP.S. There are 5ome more StuFF. FinD them!!");
}

function Show() {
  let valT = radioGlobal.value();
  let valF = radio1.value();
  let val = radio.value();
  fmin = constrain(float(inp.value()), 20, 5000);
  fmax = constrain(float(inp2.value()), 20, 5000);
  if (((valT == 2 && valF && fmin && fmax) || (valT == 1 && val )) && img) {

    texts1.style('font-size', random(15, 100) + 'px');
    texts1.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts1.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts1.show();
    texts2.style('font-size', random(15, 100) + 'px');
    texts2.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts2.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts2.show();
    texts3.style('font-size', random(15, 100) + 'px');
    texts3.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts3.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts3.show();
    texts4.style('font-size', random(15, 100) + 'px');
    texts4.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts4.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts4.show();
    texts5.style('font-size', random(15, 100) + 'px');
    texts5.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts5.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts5.show();
    texts6.style('font-size', random(15, 100) + 'px');
    texts6.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts6.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts6.show();
    texts7.style('font-size', random(15, 100) + 'px');
    texts7.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts7.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts7.show();
    texts8.style('font-size', random(15, 100) + 'px');
    texts8.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts8.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts8.show();
    texts9.style('font-size', random(15, 100) + 'px');
    texts9.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts9.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts9.show();
    texts10.style('font-size', random(15, 100) + 'px');
    texts10.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts10.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts10.show();
    texts11.style('font-size', random(15, 100) + 'px');
    texts11.style('color', color(random(240, 249), random(240, 249), random(240, 249), 150));
    texts11.position(random(0, windowWidth - 150), random(0, windowHeight - 150));
    texts11.show();
  }
}

function Hide() {
  texts1.hide();
  texts2.hide();
  texts3.hide();
  texts4.hide();
  texts5.hide();
  texts6.hide();
  texts7.hide();
  texts8.hide();
  texts9.hide();
  texts10.hide();
  texts11.hide();
}

function keyPressed() {
  let valT = radioGlobal.value();
  let valF = radio1.value();
  fmin = constrain(float(inp.value()), 20, 5000);
  fmax = constrain(float(inp2.value()), 20, 5000);
  if (valT == 2 && valF && fmin && fmax && img) {
    if (keyCode == 83) {
      for (let i = 0; i < oscCount; i++) {
        allOscs[i].setType('sine');
      }
      aKey++;
      if (aKey == 1) {
        alert("Sine Wave discovered");
        keyCounter++;
      }
    } else if (keyCode == 68) {
      for (let i = 0; i < oscCount; i++) {
        allOscs[i].setType('triangle');
      }
      sKey++;
      if (sKey == 1) {
        alert("Triangle Wave discovered");
        keyCounter++;
      }
    } else if (keyCode == 70) {
      for (let i = 0; i < oscCount; i++) {
        allOscs[i].setType('sawtooth');
      }
      dKey++;
      if (dKey == 1) {
        alert("Sawtooth Wave discovered");
        keyCounter++;
      }
    } else if (keyCode == 71) {
      for (let i = 0; i < oscCount; i++) {
        allOscs[i].setType('square');
      }
      fKey++;
      if (fKey == 1) {
        alert("Square Wave discovered");
        keyCounter++;
      }
    }
    if (keyCounter == 4) {
      alertCounter++
      if (alertCounter == 1) {
        alert("Congratulations all four waves discovered");
      }
    }
  }
}
