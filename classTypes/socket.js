var	Backbone = require('backbone'),
	_ = require('underscore');

exports.init = function(){

	var Socket = Backbone.Socket = function(options) {
		this.cid = _.uniqueId('Socket');
		this._configure(options || {});

		this.initialize.apply(this, arguments);
		this._listener();
	};

	var socketOptions = [];

	_.extend(Socket.prototype, null, {

		initialize: function(){},

		render: function(req, res){
			console.log('Error : backbone_node : render function was not defined');
		},

		_listener: function(){

			var socket = this;

			global.on('ready:app', function(){
				global.trigger('ready:socket', socket);
			});
		},

		_configure: function(options) {
			if (this.options) options = _.extend({}, this.options, options);
			for (var i = 0, l = socketOptions.length; i < l; i++) {
				var attr = socketOptions[i];
				if (options[attr]) this[attr] = options[attr];
			}
			this.options = options;
		}

	});

	return Socket;

}
