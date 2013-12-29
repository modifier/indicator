var Indicator = function (wrapper) {
	this._wrapper = wrapper;
};

Indicator.prototype = {
	particle_radius: 3,
	outer_radius: 30,
	angle_offset: Math.PI / 12,
	_getParticlePosition: function (coordinate, index, t) {
		var foo_name = coordinate == "x" ? "cos" : "sin";
		return this.particle_radius + this.outer_radius
		+ Math[foo_name]((t ? t * Math.PI * 2 : 0) + this.angle_offset * index) * this.outer_radius;
	},
	_appendIndicator: function () {
		this._indicator = this._wrapper.append("svg")
			.attr("x", this._wrapper.attr("width") / 2)
			.attr("y", this._wrapper.attr("height") / 2);

		var particles_count = 5;
		this._particles = [];
		for (var i = 0; i < particles_count; i++) {
			var new_particle = this._indicator.insert("circle")
				.attr("cx", this._getParticlePosition("x", i))
				.attr("cy", this._getParticlePosition("y", i))
				.attr("r", this.particle_radius)
				.attr("fill", "#0a5089");
			this._particles.push(new_particle);
		}
	},
	_startAnimation: function () {
		var cycle_duration = 2000;
		var that = this;
		for (var i = 0; i < this._particles.length; i++) {
			(function(particle, i) {
				// Start animation with delay
				setTimeout(function () {
					(function repeating () {
						particle.transition()
							.duration(cycle_duration)
							.attrTween("cx", function () {
								return function (t) {
									return that._getParticlePosition("x", i, t);
								};
							})
							.attrTween("cy", function () {
								return function (t) {
									return that._getParticlePosition("y", i, t);
								};
							})
							.each("end", repeating);
					})();
				}, cycle_duration / 20 * i);
			})(this._particles[i], i);
		}
	},
	_stopAnimation: function () {
		for (var i = 0; i < this._particles.length; i++) {
			this._particles[i].transition().duration(0);
		}
	},
	show: function () {
		this._wrapper.selectAll("*").attr("display", "none");
		if (!this._indicator) {
			this._appendIndicator();
		}
		this._startAnimation();
	},
	hide: function () {
		this._wrapper.selectAll("*").attr("display", "inline")
		if (!this._indicator) {
			return;
		}

		this._stopAnimation();
		this._indicator.attr("display", "none");
	}
};