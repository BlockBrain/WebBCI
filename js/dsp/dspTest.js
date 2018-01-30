var dsp = require('./dsp.js');
var plotly = require('plotly')('TheBrainChain', 'o0U8llL6YtyRaaIv04Of');

var osc = new dsp.Oscillator(Math.sin(Math.PI), 880, 1, 1024, 22050);
osc.generate();
var signal = osc.signal;

var fft = new dsp.FFT(1024, 44100);
fft.forward(signal);
var spectrum = fft.spectrum;


var signalTest = Array.apply(null, Array(signal.length)).map(function (x, i) { return i; })
var spectrumTest = Array.apply(null, Array(spectrum.length)).map(function (x, i) { return i; })

var data = [
  {
    y: Array.from(signal),
    x: signalTest,
    type: "scatter"
  }
];
var data2 = [
  {
    y: Array.from(spectrum),
    x: spectrumTest,
    type: "scatter"
  }
];

var graphOptions = {filename: "Signal", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});
var graphOptions = {filename: "Spectrum", fileopt: "overwrite"};
plotly.plot(data2, graphOptions, function (err, msg) {
    console.log(msg);
});


// fs.writeFileSync('writeTest.txt', readTest);
