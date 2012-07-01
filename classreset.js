
var	Backbone = require('backbone'),
	_ = require('underscore');

// Reset functionality of Backbone.View

var View = Backbone.View = function(options) {
	this.cid = _.uniqueId('View');
	this._configure(options || {});

	if (!this.route) {
		console.log('Error: When instantiating a new View, route was not provided.');
		return;
	}

	this.initialize.apply(this, arguments);
	this._listener();
};

var viewOptions = ['route'];

_.extend(View.prototype, null, {

	initialize: function(){},

	// All views should overwrite render(). In this setup, render is called once the app is ready;
	// req and res are passed in for handling http input / output.
	render: function(req, res){
		console.log('Error : backbone_node : render function was not defined');
		res.send('Error: View not set.', 404);
	},

	_appready: function(app){
		app.get(this.route, this.render);
	},

	_listener: function(){
		global.on('ready:app', this._appready);
	},

	_configure: function(options) {
		if (this.options) options = _.extend({}, this.options, options);
		for (var i = 0, l = viewOptions.length; i < l; i++) {
			var attr = viewOptions[i];
			if (options[attr]) this[attr] = options[attr];
		}
		this.options = options;
	}

});

// Reset functionality of Backbone.Router

var Router = Backbone.Router = function(options) {
	this.cid = _.uniqueId('Router');
	this._configure(options || {});
	this.initialize.apply(this, arguments);
};

var routerOptions = ['attributes'];

_.extend(Router.prototype, null, {

	initialize: function(){},

	_configure: function(options) {
		if (this.options) options = _.extend({}, this.options, options);
		for (var i = 0, l = routerOptions.length; i < l; i++) {
			var attr = routerOptions[i];
			if (options[attr]) this[attr] = options[attr];
		}
		this.options = options;
	}

});

// Shared Extension Functions

var extend = function (protoProps, classProps) {
	var child = inherits(this, protoProps, classProps);
	child.extend = this.extend;
	return child;
};

View.extend = Router.extend = extend;

var ctor = function(){};

var inherits = function(parent, protoProps, staticProps) {

	var child;

	if (protoProps && protoProps.hasOwnProperty('constructor')) {
		child = protoProps.constructor;
	} else {
		child = function(){ parent.apply(this, arguments); };
	}

	_.extend(child, parent);

	ctor.prototype = parent.prototype;
	child.prototype = new ctor();

	if (protoProps) _.extend(child.prototype, protoProps);
	if (staticProps) _.extend(child, staticProps);

	child.prototype.constructor = child;
	child.__super__ = parent.prototype;

	return child;
};
