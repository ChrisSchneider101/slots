SlotSymbol = function(id, size) {
	this.id = id;
	this.size = size;
	this.div = document.createElement("div");
	this.div.style.width = this.size;
	this.div.style.height = this.size;
	this.div.style.position = "absolute";
	
	this.div.style.backgroundColor = this.id;
	
	this.cur_top;

	this.setTop = function(top) {
		this.div.style.top = top;
		this.cur_top = top;
	}
	
	return this;
}

SlotColumn = function(symbol_size) {
	this.speed = 1;
	this.symbol_size = symbol_size;
	this.div = document.createElement("div");
	this.div.style.height = this.symbol_size;
	this.div.style.width = this.symbol_size;
	this.div.style.position = "absolute";
	//this.div.style.border = "solid 2px black";
	
	this.syms = [];
	this.spin_interval;
	this.min_top;
	this.cur_top;
	
	this.setTop = function(top) {
		this.div.style.top = top;
		this.cur_top = top;
	}
	
	this.addSymbol = function(symbol) {
		this.syms.push(symbol);
		this.div.appendChild(symbol.div);
		this.div.style.height = this.syms.length * this.symbol_size;
		//this.div.style.top = -1 * (this.syms.length - 1) * symbol_size;
		this.min_top = -1 * (this.syms.length - 1) * this.symbol_size;
		this.setTop(this.min_top);
		//symbol.div.style.top = (this.syms.length - 1) * this.symbol_size;
		symbol.setTop((this.syms.length - 1) * this.symbol_size);
	}
	
	this.startSpin = function(speed) {
		if (this.spin_interval != null) return;
		this.speed = speed;
		this.spin_interval = setInterval(function() {
			for (let i = 0; i < this.syms.length; i++) {
				var sym = this.syms[i];
				sym.setTop(sym.cur_top + this.speed);
				if (sym.cur_top >= this.symbol_size * this.syms.length)
					sym.setTop(sym.cur_top - (this.syms.length * this.symbol_size));
			}
		}.bind(this), 10);
	}
	
	this.stopSpin = function() {
		//console.log(this.spin_interval);
		clearInterval(this.spin_interval);
		this.spin_interval = null;
		this.snapSymbols();
		//console.log(this.spin_interval);
	}
	
	this.snapSymbols = function() {
		var bot_symbol;
		for (let i = 0; i < this.syms.length; i++) {
			if (i == 0) bot_symbol = this.syms[i];
			else if (this.syms[i].cur_top > bot_symbol.cur_top) bot_symbol = this.syms[i];
		}
		
		var cutoff = Math.round(((this.syms.length - .5) * this.symbol_size));
		var offset;
		if (bot_symbol.cur_top > cutoff)
			offset = (this.syms.length * this.symbol_size) - bot_symbol.cur_top;
		else offset = ((this.syms.length - 1) * this.symbol_size) - bot_symbol.cur_top;
		
		for (let i = 0; i < this.syms.length; i++)
			this.syms[i].setTop(this.syms[i].cur_top + offset);
	}
	
	return this;
}

MachineWindow = function() {
	this.symbol_size = 150;
	this.div = document.createElement("div");
	this.div.style.border = "solid 5px black";
	this.div.style.backgroundColor = "white";
	this.div.style.position = "relative";
	this.div.style.width = this.symbol_size * 3;
	this.div.style.height = this.symbol_size;
	this.div.style.display = "inline-block";
	this.div.style.overflow = "hidden";
	this.div.style.top = 50;
	//console.log(parseInt(this.div.style.width));
	
	this.cols = [];
	for (let i = 0; i < 3; i++) {
		var col_length = 5;
		var col = new SlotColumn(this.symbol_size);
		col.addSymbol(new SlotSymbol("red", this.symbol_size));
		col.addSymbol(new SlotSymbol("blue", this.symbol_size));
		col.addSymbol(new SlotSymbol("green", this.symbol_size));
		col.addSymbol(new SlotSymbol("orange", this.symbol_size));
		col.addSymbol(new SlotSymbol("purple", this.symbol_size));
		this.cols.push(col);
		col.div.style.left = this.symbol_size * i;
		//console.log(col.div.style.left);
		this.div.appendChild(col.div);
	}
	
	this.hits;
	this.hit = function() {
		this.cols[this.hits].stopSpin();
		this.hits++;
		if (this.hits == this.cols.length) this.hits = 0;
	}
	
	this.start = function() {
		this.hits = 0;
		for (let i = 0; i < this.cols.length; i++)
			this.cols[i].stopSpin();
		for (let i = 0; i < this.cols.length; i++)
			this.cols[i].startSpin(5+(i*5));
	}
	
	
	return this;
}

var mw = new MachineWindow();
document.getElementById("game").appendChild(mw.div);
//mw.cols[0].startSpin(5);
mw.start();