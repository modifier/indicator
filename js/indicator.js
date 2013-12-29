var Indicator = function (wrapper) {
	this._wrapper = wrapper;
};

Indicator.prototype = {
	_appendIndicator: function () {
		this._indicator = this._wrapper.append("svg");

		var outer_radius = 30;
		var cycle_duration = 2000;
		var particles_count = 5;
		var particle_radius = 3;
		var angle_offset = Math.PI / 12;

		var position_foo = function (foo_name, index, t) {
			return particle_radius + outer_radius
			+ Math[foo_name]((t ? t * Math.PI * 2 : 0) + angle_offset * index) * outer_radius;
		};

		var particles = [];
		for (var i = 0; i < particles_count; i++) {
			var new_particle = this._indicator.insert("circle")
				.attr("cx", position_foo("cos", i))
				.attr("cy", position_foo("sin", i))
				.attr("r", particle_radius)
				.attr("fill", "#0a5089");
			particles.push(new_particle);
		}

		for (var i = 0; i < particles_count; i++) {
			(function(i) {
				setTimeout(function () {
					(function repeating () {
						particles[i].transition()
							.duration(cycle_duration)
							.attrTween("cx", function () {
								return function (t) {
									return position_foo("cos", i, t);
								};
							})
							.attrTween("cy", function () {
								return function (t) {
									return position_foo("sin", i, t);
								};
							})
							.each("end", repeating);
					})();
				}, cycle_duration / 20 * i);
			})(i);
		}
	},
	show: function () {
		if (!this._indicator) {
			this._appendIndicator();
		}
	},
	hide: function () {

	}
};