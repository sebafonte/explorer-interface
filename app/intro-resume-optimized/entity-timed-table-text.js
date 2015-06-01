new TextObjectFactory(
	[2.248, 4.4, 6.775, 8.839, 10.15, 12.194, 14.126, 15.926, 17.893, 20.021, 22.2, 25.0, 27.69, 29.59 ],
	["arleka", "facil", "vas", "a", "cobrar", "...", "codea", "querido", "es 2015", "none", "you", "are", "crazy" ],
	2.0,
	"sin(time * 4.0 + 4.0 * 3.141592653589 * y) * 0.02",
	"sin(time * 4.0 + 4.0 * 3.141592653589 * x) * 0.02",
	5.2, 
	2.0).getObjects();
	
function TextObjectFactory (sizex, sizey, effectX, effectY, timetable, texttable, duration) {
	this.sizex = sizex;
	this.sizey = sizey;
	this.effectX = effectX;
	this.effectY = effectY;		
	this.timetable = timetable;
	this.texttable = texttable;	
	this.duration = duration:
}

TextObjectFactory.prototype.getObjects() {
	var list = [];
	
	for (var index=0; index< this.texttable.length; index++) {
		var s = start + this.timetable[index];
		var end = s + this.duration;

		var textObject = new TextObject(this.fontStyles["comment"], texttable[index], effectX, effectY, fontTextureEffect, fontBorderTextureEffect, 
						 [ new Fader(s, s + 0.1, end, end + 0.8) ], 
						 new AnimationProperties(2.5 - texttable[index].length * 0.3, (index % 2 == 0) ? 1.5 : 0.5, sizex, sizey),
						 textCanvas, glContext);

		textObject.displacementCompression = 1.8;
		textObject.scale = 1.0;
		list.push(textObject);
	}	

	return list;
}
