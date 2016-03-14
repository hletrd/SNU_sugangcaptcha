var convnetjs = require('convnetjs');
var fs = require('fs');

var net = new convnetjs.Net();

/*
var layer_defs = [];
layer_defs.push({type:'input', out_sx:26, out_sy:26, out_depth:1});
layer_defs.push({type:'conv', sx:5, filters:36, stride:1, pad:0, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:5, filters:72, stride:1, pad:0, activation:'relu'});
layer_defs.push({type:'pool', sx:3, stride:3});
layer_defs.push({type:'softmax', num_classes:10});
net.makeLayers(layer_defs);

var json = net.toJSON();
var str = JSON.stringify(json);
fs.writeFileSync('net.json', str);
//*/

var trainer = new convnetjs.SGDTrainer(net, {method:'adadelta', batch_size:20, l2_decay:0.001});

samples = fs.readdirSync('./train');
var pngparse = require('pngparse-sync');

var traincount = 100;
console.time("training");

function shuffle(arr) {
	var len = arr.length;
	while (len) {
		var rnd = 0|Math.random()*len;
		len--;
		var tmp = arr[len];
		arr[len] = arr[rnd];
		arr[rnd] = tmp;
	}
	return arr;
}

for(var h = 0; h < traincount; h++) {
	var net_past = JSON.parse(fs.readFileSync("./net.json"));
	net.fromJSON(net_past);

	shuffle(samples);
	for(var i in samples) {
		if (samples[i] == '.DS_Store' || samples[i] == '.gitignore') continue;
		var text = samples[i].split('_')[0];
		var data = pngparse(fs.readFileSync('./train/' + samples[i]));

		var character_old = false;
		var cut1 = 26, cut2 = 26;
		var found = false;
		var input = new convnetjs.Vol(26, 26, 1, 0.0);

		for(var j = 0; j < 52; j++) {
			var character = false;
			for(var k = 0; k < 26; k++) {
				if (data.getPixel(j, k) != 1) {
					character = true;
					break;
				}
			}
			if (character == false && character_old == true) {
				cut1 = j;
				found = true;
			}
			if (character == true && character_old == false && found) {
				cut2 = j;
				break;
			}
			character_old = character;
		}
		
		var offset = cut1 - 26;
		for(var j = cut1 - 26; j < cut1; j++) {
			if (j < 0) {
				for(var k = 0; k < 26; k++) {
					input.w[(j-offset)*26 + k] = 1;
				}
			} else {
				for(var k = 0; k < 26; k++) {
					input.w[(j-offset)*26 + k] = data.getPixel(j, k);
				}
			}
		}
		trainer.train(input, parseInt(text.split('')[0]));

		offset = cut2;
		for(var j = cut2; j < cut2 + 26; j++) {
			if (j >= 52) {
				for(var k = 0; k < 26; k++) {
					input.w[(j-offset)*26 + k] = 1;
				}
			} else {
				for(var k = 0; k < 26; k++) {
					input.w[(j-offset)*26 + k] = data.getPixel(j, k);
				}
			}
		}
		trainer.train(input, parseInt(text.split('')[1]));
		if (i % 10 == 0) console.log(i);
	}
	var json = net.toJSON();
	var str = JSON.stringify(json);
	fs.writeFileSync('net.json', str);
	console.log('training: ' + h);
}
console.timeEnd("training");