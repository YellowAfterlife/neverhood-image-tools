// Generated by Haxe 4.1.1
(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var BlobTools = function() { };
BlobTools.__name__ = true;
BlobTools.base64of = function(bytes,offset,length) {
	var pos = 0;
	var raw = "";
	while(pos < length) {
		var end = pos + 32768;
		if(end > length) {
			end = length;
		}
		var sub = haxe_io_UInt8Array.fromBytes(bytes,offset + pos,end - pos);
		raw += Std.string(String.fromCharCode.apply(null, sub));
		pos = end;
	}
	return window.btoa(raw);
};
BlobTools.bytesOfBase64 = function(base64) {
	var data = window.atob(base64);
	var out = new haxe_io_Bytes(new ArrayBuffer(data.length));
	var _g = 0;
	var _g1 = data.length;
	while(_g < _g1) {
		var i = _g++;
		var v = data.charCodeAt(i);
		out.b[i] = v;
	}
	return out;
};
BlobTools.bytesOfDataURL = function(dataURL) {
	return BlobTools.bytesOfBase64(dataURL.substring(dataURL.indexOf(",") + 1));
};
BlobTools.bytesToBlobURL = function(bytes,path,type) {
	try {
		var blob = new Blob([bytes.b.bufferValue],{ type : type});
		var nav = $global.navigator;
		if(nav.msSaveBlob != null) {
			nav.msSaveBlob(blob,path);
			return null;
		}
		return URL.createObjectURL(blob);
	} catch( _g ) {
		var err = haxe_Exception.caught(_g).unwrap();
		window.console.error("Failed to make blob",err);
		return "data:" + type + ";base64," + BlobTools.base64of(bytes,0,bytes.length);
	}
};
BlobTools.save = function(bytes,path,type) {
	var ou = BlobTools.bytesToBlobURL(bytes,path,type);
	if(ou == null) {
		return;
	}
	var a = window.document.getElementById("blob-savior");
	if(BlobTools.lastObjectURL != null) {
		URL.revokeObjectURL(BlobTools.lastObjectURL);
	}
	BlobTools.lastObjectURL = ou;
	a.href = ou;
	a.download = path;
	a.click();
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.now = function() {
	return Date.now();
};
Math.__name__ = true;
var NhiReader = function() {
	this.meta = "empty input";
};
NhiReader.__name__ = true;
NhiReader.sizeStr = function(len) {
	return Std.string(Math.floor(len / 1024 * 100) / 100) + "KB";
};
NhiReader.prototype = {
	read: function(bytes,pal) {
		if(pal == null) {
			pal = NhiReader.defPalette;
		}
		var reader = new haxe_io_BytesInput(bytes);
		this.meta = "empty input";
		this.format = reader.readUInt16();
		this.meta = "format " + this.format + "; " + NhiReader.sizeStr(bytes.length);
		switch(this.format) {
		case 18:
			this.width = reader.readUInt16();
			this.height = reader.readUInt16();
			this.palette = NhiReader.defPalette;
			break;
		case 22:
			this.width = reader.readUInt16();
			this.height = reader.readUInt16();
			reader.readInt32();
			this.palette = NhiReader.defPalette;
			break;
		case 26:
			this.width = reader.readUInt16();
			this.height = reader.readUInt16();
			var this1 = new Array(256);
			this.palette = this1;
			var _g = 0;
			while(_g < 256) {
				var i = _g++;
				var c = reader.readInt32();
				c = 255 - (c >> 24) << 24 | c & 16777215;
				this.palette[i] = c;
			}
			break;
		case 19:case 23:case 27:
			this.width = reader.readUInt16();
			this.height = reader.readUInt16();
			this.palette = NhiReader.defPalette;
			this.meta += "; mystery";
			break;
		default:
			throw haxe_Exception.thrown("Unknown format");
		}
		this.meta += "; " + this.width + "x" + this.height;
		this.pixels = new haxe_io_Bytes(new ArrayBuffer(this.width * this.height * 4));
		this.readPixels(reader);
	}
	,readPixels: function(reader) {
		var avail = reader.totlen - reader.pos;
		var pos = 0;
		var _g = 0;
		var _g1 = this.height;
		while(_g < _g1) {
			var y = _g++;
			var _g2 = 0;
			var _g3 = this.width;
			while(_g2 < _g3) {
				var x = _g2++;
				if(avail-- <= 0) {
					this.meta += "; hit EOF";
					return;
				}
				var ind = reader.readByte();
				this.pixels.setInt32(pos,this.palette[ind]);
				pos += 4;
			}
		}
		if(avail > 0) {
			this.meta += "; " + NhiReader.sizeStr(avail) + " trailing data";
		}
	}
};
var NhiWeb = function() { };
NhiWeb.__name__ = true;
NhiWeb.createTextEl = function(text,type) {
	if(type == null) {
		type = "span";
	}
	var el = window.document.createElement(type);
	el.appendChild(window.document.createTextNode(text));
	return el;
};
NhiWeb.addTextEl = function(par,text,type) {
	if(type == null) {
		type = "span";
	}
	var el = NhiWeb.createTextEl(text,type);
	par.appendChild(el);
	return el;
};
NhiWeb.addLinkEl = function(par,text,href) {
	if(href == null) {
		href = "javascript:void(0)";
	}
	var el = NhiWeb.addTextEl(par,text,"a");
	el.href = href;
	return el;
};
NhiWeb.loadNHI = function(bytes,name) {
	var reader = new NhiReader();
	var error = null;
	try {
		reader.read(bytes);
	} catch( _g ) {
		var x = haxe_Exception.caught(_g).unwrap();
		error = "Error: " + Std.string(x);
	}
	var div = window.document.createElement("div");
	if(reader.pixels != null) {
		var canv = window.document.createElement("canvas");
		canv.width = reader.width;
		canv.height = reader.height;
		var ctx = canv.getContext("2d",null);
		var imr = new Uint8ClampedArray(reader.pixels.b.bufferValue);
		var imd = new ImageData(imr,reader.width,reader.height);
		ctx.putImageData(imd,0,0);
		var cdiv = window.document.createElement("div");
		cdiv.appendChild(canv);
		div.appendChild(cdiv);
	}
	if(error != null) {
		NhiWeb.addTextEl(div,error,"div");
	}
	NhiWeb.addTextEl(div,name,"div");
	NhiWeb.addTextEl(div,"(" + reader.meta + ")","div");
	NhiWeb.container.appendChild(div);
};
NhiWeb.loadFile = function(file) {
	var ext = haxe_io_Path.extension(file.name).toLowerCase();
	switch(ext) {
	case "bmp":case "png":
		var reader = new FileReader();
		reader.onloadend = function(_) {
			var img = window.document.createElement("img");
			img.onload = function(_) {
				var canv = window.document.createElement("canvas");
				var w = img.width;
				var h = img.height;
				canv.width = w;
				canv.height = h;
				var ctx = canv.getContext("2d",null);
				ctx.drawImage(img,0,0);
				var imd = ctx.getImageData(0,0,w,h);
				var imr = imd.data;
				var buf = imr.buffer.slice(imr.byteOffset,imr.byteOffset + imr.byteLength);
				var bytes = haxe_io_Bytes.ofData(buf);
				var nhi = NhiWriter.write(bytes,w,h);
				var nhiName = haxe_io_Path.withExtension(file.name,"nhi");
				var div = window.document.createElement("div");
				var imgd = NhiWeb.addTextEl(div,"","div");
				imgd.appendChild(img);
				NhiWeb.addTextEl(div,"Converted this " + w + "x" + h + " image to NHI!");
				var _g = 0;
				var _g1 = NhiWriter.warnings;
				while(_g < _g1.length) {
					var warn = _g1[_g];
					++_g;
					NhiWeb.addTextEl(div,warn);
				}
				var tools = NhiWeb.addTextEl(div,"","div");
				var download = NhiWeb.addLinkEl(tools,"Download");
				download.onclick = function(_) {
					BlobTools.save(nhi,nhiName,"application/octet-stream");
				};
				NhiWeb.addTextEl(tools," · ");
				var view = NhiWeb.addLinkEl(tools,"Preview");
				view.onclick = function(_) {
					NhiWeb.loadNHI(nhi,nhiName);
				};
				NhiWeb.container.appendChild(div);
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
		break;
	case "nhi":
		var reader1 = new FileReader();
		reader1.onloadend = function(_) {
			var bytes = haxe_io_Bytes.ofData(reader1.result);
			NhiWeb.lastImageBytes = bytes;
			NhiWeb.lastImageName = file.name;
			NhiWeb.loadNHI(bytes,file.name);
		};
		reader1.readAsArrayBuffer(file);
		break;
	case "nhp":
		var reader2 = new FileReader();
		reader2.onloadend = function(_) {
			var bytes = haxe_io_Bytes.ofData(reader2.result);
			var this1 = new Array(256);
			var pal = this1;
			var _g = 0;
			while(_g < 256) {
				var i = _g++;
				var c = bytes.getInt32(i * 4);
				c = 255 - (c >> 24) << 24 | c & 16777215;
				pal[i] = c;
			}
			NhiReader.defPalette = pal;
			var div = window.document.createElement("div");
			var text = "Palette loaded.";
			NhiWeb.addTextEl(div,"Palette loaded.","div");
			NhiWeb.container.appendChild(div);
			if(NhiWeb.lastImageBytes != null) {
				NhiWeb.addTextEl(div,"Reloading " + NhiWeb.lastImageName + " with this palette...");
				NhiWeb.loadNHI(NhiWeb.lastImageBytes,NhiWeb.lastImageName);
			}
		};
		reader2.readAsArrayBuffer(file);
		break;
	}
};
NhiWeb.initDragAndDrop = function() {
	var cancelDefault = function(e) {
		e.preventDefault();
		return false;
	};
	var body = window.document;
	body.addEventListener("dragover",cancelDefault);
	body.addEventListener("dragenter",cancelDefault);
	body.addEventListener("drop",function(e) {
		e.preventDefault();
		var dt = e.dataTransfer;
		var _g = 0;
		var _g1 = dt.files;
		while(_g < _g1.length) {
			var file = _g1[_g];
			++_g;
			NhiWeb.loadFile(file);
		}
		return false;
	});
};
NhiWeb.initFilePicker = function() {
	var input = window.document.getElementById("nh-file-picker");
	var form = window.document.getElementById("nh-file-picker-form");
	input.addEventListener("change",function(e) {
		if(input.files != null) {
			var _g = 0;
			var _g1 = input.files;
			while(_g < _g1.length) {
				var file = _g1[_g];
				++_g;
				NhiWeb.loadFile(file);
			}
		}
		form.reset();
		return false;
	});
	window.document.getElementById("nh-clear").addEventListener("click",function(_) {
		NhiWeb.container.innerHTML = "";
	});
};
NhiWeb.main = function() {
	NhiWeb.initDragAndDrop();
	NhiWeb.initFilePicker();
};
var NhiWriter = function() { };
NhiWriter.__name__ = true;
NhiWriter.colDist = function(a,b) {
	var ad = (a >> 24 & 255) - (b >> 24 & 255);
	var rd = (a >> 16 & 255) - (b >> 16 & 255);
	var gd = (a >> 8 & 255) - (b >> 8 & 255);
	var bd = (a & 255) - (b & 255);
	return rd * rd + gd * gd + bd * bd + ad * ad;
};
NhiWriter.write26 = function(pixels,width,height) {
	var count = width * height;
	var palMap_h = { };
	var palList = [];
	var _g = 0;
	var _g1 = count;
	while(_g < _g1) {
		var i = _g++;
		var c = pixels.getInt32(i * 4);
		var palItem = palMap_h[c];
		if(palItem == null) {
			palItem = new NhiPaletteItem(c);
			palMap_h[c] = palItem;
			palList.push(palItem);
		}
		palItem.uses++;
	}
	palList.sort(function(a,b) {
		return b.uses - a.uses;
	});
	var _g = 0;
	var _g1 = palList.length;
	while(_g < _g1) {
		var i = _g++;
		var item = palList[i];
		if(i < 256) {
			item.index = i;
		} else {
			var bestIndex = 0;
			var bestDist = 262144;
			var myCol = item.color;
			var _g2 = 0;
			while(_g2 < 256) {
				var k = _g2++;
				var dist = NhiWriter.colDist(myCol,palList[k].color);
				if(dist < bestDist) {
					bestIndex = k;
					bestDist = dist;
				}
			}
			item.index = bestIndex;
		}
	}
	var out = new haxe_io_Bytes(new ArrayBuffer(width * height + 6 + 1024));
	out.setUInt16(0,26);
	out.setUInt16(2,width);
	out.setUInt16(4,height);
	var palLength = palList.length;
	if(palLength > 256) {
		NhiWriter.warnings.push("Image has too many colors (" + palLength + ">256)!");
		palLength = 256;
	}
	var _g = 0;
	var _g1 = palLength;
	while(_g < _g1) {
		var i = _g++;
		var c = palList[i].color;
		c = 255 - (c >> 24) << 24 | c & 16777215;
		out.setInt32(6 + i * 4,c);
	}
	var _g = 0;
	var _g1 = count;
	while(_g < _g1) {
		var i = _g++;
		var c = pixels.getInt32(i * 4);
		var palItem = palMap_h[c];
		out.b[1030 + i] = palItem.index;
	}
	return out;
};
NhiWriter.write = function(pixels,width,height,format) {
	if(format == null) {
		format = 26;
	}
	NhiWriter.warnings = [];
	if(format == 26) {
		return NhiWriter.write26(pixels,width,height);
	} else {
		throw haxe_Exception.thrown("Format not supported!");
	}
};
var NhiPaletteItem = function(col) {
	this.uses = 0;
	this.index = -1;
	this.color = col;
};
NhiPaletteItem.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,get_native: function() {
		return this.__nativeException;
	}
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
});
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	setUInt16: function(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setUint16(pos,v,true);
	}
	,getInt32: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getInt32(pos,true);
	}
	,setInt32: function(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setInt32(pos,v,true);
	}
};
var haxe_io_Input = function() { };
haxe_io_Input.__name__ = true;
haxe_io_Input.prototype = {
	readByte: function() {
		throw haxe_Exception.thrown("Not implemented");
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) {
			return ch2 | ch1 << 8;
		} else {
			return ch1 | ch2 << 8;
		}
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) {
			return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24;
		} else {
			return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
		}
	}
};
var haxe_io_BytesInput = function(b,pos,len) {
	if(pos == null) {
		pos = 0;
	}
	if(len == null) {
		len = b.length - pos;
	}
	if(pos < 0 || len < 0 || pos + len > b.length) {
		throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
	}
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
haxe_io_BytesInput.__name__ = true;
haxe_io_BytesInput.__super__ = haxe_io_Input;
haxe_io_BytesInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		if(this.len == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.len--;
		return this.b[this.pos++];
	}
});
var haxe_io_Eof = function() {
};
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"]
	,Blocked: {_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_.__params__ = ["e"],$_)
};
var haxe_io_Path = function(path) {
	switch(path) {
	case ".":case "..":
		this.dir = path;
		this.file = "";
		return;
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		this.dir = HxOverrides.substr(path,0,c2);
		path = HxOverrides.substr(path,c2 + 1,null);
		this.backslash = true;
	} else if(c2 < c1) {
		this.dir = HxOverrides.substr(path,0,c1);
		path = HxOverrides.substr(path,c1 + 1,null);
	} else {
		this.dir = null;
	}
	var cp = path.lastIndexOf(".");
	if(cp != -1) {
		this.ext = HxOverrides.substr(path,cp + 1,null);
		this.file = HxOverrides.substr(path,0,cp);
	} else {
		this.ext = null;
		this.file = path;
	}
};
haxe_io_Path.__name__ = true;
haxe_io_Path.extension = function(path) {
	var s = new haxe_io_Path(path);
	if(s.ext == null) {
		return "";
	}
	return s.ext;
};
haxe_io_Path.withExtension = function(path,ext) {
	var s = new haxe_io_Path(path);
	s.ext = ext;
	return s.toString();
};
haxe_io_Path.prototype = {
	toString: function() {
		return (this.dir == null ? "" : this.dir + (this.backslash ? "\\" : "/")) + this.file + (this.ext == null ? "" : "." + this.ext);
	}
};
var haxe_io_UInt8Array = {};
haxe_io_UInt8Array.fromBytes = function(bytes,bytePos,length) {
	if(bytePos == null) {
		bytePos = 0;
	}
	if(length == null) {
		length = bytes.length - bytePos;
	}
	return new Uint8Array(bytes.b.bufferValue,bytePos,length);
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var n = e.__constructs__[o._hx_index];
			var con = e[n];
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var js_lib__$ArrayBuffer_ArrayBufferCompat = function() { };
js_lib__$ArrayBuffer_ArrayBufferCompat.__name__ = true;
js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var resultArray = new Uint8Array(u.byteLength);
	resultArray.set(u);
	return resultArray.buffer;
};
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl;
}
NhiReader.defPalette = (function($this) {
	var $r;
	var this1 = new Array(256);
	var pal = this1;
	{
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			pal[i] = i | i << 8 | i << 16 | -16777216;
		}
	}
	$r = pal;
	return $r;
}(this));
NhiWeb.container = window.document.getElementById("nh-container");
NhiWeb.lastImageName = "?";
NhiWeb.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=script.js.map