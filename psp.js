var Prototype = {
	Version: "1.6.1",
	Browser: (function() {
		var b = navigator.userAgent;
		var a = Object.prototype.toString.call(window.opera) == "[object Opera]";
		return {
			IE: !!window.attachEvent && !a,
			Opera: a,
			WebKit: b.indexOf("AppleWebKit/") > -1,
			Gecko: b.indexOf("Gecko") > -1 && b.indexOf("KHTML") === -1,
			MobileSafari: /Apple.*Mobile.*Safari/.test(b)
		}
	})(),
	BrowserFeatures: {
		XPath: !!document.evaluate,
		SelectorsAPI: !!document.querySelector,
		ElementExtensions: (function() {
			var a = window.Element || window.HTMLElement;
			return !! (a && a.prototype)
		})(),
		SpecificElementExtensions: (function() {
			if (typeof window.HTMLDivElement !== "undefined") {
				return true
			}
			var g = document.createElement("div");
			var b = document.createElement("form");
			var a = false;
			if (g.__proto__ && (g.__proto__ !== b.__proto__)) {
				a = true
			}
			g = b = null;
			return a
		})()
	},
	ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
	JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
	emptyFunction: function() {},
	K: function(a) {
		return a
	}
};
if (Prototype.Browser.MobileSafari) {
	Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Abstract = {};
var Try = {
	these: function() {
		var g;
		for (var b = 0, m = arguments.length; b < m; b++) {
			var a = arguments[b];
			try {
				g = a();
				break
			} catch(o) {}
		}
		return g
	}
};
var Class = (function() {
	function a() {}
	function b() {
		var r = null,
		q = $A(arguments);
		if (Object.isFunction(q[0])) {
			r = q.shift()
		}
		function m() {
			this.initialize.apply(this, arguments)
		}
		Object.extend(m, Class.Methods);
		m.superclass = r;
		m.subclasses = [];
		if (r) {
			a.prototype = r.prototype;
			m.prototype = new a;
			r.subclasses.push(m)
		}
		for (var o = 0; o < q.length; o++) {
			m.addMethods(q[o])
		}
		if (!m.prototype.initialize) {
			m.prototype.initialize = Prototype.emptyFunction
		}
		m.prototype.constructor = m;
		return m
	}
	function g(y) {
		var q = this.superclass && this.superclass.prototype;
		var o = Object.keys(y);
		if (!Object.keys({
			toString: true
		}).length) {
			if (y.toString != Object.prototype.toString) {
				o.push("toString")
			}
			if (y.valueOf != Object.prototype.valueOf) {
				o.push("valueOf")
			}
		}
		for (var m = 0, r = o.length; m < r; m++) {
			var x = o[m],
			u = y[x];
			if (q && Object.isFunction(u) && u.argumentNames().first() == "$super") {
				var z = u;
				u = (function(A) {
					return function() {
						return q[A].apply(this, arguments)
					}
				})(x).wrap(z);
				u.valueOf = z.valueOf.bind(z);
				u.toString = z.toString.bind(z)
			}
			this.prototype[x] = u
		}
		return this
	}
	return {
		create: b,
		Methods: {
			addMethods: g
		}
	}
})();
(function() {
	var m = Object.prototype.toString;
	function x(F, H) {
		for (var G in H) {
			F[G] = H[G]
		}
		return F
	}
	function A(F) {
		try {
			if (o(F)) {
				return "undefined"
			}
			if (F === null) {
				return "null"
			}
			return F.inspect ? F.inspect() : String(F)
		} catch(G) {
			if (G instanceof RangeError) {
				return "..."
			}
			throw G
		}
	}
	function z(F) {
		var H = typeof F;
		switch (H) {
		case "undefined":
		case "function":
		case "unknown":
			return;
		case "boolean":
			return F.toString()
		}
		if (F === null) {
			return "null"
		}
		if (F.toJSON) {
			return F.toJSON()
		}
		if (u(F)) {
			return
		}
		var G = [];
		for (var J in F) {
			var I = z(F[J]);
			if (!o(I)) {
				G.push(J.toJSON() + ": " + I)
			}
		}
		return "{" + G.join(", ") + "}"
	}
	function g(F) {
		return $H(F).toQueryString()
	}
	function q(F) {
		return F && F.toHTML ? F.toHTML() : String.interpret(F)
	}
	function D(F) {
		var G = [];
		for (var H in F) {
			G.push(H)
		}
		return G
	}
	function B(F) {
		var G = [];
		for (var H in F) {
			G.push(F[H])
		}
		return G
	}
	function y(F) {
		return x({},
		F)
	}
	function u(F) {
		return !! (F && F.nodeType == 1)
	}
	function r(F) {
		return m.call(F) == "[object Array]"
	}
	function E(F) {
		return F instanceof Hash
	}
	function b(F) {
		return typeof F === "function"
	}
	function a(F) {
		return m.call(F) == "[object String]"
	}
	function C(F) {
		return m.call(F) == "[object Number]"
	}
	function o(F) {
		return typeof F === "undefined"
	}
	x(Object, {
		extend: x,
		inspect: A,
		toJSON: z,
		toQueryString: g,
		toHTML: q,
		keys: D,
		values: B,
		clone: y,
		isElement: u,
		isArray: r,
		isHash: E,
		isFunction: b,
		isString: a,
		isNumber: C,
		isUndefined: o
	})
})();
Object.extend(Function.prototype, (function() {
	var z = Array.prototype.slice;
	function m(D, A) {
		var C = D.length,
		B = A.length;
		while (B--) {
			D[C + B] = A[B]
		}
		return D
	}
	function x(B, A) {
		B = z.call(B, 0);
		return m(B, A)
	}
	function r() {
		var A = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
		return A.length == 1 && !A[0] ? [] : A
	}
	function u(C) {
		if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
			return this
		}
		var A = this,
		B = z.call(arguments, 1);
		return function() {
			var D = x(B, arguments);
			return A.apply(C, D)
		}
	}
	function q(C) {
		var A = this,
		B = z.call(arguments, 1);
		return function(E) {
			var D = m([E || window.event], B);
			return A.apply(C, D)
		}
	}
	function y() {
		if (!arguments.length) {
			return this
		}
		var A = this,
		B = z.call(arguments, 0);
		return function() {
			var C = x(B, arguments);
			return A.apply(this, C)
		}
	}
	function o(C) {
		var A = this,
		B = z.call(arguments, 1);
		C = C * 1000;
		return window.setTimeout(function() {
			return A.apply(A, B)
		},
		C)
	}
	function a() {
		var A = m([0.01], arguments);
		return this.delay.apply(this, A)
	}
	function g(B) {
		var A = this;
		return function() {
			var C = m([A.bind(this)], arguments);
			return B.apply(this, C)
		}
	}
	function b() {
		if (this._methodized) {
			return this._methodized
		}
		var A = this;
		return this._methodized = function() {
			var B = m([this], arguments);
			return A.apply(null, B)
		}
	}
	return {
		argumentNames: r,
		bind: u,
		bindAsEventListener: q,
		curry: y,
		delay: o,
		defer: a,
		wrap: g,
		methodize: b
	}
})());
Date.prototype.toJSON = function() {
	return '"' + this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + 'Z"'
};
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(a) {
	return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
	initialize: function(b, a) {
		this.callback = b;
		this.frequency = a;
		this.currentlyExecuting = false;
		this.registerCallback()
	},
	registerCallback: function() {
		this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
	},
	execute: function() {
		this.callback(this)
	},
	stop: function() {
		if (!this.timer) {
			return
		}
		clearInterval(this.timer);
		this.timer = null
	},
	onTimerEvent: function() {
		if (!this.currentlyExecuting) {
			try {
				this.currentlyExecuting = true;
				this.execute();
				this.currentlyExecuting = false
			} catch(a) {
				this.currentlyExecuting = false;
				throw a
			}
		}
	}
});
Object.extend(String, {
	interpret: function(a) {
		return a == null ? "": String(a)
	},
	specialChar: {
		"\b": "\\b",
		"\t": "\\t",
		"\n": "\\n",
		"\f": "\\f",
		"\r": "\\r",
		"\\": "\\\\"
	}
});
Object.extend(String.prototype, (function() {
	function prepareReplacement(replacement) {
		if (Object.isFunction(replacement)) {
			return replacement
		}
		var template = new Template(replacement);
		return function(match) {
			return template.evaluate(match)
		}
	}
	function gsub(pattern, replacement) {
		var result = "",
		source = this,
		match;
		replacement = prepareReplacement(replacement);
		if (Object.isString(pattern)) {
			pattern = RegExp.escape(pattern)
		}
		if (! (pattern.length || pattern.source)) {
			replacement = replacement("");
			return replacement + source.split("").join(replacement) + replacement
		}
		while (source.length > 0) {
			if (match = source.match(pattern)) {
				result += source.slice(0, match.index);
				result += String.interpret(replacement(match));
				source = source.slice(match.index + match[0].length)
			} else {
				result += source,
				source = ""
			}
		}
		return result
	}
	function sub(pattern, replacement, count) {
		replacement = prepareReplacement(replacement);
		count = Object.isUndefined(count) ? 1 : count;
		return this.gsub(pattern,
		function(match) {
			if (--count < 0) {
				return match[0]
			}
			return replacement(match)
		})
	}
	function scan(pattern, iterator) {
		this.gsub(pattern, iterator);
		return String(this)
	}
	function truncate(length, truncation) {
		length = length || 30;
		truncation = Object.isUndefined(truncation) ? "...": truncation;
		return this.length > length ? this.slice(0, length - truncation.length) + truncation: String(this)
	}
	function strip() {
		return this.replace(/^\s+/, "").replace(/\s+$/, "")
	}
	function stripTags() {
		return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
	}
	function stripScripts() {
		return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
	}
	function extractScripts() {
		var matchAll = new RegExp(Prototype.ScriptFragment, "img");
		var matchOne = new RegExp(Prototype.ScriptFragment, "im");
		return (this.match(matchAll) || []).map(function(scriptTag) {
			return (scriptTag.match(matchOne) || ["", ""])[1]
		})
	}
	function evalScripts() {
		return this.extractScripts().map(function(script) {
			return eval(script)
		})
	}
	function escapeHTML() {
		return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	}
	function unescapeHTML() {
		return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
	}
	function toQueryParams(separator) {
		var match = this.strip().match(/([^?#]*)(#.*)?$/);
		if (!match) {
			return {}
		}
		return match[1].split(separator || "&").inject({},
		function(hash, pair) {
			if ((pair = pair.split("="))[0]) {
				var key = decodeURIComponent(pair.shift());
				var value = pair.length > 1 ? pair.join("=") : pair[0];
				if (value != undefined) {
					value = decodeURIComponent(value)
				}
				if (key in hash) {
					if (!Object.isArray(hash[key])) {
						hash[key] = [hash[key]]
					}
					hash[key].push(value)
				} else {
					hash[key] = value
				}
			}
			return hash
		})
	}
	function toArray() {
		return this.split("")
	}
	function succ() {
		return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
	}
	function times(count) {
		return count < 1 ? "": new Array(count + 1).join(this)
	}
	function camelize() {
		var parts = this.split("-"),
		len = parts.length;
		if (len == 1) {
			return parts[0]
		}
		var camelized = this.charAt(0) == "-" ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
		for (var i = 1; i < len; i++) {
			camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1)
		}
		return camelized
	}
	function capitalize() {
		return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
	}
	function underscore() {
		return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
	}
	function dasherize() {
		return this.replace(/_/g, "-")
	}
	function inspect(useDoubleQuotes) {
		var escapedString = this.replace(/[\x00-\x1f\\]/g,
		function(character) {
			if (character in String.specialChar) {
				return String.specialChar[character]
			}
			return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
		});
		if (useDoubleQuotes) {
			return '"' + escapedString.replace(/"/g, '\\"') + '"'
		}
		return "'" + escapedString.replace(/'/g, "\\'") + "'"
	}
	function toJSON() {
		return this.inspect(true)
	}
	function unfilterJSON(filter) {
		return this.replace(filter || Prototype.JSONFilter, "$1")
	}
	function isJSON() {
		var str = this;
		if (str.blank()) {
			return false
		}
		str = this.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "");
		return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str)
	}
	function evalJSON(sanitize) {
		var json = this.unfilterJSON();
		try {
			if (!sanitize || json.isJSON()) {
				return eval("(" + json + ")")
			}
		} catch(e) {}
		throw new SyntaxError("Badly formed JSON string: " + this.inspect())
	}
	function include(pattern) {
		return this.indexOf(pattern) > -1
	}
	function startsWith(pattern) {
		return this.indexOf(pattern) === 0
	}
	function endsWith(pattern) {
		var d = this.length - pattern.length;
		return d >= 0 && this.lastIndexOf(pattern) === d
	}
	function empty() {
		return this == ""
	}
	function blank() {
		return /^\s*$/.test(this)
	}
	function interpolate(object, pattern) {
		return new Template(this, pattern).evaluate(object)
	}
	return {
		gsub: gsub,
		sub: sub,
		scan: scan,
		truncate: truncate,
		strip: String.prototype.trim ? String.prototype.trim: strip,
		stripTags: stripTags,
		stripScripts: stripScripts,
		extractScripts: extractScripts,
		evalScripts: evalScripts,
		escapeHTML: escapeHTML,
		unescapeHTML: unescapeHTML,
		toQueryParams: toQueryParams,
		parseQuery: toQueryParams,
		toArray: toArray,
		succ: succ,
		times: times,
		camelize: camelize,
		capitalize: capitalize,
		underscore: underscore,
		dasherize: dasherize,
		inspect: inspect,
		toJSON: toJSON,
		unfilterJSON: unfilterJSON,
		isJSON: isJSON,
		evalJSON: evalJSON,
		include: include,
		startsWith: startsWith,
		endsWith: endsWith,
		empty: empty,
		blank: blank,
		interpolate: interpolate
	}
})());
var Template = Class.create({
	initialize: function(a, b) {
		this.template = a.toString();
		this.pattern = b || Template.Pattern
	},
	evaluate: function(a) {
		if (a && Object.isFunction(a.toTemplateReplacements)) {
			a = a.toTemplateReplacements()
		}
		return this.template.gsub(this.pattern,
		function(m) {
			if (a == null) {
				return (m[1] + "")
			}
			var q = m[1] || "";
			if (q == "\\") {
				return m[2]
			}
			var b = a,
			r = m[3];
			var o = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
			m = o.exec(r);
			if (m == null) {
				return q
			}
			while (m != null) {
				var g = m[1].startsWith("[") ? m[2].replace(/\\\\]/g, "]") : m[1];
				b = b[g];
				if (null == b || "" == m[3]) {
					break
				}
				r = r.substring("[" == m[3] ? m[1].length: m[0].length);
				m = o.exec(r)
			}
			return q + String.interpret(b)
		})
	}
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function() {
	function g(N, M) {
		var L = 0;
		try {
			this._each(function(P) {
				N.call(M, P, L++)
			})
		} catch(O) {
			if (O != $break) {
				throw O
			}
		}
		return this
	}
	function G(O, N, M) {
		var L = -O,
		P = [],
		Q = this.toArray();
		if (O < 1) {
			return Q
		}
		while ((L += O) < Q.length) {
			P.push(Q.slice(L, L + O))
		}
		return P.collect(N, M)
	}
	function b(N, M) {
		N = N || Prototype.K;
		var L = true;
		this.each(function(P, O) {
			L = L && !!N.call(M, P, O);
			if (!L) {
				throw $break
			}
		});
		return L
	}
	function x(N, M) {
		N = N || Prototype.K;
		var L = false;
		this.each(function(P, O) {
			if (L = !!N.call(M, P, O)) {
				throw $break
			}
		});
		return L
	}
	function y(N, M) {
		N = N || Prototype.K;
		var L = [];
		this.each(function(P, O) {
			L.push(N.call(M, P, O))
		});
		return L
	}
	function I(N, M) {
		var L;
		this.each(function(P, O) {
			if (N.call(M, P, O)) {
				L = P;
				throw $break
			}
		});
		return L
	}
	function u(N, M) {
		var L = [];
		this.each(function(P, O) {
			if (N.call(M, P, O)) {
				L.push(P)
			}
		});
		return L
	}
	function r(O, N, M) {
		N = N || Prototype.K;
		var L = [];
		if (Object.isString(O)) {
			O = new RegExp(RegExp.escape(O))
		}
		this.each(function(Q, P) {
			if (O.match(Q)) {
				L.push(N.call(M, Q, P))
			}
		});
		return L
	}
	function a(L) {
		if (Object.isFunction(this.indexOf)) {
			if (this.indexOf(L) != -1) {
				return true
			}
		}
		var M = false;
		this.each(function(N) {
			if (N == L) {
				M = true;
				throw $break
			}
		});
		return M
	}
	function F(M, L) {
		L = Object.isUndefined(L) ? null: L;
		return this.eachSlice(M,
		function(N) {
			while (N.length < M) {
				N.push(L)
			}
			return N
		})
	}
	function A(L, N, M) {
		this.each(function(P, O) {
			L = N.call(M, L, P, O)
		});
		return L
	}
	function K(M) {
		var L = $A(arguments).slice(1);
		return this.map(function(N) {
			return N[M].apply(N, L)
		})
	}
	function E(N, M) {
		N = N || Prototype.K;
		var L;
		this.each(function(P, O) {
			P = N.call(M, P, O);
			if (L == null || P >= L) {
				L = P
			}
		});
		return L
	}
	function C(N, M) {
		N = N || Prototype.K;
		var L;
		this.each(function(P, O) {
			P = N.call(M, P, O);
			if (L == null || P < L) {
				L = P
			}
		});
		return L
	}
	function o(O, M) {
		O = O || Prototype.K;
		var N = [],
		L = [];
		this.each(function(Q, P) { (O.call(M, Q, P) ? N: L).push(Q)
		});
		return [N, L]
	}
	function q(M) {
		var L = [];
		this.each(function(N) {
			L.push(N[M])
		});
		return L
	}
	function m(N, M) {
		var L = [];
		this.each(function(P, O) {
			if (!N.call(M, P, O)) {
				L.push(P)
			}
		});
		return L
	}
	function B(M, L) {
		return this.map(function(O, N) {
			return {
				value: O,
				criteria: M.call(L, O, N)
			}
		}).sort(function(Q, P) {
			var O = Q.criteria,
			N = P.criteria;
			return O < N ? -1 : O > N ? 1 : 0
		}).pluck("value")
	}
	function D() {
		return this.map()
	}
	function H() {
		var M = Prototype.K,
		L = $A(arguments);
		if (Object.isFunction(L.last())) {
			M = L.pop()
		}
		var N = [this].concat(L).map($A);
		return this.map(function(P, O) {
			return M(N.pluck(O))
		})
	}
	function z() {
		return this.toArray().length
	}
	function J() {
		return "#<Enumerable:" + this.toArray().inspect() + ">"
	}
	return {
		each: g,
		eachSlice: G,
		all: b,
		every: b,
		any: x,
		some: x,
		collect: y,
		map: y,
		detect: I,
		findAll: u,
		select: u,
		filter: u,
		grep: r,
		include: a,
		member: a,
		inGroupsOf: F,
		inject: A,
		invoke: K,
		max: E,
		min: C,
		partition: o,
		pluck: q,
		reject: m,
		sortBy: B,
		toArray: D,
		entries: D,
		zip: H,
		size: z,
		inspect: J,
		find: I
	}
})();
function $A(g) {
	if (!g) {
		return []
	}
	if ("toArray" in Object(g)) {
		return g.toArray()
	}
	var b = g.length || 0,
	a = new Array(b);
	while (b--) {
		a[b] = g[b]
	}
	return a
}
function $w(a) {
	if (!Object.isString(a)) {
		return []
	}
	a = a.strip();
	return a ? a.split(/\s+/) : []
}
Array.from = $A;
(function() {
	var H = Array.prototype,
	B = H.slice,
	D = H.forEach;
	function b(L) {
		for (var K = 0, M = this.length; K < M; K++) {
			L(this[K])
		}
	}
	if (!D) {
		D = b
	}
	function A() {
		this.length = 0;
		return this
	}
	function m() {
		return this[0]
	}
	function r() {
		return this[this.length - 1]
	}
	function x() {
		return this.select(function(K) {
			return K != null
		})
	}
	function J() {
		return this.inject([],
		function(L, K) {
			if (Object.isArray(K)) {
				return L.concat(K.flatten())
			}
			L.push(K);
			return L
		})
	}
	function u() {
		var K = B.call(arguments, 0);
		return this.select(function(L) {
			return ! K.include(L)
		})
	}
	function q(K) {
		return (K !== false ? this: this.toArray())._reverse()
	}
	function z(K) {
		return this.inject([],
		function(N, M, L) {
			if (0 == L || (K ? N.last() != M: !N.include(M))) {
				N.push(M)
			}
			return N
		})
	}
	function E(K) {
		return this.uniq().findAll(function(L) {
			return K.detect(function(M) {
				return L === M
			})
		})
	}
	function F() {
		return B.call(this, 0)
	}
	function y() {
		return this.length
	}
	function I() {
		return "[" + this.map(Object.inspect).join(", ") + "]"
	}
	function G() {
		var K = [];
		this.each(function(L) {
			var M = Object.toJSON(L);
			if (!Object.isUndefined(M)) {
				K.push(M)
			}
		});
		return "[" + K.join(", ") + "]"
	}
	function a(M, K) {
		K || (K = 0);
		var L = this.length;
		if (K < 0) {
			K = L + K
		}
		for (; K < L; K++) {
			if (this[K] === M) {
				return K
			}
		}
		return - 1
	}
	function C(L, K) {
		K = isNaN(K) ? this.length: (K < 0 ? this.length + K: K) + 1;
		var M = this.slice(0, K).reverse().indexOf(L);
		return (M < 0) ? M: K - M - 1
	}
	function g() {
		var P = B.call(this, 0),
		N;
		for (var L = 0, M = arguments.length; L < M; L++) {
			N = arguments[L];
			if (Object.isArray(N) && !("callee" in N)) {
				for (var K = 0, O = N.length; K < O; K++) {
					P.push(N[K])
				}
			} else {
				P.push(N)
			}
		}
		return P
	}
	Object.extend(H, Enumerable);
	if (!H._reverse) {
		H._reverse = H.reverse
	}
	Object.extend(H, {
		_each: D,
		clear: A,
		first: m,
		last: r,
		compact: x,
		flatten: J,
		without: u,
		reverse: q,
		uniq: z,
		intersect: E,
		clone: F,
		toArray: F,
		size: y,
		inspect: I,
		toJSON: G
	});
	var o = (function() {
		return [].concat(arguments)[0][0] !== 1
	})(1, 2);
	if (o) {
		H.concat = g
	}
	if (!H.indexOf) {
		H.indexOf = a
	}
	if (!H.lastIndexOf) {
		H.lastIndexOf = C
	}
})();
function $H(a) {
	return new Hash(a)
}
var Hash = Class.create(Enumerable, (function() {
	function o(F) {
		this._object = Object.isHash(F) ? F.toObject() : Object.clone(F)
	}
	function q(G) {
		for (var F in this._object) {
			var H = this._object[F],
			I = [F, H];
			I.key = F;
			I.value = H;
			G(I)
		}
	}
	function z(F, G) {
		return this._object[F] = G
	}
	function g(F) {
		if (this._object[F] !== Object.prototype[F]) {
			return this._object[F]
		}
	}
	function C(F) {
		var G = this._object[F];
		delete this._object[F];
		return G
	}
	function E() {
		return Object.clone(this._object)
	}
	function D() {
		return this.pluck("key")
	}
	function B() {
		return this.pluck("value")
	}
	function r(G) {
		var F = this.detect(function(H) {
			return H.value === G
		});
		return F && F.key
	}
	function x(F) {
		return this.clone().update(F)
	}
	function m(F) {
		return new Hash(F).inject(this,
		function(G, H) {
			G.set(H.key, H.value);
			return G
		})
	}
	function b(F, G) {
		if (Object.isUndefined(G)) {
			return F
		}
		return F + "=" + encodeURIComponent(String.interpret(G))
	}
	function a() {
		return this.inject([],
		function(H, I) {
			var G = encodeURIComponent(I.key),
			F = I.value;
			if (F && typeof F == "object") {
				if (Object.isArray(F)) {
					return H.concat(F.map(b.curry(G)))
				}
			} else {
				H.push(b(G, F))
			}
			return H
		}).join("&")
	}
	function A() {
		return "#<Hash:{" + this.map(function(F) {
			return F.map(Object.inspect).join(": ")
		}).join(", ") + "}>"
	}
	function y() {
		return Object.toJSON(this.toObject())
	}
	function u() {
		return new Hash(this)
	}
	return {
		initialize: o,
		_each: q,
		set: z,
		get: g,
		unset: C,
		toObject: E,
		toTemplateReplacements: E,
		keys: D,
		values: B,
		index: r,
		merge: x,
		update: m,
		toQueryString: a,
		inspect: A,
		toJSON: y,
		clone: u
	}
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
	function m() {
		return this.toPaddedString(2, 16)
	}
	function o() {
		return this + 1
	}
	function a(z, y) {
		$R(0, this, true).each(z, y);
		return this
	}
	function b(A, z) {
		var y = this.toString(z || 10);
		return "0".times(A - y.length) + y
	}
	function q() {
		return isFinite(this) ? this.toString() : "null"
	}
	function x() {
		return Math.abs(this)
	}
	function u() {
		return Math.round(this)
	}
	function r() {
		return Math.ceil(this)
	}
	function g() {
		return Math.floor(this)
	}
	return {
		toColorPart: m,
		succ: o,
		times: a,
		toPaddedString: b,
		toJSON: q,
		abs: x,
		round: u,
		ceil: r,
		floor: g
	}
})());
function $R(g, a, b) {
	return new ObjectRange(g, a, b)
}
var ObjectRange = Class.create(Enumerable, (function() {
	function b(q, m, o) {
		this.start = q;
		this.end = m;
		this.exclusive = o
	}
	function g(m) {
		var o = this.start;
		while (this.include(o)) {
			m(o);
			o = o.succ()
		}
	}
	function a(m) {
		if (m < this.start) {
			return false
		}
		if (this.exclusive) {
			return m < this.end
		}
		return m <= this.end
	}
	return {
		initialize: b,
		_each: g,
		include: a
	}
})());
var Ajax = {
	getTransport: function() {
		return Try.these(function() {
			return new XMLHttpRequest()
		},
		function() {
			return new ActiveXObject("Msxml2.XMLHTTP")
		},
		function() {
			return new ActiveXObject("Microsoft.XMLHTTP")
		}) || false
	},
	activeRequestCount: 0
};
Ajax.Responders = {
	responders: [],
	_each: function(a) {
		this.responders._each(a)
	},
	register: function(a) {
		if (!this.include(a)) {
			this.responders.push(a)
		}
	},
	unregister: function(a) {
		this.responders = this.responders.without(a)
	},
	dispatch: function(m, b, g, a) {
		this.each(function(o) {
			if (Object.isFunction(o[m])) {
				try {
					o[m].apply(o, [b, g, a])
				} catch(q) {}
			}
		})
	}
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
	onCreate: function() {
		Ajax.activeRequestCount++
	},
	onComplete: function() {
		Ajax.activeRequestCount--
	}
});
Ajax.Base = Class.create({
	initialize: function(a) {
		this.options = {
			method: "post",
			asynchronous: true,
			contentType: "application/x-www-form-urlencoded",
			encoding: "UTF-8",
			parameters: "",
			evalJSON: true,
			evalJS: true
		};
		Object.extend(this.options, a || {});
		this.options.method = this.options.method.toLowerCase();
		if (Object.isString(this.options.parameters)) {
			this.options.parameters = this.options.parameters.toQueryParams()
		} else {
			if (Object.isHash(this.options.parameters)) {
				this.options.parameters = this.options.parameters.toObject()
			}
		}
	}
});
Ajax.Request = Class.create(Ajax.Base, {
	_complete: false,
	initialize: function($super, b, a) {
		$super(a);
		this.transport = Ajax.getTransport();
		this.request(b)
	},
	request: function(b) {
		this.url = b;
		this.method = this.options.method;
		var m = Object.clone(this.options.parameters);
		if (! ["get", "post"].include(this.method)) {
			m._method = this.method;
			this.method = "post"
		}
		this.parameters = m;
		if (m = Object.toQueryString(m)) {
			this.url += (this.url.include("?") ? "&": "?") + m
		}
		try {
			var a = new Ajax.Response(this);
			if (this.options.onCreate) {
				this.options.onCreate(a)
			}
			Ajax.Responders.dispatch("onCreate", this, a);
			this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
			if (this.options.asynchronous) {
				this.respondToReadyState.bind(this).defer(1)
			}
			this.transport.onreadystatechange = this.onStateChange.bind(this);
			this.setRequestHeaders();
			this.body = this.method == "post" ? (this.options.postBody || m) : null;
			this.transport.send(this.body);
			if (!this.options.asynchronous && this.transport.overrideMimeType) {
				this.onStateChange()
			}
		} catch(g) {
			this.dispatchException(g)
		}
	},
	onStateChange: function() {
		var a = this.transport.readyState;
		if (a > 1 && !((a == 4) && this._complete)) {
			this.respondToReadyState(this.transport.readyState)
		}
	},
	setRequestHeaders: function() {
		var o = {
			"X-Requested-With": "XMLHttpRequest",
			"X-Prototype-Version": Prototype.Version,
			Accept: "text/javascript, text/html, application/xml, text/xml, */*"
		};
		if (this.method == "post") {
			o["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding: "");
			if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
				o.Connection = "close"
			}
		}
		if (typeof this.options.requestHeaders == "object") {
			var g = this.options.requestHeaders;
			if (Object.isFunction(g.push)) {
				for (var b = 0, m = g.length; b < m; b += 2) {
					o[g[b]] = g[b + 1]
				}
			} else {
				$H(g).each(function(q) {
					o[q.key] = q.value
				})
			}
		}
		for (var a in o) {
			this.transport.setRequestHeader(a, o[a])
		}
	},
	success: function() {
		var a = this.getStatus();
		return ! a || (a >= 200 && a < 300)
	},
	getStatus: function() {
		try {
			return this.transport.status || 0
		} catch(a) {
			return 0
		}
	},
	respondToReadyState: function(a) {
		var g = Ajax.Request.Events[a],
		b = new Ajax.Response(this);
		if (g == "Complete") {
			try {
				this._complete = true;
				(this.options["on" + b.status] || this.options["on" + (this.success() ? "Success": "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
			} catch(m) {
				this.dispatchException(m)
			}
			var o = b.getHeader("Content-type");
			if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && o && o.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
				this.evalResponse()
			}
		}
		try { (this.options["on" + g] || Prototype.emptyFunction)(b, b.headerJSON);
			Ajax.Responders.dispatch("on" + g, this, b, b.headerJSON)
		} catch(m) {
			this.dispatchException(m)
		}
		if (g == "Complete") {
			this.transport.onreadystatechange = Prototype.emptyFunction
		}
	},
	isSameOrigin: function() {
		var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
		return ! a || (a[0] == "#{protocol}//#{domain}#{port}".interpolate({
			protocol: location.protocol,
			domain: document.domain,
			port: location.port ? ":" + location.port: ""
		}))
	},
	getHeader: function(a) {
		try {
			return this.transport.getResponseHeader(a) || null
		} catch(b) {
			return null
		}
	},
	evalResponse: function() {
		try {
			return eval((this.transport.responseText || "").unfilterJSON())
		} catch(e) {
			this.dispatchException(e)
		}
	},
	dispatchException: function(a) { (this.options.onException || Prototype.emptyFunction)(this, a);
		Ajax.Responders.dispatch("onException", this, a)
	}
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
	initialize: function(g) {
		this.request = g;
		var m = this.transport = g.transport,
		a = this.readyState = m.readyState;
		if ((a > 2 && !Prototype.Browser.IE) || a == 4) {
			this.status = this.getStatus();
			this.statusText = this.getStatusText();
			this.responseText = String.interpret(m.responseText);
			this.headerJSON = this._getHeaderJSON()
		}
		if (a == 4) {
			var b = m.responseXML;
			this.responseXML = Object.isUndefined(b) ? null: b;
			this.responseJSON = this._getResponseJSON()
		}
	},
	status: 0,
	statusText: "",
	getStatus: Ajax.Request.prototype.getStatus,
	getStatusText: function() {
		try {
			return this.transport.statusText || ""
		} catch(a) {
			return ""
		}
	},
	getHeader: Ajax.Request.prototype.getHeader,
	getAllHeaders: function() {
		try {
			return this.getAllResponseHeaders()
		} catch(a) {
			return null
		}
	},
	getResponseHeader: function(a) {
		return this.transport.getResponseHeader(a)
	},
	getAllResponseHeaders: function() {
		return this.transport.getAllResponseHeaders()
	},
	_getHeaderJSON: function() {
		var a = this.getHeader("X-JSON");
		if (!a) {
			return null
		}
		a = decodeURIComponent(escape(a));
		try {
			return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
		} catch(b) {
			this.request.dispatchException(b)
		}
	},
	_getResponseJSON: function() {
		var a = this.request.options;
		if (!a.evalJSON || (a.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
			return null
		}
		try {
			return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
		} catch(b) {
			this.request.dispatchException(b)
		}
	}
});
Ajax.Updater = Class.create(Ajax.Request, {
	initialize: function($super, a, g, b) {
		this.container = {
			success: (a.success || a),
			failure: (a.failure || (a.success ? null: a))
		};
		b = Object.clone(b);
		var m = b.onComplete;
		b.onComplete = (function(o, q) {
			this.updateContent(o.responseText);
			if (Object.isFunction(m)) {
				m(o, q)
			}
		}).bind(this);
		$super(g, b)
	},
	updateContent: function(m) {
		var g = this.container[this.success() ? "success": "failure"],
		a = this.options;
		if (!a.evalScripts) {
			m = m.stripScripts()
		}
		if (g = $(g)) {
			if (a.insertion) {
				if (Object.isString(a.insertion)) {
					var b = {};
					b[a.insertion] = m;
					g.insert(b)
				} else {
					a.insertion(g, m)
				}
			} else {
				g.update(m)
			}
		}
	}
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
	initialize: function($super, a, g, b) {
		$super(b);
		this.onComplete = this.options.onComplete;
		this.frequency = (this.options.frequency || 2);
		this.decay = (this.options.decay || 1);
		this.updater = {};
		this.container = a;
		this.url = g;
		this.start()
	},
	start: function() {
		this.options.onComplete = this.updateComplete.bind(this);
		this.onTimerEvent()
	},
	stop: function() {
		this.updater.options.onComplete = undefined;
		clearTimeout(this.timer);
		(this.onComplete || Prototype.emptyFunction).apply(this, arguments)
	},
	updateComplete: function(a) {
		if (this.options.decay) {
			this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay: 1);
			this.lastText = a.responseText
		}
		this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
	},
	onTimerEvent: function() {
		this.updater = new Ajax.Updater(this.container, this.url, this.options)
	}
});
function $(b) {
	if (arguments.length > 1) {
		for (var a = 0, m = [], g = arguments.length; a < g; a++) {
			m.push($(arguments[a]))
		}
		return m
	}
	if (Object.isString(b)) {
		b = document.getElementById(b)
	}
	return Element.extend(b)
}
if (Prototype.BrowserFeatures.XPath) {
	document._getElementsByXPath = function(q, a) {
		var g = [];
		var o = document.evaluate(q, $(a) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var b = 0, m = o.snapshotLength; b < m; b++) {
			g.push(Element.extend(o.snapshotItem(b)))
		}
		return g
	}
}
if (!window.Node) {
	var Node = {}
}
if (!Node.ELEMENT_NODE) {
	Object.extend(Node, {
		ELEMENT_NODE: 1,
		ATTRIBUTE_NODE: 2,
		TEXT_NODE: 3,
		CDATA_SECTION_NODE: 4,
		ENTITY_REFERENCE_NODE: 5,
		ENTITY_NODE: 6,
		PROCESSING_INSTRUCTION_NODE: 7,
		COMMENT_NODE: 8,
		DOCUMENT_NODE: 9,
		DOCUMENT_TYPE_NODE: 10,
		DOCUMENT_FRAGMENT_NODE: 11,
		NOTATION_NODE: 12
	})
} (function(g) {
	var b = (function() {
		var q = document.createElement("form");
		var o = document.createElement("input");
		var m = document.documentElement;
		o.setAttribute("name", "test");
		q.appendChild(o);
		m.appendChild(q);
		var r = q.elements ? (typeof q.elements.test == "undefined") : null;
		m.removeChild(q);
		q = o = null;
		return r
	})();
	var a = g.Element;
	g.Element = function(q, o) {
		o = o || {};
		q = q.toLowerCase();
		var m = Element.cache;
		if (b && o.name) {
			q = "<" + q + ' name="' + o.name + '">';
			delete o.name;
			return Element.writeAttribute(document.createElement(q), o)
		}
		if (!m[q]) {
			m[q] = Element.extend(document.createElement(q))
		}
		return Element.writeAttribute(m[q].cloneNode(false), o)
	};
	Object.extend(g.Element, a || {});
	if (a) {
		g.Element.prototype = a.prototype
	}
})(this);
Element.cache = {};
Element.idCounter = 1;
Element.Methods = {
	visible: function(a) {
		return $(a).style.display != "none"
	},
	toggle: function(a) {
		a = $(a);
		Element[Element.visible(a) ? "hide": "show"](a);
		return a
	},
	hide: function(a) {
		a = $(a);
		a.style.display = "none";
		return a
	},
	show: function(a) {
		a = $(a);
		a.style.display = "";
		return a
	},
	remove: function(a) {
		a = $(a);
		a.parentNode.removeChild(a);
		return a
	},
	update: (function() {
		var b = (function() {
			var o = document.createElement("select"),
			q = true;
			o.innerHTML = '<option value="test">test</option>';
			if (o.options && o.options[0]) {
				q = o.options[0].nodeName.toUpperCase() !== "OPTION"
			}
			o = null;
			return q
		})();
		var a = (function() {
			try {
				var o = document.createElement("table");
				if (o && o.tBodies) {
					o.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
					var r = typeof o.tBodies[0] == "undefined";
					o = null;
					return r
				}
			} catch(q) {
				return true
			}
		})();
		var m = (function() {
			var o = document.createElement("script"),
			r = false;
			try {
				o.appendChild(document.createTextNode(""));
				r = !o.firstChild || o.firstChild && o.firstChild.nodeType !== 3
			} catch(q) {
				r = true
			}
			o = null;
			return r
		})();
		function g(q, r) {
			q = $(q);
			if (r && r.toElement) {
				r = r.toElement()
			}
			if (Object.isElement(r)) {
				return q.update().insert(r)
			}
			r = Object.toHTML(r);
			var o = q.tagName.toUpperCase();
			if (o === "SCRIPT" && m) {
				q.text = r;
				return q
			}
			if (b || a) {
				if (o in Element._insertionTranslations.tags) {
					while (q.firstChild) {
						q.removeChild(q.firstChild)
					}
					Element._getContentFromAnonymousElement(o, r.stripScripts()).each(function(u) {
						q.appendChild(u)
					})
				} else {
					q.innerHTML = r.stripScripts()
				}
			} else {
				q.innerHTML = r.stripScripts()
			}
			r.evalScripts.bind(r).defer();
			return q
		}
		return g
	})(),
	replace: function(b, g) {
		b = $(b);
		if (g && g.toElement) {
			g = g.toElement()
		} else {
			if (!Object.isElement(g)) {
				g = Object.toHTML(g);
				var a = b.ownerDocument.createRange();
				a.selectNode(b);
				g.evalScripts.bind(g).defer();
				g = a.createContextualFragment(g.stripScripts())
			}
		}
		b.parentNode.replaceChild(g, b);
		return b
	},
	insert: function(g, o) {
		g = $(g);
		if (Object.isString(o) || Object.isNumber(o) || Object.isElement(o) || (o && (o.toElement || o.toHTML))) {
			o = {
				bottom: o
			}
		}
		var m, q, b, r;
		for (var a in o) {
			m = o[a];
			a = a.toLowerCase();
			q = Element._insertionTranslations[a];
			if (m && m.toElement) {
				m = m.toElement()
			}
			if (Object.isElement(m)) {
				q(g, m);
				continue
			}
			m = Object.toHTML(m);
			b = ((a == "before" || a == "after") ? g.parentNode: g).tagName.toUpperCase();
			r = Element._getContentFromAnonymousElement(b, m.stripScripts());
			if (a == "top" || a == "after") {
				r.reverse()
			}
			r.each(q.curry(g));
			m.evalScripts.bind(m).defer()
		}
		return g
	},
	wrap: function(b, g, a) {
		b = $(b);
		if (Object.isElement(g)) {
			$(g).writeAttribute(a || {})
		} else {
			if (Object.isString(g)) {
				g = new Element(g, a)
			} else {
				g = new Element("div", g)
			}
		}
		if (b.parentNode) {
			b.parentNode.replaceChild(g, b)
		}
		g.appendChild(b);
		return g
	},
	inspect: function(b) {
		b = $(b);
		var a = "<" + b.tagName.toLowerCase();
		$H({
			id: "id",
			className: "class"
		}).each(function(q) {
			var o = q.first(),
			g = q.last();
			var m = (b[o] || "").toString();
			if (m) {
				a += " " + g + "=" + m.inspect(true)
			}
		});
		return a + ">"
	},
	recursivelyCollect: function(a, g) {
		a = $(a);
		var b = [];
		while (a = a[g]) {
			if (a.nodeType == 1) {
				b.push(Element.extend(a))
			}
		}
		return b
	},
	ancestors: function(a) {
		return Element.recursivelyCollect(a, "parentNode")
	},
	descendants: function(a) {
		return Element.select(a, "*")
	},
	firstDescendant: function(a) {
		a = $(a).firstChild;
		while (a && a.nodeType != 1) {
			a = a.nextSibling
		}
		return $(a)
	},
	immediateDescendants: function(a) {
		if (! (a = $(a).firstChild)) {
			return []
		}
		while (a && a.nodeType != 1) {
			a = a.nextSibling
		}
		if (a) {
			return [a].concat($(a).nextSiblings())
		}
		return []
	},
	previousSiblings: function(a) {
		return Element.recursivelyCollect(a, "previousSibling")
	},
	nextSiblings: function(a) {
		return Element.recursivelyCollect(a, "nextSibling")
	},
	siblings: function(a) {
		a = $(a);
		return Element.previousSiblings(a).reverse().concat(Element.nextSiblings(a))
	},
	match: function(b, a) {
		if (Object.isString(a)) {
			a = new Selector(a)
		}
		return a.match($(b))
	},
	up: function(b, m, a) {
		b = $(b);
		if (arguments.length == 1) {
			return $(b.parentNode)
		}
		var g = Element.ancestors(b);
		return Object.isNumber(m) ? g[m] : Selector.findElement(g, m, a)
	},
	down: function(b, g, a) {
		b = $(b);
		if (arguments.length == 1) {
			return Element.firstDescendant(b)
		}
		return Object.isNumber(g) ? Element.descendants(b)[g] : Element.select(b, g)[a || 0]
	},
	previous: function(b, m, a) {
		b = $(b);
		if (arguments.length == 1) {
			return $(Selector.handlers.previousElementSibling(b))
		}
		var g = Element.previousSiblings(b);
		return Object.isNumber(m) ? g[m] : Selector.findElement(g, m, a)
	},
	next: function(g, m, b) {
		g = $(g);
		if (arguments.length == 1) {
			return $(Selector.handlers.nextElementSibling(g))
		}
		var a = Element.nextSiblings(g);
		return Object.isNumber(m) ? a[m] : Selector.findElement(a, m, b)
	},
	select: function(b) {
		var a = Array.prototype.slice.call(arguments, 1);
		return Selector.findChildElements(b, a)
	},
	adjacent: function(b) {
		var a = Array.prototype.slice.call(arguments, 1);
		return Selector.findChildElements(b.parentNode, a).without(b)
	},
	identify: function(a) {
		a = $(a);
		var b = Element.readAttribute(a, "id");
		if (b) {
			return b
		}
		do {
			b = "anonymous_element_" + Element.idCounter++
		} while ( $ ( b ));
		Element.writeAttribute(a, "id", b);
		return b
	},
	readAttribute: function(g, a) {
		g = $(g);
		if (Prototype.Browser.IE) {
			var b = Element._attributeTranslations.read;
			if (b.values[a]) {
				return b.values[a](g, a)
			}
			if (b.names[a]) {
				a = b.names[a]
			}
			if (a.include(":")) {
				return (!g.attributes || !g.attributes[a]) ? null: g.attributes[a].value
			}
		}
		return g.getAttribute(a)
	},
	writeAttribute: function(o, g, q) {
		o = $(o);
		var b = {},
		m = Element._attributeTranslations.write;
		if (typeof g == "object") {
			b = g
		} else {
			b[g] = Object.isUndefined(q) ? true: q
		}
		for (var a in b) {
			g = m.names[a] || a;
			q = b[a];
			if (m.values[a]) {
				g = m.values[a](o, q)
			}
			if (q === false || q === null) {
				o.removeAttribute(g)
			} else {
				if (q === true) {
					o.setAttribute(g, g)
				} else {
					o.setAttribute(g, q)
				}
			}
		}
		return o
	},
	getHeight: function(a) {
		return Element.getDimensions(a).height
	},
	getWidth: function(a) {
		return Element.getDimensions(a).width
	},
	classNames: function(a) {
		return new Element.ClassNames(a)
	},
	hasClassName: function(a, b) {
		if (! (a = $(a))) {
			return
		}
		var g = a.className;
		return (g.length > 0 && (g == b || new RegExp("(^|\\s)" + b + "(\\s|$)").test(g)))
	},
	addClassName: function(a, b) {
		if (! (a = $(a))) {
			return
		}
		if (!Element.hasClassName(a, b)) {
			a.className += (a.className ? " ": "") + b
		}
		return a
	},
	removeClassName: function(a, b) {
		if (! (a = $(a))) {
			return
		}
		a.className = a.className.replace(new RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip();
		return a
	},
	toggleClassName: function(a, b) {
		if (! (a = $(a))) {
			return
		}
		return Element[Element.hasClassName(a, b) ? "removeClassName": "addClassName"](a, b)
	},
	cleanWhitespace: function(b) {
		b = $(b);
		var g = b.firstChild;
		while (g) {
			var a = g.nextSibling;
			if (g.nodeType == 3 && !/\S/.test(g.nodeValue)) {
				b.removeChild(g)
			}
			g = a
		}
		return b
	},
	empty: function(a) {
		return $(a).innerHTML.blank()
	},
	descendantOf: function(b, a) {
		b = $(b),
		a = $(a);
		if (b.compareDocumentPosition) {
			return (b.compareDocumentPosition(a) & 8) === 8
		}
		if (a.contains) {
			return a.contains(b) && a !== b
		}
		while (b = b.parentNode) {
			if (b == a) {
				return true
			}
		}
		return false
	},
	scrollTo: function(a) {
		a = $(a);
		var b = Element.cumulativeOffset(a);
		window.scrollTo(b[0], b[1]);
		return a
	},
	getStyle: function(b, g) {
		b = $(b);
		g = g == "float" ? "cssFloat": g.camelize();
		var m = b.style[g];
		if (!m || m == "auto") {
			var a = document.defaultView.getComputedStyle(b, null);
			m = a ? a[g] : null
		}
		if (g == "opacity") {
			return m ? parseFloat(m) : 1
		}
		return m == "auto" ? null: m
	},
	getOpacity: function(a) {
		return $(a).getStyle("opacity")
	},
	setStyle: function(b, g) {
		b = $(b);
		var o = b.style,
		a;
		if (Object.isString(g)) {
			b.style.cssText += ";" + g;
			return g.include("opacity") ? b.setOpacity(g.match(/opacity:\s*(\d?\.?\d*)/)[1]) : b
		}
		for (var m in g) {
			if (m == "opacity") {
				b.setOpacity(g[m])
			} else {
				o[(m == "float" || m == "cssFloat") ? (Object.isUndefined(o.styleFloat) ? "cssFloat": "styleFloat") : m] = g[m]
			}
		}
		return b
	},
	setOpacity: function(a, b) {
		a = $(a);
		a.style.opacity = (b == 1 || b === "") ? "": (b < 0.00001) ? 0 : b;
		return a
	},
	getDimensions: function(g) {
		g = $(g);
		var r = Element.getStyle(g, "display");
		if (r != "none" && r != null) {
			return {
				width: g.offsetWidth,
				height: g.offsetHeight
			}
		}
		var b = g.style;
		var q = b.visibility;
		var m = b.position;
		var a = b.display;
		b.visibility = "hidden";
		if (m != "fixed") {
			b.position = "absolute"
		}
		b.display = "block";
		var u = g.clientWidth;
		var o = g.clientHeight;
		b.display = a;
		b.position = m;
		b.visibility = q;
		return {
			width: u,
			height: o
		}
	},
	makePositioned: function(a) {
		a = $(a);
		var b = Element.getStyle(a, "position");
		if (b == "static" || !b) {
			a._madePositioned = true;
			a.style.position = "relative";
			if (Prototype.Browser.Opera) {
				a.style.top = 0;
				a.style.left = 0
			}
		}
		return a
	},
	undoPositioned: function(a) {
		a = $(a);
		if (a._madePositioned) {
			a._madePositioned = undefined;
			a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = ""
		}
		return a
	},
	makeClipping: function(a) {
		a = $(a);
		if (a._overflow) {
			return a
		}
		a._overflow = Element.getStyle(a, "overflow") || "auto";
		if (a._overflow !== "hidden") {
			a.style.overflow = "hidden"
		}
		return a
	},
	undoClipping: function(a) {
		a = $(a);
		if (!a._overflow) {
			return a
		}
		a.style.overflow = a._overflow == "auto" ? "": a._overflow;
		a._overflow = null;
		return a
	},
	cumulativeOffset: function(b) {
		var a = 0,
		g = 0;
		do {
			a += b.offsetTop || 0;
			g += b.offsetLeft || 0;
			b = b.offsetParent
		} while ( b );
		return Element._returnOffset(g, a)
	},
	positionedOffset: function(b) {
		var a = 0,
		m = 0;
		do {
			a += b.offsetTop || 0;
			m += b.offsetLeft || 0;
			b = b.offsetParent;
			if (b) {
				if (b.tagName.toUpperCase() == "BODY") {
					break
				}
				var g = Element.getStyle(b, "position");
				if (g !== "static") {
					break
				}
			}
		} while ( b );
		return Element._returnOffset(m, a)
	},
	absolutize: function(b) {
		b = $(b);
		if (Element.getStyle(b, "position") == "absolute") {
			return b
		}
		var m = Element.positionedOffset(b);
		var q = m[1];
		var o = m[0];
		var g = b.clientWidth;
		var a = b.clientHeight;
		b._originalLeft = o - parseFloat(b.style.left || 0);
		b._originalTop = q - parseFloat(b.style.top || 0);
		b._originalWidth = b.style.width;
		b._originalHeight = b.style.height;
		b.style.position = "absolute";
		b.style.top = q + "px";
		b.style.left = o + "px";
		b.style.width = g + "px";
		b.style.height = a + "px";
		return b
	},
	relativize: function(a) {
		a = $(a);
		if (Element.getStyle(a, "position") == "relative") {
			return a
		}
		a.style.position = "relative";
		var g = parseFloat(a.style.top || 0) - (a._originalTop || 0);
		var b = parseFloat(a.style.left || 0) - (a._originalLeft || 0);
		a.style.top = g + "px";
		a.style.left = b + "px";
		a.style.height = a._originalHeight;
		a.style.width = a._originalWidth;
		return a
	},
	cumulativeScrollOffset: function(b) {
		var a = 0,
		g = 0;
		do {
			a += b.scrollTop || 0;
			g += b.scrollLeft || 0;
			b = b.parentNode
		} while ( b );
		return Element._returnOffset(g, a)
	},
	getOffsetParent: function(a) {
		if (a.offsetParent) {
			return $(a.offsetParent)
		}
		if (a == document.body) {
			return $(a)
		}
		while ((a = a.parentNode) && a != document.body) {
			if (Element.getStyle(a, "position") != "static") {
				return $(a)
			}
		}
		return $(document.body)
	},
	viewportOffset: function(m) {
		var a = 0,
		g = 0;
		var b = m;
		do {
			a += b.offsetTop || 0;
			g += b.offsetLeft || 0;
			if (b.offsetParent == document.body && Element.getStyle(b, "position") == "absolute") {
				break
			}
		} while ( b = b . offsetParent );
		b = m;
		do {
			if (!Prototype.Browser.Opera || (b.tagName && (b.tagName.toUpperCase() == "BODY"))) {
				a -= b.scrollTop || 0;
				g -= b.scrollLeft || 0
			}
		} while ( b = b . parentNode );
		return Element._returnOffset(g, a)
	},
	clonePosition: function(b, m) {
		var a = Object.extend({
			setLeft: true,
			setTop: true,
			setWidth: true,
			setHeight: true,
			offsetTop: 0,
			offsetLeft: 0
		},
		arguments[2] || {});
		m = $(m);
		var o = Element.viewportOffset(m);
		b = $(b);
		var q = [0, 0];
		var g = null;
		if (Element.getStyle(b, "position") == "absolute") {
			g = Element.getOffsetParent(b);
			q = Element.viewportOffset(g)
		}
		if (g == document.body) {
			q[0] -= document.body.offsetLeft;
			q[1] -= document.body.offsetTop
		}
		if (a.setLeft) {
			b.style.left = (o[0] - q[0] + a.offsetLeft) + "px"
		}
		if (a.setTop) {
			b.style.top = (o[1] - q[1] + a.offsetTop) + "px"
		}
		if (a.setWidth) {
			b.style.width = m.offsetWidth + "px"
		}
		if (a.setHeight) {
			b.style.height = m.offsetHeight + "px"
		}
		return b
	}
};
Object.extend(Element.Methods, {
	getElementsBySelector: Element.Methods.select,
	childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
	write: {
		names: {
			className: "class",
			htmlFor: "for"
		},
		values: {}
	}
};
if (Prototype.Browser.Opera) {
	Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(m, b, g) {
		switch (g) {
		case "left":
		case "top":
		case "right":
		case "bottom":
			if (m(b, "position") === "static") {
				return null
			}
		case "height":
		case "width":
			if (!Element.visible(b)) {
				return null
			}
			var o = parseInt(m(b, g), 10);
			if (o !== b["offset" + g.capitalize()]) {
				return o + "px"
			}
			var a;
			if (g === "height") {
				a = ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"]
			} else {
				a = ["border-left-width", "padding-left", "padding-right", "border-right-width"]
			}
			return a.inject(o,
			function(q, r) {
				var u = m(b, r);
				return u === null ? q: q - parseInt(u, 10)
			}) + "px";
		default:
			return m(b, g)
		}
	});
	Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(g, a, b) {
		if (b === "title") {
			return a.title
		}
		return g(a, b)
	})
} else {
	if (Prototype.Browser.IE) {
		Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(function(g, b) {
			b = $(b);
			try {
				b.offsetParent
			} catch(o) {
				return $(document.body)
			}
			var a = b.getStyle("position");
			if (a !== "static") {
				return g(b)
			}
			b.setStyle({
				position: "relative"
			});
			var m = g(b);
			b.setStyle({
				position: a
			});
			return m
		});
		$w("positionedOffset viewportOffset").each(function(a) {
			Element.Methods[a] = Element.Methods[a].wrap(function(o, g) {
				g = $(g);
				try {
					g.offsetParent
				} catch(r) {
					return Element._returnOffset(0, 0)
				}
				var b = g.getStyle("position");
				if (b !== "static") {
					return o(g)
				}
				var m = g.getOffsetParent();
				if (m && m.getStyle("position") === "fixed") {
					m.setStyle({
						zoom: 1
					})
				}
				g.setStyle({
					position: "relative"
				});
				var q = o(g);
				g.setStyle({
					position: b
				});
				return q
			})
		});
		Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(function(b, a) {
			try {
				a.offsetParent
			} catch(g) {
				return Element._returnOffset(0, 0)
			}
			return b(a)
		});
		Element.Methods.getStyle = function(a, b) {
			a = $(a);
			b = (b == "float" || b == "cssFloat") ? "styleFloat": b.camelize();
			var g = a.style[b];
			if (!g && a.currentStyle) {
				g = a.currentStyle[b]
			}
			if (b == "opacity") {
				if (g = (a.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
					if (g[1]) {
						return parseFloat(g[1]) / 100
					}
				}
				return 1
			}
			if (g == "auto") {
				if ((b == "width" || b == "height") && (a.getStyle("display") != "none")) {
					return a["offset" + b.capitalize()] + "px"
				}
				return null
			}
			return g
		};
		Element.Methods.setOpacity = function(b, o) {
			function q(r) {
				return r.replace(/alpha\([^\)]*\)/gi, "")
			}
			b = $(b);
			var a = b.currentStyle;
			if ((a && !a.hasLayout) || (!a && b.style.zoom == "normal")) {
				b.style.zoom = 1
			}
			var m = b.getStyle("filter"),
			g = b.style;
			if (o == 1 || o === "") { (m = q(m)) ? g.filter = m: g.removeAttribute("filter");
				return b
			} else {
				if (o < 0.00001) {
					o = 0
				}
			}
			g.filter = q(m) + "alpha(opacity=" + (o * 100) + ")";
			return b
		};
		Element._attributeTranslations = (function() {
			var b = "className";
			var a = "for";
			var g = document.createElement("div");
			g.setAttribute(b, "x");
			if (g.className !== "x") {
				g.setAttribute("class", "x");
				if (g.className === "x") {
					b = "class"
				}
			}
			g = null;
			g = document.createElement("label");
			g.setAttribute(a, "x");
			if (g.htmlFor !== "x") {
				g.setAttribute("htmlFor", "x");
				if (g.htmlFor === "x") {
					a = "htmlFor"
				}
			}
			g = null;
			return {
				read: {
					names: {
						"class": b,
						className: b,
						"for": a,
						htmlFor: a
					},
					values: {
						_getAttr: function(m, o) {
							return m.getAttribute(o)
						},
						_getAttr2: function(m, o) {
							return m.getAttribute(o, 2)
						},
						_getAttrNode: function(m, q) {
							var o = m.getAttributeNode(q);
							return o ? o.value: ""
						},
						_getEv: (function() {
							var m = document.createElement("div");
							m.onclick = Prototype.emptyFunction;
							var q = m.getAttribute("onclick");
							var o;
							if (String(q).indexOf("{") > -1) {
								o = function(r, u) {
									u = r.getAttribute(u);
									if (!u) {
										return null
									}
									u = u.toString();
									u = u.split("{")[1];
									u = u.split("}")[0];
									return u.strip()
								}
							} else {
								if (q === "") {
									o = function(r, u) {
										u = r.getAttribute(u);
										if (!u) {
											return null
										}
										return u.strip()
									}
								}
							}
							m = null;
							return o
						})(),
						_flag: function(m, o) {
							return $(m).hasAttribute(o) ? o: null
						},
						style: function(m) {
							return m.style.cssText.toLowerCase()
						},
						title: function(m) {
							return m.title
						}
					}
				}
			}
		})();
		Element._attributeTranslations.write = {
			names: Object.extend({
				cellpadding: "cellPadding",
				cellspacing: "cellSpacing"
			},
			Element._attributeTranslations.read.names),
			values: {
				checked: function(a, b) {
					a.checked = !!b
				},
				style: function(a, b) {
					a.style.cssText = b ? b: ""
				}
			}
		};
		Element._attributeTranslations.has = {};
		$w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function(a) {
			Element._attributeTranslations.write.names[a.toLowerCase()] = a;
			Element._attributeTranslations.has[a.toLowerCase()] = a
		});
		(function(a) {
			Object.extend(a, {
				href: a._getAttr2,
				src: a._getAttr2,
				type: a._getAttr,
				action: a._getAttrNode,
				disabled: a._flag,
				checked: a._flag,
				readonly: a._flag,
				multiple: a._flag,
				onload: a._getEv,
				onunload: a._getEv,
				onclick: a._getEv,
				ondblclick: a._getEv,
				onmousedown: a._getEv,
				onmouseup: a._getEv,
				onmouseover: a._getEv,
				onmousemove: a._getEv,
				onmouseout: a._getEv,
				onfocus: a._getEv,
				onblur: a._getEv,
				onkeypress: a._getEv,
				onkeydown: a._getEv,
				onkeyup: a._getEv,
				onsubmit: a._getEv,
				onreset: a._getEv,
				onselect: a._getEv,
				onchange: a._getEv
			})
		})(Element._attributeTranslations.read.values);
		if (Prototype.BrowserFeatures.ElementExtensions) { (function() {
				function a(o) {
					var b = o.getElementsByTagName("*"),
					m = [];
					for (var g = 0, q; q = b[g]; g++) {
						if (q.tagName !== "!") {
							m.push(q)
						}
					}
					return m
				}
				Element.Methods.down = function(g, m, b) {
					g = $(g);
					if (arguments.length == 1) {
						return g.firstDescendant()
					}
					return Object.isNumber(m) ? a(g)[m] : Element.select(g, m)[b || 0]
				}
			})()
		}
	} else {
		if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
			Element.Methods.setOpacity = function(a, b) {
				a = $(a);
				a.style.opacity = (b == 1) ? 0.999999 : (b === "") ? "": (b < 0.00001) ? 0 : b;
				return a
			}
		} else {
			if (Prototype.Browser.WebKit) {
				Element.Methods.setOpacity = function(a, b) {
					a = $(a);
					a.style.opacity = (b == 1 || b === "") ? "": (b < 0.00001) ? 0 : b;
					if (b == 1) {
						if (a.tagName.toUpperCase() == "IMG" && a.width) {
							a.width++;
							a.width--
						} else {
							try {
								var m = document.createTextNode(" ");
								a.appendChild(m);
								a.removeChild(m)
							} catch(g) {}
						}
					}
					return a
				};
				Element.Methods.cumulativeOffset = function(b) {
					var a = 0,
					g = 0;
					do {
						a += b.offsetTop || 0;
						g += b.offsetLeft || 0;
						if (b.offsetParent == document.body) {
							if (Element.getStyle(b, "position") == "absolute") {
								break
							}
						}
						b = b.offsetParent
					} while ( b );
					return Element._returnOffset(g, a)
				}
			}
		}
	}
}
if ("outerHTML" in document.documentElement) {
	Element.Methods.replace = function(g, o) {
		g = $(g);
		if (o && o.toElement) {
			o = o.toElement()
		}
		if (Object.isElement(o)) {
			g.parentNode.replaceChild(o, g);
			return g
		}
		o = Object.toHTML(o);
		var m = g.parentNode,
		b = m.tagName.toUpperCase();
		if (Element._insertionTranslations.tags[b]) {
			var q = g.next();
			var a = Element._getContentFromAnonymousElement(b, o.stripScripts());
			m.removeChild(g);
			if (q) {
				a.each(function(r) {
					m.insertBefore(r, q)
				})
			} else {
				a.each(function(r) {
					m.appendChild(r)
				})
			}
		} else {
			g.outerHTML = o.stripScripts()
		}
		o.evalScripts.bind(o).defer();
		return g
	}
}
Element._returnOffset = function(b, g) {
	var a = [b, g];
	a.left = b;
	a.top = g;
	return a
};
Element._getContentFromAnonymousElement = function(g, b) {
	var m = new Element("div"),
	a = Element._insertionTranslations.tags[g];
	if (a) {
		m.innerHTML = a[0] + b + a[1];
		a[2].times(function() {
			m = m.firstChild
		})
	} else {
		m.innerHTML = b
	}
	return $A(m.childNodes)
};
Element._insertionTranslations = {
	before: function(a, b) {
		a.parentNode.insertBefore(b, a)
	},
	top: function(a, b) {
		a.insertBefore(b, a.firstChild)
	},
	bottom: function(a, b) {
		a.appendChild(b)
	},
	after: function(a, b) {
		a.parentNode.insertBefore(b, a.nextSibling)
	},
	tags: {
		TABLE: ["<table>", "</table>", 1],
		TBODY: ["<table><tbody>", "</tbody></table>", 2],
		TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
		TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
		SELECT: ["<select>", "</select>", 1]
	}
};
(function() {
	var a = Element._insertionTranslations.tags;
	Object.extend(a, {
		THEAD: a.TBODY,
		TFOOT: a.TBODY,
		TH: a.TD
	})
})();
Element.Methods.Simulated = {
	hasAttribute: function(a, g) {
		g = Element._attributeTranslations.has[g] || g;
		var b = $(a).getAttributeNode(g);
		return !! (b && b.specified)
	}
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function(a) {
	if (!Prototype.BrowserFeatures.ElementExtensions && a.__proto__) {
		window.HTMLElement = {};
		window.HTMLElement.prototype = a.__proto__;
		Prototype.BrowserFeatures.ElementExtensions = true
	}
	a = null
})(document.createElement("div"));
Element.extend = (function() {
	function g(r) {
		if (typeof window.Element != "undefined") {
			var x = window.Element.prototype;
			if (x) {
				var z = "_" + (Math.random() + "").slice(2);
				var u = document.createElement(r);
				x[z] = "x";
				var y = (u[z] !== "x");
				delete x[z];
				u = null;
				return y
			}
		}
		return false
	}
	function b(u, r) {
		for (var y in r) {
			var x = r[y];
			if (Object.isFunction(x) && !(y in u)) {
				u[y] = x.methodize()
			}
		}
	}
	var m = g("object");
	if (Prototype.BrowserFeatures.SpecificElementExtensions) {
		if (m) {
			return function(u) {
				if (u && typeof u._extendedByPrototype == "undefined") {
					var r = u.tagName;
					if (r && (/^(?:object|applet|embed)$/i.test(r))) {
						b(u, Element.Methods);
						b(u, Element.Methods.Simulated);
						b(u, Element.Methods.ByTag[r.toUpperCase()])
					}
				}
				return u
			}
		}
		return Prototype.K
	}
	var a = {},
	o = Element.Methods.ByTag;
	var q = Object.extend(function(x) {
		if (!x || typeof x._extendedByPrototype != "undefined" || x.nodeType != 1 || x == window) {
			return x
		}
		var r = Object.clone(a),
		u = x.tagName.toUpperCase();
		if (o[u]) {
			Object.extend(r, o[u])
		}
		b(x, r);
		x._extendedByPrototype = Prototype.emptyFunction;
		return x
	},
	{
		refresh: function() {
			if (!Prototype.BrowserFeatures.ElementExtensions) {
				Object.extend(a, Element.Methods);
				Object.extend(a, Element.Methods.Simulated)
			}
		}
	});
	q.refresh();
	return q
})();
Element.hasAttribute = function(a, b) {
	if (a.hasAttribute) {
		return a.hasAttribute(b)
	}
	return Element.Methods.Simulated.hasAttribute(a, b)
};
Element.addMethods = function(g) {
	var x = Prototype.BrowserFeatures,
	m = Element.Methods.ByTag;
	if (!g) {
		Object.extend(Form, Form.Methods);
		Object.extend(Form.Element, Form.Element.Methods);
		Object.extend(Element.Methods.ByTag, {
			FORM: Object.clone(Form.Methods),
			INPUT: Object.clone(Form.Element.Methods),
			SELECT: Object.clone(Form.Element.Methods),
			TEXTAREA: Object.clone(Form.Element.Methods)
		})
	}
	if (arguments.length == 2) {
		var b = g;
		g = arguments[1]
	}
	if (!b) {
		Object.extend(Element.Methods, g || {})
	} else {
		if (Object.isArray(b)) {
			b.each(r)
		} else {
			r(b)
		}
	}
	function r(z) {
		z = z.toUpperCase();
		if (!Element.Methods.ByTag[z]) {
			Element.Methods.ByTag[z] = {}
		}
		Object.extend(Element.Methods.ByTag[z], g)
	}
	function a(B, A, z) {
		z = z || false;
		for (var D in B) {
			var C = B[D];
			if (!Object.isFunction(C)) {
				continue
			}
			if (!z || !(D in A)) {
				A[D] = C.methodize()
			}
		}
	}
	function o(C) {
		var z;
		var B = {
			OPTGROUP: "OptGroup",
			TEXTAREA: "TextArea",
			P: "Paragraph",
			FIELDSET: "FieldSet",
			UL: "UList",
			OL: "OList",
			DL: "DList",
			DIR: "Directory",
			H1: "Heading",
			H2: "Heading",
			H3: "Heading",
			H4: "Heading",
			H5: "Heading",
			H6: "Heading",
			Q: "Quote",
			INS: "Mod",
			DEL: "Mod",
			A: "Anchor",
			IMG: "Image",
			CAPTION: "TableCaption",
			COL: "TableCol",
			COLGROUP: "TableCol",
			THEAD: "TableSection",
			TFOOT: "TableSection",
			TBODY: "TableSection",
			TR: "TableRow",
			TH: "TableCell",
			TD: "TableCell",
			FRAMESET: "FrameSet",
			IFRAME: "IFrame"
		};
		if (B[C]) {
			z = "HTML" + B[C] + "Element"
		}
		if (window[z]) {
			return window[z]
		}
		z = "HTML" + C + "Element";
		if (window[z]) {
			return window[z]
		}
		z = "HTML" + C.capitalize() + "Element";
		if (window[z]) {
			return window[z]
		}
		var A = document.createElement(C);
		var D = A.__proto__ || A.constructor.prototype;
		A = null;
		return D
	}
	var u = window.HTMLElement ? HTMLElement.prototype: Element.prototype;
	if (x.ElementExtensions) {
		a(Element.Methods, u);
		a(Element.Methods.Simulated, u, true)
	}
	if (x.SpecificElementExtensions) {
		for (var y in Element.Methods.ByTag) {
			var q = o(y);
			if (Object.isUndefined(q)) {
				continue
			}
			a(m[y], q.prototype)
		}
	}
	Object.extend(Element, Element.Methods);
	delete Element.ByTag;
	if (Element.extend.refresh) {
		Element.extend.refresh()
	}
	Element.cache = {}
};
document.viewport = {
	getDimensions: function() {
		return {
			width: this.getWidth(),
			height: this.getHeight()
		}
	},
	getScrollOffsets: function() {
		return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
	}
};
(function(b) {
	var r = Prototype.Browser,
	o = document,
	g, m = {};
	function a() {
		if (r.WebKit && !o.evaluate) {
			return document
		}
		if (r.Opera && window.parseFloat(window.opera.version()) < 9.5) {
			return document.body
		}
		return document.documentElement
	}
	function q(u) {
		if (!g) {
			g = a()
		}
		m[u] = "client" + u;
		b["get" + u] = function() {
			return g[m[u]]
		};
		return b["get" + u]()
	}
	b.getWidth = q.curry("Width");
	b.getHeight = q.curry("Height")
})(document.viewport);
Element.Storage = {
	UID: 1
};
Element.addMethods({
	getStorage: function(b) {
		if (! (b = $(b))) {
			return
		}
		var a;
		if (b === window) {
			a = 0
		} else {
			if (typeof b._prototypeUID === "undefined") {
				b._prototypeUID = [Element.Storage.UID++]
			}
			a = b._prototypeUID[0]
		}
		if (!Element.Storage[a]) {
			Element.Storage[a] = $H()
		}
		return Element.Storage[a]
	},
	store: function(b, a, g) {
		if (! (b = $(b))) {
			return
		}
		if (arguments.length === 2) {
			Element.getStorage(b).update(a)
		} else {
			Element.getStorage(b).set(a, g)
		}
		return b
	},
	retrieve: function(g, b, a) {
		if (! (g = $(g))) {
			return
		}
		var o = Element.getStorage(g),
		m = o.get(b);
		if (Object.isUndefined(m)) {
			o.set(b, a);
			m = a
		}
		return m
	},
	clone: function(g, a) {
		if (! (g = $(g))) {
			return
		}
		var o = g.cloneNode(a);
		o._prototypeUID = void 0;
		if (a) {
			var m = Element.select(o, "*"),
			b = m.length;
			while (b--) {
				m[b]._prototypeUID = void 0
			}
		}
		return Element.extend(o)
	}
});
var Selector = Class.create({
	initialize: function(a) {
		this.expression = a.strip();
		if (this.shouldUseSelectorsAPI()) {
			this.mode = "selectorsAPI"
		} else {
			if (this.shouldUseXPath()) {
				this.mode = "xpath";
				this.compileXPathMatcher()
			} else {
				this.mode = "normal";
				this.compileMatcher()
			}
		}
	},
	shouldUseXPath: (function() {
		var a = (function() {
			var o = false;
			if (document.evaluate && window.XPathResult) {
				var m = document.createElement("div");
				m.innerHTML = "<ul><li></li></ul><div><ul><li></li></ul></div>";
				var g = ".//*[local-name()='ul' or local-name()='UL']//*[local-name()='li' or local-name()='LI']";
				var b = document.evaluate(g, m, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				o = (b.snapshotLength !== 2);
				m = null
			}
			return o
		})();
		return function() {
			if (!Prototype.BrowserFeatures.XPath) {
				return false
			}
			var b = this.expression;
			if (Prototype.Browser.WebKit && (b.include("-of-type") || b.include(":empty"))) {
				return false
			}
			if ((/(\[[\w-]*?:|:checked)/).test(b)) {
				return false
			}
			if (a) {
				return false
			}
			return true
		}
	})(),
	shouldUseSelectorsAPI: function() {
		if (!Prototype.BrowserFeatures.SelectorsAPI) {
			return false
		}
		if (Selector.CASE_INSENSITIVE_CLASS_NAMES) {
			return false
		}
		if (!Selector._div) {
			Selector._div = new Element("div")
		}
		try {
			Selector._div.querySelector(this.expression)
		} catch(a) {
			return false
		}
		return true
	},
	compileMatcher: function() {
		var e = this.expression,
		ps = Selector.patterns,
		h = Selector.handlers,
		c = Selector.criteria,
		le, p, m, len = ps.length,
		name;
		if (Selector._cache[e]) {
			this.matcher = Selector._cache[e];
			return
		}
		this.matcher = ["this.matcher = function(root) {", "var r = root, h = Selector.handlers, c = false, n;"];
		while (e && le != e && (/\S/).test(e)) {
			le = e;
			for (var i = 0; i < len; i++) {
				p = ps[i].re;
				name = ps[i].name;
				if (m = e.match(p)) {
					this.matcher.push(Object.isFunction(c[name]) ? c[name](m) : new Template(c[name]).evaluate(m));
					e = e.replace(m[0], "");
					break
				}
			}
		}
		this.matcher.push("return h.unique(n);\n}");
		eval(this.matcher.join("\n"));
		Selector._cache[this.expression] = this.matcher
	},
	compileXPathMatcher: function() {
		var u = this.expression,
		y = Selector.patterns,
		g = Selector.xpath,
		r, b, a = y.length,
		o;
		if (Selector._cache[u]) {
			this.xpath = Selector._cache[u];
			return
		}
		this.matcher = [".//*"];
		while (u && r != u && (/\S/).test(u)) {
			r = u;
			for (var q = 0; q < a; q++) {
				o = y[q].name;
				if (b = u.match(y[q].re)) {
					this.matcher.push(Object.isFunction(g[o]) ? g[o](b) : new Template(g[o]).evaluate(b));
					u = u.replace(b[0], "");
					break
				}
			}
		}
		this.xpath = this.matcher.join("");
		Selector._cache[this.expression] = this.xpath
	},
	findElements: function(a) {
		a = a || document;
		var g = this.expression,
		b;
		switch (this.mode) {
		case "selectorsAPI":
			if (a !== document) {
				var m = a.id,
				o = $(a).identify();
				o = o.replace(/([\.:])/g, "\\$1");
				g = "#" + o + " " + g
			}
			b = $A(a.querySelectorAll(g)).map(Element.extend);
			a.id = m;
			return b;
		case "xpath":
			return document._getElementsByXPath(this.xpath, a);
		default:
			return this.matcher(a)
		}
	},
	match: function(y) {
		this.tokens = [];
		var C = this.expression,
		a = Selector.patterns,
		q = Selector.assertions;
		var b, o, r, B = a.length,
		g;
		while (C && b !== C && (/\S/).test(C)) {
			b = C;
			for (var x = 0; x < B; x++) {
				o = a[x].re;
				g = a[x].name;
				if (r = C.match(o)) {
					if (q[g]) {
						this.tokens.push([g, Object.clone(r)]);
						C = C.replace(r[0], "")
					} else {
						return this.findElements(document).include(y)
					}
				}
			}
		}
		var A = true,
		g, z;
		for (var x = 0, u; u = this.tokens[x]; x++) {
			g = u[0],
			z = u[1];
			if (!Selector.assertions[g](y, z)) {
				A = false;
				break
			}
		}
		return A
	},
	toString: function() {
		return this.expression
	},
	inspect: function() {
		return "#<Selector:" + this.expression.inspect() + ">"
	}
});
if (Prototype.BrowserFeatures.SelectorsAPI && document.compatMode === "BackCompat") {
	Selector.CASE_INSENSITIVE_CLASS_NAMES = (function() {
		var g = document.createElement("div"),
		a = document.createElement("span");
		g.id = "prototype_test_id";
		a.className = "Test";
		g.appendChild(a);
		var b = (g.querySelector("#prototype_test_id .test") !== null);
		g = a = null;
		return b
	})()
}
Object.extend(Selector, {
	_cache: {},
	xpath: {
		descendant: "//*",
		child: "/*",
		adjacent: "/following-sibling::*[1]",
		laterSibling: "/following-sibling::*",
		tagName: function(a) {
			if (a[1] == "*") {
				return ""
			}
			return "[local-name()='" + a[1].toLowerCase() + "' or local-name()='" + a[1].toUpperCase() + "']"
		},
		className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
		id: "[@id='#{1}']",
		attrPresence: function(a) {
			a[1] = a[1].toLowerCase();
			return new Template("[@#{1}]").evaluate(a)
		},
		attr: function(a) {
			a[1] = a[1].toLowerCase();
			a[3] = a[5] || a[6];
			return new Template(Selector.xpath.operators[a[2]]).evaluate(a)
		},
		pseudo: function(a) {
			var b = Selector.xpath.pseudos[a[1]];
			if (!b) {
				return ""
			}
			if (Object.isFunction(b)) {
				return b(a)
			}
			return new Template(Selector.xpath.pseudos[a[1]]).evaluate(a)
		},
		operators: {
			"=": "[@#{1}='#{3}']",
			"!=": "[@#{1}!='#{3}']",
			"^=": "[starts-with(@#{1}, '#{3}')]",
			"$=": "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
			"*=": "[contains(@#{1}, '#{3}')]",
			"~=": "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
			"|=": "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
		},
		pseudos: {
			"first-child": "[not(preceding-sibling::*)]",
			"last-child": "[not(following-sibling::*)]",
			"only-child": "[not(preceding-sibling::* or following-sibling::*)]",
			empty: "[count(*) = 0 and (count(text()) = 0)]",
			checked: "[@checked]",
			disabled: "[(@disabled) and (@type!='hidden')]",
			enabled: "[not(@disabled) and (@type!='hidden')]",
			not: function(q) {
				var y = q[6],
				g = Selector.patterns,
				z = Selector.xpath,
				a,
				A,
				u = g.length,
				b;
				var o = [];
				while (y && a != y && (/\S/).test(y)) {
					a = y;
					for (var r = 0; r < u; r++) {
						b = g[r].name;
						if (q = y.match(g[r].re)) {
							A = Object.isFunction(z[b]) ? z[b](q) : new Template(z[b]).evaluate(q);
							o.push("(" + A.substring(1, A.length - 1) + ")");
							y = y.replace(q[0], "");
							break
						}
					}
				}
				return "[not(" + o.join(" and ") + ")]"
			},
			"nth-child": function(a) {
				return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", a)
			},
			"nth-last-child": function(a) {
				return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", a)
			},
			"nth-of-type": function(a) {
				return Selector.xpath.pseudos.nth("position() ", a)
			},
			"nth-last-of-type": function(a) {
				return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", a)
			},
			"first-of-type": function(a) {
				a[6] = "1";
				return Selector.xpath.pseudos["nth-of-type"](a)
			},
			"last-of-type": function(a) {
				a[6] = "1";
				return Selector.xpath.pseudos["nth-last-of-type"](a)
			},
			"only-of-type": function(a) {
				var b = Selector.xpath.pseudos;
				return b["first-of-type"](a) + b["last-of-type"](a)
			},
			nth: function(u, q) {
				var x, y = q[6],
				o;
				if (y == "even") {
					y = "2n+0"
				}
				if (y == "odd") {
					y = "2n+1"
				}
				if (x = y.match(/^(\d+)$/)) {
					return "[" + u + "= " + x[1] + "]"
				}
				if (x = y.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
					if (x[1] == "-") {
						x[1] = -1
					}
					var r = x[1] ? Number(x[1]) : 1;
					var g = x[2] ? Number(x[2]) : 0;
					o = "[((#{fragment} - #{b}) mod #{a} = 0) and ((#{fragment} - #{b}) div #{a} >= 0)]";
					return new Template(o).evaluate({
						fragment: u,
						a: r,
						b: g
					})
				}
			}
		}
	},
	criteria: {
		tagName: 'n = h.tagName(n, r, "#{1}", c);      c = false;',
		className: 'n = h.className(n, r, "#{1}", c);    c = false;',
		id: 'n = h.id(n, r, "#{1}", c);           c = false;',
		attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
		attr: function(a) {
			a[3] = (a[5] || a[6]);
			return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(a)
		},
		pseudo: function(a) {
			if (a[6]) {
				a[6] = a[6].replace(/"/g, '\\"')
			}
			return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(a)
		},
		descendant: 'c = "descendant";',
		child: 'c = "child";',
		adjacent: 'c = "adjacent";',
		laterSibling: 'c = "laterSibling";'
	},
	patterns: [{
		name: "laterSibling",
		re: /^\s*~\s*/
	},
	{
		name: "child",
		re: /^\s*>\s*/
	},
	{
		name: "adjacent",
		re: /^\s*\+\s*/
	},
	{
		name: "descendant",
		re: /^\s/
	},
	{
		name: "tagName",
		re: /^\s*(\*|[\w\-]+)(\b|$)?/
	},
	{
		name: "id",
		re: /^#([\w\-\*]+)(\b|$)/
	},
	{
		name: "className",
		re: /^\.([\w\-\*]+)(\b|$)/
	},
	{
		name: "pseudo",
		re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/
	},
	{
		name: "attrPresence",
		re: /^\[((?:[\w-]+:)?[\w-]+)\]/
	},
	{
		name: "attr",
		re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
	}],
	assertions: {
		tagName: function(a, b) {
			return b[1].toUpperCase() == a.tagName.toUpperCase()
		},
		className: function(a, b) {
			return Element.hasClassName(a, b[1])
		},
		id: function(a, b) {
			return a.id === b[1]
		},
		attrPresence: function(a, b) {
			return Element.hasAttribute(a, b[1])
		},
		attr: function(b, g) {
			var a = Element.readAttribute(b, g[1]);
			return a && Selector.operators[g[2]](a, g[5] || g[6])
		}
	},
	handlers: {
		concat: function(m, g) {
			for (var o = 0, q; q = g[o]; o++) {
				m.push(q)
			}
			return m
		},
		mark: function(a) {
			var m = Prototype.emptyFunction;
			for (var b = 0, g; g = a[b]; b++) {
				g._countedByPrototype = m
			}
			return a
		},
		unmark: (function() {
			var a = (function() {
				var b = document.createElement("div"),
				o = false,
				m = "_countedByPrototype",
				g = "x";
				b[m] = g;
				o = (b.getAttribute(m) === g);
				b = null;
				return o
			})();
			return a ?
			function(b) {
				for (var g = 0, m; m = b[g]; g++) {
					m.removeAttribute("_countedByPrototype")
				}
				return b
			}: function(b) {
				for (var g = 0, m; m = b[g]; g++) {
					m._countedByPrototype = void 0
				}
				return b
			}
		})(),
		index: function(a, m, r) {
			a._countedByPrototype = Prototype.emptyFunction;
			if (m) {
				for (var b = a.childNodes, o = b.length - 1, g = 1; o >= 0; o--) {
					var q = b[o];
					if (q.nodeType == 1 && (!r || q._countedByPrototype)) {
						q.nodeIndex = g++
					}
				}
			} else {
				for (var o = 0, g = 1, b = a.childNodes; q = b[o]; o++) {
					if (q.nodeType == 1 && (!r || q._countedByPrototype)) {
						q.nodeIndex = g++
					}
				}
			}
		},
		unique: function(b) {
			if (b.length == 0) {
				return b
			}
			var m = [],
			o;
			for (var g = 0, a = b.length; g < a; g++) {
				if (typeof(o = b[g])._countedByPrototype == "undefined") {
					o._countedByPrototype = Prototype.emptyFunction;
					m.push(Element.extend(o))
				}
			}
			return Selector.handlers.unmark(m)
		},
		descendant: function(a) {
			var m = Selector.handlers;
			for (var g = 0, b = [], o; o = a[g]; g++) {
				m.concat(b, o.getElementsByTagName("*"))
			}
			return b
		},
		child: function(a) {
			var o = Selector.handlers;
			for (var m = 0, g = [], q; q = a[m]; m++) {
				for (var b = 0, r; r = q.childNodes[b]; b++) {
					if (r.nodeType == 1 && r.tagName != "!") {
						g.push(r)
					}
				}
			}
			return g
		},
		adjacent: function(a) {
			for (var g = 0, b = [], o; o = a[g]; g++) {
				var m = this.nextElementSibling(o);
				if (m) {
					b.push(m)
				}
			}
			return b
		},
		laterSibling: function(a) {
			var m = Selector.handlers;
			for (var g = 0, b = [], o; o = a[g]; g++) {
				m.concat(b, Element.nextSiblings(o))
			}
			return b
		},
		nextElementSibling: function(a) {
			while (a = a.nextSibling) {
				if (a.nodeType == 1) {
					return a
				}
			}
			return null
		},
		previousElementSibling: function(a) {
			while (a = a.previousSibling) {
				if (a.nodeType == 1) {
					return a
				}
			}
			return null
		},
		tagName: function(a, u, g, b) {
			var x = g.toUpperCase();
			var o = [],
			r = Selector.handlers;
			if (a) {
				if (b) {
					if (b == "descendant") {
						for (var q = 0, m; m = a[q]; q++) {
							r.concat(o, m.getElementsByTagName(g))
						}
						return o
					} else {
						a = this[b](a)
					}
					if (g == "*") {
						return a
					}
				}
				for (var q = 0, m; m = a[q]; q++) {
					if (m.tagName.toUpperCase() === x) {
						o.push(m)
					}
				}
				return o
			} else {
				return u.getElementsByTagName(g)
			}
		},
		id: function(a, x, b, g) {
			var u = $(b),
			r = Selector.handlers;
			if (x == document) {
				if (!u) {
					return []
				}
				if (!a) {
					return [u]
				}
			} else {
				if (!x.sourceIndex || x.sourceIndex < 1) {
					var a = x.getElementsByTagName("*");
					for (var o = 0, m; m = a[o]; o++) {
						if (m.id === b) {
							return [m]
						}
					}
				}
			}
			if (a) {
				if (g) {
					if (g == "child") {
						for (var q = 0, m; m = a[q]; q++) {
							if (u.parentNode == m) {
								return [u]
							}
						}
					} else {
						if (g == "descendant") {
							for (var q = 0, m; m = a[q]; q++) {
								if (Element.descendantOf(u, m)) {
									return [u]
								}
							}
						} else {
							if (g == "adjacent") {
								for (var q = 0, m; m = a[q]; q++) {
									if (Selector.handlers.previousElementSibling(u) == m) {
										return [u]
									}
								}
							} else {
								a = r[g](a)
							}
						}
					}
				}
				for (var q = 0, m; m = a[q]; q++) {
					if (m == u) {
						return [u]
					}
				}
				return []
			}
			return (u && Element.descendantOf(u, x)) ? [u] : []
		},
		className: function(b, a, g, m) {
			if (b && m) {
				b = this[m](b)
			}
			return Selector.handlers.byClassName(b, a, g)
		},
		byClassName: function(g, b, q) {
			if (!g) {
				g = Selector.handlers.descendant([b])
			}
			var u = " " + q + " ";
			for (var o = 0, m = [], r, a; r = g[o]; o++) {
				a = r.className;
				if (a.length == 0) {
					continue
				}
				if (a == q || (" " + a + " ").include(u)) {
					m.push(r)
				}
			}
			return m
		},
		attrPresence: function(g, b, a, r) {
			if (!g) {
				g = b.getElementsByTagName("*")
			}
			if (g && r) {
				g = this[r](g)
			}
			var o = [];
			for (var m = 0, q; q = g[m]; m++) {
				if (Element.hasAttribute(q, a)) {
					o.push(q)
				}
			}
			return o
		},
		attr: function(a, x, u, y, g, b) {
			if (!a) {
				a = x.getElementsByTagName("*")
			}
			if (a && b) {
				a = this[b](a)
			}
			var z = Selector.operators[g],
			q = [];
			for (var o = 0, m; m = a[o]; o++) {
				var r = Element.readAttribute(m, u);
				if (r === null) {
					continue
				}
				if (z(r, y)) {
					q.push(m)
				}
			}
			return q
		},
		pseudo: function(b, g, o, a, m) {
			if (b && m) {
				b = this[m](b)
			}
			if (!b) {
				b = a.getElementsByTagName("*")
			}
			return Selector.pseudos[g](b, o, a)
		}
	},
	pseudos: {
		"first-child": function(b, q, a) {
			for (var m = 0, g = [], o; o = b[m]; m++) {
				if (Selector.handlers.previousElementSibling(o)) {
					continue
				}
				g.push(o)
			}
			return g
		},
		"last-child": function(b, q, a) {
			for (var m = 0, g = [], o; o = b[m]; m++) {
				if (Selector.handlers.nextElementSibling(o)) {
					continue
				}
				g.push(o)
			}
			return g
		},
		"only-child": function(b, r, a) {
			var o = Selector.handlers;
			for (var m = 0, g = [], q; q = b[m]; m++) {
				if (!o.previousElementSibling(q) && !o.nextElementSibling(q)) {
					g.push(q)
				}
			}
			return g
		},
		"nth-child": function(b, g, a) {
			return Selector.pseudos.nth(b, g, a)
		},
		"nth-last-child": function(b, g, a) {
			return Selector.pseudos.nth(b, g, a, true)
		},
		"nth-of-type": function(b, g, a) {
			return Selector.pseudos.nth(b, g, a, false, true)
		},
		"nth-last-of-type": function(b, g, a) {
			return Selector.pseudos.nth(b, g, a, true, true)
		},
		"first-of-type": function(b, g, a) {
			return Selector.pseudos.nth(b, "1", a, false, true)
		},
		"last-of-type": function(b, g, a) {
			return Selector.pseudos.nth(b, "1", a, true, true)
		},
		"only-of-type": function(b, m, a) {
			var g = Selector.pseudos;
			return g["last-of-type"](g["first-of-type"](b, m, a), m, a)
		},
		getIndices: function(m, g, o) {
			if (m == 0) {
				return g > 0 ? [g] : []
			}
			return $R(1, o).inject([],
			function(a, b) {
				if (0 == (b - g) % m && (b - g) / m >= 0) {
					a.push(b)
				}
				return a
			})
		},
		nth: function(g, D, F, C, q) {
			if (g.length == 0) {
				return []
			}
			if (D == "even") {
				D = "2n+0"
			}
			if (D == "odd") {
				D = "2n+1"
			}
			var B = Selector.handlers,
			A = [],
			o = [],
			u;
			B.mark(g);
			for (var z = 0, r; r = g[z]; z++) {
				if (!r.parentNode._countedByPrototype) {
					B.index(r.parentNode, C, q);
					o.push(r.parentNode)
				}
			}
			if (D.match(/^\d+$/)) {
				D = Number(D);
				for (var z = 0, r; r = g[z]; z++) {
					if (r.nodeIndex == D) {
						A.push(r)
					}
				}
			} else {
				if (u = D.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
					if (u[1] == "-") {
						u[1] = -1
					}
					var G = u[1] ? Number(u[1]) : 1;
					var E = u[2] ? Number(u[2]) : 0;
					var H = Selector.pseudos.getIndices(G, E, g.length);
					for (var z = 0, r, x = H.length; r = g[z]; z++) {
						for (var y = 0; y < x; y++) {
							if (r.nodeIndex == H[y]) {
								A.push(r)
							}
						}
					}
				}
			}
			B.unmark(g);
			B.unmark(o);
			return A
		},
		empty: function(b, q, a) {
			for (var m = 0, g = [], o; o = b[m]; m++) {
				if (o.tagName == "!" || o.firstChild) {
					continue
				}
				g.push(o)
			}
			return g
		},
		not: function(a, o, y) {
			var u = Selector.handlers,
			z, g;
			var x = new Selector(o).findElements(y);
			u.mark(x);
			for (var r = 0, q = [], b; b = a[r]; r++) {
				if (!b._countedByPrototype) {
					q.push(b)
				}
			}
			u.unmark(x);
			return q
		},
		enabled: function(b, q, a) {
			for (var m = 0, g = [], o; o = b[m]; m++) {
				if (!o.disabled && (!o.type || o.type !== "hidden")) {
					g.push(o)
				}
			}
			return g
		},
		disabled: function(b, q, a) {
			for (var m = 0, g = [], o; o = b[m]; m++) {
				if (o.disabled) {
					g.push(o)
				}
			}
			return g
		},
		checked: function(b, q, a) {
			for (var m = 0, g = [], o; o = b[m]; m++) {
				if (o.checked) {
					g.push(o)
				}
			}
			return g
		}
	},
	operators: {
		"=": function(b, a) {
			return b == a
		},
		"!=": function(b, a) {
			return b != a
		},
		"^=": function(b, a) {
			return b == a || b && b.startsWith(a)
		},
		"$=": function(b, a) {
			return b == a || b && b.endsWith(a)
		},
		"*=": function(b, a) {
			return b == a || b && b.include(a)
		},
		"~=": function(b, a) {
			return (" " + b + " ").include(" " + a + " ")
		},
		"|=": function(b, a) {
			return ("-" + (b || "").toUpperCase() + "-").include("-" + (a || "").toUpperCase() + "-")
		}
	},
	split: function(b) {
		var a = [];
		b.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,
		function(g) {
			a.push(g[1].strip())
		});
		return a
	},
	matchElements: function(q, r) {
		var o = $$(r),
		m = Selector.handlers;
		m.mark(o);
		for (var g = 0, b = [], a; a = q[g]; g++) {
			if (a._countedByPrototype) {
				b.push(a)
			}
		}
		m.unmark(o);
		return b
	},
	findElement: function(b, g, a) {
		if (Object.isNumber(g)) {
			a = g;
			g = false
		}
		return Selector.matchElements(b, g || "*")[a || 0]
	},
	findChildElements: function(o, r) {
		r = Selector.split(r.join(","));
		var m = [],
		q = Selector.handlers;
		for (var g = 0, b = r.length, a; g < b; g++) {
			a = new Selector(r[g].strip());
			q.concat(m, a.findElements(o))
		}
		return (b > 1) ? q.unique(m) : m
	}
});
if (Prototype.Browser.IE) {
	Object.extend(Selector.handlers, {
		concat: function(m, g) {
			for (var o = 0, q; q = g[o]; o++) {
				if (q.tagName !== "!") {
					m.push(q)
				}
			}
			return m
		}
	})
}
function $$() {
	return Selector.findChildElements(document, $A(arguments))
}
var Form = {
	reset: function(a) {
		a = $(a);
		a.reset();
		return a
	},
	serializeElements: function(r, b) {
		if (typeof b != "object") {
			b = {
				hash: !!b
			}
		} else {
			if (Object.isUndefined(b.hash)) {
				b.hash = true
			}
		}
		var g, q, a = false,
		o = b.submit;
		var m = r.inject({},
		function(u, x) {
			if (!x.disabled && x.name) {
				g = x.name;
				q = $(x).getValue();
				if (q != null && x.type != "file" && (x.type != "submit" || (!a && o !== false && (!o || g == o) && (a = true)))) {
					if (g in u) {
						if (!Object.isArray(u[g])) {
							u[g] = [u[g]]
						}
						u[g].push(q)
					} else {
						u[g] = q
					}
				}
			}
			return u
		});
		return b.hash ? m: Object.toQueryString(m)
	}
};
Form.Methods = {
	serialize: function(b, a) {
		return Form.serializeElements(Form.getElements(b), a)
	},
	getElements: function(o) {
		var q = $(o).getElementsByTagName("*"),
		m,
		a = [],
		g = Form.Element.Serializers;
		for (var b = 0; m = q[b]; b++) {
			a.push(m)
		}
		return a.inject([],
		function(r, u) {
			if (g[u.tagName.toLowerCase()]) {
				r.push(Element.extend(u))
			}
			return r
		})
	},
	getInputs: function(r, g, m) {
		r = $(r);
		var a = r.getElementsByTagName("input");
		if (!g && !m) {
			return $A(a).map(Element.extend)
		}
		for (var o = 0, u = [], q = a.length; o < q; o++) {
			var b = a[o];
			if ((g && b.type != g) || (m && b.name != m)) {
				continue
			}
			u.push(Element.extend(b))
		}
		return u
	},
	disable: function(a) {
		a = $(a);
		Form.getElements(a).invoke("disable");
		return a
	},
	enable: function(a) {
		a = $(a);
		Form.getElements(a).invoke("enable");
		return a
	},
	findFirstElement: function(b) {
		var g = $(b).getElements().findAll(function(m) {
			return "hidden" != m.type && !m.disabled
		});
		var a = g.findAll(function(m) {
			return m.hasAttribute("tabIndex") && m.tabIndex >= 0
		}).sortBy(function(m) {
			return m.tabIndex
		}).first();
		return a ? a: g.find(function(m) {
			return /^(?:input|select|textarea)$/i.test(m.tagName)
		})
	},
	focusFirstElement: function(a) {
		a = $(a);
		a.findFirstElement().activate();
		return a
	},
	request: function(b, a) {
		b = $(b),
		a = Object.clone(a || {});
		var m = a.parameters,
		g = b.readAttribute("action") || "";
		if (g.blank()) {
			g = window.location.href
		}
		a.parameters = b.serialize(true);
		if (m) {
			if (Object.isString(m)) {
				m = m.toQueryParams()
			}
			Object.extend(a.parameters, m)
		}
		if (b.hasAttribute("method") && !a.method) {
			a.method = b.method
		}
		return new Ajax.Request(g, a)
	}
};
Form.Element = {
	focus: function(a) {
		$(a).focus();
		return a
	},
	select: function(a) {
		$(a).select();
		return a
	}
};
Form.Element.Methods = {
	serialize: function(a) {
		a = $(a);
		if (!a.disabled && a.name) {
			var b = a.getValue();
			if (b != undefined) {
				var g = {};
				g[a.name] = b;
				return Object.toQueryString(g)
			}
		}
		return ""
	},
	getValue: function(a) {
		a = $(a);
		var b = a.tagName.toLowerCase();
		return Form.Element.Serializers[b](a)
	},
	setValue: function(a, b) {
		a = $(a);
		var g = a.tagName.toLowerCase();
		Form.Element.Serializers[g](a, b);
		return a
	},
	clear: function(a) {
		$(a).value = "";
		return a
	},
	present: function(a) {
		return $(a).value != ""
	},
	activate: function(a) {
		a = $(a);
		try {
			a.focus();
			if (a.select && (a.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(a.type)))) {
				a.select()
			}
		} catch(b) {}
		return a
	},
	disable: function(a) {
		a = $(a);
		a.disabled = true;
		return a
	},
	enable: function(a) {
		a = $(a);
		a.disabled = false;
		return a
	}
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = {
	input: function(a, b) {
		switch (a.type.toLowerCase()) {
		case "checkbox":
		case "radio":
			return Form.Element.Serializers.inputSelector(a, b);
		default:
			return Form.Element.Serializers.textarea(a, b)
		}
	},
	inputSelector: function(a, b) {
		if (Object.isUndefined(b)) {
			return a.checked ? a.value: null
		} else {
			a.checked = !!b
		}
	},
	textarea: function(a, b) {
		if (Object.isUndefined(b)) {
			return a.value
		} else {
			a.value = b
		}
	},
	select: function(g, q) {
		if (Object.isUndefined(q)) {
			return this[g.type == "select-one" ? "selectOne": "selectMany"](g)
		} else {
			var b, m, r = !Object.isArray(q);
			for (var a = 0, o = g.length; a < o; a++) {
				b = g.options[a];
				m = this.optionValue(b);
				if (r) {
					if (m == q) {
						b.selected = true;
						return
					}
				} else {
					b.selected = q.include(m)
				}
			}
		}
	},
	selectOne: function(b) {
		var a = b.selectedIndex;
		return a >= 0 ? this.optionValue(b.options[a]) : null
	},
	selectMany: function(m) {
		var a, o = m.length;
		if (!o) {
			return null
		}
		for (var g = 0, a = []; g < o; g++) {
			var b = m.options[g];
			if (b.selected) {
				a.push(this.optionValue(b))
			}
		}
		return a
	},
	optionValue: function(a) {
		return Element.extend(a).hasAttribute("value") ? a.value: a.text
	}
};
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
	initialize: function($super, a, b, g) {
		$super(g, b);
		this.element = $(a);
		this.lastValue = this.getValue()
	},
	execute: function() {
		var a = this.getValue();
		if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a: String(this.lastValue) != String(a)) {
			this.callback(this.element, a);
			this.lastValue = a
		}
	}
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
	getValue: function() {
		return Form.Element.getValue(this.element)
	}
});
Form.Observer = Class.create(Abstract.TimedObserver, {
	getValue: function() {
		return Form.serialize(this.element)
	}
});
Abstract.EventObserver = Class.create({
	initialize: function(a, b) {
		this.element = $(a);
		this.callback = b;
		this.lastValue = this.getValue();
		if (this.element.tagName.toLowerCase() == "form") {
			this.registerFormCallbacks()
		} else {
			this.registerCallback(this.element)
		}
	},
	onElementEvent: function() {
		var a = this.getValue();
		if (this.lastValue != a) {
			this.callback(this.element, a);
			this.lastValue = a
		}
	},
	registerFormCallbacks: function() {
		Form.getElements(this.element).each(this.registerCallback, this)
	},
	registerCallback: function(a) {
		if (a.type) {
			switch (a.type.toLowerCase()) {
			case "checkbox":
			case "radio":
				Event.observe(a, "click", this.onElementEvent.bind(this));
				break;
			default:
				Event.observe(a, "change", this.onElementEvent.bind(this));
				break
			}
		}
	}
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
	getValue: function() {
		return Form.Element.getValue(this.element)
	}
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
	getValue: function() {
		return Form.serialize(this.element)
	}
});
(function() {
	var K = {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_RETURN: 13,
		KEY_ESC: 27,
		KEY_LEFT: 37,
		KEY_UP: 38,
		KEY_RIGHT: 39,
		KEY_DOWN: 40,
		KEY_DELETE: 46,
		KEY_HOME: 36,
		KEY_END: 35,
		KEY_PAGEUP: 33,
		KEY_PAGEDOWN: 34,
		KEY_INSERT: 45,
		cache: {}
	};
	var o = document.documentElement;
	var L = "onmouseenter" in o && "onmouseleave" in o;
	var D;
	if (Prototype.Browser.IE) {
		var u = {
			0 : 1,
			1 : 4,
			2 : 2
		};
		D = function(N, M) {
			return N.button === u[M]
		}
	} else {
		if (Prototype.Browser.WebKit) {
			D = function(N, M) {
				switch (M) {
				case 0:
					return N.which == 1 && !N.metaKey;
				case 1:
					return N.which == 1 && N.metaKey;
				default:
					return false
				}
			}
		} else {
			D = function(N, M) {
				return N.which ? (N.which === M + 1) : (N.button === M)
			}
		}
	}
	function G(M) {
		return D(M, 0)
	}
	function F(M) {
		return D(M, 1)
	}
	function z(M) {
		return D(M, 2)
	}
	function g(O) {
		O = K.extend(O);
		var N = O.target,
		M = O.type,
		P = O.currentTarget;
		if (P && P.tagName) {
			if (M === "load" || M === "error" || (M === "click" && P.tagName.toLowerCase() === "input" && P.type === "radio")) {
				N = P
			}
		}
		if (N.nodeType == Node.TEXT_NODE) {
			N = N.parentNode
		}
		return Element.extend(N)
	}
	function B(N, P) {
		var M = K.element(N);
		if (!P) {
			return M
		}
		var O = [M].concat(M.ancestors());
		return Selector.findElement(O, P, 0)
	}
	function E(M) {
		return {
			x: b(M),
			y: a(M)
		}
	}
	function b(O) {
		var N = document.documentElement,
		M = document.body || {
			scrollLeft: 0
		};
		return O.pageX || (O.clientX + (N.scrollLeft || M.scrollLeft) - (N.clientLeft || 0))
	}
	function a(O) {
		var N = document.documentElement,
		M = document.body || {
			scrollTop: 0
		};
		return O.pageY || (O.clientY + (N.scrollTop || M.scrollTop) - (N.clientTop || 0))
	}
	function C(M) {
		K.extend(M);
		M.preventDefault();
		M.stopPropagation();
		M.stopped = true
	}
	K.Methods = {
		isLeftClick: G,
		isMiddleClick: F,
		isRightClick: z,
		element: g,
		findElement: B,
		pointer: E,
		pointerX: b,
		pointerY: a,
		stop: C
	};
	var I = Object.keys(K.Methods).inject({},
	function(M, N) {
		M[N] = K.Methods[N].methodize();
		return M
	});
	if (Prototype.Browser.IE) {
		function r(N) {
			var M;
			switch (N.type) {
			case "mouseover":
				M = N.fromElement;
				break;
			case "mouseout":
				M = N.toElement;
				break;
			default:
				return null
			}
			return Element.extend(M)
		}
		Object.extend(I, {
			stopPropagation: function() {
				this.cancelBubble = true
			},
			preventDefault: function() {
				this.returnValue = false
			},
			inspect: function() {
				return "[object Event]"
			}
		});
		K.extend = function(N, M) {
			if (!N) {
				return false
			}
			if (N._extendedByPrototype) {
				return N
			}
			N._extendedByPrototype = Prototype.emptyFunction;
			var O = K.pointer(N);
			Object.extend(N, {
				target: N.srcElement || M,
				relatedTarget: r(N),
				pageX: O.x,
				pageY: O.y
			});
			return Object.extend(N, I)
		}
	} else {
		K.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
		Object.extend(K.prototype, I);
		K.extend = Prototype.K
	}
	function A(Q, P, R) {
		var O = Element.retrieve(Q, "prototype_event_registry");
		if (Object.isUndefined(O)) {
			m.push(Q);
			O = Element.retrieve(Q, "prototype_event_registry", $H())
		}
		var M = O.get(P);
		if (Object.isUndefined(M)) {
			M = [];
			O.set(P, M)
		}
		if (M.pluck("handler").include(R)) {
			return false
		}
		var N;
		if (P.include(":")) {
			N = function(S) {
				if (Object.isUndefined(S.eventName)) {
					return false
				}
				if (S.eventName !== P) {
					return false
				}
				K.extend(S, Q);
				R.call(Q, S)
			}
		} else {
			if (!L && (P === "mouseenter" || P === "mouseleave")) {
				if (P === "mouseenter" || P === "mouseleave") {
					N = function(T) {
						K.extend(T, Q);
						var S = T.relatedTarget;
						while (S && S !== Q) {
							try {
								S = S.parentNode
							} catch(U) {
								S = Q
							}
						}
						if (S === Q) {
							return
						}
						R.call(Q, T)
					}
				}
			} else {
				N = function(S) {
					K.extend(S, Q);
					R.call(Q, S)
				}
			}
		}
		N.handler = R;
		M.push(N);
		return N
	}
	function q() {
		for (var M = 0, N = m.length; M < N; M++) {
			K.stopObserving(m[M]);
			m[M] = null
		}
	}
	var m = [];
	if (Prototype.Browser.IE) {
		window.attachEvent("onunload", q)
	}
	if (Prototype.Browser.WebKit) {
		window.addEventListener("unload", Prototype.emptyFunction, false)
	}
	var y = Prototype.K;
	if (!L) {
		y = function(N) {
			var M = {
				mouseenter: "mouseover",
				mouseleave: "mouseout"
			};
			return N in M ? M[N] : N
		}
	}
	function H(P, O, Q) {
		P = $(P);
		var N = A(P, O, Q);
		if (!N) {
			return P
		}
		if (O.include(":")) {
			if (P.addEventListener) {
				P.addEventListener("dataavailable", N, false)
			} else {
				P.attachEvent("ondataavailable", N);
				P.attachEvent("onfilterchange", N)
			}
		} else {
			var M = y(O);
			if (P.addEventListener) {
				P.addEventListener(M, N, false)
			} else {
				P.attachEvent("on" + M, N)
			}
		}
		return P
	}
	function x(R, P, S) {
		R = $(R);
		var O = Element.retrieve(R, "prototype_event_registry");
		if (Object.isUndefined(O)) {
			return R
		}
		if (P && !S) {
			var Q = O.get(P);
			if (Object.isUndefined(Q)) {
				return R
			}
			Q.each(function(T) {
				Element.stopObserving(R, P, T.handler)
			});
			return R
		} else {
			if (!P) {
				O.each(function(V) {
					var T = V.key,
					U = V.value;
					U.each(function(W) {
						Element.stopObserving(R, T, W.handler)
					})
				});
				return R
			}
		}
		var Q = O.get(P);
		if (!Q) {
			return
		}
		var N = Q.find(function(T) {
			return T.handler === S
		});
		if (!N) {
			return R
		}
		var M = y(P);
		if (P.include(":")) {
			if (R.removeEventListener) {
				R.removeEventListener("dataavailable", N, false)
			} else {
				R.detachEvent("ondataavailable", N);
				R.detachEvent("onfilterchange", N)
			}
		} else {
			if (R.removeEventListener) {
				R.removeEventListener(M, N, false)
			} else {
				R.detachEvent("on" + M, N)
			}
		}
		O.set(P, Q.without(N));
		return R
	}
	function J(P, O, N, M) {
		P = $(P);
		if (Object.isUndefined(M)) {
			M = true
		}
		if (P == document && document.createEvent && !P.dispatchEvent) {
			P = document.documentElement
		}
		var Q;
		if (document.createEvent) {
			Q = document.createEvent("HTMLEvents");
			Q.initEvent("dataavailable", true, true)
		} else {
			Q = document.createEventObject();
			Q.eventType = M ? "ondataavailable": "onfilterchange"
		}
		Q.eventName = O;
		Q.memo = N || {};
		if (document.createEvent) {
			P.dispatchEvent(Q)
		} else {
			P.fireEvent(Q.eventType, Q)
		}
		return K.extend(Q)
	}
	Object.extend(K, K.Methods);
	Object.extend(K, {
		fire: J,
		observe: H,
		stopObserving: x
	});
	Element.addMethods({
		fire: J,
		observe: H,
		stopObserving: x
	});
	Object.extend(document, {
		fire: J.methodize(),
		observe: H.methodize(),
		stopObserving: x.methodize(),
		loaded: false
	});
	if (window.Event) {
		Object.extend(window.Event, K)
	} else {
		window.Event = K
	}
})();
(function() {
	var m;
	function a() {
		if (document.loaded) {
			return
		}
		if (m) {
			window.clearTimeout(m)
		}
		document.loaded = true;
		document.fire("dom:loaded")
	}
	function g() {
		if (document.readyState === "complete") {
			document.stopObserving("readystatechange", g);
			a()
		}
	}
	function b() {
		try {
			document.documentElement.doScroll("left")
		} catch(o) {
			m = b.defer();
			return
		}
		a()
	}
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", a, false)
	} else {
		document.observe("readystatechange", g);
		if (window == top) {
			m = b.defer()
		}
	}
	Event.observe(window, "load", a)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
	display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
	Before: function(a, b) {
		return Element.insert(a, {
			before: b
		})
	},
	Top: function(a, b) {
		return Element.insert(a, {
			top: b
		})
	},
	Bottom: function(a, b) {
		return Element.insert(a, {
			bottom: b
		})
	},
	After: function(a, b) {
		return Element.insert(a, {
			after: b
		})
	}
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
	includeScrollOffsets: false,
	prepare: function() {
		this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
		this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
	},
	within: function(b, a, g) {
		if (this.includeScrollOffsets) {
			return this.withinIncludingScrolloffsets(b, a, g)
		}
		this.xcomp = a;
		this.ycomp = g;
		this.offset = Element.cumulativeOffset(b);
		return (g >= this.offset[1] && g < this.offset[1] + b.offsetHeight && a >= this.offset[0] && a < this.offset[0] + b.offsetWidth)
	},
	withinIncludingScrolloffsets: function(b, a, m) {
		var g = Element.cumulativeScrollOffset(b);
		this.xcomp = a + g[0] - this.deltaX;
		this.ycomp = m + g[1] - this.deltaY;
		this.offset = Element.cumulativeOffset(b);
		return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + b.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + b.offsetWidth)
	},
	overlap: function(b, a) {
		if (!b) {
			return 0
		}
		if (b == "vertical") {
			return ((this.offset[1] + a.offsetHeight) - this.ycomp) / a.offsetHeight
		}
		if (b == "horizontal") {
			return ((this.offset[0] + a.offsetWidth) - this.xcomp) / a.offsetWidth
		}
	},
	cumulativeOffset: Element.Methods.cumulativeOffset,
	positionedOffset: Element.Methods.positionedOffset,
	absolutize: function(a) {
		Position.prepare();
		return Element.absolutize(a)
	},
	relativize: function(a) {
		Position.prepare();
		return Element.relativize(a)
	},
	realOffset: Element.Methods.cumulativeScrollOffset,
	offsetParent: Element.Methods.getOffsetParent,
	page: Element.Methods.viewportOffset,
	clone: function(b, g, a) {
		a = a || {};
		return Element.clonePosition(g, b, a)
	}
};
if (!document.getElementsByClassName) {
	document.getElementsByClassName = function(b) {
		function a(g) {
			return g.blank() ? null: "[contains(concat(' ', @class, ' '), ' " + g + " ')]"
		}
		b.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
		function(g, o) {
			o = o.toString().strip();
			var m = /\s/.test(o) ? $w(o).map(a).join("") : a(o);
			return m ? document._getElementsByXPath(".//*" + m, g) : []
		}: function(o, q) {
			q = q.toString().strip();
			var r = [],
			u = (/\s/.test(q) ? $w(q) : null);
			if (!u && !q) {
				return r
			}
			var g = $(o).getElementsByTagName("*");
			q = " " + q + " ";
			for (var m = 0, y, x; y = g[m]; m++) {
				if (y.className && (x = " " + y.className + " ") && (x.include(q) || (u && u.all(function(z) {
					return ! z.toString().blank() && x.include(" " + z + " ")
				})))) {
					r.push(Element.extend(y))
				}
			}
			return r
		};
		return function(m, g) {
			return $(g || document.body).getElementsByClassName(m)
		}
	} (Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
	initialize: function(a) {
		this.element = $(a)
	},
	_each: function(a) {
		this.element.className.split(/\s+/).select(function(b) {
			return b.length > 0
		})._each(a)
	},
	set: function(a) {
		this.element.className = a
	},
	add: function(a) {
		if (this.include(a)) {
			return
		}
		this.set($A(this).concat(a).join(" "))
	},
	remove: function(a) {
		if (!this.include(a)) {
			return
		}
		this.set($A(this).without(a).join(" "))
	},
	toString: function() {
		return $A(this).join(" ")
	}
};
Object.extend(Element.ClassNames.prototype, Enumerable);
if (!Control) {
	var Control = {}
}


////////////=========END prototype
Control.Slider = Class.create({
	initialize: function(m, a, b) {
		var g = this;
		if (Object.isArray(m)) {
			this.handles = m.collect(function(o) {
				return $(o)
			})
		} else {
			this.handles = [$(m)]
		}
		this.track = $(a);
		this.options = b || {};
		this.axis = this.options.axis || "horizontal";
		this.increment = this.options.increment || 1;
		this.step = parseInt(this.options.step || "1");
		this.range = this.options.range || $R(0, 1);
		this.value = 0;
		this.values = this.handles.map(function() {
			return 0
		});
		this.spans = this.options.spans ? this.options.spans.map(function(o) {
			return $(o)
		}) : false;
		this.options.startSpan = $(this.options.startSpan || null);
		this.options.endSpan = $(this.options.endSpan || null);
		this.restricted = this.options.restricted || false;
		this.maximum = this.options.maximum || this.range.end;
		this.minimum = this.options.minimum || this.range.start;
		this.alignX = parseInt(this.options.alignX || "0");
		this.alignY = parseInt(this.options.alignY || "0");
		this.trackLength = this.maximumOffset() - this.minimumOffset();
		this.handleLength = this.isVertical() ? (this.handles[0].offsetHeight != 0 ? this.handles[0].offsetHeight: this.handles[0].style.height.replace(/px$/, "")) : (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth: this.handles[0].style.width.replace(/px$/, ""));
		this.active = false;
		this.dragging = false;
		this.disabled = false;
		if (this.options.disabled) {
			this.setDisabled()
		}
		this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
		if (this.allowedValues) {
			this.minimum = this.allowedValues.min();
			this.maximum = this.allowedValues.max()
		}
		this.eventMouseDown = this.startDrag.bindAsEventListener(this);
		this.eventMouseUp = this.endDrag.bindAsEventListener(this);
		this.eventMouseMove = this.update.bindAsEventListener(this);
		this.handles.each(function(q, o) {
			o = g.handles.length - 1 - o;
			g.setValue(parseFloat((Object.isArray(g.options.sliderValue) ? g.options.sliderValue[o] : g.options.sliderValue) || g.range.start), o);
			q.makePositioned().observe("mousedown", g.eventMouseDown)
		});
		this.track.observe("mousedown", this.eventMouseDown);
		document.observe("mouseup", this.eventMouseUp);
		document.observe("mousemove", this.eventMouseMove);
		this.initialized = true
	},
	dispose: function() {
		var a = this;
		Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
		Event.stopObserving(document, "mouseup", this.eventMouseUp);
		Event.stopObserving(document, "mousemove", this.eventMouseMove);
		this.handles.each(function(b) {
			Event.stopObserving(b, "mousedown", a.eventMouseDown)
		})
	},
	setDisabled: function() {
		this.disabled = true
	},
	setEnabled: function() {
		this.disabled = false
	},
	getNearestValue: function(a) {
		if (this.allowedValues) {
			if (a >= this.allowedValues.max()) {
				return (this.allowedValues.max())
			}
			if (a <= this.allowedValues.min()) {
				return (this.allowedValues.min())
			}
			var g = Math.abs(this.allowedValues[0] - a);
			var b = this.allowedValues[0];
			this.allowedValues.each(function(m) {
				var o = Math.abs(m - a);
				if (o <= g) {
					b = m;
					g = o
				}
			});
			return b
		}
		if (a > this.range.end) {
			return this.range.end
		}
		if (a < this.range.start) {
			return this.range.start
		}
		return a
	},
	setValue: function(b, a) {
		if (!this.active) {
			this.activeHandleIdx = a || 0;
			this.activeHandle = this.handles[this.activeHandleIdx];
			this.updateStyles()
		}
		a = a || this.activeHandleIdx || 0;
		if (this.initialized && this.restricted) {
			if ((a > 0) && (b < this.values[a - 1])) {
				b = this.values[a - 1]
			}
			if ((a < (this.handles.length - 1)) && (b > this.values[a + 1])) {
				b = this.values[a + 1]
			}
		}
		b = this.getNearestValue(b);
		this.values[a] = b;
		this.value = this.values[0];
		this.handles[a].style[this.isVertical() ? "top": "left"] = this.translateToPx(b);
		this.drawSpans();
		if (!this.dragging || !this.event) {
			this.updateFinished()
		}
	},
	setValueBy: function(b, a) {
		this.setValue(this.values[a || this.activeHandleIdx || 0] + b, a || this.activeHandleIdx || 0)
	},
	translateToPx: function(a) {
		return Math.round(((this.trackLength - this.handleLength) / (this.range.end - this.range.start)) * (a - this.range.start)) + "px"
	},
	translateToValue: function(a) {
		return ((a / (this.trackLength - this.handleLength) * (this.range.end - this.range.start)) + this.range.start)
	},
	getRange: function(b) {
		var a = this.values.sortBy(Prototype.K);
		b = b || 0;
		return $R(a[b], a[b + 1])
	},
	minimumOffset: function() {
		return (this.isVertical() ? this.alignY: this.alignX)
	},
	maximumOffset: function() {
		return (this.isVertical() ? (this.track.offsetHeight != 0 ? this.track.offsetHeight: this.track.style.height.replace(/px$/, "")) - this.alignY: (this.track.offsetWidth != 0 ? this.track.offsetWidth: this.track.style.width.replace(/px$/, "")) - this.alignX)
	},
	isVertical: function() {
		return (this.axis == "vertical")
	},
	drawSpans: function() {
		var a = this;
		if (this.spans) {
			$R(0, this.spans.length - 1).each(function(b) {
				a.setSpan(a.spans[b], a.getRange(b))
			})
		}
		if (this.options.startSpan) {
			this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value))
		}
		if (this.options.endSpan) {
			this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum))
		}
	},
	setSpan: function(b, a) {
		if (this.isVertical()) {
			b.style.top = this.translateToPx(a.start);
			b.style.height = this.translateToPx(a.end - a.start + this.range.start)
		} else {
			b.style.left = this.translateToPx(a.start);
			b.style.width = this.translateToPx(a.end - a.start + this.range.start)
		}
	},
	updateStyles: function() {
		this.handles.each(function(a) {
			Element.removeClassName(a, "selected")
		});
		Element.addClassName(this.activeHandle, "selected")
	},
	startDrag: function(g) {
		if (Event.isLeftClick(g)) {
			if (!this.disabled) {
				this.active = true;
				var m = Event.element(g);
				var o = [Event.pointerX(g), Event.pointerY(g)];
				var a = m;
				if (a == this.track) {
					var b = this.track.cumulativeOffset();
					this.event = g;
					this.setValue(this.translateToValue((this.isVertical() ? o[1] - b[1] : o[0] - b[0]) - (this.handleLength / 2)));
					var b = this.activeHandle.cumulativeOffset();
					this.offsetX = (o[0] - b[0]);
					this.offsetY = (o[1] - b[1])
				} else {
					while ((this.handles.indexOf(m) == -1) && m.parentNode) {
						m = m.parentNode
					}
					if (this.handles.indexOf(m) != -1) {
						this.activeHandle = m;
						this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
						this.updateStyles();
						var b = this.activeHandle.cumulativeOffset();
						this.offsetX = (o[0] - b[0]);
						this.offsetY = (o[1] - b[1])
					}
				}
			}
			Event.stop(g)
		}
	},
	update: function(a) {
		if (this.active) {
			if (!this.dragging) {
				this.dragging = true
			}
			this.draw(a);
			if (Prototype.Browser.WebKit) {
				window.scrollBy(0, 0)
			}
			Event.stop(a)
		}
	},
	draw: function(b) {
		var g = [Event.pointerX(b), Event.pointerY(b)];
		var a = this.track.cumulativeOffset();
		g[0] -= this.offsetX + a[0];
		g[1] -= this.offsetY + a[1];
		this.event = b;
		this.setValue(this.translateToValue(this.isVertical() ? g[1] : g[0]));
		if (this.initialized && this.options.onSlide) {
			this.options.onSlide(this.values.length > 1 ? this.values: this.value, this)
		}
	},
	endDrag: function(a) {
		if (this.active && this.dragging) {
			this.finishDrag(a, true);
			Event.stop(a)
		}
		this.active = false;
		this.dragging = false
	},
	finishDrag: function(a, b) {
		this.active = false;
		this.dragging = false;
		this.updateFinished()
	},
	updateFinished: function() {
		if (this.initialized && this.options.onChange) {
			this.options.onChange(this.values.length > 1 ? this.values: this.value, this)
		}
		this.event = null
	}
});
String.prototype.parseColor = function() {
	var a = "#";
	if (this.slice(0, 4) == "rgb(") {
		var g = this.slice(4, this.length - 1).split(",");
		var b = 0;
		do {
			a += parseInt(g[b]).toColorPart()
		} while (++ b < 3 )
	} else {
		if (this.slice(0, 1) == "#") {
			if (this.length == 4) {
				for (var b = 1; b < 4; b++) {
					a += (this.charAt(b) + this.charAt(b)).toLowerCase()
				}
			}
			if (this.length == 7) {
				a = this.toLowerCase()
			}
		}
	}
	return (a.length == 7 ? a: (arguments[0] || this))
};
Element.collectTextNodes = function(a) {
	return $A($(a).childNodes).collect(function(b) {
		return (b.nodeType == 3 ? b.nodeValue: (b.hasChildNodes() ? Element.collectTextNodes(b) : ""))
	}).flatten().join("")
};
Element.collectTextNodesIgnoreClass = function(a, b) {
	return $A($(a).childNodes).collect(function(g) {
		return (g.nodeType == 3 ? g.nodeValue: ((g.hasChildNodes() && !Element.hasClassName(g, b)) ? Element.collectTextNodesIgnoreClass(g, b) : ""))
	}).flatten().join("")
};
Element.setContentZoom = function(a, b) {
	a = $(a);
	a.setStyle({
		fontSize: (b / 100) + "em"
	});
	if (Prototype.Browser.WebKit) {
		window.scrollBy(0, 0)
	}
	return a
};
Element.getInlineOpacity = function(a) {
	return $(a).style.opacity || ""
};
Element.forceRerendering = function(a) {
	try {
		a = $(a);
		var g = document.createTextNode(" ");
		a.appendChild(g);
		a.removeChild(g)
	} catch(b) {}
};
var Effect = {
	_elementDoesNotExistError: {
		name: "ElementDoesNotExistError",
		message: "The specified DOM element does not exist, but is required for this effect to operate"
	},
	Transitions: {
		linear: Prototype.K,
		sinoidal: function(a) {
			return ( - Math.cos(a * Math.PI) / 2) + 0.5
		},
		reverse: function(a) {
			return 1 - a
		},
		flicker: function(a) {
			var a = (( - Math.cos(a * Math.PI) / 4) + 0.75) + Math.random() / 4;
			return a > 1 ? 1 : a
		},
		wobble: function(a) {
			return ( - Math.cos(a * Math.PI * (9 * a)) / 2) + 0.5
		},
		pulse: function(b, a) {
			return ( - Math.cos((b * ((a || 5) - 0.5) * 2) * Math.PI) / 2) + 0.5
		},
		spring: function(a) {
			return 1 - (Math.cos(a * 4.5 * Math.PI) * Math.exp( - a * 6))
		},
		none: function(a) {
			return 0
		},
		full: function(a) {
			return 1
		}
	},
	DefaultOptions: {
		duration: 1,
		fps: 100,
		sync: false,
		from: 0,
		to: 1,
		delay: 0,
		queue: "parallel"
	},
	tagifyText: function(a) {
		var b = "position:relative";
		if (Prototype.Browser.IE) {
			b += ";zoom:1"
		}
		a = $(a);
		$A(a.childNodes).each(function(g) {
			if (g.nodeType == 3) {
				g.nodeValue.toArray().each(function(m) {
					a.insertBefore(new Element("span", {
						style: b
					}).update(m == " " ? String.fromCharCode(160) : m), g)
				});
				Element.remove(g)
			}
		})
	},
	multiple: function(b, g) {
		var o;
		if (((typeof b == "object") || Object.isFunction(b)) && (b.length)) {
			o = b
		} else {
			o = $(b).childNodes
		}
		var a = Object.extend({
			speed: 0.1,
			delay: 0
		},
		arguments[2] || {});
		var m = a.delay;
		$A(o).each(function(r, q) {
			new g(r, Object.extend(a, {
				delay: q * a.speed + m
			}))
		})
	},
	PAIRS: {
		slide: ["SlideDown", "SlideUp"],
		blind: ["BlindDown", "BlindUp"],
		appear: ["Appear", "Fade"]
	},
	toggle: function(b, g, a) {
		b = $(b);
		g = (g || "appear").toLowerCase();
		return Effect[Effect.PAIRS[g][b.visible() ? 1 : 0]](b, Object.extend({
			queue: {
				position: "end",
				scope: (b.id || "global"),
				limit: 1
			}
		},
		a || {}))
	}
};
Effect.DefaultOptions.transition = Effect.Transitions.sinoidal;
Effect.ScopedQueue = Class.create(Enumerable, {
	initialize: function() {
		this.effects = [];
		this.interval = null
	},
	_each: function(a) {
		this.effects._each(a)
	},
	add: function(b) {
		var g = new Date().getTime();
		var a = Object.isString(b.options.queue) ? b.options.queue: b.options.queue.position;
		switch (a) {
		case "front":
			this.effects.findAll(function(m) {
				return m.state == "idle"
			}).each(function(m) {
				m.startOn += b.finishOn;
				m.finishOn += b.finishOn
			});
			break;
		case "with-last":
			g = this.effects.pluck("startOn").max() || g;
			break;
		case "end":
			g = this.effects.pluck("finishOn").max() || g;
			break
		}
		b.startOn += g;
		b.finishOn += g;
		if (!b.options.queue.limit || (this.effects.length < b.options.queue.limit)) {
			this.effects.push(b)
		}
		if (!this.interval) {
			this.interval = setInterval(this.loop.bind(this), 15)
		}
	},
	remove: function(a) {
		this.effects = this.effects.reject(function(b) {
			return b == a
		});
		if (this.effects.length == 0) {
			clearInterval(this.interval);
			this.interval = null
		}
	},
	loop: function() {
		var g = new Date().getTime();
		for (var b = 0, a = this.effects.length; b < a; b++) {
			this.effects[b] && this.effects[b].loop(g)
		}
	}
});
Effect.Queues = {
	instances: $H(),
	get: function(a) {
		if (!Object.isString(a)) {
			return a
		}
		return this.instances.get(a) || this.instances.set(a, new Effect.ScopedQueue())
	}
};
Effect.Queue = Effect.Queues.get("global");
Effect.Base = Class.create({
	position: null,
	start: function(a) {
		if (a && a.transition === false) {
			a.transition = Effect.Transitions.linear
		}
		this.options = Object.extend(Object.extend({},
		Effect.DefaultOptions), a || {});
		this.currentFrame = 0;
		this.state = "idle";
		this.startOn = this.options.delay * 1000;
		this.finishOn = this.startOn + (this.options.duration * 1000);
		this.fromToDelta = this.options.to - this.options.from;
		this.totalTime = this.finishOn - this.startOn;
		this.totalFrames = this.options.fps * this.options.duration;
		this.render = (function() {
			function b(m, g) {
				if (m.options[g + "Internal"]) {
					m.options[g + "Internal"](m)
				}
				if (m.options[g]) {
					m.options[g](m)
				}
			}
			return function(g) {
				if (this.state === "idle") {
					this.state = "running";
					b(this, "beforeSetup");
					if (this.setup) {
						this.setup()
					}
					b(this, "afterSetup")
				}
				if (this.state === "running") {
					g = (this.options.transition(g) * this.fromToDelta) + this.options.from;
					this.position = g;
					b(this, "beforeUpdate");
					if (this.update) {
						this.update(g)
					}
					b(this, "afterUpdate")
				}
			}
		})();
		this.event("beforeStart");
		if (!this.options.sync) {
			Effect.Queues.get(Object.isString(this.options.queue) ? "global": this.options.queue.scope).add(this)
		}
	},
	loop: function(g) {
		if (g >= this.startOn) {
			if (g >= this.finishOn) {
				this.render(1);
				this.cancel();
				this.event("beforeFinish");
				if (this.finish) {
					this.finish()
				}
				this.event("afterFinish");
				return
			}
			var b = (g - this.startOn) / this.totalTime,
			a = (b * this.totalFrames).round();
			if (a > this.currentFrame) {
				this.render(b);
				this.currentFrame = a
			}
		}
	},
	cancel: function() {
		if (!this.options.sync) {
			Effect.Queues.get(Object.isString(this.options.queue) ? "global": this.options.queue.scope).remove(this)
		}
		this.state = "finished"
	},
	event: function(a) {
		if (this.options[a + "Internal"]) {
			this.options[a + "Internal"](this)
		}
		if (this.options[a]) {
			this.options[a](this)
		}
	},
	inspect: function() {
		var a = $H();
		for (property in this) {
			if (!Object.isFunction(this[property])) {
				a.set(property, this[property])
			}
		}
		return "#<Effect:" + a.inspect() + ",options:" + $H(this.options).inspect() + ">"
	}
});
Effect.Parallel = Class.create(Effect.Base, {
	initialize: function(a) {
		this.effects = a || [];
		this.start(arguments[1])
	},
	update: function(a) {
		this.effects.invoke("render", a)
	},
	finish: function(a) {
		this.effects.each(function(b) {
			b.render(1);
			b.cancel();
			b.event("beforeFinish");
			if (b.finish) {
				b.finish(a)
			}
			b.event("afterFinish")
		})
	}
});
Effect.Tween = Class.create(Effect.Base, {
	initialize: function(g, q, o) {
		g = Object.isString(g) ? $(g) : g;
		var b = $A(arguments),
		m = b.last(),
		a = b.length == 5 ? b[3] : null;
		this.method = Object.isFunction(m) ? m.bind(g) : Object.isFunction(g[m]) ? g[m].bind(g) : function(r) {
			g[m] = r
		};
		this.start(Object.extend({
			from: q,
			to: o
		},
		a || {}))
	},
	update: function(a) {
		this.method(a)
	}
});
Effect.Event = Class.create(Effect.Base, {
	initialize: function() {
		this.start(Object.extend({
			duration: 0
		},
		arguments[0] || {}))
	},
	update: Prototype.emptyFunction
});
Effect.Opacity = Class.create(Effect.Base, {
	initialize: function(b) {
		this.element = $(b);
		if (!this.element) {
			throw (Effect._elementDoesNotExistError)
		}
		if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) {
			this.element.setStyle({
				zoom: 1
			})
		}
		var a = Object.extend({
			from: this.element.getOpacity() || 0,
			to: 1
		},
		arguments[1] || {});
		this.start(a)
	},
	update: function(a) {
		this.element.setOpacity(a)
	}
});
Effect.Move = Class.create(Effect.Base, {
	initialize: function(b) {
		this.element = $(b);
		if (!this.element) {
			throw (Effect._elementDoesNotExistError)
		}
		var a = Object.extend({
			x: 0,
			y: 0,
			mode: "relative"
		},
		arguments[1] || {});
		this.start(a)
	},
	setup: function() {
		this.element.makePositioned();
		this.originalLeft = parseFloat(this.element.getStyle("left") || "0");
		this.originalTop = parseFloat(this.element.getStyle("top") || "0");
		if (this.options.mode == "absolute") {
			this.options.x = this.options.x - this.originalLeft;
			this.options.y = this.options.y - this.originalTop
		}
	},
	update: function(a) {
		this.element.setStyle({
			left: (this.options.x * a + this.originalLeft).round() + "px",
			top: (this.options.y * a + this.originalTop).round() + "px"
		})
	}
});
Effect.MoveBy = function(b, a, g) {
	return new Effect.Move(b, Object.extend({
		x: g,
		y: a
	},
	arguments[3] || {}))
};
Effect.Scale = Class.create(Effect.Base, {
	initialize: function(b, g) {
		this.element = $(b);
		if (!this.element) {
			throw (Effect._elementDoesNotExistError)
		}
		var a = Object.extend({
			scaleX: true,
			scaleY: true,
			scaleContent: true,
			scaleFromCenter: false,
			scaleMode: "box",
			scaleFrom: 100,
			scaleTo: g
		},
		arguments[2] || {});
		this.start(a)
	},
	setup: function() {
		this.restoreAfterFinish = this.options.restoreAfterFinish || false;
		this.elementPositioning = this.element.getStyle("position");
		this.originalStyle = {};
		["top", "left", "width", "height", "fontSize"].each(function(b) {
			this.originalStyle[b] = this.element.style[b]
		}.bind(this));
		this.originalTop = this.element.offsetTop;
		this.originalLeft = this.element.offsetLeft;
		var a = this.element.getStyle("font-size") || "100%";
		["em", "px", "%", "pt"].each(function(b) {
			if (a.indexOf(b) > 0) {
				this.fontSize = parseFloat(a);
				this.fontSizeType = b
			}
		}.bind(this));
		this.factor = (this.options.scaleTo - this.options.scaleFrom) / 100;
		this.dims = null;
		if (this.options.scaleMode == "box") {
			this.dims = [this.element.offsetHeight, this.element.offsetWidth]
		}
		if (/^content/.test(this.options.scaleMode)) {
			this.dims = [this.element.scrollHeight, this.element.scrollWidth]
		}
		if (!this.dims) {
			this.dims = [this.options.scaleMode.originalHeight, this.options.scaleMode.originalWidth]
		}
	},
	update: function(a) {
		var b = (this.options.scaleFrom / 100) + (this.factor * a);
		if (this.options.scaleContent && this.fontSize) {
			this.element.setStyle({
				fontSize: this.fontSize * b + this.fontSizeType
			})
		}
		this.setDimensions(this.dims[0] * b, this.dims[1] * b)
	},
	finish: function(a) {
		if (this.restoreAfterFinish) {
			this.element.setStyle(this.originalStyle)
		}
	},
	setDimensions: function(a, m) {
		var o = {};
		if (this.options.scaleX) {
			o.width = m.round() + "px"
		}
		if (this.options.scaleY) {
			o.height = a.round() + "px"
		}
		if (this.options.scaleFromCenter) {
			var g = (a - this.dims[0]) / 2;
			var b = (m - this.dims[1]) / 2;
			if (this.elementPositioning == "absolute") {
				if (this.options.scaleY) {
					o.top = this.originalTop - g + "px"
				}
				if (this.options.scaleX) {
					o.left = this.originalLeft - b + "px"
				}
			} else {
				if (this.options.scaleY) {
					o.top = -g + "px"
				}
				if (this.options.scaleX) {
					o.left = -b + "px"
				}
			}
		}
		this.element.setStyle(o)
	}
});
Effect.Highlight = Class.create(Effect.Base, {
	initialize: function(b) {
		this.element = $(b);
		if (!this.element) {
			throw (Effect._elementDoesNotExistError)
		}
		var a = Object.extend({
			startcolor: "#ffff99"
		},
		arguments[1] || {});
		this.start(a)
	},
	setup: function() {
		if (this.element.getStyle("display") == "none") {
			this.cancel();
			return
		}
		this.oldStyle = {};
		if (!this.options.keepBackgroundImage) {
			this.oldStyle.backgroundImage = this.element.getStyle("background-image");
			this.element.setStyle({
				backgroundImage: "none"
			})
		}
		if (!this.options.endcolor) {
			this.options.endcolor = this.element.getStyle("background-color").parseColor("#ffffff")
		}
		if (!this.options.restorecolor) {
			this.options.restorecolor = this.element.getStyle("background-color")
		}
		this._base = $R(0, 2).map(function(a) {
			return parseInt(this.options.startcolor.slice(a * 2 + 1, a * 2 + 3), 16)
		}.bind(this));
		this._delta = $R(0, 2).map(function(a) {
			return parseInt(this.options.endcolor.slice(a * 2 + 1, a * 2 + 3), 16) - this._base[a]
		}.bind(this))
	},
	update: function(a) {
		this.element.setStyle({
			backgroundColor: $R(0, 2).inject("#",
			function(b, g, o) {
				return b + ((this._base[o] + (this._delta[o] * a)).round().toColorPart())
			}.bind(this))
		})
	},
	finish: function() {
		this.element.setStyle(Object.extend(this.oldStyle, {
			backgroundColor: this.options.restorecolor
		}))
	}
});
Effect.ScrollTo = function(g) {
	var b = arguments[1] || {},
	a = document.viewport.getScrollOffsets(),
	m = $(g).cumulativeOffset();
	if (b.offset) {
		m[1] += b.offset
	}
	return new Effect.Tween(null, a.top, m[1], b,
	function(o) {
		scrollTo(a.left, o.round())
	})
};
Effect.Fade = function(g) {
	g = $(g);
	var a = g.getInlineOpacity();
	var b = Object.extend({
		from: g.getOpacity() || 1,
		to: 0,
		afterFinishInternal: function(m) {
			if (m.options.to != 0) {
				return
			}
			m.element.hide().setStyle({
				opacity: a
			})
		}
	},
	arguments[1] || {});
	return new Effect.Opacity(g, b)
};
Effect.Appear = function(b) {
	b = $(b);
	var a = Object.extend({
		from: (b.getStyle("display") == "none" ? 0 : b.getOpacity() || 0),
		to: 1,
		afterFinishInternal: function(g) {
			g.element.forceRerendering()
		},
		beforeSetup: function(g) {
			g.element.setOpacity(g.options.from).show()
		}
	},
	arguments[1] || {});
	return new Effect.Opacity(b, a)
};
Effect.Puff = function(b) {
	b = $(b);
	var a = {
		opacity: b.getInlineOpacity(),
		position: b.getStyle("position"),
		top: b.style.top,
		left: b.style.left,
		width: b.style.width,
		height: b.style.height
	};
	return new Effect.Parallel([new Effect.Scale(b, 200, {
		sync: true,
		scaleFromCenter: true,
		scaleContent: true,
		restoreAfterFinish: true
	}), new Effect.Opacity(b, {
		sync: true,
		to: 0
	})], Object.extend({
		duration: 1,
		beforeSetupInternal: function(g) {
			Position.absolutize(g.effects[0].element)
		},
		afterFinishInternal: function(g) {
			g.effects[0].element.hide().setStyle(a)
		}
	},
	arguments[1] || {}))
};
Effect.BlindUp = function(a) {
	a = $(a);
	a.makeClipping();
	return new Effect.Scale(a, 0, Object.extend({
		scaleContent: false,
		scaleX: false,
		restoreAfterFinish: true,
		afterFinishInternal: function(b) {
			b.element.hide().undoClipping()
		}
	},
	arguments[1] || {}))
};
Effect.BlindDown = function(b) {
	b = $(b);
	var a = b.getDimensions();
	return new Effect.Scale(b, 100, Object.extend({
		scaleContent: false,
		scaleX: false,
		scaleFrom: 0,
		scaleMode: {
			originalHeight: a.height,
			originalWidth: a.width
		},
		restoreAfterFinish: true,
		afterSetup: function(g) {
			g.element.makeClipping().setStyle({
				height: "0px"
			}).show()
		},
		afterFinishInternal: function(g) {
			g.element.undoClipping()
		}
	},
	arguments[1] || {}))
};
Effect.SwitchOff = function(b) {
	b = $(b);
	var a = b.getInlineOpacity();
	return new Effect.Appear(b, Object.extend({
		duration: 0.4,
		from: 0,
		transition: Effect.Transitions.flicker,
		afterFinishInternal: function(g) {
			new Effect.Scale(g.element, 1, {
				duration: 0.3,
				scaleFromCenter: true,
				scaleX: false,
				scaleContent: false,
				restoreAfterFinish: true,
				beforeSetup: function(m) {
					m.element.makePositioned().makeClipping()
				},
				afterFinishInternal: function(m) {
					m.element.hide().undoClipping().undoPositioned().setStyle({
						opacity: a
					})
				}
			})
		}
	},
	arguments[1] || {}))
};
Effect.DropOut = function(b) {
	b = $(b);
	var a = {
		top: b.getStyle("top"),
		left: b.getStyle("left"),
		opacity: b.getInlineOpacity()
	};
	return new Effect.Parallel([new Effect.Move(b, {
		x: 0,
		y: 100,
		sync: true
	}), new Effect.Opacity(b, {
		sync: true,
		to: 0
	})], Object.extend({
		duration: 0.5,
		beforeSetup: function(g) {
			g.effects[0].element.makePositioned()
		},
		afterFinishInternal: function(g) {
			g.effects[0].element.hide().undoPositioned().setStyle(a)
		}
	},
	arguments[1] || {}))
};
Effect.Shake = function(m) {
	m = $(m);
	var b = Object.extend({
		distance: 20,
		duration: 0.5
	},
	arguments[1] || {});
	var o = parseFloat(b.distance);
	var g = parseFloat(b.duration) / 10;
	var a = {
		top: m.getStyle("top"),
		left: m.getStyle("left")
	};
	return new Effect.Move(m, {
		x: o,
		y: 0,
		duration: g,
		afterFinishInternal: function(q) {
			new Effect.Move(q.element, {
				x: -o * 2,
				y: 0,
				duration: g * 2,
				afterFinishInternal: function(r) {
					new Effect.Move(r.element, {
						x: o * 2,
						y: 0,
						duration: g * 2,
						afterFinishInternal: function(u) {
							new Effect.Move(u.element, {
								x: -o * 2,
								y: 0,
								duration: g * 2,
								afterFinishInternal: function(x) {
									new Effect.Move(x.element, {
										x: o * 2,
										y: 0,
										duration: g * 2,
										afterFinishInternal: function(y) {
											new Effect.Move(y.element, {
												x: -o,
												y: 0,
												duration: g,
												afterFinishInternal: function(z) {
													z.element.undoPositioned().setStyle(a)
												}
											})
										}
									})
								}
							})
						}
					})
				}
			})
		}
	})
};
Effect.SlideDown = function(g) {
	g = $(g).cleanWhitespace();
	var a = g.down().getStyle("bottom");
	var b = g.getDimensions();
	return new Effect.Scale(g, 100, Object.extend({
		scaleContent: false,
		scaleX: false,
		scaleFrom: window.opera ? 0 : 1,
		scaleMode: {
			originalHeight: b.height,
			originalWidth: b.width
		},
		restoreAfterFinish: true,
		afterSetup: function(m) {
			m.element.makePositioned();
			m.element.down().makePositioned();
			if (window.opera) {
				m.element.setStyle({
					top: ""
				})
			}
			m.element.makeClipping().setStyle({
				height: "0px"
			}).show()
		},
		afterUpdateInternal: function(m) {
			m.element.down().setStyle({
				bottom: (m.dims[0] - m.element.clientHeight) + "px"
			})
		},
		afterFinishInternal: function(m) {
			m.element.undoClipping().undoPositioned();
			m.element.down().undoPositioned().setStyle({
				bottom: a
			})
		}
	},
	arguments[1] || {}))
};
Effect.SlideUp = function(g) {
	g = $(g).cleanWhitespace();
	var a = g.down().getStyle("bottom");
	var b = g.getDimensions();
	return new Effect.Scale(g, window.opera ? 0 : 1, Object.extend({
		scaleContent: false,
		scaleX: false,
		scaleMode: "box",
		scaleFrom: 100,
		scaleMode: {
			originalHeight: b.height,
			originalWidth: b.width
		},
		restoreAfterFinish: true,
		afterSetup: function(m) {
			m.element.makePositioned();
			m.element.down().makePositioned();
			if (window.opera) {
				m.element.setStyle({
					top: ""
				})
			}
			m.element.makeClipping().show()
		},
		afterUpdateInternal: function(m) {
			m.element.down().setStyle({
				bottom: (m.dims[0] - m.element.clientHeight) + "px"
			})
		},
		afterFinishInternal: function(m) {
			m.element.hide().undoClipping().undoPositioned();
			m.element.down().undoPositioned().setStyle({
				bottom: a
			})
		}
	},
	arguments[1] || {}))
};
Effect.Squish = function(a) {
	return new Effect.Scale(a, window.opera ? 1 : 0, {
		restoreAfterFinish: true,
		beforeSetup: function(b) {
			b.element.makeClipping()
		},
		afterFinishInternal: function(b) {
			b.element.hide().undoClipping()
		}
	})
};
Effect.Grow = function(g) {
	g = $(g);
	var b = Object.extend({
		direction: "center",
		moveTransition: Effect.Transitions.sinoidal,
		scaleTransition: Effect.Transitions.sinoidal,
		opacityTransition: Effect.Transitions.full
	},
	arguments[1] || {});
	var a = {
		top: g.style.top,
		left: g.style.left,
		height: g.style.height,
		width: g.style.width,
		opacity: g.getInlineOpacity()
	};
	var r = g.getDimensions();
	var u, q;
	var o, m;
	switch (b.direction) {
	case "top-left":
		u = q = o = m = 0;
		break;
	case "top-right":
		u = r.width;
		q = m = 0;
		o = -r.width;
		break;
	case "bottom-left":
		u = o = 0;
		q = r.height;
		m = -r.height;
		break;
	case "bottom-right":
		u = r.width;
		q = r.height;
		o = -r.width;
		m = -r.height;
		break;
	case "center":
		u = r.width / 2;
		q = r.height / 2;
		o = -r.width / 2;
		m = -r.height / 2;
		break
	}
	return new Effect.Move(g, {
		x: u,
		y: q,
		duration: 0.01,
		beforeSetup: function(x) {
			x.element.hide().makeClipping().makePositioned()
		},
		afterFinishInternal: function(x) {
			new Effect.Parallel([new Effect.Opacity(x.element, {
				sync: true,
				to: 1,
				from: 0,
				transition: b.opacityTransition
			}), new Effect.Move(x.element, {
				x: o,
				y: m,
				sync: true,
				transition: b.moveTransition
			}), new Effect.Scale(x.element, 100, {
				scaleMode: {
					originalHeight: r.height,
					originalWidth: r.width
				},
				sync: true,
				scaleFrom: window.opera ? 1 : 0,
				transition: b.scaleTransition,
				restoreAfterFinish: true
			})], Object.extend({
				beforeSetup: function(y) {
					y.effects[0].element.setStyle({
						height: "0px"
					}).show()
				},
				afterFinishInternal: function(y) {
					y.effects[0].element.undoClipping().undoPositioned().setStyle(a)
				}
			},
			b))
		}
	})
};
Effect.Shrink = function(g) {
	g = $(g);
	var b = Object.extend({
		direction: "center",
		moveTransition: Effect.Transitions.sinoidal,
		scaleTransition: Effect.Transitions.sinoidal,
		opacityTransition: Effect.Transitions.none
	},
	arguments[1] || {});
	var a = {
		top: g.style.top,
		left: g.style.left,
		height: g.style.height,
		width: g.style.width,
		opacity: g.getInlineOpacity()
	};
	var q = g.getDimensions();
	var o, m;
	switch (b.direction) {
	case "top-left":
		o = m = 0;
		break;
	case "top-right":
		o = q.width;
		m = 0;
		break;
	case "bottom-left":
		o = 0;
		m = q.height;
		break;
	case "bottom-right":
		o = q.width;
		m = q.height;
		break;
	case "center":
		o = q.width / 2;
		m = q.height / 2;
		break
	}
	return new Effect.Parallel([new Effect.Opacity(g, {
		sync: true,
		to: 0,
		from: 1,
		transition: b.opacityTransition
	}), new Effect.Scale(g, window.opera ? 1 : 0, {
		sync: true,
		transition: b.scaleTransition,
		restoreAfterFinish: true
	}), new Effect.Move(g, {
		x: o,
		y: m,
		sync: true,
		transition: b.moveTransition
	})], Object.extend({
		beforeStartInternal: function(r) {
			r.effects[0].element.makePositioned().makeClipping()
		},
		afterFinishInternal: function(r) {
			r.effects[0].element.hide().undoClipping().undoPositioned().setStyle(a)
		}
	},
	b))
};
Effect.Pulsate = function(g) {
	g = $(g);
	var b = arguments[1] || {},
	a = g.getInlineOpacity(),
	o = b.transition || Effect.Transitions.linear,
	m = function(q) {
		return 1 - o(( - Math.cos((q * (b.pulses || 5) * 2) * Math.PI) / 2) + 0.5)
	};
	return new Effect.Opacity(g, Object.extend(Object.extend({
		duration: 2,
		from: 0,
		afterFinishInternal: function(q) {
			q.element.setStyle({
				opacity: a
			})
		}
	},
	b), {
		transition: m
	}))
};
Effect.Fold = function(b) {
	b = $(b);
	var a = {
		top: b.style.top,
		left: b.style.left,
		width: b.style.width,
		height: b.style.height
	};
	b.makeClipping();
	return new Effect.Scale(b, 5, Object.extend({
		scaleContent: false,
		scaleX: false,
		afterFinishInternal: function(g) {
			new Effect.Scale(b, 1, {
				scaleContent: false,
				scaleY: false,
				afterFinishInternal: function(m) {
					m.element.hide().undoClipping().setStyle(a)
				}
			})
		}
	},
	arguments[1] || {}))
};
Effect.Morph = Class.create(Effect.Base, {
	initialize: function(g) {
		this.element = $(g);
		if (!this.element) {
			throw (Effect._elementDoesNotExistError)
		}
		var a = Object.extend({
			style: {}
		},
		arguments[1] || {});
		if (!Object.isString(a.style)) {
			this.style = $H(a.style)
		} else {
			if (a.style.include(":")) {
				this.style = a.style.parseStyle()
			} else {
				this.element.addClassName(a.style);
				this.style = $H(this.element.getStyles());
				this.element.removeClassName(a.style);
				var b = this.element.getStyles();
				this.style = this.style.reject(function(m) {
					return m.value == b[m.key]
				});
				a.afterFinishInternal = function(m) {
					m.element.addClassName(m.options.style);
					m.transforms.each(function(o) {
						m.element.style[o.style] = ""
					})
				}
			}
		}
		this.start(a)
	},
	setup: function() {
		function a(b) {
			if (!b || ["rgba(0, 0, 0, 0)", "transparent"].include(b)) {
				b = "#ffffff"
			}
			b = b.parseColor();
			return $R(0, 2).map(function(g) {
				return parseInt(b.slice(g * 2 + 1, g * 2 + 3), 16)
			})
		}
		this.transforms = this.style.map(function(r) {
			var q = r[0],
			o = r[1],
			m = null;
			if (o.parseColor("#zzzzzz") != "#zzzzzz") {
				o = o.parseColor();
				m = "color"
			} else {
				if (q == "opacity") {
					o = parseFloat(o);
					if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) {
						this.element.setStyle({
							zoom: 1
						})
					}
				} else {
					if (Element.CSS_LENGTH.test(o)) {
						var g = o.match(/^([\+\-]?[0-9\.]+)(.*)$/);
						o = parseFloat(g[1]);
						m = (g.length == 3) ? g[2] : null
					}
				}
			}
			var b = this.element.getStyle(q);
			return {
				style: q.camelize(),
				originalValue: m == "color" ? a(b) : parseFloat(b || 0),
				targetValue: m == "color" ? a(o) : o,
				unit: m
			}
		}.bind(this)).reject(function(b) {
			return ((b.originalValue == b.targetValue) || (b.unit != "color" && (isNaN(b.originalValue) || isNaN(b.targetValue))))
		})
	},
	update: function(a) {
		var m = {},
		b, g = this.transforms.length;
		while (g--) {
			m[(b = this.transforms[g]).style] = b.unit == "color" ? "#" + (Math.round(b.originalValue[0] + (b.targetValue[0] - b.originalValue[0]) * a)).toColorPart() + (Math.round(b.originalValue[1] + (b.targetValue[1] - b.originalValue[1]) * a)).toColorPart() + (Math.round(b.originalValue[2] + (b.targetValue[2] - b.originalValue[2]) * a)).toColorPart() : (b.originalValue + (b.targetValue - b.originalValue) * a).toFixed(3) + (b.unit === null ? "": b.unit)
		}
		this.element.setStyle(m, true)
	}
});
Effect.Transform = Class.create({
	initialize: function(a) {
		this.tracks = [];
		this.options = arguments[1] || {};
		this.addTracks(a)
	},
	addTracks: function(a) {
		a.each(function(b) {
			b = $H(b);
			var g = b.values().first();
			this.tracks.push($H({
				ids: b.keys().first(),
				effect: Effect.Morph,
				options: {
					style: g
				}
			}))
		}.bind(this));
		return this
	},
	play: function() {
		return new Effect.Parallel(this.tracks.map(function(a) {
			var m = a.get("ids"),
			g = a.get("effect"),
			b = a.get("options");
			var o = [$(m) || $$(m)].flatten();
			return o.map(function(q) {
				return new g(q, Object.extend({
					sync: true
				},
				b))
			})
		}).flatten(), this.options)
	}
});
Element.CSS_PROPERTIES = $w("backgroundColor backgroundPosition borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderSpacing borderTopColor borderTopStyle borderTopWidth bottom clip color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop markerOffset maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex");
Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.__parseStyleElement = document.createElement("div");
String.prototype.parseStyle = function() {
	var b, a = $H();
	if (Prototype.Browser.WebKit) {
		b = new Element("div", {
			style: this
		}).style
	} else {
		String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>';
		b = String.__parseStyleElement.childNodes[0].style
	}
	Element.CSS_PROPERTIES.each(function(g) {
		if (b[g]) {
			a.set(g, b[g])
		}
	});
	if (Prototype.Browser.IE && this.include("opacity")) {
		a.set("opacity", this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1])
	}
	return a
};
if (document.defaultView && document.defaultView.getComputedStyle) {
	Element.getStyles = function(b) {
		var a = document.defaultView.getComputedStyle($(b), null);
		return Element.CSS_PROPERTIES.inject({},
		function(g, m) {
			g[m] = a[m];
			return g
		})
	}
} else {
	Element.getStyles = function(b) {
		b = $(b);
		var a = b.currentStyle,
		g;
		g = Element.CSS_PROPERTIES.inject({},
		function(m, o) {
			m[o] = a[o];
			return m
		});
		if (!g.opacity) {
			g.opacity = b.getOpacity()
		}
		return g
	}
}
Effect.Methods = {
	morph: function(a, b) {
		a = $(a);
		new Effect.Morph(a, Object.extend({
			style: b
		},
		arguments[2] || {}));
		return a
	},
	visualEffect: function(g, o, b) {
		g = $(g);
		var m = o.dasherize().camelize(),
		a = m.charAt(0).toUpperCase() + m.substring(1);
		new Effect[a](g, b);
		return g
	},
	highlight: function(b, a) {
		b = $(b);
		new Effect.Highlight(b, a);
		return b
	}
};
$w("fade appear grow shrink fold blindUp blindDown slideUp slideDown pulsate shake puff squish switchOff dropOut").each(function(a) {
	Effect.Methods[a] = function(g, b) {
		g = $(g);
		Effect[a.charAt(0).toUpperCase() + a.substring(1)](g, b);
		return g
	}
});
$w("getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles").each(function(a) {
	Effect.Methods[a] = Element[a]
});
Element.addMethods(Effect.Methods);
var dateFormat = function() {
	var a = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	b = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	m = /[^-+\dA-Z]/g,
	g = function(q, o) {
		q = String(q);
		o = o || 2;
		while (q.length < o) {
			q = "0" + q
		}
		return q
	};
	return function(z, N, G) {
		var u = dateFormat;
		if (arguments.length == 1 && Object.prototype.toString.call(z) == "[object String]" && !/\d/.test(z)) {
			N = z;
			z = undefined
		}
		z = z ? new Date(z) : new Date;
		if (isNaN(z)) {
			throw SyntaxError("invalid date")
		}
		N = String(u.masks[N] || N || u.masks["default"]);
		if (N.slice(0, 4) == "UTC:") {
			N = N.slice(4);
			G = true
		}
		var J = G ? "getUTC": "get",
		C = z[J + "Date"](),
		q = z[J + "Day"](),
		A = z[J + "Month"](),
		F = z[J + "FullYear"](),
		I = z[J + "Hours"](),
		B = z[J + "Minutes"](),
		K = z[J + "Seconds"](),
		E = z[J + "Milliseconds"](),
		r = G ? 0 : z.getTimezoneOffset(),
		x = {
			d: C,
			dd: g(C),
			ddd: u.i18n.dayNames[q],
			dddd: u.i18n.dayNames[q + 7],
			m: A + 1,
			mm: g(A + 1),
			mmm: u.i18n.monthNames[A],
			mmmm: u.i18n.monthNames[A + 12],
			yy: String(F).slice(2),
			yyyy: F,
			h: I % 12 || 12,
			hh: g(I % 12 || 12),
			H: I,
			HH: g(I),
			M: B,
			MM: g(B),
			s: K,
			ss: g(K),
			l: g(E, 3),
			L: g(E > 99 ? Math.round(E / 10) : E),
			t: I < 12 ? "a": "p",
			tt: I < 12 ? "am": "pm",
			T: I < 12 ? "A": "P",
			TT: I < 12 ? "AM": "PM",
			Z: G ? "UTC": (String(z).match(b) || [""]).pop().replace(m, ""),
			o: (r > 0 ? "-": "+") + g(Math.floor(Math.abs(r) / 60) * 100 + Math.abs(r) % 60, 4),
			S: ["th", "st", "nd", "rd"][C % 10 > 3 ? 0 : (C % 100 - C % 10 != 10) * C % 10]
		};
		return N.replace(a,
		function(o) {
			return o in x ? x[o] : o.slice(1, o.length - 1)
		})
	}
} ();
dateFormat.masks = {
	"default": "ddd mmm dd yyyy HH:MM:ss",
	shortDate: "m/d/yy",
	mediumDate: "mmm d, yyyy",
	longDate: "mmmm d, yyyy",
	fullDate: "dddd, mmmm d, yyyy",
	shortTime: "h:MM TT",
	mediumTime: "h:MM:ss TT",
	longTime: "h:MM:ss TT Z",
	isoDate: "yyyy-mm-dd",
	isoTime: "HH:MM:ss",
	isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
dateFormat.i18n = {
	dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
Date.prototype.format = function(a, b) {
	return dateFormat(this, a, b)
};
(function(u) {
	var B = {},
	A = u.document,
	m = "localStorage",
	b = "script",
	r;
	B.disabled = false;
	B.set = function(D, E) {};
	B.get = function(D) {};
	B.remove = function(D) {};
	B.clear = function() {};
	B.transact = function(D, G, E) {
		var F = B.get(D);
		if (E == null) {
			E = G;
			G = null
		}
		if (typeof F == "undefined") {
			F = G || {}
		}
		E(F);
		B.set(D, F)
	};
	B.getAll = function() {};
	B.forEach = function() {};
	B.serialize = function(D) {
		return JSON.stringify(D)
	};
	B.deserialize = function(D) {
		if (typeof D != "string") {
			return undefined
		}
		try {
			return JSON.parse(D)
		} catch(E) {
			return D || undefined
		}
	};
	function g() {
		try {
			return (m in u && u[m])
		} catch(D) {
			return false
		}
	}
	if (g()) {
		r = u[m];
		B.set = function(D, E) {
			if (E === undefined) {
				return B.remove(D)
			}
			r.setItem(D, B.serialize(E));
			return E
		};
		B.get = function(D) {
			return B.deserialize(r.getItem(D))
		};
		B.remove = function(D) {
			r.removeItem(D)
		};
		B.clear = function() {
			r.clear()
		};
		B.getAll = function() {
			var D = {};
			B.forEach(function(E, F) {
				D[E] = F
			});
			return D
		};
		B.forEach = function(F) {
			for (var E = 0; E < r.length; E++) {
				var D = r.key(E);
				F(D, B.get(D))
			}
		}
	} else {
		if (A.documentElement.addBehavior) {
			var z, q;
			try {
				q = new ActiveXObject("htmlfile");
				q.open();
				q.write("<" + b + ">document.w=window</" + b + '><iframe src="/favicon.ico"></iframe>');
				q.close();
				z = q.w.frames[0].document;
				r = z.createElement("div")
			} catch(y) {
				r = A.createElement("div");
				z = A.body
			}
			function a(D) {
				return function() {
					var F = Array.prototype.slice.call(arguments, 0);
					F.unshift(r);
					z.appendChild(r);
					r.addBehavior("#default#userData");
					r.load(m);
					var E = D.apply(B, F);
					z.removeChild(r);
					return E
				}
			}
			var o = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
			function C(D) {
				return D.replace(o, "___")
			}
			B.set = a(function(F, D, E) {
				D = C(D);
				if (E === undefined) {
					return B.remove(D)
				}
				F.setAttribute(D, B.serialize(E));
				F.save(m);
				return E
			});
			B.get = a(function(E, D) {
				D = C(D);
				return B.deserialize(E.getAttribute(D))
			});
			B.remove = a(function(E, D) {
				D = C(D);
				E.removeAttribute(D);
				E.save(m)
			});
			B.clear = a(function(G) {
				var E = G.XMLDocument.documentElement.attributes;
				G.load(m);
				for (var F = 0, D; D = E[F]; F++) {
					G.removeAttribute(D.name)
				}
				G.save(m)
			});
			B.getAll = function(E) {
				var D = {};
				B.forEach(function(F, G) {
					D[F] = G
				});
				return D
			};
			B.forEach = a(function(H, G) {
				var E = H.XMLDocument.documentElement.attributes;
				for (var F = 0, D; D = E[F]; ++F) {
					G(D.name, B.deserialize(H.getAttribute(D.name)))
				}
			})
		}
	}
	try {
		var x = "__storejs__";
		B.set(x, x);
		if (B.get(x) != x) {
			B.disabled = true
		}
		B.remove(x)
	} catch(y) {
		B.disabled = true
	}
	B.enabled = !B.disabled;
	if (typeof module != "undefined" && module.exports) {
		module.exports = B
	} else {
		if (typeof define === "function" && define.amd) {
			define(B)
		} else {
			u.storejs = B
		}
	}
})(this.window || global);
(function(a, b) {
	if (typeof exports === "object" && module) {
		module.exports = b()
	} else {
		if (typeof define === "function" && define.amd) {
			define(b)
		} else {
			a.PubSub = b()
		}
	}
} ((typeof window === "object" && window) || this,
function() {
	var z = {},
	o = {},
	x = -1;
	function u(B) {
		var A;
		for (A in B) {
			if (B.hasOwnProperty(A)) {
				return true
			}
		}
		return false
	}
	function y(B) {
		return function A() {
			throw B
		}
	}
	function b(B, C, D) {
		try {
			B(C, D)
		} catch(A) {
			setTimeout(y(A), 0)
		}
	}
	function q(A, B, C) {
		A(B, C)
	}
	function m(B, D, E, G) {
		var F = o[D],
		A = G ? q: b,
		C;
		if (!o.hasOwnProperty(D)) {
			return
		}
		for (C in F) {
			if (F.hasOwnProperty(C)) {
				A(F[C], B, E)
			}
		}
	}
	function g(A, B, D) {
		return function C() {
			var F = String(A),
			E = F.lastIndexOf(".");
			m(A, A, B, D);
			while (E !== -1) {
				F = F.substr(0, E);
				E = F.lastIndexOf(".");
				m(A, F, B)
			}
		}
	}
	function r(C) {
		var B = String(C),
		D = Boolean(o.hasOwnProperty(B) && u(o[B])),
		A = B.lastIndexOf(".");
		while (!D && A !== -1) {
			B = B.substr(0, A);
			A = B.lastIndexOf(".");
			D = Boolean(o.hasOwnProperty(B) && u(o[B]))
		}
		return D
	}
	function a(C, D, B, F) {
		var E = g(C, D, F),
		A = r(C);
		if (!A) {
			return false
		}
		if (B === true) {
			E()
		} else {
			setTimeout(E, 0)
		}
		return true
	}
	z.publish = function(A, B) {
		return a(A, B, false, z.immediateExceptions)
	};
	z.publishSync = function(A, B) {
		return a(A, B, true, z.immediateExceptions)
	};
	z.subscribe = function(C, B) {
		if (typeof B !== "function") {
			return false
		}
		if (!o.hasOwnProperty(C)) {
			o[C] = {}
		}
		var A = "uid_" + String(++x);
		o[C][A] = B;
		return A
	};
	z.unsubscribe = function(G) {
		var F = typeof G === "string",
		B = false,
		A, E, D, C;
		for (A in o) {
			if (o.hasOwnProperty(A)) {
				E = o[A];
				if (F && E[G]) {
					delete E[G];
					B = G;
					break
				} else {
					if (!F) {
						for (D in E) {
							if (E.hasOwnProperty(D) && E[D] === G) {
								delete E[D];
								B = true
							}
						}
					}
				}
			}
		}
		return B
	};
	return z
}));
var UNSORTED = 0;
var SORT_ASC = 1;
var SORT_DESC = -1;
var _CUT = 1;
var _COPY = 2;
var view = null;
if (!window.Node || !window.Node.ELEMENT_NODE) {
	var Node = {
		ELEMENT_NODE: 1,
		ATTRIBUTE_NODE: 2,
		TEXT_NODE: 3,
		CDATA_SECTION_NODE: 4,
		ENTITY_REFERENCE_NODE: 5,
		ENTITY_NODE: 6,
		PROCESSING_INSTRUCTION_NODE: 7,
		COMMENT_NODE: 8,
		DOCUMENT_NODE: 9,
		DOCUMENT_TYPE_NODE: 10,
		DOCUMENT_FRAGMENT_NODE: 11,
		NOTATION_NODE: 12
	}
}
var VL = {
	Version: "1.0"
};
var Af = {
	Version: "1.0"
};
var shortStatus = null;
var debugElement = null;
var logElement = null;
var logCount = 0;
var _Error_Str = "Error - ";
var _Warning_str = "Warning - ";
var _Info_Str = "Info - ";
var __licenseExpired = "Evaluation license has expired...";
function enableDebug() {
	debugElement = document.getElementById("debug");
	if (debugElement == null) {
		var r = document.createElement("center");
		r.id = "debugContainer";
		var q = document.createElement("fieldset");
		var o = document.createElement("legend");
		o.appendChild(document.createTextNode("Debug"));
		q.appendChild(o);
		q.className = "Debug";
		q.id = "debugArea";
		var g = document.createElement("ilayer");
		g.id = "debugLayer";
		q.appendChild(g);
		var m = document.createElement("textArea");
		m.className = "DebugTextArea";
		m.id = "debug";
		debugElement = m;
		g.appendChild(m);
		r.appendChild(q);
		var a = document.getElementsByTagName("body");
		if (a.length > 0) {
			a = a[0]
		}
		a.appendChild(r)
	}
	clearDebugArea()
}
function enableLog() {
	logCount = 0;
	logElement = document.getElementById("logger");
	if (logElement == null) {
		logElement = debugElement
	}
}
function log(g, a, m, b) {
	if (logElement) {
		logCount++;
		logElement.value += "\n" + logCount + ".   " + a + m + " - " + b
	} else {
		logCount++;
		alert(logCount + ".   " + a + m + " - " + b)
	}
}
function debug(a) {
	if (debugElement) {
		debugElement.value += a + "\n"
	}
}
function debugA(a) {
	if (debugElement) {
		debugElement.value += a + "\n"
	}
}
function clearDebugArea() {
	if (debugElement) {
		debugElement.value = ""
	}
}
var _d_ = 87020;
_d_ = _d_ * 31;
_d_ = _d_ * 998;
function compareAsc(b, a) {
	if (b != null && a != null) {
		if (b < a) {
			return - 1
		} else {
			if (b > a) {
				return 1
			}
		}
	}
	if (b == a) {
		return 0
	}
	if (b == null) {
		return - 1
	} else {
		if (a == null) {
			return 1
		}
	}
	return 0
}
function compareDesc(b, a) {
	if (b != null && a != null) {
		if (b < a) {
			return 1
		} else {
			if (b > a) {
				return - 1
			}
		}
	}
	if (b == a) {
		return 0
	}
	if (b == null) {
		return 1
	} else {
		if (a == null) {
			return - 1
		}
	}
	return 0
}
function getDataByPath(u, q) {
	var b = q.split(".");
	var r = u;
	var a = b.length;
	for (var o = 0; o < (a - 1); o++) {
		var z = b[o];
		var m = z.indexOf("[");
		var y = 0;
		if (m > 0) {
			var g = z.lastIndexOf("]");
			if (g > m) {
				var x = z.substring(m + 1, g);
				y = parseInt(x)
			}
			z = z.substr(0, m)
		}
		r = r[z];
		if (r == null) {
			return null
		}
		if (r.length && r.length > y) {
			r = r[y]
		}
	}
	var z = b[a - 1];
	if (z == "") {
		return r
	} else {
		r = r[z];
		return r
	}
}
function getParentDataByPath(u, q) {
	var b = q.split(".");
	if (b.length < 2) {
		return u
	}
	var r = u;
	var a = b.length;
	for (var o = 0; o < (a - 1); o++) {
		var z = b[o];
		var m = z.indexOf("[");
		var y = 0;
		if (m > 0) {
			var g = z.lastIndexOf("]");
			if (g > m) {
				var x = z.substring(m + 1, g);
				y = parseInt(x)
			}
			z = z.substr(0, m)
		}
		r = r[z];
		if (r == null) {
			return null
		}
		if (r.length && r.length > y) {
			r = r[y]
		}
	}
	return r
}
function removeAll(g) {
	if (g != null) {
		var a = g.childNodes.length;
		for (var b = 0; b < a; b++) {
			g.removeChild(g.childNodes[0])
		}
	}
}
var is_major = null;
var is_minor = null;
var is_ns = null;
var is_ns62 = null;
var is_ns62_up = null;
var is_ns7 = null;
var is_ns7_up = null;
var is_ie = null;
var is_ie3 = null;
var is_ie4 = null;
var is_ie5 = null;
var is_ie5_5up = null;
var is_ie9_up = null;
var is_firefox = null;
var agent = setBrowserType();
var systemProps = new Object();
systemProps.is_dev_env = true;
function setBrowserType() {
	agent = navigator.userAgent.toLowerCase();
	is_major = parseInt(navigator.appVersion);
	is_minor = parseFloat(navigator.appVersion);
	is_ns = ((agent.indexOf("mozilla") != -1) && (agent.indexOf("spoofer") == -1) && (agent.indexOf("compatible") == -1) && (agent.indexOf("opera") == -1) && (agent.indexOf("webtv") == -1) && (agent.indexOf("hotjava") == -1));
	is_ns62 = ((is_ns) && (is_major == 5) && (agent.indexOf("netscape6/6.2") != -1));
	is_ns62_up = ((is_ns62) && (is_major >= 5));
	is_ns7 = ((is_ns) && (is_major == 5) && (agent.indexOf("netscape/7.0") != -1));
	is_ns7_up = ((is_ns7) && (is_major >= 5));
	is_firefox = ((is_ns) && (agent.indexOf("firefox") != -1));
	firefox_version = parseFloat(agent.substring(agent.indexOf("firefox") + 8));
	is_ie = ((agent.indexOf("msie") != -1) && (agent.indexOf("opera") == -1));
	is_ie3 = ((is_ie) && (is_major < 4));
	is_ie4 = ((is_ie) && (is_major == 4) && (agent.indexOf("msie 4") != -1));
	is_ie5 = ((is_ie) && (is_major == 4) && (agent.indexOf("msie 5.0") != -1));
	is_ie5_5up = ((is_ie) && (!is_ie3) && (!is_ie4) && (!is_ie5));
	is_ie9_up = agent.indexOf("trident") != -1;
	return agent
}
function checkBrowser() {
	if (is_ie5_5up || is_ns62_up || is_firefox) {
		return true
	} else {
		document.write("<p><b>AjaxFace is supported IE 6.0 and higher versions. Firefox support is under development.");
		document.write(" Please check back after 1/15/2006. We regret the inconvenience.</b></p>");
		return false
	}
}
function deepCopy(x, o) {
	for (var q in x) {
		var u = x[q];
		if (typeof u == "string") {
			o[q] = u
		} else {
			if (typeof u == "object") {
				try {
					if (u.length != null) {
						var g = new Array();
						for (var m = 0; m < u.length; m++) {
							var r = new Object();
							deepCopy(u[m], r);
							g.push(r)
						}
						o[q] = g
					} else {
						o[q] = u
					}
				} catch(b) {
					o[q] = u
				}
			} else {
				o[q] = u
			}
		}
	}
}
var __selectionColor = "#ccccff";
function grabFocus(a) {
	a.focus()
}
function loseFocus(a) {}
function isObjInList(b, g) {
	for (var a = 0; a < b.length; a++) {
		if (b[a] == g) {
			return true
		}
	}
	return false
}
function replaceSpecialChar(a) {
	a = a.replace("&", "&amp;");
	a = a.replace("<", "&lt;");
	a = a.replace(">", "&gt;");
	a = a.replace('"', "&quot;");
	a = a.replace("�", "&apos;");
	a = a.replace("'", "&apos;");
	return a
}
function getElementHeight(b) {
	var a = 0;
	if (b.offsetHeight) {
		a = parseInt(b.offsetHeight)
	}
	if (b.style) {
		if (b.style.marginTop) {
			a += parseInt(b.style.marginTop)
		}
		if (b.style.marginBottom) {
			a += parseInt(b.style.marginBottom)
		}
	}
	return a
}
function getDisplayAreaHeight(o, m) {
	var a = o.childNodes.length;
	var g = 0;
	for (var b = 0; b < a; b++) {
		g += getElementHeight(o.childNodes[b])
	}
	return (getElementHeight(o) - g + getElementHeight(m.childNodes[1]))
}
function consume(a) {
	if (a.stopPropagation) {
		a.stopPropagation()
	} else {
		a.cancelBubble = true
	}
	a.returnValue = false;
	return false
}
function getViewportHeight() {
	return document.viewport.getHeight()
}
function getViewportWidth() {
	return document.viewport.getWidth()
}
function toViewportPosition(b) {
	var a = Element.viewportOffset(b);
	return {
		x: a.left,
		y: a.top
	}
}
function toDocumentPosition(b) {
	var a = Element.positionedOffset(b);
	a.left -= document.body.offsetLeft;
	a.top -= document.body.offsetTop;
	return {
		x: a.left,
		y: a.top
	}
}
function docScrollLeft() {
	return document.viewport.getScrollOffsets().left
}
function docScrollTop() {
	return document.viewport.getScrollOffsets().top
}
function consumeEvent(a) {
	if (a.stopPropagation) {
		a.stopPropagation()
	} else {
		a.cancelBubble = true
	}
	a.returnValue = false;
	return false
}
function setColor(b, a) {
	a = normalizeColor(a);
	if (a == null || a == "transparent") {
		return
	}
	b.style.color = a
}
function setBackgroundColor(b, a) {
	a = normalizeColor(a);
	if (a == null) {
		return
	}
	b.style.backgroundColor = a
}
function showFullWindowMask() {
	var a = $("fullWindowMask");
	if (a) {
		a.show()
	}
}
function hideFullWindowMask() {
	var a = $("fullWindowMask");
	if (a) {
		a.hide()
	}
}
function centerElement(m, a, r) {
	if (a == null) {
		a = m.offsetWidth
	}
	if (r == null) {
		r = m.offsetHeight
	}
	var o = getViewportHeight();
	var q = getViewportWidth();
	var u = document.viewport.getScrollOffsets();
	var b = u.left;
	var x = u.top;
	var g = x + ((o - r) / 2);
	if (g < 0) {
		g = 0
	}
	m.style.top = g + "px";
	m.style.left = (b + ((q - a) / 2)) + "px"
}
Af.DragAndDrop = Class.create({
	initialize: function() {
		this.dropZones = new Array();
		this.draggables = new Array();
		this.currentDragObjects = new Array();
		this.dragElement = null;
		this.lastSelectedDraggable = null;
		this.currentDragObjectVisible = false;
		this.interestedInMotionEvents = false;
		this.uphandler = this._mouseUpHandler.bindAsEventListener(this);
		this.movehandler = this._mouseMoveHandler.bindAsEventListener(this);
		this.dragStarted = false;
		this.dragStartX_Delta = 0;
		this.dragStartY_Delta = 0
	},
	registerDropZone: function(a) {
		this.dropZones[this.dropZones.length] = a
	},
	deregisterDropZone: function(a) {
		var m = new Array();
		var b = 0;
		for (var g = 0; g < this.dropZones.length; g++) {
			if (this.dropZones[g] != a) {
				m[b++] = this.dropZones[g]
			}
		}
		this.dropZones = m
	},
	deregisterDraggable: function(a) {
		var b = new Array();
		var g = 0;
		for (var m = 0; m < this.draggables.length; m++) {
			if (this.draggables[m] != a) {
				b[g++] = this.draggables[m]
			}
		}
		this.draggables = b
	},
	clearDropZones: function() {
		this.dropZones = new Array()
	},
	clearDraggables: function() {
		this.draggables = new Array()
	},
	registerDraggable: function(a) {
		for (var b = 0; b < this.draggables.length; b++) {
			if (a.htmlElement == this.draggables[b].htmlElement) {
				return
			}
		}
		this.draggables[this.draggables.length] = a;
		this._addMouseDownHandler(a)
	},
	clearSelection: function() {
		for (var a = 0; a < this.currentDragObjects.length; a++) {
			this.currentDragObjects[a].deselect()
		}
		this.currentDragObjects = new Array();
		this.lastSelectedDraggable = null
	},
	hasSelection: function() {
		return this.currentDragObjects.length > 0
	},
	setStartDragFromElement: function(a, b) {
		this.dragStarted = false;
		this.origPos = toDocumentPosition(b);
		this.startx = a.screenX - this.origPos.x;
		this.starty = a.screenY - this.origPos.y;
		this.startScrX = a.screenX;
		this.startScrY = a.screenY;
		this.interestedInMotionEvents = this.hasSelection();
		this._terminateEvent(a)
	},
	updateSelection: function(a, b) {
		if (!b) {
			this.clearSelection()
		}
		if (a.isSelected()) {
			this.currentDragObjects.removeItem(a);
			a.deselect();
			if (a == this.lastSelectedDraggable) {
				this.lastSelectedDraggable = null
			}
		} else {
			this.currentDragObjects[this.currentDragObjects.length] = a;
			a.select();
			this.lastSelectedDraggable = a
		}
	},
	_mouseDownHandler: function(o, a) {
		if (arguments.length == 0) {
			o = event
		}
		var b = o.which != undefined;
		if ((b && o.which != 1) || (!b && o.button != 1)) {
			return
		}
		var m = o.target ? o.target: o.srcElement;
		if (a == null) {
			return
		}
		if (a.allowedTarget != null && a.allowedTarget != m) {
			return
		}
		this.updateSelection(a, o.ctrlKey);
		if (this.hasSelection()) {
			for (var g = 0; g < this.dropZones.length; g++) {
				this.dropZones[g].clearPositionCache()
			}
		}
		this.initializeEventHandlers();
		this.setStartDragFromElement(o, a.getMouseDownHTMLElement())
	},
	_mouseMoveHandler: function(g) {
		var b = g.which != undefined;
		if ((!b && g.button == 0) || g.button == null) {
			this._mouseUpHandler(g);
			return
		}
		if (!this.interestedInMotionEvents) {
			this._terminateEvent(g);
			return
		}
		if (!this.hasSelection()) {
			return
		}
		if (!this.dragStarted) {
			var a;
			var m;
			a = g.screenX;
			m = g.screenY;
			if (Math.abs(this.startScrX - a) > this.dragStartX_Delta || Math.abs(this.startScrY - m) > this.dragStartY_Delta) {
				this.dragStarted = true
			} else {
				this._terminateEvent(g);
				return
			}
		}
		if (!this.currentDragObjectVisible) {
			this._startDrag(g)
		}
		if (!this.activatedDropZones) {
			this._activateRegisteredDropZones()
		}
		this._updateDraggableLocation(g);
		this._updateDropZonesHover(g);
		this._informDragged(g);
		this._terminateEvent(g)
	},
	_makeDraggableObjectVisible: function(m) {
		if (!this.hasSelection()) {
			return
		}
		var g;
		if (this.currentDragObjects.length > 1) {
			g = this.currentDragObjects[0].getMultiObjectDragGUI(this.currentDragObjects)
		} else {
			g = this.currentDragObjects[0].getSingleObjectDragGUI()
		}
		if (g != this.currentDragObjects[0].getMouseDownHTMLElement()) {
			var b = m.pageX ? m.pageX: m.clientX;
			var a = m.pageY ? m.pageY: m.clientY;
			this.startx = this.startx - (b - this.origPos.x) + g.offsetWidth / 2;
			this.starty = this.starty - (a - this.origPos.y) + g.offsetHeight / 2
		}
		if (Element.getStyle(g, "position") != "absolute") {
			g.style.position = "absolute"
		}
		if (g.parentNode == null || g.parentNode.nodeType == 11) {
			document.body.appendChild(g)
		}
		this.dragElement = g;
		this._updateDraggableLocation(m);
		this.currentDragObjectVisible = true
	},
	_updateDraggableLocation: function(b) {
		var a = this.dragElement.style;
		a.left = (b.screenX - this.startx + (is_ie ? docScrollLeft() : 0)) + "px";
		a.top = (b.screenY - this.starty + (is_ie ? docScrollTop() : 0)) + "px"
	},
	_updateDropZonesHover: function(b) {
		var g = this.dropZones.length;
		for (var a = 0; a < g; a++) {
			if (!this._mousePointInDropZone(b, this.dropZones[a])) {
				this.dropZones[a].hideHover()
			}
		}
		for (var a = 0; a < g; a++) {
			if (this._mousePointInDropZone(b, this.dropZones[a])) {
				if (this.dropZones[a].canAccept(this.currentDragObjects)) {
					this.dropZones[a].showHover()
				}
			}
		}
	},
	_startDrag: function(b) {
		for (var a = 0; a < this.currentDragObjects.length; a++) {
			this.currentDragObjects[a].startDrag()
		}
		this._makeDraggableObjectVisible(b)
	},
	_mouseUpHandler: function(b) {
		this.uninitializeEventHandlers();
		if (!this.hasSelection()) {
			return
		}
		var a = b.which != undefined;
		if ((a && b.which != 1) || (!a && b.button != 1)) {
			return
		}
		this.interestedInMotionEvents = false;
		if (this.dragElement == null) {
			this._terminateEvent(b);
			return
		}
		var g = false;
		if (this.currentDragObjects.length == 1) {
			g = this.currentDragObjects[0].repositionable
		}
		if (this._placeDraggableInDropZone(b) || g) {
			this._completeDropOperation(b)
		} else {
			this._terminateEvent(b);
			new Effect.Move(this.dragElement, {
				x: this.origPos.x,
				y: this.origPos.y,
				afterFinish: this._doCancelDragProcessing.bind(this),
				duration: 0.2,
				mode: "absolute"
			})
		}
	},
	_completeDropOperation: function(a) {
		if (this.dragElement == null) {
			return
		}
		if (this.dragElement != this.currentDragObjects[0].getMouseDownHTMLElement()) {
			if (this.dragElement.parentNode != null) {
				this.dragElement.parentNode.removeChild(this.dragElement)
			}
		}
		this._deactivateRegisteredDropZones();
		this._endDrag();
		this.clearSelection();
		this.dragElement = null;
		this.currentDragObjectVisible = false;
		this._terminateEvent(a)
	},
	_doCancelDragProcessing: function() {
		if (this.dragElement == null) {
			return
		}
		this._cancelDrag();
		if (this.dragElement != this.currentDragObjects[0].getMouseDownHTMLElement()) {
			if (this.dragElement.parentNode != null) {
				this.dragElement.parentNode.removeChild(this.dragElement)
			}
		}
		this._deactivateRegisteredDropZones();
		this.dragElement = null;
		this.currentDragObjectVisible = false
	},
	doCancel: function() {
		if (this.dragElement == null) {
			return
		}
		this.uninitializeEventHandlers();
		if (!this.hasSelection()) {
			return
		}
		new Effect.Move(this.dragElement, {
			x: this.origPos.x,
			y: this.origPos.y,
			afterFinish: this._doCancelDragProcessing.bind(this),
			duration: 0.2,
			mode: "absolute"
		})
	},
	doComplete: function(a) {
		if (this.dragElement == null) {
			return
		}
		if (this.dragElement != this.currentDragObjects[0].getMouseDownHTMLElement()) {
			if (this.dragElement.parentNode != null) {
				this.dragElement.parentNode.removeChild(this.dragElement)
			}
		}
		this._deactivateRegisteredDropZones();
		this._endDrag();
		this.clearSelection();
		this.dragElement = null;
		this.currentDragObjectVisible = false
	},
	_placeDraggableInDropZone: function(g) {
		var a = false;
		var m = this.dropZones.length;
		for (var b = 0; b < m; b++) {
			if (this._mousePointInDropZone(g, this.dropZones[b])) {
				if (this.dropZones[b].canAccept(this.currentDragObjects)) {
					this.dropZones[b].hideHover();
					this.dropZones[b].accept(this.currentDragObjects, g);
					a = true;
					break
				}
			}
		}
		return a
	},
	_cancelDrag: function() {
		for (var a = 0; a < this.currentDragObjects.length; a++) {
			this.currentDragObjects[a].cancelDrag()
		}
	},
	_endDrag: function() {
		for (var a = 0; a < this.currentDragObjects.length; a++) {
			this.currentDragObjects[a].endDrag()
		}
	},
	_informDragged: function(b) {
		var g = this.dropZones.length;
		for (var a = 0; a < g; a++) {
			if (this._mousePointInDropZone(b, this.dropZones[a])) {
				if (this.dropZones[a].canAccept(this.currentDragObjects)) {
					this.dropZones[a].dragged(b, this.currentDragObjects);
					break
				}
			}
		}
	},
	_mousePointInDropZone: function(b, g) {
		var a = g.getAbsoluteRect();
		return b.clientX > a.left && b.clientX < a.right && b.clientY > a.top && b.clientY < a.bottom
	},
	_addMouseDownHandler: function(a) {
		var b = a.getMouseDownHTMLElement();
		if (b != null) {
			this._addMouseDownEvent(b, a)
		}
	},
	_activateRegisteredDropZones: function() {
		var g = this.dropZones.length;
		for (var a = 0; a < g; a++) {
			var b = this.dropZones[a];
			if (b.canAccept(this.currentDragObjects)) {
				b.activate(this.currentDragObjects)
			}
		}
		this.activatedDropZones = true
	},
	_deactivateRegisteredDropZones: function() {
		var b = this.dropZones.length;
		for (var a = 0; a < b; a++) {
			this.dropZones[a].deactivate(this.currentDragObjects)
		}
		this.activatedDropZones = false
	},
	_addMouseDownEvent: function(b, a) {
		if (b.addEventListener) {
			b.addEventListener("mousedown", this._mouseDownHandler.bindAsEventListener(this, a), false)
		} else {
			b.attachEvent("onmousedown", this._mouseDownHandler.bindAsEventListener(this, a))
		}
	},
	_terminateEvent: function(a) {
		if (a.stopPropagation != undefined) {
			a.stopPropagation()
		} else {
			if (a.cancelBubble != undefined) {
				a.cancelBubble = true
			}
		}
		if (a.preventDefault != undefined) {
			a.preventDefault()
		} else {
			a.returnValue = false
		}
	},
	initializeEventHandlers: function() {
		if (document.addEventListener) {
			document.addEventListener("mouseup", this._mouseUpHandler.bindAsEventListener(this), false);
			document.addEventListener("mousemove", this._mouseMoveHandler.bindAsEventListener(this), false)
		} else {
			document.attachEvent("onmouseup", this.uphandler);
			document.attachEvent("onmousemove", this.movehandler)
		}
	},
	uninitializeEventHandlers: function() {
		if (document.removeEventListener) {
			document.removeEventListener("mouseup", this._mouseUpHandler.bindAsEventListener(this), false);
			document.removeEventListener("mousemove", this._mouseMoveHandler.bindAsEventListener(this), false)
		} else {
			document.detachEvent("onmouseup", this.uphandler);
			document.detachEvent("onmousemove", this.movehandler)
		}
	}
});
Af.BaseDraggable = Class.create({
	initialize: function(a, b, g) {
		this.type = a;
		this.htmlElement = b;
		this.selected = false;
		this.draggableElement = null;
		this.allowedTarget = null;
		if (g != null) {
			this.repositionable = g
		} else {
			this.repositionable = false
		}
	},
	getMouseDownHTMLElement: function() {
		return this.htmlElement
	},
	select: function() {
		this.selected = true;
		if (this.showingSelected) {
			return
		}
		var a = this.getMouseDownHTMLElement();
		this.showingSelected = true
	},
	deselect: function() {
		this.selected = false;
		if (!this.showingSelected) {
			return
		}
		var a = this.getMouseDownHTMLElement();
		a.style.backgroundColor = this.saveBackground;
		this.showingSelected = false
	},
	isSelected: function() {
		return this.selected
	},
	startDrag: function() {},
	cancelDrag: function() {},
	endDrag: function() {},
	getSingleObjectDragGUI: function() {
		if (this.draggableElement != null) {
			var a = document.getElementsByTagName("body")[0];
			a.appendChild(this.draggableElement);
			this.draggableElement.style.display = "";
			if (this.draggableElement._width) {
				this.draggableElement.style.width = this.draggableElement._width + "px"
			}
			if (this.draggableElement._height) {
				this.draggableElement.style.height = this.draggableElement._height + "px"
			}
			return this.draggableElement
		} else {
			return this.htmlElement
		}
	},
	getMultiObjectDragGUI: function(b) {
		if (this.draggableElement != null) {
			var a = document.getElementsByTagName("body")[0];
			a.appendChild(this.draggableElement);
			this.draggableElement.style.display = "";
			return this.draggableElement
		} else {
			return this.htmlElement
		}
	},
	getDroppedGUI: function() {
		if (this.draggableElement != null) {
			return this.draggableElement
		} else {
			return this.htmlElement
		}
	},
	toString: function() {
		return this.type + ":" + this.htmlElement + ":"
	},
	setDraggableElement: function(a) {
		this.draggableElement = a;
		a.style.display = "none"
	}
});
Af.BaseDropzone = Class.create({
	initialize: function(a) {
		this.htmlElement = $(a);
		this.absoluteRect = null
	},
	getHTMLElement: function() {
		return this.htmlElement
	},
	clearPositionCache: function() {
		this.absoluteRect = null
	},
	getAbsoluteRect: function() {
		if (this.absoluteRect == null) {
			var a = this.getHTMLElement();
			var b = toViewportPosition(a);
			this.absoluteRect = {
				top: b.y,
				left: b.x,
				bottom: b.y + a.offsetHeight,
				right: b.x + a.offsetWidth
			}
		}
		return this.absoluteRect
	},
	activate: function(b) {
		var m = this.getHTMLElement();
		if (m == null || this.showingActive) {
			return
		}
		this.showingActive = true;
		this.saveBackgroundColor = m.style.backgroundColor;
		var g = "#ffea84";
		var a = null;
		if (a == null) {
			m.style.backgroundColor = g
		} else {
			a.isBright() ? a.darken(0.2) : a.brighten(0.2);
			m.style.backgroundColor = a.asHex()
		}
	},
	deactivate: function(a) {
		var b = this.getHTMLElement();
		if (b == null || !this.showingActive) {
			return
		}
		b.style.backgroundColor = this.saveBackgroundColor;
		this.showingActive = false;
		this.saveBackgroundColor = null
	},
	showHover: function() {
		var a = this.getHTMLElement();
		if (a == null || this.showingHover) {
			return
		}
		this.saveBorderWidth = a.style.borderWidth;
		this.saveBorderStyle = a.style.borderStyle;
		this.saveBorderColor = a.style.borderColor;
		this.showingHover = true;
		a.style.borderWidth = "1px";
		a.style.borderStyle = "solid";
		a.style.borderColor = "#ffff00"
	},
	hideHover: function() {
		var a = this.getHTMLElement();
		if (a == null || !this.showingHover) {
			return
		}
		a.style.borderWidth = this.saveBorderWidth;
		a.style.borderStyle = this.saveBorderStyle;
		a.style.borderColor = this.saveBorderColor;
		this.showingHover = false
	},
	canAccept: function(a) {
		return true
	},
	accept: function(b, o) {
		var m = this.getHTMLElement();
		if (m == null) {
			return
		}
		n = b.length;
		for (var a = 0; a < n; a++) {
			var g = b[a].getDroppedGUI();
			if (Element.getStyle(g, "position") == "absolute") {
				g.style.position = "static";
				g.style.top = "";
				g.style.top = ""
			}
			m.appendChild(g)
		}
	},
	dragged: function(a, b) {}
});
var dndMgr = new Af.DragAndDrop();
Af.Dropzone = Class.create(Af.BaseDropzone, {
	initialize: function(g, b, a) {
		this.handler = g || new Object();
		this.htmlElement = b;
		this.absoluteRect = null;
		this.key = a
	},
	accept: function(a, b) {
		if (this.handler.processDragComplete) {
			this.handler.processDragComplete(a[0], this, b)
		}
	},
	activate: function(a) {
		if (this.handler.processDragBegin) {
			this.handler.processDragBegin(a[0], this)
		}
	},
	deactivate: function(a) {},
	dragged: function(b, a) {
		if (this.handler.processDragged) {
			this.handler.processDragged(a[0], b, this)
		}
	},
	showHover: function() {},
	hideHover: function() {}
});
Af.Draggable = Class.create(Af.BaseDraggable, {
	initialize: function(a, b, m, o, g) {
		this.type = a;
		this.key = a;
		this.htmlElement = b;
		this.text = g;
		this.selected = false;
		this.draggableElement = o;
		this.allowedTarget = null;
		if (m != null) {
			this.repositionable = m
		} else {
			this.repositionable = false
		}
	},
	startDrag: function() {
		if (this.draggableElement) {
			this.draggableElement.style.width = this.htmlElement.offsetWidth + "px";
			if (this.text) {
				this.draggableElement.innerHTML = this.text
			}
		}
	},
	select: function() {
		this.selected = true;
		this.showingSelected = true
	},
	deselect: function() {
		this.selected = false;
		if (!this.showingSelected) {
			return
		}
		this.showingSelected = false
	}
});
Af.Component = Class.create({
	initialize: function(b, a) {
		this._initialize(b, a)
	},
	_initialize: function(b, a) {
		if (b) {
			this.name = b
		} else {
			this.name = ""
		}
		if (a) {
			this.displayName = a
		} else {
			this.displayName = ""
		}
		this.value = null;
		this.open = true;
		this.dsPath = null;
		this.dataName = null;
		this.path = null;
		this.preferredPageSize = 10;
		this.displayDataTree = false;
		this.parent = null;
		this.visible = true;
		this.sortable = false;
		this.type = "";
		this.options = new Array(0);
		this.components = new Array(0);
		this.cssComp = null;
		this.cssTitle = null;
		this.cssHeader = null;
		this.cssColumn = null;
		this.cssRow = null;
		this.cssCell = null;
		this.cssLabelCell = null;
		this.cssSelected = null;
		this.cssRelated = null;
		this.cssRelatedSelected = null;
		this.cssRelated2 = null;
		this.cssRelatedSelected2 = null;
		this.row = 0;
		this.column = 0;
		this.rowSpan = 1;
		this.colSpan = 1;
		this.rowCount = -1;
		this.columnCount = -1;
		this.internalTargetId = null;
		this.element = null;
		this.textNode = null;
		this.relatedElement = null;
		this.relatedElement2 = null;
		this.sIndex = -1;
		this.myIndex = -1;
		this.align = "left";
		this.valign = "top";
		this.view = null;
		this.visible = true;
		this.selectionListeners = null;
		this.selectingListeners = null;
		this.cellSelectionListeners = null;
		this.cellSelectingListeners = null;
		this.clickListeners = null;
		this.focusListeners = null;
		this.blurListeners = null;
		this.changeListeners = null;
		this.keyPressListeners = null;
		this.navItemClickListeners = null;
		this.treeNodeClickListeners = null;
		this.tabClickListeners = null;
		this.currentSort = UNSORTED;
		this.contextRoot = null;
		this.loadRequired = false;
		this.dataShowRequired = false;
		this.objMsgEnabled = false;
		this.tagList = null;
		this.readonly = false;
		this.multiSelect = false;
		this.renderTitle = true;
		this.nodeDataSourceName = null;
		this.readElement = null;
		this.editElement = null;
		this._currentlyEditable = true;
		this.dataGridDataSet = null;
		this.editSameAsRead = true;
		this.objectClassName = null;
		this.min = Number.MIN_VALUE;
		this.max = Number.MAX_VALUE;
		this.tooltip = null
	},
	isEditable: function() {
		return this._currentlyEditable && !this.readonly
	},
	makeEditable: function() {
		if (!this.readonly) {
			return
		}
		this.readonly = false;
		this.propagateMakeEditable()
	},
	propagateMakeEditable: function() {
		if (this.readonly) {
			return
		}
		this.switchToEditElement();
		for (var a = 0; a < this.components.length; a++) {
			this.components[a].propagateMakeEditable()
		}
	},
	makeReadonly: function() {
		if (this.readonly) {
			return
		}
		this.readonly = true;
		this.propagateMakeReadonly()
	},
	propagateMakeReadonly: function() {
		this.switchToReadonlyElement();
		for (var a = 0; a < this.components.length; a++) {
			this.components[a].propagateMakeReadonly()
		}
	},
	switchToEditElement: function() {
		debugA("switchToEditElement() - entered");
		if (this.editSameAsRead) {
			return
		}
		if (this.editElement == null) {
			this.editElement = renderTextArea(this)
		}
		if (this.editElement != this.element) {
			var a = this.element.parentNode;
			a.replaceChild(this.editElement, this.element);
			this.element = this.editElement;
			this._currentlyEditable = true;
			this.setDisplayValue()
		}
	},
	switchToReadonlyElement: function() {
		if (this.editSameAsRead) {
			return
		}
		if (this.readElement == null) {
			this.readElement = this.renderReadonly()
		}
		if (this.readElement != this.element) {
			var a = this.element.parentNode;
			a.replaceChild(this.readElement, this.element);
			this.element = this.readElement;
			this._currentlyEditable = false;
			this.setDisplayValue()
		}
	},
	initForForm: function() {
		if (this.components) {
			for (var b = 0; b < this.components.length; b++) {
				var a = this.components[b];
				var g = a.row + a.rowSpan;
				if (g > this.rowCount) {
					this.rowCount = g
				}
				var m = a.column + a.colSpan;
				if (m > this.columnCount) {
					this.columnCount = m
				}
			}
		}
	},
	getComponentAt: function(g, m) {
		if (this.components) {
			for (var b = 0; b < this.components.length; b++) {
				var a = this.components[b];
				if (a.row == g && a.column == m) {
					return a
				}
			}
		}
		return null
	},
	getSelectedRowData: function() {
		if (this.dataGrid == null) {
			return null
		}
		return this.dataGrid.getSelectedRowData()
	},
	getSelectedRow: function() {
		if (this.dataGrid == null) {
			return - 1
		}
		return this.dataGrid.getSelectedRow()
	},
	getSelectedRows: function() {
		if (this.dataGrid == null) {
			return new Array()
		}
		return this.dataGrid.getSelectedRows()
	},
	getSelectedComponent: function() {
		if (this.sIndex < 0 || this.sIndex >= this.components.length) {
			return null
		}
		return this.components[this.sIndex]
	},
	getIndexOf: function(b) {
		for (var g = 0; g < this.components.length; g++) {
			var a = this.components[g];
			if (a.name == b) {
				return g
			}
		}
		return - 1
	},
	setSelectedComp: function(b) {
		var a = this.getIndexOf(b);
		if (b != -1) {
			this.setSelectedIndex(a)
		}
	},
	setSelectedLink: function(a) {
		this.setSelectedComp(a)
	},
	setSelectedTab: function(a) {
		this.setSelectedComp(a)
	},
	setSelectedIndex: function(o, q) {
		if (this.sIndex == o && !q) {
			return
		}
		var r = this.components.length;
		var m = (this.sIndex > -1) ? this.components[this.sIndex] : null;
		var a = (o > -1) ? this.components[o] : null;
		if (this.selectingListeners != null) {
			for (var g = 0; g < this.selectingListeners.length; g++) {
				var b = this.selectingListeners[g];
				if (!b.selecting(a, m)) {
					return
				}
			}
		}
		if (this.sIndex > -1) {
			if (m.cssComp) {
				m.element.className = m.cssComp
			}
			if (m.relatedElement2 != null) {
				m.relatedElement2.className = m.cssRelated2
			}
			if (m.relatedElement != null) {
				m.relatedElement.className = m.cssRelated
			}
			if (this.type == "HTab" && this.sIndex < (r - 1)) {
				m.tabSpacer.childNodes[0].className = "HTabSpacer"
			} else {
				if (this.type == "VTab" && this.sIndex < (r - 1)) {
					m.tabSpacer.className = "VTabSpacer"
				}
			}
			if (m.src != null && m.target != null && m.view != null) {
				m.view.clearNavigation(m)
			}
		}
		if (o > -1) {
			if (a.cssSelected) {
				a.element.className = a.cssSelected
			}
			if (a.relatedElement2 != null) {
				a.relatedElement2.className = a.cssRelatedSelected2
			}
			if (a.relatedElement != null) {
				a.relatedElement.className = a.cssRelatedSelected
			}
			if (this.type == "HTab" && o < (r - 1)) {
				a.tabSpacer.childNodes[0].className = "HTabSelectedSpacer"
			} else {
				if (this.type == "VTab" && o < (r - 1)) {
					a.tabSpacer.className = "VTabSpacerSelected"
				}
			}
			if (a.src != null && a.target != null && a.view != null) {
				a.view.navigateTo(a)
			}
			if (this.selectionListeners != null) {
				for (var g = 0; g < this.selectionListeners.length; g++) {
					var b = this.selectionListeners[g];
					b.selected(a, m)
				}
			}
		}
		this.sIndex = o
	},
	addComponent: function(a) {
		a.parent = this;
		a.myIndex = this.components.push(a) - 1
	},
	addOption: function(a, g) {
		var b = new Object();
		b.label = a;
		b.value = g;
		this.options.push(b)
	},
	getComponent: function(b) {
		for (var g = 0; g < this.components.length; g++) {
			var a = this.components[g];
			if (a.name == b) {
				return a
			}
			a = a.getComponent(b);
			if (a != null) {
				return a
			}
		}
		return null
	},
	registerEventListener: function(a, b) {
		this.element.addEventListener(a,
		function(g) {
			b.handleClickEvent(g)
		},
		false)
	},
	addSelectionListener: function(a) {
		if (a.selected == null) {
			alert('The listener does not support "selected(...)" method.');
			return
		}
		if (this.selectionListeners == null) {
			this.selectionListeners = new Array()
		}
		if (!this.has(this.selectionListeners, a)) {
			this.selectionListeners.push(a)
		}
	},
	removeSelectionListener: function(a) {
		this.selectionListeners = this.removeFromListenerArray(this.selectionListeners, a)
	},
	addSelectingListener: function(a) {
		if (a.selecting == null) {
			alert('The listener does not support "selecting(...)" method.');
			return
		}
		if (this.selectingListeners == null) {
			this.selectingListeners = new Array()
		}
		if (!this.has(this.selectingListeners, a)) {
			this.selectingListeners.push(a)
		}
	},
	removeSelectingListener: function(a) {
		this.selectingListeners = this.removeFromListenerArray(this.selectingListeners, a)
	},
	addCellSelectionListener: function(a) {
		if (a.cellSelected == null) {
			alert('The listener does not support "cellSelected(...)" method.');
			return
		}
		if (this.cellSelectionListeners == null) {
			this.cellSelectionListeners = new Array()
		}
		if (!this.has(this.cellSelectionListeners, a)) {
			this.cellSelectionListeners.push(a)
		}
	},
	removeCellSelectionListener: function(a) {
		this.cellSelectionListeners = this.removeFromListenerArray(this.cellSelectionListeners, a)
	},
	addCellSelectingListener: function(a) {
		if (a.cellSelecting == null) {
			alert('The listener does not support "cellSelecting(...)" method.');
			return
		}
		if (this.cellSelectingListeners == null) {
			this.cellSelectingListeners = new Array()
		}
		if (!this.has(this.cellSelectingListeners, a)) {
			this.cellSelectingListeners.push(a)
		}
	},
	removeCellSelectingListener: function(a) {
		this.cellSelectingListeners = this.removeFromListenerArray(this.cellSelectingListeners, a)
	},
	addClickListener: function(a) {
		if (this.element == null || !this.element.onclick) {
			alert("The target does not support click event. Target name: " + name);
			return
		}
		if (a.clicked == null) {
			alert('The listener does not support "clicked(...)" method.');
			return
		}
		if (this.element.onclick != this.handleClickEvent) {
			var b = this;
			this.element.onclick = function() {
				b.handleClickEvent()
			}
		}
		if (this.clickListeners == null) {
			this.clickListeners = new Array()
		}
		if (!this.has(this.clickListeners, a)) {
			this.clickListeners.push(a)
		}
	},
	removeClickListener: function(a) {
		this.clickListeners = this.removeFromListenerArray(this.clickListeners, a)
	},
	addFocusListener: function(a) {
		if (this.element == null || !this.element.onfocus) {
			alert("The target does not support focus event. Target name: " + name);
			return
		}
		if (a.focused == null) {
			alert('The listener does not support "focused(...)" method.');
			return
		}
		if (this.element.onfocus != this.handleFocusEvent) {
			var b = this;
			this.element.onfocus = function() {
				b.handleFocusEvent()
			}
		}
		if (this.focusListeners == null) {
			this.focusListeners = new Array()
		}
		if (!this.has(this.focusListeners, a)) {
			this.focusListeners.push(a)
		}
	},
	removeFocusListener: function(a) {
		this.focusListeners = this.removeFromListenerArray(this.focusListeners, a)
	},
	addFocusLostListener: function(a) {
		if (this.element == null) {
			alert("The target does not support blur event. Target name: " + name);
			return
		}
		if (a.focusLost == null) {
			alert('The listener does not support "focusLost(...)" method.');
			return
		}
		if (this.element.onblur != this.handleFocusLostEvent) {
			var b = this;
			this.element.onblur = function() {
				b.handleFocusLostEvent()
			}
		}
		if (this.blurListeners == null) {
			this.blurListeners = new Array()
		}
		if (!this.has(this.blurListeners, a)) {
			this.blurListeners.push(a)
		}
	},
	removeFocusLostListener: function(a) {
		this.blurListeners = this.removeFromListenerArray(this.blurListeners, a)
	},
	addChangeListener: function(a) {
		if (this.element == null || !this.element.onchange) {
			alert("The target does not support change event. Target name: " + name);
			return
		}
		if (a.changed == null) {
			alert('The listener does not support "changed(...)" method.');
			return
		}
		if (this.element.onchange != this.handleChangeEvent) {
			var b = this;
			this.element.onchange = function() {
				b.handleChangeEvent()
			}
		}
		if (this.changeListeners == null) {
			this.changeListeners = new Array()
		}
		if (!this.has(this.changeListeners, a)) {
			this.changeListeners.push(a)
		}
	},
	removeChangeListener: function(a) {
		this.changeListeners = this.removeFromListenerArray(this.changeListeners, a)
	},
	addValueChangeListener: function(a) {
		if (a.valueChanged == null) {
			alert('The listener does not support "valueChanged(...)" method.');
			return
		}
		if (this.valueChangeListeners == null) {
			this.valueChangeListeners = new Array()
		}
		if (!this.has(this.valueChangeListeners, a)) {
			this.valueChangeListeners.push(a)
		}
	},
	removeValueChangeListener: function(a) {
		this.valueChangeListeners = this.removeFromListenerArray(this.valueChangeListeners, a)
	},
	removeFromListenerArray: function(g, a) {
		if (g != null) {
			var b = new Array();
			for (var m = 0; m < g.length; m++) {
				if (g[m] != a) {
					b.push(g[m])
				}
			}
			return b
		}
		return null
	},
	addObjCreateListener: function(a) {
		if (a.objCreated == null) {
			alert('The listener does not support "objCreated(...)" method.');
			return
		}
		if (this.objCreateListeners == null) {
			this.objCreateListeners = new Array()
		}
		if (!this.has(this.objCreateListeners, a)) {
			this.objCreateListeners.push(a)
		}
	},
	removeObjCreateListener: function(a) {
		this.objCreateListeners = this.removeFromListenerArray(this.objCreateListeners, a)
	},
	addObjDeleteListener: function(a) {
		if (a.objDeleted == null) {
			alert('The listener does not support "objDeleted(...)" method.');
			return
		}
		if (this.objDeleteListeners == null) {
			this.objDeleteListeners = new Array()
		}
		if (!this.has(this.objDeleteListeners, a)) {
			this.objDeleteListeners.push(a)
		}
	},
	removeObjDeleteListener: function(a) {
		this.objDeleteListeners = this.removeFromListenerArray(this.objDeleteListeners, a)
	},
	addKeyPressListener: function(a) {
		if (this.element == null || !this.element.onkeypress) {
			alert("The target does not support key press event. Target name: " + name);
			return
		}
		if (a.keypressed == null) {
			alert('The listener does not support "keypressed(...)" method.');
			return
		}
		if (this.element.onkeypress != this.handleKeyPressEvent) {
			var b = this;
			this.element.onkeypress = function() {
				b.handleKeyPressEvent()
			}
		}
		if (this.keyPressListeners == null) {
			this.keyPressListeners = new Array()
		}
		if (!this.has(this.keyPressListeners, a)) {
			this.keyPressListeners.push(a)
		}
	},
	removeKeyPressListener: function(a) {
		this.keyPressListeners = this.removeFromListenerArray(this.keyPressListeners, a)
	},
	cellSelecting: function(q, m, o) {
		if (this.cellSelectingListeners != null) {
			for (var g = 0; g < this.cellSelectingListeners.length; g++) {
				var b = this.cellSelectingListeners[g];
				try {
					b.cellSelecting(q, m, o)
				} catch(a) {
					alert(a.message)
				}
			}
		}
	},
	cellSelected: function(q, m, o) {
		if (this.cellSelectionListeners != null) {
			for (var g = 0; g < this.cellSelectionListeners.length; g++) {
				var b = this.cellSelectionListeners[g];
				try {
					b.cellSelected(q, m, o)
				} catch(a) {
					alert(a.message)
				}
			}
		}
	},
	has: function(b, a) {
		for (var g = 0; g < b.length; g++) {
			if (b[g] == a) {
				return true
			}
		}
		return false
	},
	handleClickEvent: function(b) {
		if (this.clickListeners != null) {
			for (var a = 0; a < this.clickListeners.length; a++) {
				this.clickListeners[a].clicked(this, b)
			}
		}
	},
	handleFocusEvent: function(b) {
		if (this.focusListeners != null) {
			for (var a = 0; a < this.focusListeners.length; a++) {
				this.focusListeners[a].focused(this, b)
			}
		}
	},
	handleFocusLostEvent: function(b) {
		if (this.blurListeners != null) {
			for (var a = 0; a < this.blurListeners.length; a++) {
				this.blurListeners[a].focusLost(this, b)
			}
		}
	},
	handleChangeEvent: function(b) {
		if (this.changeListeners != null) {
			for (var a = 0; a < this.changeListeners.length; a++) {
				this.changeListeners[a].changed(this, b)
			}
		}
	},
	handleKeyPressEvent: function(b) {
		if (this.keyPressListeners != null) {
			for (var a = 0; a < this.keyPressListeners.length; a++) {
				this.keyPressListeners[a].keypressed(this, b)
			}
		}
	},
	isSorted: function() {
		return this.currentSort != UNSORTED
	},
	getSortDirection: function() {
		return this.currentSort
	},
	toggleSort: function() {
		if (this.currentSort == UNSORTED || this.currentSort == SORT_DESC) {
			this.currentSort = SORT_ASC
		} else {
			if (this.currentSort == SORT_ASC) {
				this.currentSort = SORT_DESC
			}
		}
	},
	setUnsorted: function(a) {
		this.setSorted(UNSORTED)
	},
	setSorted: function(a) {
		this.currentSort = a
	},
	afterRender: function() {
		if (this.dsPath != null) {
			var a = this.dsPath.indexOf(".");
			if (a < 0) {
				this.dataName = this.dsPath;
				this.path = ""
			} else {
				this.dataName = this.dsPath.substring(0, a);
				this.path = this.dsPath.substring(a + 1)
			}
			dtCache.addDataConsumer(this.dataName, this)
		}
		if (this.components) {
			for (var g = 0; g < this.components.length; g++) {
				var b = this.components[g];
				b.afterRender()
			}
		}
	},
	newDataAvailable: function() {
		this.loadRequired = true;
		this.load()
	},
	load: function() {
		if (this.visible && this.loadRequired) {
			if (this.dsPath != null) {
				var a = this.dsPath.indexOf(".");
				if (a < 0) {
					this.dataName = this.dsPath;
					this.path = ""
				} else {
					this.dataName = this.dsPath.substring(0, a);
					this.path = this.dsPath.substring(a + 1)
				}
				var m = dtCache.getData(this.dataName);
				this._initializeData(m);
				this._setData(false)
			}
			this.loadRequired = false;
			if (this.components) {
				for (var g = 0; g < this.components.length; g++) {
					var b = this.components[g];
					b.load()
				}
			}
		}
	},
	setData: function(o, g, m) {
		if (g == null) {
			g = ""
		}
		if (this.dataName != null && !m) {
			dtCache.removeDataConsumer(this.dataName, this)
		}
		this.loadRequired = false;
		if (g != null) {
			this.path = g
		} else {
			g = ""
		}
		if (o != null) {
			this.dataName = o.name;
			if (this.path.length > 0) {
				this.dsPath = o.name + "." + this.path
			} else {
				this.dsPath = o.name
			}
		} else {
			this.dataName = "";
			this.dsPath = this.path
		}
		this._initializeData(o);
		this._setData(false);
		for (var b = 0; b < this.components.length; b++) {
			var a = this.components[b];
			if (a.components.length > 0) {
				a.setData(this.data, a.path, false)
			}
		}
		if (this.dataName != null && !m) {
			dtCache.addDataConsumer(this.dataName, this)
		}
	},
	setData2: function(a) {
		this.data = a;
		this._setData(true)
	},
	getData: function() {
		return this.data
	},
	_initializeData: function(b) {
		if (b != null) {
			this.data = getDataByPath(b, this.path);
			var a = getParentDataByPath(b, this.path);
			if (a == this.data) {
				a = null
			}
			if (this.data == null) {
				if (this.type == "RptTable" || this.type == "DynamicSelect" || this.type == "AutoComplete" || this.type == "ComboBox") {
					this.data = new Array()
				} else {
					this.data = new Object()
				}
				if (this.objectClassName != null) {
					this.data.__className = this.objectClassName
				}
				if (this.path != "") {
					b[this.path] = this.data
				}
				if (a != null) {
					this.data.__parent = a;
					pid = getFullId(a)
				}
			}
		} else {
			if (this.type == "RptTable" || this.type == "DynamicSelect" || this.type == "AutoComplete" || this.type == "ComboBox") {
				this.data = new Array()
			} else {
				this.data = new Object()
			}
			if (this.objectClassName != null) {
				this.data.__className = this.objectClassName
			}
		}
	},
	_setData: function(a) {
		if (this.type == "RptTable") {
			if (this.displayDataTree) {
				this.dataGridDataSet = new Af.DataTree(this.data, this.dsPath, this.tagList)
			} else {
				this.dataGridDataSet = new Af.DataTable(this.data, this.dsPath)
			}
		}
		this._showData(a)
	},
	_showData: function(a) {
		if (!this.visible && !a) {
			this.dataShowRequired = true;
			return
		}
		if (this.type == "RptTable") {
			this.setTableData()
		} else {
			if (this.isFormType()) {
				this.setFormData()
			} else {
				if (this.type == "Tree") {
					this.setTreeData()
				} else {
					if (this.type == "DynamicSelect") {
						this.setDynamicSelectData(this.data, this.dsPath)
					} else {
						if (this.type == "AutoComplete") {
							this.setAutoCompleteData(this.data, this.dsPath)
						} else {
							if (this.type == "ComboBox") {
								this.setComboBoxData(this.data, this.dsPath)
							}
						}
					}
				}
			}
		}
		this.dataShowRequired = false
	},
	refreshData: function() {
		this._setData(true);
		for (var a = 0; a < this.components.length; a++) {
			this.components[a].refreshData()
		}
	},
	clearData: function() {
		if (this.type == "RptTable") {
			this.clearTableData()
		} else {
			if (this.type == "Form" || this.type == "Form0" || this.type == "Form1") {
				this.clearFormData()
			} else {
				if (this.type == "DynamicSelect") {
					this.clearDynamicSelectData()
				} else {
					if (this.type == "Tree") {
						this.clearTreeData()
					} else {
						if (this.type == "AutoComplete") {
							this.clearAutoCompleteData()
						} else {
							if (this.type == "ComboBox") {
								this.clearComboBoxData()
							}
						}
					}
				}
			}
		}
	},
	clearTableData: function() {
		var a = new Array();
		this.dataName = "";
		this.data = a;
		this._setData(true)
	},
	clearFormData: function() {
		this.dataName = "";
		this.data = new Object();
		this._setData(true)
	},
	clearTreeData: function() {
		this.dataName = "";
		this.data = new Object();
		this._setData(true)
	},
	clearDynamicSelectData: function() {
		this.dataName = "";
		this.data = dlist;
		this._setData(true);
		if (this.element != null) {
			removeAll(this.element)
		}
	},
	clearAutoCompleteData: function() {
		this.dataName = "";
		this.data = dlist;
		this.choices.length = 0
	},
	clearComboBoxData: function() {
		this.dataName = "";
		this.data = dlist;
		this.choices.length = 0
	},
	isTableEditing: function() {
		if (this.dataGrid != null) {
			return this.dataGrid.isEditing()
		}
		return false
	},
	setTableData: function() {
		if (this.dataGrid == null) {
			this.dataGrid = new Af.DataGrid(this);
			if (!this.objMsgEnabled) {
				dtCache.addObjMsgSubscriber(this);
				this.objMsgEnabled = true
			}
			if (this.tableDisplayAreaHeight) {
				this.dataGrid.setDisplayAreaSize( - 1, this.tableDisplayAreaHeight)
			}
		}
		this.dataGrid.setDataSet(this.dataGridDataSet)
	},
	setDisplayContainer: function(a) {
		this.tableDisplayAreaHeight = getDisplayAreaHeight(a, this.tableElement);
		if (this.dataGrid != null) {
			return this.dataGrid.setDisplayAreaSize( - 1, this.tableDisplayAreaHeight)
		}
		return false
	},
	setDisplayAreaHeight: function(a) {
		this.tableDisplayAreaHeight = a;
		if (this.dataGrid != null) {
			return this.dataGrid.setDisplayAreaSize( - 1, this.tableDisplayAreaHeight)
		}
		return false
	},
	setTreeData: function() {
		if (this.nodeDataSourceName == null) {
			this.nodeDataSourceName = "name"
		}
		var a = new Af.TreeNodeTree(this.data, this.dsPath, this.nodeDataSourceName, this.tagList);
		this.components = a.topLevelNodesList;
		this.reload()
	},
	openAllTreeNodes: function() {
		if (this.type == "Tree") {
			this.openAllNodes()
		} else {
			if (this.displayDataTree && this.dataGrid != null) {
				this.dataGrid.setState(true)
			}
		}
	},
	closeAllTreeNodes: function() {
		if (this.type == "Tree") {
			this.closeAllNodes()
		} else {
			if (this.displayDataTree && this.dataGrid != null) {
				this.dataGrid.setState(false)
			}
		}
	},
	getDataList: function() {
		var a = null;
		if (this.dataGridDataSet != null) {
			var b = this.dataGridDataSet;
			if (b != null) {
				return b.getDataList()
			}
		}
		return a
	},
	setFormData: function() {
		if (!this.objMsgEnabled) {
			dtCache.addObjMsgSubscriber(this);
			this.objMsgEnabled = true
		}
		if (this.components) {
			for (var b = 0; b < this.components.length; b++) {
				var a = this.components[b];
				a.setValueFromObj(this.data)
			}
		}
	},
	setDynamicSelectData: function(q, g) {
		if (!this.objMsgEnabled) {
			dtCache.addObjMsgSubscriber(this);
			this.objMsgEnabled = true
		}
		removeAll(this.element);
		if (q.length && this.labelAttrName != null && this.valueAttrName != null) {
			for (var m = 0; m < q.length; m++) {
				var r = q[m];
				var a = r[this.labelAttrName];
				var b = r[this.valueAttrName];
				if (a == null && b == null) {
					continue
				}
				if (a == null) {
					a = "-Null-"
				}
				if (b == null) {
					b = ""
				}
				var u = document.createElement("option");
				u.value = b;
				u.label = a;
				u.appendChild(document.createTextNode(u.label));
				this.element.appendChild(u)
			}
			if (this.defaultLabel != null) {
				var u = document.createElement("option");
				u.defaultSelected = true;
				u.value = "";
				u.appendChild(document.createTextNode(this.defaultLabel));
				this.element.appendChild(u)
			}
		}
	},
	setAutoCompleteData: function(b, a) {
		if (!this.objMsgEnabled) {
			dtCache.addObjMsgSubscriber(this);
			this.objMsgEnabled = true
		}
		this.updateChoiceList()
	},
	setComboBoxData: function(b, a) {
		if (!this.objMsgEnabled) {
			dtCache.addObjMsgSubscriber(this);
			this.objMsgEnabled = true
		}
		this.updateChoiceList()
	},
	changeVisibility: function(a) {
		this.visible = a;
		if (a) {
			if (this.loadRequired) {
				this.load()
			} else {
				if (this.dataShowRequired) {
					this._setData()
				}
			}
		}
		this.propagateVisibilityChange(a)
	},
	propagateVisibilityChange: function(g) {
		if (this.type == "RptTable") {
			if (this.dataGrid != null) {
				if (g && this.dataShowRequired) {
					this._setData()
				} else {
					this.dataGrid.visibilityChanged(g)
				}
			}
		}
		if (this.components) {
			for (var b = 0; b < this.components.length; b++) {
				var a = this.components[b];
				a.propagateVisibilityChange(g)
			}
		}
	},
	getRowByTarget: function(g) {
		var b = this._getRowCol(g);
		if (b == null) {
			alert("Invalid target");
			return null
		}
		if (this.dataGridDataSet != null) {
			var a = this.dataGridDataSet.dlist;
			if (b.row >= 0 && b.row < a.length) {
				return a[b.row]
			}
		}
		return null
	},
	selectRow: function(g) {
		if (this.dataGridDataSet != null) {
			var a = this.dataGridDataSet.dlist;
			for (var b = 0; b < a.length; b++) {
				if (a[b] == g) {
					this.selectItem(b);
					return
				}
			}
		}
	},
	setSelectedRowData: function(g) {
		if (this.dataGridDataSet != null && this.dataGrid != null) {
			var a = this.dataGridDataSet.dlist;
			for (var b = 0; b < a.length; b++) {
				var m = a[b].realData;
				if (m == null) {
					m = a[b]
				}
				if (m == g) {
					this.dataGrid.selectRowIndex(b);
					return
				}
			}
		}
	},
	selectRowIndex: function(a) {
		this.selectItem(a)
	},
	selectItem: function(b) {
		if (this.dataGrid != null) {
			var g = this.dataGrid.selectRowIndex(b);
			if (g != null) {
				this.cellSelected(b, 0, g)
			}
		} else {
			if ((this.type == "DynamicSelect" || this.type == "ComboBox") && this.data != null) {
				var m = this.data[b];
				var a = m[this.valueAttrName];
				if (a == null) {
					a = ""
				}
				this.value = a;
				if (this.element != null && this.type == "DynamicSelect") {
					this.element.selectedIndex = b;
					this.element.value = this.value
				} else {
					this.setDisplayValue(this.value)
				}
			} else {
				if (this.options != null) {
					if (b < this.options.length && b > -1) {
						this.value = this.options[b].value;
						if (this.element != null) {
							this.element.selectedIndex = b;
							this.element.value = this.value
						}
					}
				}
			}
		}
	},
	setInternalValue: function(a) {
		this.value = a;
		this.oldValue = a
	},
	createObject: function(a, b) {
		if (this.dataGridDataSet == null) {
			alert("The component's dataset is not initialized, can not create the object");
			return
		}
		if (a == null) {
			naminAttr = "name"
		}
		if (b == null) {
			b = "Null"
		}
		var g = this.dataGridDataSet.createObject(a, b, this);
		return g
	},
	addObject: function(a) {
		if (this.dataGridDataSet == null) {
			alert("The component's dataset is not initialized, can not create the object");
			return
		}
		var a = this.dataGridDataSet.addObject(a, this);
		return a
	},
	insertAbove: function(a, g, m, b) {
		return this.inserObject(a, g, m, b, true)
	},
	insertBelow: function(a, g, m, b) {
		return this.inserObject(a, g, m, b, false)
	},
	inserObject: function(g, x, r, q, u) {
		if (this.dataGridDataSet == null) {
			alert("The component's dataset is not initialized, can not create the object");
			return
		}
		if (g == null) {
			naminAttr = "name"
		}
		if (x == null) {
			x = "Null"
		}
		var a = this._getRowCol(r);
		if (a == null) {
			alert("Invalid target for the insert");
			return
		}
		var b = new Array();
		for (var o = 0; o < q; o++) {
			var m = this.dataGridDataSet.insertObject(g, x, a.row, u, this);
			b.push(m)
		}
		return b
	},
	deleteRowByTarget: function(g) {
		if (this.dataGridDataSet == null) {
			alert("The component's dataset is not initialized, can not create the object");
			return
		}
		var b = g.id;
		var a = this._getRowCol(g);
		if (a == null) {
			alert("Invalid target for the delele");
			return
		}
		return this.dataGridDataSet.deleteObjectByIndex(a.row, this)
	},
	deleteRow: function(b) {
		var a = [b];
		this.deleteManyRows(a)
	},
	deleteManyRows: function(a) {
		if (this.dataGridDataSet == null) {
			alert("The component's dataset is not initialized, can not delete the object");
			return
		}
		return this.dataGridDataSet.deleteManyRows(a, this)
	},
	cutRows: function(a) {
		dtCache.cutRows(this.dataGridDataSet, a, this.name, this)
	},
	copyRows: function(a) {
		dtCache.copyRows(this.dataGridDataSet, a, this.name, this)
	},
	pasteRowsAbove: function(a) {
		return this.pasteRows(a, true)
	},
	pasteRowsBelow: function(a) {
		return this.pasteRows(a, false)
	},
	pasteRows: function(m, a) {
		var g = m.id;
		var b = this._getRowCol(m);
		if (b == null) {
			alert("Invalid target for the paste");
			return false
		}
		return dtCache.pasteRows(this.dataGridDataSet, b.row, this.name, a, this)
	},
	indent: function(a) {
		return this.dataGridDataSet.indent(a, this)
	},
	outdent: function(a) {
		return this.dataGridDataSet.outdent(a, this)
	},
	_getRowCol: function(o) {
		var m = o.id;
		var a = m.indexOf("_");
		var b = m.lastIndexOf("_");
		if (a < 0 || b < 0) {
			return null
		}
		var q = parseInt(m.substring(a + 1, b));
		var g = parseInt(m.substring(b + 1));
		return {
			row: q,
			col: g
		}
	},
	setValueFromObj: function(a) {
		this.obj = a;
		this.value = a[this.name];
		if (this.element != null) {
			this.setDisplayValue()
		}
	},
	setValue: function(a) {
		this.value = a;
		this.oldValue = a;
		if (this.element != null) {
			this.setDisplayValue()
		}
	},
	setDisplayValue: function() {
		var a = this.value ? this.value: "";
		if (this.textNode != null) {
			this.textNode.data = a;
			return
		}
		this.element.value = a
	},
	getInternalValue: function() {
		return this.element.value
	},
	getValue: function() {
		return this.value
	},
	getValueByName: function(a) {
		if (this.name == a) {
			return this.value
		}
		var b = this.getComponent(a);
		if (b != null) {
			return b.getValue()
		}
		return null
	},
	setValueByName: function(a, b) {
		if (this.name == a) {
			this.setValue(b);
			return
		}
		var g = this.getComponent(a);
		if (g != null) {
			g.setValue(b)
		}
	},
	internalToDisplayValue: function(a) {
		return a
	},
	displayToInternalValue: function(a) {
		return a
	},
	isFormType: function() {
		return this.type == "Form" || this.type == "Form0" || this.type == "Form1" || this.type == "VPanel" || this.type == "HTab" || this.type == "VTab" || this.type == "Flow"
	},
	objModified: function(b, a, g) {
		if (g[this] != null) {
			return
		}
		g.push(this);
		if (!this.visible) {
			return
		}
		if (this.type == "RptTable") {
			if (this.dataGrid != null) {
				this.dataGrid.objModified(b, a, g)
			}
		} else {
			if (this.isFormType()) {
				if (this.data == b) {
					this.setFormData()
				}
			} else {
				if (this.type == "DynamicSelect") {
					this.setDynamicSelectData(this.data, this.dsPath)
				} else {
					if (this.type == "AutoComplete") {
						this.setAutoCompleteData(this.data, this.dsPath)
					} else {
						if (this.type == "ComboBox") {
							this.setComboBoxData(this.data, this.dsPath)
						}
					}
				}
			}
		}
	},
	objCreated: function(a, g, b, m) {
		if (m[this] != null) {
			return
		}
		m.push(this);
		if (!this.visible) {
			return
		}
		if (this.type == "RptTable") {
			if (this.dataGrid != null) {
				this.dataGrid.objCreated(a, g, b)
			}
		} else {
			if (this.type == "DynamicSelect") {
				this.setDynamicSelectData(this.data, this.dsPath)
			} else {
				if (this.type == "AutoComplete") {
					this.setAutoCompleteData(this.data, this.dsPath)
				} else {
					if (this.type == "ComboBox") {
						this.setComboBoxData(this.data, this.dsPath)
					}
				}
			}
		}
	},
	objDeleted: function(a, g, b, m) {
		if (m[this] != null) {
			return
		}
		m.push(this);
		if (!this.visible) {
			return
		}
		if (this.type == "RptTable") {
			if (this.dataGrid != null) {
				this.dataGrid.objDeleted(a, g, b, m)
			}
		} else {
			if (this.isFormType()) {
				if (this.data == g) {
					this.dataName = null;
					this.data = new Object();
					this.setFormData()
				}
			} else {
				if (this.type == "DynamicSelect") {
					this.setDynamicSelectData(this.data, this.dsPath)
				} else {
					if (this.type == "AutoComplete") {
						this.setAutoCompleteData(this.data, this.dsPath)
					} else {
						if (this.type == "ComboBox") {
							this.setComboBoxData(this.data, this.dsPath)
						}
					}
				}
			}
		}
	},
	manyObjsModified: function(b, a, g) {
		if (g[this] != null) {
			return
		}
		g.push(this);
		if (!this.visible) {
			return
		}
		if (this.type == "RptTable") {
			if (this.dataGrid != null) {
				this.dataGrid.manyObjsModified(b, a, g)
			}
		} else {
			if (this.isFormType()) {
				if (isObjInList(b, this.data)) {
					this.setFormData()
				}
			} else {
				if (this.type == "DynamicSelect") {
					this.setDynamicSelectData(this.data, this.dsPath)
				} else {
					if (this.type == "AutoComplete") {
						this.setAutoCompleteData(this.data, this.dsPath)
					} else {
						if (this.type == "ComboBox") {
							this.setComboBoxData(this.data, this.dsPath)
						}
					}
				}
			}
		}
	},
	refreshAll: function() {
		if (!this.visible) {
			return
		}
		if (this.type == "RptTable") {
			if (this.dataGrid != null) {
				this.dataGrid.refreshAll()
			}
		} else {
			if (this.isFormType()) {
				this.setFormData()
			} else {
				if (this.type == "DynamicSelect") {
					this.setDynamicSelectData(this.data, this.dsPath)
				} else {
					if (this.type == "AutoComplete") {
						this.setAutoCompleteData(this.data, this.dsPath)
					} else {
						if (this.type == "ComboBox") {
							this.setComboBoxData(this.data, this.dsPath)
						}
					}
				}
			}
		}
	},
	prepareForEdit: function() {
		if (this.type == "RptTable") {
			if (this.dataGridDataSet != null) {
				var g = this.getFirstEditableComp();
				if (g != null) {
					this.dataGridDataSet.addEmptyRows(g.name, 10);
					this.refreshData()
				}
			}
		}
		if (this.components) {
			for (var b = 0; b < this.components.length; b++) {
				var a = this.components[b];
				a.prepareForEdit()
			}
		}
	},
	editCompleted: function() {
		if (this.type == "RptTable") {
			if (this.dataGridDataSet != null) {
				var g = this.getFirstEditableComp();
				if (g != null) {
					this.dataGridDataSet.removeEmptyRowsFromEnd(g.name);
					this.refreshData()
				}
			}
		}
		if (this.components) {
			for (var b = 0; b < this.components.length; b++) {
				var a = this.components[b];
				a.editCompleted()
			}
		}
	},
	getFirstEditableComp: function() {
		for (var a = 0; a < this.components.length; a++) {
			var b = this.components[a];
			if (b.isEditable()) {
				return b
			}
		}
		return null
	},
	render: function() {
		var a = null;
		if (this.type == "Separator") {
			a = renderSeparator(this)
		} else {
			if (this.type == "Text") {
				a = renderText(this)
			} else {
				if (this.type == "Label") {
					a = renderLabel(this)
				}
			}
		}
		if (!a) {
			a = document.createElement("span");
			a.appendChild(document.createTextNode("Not implemented: " + this.type))
		}
		return a
	},
	renderReadonly: function() {
		var b;
		if (this.type == "Separator") {
			b = renderSeparator(this)
		} else {
			b = document.createElement("div");
			var a = this.value ? this.value: "";
			this.textNode = document.createTextNode(a);
			b.appendChild(this.textNode);
			if (this.cssComp != null) {
				b.className = this.cssComp
			} else {
				b.className = this.type
			}
			b.style.height = "12px";
			b.name = this.name;
			if (this.width) {
				b.style.width = this.width
			}
		}
		this.readElement = b;
		return b
	},
	partChanged: function(a) {
		this.behavior.changed()
	},
	getDataGridEditor: function(g, a) {
		this.containerCell = a;
		var o = this.altElement;
		if (o == null) {
			this.parentDataGrid = g;
			this.element = this.render();
			o = this.element;
			if (o == null) {
				return
			}
			o.style.height = "100%";
			o.style.borderWidth = "0px";
			o.style.verticalAlign = "middle";
			o.id = this.name + "-1";
			var b = this;
			o.onkeydown = function(r) {
				return g.keyDown(r)
			};
			o.onblur = function(r) {
				return g.focusLost(b, r)
			};
			this.altElement = this.render();
			o = this.altElement;
			o.style.height = "100%";
			o.style.borderWidth = "0px";
			o.style.verticalAlign = "middle";
			o.id = this.name + "-2";
			o.onkeydown = function(r) {
				return g.keyDown(r)
			};
			o.onblur = function(r) {
				return g.focusLost(b, r)
			};
			if ((this.type == "DynamicSelect" || this.type == "AutoComplete" || this.type == "ComboBox") && this.dataName) {
				var q = dtCache.get(this.dataName);
				this.setData(q, this.path)
			}
		}
		var m = this.element;
		this.element = o;
		this.altElement = m;
		if (this.type == "ComboBox") {
			this.textElement = o.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			this.imgButton = o.childNodes[0].childNodes[0].childNodes[1].childNodes[0]
		}
		return o
	},
	setTreeNodeOpen: function(a) {
		this.open = a;
		this.showHideChildrenNodes(a)
	},
	showHideChildrenNodes: function(b) {
		for (var a = 0; a < this.components.length; a++) {
			var g = this.components[a];
			if (g.rowElement != null) {
				g.rowElement.style.display = b ? (is_ie ? "inline": "table-row") : "none";
				g.showHideChildrenNodes(b & g.open)
			}
		}
	},
	findCompByNavElement: function(g) {
		for (var b = 0; b < this.components.length; b++) {
			var a = this.components[b];
			if (a.clickableNavElement == g) {
				return a
			}
			var m = a.findCompByNavElement(g);
			if (m != null) {
				return m
			}
		}
	},
	addNavItemClickListener: function(a) {
		if (a.navItemClicked == null) {
			alert('The listener does not support "navItemClicked(...)" method.');
			return
		}
		if (this.navItemClickListeners == null) {
			this.navItemClickListeners = new Array()
		}
		if (!this.has(this.navItemClickListeners, a)) {
			this.navItemClickListeners.push(a)
		}
	},
	removeNavItemClickListener: function(a) {
		this.navItemClickListeners = this.removeFromListenerArray(this.navItemClickListeners, a)
	},
	handleNavItemEvent: function(m, g) {
		var b = true;
		if (this.navItemClickListeners != null) {
			for (var a = 0; a < this.navItemClickListeners.length; a++) {
				b = this.navItemClickListeners[a].navItemClicked(this, m, g) && b
			}
		}
		return b
	},
	addTreeNodeClickListener: function(a) {
		if (a.treeNodeClicked == null) {
			alert('The listener does not support "treeNodeClicked(...)" method.');
			return
		}
		if (this.treeNodeClickListeners == null) {
			this.treeNodeClickListeners = new Array()
		}
		if (!this.has(this.treeNodeClickListeners, a)) {
			this.treeNodeClickListeners.push(a)
		}
	},
	removeTreeNodeClickListener: function(a) {
		this.treeNodeClickListeners = this.removeFromListenerArray(this.treeNodeClickListeners, a)
	},
	handleTreeNodeEvent: function(m, g) {
		var b = true;
		if (this.treeNodeClickListeners != null) {
			for (var a = 0; a < this.treeNodeClickListeners.length; a++) {
				b = this.treeNodeClickListeners[a].treeNodeClicked(this, m, this.selectedNode, g) && b
			}
		}
		return b
	},
	addTabClickListener: function(a) {
		if (a.tabClicked == null) {
			alert('The listener does not support "tabClicked(...)" method.');
			return
		}
		if (this.tabClickListeners == null) {
			this.tabClickListeners = new Array()
		}
		if (!this.has(this.tabClickListeners, a)) {
			this.tabClickListeners.push(a)
		}
	},
	removeTabClickListener: function(a) {
		this.tabClickListeners = this.removeFromListenerArray(this.tabClickListeners, a)
	},
	handleTabEvent: function(a, m) {
		var g = true;
		if (this.tabClickListeners != null) {
			for (var b = 0; b < this.tabClickListeners.length; b++) {
				g = this.tabClickListeners[b].tabClicked(this, a, m) && g
			}
		}
		return g
	},
	navListLinkClicked: function(a) {
		if (!a) {
			a = window.event
		}
		var b = a.target ? a.target: a.srcElement;
		var g = this.findCompByNavElement(b);
		if (g == null) {
			alert("some internal error, findCompByElement returned null in navListLinkClicked");
			return
		}
		if (!this.handleNavItemEvent(g, a)) {
			return
		}
		g.parent.setSelectedIndex(g.myIndex);
		a.returnValue = false;
		return false
	},
	treeClicked: function(a, g) {
		if (!a) {
			a = window.event
		}
		var m = a.target ? a.target: a.srcElement;
		var b = m.tagName.toUpperCase();
		if (b != "TD") {
			m = m.parentNode
		}
		var o = this.findCompByNavElement(m);
		if (o == null) {
			alert("some internal error, findCompByElement returned null in treeClicked");
			return
		}
		if (!this.handleTreeNodeEvent(o, a)) {
			return
		}
		if (o.components.length > 0) {
			o.setTreeNodeOpen(!o.open);
			o.rowElement.cells[0].childNodes[0].src = this.getTreeNodeImageSrc(o)
		}
		this.selectTreeNode(o);
		return true
	},
	canUseUpDownArrow: function() {
		return ! this.usesUpDownArrow
	}
});
ImageSpec = Class.create({
	initialize: function(g, b, a) {
		this.src = g;
		this.width = b;
		this.height = a
	}
});
ExampleSelectionListener = Class.create({
	initialize: function() {},
	selected: function(a, b) {
		debugA("Selected: " + a.name + " ,Deselected: " + (b != null ? b.name: "undefined"))
	}
});
ExampleSelectingListener = Class.create({
	initialize: function() {},
	selecting: function(a, b) {
		debugA("Selecting: " + a.name + " ,Deselected: " + (b != null ? b.name: "undefined"));
		return true
	}
});
ExampleClickListener = Class.create({
	initialize: function() {},
	clicked: function(a) {
		debugA("Clicked: " + a.name)
	}
});
ExampleFocusListener = Class.create({
	initialize: function() {},
	focused: function(a) {
		debugA("Focused: " + a.name)
	}
});
ExampleChangeListener = Class.create({
	initialize: function() {},
	changed: function(a) {
		debugA("Changed: " + a.name)
	}
});
Af.MenuItem = Class.create(Af.Component, {
	initialize: function(b, a) {
		this._initialize(b, a);
		this.type = "MenuItem";
		this.enabled = true;
		this.checkMark = false
	},
	setValue: function(a) {
		if (this.checkbox) {
			this.checkbox.checked = a
		}
	}
});
var _currentContextMenu = null;
function hideCurrentContextMenu() {
	if (_currentContextMenu != null) {
		_currentContextMenu.hideContextMenu();
		_currentContextMenu = null
	}
}
Af.ContextMenu = Class.create();
Af.ContextMenu = Class.create(Af.Component, {
	initialize: function(b, a, g) {
		this._initialize(b, a);
		this.selectE = g;
		this.type = "ContextMenu";
		this.selectedItem = null;
		this.contextMenuTarget = null;
		this.ctxMenuListeners = new Array();
		this.owner = null
	},
	render: function() {
		var m = this.renderContextMenu(this);
		m.style.display = "none";
		for (var g = 0; g < this.components.length; g++) {
			var o = this.components[g];
			if (o.element != null) {
				o.element.onmousedown = this.menuItemMouseDown.bindAsEventListener(this)
			}
		}
		var a = this.container ? this.container: document.getElementsByTagName("body")[0];
		a.appendChild(m);
		return m
	},
	renderReadonly: function() {
		return this.render()
	},
	addMenuItem: function(g, a) {
		var b = new Af.MenuItem(g, a);
		this.addComponent(b);
		return b
	},
	menuItemMouseDown: function(g) {
		try {
			Event.stop(g);
			var q = g.target ? g.target: g.srcElement;
			var r = this.getComponent(q.id || q.name);
			if (r == null) {
				return
			}
			if (r.checkbox != null) {
				r.checkbox.checked = !r.checkbox.checked
			}
			if (r.enabled) {
				for (var o = 0; o < this.ctxMenuListeners.length; o++) {
					var b = this.ctxMenuListeners[o];
					try {
						b.contextMenuAction(r.name, q, r)
					} catch(a) {
						alert(a.message)
					}
				}
			}
			var m = this;
			setTimeout(function() {
				m.setSelectedItem(r.name);
				m.hideContextMenu()
			},
			500)
		} catch(a) {
			alert(a.message)
		}
	},
	showContextMenu: function(a) {
		Event.stop(a);
		if (_currentContextMenu != null) {
			_currentContextMenu.hideContextMenu()
		}
		_currentContextMenu = this;
		if (this.ctxMenuListeners.length > 0 && this.ctxMenuListeners[0].preShowContextMenu) {
			this.ctxMenuListeners[0].preShowContextMenu(this, a)
		}
		this.selectedItem = null;
		this.element.style.display = "";
		if (this.selectE && this.currentSelectedComp != null) {
			this.highlight(this.currentSelectedComp.element);
			setTimeout(this.scrollCurrentToView.bind(this), 1)
		}
		return false
	},
	scrollCurrentToView: function() {
		if (this.selectE == null || this.currentSelectedComp == null) {
			return
		}
		var o = this.element.clientHeight;
		var m = this.currentSelectedComp.element.offsetHeight;
		var q = o / m;
		var g = this.components.indexOf(this.currentSelectedComp);
		if (g >= 0) {
			var b = g * m;
			var a = this.element.scrollTop;
			if (! (b >= a && (b < a + o - m))) {
				g = Math.round(g - (q / 2 - 1));
				if (g < 0) {
					g = 0
				}
				b = g * m;
				this.element.scrollTop = b
			}
		}
	},
	hideContextMenu: function() {
		if (_currentContextMenu != null && _currentContextMenu != this) {
			_currentContextMenu.hideContextMenu()
		}
		this.element.style.display = "none";
		document.onmousedown = null;
		_currentContextMenu = null
	},
	addContextMenuListener: function(a) {
		if (a.contextMenuAction == null) {
			alert('The listener does not support "contextMenuAction(...)" method.');
			return
		}
		if (!this.has(this.ctxMenuListeners, a)) {
			this.ctxMenuListeners.push(a)
		}
	},
	removeSelectionListener: function(a) {
		this.ctxMenuListeners = this.removeFromListenerArray(this.ctxMenuListeners, a)
	},
	renderContextMenu: function(o) {
		var g = document.createElement("div");
		var y = "ContextMenu";
		if (o.cssComp != null) {
			y = o.cssComp
		}
		if (o.width) {
			g.style.width = o.width
		}
		g.name = o.name;
		g.className = y;
		if (this.selectE) {
			g.appendChild(this.selectE);
			this.selectE.style.display = "";
			if (this.selectE) {
				this.selectE.onkeydown = this.keyDown.bindAsEventListener(this);
				for (var m = 0; m < this.selectE.childNodes.length; m++) {
					var b = this.selectE.childNodes[m];
					if (b.nodeType == Node.ELEMENT_NODE && b.tagName.toLowerCase() == "div") {
						var q = new Af.MenuItem(b.id, b.innerHTML);
						b.innerHTML = "";
						this.addComponent(q);
						q.element = b;
						b.onmouseover = this.moverF.bindAsEventListener(this);
						b.onmouseout = this.moutF.bindAsEventListener(this)
					}
				}
			}
		} else {
			var r = document.createElement("ul");
			r.name = "_ul" + o.name;
			r.className = "ContextMenuUl";
			g.appendChild(r);
			for (var m = 0; m < o.components.length; m++) {
				var x = o.components[m];
				var u = document.createElement("li");
				u.name = x.name;
				u.id = u.name;
				if (x.hasSeparator) {
					u.className = "ContextMenuLIWithSeparator"
				} else {
					u.className = "ContextMenuLI"
				}
				u.onmouseover = this.moverF.bindAsEventListener(this, x);
				u.onmouseout = this.moutF.bindAsEventListener(this, x);
				x.element = u;
				if (x.checkMark) {
					var a = document.createElement("input");
					a.type = "checkbox";
					u.appendChild(a);
					x.checkbox = a;
					a.name = x.name;
					a.className = "ContexMenuCheckBox"
				}
				u.appendChild(document.createTextNode(x.displayName));
				r.appendChild(u)
			}
		}
		return g
	},
	moverF: function(b, m) {
		Event.stop(b);
		if (this.ignoreOnce) {
			return
		}
		var g = b.target;
		if (g.parentNode == this.selectE) {
			this.highlight(g)
		} else {
			var a = m.element;
			if (m.hasSeparator) {
				a.className = "ContextMenuLIWithSeparatorHover"
			} else {
				a.className = "ContextMenuLIHover"
			}
		}
	},
	moutF: function(b, m) {
		Event.stop(b);
		if (this.ignoreOnce) {
			return
		}
		var g = b.target;
		if (g.parentNode == this.selectE) {} else {
			var a = m.element;
			if (m.hasSeparator) {
				a.className = "ContextMenuLIWithSeparator"
			} else {
				a.className = "ContextMenuLI"
			}
		}
	},
	highlight: function(a) {
		if (a.parentNode == this.selectE) {
			if (this.highlighted) {
				this.highlighted.className = "font-option unselect-font-option"
			}
			a.className = "font-option highlight-font-option";
			this.highlighted = a
		}
	},
	unhighlight: function(a) {
		if (a.parentNode == this.selectE) {
			a.className = "font-option unselect-font-option";
			this.highlighted = null
		}
	},
	setEnable: function(a, b) {
		var g = this.getComponent(a);
		if (g == null) {
			return
		}
		if (b) {
			g.element.style.color = "#000000";
			g.element.onmouseover = g.mover;
			g.element.onmouseout = g.mout
		} else {
			g.element.style.color = "#c2c2c2";
			g.element.onmouseover = null;
			g.element.onmouseout = null
		}
		g.enabled = b
	},
	getItemDisplayName: function(a) {
		var b = this.getComponent(a);
		if (b == null) {
			return "&nbsp;"
		}
		return b.displayName
	},
	setSelectedItem: function(a) {
		if (this.selectE && this.currentSelectedComp != null) {
			this.unhighlight(this.currentSelectedComp.element)
		}
		var b = this.getComponent(a);
		if (this.selectE && b != null) {
			this.highlight(b.element)
		}
		this.currentSelectedComp = b
	},
	keyDown: function(a) {
		Event.stop(a)
	}
});
Af.ContexMenuUtil = Class.create({
	initialize: function(a) {
		this.ctxMenu = a
	},
	addTrigger: function(o, m) {
		var a = this;
		var b = o;
		var g = function(q) {
			if (q == null) {
				q = window.event
			}
			a.showContextMenu(b, q);
			return false
		};
		o.onclick = g;
		if (typeof m !== "undefined") {
			o.onclick = m
		}
	},
	showContextMenu: function(g, b) {
		consume(b);
		var m = this.ctxMenu.element;
		m.style.zIndex = 1000003;
		m.onmouseout = null;
		this.ctxMenu.showContextMenu(b);
		var o = toDocumentPosition(g);
		m.style.left = o.x + "px";
		m.style.top = (o.y + g.offsetHeight - 2) + "px";
		m.onmouseover = this.mouseOver.bindAsEventListener(this);
		return false
	},
	mouseOver: function() {
		var a = this.ctxMenu.element;
		a.onmouseover = null;
		return true
	},
	hideCtxMenu: function(m) {
		var g = this.ctxMenu.element;
		var a = m.target ? m.target: m.srcElement;
		var b = m.relatedTarget || m.toElement;
		while (b != null && b != g) {
			b = b.parentNode
		}
		if (a == g && b != g) {
			this.ctxMenu.hideContextMenu()
		} else {
			if (b == null) {
				this.ctxMenu.hideContextMenu()
			}
		}
	}
});
var AJAX_CALL_TIME_OUT_LIMIT = 180000;
Af.AjaxEngine = Class.create({
	initialize: function() {
		this.currentRequest = null;
		this.nextRequest = new Array();
		this.timeoutHandler = null;
		if (AJAX_CALL_TIME_OUT_LIMIT) {
			this.timeoutLimit = AJAX_CALL_TIME_OUT_LIMIT
		} else {
			this.timeoutLimit = 50000
		}
		this.lastRequestTime = new Date();
		this.contextId = null;
		this.loginRequiredHandler = null;
		this.commFailureHandler = null;
		this.timoutHandler = null;
		this.resultProcessingFailure = null
	},
	setAjaxReqTimeout: function(a) {
		this.timeoutLimit = a
	},
	setContextId: function(a) {
		this.contextId = a
	},
	sendRequest: function(m, q, g) {
		var o = "";
		o = this._createQueryString(m);
		try {
			var a = new Ajax.Request(m.requestURL, this._requestOptions(o, m.getXMLDoc(), q, g))
		} catch(b) {
			if (this.commFailureHandler && !m.hasCustomFailHandler) {
				this.commFailureHandler(b)
			} else {
				if (m.requestFailed) {
					m.requestFailed(m, b.message)
				}
			}
		}
		this.lastRequestTime = new Date()
	},
	onexception: function(b, a) {
		if (this.commFailureHandler && (this.currentRequest == null || !this.currentReques.hasCustomFailHandler)) {
			this.commFailureHandler(a)
		} else {
			if (this.currentRequest != null && this.currentRequest.requestFailed != null) {
				this.currentRequest.requestFailed(this.currentRequest, a.message);
				this.currentRequest = null
			}
		}
		this.processNextRequest()
	},
	handleTimedOut: function() {
		if (this.timoutHandler) {
			this.timoutHandler()
		} else {
			if (this.commFailureHandler) {
				this.commFailureHandler()
			} else {
				if (this.currentRequest != null) {
					this.currentRequest.requestTimedOut(this.currentRequest);
					this.currentRequest = null
				}
			}
		}
		this.processNextRequest()
	},
	processRequest: function(b) {
		if (this.currentRequest != null) {
			this.nextRequest.push(b);
			return
		}
		this.currentRequest = b;
		var a = this;
		a.onreadystatechange = function(g, o, m) {
			a.oncomplete(g, o, m)
		};
		a.onexception = function(m, g) {
			a.onexception(m, g)
		};
		this.timeoutHandler = setTimeout(this.handleTimedOut.bind(this), this.timeoutLimit);
		ajaxEngine.sendRequest(this.currentRequest, a.onreadystatechange, a.onexception)
	},
	processNextRequest: function() {
		if (this.nextRequest.length != 0) {
			this.currentRequest = this.nextRequest.shift();
			var a = this;
			a.onreadystatechange = function(b, m, g) {
				a.oncomplete(b, m, g)
			};
			a.onexception = function(g, b) {
				a.onexception(g, b)
			};
			this.timeoutHandler = setTimeout(this.handleTimedOut.bind(this), this.timeoutLimit);
			ajaxEngine.sendRequest(this.currentRequest, a.onreadystatechange, a.onexception)
		}
	},
	oncomplete: function(q, z, a) {
		var r = this.currentRequest;
		try {
			clearTimeout(this.timeoutHandler);
			var u = q.status;
			if (! (!u || (u >= 200 && u < 300))) {
				switch (u) {
				case 12029:
				case 12030:
				case 12031:
				case 12152:
				case 12159:
					if (this.currentRequest._retryCount == null) {
						this.currentRequest._retryCount = 0
					}
					if (this.currentRequest._retryCount < 2) {
						this.currentRequest._retryCount++;
						this.currentRequest = null;
						this.processRequest(r);
						return
					}
					break;
				default:
					break
				}
				if (this.commFailureHandler && !r.hasCustomFailHandler) {
					this.commFailureHandler("Failed status: " + u)
				} else {
					if (r.requestFailed) {
						r.requestFailed(r, "Failed status: " + u)
					}
				}
				return
			}
			if (q.responseXML != null) {
				var b = q.responseXML.childNodes;
				if (b && b.length > 0) {
					var m = b[b.length - 1];
					if (m.tagName == "af_error") {
						var g = "no error message available from the server";
						if (m.childNodes) {
							for (var x = 0; x < m.childNodes.length; x++) {
								var o = m.childNodes[x];
								if (o.tagName == "message") {
									if (o.childNodes.length == 1) {
										g = o.childNodes[0].data
									}
									break
								}
							}
						}
						if (g == "_session_expired_") {
							if (this.sessionExpired) {
								this.sessionExpired();
								return
							}
						}
						if (r.requestFailed) {
							r.requestFailed(r, g)
						}
						return
					}
				}
			}
			r.__url = a;
			if (q.responseText == "_login_required_" && (this.loginRequiredHandler != null)) {
				this.loginRequiredHandler();
				return
			}
			if (r.requestCompleted) {
				r.requestCompleted(q)
			}
			this.currentRequest = null
		} catch(y) {
			if (this.resultProcessingFailure) {
				this.resultProcessingFailure(y)
			} else {
				if (r.requestFailed) {
					r.requestFailed(r, y.message)
				}
			}
		} finally {
			this.currentRequest = null
		}
		this.processNextRequest()
	},
	_requestOptions: function(r, o, q, g) {
		var b = this;
		var m = ["X-VL-Version", Af.Version];
		var a = "post";
		if (!o) {
			a = "get"
		}
		return {
			requestHeaders: m,
			parameters: r,
			postBody: o,
			method: a,
			onComplete: q,
			onexception: g,
			encoding: "UTF-8"
		}
	},
	_createQueryString: function(g) {
		var a = g.queries;
		var o = "";
		if (a && a.length > 0) {
			for (var b = 0; b < a.length; b++) {
				if (b > 0) {
					o += "&"
				}
				var m = a[b];
				if (m.name != undefined && m.value != undefined) {
					o += m.name + "=" + escape(m.value)
				}
			}
		}
		if (this.contextId != null) {
			if (o != "") {
				o += "&"
			}
			o += "contextId=" + this.contextId
		}
		return o
	}
});
Af.DataRequest = Class.create({
	initialize: function(m, a, q, b, g, o) {
		this.requestURL = m;
		this.requestCompleted = a;
		this.requestFailed = q;
		this.xmlDoc = o;
		if (g) {
			this.requestTimedOut = g
		} else {
			this.requestTimedOut = this._requestTimedOut
		}
		this.invoker = b;
		this.queries = new Array();
		this.serviceParameters = new Array();
		this.navigateTo = null;
		this.hasCustomFailHandler = false
	},
	addQuery: function(a, g) {
		if (a && g) {
			var b = new Object();
			b.name = a;
			b.value = g;
			this.queries.push(b)
		}
	},
	addService: function(b, a) {
		this.serviceName = b;
		this.methodName = a
	},
	addParameter: function(a, b) {
		if (a && b) {
			var g = new Object();
			g.name = a;
			g.value = b;
			this.serviceParameters.push(g)
		}
	},
	getXMLDoc: function() {
		var b = null;
		if (this.serviceName && this.methodName) {
			b = '<service name="' + this.serviceName + '">';
			if (this.navigateTo != null) {
				b += '<navigateTo name="' + this.navigateTo + '" />'
			}
			b += '<method name="' + this.methodName + '">';
			for (var a = 0; a < this.serviceParameters.length; a++) {
				var g = this.serviceParameters[a];
				b += '<parameter name="' + g.name + '" value="' + g.value + '"/>'
			}
			b += "</method>";
			if (this.xmlDoc != null) {
				b += "<data>" + this.xmlDoc + "</data>"
			}
			b += "</service>"
		}
		return b
	},
	_requestTimedOut: function(a) {
		showError("Request timed out, url: " + this.requestURL)
	}
});
var ajaxEngine = new Af.AjaxEngine();
Af.XMLToDataSet = Class.create({
	initialize: function(m) {
		this.data = new Object();
		var g = m.childNodes;
		var b = g[g.length - 1];
		this.setIdFromTopNode(this.data, b);
		var o = null;
		if (b.attributes != null) {
			var a = b.attributes.getNamedItem("cls");
			if (a == null) {
				a = b.attributes.getNamedItem("class")
			}
			if (a != null) {
				o = a.value;
				this.data.__className = o
			}
		}
		this.processXMLNode(this.data, b)
	},
	setIdFromTopNode: function(o, m) {
		var g = null;
		var u = null;
		var r = m.attributes.getNamedItem("UUID");
		if (r == null) {
			r = m.attributes.getNamedItem("id");
			if (r == null) {
				r = m.attributes.getNamedItem("name")
			}
		}
		if (r != null) {
			g = r.value
		}
		r = m.attributes.getNamedItem("fullId");
		if (r != null) {
			u = r.value
		}
		o.__id = g;
		if (u == null) {
			var b = m.childNodes;
			for (var q = 0; q < b.length; q++) {
				var z = b[q];
				if (z.tagName == "name" && (z.nodeType == Node.ELEMENT_NODE || z.nodeType == Node.DOCUMENT_NODE || z.nodeType == Node.DOCUMENT_FRAGMENT_NODE)) {
					var y = z.childNodes;
					if (y.length == 1) {
						var x = y[0];
						if (x.nodeType == Node.TEXT_NODE) {
							u = x.data
						}
					}
				}
			}
			if (m.tagName != "ObjList") {
				r = m.attributes.getNamedItem("class");
				if (r == null) {
					r = m.attributes.getNamedItem("cls")
				}
				if (r != null) {
					u = u + "." + r.value
				}
			}
		}
		o.__fullId = u
	},
	getIdFromInnerNode: function(a) {
		attr = a.attributes.getNamedItem("id");
		if (attr != null) {
			return attr.value
		}
		return null
	},
	processXMLNode: function(P, x, G) {
		var E = x.childNodes;
		for (var K = 0; K < E.length; K++) {
			var H = E[K];
			if ((H.nodeType == Node.TEXT_NODE || H.nodeType == Node.CDATA_SECTION_NODE) && H.tagName != null) {
				P[H.tagName] = H.data
			} else {
				if (H.nodeType == Node.CDATA_SECTION_NODE) {
					if (G != null) {
						G[x.tagName] = "" + H.data
					}
				} else {
					if (H.nodeType == Node.ELEMENT_NODE || H.nodeType == Node.DOCUMENT_NODE || H.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
						var N = H.childNodes;
						var O = null;
						if (N != null) {
							for (var I = 0; I < N.length; I++) {
								if (N[I].nodeType == Node.CDATA_SECTION_NODE) {
									O = N[I]
								} else {
									if (N[I].nodeType != Node.TEXT_NODE) {
										O = null;
										break
									}
								}
							}
						}
						if (O != null || N == null || N.length <= 1) {
							if (O != null || (N != null && N.length == 1)) {
								var M = O != null ? O: N[0];
								if (M.nodeType == Node.TEXT_NODE || M.nodeType == Node.CDATA_SECTION_NODE) {
									var y = P[H.tagName];
									var b = M.data ? M.data: "";
									if (y != null) {
										y = y + "\n" + b;
										P[H.tagName] = y
									} else {
										P[H.tagName] = b
									}
									continue
								}
							} else {
								var y = P[H.tagName];
								var b = "";
								if (y != null) {
									y = y + "\n" + b;
									P[H.tagName] = y
								} else {
									P[H.tagName] = b
								}
								continue
							}
						}
						var m = E[K].tagName;
						var o = null;
						var q = null;
						var C = null;
						var u = null;
						var D = H.attributes;
						var g = false;
						if (D != null) {
							for (var J = 0; J < D.length; J++) {
								var F = D[J];
								P[F.name] = F.value;
								if (F.name == "cls" || F.name == "class") {
									o = F.value
								} else {
									if (F.name == "atype") {
										u = F.value
									} else {
										if (F.name == "fullId") {
											q = F.value
										} else {
											if (F.name == "actualFullId") {
												C = F.value
											} else {
												if (F.name == "xml") {
													if (F.value == "true") {
														g = true
													}
												}
											}
										}
									}
								}
							}
						}
						if (g) {
							P[H.tagName] = H.childNodes[0];
							continue
						}
						var A = this.getIdFromInnerNode(H);
						if (A == null) {
							if (u == "OO") {
								A = 0
							} else {
								var L = P[m];
								if (L) {
									A = L.length
								} else {
									A = 0
								}
							}
						}
						var r = null;
						if (_useFile) {
							if (q == null) {
								var z = getFullId(P);
								q = z + "." + o + "." + A;
								r = dtCache.getByFullId(q);
								if (!r) {
									r = new Object()
								}
								r.__parent = P
							} else {
								r = dtCache.getByFullId(q);
								if (!r) {
									r = dtCache.getByFullIdInDataSets(q);
									if (!r) {
										r = new Object();
										r.__parent = P;
										dtCache.addToObjsTable(q, r)
									}
								}
							}
						} else {
							r = new Object();
							r.__parent = P
						}
						r.__className = o;
						r.__id = A;
						r.__fullId = q;
						r.__atype = u;
						if (C != null) {
							r.__actualFullId = C
						}
						if (u == "OO") {
							P[m] = r
						} else {
							var L = P[m];
							if (L) {
								if (! (L instanceof Array)) {
									var B = new Array();
									B.__parent = P;
									B.__className = o;
									P[m] = B;
									L.__index = B.length;
									B.push(L);
									L = B
								}
								r.__index = L.length;
								L.push(r)
							} else {
								L = new Array();
								L.__parent = P;
								L.__className = o;
								P[m] = L;
								r.__index = L.length;
								L.push(r)
							}
						}
						this.processXMLNode(r, H, P)
					}
				}
			}
		}
		return P
	}
});
Af.ChangeManager = Class.create({
	initialize: function() {
		this.changes = new Array();
		this.redoChanges = new Array();
		this.cutCopyBuffers = new Array();
		this.undoE = null;
		this.redoE = null;
		this.saveE = null;
		this.nonUndoableChanges = new Array();
		this.txId = 0
	},
	setRedoE: function(a) {
		if (this.redoE) {
			this.redoE.className = a ? "undo_redo redo_on": "undo_redo redo_off"
		}
	},
	setUndoE: function(a) {
		if (this.undoE) {
			this.undoE.className = a ? "undo_redo undo_on": "undo_redo undo_off"
		}
	},
	setSaveE: function(a) {
		if (this.saveE) {
			this.saveE.disabled = !a
		}
		var b = $("textSaveMessage");
		if (b) {
			b.innerHTML = a ? "Save needed": "Save not needed"
		}
	},
	pushChange: function(b, a) {
		this.changes.push(b);
		if (a) {
			this.redoChanges.length = 0;
			this.setRedoE(false)
		}
		this.setUndoE(true);
		var g = this.isSaveNeeded();
		this.setSaveE(g)
	},
	popChange: function() {
		var a = this.changes.pop();
		if (this.changes.length == 0) {
			this.setUndoE(false)
		}
		var b = this.isSaveNeeded();
		this.setSaveE(b);
		return a
	},
	pushRedoChange: function(a) {
		this.redoChanges.push(a);
		this.setRedoE(true)
	},
	popRedoChange: function(a) {
		var a = this.redoChanges.pop();
		if (this.redoChanges.length == 0) {
			this.setRedoE(false)
		}
		return a
	},
	unsetAttrValue: function(g, b, a) {
		g[b] = a
	},
	uncreate: function(b, a) {
		b.canvas._deleteObject(b)
	},
	undelete: function(b, a) {
		b.canvas._addObject(b)
	},
	unsetByMethod: function(b, m, g) {
		var a = new Array();
		a.push(g);
		m.apply(b, a)
	},
	discardChanges: function() {
		for (var a = this.changes.length - 1; a >= 0; a--) {
			var b = this.changes[a];
			switch (b.changeType) {
			case ObjModify:
				this.unsetAttrValue(b.obj, b.attrName, b.oldValue);
				break;
			case ObjDelete:
				this.undelete(b.obj);
				break;
			case ObjCreate:
				this.uncreate(b.obj);
				break;
			case ObjModifyByMethod:
				this.unsetByMethod(b.obj, b.method, b.oldParams);
				break;
			case ObjUnknownChange:
				break
			}
		}
		this.clearChanges()
	},
	undoChange: function() {
		var o = -1;
		var m = null;
		var b = [];
		while (true) {
			var a = this.changes.length;
			if (a > 0) {
				var g = this.changes[a - 1];
				if (o == -1 || o == g.txId) {
					o = g.txId;
					m = this._undoChange();
					if (m) {
						b.push(m)
					}
				} else {
					break
				}
			} else {
				break
			}
		}
		return b
	},
	_undoChange: function() {
		if (this.changes.length == 0) {
			return null
		}
		var a = this.popChange();
		switch (a.changeType) {
		case ObjModify:
			this.unsetAttrValue(a.obj, a.attrName, a.oldValue);
			break;
		case ObjDelete:
			this.undelete(a.obj, a.list);
			break;
		case ObjCreate:
			this.uncreate(a.obj, a.list);
			break;
		case ObjModifyByMethod:
			this.unsetByMethod(a.obj, a.method, a.oldParams);
			break;
		case ObjUnknownChange:
			break
		}
		this.pushRedoChange(a);
		return a
	},
	redoChange: function() {
		var o = -1;
		var m;
		var b = [];
		while (true) {
			var a = this.redoChanges.length;
			if (a > 0) {
				var g = this.redoChanges[a - 1];
				if (o == -1 || o == g.txId) {
					o = g.txId;
					m = this._redoChange();
					if (m) {
						b.push(m)
					}
				} else {
					break
				}
			} else {
				break
			}
		}
		return b
	},
	_redoChange: function() {
		if (this.redoChanges.length == 0) {
			return null
		}
		var a = this.popRedoChange();
		switch (a.changeType) {
		case ObjModify:
			this.unsetAttrValue(a.obj, a.attrName, a.newValue);
			break;
		case ObjDelete:
			this.uncreate(a.obj);
			break;
		case ObjCreate:
			this.undelete(a.obj);
			break;
		case ObjModifyByMethod:
			this.unsetByMethod(a.obj, a.method, a.newParams);
			break;
		case ObjUnknownChange:
			break
		}
		this.pushChange(a, false);
		return a
	},
	beginTx: function() {
		if (this.isTxOn) {
			return
		}
		this.isTxOn = true;
		this.txId++
	},
	endTx: function() {
		if (!this.isTxOn) {
			return
		}
		this.isTxOn = false
	},
	areChangesAvailable: function() {
		return this.changes.length > 0 || this.nonUndoableChanges.length > 0
	},
	isSaveNeeded: function() {
		var a = this.changes.length > 0 || this.nonUndoableChanges.length > 0;
		return a
	},
	clearChanges: function() {
		this.isTxOn = false;
		this.txId = 0;
		this.changes = new Array();
		this.redoChanges = new Array();
		this.nonUndoableChanges = new Array();
		this.setRedoE(false);
		this.setUndoE(false);
		var a = this.isSaveNeeded();
		this.setSaveE(a)
	},
	addModifyChange: function(m, b, a, g) {
		var o = false;
		if (!this.isTxOn) {
			o = true;
			this.beginTx()
		}
		change = new Af.EditChange(ObjModify, m);
		change.txId = this.txId;
		this.pushChange(change, true);
		change.attrName = b;
		change.oldValue = a;
		change.newValue = g;
		if (o) {
			this.endTx()
		}
		return change
	},
	addModifyChangeByMethod: function(b, q, a, o, g) {
		var m = false;
		if (!this.isTxOn) {
			m = true;
			this.beginTx()
		}
		change = new Af.EditChange(ObjModifyByMethod, b);
		change.txId = g ? this.txId - 1 : this.txId;
		change.method = q;
		change.oldParams = a;
		change.newParams = o;
		this.pushChange(change, true);
		if (m) {
			this.endTx()
		}
		return change
	},
	addNonUndoableModifyChange: function(m, b, a, g) {
		var o = false;
		if (!this.isTxOn) {
			o = true;
			this.beginTx()
		}
		change = new Af.EditChange(ObjModify, m);
		change.txId = this.txId;
		this.nonUndoableChanges.push(change);
		change.attrName = b;
		change.oldValue = a;
		change.newValue = g;
		if (o) {
			this.endTx()
		}
		return change
	},
	addCreateChange: function(a) {
		var b = false;
		if (!this.isTxOn) {
			b = true;
			this.beginTx()
		}
		change = new Af.EditChange(ObjCreate, a);
		change.txId = this.txId;
		this.pushChange(change, true);
		if (b) {
			this.endTx()
		}
		return change
	},
	addDeleteChange: function(a) {
		var b = false;
		if (!this.isTxOn) {
			b = true;
			this.beginTx()
		}
		change = new Af.EditChange(ObjDelete, a);
		change.txId = this.txId;
		this.pushChange(change, true);
		if (b) {
			this.endTx()
		}
		return change
	},
	toXml: function() {
		var g = "<undo_list>\n";
		var m = this.changes.length;
		for (var a = 0; a < m; a++) {
			var b = this.changes[a];
			g += b.toXml(true)
		}
		g += "</undo_list>\n";
		g += "<redo_list>\n";
		var m = this.redoChanges.length;
		for (var a = 0; a < m; a++) {
			var b = this.redoChanges[a];
			g += b.toXml()
		}
		g += "</redo_list>\n";
		return g
	},
	updateLists: function(g) {
		var a = [];
		var o = g.undo_list || g.redo_list;
		var b = g.undo_list;
		if (b != null && (b instanceof Array)) {
			var m = b[0];
			this.updateUndoList(m, a)
		}
		b = g.redo_list;
		if (b != null && (b instanceof Array)) {
			var m = b[0];
			this.updateRedoList(m, a)
		}
		this.setObjReference(this.changes, a);
		this.setObjReference(this.redoChanges, a);
		return o
	},
	setObjReference: function(b, a) {
		var o = b.length;
		for (var g = 0; g < o; g++) {
			var m = b[g];
			if (m.obj) {
				continue
			}
			m.obj = this.getByName(m.surface.gobjects, m.name);
			if (m.obj == null) {
				m.obj = this.getByName(a, m.name)
			}
			if (m.method && m.obj) {
				m.method = m.obj[m.method]
			}
		}
	},
	updateUndoList: function(g, a) {
		var b = g.ch;
		if (b == null) {
			return
		}
		for (var m = 0; m < b.length; m++) {
			var o = this.getChange(b[m], a);
			if (this.txId < o.txId) {
				this.txId = o.txId
			}
			this.pushChange(o)
		}
	},
	updateRedoList: function(g, a) {
		var b = g.ch;
		if (b == null) {
			return
		}
		for (var m = 0; m < b.length; m++) {
			var o = this.getChange(b[m], a);
			if (this.txId < o.txId) {
				this.txId = o.txId
			}
			this.pushRedoChange(o)
		}
	},
	getChange: function(cobj, objList) {
		var ch = new Af.EditChange();
		ch.surface = designer.surfaces[parseInt(cobj.s - 1)];
		ch.name = cobj.n;
		var dwl = cobj.dw;
		if (dwl != null) {
			ch.obj = ch.surface.setOneDrawingObject(null, dwl[0], ch.surface.encoding, true);
			objList.push(ch.obj)
		}
		ch.changeType = parseInt(cobj.t);
		ch.txId = parseInt(cobj.tx);
		if (cobj.m != null) {
			ch.method = cobj.m;
			var temp = cobj.p1;
			if (temp != null) {
				ch.newParams = eval("(" + temp + ")")
			}
			temp = cobj.p2;
			if (temp != null) {
				ch.oldParams = eval("(" + temp + ")")
			}
		}
		return ch
	},
	getByName: function(b, a) {
		for (var g = 0; g < b.length; g++) {
			if (b[g].name == a) {
				return b[g]
			}
		}
		return null
	}
});
var ObjUnknownChange = 0;
var ObjModify = 1;
var ObjCreate = 2;
var ObjDelete = 3;
var ObjAdded = 4;
var ObjRemoved = 5;
var ObjMoved = 6;
var ObjParentChange = 7;
var ObjModifyByMethod = 8;
Af.EditChange = Class.create({
	initialize: function(a, b) {
		this.obj = b;
		this.changeType = a;
		this.side = designer.currentSide;
		this.surface = designer.currentSurface;
		if (b) {
			this.name = b.name
		}
		this.serialize = true
	},
	toXml: function(a) {
		if (!this.serialize) {
			return ""
		}
		var g = "<ch>\n<t>" + this.changeType + "</t>\n<s>" + this.side + "</s>\n<n>" + this.name + "</n>\n<tx>" + this.txId + "</tx>\n";
		if (this.method != null) {
			var r = this.obj;
			for (var q in r) {
				var m = r[q];
				if (m == null) {
					continue
				}
				var b = typeof m;
				if (b == "function" && m == this.method) {
					g += "<m>" + q + "</m>\n";
					break
				}
			}
			if (this.newParams) {
				g += "<p1><![CDATA[" + Object.toJSON(this.newParams) + "]]></p1>\n"
			}
			if (this.oldParams) {
				g += "<p2><![CDATA[" + Object.toJSON(this.oldParams) + "]]></p2>\n"
			}
		}
		if (a) {
			if (this.changeType == ObjDelete) {
				g += this.obj.toXml("", this.surface.bleedLineXMargin, this.surface.bleedLineYMargin)
			}
		} else {
			if (this.changeType == ObjCreate) {
				g += this.obj.toXml("", this.surface.bleedLineXMargin, this.surface.bleedLineYMargin)
			}
		}
		g += "</ch>\n";
		return g
	}
});
var chgMgr = new Af.ChangeManager();
Af.SubModalDialog = Class.create({
	initialize: function() {
		var a = document.createElement("div");
		a.id = "popupMask";
		var u = document.createElement("div");
		if (is_ie) {
			u.style.overflow = "visible"
		} else {
			u.style.overflow = "auto"
		}
		u.className = "Dialog";
		var o = document.createElement("table");
		o.cellSpacing = "0px";
		o.cellPadding = "0px";
		o.style.width = "100%";
		u.appendChild(o);
		var g = document.createElement("tbody");
		o.appendChild(g);
		var r;
		var q;
		q = document.createElement("tr");
		g.appendChild(q);
		r = document.createElement("td");
		r.className = "DialogTitle";
		q.appendChild(r);
		this.titleElement = r;
		var m = document.createElement("span");
		m.className = "DialogTitleSpan";
		r.appendChild(m);
		this.titleText = m;
		r = document.createElement("td");
		r.className = "DialogTitleButtonBar";
		q.appendChild(r);
		this.cb = document.createElement("a");
		this.cb.className = "DialogTitleButton";
		var b = document.createElement("img");
		b.className = "DialogCloseButtonImage";
		b.src = "/psp/images2/w_close.png";
		this.cb.appendChild(b);
		r.appendChild(this.cb);
		this.cb.onclick = this.hide.bindAsEventListener(this);
		q = document.createElement("tr");
		g.appendChild(q);
		r = document.createElement("td");
		r.colSpan = "2";
		o.style.width = "100%";
		q.appendChild(r);
		this.contentArea = r;
		this.contentArea.className = "SubModalDialogContent";
		this.element = u;
		this.popmask = a;
		this.popupContainer = u;
		this.popupContainer.style.zIndex = "7000001";
		this.visible = false
	},
	show: function(g, b) {
		var a = document.getElementsByTagName("body")[0];
		a.appendChild(this.popmask);
		a.appendChild(this.popupContainer);
		b += 24;
		this.visible = true;
		this.popmask.style.display = "block";
		this.popupContainer.style.display = "block";
		this.centerPopWin(g, b);
		this.popupContainer.style.width = g + "px";
		this.popupContainer.style.height = b + "px"
	},
	hide: function() {
		this.visible = false;
		this.popmask.style.display = "none";
		this.popupContainer.style.display = "none";
		var a = document.getElementsByTagName("body")[0];
		for (var b = 0; b < a.childNodes.length; b++) {
			if (a.childNodes[b] == this.popmask) {
				a.removeChild(this.popmask);
				break
			}
		}
		for (var b = 0; b < a.childNodes.length; b++) {
			if (a.childNodes[b] == this.popupContainer) {
				a.removeChild(this.popupContainer);
				break
			}
		}
		if (this.callOnCancel == true && this.returnFunc != null) {
			this.returnFunc()
		}
	},
	centerPopWin: function(q, a) {
		var o = this.getViewportHeight();
		var r = this.getViewportWidth();
		var m, b;
		if (self.pageYOffset) {
			m = self.pageXOffset;
			b = self.pageYOffset
		} else {
			if (document.documentElement && document.documentElement.scrollTop) {
				m = document.documentElement.scrollLeft;
				b = document.documentElement.scrollTop
			} else {
				if (document.body) {
					m = document.body.scrollLeft;
					b = document.body.scrollTop
				}
			}
		}
		this.popmask.style.height = o + "px";
		this.popmask.style.width = r + "px";
		this.popmask.style.top = b + "px";
		this.popmask.style.left = m + "px";
		var g = b + ((o - a) / 2);
		if (g < 0) {
			g = 0
		}
		this.popupContainer.style.top = g + "px";
		this.popupContainer.style.left = (m + ((r - q) / 2)) + "px"
	},
	getViewportHeight: function() {
		if (window.innerHeight != window.undefined) {
			return window.innerHeight
		}
		if (document.compatMode == "CSS1Compat") {
			return document.documentElement.clientHeight
		}
		if (document.body) {
			return document.body.clientHeight
		}
		return window.undefined
	},
	getViewportWidth: function() {
		if (window.innerWidth != window.undefined) {
			return window.innerWidth
		}
		if (document.compatMode == "CSS1Compat") {
			return document.documentElement.clientWidth
		}
		if (document.body) {
			return document.body.clientWidth
		}
		return window.undefined
	},
	showHtmlInDialog: function(g, r, m, a, b, q, o) {
		this.callOnCancel = o;
		this.contentArea.innerHTML = g;
		this.titleText.innerHTML = r ? r: "";
		this.returnFunc = b;
		this.show(m, a)
	},
	showHtmlElementInDialog: function(o, u, a, y, g, m, x, q, b, r) {
		this.callOnCancel = x;
		removeAll(this.contentArea);
		this.contentArea.appendChild(o);
		this.titleText.innerHTML = u;
		this.returnFunc = g;
		this.show(a, y);
		if (o.offsetHeight > this.popupContainer.offsetHeight) {
			this.popupContainer.style.height = (o.offsetHeight + 50) + "px"
		}
		if (q) {
			this.doAddButtons(o, g, x)
		}
		if (b) {
			this.cb.style.display = "none"
		} else {
			this.cb.style.display = ""
		}
	},
	doAddButtons: function(o, b, a) {
		var m = document.createElement("table");
		m.width = "100%";
		var g = document.createElement("tbody");
		m.appendChild(g);
		var q = document.createElement("tr");
		g.appendChild(q);
		td = document.createElement("td");
		td.style.paddingTop = "10px";
		td.style.paddingLeft = "6px";
		q.appendChild(td);
		e = document.createElement("button");
		o.__ok = e;
		if (b) {
			e.onclick = function() {
				b()
			}
		}
		e.className = "ButtonStyle";
		e.innerHTML = "OK";
		td.appendChild(e);
		e = document.createElement("button");
		e.className = "ButtonStyle";
		e.innerHTML = "Cancel";
		o.__cancel = e;
		if (a) {
			e.onclick = function() {
				a()
			}
		} else {
			e.onclick = hideDialogWin
		}
		e.style.marginLeft = "5px";
		td.appendChild(e);
		q = document.createElement("tr");
		g.appendChild(q);
		td = document.createElement("td");
		td.style.paddingTop = "10px";
		td.style.color = "red";
		td.style.paddingLeft = "6px";
		td.style.paddingRight = "3px";
		q.appendChild(td);
		o.__messageBox = td;
		o.appendChild(m)
	}
});
var submodalDialog = null;
function showInputDialog(b, o, r, m, a, g, q) {
	if (submodalDialog == null) {
		submodalDialog = new Af.SubModalDialog()
	}
	var u = getPromptDialogElement(b, o, g, m);
	submodalDialog.showHtmlElementInDialog(u.container, r, m, a, g, q);
	u.textField.focus();
	return u
}
function showConfirmDialog(o, u, m, b, g, a, r) {
	if (submodalDialog == null) {
		submodalDialog = new Af.SubModalDialog()
	}
	var q = getConfirmDialogElement(o, g, a);
	submodalDialog.showHtmlElementInDialog(q.container, u, m, b, a, r);
	return q
}
function showDeleteDialog(o, r, m, b, g, a, q) {
	if (submodalDialog == null) {
		submodalDialog = new Af.SubModalDialog()
	}
	var u = getDeleteDialogElement(o, g, a);
	submodalDialog.showHtmlElementInDialog(u.container, r, m, b, a, q);
	return u
}
function showYesNoCancelDialog(x, q, a, r, b, o, m, g) {
	if (submodalDialog == null) {
		submodalDialog = new Af.SubModalDialog()
	}
	var u = getYesNoCancelDialogElement(x, b, o, m);
	submodalDialog.showHtmlElementInDialog(u.container, q, a, r, m, g);
	return u
}
function showMessageDialog(m, r, g, a, q, o) {
	if (submodalDialog == null) {
		submodalDialog = new Af.SubModalDialog()
	}
	var b = getMessageDialogElement(m, q);
	submodalDialog.showHtmlElementInDialog(b.container, r, g, a, q, o);
	return b
}
function hideDialogWin() {
	if (submodalDialog != null) {
		submodalDialog.hide()
	}
}
function getPromptDialogElement(r, u, b, a) {
	var y = document.createElement("table");
	y.width = "100%";
	var m = document.createElement("tbody");
	y.appendChild(m);
	var q = document.createElement("tr");
	m.appendChild(q);
	var g = document.createElement("td");
	q.appendChild(g);
	g.appendChild(document.createTextNode(r));
	q = document.createElement("tr");
	m.appendChild(q);
	g = document.createElement("td");
	q.appendChild(g);
	g.style.paddingLeft = "3px";
	g.style.marginRight = "3px";
	g.style.width = "100%";
	var o = document.createElement("input");
	o.type = "text";
	if (u) {
		o.value = u
	}
	o.className = "TextField";
	o.style.width = (a - 20) + "px";
	var x = o;
	g.appendChild(o);
	q = document.createElement("tr");
	m.appendChild(q);
	g = document.createElement("td");
	g.style.paddingTop = "4px";
	g.style.paddingLeft = "6px";
	q.appendChild(g);
	o = document.createElement("button");
	if (b) {
		o.onclick = function() {
			b()
		}
	}
	o.className = "ButtonStyle";
	o.innerHTML = "OK";
	g.appendChild(o);
	o = document.createElement("button");
	o.className = "ButtonStyle";
	o.innerHTML = "Cancel";
	o.onclick = hideDialogWin;
	o.style.marginLeft = "5px";
	g.appendChild(o);
	q = document.createElement("tr");
	m.appendChild(q);
	g = document.createElement("td");
	g.style.paddingTop = "10px";
	g.style.color = "red";
	g.style.paddingLeft = "6px";
	g.style.paddingRight = "3px";
	q.appendChild(g);
	return {
		container: y,
		textField: x,
		messageBox: g
	}
}
function getConfirmDialogElement(o, b, a) {
	var m = document.createElement("table");
	m.width = "100%";
	var g = document.createElement("tbody");
	m.appendChild(g);
	var q = document.createElement("tr");
	g.appendChild(q);
	var r = document.createElement("td");
	q.appendChild(r);
	r.innerHTML = o;
	q = document.createElement("tr");
	g.appendChild(q);
	r = document.createElement("td");
	r.style.paddingTop = "10px";
	r.style.paddingLeft = "6px";
	q.appendChild(r);
	e = document.createElement("button");
	if (b) {
		e.onclick = function() {
			b()
		}
	}
	e.className = "ButtonStyle";
	e.innerHTML = "OK";
	r.appendChild(e);
	e = document.createElement("button");
	e.className = "ButtonStyle";
	e.innerHTML = "Cancel";
	if (a) {
		e.onclick = function() {
			a()
		}
	} else {
		e.onclick = hideDialogWin
	}
	e.style.marginLeft = "5px";
	r.appendChild(e);
	q = document.createElement("tr");
	g.appendChild(q);
	r = document.createElement("td");
	r.style.paddingTop = "10px";
	r.style.color = "red";
	r.style.paddingLeft = "6px";
	r.style.paddingRight = "3px";
	q.appendChild(r);
	return {
		container: m,
		messageBox: r
	}
}
function getYesNoCancelDialogElement(q, g, a, b) {
	var o = document.createElement("table");
	o.width = "100%";
	var m = document.createElement("tbody");
	o.appendChild(m);
	var r = document.createElement("tr");
	m.appendChild(r);
	var u = document.createElement("td");
	r.appendChild(u);
	u.innerHTML = q;
	r = document.createElement("tr");
	m.appendChild(r);
	u = document.createElement("td");
	u.style.paddingTop = "10px";
	u.style.paddingLeft = "10px";
	u.align = "left";
	r.appendChild(u);
	e = document.createElement("button");
	if (g) {
		e.onclick = function() {
			g()
		}
	}
	e.className = "ButtonStyle";
	e.innerHTML = "Yes";
	u.appendChild(e);
	e = document.createElement("button");
	if (a) {
		e.onclick = function() {
			a()
		}
	}
	e.className = "ButtonStyle";
	e.innerHTML = "No";
	e.style.marginLeft = "5px";
	u.appendChild(e);
	e = document.createElement("button");
	e.className = "ButtonStyle";
	e.innerHTML = "Cancel";
	if (b) {
		e.onclick = function() {
			b()
		}
	} else {
		e.onclick = hideDialogWin
	}
	e.style.marginLeft = "5px";
	u.appendChild(e);
	r = document.createElement("tr");
	m.appendChild(r);
	u = document.createElement("td");
	u.style.paddingTop = "10px";
	u.style.color = "red";
	u.style.paddingLeft = "6px";
	u.style.paddingRight = "3px";
	r.appendChild(u);
	return {
		container: o,
		messageBox: u
	}
}
function getDeleteDialogElement(z, g, r) {
	var y = document.createElement("table");
	y.width = "100%";
	var o = document.createElement("tbody");
	y.appendChild(o);
	var q = document.createElement("tr");
	o.appendChild(q);
	var m = document.createElement("td");
	q.appendChild(m);
	m.innerHTML = z;
	var a = document.createElement("div");
	a.className = "confirm_delete_but_block";
	var x = document.createElement("a");
	x.href = "#";
	x.innerHTML = "Yes";
	if (g) {
		x.onclick = function(B) {
			var A = B || window.event;
			A.preventDefault ? A.preventDefault() : A.returnValue = false;
			g()
		}
	} else {
		x.onclick = function(B) {
			var A = B || window.event;
			A.preventDefault ? A.preventDefault() : A.returnValue = false
		}
	}
	a.appendChild(x);
	var u = document.createElement("span");
	u.innerHTML = "|";
	a.appendChild(u);
	var b = document.createElement("a");
	b.href = "#";
	b.innerHTML = "No";
	if (r) {
		b.onclick = function(B) {
			var A = B || window.event;
			A.preventDefault ? A.preventDefault() : A.returnValue = false;
			r()
		}
	} else {
		b.onclick = function(B) {
			var A = B || window.event;
			A.preventDefault ? A.preventDefault() : A.returnValue = false;
			hideDialogWin()
		}
	}
	a.appendChild(b);
	m.appendChild(a);
	q = document.createElement("tr");
	o.appendChild(q);
	m = document.createElement("td");
	m.style.paddingTop = "10px";
	m.style.paddingLeft = "6px";
	q.appendChild(m);
	q = document.createElement("tr");
	o.appendChild(q);
	return {
		container: y,
		messageBox: m
	}
}
function getMessageDialogElement(m, q) {
	var g = document.createElement("table");
	g.width = "100%";
	var b = document.createElement("tbody");
	g.appendChild(b);
	var o = document.createElement("tr");
	b.appendChild(o);
	var u = document.createElement("td");
	o.appendChild(u);
	var r = u;
	u.innerHTML = m;
	o = document.createElement("tr");
	b.appendChild(o);
	u = document.createElement("td");
	u.style.paddingTop = "10px";
	u.style.paddingLeft = "6px";
	o.appendChild(u);
	e = document.createElement("button");
	if (q) {
		e.onclick = function() {
			q()
		}
	} else {
		e.onclick = hideDialogWin
	}
	e.className = "ButtonStyle";
	e.innerHTML = "OK";
	u.appendChild(e);
	var a = {
		container: g,
		messageBox: r,
		ok: e
	};
	return a
}
Af.ModalDialog = Class.create({
	initialize: function() {
		this._progressIntervalId = null;
		this._progressFrameRow = 0;
		this._progressFrameCol = 0;
		this.n_frames_x = 8;
		this.n_frames_y = 4;
		this._frameWidth = 32;
		this._frameHeight = 32;
		_progressNode = document.createElement("img");
		_progressNode.src = "/psp/images/blank1x1.gif";
		_progressNode.style.backgroundImage = "url(/psp/images/progress_animation.png)";
		_progressNode.style.width = this._frameWidth + "px";
		_progressNode.style.height = this._frameHeight + "px";
		_progressNode.style.backgroundRepeat = "no-repeat";
		_progressNode.style.verticalAlign = "middle";
		this._progressNode = _progressNode;
		var b = document.getElementsByTagName("body")[0];
		var a = document.createElement("div");
		a.id = "popupMask";
		var r = document.createElement("div");
		r.id = "popupContainer";
		r.innerHTML = '<div style="width:100%;height:100%;background-color:#ffffff;" scrolling="auto" id="popupFrame" name="popupFrame" width="100%" height="100%"></div>';
		b.appendChild(a);
		b.appendChild(r);
		this.popmask = a;
		this.popupContainer = r;
		this.popupContainer.style.zIndex = "2000001";
		this.contentArea = this.popupContainer.childNodes[0];
		this.contentArea.className = "ModalDialogContent";
		var m = document.createElement("table");
		m.cellSpacing = "0px";
		m.cellPadding = "0px";
		this.contentArea.appendChild(m);
		m.id = "mdTable";
		m.width = "100%";
		var g = document.createElement("tbody");
		m.appendChild(g);
		var o = document.createElement("tr");
		g.appendChild(o);
		var q = document.createElement("td");
		q.className = "DialogTitle";
		q.width = "100%";
		q.colSpan = "2";
		o.appendChild(q);
		this.titleElement = q;
		this.titleElement.innerHTML = "&nbsp;";
		o = document.createElement("tr");
		g.appendChild(o);
		q = document.createElement("td");
		q.width = "100%";
		q.style.width = (this._frameWidth + 4) + "px";
		q.style.padding = "2px";
		o.appendChild(q);
		q.style.verticalAlign = "middle";
		q.appendChild(_progressNode);
		q = document.createElement("td");
		q.width = "100%";
		q.style.verticalAlign = "middle";
		o.appendChild(q);
		q.innerHTML = "&nbsp;";
		this.table = m;
		this.popupContainer.style.border = "1px solid gray";
		this.messageArea = q;
		this.count = 0;
		this.timeoutHandler = null
	},
	showMessage: function(g, m, b, a) {
		this.count++;
		this.titleElement.innerHTML = m;
		this.popmask.style.display = "block";
		this.popupContainer.style.display = "block";
		this.centerPopWin(b, a);
		this.popupContainer.style.width = b + "px";
		this.messageArea.style.height = (a - 30) + "px";
		this.popupContainer.style.height = a + "px";
		this.messageArea.className = "DialogText";
		this.messageArea.innerHTML = g;
		this.startProgress()
	},
	centerPopWin: function(b, z) {
		var q = this.getViewportHeight();
		var u = this.getViewportWidth();
		var g, A;
		if (self.pageYOffset) {
			g = self.pageXOffset;
			A = self.pageYOffset
		} else {
			if (document.documentElement && document.documentElement.scrollTop) {
				g = document.documentElement.scrollLeft;
				A = document.documentElement.scrollTop
			} else {
				if (document.body) {
					g = document.body.scrollLeft;
					A = document.body.scrollTop
				}
			}
		}
		this.popmask.style.height = q + "px";
		this.popmask.style.width = u + "px";
		this.popmask.style.top = A + "px";
		this.popmask.style.left = g + "px";
		if (this.locationE != null) {
			var a = toDocumentPosition(this.locationE);
			var r = a.x;
			var o = a.y;
			if (this.locXOff != null) {
				r += this.locXOff
			}
			if (this.locYOff != null) {
				o += this.locYOff
			}
			this.popupContainer.style.left = r + "px";
			this.popupContainer.style.top = o + "px";
			this.popupContainer.className = "ModalDialog2"
		} else {
			var m = A + ((q - z) / 2);
			if (m < 0) {
				m = 0
			}
			this.popupContainer.style.top = m + "px";
			this.popupContainer.style.left = (g + ((u - b) / 2)) + "px"
		}
	},
	getViewportHeight: function() {
		if (window.innerHeight != window.undefined) {
			return window.innerHeight
		}
		if (document.compatMode == "CSS1Compat") {
			return document.documentElement.clientHeight
		}
		if (document.body) {
			return document.body.clientHeight
		}
		return window.undefined
	},
	getViewportWidth: function() {
		if (window.innerWidth != window.undefined) {
			return window.innerWidth
		}
		if (document.compatMode == "CSS1Compat") {
			return document.documentElement.clientWidth
		}
		if (document.body) {
			return document.body.clientWidth
		}
		return window.undefined
	},
	startProgress: function() {
		this.stopProgress();
		this.tick();
		this._progressIntervalId = window.setInterval(this.tick.bind(this), 50)
	},
	tick: function() {
		this._progressFrameCol++;
		if (this._progressFrameCol == this.n_frames_x) {
			this._progressFrameCol = 0;
			this._progressFrameRow++;
			if (this._progressFrameRow == this.n_frames_y) {
				this._progressFrameRow = 0;
				this._progressFrameCol = 1
			}
		}
		var b = parseInt( - 1 * this._progressFrameCol * this._frameWidth);
		var a = parseInt( - 1 * this._progressFrameRow * this._frameHeight);
		this._progressNode.style.backgroundPosition = b + "px " + a + "px"
	},
	stopProgress: function() {
		if (this._progressIntervalId != null) {
			window.clearInterval(this._progressIntervalId);
			this._progressIntervalId = null
		}
	},
	hide: function() {
		this.count--;
		this.stopProgress();
		this.popmask.style.display = "none";
		this.popupContainer.style.display = "none";
		if (this.timeoutHandler != null) {
			clearTimeout(this.timeoutHandler);
			this.timeoutHandler = null
		}
	},
	setTimeout: function(a) {
		this.timeoutHandler = setTimeout(this.handleTimedOut.bind(this), a)
	},
	handleTimedOut: function() {
		this.hide()
	}
});
var modalDialog = null;
function showModalMessageDialog(g, o, b, a, m) {
	if (shortStatus) {
		shortStatus.show(g);
		return
	}
	if (modalDialog == null) {
		modalDialog = new Af.ModalDialog()
	}
	modalDialog.showMessage(g, o, b, a);
	if (m != null) {
		modalDialog.setTimeout(m)
	}
}
function hideModalMessageDialog() {
	if (shortStatus) {
		shortStatus.clear();
		return
	}
	if (modalDialog != null) {
		modalDialog.hide()
	}
}
function setModalDialogLocationElement(b, a, g) {
	if (modalDialog == null) {
		modalDialog = new Af.ModalDialog()
	}
	modalDialog.locationE = b;
	modalDialog.locXOff = a;
	modalDialog.locYOff = g;
	modalDialog.showMsgText = b == null
}
Af.Dialog = Class.create({
	initialize: function(b, g, a) {
		this._initializeDialog(b, g, a)
	},
	_initializeDialog: function(b, g, a) {
		this.handler = a;
		this.title = g;
		this.content = b;
		this.titleElement = null;
		this.cb = null;
		this.visible = false;
		this.component = null;
		this.width = "80%";
		this.height = -1;
		this.firstTime = true;
		this.left = -1;
		this.top = -1
	},
	close: function(a) {
		if (this.handler != null) {
			this.handler.closeDialog(this)
		} else {
			if (this.component && this.component.dataGrid) {
				this.component.dataGrid.endEditing(true, this.hide.bindAsEventListener(this))
			} else {
				this.hide()
			}
		}
		return false
	},
	hide: function() {
		this.visible = false;
		if (this.component) {
			this.component.changeVisibility(false)
		}
		if (this.element != null) {
			this.element.style.display = "none"
		}
	},
	setLocation: function(a, b) {
		this.firstTime = false;
		this.element.style.left = a + "px";
		this.element.style.top = b + "px"
	},
	show: function(a) {
		this.visible = true;
		if (this.component) {
			this.component.changeVisibility(true)
		}
		if (this.element == null) {
			this.createElement()
		}
		var g;
		if (typeof a == "string") {
			g = document.getElementById(a)
		} else {
			g = a
		}
		g.appendChild(this.element);
		if (this.firstTime) {
			this.firstTime = false;
			var b;
			if (this.left < 0) {
				b = (g.offsetWidth - this.element.offsetWidth) / 2
			} else {
				b = g.offsetLeft + this.left
			}
			if (b > 0) {
				this.element.style.left = b + "px"
			}
			if (this.top < 0) {
				b = (g.offsetHeight - this.element.offsetHeight) / 2
			} else {
				b = g.offsetTop + this.top
			}
			if (b > 0) {
				this.element.style.top = b + "px"
			}
		}
		this.element.style.display = ""
	},
	createElement: function() {
		var q = document.createElement("div");
		q.className = "Dialog";
		var g = document.createElement("table");
		g.cellSpacing = "0px";
		g.cellPadding = "0px";
		g.className = "DialogTable";
		g.style.width = this.width;
		q.appendChild(g);
		var b = document.createElement("tbody");
		g.appendChild(b);
		var o;
		var m;
		m = document.createElement("tr");
		b.appendChild(m);
		o = document.createElement("td");
		o.className = "DialogTitle";
		m.appendChild(o);
		this.titleElement = o;
		o.innerHTML = this.title;
		o = document.createElement("td");
		o.className = "DialogTitleButtonBar";
		m.appendChild(o);
		this.cb = document.createElement("a");
		var a = document.createElement("img");
		a.className = "DialogCloseButtonImage";
		a.src = "/psp/images2/w_close.png";
		this.cb.appendChild(a);
		o.appendChild(this.cb);
		this.cb.onclick = this.close.bindAsEventListener(this);
		m = document.createElement("tr");
		b.appendChild(m);
		o = document.createElement("td");
		if (this.cssDialogContentCell != null) {
			o.className = this.cssDialogContentCell
		} else {
			o.className = "DialogContent"
		}
		o.colSpan = "2";
		m.appendChild(o);
		o.appendChild(this.content);
		this.element = q
	},
	centerDialog: function(q, a) {
		if (this.element == null) {
			this.createElement()
		}
		if (q == null) {
			q = this.element.offsetWidth
		}
		if (a == null) {
			a = this.element.offsetHeight
		}
		var o = this.getViewportHeight();
		var r = this.getViewportWidth();
		var m, b;
		if (self.pageYOffset) {
			m = self.pageXOffset;
			b = self.pageYOffset
		} else {
			if (document.documentElement && document.documentElement.scrollTop) {
				m = document.documentElement.scrollLeft;
				b = document.documentElement.scrollTop
			} else {
				if (document.body) {
					m = document.body.scrollLeft;
					b = document.body.scrollTop
				}
			}
		}
		var g = b + ((o - a) / 2);
		if (g < 0) {
			g = 0
		}
		if (this.element != null) {
			this.element.style.top = g + "px"
		}
		if (this.element != null) {
			this.element.style.left = (m + ((r - q) / 2)) + "px"
		}
	},
	getViewportHeight: function() {
		if (window.innerHeight != window.undefined) {
			return window.innerHeight
		}
		if (document.compatMode == "CSS1Compat") {
			return document.documentElement.clientHeight
		}
		if (document.body) {
			return document.body.clientHeight
		}
		return window.undefined
	},
	getViewportWidth: function() {
		if (window.innerWidth != window.undefined) {
			return window.innerWidth
		}
		if (document.compatMode == "CSS1Compat") {
			return document.documentElement.clientWidth
		}
		if (document.body) {
			return document.body.clientWidth
		}
		return window.undefined
	}
});
Af.Callout = Class.create({
	initialize: function(a) {
		var g = document.createElement("div");
		g.style.position = "absolute";
		g.style.width = "270px";
		g.innerHTML = a + '<div id="pop" ><div class="co-top-left"></div><div class="co-top-right"></div><div class="co-top-right-corner" id="top-right-corner"></div><div class="co-inside" id="co-inside"></div><div class="co-bottom-left"></div><div class="co-bottom-right"></div><div class="co-barrow2"></div></div>';
		this.element = g;
		g.style.zIndex = "6000001";
		this.visible = false;
		var b = new Af.ElementCollection(g);
		this.inside = b.getFirstElementById("co-inside");
		this.closeTrigger = b.getFirstElementById("top-right-corner");
		if (this.closeTrigger != null) {
			this.closeTrigger.onclick = this._hide.bind(this)
		}
		this.parent = null
	},
	show: function(a, o, g, b, m) {
		this.visible = true;
		this.element.style.display = "";
		this.element.style.position = "absolute";
		this.element.style.width = g + "px";
		b.appendChild(this.element);
		this.inside.innerHTML = m;
		this.element.style.left = (a - 50) + "px";
		this.element.style.top = (o - this.element.offsetHeight) + "px"
	},
	_hide: function() {
		this.hide();
		if (this.parent != null && this.parent.calloutClosed) {
			this.parent.calloutClosed(this)
		}
		return false
	},
	hide: function() {
		this.visible = false;
		this.element.style.display = "none"
	}
});
var _bubbleTable = new Object();
function registerBubble(r, g, b, o, m, a) {
	var q = new Af.Bubble(true);
	q.html = g;
	q.width = m;
	q.xoff = b;
	q.yoff = o;
	if (a == null) {
		a = "MainArea"
	}
	q.container = $(a);
	q.registerElement($(r));
	_bubbleTable[r] = q
}
var bubbles_locked = false;
function lockBubblesDisplay() {
	bubbles_locked = true;
	hideAllBubbles()
}
function unlockBubblesDisplay() {
	bubbles_locked = false
}
function hideAllBubbles() {
	for (var b in _bubbleTable) {
		var a = _bubbleTable[b];
		if (a == null) {
			continue
		}
		if (b.indexOf("__") == 0) {
			continue
		}
		if (typeof a == "function" || a instanceof Array) {
			continue
		}
		if (a.hide != null && typeof a.hide == "function" && a.visible) {
			a.hide()
		}
	}
}
Af.Bubble = Class.create({
	initialize: function() {
		var b = document.createElement("div");
		b.style.position = "absolute";
		b.style.width = "270px";
		b.innerHTML = '<div class="poppup_triangle-down"></div><div id="pop" ><div class="co-top-left"></div><div class="co-top-right"></div><div class="co-inside2" id="co-inside"></div><div class="co-bottom-left"></div><div class="co-bottom-right"></div></div>';
		this.element = b;
		b.style.zIndex = "6000001";
		this.visible = false;
		var a = new Af.ElementCollection(b);
		this.inside = a.getFirstElementById("co-inside")
	},
	show: function(a, o, g, b, m) {
		if (bubbles_locked) {
			return
		}
		this.visible = true;
		this.element.style.display = "";
		this.element.style.width = g + "px";
		b.appendChild(this.element);
		this.inside.innerHTML = m;
		this.element.style.left = (a + this.xoff) + "px";
		this.element.style.top = (o + this.yoff) + "px"
	},
	hide: function() {
		this.visible = false;
		this.element.style.display = "none"
	},
	registerElement: function(a) {
		this.targetE = a;
		a.onmouseover = this.doShow.bind(this);
		a.onmouseout = this.hide.bind(this)
	},
	doShow: function() {
		var a = toDocumentPosition(this.targetE);
		this.show(a.x, a.y, this.width, this.container, this.html)
	}
});
Af.Dialog2 = Class.create(Af.Dialog, {
	initialize: function(g, m, b, a) {
		this._initializeDialog2(g, m, b, a)
	},
	_initializeDialog2: function(g, o, b, a) {
		var m = $(g);
		this._initializeDialog(m, o, b);
		if (m != null) {
			m.style.display = "";
			this.width = m.style.width
		}
		this.trigger = a;
		this.aligned = "left"
	},
	show2: function(g) {
		var q = $(this.content);
		if (q != null) {
			q.style.display = "";
			if ((q.style.width != null) && (q.style.width !== "100%")) {
				var b = parseInt(q.style.width);
				if (!isNaN(b)) {
					this.width = (b + 24) + "px";
					q.style.width = "auto"
				}
			}
		}
		this.show(g);
		q = $(this.trigger);
		if (q != null) {
			var o = toDocumentPosition(q);
			var a = o.x;
			var r = o.y;
			var m = this.titleElement.getHeight();
			this.setLocation(this.element.offsetLeft + m, r - (this.content.getHeight() / 2) - (m / 2))
		}
	},
	close: function(a) {
		this.hide();
		if (this.handler != null) {
			this.handler.closeDialog(this)
		}
	}
});
var COLOR_PICKER_WIDTH = 327;
var COLOR_PICKER_HEIGHT = 212;
Af.ColorPicker = Class.create({
	initialize: function(a) {
		this._initializeDialog(a)
	},
	_initializeDialog: function(a) {
		this.alignment = "top";
		this.handler = a;
		this.titleElement = null;
		this.element = null;
		this.cb = null;
		this.visible = false;
		this.width = COLOR_PICKER_WIDTH + "px";
		this.height = (COLOR_PICKER_HEIGHT + 18) + "px";
		this.firstTime = true;
		this.div = null
	},
	close: function(a) {
		this.hide()
	},
	hide: function() {
		this.visible = false;
		if (this.component) {
			this.component.changeVisibility(false)
		}
		if (this.element != null) {
			this.element.style.display = "none"
		}
	},
	show: function(b, a, m) {
		this.visible = true;
		if (this.element == null) {
			this.createElement()
		}
		var g = $(b);
		g.appendChild(this.element);
		this.element.style.display = "";
		this.element.style.left = a + "px";
		this.element.style.top = (this.alignment == "top" ? (m - this.element.offsetHeight) : m) + "px"
	},
	createElement: function() {
		var g = document.createElement("table");
		g.cellSpacing = "0px";
		g.cellPadding = "0px";
		g.className = "ColorPicker";
		g.style.width = this.width;
		g.style.height = this.height;
		var b = document.createElement("tbody");
		g.appendChild(b);
		var o;
		var m;
		m = document.createElement("tr");
		b.appendChild(m);
		o = document.createElement("td");
		o.className = "ColorPickerTitle";
		o.innerHTML = "Color Selection";
		m.appendChild(o);
		this.titleElement = o;
		o = document.createElement("td");
		o.className = "ColorPickerTitleButtonBar";
		m.appendChild(o);
		this.cb = document.createElement("a");
		var a = document.createElement("img");
		a.className = "butn_close ColorPickerCloseButtonImage";
		a.src = "/psp/images2/w_close.png";
		this.cb.appendChild(a);
		o.appendChild(this.cb);
		this.cb.onclick = this.close.bindAsEventListener(this);
		m = document.createElement("tr");
		b.appendChild(m);
		o = document.createElement("td");
		o.colSpan = "2";
		o.style.cssText = "border:1px solid #d4d4d4;";
		m.appendChild(o);
		this.div = document.createElement("div");
		this.div.src = basePageURL + "color.html";
		this.div.width = "100%";
		this.div.height = COLOR_PICKER_HEIGHT;
		this.div.frameBorder = "0";
		o.appendChild(this.div);
		this.element = g;
		this.element.onclick = this.cellSelected.bindAsEventListener(this);
		this.loadMyComp()
	},
	loadMyComp: function() {
		var a = new Af.DataRequest(basePageURL + "color.html?buildId=" + (typeof buildId == "undefined" ? new Date().getTime() : buildId), this.requestCompletedMyComp.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		ajaxEngine.processRequest(a)
	},
	requestCompletedMyComp: function(a) {
		this.div.innerHTML = a.responseText;
		var b = $$(".closeColorPicker");
		if (b.length > 0) {
			b[b.length - 1].observe("click", this.close.bindAsEventListener(this))
		}
	},
	cellSelected: function(a) {
		var g = a.target ? a.target: a.srcElement;
		if (g.tagName == "TD" && (g.className == "colorcell" || g.className == "nonecolorcell") && this.handler != null) {
			var b = "" + g.attributes.getNamedItem("bgcolor").nodeValue;
			b = b.replace("#", "");
			this.handler.colorSelected(b)
		}
		return consumeEvent(a)
	},
	mouseDownOnElement: function(a) {
		return consumeEvent(a)
	}
});
function requestFailedCommon(a, b) {
	hideDialogWin();
	hideModalMessageDialog();
	showMessageDialog("Request failed, url: " + a.requestURL + " : - " + b, "Error", 500, 300)
}
function requestTimedoutCommon(a) {
	hideDialogWin();
	hideModalMessageDialog();
	showMessageDialog("Request timedout, url: " + a.requestURL, "Timeout", 500, 300)
}
Af.HTMLMenu = Class.create({
	initialize: function(u, g, x, r) {
		this.listener = u;
		this.level1NavElement = document.getElementById(g);
		this.level1Selected = null;
		if (this.level1NavElement == null) {
			return
		}
		var m = new Af.ElementCollection(this.level1NavElement);
		var q = m.getElements("a");
		for (var o = 0; o < q.length; o++) {
			var b = q[o];
			b.onclick = this.level1MenuSelected.bindAsEventListener(this);
			if (b.parentNode.className == "on") {
				this.level1Selected = b
			}
		}
		if (!x) {
			return
		}
		this.level2NavElement = document.getElementById(x);
		if (this.level2NavElement == null) {
			return
		}
		this.level2Selected = null;
		m = new Af.ElementCollection(this.level2NavElement);
		q = m.getElements("a");
		for (var o = 0; o < q.length; o++) {
			var b = q[o];
			b.onclick = this.level2MenuSelected.bindAsEventListener(this)
		}
		if (this.level1Selected != null) {
			this.selectLevel2(this.level1Selected)
		}
	},
	unselectLevel1: function() {
		if (this.level1Selected != null) {
			this.level1Selected.parentNode.className = "off";
			this.hideLevel2(this.level1Selected);
			this.level1Selected = null
		}
	},
	level1MenuSelected: function(a) {
		var b = a.target ? a.target: a.srcElement;
		if (b == this.level1Selected) {
			return
		}
		if (this.level1Selected != null) {
			this.level1Selected.parentNode.className = "off";
			this.hideLevel2(this.level1Selected)
		}
		this.level1Selected = b;
		this.level1Selected.parentNode.className = "on";
		this.selectLevel2(this.level1Selected);
		return this.listener.menuSelected(this.level1Selected, this.level2Selected)
	},
	level2MenuSelected: function(a) {
		var b = a.target ? a.target: a.srcElement;
		if (b == this.level2Selected) {
			return
		}
		if (this.level2Selected != null) {
			this.level2Selected.parentNode.className = "unselected"
		}
		this.level2Selected = b;
		this.level2Selected.parentNode.className = "selected";
		return this.listener.menuSelected(this.level1Selected, this.level2Selected)
	},
	hideLevel2: function(b) {
		if (this.level2NavElement == null) {
			return
		}
		this.level2Selected = null;
		ec = new Af.ElementCollection(this.level2NavElement);
		var a = ec.getFirstElementById(b.id + "_");
		if (a != null) {
			a.style.display = "none"
		}
	},
	selectLevel2: function(q) {
		if (this.level2NavElement == null) {
			return
		}
		this.level2Selected = null;
		ec = new Af.ElementCollection(this.level2NavElement);
		var o = ec.getFirstElementById(q.id + "_");
		if (o == null) {
			return
		}
		o.style.display = "block";
		ec = new Af.ElementCollection(o);
		var m = ec.getElements("a");
		for (var g = 0; g < m.length; g++) {
			var b = m[g];
			if (b.parentNode.className == "selected") {
				this.level2Selected = b;
				break
			}
		}
	}
});
Af.ElementCollection = Class.create({
	initialize: function(a) {
		this.top = a;
		this.list = new Array();
		this.list.push(this.top);
		this.buildList(this.top)
	},
	buildList: function(g) {
		var b = g.childNodes;
		for (var a = 0; a < b.length; a++) {
			this.list.push(b[a]);
			this.buildList(b[a])
		}
	},
	getIterator: function() {
		return new Af.ElementIterator(this.list)
	},
	getElements: function(g) {
		g = g.toLowerCase();
		var a = new Array();
		var b = this.getIterator();
		while (b.hasNext()) {
			var m = b.next();
			if (m.tagName && m.tagName.toLowerCase() == g) {
				a.push(m)
			}
		}
		return a
	},
	getElementsIndexedById: function(g) {
		g = g.toLowerCase();
		var a = new Object();
		var b = this.getIterator();
		while (b.hasNext()) {
			var m = b.next();
			if (m.tagName && m.tagName.toLowerCase() == g) {
				a[m.id] = m
			}
		}
		return a
	},
	getFirstElement: function(b) {
		b = b.toLowerCase();
		var a = this.getIterator();
		while (a.hasNext()) {
			var g = a.next();
			if (g.tagName && g.tagName.toLowerCase() == b) {
				return g
			}
		}
		return null
	},
	$: function(g) {
		var a = this.getIterator();
		while (a.hasNext()) {
			var b = a.next();
			if (b.id == g) {
				return b
			}
		}
		return null
	},
	getFirstElementById: function(a) {
		return this.$(a)
	},
	getElementsByClass: function(g) {
		g = g.toLowerCase();
		var a = new Array();
		var b = this.getIterator();
		while (b.hasNext()) {
			var m = b.next();
			if (m.className && m.className.toLowerCase() == g) {
				a.push(m)
			}
		}
		return a
	}
});
Af.ElementIterator = Class.create({
	initialize: function(a) {
		this.list = a;
		this.currentIndex = 0
	},
	hasNext: function() {
		return this.currentIndex < this.list.length
	},
	next: function() {
		if (this.hasNext()) {
			return this.list[this.currentIndex++]
		}
		return null
	}
});
Af.ShortStatus = Class.create({
	initialize: function(a) {
		this.element = a
	},
	show: function(a) {
		this.element.innerHTML = a
	},
	clear: function() {
		this.element.innerHTML = ""
	}
});
var shortStatus = null;
function setSelectionRange(m, b, g) {
	if (m.setSelectionRange) {
		grabFocus(m);
		m.setSelectionRange(b, g)
	} else {
		if (m.createTextRange) {
			var a = m.createTextRange();
			a.collapse(true);
			a.moveEnd("character", g);
			a.moveStart("character", b);
			a.select()
		}
	}
}
function setCaretToEnd(a) {
	setSelectionRange(a, a.value.length, a.value.length)
}
function setCaretToBegin(a) {
	setSelectionRange(a, 0, 0)
}
function setCaretToPos(a, b) {
	setSelectionRange(a, b, b)
}
function toHTMLRoot(g) {
	var b = "";
	for (var a = 0; a < g.childNodes.length; a++) {
		b += toHTML(g.childNodes[a])
	}
	return b
}
function toHTML(u) {
	var r = "";
	if (u.nodeName == "#text") {
		return r
	}
	var x = u.nodeName;
	x = x.toLowerCase();
	if (u.nodeName == "text") {
		if (u.childNodes.length > 0) {
			r += u.childNodes[0].data
		}
	} else {
		r += "<" + u.nodeName;
		var m = u.attributes;
		if (m != null) {
			for (var q = 0; q < m.length; q++) {
				var g = m.item(q);
				r += " " + g.nodeName + '="' + g.nodeValue + '"'
			}
		}
		r += ">";
		var b = u.childNodes.length;
		for (var q = 0; q < b; q++) {
			if (x == "p" && q == (b - 1)) {
				var o = u.childNodes[q].nodeName;
				o = o.toLowerCase();
				if (o == "br") {
					continue
				}
			}
			r += toHTML(u.childNodes[q])
		}
		r += "</" + u.nodeName + ">"
	}
	return r
}
function normalizeRTF_DOM(r) {
	var b = new Array();
	var g = new Array();
	for (var o = 0; o < r.childNodes.length; o++) {
		var q = r.childNodes[o];
		if (q.tagName == "BR") {
			b.push(g);
			g = new Array()
		} else {
			g.push(q)
		}
	}
	if (b.length > 0) {
		if (g.length > 0) {
			b.push(g)
		}
	}
	if (b.length > 1) {
		removeAll(r);
		for (var o = 0; o < b.length; o++) {
			g = b[o];
			var q = document.createElement("p");
			if (g.length > 0) {
				for (var m = 0; m < g.length; m++) {
					q.appendChild(g[m])
				}
			} else {
				q.innerHTML = "&nbsp;"
			}
			r.appendChild(q)
		}
	}
}
var NO_ARROW = 0;
var ARROW_END_A = 1;
var ARROW_END_B = 2;
Af.Canvas = function() {};
Af.dw_name_seq = (new Date()).getTime();
Af.Canvas = Class.create({
	initCanvas: function(a, b) {
		this.element = $(b);
		this.element.style.position = "absolute";
		this.viewPortX1 = 0;
		this.viewPortY1 = 0;
		this.viewPortX2 = 0;
		this.viewPortY2 = 0;
		if (a != null) {
			this.scroller = document.getElementById(a);
			if (this.scroller.onscroll == null) {}
		}
		this.viewPortW = this.viewPortX2 - this.viewPortX1;
		this.viewPortH = this.viewPortY2 - this.viewPortY1;
		this.eventXOffset = 0;
		this.eventYOffset = 0;
		this.gobjects = new Array();
		this.resetCanvasPosition()
	},
	clear: function() {
		removeAll(this.element)
	},
	resetCanvasPosition: function() {
		var a = toDocumentPosition(this.element);
		this.scroller.style.width = this.element.offsetWidth + "px";
		this.scroller.style.height = this.element.offsetHeight + "px";
		this.offsetLeft = 0;
		this.offsetTop = 0;
		this.eventXOffset = this.element.offsetLeft;
		this.eventYOffset = this.element.offsetTop
	},
	resetViewPort: function() {
		if (this.scroller != null) {
			try {} catch(a) {}
		}
	},
	updateScroll: function() {
		this.resetCanvasPosition()
	},
	handleScroll: function() {
		this.updateScroll();
		this.paint2()
	},
	paint2: function() {
		this.clear();
		this.paint();
		for (var a = 0; a < this.gobjects.length; a++) {
			if (!this.isFullyClipped(this.gobjects[a])) {
				this.gobjects[a].paint()
			}
		}
	},
	clearAll: function() {
		removeAll(this.element);
		for (var a = 0; a < this.gobjects.length; a++) {
			this.gobjects[a].clearAll()
		}
		this.clear();
		this.gobjects.length = 0
	},
	add: function(a) {
		this.gobjects.push(a)
	},
	remove: function(g) {
		var a = new Array();
		for (var b = 0; b < this.gobjects.length; b++) {
			if (this.gobjects[b] != g) {
				a.push(this.gobjects[b])
			}
		}
		this.gobjects.length = 0;
		for (b = 0; b < a.length; b++) {
			this.gobjects.push(a[b])
		}
	},
	isFullyClipped: function(b) {
		var a = b.getBound();
		if (a.x > this.viewPortX2 || (a.x + a.w < this.viewPortX1) || a.y > this.viewPortY2 || (a.y + a.h < this.viewPortY1)) {
			return true
		}
		return false
	},
	isPartiallyClipped: function(b) {
		var a = b.getBound();
		if ((a.x + a.w > this.viewPortX2) || (a.x < this.viewPortX1) || (a.y + a.h > this.viewPortY2) || (a.y < this.viewPortY1)) {
			return true
		}
		return false
	},
	setClip: function(b, q, g) {
		if (q == null || this.scroller == null) {
			return
		}
		var a = this.element.offsetWidth;
		var m = this.element.offsetHeight;
		if (this.scroller.clientWidth < a) {
			a = this.scroller.clientWidth
		}
		if (this.scroller.clientHeight < m) {
			m = this.scroller.clientHeight
		}
		var o = new Af.Rectangle(this.scroller.scrollLeft, this.scroller.scrollTop, a, m);
		o = o.intersection(b);
		o.x -= b.x;
		o.y -= b.y;
		q.style.clip = "rect(" + (o.y - g) + "px " + (o.x + o.w - g) + "px " + (o.y + o.h - g) + "px " + (o.x - g) + "px )"
	}
});
Af.Rectangle = Class.create({
	initialize: function(a, m, b, g) {
		this.x = a;
		this.y = m;
		this.w = b;
		this.h = g
	},
	intersects: function(a) {
		var x = this.w;
		var m = this.h;
		var o = a.w;
		var y = a.h;
		if (o <= 0 || y <= 0 || x <= 0 || m <= 0) {
			return false
		}
		var u = this.x;
		var q = this.y;
		var g = a.x;
		var b = a.y;
		o += g;
		y += b;
		x += u;
		m += q;
		return ((o < g || o > u) && (y < b || y > q) && (x < u || x > g) && (m < q || m > b))
	},
	completelyIntersects: function(a) {
		var x = this.w;
		var m = this.h;
		var o = a.w;
		var y = a.h;
		if (o <= 0 || y <= 0 || x <= 0 || m <= 0) {
			return false
		}
		var u = this.x;
		var q = this.y;
		var g = a.x;
		var b = a.y;
		o += g;
		y += b;
		x += u;
		m += q;
		return ((o < g || o > u) && (y < b || y > q) && (x < u || x > g) && (m < q || m > b))
	},
	contains: function(a, g) {
		var b = a >= this.x && a <= (this.x + this.w) && g >= this.y && g <= (this.y + this.h);
		return b
	},
	intersection: function(a) {
		var g = this.x;
		var y = this.y;
		var u = a.x;
		var o = a.y;
		var b = g;
		b += this.w;
		var x = y;
		x += this.h;
		var q = u;
		q += a.w;
		var m = o;
		m += a.h;
		if (g < u) {
			g = u
		}
		if (y < o) {
			y = o
		}
		if (b > q) {
			b = q
		}
		if (x > m) {
			x = m
		}
		b -= g;
		x -= y;
		return new Af.Rectangle(g, y, b, x)
	},
	containsObject: function(b) {
		var a = b.getBound();
		if (this.contains(a.x, a.y) && this.contains(a.x + a.w, a.y + a.h)) {
			return true
		}
		return false
	},
	subtract: function(a) {
		return new Af.Rectangle(this.x - a.x, this.y - a.y, this.w - a.w, this.h - a.h)
	},
	add: function(a) {
		return new Af.Rectangle(this.x + a.x, this.y + a.y, this.w + a.w, this.h + a.h)
	},
	print: function() {
		debugA("rectangle - " + this.x + ", " + this.y + ", " + this.w + ", " + this.h)
	},
	union: function(m) {
		var a = this.x < m.x ? this.x: m.x;
		var o = this.y < m.y ? this.y: m.y;
		var b = (this.x + this.w) > (m.x + m.w) ? (this.x + this.w) : (m.x + m.w);
		var g = (this.y + this.h) > (m.y + m.h) ? (this.y + this.h) : (m.y + m.h);
		return new Af.Rectangle(a, o, b - a, g - o)
	}
});
Af.DrawingObject = Class.create({
	initialize: function() {},
	SelectionColor: "0000ff",
	selectionExtent: "1",
	SelectionBorderStyle: "solid",
	_initializeDrawingObject: function(b, a) {
		if (a == null) {
			a = Af.dw_name_seq;
			Af.dw_name_seq = Af.dw_name_seq + 1
		}
		this.uid = b;
		this.name = a;
		this.__parent = null;
		this.canvas = null;
		this.open = true;
		this.children = new Array();
		this.spacingTop = 0;
		this.spacingBottom = 0;
		this.spacingLeft = 0;
		this.spacingRight = 0;
		this.paddingTop = 0;
		this.paddingBottom = 0;
		this.paddingLeft = 0;
		this.paddingRight = 0;
		this.selected = false;
		this.deleteable = true;
		this.moveable = true;
		this.resizable = true;
		this.selectable = true;
		this.editable = true;
		this.printable = true;
		this.alternateNode = null;
		this.showingAnchors = false;
		this.resizeTool = "se";
		this.moveTool = "nw";
		this.level = 1;
		this.borderWidth = 0;
		this.oBorderWidth = 0;
		this.borderStyle = "solid";
		this.borderColor = "000000";
		this.backgroundColor = null;
		this.fontFamily = "Verdana";
		this.fontSize = "10px";
		this.oFontSize = "10px";
		this.color = "000000";
		this.selectionExtent = 0;
		this.printable = true;
		this.className = null;
		this.tags = new Array();
		this.rotationAngle = 0
	},
	addTag: function(a, b) {
		this.removeTag(a);
		var g = new Object();
		g.name = a;
		g.value = b;
		this.tags.push(g)
	},
	removeTag: function(a) {
		for (var g = 0; g < this.tags.length; g++) {
			var b = this.tags[g];
			if (b.name == a) {
				this.tags = removeFromArray(this.tags, b);
				break
			}
		}
	},
	clearTags: function() {
		this.tags = new Array()
	},
	initialSetup: function(a) {
		this.ox = parseFloat(this.x) / a;
		this.oy = parseFloat(this.y) / a;
		this.ow = parseFloat(this.w) / a;
		this.oh = parseFloat(this.h) / a;
		this.setFontSize(this.oFontSize)
	},
	Af_DrawingObject_XML: function(o, b, q) {
		var a = o + "\t";
		s = o + '<dw class="DrawingObject">\n';
		s += "<underline>" + this.isUnderline() + "</underline>";
		if (this.customText) {
			s += "<customText>" + this.customText + "</customText>"
		}
		if (this.name) {
			s += a + "<name>" + this.name + "</name>\n"
		}
		if (this.displayName) {
			s += a + "<displayName><![CDATA[" + this.displayName + "]]></displayName>\n"
		}
		if (this.locked) {
			s += a + "<locked>" + this.locked + "</locked>\n"
		}
		if (this.uid) {
			s += a + "<UUID>" + this.uid + "</UUID>\n"
		}
		if (this.type) {
			s += a + "<type>" + this.type + "</type>\n"
		}
		if (this.ox != null) {
			s += a + "<x>" + (this.ox - b) + "</x>\n"
		}
		if (this.oy != null) {
			s += a + "<y>" + (this.oy - q) + "</y>\n"
		}
		if (this.ow != null) {
			s += a + "<w>" + this.ow + "</w>\n"
		}
		if (this.oh != null) {
			s += a + "<h>" + this.oh + "</h>\n"
		}
		if (this.color) {
			s += a + "<color>" + this.color + "</color>\n"
		}
		if (this.ts) {
			s += a + "<ts>" + this.ts + "</ts>\n"
		}
		if (this.oBorderWidth != 0) {
			s += a + "<borderWidth>" + this.oBorderWidth + "</borderWidth>\n"
		}
		if (this.borderColor && this.borderColor != "000000") {
			s += a + "<borderColor>" + this.borderColor + "</borderColor>\n"
		}
		if (this.borderStyle && this.borderStyle != "solid") {
			s += a + "<borderStyle>" + this.borderStyle + "</borderStyle>\n"
		}
		if (this.textElement) {
			s += a + "<description>" + this.textElement.value + "</description>\n"
		}
		if (this.backgroundColor) {
			s += a + "<backgroundColor>" + this.backgroundColor + "</backgroundColor>\n"
		}
		if (this.fontFamily) {
			s += a + "<fontFamily>" + this.fontFamily + "</fontFamily>\n"
		}
		if (this.oFontSize) {
			s += a + "<fontSize>" + this.oFontSize + "</fontSize>\n"
		}
		if (this.fontWeight) {
			s += a + "<fontWeight>" + this.fontWeight + "</fontWeight>\n"
		}
		if (this.fontStyle) {
			s += a + "<fontStyle>" + this.fontStyle + "</fontStyle>\n"
		}
		if (this.textDecoration) {
			s += a + "<textDecoration>" + this.textDecoration + "</textDecoration>\n"
		}
		if (this.textAlign) {
			s += a + "<textAlign>" + this.textAlign + "</textAlign>\n"
		}
		if (this.level) {
			s += a + "<level>" + this.level + "</level>\n"
		}
		if (!this.deleteable) {
			s += a + "<deleteable>false</deleteable>\n"
		}
		if (!this.moveable) {
			s += a + "<moveable>false</moveable>\n"
		}
		if (!this.resizable) {
			s += a + "<resizable>false</resizable>\n"
		}
		if (!this.selectable) {
			s += a + "<selectable>false</selectable>\n"
		}
		if (!this.editable) {
			s += a + "<editable>false</editable>\n"
		}
		if (!this.printable) {
			s += a + "<printable>false</printable>\n"
		}
		if (this.subType) {
			s += a + "<subType>" + this.subType + "</subType>\n"
		}
		if (this.enforceSafety) {
			s += a + "<enforceSafety>" + this.enforceSafety + "</enforceSafety>\n"
		}
		if (this.calloutText) {
			s += a + "<calloutText>" + this.calloutText + "</calloutText>\n"
		}
		if (this.outputOverlay) {
			s += a + "<outputOverlay>" + this.outputOverlay + "</outputOverlay>\n"
		}
		if (this.isReplaced) {
			s += a + "<isReplaced>" + this.isReplaced + "</isReplaced>\n"
		}
		if (this["rotationAngle"]) {
			s += a + "<rotationAngle>" + this["rotationAngle"] + "</rotationAngle>\n"
		}
		for (var m = 0; m < this.tags.length; m++) {
			var g = this.tags[m];
			s += a + "<" + g.name + ">" + htmlEncode(g.value) + "</" + g.name + ">\n"
		}
		return s
	},
	clearAll: function() {},
	toXml: function(g, a, m) {
		var b = this.Af_DrawingObject_XML(g, a, m);
		b += g + "</dw>\n";
		return b
	},
	setTextColor: function(a) {
		if (a == "transparent" || a == null) {
			this.color = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.color = a;
			a = "#" + a
		}
		if (this.element != null) {
			this.element.style.color = a
		}
	},
	setBackgroundColor: function(a) {
		if (a == "transparent" || a == null) {
			this.backgroundColor = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.backgroundColor = a;
			a = "#" + a
		}
		if (this.element != null) {
			this.element.style.backgroundColor = a
		}
	},
	add: function(a) {
		a.__parent = this;
		a.__index = this.children.length;
		this.children.push(a);
		if (this.canvas != null) {
			a._setCanvas(this.canvas)
		}
	},
	remove: function(m) {
		var a = new Array();
		var b = 0;
		for (var g = 0; g < this.children.length; g++) {
			if (this.children[g] != m) {
				a.push(this.children[g])
			}
		}
		this.children.length = 0;
		for (g = 0; g < a.length; g++) {
			a[g].__index = g;
			this.children.push(a[g])
		}
	},
	dispose: function() {
		for (var a = 0; a < this.children.length; a++) {
			this.children[a].dispose()
		}
	},
	disposeLinks: function() {
		this.links.length = 0
	},
	insert: function(a, o) {
		o.__parent = this;
		var b = new Array(this.children.length + 1);
		var g = 0;
		for (var m = 0; m < this.children.length + 1; m++) {
			if (m != a) {
				b[m] = this.children[g];
				g++
			} else {
				b[m] = o
			}
		}
		this.children.length = 0;
		for (m = 0; m < b.length; m++) {
			b[m].__index = m;
			this.children.push(b[m])
		}
		if (this.canvas != null) {
			o._setCanvas(this.canvas)
		}
	},
	insertAfter: function(o, a) {
		a.__parent = this;
		var b = new Array(this.children.length + 1);
		var g = 0;
		for (var m = 0; m < this.children.length; m++) {
			b[g] = this.children[m];
			g++;
			if (this.children[m] == o) {
				b[g] = a;
				g++
			}
		}
		this.children.length = 0;
		for (m = 0; m < b.length; m++) {
			b[m].__index = m;
			this.children.push(b[m])
		}
		if (this.canvas != null) {
			a._setCanvas(this.canvas)
		}
	},
	_setCanvas: function(a) {
		this.canvas = a;
		for (var b = 0; b < this.children.length; b++) {
			var g = this.children[b];
			g._setCanvas(a)
		}
	},
	getBound: function() {
		return new Af.Rectangle(this.x - this.spacingLeft - this.borderWidth, this.y - this.spacingTop - this.borderWidth, this.w + this.spacingLeft + this.spacingRight + this.borderWidth * 2, this.h + this.spacingTop + this.spacingBottom + this.borderWidth * 2)
	},
	paint: function() {
		this.paintElements(this.canvas);
		this.paintChildren()
	},
	paintChildren: function() {
		if (this.open) {
			for (var a = 0; a < this.children.length; a++) {
				var b = this.children[a];
				if (!this.canvas.isFullyClipped(b)) {
					b.clip();
					b.paint()
				}
			}
		}
	},
	paintElements: function() {},
	getObjectByXY: function(a, q) {
		var g = this.getBound();
		if (g.contains(a, q)) {
			for (var b = 0; b < this.children.length; b++) {
				var o = this.children[b];
				var m = o.getObjByXY(a, q);
				if (m != null) {
					return m
				}
			}
			return this
		}
		return null
	},
	zoom: function(b) {
		this.x = Math.round(this.ox * b);
		this.y = Math.round(this.oy * b);
		this.w = Math.round(this.ow * b) + this.selectionExtent;
		this.h = Math.round(this.oh * b) + this.selectionExtent;
		this.setFontSize(this.oFontSize, true);
		this.borderWidth = Math.round(this.oBorderWidth * b);
		this.resizeElements();
		for (var a = 0; a < this.children.length; a++) {
			var g = this.children[a];
			g.zoom(b)
		}
	},
	getImageElement: function(b) {
		var a = document.createElement("img");
		a.src = b;
		a.hspace = 0;
		a.vspace = 0;
		a.style.position = "absolute";
		a.style.cursor = "hand";
		return a
	},
	select: function() {
		this.selected = true;
		if (this.element != null) {
			this.element.style.borderColor = "#" + this.SelectionColor
		}
		this.postSelect()
	},
	unselect: function() {
		this.selected = false;
		if (this.element != null) {
			this.element.style.borderColor = "#" + this.borderColor
		}
		this.postUnSelect()
	},
	postSelect: function() {
		if (this.element) {
			try {
				this.element.focus()
			} catch(a) {}
		}
	},
	postUnSelect: function() {},
	createBox: function() {
		var a = this.borderWidth * 2;
		var b = document.createElement("div");
		b.style.position = "absolute";
		b.style.fontSize = this.fontSize;
		b.style.fontFamily = this.fontFamily;
		b.style.left = this.x + "px";
		b.style.top = this.y + "px";
		b.style.paddingTop = this.paddingTop + "px";
		b.style.paddingBottom = this.paddingBottom + "px";
		b.style.paddingLeft = this.paddingLeft + "px";
		b.style.paddingRight = this.paddingRight + "px";
		b.style.border = "solid " + this.borderWidth + "px #" + this.color;
		b.style.textAlign = "center";
		b.style.verticalAlign = "middle";
		b.style.overflow = "visible";
		b.innerHTML = this.description;
		this.h = b.offsetHeight + this.paddingTop + this.paddingBottom + a;
		b.style.width = (this.w - this.paddingLeft - this.paddingRight - a) + "px";
		return b
	},
	clip: function() {
		if (this.element == null) {
			return
		}
		this.canvas.setClip(this.getBound(), this.element, this.type == "image" ? this.borderWidth: 0)
	},
	repaint: function() {
		if (this.element == null) {
			return
		}
		this.element.parentNode.removeChild(this.element);
		this.clip();
		this.paint()
	},
	supportsResizeDir: function(a) {
		return true
	},
	isBold: function() {
		var a = false;
		if (this.element != null) {
			if (this.element.style.fontWeight == "bold") {
				a = true
			}
		}
		return a
	},
	toggleBold: function() {
		if (this.element != null) {
			this.autoSize();
			var a = null;
			if (this.element.style.fontWeight == "bold") {
				a = "normal"
			} else {
				a = "bold"
			}
			this.fontWeight = a;
			this.setElementsStyle("fontWeight", a);
			this.resetAutoSize()
		}
	},
	isItalic: function() {
		var a = false;
		if (this.element != null) {
			if (this.element.style.fontStyle == "italic") {
				a = true
			}
		}
		return a
	},
	toggleItalic: function() {
		if (this.element != null) {
			this.autoSize();
			var a = null;
			if (this.element.style.fontStyle == "italic") {
				a = "normal"
			} else {
				a = "italic"
			}
			this.fontStyle = a;
			this.setElementsStyle("fontStyle", a);
			this.resetAutoSize()
		}
	},
	isUnderline: function() {
		var a = (this.textDecoration == "underline");
		return a
	},
	toggleUnderline: function() {
		if (this.element != null) {
			this.autoSize();
			var a = null;
			if (this.isUnderline()) {
				a = "none"
			} else {
				a = "underline"
			}
			this.textDecoration = a;
			this.setElementsStyle("textDecoration", a);
			this.resetAutoSize()
		}
	},
	setTextAlign: function(b) {
		if (b == null) {
			return
		}
		if (b.toLowerCase() == "justified") {
			b = "justify"
		}
		this.textAlign = b;
		if (this.element != null && (this.type == "text" || this.type == "textarea")) {
			this.autoSize();
			try {
				this.setElementsStyle("textAlign", b)
			} catch(a) {}
			this.resetAutoSize()
		}
	},
	getTextAlign: function() {
		if (this.element != null) {
			return this.element.style.textAlign
		}
		return null
	},
	autoSize: function() {},
	updateHtmlFromElement: function() {},
	resetAutoSize: function() {},
	setElementsStyle: function(a, b) {
		this.element.style[a] = b + " !important"
	},
	setFontFamily: function(a) {
		this.fontFamily = a;
		if (this.element != null) {
			this.element.style.fontFamily = a
		}
	},
	setFontSize: function(a) {
		this.oFontSize = a;
		this.fontSize = parseInt(this.canvas.zoomFactor * parseFloat(this.oFontSize));
		if (this.fontSize == 0) {
			this.fontSize = 1
		}
		this.fontSize += "px";
		if (this.element != null) {
			this.element.style.fontSize = this.fontSize
		}
	},
	applyFontProperties: function() {
		if (this.element != null) {
			if (this.textDecoration != null) {
				this.setElementsStyle("textDecoration", this.textDecoration)
			}
			if (this.fontFamily != null) {
				this.setElementsStyle("fontFamily", this.fontFamily)
			}
			if (this.fontWeight != null) {
				this.setElementsStyle("fontWeight", this.fontWeight)
			}
			if (this.fontStyle != null) {
				this.setElementsStyle("fontStyle", this.fontStyle)
			}
			if (this.textAlign != null) {
				this.setElementsStyle("textAlign", this.textAlign)
			}
			if (this.fontSize != null) {
				this.setElementsStyle("fontSize", this.fontSize)
			}
		}
	},
	setLineColor: function(a) {
		if (a == "transparent" || a == null) {
			this.borderColor = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.borderColor = a;
			a = "#" + a
		}
		if (this.element != null) {
			this.element.style.borderColor = a
		}
	},
	setLineWidth: function(a) {
		this.oBorderWidth = a;
		this.borderWidth = a * this.canvas.zoomFactor;
		if (a >= 1 && this.borderWidth < 1) {
			this.borderWidth = 1
		}
		if (this.element != null) {
			this.element.style.borderWidth = this.borderWidth + "px"
		}
	},
	setLineStyle: function(a) {
		this.borderStyle = a;
		if (this.element != null) {
			this.element.style.borderStyle = a
		}
	}
});
Af.Line = Class.create(Af.DrawingObject, {
	initialize: function(m, q, g, o, b, a) {
		this.x1 = m;
		this.y1 = q;
		this.x2 = g;
		this.y2 = o;
		this.color = a;
		this.borderWidth = b
	},
	paint: function() {
		canvas.drawLine(this.x1 - this.canvas.viewPortX1 + this.canvas.offsetLeft, this.y1 - this.canvas.viewPortY1 + this.canvas.offsetTop, this.x2 - this.canvas.viewPortX1 + this.canvas.offsetLeft, this.y2 - this.canvas.viewPortY1 + this.canvas.offsetTop)
	},
	getBound: function() {
		return new Af.Rectangle(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1)
	}
});
Af.TextBox = Class.create(Af.DrawingObject, {
	initialize: function(a, r, b, o, q, m, g) {
		this.x = a;
		this.y = r;
		this.w = b;
		this.h = o;
		this.description = q;
		this.color = g;
		if (!this.color) {
			this.color = "#000000"
		}
		this.borderWidth = m;
		if (!this.borderWidth) {
			this.borderWidth = 1
		}
		this.createElement()
	},
	createElement: function() {
		var a = this.borderWidth * 2;
		var b = document.createElement("div");
		b.style.position = "absolute";
		b.style.left = this.x + "px";
		b.style.top = this.y + "px";
		b.style.width = (this.w - a) + "px";
		b.style.height = (this.h - a) + "px";
		b.style.border = "solid " + this.borderWidth + "px #" + this.color;
		b.style.padding = "0px";
		b.style.textAlign = "center";
		b.style.verticalAlign = "middle";
		if (is_ns) {
			b.style.overflow = "hidden"
		}
		b.innerHTML = this.description;
		this.element = b
	},
	paint: function() {
		this.element.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
		this.element.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
		this.canvas.element.appendChild(this.element)
	}
});
Af.HLine = Class.create(Af.DrawingObject, {
	initialize: function(m, o, g, b, a) {
		this.x1 = m;
		this.y1 = o;
		this.x2 = g;
		this.w = g - m;
		this.arrow = NO_ARROW;
		this.arrowImage = null;
		this.color = b;
		if (!this.color) {
			this.color = "000000"
		}
		this.borderWidth = a;
		if (!this.borderWidth) {
			this.borderWidth = 1
		}
		this.createElement()
	},
	setArrowType: function(b) {
		if (this.arrow == b) {
			return
		}
		this.arrow = b;
		if (b == NO_ARROW) {
			this.arrowImage = null
		} else {
			var g;
			if (b == ARROW_END_A) {
				g = "/psp/images/left.gif"
			} else {
				g = "/psp/images/right.gif"
			}
			this.arrowImage = document.createElement("img");
			this.arrowImage.src = g;
			this.arrowImage.width = "12";
			this.arrowImage.height = "12";
			this.arrowImage.style.position = "absolute"
		}
	},
	createElement: function() {
		var a = document.createElement("div");
		a.style.position = "absolute";
		a.style.zIndex = "100";
		a.style.left = this.x1 + "px";
		a.style.top = this.y1 + "px";
		a.style.width = (this.x2 - this.x1) + "px";
		a.style.height = (this.borderWidth) + "px";
		a.style.padding = "0px";
		a.style.backgroundColor = "#" + this.color;
		if (is_ns) {
			a.style.overflow = "hidden"
		}
		this.element = a
	},
	updateSize: function() {
		this.w = this.x2 - this.x1;
		this.element.style.width = (this.x2 - this.x1) + "px";
		this.clip()
	},
	paint: function() {
		var a = this.x1 - this.canvas.viewPortX1 + this.canvas.offsetLeft;
		var b = this.y1 - this.canvas.viewPortY1 + this.canvas.offsetTop;
		this.element.style.left = a + "px";
		this.element.style.top = b + "px";
		if (this.arrowImage != null) {
			if (this.arrow == ARROW_END_A) {
				this.arrowImage.style.left = a - 4 + "px";
				this.arrowImage.style.top = (b - 6) + "px"
			} else {
				this.arrowImage.style.left = (a + this.w - 8) + "px";
				this.arrowImage.style.top = (b - 6) + "px"
			}
			this.canvas.element.appendChild(this.arrowImage)
		}
		this.canvas.element.appendChild(this.element)
	},
	getBound: function() {
		return new Af.Rectangle(this.x1, this.y1, this.x2 - this.x1, this.borderWidth)
	},
	clip: function() {
		if (this.element == null) {
			return
		}
		this.canvas.setClip(this.getBound(), this.element, 0);
		if (this.arrowImage != null) {
			var a;
			var g;
			if (this.arrow == ARROW_END_A) {
				a = this.x1 - 4;
				g = this.y1 - 6
			} else {
				a = this.x1 + this.w - 8;
				g = this.y1 - 6
			}
			var b = new Af.Rectangle(a, g, 12, 12);
			this.canvas.setClip(b, this.arrowImage, 0)
		}
	}
});
Af.VLine = Class.create(Af.DrawingObject, {
	initialize: function(g, o, m, b, a) {
		this.x1 = g;
		this.y1 = o;
		this.y2 = m;
		this.h = m - o;
		this.arrow = NO_ARROW;
		this.color = b;
		this.arrowImage = null;
		if (!this.color) {
			this.color = "000000"
		}
		this.borderWidth = a;
		if (!this.borderWidth) {
			this.borderWidth = 1
		}
		this.createElement()
	},
	setArrowType: function(b) {
		if (this.arrow == b) {
			return
		}
		this.arrow = b;
		if (b == NO_ARROW) {
			this.arrowImage = null
		} else {
			var g;
			if (b == ARROW_END_A) {
				g = "/psp/images/up.gif"
			} else {
				g = "/psp/images/down.gif"
			}
			this.arrowImage = document.createElement("img");
			this.arrowImage.src = g;
			this.arrowImage.width = "12";
			this.arrowImage.height = "12";
			this.arrowImage.style.position = "absolute"
		}
	},
	createElement: function() {
		var a = document.createElement("div");
		a.style.zIndex = "100";
		a.style.position = "absolute";
		a.style.left = this.x1 + "px";
		a.style.top = this.y1 + "px";
		a.style.width = (this.borderWidth) + "px";
		a.style.height = (this.y2 - this.y1) + "px";
		a.style.padding = "0px";
		a.style.backgroundColor = "#" + this.color;
		if (is_ns) {
			a.style.overflow = "hidden"
		}
		this.element = a
	},
	updateSize: function() {
		this.h = this.y2 - this.y1;
		this.element.style.height = (this.y2 - this.y1) + "px";
		this.clip()
	},
	paint: function() {
		var a = this.x1 - this.canvas.viewPortX1 + this.canvas.offsetLeft;
		var b = this.y1 - this.canvas.viewPortY1 + this.canvas.offsetTop;
		this.element.style.left = a + "px";
		this.element.style.top = b + "px";
		if (this.arrowImage != null) {
			if (this.arrow == ARROW_END_A) {
				this.arrowImage.style.left = (a - 6) + "px";
				this.arrowImage.style.top = b + "px"
			} else {
				this.arrowImage.style.left = (a - 6) + "px";
				this.arrowImage.style.top = (b + this.h - 8) + "px"
			}
			this.canvas.element.appendChild(this.arrowImage)
		}
		this.canvas.element.appendChild(this.element)
	},
	getBound: function() {
		return new Af.Rectangle(this.x1, this.y1, this.borderWidth, this.y2 - this.y1)
	},
	clip: function() {
		if (this.element == null) {
			return
		}
		this.canvas.setClip(this.getBound(), this.element, 0);
		if (this.arrowImage != null) {
			var a;
			var g;
			if (this.arrow == ARROW_END_A) {
				a = this.x1 - 6;
				g = this.y1
			} else {
				a = this.x1 - 6;
				g = this.y1 + this.h - 8
			}
			var b = new Af.Rectangle(a, g, 12, 12);
			this.canvas.setClip(b, this.arrowImage, 0)
		}
	}
});
Af.UIDrawingObject = Class.create(Af.DrawingObject, {
	initialize: function() {},
	_initializeUIDrawingObject: function(b, a) {
		this._initializeDrawingObject(b, a);
		this.fontFamily = "Verdana";
		this.oFontSize = "12px";
		this.fontSize = "12px";
		this.autoH = -1;
		this.ts = null
	},
	endMove: function() {
		if (this.canvas.br != null) {
			this.canvas.br.executeOverlappingObjGuide(true)
		}
	},
	move: function(b, a) {
		if (this.moveable && !this.locked) {
			this.x += b;
			this.y += a;
			this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
			this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
			if (this.element) {
				this.element.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
				this.element.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px"
			}
		}
	},
	setOriginal: function(a) {
		if (this.x != null) {
			this.ox = parseFloat(this.x) / a;
			this.oy = parseFloat(this.y) / a;
			this.ow = parseFloat(this.w) / a;
			this.oh = parseFloat(this.h) / a
		}
	},
	setBounds: function(a, m, b, g) {
		this.x = a;
		this.y = m;
		this.w = b;
		this.h = g;
		this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
		this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		if (this.element) {
			this.element.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
	},
	getBoundsF: function() {
		return {
			ox: this.ox,
			oy: this.oy,
			ow: this.ow,
			oh: this.oh
		}
	},
	clip: function() {},
	setBoundsF: function(a) {
		this.ow = a.ow;
		this.oh = a.oh;
		this.ox = a.ox;
		this.oy = a.oy;
		this.x = Math.round(this.ox * this.canvas.zoomFactor);
		this.y = Math.round(this.oy * this.canvas.zoomFactor);
		this.w = Math.round(this.ow * this.canvas.zoomFactor) + this.selectionExtent;
		this.h = Math.round(this.oh * this.canvas.zoomFactor) + this.selectionExtent;
		if (this.element) {
			this.element.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
	},
	resizeUsingAspect: function(g, b, q) {
		if (this.resizable) {
			var a = this.w + g;
			var o = this.h + b;
			if (q && this.aspectRatio != null && this.aspectRatio != -1) {
				var m = this.w;
				var r = this.h;
				if (Math.abs(a - m) > Math.abs(o - r)) {
					o = a / this.aspectRatio
				} else {
					a = o * this.aspectRatio
				}
			}
			this.w = Math.round(a);
			this.h = Math.round(o);
			this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
			this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
			if (this.w <= 0) {
				this.w = 1
			}
			if (this.h <= 0) {
				this.h = 1
			}
			this.resizeElements()
		}
	},
	setSize: function(a, b) {
		if (this.resizable) {
			this.w = a;
			this.h = b;
			this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
			this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
			if (this.w <= 0) {
				this.w = 1
			}
			if (this.h <= 0) {
				this.h = 1
			}
			this.resizeElements()
		}
	},
	resize: function(b, a) {
		if (this.resizable) {
			this.setSize(this.w + b, this.h + a)
		}
	},
	resizeElements: function() {
		if (this.element) {
			var a = (this.w - (this.borderWidth * 2) - this.paddingLeft - this.paddingRight);
			if (a < 10) {
				this.w += 10 - a;
				a = 10
			}
			this.element.style.width = a + "px";
			a = (this.h - (this.borderWidth * 2) - this.paddingTop - this.paddingBottom);
			if (a < 10) {
				this.h += 10 - a;
				a = 10
			}
			this.element.style.height = a + "px"
		}
	},
	endResize: function() {
		if (this.canvas.br != null) {
			if (this.mainImage) {
				this.canvas.br.executeOneObjRule(this, false, true, true, false, true)
			}
			this.canvas.br.executeOverlappingObjGuide(true)
		}
		if (this.imageFile && this.type == "textarea") {
			this.canvas.generateImage2(this)
		}
		this.canvas.refreshAll()
	},
	getObjectByXY: function(u, q, A, g) {
		var a = this.getBound();
		if (g && this == A) {
			a.x -= RESIZE_TOOL_SIZE;
			if (this.type == "textarea") {
				a.x -= RESIZE_TOOL_SIZE / 2
			}
			a.y -= RESIZE_TOOL_SIZE;
			a.w += RESIZE_TOOL_SIZE;
			if (this.type == "textarea") {
				a.w += RESIZE_TOOL_SIZE / 2
			}
			a.h += RESIZE_TOOL_SIZE
		}
		if (a.contains(u, q)) {
			var o = new Array();
			for (var m = 0; m < this.children.length; m++) {
				var b = this.children[m];
				var z = b.getObjByXY(u, q, A);
				if (z != null) {
					o.append(z)
				}
			}
			if (o.length > 0) {
				o.sort(this.levelSort);
				return o[o.length - 1]
			}
			return this
		}
		return null
	},
	levelSort: function(b, a) {
		return b.level - a.level
	},
	setLevel: function(a) {
		this.level = a;
		if (this.element != null) {
			this.element.style.zIndex = "" + a
		}
	},
	updateSize: function() {
		this.w = this.element.offsetWidth;
		this.h = this.element.offsetHeight;
		this.clip();
		if (this.canvas != null) {
			this.canvas.nodeSizeChanged(this)
		}
	},
	setLineWidth: function(a) {
		this.oBorderWidth = a;
		this.borderWidth = a * this.canvas.zoomFactor;
		if (this.element != null) {
			this.element.style.borderWidth = this.borderWidth + "px";
			this.updateSize()
		}
	},
	select: function() {
		this.selected = true;
		this.postSelect()
	},
	unselect: function() {
		this.selected = false;
		this.postUnSelect()
	},
	getStyle: function(b) {
		var a = null;
		if (window.getComputedStyle) {
			a = document.defaultView.getComputedStyle(this.element, null)
		} else {
			a = this.element.currentStyle
		}
		if (a != null) {
			return a[b]
		}
		return a
	},
	getFontStyle: function() {
		return this.element.style.fontStyle
	},
	getFontFamily: function() {
		return this.getStyle("fontFamily")
	},
	getFontStyle: function() {
		return this.element.style.fontStyle
	},
	getFontWeight: function() {
		return this.element.style.fontWeight
	},
	getTextDecoration: function() {
		return this.element.style.textDecoration
	},
	getTextAlign: function() {
		return this.element.style.textAlign
	},
	getFontSize: function() {
		if (this.fontSize == null) {
			this.fontSize = this.getStyle("fontSize")
		}
		return this.fontSize
	},
	autoSize: function() {
		this.element.style.height = "auto"
	},
	saveValue: function() {},
	restoreValue: function() {},
	setValue: function(a) {},
	setLock: function(a) {
		this.locked = a;
		if (this.canvas && this.canvas.selectionTool) {
			this.canvas.selectionTool.updateClasses();
			if (this.canvas.selectedObject == this) {
				designer.updateSelection(this)
			}
		}
	},
	getDirection: function() {
		if (!this.rotationAngle) {
			return "h"
		}
		var a = Math.abs(parseFloat(this.rotationAngle));
		if (a == 90 || a == 270) {
			return "v"
		}
		return "h"
	},
	getTS: function() {
		if (this.ts == null) {
			return this.newTS()
		}
		return this.ts
	},
	newTS: function() {
		this.ts = (new Date()).getTime();
		return this.ts
	}
});
var RESIZE_TOOL_SIZE = 10;
var SAFE_TEXT_PADDING = 0;
var SAFE_IMAGE_PADDING = 24;
Af.SelectionTool = Class.create({
	initialize: function(a) {
		this.designSurface = a;
		this.drawingObject = null;
		this.resizeElements = new Array();
		this.resizeElements.push(new Af.ResizeE("nw"));
		this.resizeElements.push(new Af.ResizeE("se"));
		this.resizeElements.push(new Af.ResizeE("e"));
		this.resizeElements.push(new Af.ResizeE("w"));
		this.resizeElements.push(new Af.ResizeE("n"));
		this.resizeElements.push(new Af.ResizeE("s"));
		this.resizeElements.push(new Af.ResizeE("ne"));
		this.resizeElements.push(new Af.ResizeE("sw"));
		this.topLine = this.addBorderHLine(0, 0, 1, 1, "0000FF", "dashed", ".gif");
		this.bottomLine = this.addBorderHLine(0, 0, 1, 1, "0000FF", "dashed", ".gif");
		this.leftLine = this.addBorderVLine(0, 0, 1, 1, "0000FF", "dashed", ".gif");
		this.rightLine = this.addBorderVLine(0, 0, 1, 1, "0000FF", "dashed", ".gif");
		this.proxy = new Af.RectangleObject(0, 0, 2, 2, null, "_resizeProxy", "000000", null, 1, "dashed");
		this.proxy.createElement();
		this.proxy.element.style.zIndex = "300001";
		this.proxy.canvas = this.designSurface;
		this.showingProxy = false;
		for (var b = 0; b < this.resizeElements.length; b++) {
			this.resizeElements[b].e.onmousedown = this.mouseDownOnResizeE.bindAsEventListener(this)
		}
		this.proxyImage = document.createElement("img");
		this.proxyImage.className = "opacity";
		this.proxy.element.appendChild(this.proxyImage);
		this.snapToGrid = false;
		this.lastMovedX = -1;
		this.lastMovedY = -1;
		this.gridSize = 12;
		this.gridHalfSize = 6;
		this.editTool = document.createElement("img");
		this.editTool.className = "TextTool";
		this.editTool.src = "/psp/images/Edit12.gif";
		this.imageCropCanvas = false
	},
	showEditor: function(a) {
		consumeEvent(a);
		if (designer.rteEditor) {
			designer.rteEditor.unhide()
		}
		return false
	},
	hideEditorTool: function() {
		this.editTool.style.visibility = "hidden"
	},
	setDrawingObject: function(a) {
		this.drawingObject = a;
		this.updateClasses();
		if (a != null) {
			if (!this.designSurface.editingDisabled) {
				for (var b = 0; b < this.resizeElements.length; b++) {
					var g = this.resizeElements[b];
					if (a.supportsResizeDir(g.dir)) {
						this.position(g.dir, g.e);
						g.e.style.visibility = "visible";
						this.designSurface.element.appendChild(g.e)
					} else {
						g.e.style.visibility = "hidden"
					}
				}
			} else {
				for (var b = 0; b < this.resizeElements.length; b++) {
					this.resizeElements[b].e.style.visibility = "hidden"
				}
			}
			if (a.type == "textarea" && !this.designSurface.editingDisabled) {
				this.designSurface.element.appendChild(this.topLine.element);
				this.designSurface.element.appendChild(this.bottomLine.element);
				this.designSurface.element.appendChild(this.leftLine.element);
				this.designSurface.element.appendChild(this.rightLine.element);
				this.positionLine()
			} else {
				this.topLine.element.style.visibility = "hidden";
				this.bottomLine.element.style.visibility = "hidden";
				this.leftLine.element.style.visibility = "hidden";
				this.rightLine.element.style.visibility = "hidden"
			}
		} else {
			for (var b = 0; b < this.resizeElements.length; b++) {
				this.resizeElements[b].e.style.visibility = "hidden"
			}
			this.topLine.element.style.visibility = "hidden";
			this.bottomLine.element.style.visibility = "hidden";
			this.leftLine.element.style.visibility = "hidden";
			this.rightLine.element.style.visibility = "hidden"
		}
		this.positionTextTool()
	},
	updateClasses: function() {
		if (this.drawingObject == null) {
			return
		}
		var g = this.drawingObject.locked;
		for (var a = 0; a < this.resizeElements.length; a++) {
			var b = this.resizeElements[a];
			if (g) {
				Element.addClassName(b.e, "lock_handle")
			} else {
				Element.removeClassName(b.e, "lock_handle")
			}
			b.e.title = g ? "Position and size is locked": ""
		}
	},
	repositionTools: function() {
		if (this.drawingObject != null) {
			for (var a = 0; a < this.resizeElements.length; a++) {
				var b = this.resizeElements[a];
				if (this.drawingObject.supportsResizeDir(b.dir)) {
					this.position(b.dir, b.e);
					b.e.style.visibility = "visible";
					this.designSurface.element.appendChild(b.e)
				} else {
					b.e.style.visibility = "hidden"
				}
			}
			if (this.drawingObject.type == "textarea" && !this.designSurface.editingDisabled) {
				this.positionLine()
			}
			this.drawingObject.clip()
		}
		this.positionTextTool();
		if (this.designSurface.toolsRepositioned) {
			this.designSurface.toolsRepositioned()
		}
	},
	position: function(b, o) {
		var m = this.drawingObject;
		var a = m.x - m.canvas.viewPortX1 + m.canvas.offsetLeft;
		var q = m.y - m.canvas.viewPortY1 + m.canvas.offsetTop;
		if (b == "nw") {
			o.style.left = a - RESIZE_TOOL_SIZE + "px";
			o.style.top = q - RESIZE_TOOL_SIZE + "px"
		} else {
			if (b == "se") {
				o.style.left = a + this.drawingObject.w + "px";
				o.style.top = q + this.drawingObject.h + "px"
			} else {
				if (b == "e") {
					var g = a + this.drawingObject.w;
					if (m.type == "textarea") {
						g += RESIZE_TOOL_SIZE / 2
					}
					o.style.left = g + "px";
					o.style.top = q + (this.drawingObject.h - RESIZE_TOOL_SIZE) / 2 + "px"
				} else {
					if (b == "w") {
						var g = a - RESIZE_TOOL_SIZE;
						if (m.type == "textarea") {
							g -= RESIZE_TOOL_SIZE / 2
						}
						o.style.left = g + "px";
						o.style.top = q + (this.drawingObject.h - RESIZE_TOOL_SIZE) / 2 + "px"
					} else {
						if (b == "n") {
							o.style.left = a + (this.drawingObject.w - RESIZE_TOOL_SIZE) / 2 + "px";
							o.style.top = q - RESIZE_TOOL_SIZE + "px"
						} else {
							if (b == "s") {
								o.style.left = a + (this.drawingObject.w - RESIZE_TOOL_SIZE) / 2 + "px";
								o.style.top = q + this.drawingObject.h + "px"
							} else {
								if (b == "ne") {
									o.style.left = a + this.drawingObject.w + "px";
									o.style.top = q - RESIZE_TOOL_SIZE + "px"
								} else {
									if (b == "sw") {
										o.style.left = a - RESIZE_TOOL_SIZE + "px";
										o.style.top = q + this.drawingObject.h + "px"
									}
								}
							}
						}
					}
				}
			}
		}
	},
	positionTextTool: function() {
		return;
		var b = this.drawingObject;
		if (b != null) {
			this.designSurface.element.appendChild(this.editTool);
			var a = b.x - b.canvas.viewPortX1 + b.canvas.offsetLeft;
			var m = b.y - b.canvas.viewPortY1 + b.canvas.offsetTop;
			if (!this.designSurface.editingDisabled) {
				this.editTool.style.visibility = "visible"
			} else {
				this.editTool.style.visibility = "hidden"
			}
			this.editTool.style.left = (a + b.w - 14) + "px";
			var g = RESIZE_TOOL_SIZE / 2;
			this.editTool.style.top = (m - g + 1) + "px";
			this.editTool.onclick = this.showEditor.bindAsEventListener(this);
			this.editTool.title = b.type == "textarea" ? "Click here to edit the text and name of the object": "Click here to edit the name of the object"
		} else {
			this.editTool.style.visibility = "hidden"
		}
	},
	positionLine: function() {
		var b = this.drawingObject;
		var g = RESIZE_TOOL_SIZE / 2;
		var a = b.x - b.canvas.viewPortX1 + b.canvas.offsetLeft;
		var m = b.y - b.canvas.viewPortY1 + b.canvas.offsetTop;
		this.designSurface.element.appendChild(this.topLine.element);
		this.topLine.element.style.visibility = "visible";
		this.topLine.element.style.left = (a - g) + "px";
		this.topLine.element.style.top = (m - g) + "px";
		this.topLine.setLineLength(this.drawingObject.w + RESIZE_TOOL_SIZE);
		this.designSurface.element.appendChild(this.bottomLine.element);
		this.bottomLine.element.style.visibility = "visible";
		this.bottomLine.element.style.left = (a - g) + "px";
		this.bottomLine.element.style.top = (m + this.drawingObject.h + g) + "px";
		this.bottomLine.setLineLength(this.drawingObject.w + +RESIZE_TOOL_SIZE);
		this.designSurface.element.appendChild(this.leftLine.element);
		this.leftLine.element.style.visibility = "visible";
		this.leftLine.element.style.left = (a - g) + "px";
		this.leftLine.element.style.top = (m - g) + "px";
		this.leftLine.setLineLength(this.drawingObject.h + RESIZE_TOOL_SIZE);
		this.designSurface.element.appendChild(this.rightLine.element);
		this.rightLine.element.style.visibility = "visible";
		this.rightLine.element.style.left = (a + this.drawingObject.w + g) + "px";
		this.rightLine.element.style.top = (m - g) + "px";
		this.rightLine.setLineLength(this.drawingObject.h + RESIZE_TOOL_SIZE)
	},
	getResizeDir: function(b) {
		for (var a = 0; a < this.resizeElements.length; a++) {
			if (b == this.resizeElements[a].e) {
				return this.resizeElements[a].dir
			}
		}
		return null
	},
	mouseDownOnResizeE: function(b) {
		if (this.drawingObject != null && this.drawingObject.resizable && !this.drawingObject.locked) {
			var a = b.target ? b.target: b.srcElement;
			this.resizeDir = this.getResizeDir(a);
			if (this.resizeDir != null) {
				this.mx1 = b.clientX + docScrollLeft() + this.designSurface.viewPortX1;
				this.my1 = b.clientY + docScrollTop() + this.designSurface.viewPortY1
			}
			if (b.stopPropagation) {
				b.stopPropagation()
			} else {
				b.cancelBubble = true
			}
			if (this.resizeDir != null) {
				this.hideEditorTool();
				this.showProxy();
				this.designSurface.element.onmousemove = this.mouseMoveOnResizeE.bindAsEventListener(this);
				document.onmousemove = this.mouseMoveOnResizeE.bindAsEventListener(this);
				this.designSurface.element.onmouseup = this.mouseUpOnResizeE.bindAsEventListener(this);
				document.onmouseup = this.mouseUpOnResizeE.bindAsEventListener(this)
			}
		}
		b.returnValue = false;
		return false
	},
	showProxy: function(a) {
		if (this.drawingObject == null) {
			return
		}
		this.showingProxy = true;
		this.proxy.setBounds(this.drawingObject.x, this.drawingObject.y, this.drawingObject.w, this.drawingObject.h);
		this.proxy.aspectRatio = this.drawingObject.aspectRatio;
		if (this.drawingObject.element.tagName.toLowerCase() == "img" && this.drawingObject.type != "textarea") {
			this.proxyImage.style.display = "";
			this.proxyImage.style.width = this.proxy.w + "px";
			this.proxyImage.style.height = this.proxy.h + "px";
			this.proxy.element.appendChild(this.proxyImage);
			this.proxyImage.src = this.drawingObject.element.src
		} else {
			this.proxyImage.style.display = "none"
		}
		this.proxy.paint()
	},
	hideProxy: function() {
		this.showingProxy = false;
		try {
			this.designSurface.element.removeChild(this.proxy.element)
		} catch(a) {}
	},
	mouseMoveOnResizeE: function(o) {
		var a = o.clientX + docScrollLeft() + this.designSurface.viewPortX1;
		var q = o.clientY + docScrollTop() + this.designSurface.viewPortY1;
		var g = a - this.mx1;
		var b = q - this.my1;
		if (!this.showingProxy) {
			if (Math.abs(g) >= 5 || Math.abs(b) >= 5) {
				this.showProxy(false)
			}
		}
		if (this.showingProxy) {
			var m = this.resizeRepositionProxy(g, b);
			a = this.mx1 + m.dx;
			this.mx1 = a;
			this.my1 = q
		}
		if (o.stopPropagation) {
			o.stopPropagation()
		} else {
			o.cancelBubble = true
		}
		o.returnValue = false;
		return false
	},
	mouseUpOnResizeE: function(r) {
		this.designSurface.element.onmousemove = null;
		document.onmousemove = null;
		this.designSurface.element.onmouseup = null;
		document.onmouseup = null;
		if (this.showingProxy) {
			try {
				this.constrainMove();
				this.hideProxy();
				var b = this.drawingObject.getBoundsF();
				var u = this.proxy.w;
				var o = this.proxy.h;
				if (this.drawingObject.type != "image") {
					var z = this.drawingObject.selectionExtent / 2;
					var q = 0;
					if (this.drawingObject.type == "textarea") {
						q = SAFE_TEXT_PADDING * this.designSurface.zoomFactor
					} else {
						if (!this.imageCropCanvas) {
							q = SAFE_IMAGE_PADDING * this.designSurface.zoomFactor
						}
					}
					var m = this.designSurface.sfx1 - z - q;
					var g = this.designSurface.sfx2 + z + q;
					var y = this.designSurface.sfy1 - z - q;
					var x = this.designSurface.sfy2 + z + q;
					if (u > (g - m)) {
						u = g - m
					}
					if (o > (x - y)) {
						o = x - y
					}
				}
				if (this.designSurface.isAspectRatioLocked() || this.drawingObject.type != "image") {
					this.drawingObject.setBounds(this.proxy.x, this.proxy.y, u, o, true)
				} else {
					this.drawingObject.setBoundsNoAspect(this.proxy.x, this.proxy.y, u, o, true)
				}
				var a = this.drawingObject.getBoundsF();
				chgMgr.beginTx();
				chgMgr.addModifyChangeByMethod(this.drawingObject, this.drawingObject.setBoundsF, b, a, null);
				chgMgr.endTx();
				this.drawingObject.endResize();
				this.repositionTools()
			} catch(r) {
				alert(r.message)
			}
		}
		if (this.designSurface.designer.rteEditor && this.drawingObject != null && this.drawingObject.type == "textarea") {
			this.designSurface.designer.rteEditor.setSelectedObj(this.drawingObject)
		}
		if (r.stopPropagation) {
			r.stopPropagation()
		} else {
			r.cancelBubble = true
		}
		r.returnValue = false;
		return false
	},
	resizeRepositionProxy: function(o, m) {
		var g = this.resizeDir;
		var b = this.designSurface.isAspectRatioLocked();
		if (g == "nw") {
			if (this.drawingObject.type == "textarea") {
				o = this.adjustX1(o);
				m = this.adjustY1(m)
			}
			this.proxy.resizeUsingAspect( - o, -m, b);
			this.proxy.move(o, m)
		} else {
			if (g == "se") {
				if (this.drawingObject.type == "textarea") {
					o = this.adjustX2(o);
					m = this.adjustY2(m)
				}
				this.proxy.resizeUsingAspect(o, m, b)
			} else {
				if (g == "e") {
					if (this.drawingObject.type == "textarea") {
						o = this.adjustX2(o)
					}
					this.proxy.resizeUsingAspect(o, 0, b)
				} else {
					if (g == "w") {
						if (this.drawingObject.type == "textarea") {
							o = this.adjustX1(o)
						}
						this.proxy.resizeUsingAspect( - o, 0, b);
						this.proxy.move(o, 0)
					} else {
						if (g == "n") {
							if (this.drawingObject.type == "textarea") {
								m = this.adjustY1(m)
							}
							this.proxy.resizeUsingAspect(0, -m, b);
							this.proxy.move(0, m)
						} else {
							if (g == "s") {
								if (this.drawingObject.type == "textarea") {
									m = this.adjustY2(m)
								}
								this.proxy.resizeUsingAspect(0, m, b)
							} else {
								if (g == "ne") {
									if (this.drawingObject.type == "textarea") {
										o = this.adjustX2(o);
										m = this.adjustY1(m)
									}
									this.proxy.resizeUsingAspect(o, -m, b);
									this.proxy.move(0, m)
								} else {
									if (g == "sw") {
										if (this.drawingObject.type == "textarea") {
											o = this.adjustX1(o);
											m = this.adjustY2(m)
										}
										this.proxy.resizeUsingAspect( - o, m, b);
										this.proxy.move(o, 0)
									}
								}
							}
						}
					}
				}
			}
		}
		if (this.drawingObject.element.tagName == "IMG") {
			this.proxyImage.style.width = this.proxy.w + "px";
			this.proxyImage.style.height = this.proxy.h + "px"
		}
		return {
			dx: o,
			dy: m
		}
	},
	adjustX1: function(a) {
		var b = this.proxy.x + a;
		var g = this.designSurface.sfx1 - this.drawingObject.selectionExtent / 2 + SAFE_TEXT_PADDING;
		if (b < g) {
			a -= b - g
		}
		return a
	},
	adjustY1: function(a) {
		var g = this.proxy.y + a;
		var b = this.designSurface.sfy1 - this.drawingObject.selectionExtent / 2 + SAFE_TEXT_PADDING;
		if (g < b) {
			a -= g - b
		}
		return a
	},
	adjustX2: function(b) {
		var a = this.proxy.x + this.proxy.w + b;
		var g = this.designSurface.sfx2 + this.drawingObject.selectionExtent / 2 - SAFE_TEXT_PADDING;
		if (a > g) {
			b -= a - g
		}
		return b
	},
	adjustY2: function(a) {
		var g = this.proxy.y + this.proxy.h + a;
		var b = this.designSurface.sfy2 + this.drawingObject.selectionExtent / 2 - SAFE_TEXT_PADDING;
		if (g > b) {
			a -= g - b
		}
		return a
	},
	moveStart: function() {
		this.hideEditorTool();
		this.showProxy(true);
		this.lastMovedX = this.drawingObject.x;
		this.lastMovedY = this.drawingObject.y;
		this.originalBound = this.drawingObject.getBoundsF();
		this.proxy.paint()
	},
	move: function(g, b) {
		if (this.snapToGrid) {
			var a = this.lastMovedX + g;
			var q = this.lastMovedY + b;
			var m = this.gridSize;
			var o = a % m;
			if (o > this.gridHalfSize) {
				a += (m - o)
			} else {
				a -= o
			}
			g = a - this.lastMovedX;
			o = q % m;
			if (o > this.gridHalfSize) {
				q += (m - o)
			} else {
				q -= o
			}
			b = q - this.lastMovedY
		}
		this.lastMovedX += g;
		this.lastMovedY += b;
		this.proxy.move(g, b);
		this.drawingObject.move(g, b);
		return {
			x: g,
			y: b
		}
	},
	moveEnd: function() {
		this.hideProxy();
		this.constrainMove();
		this.drawingObject.setBounds(this.proxy.x, this.proxy.y, this.proxy.w, this.proxy.h);
		var a = this.drawingObject.getBoundsF();
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(this.drawingObject, this.drawingObject.setBoundsF, this.originalBound, a, null);
		chgMgr.endTx();
		this.drawingObject.endMove();
		this.repositionTools()
	},
	constrainMove: function() {
		if (this.drawingObject == null) {
			return
		}
		if (this.drawingObject.type == "textarea") {
			this.constrainMoveText()
		} else {
			if (this.drawingObject.type == "image") {
				this.constrainMoveImage()
			} else {
				this.constrainMoveShape()
			}
		}
	},
	constrainMoveText: function() {
		var D = this.drawingObject.selectionExtent / 2;
		var x = this.designSurface.sfx1 - D + SAFE_TEXT_PADDING;
		var u = this.designSurface.sfx2 + D - SAFE_TEXT_PADDING;
		var G = this.designSurface.sfy1 - D + SAFE_TEXT_PADDING;
		var F = this.designSurface.sfy2 + D - SAFE_TEXT_PADDING;
		var N = this.proxy.x;
		var m = this.proxy.y;
		var M = N + this.proxy.w;
		var g = m + this.proxy.h;
		if (N > u) {
			N = u - this.proxy.w;
			M = N + this.proxy.w
		}
		if (M < x) {
			N = x;
			M = N + this.proxy.w
		}
		if (m > F) {
			m = F - this.proxy.h;
			g = m + this.proxy.h
		}
		if (g < G) {
			m = G;
			g = m + this.proxy.h
		}
		if (this.isEllipseOverlay(this.designSurface)) {
			var Q = (u - x) / 2;
			var P = (F - G) / 2;
			var L = x + Q;
			var H = G + P;
			var z;
			var B = Math.abs(H - m);
			var A = Math.abs(g - H);
			if (A > B) {
				z = g
			} else {
				z = m
			}
			var q = this.getXX(Q, P, L, H, z);
			x = q.x1;
			u = q.x2
		}
		if (M > u) {
			N -= M - u
		}
		if (N < x) {
			N = x
		}
		if (g > F) {
			m -= g - F
		}
		if (m < G) {
			m = G
		}
		M = N + this.proxy.w;
		g = m + this.proxy.h;
		var K = new Af.Rectangle(N, m, this.proxy.w, this.proxy.h);
		var C = this.designSurface.gobjects;
		var O = false;
		for (var J = 0; J < C.length; J++) {
			var E = C[J];
			if (E.subType == "overlay" && E.enforceSafety == "true") {
				var I = new Af.Rectangle(E.x, E.y, E.w, E.h);
				if (I.intersects(K)) {
					if (E.w <= E.h) {
						var S = E.x;
						var R = E.x + E.w;
						if (Math.abs(S - x) < Math.abs(u - R)) {
							if (x < S) {
								x = R;
								O = true
							}
						} else {
							if (u > S) {
								u = S;
								O = true
							}
						}
					} else {
						var r = E.y;
						var o = E.y + E.h;
						if (Math.abs(r - G) < Math.abs(F - o)) {
							if (G < r) {
								G = o;
								O = true
							}
						} else {
							if (F > r) {
								F = r;
								O = true
							}
						}
					}
				}
			}
		}
		if (O) {
			if (M > u) {
				N -= M - u
			}
			if (N < x) {
				N = x
			}
			if (g > F) {
				m -= g - F
			}
			if (m < G) {
				m = G
			}
		}
		this.proxy.x = N;
		this.proxy.y = m
	},
	getXX: function(m, g, r, o, u) {
		var q = (u - o);
		q = q * q;
		q = q / (g * g);
		q = 1 - q;
		q = q * m * m;
		if (q < 0) {
			q = -q
		}
		q = Math.sqrt(q);
		return {
			x1: ( - q + r),
			x2: (q + r)
		}
	},
	constrainMoveImage: function() {
		var g = SAFE_IMAGE_PADDING * this.designSurface.zoomFactor;
		var x = (this.drawingObject.selectionExtent / 2) * this.designSurface.zoomFactor;
		var o = this.designSurface.sfx1 - x + g;
		var m = this.designSurface.sfx2 + x - g;
		var y = this.designSurface.sfy1 - x + g;
		var u = this.designSurface.sfy2 + x - g;
		var b = this.proxy.x;
		var r = this.proxy.y;
		var a = b + this.proxy.w;
		var q = r + this.proxy.h;
		if (b > m) {
			b = m - this.proxy.w;
			a = b + this.proxy.w
		}
		if (a < o) {
			b = o;
			a = b + this.proxy.w
		}
		if (r > u) {
			r = u - this.proxy.h;
			q = r + this.proxy.h
		}
		if (q < y) {
			r = y;
			q = r + this.proxy.h
		}
		if (b > m) {
			b = m
		}
		if (a < o) {
			b += o - a
		}
		if (r > u) {
			r = u
		}
		if (q < y) {
			r += y - q
		}
		this.proxy.x = b;
		this.proxy.y = r
	},
	constrainMoveShape: function() {
		var H = 0;
		if (!this.imageCropCanvas) {
			H = SAFE_IMAGE_PADDING * this.designSurface.zoomFactor
		}
		var A = (this.drawingObject.selectionExtent / 2) * this.designSurface.zoomFactor;
		var r = this.designSurface.sfx1 - A - H;
		var q = this.designSurface.sfx2 + A + H;
		var C = this.designSurface.sfy1 - A - H;
		var B = this.designSurface.sfy2 + A + H;
		var G = this.proxy.x;
		var m = this.proxy.y;
		var F = G + this.proxy.w;
		var g = m + this.proxy.h;
		if (G > q) {
			G = q - this.proxy.w;
			F = G + this.proxy.w
		}
		if (F < r) {
			G = r;
			F = G + this.proxy.w
		}
		if (m > B) {
			m = B - this.proxy.h;
			g = m + this.proxy.h
		}
		if (g < C) {
			m = C;
			g = m + this.proxy.h
		}
		if (this.isEllipseOverlay(this.designSurface)) {
			var J = (q - r) / 2;
			var I = (B - C) / 2;
			var E = r + J;
			var D = C + I;
			var u;
			var z = Math.abs(D - m);
			var x = Math.abs(g - D);
			if (x > z) {
				u = g
			} else {
				u = m
			}
			var o = this.getXX(J, I, E, D, u);
			r = o.x1;
			q = o.x2
		}
		if (F > q) {
			G -= F - q
		}
		if (G < r) {
			G = r
		}
		if (g > B) {
			m -= g - B
		}
		if (m < C) {
			m = C
		}
		this.proxy.x = G;
		this.proxy.y = m
	},
	isEllipseOverlay: function(a) {
		return a.hasOverLayImage && (a.ds.marginShape == "ellipse" || a.ds.marginShape == "circle")
	},
	addBorderHLine: function(b, u, g, o, m, a, r) {
		var q = new Af.HLineObject(b, u, g, o, null, null, m);
		q.backgroundColor = "#f2f2f2";
		q.moveable = false;
		this.printable = false;
		q.borderStyle = a;
		q.imageType = r;
		q.createElement();
		return q
	},
	addBorderVLine: function(b, u, g, o, m, a, r) {
		var q = new Af.VLineObject(b, u, g, o, null, null, m);
		q.backgroundColor = "#f2f2f2";
		q.moveable = false;
		this.printable = false;
		q.borderStyle = a;
		q.imageType = r;
		q.createElement();
		return q
	}
});
Af.ResizeE = Class.create({
	initialize: function(a) {
		this.dir = a;
		this.e = this.makeResizeElement(a)
	},
	makeResizeElement: function(a) {
		var b = document.createElement("div");
		b.style.width = (RESIZE_TOOL_SIZE - 2) + "px";
		b.style.height = (RESIZE_TOOL_SIZE - 2) + "px";
		b.style.backgroundColor = "#ffffff";
		b.style.border = "1px #000000 solid";
		b.style.fontSize = "1pt";
		b.style.visibility = "hidden";
		b.style.position = "absolute";
		b.style.cursor = a + "-resize";
		b.style.zIndex = "50001";
		b.className = "resize_handle";
		return b
	}
});
Af.TextObject = Class.create(Af.UIDrawingObject, {
	initialize: function(b, a) {
		this._initializeUIDrawingObject(b, a);
		this.type = "text";
		this.x = 0;
		this.y = 0;
		this.description = "";
		this.element = null;
		this.textElement = null;
		this.textNode = null
	},
	paintElements: function() {
		this.element.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
		this.element.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
		this.canvas.element.appendChild(this.element);
		this.w = this.element.offsetWidth;
		this.h = this.element.offsetHeight
	},
	createElement: function() {
		this.element = document.createElement("div");
		this.textNode = document.createTextNode(this.description);
		this.element.appendChild(this.textNode);
		this.element.className = "DesignerTextContainer";
		this.element.style.position = "absolute";
		this.element.style.left = this.x + "px";
		this.element.style.top = this.y + "px";
		this.textElement = document.createElement("input");
		this.textElement.type = "text";
		this.textElement.className = "DesignerText";
		if (this.color != null) {
			this.element.style.color = "#" + this.color;
			this.textElement.style.color = "#" + this.color
		}
		if (this.backgroundColor != null) {
			this.element.style.backgroundColor = "#" + this.backgroundColor;
			this.textElement.style.backgroundColor = "#" + this.backgroundColor
		}
		this.applyFontProperties()
	},
	postSelect: function() {
		if (this.element.childNodes[0] == this.textNode) {
			this.textElement.value = this.textNode.data;
			this.textElement.style.width = (this.element.offsetWidth) + "px";
			this.textElement.style.height = (this.element.offsetHeight) + "px";
			this.element.removeChild(this.textNode);
			this.element.appendChild(this.textElement);
			this.w = this.element.offsetWidth;
			this.h = this.element.offsetHeight;
			this.textElement.focus();
			setCaretToEnd(this.textElement)
		}
	},
	postUnSelect: function() {
		if (this.element.childNodes[0] == this.textElement) {
			this.textNode.data = this.textElement.value;
			this.element.removeChild(this.textElement);
			this.element.appendChild(this.textNode);
			this.w = this.element.offsetWidth;
			this.h = this.element.offsetHeight
		}
	},
	resizeElements: function() {
		this.element.style.width = this.w + "px";
		this.element.style.height = this.h + "px";
		this.textElement.style.width = this.w + "px";
		this.textElement.style.height = this.h + "px";
		this.element.style.borderWidth = this.borderWidth + "px"
	},
	setElementsStyle: function(a, b) {
		this.textElement.style[a] = b;
		this.element.style[a] = b;
		this.w = this.element.offsetWidth;
		this.h = this.element.offsetHeight
	},
	setTextColor: function(a) {
		if (a == "transparent") {
			this.color = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.color = a;
			a = "#" + a
		}
		this.element.style.color = a;
		this.textElement.style.color = a
	},
	setBackgroundColor: function(a) {
		if (a == "transparent" || a == null) {
			this.backgroundColor = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.backgroundColor = a;
			a = "#" + a
		}
		this.element.style.backgroundColor = a;
		this.textElement.style.backgroundColor = a
	},
	setFontFamily: function(a) {
		this.fontFamily = a;
		this.element.style.fontFamily = a;
		this.textElement.style.fontFamily = a
	},
	setFontSize: function(a) {
		this.oFontSize = a;
		this.fontSize = parseInt(this.canvas.zoomFactor * parseFloat(this.oFontSize));
		if (this.fontSize == 0) {
			this.fontSize = 1
		}
		this.fontSize += "px";
		if (this.element != null) {
			this.element.style.fontSize = this.fontSize;
			this.textNode.style.fontSize = this.fontSize;
			this.updateSize()
		}
	}
});
var _attributes_to_be_included = new Object();
var _textAreaDefaultInstruction = '<span style="FONT-SIZE:9px; COLOR:#c2c2c2">Empty text box</span>';
var _textAreaDefaultInstruction2 = "Type in box";
var _textAreaDefaultTitle = "Double click to edit the object";
var _blank_text_html = '<span style="color:#999999; background-color:#f2f2f2"></span>';
var DEFAULT_LINE_HEIGHT = "115%";
var lineBreakNodeName = "BR";
function setLineBreakNodeName() {
	if (Prototype.Browser.WebKit) {
		lineBreakNodeName = "DIV"
	} else {
		if (Prototype.Browser.IE) {
			lineBreakNodeName = "P"
		} else {
			if (Prototype.Browser.Gecko) {
				lineBreakNodeName = "BR"
			} else {
				if (Prototype.Browser.Opera) {
					lineBreakNodeName = "P"
				}
			}
		}
	}
}
setLineBreakNodeName();
Af.TextAreaObject = Class.create(Af.UIDrawingObject, {
	initialize: function(b, a, g) {
		this._initializeUIDrawingObject(b, a);
		if (g) {
			this.oFontSize = g;
			this.fontSize = g
		}
		this.type = "textarea";
		this.x = 0;
		this.y = 0;
		this.w = 150;
		this.description = _textAreaDefaultInstruction;
		this.value = "";
		this.element = null;
		this.rows = 1;
		this.h = parseInt(this.fontSize) + 1;
		this.lineHeight = DEFAULT_LINE_HEIGHT;
		this.textAlign = "left";
		this.customText = false
	},
	supportsResizeDir: function(a) {
		if (this.resizable) {
			if (this.getDirection() == "h") {
				if (a == "e" || a == "w") {
					return true
				}
			} else {
				if (a == "n" || a == "s") {
					return true
				}
			}
		}
		return false
	},
	toXml: function(m, b, o) {
		var a = m + "\t";
		var g = this.Af_DrawingObject_XML(m, b, o);
		g += a + "<description><![CDATA[" + (this.isImage() || this.element == null ? this["description"] : this.element.innerHTML) + "]]></description>\n";
		g += "<autoH>" + this.autoH + "</autoH>";
		if (this.changed) {
			g += "<changed>" + this.changed + "</changed>"
		}
		if (typeof this.customText !== "undefined") {
			g += "<customText>" + this.customText + "</customText>"
		}
		if (this.isImage()) {
			g += "<imageFile>" + this.imageFile + "</imageFile>";
			if (this.element) {
				this.makeWordsXML()
			}
		}
		g += this.textBoxXML != null ? this.textBoxXML: "";
		if (this.prevValue) {
			g += a + "<prevValue><![CDATA[" + this.prevValue + "]]></prevValue>\n"
		}
		g += m + "</dw>\n";
		return g
	},
	makeWordsXML: function() {
		if (!this.words) {
			return
		}
		this.textBoxXML = "";
		var m = this.words;
		for (var b = 0; b < m.length; b++) {
			var g = m[b];
			var a = '<dw class="DrawingObject">\n';
			a += "\t<type>textbox</type>\n";
			a += "\t<x>" + g.x + "</x>\n";
			a += "\t<y>" + g.y + "</y>\n";
			a += "\t<w>" + g.w + "</w>\n";
			a += "\t<h>" + g.h + "</h>\n";
			if (g.fw) {
				a += "\t<fontWeight>" + g.fw + "</fontWeight>\n"
			}
			if (g.fs) {
				a += "\t<fontStyle>" + g.fs + "</fontStyle>\n"
			}
			if (g.c) {
				a += "\t<color>" + g.c + "</color>\n"
			}
			a += "\t<text><![CDATA[" + g.t + "]]></text>\n";
			a += "</dw>\n";
			this.textBoxXML += a
		}
	},
	makeTextBoxXML: function() {
		this._makeRTEBoxXML()
	},
	_makeRTEBoxXML: function() {
		if (this.isImage()) {
			return
		}
		var g = this.element;
		normalizeRTF_DOM(g);
		var b = this.domAsXML(g, null, true);
		this.savedWidth = g.offsetWidth;
		this.saved = g.innerHTML;
		g.innerHTML = b;
		if (is_ie) {
			try {
				this.breakMultiLineIE(g)
			} catch(a) {
				return
			}
		} else {
			this.breakMultiLine(g)
		}
		this.textBoxXML = "";
		this.saveTextBoxXML(g);
		g.style.width = (this.savedWidth) + "px";
		g.innerHTML = this.saved
	},
	getCleanFont: function(g) {
		var b = getStyle("fontFamily", g);
		var a = b.indexOf(",");
		if (a > 0) {
			b = b.substring(0, a)
		}
		b = removeSplCharsFromFont(b);
		return b
	},
	saveTextBoxXML: function(m) {
		if (m.childNodes == null) {
			return
		}
		for (var b = 0; b < m.childNodes.length; b++) {
			var o = m.childNodes[b];
			var g = true;
			var r = o.childNodes;
			if (r.length > 0 && r[0].nodeType != Node.TEXT_NODE) {
				g = false
			}
			if (g && o.tagName && o.tagName.toLowerCase() == "span") {
				var z = o.innerHTML;
				if (z == "") {
					continue
				}
				var x = '<dw class="DrawingObject">\n';
				x += "\t<type>textbox</type>\n";
				var a = this.canvas.zoomFactor;
				x += "\t<x>" + Math.round(o.offsetLeft / a) + "</x>\n";
				var q;
				if (is_ie) {
					q = o.offsetTop
				} else {
					q = o.offsetTop
				}
				x += "\t<y>" + Math.round(q / a) + "</y>\n";
				x += "\t<w>" + Math.round(o.offsetWidth / a) + "</w>\n";
				x += "\t<h>" + Math.round(o.offsetHeight / a) + "</h>\n";
				var u = parseInt(getStyle("fontSize", m));
				u = parseInt(u / a);
				x += "\t<fontSize>" + u + "px</fontSize>\n";
				x += "\t<fontWeight>" + getStyle("fontWeight", m) + "</fontWeight>\n";
				x += "\t<fontStyle>" + getStyle("fontStyle", m) + "</fontStyle>\n";
				x += "\t<textDecoration>" + getStyle("textDecoration", m) + "</textDecoration>\n";
				x += "\t<backgroundColor>" + getStyle("backgroundColor", m) + "</backgroundColor>\n";
				x += "\t<color>" + getStyle("color", m) + "</color>\n";
				x += "\t<fontFamily>" + this.getCleanFont(m) + "</fontFamily>\n";
				x += "\t<textAlign>" + getStyle("textAlign", m) + "</textAlign>\n";
				z = replaceSpace(z);
				z = htmlEncode(z);
				x += "\t<text>" + z + "</text>\n";
				x += "</dw>\n";
				this.textBoxXML += x
			}
			this.saveTextBoxXML(o)
		}
	},
	domAsXML: function(u, o, x) {
		var C;
		var a = u.tagName;
		if (a != null) {
			a = a.toLowerCase();
			if (a == "br") {
				return "<br>"
			}
			C = "<" + a;
			var m = u.attributes;
			var A = this.getStyleAttribute(u);
			if (A != "") {
				C += ' style="' + A + '"'
			}
			if (!x && m != null) {
				for (var q = 0; q < m.length; q++) {
					var b = m.item(q);
					if (!_attributes_to_be_included[b.nodeName]) {
						continue
					}
					var B = b.nodeValue;
					if (B != null && B != "") {
						C += " " + b.nodeName + '="' + b.nodeValue + '"'
					}
				}
			}
			C += ">";
			var g = u.childNodes.length;
			for (var q = 0; q < g; q++) {
				var z = u.childNodes[q];
				var y = null;
				j = q + 1;
				if (j < u.childNodes.length) {
					y = u.childNodes[j]
				}
				C += this.domAsXML(z, y, false)
			}
			C += "</" + a + ">"
		} else {
			var r = "";
			if (u.data != null) {
				r += "<span>" + u.data + "</span>"
			}
			C = r
		}
		return C
	},
	breakMultiLine: function(Q, T) {
		if (Q.childNodes == null) {
			return T
		}
		for (var N = 0; N < Q.childNodes.length; N++) {
			var q = Q.childNodes[N];
			if (q.nodeType == Node.TEXT_NODE) {
				var F = q.data;
				if (F == "") {
					continue
				}
				var x = document.createElement("span");
				q.parentNode.replaceChild(x, q);
				var g = new Array();
				removeAll(x);
				var A = null;
				var H = F.length;
				var P = 0;
				for (var L = 0; L < H; L++) {
					var a = F.charAt(L);
					if (a == " " && A != null) {
						A.innerHTML = A.innerHTML + " ";
						continue
					}
					var O = document.createElement("span");
					O.appendChild(document.createTextNode(a));
					x.appendChild(O);
					A = O;
					if (L == 0) {
						P = O.offsetHeight * 1.3
					}
				}
				var C = x.childNodes;
				var B = C.length;
				var G = C[0];
				var D = G.offsetTop;
				var P = G.offsetHeight * 1.3;
				var S = G.offsetHeight;
				var J = G.childNodes[0].data.length;
				var R = false;
				for (var L = 1; L < B; L++) {
					G = C[L];
					if (G.nodeType == 1) {
						if (G.tagName.toLowerCase() != "span") {
							continue
						}
						var m = G.offsetTop;
						var z = G.offsetHeight;
						var o = G.childNodes[0].data.length;
						if (m > D || z > P) {
							g.push(J);
							D = m
						}
						R = o > 1;
						J += o
					}
				}
				g.push(H);
				removeAll(x);
				H = g.length;
				var u = x;
				var M = 0;
				for (var L = 0; L < H; L++) {
					var K = g[L];
					var b = F.substring(M, K);
					if (b.length > 0) {
						var E = b.charAt(0);
						if (E == " " && T != null) {
							var I = T.innerHTML;
							if (I.lastIndexOf(" ") != (I.length - 1)) {
								T.innerHTML = T.innerHTML + " ";
								b = b.substring(1)
							}
						}
					}
					M = K;
					if (L == 0) {
						x.appendChild(document.createTextNode(b));
						u = x
					} else {
						var r = document.createElement("br");
						x.parentNode.insertBefore(r, u.nextSibling);
						var O = document.createElement("span");
						O.id = "_new_psp_e";
						O.style.whiteSpace = "normal";
						O.appendChild(document.createTextNode(b));
						x.parentNode.insertBefore(O, r.nextSibling);
						u = O
					}
					T = u
				}
			} else {
				if (q.id != "_new_psp_e") {
					T = this.breakMultiLine(q, T)
				} else {
					T = q
				}
			}
		}
		return T
	},
	breakMultiLineIE: function(I, J) {
		if (I.childNodes == null) {
			return
		}
		for (var H = 0; H < I.childNodes.length; H++) {
			var m = I.childNodes[H];
			if (m.nodeType == Node.TEXT_NODE) {
				var z = m.data;
				if (z == "") {
					continue
				}
				var q = document.createElement("span");
				m.parentNode.replaceChild(q, m);
				q.appendChild(document.createTextNode(z));
				var b = new Array();
				var A = document.body.createTextRange();
				A.moveToElementText(q);
				var B = z.length;
				var u = A.boundingTop;
				for (var E = 1; E < B; E++) {
					A.moveStart("character", 1);
					var g = A.boundingTop;
					if (g > u) {
						b.push(E);
						u = g
					}
				}
				b.push(B);
				removeAll(q);
				B = b.length;
				var o = q;
				var G = 0;
				for (var E = 0; E < B; E++) {
					var D = b[E];
					var a = z.substring(G, D);
					if (a.length > 0) {
						var x = a.charAt(0);
						if (x == " " && J != null) {
							var C = J.childNodes[0].data;
							if (C.lastIndexOf(" ") != C.length - 1) {
								J.appendChild(document.createTextNode(" "))
							}
							a = a.substring(1)
						}
					}
					G = D;
					if (E == 0) {
						q.appendChild(document.createTextNode(a));
						o = q
					} else {
						var F = document.createElement("span");
						F.id = "_new_psp_e";
						F.appendChild(document.createTextNode(a));
						q.parentNode.insertBefore(F, o.nextSibling);
						o = F
					}
					J = o
				}
			} else {
				if (m.id != "_new_psp_e") {
					J = this.breakMultiLineIE(m, J)
				} else {
					J = m
				}
			}
		}
		return J
	},
	getStyleAttribute: function(m) {
		var g = "";
		var b = getStyle("fontFamily", m);
		if (b != null && b != "") {
			g += "font-family:" + b
		}
		var a = m.tagName.toLowerCase();
		if (a == "strong") {
			if (g != "") {
				g += ";"
			}
			g += "font-weight:bold"
		} else {
			b = getStyle("fontWeight", m);
			if (b != null && b != "") {
				if (g != "") {
					g += ";"
				}
				g += "font-weight:" + b
			}
		}
		if (a == "em") {
			if (g != "") {
				g += ";"
			}
			g += "font-style:italic"
		} else {
			b = getStyle("fontStyle", m);
			if (b != null && b != "") {
				if (g != "") {
					g += ";"
				}
				g += "font-style:" + b
			}
		}
		b = getStyle("textAlign", m);
		if (b != null && b != "") {
			if (g != "") {
				g += ";"
			}
			g += "text-align:" + b
		}
		b = getStyle("color", m);
		if (b != null && b != "") {
			if (g != "") {
				g += ";"
			}
			g += "color:" + b
		}
		return g
	},
	paintElements: function() {
		var a = this.element;
		a.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
		a.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
		var b = this.canvas && !this.canvas.editingDisabled;
		a.title = b ? _textAreaDefaultTitle: "";
		if (this.__selectionLayer) {
			this.__selectionLayer.style.left = a.style.left;
			this.__selectionLayer.style.top = a.style.top;
			this.canvas.element.appendChild(this.__selectionLayer)
		}
		this.canvas.element.appendChild(a);
		this.resetHeight()
	},
	isImage: function() {
		return this.imageFile != null
	},
	setImageFile: function(b, a, g) {
		this.imageFile = b;
		if (this.element.tagName.toLowerCase() != "img") {
			if (this.element.parentNode) {
				this.element.parentNode.removeChild(this.element)
			}
			this.createElement();
			this.paintElements()
		} else {
			if (a) {
				setTimeout(this.setImageFile.bind(this, b, false, g), 50);
				return
			}
			this.element.src = previewImageURL + this.imageFile + "?ts=" + (g ? this.newTS() : this.getTS())
		}
	},
	createElement: function() {
		this._creating = true;
		this.element = this._createElement();
		this.applyFontProperties();
		this.setFontSize(this.oFontSize);
		this.setInnerHTML(trim(this.value));
		this.updatePClass();
		this.resizeElements(true);
		this.element.ondblclick = this.dblClickOnText.bindAsEventListener(this);
		this._creating = false
	},
	createElement2: function() {
		var a = this.element;
		var b = this.element = this._createElement(true);
		b.style.width = (this.getDirection() == "h" ? this.w: this.h) + "px";
		b.style.height = (this.getDirection() == "h" ? this.h: this.w) + "px";
		this.element.innerHTML = trim(this.value);
		this.applyFontProperties();
		this.updatePClass();
		this.element = a;
		return b
	},
	_createElement: function(m) {
		var g = document.createElement(this.imageFile && !m ? "img": "div");
		var b = designer.getCurrentStationName();
		if (!m && this.imageFile && !isFinalReviewOrPast(b)) {
			g.src = previewImageURL + this.imageFile + "?ts=" + this.getTS()
		} else {
			g.style.height = "auto"
		}
		g.style.lineHeight = DEFAULT_LINE_HEIGHT;
		g.className = "DesignerTextContainer";
		g.style.position = "absolute";
		g.style.left = this.x + "px";
		g.style.top = this.y + "px";
		g.style.zIndex = "" + this.level;
		try {
			g.style.textAlign = this.textAlign
		} catch(a) {}
		g.style.cursor = "default";
		setColor(g, this.color);
		setBackgroundColor(g, this.backgroundColor);
		if (this.borderStyle != null && this.borderStyle != 0 && this.borderWidth != null && this.borderColor != null) {
			g.style.border = this.borderStyle + " " + this.borderWidth + "px #" + this.borderColor
		}
		return g
	},
	setInnerHTML: function(a) {
		if (!this.isImage()) {
			var b = this.element;
			b.innerHTML = a;
			if (this.getInnerText() == "") {
				b.innerHTML = _blank_text_html
			}
		}
	},
	updateSize: function() {
		if (this._creating) {
			return
		}
		this.resizeElements();
		if (this.canvas != null) {
			this.canvas.nodeSizeChanged(this)
		}
	},
	rotate: function(b) {
		var m = parseInt(this.rotationAngle || 0);
		var g = b;
		var a = 0;
		if (g < 0) {
			a = 360 + g % 360
		} else {
			if (g > 360) {
				a = g % 360
			} else {
				a = g
			}
		}
		if (m) {
			a += m;
			a %= 360
		}
		this.rotationAngle = a;
		this.setSize(this.h, this.w)
	},
	setRotation: function(a) {
		this.rotationAngle = parseInt(a || 0);
		if (this.rotationAngle >= 360) {
			this.rotationAngle = 0
		}
	},
	resizeElements: function(a) {
		var b = this.element;
		b.style.width = (this.w - (this.borderWidth * 2)) + "px";
		if (this.isImage()) {
			b.style.height = (this.h - (this.borderWidth * 2)) + "px"
		}
		b.style.borderWidth = this.borderWidth + "px";
		this.clip()
	},
	clip: function() {
		var m = this.element;
		if (m == null) {
			return
		}
		var a = this.getBound();
		var g = new Af.Rectangle(this.canvas.sfx1, this.canvas.sfy1, this.canvas.sfx2 - this.canvas.sfx1, this.canvas.sfy2 - this.canvas.sfy1);
		var b = this.canvas.sfy2 - this.canvas.sfy1 - a.y + g.y;
		var g = g.intersection(a);
		g.x -= a.x;
		g.y -= a.y;
		m.style.clip = "rect(" + (g.y) + "px " + (g.x + g.w) + "px " + (g.y + b) + "px " + (g.x) + "px )"
	},
	saveValue: function() {
		this.savedValue = this.value
	},
	restoreValue: function() {
		if (this.savedValue == null) {
			return
		}
		this.setValue(this.savedValue)
	},
	updatePClass: function() {
		var a = this.element.getElementsByTagName("P");
		for (var b = 0; b < a.length; b++) {
			a[b].className = "ParaTextArea"
		}
	},
	setValue: function(a) {
		this["description"] = a;
		this.value = a;
		this.setInnerHTML(trim(a));
		this.updatePClass();
		this.clip()
	},
	updateRichText: function(a) {
		this.changed = true;
		this.autoSize();
		this["description"] = a;
		this.value = a;
		this.setInnerHTML(trim(a));
		this.updatePClass();
		this.resetAutoSize();
		this.clip();
		this.canvas.br.executeRules2()
	},
	setElementsStyle: function(b, g) {
		if (!this.isImage()) {
			if (b == "textAlign") {
				if (g != null && g.toLowerCase() == "justified") {
					g = "justify"
				}
			}
			try {
				this.element.style[b] = g
			} catch(a) {}
			if (b == "fontFamily") {
				this.updateLineHeight(g)
			}
			this.updateSize()
		}
	},
	updateHtmlFromElement: function() {
		if (!this.isImage()) {
			this.value = this.element.innerHTML;
			this["description"] = this.value
		}
	},
	updateLineHeight: function(a) {
		if (this.element == null) {
			return
		}
		this.element.style.lineHeight = DEFAULT_LINE_HEIGHT
	},
	setTextColor: function(a) {
		if (a == "transparent") {
			this.color = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.color = a;
			a = "#" + a
		}
		this.unselect();
		if (a != "#") {
			this.element.style.color = a
		}
		this.select()
	},
	setBackgroundColor: function(a) {
		if (a == "transparent" || a == null) {
			this.backgroundColor = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.backgroundColor = a;
			a = "#" + a
		}
		this.element.style.backgroundColor = a
	},
	setFontFamily: function(a) {
		this.autoSize();
		this.fontFamily = a;
		this.element.style.fontFamily = a;
		this.updateLineHeight(a);
		this.resetAutoSize()
	},
	setFontSize: function(g, b) {
		this.oFontSize = g;
		this.fontSize = this.canvas.zoomFactor * parseFloat(this.oFontSize);
		if (this.fontSize == 0) {
			this.fontSize = 1
		}
		var a = this.fontSize;
		this.fontSize += "px"
	},
	select: function() {
		if (this.selected) {
			return
		}
		this.selected = true;
		if (this.element != null) {
			this.selectionExtent = 0;
			this.w += this.selectionExtent;
			this.h += this.selectionExtent;
			this.element.className = "DesignerTextContainerSelected";
			this.move( - this.selectionExtent / 2, -this.selectionExtent / 2);
			this.resizeElements()
		}
		this.postSelect()
	},
	unselect: function() {
		if (!this.selected) {
			return
		}
		this.selected = false;
		if (this.element != null) {
			this.w -= this.selectionExtent;
			this.h -= this.selectionExtent;
			this.element.className = "DesignerTextContainer";
			this.move(this.selectionExtent / 2, this.selectionExtent / 2);
			this.selectionExtent = 0;
			this.resizeElements()
		}
		this.postUnSelect()
	},
	postSelect: function() {},
	postUnSelect: function() {},
	setLineColor: function(a) {
		if (a == "transparent" || a == null) {
			this.borderColor = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.borderColor = a;
			a = "#" + a
		}
		if (this.element != null) {
			this.element.style.borderColor = a
		}
	},
	setLineWidth: function(a) {
		var b = a - this.oBorderWidth;
		this.oBorderWidth = a;
		this.borderWidth = a * this.canvas.zoomFactor;
		if (this.element != null) {
			if (b > 0) {
				this.ow += b * 2;
				this.oh += b * 2;
				this.w = parseInt(this.ow * this.canvas.zoomFactor) + this.selectionExtent;
				this.h = parseInt(this.oh * this.canvas.zoomFactor) + this.selectionExtent
			}
			this.element.style.borderWidth = a + "px";
			this.updateSize()
		}
	},
	setLineStyle: function(a) {
		this.borderStyle = a;
		if (this.element != null) {
			this.element.style.borderStyle = a
		}
	},
	dblClickOnText: function() {
		if (this.value == "" && !this.isImage()) {
			this.element.innerHTML = _textAreaDefaultInstruction2
		}
		this.canvas.dblClickOnText(this)
	},
	swapW_H: function() {
		this.setBoundsNoAspect(this.x, this.y, this.h, this.w, true)
	},
	setBoundsNoAspect: function(r, q, u, g, o) {
		var b = this.w;
		var z = this.h;
		this.x = r;
		this.y = q;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		var m = parseFloat(u - (this.borderWidth * 2));
		var a = parseFloat(g - (this.borderWidth * 2));
		this.w = parseInt(m);
		this.h = parseInt(a);
		this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
		this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
		if (this.h != 0) {
			this.aspectRatio = parseFloat(this.w) / parseFloat(this.h)
		} else {
			this.aspectRatio = -1
		}
		if (this.element) {
			this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(false, this.mainImage, true, false, o);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
	},
	getX: function() {
		var a = isFinalReviewOrPast(designer.getCurrentStationName()) && this.mainImage;
		if (a) {
			return 0
		}
		return this.x
	},
	getY: function() {
		var a = isFinalReviewOrPast(designer.getCurrentStationName()) && this.mainImage;
		if (a) {
			return 0
		}
		return this.y
	},
	setBounds: function(a, o, b, m) {
		this.x = a;
		this.y = o;
		this.w = b;
		var g = this.element.offsetHeight;
		if (this.getDirection() == "h") {
			this.h = g
		} else {
			this.h = m
		}
		this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
		this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		if (this.element) {
			this.element.style.left = (this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.y - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
	},
	resetHeight: function() {
		if (this.element.offsetHeight == 0) {
			return
		}
		this.autoH = this.element.offsetHeight;
		var a = this.element.offsetHeight;
		if (a != this.h) {
			this.h = a;
			this.setOriginal(this.canvas.zoomFactor)
		}
	},
	autoSize: function() {
		if (this.isImage()) {
			return
		}
		this.element.style.height = "auto"
	},
	resetAutoSize: function() {
		if (this.element.offsetHeight == 0) {
			return
		}
		this.autoH = this.element.offsetHeight;
		var o = false;
		var g = false;
		var b = this.element.offsetWidth;
		if (b > this.w) {
			this.w = b;
			o = true
		}
		var m = this.element.offsetHeight;
		if (m != this.h) {
			this.h = m;
			g = true
		}
		if (o || g) {
			this.setOriginal(this.canvas.zoomFactor)
		}
		if (this.w != null) {
			if (!o) {
				var a = (this.borderWidth * 2);
				if (this.w - a > 0) {
					this.element.style.width = (this.w - a) + "px"
				}
			}
		}
		if (o || g) {
			this.canvas.nodeSizeChanged(this)
		}
		this.clip()
	},
	getInnerText: function() {
		var b = "";
		for (var a = 0; a < this.element.childNodes.length; a++) {
			b += this._getInnerText(this.element.childNodes[a])
		}
		return b
	},
	_getInnerText: function(g) {
		if (g == null) {
			return ""
		}
		if (g.nodeType == Node.TEXT_NODE) {
			return trim(g.data)
		} else {
			var b = "";
			for (var a = 0; a < g.childNodes.length; a++) {
				b += this._getInnerText(g.childNodes[a])
			}
			return b
		}
	},
	undoRedoGroupAlign: function(a) {
		this.move(a.dx, 0);
		_emptyStyle(this.element, "textAlign", a.alignment);
		this.setTextAlign(a.alignment);
		this.canvas.positionSoftSelect(this)
	},
	undoRedoGroupVerticalAlign: function(a) {
		this.move(0, a.dy);
		_emptyStyle(this.element, "textAlign", a.alignment);
		this.setTextAlign(a.alignment);
		this.canvas.positionSoftSelect(this)
	},
	undoRedoGroupRotate: function(a) {
		this.setRotation(a.angle);
		this.setBounds(a.position["x"], a.position["y"], this.w, this.h)
	},
	undoRedoRotate: function(a) {
		if (a.image != null && this.imageFile != a.image) {
			this.setImageFile(a.image);
			this.rotationAngle = a.angle;
			this.setSize(a.w, a.h)
		}
	}
});
var hD = "0123456789ABCDEF";
function d2h(b) {
	var a = hD.substr(b & 15, 1);
	while (b > 15) {
		b >>= 4;
		a = hD.substr(b & 15, 1) + a
	}
	return a
}
function makeHexColorCode(g) {
	var a = 6 - g.length;
	for (var b = 0; b < a; b++) {
		g = "0" + g
	}
	return g
}
function getStyle(b, g) {
	var a = g.tagName.toLowerCase();
	if (a == "strong" && b == "fontWeight" && is_firefox) {
		return "700"
	}
	if (a == "em" && b == "fontStyle") {
		return "italic"
	}
	return Element.getStyle(g, b)
}
function getFirstTextE(g) {
	if (g.childNodes && g.childNodes.length > 0) {
		for (var b = 0; b < g.childNodes.length; b++) {
			var m = g.childNodes[b];
			if (m.nodeType == Node.TEXT_NODE && m.nodeValue != "" && m.nodeValue != "\n") {
				return g
			} else {
				var a = getFirstTextE(m);
				if (a != null) {
					if (a.nodeName != null) {
						return a
					} else {
						return m
					}
				}
			}
		}
	}
	return null
}
function isFinalReviewOrPast(a) {
	if (a == "uploadChecklist" || a == "upload" || a == "position" || a == "mailservice" || a == "gettingStarted") {
		return false
	}
	return true
}
Af.LineObject = Class.create(Af.UIDrawingObject, {
	initialize: function(a, r, b, q, m, o, g) {
		this._initializeUIDrawingObject(m, o);
		this._initializeLine(a, r, b, q, g)
	},
	_initializeLine: function(a, o, b, m, g) {
		this.type = "line";
		this.x = a;
		this.y = o;
		this.w = b;
		this.h = m;
		this.arrow = NO_ARROW;
		this.arrowImage = null;
		this.color = g;
		if (!this.color) {
			this.color = "000000"
		}
		this.resizeTool = "e";
		this.moveTool = "w"
	},
	serArrowType: function(b) {
		if (this.arrow == b) {
			return
		}
		this.arrow = b;
		if (b == NO_ARROW) {
			this.arrowImage = null
		} else {
			var g;
			if (b == ARROW_END_A) {
				g = "/psp/images/left.gif"
			} else {
				g = "/psp/images/right.gif"
			}
			this.arrowImage = document.createElement("img");
			this.arrowImage.src = g;
			this.arrowImage.width = "12";
			this.arrowImage.height = "12";
			this.arrowImage.style.position = "absolute"
		}
	},
	createElement: function() {
		var a = document.createElement("div");
		a.style.cursor = "move";
		a.style.fontSize = "1pt";
		a.style.position = "absolute";
		a.style.zIndex = "100";
		a.style.left = this.x + "px";
		a.style.top = this.y + "px";
		a.style.width = (this.w) + "px";
		a.style.height = (this.h) + "px";
		a.style.padding = "0px";
		a.style.backgroundColor = this.color == "transparent" ? this.color: "#" + this.color;
		if (is_ns) {
			a.style.overflow = "hidden"
		}
		this.element = a
	},
	resizeElements: function() {
		this.element.style.width = (this.w) + "px";
		this.element.style.height = (this.h) + "px"
	},
	paintElements: function() {
		this.prepareLineForPaint();
		var a = this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft;
		var b = this.y - this.canvas.viewPortY1 + this.canvas.offsetTop;
		this.element.style.left = a + "px";
		this.element.style.top = b + "px";
		if (this.arrowImage != null) {
			if (this.arrow == ARROW_END_A) {
				this.arrowImage.style.left = a - 4 + "px";
				this.arrowImage.style.top = (b - 6) + "px"
			} else {
				this.arrowImage.style.left = (a + this.w - 8) + "px";
				this.arrowImage.style.top = (b - 6) + "px"
			}
			this.canvas.element.appendChild(this.arrowImage)
		}
		this.canvas.element.appendChild(this.element)
	},
	getBound: function() {
		return new Af.Rectangle(this.x, this.y, this.w, this.h)
	},
	setBackgroundColor: function(a) {
		this.setLineColor(a)
	},
	setTextColor: function(a) {
		this.setLineColor(a)
	},
	setLineColor: function(a) {
		this.color = a;
		a = a == "transparent" ? this.color: "#" + this.color;
		this.element.style.backgroundColor = a;
		if (this.element2) {
			this.element2.style.backgroundColor = a
		}
	},
	prepareLineForPaint: function() {}
});
var LINE_PADDING = 0;
Af.HLineObject = Class.create(Af.LineObject, {
	initialize: function(a, u, b, q, o, m, g, r) {
		this._initializeUIDrawingObject(m, o);
		this._initializeLine(a, u, b, q + (LINE_PADDING * 2), g);
		this.type = "hline";
		this.resizeTool = "e";
		this.moveTool = "w";
		this.level = r != null ? r: 100
	},
	supportsResizeDir: function(a) {
		if (a == "e" || a == "w") {
			return true
		}
		return false
	},
	clipH: function(a) {
		this.element.style.display = a >= this.h ? "": "none"
	},
	createElement: function(b) {
		if (b == null) {
			b = document
		}
		var m = b.createElement("div");
		m.style.fontSize = "0pt";
		m.style.position = "absolute";
		if (this.subType == "foldLine") {
			m.style.zIndex = "10001"
		} else {
			m.style.zIndex = "" + this.level
		}
		m.style.left = this.x + "px";
		m.style.top = this.y + "px";
		m.style.width = this.w + "px";
		m.style.height = (this.h - LINE_PADDING * 2) + "px";
		m.style.padding = LINE_PADDING + "px 0px " + LINE_PADDING + "px 0px";
		var a = b.createElement("div");
		a.style.fontSize = "0pt";
		a.style.width = this.w + "px";
		a.style.height = (this.h - LINE_PADDING * 2) + "px";
		a.style.padding = "0px";
		var g = null;
		if ((this.borderStyle == "dashed" || this.borderStyle == "dotted") & this.subType != "foldLine") {
			g = "url('/psp/images/lines/H-" + this.color + "-" + this.h + "-" + this.borderStyle + (this.imageType ? this.imageType: ".png") + "')";
			a.style.backgroundImage = g
		}
		this.element2 = a;
		m.appendChild(a);
		if (is_ns) {
			m.style.overflow = "hidden"
		}
		this.element = m;
		if (g == null & this.subType != "foldLine") {
			this.setLineColor(this.color)
		}
	},
	resizeElements: function() {
		this.element.style.width = (this.w) + "px";
		this.element.style.height = (this.h - LINE_PADDING * 2) + "px";
		this.element2.style.width = (this.w) + "px";
		this.element2.style.height = (this.h - LINE_PADDING * 2) + "px"
	},
	setLineWidth: function(a) {
		this.h = a;
		this.resizeElements()
	},
	setLineStyle: function(a) {},
	getBound: function() {
		return new Af.Rectangle(this.x, this.y, this.w, this.h)
	},
	setLineLength: function(a) {
		this.w = a;
		if (this.canvas) {
			this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor
		} else {
			this.ow = this.w
		}
		this.element.style.width = (this.w) + "px";
		this.element2.style.width = (this.w) + "px"
	},
	zoomLength: function(a) {
		this.x = parseInt(this.ox * a);
		this.y = parseInt(this.oy * a);
		this.w = parseInt(this.ow * a) + this.selectionExtent;
		this.resizeElements()
	},
	prepareLineForPaint: function() {
		if (this.subType == "foldLine") {
			src = "url('/psp/images/lines/V-foldLine-15.png')";
			this.element2.style.backgroundImage = src
		}
	}
});
Af.VLineObject = Class.create(Af.LineObject, {
	initialize: function(a, u, b, q, o, m, g, r) {
		this._initializeUIDrawingObject(m, o);
		this._initializeLine(a, u, b + LINE_PADDING * 2, q, g);
		this.type = "vline";
		this.resizeTool = "s";
		this.moveTool = "n";
		this.level = r != null ? r: 100
	},
	supportsResizeDir: function(a) {
		if (a == "n" || a == "s") {
			return true
		}
		return false
	},
	createElement: function(b) {
		if (b == null) {
			b = document
		}
		var m = b.createElement("div");
		m.style.fontSize = "0pt";
		m.style.position = "absolute";
		if (this.subType == "foldLine") {
			m.style.zIndex = "10001"
		} else {
			m.style.zIndex = "" + this.level
		}
		m.style.left = this.x + "px";
		m.style.top = this.y + "px";
		m.style.height = (this.h) + "px";
		m.style.width = (this.w - LINE_PADDING * 2) + "px";
		m.style.padding = "0px " + LINE_PADDING + "px 0px " + LINE_PADDING + "px";
		var a = b.createElement("div");
		a.style.fontSize = "0pt";
		a.style.width = (this.w - LINE_PADDING * 2) + "px";
		a.style.height = this.h + "px";
		a.style.padding = "0px";
		var g = null;
		if ((this.borderStyle == "dashed" || this.borderStyle == "dotted") & this.subType != "foldLine") {
			g = "url('/psp/images/lines/V-" + this.color + "-" + this.w + "-" + this.borderStyle + (this.imageType ? this.imageType: ".png") + "')";
			a.style.backgroundImage = g
		}
		this.element2 = a;
		m.appendChild(a);
		if (is_ns) {
			m.style.overflow = "hidden"
		}
		this.element = m;
		if (g == null && this.subType != "foldLine") {
			this.setLineColor(this.color)
		}
	},
	resizeElements: function() {
		this.element.style.width = (this.w - LINE_PADDING * 2) + "px";
		this.element.style.height = (this.h) + "px";
		this.element2.style.width = (this.w - LINE_PADDING * 2) + "px";
		this.element2.style.height = (this.h) + "px"
	},
	setLineWidth: function(a) {
		this.w = a;
		this.resizeElements()
	},
	setLineStyle: function(a) {},
	getBound: function() {
		return new Af.Rectangle(this.x, this.y, this.w, this.h)
	},
	clipH: function(a) {
		this.element.style.height = (a) + "px"
	},
	setLineLength: function(a) {
		this.h = a;
		if (this.canvas) {
			this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor
		} else {
			this.oh = this.h
		}
		this.element.style.height = (this.h) + "px";
		this.element2.style.height = (this.h) + "px"
	},
	zoomLength: function(a) {
		this.x = parseInt(this.ox * a);
		this.y = parseInt(this.oy * a);
		this.h = parseInt(this.oh * a) + this.selectionExtent;
		this.resizeElements()
	},
	prepareLineForPaint: function() {
		if (this.subType == "foldLine") {
			src = "url('/psp/images/lines/V-foldLine-15.png')";
			this.element2.style.backgroundImage = src
		}
	}
});
Af.RectangleObject = Class.create(Af.UIDrawingObject, {
	initialize: function(r, q, z, o, b, g, m, u, a, A) {
		this._initializeUIDrawingObject(g, b);
		this.type = "rectangle";
		this.x = r;
		this.y = q;
		this.w = z;
		this.h = o;
		this.color = m;
		if (!this.color) {
			this.color = "000000"
		}
		this.backgroundColor = u;
		this.borderWidth = a;
		if (!this.borderWidth) {
			this.borderWidth = 1
		}
		this.oBorderWidth = this.borderWidth;
		this.borderStyle = A;
		if (!this.borderStyle) {
			this.borderStyle = "solid"
		}
		this.resizeTool = "se";
		this.moveTool = "nw"
	},
	createElement: function() {
		var a = document.createElement("div");
		a.style.fontSize = "1pt";
		a.style.position = "absolute";
		a.style.zIndex = "" + this.level;
		a.style.left = this.x + "px";
		a.style.top = this.y + "px";
		a.style.padding = "0px";
		if (this.backgroundColor != null) {
			a.style.backgroundColor = "#" + this.backgroundColor
		}
		a.style.border = this.borderStyle + " " + this.borderWidth + "px #" + this.color;
		if (is_ns) {
			a.style.overflow = "hidden"
		}
		this.element = a;
		this.resizeElements()
	},
	resizeElements: function() {
		var a = (this.w - (this.borderWidth * 2));
		if (a < 0) {
			this.w = 1 - a;
			a = 1
		}
		this.element.style.width = a + "px";
		a = (this.h - (this.borderWidth * 2));
		if (a < 0) {
			this.h = 1 - a;
			a = 1
		}
		this.element.style.height = a + "px";
		this.element.style.borderWidth = this.borderWidth + "px"
	},
	paintElements: function() {
		l = this.x - this.canvas.viewPortX1 + this.canvas.offsetLeft;
		t = this.y - this.canvas.viewPortY1 + this.canvas.offsetTop;
		this.element.style.left = l + "px";
		this.element.style.top = t + "px";
		this.canvas.element.appendChild(this.element)
	},
	setLineColor: function(a) {
		if (a == "transparent" || a == null) {
			this.borderColor = null;
			if (a == null) {
				a = "transparent"
			}
		} else {
			this.borderColor = a;
			a = "#" + a
		}
		this.color = this.borderColor;
		if (this.element != null) {
			this.element.style.borderColor = a
		}
	}
});
var imageTables = new Object();
var UploadMessageLabel = "Upload Your Design";
var UploadMessageText = "From Computer";
var UploadMessageImageLibrary = "From Image Libraries";
var UseBlankBack = "Use Blank Back";
var orstatement = "or";
Af.ImageObject = Class.create();
Af.ImageObject = Class.create(Af.UIDrawingObject, {
	initialize: function(a, u, b, o, r, m, g, q) {
		this._initializeUIDrawingObject(m, g);
		this.type = "image";
		this.x = a;
		this.y = u;
		this.w = b;
		this.h = o;
		this.imageFile = r;
		if (this.imageFile == "undefined") {
			this.imageFile = null
		}
		this.mediaid = q;
		this.resizeTool = "se";
		this.moveTool = "nw";
		this.baseUrlId = "UserGallery";
		this.aspectRatio = -1;
		this.resizable = true;
		this.isBackground = false;
		this.oldObject = false;
		this.placementStatus = "1";
		this.imageChanged = false;
		this.previewMode = false;
		this.ArtworkSource = "User";
		this.mainImage = false;
		this.artworkResolution = 0;
		this.originalResolution = 0;
		this.artworkHResolution = 0;
		this.artworkVResolution = 0;
		this.level = 1
	},
	toXml: function(m, b, o) {
		var g = this.Af_DrawingObject_XML(m, b, o);
		var a = m + "\t";
		if (this.imageFile != null) {
			g += a + "<imageFile>" + this.imageFile + "</imageFile>\n";
			g += a + "<_imageFile_>" + this.imageFile + "</_imageFile_>\n"
		}
		if (this.mediaid != null) {
			g += a + "<mediaid>" + this.mediaid + "</mediaid>\n"
		}
		if (this["artworkHighResFile"]) {
			g += a + "<artworkHighResFile>" + this["artworkHighResFile"] + "</artworkHighResFile>\n"
		}
		g += a + "<ArtworkSource>" + this.ArtworkSource + "</ArtworkSource>\n";
		g += a + "<baseUrlId>" + this.baseUrlId + "</baseUrlId>\n";
		g += a + "<isBackground>" + this.isBackground + "</isBackground>\n";
		g += a + "<originalResolution>" + this.originalResolution + "</originalResolution>\n";
		g += a + "<artworkVResolution>" + this.artworkVResolution + "</artworkVResolution>\n";
		g += a + "<artworkHResolution>" + this.artworkHResolution + "</artworkHResolution>\n";
		if (this.originalImage) {
			g += a + "<originalImage>" + this.originalImage + "</originalImage>\n";
			g += a + "<originalImageWidth>" + this.originalImageWidth + "</originalImageWidth>\n";
			g += a + "<originalImageHeight>" + this.originalImageHeight + "</originalImageHeight>\n";
			g += a + "<cx>" + this.cx + "</cx>\n";
			g += a + "<cy>" + this.cy + "</cy>\n";
			g += a + "<cw>" + this.cw + "</cw>\n";
			g += a + "<ch>" + this.ch + "</ch>\n"
		}
		if (this["art_width"]) {
			g += a + "<art_width>" + this["art_width"] + "</art_width>\n"
		}
		if (this["art_height"]) {
			g += a + "<art_height>" + this["art_height"] + "</art_height>\n"
		}
		if (this.cameraModel != null) {
			g += a + "<cameraModel>" + this.cameraModel + "</cameraModel>\n"
		}
		if (this.cameraManufacturer != null) {
			g += a + "<cameraManufacturer>" + this.cameraManufacturer + "</cameraManufacturer>\n"
		}
		if (this.artworkName != null) {
			g += a + "<artworkName>" + this.artworkName + "</artworkName>\n"
		}
		if (this.previewImageFile != null) {
			g += a + "<previewImageFile>" + this.previewImageFile + "</previewImageFile>\n"
		}
		if (this.placeHolderImage != null) {
			g += a + "<placeHolderImage>" + this.placeHolderImage + "</placeHolderImage>\n"
		}
		if (this.logoImage != null) {
			g += a + "<logoImage>" + this.logoImage + "</logoImage>\n"
		}
		g += m + "</dw>\n";
		return g
	},
	saveValue: function() {
		this.savedImageFile = this.imageFile;
		this.savedmediaid = this.mediaid
	},
	restoreValue: function() {
		if (this.savedImageFile == null) {
			return
		}
		if (this.savedImageFile != this.imageFile) {
			this.changeImage(this.savedImageFile, this.savedmediaid, false)
		}
	},
	setValue: function(a) {
		if (a != null && this.imageFile != a) {
			this.changeImage(a, a, false)
		}
	},
	move: function(b, a) {
		if (this.moveable && !this.locked) {
			this.x += b;
			this.y += a;
			this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
			this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
			if (this.element) {
				this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
				this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px"
			}
			this.clip()
		}
		if (this.mainImage) {
			if (this.canvas.br != null) {
				this.canvas.br.executeOneObjRule(this, false, true)
			}
		}
	},
	endMove: function() {
		if (this.mainImage) {
			this.canvas.br.executeOneObjRule(this, false, true, true);
			designer.pageNailDimChanged(this)
		}
	},
	swapW_H: function() {
		this.setBoundsNoAspect(this.x, this.y, this.h, this.w, true)
	},
	setBounds: function(z, u, A, o, r) {
		var m = {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h
		};
		this.x = z;
		this.y = u;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		if (this.aspectRatio != -1) {
			var g = this.w;
			var B = this.h;
			if (g != A || B != o) {
				g = parseFloat(g - (this.borderWidth * 2));
				B = parseFloat(B - (this.borderWidth * 2));
				var q = parseFloat(A - (this.borderWidth * 2));
				var b = parseFloat(o - (this.borderWidth * 2));
				if (Math.abs(q - g) > Math.abs(b - B)) {
					b = q / this.aspectRatio
				} else {
					q = b * this.aspectRatio
				}
				this.w = parseInt(q);
				this.h = parseInt(b);
				this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
				this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor
			}
		}
		if (this.element) {
			this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
		var a = (m.x != this.x) || (m.y != this.y) || (m.w != this.w) || (m.h != this.h);
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(false, a, true, false, r);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
	},
	getX: function() {
		var a = isFinalReviewOrPast(designer.getCurrentStationName()) && this.mainImage;
		if (a) {
			return 0
		}
		return this.x
	},
	getY: function() {
		var a = isFinalReviewOrPast(designer.getCurrentStationName()) && this.mainImage;
		if (a) {
			return 0
		}
		return this.y
	},
	updateResolution: function() {
		var y = this["originalResolution"];
		if (y != null) {
			var y = parseFloat(y);
			if (y != 0 && this["art_width"] > 0 && this["art_height"] > 0) {
				var q, x;
				if (this.cw != null) {
					q = this.cw;
					x = this.ch
				} else {
					q = this["art_width"];
					q = (q * 96) / 72;
					x = this["art_height"];
					x = (x * 96) / 72
				}
				var m = parseFloat(this.rotationAngle);
				if (m > 180) {
					m = m - 360
				} else {
					if (m <= -180) {
						m = m + 360
					}
				}
				var g = m == 90 || m == -90 ? x: q;
				var o = (y * g) / this.ow;
				o = Math.floor(o + 0.5);
				var u = m == 90 || m == -90 ? q: x;
				var b = (y * u) / this.oh;
				b = Math.floor(b + 0.5);
				this["artworkHResolution"] = o;
				this["artworkVResolution"] = b;
				if (b < o) {
					o = b
				}
				this["artworkResolution"] = o
			}
		}
	},
	resizeElements: function() {
		if (isFinalReviewOrPast(designer.getCurrentStationName()) && this.previewImageFile != null) {
			var a;
			var m;
			var q = this.canvas.getDSPhysicalSize(this.canvas.ds);
			a = q.w;
			m = q.h;
			a += 0.25;
			m += 0.25;
			var r = designer.artwork.orientation;
			if ((r == "tall" && m < a) || (r == "wide" && a < m)) {
				var g = m;
				m = a;
				a = g
			}
			if (this.element2) {
				this.element2.width = "0px";
				this.element2.height = "0px";
				this.element.style.width = inchToPx(a * this.canvas.zoomFactor) + "px";
				this.element.style.height = inchToPx(m * this.canvas.zoomFactor) + "px"
			}
		} else {
			this.element.style.width = (this.w - (this.borderWidth * 2)) + "px";
			this.element.style.height = (this.h - (this.borderWidth * 2)) + "px";
			this.element.style.borderWidth = this.borderWidth + "px";
			if (this.element2) {
				var b = designer.getCurrentStationName() == "position" && this.ArtworkSource == "custom";
				var a;
				var m;
				if (b) {
					this.element2.style.width = "auto";
					this.element2.style.height = "auto"
				} else {
					if (this.mainImage) {
						a = this.canvas.element.offsetWidth;
						m = this.canvas.element.offsetHeight
					} else {
						a = this.w;
						m = this.h
					}
					this.element2.style.width = a + "px";
					this.element2.style.height = m + "px"
				}
			}
		}
		this.clip();
		this.updateResolution();
		if (this.canvas != null) {
			this.canvas.nodeSizeChanged(this)
		}
	},
	clip: function() {
		if (isFinalReviewOrPast(designer.getCurrentStationName()) && this.previewImageFile != null) {
			return
		}
		if (this.element == null) {
			return
		}
		this.canvas.setClip(this.getBound(), this.element, 0)
	},
	updateSize: function() {
		var a = this.element.offsetWidth + (this.borderWidth * 2);
		var b = this.element.offsetHeight + (this.borderWidth * 2);
		this.setBounds(this.x, this.y, a, b);
		this.clip()
	},
	uploadImage: function(a, b) {
		consume(a);
		this.canvas.designer.uploadImage(this, b);
		return false
	},
	setFontSize: function(a) {},
	updateResizeMoveFlag: function() {
		var b = this.getImageSrc();
		var a = designer.getCurrentStationName() == "position" && this.ArtworkSource == "custom";
		this.moveable = !a && !(b == null || b == "") && (this.subType != "overlay");
		this.resizable = this.moveable;
		if (this.element2) {
			if (a) {
				this.element2.className = "UploadMessage";
				this.element2.style.zIndex = 100000
			} else {
				this.element2.className = "NoUploadMessage";
				this.element2.style.zIndex = 0
			}
		}
	},
	createElement: function(q) {
		hideModalMessageDialog();
		var y = this.getImageSrc();
		if (this.mainImage) {
			var m = document.createElement("div");
			m.style.position = "absolute";
			var b = designer.getCurrentStationName() == "position" && this.ArtworkSource == "custom";
			m.className = b ? "UploadMessage": "NoUploadMessage";
			if (b) {
				m.style.zIndex = 100000
			}
			if (b) {
				var r = document.createElement("span");
				r.className = "UploadMessageAnchor";
				r.innerHTML = UploadMessageLabel;
				m.appendChild(r);
				var o = document.createElement("div");
				o.className = "UploadMessageGap";
				m.appendChild(o);
				r = document.createElement("a");
				r.className = "UploadMessageAnchor";
				r.onclick = this.uploadImage.bindAsEventListener(this, "beforeUpload");
				r.href = "#";
				r.innerHTML = UploadMessageText;
				this.uploadLink = r;
				m.appendChild(r);
				o = document.createElement("div");
				o.className = "UploadMessageGap";
				m.appendChild(o);
				var z = (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"));
				if (!z) {
					var r = document.createElement("a");
					r.className = "UploadMessageAnchor";
					r.onclick = this.uploadImage.bindAsEventListener(this, "beforeGallery");
					r.href = "#";
					r.innerHTML = UploadMessageImageLibrary;
					this.uploadLinkLibrary = r;
					m.appendChild(r)
				}
				var r = document.createElement("div");
				r.className = "UploadMessageAnchor";
				r.innerHTML = orstatement;
				m.appendChild(r);
				r.style.margin = "16px 0px 16px 0px";
				var r = document.createElement("a");
				r.classname = "UploadMessageAnchor";
				r.onclick = this.clearBackground.bind(this);
				r.href = "#";
				r.innerHTML = UseBlankBack;
				m.appendChild(r)
			} else {
				if (this.backgroundColor) {
					this._setBackgroundColor(m, this.backgroundColor)
				}
			}
			this.element2 = m;
			this.updateResizeMoveFlag();
			if (y == null || y == "") {
				this.element = this.element2;
				this.resizeElements(true);
				return
			}
		}
		if (!q && this.oldObject && galleryURL && this.isBackground) {
			this.x = this.canvas.bleedLineXMargin;
			this.y = this.canvas.bleedLineYMargin;
			this.w = -1;
			this.h = -1
		}
		var g = document.createElement("img");
		g.style.position = "absolute";
		g.style.left = this.x + "px";
		g.style.top = this.y + "px";
		g.style.padding = "0px";
		g.hspace = "0";
		g.vspace = "0";
		g.border = "0";
		g.style.borderWidth = parseInt(this.borderWidth) + "px";
		g.style.borderColor = "#" + this.borderColor;
		g.style.borderStyle = this.borderStyle;
		g.title = String(designer.artwork.designName);
		g.alt = String(designer.artwork.designName);
		if (!this.mainImage) {
			g.style.zIndex = "" + this.level
		}
		this.element = g;
		if (!this.mainImage) {
			this.element.style.zIndex = "" + this.level
		}
		this.element.className = "cropimage";
		if (this.w < 0) {
			var x = imageTables[y];
			if (x == null) {
				g.onload = this.imageLoading.bind(this)
			} else {
				this.ow = parseFloat(x.w);
				this.oh = parseFloat(x.h);
				this.w = parseInt(this.ow * this.canvas.zoomFactor);
				this.h = parseInt(this.oh * this.canvas.zoomFactor);
				this.aspectRatio = parseFloat(this.w) / parseFloat(this.h);
				if (this.isBackground) {
					this.resizeToBeBackground()
				}
				this.resizeElements()
			}
		} else {
			this.aspectRatio = parseFloat(this.w - (this.borderWidth * 2)) / parseFloat(this.h - (this.borderWidth * 2));
			var x = imageTables[y];
			if (x == null) {
				this.resizeElements();
				g.onload = this.imageLoading2.bind(this)
			} else {
				this.resizeElements()
			}
		}
		this.imageSrc = this.getImageSrc();
		var u = designer.getCurrentStationName();
		if (isFinalReviewOrPast(u)) {
			if (this.mainImage) {
				g.src = this.imageSrc
			}
		} else {
			g.src = this.imageSrc
		}
		this.setImageTitle();
		if (this.mainImage && this.canvas && this.canvas.br) {
			this.canvas.br.executeOneObjRule(this, false, false);
			designer.pageNailDimChanged(this)
		}
		if (g.complete && g.onload != null) {
			g.onload()
		}
		if (!cropFunctionOn) {
			this.element.ondblclick = this.dblClickOnImage.bindAsEventListener(this)
		}
	},
	changeImageUndoRedo: function(a) {
		if (this.dw) {
			this.dw.imageFile = a
		}
		this.imageFile = a;
		this.imageSrc = this.getImageSrc();
		this.element.src = this.imageSrc;
		designer.pageNail.refreshImages()
	},
	changeImageUndoRedo2: function(a) {
		if (this.dw) {
			this.dw.imageFile = a.imageFile
		}
		this.imageFile = a.imageFile;
		this.ow = parseInt(a.w);
		this.oh = parseInt(a.h);
		this.w = parseInt(this.ow * this.canvas.zoomFactor);
		this.h = parseInt(this.oh * this.canvas.zoomFactor);
		this.aspectRatio = parseFloat(this.w) / parseFloat(this.h);
		this.ArtworkSource = a.ArtworkSource;
		this.art_width = parseFloat(a.art_width);
		this.art_height = parseFloat(a.art_height);
		this.artworkResolution = parseFloat(a.artworkResolution);
		this.originalResolution = parseFloat(a.originalResolution);
		this.artworkHResolution = parseFloat(a.artworkHResolution);
		this.artworkVResolution = parseFloat(a.artworkVResolution);
		this.cameraModel = a.cameraModel;
		this.cameraManufacturer = a.cameraManufacturer;
		this.artworkHighResFile = a.artworkHighResFile;
		this.imageSrc = this.getImageSrc();
		this.element.src = this.imageSrc;
		this.resizeElements();
		designer.pageNail.refreshImages()
	},
	changeImage: function(o, m, g, b, a) {
		this.ArtworkSource = "User";
		this.imageFile = o;
		this.mediaid = m;
		this.changeToNewImage(b, a)
	},
	changeToNewImage: function(m, g) {
		hideModalMessageDialog();
		this.ArtworkSource = "User";
		this.oldObject = m;
		if (this.element.tagName != "IMG") {
			this.w = -1;
			this.h = -1;
			this.createElement();
			return
		}
		this.imageChanged = true;
		if (this.isBackground) {
			this.x = 0;
			this.y = 0
		}
		if (g != null) {
			this.w = -1;
			this.h = -1;
			this["artworkHResolution"] = 0;
			this["artworkVResolution"] = 0;
			this["artworkResolution"] = 0;
			this["cameraModel"] = null;
			this["originalResolution"] = 0;
			this["cameraManufacturer"] = null;
			var a = g.imageWidth;
			if (a != null) {
				this.w = parseInt(a)
			}
			var r = g.imageHeight;
			if (r != null) {
				this.h = parseInt(r)
			}
			var o = g.h_dpi;
			if (o != null) {
				this["artworkHResolution"] = parseFloat(o)
			}
			o = g.v_dpi;
			if (o != null) {
				this["artworkVResolution"] = parseFloat(o)
			}
			this["artworkResolution"] = this["artworkHResolution"] < this["artworkVResolution"] ? this["artworkHResolution"] : this["artworkVResolution"];
			this["originalResolution"] = this["artworkResolution"]
		}
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		try {
			this.canvas.element.removeChild(this.element)
		} catch(u) {}
		var b = document.createElement("img");
		b.style.position = "absolute";
		b.style.left = this.x + "px";
		b.style.top = this.y + "px";
		b.style.padding = "0px";
		b.hspace = "0";
		b.vspace = "0";
		b.border = "0";
		b.style.borderWidth = parseInt(this.borderWidth) + "px";
		b.style.borderColor = "#" + this.borderColor;
		b.style.borderStyle = this.borderStyle;
		b.title = String(designer.artwork.designName);
		b.alt = String(designer.artwork.designName);
		this.element = b;
		if (!this.mainImage) {
			this.element.style.zIndex = "" + this.level
		}
		this.element.className = "cropimage";
		if (!cropFunctionOn) {
			this.element.ondblclick = this.dblClickOnImage.bindAsEventListener(this)
		}
		var q = this.getImageSrc();
		if (this.w == -1) {
			var o = imageTables[q];
			if (o == null) {
				b.onload = this.imageLoading.bind(this)
			} else {
				this.ow = parseFloat(o.w);
				this.oh = parseFloat(o.h);
				this.w = parseInt(this.ow * this.canvas.zoomFactor);
				this.h = parseInt(this.oh * this.canvas.zoomFactor);
				this.aspectRatio = parseFloat(this.w) / parseFloat(this.h);
				if (this.isBackground) {
					this.resizeToBeBackground()
				}
				this.resizeElements()
			}
		}
		this.paint();
		this.imageSrc = this.getImageSrc();
		b.src = this.imageSrc;
		this.setImageTitle();
		this.moveable = true;
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(this.mainImage && g != null, this.mainImage && g != null, true);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
		if (b.complete && b.onload != null) {
			b.onload()
		}
	},
	_changeImage: function(g, b) {
		hideModalMessageDialog();
		this.previewMode = false;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		var a = document.createElement("img");
		a.style.position = "absolute";
		a.style.left = this.x + "px";
		a.style.top = this.y + "px";
		a.style.padding = "0px";
		a.hspace = "0";
		a.vspace = "0";
		a.border = "0";
		a.style.borderWidth = parseInt(this.borderWidth) + "px";
		a.style.borderColor = "#" + this.borderColor;
		a.style.borderStyle = this.borderStyle;
		a.title = String(designer.artwork.designName);
		a.alt = String(designer.artwork.designName);
		this.element = a;
		if (!this.mainImage) {
			this.element.style.zIndex = "" + this.level
		}
		this.element.className = "cropimage";
		this.resizeElements();
		this.imageSrc = this.getImageSrc();
		a.src = this.imageSrc + (b ? "?ts=" + this.getTS() : "");
		this.setImageTitle();
		this.moveable = true
	},
	supportsResizeDir: function(a) {
		return this.resizable
	},
	updateImageSrc: function() {
		if (this.mainImage) {
			if (this.element != null && this.element.tagName == "IMG") {
				var a = this.getImageSrc();
				if (a == null) {
					this.clearImage()
				} else {
					if (this.imageSrc != a) {
						if (isFinalReviewOrPast(designer.getCurrentStationName()) && this.previewImageFile != null) {
							this._changeImage(this.previewImageFile, true)
						} else {
							this._changeImage(this.imageFile)
						}
					} else {
						this.element.src = this.imageSrc
					}
				}
			} else {
				var a = this.getImageSrc();
				if (isFinalReviewOrPast(designer.getCurrentStationName()) && this.previewImageFile != null) {
					this._changeImage(this.previewImageFile, true)
				} else {
					if (this.imageFile != null) {
						this._changeImage(this.imageFile)
					}
				}
			}
		}
	},
	updatePreviewImage: function(b) {
		this.previewImageFile = b;
		if (this.previewImageFile == null) {
			return
		}
		if (this.element != null && this.element.tagName == "IMG") {
			var a = this.getImageSrc();
			if (a == null) {
				this.clearImage()
			} else {
				if (this.imageSrc != a) {
					this.element.src = this.imageSrc
				}
			}
		}
	},
	getImageSrc: function() {
		var a = null;
		if (this.mainImage) {
			if (isFinalReviewOrPast(designer.getCurrentStationName()) && this.previewImageFile != null) {
				a = previewImageURL + this.previewImageFile
			} else {
				a = this.imageFile;
				if (a != null && a.indexOf("/") == -1) {
					a = baseImageURL + a
				}
			}
		} else {
			a = this.imageFile;
			if (a != null && a.indexOf("/") == -1) {
				a = baseImageURL + a
			}
		}
		if (a == null) {
			console.log("WARN: ImageObject with null value of imageSrc. name=" + this.name + " imageFile=" + this.imageFile)
		}
		var b = this.getTS();
		if (b && a != null) {
			a = a + "?ts=" + b
		}
		return a
	},
	setImageTitle: function() {
		if (designer.getCurrentStationName() == "position" && this.imageFile != null) {}
	},
	setBackgroundColor: function(b) {
		if (this.ArtworkSource == "custom") {
			this.clearBackground()
		}
		var a = this.element2 ? this.element2: this.element;
		this._setBackgroundColor(a, b);
		designer.pageNail.changeCurrentTN_BGColor(b)
	},
	_setBackgroundColor: function(a, b) {
		if (b == "transparent" || b == null) {
			this.backgroundColor = null;
			if (b == null) {
				b = "transparent"
			}
		} else {
			this.backgroundColor = b;
			if (b.indexOf("#") == -1) {
				b = "#" + b
			}
		}
		a.style.backgroundColor = b;
		a.style.visibility = "visible"
	},
	clearBackground: function() {
		this.ArtworkSource = "User";
		var a = {};
		a.selectedIndex = designer.pageNail.selectedIndex;
		a.tnImage = designer.pageNail.getCurrentTNImage();
		a.imageFile = this.imageFile;
		a.previewImageFile = this.previewImageFile;
		a.artworkHighResFile = this.artworkHighResFile;
		a.ArtworkSource = "custom";
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(this, this.clearBackgroundUndoRedo, a, {
			ArtworkSource: "User"
		},
		null);
		chgMgr.endTx();
		this._clearBackground()
	},
	_clearBackground: function(a) {
		removeAll(this.element2);
		this.clearImage();
		this.canvas.clearImageToggle(this, null);
		this.updateResizeMoveFlag();
		this.resizeElements()
	},
	clearBackgroundUndoRedo: function(a) {
		if (a.ArtworkSource != "custom") {
			this.ArtworkSource = "User";
			this._clearBackground()
		} else {
			this.ArtworkSource = "custom";
			this.imageFile = a.imageFile;
			this.previewImageFile = a.previewImageFile;
			this.artworkHighResFile = a.artworkHighResFile;
			this.canvas.element.removeChild(this.element);
			this.createElement(true);
			this.canvas.clearImageToggle(this, a);
			this.canvas.refreshAll();
			this.updateResizeMoveFlag()
		}
	},
	clearAll: function() {
		this.element.onload = null;
		this.element.src = null;
		this.element.title = ""
	},
	imageLoading: function() {
		hideModalMessageDialog();
		var a = new Object();
		a.w = this.element.offsetWidth;
		a.h = this.element.offsetHeight;
		imageTables[this.getImageSrc()] = a;
		this.ow = parseFloat(a.w);
		this.oh = parseFloat(a.h);
		this.w = parseInt(this.ow * this.canvas.zoomFactor);
		this.h = parseInt(this.oh * this.canvas.zoomFactor);
		this.aspectRatio = parseFloat(this.w) / parseFloat(this.h);
		if (this.isBackground) {
			this.resizeToBeBackground()
		}
		this.resizeElements()
	},
	imageLoading2: function() {
		hideModalMessageDialog();
		var a = new Object();
		a.w = this.element.offsetWidth;
		a.h = this.element.offsetHeight;
		imageTables[this.getImageSrc()] = a;
		this.resizeElements()
	},
	resizeToBeBackground: function() {
		if (this.oldObject && galleryURL && this.isBackground) {
			return
		}
		if (this.w < this.canvas.element.offsetWidth || this.h < this.canvas.element.offsetHeight) {
			var a = this.canvas.element.offsetWidth;
			var b = parseInt(a / this.aspectRatio);
			if (b < this.canvas.element.offsetHeight) {
				b = this.canvas.element.offsetHeight;
				a = parseInt(b * this.aspectRatio);
				if (a < this.canvas.element.offsetWidth) {
					a = this.canvas.element.offsetWidth
				}
			}
			this.w = a;
			this.h = b;
			this.ow = a / this.canvas.zoomFactor;
			this.oh = b / this.canvas.zoomFactor
		}
	},
	paintElements: function() {
		this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
		this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
		if (this.mainImage) {
			var a = designer.getCurrentStationName() == "position" && this.ArtworkSource == "custom";
			if (this.element2) {
				this.canvas.element.appendChild(this.element2);
				var b = this.x + a ? (this.canvas.element.offsetWidth - this.element2.offsetWidth) / 2 : 0;
				this.element2.style.left = (Math.round(b) - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
				b = this.y + a ? (this.canvas.element.offsetHeight - this.element2.offsetHeight) / 2 : 0;
				this.element2.style.top = (Math.round(b) - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px"
			}
			if (this.element != this.element2) {
				this.canvas.element.appendChild(this.element)
			}
			if (is_firefox) {
				this.element.style.cursor = "pointer"
			} else {
				this.element.style.cursor = "hand"
			}
		} else {
			this.canvas.element.appendChild(this.element)
		}
	},
	showHideCurtain: function() {},
	clearImage: function() {
		this.imageFile = null;
		this.previewImageFile = null;
		this.artworkHighResFile = null;
		if (this.element != this.element2 && this.element2) {
			try {
				var b = this.element;
				this.element = this.element2;
				this.canvas.element.removeChild(b);
				this.paint()
			} catch(a) {}
		}
	},
	clearImageToggle: function(b) {
		if (b == null) {
			this.clearImage()
		} else {
			this.imageFile = b.imageFile;
			this.previewImageFile = b.previewImageFile;
			this.artworkHighResFile = b.artworkHighResFile;
			if (this.element == this.element2) {
				try {
					this.canvas.element.removeChild(this.element)
				} catch(a) {}
				this.element = null
			}
			this.updateImageSrc()
		}
		this.canvas.clearImageToggle(this, b);
		this.paint()
	},
	setAsBackground: function(a) {
		this.background = a;
		if (a) {
			this.x = 0;
			this.y = 0;
			this.originalw = this.w;
			this.originalh = this.h;
			this.w = "100%";
			this.h = "100%";
			this.moveable = false;
			this.resizable = false;
			this.level = 0;
			this.selectable = false
		} else {
			this.x = 0;
			this.y = 0;
			this.w = this.originalw;
			this.h = this.originalh;
			this.moveable = true;
			if (this.subType != "overlay") {
				this.resizable = true
			}
		}
	},
	select: function() {
		this.selected = true;
		this.postSelect()
	},
	unselect: function() {
		this.selected = false;
		this.postUnSelect()
	},
	dblClickOnImage: function(a) {
		this.canvas.dblClickOnDesignSurface(a);
		if (a.stopPropagation) {
			a.stopPropagation()
		} else {
			a.cancelBubble = true
		}
		a.returnValue = false;
		return false
	},
	setWidth: function(a, q, g) {
		if (this.aspectRatio != -1) {
			var m = this.w;
			if (m != g) {
				this.x = a;
				this.y = q;
				this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
				this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
				var b = parseFloat(g - (this.borderWidth * 2));
				var o = b / this.aspectRatio;
				this.w = parseInt(b);
				this.h = parseInt(o);
				this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
				this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
				if (this.element) {
					this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
					this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
					this.resizeElements()
				}
				if (this.canvas && this.canvas.br != null) {
					this.canvas.br.executeRules2(false, this.mainImage, true);
					if (this.mainImage) {
						designer.pageNailDimChanged(this)
					}
				}
			}
		}
	},
	setHeight: function(a, q, m) {
		if (this.aspectRatio != -1) {
			var o = this.h;
			if (o != m) {
				this.x = a;
				this.y = q;
				this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
				this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
				var g = parseFloat(m - (this.borderWidth * 2));
				var b = g * this.aspectRatio;
				this.w = parseInt(b);
				this.h = parseInt(g);
				this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
				this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
				if (this.element) {
					this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
					this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
					this.resizeElements()
				}
				if (this.canvas && this.canvas.br != null) {
					this.canvas.br.executeRules2(false, this.mainImage, true);
					if (this.mainImage) {
						designer.pageNailDimChanged(this)
					}
				}
			}
		}
	},
	fitToSize: function(a, u, g, q) {
		if (this.aspectRatio != -1) {
			var m = this.w;
			var r = this.h;
			this.x = a;
			this.y = u;
			this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
			this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
			var b = parseFloat(g - (this.borderWidth * 2));
			var o = b / this.aspectRatio;
			if (o < q) {
				o = parseFloat(q - (this.borderWidth * 2));
				b = o * this.aspectRatio
			}
			this.w = parseInt(b);
			this.h = parseInt(o);
			this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
			this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
			if (this.element) {
				this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
				this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
				this.resizeElements()
			}
			if (this.canvas && this.canvas.br != null) {
				this.canvas.br.executeRules2(false, this.mainImage, true);
				if (this.mainImage) {
					designer.pageNailDimChanged(this)
				}
			}
		}
	},
	setWidthNoAspect: function(a, o, g) {
		var m = this.w;
		this.x = a;
		this.y = o;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		var b = parseFloat(g - (this.borderWidth * 2));
		this.w = parseInt(b);
		this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
		if (this.h != 0) {
			this.aspectRatio = parseFloat(this.w) / parseFloat(this.h)
		} else {
			this.aspectRatio = -1
		}
		if (this.element) {
			this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(false, this.mainImage, true);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
	},
	setHeightNoAspect: function(a, o, g) {
		var m = this.h;
		this.x = a;
		this.y = o;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		var b = parseFloat(g - (this.borderWidth * 2));
		this.h = parseInt(b);
		if (this.h != 0) {
			this.aspectRatio = parseFloat(this.w) / parseFloat(this.h)
		} else {
			this.aspectRatio = -1
		}
		this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
		if (this.element) {
			this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(false, this.mainImage, true);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
	},
	setBoundsNoAspect: function(r, q, u, g, o) {
		var b = this.w;
		var z = this.h;
		this.x = r;
		this.y = q;
		this.ox = parseFloat(this.x) / this.canvas.zoomFactor;
		this.oy = parseFloat(this.y) / this.canvas.zoomFactor;
		var m = parseFloat(u - (this.borderWidth * 2));
		var a = parseFloat(g - (this.borderWidth * 2));
		this.w = parseInt(m);
		this.h = parseInt(a);
		this.ow = parseFloat(this.w - this.selectionExtent) / this.canvas.zoomFactor;
		this.oh = parseFloat(this.h - this.selectionExtent) / this.canvas.zoomFactor;
		if (this.h != 0) {
			this.aspectRatio = parseFloat(this.w) / parseFloat(this.h)
		} else {
			this.aspectRatio = -1
		}
		if (this.element) {
			this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(false, this.mainImage, true, false, o);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
	},
	resetBounds: function(a, m, b, g) {
		this.ox = parseFloat(a);
		this.oy = parseFloat(m);
		this.ow = parseFloat(b);
		this.oh = parseFloat(g);
		this.x = parseInt(this.ox * this.canvas.zoomFactor);
		this.y = parseInt(this.oy * this.canvas.zoomFactor);
		this.w = parseInt(this.ow * this.canvas.zoomFactor);
		this.h = parseInt(this.oh * this.canvas.zoomFactor);
		if (this.oh != 0) {
			this.aspectRatio = parseFloat(this.ow) / parseFloat(this.oh)
		} else {
			this.aspectRatio = -1
		}
		if (this.element) {
			this.element.style.left = (this.getX() - this.canvas.viewPortX1 + this.canvas.offsetLeft) + "px";
			this.element.style.top = (this.getY() - this.canvas.viewPortY1 + this.canvas.offsetTop) + "px";
			this.resizeElements()
		}
		if (this.canvas && this.canvas.br != null) {
			this.canvas.br.executeRules2(false, this.mainImage, true);
			if (this.mainImage) {
				designer.pageNailDimChanged(this)
			}
		}
	},
	undoRedoRotate: function(a) {
		this["rotationAngle"] = a.angle;
		this.setValue(a.image);
		this.swapW_H()
	},
	undoRedoGroupRotate: function(a) {
		this.undoRedoRotate(a);
		this.setBounds(a.position["x"], a.position["y"], this.w, this.h)
	}
});
function isFinalReviewOrPast(a) {
	if (a == "uploadChecklist" || a == "upload" || a == "position" || a == "mailservice" || a == "gettingStarted") {
		return false
	}
	return true
}
var testString = '<span style="font-size:12px">Anil </span><span style="font-size:18px">Sharma</span>';
Af.FontUtils = Class.create({
	UNSUPORTED_BOLD: {
		"Arial Black": true,
		BansheeStd: true,
		BlackoakStd: true,
		BrushScriptStd: true,
		CalibanStd: true,
		"ChaparralPro-Light": true,
		CooperBlackStd: true,
		FloodStd: true,
		GiddyupStd: true,
		"GraphiteStd-BoldNarrow": true,
		"GraphiteStd-Narrow": true,
		HoboStd: true,
		Impact: true,
		"KeplerStd-Light": true,
		"Lucida Console": true,
		OratorStd: true,
		PoeticaStd: true,
		PoplarStd: true,
		PostinoStd: true,
		StencilStd: true
	},
	UNSUPORTED_ITALIC: {
		"Arial Black": true,
		BansheeStd: true,
		"BickhamScriptPro-Regular": true,
		BlackoakStd: true,
		BrushScriptStd: true,
		"CaflischScriptPro-Regular": true,
		CalibanStd: true,
		"CenturyOldStyleStd-Regular": true,
		"Comic Sans MS": true,
		FloodStd: true,
		GiddyupStd: true,
		"GraphiteStd-BoldNarrow": true,
		"GraphiteStd-Narrow": true,
		HoboStd: true,
		Impact: true,
		"LithosPro-Regular": true,
		"Lucida Console": true,
		PoeticaStd: true,
		PoplarStd: true,
		StencilStd: true,
		Tahoma: true,
		"VivaStd-Regular": true
	},
	initialize: function() {},
	supportsBold: function(a) {
		return ! this.UNSUPORTED_BOLD[a]
	},
	supportsItalic: function(a) {
		return ! this.UNSUPORTED_ITALIC[a]
	}
});
Af.BaseRTEditor = Class.create({
	FONT_TRIGGER_ID: "fontTrigger",
	FONT_COLOR_COMMAND: "forecolor",
	initialize: function() {
		this.readonly = false;
		this.rteSave = null;
		this.rteDiscard = null;
		this.invoker = null;
		this.editingObject = null;
		this.propertyName = null;
		this.rteViewElement = null;
		this.firstTime = true;
		this.rteContainer = null;
		this.canvasElement = null;
		this.dialogMode = true;
		this.show = false;
		this.rtComp = null;
		this.currentTextEditorMode = NO_FORM_MODE;
		this.colorPicker = new Af.ColorPicker(this);
		this.fontUtils = new Af.FontUtils();
		Event.observe(window, "resize", this.reposition.bind(this))
	},
	setRTEditor: function(g, b, a) {
		this.invoker = g;
		this.propertyName = b;
		if (!this.dialogMode) {
			this.html = "Select a text object below, it will be shown here and you will be able to edit and format it."
		} else {
			this.html = ""
		}
		if (this.rteViewElement == null) {
			this.loadRteViewPage()
		}
	},
	loadRteViewPage: function() {
		var a;
		if (this.dialogMode) {
			a = "/psp/rte/text_editor.html?buildId=" + (typeof buildId == "undefined" ? new Date().getTime() : buildId)
		} else {
			a = "/psp/rte/text_editor2.html?d"
		}
		var b = new Af.DataRequest(a, this.requestCompletedRteViewPage.bind(this), requestFailedCommon, null, requestTimedoutCommon);
		ajaxEngine.processRequest(b)
	},
	requestCompletedRteViewPage: function(m) {
		this.rteViewElement = new Element("div");
		if (this.dialogMode) {
			this.rteViewElement.className = "TextDialog";
			this.rteViewElement.innerHTML = m.responseText
		} else {
			this.rteViewElement.innerHTML = m.responseText
		}
		if (this.rteContainer == null) {
			this.rteContainer = $("canvasContainer");
			this.canvasElement = $("canvas");
			this.reposition();
			this.rteContainer.appendChild(this.rteViewElement);
			this.firstTime = false
		} else {
			this.rteContainer.appendChild(this.rteViewElement)
		}
		if (this.dialogMode) {
			this.reposition()
		}
		var o = new Af.ElementCollection(this.rteViewElement);
		this.tableElement = o.$("tableElement");
		this.rteFormModeTitle = o.$("rteFormModeTitle");
		this.titleElement = o.$("rteTitleBar");
		this.text_editor_tb_row = o.$("text_editor_tb_row");
		this.nameRow = o.$("nameRow");
		this.editable = o.$("Editable");
		this.editContainer = o.$("EditContainer");
		this.rteSave = o.$("rteSave");
		if (this.rteSave != null) {
			this.rteSave.onclick = this.doSave.bindAsEventListener(this)
		}
		this.rteDiscard = o.$("rteDiscard");
		if (this.rteDiscard != null) {
			this.rteDiscard.onclick = this.doDiscard.bindAsEventListener(this)
		}
		this.rteCloseButton = o.$("rteCloseButton");
		if (this.rteCloseButton != null) {
			this.rteCloseButton.onclick = this.closeDialog.bindAsEventListener(this)
		}
		var q = $("rteFormModeNext");
		if (q != null) {
			q.onclick = this.closeDialog.bindAsEventListener(this)
		}
		this.nameE = o.$("gobjectName");
		if (this.nameE != null) {
			this.nameE.onkeyup = this.nameChanged.bind(this)
		}
		this.next = o.$("next");
		if (this.next != null) {
			this.next.onclick = this.doNext.bindAsEventListener(this)
		}
		this.previous = o.$("previous");
		if (this.previous != null) {
			this.previous.onclick = this.doPrevious.bindAsEventListener(this)
		}
		this.finish = o.$("finish");
		if (this.finish != null) {
			this.finish.onclick = this.closeDialog.bind(this)
		}
		var g = o.$("rteBold");
		if (g != null) {
			g.onclick = this.makeTextBold.bind(this)
		}
		g = o.$("rteItalic");
		if (g != null) {
			g.onclick = this.makeTextItalic.bind(this)
		}
		g = o.$("rteUnderline");
		if (g != null) {
			g.onclick = this.makeTextUnderline.bind(this)
		}
		g = o.$("rteInsertSplChar");
		if (g != null) {
			g.onclick = this.selectSpecialCharacter.bind(this)
		}
		g = o.$("rteJustifyleft");
		if (g != null) {
			g.onclick = this.makeTextJustifyLeft.bind(this)
		}
		g = o.$("rteJustifyright");
		if (g != null) {
			g.onclick = this.makeTextJustifyRight.bind(this)
		}
		g = o.$("rteJustifycenter");
		if (g != null) {
			g.onclick = this.makeTextJustifyCenter.bind(this)
		}
		g = o.$("rteJustifyfull");
		if (g != null) {
			g.onclick = this.makeTextJustifyFull.bind(this)
		}
		g = o.$("forecolor");
		if (g != null) {
			g.onclick = this.showColorChooser.bindAsEventListener(this)
		}
		g = o.$("addText");
		if (g != null) {
			g.onclick = this.addText.bindAsEventListener(this)
		}
		this.fontSizeSelect = o.$("rteFontsize");
		if (this.fontSizeSelect != null) {
			this.fontSizeSelect.onchange = this.selectFontSize.bindAsEventListener(this)
		}
		this.fontTrigger = $(this.FONT_TRIGGER_ID);
		this.fontCtxMenu = this.getFontCtxMenu(o.$("fontSelectContainer"));
		this.fontCtxMenuUtil = new Af.ContexMenuUtil(this.fontCtxMenu);
		this.fontCtxMenuUtil.addTrigger(this.fontTrigger);
		this.fontCtxMenu.addContextMenuListener(new this.FontCtxMenuListener(this.fontCtxMenu, this));
		var a = new Af.Draggable("RTE", this.rteViewElement, true);
		a.allowedTarget = this.titleElement;
		dndMgr.registerDraggable(a);
		this.initializeRTEComp();
		PubSub.subscribe(ToolbarUtils.FONT_SIZE_TOPIC, this.fontSizeSubscriber.bind(this));
		PubSub.subscribe(ToolbarUtils.FONT_COLOR_TOPIC, this.fontColorSubscriber.bind(this));
		PubSub.subscribe(ToolbarUtils.FONT_FAMILY_TOPIC, this.fontFamilySubscriber.bind(this))
	},
	fontSizeSubscriber: function(m, g) {
		console.log("RTE fontSizeSubscriber " + JSON.stringify(g));
		var b = "rteFontsize";
		var a = g.fontSize;
		ToolbarUtils.selectOption(b, a);
		this.fontSizeChanged(a)
	},
	fontFamilySubscriber: function(o, m) {
		console.log("RTE fontFamilySubscriber");
		console.log(m);
		var a = m.fontFamily,
		g = this._getFontFamilyDisplayName(a);
		console.log("fontFamilyDisplayName = " + g);
		var b = $(this.FONT_TRIGGER_ID);
		b.innerHTML = g;
		this.fontCtxMenu.setSelectedItem(a);
		this.fontFamilyChanged(a)
	},
	_getFontFamilyDisplayName: function(a) {
		return this.fontCtxMenu.getItemDisplayName(a)
	},
	makeTextBold: function(a) {
		Event.stop(a);
		this.doCommand("bold")
	},
	makeTextItalic: function(a) {
		Event.stop(a);
		this.doCommand("italic")
	},
	makeTextUnderline: function(a) {
		Event.stop(a);
		this.doUnderline()
	},
	makeTextJustifyLeft: function(a) {
		Event.stop(a);
		this.doCommand("justifyleft")
	},
	makeTextJustifyRight: function(a) {
		Event.stop(a);
		this.doCommand("justifyright")
	},
	makeTextJustifyCenter: function(a) {
		Event.stop(a);
		this.doCommand("justifycenter")
	},
	makeTextJustifyFull: function(a) {
		Event.stop(a);
		this.doCommand("justifyfull")
	},
	FontCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			this.parent.fontTrigger.innerHTML = this.parent.fontCtxMenu.getItemDisplayName(g);
			this.parent.selectFontFamily(g)
		}
	},
	getFontCtxMenu: function(g, a) {
		var b = new Af.ContextMenu("font_ctx_menu", null, g, a);
		b.container = this.rteViewElement;
		b.cssComp = "ContextMenu FontContextMenu";
		b.element = b.render();
		return b
	},
	addText: function(a) {
		Event.stop(a);
		actionHandler.doAction("addText");
		return false
	},
	initializeRTEComp: function() {},
	selectSpecialCharacter: function(a) {
		Event.stop(a);
		if (this.rtComp == null) {
			return
		}
		this.rtComp.dlgInsertSpecialChar(a);
		return false
	},
	doCommand: function(a) {
		if (this.rtComp == null) {
			return
		}
		this.rtComp.rteCommand2(a);
		return false
	},
	doUnderline: function() {
		if (this.rtComp == null) {
			return
		}
		this.rtComp.underlineChanged();
		this.rtComp.doUpdate(true);
		return false
	},
	showColorChooser: function(a) {
		Event.stop(a);
		return this._showColorChooser(a, this.FONT_COLOR_COMMAND)
	},
	showColorChooser2: function(a) {
		Event.stop(a);
		return this._showColorChooser(a, "hilitecolor")
	},
	_showColorChooser: function(b, g) {
		if (this.rtComp == null) {
			return
		}
		if (this.colorPicker.visible && g == this.colorCommand) {
			this.colorPicker.close();
			if (window.event) {
				window.event.cancelBubble = true
			}
			return false
		}
		var q = b.target ? b.target: b.srcElement;
		this.rtComp.setRange();
		this.colorCommand = g;
		var o = toDocumentPosition(this.rteViewElement);
		var m = toDocumentPosition(q);
		var a = o.x + m.x;
		var r = o.y + m.y;
		this.colorPicker.show("MainArea", a, r);
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	},
	colorSelected: function(a) {
		console.log("RTE colorSelected=" + a);
		PubSub.publish(ToolbarUtils.FONT_COLOR_TOPIC, {
			fontColor: a
		})
	},
	fontColorSubscriber: function(g, b) {
		console.log("RTE fontColorSubscriber " + JSON.stringify(b));
		var a = b.fontColor;
		this.colorCommand = this.FONT_COLOR_COMMAND;
		this.rtComp.colorSelected(this.colorCommand, a)
	},
	selectFontSize: function(g) {
		if (g) {
			Event.stop(g)
		}
		var b = this.fontSizeSelect.selectedIndex;
		if (b != 0) {
			var a = this.fontSizeSelect.options[b].value;
			PubSub.publish(ToolbarUtils.FONT_SIZE_TOPIC, {
				fontSize: a
			})
		}
		return false
	},
	selectFontFamily: function(a) {
		console.log("RTE selectFontFamily fonrType=" + a);
		PubSub.publish(ToolbarUtils.FONT_FAMILY_TOPIC, {
			fontFamily: a
		})
	},
	reposition: function() {
		if (!this.dialogMode || this.rteViewElement == null) {
			return
		}
		var g = toDocumentPosition(this.canvasElement);
		var a = 20;
		var b = g.y + 10;
		this.rteViewElement.style.left = a + "px";
		this.rteViewElement.style.top = b + "px";
		return
	},
	addModifyChange: function() {
		var b = this.editingObject.originalText;
		var a = this.editingObject.value;
		if (this.chg == null) {
			if (b != a) {
				chgMgr.beginTx();
				this.chg = chgMgr.addModifyChangeByMethod(this.editingObject, this.editingObject.updateRichText, b, a, null);
				chgMgr.endTx()
			}
		} else {
			this.chg.newParams = a
		}
	},
	rteUpdated: function(b, a) {
		if (this.editingObject != null && this.editingObject.type == "textarea") {
			if (this.html == b) {
				return
			}
			this.html = b;
			this.editingObject.originalText = this.editingObject.value;
			this.editingObject.updateRichText(b, this.editable);
			this.addModifyChange();
			if (a) {
				this.canvas.generateImageFromEditor(this.editingObject, a)
			}
		}
	},
	underlineChanged: function() {
		if (this.editingObject != null) {
			return this.editingObject.canvas.underline()
		}
		return null
	},
	fontSizeChanged: function(a) {
		if (this.editingObject != null) {
			this.editingObject.canvas.setFontSize2(a);
			this.rtComp.setFontSize(this.editingObject.fontSize)
		}
	},
	fontFamilyChanged: function(a) {
		if (this.editingObject != null) {
			this.editingObject.canvas.setFontFamily2(a);
			if (this.rtComp.chg == null) {
				this.rtComp.chg = this.editingObject.canvas.tempChg
			}
			this.rtComp.setFontFamily(a);
			this.updateButtons(a)
		}
	},
	updateButtons: function(a) {
		var b = this.fontUtils.supportsBold(a);
		var g = $("rteBoldBg");
		if (g) {
			g.className = "rteTool " + (b ? "rteBoldOn": "rteBoldOff")
		}
		b = this.fontUtils.supportsItalic(a);
		g = $("rteItalicBg");
		if (g) {
			g.className = "rteTool " + (b ? "rteItalicOn": "rteItalicOff")
		}
	},
	hideIfRequired: function() {
		if (this.editingObject == null || this.editingObject.type != "textarea") {
			this.hide()
		}
	},
	hide: function() {
		this.visible = false;
		if (this.rteViewElement != null) {
			this.rteViewElement.style.visibility = "hidden"
		}
		this.colorPicker.hide()
	},
	unhide: function() {
		if (!this.visible && this.rteViewElement) {
			this.visible = true;
			this.rteViewElement.style.visibility = "visible";
			this.contentChanged()
		}
	},
	setFontFamily: function(a) {
		if (this.rtComp == null) {
			return
		}
		this.rtComp.setFontFamily(a);
		this.updateButtons(v)
	},
	setFontSize: function(a) {
		if (this.rtComp == null) {
			return
		}
		this.rtComp.setFontSize(a)
	},
	contentChanged: function(y) {
		var q;
		var a;
		if (this.editingObject != null) {
			q = parseInt(this.editingObject.oFontSize);
			q = q + "px";
			a = this.editingObject.fontFamily;
			this.rtComp.setFormatProperty(q, a, this.editingObject.textAlign == null ? "left": this.editingObject.textAlign, this.editingObject.isUnderline())
		} else {
			q = "12px";
			a = "verdana";
			this.rtComp.setFormatProperty(q, a, "verdana", "left", false)
		}
		if (this.fontSizeSelect) {
			if (!this.isFontSizePresent(q)) {
				var x = new Element("option");
				x.value = q;
				var b = parseInt(q);
				var o = this.fontSizeSelect.length;
				var g = null;
				for (i = 0; i < o; i++) {
					var r = this.fontSizeSelect.options[i];
					var m = parseInt(r.value);
					if (m > b) {
						g = r;
						break
					}
				}
				var u = b + " pt";
				x.label = u;
				x.appendChild(document.createTextNode(u));
				this.fontSizeSelect.insertBefore(x, g)
			}
			this.fontSizeSelect.value = q
		}
		if (this.fontFamilySelect) {
			this.fontFamilySelect.value = a
		}
		if (this.fontTrigger) {
			this.fontTrigger.innerHTML = this.fontCtxMenu.getItemDisplayName(a);
			this.fontCtxMenu.setSelectedItem(a)
		}
		this.updateButtons(this.editingObject != null ? this.editingObject.fontFamily: "verdana");
		if (!y) {
			if (this.readonly) {
				this.rteReadonly()
			} else {
				this.rteEdit()
			}
		}
	},
	isFontSizePresent: function(g) {
		var a = this.fontSizeSelect.options;
		for (var b = 0; b < a.length; b++) {
			if (a[b].value == g) {
				return true
			}
		}
		return false
	},
	doSave: function(a) {
		return false
	},
	doDiscard: function() {
		if (this.rtComp == null) {
			return
		}
		var a = this.rtComp.getHtmlSrc();
		if (a != this.editingObject.value) {
			if (this.editingObject != null) {
				showConfirmDialog("Are you sure you want to discard changes made recently (after last save)?", "Discard Changes", 300, 100, this.doRteDiscard.bind(this))
			}
		}
		return false
	},
	doRteDiscard: function() {
		hideDialogWin();
		this.rtComp.setHtmlSrc(this.html)
	},
	rteEdit: function() {
		if (this.rtComp == null) {
			return
		}
		if (this.rteSave != null) {
			this.rteSave.style.display = ""
		}
		if (this.rteDiscard != null) {
			this.rteDiscard.style.display = ""
		}
		this.rtComp.blankIt();
		this.rtComp.setFocus();
		this.updateHTML()
	},
	updateHTML: function() {
		if (this.rtComp == null) {
			return
		}
		this.rtComp.setHtmlSrc(this.html)
	},
	rteReadonly: function() {
		if (this.rteSave != null) {
			this.rteSave.style.display = "none"
		}
		if (this.rteDiscard != null) {
			this.rteDiscard.style.display = "none"
		}
	},
	setFooterPaddingByTextEditor: function() {
		if ($("endOfMainArea") && $("endOfText_editor")) {
			var g = $("endOfMainArea").cumulativeOffset().last();
			var a = $("endOfText_editor").cumulativeOffset().last()
		} else {
			return
		}
		var b = a - g;
		console.log("topMainArea:" + g);
		console.log("topEditor:" + a);
		$("endOfMainArea").setStyle("padding-top:" + b + "px");
		if (a === 0) {
			$("endOfMainArea").setStyle("padding-top:0px")
		}
	},
	closeDialog: function(a) {
		this.hide();
		if (this.invoker != null) {
			this.invoker.rtEditorVisibilityChange(false);
			this.invoker.rteClosed()
		}
		var b = $("leftCol2");
		if (b) {
			b.hide()
		}
		this.currentTextEditorMode = NO_FORM_MODE;
		hideFullWindowMask();
		this.setFooterPaddingByTextEditor();
		return false
	},
	doSaveCloseDialog: function() {
		hideDialogWin();
		this.hide();
		if (this.invoker != null) {
			this.invoker.rtEditorVisibilityChange(false)
		}
		this.doSave()
	},
	doCloseDialog: function() {
		hideDialogWin();
		this.hide();
		if (this.invoker != null) {
			this.invoker.rtEditorVisibilityChange(false)
		}
	},
	close: function() {
		if (this.invoker != null) {
			this.invoker.rtEditorVisibilityChange(false)
		}
		this.hide()
	},
	isVisible: function() {
		return this.visible
	},
	nameChanged: function() {
		if (this.editingObject != null) {
			this.editingObject.displayName = this.nameE.value;
			if ($$(".EditLabelSelected span")) {
				$$(".EditLabelSelected span").first().update(this.nameE.value)
			}
		}
	},
	doNext: function(a) {
		designer.editNext();
		return consumeEvent(a)
	},
	doPrevious: function(a) {
		designer.editPrevious();
		return consumeEvent(a)
	},
	isCommandSupported: function(b) {
		if (this.editingObject == null) {
			return false
		}
		var a = this.editingObject.fontFamily;
		if (b == "bold") {
			return this.fontUtils.supportsBold(a)
		} else {
			if (b == "italic") {
				return this.fontUtils.supportsItalic(a)
			}
		}
		return true
	},
	deleteKeyPressed: function() {
		if (this.canvas) {
			this.canvas.deleteSelectedObject()
		}
	}
});
Af.RTEditor = Class.create(Af.BaseRTEditor, {
	initialize: function($super) {
		$super()
	},
	setSelectedObj: function(m, a) {
		this.editingObject = m;
		this.show = a;
		if (this.rteViewElement == null) {
			return
		}
		var g;
		if (this.editingObject != null) {
			if (!this.dialogMode) {
				this.rteViewElement.className = "RTETextAreaSelected"
			}
			this.html = m[this.propertyName];
			if (this.html == null) {
				this.html = ""
			}
			g = false;
			if (this.nameE != null) {
				var b = this.editingObject.name;
				if (b == null) {
					b = ""
				}
				this.nameE.value = b;
				this.nameE.disabled = false
			}
		} else {
			if (!this.dialogMode) {
				this.rteViewElement.className = "RTETextAreaUnSelected";
				this.html = "Select a text object below, it will be shown here and you will be able to edit and format it."
			} else {
				this.html = ""
			}
			if (this.nameE != null) {
				this.nameE.value = "";
				this.nameE.disabled = true
			}
			g = true
		}
		if (a && !this.visible) {
			this.visible = true;
			this.rteViewElement.style.visibility = "visible"
		}
		if (this.previous) {
			this.previous.disabled = g
		}
		if (this.next) {
			this.next.disabled = g
		}
		if (this.visible) {
			if (this.dialogMode) {
				this.reposition()
			}
			if (this.invoker != null) {
				this.invoker.rtEditorVisibilityChange(true)
			}
			setTimeout(this.contentChanged.bind(this, false), 1)
		}
	},
	initializeRTEComp: function() {
		if (this.rtComp != null) {
			return
		}
		this.titleElement.innerHTML = "Edit Text";
		this.visible = true;
		var a = this.editable;
		this.rtComp = new Af.RTComp();
		this.rtComp.containerElement = this.rteViewElement;
		this.rtComp.controller = this.controller;
		this.rtComp.listener = this;
		this.rtComp.setEditable(a, true);
		if (this.show) {
			this.setSelectedObj(this.editingObject, this.show)
		}
	}
});
Af.MultiRTEditor = Class.create(Af.BaseRTEditor, {
	initialize: function($super) {
		$super();
		this.rteCompList = new Array()
	},
	reinit: function() {
		if (this.canvas) {
			this.editingObject = null;
			this.rtComp = null;
			this.showRTEEditros(this.canvas, this.currentTextEditorMode)
		}
	},
	showRTEEditros: function(g, F) {
		var K = this.canvas;
		this.canvas = g;
		this.currentTextEditorMode = F;
		if (this.rteViewElement == null) {
			this.visible = true;
			return
		}
		var m = F == INLINE_FORM_MODE ? "TextDialogInline": "TextDialog";
		if (m != this.rteViewElement.className) {
			this.rteViewElement.className = m;
			var a = $("leftCol2");
			if (F == INLINE_FORM_MODE) {
				a.show();
				a.appendChild(this.rteViewElement)
			} else {
				if (a) {
					a.hide()
				}
				document.body.appendChild(this.rteViewElement)
			}
			this.rteFormModeTitle.style.display = F == INLINE_FORM_MODE ? "": "none";
			this.titleElement.parentNode.style.display = F == INLINE_FORM_MODE ? "none": "";
			this.text_editor_tb_row.style.display = F == INLINE_FORM_MODE ? "none": ""
		}
		var B = new Array();
		for (var E = 0; E < g.gobjects.length; E++) {
			var I = g.gobjects[E];
			if (I.type == "textarea") {
				B.push(I)
			}
		}
		if (B.length == 0) {
			this.hide();
			return
		}
		if (!this.visible) {
			this.visible = true;
			this.rteViewElement.style.visibility = "visible";
			if (this.invoker != null) {
				this.invoker.rtEditorVisibilityChange(false)
			}
		} else {
			if (this.rtComp != null && K == g) {
				this.setCaretToEnd(this.rtComp);
				return
			}
		}
		if (this.currentEditable != null) {
			this.currentEditable = null
		}
		this.rteViewElement.style.visibility = "hidden";
		var x = this.editContainer;
		removeAll(x);
		this.rteCompList.length = 0;
		this.show = true;
		B.sort(this.compare);
		designer.countNewTextElement = 0;
		for (var E = 0; E < B.length; E++) {
			var I = B[E];
			var J = new Element("div");
			J.className = E == 0 ? "EditLabelContainer1St": "EditLabelContainer";
			var G = new Element("span");
			var z = I.displayName;
			if (z == null) {
				designer.countNewTextElement++;
				z = "Text " + designer.countNewTextElement
			} else {
				z = this.trimLable(z)
			}
			G.innerHTML = z;
			ap = new Element("div");
			ap.title = "Add";
			ap.className = "EditLabel_Toggle Minus";
			J.appendChild(ap);
			ap.appendChild(G);
			var o = new Element("div");
			o.title = "Delete";
			o.className = "rteDelete";
			J.appendChild(o);
			o.onclick = this.deleteGObj.bindAsEventListener(this, I);
			x.appendChild(J);
			var b = new Element("div");
			x.appendChild(b);
			J.onclick = this.toggleShow.bindAsEventListener(this, ap, b, I);
			b.className = "Editable2 Editable2NotSel";
			var C = new Element("div");
			C.style.wordWrap = "break-word";
			C.style.minHeight = "16px";
			b.appendChild(C);
			C.style.padding = "0px";
			C.style.margin = "0px";
			var q = new Af.RTComp();
			q.containerElement = this.rteViewElement;
			q.controller = this.controller;
			q.lbl = G;
			q.toggle = ap;
			q.listener = this;
			q.editingObject = I;
			q.setEditable(C, false, b);
			this.rteCompList.push(q);
			var r = I[this.propertyName];
			if (r == null) {
				r = ""
			}
			q.setHtmlSrc(r);
			C.onmousedown = this.doMouseDown.bindAsEventListener(this, C, q);
			b.onmousedown = this.doMouseDown.bindAsEventListener(this, C, q);
			var H = new Element("div");
			H.className = "clear";
			b.appendChild(H);
			var u = I.oFontSize;
			var y = I.fontFamily;
			q.setFormatProperty(u, y, I.textAlign == null ? "left": I.textAlign, I.isUnderline(), I.color, I.fontWeight, I.fontStyle);
			try {
				C.contentEditable = true
			} catch(A) {
				alert(A)
			}
		}
		var H = new Element("div");
		H.className = "clear";
		x.appendChild(H);
		if ((F != INLINE_FORM_MODE) && (this.rteViewElement.offsetTop + this.rteViewElement.offsetHeight > getViewportHeight() - 20)) {
			this.closeOthers = true;
			this.closeAll(this.rtcComp)
		} else {
			this.closeOthers = false
		}
		this.rteViewElement.style.visibility = "visible";
		if (this.canvas.selectedObject && this.canvas.selectedObject.type == "textarea") {
			this.setSelectedObj(this.canvas.selectedObject)
		} else {
			if (B.length > 0) {
				this.canvas.selectObject(B[0])
			}
		}
		if (designer.currentTextEditorMode == POPUP_FORM_MODE) {
			showFullWindowMask()
		}
		this.reposition();
		if (F == INLINE_FORM_MODE) {
			this.canvas.resetCanvasPosition()
		}
		if (isSuperAdmin()) {
			var D = $("nameRow");
			if (D) {
				D.removeClassName("hide")
			}
		}
	},
	trimLable: function(o) {
		var a = o.split(" ");
		var g = "";
		var b = "";
		for (var m = 0; m < a.length; m++) {
			g += (m > 0 ? " ": "") + a[m];
			if (g.length > 25) {
				if (m < a.length - 1) {
					b += "..."
				}
				break
			} else {
				b = g
			}
		}
		return b
	},
	closeAll: function(g) {
		var a = this.rteCompList;
		for (var b = 0; b < a.length; b++) {
			var m = a[b];
			if (m == g) {
				continue
			}
			if (m.toggle) {
				m.toggle.removeClassName("Minus");
				m.toggle.addClassName("Plus")
			}
			m.editableWrapper.hide()
		}
	},
	deleteGObj: function(a, b) {
		Event.stop(a);
		designer.currentSurface.deleteTextObject(b);
		return false
	},
	toggleShow: function(b, a, q, m) {
		if (b) {
			Event.stop(b)
		}
		var o;
		var g;
		if (a.hasClassName("Plus")) {
			o = "Plus";
			g = "Minus";
			q.style.display = "";
			this.canvas.selectObject(m)
		} else {
			g = "Plus";
			o = "Minus";
			q.style.display = "none"
		}
		a.removeClassName(o);
		a.addClassName(g);
		return false
	},
	compare: function(m, g) {
		if (is_ie || is_ie9_up) {
			if (typeof m.displayName == "undefined") {
				return 1
			} else {
				if (typeof g.displayName == "undefined") {
					return - 1
				}
			}
		} else {
			if (typeof g.displayName == "undefined") {
				return - 1
			} else {
				if (typeof m.displayName == "undefined") {
					return 1
				}
			}
		}
		if (m.oy < g.oy) {
			return - 1
		} else {
			if (m.oy == g.oy) {
				if (m.ox < g.oy) {
					return - 1
				} else {
					return 1
				}
			} else {
				return 1
			}
		}
	},
	unSelectAllInBrowser: function() {
		if (window.getSelection) {
			if (window.getSelection().empty) {
				window.getSelection().empty()
			} else {
				if (window.getSelection().removeAllRanges) {
					window.getSelection().removeAllRanges()
				}
			}
		} else {
			if (document.selection) {
				document.selection.empty()
			}
		}
	},
	doMouseDown: function(a, g, b) {
		this.unSelectAllInBrowser();
		if (!this.makeEditable(g, b, b.editableWrapper)) {
			return
		}
		this.canvas.selectObject(b.editingObject);
		return true
	},
	makeEditable: function(b, a, g) {
		if (this.currentEditable == b) {
			return false
		}
		if (this.currentEditableWrapper != null) {
			this.currentLbl.removeClassName("EditLabelSelected");
			this.currentEditableWrapper.className = "Editable2 Editable2NotSel";
			if (this.closeOthers && this.rtComp && this.rtComp.toggle) {
				this.rtComp.toggle.removeClassName("Minus");
				this.rtComp.toggle.addClassName("Plus");
				this.rtComp.editableWrapper.hide()
			}
		}
		if (a.toggle) {
			a.toggle.removeClassName("Plus");
			a.toggle.addClassName("Minus")
		}
		a.editableWrapper.show();
		this.currentEditable = b;
		this.currentLbl = a.toggle;
		this.currentLbl.addClassName("EditLabelSelected");
		this.currentEditableWrapper = g;
		this.currentEditableWrapper.className = "Editable2 Editable2Sel";
		this.rtComp = a;
		this._setSelectedObj(a.editingObject);
		this.html = a.getHtmlSrc();
		this.setFooterPaddingByTextEditor();
		return true
	},
	_setSelectedObj: function(m) {
		this.doSave();
		this.editingObject = m;
		var a = this.getRTCIndex(m);
		if (a < 0) {
			return
		}
		var g = this.rteCompList[a];
		g.chg = null;
		if (this.nameE != null) {
			var b = this.editingObject.displayName;
			if (b == null) {
				b = ""
			}
			this.nameE.value = b;
			this.nameE.disabled = false
		}
		this.editingObject.originalText = this.editingObject[this.propertyName];
		this.contentChanged(true);
		this.chg = null
	},
	setSelectedObj: function(o) {
		if (o && o.type && o.type !== "textarea") {
			var g = this.getRTCIndex(this.editingObject);
			if (g >= 0) {
				var b = this.rteCompList[g];
				b.resetFocus();
				return
			}
		}
		var a = this.getRTCIndex(o);
		if (a < 0) {
			return
		}
		var m = this.rteCompList[a];
		this.makeEditable(m.editable, m, m.editableWrapper);
		this.setCaretToEnd(m)
	},
	setCaretToEnd: function(a) {
		setTimeout(this._setCaretToEnd.bind(this, a), 0)
	},
	_setCaretToEnd: function(a) {
		a.setCaretToEnd()
	},
	initializeRTEComp: function() {
		this.titleElement.innerHTML = "Edit Your Text";
		if (this.canvas != null) {
			this.showRTEEditros(this.canvas, this.currentTextEditorMode)
		}
	},
	reposition: function() {
		if (!this.dialogMode || this.rteViewElement == null || this.currentTextEditorMode == INLINE_FORM_MODE) {
			return
		}
		var m = this.currentTextEditorMode == NO_FORM_MODE ? $("GuideListTable") : $("canvasTD");
		m.show();
		var g = toDocumentPosition(m);
		var a = g.x + ((m.offsetWidth - this.rteViewElement.offsetWidth) / (this.currentTextEditorMode == NO_FORM_MODE ? 1 : 2));
		var b = (this.currentTextEditorMode == NO_FORM_MODE ? g.y - 26 : 50);
		if (a <= 0 && g.y == 0) {
			a = 638;
			b = 320
		}
		this.rteViewElement.style.left = a + "px";
		this.rteViewElement.style.top = b + "px";
		return
	},
	getRTCIndex: function(g) {
		for (var a = 0; a < this.rteCompList.length; a++) {
			var b = this.rteCompList[a];
			if (b.editingObject == g) {
				return a
			}
		}
		return - 1
	},
	doTab: function(b) {
		var a = this.getRTCIndex(this.editingObject);
		if (a < 0) {
			return false
		}
		if (a == this.rteCompList.length - 1) {
			a = 0
		} else {
			a++
		}
		this.canvas.selectObject(this.rteCompList[a].editingObject);
		return true
	},
	doPrevTab: function(b) {
		var a = this.getRTCIndex(this.editingObject);
		if (a < 0) {
			return false
		}
		if (a == 0) {
			a = this.rteCompList.length - 1
		} else {
			a--
		}
		this.canvas.selectObject(this.rteCompList[a].editingObject);
		return true
	},
	hide: function() {
		this.visible = false;
		this.doSave();
		if (this.rteViewElement != null) {
			this.rteViewElement.style.visibility = "hidden"
		}
		this.colorPicker.hide()
	},
	doSave: function() {
		if (this.editingObject != null) {
			this.addModifyChange();
			this.chg = null;
			this.editingObject.originalText = null
		}
	},
	resetRTC: function(m) {
		if (!this.visible) {
			return
		}
		var a = this.getRTCIndex(m);
		if (a < 0) {
			return
		}
		var g = this.rteCompList[a];
		var b = m[this.propertyName];
		g.setHtmlSrc(b);
		if (this.editingObject == m) {
			this.chg = null;
			this.contentChanged(true)
		}
	}
});
var _someCount = 1;
var MARGIN_BLEED_SAFETY = 0.125;
var MARGIN_BLEED_SAFETY_PX = 12;
var htmlDesignMode = false;
var noImageSupportAvailable = false;
Af.DesignSurface = Class.create();
Af.DesignSurface = Class.create(new Af.Canvas, {
	initialize: function(a, b, g) {
		this.initCanvas(b, g);
		this.id = "default";
		this.selectedObject = null;
		this.designer = a;
		this.selectionTool = new Af.SelectionTool(this);
		this.mx1 = -1;
		this.my1 = -1;
		this.unit = "inch";
		this.imageFile = null;
		backGroundImage = null;
		this.moveStarted = false;
		this.pasteX = 0;
		this.pasteY = 0;
		this.bleedLineXMargin = 0;
		this.bleedLineYMargin = 0;
		this.bleedLineXAdjust = 0;
		this.bleedLineYAdjust = 0;
		this.borderLines = new Array();
		this.zoomFactor = 1;
		this.hasOverlayImage = false;
		this.overlayImageLevel = 50000;
		this.groupSelections = new Array();
		this.gridx = 0;
		this.gridy = 0;
		this.gridw = 0;
		this.gridh = 0;
		this.gridLines = new Array();
		this.MAX_HEIGHT = 900;
		this.sideNumber = -1;
		this.MIN_TEXT_WIDTH = 40;
		this.designerGeneration = "1";
		this.cropMode = false;
		this.br = null;
		this.sizeStatusUserInput = false;
		this.positionStatusUserInput = false;
		this.placementStatusUserInput = false;
		this.guideStatusList = new Array();
		this.savedColor = this.element.style.backgroundColor;
		this.editingDisabled = false;
		this.uploadDisabled = false;
		this.tags = new Array();
		this.dataFile = null;
		this.hideBleed = false;
		this.hideSafety = false;
		this.hideCut = false;
		this.bleedCB_System = false;
		this.safetyCB_System = false;
		this.bleedCallout = true;
		this.placementCallout = true;
		this.checkedAndGenerateImage = !playMode
	},
	lockObjectToggle: function(a) {
		if (this.selectedObject) {
			var b = this.selectedObject.locked;
			this.selectedObject.setLock(a);
			chgMgr.beginTx();
			chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setLock, b, a, null);
			chgMgr.endTx()
		}
	},
	addTag: function(a, b) {
		this.removeTag(a);
		var g = new Object();
		g.name = a;
		g.value = b;
		this.tags.push(g)
	},
	removeTag: function(a) {
		for (var g = 0; g < this.tags.length; g++) {
			var b = this.tags[g];
			if (b.name == a) {
				this.tags = removeFromArray(this.tags, b);
				break
			}
		}
	},
	clearTags: function() {
		this.tags = new Array()
	},
	isViewOnly: function() {
		if (designer.isViewOnly) {
			return designer.isViewOnly()
		}
		return false
	},
	setPreviewImageFile: function(a) {
		if (this.cropMode) {
			if (this.gobjects.length > 0 && this.gobjects[0]["type"] == "image") {
				this.gobjects[0].updatePreviewImage(a)
			}
		}
	},
	setSideNumber: function(a) {
		this.sideNumber = a
	},
	toXml: function(b) {
		var g = this.selectedObject;
		if (g != null) {
			this.selectObject(null)
		}
		var x;
		var y = b + "\t";
		x = b + '<ds id="' + this.id + '" class="DrawingSurface">\n';
		var m = this.ds;
		for (var o in m) {
			var q = m[o];
			if (o.indexOf("__") == 0) {
				continue
			}
			if (typeof q == "function" || q instanceof Array) {
				continue
			}
			if (o != "class" && o != "atype" && o != "extend" && o != "id" && o != "imageFile" && o != "unit" && o != "w" && o != "h" && o != "DataFile" && q != null) {
				x += y + "<" + o + ">" + q + "</" + o + ">\n"
			}
		}
		if (this.id) {
			x += y + "<id>" + this.id + "</id>\n"
		}
		if (this.imageFile) {
			x += y + "<imageFile>" + this.imageFile + "</imageFile>\n"
		}
		x += y + "<unit>" + this.unit + "</unit>\n";
		if (this.dataFile != null) {
			x += y + "<DataFile>" + this.dataFile + "</DataFile>\n"
		}
		var u = 0;
		if (this.element.style.borderWidth) {
			u += parseInt(this.element.style.borderWidth) * 2
		}
		x += y + "<w>" + ((this.element.offsetWidth / this.zoomFactor) - u - this.bleedLineXMargin * 2) + "</w>\n";
		x += y + "<h>" + ((this.element.offsetHeight / this.zoomFactor) - u - this.bleedLineYMargin * 2) + "</h>\n";
		x += y + "<bleedCallout>" + this.bleedCallout + "</bleedCallout>\n";
		x += y + "<placementCallout>" + this.placementCallout + "</placementCallout>\n";
		for (var a = 0; a < this.tags.length; a++) {
			var u = this.tags[a];
			x += y + "<" + u.name + ">" + htmlEncode(u.value) + "</" + u.name + ">\n"
		}
		for (var a = 0; a < this.gobjects.length; a++) {
			x += this.gobjects[a].toXml(y, this.bleedLineXMargin, this.bleedLineYMargin)
		}
		if (this.guideStatusList.length > 0) {
			for (var a = 0; a < this.guideStatusList.length; a++) {
				var r = this.guideStatusList[a];
				x += y + '<guideStatus class="GuideStatus">\n';
				x += "\t" + y + "<GuideInternalName>" + r.GuideInternalName + "</GuideInternalName>\n";
				x += "\t" + y + "<GuideStatus>" + r.GuideStatus + "</GuideStatus>\n";
				if (r.GuideStatusDateTime != null) {
					x += "\t" + y + "<GuideStatusDateTime>" + r.GuideStatusDateTime + "</GuideStatusDateTime>\n"
				}
				x += y + "</guideStatus>\n"
			}
		}
		x += b + "</ds>\n";
		if (g != null) {
			this.selectObject(g)
		}
		return x
	},
	sideChanging: function(a) {
		designer.hideEditorDialogs();
		this.saveObjectsState(a)
	},
	saveObjectsState: function(m) {
		if (m == null) {
			m = designer.getCurrentStationName()
		}
		if (m == "position") {
			var o = this.element;
			while (o != null) {
				var g = Element.getStyle(o, "display");
				if (g == "none") {
					return
				}
				o = o.parentNode;
				var b = o.tagName;
				if (b && (b.toLowerCase() == "body")) {
					break
				}
			}
			if (!htmlDesignMode) {
				for (var a = 0; a < this.gobjects.length; a++) {
					if (this.gobjects[a].makeTextBoxXML) {
						this.gobjects[a].makeTextBoxXML()
					}
				}
			}
		}
	},
	verify: function() {
		var b = "";
		for (var a = 0; a < this.gobjects.length; a++) {
			b += this.verifyDrawingObject(this.gobjects[a])
		}
		return b
	},
	verifyDrawingObject: function(a) {
		var z = "";
		if (a.type == "textarea" && a.defaultTextLines != null) {
			var b = parseInt(a.defaultTextLines);
			var y = a.value;
			var m = y.split("\n");
			for (var r = 0; r < m.length; r++) {
				var u = htmlEncode(m[r]);
				if (is_ie) {
					var x = u.length;
					if (x > 0) {
						var g = u.charCodeAt(x - 1);
						if (g == 10 || g == 13) {
							u = u.substring(0, x - 1)
						}
					}
				}
				for (var o = 0; o < b; o++) {
					var q = a["defaultText" + o];
					if (u.length == 0) {
						continue
					}
					if (u == q) {
						z += "<br/>" + u;
						break
					}
				}
			}
		}
		return z
	},
	setOverlayImage: function(a) {
		this.imageFile = a.overlayImage;
		if (this.backGroundImage == null) {
			var b = this.element;
			this.backGroundImage = document.createElement("img");
			this.backGroundImage.style.padding = "0px";
			this.backGroundImage.hspace = "0";
			this.backGroundImage.vspace = "0";
			this.backGroundImage.src = baseImageURL + a.overlayImage;
			this.backGroundImage.style.zIndex = this.overlayImageLevel;
			this.backGroundImage.style.position = "absolute"
		} else {
			this.backGroundImage.src = baseImageURL + a.overlayImage
		}
	},
	clearBackgroundImage: function() {
		if (this.backGroundImage != null) {
			this.element.removeChild(this.backGroundImage);
			this.backGroundImage = null
		}
	},
	clearSurface: function() {
		if (this.selectedObject != null) {
			this.selectedObject.unselect();
			if (this.hasOverLayImage && this.selectedObject.element != null) {
				this.selectedObject.element.style.zIndex = this.selectedObject.level
			}
			this.selectedObject = null;
			this.selectionTool.setDrawingObject(this.selectedObject);
			this.designer.updateSelection(this.selectedObject)
		}
		this.zoomFactor = 1;
		imageTables.length = 0;
		this.gridLines = new Array();
		this.clearAll();
		this.backGroundImage = null
	},
	unselect: function() {
		if (this.selectedObject != null) {
			this.selectedObject.unselect();
			if (this.hasOverLayImage && this.selectedObject.element != null) {
				this.selectedObject.element.style.zIndex = this.selectedObject.level
			}
			this.selectedObject = null;
			this.selectionTool.setDrawingObject(this.selectedObject);
			this.designer.updateSelection(this.selectedObject)
		}
		this.unselectGroup()
	},
	beginPaint: function() {
		this.resetCanvasPosition();
		setTimeout(this._paint2.bind(this), 10)
	},
	paint2: function() {
		this.resetCanvasPosition();
		setTimeout(this._paint2.bind(this), 0)
	},
	paint: function() {},
	_paint2: function() {
		if (!this._elementCreated) {
			return
		}
		var m;
		if (!designer.modeSwitchDone) {
			if (designer.currentTextEditorMode == INLINE_FORM_MODE) {
				m = $("vRuler");
				m.hide();
				m = $("hRuler");
				m.hide();
				m = $("rightCol1");
				if (m) {
					m.show()
				}
				m = $("rightCol2");
				if (m) {
					m.hide()
				}
				m = $("customizationTB");
				if (m) {
					m.hide()
				}
				m = $("canvasTD");
				m = $("formFillModeToolBar");
				if (m) {
					m.show()
				}
			} else {
				m = $("rightCol1");
				if (m) {
					m.hide()
				}
				m = $("rightCol2");
				if (m) {
					m.show()
				}
				m = $("customizationTB");
				if (m) {
					m.show()
				}
				m = $("canvasTD");
				if (m) {
					m.className = "canvasTD"
				}
				m = $("formFillModeToolBar");
				if (m) {
					m.hide()
				}
			}
		}
		this.resetCanvasPosition();
		removeAll(this.element);
		this.clear();
		this.paint();
		var g = isFinalReviewOrPast(designer.getCurrentStationName());
		if ((!this.isViewOnly() || g) && (this.backGroundImage == null || !designer.hideTrimLines)) {
			for (var b = 0; b < this.borderLines.length; b++) {
				if (!designer.hideTrimLines && this.hideBleed && b > 7) {
					continue
				}
				if (!designer.hideTrimLines && this.hideCut && b < 4) {
					continue
				}
				if (this.hideSafety && (b > 3 && b < 8)) {
					continue
				}
				this.borderLines[b].clip();
				this.borderLines[b].paint()
			}
		}
		if (this.designer.isGridShown()) {
			for (var b = 0; b < this.gridLines.length; b++) {
				this.gridLines[b].clip();
				this.gridLines[b].paint()
			}
		}
		if (this.backGroundImage != null && this.hasOverLayImage && !isFinalReviewOrPast(designer.getCurrentStationName())) {
			this.backGroundImage.style.width = this.element.offsetWidth + "px";
			this.backGroundImage.style.height = this.element.offsetHeight + "px";
			this.backGroundImage.style.left = ( - this.viewPortX1 + this.offsetLeft) + "px";
			this.backGroundImage.style.top = ( - this.viewPortY1 + this.offsetTop) + "px";
			this.element.appendChild(this.backGroundImage)
		}
		for (var b = 0; b < this.gobjects.length; b++) {
			this.gobjects[b].clip();
			this.gobjects[b].paint(this);
			var r = this.hideLines ? (parseInt(MARGIN_BLEED_SAFETY_PX * this.zoomFactor)) : 0;
			if (g) {
				m = this.gobjects[b].element;
				m.style.clip = "rect(" + (r) + "px " + (m.offsetWidth - r) + "px " + (m.offsetHeight - r) + "px " + (r) + "px )"
			} else {
				m = this.element;
				if (this.hideLines) {
					m.style.clip = "rect(" + (r) + "px " + (m.offsetWidth - r) + "px " + (m.offsetHeight - r) + "px " + (r) + "px )"
				} else {
					var a = navigator.userAgent.toLowerCase();
					var q = false;
					if (a.indexOf("msie ") != -1) {
						var o = parseFloat(a.substring(a.indexOf("msie ") + 5));
						if (o == 7) {
							q = true
						}
					}
					if (!q) {
						m.style.clip = "auto"
					}
				}
			}
			if (isFinalReviewOrPast(designer.getCurrentStationName())) {
				break
			}
		}
		this.selectionTool.repositionTools();
		if (!this.designer.borderLineDlgClosed && this.designer.borderLinesDlgDiv != null) {
			this.element.appendChild(this.designer.borderLinesDlgDiv)
		}
		if (designer.getCurrentStationName() == "position") {
			setTimeout(this.doCalloutLogic.bind(this), 10)
		}
		actionHandler.positionRuler();
		if (!this.checkedAndGenerateImage) {
			setTimeout(this.checkAndGenerateImage.bind(this), 200)
		} else {
			if (this.generatePersistedText) {
				setTimeout(this.generateImageForRestoringTags.bind(this), 200);
				this.generatePersistedText = false
			}
		}
		if (designer.currentTextEditorMode != NO_FORM_MODE) {
			if (!designer.modeSwitchDone || (designer.multiRTEEditor && designer.multiRTEEditor.canvas != this)) {
				designer.modeSwitchDone = true;
				this.showHideCurtain();
				this.editText()
			}
		}
	},
	doCalloutLogic: function() {
		designer.placementHelp();
		designer.bleedingHelp()
	},
	addGridLines: function() {
		this.gridLines.length = 0;
		if (MARGIN_BLEED_SAFETY_PX < 12) {
			return
		}
		var b = parseInt(this.gridw * this.zoomFactor);
		var r = parseInt(this.gridh * this.zoomFactor);
		var m = parseInt(this.gridx * this.zoomFactor);
		var g = m + b;
		var q = parseInt(this.gridy * this.zoomFactor);
		var o = q + r;
		for (var a = m + MARGIN_BLEED_SAFETY_PX; a < g; a += MARGIN_BLEED_SAFETY_PX) {
			this.gridLines.push(this.addGridVLine(a, q, 1, r, "808080"))
		}
		for (var u = q + MARGIN_BLEED_SAFETY_PX; u < o; u += MARGIN_BLEED_SAFETY_PX) {
			this.gridLines.push(this.addGridHLine(m, u, b, 1, "808080"))
		}
	},
	setDrawingObjects: function(q, o, a) {
		this.hasOverLayImage = a.hasOverLayImage == "true";
		this["ArtworkDisplayName"] = q.ArtworkDisplayName;
		if (q.guideStatus != null) {
			this.guideStatusList = q.guideStatus
		}
		this.dataFile = q.DataFile;
		this.dataFileDisplayName = q.DataFileDisplayName;
		if (q.bleedCallout) {
			this.bleedCallout = q.bleedCallout.toLowerCase() == "true"
		}
		if (q.placementCallout) {
			this.placementCallout = q.placementCallout.toLowerCase() == "true"
		}
		this.encoding = o;
		var m = q.dw;
		if (m == null) {
			return
		}
		for (var g = 0; g < m.length; g++) {
			var b = m[g];
			this.setOneDrawingObject(q, b, o)
		}
		if (this.br != null) {
			this.br.executeRules2()
		}
		if (a.generateImage == "true") {
			this.generatePersistedText = true
		}
	},
	makePortrait: function() {
		if (this.ds.orientation == "tall") {
			this.ds.orientation = "wide";
			this.reinitDrawingSurface()
		}
		return false
	},
	makeLandscape: function() {
		if (this.ds.orientation == "wide") {
			this.ds.orientation = "tall";
			this.reinitDrawingSurface()
		}
		return false
	},
	reinitDrawingSurface: function(a) {
		var b = this.zoomFactor;
		this.zoomFactor = 1;
		this.applyTemplate();
		if (b != this.zoomFactor) {
			this._zoom(b)
		}
		this.paint2();
		if (this.br != null) {
			this.br.executeRules(a)
		}
	},
	getDSPhysicalSize: function(a) {
		return getDSPhysicalSize(a || this.ds)
	},
	setDSElementSize: function(r, q) {
		var a;
		var m;
		var x = this.getDSPhysicalSize(this.ds);
		a = x.w;
		m = x.h;
		if (isFinalReviewOrPast(designer.getCurrentStationName())) {
			var y = designer.artwork.orientation;
			if ((y == "tall" && m < a) || (y == "wide" && a < m)) {
				var g = m;
				m = a;
				a = g
			}
		}
		var b = this.ds.unit;
		if (b == "inch") {
			if (a == null) {
				a = 6
			}
			if (m == null) {
				m = 4
			}
			this.element.style.width = inchToPx((parseFloat(a) + MARGIN_BLEED_SAFETY * 2) * this.zoomFactor) + "px";
			this.element.style.height = inchToPx((parseFloat(m) + MARGIN_BLEED_SAFETY * 2) * this.zoomFactor) + "px"
		} else {
			b = "px";
			if (a == null) {
				a = 432
			}
			if (m == null) {
				m = 288
			}
			this.element.style.width = inchToPx(a * this.zoomFactor) + "px";
			this.element.style.height = inchToPx(m * this.zoomFactor) + "px"
		}
	},
	applyTemplate: function(q) {
		if (q) {
			this.ds = q
		} else {
			q = this.ds
		}
		this.id = this.ds.__id;
		if (q.marginShape == null) {
			if (q.overlayImage != null) {
				q.marginShape = "ellipse"
			} else {
				q.marginShape = "standard"
			}
		}
		var B;
		var x;
		var z = this.getDSPhysicalSize(this.ds);
		B = z.w;
		x = z.h;
		if (isFinalReviewOrPast(designer.getCurrentStationName())) {
			var m = designer.artwork.orientation;
			if ((m == "tall" && x < B) || (m == "wide" && B < x)) {
				var F = x;
				x = B;
				B = F
			}
		}
		var D = this.ds.unit;
		this.borderLines.length = 0;
		this.dx = 0;
		this.dy = 0;
		if (D == "inch") {
			if (B == null) {
				B = 6
			}
			if (x == null) {
				x = 4
			}
			this.element.style.width = inchToPx((parseFloat(B) + MARGIN_BLEED_SAFETY * 2) * this.zoomFactor) + "px";
			this.element.style.height = inchToPx((parseFloat(x) + MARGIN_BLEED_SAFETY * 2) * this.zoomFactor) + "px";
			this.trimW = this.element.offsetWidth;
			this.trimH = this.element.offsetHeight;
			var G = MARGIN_BLEED_SAFETY_PX;
			var E = MARGIN_BLEED_SAFETY_PX;
			this.dx = G;
			this.dy = E;
			this.bleedLineXMargin = G;
			this.bleedLineYMargin = E;
			this.bleedLineXAdjust = G;
			this.bleedLineYAdjust = E;
			var b = G * 2;
			var A = E * 2;
			var r = this.element.offsetWidth - G * 4 - 1;
			var y = this.element.offsetHeight - E * 4 - 1;
			if (this.cropMode) {
				this.gridx = 0;
				this.gridy = 0;
				this.gridw = this.element.offsetWidth;
				this.gridh = this.element.offsetHeight
			} else {
				this.gridx = b;
				this.gridy = A;
				this.gridw = r;
				this.gridh = y
			}
			this.borderLines[4] = this.addBorderVLine(b - 1, A, 1, y, "0066CC", "dotted", 300002);
			this.borderLines[5] = this.addBorderHLine(b - 1, A, r + 2, 1, "0066CC", "dotted", 300002);
			this.borderLines[6] = this.addBorderVLine(b + r + 1, A, 1, y, "0066CC", "dotted", 300002);
			this.borderLines[7] = this.addBorderHLine(b - 1, A + y, r + 2, 1, "0066CC", "dotted", 300002);
			this.addTrimLines();
			this.addGridLines()
		} else {
			D = "px";
			if (B == null) {
				B = 432
			}
			if (x == null) {
				x = 288
			}
			this.element.style.width = (B * this.zoomFactor) + "px";
			this.element.style.height = (x * this.zoomFactor) + "px"
		}
		this.sfx1 = b;
		this.sfx2 = b + r;
		this.sfy1 = A;
		this.sfy2 = A + y;
		this.unit = D;
		if (this.element.offsetHeight > this.MAX_HEIGHT) {
			this.scroller.style.height = this.MAX_HEIGHT + "px"
		}
		var a = document.getElementById("MainArea");
		var g = parent.designerFrame;
		if (g != null && a != null) {
			try {
				var x = a.offsetHeight;
				if (x < 740) {
					x = 740
				}
				g.resizeTo(910, x)
			} catch(C) {}
		}
		this.resetCanvasPosition();
		this.updateScroll();
		if (q.overlayImage != null) {
			this.setOverlayImage(q)
		} else {
			this.clearBackgroundImage()
		}
	},
	setHideTrimLines: function(a) {
		this.hideLines = a;
		this.addTrimLines()
	},
	addTrimLines: function() {
		var r;
		var o;
		var g = parseInt(MARGIN_BLEED_SAFETY_PX * this.zoomFactor);
		o = this.trimH * this.zoomFactor - g * 2;
		r = this.trimW * this.zoomFactor - g * 2;
		var q = 1;
		if (this.hideLines) {
			var u = parseInt(MARGIN_BLEED_SAFETY_PX * this.zoomFactor);
			q = u;
			var a = "solid";
			var b = "transparent"
		} else {
			var u = 1;
			var a = "dashed";
			var b = "333333"
		}
		this.borderLines[0] = this.addBorderVLine(g, g, u, o, b, a, 200002);
		this.borderLines[1] = this.addBorderHLine(g, g, r, u, b, a, 200002);
		this.borderLines[2] = this.addBorderVLine(g + r - q, g, u, o, b, a, 200002);
		this.borderLines[3] = this.addBorderHLine(g, g + o - q, r, u, b, a, 200002);
		if (this.hideLines) {
			for (var m = 0; m < 4; m++) {
				this.borderLines[m].element.className = "SafetyAreaMask HiddenMask"
			}
		}
		o = this.trimH * this.zoomFactor;
		r = this.trimW * this.zoomFactor;
		var x = designer.isReaderSpreadFR();
		q = 1;
		if (this.hideLines) {
			var u = parseInt(MARGIN_BLEED_SAFETY_PX * this.zoomFactor);
			q = u;
			var a = "solid";
			var b = x ? "ffffff": "transparent"
		} else {
			var u = 1;
			var a = "dashed";
			var b = "FF3333"
		}
		this.borderLines[8] = this.addBorderVLine(0, 0, u, o, b, a, 200002);
		this.borderLines[9] = this.addBorderHLine(0, 0, r, u, b, a, 200002);
		this.borderLines[10] = this.addBorderVLine(r - q, 0, u, o, b, a, 200002);
		this.borderLines[11] = this.addBorderHLine(0, o - q, r, u, b, a, 200002);
		if (this.hideLines) {
			for (var m = 8; m < 12; m++) {
				this.borderLines[m].element.className = "BleedAreaMask HiddenMask"
			}
		}
	},
	addBorderVLine: function(b, u, g, o, m, a, r) {
		var q = new Af.VLineObject(b, u, g, o, null, null, m);
		if (r != null) {
			q.setLevel(r)
		}
		q.backgroundColor = "#f2f2f2";
		q.moveable = false;
		this.printable = false;
		q.borderStyle = a;
		q.canvas = this;
		q.initialSetup(this.zoomFactor);
		q.createElement();
		if (MARGIN_BLEED_SAFETY_PX == 0) {
			q.element.style.visibility = "hidden"
		}
		return q
	},
	addBorderHLine: function(b, u, g, o, m, a, r) {
		var q = new Af.HLineObject(b, u, g, o, null, null, m);
		if (r != null) {
			q.setLevel(r)
		}
		q.backgroundColor = "#f2f2f2";
		q.moveable = false;
		this.printable = false;
		q.borderStyle = a;
		q.canvas = this;
		q.initialSetup(this.zoomFactor);
		q.createElement();
		if (MARGIN_BLEED_SAFETY_PX == 0) {
			q.element.style.visibility = "hidden"
		}
		return q
	},
	addGridVLine: function(a, q, b, m, g) {
		var o = new Af.VLineObject(a, q, b, m, null, null, g, 10000);
		o.moveable = false;
		this.printable = false;
		o.borderStyle = "solid";
		o.canvas = this;
		o.initialSetup(this.zoomFactor);
		o.className = "gridline";
		if (this.cropMode) {
			o.className = "crop_gridline"
		} else {
			o.className = "gridline"
		}
		o.createElement();
		return o
	},
	addGridHLine: function(a, q, b, m, g) {
		var o = new Af.HLineObject(a, q, b, m, null, null, g, 10000);
		o.moveable = false;
		this.printable = false;
		o.borderStyle = "solid";
		o.canvas = this;
		o.initialSetup(this.zoomFactor);
		if (this.cropMode) {
			o.className = "crop_gridline"
		} else {
			o.className = "gridline"
		}
		o.createElement();
		return o
	},
	setOneDrawingObject: function(q, a, m, z) {
		if (!a.x) {
			a.x = 0
		}
		if (!a.y) {
			a.y = 0
		}
		if (m != null) {
			var A = parseFloat(m);
			if (A >= 0.1) {
				a.x = parseInt(a.x) + this.bleedLineXMargin;
				a.y = parseInt(a.y) + this.bleedLineYMargin
			}
		} else {
			a.x = parseInt(a.x) - this.bleedLineXAdjust;
			a.y = parseInt(a.y) - this.bleedLineYAdjust
		}
		var r = null;
		if (a.type == "textarea" || a.type == "text") {
			r = new Af.TextAreaObject(a.UUID, a.name);
			if (a.imageFile) {
				r.imageFile = a.imageFile
			}
			if (typeof a.customText !== "undefined") {
				r.customText = this.convertToBooleanSpl(a.customText)
			}
		} else {
			if (a.type == "vline") {
				r = new Af.VLineObject(a.x, a.y, a.w, a.h, a.UUID, a.name, a.color)
			} else {
				if (a.type == "hline") {
					r = new Af.HLineObject(a.x, a.y, a.w, a.h, a.UUID, a.name, a.color)
				} else {
					if (a.type == "rectangle") {
						r = new Af.RectangleObject(a.x, a.y, a.w, a.h, a.UUID, a.name, a.color, a.backgroundColor, a.borderWidth)
					} else {
						if (a.type == "image") {
							if (a.w == "NaN" || a.h == "NaN") {
								a.w = -1;
								a.h = -1
							}
							r = new Af.ImageObject(a.x, a.y, a.w, a.h, a.imageFile, a.UUID, a.name, a.mediaid);
							r._imageFile_ = a._imageFile_;
							r.oldObject = true;
							r.baseUrlId = a.baseUrlId
						}
					}
				}
			}
		}
		if (r == null) {
			return r
		}
		if (a.fontFamily != null) {
			r.fontFamily = a.fontFamily
		}
		if (a.borderWidth != null) {
			r.borderWidth = a.borderWidth
		}
		if (a.borderStyle != null) {
			r.borderStyle = a.borderStyle
		}
		if (a.borderColor != null) {
			r.borderColor = a.borderColor
		}
		if (a.backgroundColor != null) {
			r.backgroundColor = a.backgroundColor
		}
		if (a.color != null) {
			r.color = a.color
		}
		if (a.fontSize != null) {
			r.fontSize = a.fontSize;
			r.oFontSize = a.fontSize
		}
		if (a.fontWeight != null) {
			r.fontWeight = a.fontWeight
		}
		if (a.fontStyle != null) {
			r.fontStyle = a.fontStyle
		}
		if (a.textDecoration != null) {
			r.textDecoration = a.textDecoration
		}
		if (a.textAlign != null) {
			r.textAlign = a.textAlign
		}
		if (a.ts != null) {
			r.ts = a.ts
		}
		var y;
		if (a.deleteable != null) {
			r.deleteable = this.convertToBooleanSpl(a.deleteable)
		}
		if (a.moveable != null) {
			r.moveable = this.convertToBooleanSpl(a.moveable)
		}
		if (a.resizable != null) {
			r.resizable = this.convertToBooleanSpl(a.resizable)
		}
		if (a.selectable != null) {
			r.selectable = this.convertToBooleanSpl(a.selectable)
		}
		if (a.editable != null) {
			r.editable = this.convertToBooleanSpl(a.editable)
		}
		if (a.printable != null) {
			r.printable = this.convertToBooleanSpl(a.printable)
		}
		if (a.locked != null) {
			r.locked = this.convertToBooleanSpl(a.locked)
		}
		if (a.isBackground != null) {}
		if (a.isReplaced != null) {
			r.isReplaced = a.isReplaced
		}
		r.description = a.description;
		r.prevValue = a.prevValue;
		if (a.ArtworkSource != null) {
			r.ArtworkSource = a.ArtworkSource
		}
		if (a.art_width != null) {
			r.art_width = parseFloat(a.art_width)
		}
		if (a.art_height != null) {
			r.art_height = parseFloat(a.art_height)
		}
		if (a.artworkResolution != null) {
			r.artworkResolution = parseFloat(a.artworkResolution)
		}
		if (a.originalResolution != null) {
			r.originalResolution = parseFloat(a.originalResolution)
		}
		if (a.artworkHResolution != null) {
			r.artworkHResolution = parseFloat(a.artworkHResolution)
		}
		if (a.artworkVResolution != null) {
			r.artworkVResolution = parseFloat(a.artworkVResolution)
		}
		if (a.cameraModel != null) {
			r.cameraModel = a.cameraModel
		}
		if (a.cameraManufacturer != null) {
			r.cameraManufacturer = a.cameraManufacturer
		}
		if (a.artworkHighResFile != null) {
			r.artworkHighResFile = a.artworkHighResFile
		}
		if (a.previewImageFile != null) {
			r.previewImageFile = a.previewImageFile
		}
		if (a.outputOverlay != null) {
			r.outputOverlay = a.outputOverlay
		}
		if (a.enforceSafety != null) {
			r.enforceSafety = a.enforceSafety
		}
		if (a.logoImage != null) {
			r.logoImage = a.logoImage
		}
		if (a.placeHolderImage != null) {
			r.placeHolderImage = a.placeHolderImage
		}
		if (a.calloutText != null) {
			r.calloutText = a.calloutText
		}
		if (a.rotationAngle != null) {
			r.rotationAngle = a.rotationAngle
		}
		if (a.level != null) {
			r.setLevel(a.level)
		}
		if (a.subType != null) {
			r.subType = a.subType;
			if (a.subType == "overlay") {
				r.resizable = false;
				r.deleteable = false;
				r.level = this.overlayImageLevel + 1
			}
		}
		r.displayName = a.displayName;
		r.artworkName = a.artworkName;
		r.action = a.action;
		r.value = r.description;
		if (a.bgCleared != null) {
			r.bgCleared = this.convertToBooleanSpl(a.bgCleared)
		}
		r.canvas = this;
		r.x = parseFloat(a.x);
		r.y = parseFloat(a.y);
		r.w = parseFloat(a.w);
		r.h = parseFloat(a.h);
		r.oldH = r.h;
		if (a.autoH != null) {
			r.autoH = parseFloat(a.autoH)
		}
		if (a.changed == "true") {}
		if (a.originalImage) {
			r.originalImage = a.originalImage;
			r.originalImageWidth = a.originalImageWidth;
			r.originalImageHeight = a.originalImageHeight;
			r.cx = parseFloat(a.cx);
			r.cy = parseFloat(a.cy);
			r.cw = parseFloat(a.cw);
			r.ch = parseFloat(a.ch)
		}
		r.initialSetup(this.zoomFactor);
		if (q && this.gobjects.length == 0 && this.cropMode) {
			r.mainImage = true;
			r.previewImageFile = q.previewImageFile;
			r.ts = q.ts
		}
		if (a.subType == "overlay") {
			this.displayFoldingCallout(r)
		}
		if (!z) {
			this.gobjects.push(r)
		}
		if (a.defaultTextLines != null) {
			var o = parseInt(a.defaultTextLines);
			r.defaultTextLines = o;
			for (var x = 0; x < o; x++) {
				r["defaultText" + x] = a["defaultText" + x]
			}
		}
		r.textBoxXML = "";
		var u = a.dw;
		if (u != null) {
			for (var x = 0; x < u.length; x++) {
				var g = u[x];
				if (g.type == "textbox") {
					var B = '<dw class="DrawingObject">\n';
					B += "\t<type>textbox</type>\n";
					B += "\t<x>" + g.x + "</x>\n";
					B += "\t<y>" + g.y + "</y>\n";
					B += "\t<w>" + g.w + "</w>\n";
					B += "\t<h>" + g.h + "</h>\n";
					if (g.fontWeight) {
						B += "\t<fontWeight>" + g.fontWeight + "</fontWeight>\n"
					}
					if (g.fontStyle) {
						B += "\t<fontStyle>" + g.fontStyle + "</fontStyle>\n"
					}
					if (g.textDecoration) {
						B += "\t<textDecoration>" + g.textDecoration + "</textDecoration>\n"
					}
					if (g.backgroundColor) {
						B += "\t<backgroundColor>" + g.backgroundColor + "</backgroundColor>\n"
					}
					if (g.color) {
						B += "\t<color>" + g.color + "</color>\n"
					}
					if (g.fontFamily) {
						B += "\t<fontFamily>" + g.fontFamily + "</fontFamily>\n"
					}
					if (g.textAlign) {
						B += "\t<textAlign>" + g.textAlign + "</textAlign>\n"
					}
					B += "\t<text>" + htmlEncode(g.text) + "</text>\n";
					B += "</dw>\n";
					r.textBoxXML += B
				}
			}
		}
		r.dw = a;
		return r
	},
	convertToBooleanSpl: function(a) {
		if (a == null) {
			return true
		}
		a = a.toLowerCase(a);
		if (a == "false") {
			return false
		}
		return true
	},
	copyObject: function(b) {
		var m = null;
		if (b.type == "textarea" || b.type == "text") {
			m = new Af.TextAreaObject()
		} else {
			if (b.type == "vline") {
				m = new Af.VLineObject(b.x, b.y, b.w, b.h, null, null, b.color)
			} else {
				if (b.type == "hline") {
					m = new Af.HLineObject(b.x, b.y, b.w, b.h, null, null, b.color)
				} else {
					if (b.type == "rectangle") {
						m = new Af.RectangleObject(b.x, b.y, b.w, b.h, null, null, b.color, b.backgroundColor, b.borderWidth)
					} else {
						if (b.type == "image") {
							m = new Af.ImageObject(b.x, b.y, b.w, b.h, b.imageFile, null, null, b.mediaid);
							m.oldObject = b.oldObject;
							m.baseUrlId = b.baseUrlId
						}
					}
				}
			}
		}
		if (m == null) {
			return m
		}
		for (var g in b) {
			var a = b[g];
			if (g.indexOf("__") == 0) {
				continue
			}
			if (typeof a == "function" || a instanceof Array) {
				continue
			}
			if (g != "class" && g != "atype" && g != "extend" && g != "id" && g != "imageFile" && g != "unit" && g != "mainImage" && g != "isBackground" && a != null) {
				m[g] = a
			}
		}
		m.x = parseInt(b.x);
		m.y = parseInt(b.y);
		m.w = parseInt(b.w);
		m.h = parseInt(b.h);
		return m
	},
	getUniqueDWName: function(q, o) {
		var b = this.gobjects;
		var r = 2;
		var m = true;
		var a;
		while (m) {
			m = false;
			a = q + " (" + r + ")";
			for (var g = 0; g < b.length; g++) {
				if (b[g][o] == a) {
					m = true;
					break
				}
			}
			r++
		}
		return a
	},
	disableEditing: function(a) {
		this.editingDisabled = a
	},
	disableUpload: function(a) {
		this.uploadDisabled = a
	},
	activate: function() {
		if (!this._elementCreated) {
			for (var a = 0; a < this.gobjects.length; a++) {
				var b = this.gobjects[a];
				b.createElement()
			}
			this._zoom(designer.zoomFactor);
			this._elementCreated = true
		}
		if (this.ds) {
			this.setDSElementSize(this.ds, isFinalReviewOrPast(designer.getCurrentStationName()))
		}
		if (this.br != null) {
			this.br.executeRules(false, false, true)
		}
		if (!this.editingDisabled) {
			this.element.onclick = this.clickOnDesignSurface.bindAsEventListener(this);
			this.element.onmousedown = this.mouseDownOnDesignSurface.bindAsEventListener(this);
			this.element.onkeydown = this.keyDown.bindAsEventListener(this);
			document.onkeydown = this.keyDown.bindAsEventListener(this)
		} else {
			this.element.onclick = null;
			this.element.onmousedown = null;
			this.element.onkeydown = null;
			document.onkeydown = null
		}
		if ((this.uploadDisabled && this.editingDisabled) || cropFunctionOn) {
			this.element.ondblclick = null
		} else {
			this.element.ondblclick = this.dblClickOnDesignSurface.bindAsEventListener(this)
		}
		if (this.scroller != null) {
			this.scroller.onscroll = this.handleScroll.bindAsEventListener(this);
			this.updateScroll()
		}
		if (designer.getCurrentStationName() != "position") {
			this.selectObject(null)
		}
		this.populateImageBox()
	},
	deactivate: function() {
		this.selectObject(null);
		if (docuploader && docuploader.dialog) {
			docuploader.dialog.hide()
		}
		this.selectedObject = null;
		this.element.onclick = null;
		this.element.onmousedown = null;
		this.element.onkeydown = null;
		document.onkeydown = null;
		if (this.scroller != null) {
			this.scroller.onscroll = null
		}
	},
	keyDown: function(u) {
		if (this.isViewOnly()) {
			return
		}
		var m = true;
		var q = u.target ? u.target: u.srcElement;
		var x = u.keyCode ? u.keyCode: u.which;
		if (q.contentEditable + "" == "true") {
			if (x == 9 && designer.multiRTEEditor && designer.multiRTEEditor.visible) {
				var o;
				if (u.shiftKey) {
					o = designer.multiRTEEditor.doPrevTab(q)
				} else {
					o = designer.multiRTEEditor.doTab(q)
				}
				if (o) {
					return consumeEvent(u)
				}
			}
			return true
		}
		var g = q.tagName.toLowerCase();
		if (g == "select") {
			return false
		}
		if ((g != "textarea" && !(g == "input" && q.type == "text")) && (x == 8)) {
			this.consume(u);
			if (this.selectedObject != null) {
				this.deleteSelectedObject()
			}
			return false
		}
		if (u.ctrlKey) {
			if (x == 90) {
				m = this.consume(u);
				this.designer.undo()
			} else {
				if (x == 89) {
					m = this.consume(u);
					this.designer.redo()
				} else {
					if (x == 88) {
						m = this.consume(u);
						this.cut()
					} else {
						if (x == 86) {
							m = this.consume(u);
							this.paste()
						} else {
							if (x == 66) {
								m = this.consume(u);
								this.bold()
							} else {
								if (x == 67) {
									m = this.consume(u);
									this.copy()
								} else {
									if (x == 73) {
										m = this.consume(u);
										this.italic()
									} else {
										if (x == 85) {
											m = this.consume(u);
											this.underline()
										} else {
											if (x == 82) {
												m = this.consume(u);
												this.alignRight()
											} else {
												if (x == 69) {
													m = this.consume(u);
													this.alignCenter()
												} else {
													if (x == 76) {
														m = this.consume(u);
														this.alignLeft()
													} else {
														if (x == 74) {
															m = this.consume(u);
															this.justify()
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		} else {
			if (this.selectedObject != null) {
				if (q.tagName == "TEXTAREA") {
					return true
				}
				var b = 0;
				var a = 0;
				if (x == 37) {
					m = this.consume(u);
					b = -1
				} else {
					if (x == 38) {
						m = this.consume(u);
						a = -1
					} else {
						if (x == 39) {
							m = this.consume(u);
							b = 1
						} else {
							if (x == 40) {
								m = this.consume(u);
								a = 1
							} else {
								if (x == 46) {
									m = this.consume(u);
									this.deleteSelectedObject()
								}
							}
						}
					}
				}
				if (b != 0 || a != 0) {
					if (!this.isLocked("Move")) {
						this.selectedObject.move(b, a);
						this.constrainMove(this.selectedObject);
						this.selectionTool.repositionTools();
						if (this.br != null) {
							if (this.selectedObject.mainImage) {
								this.br.executeOneObjRule(this.selectedObject, false, true, true)
							} else {
								this.br.executeOverlappingObjGuide(true)
							}
						}
					}
				}
			}
		}
		return m
	},
	keyDown2: function(b) {
		var a = b.target ? b.target: b.srcElement;
		var g = b.keyCode ? b.keyCode: b.which;
		if (a.tagName != "TEXTAREA" && (g == 8)) {
			this.consume(b);
			return false
		}
	},
	consume: function(a) {
		Event.stop(a);
		return false
	},
	clickOnDesignSurface: function(b) {
		if (this.isViewOnly()) {
			return
		}
		designer.hidePopups();
		var a = b.clientX + docScrollLeft() + this.viewPortX1 - this.offsetLeft - this.eventXOffset;
		var g = b.clientY + docScrollTop() + this.viewPortY1 - this.offsetTop - this.eventYOffset;
		this.previousX = a;
		this.previousY = g;
		return true
	},
	selectObject: function(g) {
		this.unselectGroup();
		if (this.selectedObject == g) {
			if (this.selectedObject != null) {
				this.selectedObject.postSelect()
			}
			return
		}
		if (this.selectedObject != null) {
			this.selectedObject.unselect();
			if (this.selectedObject.type == "textarea") {
				if (window.getSelection) {
					var a = window.getSelection();
					if (a) {
						a.removeAllRanges()
					}
				}
			}
			if (this.hasOverLayImage) {
				this.selectedObject.element.style.zIndex = this.selectedObject.level
			}
		}
		this.selectedObject = g;
		if (this.selectedObject != null) {
			this.selectedObject.select();
			if (this.hasOverLayImage) {}
		}
		if (this.designer.rteEditor) {
			this.designer.rteEditor.setSelectedObj(this.selectedObject)
		}
		if (designer.multiRTEEditor != null && designer.multiRTEEditor.visible) {
			designer.multiRTEEditor.setSelectedObj(this.selectedObject)
		}
		this.selectionTool.setDrawingObject(this.selectedObject);
		this.designer.updateSelection(this.selectedObject);
		var b = document.getElementById("ImageLibraryTitleDiv");
		if (b) {
			b.style.display = "none"
		}
		var b = document.getElementById("ImageLibraryDiv");
		if (b) {
			b.style.display = "none"
		}
	},
	unselectGroup: function() {
		if (this.groupSelections.length > 0) {
			for (var a = 0; a < this.groupSelections.length; a++) {
				var b = this.groupSelections[a];
				this.unselectOneInGroup(b)
			}
			this.groupSelections.length = 0
		}
	},
	unselectOneInGroup: function(b) {
		if (b.__selectionLayer) {
			b.unselect();
			try {
				this.element.removeChild(b.__selectionLayer)
			} catch(a) {}
			b.__selectionLayer = null
		}
	},
	addNewObject: function(g, a, q, m) {
		var b = null;
		if (g == "textTool") {
			b = this.addText(a, q, m)
		} else {
			if (g == "textareaTool") {
				b = this.addTextArea(a, q, m)
			} else {
				if (g == "hline") {
					b = this.addHLine(a, q, parseInt(100 * this.zoomFactor), 5)
				} else {
					if (g == "vline") {
						b = this.addVLine(a, q, 5, parseInt(100 * this.zoomFactor))
					} else {
						if (g == "rectangle") {
							b = this.addRectangle(a, q, parseInt(100 * this.zoomFactor), parseInt(100 * this.zoomFactor))
						}
					}
				}
			}
		}
		if (b != null) {
			var o = this.getHighestLevel();
			o += 1;
			b.setLevel(o);
			b.paint();
			if (b.type == "textarea") {
				designer.textListChanged();
				this.generateImage2(b)
			}
			this.selectObject(b);
			if (this.br != null) {
				this.br.executeRules(true)
			}
			if (b.type == "textarea") {
				this.editText()
			} else {
				if (designer.rteEditor != null) {
					designer.rteEditor.hide()
				}
			}
		}
		chgMgr.beginTx();
		chgMgr.addCreateChange(b);
		chgMgr.endTx();
		return b
	},
	_addObject: function(a) {
		this.gobjects.push(a);
		if (a.type == "textarea") {
			designer.textListChanged();
			this.generateImage2(a)
		}
		if (this.br != null) {
			this.br.executeRules(true)
		}
	},
	mouseDownOnDesignSurface: function(m) {
		if (this.isViewOnly()) {
			return
		}
		var g = m.target ? m.target: m.srcElement;
		if (g == this.selectionTool.editTool) {
			return true
		}
		this.msDownX = this.mx1 = m.clientX + docScrollLeft() + this.viewPortX1 - this.offsetLeft - this.eventXOffset;
		this.msDownY = this.my1 = m.clientY + docScrollTop() + this.viewPortY1 - this.offsetTop - this.eventYOffset;
		var b = null;
		b = this.getObjectByXY(this.mx1, this.my1);
		if (m.shiftKey || m.ctrlKey) {
			if (this.selectedObject) {
				this.selectObject(null)
			}
			this.designer.hideEditorDialogs();
			if (b != null) {
				var a = this.groupSelections.indexOf(b);
				if (a < 0) {
					this.groupSelections.push(b);
					this.softSelect(b)
				} else {
					this.groupSelections.splice(a, 1);
					this.unselectOneInGroup(b)
				}
			}
		} else {
			if (this.groupSelections.length > 0) {
				this.unselectGroup()
			}
			if (b != null || (g == this.element || g == this.backGroundImage)) {
				this.selectObject(b)
			}
			if (b != null && b.moveable) {
				this.element.onmousemove = this.mouseMoveOnDrawingObject.bindAsEventListener(this);
				document.onmousemove = this.mouseMoveOnDrawingObject.bindAsEventListener(this);
				this.element.onmouseup = this.mouseUpOnDrawingObject.bindAsEventListener(this);
				document.onmouseup = this.mouseUpOnDrawingObject.bindAsEventListener(this)
			}
			if (b != null && b.moveable && this.hasOverLayImage && this.backGroundImage != null) {
				this.element.onmousemove = this.mouseMoveOnDrawingObject.bindAsEventListener(this);
				this.element.onmouseup = this.mouseUpOnDrawingObject.bindAsEventListener(this)
			}
		}
		if (m.stopPropagation) {
			m.stopPropagation()
		} else {
			m.cancelBubble = true
		}
		if (is_ie) {
			m.returnValue = false;
			return false
		} else {
			var g = m.target ? m.target: m.srcElement;
			if (g.tagName == "TEXTAREA") {
				return true
			}
			return false
		}
	},
	mouseMoveOnDrawingObject: function(o) {
		var a = o.clientX + docScrollLeft() + this.viewPortX1 - this.offsetLeft - this.eventXOffset;
		var q = o.clientY + docScrollTop() + this.viewPortY1 - this.offsetTop - this.eventYOffset;
		var g = a - this.mx1;
		var b = q - this.my1;
		if (!this.moveStarted) {
			if (Math.abs(g) >= 2 || Math.abs(b) >= 2) {
				if (this.isLocked("Move")) {
					if (o.stopPropagation) {
						o.stopPropagation()
					} else {
						o.cancelBubble = true
					}
					o.returnValue = false;
					return false
				}
				this.selectionTool.showProxy();
				this.selectionTool.moveStart();
				this.selectionTool.snapToGrid = this.designer.isSnappingToGrid();
				this.moveStarted = true;
				var m = this.selectionTool.move(g, b);
				this.mx1 += m.x;
				this.my1 += m.y
			}
		} else {
			var m = this.selectionTool.move(g, b);
			this.mx1 += m.x;
			this.my1 += m.y
		}
		if (o.stopPropagation) {
			o.stopPropagation()
		} else {
			o.cancelBubble = true
		}
		o.returnValue = false;
		return false
	},
	mouseUpOnDrawingObject: function(a) {
		this.selectionTool.hideProxy();
		this.element.onmousemove = null;
		document.onmousemove = null;
		this.element.onmouseup = null;
		document.onmouseup = null;
		if (this.hasOverLayImage && this.backGroundImage != null) {
			this.element.onmousemove = null;
			this.element.onmouseup = null
		}
		if (this.moveStarted) {
			this.selectionTool.moveEnd();
			this.moveStarted = false
		} else {
			if (!playMode && this.selectedObject && this.selectedObject.type == "textarea") {
				this.editText()
			}
		}
		if (a.stopPropagation) {
			a.stopPropagation()
		} else {
			a.cancelBubble = true
		}
		a.returnValue = false;
		return true
	},
	getObjectByXY: function(a, u, q) {
		var b = new Array();
		for (var g = 1; g < this.gobjects.length; g++) {
			var r = this.gobjects[g];
			if (r.subType == "overlay" || r.subType == "foldLine") {
				continue
			}
			var m = r.getObjectByXY(a, u, this.selectedObject, q);
			if (m != null) {
				b.push(m)
			}
		}
		if (b.length > 0) {
			b.sort(b[0].levelSort);
			return b[b.length - 1]
		}
		var m;
		if (!q) {
			var m = this.getObjectByXY(a, u, true);
			if (m != null) {
				return m
			}
		}
		if (this.gobjects.length > 0) {
			var r = this.gobjects[0];
			m = r.getObjectByXY(a, u, this.selectedObject)
		}
		return m
	},
	positionSoftSelectAll: function() {
		for (var a = 0; a < this.groupSelections.length; a++) {
			this.positionSoftSelect(this.groupSelections[a])
		}
	},
	softSelect: function(b) {
		if (b.element == null) {
			return
		}
		b.select();
		var a = document.createElement("div");
		a.className = "translucent";
		this.element.appendChild(a);
		b.__selectionLayer = a;
		this.positionSoftSelect(b);
		this.designer.updateSelection(this.selectedObject, this.groupSelections)
	},
	positionSoftSelect: function(b) {
		var a = b.__selectionLayer;
		if (a) {
			a.style.left = b.element.offsetLeft - 2 + "px";
			a.style.top = b.element.offsetTop - 2 + "px";
			a.style.width = (b.element.offsetWidth) + "px";
			a.style.height = (b.element.offsetHeight) + "px"
		}
		this.selectionTool.repositionTools()
	},
	getHighestLevel: function() {
		var b = 0;
		for (var g = 0; g < this.gobjects.length; g++) {
			var q = this.gobjects[g];
			if (q.subType == "overlay" || q.subType == "foldLine") {
				continue
			}
			try {
				var a = parseInt(q.level);
				if (a > b) {
					b = a
				}
			} catch(m) {}
		}
		return b
	},
	cut: function() {
		this.designer.cutObject = this._deleteSelectedObject();
		if (this.designer.cutObject != null) {
			this.pasteX = this.designer.cutObject.x;
			this.pasteY = this.designer.cutObject.y
		}
	},
	copy: function() {
		if (this.selectedObject != null) {
			var a = this.selectedObject;
			this.selectObject(null);
			obj = this.copyObject(a);
			obj.canvas = this;
			obj.createElement();
			if (obj.level != null) {
				obj.setLevel(obj.level)
			}
			this.designer.cutObject = obj;
			this.pasteX = a.x + 10;
			this.pasteY = a.y + 10;
			this.selectObject(a)
		}
	},
	paste: function() {
		if (this.designer.cutObject == null) {
			return
		}
		var a = this.copyObject(this.designer.cutObject);
		a.canvas = this;
		a.x = this.pasteX;
		a.y = this.pasteY;
		a.createElement();
		if (a.level != null) {
			a.setLevel(a.level)
		}
		if (this.designer.cutObject.name != null) {
			a.name = this.getUniqueDWName(this.designer.cutObject.name, "name")
		}
		if (this.designer.cutObject.artworkName != null) {
			a.artworkName = this.getUniqueDWName(this.designer.cutObject.artworkName, "artworkName")
		}
		this.constrainMove(a);
		this.gobjects.push(a);
		this.pasteX += 10;
		this.pasteY += 10;
		a.paint();
		if (a.type == "textarea") {
			designer.textListChanged();
			this.generateImage2(a)
		}
		this.selectObject(a);
		chgMgr.beginTx();
		chgMgr.addCreateChange(a);
		chgMgr.endTx();
		if (this.br != null) {
			this.br.executeRules(true)
		}
	},
	deleteSelectedObject: function() {
		showDeleteDialog("Are you sure you want to delete the selected object?", "Confirm Delete", 500, 70, this._deleteSelectedObject.bind(this))
	},
	clearImageToggle: function(m, a) {
		var g;
		if (a == null) {
			g = null;
			designer.pageNail.changeCurrentTNImage(null)
		} else {
			g = a.dwImage;
			designer.pageNail.setTNImageForIdx(a.selectedIndex, a.tnImage)
		}
		if (this.ds != null) {
			var b = this.ds.dw;
			if (b != null && b.length > 0) {
				b[0].imageFile = g
			}
		}
		this.br.executeOneObjRule(m, true, false, true)
	},
	_deleteSelectedObject: function() {
		hideDialogWin();
		var b = null;
		if (this.selectedObject != null && this.selectedObject.deleteable) {
			if (this.selectedObject.mainImage) {
				var o = this.selectedObject.getBoundsF();
				var a = {};
				a.selectedIndex = designer.pageNail.selectedIndex;
				a.tnImage = designer.pageNail.getCurrentTNImage();
				a.imageFile = this.selectedObject.imageFile;
				a.previewImageFile = this.selectedObject.previewImageFile;
				a.artworkHighResFile = this.selectedObject.artworkHighResFile;
				this.selectedObject.clearImage();
				if (this.ds != null) {
					var q = this.ds.dw;
					if (q != null && q.length > 0) {
						a.dwImage = q[0].imageFile;
						q[0].imageFile = null
					}
				}
				var r = this.element.offsetHeight;
				var m = this.element.offsetWidth;
				this.selectedObject.fitToSize(0, 0, m, r);
				this.selectionTool.repositionTools();
				designer.pageNail.changeCurrentTNImage(null);
				var g = this.selectedObject.getBoundsF();
				chgMgr.beginTx();
				chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.clearImageToggle, a, null, null);
				chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setBoundsF, o, g, null);
				chgMgr.endTx();
				return
			}
			b = this.selectedObject;
			this.selectObject(null);
			this.removeObject(b);
			b.dispose();
			this.selectionTool.setDrawingObject(this.selectedObject);
			this.designer.updateSelection(this.selectedObject);
			chgMgr.beginTx();
			chgMgr.addDeleteChange(b);
			chgMgr.endTx();
			this.element.focus();
			if (this.br != null) {
				this.br.executeRules(true)
			}
			if (b.type == "textarea") {
				designer.textListChanged()
			}
		}
		return b
	},
	_deleteObject: function(a) {
		hideDialogWin();
		this.removeObject(a);
		a.dispose();
		this.element.focus();
		if (this.br != null) {
			this.br.executeRules(true)
		}
		if (a.type == "textarea") {
			designer.textListChanged()
		}
		return a
	},
	deleteTextObject: function(a) {
		showDeleteDialog("Are you sure you want to delete the text object?", "Confirm Delete", 500, 70, this._deleteTextObject.bind(this, a))
	},
	_deleteTextObject: function(a) {
		hideDialogWin();
		this.removeObject(a);
		a.dispose();
		chgMgr.beginTx();
		chgMgr.addDeleteChange(a);
		chgMgr.endTx();
		if (this.br != null) {
			this.br.executeRules(true)
		}
		if (a.type == "textarea") {
			designer.textListChanged()
		}
		if (a == this.selectedObject) {
			this.selectObject(null)
		}
	},
	removeObject: function(o) {
		if (o.element != null) {
			try {
				this.element.removeChild(o.element)
			} catch(a) {}
		}
		var b = new Array();
		var g = 0;
		for (var m = 0; m < this.gobjects.length; m++) {
			if (this.gobjects[m] != o) {
				b.push(this.gobjects[m])
			}
		}
		this.gobjects.length = 0;
		for (m = 0; m < b.length; m++) {
			this.gobjects.push(b[m])
		}
	},
	updateTextFontAndStyles: function(b) {
		if (designer._fontFamily == null) {
			return
		}
		var a = designer._fontFamily.value;
		b.setFontFamily(a);
		a = designer._fontSize.value;
		b.setFontSize(a);
		if (designer._bold.__selected) {
			b.toggleBold()
		}
		if (designer._italic.__selected) {
			b.toggleItalic()
		}
		if (designer._underline.__selected) {
			b.toggleUnderline()
		}
		this.selectionTool.repositionTools()
	},
	fontFamilyChange: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.fontFamily;
			if (designer._fontFamily) {
				a = designer._fontFamily.value
			}
			g.setFontFamily(a);
			this.tempChg = chgMgr.addModifyChangeByMethod(g, g.setFontFamily, b, a, null);
			this.selectionTool.repositionTools()
		}
	},
	fontSizeChange: function() {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.fontSize;
			var a = designer._fontSize.value;
			if (b == a) {
				return
			}
			g.setFontSize(a);
			chgMgr.addModifyChangeByMethod(g, g.setFontSize, b, a, null);
			this.selectionTool.repositionTools()
		}
	},
	setFontSize: function(a) {
		var m = this.selectedObject;
		if (m != null) {
			var b = m.fontSize;
			var g = m.canvas.zoomFactor * parseFloat(a);
			if (b == g) {
				return
			}
			m.setFontSize(a);
			chgMgr.addModifyChangeByMethod(m, m.setFontSize, b, a, null);
			this.selectionTool.repositionTools()
		}
	},
	setFontSize2: function(a) {
		this.setFontSize(a);
		if (this.designer._fontSize) {
			this.designer._fontSize._selComp.setValue(a)
		}
	},
	setFontFamily2: function(a) {
		if (this.designer._fontFamily) {
			this.designer._fontFamily._selComp.setValue(a)
		}
		this.fontFamilyChange(a)
	},
	zoom: function() {
		var a = parseFloat(designer._zoom.value) / 100;
		if (this.zoomFactor != a) {
			this._zoom(a)
		}
	},
	_zoom: function(q) {
		this.zoomFactor = q;
		var a;
		var m;
		var r = this.getDSPhysicalSize(this.ds);
		a = r.w;
		m = r.h;
		var b = this.ds.unit;
		if (b == "inch") {
			if (a == null) {
				a = 6
			}
			if (m == null) {
				m = 4
			}
			this.element.style.width = inchToPx((parseFloat(a) + MARGIN_BLEED_SAFETY * 2) * q) + "px";
			this.element.style.height = inchToPx((parseFloat(m) + MARGIN_BLEED_SAFETY * 2) * q) + "px"
		} else {
			b = "px";
			if (a == null) {
				a = 432
			}
			if (m == null) {
				m = 288
			}
			this.element.style.width = parseInt(parseFloat(a) * q) + "px";
			this.element.style.height = parseInt(parseFloat(m) * q) + "px"
		}
		this.addTrimLines();
		for (var g = 4; g <= 7; g++) {
			this.borderLines[g].zoomLength(q)
		}
		this.addGridLines();
		for (var g = 0; g < this.gobjects.length; g++) {
			var x = this.gobjects[g];
			x.zoom(q)
		}
		this.sfx1 = parseInt(parseFloat(this.gridx) * q);
		this.sfx2 = this.sfx1 + parseInt(parseFloat(this.gridw) * q);
		this.sfy1 = parseInt(parseFloat(this.gridy) * q);
		this.sfy2 = this.sfy1 + parseInt(parseFloat(this.gridh) * q);
		if (this.cropMode) {
			this.sfx1 += parseInt((this.dx * 2) * q);
			this.sfy1 += parseInt((this.dy * 2) * q);
			this.sfx2 -= parseInt((this.dx * 2) * q);
			this.sfy2 -= parseInt((this.dy * 2) * q)
		}
	},
	lineWidthChange: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.borderWidth;
			if (a == b) {
				return
			}
			g.setLineWidth(a);
			chgMgr.addModifyChangeByMethod(g, g.setLineWidth, b, a, null)
		}
	},
	lineStyleChange: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.borderStyle;
			if (a == b) {
				return
			}
			g.setLineStyle(a);
			chgMgr.addModifyChangeByMethod(g, g.setLineStyle, b, a, null);
			this.designer.updateSelection(g)
		}
	},
	setLineColor: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.borderColor;
			g.setLineColor(a);
			chgMgr.addModifyChangeByMethod(g, g.setLineColor, b, a, null);
			this.designer.updateSelection(g)
		}
	},
	setTextColor: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.color;
			g.setTextColor(a);
			chgMgr.addModifyChangeByMethod(g, g.setTextColor, b, a, null);
			this.designer.updateSelection(g)
		}
	},
	setBackgroundColor: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.backgroundColor;
			g.setBackgroundColor(a);
			chgMgr.addModifyChangeByMethod(g, g.setBackgroundColor, b, a, null);
			this.designer.updateSelection(g)
		}
	},
	bold: function() {
		var a = this.selectedObject;
		if (a != null) {
			a.toggleBold();
			chgMgr.addModifyChangeByMethod(a, a.toggleBold, null, null, null);
			this.selectionTool.repositionTools();
			this.designer.updateSelection(a)
		}
	},
	italic: function() {
		var a = this.selectedObject;
		if (a != null) {
			a.toggleItalic();
			chgMgr.addModifyChangeByMethod(a, a.toggleItalic, null, null, null);
			this.selectionTool.repositionTools();
			this.designer.updateSelection(a)
		}
	},
	underline: function() {
		var b = this.selectedObject;
		var a = null;
		if (b != null) {
			b.toggleUnderline();
			chgMgr.addModifyChangeByMethod(b, b.toggleUnderline, null, null, null);
			this.selectionTool.repositionTools();
			this.designer.updateSelection(b);
			if (b.isUnderline()) {
				a = "underline"
			} else {
				a = "none"
			}
		}
		return a
	},
	alignLeft: function() {
		if (this.groupSelections.length > 0) {
			this.groupAlignLeft()
		} else {
			this._changeTextAlign("left")
		}
	},
	alignCenter: function() {
		if (this.groupSelections.length > 0) {
			this.groupAlignCenter()
		} else {
			this._changeTextAlign("center")
		}
	},
	alignRight: function() {
		if (this.groupSelections.length > 0) {
			this.groupAlignRight()
		} else {
			this._changeTextAlign("right")
		}
	},
	justify: function() {
		this._changeTextAlign("justify")
	},
	listHasMainImage: function(a) {
		for (var b = 0; b < a.length; b++) {
			if (a[b].mainImage) {
				return true
			}
		}
		return false
	},
	getBoundingBox: function(a) {
		var b = new Object();
		b.x = this.getLeftEdge(a);
		b.y = this.getTopEdge(a);
		b.w = this.getRightEdge(a) - b.x;
		b.h = this.getBottomEdge(a) - b.y;
		return b
	},
	getCoordinatesAfterBoundingBoxRotation: function(m, r, q) {
		var b = q.h;
		var u = q.w;
		var x = q.w;
		var g = q.h;
		var a = (b - u) / 2;
		var o = (x - g) / 2;
		var y = new Object();
		if (r == 90) {
			y.x = (q.x + q.w) - (m.y - q.y) - m.h + a;
			y.y = q.y + (m.x - q.x) - o
		} else {
			if (r == -90) {
				y.x = q.x + (m.y - q.y) - a;
				y.y = (q.y + q.h) - (m.x - q.x) - m.w + o
			} else {
				y.x = m.x;
				y.y = m.y
			}
		}
		return y
	},
	groupRotateLeft: function() {
		var g = this._setupGroupSelection();
		var a = this.groupSelections;
		var m = this.getBoundingBox(a);
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupRotate(a[b], -90, m)
		}
		chgMgr.endTx();
		this._unsetupGroupSelection(g)
	},
	groupRotateRight: function() {
		var g = this._setupGroupSelection();
		var a = this.groupSelections;
		var m = this.getBoundingBox(a);
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupRotate(a[b], 90, m)
		}
		chgMgr.endTx();
		this._unsetupGroupSelection(g)
	},
	performGroupRotate: function(q, o, u) {
		if (q != null && q.type == "textarea") {
			var m = {
				x: q.x,
				y: q.y
			};
			var a = this.getCoordinatesAfterBoundingBoxRotation(q, o, u);
			q.setBounds(a.x, a.y, q.w, q.h);
			var g = q.rotationAngle;
			q.rotate(o);
			chgMgr.addModifyChangeByMethod(q, q.undoRedoGroupRotate, {
				angle: g,
				position: m
			},
			{
				angle: q.rotationAngle,
				position: a
			},
			null);
			var r = {
				_delay: true
			};
			this.generateImage2(q, false, r)
		} else {
			if (q != null && q.type == "image") {
				var a = this.getCoordinatesAfterBoundingBoxRotation(q, o, u);
				var b = new Af.DataRequest(svcURL, this.rotateImageCompleted.bind({
					obj: q,
					canvas: this,
					newPosition: a
				}), requestFailedCommon, view, requestTimedoutCommon);
				if (this.designer && this.designer.artwork_uuid) {
					b.addParameter("psp", this.designer.artwork_uuid)
				} else {
					b.addParameter("psp", this.artwork_uuid)
				}
				b.addService("DesignerSvc", "rotateImage");
				b.addParameter("image", q.imageFile);
				b.addParameter("currentAngle", "" + parseInt(q.rotationAngle || 0));
				b.addParameter("rotateBy", "" + o);
				ajaxEngine.processRequest(b)
			}
		}
	},
	rotateImageCompleted: function(b) {
		var a = new Af.XMLToDataSet(b.responseXML);
		var m = a.data;
		var a = new Af.XMLToDataSet(b.responseXML);
		var m = a.data;
		var o = this["obj"];
		var g = {
			x: o.x,
			y: o.y
		};
		chgMgr.addModifyChangeByMethod(o, o.undoRedoGroupRotate, {
			image: o.imageFile,
			angle: o.rotationAngle,
			position: g
		},
		{
			image: m.image,
			angle: m.newAngle,
			position: this["newPosition"]
		});
		o.rotationAngle = m.newAngle;
		o.setValue(m.image);
		o.swapW_H();
		o.setBounds(this["newPosition"].x, this["newPosition"].y, o.w, o.h);
		this.canvas.positionSoftSelect(o)
	},
	groupAlignLeft: function() {
		var g = this._setupGroupSelection();
		var a = this.groupSelections;
		var m = this.getLeftEdge(a);
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupAlign(a[b], m - a[b].x, "left")
		}
		designer.textListChanged();
		chgMgr.endTx();
		this._unsetupGroupSelection(g)
	},
	getLeftEdge: function(a) {
		if (this.listHasMainImage(a)) {
			return 0
		}
		if (a.length == 1) {
			return parseInt((MARGIN_BLEED_SAFETY_PX * 2) * this.zoomFactor)
		}
		var g = Number.MAX_VALUE;
		for (var b = 0; b < a.length; b++) {
			if (a[b].x < g) {
				g = a[b].x
			}
		}
		return g
	},
	groupAlignRight: function() {
		var g = this._setupGroupSelection();
		var a = this.groupSelections;
		var m = this.getRightEdge(a);
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupAlign(a[b], m - a[b].w - a[b].x, "right")
		}
		designer.textListChanged();
		chgMgr.endTx();
		this._unsetupGroupSelection(g)
	},
	getRightEdge: function(a) {
		if (this.listHasMainImage(a)) {
			return this.element.offsetWidth
		}
		if (a.length == 1) {
			return parseInt(this.element.offsetWidth - ((MARGIN_BLEED_SAFETY_PX * 2) * this.zoomFactor))
		}
		var g = 0;
		for (var b = 0; b < a.length; b++) {
			if ((a[b].x + a[b].w) > g) {
				g = a[b].x + a[b].w
			}
		}
		return g
	},
	groupAlignCenter: function() {
		var m = this._setupGroupSelection();
		var a = this.groupSelections;
		var o = this.getRightEdge(a);
		var g = this.getLeftEdge(a);
		var o = (o + g) / 2;
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupAlign(a[b], o - (a[b].w / 2) - a[b].x, "center")
		}
		designer.textListChanged();
		chgMgr.endTx();
		this._unsetupGroupSelection(m)
	},
	performGroupAlign: function(b, a, g) {
		chgMgr.addModifyChangeByMethod(b, b.undoRedoGroupAlign, {
			dx: -a,
			alignment: b.textAlign
		},
		{
			dx: a,
			alignment: g
		},
		null);
		b.move(a, 0);
		if (b.mainImage) {
			b.endMove()
		}
		if (this._changeTextAlign2(b, g, "h")) {
			this.generateImage2(b, false)
		}
		this.positionSoftSelect(b)
	},
	groupAlignTop: function() {
		var g = this._setupGroupSelection();
		var a = this.groupSelections;
		var m = this.getTopEdge(a);
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupVertialAlign(a[b], m - a[b].y, "left")
		}
		chgMgr.endTx();
		this._unsetupGroupSelection(g)
	},
	groupAlignBottom: function() {
		var g = this._setupGroupSelection();
		var a = this.groupSelections;
		var m = this.getBottomEdge(a);
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupVertialAlign(a[b], m - a[b].h - a[b].y, "right")
		}
		chgMgr.endTx();
		this._unsetupGroupSelection(g)
	},
	groupAlignMiddle: function() {
		var m = this._setupGroupSelection();
		var a = this.groupSelections;
		var o = this.getTopEdge(a);
		var g = this.getBottomEdge(a);
		var o = (o + g) / 2;
		chgMgr.beginTx();
		for (var b = 0; b < a.length; b++) {
			this.performGroupVertialAlign(a[b], o - (a[b].h / 2) - a[b].y, "center")
		}
		chgMgr.endTx();
		this._unsetupGroupSelection(m)
	},
	performGroupVertialAlign: function(b, a, g) {
		chgMgr.addModifyChangeByMethod(b, b.undoRedoGroupVerticalAlign, {
			dy: -a,
			alignment: b.textAlign
		},
		{
			dy: a,
			alignment: g
		},
		null);
		b.move(0, a);
		if (b.mainImage) {
			b.endMove()
		}
		if (this._changeTextAlign2(b, g, "v")) {
			this.generateImage2(b, false)
		}
		this.positionSoftSelect(b)
	},
	_changeTextAlign2: function(m, a, b) {
		if (m.type != "textarea") {
			return false
		}
		if (m.getDirection() != b) {
			return false
		}
		_emptyStyle(m.element, "textAlign", a);
		var g = m.getTextAlign();
		m.setTextAlign(a);
		m.updateHtmlFromElement();
		chgMgr.addModifyChangeByMethod(m, m.setTextAlign, g, a, null);
		return true
	},
	_setupGroupSelection: function() {
		var a = this.groupSelections;
		var b = false;
		if (a.length == 0 && this.selectedObject) {
			this.groupSelections.push(this.selectedObject);
			b = true
		}
		return b
	},
	_unsetupGroupSelection: function(a) {
		if (a) {
			this.groupSelections.length = 0
		}
	},
	_getGroupBonds: function(a) {
		var g = null;
		for (var b = 0; b < a.length; b++) {
			var m = a[b];
			if (g == null) {
				g = new Af.Rectangle(m.x, m.y, m.w, m.h)
			} else {
				g = g.union(new Af.Rectangle(m.x, m.y, m.w, m.h))
			}
		}
		return g
	},
	getTopEdge: function(a) {
		if (this.listHasMainImage(a)) {
			return 0
		}
		if (a.length == 1) {
			return parseInt((MARGIN_BLEED_SAFETY_PX * 2) * this.zoomFactor)
		}
		var g = Number.MAX_VALUE;
		for (var b = 0; b < a.length; b++) {
			if (a[b].y < g) {
				g = a[b].y
			}
		}
		return g
	},
	getBottomEdge: function(a) {
		if (this.listHasMainImage(a)) {
			return this.element.offsetHeight
		}
		if (a.length == 1) {
			return parseInt(this.element.offsetHeight - ((MARGIN_BLEED_SAFETY_PX * 2) * this.zoomFactor))
		}
		var g = 0;
		for (var b = 0; b < a.length; b++) {
			if ((a[b].y + a[b].h) > g) {
				g = a[b].y + a[b].h
			}
		}
		return g
	},
	_changeTextAlign: function(a) {
		var g = this.selectedObject;
		if (g != null) {
			var b = g.getTextAlign();
			g.setTextAlign(a);
			chgMgr.addModifyChangeByMethod(g, g.setTextAlign, b, a, null);
			this.selectionTool.repositionTools();
			this.designer.updateSelection(g)
		}
	},
	bringToFront: function() {
		if (this.selectedObject != null) {
			if (this.selectedObject.mainImage) {
				return
			}
			var a = this.getIntersectingObjects(this.selectedObject);
			if (a.length > 0) {
				var g = 0;
				for (var b = 0; b < a.length; b++) {
					if (a[b].level > g) {
						g = a[b].level
					}
				}
				if (g >= this.selectedObject.level) {
					chgMgr.beginTx();
					chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setLevel, this.selectedObject.level, g + 1, null);
					chgMgr.endTx();
					this.selectedObject.setLevel(g + 1);
					this.selectionTool.setDrawingObject(this.selectedObject)
				}
			}
		}
	},
	sendToBack: function() {
		if (this.selectedObject != null) {
			if (this.selectedObject.mainImage) {
				return
			}
			var a = this.getIntersectingObjects(this.selectedObject);
			if (a.length > 0) {
				var g = Number.MAX_VALUE;
				for (var b = 0; b < a.length; b++) {
					if (a[b].level < g) {
						g = a[b].level
					}
				}
				if (g <= this.selectedObject.level) {
					chgMgr.beginTx();
					g = g - 1;
					if (g == 0) {
						for (var b = 0; b < a.length; b++) {
							chgMgr.addModifyChangeByMethod(a[b], a[b].setLevel, a[b].level, a[b].level + 1, null);
							a[b].setLevel(a[b].level + 1)
						}
						g = 1
					}
					chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setLevel, this.selectedObject.level, g, null);
					this.selectedObject.setLevel(g);
					this.selectionTool.setDrawingObject(this.selectedObject);
					chgMgr.endTx()
				}
			}
		}
	},
	getIntersectingObjects: function(o) {
		var a = new Array();
		var m = o.getBound();
		for (var g = 1; g < this.gobjects.length; g++) {
			var b = this.gobjects[g];
			if (b.subType == "overlay" || b.subType == "foldLine") {
				continue
			}
			if (b != o) {
				if (m.completelyIntersects(b.getBound())) {
					a.push(b)
				}
			}
		}
		return a
	},
	zoomin: function() {
		debugA("zoomin() - not yet implemented")
	},
	zoomout: function() {
		debugA("zoomout() - not yet implemented")
	},
	addText: function(a, m, b) {
		var g = new Af.TextObject();
		g.x = a;
		g.y = m;
		g.description = b;
		g.canvas = this;
		g.initialSetup(this.zoomFactor);
		g.createElement();
		this.gobjects.push(g);
		return g
	},
	addTextArea: function(a, o, b) {
		var g = new Af.TextAreaObject(null, null, 16 / this.zoomFactor + "px");
		g.x = a;
		g.y = o;
		g.value = b;
		g.description = b;
		g.canvas = this;
		g.initialSetup(this.zoomFactor);
		g.createElement();
		var m = this.getBestTextColor();
		if (m != null) {
			g.setTextColor(m)
		}
		this.updateTextFontAndStyles(g);
		this.constrainAdd(g);
		this.gobjects.push(g);
		return g
	},
	getBestTextColor: function() {
		for (var b = 0; b < this.gobjects.length; b++) {
			var m = this.gobjects[b];
			if (m.type == "textarea" && m.element) {
				var g = getFirstTextE(m.createElement2());
				if (g != null && g.style != null) {
					var q = null;
					q = Element.readAttribute(g, "color");
					if (q == null) {
						q = getStyle("color", g)
					}
					if (q != null) {
						q = q.parseColor();
						var a = q.indexOf("#");
						if (a >= 0) {
							q = q.substring(a + 1)
						}
						return q
					}
				}
			}
		}
		return null
	},
	addHLine: function(a, o, b, g) {
		var m = new Af.HLineObject(a, o, b, g);
		m.canvas = this;
		m.initialSetup(this.zoomFactor);
		m.createElement();
		this.gobjects.push(m);
		return m
	},
	addVLine: function(a, o, b, g) {
		var m = new Af.VLineObject(a, o, b, g);
		m.canvas = this;
		m.initialSetup(this.zoomFactor);
		m.createElement();
		this.gobjects.push(m);
		return m
	},
	addRectangle: function(a, o, b, g) {
		var m = new Af.RectangleObject(a, o, b, g);
		m.canvas = this;
		m.initialSetup(this.zoomFactor);
		m.createElement();
		this.gobjects.push(m);
		return m
	},
	addImage: function(a, m, b) {
		var g = new Af.ImageObject(a, m, b.offsetWidth, b.offsetHeight, b.src);
		g.canvas = this;
		g.initialSetup(this.zoomFactor);
		g.createElement();
		this.gobjects.push(g);
		return g
	},
	addImage2: function(A, o, b, u, r, g) {
		if (u == null) {
			if (b) {
				u = 0;
				r = 0
			} else {
				u = 20;
				r = 20
			}
		}
		u = u + docScrollLeft() + this.viewPortX1;
		r = r + docScrollTop() + this.viewPortY1;
		var z = -1;
		var q = -1;
		if (g != null) {
			z = g.imageWidth;
			if (z != null) {
				z = parseInt(z)
			} else {
				z = -1
			}
			q = g.imageHeight;
			if (q != null) {
				q = parseInt(q)
			} else {
				q = -1
			}
		}
		var m = new Af.ImageObject(u, r, z, q, A, null, null, o);
		m.isBackground = b;
		m.canvas = this;
		m.initialSetup(this.zoomFactor);
		m.createElement();
		var a = this.getHighestLevel();
		a += 1;
		m.setLevel(a);
		this.gobjects.push(m);
		m.paint();
		this.selectObject(m);
		chgMgr.beginTx();
		chgMgr.addCreateChange(m);
		chgMgr.endTx();
		return m
	},
	nodeSizeChanged: function(a) {
		if (a == this.selectedObject) {
			this.selectionTool.repositionTools()
		}
	},
	stationChanged: function(a) {
		if (this.cropMode) {
			removeAll(this.element);
			if (this.gobjects.length > 0 && this.gobjects[0]["type"] == "image") {
				this.gobjects[0].updateImageSrc()
			}
			if (isFinalReviewOrPast(designer.getCurrentStationName())) {
				if (designer.currentSurface == this && this.ds) {
					this.setDSElementSize(this.ds, true)
				}
				this.element.style.backgroundColor = "transparent"
			} else {
				if (designer.currentSurface == this && this.ds) {
					this.setDSElementSize(this.ds, false)
				}
				this.element.style.backgroundColor = this.savedColor
			}
		}
		if (a) {
			this.reinitDrawingSurface(false)
		}
	},
	refreshAll: function() {
		if (this.isViewOnly()) {
			this.selectObject(null)
		}
		if (this.selectedObject != null) {
			var b = false;
			for (var a = 0; a < this.gobjects.length; a++) {
				if (this.selectedObject == this.gobjects[a]) {
					b = true;
					break
				}
			}
			if (!b) {
				this.selectObject(null)
			}
		}
		this.paint2();
		this.selectionTool.setDrawingObject(this.selectedObject)
	},
	dblClickOnDesignSurface: function(g) {
		if (this.isViewOnly()) {
			return
		}
		if (this.editingDisabled) {
			var b = g.target ? g.target: g.srcElement;
			this.msDownX = this.mx1 = g.clientX + docScrollLeft() + this.viewPortX1 - this.offsetLeft - this.eventXOffset;
			this.msDownY = this.my1 = g.clientY + docScrollTop() + this.viewPortY1 - this.offsetTop - this.eventYOffset;
			var a = null;
			a = this.getObjectByXY(this.mx1, this.my1);
			if (a != null || (b == this.element || b == this.backGroundImage)) {
				this.selectObject(a)
			}
		}
		if (this.selectedObject != null && this.selectedObject.type == "textarea") {
			this.editText();
			this.consume(g)
		} else {
			if (this.selectedObject != null && this.selectedObject.type == "image" && !this.selectedObject.mainImage) {
				this.designer.dblClickOnImage(this.selectedObject, "beforeUpload")
			}
		}
	},
	editText: function() {
		if (designer.getCurrentStationName() == "position" && !this.editingDisabled) {
			designer.setEditTextDialogShouldHideFlag(false);
			designer.showMultiRTEEditor()
		}
	},
	dblClickOnImage: function(a) {
		if (a.subType == "overlay") {
			return
		}
		this.designer.dblClickOnImage(a, "beforeUpload")
	},
	dblClickOnText: function(a) {
		this.selectObject(a);
		this.editText()
	},
	constrainAdd: function(m) {
		if (m.type != "textarea") {
			return
		}
		var g = m.x;
		var r = m.y;
		var b = g + m.w;
		var o = r + m.h;
		var a = m.w;
		var q = m.h;
		if (b > this.sfx2) {
			a -= b - this.sfx2;
			if (a < this.MIN_TEXT_WIDTH) {
				g -= this.MIN_TEXT_WIDTH - a;
				a = this.MIN_TEXT_WIDTH
			}
		}
		if (g < this.sfx1) {
			g = this.sfx1
		}
		if (o > this.sfy2) {
			q -= o - this.sfy2;
			if (q < this.MIN_TEXT_WIDTH) {
				r -= this.MIN_TEXT_WIDTH - q;
				q = this.MIN_TEXT_WIDTH
			}
		}
		if (r < this.sfy1) {
			r = this.sfy1
		}
		m.setBounds(g, r, a, q)
	},
	constrainMove: function(a) {
		if (a.type == "textarea") {
			this.constrainMoveText(a)
		} else {
			if (a.type == "image") {
				this.constrainMoveImage(a)
			} else {
				this.constrainMoveShape(a)
			}
		}
	},
	constrainMoveText: function(a) {
		var x = a.selectionExtent / 2;
		var o = this.sfx1 - x - SAFE_TEXT_PADDING;
		var m = this.sfx2 + x + SAFE_TEXT_PADDING;
		var y = this.sfy1 - x - SAFE_TEXT_PADDING;
		var u = this.sfy2 + x + SAFE_TEXT_PADDING;
		var g = a.x;
		var r = a.y;
		var b = g + a.w;
		var q = r + a.h;
		if (b > m) {
			g -= b - m
		}
		if (g < o) {
			g = o
		}
		if (q > u) {
			r -= q - u
		}
		if (r < y) {
			r = y
		}
		a.move(g - a.x, r - a.y)
	},
	constrainMoveShape: function(a) {
		var x = a.selectionExtent / 2;
		var o = this.sfx1 - x - SAFE_IMAGE_PADDING;
		var m = this.sfx2 + x + SAFE_IMAGE_PADDING;
		var y = this.sfy1 - x - SAFE_IMAGE_PADDING;
		var u = this.sfy2 + x + SAFE_IMAGE_PADDING;
		var g = a.x;
		var r = a.y;
		var b = g + a.w;
		var q = r + a.h;
		if (b > m) {
			g -= b - m
		}
		if (g < o) {
			g = o
		}
		if (q > u) {
			r -= q - u
		}
		if (r < y) {
			r = y
		}
		a.move(g - a.x, r - a.y)
	},
	constrainMoveImage: function(a) {
		var x = a.selectionExtent / 2;
		var o = this.sfx1 - x + SAFE_IMAGE_PADDING;
		var m = this.sfx2 + x - SAFE_IMAGE_PADDING;
		var y = this.sfy1 - x + SAFE_IMAGE_PADDING;
		var u = this.sfy2 + x - SAFE_IMAGE_PADDING;
		var g = a.x;
		var r = a.y;
		var b = g + a.w;
		var q = r + a.h;
		if (g > m) {
			g = m
		}
		if (b < o) {
			g += o - b
		}
		if (r > u) {
			r = u
		}
		if (q < y) {
			r += y - q
		}
		a.move(g - a.x, r - a.y)
	},
	setBackgroundFlag: function() {
		for (var g = 0; g < this.gobjects.length; g++) {
			var b = this.gobjects[g];
			if (b.type == "image" && b.isBackground) {
				return
			}
		}
		var a = this.element.offsetWidth;
		var m = this.element.offsetHeight;
		a = a * 0.95;
		m = m * 0.95;
		for (var g = 0; g < this.gobjects.length; g++) {
			var b = this.gobjects[g];
			if (b.type == "image") {
				if (b.h >= m && b.w >= m) {
					b.isBackground = true;
					return
				}
			}
		}
	},
	getBackgroundObject: function() {
		for (var b = 0; b < this.gobjects.length; b++) {
			var a = this.gobjects[b];
			if (a.type == "image" && a.isBackground) {
				return a
			}
		}
		return null
	},
	makeSameWidth: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		var a = this.element.offsetWidth;
		this.selectedObject.setWidth(0, 0, a);
		this.selectionTool.repositionTools();
		return false
	},
	makeSameHeight: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		var a = this.element.offsetHeight;
		this.selectedObject.setHeight(0, 0, a);
		this.selectionTool.repositionTools();
		return false
	},
	isLocked: function(a) {
		if (this.selectedObject == null) {
			return
		}
		if (this.selectedObject.locked + "" == "true") {
			if (!this.selectedObject.mainImage) {
				var b = OBJECT_LOCKED.text;
				b = b.replace("[ActionPerformed]", a);
				showMessageDialog(b, OBJECT_LOCKED.subject, OBJECT_LOCKED.width, OBJECT_LOCKED.height, null, true)
			}
			return true
		}
		return false
	},
	makeSameSize: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		if (this.isLocked("Size to fit")) {
			return
		}
		var g = this.selectedObject.getBoundsF();
		var m = this.element.offsetHeight;
		var b = this.element.offsetWidth;
		this.selectedObject.fitToSize(0, 0, b, m);
		this.selectionTool.repositionTools();
		var a = this.selectedObject.getBoundsF();
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setBoundsF, g, a, null);
		chgMgr.endTx();
		return false
	},
	autoCenter: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		if (this.isLocked("Auto center")) {
			return
		}
		var o = this.selectedObject.getBoundsF();
		var q = this.element.offsetHeight;
		var m = this.element.offsetWidth;
		var g = Math.round((m - this.selectedObject.w) / 2);
		var a = Math.round((q - this.selectedObject.h) / 2);
		this.selectedObject.setBounds(g, a, this.selectedObject.w, this.selectedObject.h);
		this.selectionTool.repositionTools();
		var b = this.selectedObject.getBoundsF();
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setBoundsF, o, b, null);
		chgMgr.endTx();
		return false
	},
	makeSameWidthNoAspect: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		if (this.isLocked("Size width as canvas")) {
			return
		}
		var a = this.element.offsetWidth;
		this.selectedObject.setWidthNoAspect(0, 0, a);
		this.selectionTool.repositionTools();
		return false
	},
	makeSameHeightNoAspect: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		if (this.isLocked("Same height as canvas")) {
			return
		}
		var a = this.element.offsetHeight;
		this.selectedObject.setHeightNoAspect(0, 0, a);
		this.selectionTool.repositionTools();
		return false
	},
	makeSameSizeNoAspect: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		if (this.isLocked("Size to fit")) {
			return
		}
		var g = this.selectedObject.getBoundsF();
		var m = this.element.offsetHeight;
		var b = this.element.offsetWidth;
		this.selectedObject.setBoundsNoAspect(0, 0, b, m);
		this.selectionTool.repositionTools();
		var a = this.selectedObject.getBoundsF();
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(this.selectedObject, this.selectedObject.setBoundsF, g, a, null);
		chgMgr.endTx();
		return false
	},
	processUploadedImage: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
		if (this.selectedObject == null || this.selectedObject.element.tagName != "IMG") {
			return
		}
		var a = this.selectedObject.w;
		var r = this.selectedObject.h;
		if (a > r) {
			this.makePortrait()
		} else {
			if (r > a) {
				this.makeLandscape()
			}
		}
		var b = this.element.offsetHeight;
		var q = this.element.offsetWidth;
		a = this.selectedObject.w;
		r = this.selectedObject.h;
		if (a <= q && r <= b) {
			var o = parseInt((q - a) / 2);
			var m = parseInt((b - r) / 2);
			var z = o - this.selectedObject.x;
			var u = m - this.selectedObject.y;
			this.selectedObject.move(z, u)
		} else {
			var g = this.isLowResImage(this.selectedObject);
			if (g) {
				this.makeSameSize()
			}
		}
		this.selectObject(null)
	},
	isLowResCameraImage: function(g) {
		var b = trim(g.cameraModel);
		var a = trim(g.cameraManufacturer);
		if (b == "" && a == "") {
			return false
		}
		if (g.artworkResolution != null && g.artworkResolution < 200) {
			return true
		}
		return false
	},
	isLowResImage: function(a) {
		if (a.artworkResolution != null && a.artworkResolution < 200) {
			return true
		}
		return false
	},
	isAspectRatioLocked: function() {
		if (this.designer.isAspectRatioLocked) {
			return this.designer.isAspectRatioLocked()
		}
		return true
	},
	doReset: function() {
		var a = this.ds;
		var A = this.designer.artwork;
		var q;
		var b;
		var m = this.getDSPhysicalSize(this.ds);
		q = m.w;
		b = m.h;
		var u = a.art_width;
		u = (u * 96) / 72;
		a.hscale = -1;
		var g = a.art_height;
		g = (g * 96) / 72;
		a.vscale = -1;
		var r = -MARGIN_BLEED_SAFETY_PX + this.bleedLineXMargin;
		var o = -MARGIN_BLEED_SAFETY_PX + this.bleedLineXMargin;
		if (q > u) {
			var z = q - u;
			r = parseInt(r + z / 2)
		}
		if (b > g) {
			var z = b - g;
			o = parseInt(o + z / 2)
		}
		this.gobjects[0].resetBounds(r, o, u, g);
		var B;
		if (u > g) {
			B = "wide"
		} else {
			B = "tall"
		}
		if (B != a.orientation) {
			if (B == "tall") {
				this.makeLandscape()
			} else {
				this.makePortrait()
			}
		}
		this.selectionTool.repositionTools()
	},
	getGuideStatus: function(g) {
		var a;
		for (var b = 0; b < this.guideStatusList.length; b++) {
			a = this.guideStatusList[b];
			if (a.GuideInternalName == g) {
				return a
			}
		}
		a = new Object();
		a.GuideInternalName = g;
		a.GuideStatus = "pending";
		this.guideStatusList.push(a);
		return a
	},
	editNext: function() {
		var g = null;
		var m = this.selectedObject;
		for (var a = 0; a < this.gobjects.length; a++) {
			if (this.gobjects[a].type == "textarea") {
				var b = this.gobjects[a];
				if (b == m) {
					continue
				}
				if ((b.y > m.y) || ((b.y == m.y) && (b.x > m.x))) {
					if (g != null) {
						if ((b.y < g.y) || ((g.y == b.y) && (b.x < g.x))) {
							g = b
						}
					} else {
						g = b
					}
				}
			}
		}
		if (g == null) {
			for (var a = 0; a < this.gobjects.length; a++) {
				if (this.gobjects[a].type == "textarea") {
					var b = this.gobjects[a];
					if (g == null) {
						g = b
					} else {
						if ((b.y < g.y) || ((g.y == b.y) && (b.x < g.x))) {
							g = b
						}
					}
				}
			}
		}
		if (g != null) {
			this.selectObject(g)
		}
	},
	editPrevious: function() {
		var g = null;
		var m = this.selectedObject;
		for (var a = 0; a < this.gobjects.length; a++) {
			if (this.gobjects[a].type == "textarea") {
				var b = this.gobjects[a];
				if (b == m) {
					continue
				}
				if ((b.y < m.y) || ((b.y == m.y) && (b.x < m.x))) {
					if (g != null) {
						if ((b.y > g.y) || ((g.y == b.y) && (b.x > g.x))) {
							g = b
						}
					} else {
						g = b
					}
				}
			}
		}
		if (g == null) {
			for (var a = 0; a < this.gobjects.length; a++) {
				if (this.gobjects[a].type == "textarea") {
					var b = this.gobjects[a];
					if (g == null) {
						g = b
					} else {
						if ((b.y > g.y) || ((g.y == b.y) && (b.x > g.x))) {
							g = b
						}
					}
				}
			}
		}
		if (g != null) {
			this.selectObject(g)
		}
	},
	getCurrentSelectedIndex: function() {
		if (this.selectedObject == null) {
			return - 1
		}
		for (var a = 0; a < this.gobjects.length; a++) {
			if (this.gobjects[a] == this.selectedObject) {
				return a
			}
		}
		return - 1
	},
	displayFoldingCallout: function(a) {
		if (a.calloutText != null) {
			a.element.onmouseover = this.showDefaultCallout.bind(this, a);
			a.element.onmouseout = this.hideDefaultCallout.bind(this)
		}
	},
	hideDefaultCallout: function() {
		designer.hideDefaultCallout()
	},
	showDefaultCallout: function(a) {
		designer.showDefaultCallout(a)
	},
	defaultSelectionToBackground: function() {
		if (this.selectedObject == null && this.gobjects.length > 0) {
			this.selectObject(this.gobjects[0])
		}
	},
	defaultSelectionToLowRes: function() {
		if (this.selectedObject == null || !this.selectedObject.isLowRes) {
			this.selectObject(this.gobjects[0]);
			for (var a = 0; a < this.gobjects.length; a++) {
				var b = this.gobjects[a];
				if (b.isLowRes) {
					this.selectObject(b);
					return
				}
			}
		}
	},
	selectAllText: function() {
		this.unselectGroup();
		for (var a = 0; a < this.gobjects.length; a++) {
			var b = this.gobjects[a];
			if (b.type == "textarea") {
				this.groupSelections.push(b);
				this.softSelect(b)
			}
		}
	},
	showHideCurtain: function() {
		var a = this.getMainImageObject();
		if (a != null) {
			a.showHideCurtain()
		}
	},
	getMainImageObject: function() {
		for (var a = 0; a < this.gobjects.length; a++) {
			var b = this.gobjects[a];
			if (b.type == "image" && b.mainImage) {
				return b
			}
		}
		return null
	},
	changeBackgroundColor: function(a) {
		var g = this.getMainImageObject();
		if (g != null) {
			var b = g.backgroundColor;
			g.setBackgroundColor(a);
			chgMgr.addModifyChangeByMethod(g, g.setBackgroundColor, b, a, null)
		}
	},
	autoDistribute: function() {
		var r = this._setupGroupSelection();
		var a = this.groupSelections;
		var g = null;
		var b = [];
		for (var m = 0; m < a.length; m++) {
			var u = a[m];
			if (u.type == "textarea") {
				b.push(u);
				var q = u.getDirection();
				if (g == null) {
					g = q
				}
				if (g != q) {
					showMessageDialog("Can not auto distribute objects with mixed rotation.", "Error", 400, 100, null, true);
					returrn
				}
			}
		}
		if (b.length == 0) {
			return
		}
		chgMgr.beginTx();
		if (g == "h") {
			this.autoDistributeV(b)
		} else {
			this.autoDistributeH(b)
		}
		if (this.br) {
			this.br.executeOverlappingObjGuide(true)
		}
		chgMgr.endTx()
	},
	moveObjectBy: function(a, g, b) {
		var m = a.getBoundsF();
		a.move(g, b);
		chgMgr.addModifyChangeByMethod(a, a.setBoundsF, m, a.getBoundsF(), null)
	},
	autoDistributeV: function(g) {
		function A(B, o) {
			return B.y - o.y
		}
		g.sort(A);
		var a = g[0];
		var u = false;
		if (a.rotationAngle == 0) {
			var y = this.sfy2;
			for (var m = 0; m < g.length - 1; m++) {
				var b = g[m];
				var r = b.y + b.h;
				var q = g[m + 1];
				var x = r - q.y + 1;
				this.moveObjectBy(q, 0, x);
				u = u || ((q.y + q.h) > y)
			}
			if (u) {
				for (var m = g.length - 1; m > 0; m--) {
					var b = g[m];
					var q = g[m - 1];
					var r = q.y + q.h;
					var x = b.y - r - 1;
					this.moveObjectBy(q, 0, x)
				}
			}
		} else {
			var z = this.sfy1;
			for (var m = g.length - 1; m > 0; m--) {
				var b = g[m];
				var q = g[m - 1];
				var r = q.y + q.h;
				var x = b.y - r - 1;
				this.moveObjectBy(q, 0, x);
				u = u || (q.y < z)
			}
			if (u) {
				for (var m = 0; m < g.length - 1; m++) {
					var b = g[m];
					var r = b.y + b.h;
					var q = g[m + 1];
					var x = r - q.y + 1;
					this.moveObjectBy(q, 0, x)
				}
			}
		}
	},
	autoDistributeH: function(r) {
		function A(B, o) {
			return B.x - o.x
		}
		r.sort(A);
		var b = r[0];
		var y = false;
		if (b.rotationAngle == -90 || b.rotationAngle == 270) {
			var m = this.sfx2;
			for (var u = 0; u < r.length - 1; u++) {
				var g = r[u];
				var a = g.x + g.w;
				var x = r[u + 1];
				var z = a - x.x + 1;
				this.moveObjectBy(x, z, 0);
				y = y || ((x.x + x.w) > m)
			}
			if (y) {
				for (var u = r.length - 1; u > 0; u--) {
					var g = r[u];
					var x = r[u - 1];
					var a = x.x + x.w;
					var z = g.x - a - 1;
					this.moveObjectBy(x, z, 0)
				}
			}
		} else {
			var q = this.sfx1;
			for (var u = r.length - 1; u > 0; u--) {
				var g = r[u];
				var x = r[u - 1];
				var a = x.x + x.w;
				var z = g.x - a - 1;
				this.moveObjectBy(x, z, 0);
				y = y || (x.x < q)
			}
			if (y) {
				for (var u = 0; u < r.length - 1; u++) {
					var g = r[u];
					var a = g.x + g.w;
					var x = r[u + 1];
					var z = a - x.x + 1;
					this.moveObjectBy(x, z, 0)
				}
			}
		}
	},
	doCheckTemplateOverlap: function() {
		if (this.gobjects.length == 0) {
			return
		}
		var q = [];
		for (var y = 0; y < this.gobjects.length; y++) {
			var g = this.gobjects[y];
			if (g.type == "textarea") {
				q.push(g)
			}
		}
		if (q.length == 0) {
			return
		}
		function E(F, o) {
			return F.y - o.y
		}
		q.sort(E);
		var a = q[0];
		var D = this.sfy2;
		var B = false;
		var x = false;
		chgMgr.beginTx();
		for (var y = 0; y < q.length - 1; y++) {
			var g = q[y];
			var A = g.y + g.h;
			for (var u = y + 1; u < q.length; u++) {
				var z = q[u];
				var C = A - z.y;
				if (C < 0) {
					break
				}
				var m = new Af.Rectangle(z.x, z.y, z.w, z.h);
				var b = new Af.Rectangle(g.x, g.y, g.w, g.h);
				if (m.intersects(b)) {
					C = C + 1;
					var r = z.getBoundsF();
					z.move(0, C);
					chgMgr.addModifyChangeByMethod(z, z.setBoundsF, r, z.getBoundsF(), null);
					x = true;
					B = B || ((z.y + z.h) > D)
				}
			}
		}
		if (B) {
			a = null;
			for (var y = q.length - 1; y > 0; y--) {
				var g = q[y];
				for (var u = y - 1; u >= 0; u--) {
					var z = q[u];
					var A = z.y + z.h;
					var C = g.y - A;
					if (C > 0) {
						break
					}
					var m = new Af.Rectangle(z.x, z.y, z.w, z.h);
					var b = new Af.Rectangle(g.x, g.y, g.w, g.h);
					if (m.intersects(b)) {
						C = C - 1;
						var r = z.getBoundsF();
						z.move(0, C);
						chgMgr.addModifyChangeByMethod(z, z.setBoundsF, r, z.getBoundsF(), null);
						x = true
					}
				}
			}
		}
		if (x) {
			if (this.br) {
				this.br.executeOverlappingObjGuide(true)
			}
		}
		chgMgr.endTx()
	},
	generateImageForRestoringTags: function() {
		this.generatePersistedText = false;
		this.checkAndGenerateImage(true)
	},
	checkAndGenerateImage: function(g) {
		if (noImageSupportAvailable) {
			return
		}
		if (!playMode) {
			if (designer.artwork.currentStation != "position") {
				return
			}
		}
		this.checkedAndGenerateImage = true;
		if (playMode) {
			this.doCheckTemplateOverlap()
		}
		var a = [];
		for (var b = 0; b < this.gobjects.length; b++) {
			var m = this.gobjects[b];
			if (m.type != "textarea") {
				continue
			}
			if (playMode || g || m.imageFile == null) {
				a.push(m)
			} else {
				if (m.currentImageFile == null) {
					m.currentImageFile = m.imageFile
				}
			}
		}
		if (a.length == 0) {
			return
		}
		showModalMessageDialog(TEXT_TO_IMAGE_INIT.text, TEXT_TO_IMAGE_INIT.subject, TEXT_TO_IMAGE_INIT.width, TEXT_TO_IMAGE_INIT.height, 1200000);
		this.clearImageToTextMsg = false;
		for (var b = 0; b < a.length; b++) {
			var m = a[b];
			if (b == a.length - 1) {
				this.clearImageToTextMsg = true
			}
			this.generateImage2(m, false)
		}
		chgMgr.addNonUndoableModifyChange()
	},
	generateImage2: function(m, b, o) {
		if (noImageSupportAvailable) {
			return
		}
		var g = m.createElement2();
		g.style.left = "-10000px";
		document.body.appendChild(g);
		var a = extractText(g, m);
		document.body.removeChild(g);
		this.generateImage(m, a, b, true, o)
	},
	generateImageFromEditor: function(b, a) {
		if (noImageSupportAvailable) {
			return
		}
		if (this.giRequestTimer) {
			clearTimeout(this.giRequestTimer);
			this.giRequestTimer = null
		}
		if (this.giReqSent) {
			this.giRequestTimer = setTimeout(this.generateImageFromEditor.bind(this, b, a), 100)
		} else {
			this.generateImage(b, a, true, false, {
				_delay: true
			})
		}
	},
	generateImage: function(o, b, m, a, r) {
		if (noImageSupportAvailable) {
			return
		}
		this.giReqSent = true;
		b.underline = o.isUnderline();
		if (o.getDirection() == "h") {
			b.w = o.w;
			b.h = o.h
		} else {
			b.w = o.h;
			b.h = o.w
		}
		var q = {
			psp: designer.artwork.jobId,
			ff: b.ff
		};
		if (o.currentImageFile == null) {
			o.currentImageFile = o.imageFile || ""
		}
		if (!b.isRotated && o.imageFile && (o.imageFile != o.currentImageFile)) {
			q.im = o.imageFile
		}
		if (o.rotationAngle) {
			q.angle = o.rotationAngle
		}
		var g = Object.toJSON(b);
		new Ajax.Request(topURL + "textToImage", {
			parameters: q,
			contentType: "application/json;charset=iso-8859-1",
			method: "post",
			postBody: g,
			evalJSON: true,
			asynchronous: m,
			onSuccess: this.generateImageCompleted.bind(this, o, b, a, r)
		})
	},
	populateImageBox: function() {
		var u = $("changeImageLinks");
		if (u == null) {
			return
		}
		removeAll(u);
		for (var r = 0; r < this.gobjects.length; r++) {
			var m = this.gobjects[r];
			if (m.logoImage || m.placeHolderImage) {
				var g = new Element("div");
				g.className = "addImageHoverOver";
				u.appendChild(g);
				var z = new Element("img");
				z.src = m.getImageSrc();
				var b = navigator.userAgent.toLowerCase();
				var q = (b.indexOf("msie") != -1);
				if (q) {
					var C = 50;
					if (m.art_height && m.art_width && m.getDirection() == "h") {
						var y = parseFloat(m.art_height);
						var x = parseFloat(m.art_width)
					} else {
						var x = parseFloat(m.art_height);
						var y = parseFloat(m.art_width)
					}
					var D = parseFloat(y) / parseFloat(x);
					var B = Math.round(C * D);
					if (B) {
						z.style.height = B + "px"
					} else {
						z.style.height = "50px"
					}
				}
				g.appendChild(z);
				var A = new Element("a");
				A.innerHTML = m.logoImage ? "Change Logo": "Change Image";
				g.appendChild(A);
				g.observe("click", this.changeImage.bindAsEventListener(this, m))
			}
		}
	},
	changeImage: function(a, g) {
		a.stop();
		this.selectObject(g);
		var b = $("imageUpdateFromComputer");
		if (b && b.checked) {
			designer.changeImage()
		} else {
			designer.changeImageFromGallery()
		}
	},
	generateImageCompleted: function(o, y, r, x, g, u) {
		this.giReqSent = false;
		if (this.clearImageToTextMsg) {
			hideModalMessageDialog()
		}
		if (!u) {
			u = g.responseText.evalJSON()
		}
		var z, q;
		if (o.getDirection() == "h") {
			z = u.w;
			q = u.h
		} else {
			z = u.h;
			q = u.w
		}
		o.setSize(z, q);
		if (x && x.isRotate) {
			chgMgr.beginTx();
			var a = x.oldBounds;
			var b = o.getBoundsF();
			chgMgr.addModifyChangeByMethod(o, o.setBoundsF, a, b, null);
			chgMgr.addModifyChangeByMethod(o, o.setRotation, x.oldAngle, o.rotationAngle);
			chgMgr.endTx()
		}
		o.setImageFile(u.im, x && x._delay, true);
		if (this.groupSelections.length > 0) {
			this.positionSoftSelect(o)
		}
		this.nodeSizeChanged(o);
		var A = y.words;
		for (var m = 0; m < A.length; m++) {
			var z = A[m];
			z.x = u.xs[m] / this.zoomFactor;
			z.y = u.ys[m] / this.zoomFactor;
			z.w = u.ws[m] / this.zoomFactor;
			z.h = u.hs[m] / this.zoomFactor;
			z.t = u.ts[m]
		}
		o.words = A;
		if (!r) {
			this.constrainMove(this.selectedObject)
		}
		if (this.br != null) {
			this.br.executeOverlappingObjGuide(true)
		}
	}
});
function removeFromArray(b, m) {
	if (b != null) {
		var a = new Array();
		for (var g = 0; g < b.length; g++) {
			if (b[g] != m) {
				a.push(b[g])
			}
		}
		return a
	}
	return null
}
Af.ArmButtonFeature = Class.create({
	initialize: function(b, a) {
		this.element = b;
		this.armedButton = a;
		this.element.onkeydown = this.keyDown.bindAsEventListener(this)
	},
	keyDown: function(b) {
		var a = b.target ? b.target: b.srcElement;
		var g = b.keyCode ? b.keyCode: b.which;
		if (g == 13) {
			setTimeout(this.loseFocus.bind(this, a), 1)
		}
		return true
	},
	loseFocus: function(a) {
		if (is_ie) {
			try {
				a.blur()
			} catch(b) {}
		}
		setTimeout(this.doClick.bind(this, a), 1)
	},
	doClick: function(a) {
		if (this.armedButton != null && this.armedButton.onclick) {
			this.armedButton.onclick()
		}
	}
});
function inchToPx(a) {
	return a * 96
}
function getDSPhysicalSize(q) {
	var a, m, r, g;
	r = parseFloat(q.physicalW);
	g = parseFloat(q.physicalH);
	if (isNaN(r) || isNaN(g)) {
		var b = parseFloat(q.w);
		var o = parseFloat(q.h);
		if (!isNaN(b) && !isNaN(o)) {
			r = b / 72 - 0.25;
			g = o / 72 - 0.25;
			console.log("getDSPhysicalSize: approximated physicalW=" + r + " using <w>" + b + "</w>");
			console.log("getDSPhysicalSize: approximated physicalH=" + g + " using <h>" + o + "</h>")
		} else {
			console.log("getDSPhysicalSize: can't aproximate physicalW and physicalH")
		}
	}
	q.physicalW = r;
	q.physicalH = g;
	if (q.orientation == "wide") {
		if (q.physicalW >= q.physicalH) {
			a = q.physicalW;
			m = q.physicalH
		} else {
			a = q.physicalH;
			m = q.physicalW
		}
	} else {
		if (q.orientation == "tall") {
			if (q.physicalW < q.physicalH) {
				a = q.physicalW;
				m = q.physicalH
			} else {
				a = q.physicalH;
				m = q.physicalW
			}
		} else {
			a = q.physicalW;
			m = q.physicalH;
			q.orientation = (q.physicalW >= q.physicalH) ? "wide": "tall"
		}
	}
	return {
		w: a,
		h: m
	}
}
Af.RTComp = Class.create({
	initialize: function() {
		this.fontUtils = new Af.FontUtils();
		this.COLOR_EXCEPTION_LIST = {
			15066597 : "",
			13948116 : "",
			12763842 : "",
			15715810 : "",
			15715810 : "",
			13552614 : "",
			13823475 : "",
			13421772 : "",
			13756613 : "",
			13421721 : "",
			13623956 : "",
			10998668 : "",
			10079436 : "",
			11263977 : "",
			10471915 : "",
			9164002 : "",
			9162679 : "",
			11131324 : "",
			10079385 : "",
			14221310 : "",
			14806259 : ""
		};
		this.LIGHT_BACKGROUND_COLOR = "#f2f2f2";
		this.DARK_BACKGROUND_COLOR = "#666666";
		this.BOUNDARY_DARK_TEXT_HEX_COLOR = 15885881;
		this.debugMode = false;
		this.selectionText = "";
		this.rng = null;
		this.lastCommand = null;
		this.maxLoops = 2;
		this.loopCnt = 0;
		this.TYPE_HADLER_FIRE_DELAY = 400;
		this.ua = navigator.userAgent.toLowerCase();
		this.isIE = ((this.ua.indexOf("msie") != -1) && (this.ua.indexOf("opera") == -1) && (this.ua.indexOf("webtv") == -1));
		this.ieVersion = parseFloat(this.ua.substring(this.ua.indexOf("msie ") + 5));
		this.isGecko = (this.ua.indexOf("gecko") != -1);
		this.isWebKIt = Prototype.Browser.WebKit;
		this.containerElement = null;
		this.controller = null;
		this.setInitalValueOfLastStyles()
	},
	setInitalValueOfLastStyles: function() {
		this.l_fs = null;
		this.l_fw = null;
		this.l_ta = null;
		this.l_c = null
	},
	setLastStyles: function() {
		this.setInitalValueOfLastStyles();
		var b = getFirstTextE(this.editable);
		if (b != null) {
			var a = b.tagName.toLowerCase();
			while (a == "strong" || a == "font" || a == "color" || a == "em" || a == "bold") {
				if (a == "em") {
					this.l_fs = "italic"
				} else {
					if (a == "strong" || a == "bold") {
						this.l_fw = 700
					} else {
						if (a == "font") {
							this.l_c = Element.getStyle(b, "color")
						}
					}
				}
				this.l_ta = this.l_ta || Element.getStyle(b, "textAlign");
				if (b.parentNode == this.editable) {
					break
				} else {
					b = b.parentNode;
					a = b.tagName.toLowerCase()
				}
			}
			this.l_fs = this.l_fs || Element.getStyle(b, "fontStyle");
			this.l_fw = this.l_fw || Element.getStyle(b, "fontWeight");
			this.l_ta = this.l_ta || Element.getStyle(b, "textAlign");
			this.l_c = this.l_c || Element.getStyle(b, "color");
			var g = parseInt(this.l_fw);
			if (!isNaN(g) && g > 400) {
				this.l_fw = "bold"
			}
		}
	},
	getRightMostLeafNode: function(g) {
		var a = g.childNodes;
		if (a) {
			var b = a.length - 1;
			if (b < 0) {
				return g
			}
			if (a[b].id == "_wd_dummy_br") {
				b--
			}
			if (b >= 0) {
				return this.getRightMostLeafNode(a[b])
			}
		}
		return g
	},
	setCaretToEnd: function() {
		this.setFocus();
		if (this.editable.innerHTML == "") {
			return
		}
		try {
			if (this.editingObject && !this.editingObject.changed) {
				this.selectAll(true)
			} else {
				var m = this.getRightMostLeafNode(this.editable);
				if (document.all) {
					var g = document.selection;
					var b = g.createRange();
					b.collapse(true);
					if (m.nodeType == Node.TEXT_NODE) {
						m = m.parentNode
					}
					b.moveToElementText(m);
					b.select();
					b.moveStart("character", b.text.length);
					b.select();
					this.setFocus()
				} else {
					var g = window.getSelection();
					g.removeAllRanges();
					var b = document.createRange();
					b.selectNode(m);
					g.addRange(b);
					g.collapseToEnd();
					this.setFocus()
				}
			}
		} catch(a) {}
	},
	selectAll: function(g) {
		if (document.all) {
			if (g) {
				this.rteCommand("selectall", "")
			} else {
				var b = document.selection;
				var a = b.createRange();
				a.collapse(true);
				a.moveToElementText(this.editable);
				a.select()
			}
			this.setFocus()
		} else {
			var b = window.getSelection();
			b.removeAllRanges();
			for (i = 0; i < this.editable.childNodes.length; i++) {
				var m = this.editable.childNodes[i];
				if (m.id != "_wd_dummy_br") {
					var a = document.createRange();
					a.selectNode(m);
					b.addRange(a)
				}
			}
			this.setFocus()
		}
	},
	rteCommand: function(o, A) {
		var y = null;
		try {
			this.emptyEditableStyle(o);
			if (!is_ie) {
				y = document.createElement("br");
				y.style.fontSize = "1px";
				y.style.lineHeight = "1px";
				y.style.height = "1px";
				this.editable.appendChild(y)
			}
			this.setFocus();
			if (is_ie && o == "bold") {
				var g = getFirstTextE(this.editable).tagName;
				if (g && ((g.toLowerCase() != "strong") && (g.toLowerCase() != "b") && (g.toLowerCase() != "em") && (g.toLowerCase() != "i"))) {
					var q = Element.getStyle(getFirstTextE(this.editable), "fontWeight");
					if (q == "700") {
						var z = this.editable.innerHTML;
						z = z.replace(/(FONT-WEIGHT|font-weight):[^('|"|;)]+/, "");
						this.editable.innerHTML = z
					} else {
						var b = getFirstTextE(this.editable);
						b.setStyle({
							fontWeight: "normal"
						})
					}
				}
			}
			var a = navigator.userAgent.toLowerCase();
			var m = false;
			if (a.indexOf("msie ") != -1) {
				var u = parseFloat(a.substring(a.indexOf("msie ") + 5));
				if (u == 7) {
					m = true
				}
			}
			if (m && o == "italic") {
				var g = getFirstTextE(this.editable).tagName;
				var x = Element.getStyle(getFirstTextE(this.editable), "fontStyle");
				var r = this.editable.innerHTML;
				if (g && ((g.toLowerCase() != "strong") && (g.toLowerCase() != "b") && (g.toLowerCase() != "em") && (g.toLowerCase() != "i"))) {
					if (x == "normal") {
						var b = getFirstTextE(this.editable);
						b.setStyle({
							fontStyle: "italic"
						})
					} else {
						if (x == "italic") {
							r = r.replace(/(FONT-STYLE|font-style):[^('|"|;)]+/, "");
							this.editable.innerHTML = r
						}
					}
				} else {
					if ((g.toLowerCase() == "strong") || (g.toLowerCase() == "b")) {
						if (x == "normal") {
							r = r.replace(/(FONT-STYLE|font-style):[^('|"|;)]+/, "font-style:italic");
							this.editable.innerHTML = r
						} else {
							if (x == "italic") {
								r = r.replace(/(FONT-STYLE|font-style):[^('|"|;)]+/, "font-style:normal");
								this.editable.innerHTML = r
							}
						}
					}
				}
			}
			try {
				document.execCommand(o, false, A)
			} catch(B) {
				console.warn("can't execute document.execCommand with command=" + o + "  parameter=" + A)
			}
			if (y) {
				try {
					y.parentNode.removeChild(y)
				} catch(B) {}
			}
			y = null;
			if (o != "selectall" && o != "unselect") {
				if (this.updateStyle(o)) {
					this.doUpdate(true)
				}
			}
			this.removeMozDirty(this.editable)
		} catch(B) {
			if (y) {
				try {
					y.parentNode.removeChild(y)
				} catch(B) {}
			}
			this.fallbackCommand(o, A)
		}
	},
	rteCommand2: function(o, q, g) {
		if (!this.listener.isCommandSupported(o)) {
			return
		}
		if (o == "justifyleft" || o == "justifyright" || o == "justifyright" || o == "justifycenter") {
			this.fallbackCommand(o);
			this.setLastStyles();
			this.setFocus();
			return
		}
		if (this.editable.innerHTML == "") {
			return
		}
		this.setRange();
		var b = trim(this.selectionText);
		var m = false;
		this.setFocus();
		if (b == null || b.length == 0 || g) {
			this.selectAll(false);
			m = true
		} else {
			if (this.rng) {
				try {
					this.setSelection(this.rng)
				} catch(a) {}
			}
		}
		this.rteCommand(o, q);
		if (m) {
			this.setCaretToEnd()
		}
		this.removeMozDirty(this.editable);
		this.setLastStyles()
	},
	removeMozDirty: function(g) {
		var a = new Array();
		for (i = 0; i < g.childNodes.length; i++) {
			var m = g.childNodes[i];
			if (m.attributes && m.attributes.getNamedItem("_moz_dirty")) {
				var b = trim(m.innerHTML);
				if (b == "" || b == "\n") {
					a.push(m)
				}
			}
		}
		for (i = 0; i < a.length; i++) {
			g.removeChild(a[i])
		}
	},
	setEditable: function(b, a, g) {
		this.editable = b;
		this.editableWrapper = g;
		Event.observe(this.editable, "keyup", this.keyUp.bindAsEventListener(this));
		Event.observe(this.editable, "keydown", this.keyDown.bindAsEventListener(this));
		Event.observe(this.editable, "paste", this.doUpdate.bindAsEventListener(this));
		if (a) {
			this.editable.contentEditable = true
		}
	},
	keyUp: function(a) {
		if (this.editingObject) {
			this.editingObject.customText = true
		} else {
			console.log("WARN: RTComp editingObject is not created yet")
		}
		this.doUpdate()
	},
	keyDown: function(a) {
		this.processControlCommand(a)
	},
	processControlCommand: function(a) {
		try {
			if (a.ctrlKey) {
				var b = String.fromCharCode(a.keyCode).toLowerCase();
				var g = "";
				switch (b) {
				case "b":
					g = "bold";
					break;
				case "i":
					g = "italic";
					break;
				case "u":
					g = "underline";
					break
				}
				if (g) {
					Event.stop(a);
					if (!this.listener.isCommandSupported(g)) {
						return
					}
					if (g == "underline") {
						this.underlineChanged()
					} else {
						this.rteCommand(g)
					}
				}
			}
		} catch(m) {}
	},
	setSelection: function(a) {
		if (document.all) {
			a.select()
		} else {
			if (document.getSelection) {
				var b = window.getSelection();
				b.removeAllRanges();
				b.addRange(a)
			}
		}
	},
	dlgInsertSpecialChar: function(o) {
		try {
			this.setRange();
			if (this.splCharDialog == null) {
				this.initSplCharDialog()
			}
			this.splCharDialog.show("MainArea");
			var m = o.target ? o.target: o.srcElement;
			var g = toDocumentPosition(this.containerElement);
			var b = toDocumentPosition(m);
			var a = g.x + b.x;
			var q = g.y + b.y + 20;
			var a = a - this.splCharDialog.element.offsetWidth + 20;
			this.splCharDialog.setLocation(a, q)
		} catch(o) {
			if (this.debugMode) {
				alert(o)
			}
		}
		return false
	},
	colorSelected: function(g, b) {
		try {
			if (this.isWebKIt || this.isIE) {
				if (g == "hilitecolor") {
					g = "backcolor"
				}
			}
			if (this.rng) {
				try {
					this.rng.collapse(true);
					this.setSelection(this.rng)
				} catch(a) {}
			}
			this.rteCommand2(g, "#" + b);
			this.updateBckColor()
		} catch(m) {
			if (this.debugMode) {
				alert(m)
			}
		}
	},
	setFontFamily: function(a) {
		_emptyStyle(this.editable, "fontFamily", a);
		this.editable.style.fontFamily = a;
		this.doUpdate(true);
		this.setCaretToEnd();
		if (!this.fontUtils.supportsBold(a)) {
			_emptyStyle(this.editable, "fontWeight", "normal")
		}
		if (!this.fontUtils.supportsItalic(a)) {
			_emptyStyle(this.editable, "fontStyle", "normal")
		}
		return false
	},
	setFontSize: function(a) {
		_emptyStyle(this.editable, "fontSize");
		this.editable.style.fontSize = "12px";
		this.doUpdate(true);
		this.setCaretToEnd();
		return false
	},
	insertHTML: function(b) {
		var q, a;
		if (window.getSelection) {
			q = window.getSelection();
			if (q.getRangeAt && q.rangeCount) {
				a = q.getRangeAt(0);
				a.deleteContents();
				var g = document.createElement("div");
				g.innerHTML = b;
				var r = document.createDocumentFragment(),
				o,
				m;
				while ((o = g.firstChild)) {
					m = r.appendChild(o)
				}
				a.insertNode(r);
				if (m) {
					a = a.cloneRange();
					a.setStartAfter(m);
					a.collapse(true);
					q.removeAllRanges();
					q.addRange(a)
				}
			}
		} else {
			if (document.selection && document.selection.type != "Control") {
				document.selection.createRange().pasteHTML(b)
			}
		}
	},
	setRange: function() {
		this.selectionText = "";
		this.rng = null;
		try {
			if (document.all) {
				var b = document.selection;
				if (b) {
					this.rng = b.createRange();
					this.selectionText = htmlEncode(this.rng.text.toString())
				}
			} else {
				if (document.getSelection) {
					var b = window.getSelection();
					if (b) {
						this.rng = b.getRangeAt(0);
						this.selectionText = htmlEncode(this.rng.toString())
					}
				}
			}
		} catch(a) {
			if (this.debugMode) {
				alert(a)
			}
		}
	},
	getHtmlSrc: function() {
		try {
			var a = this.editable.innerHTML;
			var g = document.createElement("div");
			g.innerHTML = a;
			this.removeExtraBRs(g);
			a = g.innerHTML;
			return a
		} catch(b) {
			if (this.debugMode) {
				alert("getHtmlSrc: " + b)
			}
		}
	},
	removeExtraBRs: function(b) {
		var a = new Array();
		for (i = b.childNodes.length - 1; i >= 0; i--) {
			var g = b.childNodes[i];
			if (g.tagName == "BR" && g.id != "_wd_dummy_br") {
				a.push(g)
			} else {
				break
			}
		}
		for (i = 0; i < b.childNodes.length; i++) {
			var g = b.childNodes[i];
			if (g.id == "_wd_dummy_br") {
				a.push(g);
				break
			}
		}
		for (i = 0; i < a.length; i++) {
			b.removeChild(a[i])
		}
	},
	setHtmlSrc: function(a) {
		if (a == null || a == "") {
			a = "<div>&#8203;</div>"
		}
		try {
			this.editable.innerHTML = a;
			this.html = this.getHtmlSrc();
			this.setEditableStyle();
			if (this.editingObject) {
				this.editingObject.value = this.editable.innerHTML
			}
			if (is_firefox) {}
			this.updateBckColor();
			this.setLastStyles()
		} catch(b) {
			if (this.debugMode) {
				alert("setHtmlSrc: " + b)
			}
		}
	},
	setEditableStyle: function() {
		if (this.editingObject == null) {
			return
		}
		var b = this.editingObject.element;
		var a = Element.getStyle(b, "color");
		if (a) {
			this.editable.style.color = a
		}
		a = Element.getStyle(b, "fontWeight");
		if (a) {
			this.editable.style.fontWeight = a
		}
		a = Element.getStyle(b, "fontStyle");
		if (a) {
			this.editable.style.fontStyle = a
		}
	},
	blankIt: function() {
		this.editable.innerHTML = ""
	},
	initSplCharDialog: function() {
		var A = 15;
		var o = 0;
		var x = '<table id="splCharTable" class="SplCharTable" cellpadding="0" cellspacing="0">';
		for (var u = 128; u < 255; u++) {
			if (u != 129 && u != 141 && u != 143 && u != 144 && u != 157 && u != 160) {
				o++;
				if (o == 0) {
					x += ("<tr>")
				}
				x += '<td class="SplCharTD" id="&#' + u + ';">&#' + u + ";</td>";
				if (o == A) {
					x += ("</tr>");
					o = 0
				}
			}
		}
		x += ('<td class="SplCharTD" id="&spades;">&spades;</td>');
		x += ('<td class="SplCharTD" id="&clubs;">&clubs;</td>');
		x += ('<td class="SplCharTD" id="&diams;">&diams;</td>');
		x += ('<td class="SplCharTD" id="&hearts;">&hearts;</td>');
		x += ('<td class="SplCharTD" id="&oline;">&oline;</td>');
		x += ('<td class="SplCharTD" id="&larr;">&larr;</td>');
		x += ('<td class="SplCharTD" id="&rarr;">&rarr;</td>');
		x += ('<td class="SplCharTD" id="&uarr;">&uarr;</td>');
		x += ('<td class="SplCharTD" id="&darr;">&darr;</td>');
		x += ('<td class="SplCharTD_Empty" colspan="5">&nbsp;</td>');
		x += ("</tr>");
		x += ("</table>");
		var z = document.createElement("div");
		z.innerHTML = x;
		this.splCharDialog = new Af.Dialog(z, "Description");
		this.splCharDialog.width = "280px";
		this.splCharDialog.createElement();
		this.splCharDialog.element.style.zIndex = "3000011";
		this.splCharDialog.titleElement.childNodes[0].data = "Insert Special Character";
		var y = new Af.ElementCollection(this.splCharDialog.element);
		var q = y.getFirstElementById("splCharTable");
		var g = q.rows.length;
		for (var u = 0; u < g; u++) {
			var a = q.rows[u];
			var b = a.cells.length;
			for (var o = 0; o < b; o++) {
				a.cells[o].onmousedown = this.splCharMouseDown.bindAsEventListener(this)
			}
		}
	},
	setFocus: function() {
		try {
			this.editable.focus()
		} catch(a) {}
	},
	resetFocus: function() {
		try {
			this.editable.blur()
		} catch(a) {
			log.warn("Can't reset focus", a)
		}
	},
	splCharMouseDown: function(a) {
		var b = a.target ? a.target: a.srcElement;
		if (b == null) {
			return
		}
		if (b.id.length > 0) {
			this.insertHTML(b.id);
			this.doUpdate()
		}
		this.splCharDialog.hide();
		this.setFocus();
		return false
	},
	doUpdate: function(b, a) {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = null
		}
		if (this.listener != null) {
			this.timerId = setTimeout(this.doUpdate2.bind(this, b, a), this.TYPE_HADLER_FIRE_DELAY)
		}
	},
	doUpdate2: function(a, x) {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = null
		}
		if (!a && (this.html == this.getHtmlSrc())) {
			return
		}
		var g = this.editable.getElementsByTagName("a");
		if (g != null || g.length > 0) {
			for (var m = 0; m < g.length; m++) {
				var b = g[m];
				var r = document.createTextNode(getText(b));
				b.parentNode.replaceChild(r, b)
			}
		}
		var q = false;
		if (Element.firstDescendant(this.editable) == null) {
			var y = new Element("p");
			if (this.editable.innerHTML === "<br>") {
				y.innerHTML = "";
				console.log("Delete <br> for ie 11, bug GFL-153")
			} else {
				y.innerHTML = this.editable.innerHTML
			}
			if (this.l_fs) {
				y.style.fontStyle = this.l_fs;
				y.style.fontWeight = this.l_fw;
				y.style.textAlign = this.l_ta;
				y.style.color = this.l_c
			}
			removeAll(this.editable);
			this.editable.appendChild(y);
			this.setCaretToEnd();
			q = true
		}
		var u = this.extractText();
		var o = this.getHtmlSrc();
		o = removeLFCR(o);
		this.html = o;
		this.editingObject.originalText = this.editingObject.value;
		this.editingObject.updateRichText(o, this.editable);
		this.addModifyChange(x);
		if (u) {
			this.listener.canvas.generateImageFromEditor(this.editingObject, u)
		}
		if (q && this.listener.editingObject) {
			this.setCaretToEnd()
		}
	},
	addModifyChange: function(g) {
		var b = this.editingObject.originalText;
		var a = this.editingObject.value;
		if (b != a) {
			chgMgr.beginTx();
			if (g != null) {
				chgMgr.addModifyChangeByMethod(g.obj, g.method, g.oldV, g.newV, null)
			}
			chgMgr.addModifyChangeByMethod(this.editingObject, this.editingObject.updateRichText, b, a, null);
			chgMgr.endTx()
		}
	},
	underlineChanged: function() {
		if (this.listener != null) {
			var a = this.listener.underlineChanged();
			if (a != null) {
				this.editable.style.textDecoration = a;
				_emptyStyle(this.editable, "textDecoration")
			}
		}
		return false
	},
	setFormatProperty: function(q, m, o, b, g, r, a) {
		this.editable.style.fontSize = "12px";
		this.editable.style.fontFamily = m;
		if (b) {
			this.editable.style.textDecoration = "underline"
		} else {
			this.editable.style.textDecoration = "none"
		}
		if (o != null) {
			if (o.toLowerCase() == "justified") {
				o = "justify"
			}
			this.editable.style.textAlign = o;
			_emptyStyle(this.editable, "textAlign", o)
		}
		if (g) {
			this.editable.style.color = (g.indexOf("#") >= 0 ? "": "#") + g
		}
		if (r) {
			this.editable.style.fontWeight = r
		}
		if (a) {
			this.editable.style.fontStyle = a
		}
	},
	updateBckColor: function() {
		var g = this.editable.cloneNode(true);
		Element.cleanWhitespace(g);
		g.style.position = "absolute";
		g.style.left = "-10000px";
		document.body.appendChild(g);
		var r = getFirstTextE(g);
		if (r != null && r.style != null) {
			var u = null;
			u = Element.readAttribute(r, "color");
			if (u == null) {
				u = getStyle("color", r)
			}
			if (u != null && u != "") {
				var q = u.parseColor();
				u = q;
				if (this.editable) {
					this.editable.style.color = q
				}
				var a = q.indexOf("#");
				if (a >= 0) {
					q = q.substring(a + 1)
				}
				var o = parseInt(q, 16);
				var b = this.LIGHT_BACKGROUND_COLOR;
				var m = false;
				try {
					b = ColorConverter.mostContrastBackground(q, [this.LIGHT_BACKGROUND_COLOR, this.DARK_BACKGROUND_COLOR])
				} catch(r) {
					console.log("WARN: Can't calculate collor difference. " + r.message);
					m = true
				}
				if (m) {
					b = this.LIGHT_BACKGROUND_COLOR;
					if (o > this.BOUNDARY_DARK_TEXT_HEX_COLOR || o in this.COLOR_EXCEPTION_LIST) {
						b = this.DARK_BACKGROUND_COLOR
					}
				}
				this.editable.style.backgroundColor = b;
				if (this.editableWrapper) {
					this.editableWrapper.style.backgroundColor = b
				}
			}
		}
		document.body.removeChild(g)
	},
	emptyEditableStyle: function(a) {
		if (a == "italic") {
			this.editable.style.fontStyle = "";
			this.editingObject.element.style.fontStyle = ""
		} else {
			if (a == "bold") {
				sn = "fontWeight";
				this.editable.style.fontWeight = "normal";
				this.editingObject.element.style.fontWeight = "normal"
			}
		}
	},
	updateStyle: function(a) {
		var b = null;
		if (a == "bold") {
			b = "fontWeight"
		} else {
			if (a == "italic") {
				b = "fontStyle"
			} else {
				if (a == "justifyleft" || a == "justifyright" || a == "justifycenter" || a == "justifyfull") {
					b = "textAlign"
				} else {
					if (a == "forecolor") {
						b = "color"
					}
				}
			}
		}
		if (b != null) {
			this.emptyStyle(b);
			return true
		}
		return false
	},
	fallbackCommand: function(b, r) {
		var q = null;
		var a;
		if (b == "justifyleft") {
			q = "textAlign";
			a = "left"
		} else {
			if (b == "justifyright") {
				q = "textAlign";
				a = "right"
			} else {
				if (b == "justifycenter") {
					q = "textAlign";
					a = "center"
				} else {
					if (b == "justifyfull") {
						q = "textAlign";
						a = "justify"
					} else {
						if (b == "forecolor") {
							q = "color";
							a = r
						}
					}
				}
			}
		}
		if (q != null) {
			this.editable.style[q] = a;
			_emptyStyle(this.editable, q, a);
			var g = null;
			if (this.editingObject) {
				if (q == "textAlign") {
					var o = this.editingObject;
					var m = o.getTextAlign();
					g = {
						obj: o,
						method: o.setTextAlign,
						oldV: m,
						newV: a
					};
					o.setTextAlign(a)
				} else {
					if (q == color) {
						var o = this.editingObject;
						var m = o.color;
						g = {
							obj: o,
							method: o.setTextColor,
							oldV: m,
							newV: a
						};
						o.editingObject.setTextColor(a)
					}
				}
			}
			this.doUpdate(true, g);
			return true
		}
		return false
	},
	emptyStyle: function(m) {
		try {
			var o = this.getRange();
			if (o == null) {
				return
			}
			var b = new Array();
			this.selectedNodesList(this.editable, o, b);
			for (var g = 0; g < b.length; g++) {
				if (m == "textAlign") {
					b[g].style[m] = "";
					b[g].align = ""
				}
				_emptyStyle(b[g], m)
			}
		} catch(a) {
			if (this.debugMode) {
				alert(a)
			}
		}
	},
	selectedNodesList: function(m, g, a) {
		for (var b = 0; b < m.childNodes.length; b++) {
			var o = m.childNodes[b];
			if (o.nodeType == Node.ELEMENT_NODE) {
				if (this.insideRange(o, g)) {
					a.push(o)
				} else {
					this.selectedNodesList(o, g, a)
				}
			}
		}
	},
	insideRange: function(g, b) {
		if (is_ie) {
			var a = document.body.createTextRange();
			a.moveToElementText(g);
			if (b.compareEndPoints("StartToStart", a) <= 0 && b.compareEndPoints("EndToEnd", a) >= 0) {
				return true
			}
		} else {
			var a = document.createRange();
			a.selectNode(g);
			if (b.compareBoundaryPoints(b.START_TO_START, a) <= 0 && b.compareBoundaryPoints(b.END_TO_END, a) >= 0) {
				return true
			}
		}
		return false
	},
	getRange: function() {
		try {
			if (document.all) {
				var b = document.selection;
				return b.createRange()
			} else {
				if (document.getSelection) {
					var b = window.getSelection();
					return b.getRangeAt(0)
				}
			}
		} catch(a) {
			return null
		}
	},
	extractText: function() {
		return extractText(this.editable, this.editingObject)
	}
});
function _emptyStyle(q, m, a) {
	if (q.nodeType == Node.ELEMENT_NODE) {
		for (var g = 0; g < q.childNodes.length; g++) {
			var r = q.childNodes[g];
			if (r.nodeType == Node.ELEMENT_NODE) {
				var b = r.tagName.toLowerCase();
				if (m == "fontFamily") {
					if (b == "font") {
						r.face = a
					}
					r.style.fontFamily = a
				} else {
					if ((m == "fontStyle" && ((b == "em" && !is_ie) || (b == "i" && !is_ie))) || (m == "fontWeight" && ((b == "strong" && !is_ie) || (b == "b" && !is_ie)))) {
						if (firefox_version < 14) {
							var o = document.createElement("span");
							o.innerHTML = r.innerHTML;
							r.parentNode.replaceChild(o, r)
						}
					} else {
						if (m == "textAlign" && a) {
							r.style.textAlign = a
						}
					}
				}
				if (m == "color" && a) {
					if (b == "font") {
						r.color = a
					}
					r.style.fontFamily = a
				} else {
					r.style[m] = ""
				}
				_emptyStyle(r, m, a)
			}
		}
	}
}
function getWords(r) {
	var a = [];
	sl = r.split("\n");
	for (var o = 0; o < sl.length; o++) {
		if (o > 0) {
			a.push("\n")
		}
		var q = sl[o];
		var m = false;
		var g = "";
		for (var b = 0; b < q.length; b++) {
			var u = q.charAt(b);
			if (!m && u == " ") {
				a.push(g);
				g = u;
				m = true
			} else {
				if (escape(u).toLowerCase() == "%a0") {
					u = "&nbsp;"
				}
				g += u;
				m = u == " "
			}
		}
		if (g.length > 0) {
			a.push(g)
		}
	}
	return a
}
function extractText(m, g) {
	var b = parseFloat(g.fontSize);
	var a = {
		ff: g.fontFamily,
		a: Element.getStyle(m, "textAlign"),
		s: b,
		words: []
	};
	_extractText(m, a);
	return a
}
function _extractText(z, B) {
	var b = z.childNodes;
	var m;
	var D = "";
	var y = false;
	var g = b.length;
	for (var u = 0; u < g; u++) {
		m = b[u];
		var A = Element.getStyle(z, "color");
		A = A.parseColor();
		var x = Element.getStyle(z, "fontStyle");
		var q = Element.getStyle(z, "fontWeight");
		if (m.nodeType === 3 && (D.length > 0 || m.nodeValue != "\n")) {
			D += m.nodeValue
		} else {
			if (m.nodeName === "BR" || m.nodeType == 1) {
				y = true
			}
		}
		if ((y || u == (g - 1)) && D.length > 0) {
			var o = getWords(D);
			var C = B.words;
			for (var r = 0; r < o.length; r++) {
				C.push({
					t: replaceSpace(o[r]),
					c: A,
					fs: x,
					fw: q
				})
			}
			D = "";
			y = false
		}
		if (m.nodeName === "BR") {
			if (!Prototype.Browser.Gecko || Element.readAttribute(m, "_moz_dirty") == null) {
				B.words.push({
					t: "\n",
					c: A,
					fs: x,
					fw: q
				})
			}
		} else {
			if (m.nodeType == 1) {
				if (u > 0) {
					var a = b[u - 1];
					if (a.nodeType == 1 && a.offsetTop < m.offsetTop) {
						B.words.push({
							t: "\n",
							c: A,
							fs: x,
							fw: q
						})
					}
				}
				this._extractText(m, B)
			}
		}
	}
}
function getText(a) {
	return a.innerHTML.strip().stripTags().replace(/\n/g, " ").replace(/\s+/g, " ")
}
ColorConverter = (function() {
	return {
		mostContrastBackground: function(a, o) {
			var r;
			var q = 0;
			for (var g = 0; g < o.length; g++) {
				var b = o[g];
				var m = this.colorDifference(a, b);
				if (m > q) {
					q = m;
					r = b
				}
			}
			return r
		},
		parseRgb: function(g) {
			g = g.replace(/^\s+|\s+$/g, "");
			var b = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			g = g.replace(b,
			function(q, x, u, o) {
				return x + x + u + u + o + o
			});
			var a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(g);
			return a ? [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)] : null
		},
		colorDifference: function(a, m) {
			var b = this.parseRgb(a);
			var o = this.parseRgb(m);
			if (!b || !o) {
				return null
			}
			var r = this.rgb2lab(b);
			var g = this.rgb2lab(o);
			var q = Math.sqrt(Math.pow((r[0] - g[0]), 2) + Math.pow((r[1] - g[1]), 2) + Math.pow((r[2] - g[2]), 2));
			return q
		},
		rgb2xyz: function(o) {
			var u = o[0] / 255,
			q = o[1] / 255,
			m = o[2] / 255;
			u = u > 0.04045 ? Math.pow(((u + 0.055) / 1.055), 2.4) : (u / 12.92);
			q = q > 0.04045 ? Math.pow(((q + 0.055) / 1.055), 2.4) : (q / 12.92);
			m = m > 0.04045 ? Math.pow(((m + 0.055) / 1.055), 2.4) : (m / 12.92);
			var a = (u * 0.4124) + (q * 0.3576) + (m * 0.1805);
			var B = (u * 0.2126) + (q * 0.7152) + (m * 0.0722);
			var A = (u * 0.0193) + (q * 0.1192) + (m * 0.9505);
			return [a * 100, B * 100, A * 100]
		},
		rgb2lab: function(u) {
			var r = this.rgb2xyz(u),
			m = r[0],
			B = r[1],
			A = r[2],
			q,
			o,
			g;
			m /= 95.047;
			B /= 100;
			A /= 108.883;
			m = m > 0.008856 ? Math.pow(m, 1 / 3) : (7.787 * m) + (16 / 116);
			B = B > 0.008856 ? Math.pow(B, 1 / 3) : (7.787 * B) + (16 / 116);
			A = A > 0.008856 ? Math.pow(A, 1 / 3) : (7.787 * A) + (16 / 116);
			q = (116 * B) - 16;
			o = 500 * (m - B);
			g = 200 * (B - A);
			return [q, o, g]
		}
	}
})();
Af.OpacityTool = Class.create({
	initialize: function(a) {
		this.designSurface = a;
		this.top = this.createElement();
		this.right = this.createElement();
		this.left = this.createElement();
		this.bottom = this.createElement()
	},
	createElement: function() {
		var a = document.createElement("div");
		a.style.visibility = "hidden";
		a.style["-moz-opacity"] = "0.5";
		a.style.opacity = ".50";
		a.style.filter = "alpha(opacity=50)";
		a.style.zIndex = "100";
		a.style.position = "absolute";
		a.style.backgroundColor = "#c2c2c2";
		a.name = "__#opacity";
		return a
	},
	show: function(B, z, C, o, a, A, q, u) {
		var r = this.top;
		this.designSurface.element.appendChild(r);
		var D = A - z;
		if (D > 0) {
			r.style.visibility = "visible";
			r.style.left = B + "px";
			r.style.top = z + "px";
			r.style.width = C + "px";
			r.style.height = D + "px"
		} else {
			D = 0;
			r.style.visibility = "hidden"
		}
		r = this.bottom;
		this.designSurface.element.appendChild(r);
		var m = z + o - (A + u);
		if (m > 0) {
			r.style.visibility = "visible";
			r.style.left = B + "px";
			r.style.top = (A + u) + "px";
			r.style.width = C + "px";
			r.style.height = m + "px"
		} else {
			m = 0;
			r.style.visibility = "hidden"
		}
		r = this.right;
		this.designSurface.element.appendChild(r);
		var g = B + C - (a + q);
		var b = o - D - m;
		if (g > 0 && b > 0) {
			r.style.visibility = "visible";
			r.style.left = (a + q) + "px";
			r.style.top = (z + D) + "px";
			r.style.width = g + "px";
			r.style.height = (b) + "px"
		} else {
			r.style.visibility = "hidden"
		}
		r = this.left;
		this.designSurface.element.appendChild(r);
		g = a - B;
		b = o - D - m;
		if (g > 0 && b > 0) {
			r.style.visibility = "visible";
			r.style.left = B + "px";
			r.style.top = (z + D) + "px";
			r.style.width = g + "px";
			r.style.height = (b) + "px"
		} else {
			r.style.visibility = "hidden"
		}
	},
	hide: function() {
		var a = this.top;
		a.style.visibility = "hidden";
		a = this.right;
		a.style.visibility = "hidden";
		a = this.left;
		a.style.visibility = "hidden";
		a = this.bottom;
		a.style.visibility = "hidden"
	}
});
Af.CropCanvas = Class.create(Af.Canvas, {
	initialize: function(b, m, a, g) {
		this.initCanvas(m, a);
		this.designer = b;
		this.timer = null;
		this.cropRegion = null;
		this.zoomFactor = 1;
		this.element.style.cursor = "default";
		this.selectionTool = new Af.SelectionTool(this);
		this.selectionTool.imageCropCanvas = true;
		this.opacityTool = new Af.OpacityTool(this);
		this.element.onmousedown = this.mouseDownOnDesignSurface.bindAsEventListener(this);
		this.element.onkeydown = this.keyDown.bindAsEventListener(this);
		this.canvasSize = 500;
		this.aspectFlag = g;
		this.aspectFlag.onchange = this.aspectFlagChanged.bind(this)
	},
	setDrawingObject: function(J) {
		this.origObj = J;
		removeAll(this.element);
		var O = new Element("img");
		var a = true;
		if (J.originalImage) {
			O.src = baseImageURL + J.originalImage;
			a = false
		} else {
			O.src = J.element.src
		}
		this.img = O;
		O.border = "";
		O.spacing = "";
		this.element.appendChild(O);
		if (J.originalImage) {
			this.actualW = parseInt(J.originalImageWidth);
			this.actualH = parseInt(J.originalImageHeight)
		} else {
			if (O.offsetWidth != 0 && O.offsetHeight != 0) {
				this.actualW = O.offsetWidth;
				this.actualH = O.offsetHeight
			} else {
				var b = navigator.userAgent.toLowerCase();
				var o = false;
				if (b.indexOf("safari") != -1) {
					o = (parseInt(b.substring(b.indexOf("version") + 8))) == 6
				}
				var r = (b.indexOf("chrome") != -1);
				var G = J.artworkHighResFile;
				var Q = (G.toLowerCase().lastIndexOf(".pdf") == G.length - 4);
				if (r || o) {
					var K = 96;
					var D = 72;
					var R = 1;
					if (J.originalResolution && J.originalResolution.length != 0 && parseInt(J.originalResolution) != 0) {
						if (!Q) {
							K = parseInt(J.originalResolution);
							D = 96;
							R = 0.64
						}
					}
					var q = K / D;
					var I = J.art_width ? J.art_width: parseInt(J.ow);
					var m = J.art_height ? J.art_height: parseInt(J.oh);
					this.actualW = (parseInt(I) * q) * R;
					this.actualH = (parseInt(m) * q) * R;
					var S = (J.getDirection() == "v");
					if (a && S) {
						var B = this.actualW;
						this.actualW = this.actualH;
						this.actualH = B
					}
				}
			}
		}
		this.scale = 1;
		if (this.actualW > this.actualH) {
			if (this.actualW > this.canvasSize) {
				O.style.width = this.canvasSize + "px";
				this.scale = this.canvasSize / this.actualW
			}
		} else {
			if (this.actualH > this.canvasSize) {
				O.style.height = this.canvasSize + "px";
				this.scale = this.canvasSize / this.actualH
			}
		}
		$("imageEditOriginalISize").innerHTML = "" + this.actualW + "*" + this.actualH;
		var A = Math.round(this.actualW * this.scale);
		var M = Math.round(this.actualH * this.scale);
		O.style.width = A + "px";
		O.style.height = M + "px";
		this.sfx1 = 0;
		this.sfx2 = A;
		this.sfy1 = 0;
		this.sfy2 = M;
		var z, u;
		var E = Math.round(A / M);
		if (J.cx != null) {
			z = Math.round(J.cx * this.scale);
			u = Math.round(J.cy * this.scale);
			A = Math.round(J.cw * this.scale);
			M = Math.round(J.ch * this.scale);
			this.aspectFlag.checked = (E == Math.round(A / M))
		} else {
			z = 0;
			u = 0;
			A = Math.round(A);
			M = Math.round(M);
			this.aspectFlag.checked = true
		}
		var F;
		if (a) {
			F = new Af.RectangleObject(z, u, A, M);
			F.aspectRatio = parseFloat(J.w) / parseFloat(J.h)
		} else {
			var C = J.originalImage.lastIndexOf(".");
			var H = J.originalImage.substring(0, C);
			var N = "0";
			var g = "_rotated_";
			var T = H.lastIndexOf(g);
			if (T != -1) {
				N = H.substring(T + g.length)
			}
			var L = (N == "90" || N == "-90" || N == "270" || N == "-270");
			var S = (J.getDirection() == "v");
			this.isOrthogonal = S ^ L;
			F = this.isOrthogonal ? new Af.RectangleObject(z, u, M, A) : new Af.RectangleObject(z, u, A, M);
			if (this.isOrthogonal) {
				var P = F.w;
				F.w = F.h;
				F.h = P
			}
			F.aspectRatio = this.isOrthogonal ? (parseFloat(J.h) / parseFloat(J.w)) : (parseFloat(J.w) / parseFloat(J.h))
		}
		F.canvas = this;
		F.initialSetup(this.zoomFactor);
		F.createElement();
		this.dwObj = F;
		this.selectionTool.setDrawingObject(F);
		this.refreshAll()
	},
	refreshAll: function() {
		this.paint2();
		this.repositionSelectionTool()
	},
	paint2: function() {
		this.resetCanvasPosition();
		this.dwObj.paint(this)
	},
	keyDown: function(o) {
		if (!o) {
			o = this.window.event
		}
		var a = true;
		var u = o.target ? o.target: o.srcElement;
		var q = o.keyCode ? o.keyCode: o.which;
		var y = 0;
		var x = 0;
		var b = null;
		if (q == 37) {
			y = -1
		} else {
			if (q == 38) {
				x = -1
			} else {
				if (q == 39) {
					y = 1
				} else {
					if (q == 40) {
						x = 1
					}
				}
			}
		}
		if (y != 0 || x != 0) {
			var m = this.dwObj.getOrigBound();
			var g = this.dwObj.getOrigBound();
			if (y > 0) {
				g.x += 1;
				g.w -= 1
			}
			if (y < 0) {
				g.w -= 1
			}
			if (x > 0) {
				g.y += 1;
				g.h -= 1
			}
			if (x < 0) {
				g.h -= 1
			}
			this.dwObj.setOrigBounds(g.x, g.y, g.w, g.h);
			a = consumeEvent(o)
		}
		return a
	},
	repositionSelectionTool: function() {
		this.selectionTool.repositionTools()
	},
	toolsRepositioned: function() {
		var a = this.getCropArea();
		$("imageEditCropBox_x").innerHTML = a.x;
		$("imageEditCropBox_y").innerHTML = a.y;
		$("imageEditCropBox_w").innerHTML = a.w;
		$("imageEditCropBox_h").innerHTML = a.h;
		setTimeout(this.repositionOpacityTool.bind(this), 1)
	},
	getCropArea: function() {
		var a = Math.round(this.dwObj.x / this.scale);
		var m = Math.round(this.dwObj.y / this.scale);
		var b = Math.round(this.dwObj.w / this.scale);
		var g = Math.round(this.dwObj.h / this.scale);
		return {
			x: a,
			y: m,
			w: b,
			h: g
		}
	},
	getCropImage: function() {
		return this.origObj.originalImage ? this.origObj.originalImage: this.origObj.imageFile
	},
	repositionOpacityTool: function() {
		if (this.dwObj != null) {
			var m = this.img;
			var g = this.dwObj.element;
			this.opacityTool.show(0, 0, m.offsetWidth, m.offsetHeight, g.offsetLeft, g.offsetTop, g.offsetWidth, g.offsetHeight)
		}
	},
	mouseDownOnDesignSurface: function(b) {
		if (!b) {
			b = this.window.event
		}
		var a = b.target ? b.target: b.srcElement;
		if (a.name == "___resize___") {
			return this.selectionTool.mouseDownOnResizeE(b)
		}
		if (this.timer != null) {
			clearTimeout(this.timer);
			this.timer = null
		}
		this.mx1 = b.clientX + docScrollLeft() + this.viewPortX1 - this.offsetLeft;
		this.my1 = b.clientY + docScrollTop() + this.viewPortY1 - this.offsetTop;
		if (this.dwObj) {
			this.element.onmousemove = this.mouseMoveOnDrawingObject.bindAsEventListener(this);
			this.element.onmouseup = this.mouseUpOnDrawingObject.bindAsEventListener(this)
		}
		consumeEvent(b);
		return false
	},
	mouseMoveOnDrawingObject: function(a) {
		if (is_ie) {
			if (this.timer != null) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(this._mouseMoveOnDrawingObject.bind(this, a.clientX, a.clientY), 5)
		} else {
			this._mouseMoveOnDrawingObject(a.clientX, a.clientY)
		}
		consumeEvent(a);
		return false
	},
	_mouseMoveOnDrawingObject: function(q, m) {
		if (this.timer != null) {
			clearTimeout(this.timer);
			this.timer = null
		}
		var a = q + docScrollLeft() + this.viewPortX1 - this.offsetLeft;
		var r = m + docScrollTop() + this.viewPortY1 - this.offsetTop;
		var g = a - this.mx1;
		var b = r - this.my1;
		if (!this.moveStarted) {
			if (Math.abs(g) >= 2 || Math.abs(b) >= 2) {
				this.selectionTool.moveStart();
				this.moveStarted = true;
				var o = this.selectionTool.move(g, b);
				this.mx1 += o.x;
				this.my1 += o.y
			}
		} else {
			var o = this.selectionTool.move(g, b);
			this.mx1 += o.x;
			this.my1 += o.y
		}
	},
	mouseUpOnDrawingObject: function(a) {
		this.element.onmousemove = null;
		this.element.onmouseup = null;
		if (this.moveStarted) {
			this.selectionTool.moveEnd();
			this.moveStarted = false
		}
		consumeEvent(a);
		return false
	},
	isAspectRatioLocked: function() {
		if ($$('input:checked[type="radio"][name="crop"]')) {
			var a = $$('input:checked[type="radio"][name="crop"]').first().value;
			return a === "on"
		} else {
			return true
		}
	},
	aspectFlagChanged: function() {}
});
var PsP = {
	version: "1.0",
	SelectionColor: "0000ff",
	SelectionBorderWidth: "1",
	SelectionBorderStyle: "solid"
};
var console = window.console || {
	log: function() {},
	warn: function() {},
	error: function() {}
};
var NO_ARROW = 0;
var ARROW_END_A = 1;
var ARROW_END_B = 2;
var _useFile = false;
var baseImageURL = "http://qaupload.psprint.com/newcroptool/GetTN.aspx?tnFlag=false";
var cropTNImageURL = "http://qaupload.psprint.com/newcroptool/GetTN.aspx?tnFlag=true";
var baseDataURL = "data/";
var basePageURL = "/psp/html/";
var baseTemplateURL = "template/";
var baseTemplateThumbnailURL = "template/thumbnail/";
var svcURL = "/vv/ajax/design";
var filedownloadURL = null;
var _usePsPGallery = true;
var basePageURL2 = ".";
var topURL = "./";
var galleryURL = "../crop/";
var cropTest = false;
var playMode = false;
var preflightMode = false;
var designerContainer4 = null;
function initializeUI4(a, m) {
	if (designerContainer4 == null) {
		_appName = "PsPDesigner";
		designerContainer4 = new PsP.DesignerContainer4();
		designerContainer4.initializationListener = m
	}
	designerContainer4.show(a);
	var b = setInterval(function() {
		if (designer && designer.wfe && designer.currentSurface) {
			designer.reloadGuides();
			designer.showMultiRTEEditor();
			clearInterval(b)
		}
	},
	300);
	var o = setInterval(function() {
		if (designer && designer.artwork) {
			designNameSaver.init(designer, window.storejs);
			designName.init(designer, designNameSaver);
			savedTimeStamp.setSavedTimeStampLabel(designer, designNameSaver);
			clearInterval(o)
		}
	},
	300);
	if (_storeId_ === AuthUtil.PSPRINT_STORE_ID) {
		var g = new FooterView(AuthUtil, LOGIN_DIALOG_WIDTH, LOGIN_DIALOG_HEIGHT, psp)
	}
}
var designer = null;
var sideChangeFunction = null;
var dtInitializedFunction = null;
var zoomChangedFunction = null;
var readerMode = false;
var legacyTest = false;
var showJobListDialog = false;
PsP.RTEDialogDropZone = Class.create(Af.Dropzone, {
	initialize: function(a) {
		this.htmlElement = a;
		this.absoluteRect = null
	},
	canAccept: function(b) {
		var a = b[0];
		if (a.type == "_rte") {
			return true
		}
		return false
	},
	accept: function(a) {},
	activate: function(a) {},
	deactivate: function(a) {},
	showHover: function() {},
	hideHover: function() {}
});
PsP.DesignerContainer4 = Class.create({
	initialize: function() {
		this.designer = null;
		this.nPSPFile = 0;
		this.mainImageUploaded = false;
		this.playerPaused = false;
		this.previewOption = 1;
		this.playerTimer = null;
		this.playerTimeout = 5000;
		if (playMode || preflightMode) {
			this.setPreviewOption(false)
		}
		this.currentTimeout = 0;
		this.playerAtStation = null;
		this.autoStep = false;
		this.CURRENT_STATION = "currentStation"
	},
	show: function() {
		debugA("DesignerContainer.show() - entered");
		this.loadCropToolInputPSP()
	},
	loadCropToolInputPSP: function() {
		if ($("busyIndicator") == null) {
			showModalMessageDialog("Retrieving Design ... please wait", "Retrieving", 300, 100)
		}
		var a = new Af.DataRequest(svcURL, this.requestCompletedLoadInputPSP.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		if (playMode) {
			a.addService("DesignerSvc", "getNextPSP")
		} else {
			a.addService("DesignerSvc", "loadCropToolInputPSP");
			if (typeof psp != "undefined") {
				a.addParameter("jobId", psp)
			}
		}
		ajaxEngine.processRequest(a)
	},
	reloadCropToolInputPSP: function(g, a) {
		showModalMessageDialog("Retrieving Design ... please wait", "Retrieving", 300, 100);
		this.mainImageUploaded = a;
		var b = new Af.DataRequest(svcURL, this.requestCompletedLoadInputPSP.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		b.addService("DesignerSvc", "loadCropToolInputPSP");
		b.addParameter("jobId", g);
		ajaxEngine.processRequest(b)
	},
	requestCompletedLoadInputPSP: function(b) {
		hideModalMessageDialog();
		if (b.responseText == "EndOfList") {
			var g = $("vqcFrameRow");
			if (g) {
				g.style.display = "none"
			}
			showMessageDialog("End of file, player is stopping", "Request", 400, -1);
			this.nPSPFile = 0;
			return
		}
		this.nPSPFile++;
		var a = new Af.XMLToDataSet(b.responseXML);
		this.product = a.data.product[0];
		showJobListDialog = this.product[this.CURRENT_STATION] == "savePost";
		if (showJobListDialog) {
			InitializeServiceIndexing(this.product.jobId)
		}
		if (typeof _currentStation_ != "undefined") {
			this.product[this.CURRENT_STATION] = _currentStation_
		}
		if (playMode) {
			this.playerAtStation = "position";
			if (this.product[this.CURRENT_STATION] == "gettingStarted") {
				this.product[this.CURRENT_STATION] = "position"
			}
		}
		this.configParamList = a.data.configParam;
		this.showDesigner(true);
		if (playMode) {
			newPSPLoaded(this.product)
		}
	},
	showDesigner: function(a) {
		if (this.designer == null) {
			setTimeout(this.setupDesigner.bind(this), 100)
		} else {
			this.designer.clearAll();
			this.designer.wfe = null;
			this.designer.setDrawingObjects(this.product, true);
			setTimeout(this.createWorkFlow.bind(this), 10);
			if (!playMode) {
				if (this.mainImageUploaded) {
					this.designer.processUploadedImage()
				}
			} else {}
		}
	},
	setupDesigner: function() {
		this.designer = new PsP.Designer4("canvasContainer", "canvas");
		this.designer.onInitialized = dtInitializedFunction;
		this.designer.onSideChange = sideChangeFunction;
		this.designer.onZoomChange = zoomChangedFunction;
		this.designer.dc = this;
		this.designer.fontSizeList = this.fontSizeList;
		this.designer.countNewTextElement = 0;
		designer = this.designer;
		this.designer.setConfigParamList(this.configParamList);
		var a = document.getElementById("canvasContainer");
		dndMgr.registerDropZone(new PsP.RTEDialogDropZone(a));
		this.designer.setDrawingObjects(this.product);
		if (playMode) {
			setTimeout(this.createWorkFlow.bind(this), 10)
		} else {
			setTimeout(this.createWorkFlow.bind(this), 10);
			if (readerMode && typeof doReaderMode != "undefined") {
				doReaderMode()
			}
		}
	},
	doSaveandPostProcess: function() {
		if (this.playerPaused) {
			return
		}
		this.currentTimeout -= 1000;
		if (this.playerTimer) {
			try {
				clearTimeout(this.playerTimer)
			} catch(a) {}
		}
		this.playerTimer = null;
		if (this.currentTimeout <= 0) {
			this.currentTimeout = 0;
			if (this.wfe.saveDocPlayerMode(this.playerAtStation)) {
				if (this.playerTimer) {
					try {
						clearTimeout(this.playerTimer)
					} catch(a) {}
				}
				this.playerTimer = null;
				this.currentTimeout = 0
			} else {
				this.currentTimeout = this.playerTimeout;
				setTimeout(function() {},
				100);
				this.playerTimer = setTimeout(this.doSaveandPostProcess.bind(this), 1000)
			}
			this.showPlayerMsg()
		} else {
			this.showPlayerMsg();
			this.playerTimer = setTimeout(this.doSaveandPostProcess.bind(this), 1000)
		}
	},
	doNext: function() {
		if (this.playerTimer) {
			try {
				clearTimeout(this.playerTimer)
			} catch(a) {}
		}
		this.playerTimer = null;
		designer.pageNail.selectTN(0, null, true);
		this.showPlayerAtStation();
		this.showPlayerMsg();
		if (!this.autoStep && this.playerAtStation == "position") {
			this.playerAtStation = "finalReview";
			hideDialogWin();
			hideModalMessageDialog();
			this.wfe.showLegacyTestContent(this.playerAtStation);
			this.currentTimeout = this.playerTimeout;
			this.playerTimer = setTimeout(this._doNext.bind(this), 1000)
		} else {
			if (this.autoStep && this.playerAtStation != "finishing") {
				this.currentTimeout = this.playerTimeout;
				setTimeout(this._doNext.bind(this), 1000)
			} else {
				this._doNext()
			}
		}
	},
	togglePlayerPauseResume: function() {
		this.playerPaused = !this.playerPaused;
		actionHandler.playerPauseStatusChanged(legacyTest);
		if (!this.playerPaused) {
			if (!this.autoStep) {
				this.doSaveandPostProcess()
			} else {
				this._doNext()
			}
		} else {
			if (this.playerTimer) {
				clearTimeout(this.playerTimer);
				this.playerTimer = null
			}
		}
	},
	doPlayerStep: function() {
		if (this.playerPaused) {
			this.playerPaused = !this.playerPaused;
			actionHandler.playerPauseStatusChanged(legacyTest)
		}
		if (this.playerTimer) {
			try {
				clearTimeout(this.playerTimer)
			} catch(a) {}
		}
		this.playerTimer = null;
		this.currentTimeout = 0;
		if (!this.autoStep && this.playerAtStation == "position") {
			this.doSaveandPostProcess()
		} else {
			this._doNext()
		}
	},
	doPlayerBackStep: function() {
		this.currentTimeout = 0;
		if (this.playerTimer) {
			try {
				clearTimeout(this.playerTimer)
			} catch(a) {}
		}
		this.playerTimer = null;
		if (designer.currentSide > 1) {
			var b = designer.currentSide - 2;
			designer.pageNail.selectTN(b, null, true)
		} else {
			if (this.playerAtStation = "finalReview") {
				this.playerAtStation = "position";
				designer.wfe.gotoStation(this.playerAtStation)
			}
		}
		this.currentTimeout = this.playerTimeout;
		this.showPlayerMsg();
		if (!this.autoStep) {
			this.doSaveandPostProcess()
		} else {
			this._doNext()
		}
	},
	setPreviewOption: function(b) {
		var a = 1;
		var g = $("playerShowsPDF");
		if (g != null && g.checked) {
			a = 1
		} else {
			g = $("playerShowsJPG");
			if (g != null && g.checked) {
				a = 2
			} else {
				g = $("playerShowsBoth");
				if (g != null && g.checked) {
					a = 3
				}
			}
		}
		this.previewOption = a;
		var g = $("vqcFrameRow");
		if (g) {
			g.style.display = this.previewOption == 1 || this.previewOption == 3 ? "": "none"
		}
		var g = $("canvasRow");
		if (g) {
			g.style.display = this.previewOption == 2 || this.previewOption == 3 ? "": "none"
		}
		if (this.wfe && (playMode || preflightMode)) {
			if (legacyTest) {
				this.wfe.showLegacyTestContent(this.playerAtStation)
			} else {
				if (b && (this.previewOption == 1 || this.previewOption == 3)) {
					this.wfe.showVQCPDF()
				}
			}
		}
	},
	_doNext: function() {
		hideDialogWin();
		hideModalMessageDialog();
		if (this.playerPaused) {
			return
		}
		this.currentTimeout -= 1000;
		if (this.playerTimer) {
			try {
				clearTimeout(this.playerTimer)
			} catch(a) {}
		}
		this.playerTimer = null;
		if (this.currentTimeout <= 0) {
			if (this.playerAtStation != "finishing" && designer.currentSide < designer.surfaces.length) {
				var b = designer.currentSide;
				designer.pageNail.selectTN(b, null, true);
				this.currentTimeout = this.playerTimeout;
				this.showPlayerMsg();
				this.playerTimer = setTimeout(this._doNext.bind(this), 1000)
			} else {
				if (legacyTest && this.playerAtStation == "position") {
					designer.wfe.doNextAction(true);
					this.playerAtStation = "finalReview"
				} else {
					if (!legacyTest && this.playerAtStation == "finalReview") {
						if (!this.wfe.saveDocPlayerMode(this.playerAtStation)) {
							this.playerTimer = setTimeout(this._doNext.bind(this), 1000)
						}
						this.playerAtStation = "finishing"
					} else {
						this.currentTimeout = 0;
						designer.pageNail.selectTN(0, null, true);
						this.showPlayerMsg();
						this.loadCropToolInputPSP()
					}
				}
			}
		} else {
			this.showPlayerMsg();
			this.playerTimer = setTimeout(this._doNext.bind(this), 1000)
		}
	},
	createWorkFlow: function() {
		if (PsP.WorkFlowEngine != null) {
			this.wfe = new PsP.WorkFlowEngine();
			this.wfe.init(this.product);
			if (playMode || preflightMode) {
				if (legacyTest) {
					this.wfe.showLegacyTestContent(this.playerAtStation)
				} else {
					if (this.previewOption == 1 || this.previewOption == 3) {
						this.wfe.showVQCPDF()
					}
				}
				this.showPlayerAtStation()
			}
		}
		if (playMode) {
			var a = this.wfe.getParameter("playerTimeout");
			if (a != null) {
				try {
					this.playerTimeout = parseInt(a);
					if (isNaN(this.playerTimeout)) {
						this.playerTimeout = 5000
					} else {
						this.playerTimeout = this.playerTimeout * 1000
					}
				} catch(b) {
					this.playerTimeout = 5000
				}
			} else {
				this.playerTimeout = 5000
			}
			var m = 1;
			var g = this.designer._zoom;
			if (g > 100) {
				m = 1
			} else {
				if (g > 50) {
					m = 2
				} else {
					if (g > 25) {
						m = 3
					} else {
						if (g > 25) {
							m = 4
						}
					}
				}
			}
			this.autoStep = this.wfe.getParameter("auto");
			if (this.autoStep == null) {
				this.autoStep = false
			} else {
				this.autoStep = true
			}
			this.playerTimeout = this.playerTimeout * this.designer.numberOfSides * m;
			this.currentTimeout = this.playerTimeout;
			this.showPlayerMsg();
			setTimeout(this.doSaveandPostProcess.bind(this), 1000)
		}
	},
	showPlayerMsg: function() {
		var a = document.getElementById("playerTimeoutMsg");
		if (a != null) {
			a.innerHTML = "&nbsp;Waiting for " + Math.round(this.currentTimeout / 1000) + " sec."
		}
	},
	showPlayerAtStation: function() {
		var b = $("playerStation");
		if (b) {
			var a = this.wfe.getCurrentStation();
			b.innerHTML = a.StationDisplayName + ":"
		}
	},
	loadProductDirTree: function() {
		var a = new Af.DataRequest(svcURL, this.requestCompletedLoadProductTree.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		a.addService("DesignerSvc", "getProductDirectoryTree");
		ajaxEngine.processRequest(a)
	},
	requestCompletedLoadProductTree: function(a) {
		debugA(a.responseText)
	}
});
var productContent = null;
var designer = null;
var _toolNormalBG = "transparent";
var _selectToolNormalBG = "#ffffff";
var _toolSelectionColor = "#ffc000";
var _toolSelectionBorder = "#000000";
var _toolHoverColor1 = "#ffd497";
var _toolHoverColor2 = "#fe9552";
var THUMBNAIL_HEIGHT = 100;
var tn_labels = null;
var selectFolderURL = null;
var currentUserName = null;
var RULER_ON_BITMASK = 1;
var GRID_ON_BITMASK = 2;
var SNAP_ON_BITMASK = 4;
var HIDE_TRIMLINES_BITMASK = 8;
var CUSTOMIZE_TB_VISIBLE_BITMASK = 16;
var NO_FORM_MODE = 0;
var INLINE_FORM_MODE = 1;
var POPUP_FORM_MODE = 2;
PsP.Designer4 = Class.create({
	BEGIN_CDATA: "<![CDATA[",
	END_CDATA: "]]>",
	CUSTOMIZE_STATION_NAME: "position",
	initialize: function(b, g) {
		this.name = "default";
		this.version = "0.1";
		this.scrollerId = b;
		this.canvasId = g;
		this.currentSurface = null;
		this.surfaces = new Array();
		this._zoom = $("zoom");
		this.snapToGrid = false;
		this.showGrid = false;
		this.aspectRatioLocked = true;
		this._initials = $("initials");
		this.artwork_uuid = null;
		this.artworkParameters = null;
		this.imageSelectionMode = null;
		this.imageObjChanging = null;
		this.numberOfSides = 1;
		this.currentSide = 1;
		if (this._zoom != null) {
			this._zoom.value = "100"
		}
		this.scroller = $(b);
		if (this.scroller != null) {
			this.scrollerParent = this.scroller.parentNode;
			this.scrollerParent.onmousedown = this.scrollerMouseDown.bindAsEventListener(this)
		}
		this.thumbNailArea = $("thumbNailArea");
		this.dc = null;
		this.onSideChange = null;
		this.onZoomChange = null;
		this.onInitialized = null;
		this.wfe = null;
		this.calloutOn = false;
		docuploader.uploadCompleteListener = this;
		this.colorPicker = new Af.ColorPicker(this);
		this.colorPicker.alignment = "bottom";
		this._lineColorTool = $("linecolorTool");
		this._bgColorTool = $("bgcolorTool2");
		this._changeBGImage = $("changeBGImage");
		Event.observe(document, "click", this.mainAreaClicked.bindAsEventListener(this));
		this.mainArea = $("MainArea");
		window.onresize = this.doResize.bind(this);
		var a = this.getContextIdFromURL();
		if (a != null) {
			this.contextId = a;
			ajaxEngine.setContextId(a)
		}
		chgMgr.undoE = $("undo");
		chgMgr.redoE = $("redo");
		chgMgr.clearChanges();
		this.scrollerE = $("scrollerId");
		this.canvasE = $(g);
		this.customizeTBVisible = false;
		this.currentTextEditorMode = typeof TextEditorMode == "undefined" ? 0 : TextEditorMode;
		this.editTextDialogShouldHideFlag = false
	},
	setEditTextDialogShouldHideFlag: function(a) {
		this.editTextDialogShouldHideFlag = a
	},
	reloadGuides: function() {
		this.currentSurface.br.executeAllRules()
	},
	getContextIdFromURL: function() {
		var m = trim(location.search);
		if (m == "") {
			return null
		}
		var b = m.split("&");
		var m = null;
		for (var g = 0; g < b.length; g++) {
			if (b[g].indexOf("contextId=") >= 0) {
				var a = b[g].indexOf("=");
				m = b[g].substring(a + 1)
			}
		}
		return m
	},
	doResize: function() {
		setTimeout(this.refreshAll.bind(this), 10)
	},
	mainAreaClicked: function(g) {
		hideCurrentContextMenu();
		var b = g.target;
		if (Element.hasClassName(b, "unselect_yes")) {
			this.currentSurface.unselect();
			return
		}
		while (b != null && b.tagName) {
			if (Element.hasClassName(b, "unselect_no")) {
				return
			}
			if (Element.hasClassName(b, "unselect_yes")) {
				this.currentSurface.unselect();
				return
			}
			b = b.parentNode;
			if (b != null && b.tagName) {
				var a = b.tagName.toLowerCase();
				if (a == "body") {
					break
				}
			}
		}
	},
	lockObjectToggle: function(a) {
		this.currentSurface.lockObjectToggle(a)
	},
	disableEditing: function(b) {
		for (var a = 0; a < this.surfaces.length; a++) {
			this.surfaces[a].disableEditing(b, this.currentSurface)
		}
	},
	disableUpload: function(b) {
		for (var a = 0; a < this.surfaces.length; a++) {
			this.surfaces[a].disableUpload(b)
		}
	},
	getCurrentStationName: function() {
		if (this.wfe != null) {
			var a = this.wfe.getCurrentStation();
			if (a != null) {
				return a.StationInternalName
			}
		}
		if (this.artwork != null) {
			return this.artwork.currentStation
		}
		return null
	},
	isViewOnly: function() {
		var a = this.getCurrentStationName();
		return (a === "gettingStarted" || a === "finalReview" || a === "finishing")
	},
	scrollerMouseDown: function(b) {
		var a = b.target ? b.target: b.srcElement;
		if (this.currentSurface != null && (a == this.scroller || a == this.scrollerParent)) {
			this.currentSurface.selectObject(null)
		}
		return true
	},
	addTag: function(a, b, m) {
		this.removeTag(a);
		var g = new Object();
		g.name = a;
		g.value = b;
		g.isXml = m;
		this.tags.push(g)
	},
	removeTag: function(a) {
		for (var g = 0; g < this.tags.length; g++) {
			var b = this.tags[g];
			if (b.name == a) {
				this.tags = removeFromArray(this.tags, b);
				break
			}
		}
	},
	setTag: function(a, m, o) {
		for (var g = 0; g < this.tags.length; g++) {
			var b = this.tags[g];
			if (b.name == a) {
				b.value = m;
				b.isXml = o;
				break
			}
		}
	},
	clearTags: function() {
		this.tags = new Array()
	},
	mouseOver: function(a) {
		var b = a.target ? a.target: a.srcElement;
		if (b.tagName == "IMG") {
			b = b.parentNode
		}
		if (b.tagName != "SELECT") {
			if (b.__selected) {
				b.style.backgroundColor = _toolHoverColor2
			} else {
				b.style.backgroundColor = _toolHoverColor1
			}
			b.style.borderColor = _toolSelectionBorder
		}
	},
	mouseOut: function(a) {
		var b = a.target ? a.target: a.srcElement;
		if (b.tagName == "IMG") {
			b = b.parentNode
		}
		if (b.tagName != "SELECT") {
			if (b.__selected) {
				b.style.backgroundColor = _toolSelectionColor;
				b.style.borderColor = _toolSelectionBorder
			} else {
				b.style.backgroundColor = _toolNormalBG;
				b.style.borderColor = _toolNormalBG
			}
		}
	},
	wrapInCDATA: function(a) {
		return this.BEGIN_CDATA + a + this.END_CDATA
	},
	toXml: function() {
		if (this.currentSurface != null) {
			this.currentSurface.saveObjectsState()
		}
		var y = '<artwork version="' + this.version + '"  class="ArtWork">\n';
		var z = "\t";
		if (this._initials != null) {
			var r = trim(this._initials.value);
			if (r != "") {
				y += z + "<initials>" + r + "</initials>\n"
			}
		}
		if (this.artwork.designStatus) {
			y += z + "<designStatus>" + this.artwork.designStatus + "</designStatus>\n"
		}
		if (this.artwork.designName) {
			y += z + "<designName>" + this.wrapInCDATA(this.artwork.designName) + "</designName>\n"
		}
		if (this.artwork._templateImageSizeFixed) {
			y += z + "<_templateImageSizeFixed>" + this.artwork._templateImageSizeFixed + "</_templateImageSizeFixed>\n"
		}
		if (this.artwork.tagsApplied) {
			y += z + "<tagsApplied>" + this.artwork.tagsApplied + "</tagsApplied>\n"
		}
		y += z + "<viewOptions>" + this.getViewOptionsBitMask() + "</viewOptions>\n";
		var m = false;
		if (this.wfe != null) {
			var x = this.wfe.getCurrentStation();
			if (x != null) {
				m = this.artwork.currentStation != x.StationInternalName;
				y += z + "<currentStation>" + x.StationInternalName + "</currentStation>\n"
			}
		}
		y += z + "<currentSideIndex>" + (m ? 0 : (this.currentSide - 1)) + "</currentSideIndex>\n";
		var q = -1;
		var b = this.currentSurface.selectedObject;
		for (var o = 0; o < this.currentSurface.gobjects.length; o++) {
			if ((this.imageObjChanging == this.currentSurface.gobjects[o]) || (this.currentSurface.gobjects[o] == b)) {
				q = o;
				break
			}
		}
		y += z + "<objectId>" + q + "</objectId>\n";
		for (var o = 0; o < this.surfaces.length; o++) {
			y += this.surfaces[o].toXml(z)
		}
		if (productContent != null) {
			productContent.processQuoteToolUpdates(this.artwork)
		}
		for (var o = 0; o < this.tags.length; o++) {
			var u = this.tags[o];
			if (u.isXml) {
				y += u.value
			} else {
				y += z + "<" + u.name + ">" + htmlEncode(u.value) + "</" + u.name + ">\n"
			}
		}
		var g = this.artwork.parameter_new;
		var a;
		if (g) {
			for (var o = 0; o < g.length; o++) {
				a = g[o];
				y += '<parameter class="NVL" atype="O">\n';
				y += "<name>" + a.name + "</name>\n";
				y += "<val>" + a.val + "</val>\n";
				y += "</parameter>\n"
			}
		}
		y += chgMgr.toXml();
		y += "</artwork>\n";
		return y
	},
	verify: function() {
		var b = "";
		for (var a = 0; a < this.surfaces.length; a++) {
			b += this.surfaces[a].verify()
		}
		return b
	},
	addDesignSurface: function(b) {
		var a = new Af.DesignSurface(this, this.scrollerId, this.canvasId);
		a.cropMode = true;
		if (PsP.BR) {
			a.br = new PsP.BR(a, this.surfaces.length)
		}
		this.surfaces.push(a);
		a.applyTemplate(b);
		return a
	},
	clearAll: function() {
		for (var a = 0; a < this.surfaces.length; a++) {
			this.surfaces[a].clearSurface()
		}
		this.surfaces.length = 0;
		this.currentSurface = null;
		this.clearTags()
	},
	setArtworkOrientation: function(a) {
		var b = a.ds;
		for (var g = 0; g < b.length; g++) {
			var m = b[g]["orientation"];
			if (m != null && m != "") {
				a.orientation = m;
				break
			}
		}
	},
	pageNailDimChanged: function(a) {
		this.pageNail.posSizeChaned(a, this.currentSide - 1)
	},
	setDrawingObjects: function(r, g) {
		if (r.textEditorMode) {
			this.currentTextEditorMode = r.textEditorMode
		}
		this.setArtworkOrientation(r);
		if (actionHandler.helpBubbleComp) {
			actionHandler.helpBubbleComp.setValue(this.calloutOn)
		}
		var A = 0;
		if (r.currentSideIndex != null) {
			A = parseInt(r.currentSideIndex)
		} else {
			if (g && this.pageNail) {
				A = this.pageNail.selectedIndex
			}
		}
		this.pageNail = new PsP.PageNail(this.thumbNailArea, r, this);
		this.tags = new Array();
		this.processHTMLList(r);
		this.updateDefaultZoomFactor(r);
		if (r) {
			this.artwork = r
		} else {
			r = this.artwork
		}
		var m = $("MainArea");
		if (m != null) {
			if (m.offsetWidth == 0) {
				setTimeout(this.setDrawingObjects.bind(this), 100);
				return
			}
		}
		var D = this.isReaderSpreadFR();
		var C;
		if (!cropTest) {
			C = r.cropBaseImageURL;
			if (C != null) {
				baseImageURL = C
			}
			C = r.croptoolPreviewImageURL;
			if (C != null) {
				previewImageURL = C
			}
			C = r.cropTNImageURL;
			if (C != null) {
				cropTNImageURL = C
			}
			C = r.pspFile;
			if (C != null) {
				this.pspFile = C
			}
			selectFolderURL = r.folder;
			currentUserName = r.username;
			this.cropDBUpdateComp = r.cropDBUpdateComp
		}
		this.cde_release = r.cde_release;
		this.CDE_INSTALL_DIR = r.CDE_INSTALL_DIR;
		this.GALLERY_BASE_DIR = r["GALLERY-BASE-DIR"];
		this.finishingPageURL = r.finishingPageURL;
		C = r.pspspassport;
		if (C == "testpassort") {
			C = "6F25FA226A3661B5"
		}
		if (C != null) {
			this.pspspassport = C
		} else {
			this.pspspassport = "unknown"
		}
		if (C == "1784F2F0D185EDEF107560B403B702178C99E51AB9BE0C93462E2858591AB93596475D01B52B66508DED8F9787ECD6AE2B1A45919135957A1BF09D52B3224F888D138BD928BD571D") {
			C = "6F25FA226A3661B5"
		}
		docuploader.passport = C;
		C = r.imageUploadURL;
		if (C != null) {
			docuploader.imageUploadURL = C
		}
		actionHandler.artworkLoaded(r);
		this.artworkParameters = r.parameter;
		this.artwork_uuid = r.jobId;
		C = r.name;
		if (C == null) {
			C = "Unknown"
		}
		this.name = C;
		this.productFamily = r.productFamily;
		C = r.displayName;
		if (C == null) {
			C = this.name
		}
		this.displayName = C;
		var B = $("productName");
		if (B != null) {
			B.innerHTML = this.productFamily
		}
		var z = r.ds;
		this.setNumberOfSides(z.length);
		if (r.encoding == null) {
			r.encoding = "0.1"
		}
		if (z == null || z.length == 0) {
			if (this.currentSurface != null) {
				this.currentSurface.clearAll();
				this.surfaces.length = 0;
				this.surfaces.push(this.currentSurface);
				this.currentSurface.setSideNumber(0)
			}
		} else {
			this.setDesignSurface(null);
			for (var x = 0; x < z.length; x++) {
				var C;
				if (x == this.surfaces.length) {
					C = this.addDesignSurface(z[x])
				} else {
					C = this.surfaces[x];
					C.checkedAndGenerateImage = !playMode
				}
				C.checkOverlap = r.checkOverlap;
				C.hideSafety = D
			}
			for (var x = 0; x < z.length; x++) {
				var C = this.surfaces[x];
				C.setSideNumber(x);
				C.setDrawingObjects(z[x], r.encoding, r)
			}
		}
		this.pageNail.showPagenails(A, null, true, false);
		if (this.currentSurface.dataFile != null && this.getCurrentStationName() == "position") {
			this.showDataFile()
		} else {
			this.closeDataNavigator()
		}
		if (this.onInitialized != null) {
			this.onInitialized()
		}
		if (r.hasOverLayImage == "true") {
			var y = $("trimOn");
			if (y) {
				y.style.display = "none"
			}
			y = $("trimOff");
			if (y) {
				y.style.display = ""
			}
			y = $("maskOn");
			if (y) {
				y.style.display = "none"
			}
			y = $("maskOff");
			if (y) {
				y.style.display = "none"
			}
			y = $("overlayOn");
			if (y) {
				y.style.display = ""
			}
			y = $("overlayOff");
			if (y) {
				y.style.display = "none"
			}
			this.hideTrimLines = true
		}
		var q = r.viewOptions;
		if (q != null) {
			q = parseInt(q)
		}
		if (q) {
			this.snapToGrid = (q & SNAP_ON_BITMASK) != 0;
			actionHandler.setSnapToGrid(this.snapToGrid);
			this.showGrid = (q & GRID_ON_BITMASK) != 0;
			f = (q & HIDE_TRIMLINES_BITMASK) != 0;
			if (f) {
				this.currentSurface.setHideTrimLines(f)
			}
			this.customizeTBVisible = f = (q & CUSTOMIZE_TB_VISIBLE_BITMASK) != 0;
			f = true;
			if (r.currentStation == "position") {
				actionHandler.setCustomizeTBVisible(f)
			}
		}
		if (D) {
			this.trimLinesOptionChanged(true)
		}
		this._calloutOptionChanged();
		if (r.currentStation == "position") {
			for (var x = 0; x < this.surfaces.length; x++) {
				var C = this.surfaces[x];
				for (j = 0; j < C.gobjects.length; j++) {
					var b = C.gobjects[j];
					if (b.type == "image" && b._imageFile_ != b.imageFile) {
						chgMgr.beginTx();
						if (b._imageFile_ != null && b._imageFile_ != "") {
							var o = b.dw;
							if (o != null) {
								var u = o.dw;
								if (u != null && u.length > 0) {
									dw2 = u[0];
									var a = chgMgr.addModifyChangeByMethod(b, b.changeImageUndoRedo2, dw2, o, null);
									a.serialize = false
								}
							}
						} else {
							chgMgr.addCreateChange(b)
						}
						chgMgr.endTx()
					}
				}
			}
		}
	},
	isReaderSpreadFR: function() {
		return isFinalReviewOrPast(this.artwork.currentStation)
	},
	getViewOptionsBitMask: function() {
		var a = 0;
		if (actionHandler.isRulerVisible()) {
			a |= RULER_ON_BITMASK
		}
		if (this.showGrid) {
			a |= GRID_ON_BITMASK
		}
		if (actionHandler.isSnapToGrid()) {
			a |= SNAP_ON_BITMASK
		}
		if (this.hideTrimLines) {
			a |= HIDE_TRIMLINES_BITMASK
		}
		if (this.artwork.currentStation == "position") {
			if (actionHandler.isCustomizeTBVisible()) {
				a |= CUSTOMIZE_TB_VISIBLE_BITMASK
			}
		} else {
			if (this.customizeTBVisible) {
				a |= CUSTOMIZE_TB_VISIBLE_BITMASK
			}
		}
		return a
	},
	setPreviewImageFile: function(a) {
		if (a.ds != null) {
			for (var b = 0; b < a.ds.length && b < this.surfaces.length; b++) {
				var g = a.ds[b];
				this.surfaces[b].setPreviewImageFile(g.previewImageFile)
			}
		}
	},
	processHTMLList: function(b) {
		var a = b.html;
		if (a != null) {
			for (var g = 0; g < a.length; g++) {
				this.setHTMLElem(a[g])
			}
		}
	},
	setHTMLElem: function(m) {
		var r = m.__id;
		if (r != null && r.length > 0) {
			var q = r.charAt(0);
			if (q < "0" || q > "9") {
				var b = m.innerHTML;
				if (b == null) {
					b = ""
				}
				var o = $(r);
				if (o != null) {
					o.innerHTML = b
				}
			}
		}
		var a = m.html;
		if (a != null) {
			for (var g = 0; g < a.length; g++) {
				this.setHTMLElem(a[g])
			}
		}
	},
	updateDefaultZoomFactor: function(b) {
		var q = 100;
		if (!htmlDesignMode) {
			var x = parseFloat(b.bleed_width);
			var m = parseFloat(b.bleed_height);
			var a = b.orientation;
			if ((a == "tall" && m < x) || (a == "wide" && x < m)) {
				var y = m;
				m = x;
				x = y
			}
			if (x < m) {
				var r = b.ds;
				if (r) {
					for (var g = 0; g < r.length; g++) {
						var u = getDSPhysicalSize(r[g]);
						if (u.w > u.h) {
							var y = m;
							m = x;
							x = y;
							break
						}
					}
				}
			}
			if (x != null && m != null) {
				if ((x <= 3.75) && (m <= 3.75)) {
					q = 150
				} else {
					if ((x == 4.375) && (m == 11.25)) {
						q = 75
					} else {
						if (x <= 6.25) {
							q = 100
						} else {
							if (x <= 7.25) {
								q = 85
							} else {
								if (x <= 8.75) {
									q = 70
								} else {
									if (x <= 9.5) {
										q = 65
									} else {
										if (x <= 11.25) {
											q = 55
										} else {
											if (x <= 18.25) {
												q = 34
											} else {
												q = 20
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if (this._zoom != null) {
			this._zoom.value = "" + q
		}
		this.zoomFactor = q / 100
	},
	setNumberOfSides: function(a) {
		this.numberOfSides = a
	},
	setDesignSurface: function(b) {
		if (b == this.currentSurface) {
			return
		}
		if (this.currentSurface != null) {
			this.currentSurface.deactivate()
		}
		this.currentSurface = b;
		var a = this.artwork;
		if (this._changeBGImage) {
			if (!isSuperAdmin() && ((a.templateType == "Online Design" && this.currentSurface.ds.ArtworkSource == "User") || a.productGroupName == "Envelopes")) {
				this._changeBGImage.style.display = "none"
			} else {
				this._changeBGImage.style.display = "block"
			}
		}
		if (this.currentSurface != null) {
			this.currentSurface.activate();
			if (this.currentSurface.dataFile != null && this.getCurrentStationName() == "position") {
				this.showDataFile()
			} else {
				this.closeDataNavigator()
			}
		}
	},
	verifyDoc: function(b) {
		var a = this.verify();
		if (a == "") {
			b()
		} else {
			hideModalMessageDialog();
			a = "The following text appears to be default text from the design template. If you would like to continue and leave the text as is, click 'OK'. <br/>Otherwise, click 'Cancel' and remove this text before completing your design.<br/><br/>" + a;
			showConfirmDialog(a, "Warning", 400, 500, b)
		}
	},
	saveDoc: function(a, g, b) {
		this.saveCallBack = a;
		this.saveMode = g || "save";
		setTimeout(this._saveDoc.bind(this, b), 1);
		return false
	},
	saveDocWithMode: function(b, a) {
		this.saveCallBack = null;
		this.saveMode = b;
		setTimeout(this._saveDoc.bind(this, a), 1);
		return false
	},
	_saveDoc: function(a) {
		this.verifyDoc(this.saveDocStep2.bind(this, a));
		return false
	},
	saveDocStep2: function(b) {
		if (!chgMgr.isSaveNeeded() && !b) {
			this.savePsPRequestCompleted();
			return
		}
		if (this.currentSurface.giReqSent) {
			showModalMessageDialog("Waiting for the previous request to complete, it should take more than few seconds ... please wait", "Saving", 400, 100);
			setTimeout(this.saveDocStep2.bind(this, b), 200);
			return
		}
		if (pspspassport == null || pspspassport == defaultPassport) {
			showModalMessageDialog("Saving Design as a guest user", "Saving", 300, 100, 600000)
		} else {
			showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100)
		}
		if (this.rteEditor != null) {
			this.rteEditor.hide()
		}
		if (this.multiRTEEditor != null) {
			this.multiRTEEditor.hide()
		}
		hideDialogWin();
		s = this.toXml();
		var a = new Af.DataRequest(svcURL, this.savePsPRequestCompleted.bind(this), this.savePsPRequestFailed.bind(this), view, this.savePsPRequestTimedout.bind(this));
		a.addService("DesignerSvc", "saveCropToolPSP");
		if (this.artwork_uuid != null) {
			a.addParameter("UUID", this.artwork_uuid)
		}
		if (this.saveMode != null) {
			a.addParameter("saveMode", this.saveMode)
		}
		if (playMode) {
			a.addParameter("playMode", playMode)
		}
		a.xmlDoc = s;
		ajaxEngine.processRequest(a);
		return false
	},
	savePsPRequestCompleted: function(g) {
		if (this.saveMode == "beforeUpload") {
			hideModalMessageDialog();
			this.uploadImage2();
			return
		}
		if (this.saveMode == "beforeGallery") {
			hideModalMessageDialog();
			this.activateGallery();
			return
		}
		if (g) {
			var a = new Af.XMLToDataSet(g.responseXML);
			var b = a.data;
			if (b.currentStation != this.artwork.currentStation && (b.currentStation != "savePost") && !playMode) {
				location.reload();
				return
			}
			this.artwork = b;
			this.setArtworkOrientation(b)
		} else {
			b = this.artwork
		}
		if (this.saveMode == "save" || playMode) {
			if (g) {
				showModalMessageDialog("Your artwork has been saved successfully.", "Save", 300, 100)
			}
			if (!playMode) {
				setTimeout(this.postSave.bind(this), 1000)
			} else {
				if (this.getCurrentStationName() == "finalReview") {
					this.setPreviewImageFile(b)
				}
				this.stationChanged(true);
				this.dc.doNext();
				return
			}
		} else {
			if (this.saveMode == "continue") {
				showModalMessageDialog("Your artwork has been saved successfully.", "Save", 300, 100);
				setTimeout(this.closeWindow.bind(this), 1000)
			} else {
				if (this.saveMode == "postProcess") {
					if (g) {
						showModalMessageDialog("Your artwork has been saved successfully and processed.", "Save", 300, 100)
					}
					setTimeout(this.postSave.bind(this), 1000)
				} else {
					if (this.saveMode == "finishingPage") {
						if (g) {
							showModalMessageDialog("Your artwork has been saved successfully, you will be directed to a new page to continue purchasing, please wait.", "Finishing", 300, 100)
						}
						if (this.saveCallBack != null) {
							this.saveCallBack()
						}
						this.doFinishing(b)
					} else {
						setTimeout(this.postSave.bind(this), 1000)
					}
				}
			}
		}
		if (g) {
			if (this.saveMode != "finishingPage") {
				if (this.getCurrentStationName() == "finalReview") {
					this.setPreviewImageFile(b)
				}
				this.stationChanged(true)
			} else {
				this.setPreviewImageFile(b);
				this.currentSurface.reinitDrawingSurface()
			}
		}
		if (this.wfe) {
			this.wfe.docSaved()
		}
	},
	savePsPRequestFailed: function(a, b) {
		hideModalMessageDialog();
		showMessageDialog(b, GENERAL_ERROR.subject, GENERAL_ERROR.width, GENERAL_ERROR.height, null, true);
		saveContext = null;
		if (playMode) {
			setTimeout(this.postSave.bind(this), 5000)
		}
	},
	savePsPRequestTimedout: function(a) {
		hideModalMessageDialog();
		var b = REQUEST_TIMEOUT.text;
		b = replace([RequestedURL], a.requestURL);
		showMessageDialog(b, REQUEST_TIMEOUT.subject, REQUEST_TIMEOUT.width, REQUEST_TIMEOUT.height, null, true);
		if (playMode) {
			setTimeout(this.postSave.bind(this), 5000)
		}
	},
	doFinishing: function() {
		if (this.wfe) {
			this.wfe.goToFinishingPage()
		}
	},
	doPostStep2: function() {
		this.form.submit()
	},
	stationChanged: function(g) {
		this.hideEditorDialogs();
		if (docuploader && docuploader.dialog) {
			docuploader.dialog.hide()
		}
		if (this.artwork.ds.length) {
			for (var a = this.artwork.ds.length - 1; a >= 0; a--) {
				this.surfaces[a].stationChanged(g)
			}
			this.setDesignSurface(this.currentSurface)
		}
		if (g) {
			this.refreshAll()
		}
		if (this.getCurrentStationName() == "position") {
			if (this.currentSurface.dataFile != null) {
				this.showDataFile()
			}
		} else {
			this.closeDataNavigator()
		}
		var m = $("productContent");
		if (m != null) {
			var b = this.getCurrentStationName() == "gettingStarted" ? "": "none";
			m.style.display = b
		}
	},
	hideEditorDialogs: function() {
		if (this.rteEditor != null) {
			this.rteEditor.hide()
		}
		if (this.multiRTEEditor != null && (this.multiRTEEditor.currentTextEditorMode == NO_FORM_MODE)) {
			this.multiRTEEditor.hide()
		}
	},
	postSave: function() {
		hideDialogWin();
		hideModalMessageDialog();
		if (this.saveCallBack) {
			this.saveCallBack()
		}
	},
	closeWindow: function() {
		hideModalMessageDialog();
		if (window.opener != null) {
			try {
				window.opener.location.reload()
			} catch(a) {}
		}
		try {
			window.close()
		} catch(a) {}
	},
	undo: function() {
		var a = chgMgr.undoChange();
		this.currentSurface.positionSoftSelectAll();
		this.currentSurface.selectionTool.repositionTools();
		this.changeUndoRedone(a);
		return false
	},
	redo: function() {
		var a = chgMgr.redoChange();
		this.currentSurface.positionSoftSelectAll();
		this.currentSurface.selectionTool.repositionTools();
		this.changeUndoRedone(a);
		return false
	},
	changeUndoRedone: function(b) {
		var m = [];
		for (var a = 0; a < b.length; a++) {
			var g = b[a];
			if (this.multiRTEEditor != null && g != null && g.obj && g.obj.type == "textarea") {
				if (!g.newParams.angle) {
					this.multiRTEEditor.resetRTC(g.obj)
				}
			}
			if (g.obj.type == "textarea" && m.indexOf(g.obj) < 0) {
				var o = {
					_delay: true
				};
				this.currentSurface.generateImage2(g.obj, false, o);
				m.push(g.obj)
			}
		}
	},
	zoom: function() {
		for (var a = 0; a < this.surfaces.length; a++) {
			if (this.surfaces[a] != this.currentSurface) {
				this.surfaces[a].zoom()
			}
		}
		this.currentSurface.zoom();
		this.currentSurface.refreshAll();
		setTimeout(this.resetCallout.bind(this), 10);
		if (this.onZoomChange != null) {
			setTimeout(this.onZoomChange, 12)
		}
		return false
	},
	consume: function(a) {
		if (a.stopPropagation) {
			a.stopPropagation()
		} else {
			a.cancelBubble = true
		}
		a.returnValue = false;
		return false
	},
	toggleMyImageView: function() {
		this.currentSurface.toggleMyImageView();
		return false
	},
	uploadImage: function(a, b) {
		if (this.callout != null && this.callout.visible) {
			this.callout.hide()
		}
		if (this.callout2 != null && this.callout2.visible) {
			this.callout2.hide()
		}
		this.imageObjChanging = a;
		docuploader.mainImage = a.mainImage;
		this.saveDocWithMode(b);
		return false
	},
	uploadImage2: function() {
		var a = -1;
		if (this.imageObjChanging != null) {
			for (var b = 0; b < this.currentSurface.gobjects.length; b++) {
				if (this.currentSurface.gobjects[b] == this.imageObjChanging) {
					a = b;
					break
				}
			}
		} else {
			if (this.currentSurface.gobjects[0].ArtworkSource == "custom") {
				a = 0;
				docuploader.mainImage = true
			}
		}
		this.imageObjChanging = null;
		docuploader.objectId = a;
		docuploader.beginDocUploadWorkFlow(this.imageSelectionMode == "dataFile" ? "data": "image", this)
	},
	calloutClosed: function(a) {
		if (!this.checkCalloutState()) {
			this.calloutOn = false;
			this._calloutOptionChanged()
		}
	},
	checkCalloutState: function() {
		if ((this.callout == null || !this.callout.visible) && (this.callout2 == null || !this.callout2.visible)) {
			if (actionHandler.helpBubbleComp) {
				actionHandler.helpBubbleComp.setValue(false)
			}
			return false
		} else {
			if ((this.callout != null && this.callout.visible) || (this.callout2 != null && this.callout2.visible)) {
				if (actionHandler.helpBubbleComp) {
					actionHandler.helpBubbleComp.setValue(true)
				}
				return true
			}
		}
		return false
	},
	calloutStateSaveCompleted: function() {},
	dblClickOnImage: function(a, b) {
		if (this.getCurrentStationName() != "position") {
			return false
		}
		if (this.callout != null && this.callout.visible) {
			this.callout.hide()
		}
		if (this.callout2 != null && this.callout2.visible) {
			this.callout2.hide()
		}
		docuploader.mainImage = a.mainImage;
		this.imageObjChanging = a;
		this.imageSelectionMode = "imageTool";
		this.saveDocWithMode(b, true);
		return false
	},
	imageTool: function() {
		docuploader.mainImage = false;
		this.imageSelectionMode = "imageTool";
		this.imageObjChanging = null;
		this.currentSurface.selectObject(null);
		this.saveDocWithMode("beforeUpload", true);
		return false
	},
	uploadDialogClosed: function(b, a) {
		this.uploadCompleted(b, a)
	},
	uploadCompleted: function(b, a) {
		if (b) {
			this.dc.reloadCropToolInputPSP(this.pspFile, a)
		}
	},
	getPSP: function(b) {
		var a = new Af.DataRequest(svcURL, this.requestCompletedgetPSP.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		a.addService("DesignerSvc", "getPSP");
		a.addParameter("mediaId", b);
		ajaxEngine.processRequest(a)
	},
	requestCompletedgetPSP: function(b) {
		var a = new Af.XMLToDataSet(b.responseXML);
		var g = a.data.product[0];
		this.clearAll();
		this.setDrawingObjects(g)
	},
	showSide: function(g, b, a) {
		if (g > this.numberOfSides) {
			return
		}
		g = g - 1;
		if (g < this.surfaces.length) {
			this.currentSide = g + 1;
			if (this.currentSurface != this.surfaces[g] || b != this.getCurrentStationName() || a) {
				if (this.currentSurface != null && a) {
					this.currentSurface.sideChanging(b)
				}
				this.setDesignSurface(this.surfaces[g]);
				if (a) {
					if (this.wfe != null) {
						this.wfe.updateState()
					}
					this.refreshAll()
				}
				setTimeout(this.resetCallout.bind(this), 10);
				setTimeout(this.showMultiRTEEditor.bind(this), 10)
			}
		}
	},
	updateSelection: function(b, a) {
		actionHandler.updateSelection(b, a)
	},
	showSelected: function(g) {
		g.parentNode.style.borderColor = _toolSelectionBorder;
		g.style.backgroundColor = _toolSelectionColor;
		var a = g.childNodes;
		for (var b = 0; b < a.length; b++) {
			if (a[b].style) {
				a[b].style.backgroundColor = _toolSelectionColor;
				break
			}
		}
		g.__selected = true
	},
	showUnselected: function(g) {
		g.parentNode.style.borderColor = _toolNormalBG;
		g.style.backgroundColor = _toolNormalBG;
		var a = g.childNodes;
		for (var b = 0; b < a.length; b++) {
			if (a[b].style) {
				a[b].style.backgroundColor = _toolNormalBG;
				break
			}
		}
		g.__selected = false
	},
	showSelected2: function(m) {
		var b = null;
		var a = m.childNodes.length;
		for (var g = 0; g < a; g++) {
			if (m.childNodes[g].tagName == "IMG") {
				b = m.childNodes[g];
				break
			}
		}
		if (b != null) {
			b.style.backgroundColor = _toolSelectionColor
		}
		m.__selected = true
	},
	showUnselected2: function(m) {
		var b = null;
		var a = m.childNodes.length;
		for (var g = 0; g < a; g++) {
			if (m.childNodes[g].tagName == "IMG") {
				b = m.childNodes[g];
				break
			}
		}
		if (b != null) {
			b.style.backgroundColor = _toolNormalBG
		}
		m.__selected = false
	},
	setConfigParamList: function(a) {
		this.configParamList = a
	},
	getRole: function() {
		if (this.configParamList == null) {
			return null
		}
		var g = "";
		for (var b = 0; b < this.configParamList.length; b++) {
			var a = this.configParamList[b];
			if (a.name == "role") {
				g = a.val;
				break
			}
		}
		return g
	},
	refreshAll: function() {
		this.currentSurface.refreshAll()
	},
	hidePopups: function() {},
	gridToggle: function(a) {
		this.showGrid = a;
		this.refreshAll();
		return false
	},
	snapToggle: function(a) {
		this.snapToGrid = a;
		return false
	},
	isGridShown: function() {
		return this.showGrid
	},
	isSnappingToGrid: function() {
		return this.snapToGrid
	},
	showFeedbackForm: function() {
		hideModalMessageDialog();
		if (this.fbDialog == null) {
			this.fbDialog = new PsP.FeedbackDialog();
			this.fbObject = new Object()
		}
		this.fbDialog.show(500);
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	},
	feedbackFromClosed: function() {
		window.onbeforeunload = null
	},
	setDSStatus: function(a) {},
	previousSide: function() {
		this.pageNail.previousSide()
	},
	nextSide: function() {
		this.pageNail.nextSide()
	},
	getTNSrc: function(b) {
		var a;
		if (b.imageFile == null || b.imageFile == "undefined") {
			a = cropTNImageURL + "&mediaID=" + b.mediaid
		} else {
			if (b.imageFile.indexOf("/") >= 0) {
				return b.imageFile
			}
			a = baseImageURL + b.imageFile
		}
		return a
	},
	makeSameWidth: function() {
		if (this.aspectRatioLocked) {
			this.currentSurface.makeSameWidth()
		} else {
			this.currentSurface.makeSameWidthNoAspect()
		}
		return false
	},
	makeSameHeight: function() {
		if (this.aspectRatioLocked) {
			this.currentSurface.makeSameHeight()
		} else {
			this.currentSurface.makeSameHeightNoAspect()
		}
		return false
	},
	makeSameSize: function() {
		if (this.aspectRatioLocked) {
			this.currentSurface.makeSameSize()
		} else {
			this.currentSurface.makeSameSizeNoAspect()
		}
		return false
	},
	autoCenter: function() {
		this.currentSurface.autoCenter();
		return false
	},
	makeSameSizeWithAspect: function() {
		this.currentSurface.makeSameSize()
	},
	makeSameSizeNoAspect: function() {
		this.currentSurface.makeSameSizeNoAspect()
	},
	doPreview: function() {
		return false
	},
	makePortrait: function() {
		this.currentSurface.makePortrait();
		setTimeout(this.resetCallout.bind(this), 10);
		return false
	},
	makeLandscape: function() {
		this.currentSurface.makeLandscape();
		setTimeout(this.resetCallout.bind(this), 10);
		return false
	},
	doReset: function() {
		var a = "This will reset the size and location of the artwork. <br><b>Do you want to continue?</b>";
		showConfirmDialog(a, "Confirm", 400, 100, this._doReset.bind(this))
	},
	_doReset: function() {
		hideDialogWin();
		this.currentSurface.doReset()
	},
	isAspectRatioLocked: function() {
		return this.aspectRatioLocked
	},
	zoomin: function() {
		var a = this._zoom.selectedIndex;
		if (a > 0) {
			this._zoom.selectedIndex = a - 1;
			this.zoom()
		}
	},
	zoomout: function() {
		var a = this._zoom.selectedIndex;
		if (a < (this._zoom.options.length - 1)) {
			this._zoom.selectedIndex = a + 1;
			this.zoom()
		}
	},
	getPageCount: function() {
		return this.surfaces.length
	},
	getNthPage: function(a) {
		if (a < 0 || a >= this.surfaces.length) {
			return null
		}
		return this.surfaces[a]
	},
	getNthPageStatus: function(a) {
		if (a < 0 || a >= this.surfaces.length) {
			return - 1
		}
		return this.surfaces[a].br.status
	},
	calloutOptionChanged: function(a) {
		this.calloutOn = a;
		this._calloutOptionChanged()
	},
	_calloutOptionChanged: function() {
		if (this.calloutOn && this.getCurrentStationName() == "position") {
			this.showCallouts()
		} else {
			this.hideCallouts()
		}
	},
	trimLinesOptionChanged: function(b) {
		this.hideTrimLines = b;
		for (var a = 0; a < this.surfaces.length; a++) {
			this.surfaces[a].setHideTrimLines(this.hideTrimLines)
		}
		if (window.event) {
			window.event.cancelBubble = true
		}
		this.currentSurface.refreshAll();
		var g = $("trimOn");
		if (g) {
			g.style.display = b ? "none": ""
		}
		g = $("trimOff");
		if (g) {
			g.style.display = b ? "": "none"
		}
		if (this.artwork.hasOverLayImage == "true") {
			if (this.currentSurface.backGroundImage) {
				this.currentSurface.backGroundImage.style.display = b ? "": "none"
			}
			g = $("overlayOn");
			if (g) {
				g.style.display = b ? "": "none"
			}
			g = $("overlayOff");
			if (g) {
				g.style.display = b ? "none": ""
			}
		} else {
			g = $("maskOn");
			if (g) {
				g.style.display = b ? "": "none"
			}
			g = $("maskOff");
			if (g) {
				g.style.display = b ? "none": ""
			}
		}
		return false
	},
	hideCallouts: function() {
		if (this.callout != null && this.callout.visible) {
			this.callout.hide()
		}
		if (this.callout2 != null && this.callout2.visible) {
			this.callout2.hide()
		}
	},
	showCallouts: function() {
		if (this.calloutOn && (this.currentTextEditorMode == NO_FORM_MODE)) {
			this.placementHelp();
			this.bleedingHelp()
		}
	},
	updateCalloutFlags: function(o) {
		var r = this.artwork;
		var u = false;
		var g = this.currentSurface;
		var m = g.getGuideStatus("Bleeds")["GuideStatus"];
		var q = g.getGuideStatus("Placement")["GuideStatus"];
		var b = g.getGuideStatus("Dimensions")["GuideStatus"];
		if (m == "warned") {
			if (!g.bleedCB_System) {
				g.bleedCB_System = true;
				u = true
			}
		} else {
			if (g.bleedCB_System) {
				g.bleedCB_System = false;
				u = true
			}
		}
		if (m == "warned" || q == "warned") {
			if (!g.safetyCB_System) {
				g.safetyCB_System = true;
				u = true
			}
		} else {
			if (g.safetyCB_System) {
				g.safetyCB_System = false;
				u = true
			}
		}
		var a = false;
		if (!g.hideCut) {
			g.hideCut = true;
			a = true
		}
		if (g.hideBleed) {
			g.hideBleed = false;
			a = true
		}
		if (g.hideSafety && !this.isReaderSpreadFR()) {
			g.hideSafety = false;
			a = true
		}
		if (o == this.currentSurface) {
			if (a) {
				g._paint2()
			} else {
				if (u) {
					this.placementHelp();
					this.bleedingHelp()
				}
			}
		}
	},
	resetCallout: function() {
		if (this.callout != null && this.callout.visible) {
			this.placementHelp()
		}
		if (this.callout2 != null && this.callout2.visible) {
			this.bleedingHelp()
		}
		if (this.rteEditor != null) {
			this.rteEditor.reposition()
		}
	},
	bleedingHelp: function() {
		this.closeStepDialog();
		if (this.calloutOn && (this.currentTextEditorMode == NO_FORM_MODE) && (this.currentSurface.bleedCallout || this.currentSurface.bleedCB_System)) {
			var a = this.currentSurface.ds.bleedCalloutX;
			if (a == null) {
				a = this.currentSurface.borderLines[10].x - this.currentSurface.viewPortX1 + this.currentSurface.offsetLeft
			} else {
				a = this.currentSurface.offsetLeft - this.currentSurface.viewPortX1 + parseInt(a)
			}
			var o = this.currentSurface.ds.bleedCalloutY;
			if (o == null) {
				o = this.currentSurface.borderLines[10].y + parseInt(this.currentSurface.borderLines[10].h / 2) - this.currentSurface.viewPortY1 + this.currentSurface.offsetTop
			} else {
				o = parseInt(o) - this.currentSurface.viewPortY1 + this.currentSurface.offsetTop
			}
			a += this.currentSurface.element.offsetLeft;
			o += this.currentSurface.element.offsetTop;
			if (this.callout2 == null) {
				var b = '<div class="poppup_triangle-left"></div>';
				this.callout2 = new Af.Callout(b);
				this.callout2.parent = this
			}
			var m = $("blledingCallout");
			var g = m != null ? m.innerHTML: "Specify bleeding callout message in prototype8.html or equivalent file";
			this.callout2.show(a + 66, o, 270, $("MainArea"), g)
		} else {
			if (this.callout2) {
				this.callout2.hide()
			}
		}
		this.checkCalloutState()
	},
	placementHelp: function() {
		this.closeStepDialog();
		if (this.calloutOn && (this.currentTextEditorMode == NO_FORM_MODE) && (this.currentSurface.placementCallout || this.currentSurface.safetyCB_System)) {
			var a = this.currentSurface.ds.safetyCalloutX;
			if (a == null) {
				a = this.currentSurface.borderLines[5].x + parseInt(this.currentSurface.borderLines[5].w / 2) - this.currentSurface.viewPortX1 + this.currentSurface.offsetLeft
			} else {
				a = this.currentSurface.offsetLeft - this.currentSurface.viewPortX1 + parseInt(a)
			}
			var o = this.currentSurface.ds.safetyCalloutY;
			if (o == null) {
				o = this.currentSurface.borderLines[5].y - this.currentSurface.viewPortY1 + this.currentSurface.offsetTop
			} else {
				o = parseInt(o) - this.currentSurface.viewPortY1 + this.currentSurface.offsetTop
			}
			a += this.currentSurface.element.offsetLeft;
			o += this.currentSurface.element.offsetTop;
			if (this.callout == null) {
				var b = '<div class="poppup_triangle-down"></div>';
				this.callout = new Af.Callout(b);
				this.callout.parent = this
			}
			var m = $("placementCallout");
			var g = m != null ? m.innerHTML: "Specify placement callout message in prototype8.html or equivalent file";
			this.callout.show(a - 83, o - 16, 270, $("MainArea"), g)
		} else {
			if (this.callout) {
				this.callout.hide()
			}
		}
		this.checkCalloutState()
	},
	showDefaultCallout: function(o, b, g, m, r, a, q) {
		this.clearCTO();
		this.defaultCto = setTimeout(this._showDefaultCallout.bind(this, a, q, o, b, g, m, r), 50)
	},
	hideDefaultCallout: function() {
		this.clearCTO();
		this.defaultCto = setTimeout(this._hideDefaultCallout.bind(this), 100)
	},
	_showDefaultCallout: function(a, z, r) {
		var u = $("foldCallout");
		var o = u.innerHTML;
		var m = a - this.currentSurface.viewPortX1 + this.currentSurface.offsetLeft;
		var q = z - this.currentSurface.viewPortY1 + this.currentSurface.offsetTop + document.viewport.getScrollOffsets().top;
		this.clearCTO();
		if (this.defaultCallout == null) {
			var b = '<div class="poppup_triangle-down"></div>';
			this.defaultCallout = new Af.Callout(b)
		}
		this.defaultCallout.show(m - 84, q - 17, 270, $("MainArea"), o)
	},
	_hideDefaultCallout: function() {
		this.clearCTO();
		if (this.defaultCallout != null) {
			this.defaultCallout.hide()
		}
	},
	clearCTO: function() {
		if (this.defaultCto != null) {
			clearTimeout(this.defaultCto);
			this.defaultCto = null
		}
	},
	checkItemChanged: function(a) {
		this.currentSurface[a] = $(a).checked
	},
	closeStepDialog: function() {
		if (this.currentStepDialog != null && this.currentStepDialog.visible) {
			this.currentStepDialog.close();
			currentStepDialog = null;
			if (hideFiller) {
				hideFiller(this.currentStepDialog);
				this.currentSurface.refreshAll()
			}
		}
	},
	closeDialog: function(a) {
		if (hideFiller) {
			hideFiller(this.currentStepDialog);
			this.currentSurface.refreshAll()
		}
	},
	placementStatusButton: function() {
		if (this.currentSurface.gobjects.length > 0) {
			var a = this.currentSurface.gobjects[0].placementStatus;
			this.currentSurface.gobjects[0].placementStatus = (a == "1") ? "0": "1";
			if (this.currentSurface.br != null) {
				this.currentSurface.br.executeOneObjRule(this.currentSurface.gobjects[0])
			}
		}
	},
	textAreaTool: function() {
		var b = this.currentSurface;
		var a = (b.sfx2 - b.sfx1) / 2;
		var m = (b.sfy2 - b.sfy1) / 2;
		var g = b.addNewObject("textareaTool", a, m, "Text " + (designer.countNewTextElement + 1));
		return false
	},
	tagEditOK: function(a) {
		this.tagDialog.userData.updateRichText(a);
		this.showMultiRTEEditor();
		this.currentSurface.selectObject(this.tagDialog.userData)
	},
	tagEditCancelled: function() {
		this.showMultiRTEEditor()
	},
	addObject: function(g) {
		var b = this.currentSurface;
		var a = (b.sfx2 - b.sfx1) / 2;
		var o = (b.sfy2 - b.sfy1) / 2;
		var m = b.addNewObject(g, a, o);
		return false
	},
	showEditor: function(a) {
		if (this.multiRTEEditor != null) {
			this.multiRTEEditor.hide()
		}
		if (this.rteEditor == null) {
			this.setRTEditor(a)
		} else {
			this.rteEditor.unhide()
		}
	},
	setRTEditor: function(a) {
		this._setRTEditor(a)
	},
	_setRTEditor: function(a) {
		if (this.rteEditor == null) {
			this.rteEditor = new Af.RTEditor();
			this.rteEditor.rteContainer = $("MainArea");
			this.rteEditor.canvasElement = $("canvasContainer");
			this.rteEditor.editingObject = a;
			this.rteEditor.show = true;
			this.rteEditor.setRTEditor(null, "value", true)
		}
	},
	rtEditorVisibilityChange: function() {
		this.currentSurface.showHideCurtain()
	},
	rteClosed: function() {
		if (this.currentTextEditorMode != NO_FORM_MODE) {
			this.currentTextEditorMode = NO_FORM_MODE;
			this.modeSwitchDone = false;
			this.refreshAll()
		}
	},
	addDataFile: function() {
		this.imageSelectionMode = "dataFile";
		this.saveDocWithMode("beforeUpload");
		return false
	},
	showDataFile: function() {
		if (this.currentSurface.dataFile == null) {
			showMessageDialog(DATAFILE_NOT_ADDED.text, DATAFILE_NOT_ADDED.subject, DATAFILE_NOT_ADDED.width, DATAFILE_NOT_ADDED.height, null, true);
			return
		}
		showModalMessageDialog("Loading file ... please wait", "Loading", 300, 100);
		var a = new Af.DataRequest(svcURL, this.loadDataSetComplete.bind(this), this.loadDataFileFailed.bind(this), view, this.loadDataFileTimedout.bind(this));
		a.addService("DesignerSvc", "loadDataFile");
		a.addParameter("dataFile", this.currentSurface.dataFile);
		a.addParameter("psp", this.pspFile);
		ajaxEngine.processRequest(a);
		return false
	},
	loadDataSetComplete: function(b) {
		hideModalMessageDialog();
		var a = new Af.XMLToDataSet(b.responseXML);
		this.rows = a.data.row;
		if (this.rows == null) {
			this.rows = new Array()
		} else {
			debugA("Number of rows: " + this.rows.length)
		}
		if (this.dataNav == null) {
			this.dataNav = new PsP.DataNav()
		}
		this.dataNav.showFirstRow(this.rows);
		return false
	},
	loadDataFileFailed: function(a, b) {
		hideModalMessageDialog();
		hideDialogWin();
		var b = "Incorrect Data File, Please upload a valid CSV file.";
		showMessageDialog(b, GENERAL_ERROR.subject, GENERAL_ERROR.width, GENERAL_ERROR.height, null, true)
	},
	loadDataFileTimedout: function(a) {
		hideModalMessageDialog();
		hideDialogWin();
		var b = REQUEST_TIMEOUT.text;
		b = replace([RequestedURL], a.requestURL);
		showMessageDialog(b, REQUEST_TIMEOUT.subject, REQUEST_TIMEOUT.width, REQUEST_TIMEOUT.height, null, true)
	},
	closeDataNavigator: function() {
		if (this.dataNav != null) {
			this.dataNav.closeDialog()
		}
		return false
	},
	selectionTool: function() {
		return false
	},
	deleteObject: function() {
		this.currentSurface.deleteSelectedObject();
		return false
	},
	cut: function() {
		this.currentSurface.cut();
		return false
	},
	paste: function() {
		this.currentSurface.paste();
		return false
	},
	copy: function() {
		this.currentSurface.copy();
		return false
	},
	duplicate: function() {
		this.currentSurface.copy();
		this.currentSurface.paste();
		return false
	},
	bringToFront: function() {
		this.currentSurface.bringToFront();
		return false
	},
	sendToBack: function() {
		this.currentSurface.sendToBack();
		return false
	},
	lineWidthChange: function(a) {
		this.currentSurface.lineWidthChange(a);
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	},
	lineStyleChange: function(a) {
		this.currentSurface.lineStyleChange(a);
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	},
	lineColorChange: function() {
		this.showColorPickerBy(this._lineColorTool)
	},
	selectBGColor: function() {
		this.showColorPickerBy(this._bgColorTool)
	},
	selectTextColor: function() {
		this.showColorPickerBy(this._textColorTool);
		return false
	},
	selectBGColor2: function() {
		this.showColorPickerBy(this._bgColorTool2);
		return false
	},
	selectTextColor2: function() {
		this.showColorPickerBy(this._textColorTool2);
		return false
	},
	colorSelected: function(a) {
		if (this.currentColorPickerButton == this._textColorTool) {
			this.currentSurface.setTextColor(a)
		} else {
			if (this.currentColorPickerButton == this._bgColorTool) {
				this.currentSurface.setBackgroundColor(a)
			} else {
				if (this.currentColorPickerButton == this._lineColorTool) {
					this.currentSurface.setLineColor(a)
				} else {
					if (this.currentSurface.selectedObject != null && this.currentSurface.selectedObject.type == "textarea") {
						if (this.currentColorPickerButton == this._textColorTool2) {
							this.currentSurface.setTextColor(a)
						} else {
							if (this.currentColorPickerButton == this._bgColorTool2) {
								this.currentSurface.setBackgroundColor(a)
							}
						}
					} else {
						if (this.currentColorPickerButton == this._changeBGImage) {
							this.currentSurface.changeBackgroundColor(a)
						}
					}
				}
			}
		}
		return false
	},
	showDataMapper: function() {
		if (this.currentSurface.dataFile == null) {
			showMessageDialog(DATAFILE_NOT_ADDED.text, DATAFILE_NOT_ADDED.subject, DATAFILE_NOT_ADDED.width, DATAFILE_NOT_ADDED.height, null, true);
			return
		}
		showDataMapper(this, this.currentSurface.dataFile, this.pspFile)
	},
	dataMapperSaved: function() {
		this.saveDocWithMode()
	},
	dataMapperCancelled: function() {
		this.saveDocWithMode()
	},
	processUploadedImage: function() {
		this.currentSurface.processUploadedImage()
	},
	annotationTool: function() {
		hideModalMessageDialog();
		if (this.annotationDialog == null) {
			this.annotationDialog = new PsP.AnnotationDialog()
		}
		if (this.multiRTEEditor != null) {
			this.multiRTEEditor.hide()
		}
		this.annotationDialog.show(423);
		this.annotationDialog.setData(this.pspFile, this.getCurrentStationName(), new Object());
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	},
	changeImage: function(a) {
		a ? this.currentSurface.defaultSelectionToLowRes() : this.currentSurface.defaultSelectionToBackground();
		if (this.currentSurface.selectedObject) {
			this.dblClickOnImage(this.currentSurface.selectedObject, "beforeUpload")
		}
	},
	changeImageFromGallery: function() {
		this.currentSurface.defaultSelectionToBackground();
		if (this.currentSurface.selectedObject) {
			this.dblClickOnImage(this.currentSurface.selectedObject, "beforeGallery")
		}
	},
	addImageFromGallery: function() {
		this.imageObjChanging = null;
		this.currentSurface.selectObject(null);
		this.saveDocWithMode("beforeGallery")
	},
	addImage: function() {
		var a = $("imageUpdateFromComputer");
		if (a && a.checked) {
			this.imageTool()
		} else {
			this.addImageFromGallery()
		}
	},
	activateGallery: function() {
		var a = -1;
		if (this.imageObjChanging != null) {
			for (var b = 0; b < this.currentSurface.gobjects.length; b++) {
				if (this.currentSurface.gobjects[b] == this.imageObjChanging) {
					a = b;
					break
				}
			}
		} else {
			if (this.currentSurface.gobjects[0].ArtworkSource == "custom") {
				a = 0;
				docuploader.mainImage = true
			}
		}
		actionHandler.activateGallery(a)
	},
	editText: function() {
		this.currentSurface.editText()
	},
	editNext: function() {
		this.currentSurface.editNext()
	},
	editPrevious: function() {
		this.currentSurface.editPrevious()
	},
	advToggle: function() {
		var b = $("atImage");
		if (b != null) {
			var a = false;
			if (b.src.indexOf("NodeOpen") != -1) {
				a = true
			}
			b.src = a ? "/psp/images/NodeClose.gif": "/psp/images/NodeOpen.gif";
			b = $("basicTools");
			if (b) {
				b.style.visibility = a ? "hidden": "visible"
			}
			b = $("atText");
			if (b) {}
		}
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	},
	showMultiRTEEditor: function() {
		if (this.CUSTOMIZE_STATION_NAME != this.getCurrentStationName()) {
			return false
		}
		if (this.rteEditor != null) {
			this.rteEditor.hide()
		}
		if (this.annotationDialog != null) {
			this.annotationDialog.hide()
		}
		if (this.editTextDialogShouldHideFlag) {
			return
		}
		if (this.multiRTEEditor == null) {
			this.multiRTEEditor = new Af.MultiRTEditor();
			this.multiRTEEditor.rteContainer = $("MainArea");
			this.multiRTEEditor.canvasElement = $("canvasContainer");
			this.multiRTEEditor.setRTEditor(this, "value", true)
		}
		this.multiRTEEditor.showRTEEditros(this.currentSurface, this.currentTextEditorMode);
		return false
	},
	textListChanged: function() {
		if (this.multiRTEEditor != null && this.multiRTEEditor.visible) {
			this.multiRTEEditor.reinit()
		}
	},
	hideAllGuideLines: function() {
		this.updateGuideLinesFlag(true, false, false)
	},
	showAllGuideLines: function() {
		this.updateGuideLinesFlag(false, false, false)
	},
	showSafetyGuideLine: function() {
		this.updateGuideLinesFlag(this.currentSurface.hideBleed, false, this.currentSurface.hideCut)
	},
	updateGuideLinesFlag: function(o, b, m) {
		var a = false;
		var g = this.currentSurface;
		if (!g.hideBleed && o) {
			g.hideBleed = true;
			a = true
		} else {
			if (g.hideBleed && !o) {
				g.hideBleed = true;
				a = true
			}
		}
		if (!g.hideCut && m) {
			g.hideCut = true;
			a = true
		} else {
			if (g.hideCut && !m) {
				g.hideBleed = true;
				a = true
			}
		}
		if (!g.hideSafety && b) {
			g.hideSafety = true;
			a = true
		} else {
			if (g.hideSafety && !b) {
				g.hideSafety = false;
				a = true
			}
		}
		if (a) {
			g._paint2()
		}
	},
	groupAlignLeft: function() {
		this.currentSurface.groupAlignLeft();
		return false
	},
	groupAlignCenter: function() {
		this.currentSurface.groupAlignCenter();
		return false
	},
	groupAlignRight: function() {
		this.currentSurface.groupAlignRight();
		return false
	},
	groupAlignTop: function() {
		this.currentSurface.groupAlignTop();
		return false
	},
	groupAlignMiddle: function() {
		this.currentSurface.groupAlignMiddle();
		return false
	},
	groupAlignBottom: function() {
		this.currentSurface.groupAlignBottom();
		return false
	},
	groupRotateLeft: function() {
		this.currentSurface.groupRotateLeft();
		return false
	},
	groupRotateRight: function() {
		this.currentSurface.groupRotateRight();
		return false
	},
	rotateLeft: function() {
		this.rotate( - 90);
		return false
	},
	rotateRight: function() {
		this.rotate(90);
		return false
	},
	rotate: function(m) {
		this.currentSurface.defaultSelectionToBackground();
		var g = this.currentSurface.selectedObject;
		if (g != null && g.type == "textarea") {
			var q = {
				oldBounds: g.getBoundsF(),
				oldAngle: g.rotationAngle,
				isRotate: true
			};
			g.rotate(m);
			var a = g.canvas.sfy2 - g.canvas.sfy1;
			if (g.h > (a - g.y)) {
				if (m == 90) {
					g.h = a - (g.y - g.canvas.sfy1)
				} else {
					if (m == -90) {
						g.setBounds(g.x, g.canvas.sfy1, g.w, a)
					}
				}
			}
			g.canvas.generateImage2(g, false, q);
			return
		}
		if (g == null || g.type != "image" || g.imageFile == null) {
			return
		}
		var o = g.rotationAngle;
		if (o == null) {
			o = 0
		} else {
			o = parseInt(o)
		}
		showModalMessageDialog("Updating ...", "Rotate", 300, 100);
		var b = new Af.DataRequest(svcURL, this.rotateCompleted.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		b.addParameter("psp", this.artwork_uuid);
		b.addService("DesignerSvc", "rotateImage");
		b.addParameter("image", g.imageFile);
		b.addParameter("currentAngle", "" + o);
		b.addParameter("rotateBy", "" + m);
		ajaxEngine.processRequest(b);
		return false
	},
	flipHor: function() {
		return false
	},
	flipVer: function() {
		return false
	},
	rotateCompleted: function(b) {
		hideModalMessageDialog();
		var a = new Af.XMLToDataSet(b.responseXML);
		var g = a.data;
		var m = this.currentSurface.selectedObject;
		if (m == null || m.type != "image" || m.imageFile == null) {
			return
		}
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(m, m.undoRedoRotate, {
			image: m.imageFile,
			angle: m.rotationAngle
		},
		{
			image: g.image,
			angle: g.newAngle
		});
		chgMgr.endTx();
		m.rotationAngle = g.newAngle;
		m.setValue(g.image);
		m.swapW_H()
	},
	selectAllText: function() {
		this.currentSurface.selectAllText()
	},
	cropImage: function() {
		var a = this.currentSurface.selectedObject;
		if (a == null || a.type != "image" || a.imageFile == null) {
			return
		}
		if (this.imageEditor == null) {
			this.imageEditor = new PsP.ImageEditor("Format - Crop", this)
		}
		this.imageEditor.show3($("MainArea"), a)
	},
	changeBackgroundColor: function() {
		this.showColorPickerBy(this._changeBGImage)
	},
	showColorPickerBy: function(g) {
		if (this.colorPicker.visible && this.currentColorPickerButton == g) {
			this.colorPicker.close();
			return
		}
		this.currentColorPickerButton = g;
		var b = toDocumentPosition(g);
		var a = b.x;
		var m = b.y + g.offsetHeight;
		this.colorPicker.show("MainArea", a, m)
	}
});
function uploadCompleted() {
	designer.uploadCompleted()
}
function showDataMapper(a, b) {
	alert("Showing data mapper: " + b)
}
function dataMapperSaved() {
	designer.dataMapperSaved()
}
function dataMapperCancelled() {
	designer.dataMapperCancelled()
}
PsP.Uploader = Class.create({
	UPLOAD_POPUP_WIDTH: 635,
	UPLOAD_POPUP_HEIGHT: 226,
	initialize: function() {
		this.dialog = null;
		this.imageUploadURL = null;
		this.invoker = null;
		this.uploadCompleteListener = null
	},
	beginDocUploadWorkFlow: function(g, x) {
		this.invoker = x;
		if (g == "data") {
			windowName = "Upload Data file"
		} else {
			windowName = "Add Images"
		}
		var A = pspspassport;
		if (A == undefined || A == "null" || A == "1784F2F0D185EDEF107560B403B702178C99E51AB9BE0C93462E2858591AB93596475D01B52B66508DED8F9787ECD6AE2B1A45919135957A1BF09D52B3224F888D138BD928BD571D") {
			A = "6F25FA226A3661B5"
		}
		if (A === "6F25FA226A3661B5") {
			A = ""
		}
		var B = this.imageUploadURL + "?pspspassport=" + A;
		if (designer.pspFile) {
			B += "&pspname=" + designer.pspFile
		}
		if (selectFolderURL != null) {
			B += "&folder=" + selectFolderURL
		}
		B += "&currentpage=" + designer.currentSurface.id;
		var a = navigator.userAgent;
		if ((a.indexOf("iPhone") != -1) || (a.indexOf("iPod") != -1) || (a.indexOf("iPad") != -1)) {
			B += "&htmlUpload=true&filename=true"
		}
		var u = location.search.substring(1, location.search.length);
		var r = null;
		var y = null;
		var o = null;
		var b = false;
		var m = u.split("&");
		for (i = 0; i < m.length; i++) {
			var q = m[i].substring(0, m[i].indexOf("="));
			if (q == "uploadMode") {
				b = m[i].substring(m[i].indexOf("=") + 1)
			}
			if (q == "productname") {
				r = m[i].substring(m[i].indexOf("=") + 1)
			}
			if (q == "size") {
				y = m[i].substring(m[i].indexOf("=") + 1)
			}
			if (q == "sides") {
				o = m[i].substring(m[i].indexOf("=") + 1)
			}
		}
		if (A == "6F25FA226A3661B5") {
			var z = designer.artwork.guest_Identifier;
			B += "&dt_cid=" + z
		}
		if (b == "true") {
			this.objectId = 0;
			this.mainImage = true
		}
		if (r != null) {
			B += "&productname=" + r
		}
		if (y != null) {
			B += "&size=" + y
		}
		if (o != null) {
			B += "&sides=" + o
		}
		if (this.objectId != null) {
			B += "&objectId=" + this.objectId
		} else {
			B += "&objectId=-1"
		}
		if (g == "data") {
			B += "&mode=dataFile"
		} else {
			B += "&overlay=" + (this.mainImage ? "false": "true")
		}
		B += "&CDEURL=" + encodeURIComponent(document.location.href);
		GB_showCenter_newLook(windowName, B, this.UPLOAD_POPUP_HEIGHT, this.UPLOAD_POPUP_WIDTH)
	},
	closeDialog: function(a) {
		this.hide();
		if (this.uploadCompleteListener != null && this.uploadCompleteListener.uploadDialogClosed != null) {
			this.uploadCompleteListener.uploadDialogClosed(false, this.mainImage)
		} else {
			if (this.invoker != null && this.invoker.loadDocumentList != null) {
				this.invoker.loadDocumentList()
			} else {
				if (this.invoker != null && this.invoker.uploadDialogClosed != null) {
					this.invoker.uploadDialogClosed(false, this.mainImage)
				}
			}
		}
	},
	hide: function() {
		this.dialog.hide()
	}
});
var docuploader = new PsP.Uploader();
docuploader.triggerMyEvent = function() {
	if (docuploader.style.visibility == "hidden") {}
};
function uploadCompleted() {
	docuploader.hide();
	if (docuploader.uploadCompleteListener != null && docuploader.uploadCompleteListener.uploadDialogClosed != null) {
		docuploader.uploadCompleteListener.uploadDialogClosed(true, docuploader.mainImage)
	}
}
PsP.ImageEditor = Class.create(new Af.Dialog2, {
	initialize: function(b, a) {
		this.parent = a;
		this._initializeDialog2($("imageEditorContent"), b);
		this.top = 80;
		$("saveImageEdit").observe("click", this.doSaveImageEdit.bindAsEventListener(this));
		$("closeImageEdit").observe("click", this.cancel.bindAsEventListener(this));
		this.aspectFlag = $("imageEditAspectRatioFlag")
	},
	show3: function(a, b) {
		this.dwObj = b;
		this.show2(a);
		if (this.designCanvas == null) {
			this.designCanvas = new Af.CropCanvas(this, "cropCanvasContainer", "cropCanvas", this.aspectFlag)
		}
		this.designCanvas.setDrawingObject(b)
	},
	close: function(a) {
		Event.stop(a);
		this.cancel()
	},
	cancel: function() {
		this._cancel()
	},
	_cancel: function() {
		hideModalMessageDialog();
		this.hide()
	},
	doSaveImageEdit: function(g) {
		Event.stop(g);
		var b = this.designCanvas.getCropArea();
		var a = new Af.DataRequest(svcURL, this.saveImageSuccessful.bind(this), requestFailedCommon, view, requestTimedoutCommon);
		a.addService("DesignerSvc", "editImage");
		a.addParameter("psp", designer.artwork_uuid);
		a.addParameter("imageFile", this.designCanvas.getCropImage());
		a.addParameter("x", "" + b.x);
		a.addParameter("y", "" + b.y);
		a.addParameter("w", "" + b.w);
		a.addParameter("h", "" + b.h);
		a.addParameter("a", "" + this.dwObj.rotationAngle);
		showMessageDialog(CROP_IMAGE_SAVE.text, CROP_IMAGE_SAVE.subject, CROP_IMAGE_SAVE.width, CROP_IMAGE_SAVE.height, null, true);
		ajaxEngine.processRequest(a)
	},
	saveImageSuccessful: function(b) {
		hideDialogWin();
		var a = new Af.XMLToDataSet(b.responseXML);
		var o = a.data;
		var g = this.designCanvas.origObj;
		chgMgr.beginTx();
		chgMgr.addModifyChangeByMethod(g, g.changeImageUndoRedo, g.imageFile, o.image, null);
		chgMgr.endTx();
		if (g.originalImage == null) {
			g.originalImage = this.designCanvas.getCropImage();
			g.originalImageWidth = this.designCanvas.actualW;
			g.originalImageHeight = this.designCanvas.actualH
		}
		var m = this.designCanvas.getCropArea();
		g.cx = m.x;
		g.cy = m.y;
		g.cw = m.w;
		g.ch = m.h;
		if (this.designCanvas.isOrthogonal) {
			if (m.w > m.h) {
				h = g.h;
				w = Math.round(g.h / m.w * m.h)
			} else {
				h = Math.round(g.w / m.h * m.w);
				w = g.w
			}
		} else {
			if (m.w > m.h) {
				w = g.w;
				h = Math.round(g.w / m.w * m.h)
			} else {
				w = Math.round(g.h / m.h * m.w);
				h = g.h
			}
		}
		g.setValue(o.image);
		if (!this.designCanvas.isAspectRatioLocked()) {
			g.setBoundsNoAspect(g.x, g.y, w, h, true)
		} else {
			g.resizeElements();
			g.canvas.br.executeRules2(false, g.mainImage, true)
		}
		this.hide()
	}
});
var designNameSaver = {
	SAVE_MODE: "save",
	init: function(a, b) {
		this._designer = a;
		this._storejs = b;
		this.DESIGN_NAME_KEY = this._buildKeyForDesignName();
		console.log("this._designNameKey =" + this.DESIGN_NAME_KEY)
	},
	_updateArtworkDesignName: function(a) {
		console.log("_updateArtworkDesignName newName=" + a);
		this._designer.artwork.designName = a
	},
	_saveArtwork: function(o) {
		if (typeof o === "undefined") {
			o = true
		}
		console.log("_saveArtwork with updateDb=" + o);
		var q = this.SAVE_MODE;
		var m = true;
		var b = this;
		var a = this._designer.artwork.jobId;
		this._designer.saveDoc(function g() {
			console.log("after saveDoc callback is fired");
			if (o) {
				console.log("index changes");
				InitializeServiceIndexing(a)
			}
			b._afterSaveCallback()
		},
		q, m)
	},
	_afterSaveCallback: function() {
		if (_currentStation_ == "position" && designName.isLogedIn()) {
			this._designer.wfe.changeStation(_currentStation_)
		}
	},
	getDesignNameFromStore: function() {
		var a = this._storejs.get(this.DESIGN_NAME_KEY);
		console.log("getDesignNameFromStore designName=" + a);
		return a
	},
	setDesignNameInStore: function(a) {
		console.log("setDesignNameInStore designName=" + a);
		this._storejs.set(this.DESIGN_NAME_KEY, a)
	},
	resetDesignNameInStore: function() {
		console.log("resetDesignNameInStore");
		this._storejs.remove(this.DESIGN_NAME_KEY)
	},
	_buildKeyForDesignName: function() {
		return this._designer.artwork.jobId + ".designName"
	},
	getDesignIsSavedFromStore: function(a) {
		return this._storejs.get(a)
	},
	isDesignSaved: function(a) {
		return this.getDesignIsSavedFromStore(a)
	},
	setDesignSavedInStore: function(a, b) {
		b.set(a, true)
	},
	resetDesignSavedInStore: function(a, b) {
		b.remove(a)
	}
};
var designName = {
	init: function(a, b) {
		this.designer = a;
		this.designNameSaver = b;
		this.letters = /^[0-9a-zA-Z]+$/;
		this.divViewDesignName = $("ViewDesignName");
		if (_storeId_ !== "35") {
			if (this.divViewDesignName) {
				this.divViewDesignName.show()
			}
		}
		this.divViewEditDesignName = $("ViewEditDesignName");
		this.divErrorRequired = $("ErrorRequired");
		this.divErrorLeterNum = $("ErrorLeterNum");
		this.setListnersOnLinks();
		var m = this.designNameSaver.getDesignNameFromStore();
		console.log("init read designNameFromStore=" + m);
		if (m) {
			console.log("save designNameFromStore=" + m);
			if (this.isLogedIn()) {
				this.designNameSaver.setDesignSavedInStore(this.designer.artwork.jobId, window.storejs);
				this.designNameSaver._updateArtworkDesignName(m);
				this.designNameSaver._saveArtwork()
			}
			this.designNameSaver.resetDesignNameInStore()
		}
		var g = this._getCurrentDesignName();
		console.log("init designName=" + g);
		this.setNameInFields(g)
	},
	_getCurrentDesignName: function() {
		return this.designer.artwork.designName
	},
	setListnersOnLinks: function() {
		this.aRename = $("Rename");
		if (this.aRename) {
			this.aRename.observe("click", this.editDesignName.bind(this, false))
		}
		this.aSaveDesignName = $("SaveDesignName");
		if (this.aSaveDesignName) {
			this.aSaveDesignName.observe("click", this.save.bind(this, false))
		}
		this.aCancelChangeDesignName = $("CancelChangeDesignName");
		if (this.aCancelChangeDesignName) {
			this.aCancelChangeDesignName.observe("click", this.cancel.bind(this, false))
		}
		this.aEditInput = $("EditDesignName");
		if (this.aEditInput) {
			var a = this;
			this.aEditInput.observe("keypress",
			function(g) {
				var b = g.which || g.keyCode;
				switch (b) {
				case Event.KEY_RETURN:
					a.save();
					break;
				default:
					break
				}
			})
		}
	},
	setNameInFields: function(g) {
		var b = $("DesignName");
		if (b) {
			b.update(g)
		}
		var a = $("EditDesignName");
		if (a) {
			a.value = g
		}
	},
	editDesignName: function() {
		var a = this._getCurrentDesignName();
		this.setNameInFields(a);
		this._setEditNameState()
	},
	getNewDesignerNameFromInput: function() {
		var b = "Design Name";
		var a = $("EditDesignName");
		if (a) {
			b = a.value
		}
		return b
	},
	save: function() {
		var m = this.getNewDesignerNameFromInput();
		this._hideErrorMessages();
		var g = this._getCurrentDesignName();
		if (m == g) {
			this._setViewNameState();
			return
		}
		if (m == "") {
			this.showErrorEmpty();
			return
		}
		if (this.isLogedIn()) {
			console.log("save value for logged in user");
			this.designNameSaver.setDesignSavedInStore(designer.artwork.jobId, window.storejs);
			this.setNameInFields(m);
			this._setViewNameState();
			this.designNameSaver._updateArtworkDesignName(m);
			this.designNameSaver._saveArtwork()
		} else {
			console.log("save value for not logged in user");
			this.setNameInFields(m);
			this._setViewNameState();
			this.designNameSaver.setDesignNameInStore(m);
			this.designNameSaver._saveArtwork();
			console.log("promt auth without save");
			var b = this;
			var a = function(o) {
				console.log("cancelCallback");
				if (o && o.mode === "sequential") {
					console.log("skip cancelCallback in register mode");
					return
				}
				if (!b.isLogedIn()) {
					b.setNameInFields(g);
					b.designNameSaver.resetDesignNameInStore()
				} else {
					this.setNameInFields(m);
					this._setViewNameState();
					this.designNameSaver._updateArtworkDesignName(m);
					this.designNameSaver._saveArtwork()
				}
			};
			LoadLogin("6", false, a)
		}
	},
	cancel: function() {
		var a = this._getCurrentDesignName();
		this.setNameInFields(a);
		this._hideErrorMessages();
		this._setViewNameState()
	},
	isLogedIn: function() {
		return AuthUtil.isLoggedIn()
	},
	showErrorEmpty: function() {
		if (this.divErrorRequired) {
			this.divErrorRequired.show()
		}
	},
	hideErrorEmpty: function() {
		if (this.divErrorRequired) {
			this.divErrorRequired.hide()
		}
	},
	showErrorNotAlphanum: function() {
		if (this.divErrorLeterNum) {
			this.divErrorLeterNum.show()
		}
	},
	hideErrorNotAlphanum: function() {
		if (this.divErrorLeterNum) {
			this.divErrorLeterNum.hide()
		}
	},
	isValidAlphanum: function(a) {
		a = a.replace(/\s/g, "");
		return a.match(this.letters)
	},
	_hideErrorMessages: function() {
		this.hideErrorNotAlphanum();
		this.hideErrorEmpty()
	},
	_setEditNameState: function() {
		if (this.divViewDesignName) {
			this.divViewDesignName.hide()
		}
		if (this.divViewEditDesignName) {
			this.divViewEditDesignName.show()
		}
	},
	_setViewNameState: function() {
		if (this.divViewDesignName) {
			this.divViewDesignName.show()
		}
		if (this.divViewEditDesignName) {
			this.divViewEditDesignName.hide()
		}
	}
};
var savedTimeStamp = {
	isDeluxeStore: function() {
		return (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"))
	},
	setSavedTimeStampLabel: function(g, q) {
		var o = "File Saved | ";
		var u = parseInt(g.artwork.lastSavedTimeStamp);
		var m = new Date(u);
		var r = m.format("hh:MMtt mm/dd/yyyy");
		var b = o + r;
		if (this.isDeluxeStore()) {
			b = "&nbsp;"
		}
		var a = $("SavedTimeStampLabel");
		if (a) {
			a.update(b);
			if (q.isDesignSaved(g.artwork.jobId)) {
				a.show()
			}
		}
	}
};
var baseURL;
var cdeURL;
var customizationURL;
var d = (location.host).split(".");
if ((d[0] == "qa") || (d[0] == "colo-developer")) {
	googleAnalyticsTrackCode = "UA-1236729-3";
	CDEUrl = baseURL + "cde"
} else {
	googleAnalyticsTrackCode = "UA-1236729-1";
	CDEUrl = baseURL + "cde2"
}
if (location.host == "designtool.psprint.com") {
	baseURL = "http://www.psprint.com/"
} else {
	if (location.host == "qadesigntool.psprint.com" || location.host == "colo-developer.psprint.com:81") {
		baseURL = "http://qa.psprint.com/"
	} else {
		baseURL = location.protocol + "//" + location.host + "/"
	}
}
customizationURL = baseURL + "design-templates";
var homePageURL = baseURL;
var imgLibraryURL = baseURL + "MyArtwork/index.aspx";
var galleryPageURL = baseURL + "design-templates/";
var publishDesignURL = baseURL + "design-templates/cdepublishdesign.aspx";
var manageAccountURL = baseURL + "design-templates/cdemanageaccount.aspx";
var signupURL = baseURL + "signupcomponent/signup.aspx";
var quoteToolURL = baseURL + "productredesign/shared/aspx/quotetool.aspx";
var validateLoginURL = baseURL + "gallery/wsloginvalidator.asmx/ValidatePassport";
var getSequenceNumberURL = baseURL + "gallery/Sequence.asmx/SequenceNumber?Callback=";
var readpspURL = baseURL + "finishing/readPSP.aspx";
var updateDBURL = baseURL + "gallery/sequence.asmx/UpdateDB";
var myJobListURL = baseURL + "myAccount/myjobs/Index.aspx";
var designerProfileURL = baseURL + "gallery/cdedesignerprofile.aspx?designerId=";
var shareThisURL = baseURL + "gallery/sharethis.aspx";
var sharepspURL = baseURL + "gallery/sharepsp.aspx?pspid=";
var productTabURL = baseURL + "productredesign/shared/aspx/cdeproductstab.aspx?cdegalleryproductname=";
var orderTabURL = baseURL + "productredesign/shared/aspx/cdeorderingtab.aspx?cdegalleryproductname=";
var logoutURL = baseURL + "signupcomponent/shared/asp/logout.asp?logoutuser=1&url=design-templates/";
var businesscardsURL = baseURL + "productredesign/shared/aspx/cde-shared-main-products.aspx?xmlname=cde-business-cards/xml/cde-business-cards-main-version3.xml&xsltname=shared/xslt/cde-shared-main-products-version3.xslt";
var postcardsURL = baseURL + "productredesign/shared/aspx/cde-shared-main-products.aspx?xmlname=cde-postcards/xml/cde-postcards-main-version3.xml&xsltname=shared/xslt/cde-shared-main-products-version3.xslt";
var contributionURL = baseURL + "contribution/index.aspx?googletag=";
var changeStationURL = baseURL + "gallery/sequence.asmx/SavePSPCurrentposition?psp_name=";
var defaultPassport = "6F25FA226A3661B5";
AJS = {
	BASE_URL: "",
	drag_obj: null,
	drag_elm: null,
	_drop_zones: [],
	_cur_pos: null,
	getScrollTop: function() {
		var a;
		if (document.documentElement && document.documentElement.scrollTop) {
			a = document.documentElement.scrollTop
		} else {
			if (document.body) {
				a = document.body.scrollTop
			}
		}
		return a
	},
	addClass: function() {
		var g = AJS.forceArray(arguments);
		var b = g.pop();
		var a = function(m) {
			if (!new RegExp("(^|\\s)" + b + "(\\s|$)").test(m.className)) {
				m.className += (m.className ? " ": "") + b
			}
		};
		AJS.map(g,
		function(m) {
			a(m)
		})
	},
	setStyle: function() {
		var g = AJS.forceArray(arguments);
		var b = g.pop();
		var a = g.pop();
		AJS.map(g,
		function(m) {
			m.style[a] = AJS.getCssDim(b)
		})
	},
	extend: function(m) {
		var g = new this("no_init");
		for (k in m) {
			var b = g[k];
			var a = m[k];
			if (b && b != a && typeof a == "function") {
				a = this._parentize(a, b)
			}
			g[k] = a
		}
		return new AJS.Class(g)
	},
	log: function(a) {
		if (window.console) {
			console.log(a)
		} else {
			var b = AJS.$("ajs_logger");
			if (!b) {
				b = AJS.DIV({
					id: "ajs_logger",
					style: "color: green; position: absolute; left: 0"
				});
				b.style.top = AJS.getScrollTop() + "px";
				AJS.ACN(AJS.getBody(), b)
			}
			AJS.setHTML(b, "" + a)
		}
	},
	setHeight: function() {
		var a = AJS.forceArray(arguments);
		a.splice(a.length - 1, 0, "height");
		AJS.setStyle.apply(null, a)
	},
	_getRealScope: function(a, g) {
		g = AJS.$A(g);
		var b = a._cscope || window;
		return function() {
			var m = AJS.$FA(arguments).concat(g);
			return a.apply(b, m)
		}
	},
	documentInsert: function(a) {
		if (typeof(a) == "string") {
			a = AJS.HTML2DOM(a)
		}
		document.write('<span id="dummy_holder"></span>');
		AJS.swapDOM(AJS.$("dummy_holder"), a)
	},
	getWindowSize: function(g) {
		g = g || document;
		var b, a;
		if (self.innerHeight) {
			b = self.innerWidth;
			a = self.innerHeight
		} else {
			if (g.documentElement && g.documentElement.clientHeight) {
				b = g.documentElement.clientWidth;
				a = g.documentElement.clientHeight
			} else {
				if (g.body) {
					b = g.body.clientWidth;
					a = g.body.clientHeight
				}
			}
		}
		return {
			w: b,
			h: a
		}
	},
	flattenList: function(b) {
		var g = [];
		var a = function(o, m) {
			AJS.map(m,
			function(q) {
				if (q == null) {} else {
					if (AJS.isArray(q)) {
						a(o, q)
					} else {
						o.push(q)
					}
				}
			})
		};
		a(g, b);
		return g
	},
	isFunction: function(a) {
		return (typeof a == "function")
	},
	setEventKey: function(a) {
		a.key = a.keyCode ? a.keyCode: a.charCode;
		if (window.event) {
			a.ctrl = window.event.ctrlKey;
			a.shift = window.event.shiftKey
		} else {
			a.ctrl = a.ctrlKey;
			a.shift = a.shiftKey
		}
		switch (a.key) {
		case 63232:
			a.key = 38;
			break;
		case 63233:
			a.key = 40;
			break;
		case 63235:
			a.key = 39;
			break;
		case 63234:
			a.key = 37;
			break
		}
	},
	removeElement: function() {
		var a = AJS.forceArray(arguments);
		AJS.map(a,
		function(b) {
			AJS.swapDOM(b, null)
		})
	},
	_unloadListeners: function() {
		if (AJS.listeners) {
			AJS.map(AJS.listeners,
			function(g, b, a) {
				AJS.REV(g, b, a)
			})
		}
		AJS.listeners = []
	},
	join: function(b, a) {
		try {
			return a.join(b)
		} catch(m) {
			var g = a[0] || "";
			AJS.map(a,
			function(o) {
				g += b + o
			},
			1);
			return g + ""
		}
	},
	getIndex: function(m, g, b) {
		for (var a = 0; a < g.length; a++) {
			if (b && b(g[a]) || m == g[a]) {
				return a
			}
		}
		return - 1
	},
	isIn: function(g, a) {
		var b = AJS.getIndex(g, a);
		if (b != -1) {
			return true
		} else {
			return false
		}
	},
	isArray: function(a) {
		return a instanceof Array
	},
	setLeft: function() {
		var a = AJS.forceArray(arguments);
		a.splice(a.length - 1, 0, "left");
		AJS.setStyle.apply(null, a)
	},
	appendChildNodes: function(a) {
		if (arguments.length >= 2) {
			AJS.map(arguments,
			function(b) {
				if (AJS.isString(b)) {
					b = AJS.TN(b)
				}
				if (AJS.isDefined(b)) {
					a.appendChild(b)
				}
			},
			1)
		}
		return a
	},
	getElementsByTagAndClassName: function(r, q, m, b) {
		var u = [];
		if (!AJS.isDefined(m)) {
			m = document
		}
		if (!AJS.isDefined(r)) {
			r = "*"
		}
		var a = m.getElementsByTagName(r);
		var o = a.length;
		var g = new RegExp("(^|\\s)" + q + "(\\s|$)");
		for (i = 0, j = 0; i < o; i++) {
			if (g.test(a[i].className) || q == null) {
				u[j] = a[i];
				j++
			}
		}
		if (b) {
			return u[0]
		} else {
			return u
		}
	},
	isOpera: function() {
		return (navigator.userAgent.toLowerCase().indexOf("opera") != -1)
	},
	isString: function(a) {
		return (typeof a == "string")
	},
	hideElement: function(b) {
		var a = AJS.forceArray(arguments);
		AJS.map(a,
		function(g) {
			g.style.display = "none"
		})
	},
	setOpacity: function(b, a) {
		b.style.opacity = a;
		b.style.filter = "alpha(opacity=" + a * 100 + ")"
	},
	insertBefore: function(b, a) {
		a.parentNode.insertBefore(b, a);
		return b
	},
	setWidth: function() {
		var a = AJS.forceArray(arguments);
		a.splice(a.length - 1, 0, "width");
		AJS.setStyle.apply(null, a)
	},
	createArray: function(a) {
		if (AJS.isArray(a) && !AJS.isString(a)) {
			return a
		} else {
			if (!a) {
				return []
			} else {
				return [a]
			}
		}
	},
	isDict: function(b) {
		var a = String(b);
		return a.indexOf(" Object") != -1
	},
	isMozilla: function() {
		return (navigator.userAgent.toLowerCase().indexOf("gecko") != -1 && navigator.productSub >= 20030210)
	},
	removeEventListener: function(o, m, a, g) {
		var b = "ajsl_" + m + a;
		if (!g) {
			g = false
		}
		a = o[b] || a;
		if (o["on" + m] == a) {
			o["on" + m] = o[b + "old"]
		}
		if (o.removeEventListener) {
			o.removeEventListener(m, a, g);
			if (AJS.isOpera()) {
				o.removeEventListener(m, a, !g)
			}
		} else {
			if (o.detachEvent) {
				o.detachEvent("on" + m, a)
			}
		}
	},
	callLater: function(a, g) {
		var b = function() {
			a()
		};
		window.setTimeout(b, g)
	},
	setTop: function() {
		var a = AJS.forceArray(arguments);
		a.splice(a.length - 1, 0, "top");
		AJS.setStyle.apply(null, a)
	},
	_createDomShortcuts: function() {
		var b = ["ul", "li", "td", "tr", "th", "tbody", "table", "input", "span", "b", "a", "div", "img", "button", "h1", "h2", "h3", "h4", "h5", "h6", "br", "textarea", "form", "p", "select", "option", "optgroup", "iframe", "script", "center", "dl", "dt", "dd", "small", "pre", "i"];
		var a = function(g) {
			AJS[g.toUpperCase()] = function() {
				return AJS.createDOM.apply(null, [g, arguments])
			}
		};
		AJS.map(b, a);
		AJS.TN = function(g) {
			return document.createTextNode(g)
		}
	},
	addCallback: function(a) {
		this.callbacks.unshift(a)
	},
	bindMethods: function(g) {
		for (var b in g) {
			var a = g[b];
			if (typeof(a) == "function") {
				g[b] = AJS.$b(a, g)
			}
		}
	},
	partial: function(b) {
		var a = AJS.$FA(arguments);
		a.shift();
		return function() {
			a = a.concat(AJS.$FA(arguments));
			return b.apply(window, a)
		}
	},
	isNumber: function(a) {
		return (typeof a == "number")
	},
	getCssDim: function(a) {
		if (AJS.isString(a)) {
			return a
		} else {
			return a + "px"
		}
	},
	isIe: function() {
		return (navigator.userAgent.toLowerCase().indexOf("msie") != -1 && navigator.userAgent.toLowerCase().indexOf("opera") == -1)
	},
	removeClass: function() {
		var g = AJS.forceArray(arguments);
		var a = g.pop();
		var b = function(m) {
			m.className = m.className.replace(new RegExp("\\s?" + a, "g"), "")
		};
		AJS.map(g,
		function(m) {
			b(m)
		})
	},
	setHTML: function(b, a) {
		b.innerHTML = a;
		return b
	},
	map: function(m, q, g, a) {
		var o = 0,
		b = m.length;
		if (g) {
			o = g
		}
		if (a) {
			b = a
		}
		for (o; o < b; o++) {
			var r = q(m[o], o);
			if (r != undefined) {
				return r
			}
		}
	},
	addEventListener: function(u, r, x, q, o) {
		var m = "ajsl_" + r + x;
		if (!o) {
			o = false
		}
		AJS.listeners = AJS.$A(AJS.listeners);
		if (AJS.isIn(r, ["keypress", "keydown", "keyup", "click"])) {
			var g = x;
			x = function(y) {
				AJS.setEventKey(y);
				return g.apply(window, arguments)
			}
		}
		var b = AJS.isIn(r, ["submit", "load", "scroll", "resize"]);
		var a = AJS.$A(u);
		AJS.map(a,
		function(z) {
			if (q) {
				var y = x;
				x = function(C) {
					AJS.REV(z, r, x);
					return y.apply(window, arguments)
				}
			}
			if (b) {
				var B = z["on" + r];
				var A = function() {
					if (B) {
						x(arguments);
						return B(arguments)
					} else {
						return x(arguments)
					}
				};
				z[m] = A;
				z[m + "old"] = B;
				u["on" + r] = A
			} else {
				z[m] = x;
				if (z.attachEvent) {
					z.attachEvent("on" + r, x)
				} else {
					if (z.addEventListener) {
						z.addEventListener(r, x, o)
					}
				}
				AJS.listeners.push([z, r, x])
			}
		})
	},
	preloadImages: function() {
		AJS.AEV(window, "load", AJS.$p(function(a) {
			AJS.map(a,
			function(g) {
				var b = new Image();
				b.src = g
			})
		},
		arguments))
	},
	forceArray: function(a) {
		var b = [];
		AJS.map(a,
		function(g) {
			b.push(g)
		});
		return b
	},
	update: function(b, a) {
		for (var g in a) {
			b[g] = a[g]
		}
		return b
	},
	getBody: function() {
		return AJS.$bytc("body")[0]
	},
	HTML2DOM: function(b, a) {
		var g = AJS.DIV();
		g.innerHTML = b;
		if (a) {
			return g.childNodes[0]
		} else {
			return g
		}
	},
	getElement: function(a) {
		if (AJS.isString(a) || AJS.isNumber(a)) {
			return document.getElementById(a)
		} else {
			return a
		}
	},
	showElement: function() {
		var a = AJS.forceArray(arguments);
		AJS.map(a,
		function(b) {
			b.style.display = ""
		})
	},
	bind: function(b, g, a) {
		b._cscope = g;
		return AJS._getRealScope(b, a)
	},
	createDOM: function(q, m) {
		var o = 0,
		g;
		var u = document.createElement(q);
		var a = m[0];
		if (AJS.isDict(m[o])) {
			for (k in a) {
				g = a[k];
				if (k == "style" || k == "s") {
					u.style.cssText = g
				} else {
					if (k == "c" || k == "class" || k == "className") {
						u.className = g
					} else {
						u.setAttribute(k, g)
					}
				}
			}
			o++
		}
		if (a == null) {
			o = 1
		}
		for (var b = o; b < m.length; b++) {
			var g = m[b];
			if (g) {
				var r = typeof(g);
				if (r == "string" || r == "number") {
					g = AJS.TN(g)
				}
				u.appendChild(g)
			}
		}
		return u
	},
	swapDOM: function(g, b) {
		g = AJS.getElement(g);
		var a = g.parentNode;
		if (b) {
			b = AJS.getElement(b);
			a.replaceChild(b, g)
		} else {
			a.removeChild(g)
		}
		return b
	},
	isDefined: function(a) {
		return (a != "undefined" && a != null)
	}
};
AJS.$ = AJS.getElement;
AJS.$$ = AJS.getElements;
AJS.$f = AJS.getFormElement;
AJS.$p = AJS.partial;
AJS.$b = AJS.bind;
AJS.$A = AJS.createArray;
AJS.DI = AJS.documentInsert;
AJS.ACN = AJS.appendChildNodes;
AJS.RCN = AJS.replaceChildNodes;
AJS.AEV = AJS.addEventListener;
AJS.REV = AJS.removeEventListener;
AJS.$bytc = AJS.getElementsByTagAndClassName;
AJS.$AP = AJS.absolutePosition;
AJS.$FA = AJS.forceArray;
AJS.addEventListener(window, "unload", AJS._unloadListeners);
AJS._createDomShortcuts();
AJS.Class = function(b) {
	var a = function() {
		if (arguments[0] != "no_init") {
			return this.init.apply(this, arguments)
		}
	};
	a.prototype = b;
	AJS.update(a, AJS.Class.prototype);
	return a
};
AJS.Class.prototype = {
	extend: function(g) {
		var b = new this("no_init");
		for (k in g) {
			var a = b[k];
			var m = g[k];
			if (a && a != m && typeof m == "function") {
				m = this._parentize(m, a)
			}
			b[k] = m
		}
		return new AJS.Class(b)
	},
	implement: function(a) {
		AJS.update(this.prototype, a)
	},
	_parentize: function(b, a) {
		return function() {
			this.parent = a;
			return b.apply(this, arguments)
		}
	}
};
script_loaded = true;
script_loaded = true;
AJS.fx = {
	_shades: {
		0 : "ffffff",
		1 : "ffffee",
		2 : "ffffdd",
		3 : "ffffcc",
		4 : "ffffbb",
		5 : "ffffaa",
		6 : "ffff99"
	},
	highlight: function(g, b) {
		var a = new AJS.fx.Base();
		a.elm = AJS.$(g);
		a.options.duration = 600;
		a.setOptions(b);
		AJS.update(a, {
			increase: function() {
				if (this.now == 7) {
					g.style.backgroundColor = "#fff"
				} else {
					g.style.backgroundColor = "#" + AJS.fx._shades[Math.floor(this.now)]
				}
			}
		});
		return a.custom(6, 0)
	},
	fadeIn: function(g, a) {
		a = a || {};
		if (!a.from) {
			a.from = 0;
			AJS.setOpacity(g, 0)
		}
		if (!a.to) {
			a.to = 1
		}
		var b = new AJS.fx.Style(g, "opacity", a);
		return b.custom(a.from, a.to)
	},
	fadeOut: function(b, a) {
		a = a || {};
		if (!a.from) {
			a.from = 1
		}
		if (!a.to) {
			a.to = 0
		}
		a.duration = 300;
		var g = new AJS.fx.Style(b, "opacity", a);
		return g.custom(a.from, a.to)
	},
	setWidth: function(b, a) {
		var g = new AJS.fx.Style(b, "width", a);
		return g.custom(a.from, a.to)
	},
	setHeight: function(b, a) {
		var g = new AJS.fx.Style(b, "height", a);
		return g.custom(a.from, a.to)
	}
};
AJS.fx.Base = new AJS.Class({
	init: function(a) {
		this.options = {
			onStart: function() {},
			onComplete: function() {},
			transition: AJS.fx.Transitions.sineInOut,
			duration: 500,
			wait: true,
			fps: 50
		};
		AJS.update(this.options, a);
		AJS.bindMethods(this)
	},
	setOptions: function(a) {
		AJS.update(this.options, a)
	},
	step: function() {
		var a = new Date().getTime();
		if (a < this.time + this.options.duration) {
			this.cTime = a - this.time;
			this.setNow()
		} else {
			setTimeout(AJS.$b(this.options.onComplete, this, [this.elm]), 10);
			this.clearTimer();
			this.now = this.to
		}
		this.increase()
	},
	setNow: function() {
		this.now = this.compute(this.from, this.to)
	},
	compute: function(b, g) {
		var a = g - b;
		return this.options.transition(this.cTime, b, a, this.options.duration)
	},
	clearTimer: function() {
		clearInterval(this.timer);
		this.timer = null;
		return this
	},
	_start: function(a, b) {
		if (!this.options.wait) {
			this.clearTimer()
		}
		if (this.timer) {
			return
		}
		setTimeout(AJS.$p(this.options.onStart, this.elm), 10);
		this.from = a;
		this.to = b;
		this.time = new Date().getTime();
		this.timer = setInterval(this.step, Math.round(1000 / this.options.fps));
		return this
	},
	custom: function(a, b) {
		return this._start(a, b)
	},
	set: function(a) {
		this.now = a;
		this.increase();
		return this
	},
	setStyle: function(g, a, b) {
		if (this.property == "opacity") {
			AJS.setOpacity(g, b)
		} else {
			AJS.setStyle(g, a, b)
		}
	}
});
AJS.fx.Style = AJS.fx.Base.extend({
	init: function(g, a, b) {
		this.parent();
		this.elm = g;
		this.setOptions(b);
		this.property = a
	},
	increase: function() {
		this.setStyle(this.elm, this.property, this.now)
	}
});
AJS.fx.Styles = AJS.fx.Base.extend({
	init: function(b, a) {
		this.parent();
		this.elm = AJS.$(b);
		this.setOptions(a);
		this.now = {}
	},
	setNow: function() {
		for (p in this.from) {
			this.now[p] = this.compute(this.from[p], this.to[p])
		}
	},
	custom: function(b) {
		if (this.timer && this.options.wait) {
			return
		}
		var a = {};
		var g = {};
		for (p in b) {
			a[p] = b[p][0];
			g[p] = b[p][1]
		}
		return this._start(a, g)
	},
	increase: function() {
		for (var a in this.now) {
			this.setStyle(this.elm, a, this.now[a])
		}
	}
});
AJS.fx.Transitions = {
	linear: function(g, a, o, m) {
		return o * g / m + a
	},
	sineInOut: function(g, a, o, m) {
		return - o / 2 * (Math.cos(Math.PI * g / m) - 1) + a
	}
};
script_loaded = true;
script_loaded = true;
var GB_CURRENT = null;
var GB_ORIGIN = null;
var path = null;
GB_hide = function(a) {
	if (path.match("close")) {
		var b = galleryPageURL + "?fromcde=true";
		var g = Get_Cookie("pspspassport");
		if (g != null) {
			b = b + "&pspspassport=" + g
		}
		if (Get_Cookie("logoutuser") != null) {
			b = b + "&logoutuser=1"
		}
		window.location.href = b
	} else {
		if (path.match("gotohome")) {
			GB_ORIGIN = null;
			GB_CURRENT.hide(a)
		} else {
			GB_ORIGIN = null;
			GB_CURRENT.hide(a)
		}
	}
};
GreyBox = new AJS.Class({
	init: function(g) {
		this.use_fx = AJS.fx;
		this.type = "page";
		this.overlay_click_close = false;
		this.salt = 0;
		this.root_dir = GB_ROOT_DIR;
		this.callback_fns = [];
		this.reload_on_close = false;
		this.src_loader = GB_ROOT_DIR + "../loader_frame.html";
		var b = window.location.hostname.indexOf("www");
		var a = this.src_loader.indexOf("www");
		if (b != -1 && a == -1) {
			this.src_loader = this.src_loader.replace("://", "://www.")
		}
		if (b == -1 && a != -1) {
			this.src_loader = this.src_loader.replace("://www.", "://")
		}
		this.show_loading = true;
		AJS.update(this, g)
	},
	addCallback: function(a) {
		if (a) {
			this.callback_fns.push(a)
		}
	},
	show: function(b) {
		GB_CURRENT = this;
		this.url = b;
		var a = [AJS.$bytc("object"), AJS.$bytc("select")];
		AJS.map(AJS.flattenList(a),
		function(g) {
			g.style.visibility = "hidden"
		});
		this.createElements();
		return false
	},
	hide: function(a, b) {
		var g = this;
		AJS.callLater(function() {
			var q = g.callback_fns;
			if (q != []) {
				AJS.map(q,
				function(r) {
					r(b)
				})
			}
			g.onHide();
			if (g.use_fx) {
				var o = g.overlay;
				AJS.fx.fadeOut(g.overlay, {
					onComplete: function() {
						AJS.removeElement(o);
						o = null
					},
					duration: 300
				});
				AJS.removeElement(g.g_window)
			} else {
				AJS.removeElement(g.g_window, g.overlay)
			}
			g.removeFrame();
			AJS.REV(window, "scroll", _GB_setOverlayDimension);
			AJS.REV(window, "resize", _GB_update);
			var m = [AJS.$bytc("object"), AJS.$bytc("select")];
			AJS.map(AJS.flattenList(m),
			function(r) {
				r.style.visibility = "visible"
			});
			if (g.reload_on_close) {
				window.location.reload()
			}
			if (AJS.isFunction(a)) {
				a(b)
			}
		},
		10)
	},
	update: function() {
		this.setOverlayDimension();
		this.setFrameSize();
		this.setWindowPosition()
	},
	createElements: function() {
		this.initOverlay();
		this.g_window = AJS.DIV({
			id: "GB_window"
		});
		AJS.hideElement(this.g_window);
		AJS.getBody().insertBefore(this.g_window, this.overlay.nextSibling);
		this.initFrame();
		this.initHook();
		this.update();
		var a = this;
		if (this.use_fx) {
			AJS.fx.fadeIn(this.overlay, {
				duration: 300,
				to: 0.5,
				onComplete: function() {
					a.onShow();
					AJS.showElement(a.g_window);
					a.startLoading()
				}
			})
		} else {
			AJS.setOpacity(this.overlay, 0.5);
			AJS.showElement(this.g_window);
			this.onShow();
			this.startLoading()
		}
		AJS.AEV(window, "scroll", _GB_setOverlayDimension);
		AJS.AEV(window, "resize", _GB_update)
	},
	removeFrame: function() {
		try {
			AJS.removeElement(this.iframe)
		} catch(a) {}
		this.iframe = null
	},
	startLoading: function() {
		this.iframe.src = this.src_loader + "?s=" + this.salt++;
		AJS.showElement(this.iframe)
	},
	setOverlayDimension: function() {
		var b = AJS.getWindowSize();
		if (AJS.isMozilla() || AJS.isOpera()) {
			AJS.setWidth(this.overlay, "100%")
		} else {
			AJS.setWidth(this.overlay, b.w)
		}
		var a = Math.max(AJS.getScrollTop() + b.h, AJS.getScrollTop() + this.height);
		if (a < AJS.getScrollTop()) {
			AJS.setHeight(this.overlay, a)
		} else {
			AJS.setHeight(this.overlay, AJS.getScrollTop() + b.h)
		}
	},
	initOverlay: function() {
		this.overlay = AJS.DIV({
			id: "GB_overlay"
		});
		if (this.overlay_click_close) {
			AJS.AEV(this.overlay, "click", GB_hide)
		}
		AJS.setOpacity(this.overlay, 0);
		AJS.getBody().insertBefore(this.overlay, AJS.getBody().firstChild)
	},
	initFrame: function() {
		if (!this.iframe) {
			var a = {
				name: "GB_frame",
				"class": "GB_frame",
				frameBorder: 0
			};
			if (AJS.isIe()) {
				a.src = 'javascript:false;document.write("");'
			}
			this.iframe = AJS.IFRAME(a);
			this.middle_cnt = AJS.DIV({
				"class": "content"
			},
			this.iframe);
			this.top_cnt = AJS.DIV();
			this.bottom_cnt = AJS.DIV();
			AJS.ACN(this.g_window, this.top_cnt, this.middle_cnt, this.bottom_cnt)
		}
	},
	onHide: function() {},
	onShow: function() {},
	setFrameSize: function() {},
	setWindowPosition: function() {},
	initHook: function() {}
});
_GB_update = function() {
	if (GB_CURRENT) {
		GB_CURRENT.update()
	}
};
_GB_setOverlayDimension = function() {
	if (GB_CURRENT) {
		GB_CURRENT.setOverlayDimension()
	}
};
script_loaded = true;
var GB_SETS = {};
function decoGreyboxLinks() {
	var a = AJS.$bytc("a");
	AJS.map(a,
	function(m) {
		if (m.getAttribute("href") && m.getAttribute("rel")) {
			var b = m.getAttribute("rel");
			if (b.indexOf("gb_") == 0) {
				var q = b.match(/\w+/)[0];
				var o = b.match(/\[(.*)\]/)[1];
				var g = 0;
				var r = {
					caption: m.title || "",
					url: m.href
				};
				if (q == "gb_pageset" || q == "gb_imageset") {
					if (!GB_SETS[o]) {
						GB_SETS[o] = []
					}
					GB_SETS[o].push(r);
					g = GB_SETS[o].length
				}
				if (q == "gb_pageset") {
					m.onclick = function() {
						GB_showFullScreenSet(GB_SETS[o], g);
						return false
					}
				}
				if (q == "gb_imageset") {
					m.onclick = function() {
						GB_showImageSet(GB_SETS[o], g);
						return false
					}
				}
				if (q == "gb_image") {
					m.onclick = function() {
						GB_showImage(r.caption, r.url);
						return false
					}
				}
				if (q == "gb_page") {
					m.onclick = function() {
						var u = o.split(/, ?/);
						GB_showCenter(r.caption, r.url, parseInt(u[1]), parseInt(u[0]));
						return false
					}
				}
				if (q == "gb_page_fs") {
					m.onclick = function() {
						GB_showFullScreen(r.caption, r.url);
						return false
					}
				}
				if (q == "gb_page_center") {
					m.onclick = function() {
						var u = o.split(/, ?/);
						GB_showCenter1(r.caption, r.url, parseInt(u[1]), parseInt(u[0]));
						return false
					}
				}
				if (q == "gb_page_center") {
					m.onclick = function() {
						var u = o.split(/, ?/);
						GB_showCenter(r.caption, r.url, parseInt(u[1]), parseInt(u[0]));
						return false
					}
				}
			}
		}
	})
}
AJS.AEV(window, "load", decoGreyboxLinks);
GB_showImage = function(g, m, a) {
	var b = {
		width: 300,
		height: 300,
		type: "image",
		fullscreen: false,
		center_win: true,
		caption: g,
		callback_fn: a
	};
	var o = new GB_Gallery(b);
	return o.show(m)
};
GB_showPage = function(o, a, m) {
	var b = {
		type: "page",
		caption: o,
		callback_fn: m,
		fullscreen: true,
		center_win: false
	};
	var g = new GB_Gallery(b);
	return g.show(a)
};
GB_Gallery = GreyBox.extend({
	init: function(a) {
		this.parent({});
		this.img_close = this.root_dir + "w_close.gif";
		AJS.update(this, a);
		this.addCallback(this.callback_fn)
	},
	initHook: function() {
		AJS.addClass(this.g_window, "GB_Gallery");
		var m = AJS.DIV({
			"class": "inner"
		});
		this.header = AJS.DIV({
			"class": "GB_header"
		},
		m);
		AJS.setOpacity(this.header, 0);
		AJS.getBody().insertBefore(this.header, this.overlay.nextSibling);
		var b = AJS.TD({
			id: "GB_caption",
			"class": "caption",
			width: "40%"
		},
		this.caption);
		var r = AJS.TD({
			id: "GB_middle",
			"class": "middle",
			width: "20%"
		});
		var q = AJS.IMG({
			src: this.img_close
		});
		AJS.AEV(q, "click", GB_hide);
		var o = AJS.TD({
			"class": "close",
			width: "40%"
		},
		q);
		var g = AJS.TBODY(AJS.TR(b, r, o));
		var a = AJS.TABLE({
			cellspacing: "0",
			cellpadding: 0,
			border: 0
		},
		g);
		AJS.ACN(m, a);
		if (this.fullscreen) {
			AJS.AEV(window, "scroll", AJS.$b(this.setWindowPosition, this))
		} else {
			AJS.AEV(window, "scroll", AJS.$b(this._setHeaderPos, this))
		}
	},
	setFrameSize: function() {
		var a = this.overlay.offsetWidth;
		var b = AJS.getWindowSize();
		if (this.fullscreen) {
			this.width = a - 40;
			this.height = b.h - 80
		}
		AJS.setWidth(this.iframe, this.width);
		AJS.setHeight(this.iframe, this.height);
		AJS.setWidth(this.header, a)
	},
	_setHeaderPos: function() {
		AJS.setTop(this.header, AJS.getScrollTop() + 10)
	},
	setWindowPosition: function() {
		var g = this.overlay.offsetWidth;
		var b = AJS.getWindowSize();
		AJS.setLeft(this.g_window, ((g - 50 - this.width) / 2));
		var a = AJS.getScrollTop() + 55;
		if (!this.center_win) {
			AJS.setTop(this.g_window, a)
		} else {
			var m = ((b.h - this.height) / 2) + 20 + AJS.getScrollTop();
			if (m < 0) {
				m = 0
			}
			if (a > m) {
				m = a
			}
			AJS.setTop(this.g_window, m)
		}
		this._setHeaderPos()
	},
	onHide: function() {
		AJS.removeElement(this.header);
		AJS.removeClass(this.g_window, "GB_Gallery")
	},
	onShow: function() {
		if (this.use_fx) {
			AJS.fx.fadeIn(this.header, {
				to: 1
			})
		} else {
			AJS.setOpacity(this.header, 1)
		}
	}
});
AJS.preloadImages(GB_ROOT_DIR + "w_close.gif");
GB_showFullScreenSet = function(o, m, g) {
	var b = {
		type: "page",
		fullscreen: false,
		center_win: true
	};
	var a = new GB_Sets(b, o);
	a.addCallback(g);
	a.showSet(m - 1);
	return false
};
GB_showImageSet = function(o, m, g) {
	var b = {
		type: "page",
		fullscreen: false,
		center_win: true,
		width: 500,
		height: 500
	};
	var a = new GB_Sets(b, o);
	a.addCallback(g);
	a.showSet(m - 1);
	return false
};
GB_Sets = GB_Gallery.extend({
	init: function(a, b) {
		this.parent(a);
		if (!this.img_next) {
			this.img_next = this.root_dir + "next.gif"
		}
		if (!this.img_prev) {
			this.img_prev = this.root_dir + "prev.gif"
		}
		this.current_set = b
	},
	showSet: function(b) {
		this.current_index = b;
		var a = this.current_set[this.current_index];
		this.show(a.url);
		this._setCaption(a.caption);
		this.btn_prev = AJS.IMG({
			"class": "left",
			src: this.img_prev
		});
		this.btn_next = AJS.IMG({
			"class": "right",
			src: this.img_next
		});
		AJS.AEV(this.btn_prev, "click", AJS.$b(this.switchPrev, this));
		AJS.AEV(this.btn_next, "click", AJS.$b(this.switchNext, this));
		GB_STATUS = AJS.SPAN({
			"class": "GB_navStatus"
		});
		AJS.ACN(AJS.$("GB_middle"), this.btn_prev, GB_STATUS, this.btn_next);
		this.updateStatus()
	},
	updateStatus: function() {
		AJS.setHTML(GB_STATUS, (this.current_index + 1) + " / " + this.current_set.length);
		if (this.current_index == 0) {
			AJS.addClass(this.btn_prev, "disabled")
		} else {
			AJS.removeClass(this.btn_prev, "disabled")
		}
		if (this.current_index == this.current_set.length - 1) {
			AJS.addClass(this.btn_next, "disabled")
		} else {
			AJS.removeClass(this.btn_next, "disabled")
		}
	},
	_setCaption: function(a) {
		AJS.setHTML(AJS.$("GB_caption"), a)
	},
	updateFrame: function() {
		var a = this.current_set[this.current_index];
		this._setCaption(a.caption);
		this.url = a.url;
		this.startLoading()
	},
	switchPrev: function() {
		if (this.current_index != 0) {
			this.current_index--;
			this.updateFrame();
			this.updateStatus()
		}
	},
	switchNext: function() {
		if (this.current_index != this.current_set.length - 1) {
			this.current_index++;
			this.updateFrame();
			this.updateStatus()
		}
	}
});
AJS.AEV(window, "load",
function() {
	AJS.preloadImages(GB_ROOT_DIR + "next.gif", GB_ROOT_DIR + "prev.gif")
});
GB_show = function(b, g, r, q, m) {
	var a = {
		caption: b,
		height: r || 500,
		width: q || 500,
		fullscreen: false,
		callback_fn: m
	};
	var o = new GB_Window(a);
	return o.show(g)
};
GB_showCenter = function(r, a, o, g, m) {
	if (!g) {
		GB_showCenter_from_dot_net(r, a, o, g, m);
		return
	}
	var b = {
		caption: r,
		center_win: true,
		height: o || 500,
		width: g || 500,
		fullscreen: false,
		callback_fn: m
	};
	var q = new GB_Window(b);
	path = a;
	return q.show(a)
};
GB_showCenter_from_dot_net = function(r, a, o, g, m) {
	if (r.toLowerCase() == "login") {
		if (Get_Cookie("Gallery") == "psprintfordeluxe" && Get_Cookie("galleryprivate") == "true") {
			var b = {
				caption: r,
				center_win: true,
				height: 240,
				width: 350,
				fullscreen: false,
				callback_fn: m
			}
		} else {
			if (Get_Cookie("Gallery") == "wbmason") {
				var b = {
					caption: r,
					center_win: true,
					height: 712 || 740,
					width: 882 || 900,
					fullscreen: false,
					callback_fn: m
				}
			} else {
				if (Get_Cookie("Gallery") == "safeguard" || Get_Cookie("Gallery") == "psprintfordeluxe") {
					var b = {
						caption: r,
						center_win: true,
						height: 350 || 750,
						width: 320 || 900,
						fullscreen: false,
						callback_fn: m
					}
				} else {
					var b = {
						caption: r,
						center_win: true,
						height: 555 || 670,
						width: 820 || 865,
						fullscreen: false,
						callback_fn: m
					}
				}
			}
		}
	} else {
		var b = {
			caption: r,
			center_win: true,
			height: o || 500,
			width: g || 500,
			fullscreen: false,
			callback_fn: m
		}
	}
	var q = new GB_Window(b);
	path = a;
	return q.show(a)
};
GB_showStyle = function(a) {
	a.style.border = "dotted 2px #64afc4"
};
GB_showCenterr = function(r, a, o, g, m) {
	var b = {
		caption: r,
		center_win: true,
		height: o || 500,
		width: g || 500,
		fullscreen: false,
		callback_fn: m
	};
	var q = new GB_Window1(b);
	return q.show(a)
};
GB_Window1 = GreyBox.extend({
	init: function(a) {
		this.parent({});
		this.img_header = this.root_dir + "header_bg.jpg";
		this.img_close = this.root_dir + "w_close.gif";
		this.show_close_img = true;
		AJS.update(this, a);
		this.addCallback(this.callback_fn)
	},
	initHook: function() {
		AJS.addClass(this.g_window, "GB_Window1");
		this.header = AJS.TABLE({
			"class": "header"
		});
		this.header.style.backgroundImage = "url(" + this.img_header + ")";
		var m = AJS.TD({
			id: "GB_caption_title",
			"class": "caption"
		},
		this.caption);
		var b = AJS.TD({
			"class": "close"
		});
		if (this.show_close_img) {
			var a = AJS.IMG({
				src: this.img_close
			});
			var g = AJS.DIV(a);
			AJS.AEV([a], "mouseover",
			function() {
				AJS.addClass(a, "on")
			});
			AJS.AEV([a], "mouseout",
			function() {
				AJS.removeClass(a, "on")
			});
			AJS.AEV([a], "mousedown",
			function() {
				AJS.addClass(a, "click")
			});
			AJS.AEV([a], "mouseup",
			function() {
				AJS.removeClass(a, "click")
			});
			AJS.AEV([a], "click", GB_hide);
			AJS.ACN(b, g)
		}
		tbody_header = AJS.TBODY();
		AJS.ACN(tbody_header, AJS.TR(m, b));
		AJS.ACN(this.top_cnt, this.header);
		if (this.fullscreen) {
			AJS.AEV(window, "scroll", AJS.$b(this.setWindowPosition, this))
		}
	},
	setFrameSize: function() {
		if (this.fullscreen) {
			var a = AJS.getWindowSize();
			overlay_h = a.h;
			this.width = Math.round(this.overlay.offsetWidth - (this.overlay.offsetWidth / 100) * 10);
			this.height = Math.round(overlay_h - (overlay_h / 100) * 10)
		}
		AJS.setWidth(this.header, this.width + 6);
		AJS.setWidth(this.iframe, this.width);
		AJS.setHeight(this.iframe, this.height)
	},
	setWindowPosition: function() {
		var b = AJS.getWindowSize();
		AJS.setLeft(this.g_window, ((b.w - this.width) / 2) - 13);
		if (!this.center_win) {
			AJS.setTop(this.g_window, AJS.getScrollTop())
		} else {
			var a = ((b.h - this.height) / 2) - 20 + AJS.getScrollTop();
			if (a < 0) {
				a = 0
			}
			AJS.setTop(this.g_window, a)
		}
	}
});
GB_showFullScreen = function(m, g, b) {
	var a = {
		caption: m,
		fullscreen: true,
		callback_fn: b
	};
	var o = new GB_Window(a);
	return o.show(g)
};
GB_Window = GreyBox.extend({
	init: function(a) {
		this.parent({});
		this.img_header = this.root_dir + "header_bg.jpg";
		this.img_close = this.root_dir + "w_close.gif";
		this.show_close_img = true;
		AJS.update(this, a);
		this.addCallback(this.callback_fn)
	},
	initHook: function() {
		AJS.addClass(this.g_window, "GB_Window");
		this.header = AJS.TABLE({
			"class": "header"
		});
		this.header.style.backgroundImage = "url(" + this.img_header + ")";
		var m = AJS.TD({
			id: "GB_caption_title",
			"class": "caption"
		},
		this.caption);
		var b = AJS.TD({
			"class": "close"
		});
		if (this.show_close_img) {
			var a = AJS.IMG({
				src: this.img_close
			});
			var g = AJS.DIV(a);
			AJS.AEV([a], "mouseover",
			function() {
				AJS.addClass(a, "on")
			});
			AJS.AEV([a], "mouseout",
			function() {
				AJS.removeClass(a, "on")
			});
			AJS.AEV([a], "mousedown",
			function() {
				AJS.addClass(a, "click")
			});
			AJS.AEV([a], "mouseup",
			function() {
				AJS.removeClass(a, "click")
			});
			AJS.AEV([a], "click", GB_hide);
			AJS.ACN(b, g)
		}
		tbody_header = AJS.TBODY();
		AJS.ACN(tbody_header, AJS.TR(m, b));
		AJS.ACN(this.header, tbody_header);
		AJS.ACN(this.top_cnt, this.header);
		if (this.fullscreen) {
			AJS.AEV(window, "scroll", AJS.$b(this.setWindowPosition, this))
		}
	},
	setFrameSize: function() {
		if (this.fullscreen) {
			var a = AJS.getWindowSize();
			overlay_h = a.h;
			this.width = Math.round(this.overlay.offsetWidth - (this.overlay.offsetWidth / 100) * 10);
			this.height = Math.round(overlay_h - (overlay_h / 100) * 10)
		}
		AJS.setWidth(this.header, this.width + 6);
		AJS.setWidth(this.iframe, this.width);
		AJS.setHeight(this.iframe, this.height)
	},
	setWindowPosition: function() {
		var b = AJS.getWindowSize();
		AJS.setLeft(this.g_window, ((b.w - this.width) / 2) - 13);
		if (!this.center_win) {
			AJS.setTop(this.g_window, AJS.getScrollTop())
		} else {
			var a = ((b.h - this.height) / 2) - 20 + AJS.getScrollTop();
			if (a < 0) {
				a = 0
			}
			AJS.setTop(this.g_window, a)
		}
	}
});
GB_Window_NewLook = GreyBox.extend({
	init: function(a) {
		this.parent({});
		this.img_close = this.root_dir + "w_close.png";
		this.show_close_img = true;
		AJS.update(this, a);
		this.addCallback(this.callback_fn)
	},
	initHook: function() {
		AJS.addClass(this.g_window, "New_GB_Window");
		this.header = AJS.TABLE({
			"class": "header"
		});
		this.header.style.backgroundColor = "#369ED0";
		var m = AJS.TD({
			id: "GB_caption_title",
			"class": "caption"
		},
		this.caption);
		var b = AJS.TD({
			"class": "close"
		});
		if (this.show_close_img) {
			var a = AJS.IMG({
				src: this.img_close
			});
			var g = AJS.DIV(a);
			AJS.AEV([a], "mouseover",
			function() {
				AJS.addClass(a, "on")
			});
			AJS.AEV([a], "mouseout",
			function() {
				AJS.removeClass(a, "on")
			});
			AJS.AEV([a], "mousedown",
			function() {
				AJS.addClass(a, "click")
			});
			AJS.AEV([a], "mouseup",
			function() {
				AJS.removeClass(a, "click")
			});
			AJS.AEV([a], "click", GB_hide);
			AJS.ACN(b, g)
		}
		tbody_header = AJS.TBODY();
		AJS.ACN(tbody_header, AJS.TR(m, b));
		AJS.ACN(this.header, tbody_header);
		AJS.ACN(this.top_cnt, this.header);
		if (this.fullscreen) {
			AJS.AEV(window, "scroll", AJS.$b(this.setWindowPosition, this))
		}
	},
	setFrameSize: function() {
		if (this.fullscreen) {
			var a = AJS.getWindowSize();
			overlay_h = a.h;
			this.width = Math.round(this.overlay.offsetWidth - (this.overlay.offsetWidth / 100) * 10);
			this.height = Math.round(overlay_h - (overlay_h / 100) * 10)
		}
		AJS.setWidth(this.header, this.width + 6);
		AJS.setWidth(this.iframe, this.width);
		AJS.setHeight(this.iframe, this.height)
	},
	setWindowPosition: function() {
		var b = AJS.getWindowSize();
		AJS.setLeft(this.g_window, ((b.w - this.width) / 2) - 13);
		if (!this.center_win) {
			AJS.setTop(this.g_window, AJS.getScrollTop())
		} else {
			var a = ((b.h - this.height) / 2) - 20 + AJS.getScrollTop();
			if (a < 0) {
				a = 0
			}
			AJS.setTop(this.g_window, a)
		}
	}
});
GB_showCenter_newLook = function(b, m, a, o, r) {
	var g = {
		caption: b,
		center_win: true,
		height: a || 500,
		width: o || 500,
		fullscreen: false,
		callback_fn: r
	};
	var q = new GB_Window_NewLook(g);
	path = m;
	return q.show(m)
};
AJS.preloadImages(GB_ROOT_DIR + "w_close.gif", GB_ROOT_DIR + "header_bg.jpg", GB_ROOT_DIR + "w_close.png");
script_loaded = true;
var email = null;
var Category1 = null;
var LoggedUser = "Guest";
var store = "My Jobs";
var creatorEmail = null;
var Level = null;
var Category = null;
var customerID = null;
var CCustomerID = null;
var productGroupName = "";
var brand = null;
var cde_Flag = "N";
var downloadPDF = null;
var pspspassport = null;
function htmlEncode(a) {
	if (a == undefined) {
		return false
	} else {
		return a.toString().replace(/\&/ig, "&amp;").replace(/\</ig, "&lt;").replace(/\>/ig, "&gt;").replace(/\"/ig, "&quot;")
	}
}
function htmlDecode(a) {
	return a.toString().replace(/\&amp\;/ig, "&").replace(/\&lt\;/ig, "<").replace(/\&gt\;/ig, ">").replace(/\&quot\;/ig, '"')
}
function trim(b) {
	if (b == null) {
		return ""
	}
	var a = ltrim(b);
	return rtrim(a)
}
function ltrim(a) {
	while (1) {
		if (a.toString().substring(0, 1) != " ") {
			break
		}
		a = a.toString().substring(1, a.length)
	}
	return a
}
function rtrim(a) {
	while (1) {
		if (a.toString().substring(a.length - 1, a.length) != " ") {
			break
		}
		a = a.toString().substring(0, a.length - 1)
	}
	return a
}
function replaceLFByBR(m) {
	if (m != null) {
		m = m.replace(/\n/ig, "<BR/>");
		m = m.replace(/\r/ig, "");
		var o = null;
		var a = "";
		for (var g = 0; g < m.length; g++) {
			var b = m.charAt(g);
			if (o == " " && b == " ") {
				a += "&nbsp;"
			} else {
				a += b
			}
			o = b
		}
		m = a
	}
	return m
}
function removeLFCR(a) {
	if (a != null) {
		a = a.replace(/\n/ig, "");
		a = a.replace(/\r/ig, "")
	}
	return a
}
function replaceSpace(a) {
	if (a != null) {
		a = a.replace(/ /ig, "&nbsp;")
	}
	return a
}
function replaceSpace2(o) {
	var a = new Array();
	if (o != null) {
		var q = null;
		var b = "";
		for (var m = 0; m < o.length; m++) {
			var g = o.charAt(m);
			if (q == " " && g == " ") {
				b += "&nbsp;"
			} else {
				if (g == " ") {
					if (b.length > 0) {
						b += " ";
						a.push(b);
						b = ""
					} else {
						b = "&nbsp;"
					}
				} else {
					b += g
				}
			}
			q = g
		}
		if (b.length > 0) {
			a.push(b)
		}
	}
	return a
}
function replacenbsp(a) {
	if (a != null) {
		a = a.replace(/&nbsp;/ig, "")
	}
	return a
}
function removeCR(a) {
	if (a != null) {
		a = a.replace(/\r/ig, "")
	}
	return a
}
function removeLF(a) {
	if (a != null) {
		a = a.replace(/\n/ig, "")
	}
	return a
}
function removeSplCharsFromFont(a) {
	return a.toString().replace(/\'/ig, "").replace(/`/ig, "").replace(/\"/ig, "")
}
function normalizeColor(a) {
	a = trim(a);
	if (a == "") {
		return null
	}
	if (a == "#transparent") {
		return "transparent"
	}
	if (a.indexOf("#") >= 0) {
		return a
	}
	a = a.toLowerCase();
	if (a.indexOf("rgb") >= 0) {
		return a
	}
	return (a == "transparent" ? a: "#" + a)
}
function queryString(m) {
	var g = location.search.substring(1, location.search.length);
	var b = false;
	var a = g.split("&");
	for (i = 0; i < a.length; i++) {
		param_name = a[i].substring(0, a[i].indexOf("="));
		if (param_name == m) {
			b = a[i].substring(a[i].indexOf("=") + 1)
		}
	}
	if (b) {
		return b
	} else {
		return false
	}
}
var good;
function checkEmailAddress(b) {
	var a = b.match(/\b(^(\S+@).+((\.com)|(\.net)|(\.edu)|(\.mil)|(\.gov)|(\.org)|(\.info)|(\.sex)|(\.biz)|(\.aero)|(\.coop)|(\.museum)|(\.name)|(\.pro)|(\..{2,2}))$)\b/gi);
	if (a) {
		good = true
	} else {
		alert("Please enter a valid email address.");
		if (document.eMailer && document.eMailer.email) {
			document.eMailer.email.focus();
			document.eMailer.email.select()
		}
		good = false
	}
}
function setCaretPosition(m, b) {
	var g = document.getElementById(m);
	if (g != null) {
		if (g.createTextRange) {
			var a = g.createTextRange();
			a.move("character", b);
			a.select()
		} else {
			if (g.selectionStart) {
				g.focus();
				g.setSelectionRange(b, b)
			} else {
				g.focus()
			}
		}
	}
}
function onlyNumbers(b) {
	var a;
	if (window.event) {
		a = window.event.keyCode
	} else {
		if (b) {
			a = b.which
		}
	}
	if (a > 31 && (a < 48 || a > 57)) {
		return false
	}
}
function numberPercent() {
	var a = document.getElementById("MarkupPricing").value;
	if (a < 1 || a > 100) {
		document.getElementById("MarkupPricing").value = a.substring(0, a.length - 1)
	}
}
function fncIsValidColor(b) {
	var a = /^#?(([a-fA-F0-9]){3}){1,2}$/i;
	return a.test(b)
}
function setSelectValue(b, a) {
	if (a == null) {
		a = ""
	}
	a = trim(a).toLowerCase();
	for (i = 0; i < b.options.length; i++) {
		if (trim(b.options[i].value.toLowerCase()) == a) {
			b.selectedIndex = i;
			return
		}
	}
	b.selectedIndex = 0
}
function ReloadWindow() {
	location.replace(location.href);
	if (window.event) {
		window.event.cancelBubble = true
	}
	return false
}
function clientSideInclude(o, a) {
	var g = false;
	if (window.XMLHttpRequest) {
		try {
			g = new XMLHttpRequest()
		} catch(m) {
			g = false
		}
	} else {
		if (window.ActiveXObject) {
			try {
				g = new ActiveXObject("Msxml2.XMLHTTP")
			} catch(m) {
				try {
					g = new ActiveXObject("Microsoft.XMLHTTP")
				} catch(m) {
					g = false
				}
			}
		}
	}
	var b = document.getElementById(o);
	if (!b) {
		return
	}
	if (g) {
		g.open("GET", a, false);
		g.send(null);
		b.innerHTML = g.responseText
	}
}
function loadObject(o, a) {
	var g = false;
	if (window.XMLHttpRequest) {
		try {
			g = new XMLHttpRequest()
		} catch(m) {
			g = false
		}
	} else {
		if (window.ActiveXObject) {
			try {
				g = new ActiveXObject("Msxml2.XMLHTTP")
			} catch(m) {
				try {
					g = new ActiveXObject("Microsoft.XMLHTTP")
				} catch(m) {
					g = false
				}
			}
		}
	}
	var b = document.getElementById(o);
	if (!b) {
		return
	}
	if (g) {
		g.open("GET", a, false);
		g.send(null);
		b.innerHTML = g.responseText
	}
}
function showObject(a) {
	Element.show(a)
}
function hideObject(a) {
	Element.hide(a)
}
function getQuerystring(b, m) {
	if (m == null) {
		m = ""
	}
	b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var g = new RegExp("[\\?&]" + b + "=([^&#]*)");
	var a = g.exec(window.location.href);
	if (a == null) {
		return m
	} else {
		return a[1]
	}
}
var GENERAL_ERROR = {
	subject: "Error",
	width: 300,
	height: 100
};
var GUIDE_CHECK_REQUIRED = {
	text: "Please review the following Checklist items, and click the corresponding Checkbox to continue:<P>",
	subject: "Review Checklist",
	width: 400,
	height: 200
};
var ANNOTATION_SUBJECT_REQUIRED = {
	text: "A subject is required to add a note. Please enter a subject and try again.",
	subject: "Subject Required",
	width: 400,
	height: 120
};
var ANNOTATION_SAVE = {
	text: "Your note has been added.",
	subject: "Note Added",
	width: 400,
	height: 100
};
var ANNOTATION_ERROR = {
	text: "An error has occurred, and we were unable to save your note. We are working to correct the problem.",
	subject: "Error",
	width: 400,
	height: 100
};
var ANNOTATION_CONNECTION_ERROR = {
	text: "A connection problem has occurred, and we were unable to save your note. Please try again.",
	subject: "Error",
	width: 400,
	height: 100
};
var REQUEST_TIMEOUT = {
	text: "Timeout error. Your request could not be completed.<br>URL: [RequestedURL]",
	subject: "Error",
	width: 400,
	height: 100
};
var DATAFILE_NOT_ADDED = {
	text: "No datafile was found for this side of your design. You must first Add Mail List.",
	subject: "Error",
	width: 400,
	height: 100
};
var OBJECT_LOCKED = {
	text: "The object you selected is locked, please unlock it before performing '[ActionPerformed]'.",
	subject: "Object Locked",
	width: 400,
	height: 100
};
var LOGIN_TO_CONTINUE = {
	text: "Please login to continue.",
	subject: "Login Required",
	width: 400,
	height: 100
};
var DESIGN_NAME_REQUIRED = {
	text: "Design name cannot be blank. Please enter a name to continue.",
	subject: "Name Required",
	width: 400,
	height: 100
};
var LOGIN_TO_PUBLISH = {
	text: "Please login to save design to store.",
	subject: "Login Required",
	width: 400,
	height: 100
};
var DESIGN_NAME_EXISTS = {
	text: "Design name exists, Please enter some other name to continue.",
	subject: "Name Exists",
	width: 400,
	height: 100
};
var CROP_IMAGE_SAVE = {
	text: "Updating image...",
	subject: "Crop",
	width: 400,
	height: 100
};
var ANNOTATION_LABEL_ERROR = {
	text: "Note subject is duplicate, please change it so as to identify properly.",
	subject: "Duplicate Subject",
	width: 400,
	height: 100
};
var TAG_REQUIRED = {
	text: "A tag value is required. Please enter a tag value and try again.",
	subject: "Tag Required",
	width: 400,
	height: 120
};
var TAG_DUPLICATE = {
	text: "Duplicate tag. Please enter a unique tag value and try again.",
	subject: "Duplicate Tag",
	width: 400,
	height: 120
};
var _textAreaDefaultTitle = "Double click to edit text";
var TEXT_TO_IMAGE_INIT = {
	text: "Initializing template, please wait.",
	subject: "Text to Image",
	width: 300,
	height: 100
};
var WORKFLOW_NOTIFICATION_REVIEW = {
	text: "Please review and approve online proof before ordering.",
	subject: "Warning",
	width: 300,
	height: 100
};
var DESIGN_NOT_CHANGE = {
	text: "Original template has not been changed.",
	subject: "Message",
	width: 300,
	height: 100
};
var p_value;
var t1 = null;
var t2 = null;
function handleEvent(a) {
	if (a.keyCode == 13) {
		openSearch();
		if (String(designer.artwork.currentStation) == "gettingStarted") {
			tracker = "/" + location.host + "/Design Landing/Feedback"
		} else {
			if (String(designer.artwork.currentStation) == "position") {
				tracker = "/" + location.host + "/Customization/Feedback"
			} else {
				if (String(designer.artwork.currentStation) == "finalReview") {
					tracker = "/" + location.host + "/Customization - Final Review/Feedback"
				} else {
					if (String(designer.artwork.currentStation) == "finishing") {
						tracker = "/" + location.host + "/Design Landing - Finishing Mode/Feedback"
					}
				}
			}
		}
	}
}
function LockUnlockHeader() {}
function showSignoutMenu() {
	if (document.getElementById("LoginSpan1").innerHTML == "Signout") {
		document.getElementById("signouMenu").style.display = "block"
	}
}
function hideSignoutMenu() {
	if (document.getElementById("LoginSpan1").innerHTML == "Signout") {
		document.getElementById("signouMenu").style.display = "none"
	}
}
function isQuoteOptionsSaveNeeded() {
	var a = $("quoteSave");
	if (a == null) {
		return false
	}
	return a.visible()
}
function onRemoveBackSide(a, b) {
	var m = "Are you sure you want to remove the back of this design? This operation cannot be undone.";
	var g = {
		key: a,
		value: b
	};
	showConfirmDialog(m, "Confirm", 500, 100, removeBackSide.bind(g))
}
function removeBackSide() {
	hideDialogWin();
	changeQTParameters(this.key, this.value)
}
function changeQTParameters(o, u) {
	var b = null;
	var m = null;
	if (document.domain != "localhost" && location.protocol != "file:") {
		var g = customizationURL + "/cde2?psp=" + psp + "&fromquotetool=true";
		if (o && o.match("color")) {
			b = u
		}
		if (o && o.match("size")) {
			var r = $("qtSizeSelect");
			if (r) {
				var a = r.selectedIndex;
				g = g + "&" + o + "=" + r.options[a].value
			}
		}
		if (b != null) {
			g = g + "&cl_text=" + b.replace("&", "and");
			g = g + "&bccolors_free=" + b.replace("&", "and")
		}
		g += "&pspspassport=" + Get_Cookie("pspspassport");
		designer.saveDoc(function q() {
			window.location.href = g;
			return
		},
		null, true)
	} else {
		designer.saveDoc(function q() {
			window.location.href = location.href;
			return
		},
		null, true)
	}
	showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000)
}
function saveQuoteOptions(a, q, g) {
	_saveQuoteOptions();
	var u;
	if (location.host == "colo-developer.psprint.com:81") {
		u = "http://colo-developer.psprint.com:81/design-templates";
		u = u + "/cde2?psp=" + psp + "&fromquotetool=true"
	} else {
		u = customizationURL + "/cde2?psp=" + psp + "&fromquotetool=true"
	}
	if (a != null) {
		var x = a;
		u = u + "&nextStation=" + x;
		if (x == "finishing") {
			designer.addTag("designStatus", "Approved")
		}
	}
	var m = designer.artwork.parameter_new;
	var b;
	if (m) {
		for (var o = 0; o < m.length; o++) {
			b = m[o];
			u = u + "&" + b.name + "=" + b.val
		}
	}
	u += "&pspspassport=" + Get_Cookie("pspspassport");
	designer.saveDoc(function r() {
		if (g) {
			doShowMyJobListDialog();
			return
		}
		window.location.href = u;
		return
	},
	q ? q: a, true)
}
function _saveQuoteOptions() {
	designer.artwork.parameter_new = [];
	var q = document.getElementById("QTFrame");
	var b = null;
	try {
		if (q != null && document.domain != "localhost" && location.protocol != "file:" && !playMode && q.contentWindow.document.forms.add_cart1 != null) {
			var a = q.contentWindow.document.forms;
			var m = a.add_cart1;
			var g, o;
			for (j = 0; j < m.length; j++) {
				var r = m[j];
				o = r.value;
				g = r.name;
				if (g == "activeCalc") {
					break
				}
				if (o && o.length > 0) {
					if (r.type.match("radio")) {
						if (!r.checked) {
							continue
						}
					}
					if (g.match("color")) {
						b = r.options[r.selectedIndex].value
					}
					setArtworkParameter(g, o)
				}
			}
			var u = q.contentWindow.document;
			if (u.getElementById("spprice") != null) {
				o = u.getElementById("spprice").firstChild.nodeValue.replace("$", "");
				setArtworkParameter("jobPrice", o)
			}
			if (u.getElementById("idNowOnly") != null && u.getElementById("idNowOnly").firstChild != null) {
				o = u.getElementById("idNowOnly").firstChild.nodeValue.replace("$", "");
				setArtworkParameter("jobTotal", o)
			}
			if (u.getElementById("sptotal") != null) {
				o = u.getElementById("sptotal").firstChild.nodeValue.replace("$", "");
				setArtworkParameter("QuoteTotal", o)
			}
			if (u.getElementById("idYouSaveNew") != null) {
				o = u.getElementById("idYouSaveNew").innerHTML.replace("- $", "");
				setArtworkParameter("youSave", o)
			}
			if (u.getElementById("idYouSave") != null && u.getElementById("idYouSave").firstChild != null) {
				o = u.getElementById("idYouSave").firstChild.nodeValue.replace("%", "");
				if (o == "Free") {
					o = 0
				}
				setArtworkParameter("MarkupPricing", o)
			}
			o = u.getElementById("idMaxYouSave") != null ? u.getElementById("idMaxYouSave").innerHTML.replace("$", "") : "off";
			setArtworkParameter("MaxDiscount", o);
			if (b != null) {
				setArtworkParameter("cl_text", b.replace("&", "and"))
			}
		}
	} catch(x) {}
}
function getQuoteToolXML() {
	var a = designer.artwork.parameter_new;
	var m;
	var g = "";
	if (a) {
		for (var b = 0; b < a.length; b++) {
			m = a[b];
			g += '<parameter class="NVL" atype="O">\n';
			g += "<name>" + m.name + "</name>\n";
			g += "<val>" + m.val + "</val>\n";
			g += "</parameter>\n"
		}
	}
	return g
}
function setArtworkParameter(a, m) {
	var g = designer.artwork.parameter_new;
	if (g == null) {
		designer.artwork.parameter_new = g = []
	}
	for (var b = 0; b < g.length; b++) {
		if (g[b]["name"] == a) {
			g[b]["val"] = m;
			return
		}
	}
	g.push({
		name: a,
		val: m
	})
}
function LoadQTValues() {
	var o;
	var g = "";
	try {
		var m = document.getElementById("QTFrame").contentWindow;
		hdnParams = m.document.getElementById("hdnParams");
		if (hdnParams == null) {
			return
		}
		strParams = hdnParams.value.split("~");
		var b = m.document.forms.add_cart1.elements;
		for (k = 0; k < strParams.length; k++) {
			if (strParams[k] == "turnaround1235_recon") {
				o = strParams[k + 1]
			} else {
				if (b[strParams[k]]) {
					b[strParams[k]].value = strParams[k + 1];
					if (b[strParams[k]].value == "") {
						b[strParams[k]].value = b[strParams[k]][0].value
					}
				}
			}
			for (j = 0; j < b.length; j++) {
				if ((b[j].type == "radio") && (b[j].name.indexOf("turnaround") < 0) && (g.indexOf(b[j].name) < 0)) {
					if (strParams[k] == b[j].name) {
						g = b[j].name + "~" + g;
						if (strParams[k + 1] == "Yes") {
							if (b[j].value == "Yes") {
								b[j].checked = true;
								b[j + 1].checked = false
							} else {
								b[j + 1].checked = true;
								b[j].checked = false
							}
						} else {
							if (b[j].value == "No") {
								b[j + 1].checked = false;
								b[j].checked = true
							} else {
								b[j].checked = false;
								b[j + 1].checked = true
							}
						}
					}
				}
			}
			k = k + 1
		}
		for (j = 0; j < b.length; j++) {
			if (b[j]) {
				if (b[j].name == "turnaround1235_recon") {
					if (o == b[j].value) {
						b[j].checked = true
					}
				}
			}
		}
	} catch(a) {}
}
function disableQToptions() {
	if (designer == null || designer.artwork == null) {
		return
	}
	try {
		var b = designer.artwork;
		var g = document.getElementById("QTFrame").contentWindow.document.forms.add_cart1;
		if (g) {
			for (j = 0; j < g.elements.length; j++) {
				if (g.elements[j]) {
					if (g.elements[j].name.match("scoring_brochures")) {
						g.elements[j].disabled = "true"
					}
					if (g.elements[j].name.match("Color_brochures_new")) {
						g.elements[j].disabled = "true"
					}
					if (g.elements[j].name.match("hole_drilling")) {
						g.elements[j].disabled = "true"
					}
					if (g.elements[j].name.match("perforation")) {
						g.elements[j].disabled = "true"
					}
					if (g.elements[j].name.match("size")) {
						g.elements[j].disabled = "true"
					}
					if (g.elements[j].name.match("color")) {
						g.elements[j].disabled = "true"
					}
					if (g.elements[j].name.match("pages_newsletters")) {
						g.elements[j].disabled = "true"
					}
				}
			}
		}
	} catch(a) {}
}
function genius() {
	var m = galleryPageURL + "?node=" + Category;
	var q = Get_Cookie("pspspassport");
	if (q != null) {
		m = m + "&pspspassport=" + q
	}
	if (Get_Cookie("logoutuser") != null) {
		m = m + "&logoutuser=1"
	}
	var b = designer.artwork.finishedDimensionsInches;
	var a = designer.artwork.sides;
	var o = m + "&size=" + b + "&side=" + a;
	window.location.href = o
}
function addtoCart() {
	designer.addTag("designStatus", "Approved");
	saveQuoteOptions()
}
function openSearch() {
	var g = document.getElementById("SearchText").value;
	var a = document.getElementById("SearchSelect").selectedIndex;
	if (g == "Search" || g == "") {
		alert("Please enter a valid keyword");
		document.getElementById("SearchText").focus();
		return
	}
	if (a == 0) {
		a = "gallery"
	} else {
		if (a == 1) {
			a = "resources"
		} else {
			if (a == 2) {
				a = "products"
			}
		}
	}
	var b = galleryPageURL + "?mode=search&q=" + g + "&t=" + a;
	var m = Get_Cookie("pspspassport");
	if (m != null) {
		b = b + "&pspspassport=" + m
	}
	if (Get_Cookie("logoutuser") != null) {
		b = b + "&logoutuser=1"
	}
	window.location.href = b
}
function loadFeedback(a) {
	var b;
	if (String(designer.artwork.currentStation) == "gettingStarted") {
		b = "Design Landing/Feedback"
	} else {
		if (String(designer.artwork.currentStation) == "position") {
			b = "Customization/Feedback"
		} else {
			if (String(designer.artwork.currentStation) == "finalReview") {
				b = "Customization - Final Review/Feedback"
			} else {
				if (String(designer.artwork.currentStation) == "finishing") {
					b = "Design Landing - Finishing Mode/Feedback"
				}
			}
		}
	}
	window.open(contributionURL + b + "&fromgallery=true", "Contribution", "location=0,status=0,scrollbars=no,resizable=no,width=700px,height=470px")
}
function loadChat() {
	var g = window.location;
	g = encodeURIComponent(g);
	var a = loggedInUser;
	var b = loggedInEmail;
	window.open("https://server.iad.liveperson.net/hc/90150254/?cmd=file&file=visitorWantsToChat&site=90150254&byhref=1&imageUrl=https://server.iad.liveperson.net/hcp/Gallery/ChatButton-Gallery/English/General/1a/&VISITORVAR!Current%20Page=" + g + "&VISITORVAR!Customer%20Name=" + a + "&VISITORVAR!Customer%20Email=" + b + "", "chat90150254", "width=475,height=400,resizable=yes")
}
function startover() {
	if (String(designer.artwork.currentStation) != "gettingStarted") {
		var a = (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"));
		console.log("isDeluxStore=" + a);
		if (!a) {
			showYesNoCancelDialog("Would you like to save your design before leaving this page?", "Save and Exit", 426, 100, c, c1)
		} else {
			showConfirmDialog("By going to gallery your changes will be lost. Would you like to continue?", "Exit", 421, 109, c1)
		}
	} else {
		c1()
	}
}
function c() {
	designer.saveDoc(function a() {
		InitializeServiceIndexing(designer.artwork.jobId);
		return
	},
	null, true);
	if (queryString("uploadMode") && queryString("uploadMode") == "true") {
		if (designer.artwork.productGroupName == "Business Cards") {
			window.location.href = businesscardsURL
		}
		if (designer.artwork.productGroupName == "Postcards") {
			window.location.href = postcardsURL
		}
	} else {
		if (Get_Cookie("pspspassport") == null) {
			var b = signupURL + "?mode=login&psp=" + psp + "&redirectURL=" + s;
			GB_showCenter("Login", b, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH);
			return
		} else {
			c1()
		}
	}
}
function c1() {
	if (isSuperAdmin()) {
		designer.wfe.changeStation("gettingStarted")
	} else {
		var b = Get_Cookie("pspspassport");
		var a = galleryPageURL;
		var g = designer.artwork.productGroupName;
		if (g) {
			g = g.replace(/ /g, "-");
			a = a + g.toLowerCase() + "/"
		}
		a = a + "?fromcde=true";
		if (b != null) {
			a = a + "&pspspassport=" + b
		}
		if (Get_Cookie("logoutuser") != null) {
			a = a + "&logoutuser=1"
		}
		window.location.href = a
	}
}
function FinishDesign() {
	var a = manageAccountURL;
	var b = Get_Cookie("pspspassport");
	if (b != null) {
		a = a + "?pspspassport=" + b
	}
	if (Get_Cookie("logoutuser") != null) {
		a = a + "&logoutuser=1"
	}
	location.replace(a)
}
function redirectForGoogleUser(b) {
	var a = CDEUrl;
	if (b == 0) {
		p_value = a + "?psp=Seqnum&station=learnmore&pspname=" + psp
	}
	if (b == 1) {
		p_value = a + "?psp=Seqnum&station=learnmore&pspname=" + psp + "&googleUser=true"
	}
	InitializeServiceSequence()
}
function InitializeServiceSequence() {
	var g = getSequenceNumberURL + "getSeqNumber";
	var b = document.getElementsByTagName("head").item(0);
	var a = document.createElement("script");
	a.setAttribute("type", "text/javascript");
	a.setAttribute("src", g);
	b.appendChild(a)
}
function getSeqNumber(b) {
	var a = p_value.replace("Seqnum", b.SequenceNumber.value);
	window.location.href = a
}
function InitializeServiceIndexing(a) {
	new Ajax.Request(updateDBURL, {
		method: "get",
		parameters: {
			Str_PspName: a
		}
	})
}
function loadShare() {
	clientSideInclude("includeone", "/psp/share.html");
	showShareBox()
}
function showShareBox() {
	galleryProductShare = new ddtabcontent("sharetabs");
	galleryProductShare.setpersist(true);
	galleryProductShare.setselectedClassTarget("link");
	galleryProductShare.init();
	galleryProductShare.expandtab(galleryProductShare.tabs[galleryProductShare.hottabspositions[0]]);
	Element.show("includeone");
	addtoSite();
	shareThis()
}
function addtoSite() {
	if (document.getElementById("addtoSite") == null) {
		return
	}
	var o = designer.artwork.jobId;
	if (String(designer.artwork.Level) == "Private") {
		o = designer.artwork.originalDesignId
	}
	var g = designer.artwork.image_name_preview;
	var a = location.protocol + "//" + location.host + "/cde2?psp=" + o;
	var m = location.protocol + "//" + location.host + "/psp/r/" + designer.artwork.jobId + "/" + g;
	var b = designer.artwork.productGroupName;
	document.getElementById("txtAddSite").value = "<div style='text-align:center;line-height:150%'>\n<a href='" + a + "'>\n<img src='" + m + "' alt='" + o + "' border='1' style='border:1;' /></a><br />\n<a href='" + a + "'>" + o + "</a> \nby " + designer.artwork.creatorName + "<br />\nCreate <a href='" + galleryPageURL + "'>" + b + "</a> with psprint.com\n</div>"
}
function shareThis() {
	var u = designer.artwork.jobId;
	if (String(designer.artwork.Level) == "Private") {
		u = designer.artwork.originalDesignId
	}
	var o = designer.artwork.image_name_preview;
	var g = location.protocol + "//" + location.host + "/cde2?psp=" + u;
	var r = encodeURIComponent(location.protocol + "//" + location.host + "/psp/r/" + designer.artwork.jobId + "/" + o);
	var b = encodeURIComponent(g);
	var a = designer.artwork.productGroupName;
	var m = designer.artwork.designName;
	var q = encodeURIComponent(a + " Design (" + m + ")");
	var g = shareThisURL + "?url='" + encodeURIComponent(sharepspURL) + u + "'&icon='" + r + "'&title='" + q + "'";
	if (document.getElementById("frame1") != null) {
		document.getElementById("frame1").src = g
	}
}
function mailThisUrl() {
	var o = "PsPrint offer, take a look at this";
	var r = location.href;
	var g = r.indexOf("?");
	if (g > 0) {
		r = r.substring(0, g)
	}
	var a = "Hi,\n Here's a design from PsPrint which I thought you might be interested in: " + r;
	good = false;
	var b = null;
	var m = designer.artwork.Level;
	var q = designer.artwork.jobId;
	if (String(designer.artwork.Level) == "Private") {
		q = designer.artwork.originalDesignId
	}
	b = document.eMailer.email.value;
	checkEmailAddress(b);
	a = a + "?psp=" + q;
	if (good) {
		window.location = "mailto:" + b + "?subject=" + o + "&body=" + escape(a)
	}
}
function Publish() {
	psp = designer.artwork.originalDesignId;
	if (String(designer.artwork.creatorEmail).toLowerCase() == Get_Cookie("LOGGED_IN_EMAIL").toLowerCase()) {
		storeMode = true
	}
	if (queryString("pspspassport")) {
		userPspspassport = queryString("pspspassport");
		var a = publishDesignURL + "?psp=" + psp + "&pspspassport=" + userPspspassport + "&storeMode=" + storeMode
	} else {
		if (Get_Cookie("pspspassport") != null) {
			userPspspassport = Get_Cookie("pspspassport");
			var a = publishDesignURL + "?psp=" + psp + "&pspspassport=" + userPspspassport + "&storeMode=" + storeMode
		} else {
			var a = publishDesignURL + "?psp=" + psp + "&mode=DLP&email=" + Get_Cookie("LOGGED_IN_EMAIL") + "&storeMode=" + storeMode
		}
	}
	var a = publishDesignURL + location.search;
	a = a.replace(/s=.*/g, "s=" + psp) + "&Level=" + designer.artwork.Level + "&Category1=" + encodeURIComponent(designer.artwork.Category1);
	if (String(designer.artwork.Category2) != "" && String(designer.artwork.Category2) != "undefined") {
		a += "&Category2=" + encodeURIComponent(designer.artwork.Category2)
	}
	if (String(designer.artwork.Category3) != "" && String(designer.artwork.Category3) != "undefined") {
		a += "&Category3=" + encodeURIComponent(designer.artwork.Category3)
	}
	if (String(designer.artwork.Category4) != "" && String(designer.artwork.Category4) != "undefined") {
		a += "&Category4=" + encodeURIComponent(designer.artwork.Category4)
	}
	if (String(designer.artwork.Category5) != "" && String(designer.artwork.Category5) != "undefined") {
		a += "&Category5=" + encodeURIComponent(designer.artwork.Category5)
	}
	if (String(designer.artwork.Category6) != "" && String(designer.artwork.Category6) != "undefined") {
		a += "&Category6=" + encodeURIComponent(designer.artwork.Category6)
	}
	var b = location.search.substring(1, location.search.length);
	if (b.toString().match("player")) {
		a += "&LOGGED_IN_EMAIL=" + encodeURIComponent(designer.artwork.creatorEmail);
		a += "&LOGGED_IN_USER=" + encodeURIComponent(designer.artwork.creatorName)
	}
	GB_showCenter("Publish Design", a, 330, 1050)
}
function publishDesign() {
	var a = designer.wfe.getOverallStatus();
	if (a != "checked") {
		var q = GUIDE_CHECK_REQUIRED.text + designer.wfe.getErrors();
		showMessageDialog(q, "Request", GUIDE_CHECK_REQUIRED.width, -1);
		return false
	}
	if (!AuthUtil.isLoggedIn()) {
		LoadLogin("2");
		return
	}
	designer.addTag("currentStation", "gettingStarted");
	designer.artwork.currentStation = "gettingStarted";
	var o = Get_Cookie("pspspassport");
	if (location.host == "colo-developer.psprint.com:81") {
		var g = "cde"
	} else {
		var g = "cde2"
	}
	var b = location.protocol + "//" + location.host + "/design-templates/" + g + "?psp=" + psp + "&pspspassport=" + o;
	designer.saveDoc(function m() {
		location.replace(b)
	},
	null, true);
	return false
}
function saveDesignLanding() {
	if (String(designer.artwork.Level) == "Public") {
		var a, r, q, o;
		a = savePricing();
		r = saveProduct();
		q = saveTag();
		o = saveColors();
		if (a == 1 && r == 1 && q == 1 && o == 1) {
			showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000);
			var b = galleryPageURL + "?mode=jobs";
			var m = Get_Cookie("pspspassport");
			if (m != null) {
				b = b + "&pspspassport=" + m
			}
			designer.saveDoc(function g() {
				InitializeServiceIndexing(designer.artwork.jobId);
				location.replace(b)
			},
			null, true)
		}
	} else {
		saveQuoteOptions()
	}
}
function saveCustomization(b) {
	var a = designer.artwork.jobId;
	if (!chgMgr.isSaveNeeded() && !designNameSaver.isDesignSaved(a)) {
		showMessageDialog(DESIGN_NOT_CHANGE.text, DESIGN_NOT_CHANGE.subject, DESIGN_NOT_CHANGE.width, -1);
		return
	}
	if (document.domain != "localhost" && !AuthUtil.isLoggedIn()) {
		designer.addTag("currentStation", "savePost");
		designNameSaver.setDesignSavedInStore(a, window.storejs);
		LoadLogin("6", null, clearNotSavedDesign.bind(this, designer, a, window.storejs));
		return
	} else {
		if (String(designer.artwork.currentStation) == "position") {
			designNameSaver.setDesignSavedInStore(a, window.storejs);
			designer.addTag("currentStation", "savePost")
		}
		if (String(designer.artwork.currentStation) == "gettingStarted") {
			saveDesignLanding()
		} else {
			if (String(designer.artwork.currentStation) == "finishing") {
				saveQuoteOptions("finishing", null, true)
			} else {
				saveQuoteOptions(null, b, true)
			}
		}
	}
}
function clearNotSavedDesign(b, a, g) {
	b.clearTags();
	designNameSaver.resetDesignSavedInStore(a, g)
}
function saveQTOptions() {
	if (String(designer.artwork.currentStation) == "finishing") {
		saveQuoteOptions("finishing")
	} else {
		saveQuoteOptions()
	}
	showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000)
}
function savePricing() {
	var b = 1;
	var q = document.getElementById("MarkUp");
	if (q != null && q.checked) {
		designer.addTag("MarkUp", "true")
	} else {
		designer.addTag("MarkUp", "false")
	}
	var r = document.getElementById("MarkupPricing").value;
	if (r.length > 0 && r > 100) {
		alert("Please enter a valuable percent for markup");
		if (document.getElementById("pricing").style.display == "block") {
			var q = document.getElementById("MarkupPricing");
			if (q) {
				q.focus()
			}
		}
		b = 0
	}
	designer.addTag("MarkupPricing", r);
	var u = document.getElementById("MaxDiscount").value;
	designer.addTag("MaxDiscount", u);
	var m = document.getElementById("basePrice").value;
	designer.addTag("jobTotal", m);
	var o = document.getElementById("returnPricing").value;
	designer.addTag("ReturnPricing", o);
	var a = document.getElementById("googleUserDiscount").value;
	designer.addTag("GoogleUserDiscount ", a);
	var q = document.getElementById("WestCoast");
	if (q != null && q.checked) {
		designer.addTag("GeographicPricing", "W")
	}
	var q = document.getElementById("MidWest");
	if (q != null && q.checked) {
		designer.addTag("GeographicPricing", "M")
	}
	var q = document.getElementById("EastCoast");
	if (q != null && q.checked) {
		designer.addTag("GeographicPricing", "E")
	}
	var g = document.getElementById("Designcharge").value;
	designer.addTag("Designcharge", g);
	new_art = "true";
	return b
}
function saveProduct() {
	var q = 1;
	var b = document.getElementById("StationName").value;
	designer.addTag("currentStation", b);
	var u = document.getElementById("designerNameTEXT").value;
	designer.addTag("creatorName", u);
	var z = document.getElementById("designerEmail").value;
	designer.addTag("creatorEmail", z);
	var x = document.getElementById("designDescription");
	if (x != null) {
		designer.addTag("designDescription", x.value)
	}
	var x = document.getElementById("seoDescription");
	if (x != null) {
		designer.addTag("seo_description", x.value)
	}
	var m = document.getElementById("designId").value;
	designer.addTag("design_id", m);
	var o = document.getElementById("designShortName").value;
	designer.addTag("design_shortname", o);
	var A = document.getElementById("designLongName").value;
	designer.addTag("design_longname", A);
	var g = document.getElementById("designURLFullName").value;
	designer.addTag("design_url_fullname", g);
	var a = document.getElementById("designURLShortName").value;
	designer.addTag("design_url_tinyname", a);
	var y = document.getElementById("productDisplay").value;
	designer.addTag("productDisplay", y);
	good = false;
	checkEmailAddress(z);
	if (!good) {
		if (document.getElementById("Design").style.display == "block") {
			var x = document.getElementById("designerEmail");
			if (x) {
				x.focus()
			}
		}
		q = 0
	}
	var r = document.getElementById("Title").value;
	designer.addTag("designName", r);
	var x = document.getElementById("PublicDesign");
	if (x != null && x.checked) {
		designer.addTag("Level", "Public")
	}
	var x = document.getElementById("PrivateDesign");
	if (x != null && x.checked) {
		designer.addTag("Level", "Private")
	}
	var x = document.getElementById("PortfolioDesign");
	if (x != null && x.checked) {
		designer.addTag("Portfolio", "Yes")
	} else {
		designer.addTag("Portfolio", "No")
	}
	var x = document.getElementById("RequestPublic");
	if (x != null && x.checked) {
		designer.addTag("RequestPublic", "Yes")
	} else {
		designer.addTag("RequestPublic", "No")
	}
	var x = document.getElementById("PricingVisible");
	if (x != null && x.checked) {
		designer.addTag("PricingVisible", "true")
	} else {
		designer.addTag("PricingVisible", "false")
	}
	var x = document.getElementById("AudienceG");
	if (x != null && x.checked) {
		designer.addTag("Audience", "G")
	}
	var x = document.getElementById("AudiencePG");
	if (x != null && x.checked) {
		designer.addTag("Audience", "PG")
	}
	var x = document.getElementById("AudienceR");
	if (x != null && x.checked) {
		designer.addTag("Audience", "R")
	}
	var x = document.getElementById("Eco-FriendlyYes");
	if (x != null && x.checked) {
		designer.addTag("Eco-Friendly", "Yes")
	}
	var x = document.getElementById("Eco-FriendlyNo");
	if (x != null && x.checked) {
		designer.addTag("Eco-Friendly", "No")
	}
	var x = document.getElementById("DesignAwardYes");
	if (x != null && x.checked) {
		designer.addTag("DesignAward", "Yes")
	}
	var x = document.getElementById("DesignAwardNo");
	if (x != null && x.checked) {
		designer.addTag("DesignAward", "No")
	}
	var x = document.getElementById("PsPrintCertifiedYes");
	if (x != null && x.checked) {
		designer.addTag("PsPrintCertified", "Yes")
	}
	var x = document.getElementById("PsPrintCertifiedNo");
	if (x != null && x.checked) {
		designer.addTag("PsPrintCertified", "No")
	}
	var x = document.getElementById("PsPrintColorCertifiedYes");
	if (x != null && x.checked) {
		designer.addTag("PsPrintColorCertified", "Yes")
	}
	var x = document.getElementById("PsPrintColorCertifiedNo");
	if (x != null && x.checked) {
		designer.addTag("PsPrintColorCertified", "No")
	}
	var x = document.getElementById("LowpriceGuaranteeYes");
	if (x != null && x.checked) {
		designer.addTag("LowpriceGuarantee", "Yes")
	}
	var x = document.getElementById("LowpriceGuaranteeNo");
	if (x != null && x.checked) {
		designer.addTag("LowpriceGuarantee", "No")
	}
	var x = document.getElementById("Customizable_BackgroundYes");
	if (x != null && x.checked) {
		designer.addTag("Customizable_Background", "Yes")
	}
	var x = document.getElementById("Customizable_BackgroundNo");
	if (x != null && x.checked) {
		designer.addTag("Customizable_Background", "No")
	}
	var x = document.getElementById("Customizable_TextYes");
	if (x != null && x.checked) {
		designer.addTag("Customizable_Text", "Yes")
	}
	var x = document.getElementById("Customizable_TextNo");
	if (x != null && x.checked) {
		designer.addTag("Customizable_Text", "No")
	}
	var x = document.getElementById("Customizable_ImagesYes");
	if (x != null && x.checked) {
		designer.addTag("Customizable_Images", "Yes")
	}
	var x = document.getElementById("Customizable_ImagesNo");
	if (x != null && x.checked) {
		designer.addTag("Customizable_Images", "No")
	}
	var x = document.getElementById("CanbePublishedYes");
	if (x != null && x.checked) {
		designer.addTag("CanbePublished", "Yes")
	}
	var x = document.getElementById("CanbePublishedNo");
	if (x != null && x.checked) {
		designer.addTag("CanbePublished", "No")
	}
	new_art = "true";
	return q
}
function saveTag() {
	var g = 1;
	var b = document.getElementById("tagmetadataDescription").value;
	designer.addTag("metadataDescription", b);
	var o = document.getElementById("tagmetadataKeywords").value;
	designer.addTag("metadataKeywords ", o);
	var m = document.getElementById("PageTitleTag").value;
	designer.addTag("pageTitle", m);
	var a = document.getElementById("semKeywords").value;
	designer.addTag("sem_keyword", a);
	new_art = "true";
	return g
}
function saveColors() {
	var o;
	var a = 1;
	o = document.getElementById("designColorFamily");
	if (o) {
		if (o.tagName.toLowerCase() != "select") {
			var m = o.value
		} else {
			var m = o.options[o.selectedIndex].value
		}
		designer.addTag("designColors", m)
	}
	o = document.getElementById("designColorsName");
	if (o) {
		if (o.tagName.toLowerCase() != "select") {
			var b = o.value
		} else {
			var b = o.options[o.selectedIndex].value
		}
		designer.addTag("designColor_Name", b)
	}
	var g = document.getElementById("designColorsWebValue").value;
	designer.addTag("designColor_webvalue", g);
	return a
}
function changeColorCode(g, b, a) {
	if (a.checked) {
		document.getElementById("designColorsWebValue").value = " " + g;
		document.getElementById("designColorFamily").value = b
	} else {
		var o = document.getElementById("designColorFamily").value;
		document.getElementById("designColorFamily").value = o.replace(b, "");
		var o = document.getElementById("designColorsWebValue").value;
		document.getElementById("designColorsWebValue").value = o.replace("" + g, "")
	}
	var m = document.getElementById("designColorsWebValueSwatch");
	if (m) {
		m.style.backgroundColor = g
	}
}
function FP_openNewWindow(A, r, q, y, a, u, x, o, z, m, g, b) {
	var B = "";
	if (a == false) {
		B += "toolbar=no,"
	} else {
		B += "toolbar=yes,"
	}
	if (r == "" || A == "") {
		A = 550;
		if (window.navigator.userAgent.indexOf("Safari") != -1) {
			r = 398
		} else {
			if (window.navigator.userAgent.indexOf("MSIE") != -1) {
				r = 338
			} else {
				if (window.navigator.userAgent.indexOf("Mozilla") != -1) {
					r = 360
				}
			}
		}
	}
	if (q == "" || y == "") {
		q = ((screen.width - (parseInt(A) + 40)) / 2);
		y = ((screen.height - (parseInt(r) + 50)) / 2)
	}
	B += "width=" + A + ",";
	B += "height=" + r + ",";
	B += "left=" + q + ",";
	B += "top=" + y + ",";
	if (u == false) {
		B += "location=no,"
	} else {
		B += "location=yes,"
	}
	if (x == false) {
		B += "status=no,"
	} else {
		B += "status=yes,"
	}
	if (o == false) {
		B += "menubar=no,"
	} else {
		B += "menubar=yes,"
	}
	if (z == false) {
		B += "scrollbars=no,"
	} else {
		B += "scrollbars=yes,"
	}
	if (m == false) {
		B += "resizable=no,"
	} else {
		B += "resizable=yes,"
	}
	if (B != "") {
		if (B.charAt(B.length - 1) == ",") {
			B = B.substring(0, B.length - 1)
		}
	}
	window.open(b, g, B)
}
function setLogoSettings() {
	var a = $("logoLink");
	if ($("logoLink")) {
		a.onclick = logoLink
	}
}
function logoLink() {
	if (String(designer.artwork.currentStation) != "gettingStarted") {
		showYesNoCancelDialog("Would you like to save your design before leaving this page?", "Save and Exit", 426, 100,
		function b() {
			designer.saveDoc(function a() {
				return
			},
			null, true);
			if (Get_Cookie("pspspassport") == null) {
				var g = signupURL + "?mode=login&psp=" + psp + "&redirectURL=" + galleryPageURL;
				GB_showCenter("Login", g, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH);
				return
			} else {
				location.href = galleryPageURL
			}
		},
		function b() {
			location.href = galleryPageURL
		})
	} else {
		location.href = galleryPageURL
	}
}
function gotoGallery(g) {
	if (String(designer.artwork.currentStation) != "gettingStarted") {
		showYesNoCancelDialog("Would you like to save your design before leaving this page?", "Save and Exit", 426, 100,
		function b() {
			designer.saveDoc(function a() {
				return
			},
			null, true);
			if (Get_Cookie("pspspassport") == null) {
				var m = signupURL + "?mode=login&psp=" + psp + "&redirectURL=" + g;
				GB_showCenter("Login", m, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH);
				return
			} else {
				location.href = g
			}
		},
		function b() {
			location.href = g
		})
	} else {
		location.href = g
	}
}
function savePricingTabs() {
	Status1 = savePricing();
	if (Status1 == 1) {
		showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000);
		designer.saveDoc(function a() {
			InitializeServiceIndexing(designer.artwork.jobId);
			location.replace(location.href)
		},
		null, true)
	}
}
function saveProductTabs() {
	Status2 = saveProduct();
	if (Status2 == 1) {
		showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000);
		designer.saveDoc(function a() {
			InitializeServiceIndexing(designer.artwork.jobId);
			location.replace(location.href)
		},
		null, true)
	}
}
function saveTagTabs() {
	Status3 = saveTag();
	if (Status3 == 1) {
		showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000);
		designer.saveDoc(function a() {
			InitializeServiceIndexing(designer.artwork.jobId);
			location.replace(location.href)
		},
		null, true)
	}
}
function saveColorsTabs() {
	Status4 = saveColors();
	if (Status4 == 1) {
		showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000);
		designer.saveDoc(function a() {
			InitializeServiceIndexing(designer.artwork.jobId);
			location.replace(location.href)
		},
		null, true)
	}
}
function saveCategories() {
	for (var a = 1; a <= 4; a++) {
		var b = $("Category" + a);
		if (b && b.tagName.toLowerCase() == "select") {
			v = b.value;
			designer.addTag("Category" + a, v)
		}
	}
}
function saveAllTabs() {
	var a, o, m, g;
	a = savePricing();
	o = saveProduct();
	m = saveTag();
	g = saveColors();
	saveCategories();
	if (a == 1 && o == 1 && m == 1 && g == 1) {
		designer.saveDoc(function b() {
			InitializeServiceIndexing(designer.artwork.jobId);
			location.replace(location.href)
		},
		null, true)
	}
}
function returntoCustomization() {
	if (designer) {
		designer.addTag("currentStation", "position");
		designer.saveDoc(function a() {
			location.replace(location.href)
		},
		null, true)
	}
}
function loadQuoteTool(b, a) {
	var m = $("QTFrame");
	if (m == null) {
		return
	}
	if (a == null) {
		a = "Guest"
	}
	var g = function() {
		if (designer == null || designer.artwork == null) {
			setTimeout(g, 200)
		} else {
			var o = (new Date()).getTime();
			m.src = b + "&LOGGED_IN_EMAIL=" + a + "&timeStamp=" + o + "&CDEURL=" + encodeURIComponent(document.location.href);
			if (m.attachEvent) {
				m.attachEvent("onload",
				function() {
					LoadQTValues();
					disableQToptions();
					hideModalMessageDialog()
				})
			} else {
				m.addEventListener("load",
				function() {
					LoadQTValues();
					disableQToptions();
					hideModalMessageDialog()
				},
				false)
			}
		}
	};
	g()
}
function EmptyFooterSearchTextBox() {
	var a = document.getElementById("footerSearchText").value;
	if (a == "Lets find what you need.") {
		document.getElementById("footerSearchText").value = ""
	}
}
function FooterSearch(b) {
	var m = document.getElementById("footerSearchText").value;
	if (m == "") {
		document.getElementById("footerSearchText").focus()
	} else {
		var g = baseURL + b + "?q=" + m;
		var a = document.createElement("a");
		if (typeof(a.click) == "undefined") {
			location.href = g
		} else {
			a.href = g;
			document.body.appendChild(a);
			a.click()
		}
	}
}
function orderCheckListShow() {
	this._orderCheckList = $("OrderCheckList");
	if (this._orderCheckList) {
		this._orderCheckList.style.display = "block"
	}
}
function orderCheckListHide() {
	this._orderCheckList = $("OrderCheckList");
	if (this._orderCheckList) {
		this._orderCheckList.style.display = "none"
	}
}
var myjobListDialog = null;
function doShowMyJobListDialog() {
	InitializeServiceIndexing(designer.artwork.jobId);
	var a = "position";
	if (designer.artwork.currentStation && designer.artwork.currentStation != "savePost") {
		a = designer.artwork.currentStation
	}
	designerContainer4.wfe.changeStation(a)
}
function continueCustomization(a) {
	if (a) {
		Event.stop(a)
	}
	var b = "position";
	if (designer.artwork.currentStation) {
		b = designer.artwork.currentStation
	}
	designer.wfe.changeStation(b);
	myjobListDialog.hide()
}
function gotoMyjobs(b) {
	var a = galleryPageURL + "?node=My jobs&mode=jobs";
	var g = Get_Cookie("pspspassport");
	if (g != null) {
		a = a + "&pspspassport=" + g
	}
	if (Get_Cookie("logoutuser") != null) {
		a = a + "&logoutuser=1"
	}
	location.href = a
}
var FAILED = "failed";
var WARNED = "warned";
var CHECKED = "checked";
var PENDING = "pending";
var OVERRIDE = "override";
var NONE = "none";
var HIDDEN = "hidden";
var SAVE_MODE = "save";
var GUIDE_INTERNAL_NAME = "finalCheckoff";
var NAME_TAG = "designStatus";
var TAG_DESIGN_STATUS_VALUE = "Pending";
var defaultPassport = "6F25FA226A3661B5";
var SIZE_TITLE = "";
var SIZE_TITLE_GOOD = " (Good)";
var SIZE_TITLE_SIZED_FIT = " (Best Fit)";
var POSITION_WARN_MSG = "Background is not properly positioned inside design canvas";
var MIXED_POSITION_WARN_MSG = "Background orientation may be incorrect";
var OVER_SIZE_POSITION_OK_MSG = "Background is larger than printable area. Please confirm, or adjust layout";
var UNDER_SIZE_POSITION_OK_MSG = "Background is smaller than printable area. Please confirm, or adjust layout";
var RESOLUTION_BASE_TITLE = "";
var RESOLUTION_BASE_TITLE_OK = "Image Quality";
var RESOLUTION_BASE_TITLE_WARN = "Print Quality";
var RESOLUTION_QUALITY = "";
var RESOLUTION_LOW_QUALITY = "Marginal";
var RESOLUTION_LOW_QUALITY_2 = "Poor";
var RESOLUTION_LOW_QUALITY_3 = "Very Poor";
var RESOLUTION_OK_QUALITY = "OK";
var RESOLUTION_OK_QUALITY_2 = "OK / Good";
var RESOLUTION_OPTIMAL_QUALITY = "Good";
var RESOLUTION_OPTIMAL_QUALITY_2 = "Excellent";
var RESOLUTION_UNKNOWN_MSG = "Background print quality cannot be determined";
var RESOLUTION_LOW_MSG = "Background has [RESOLUTION_QUALITY] print quality";
var RESOLUTION_LOW_MSG_2 = "Images with poor print quality:";
var BLEED_MSG_CHECK = 'Confirm background colors extend to outer <span style="color: #cc0000; font-weight: bold">red guideline</span>';
var BLEED_MSG_WARN = 'Background does not extend to outer <span style="color: #cc0000; font-weight: bold">red guideline</span>';
var BLANK_PAGE_MSG = '<span style="font-size:11px; color:#d44444; font-weight:bold; margin:2px 0px">[side] side is blank. It will not be printed.</span>';
var Seqnum = null;
var req;
var path;
function getSeqNum(a) {
	Seqnum = a.SequenceNumber.value;
	path = new String("\\" + Seqnum + "\\");
	req.addParameter("path", path);
	ajaxEngine.processRequest(req);
	return false
}
function findGuideLink(m, a) {
	if (m.guideLink == null) {
		return null
	}
	for (var b = 0; b < m.guideLink.length; b++) {
		if (m.guideLink[b]["GuideLinkInternalName"] == a) {
			return m.guideLink[b]
		}
	}
	return null
}
function findGuidLinkInStation(m, b) {
	var u = m.guideList;
	if (u == null || u.length == 0) {
		return null
	}
	var a = u[0]["guide"];
	for (var o = 0; o < a.length; o++) {
		var r = a[o];
		var q = findGuideLink(r, b);
		if (q != null) {
			return q
		}
	}
	return null
}
function showHideLink(a, m, g) {
	var b = findGuidLinkInStation(a, m);
	if ((b != null) && (g == "visible" || g == "hidden")) {
		b.GuideLinkStatus = g
	}
}
PsP.BR = Class.create({
	initialize: function(b, a) {
		this.ds = b;
		this.dimensionStatus = -1;
		this.positionStatus = -1;
		this.index = a
	},
	executeRules: function(a, g, b) {
		if (this.ds.gobjects.length > 0) {
			this.executeOneObjRule(this.ds.gobjects[0], false, false, a, g, false, b)
		}
	},
	executeRules2: function(g, o, b, m, a) {
		if (this.ds.gobjects.length > 0) {
			this.executeOneObjRule(this.ds.gobjects[0], g, o, b, m, a)
		}
	},
	executeAllRules: function() {
		if (this.ds.gobjects.length > 0) {
			var b = this.ds.gobjects[0];
			var a = {
				imageChanged: true,
				boundsChanged: true,
				reloadGuides: true,
				computeOnly: false,
				sizeChanged: true,
				updateCallouts: true,
				forseResolutionGuideRecalc: true
			};
			this.executeOneObjRule(b, a.imageChanged, a.boundsChanged, a.reloadGuides, a.computeOnly, a.updateCallouts, a.forseResolutionGuideRecalc)
		}
	},
	createLink: function(g, b) {
		var m = document.createElement("a");
		var a = document.createAttribute("href");
		m.setAttribute(a, g);
		m.innerText = b
	},
	executeOneObjRule: function(u, T, N, g, D, L, ah, V) {
		var E = this.ds.getGuideStatus("Bleeds")["GuideStatus"];
		if (designer.wfe == null || this.ds.gobjects.length == 0) {
			return
		}
		var M = designer.wfe.artwork;
		var ar = "";
		if (M != null) {
			ar = (M.bleed_height - 0.25) + "x" + (M.bleed_width - 0.25);
			productName = M.productGroupName;
			productName = productName.slice(0, -1)
		}
		var m = "";
		var G = designer.wfe.getCurrentStation();
		var A = new Date();
		if (G.StationInternalName == "finishing") {
			B = this.ds.getGuideStatus("hardcopyProof");
			if (B != null && B.GuideStatus != OVERRIDE) {
				var ae = -1;
				var Z = new Array();
				B.RES_MSG_LIST = Z;
				for (var ak = 0; ak < this.ds.gobjects.length; ak++) {
					if (this.ds.gobjects[ak].type == "image") {
						if (this.ds.gobjects[ak].imageFile == null) {
							continue
						}
						var ao = this.ds.gobjects[ak]["artworkResolution"];
						if (ao == 0) {
							continue
						}
						if (ao < ae || ae == -1) {
							ae = ao
						}
					}
				}
				if (ae > 0) {
					if (ae >= 250) {
						B.GuideStatus = HIDDEN
					} else {
						B.GuideStatus = NONE
					}
				} else {
					B.GuideStatus = HIDDEN
				}
			}
		} else {
			if (G.StationInternalName != "uploadChecklist") {
				showHideLink(G, "sizing_requirements", "hidden");
				showHideLink(G, "how_to_position", "hidden");
				showHideLink(G, "how_to_resize", "hidden");
				showHideLink(G, "how_to_change_template_size", "hidden");
				showHideLink(G, "action_autosize", "hidden");
				showHideLink(G, "action_autoposition", "hidden");
				showHideLink(G, "action_autocenter", "hidden");
				showHideLink(G, "action_rotate_left", "hidden");
				showHideLink(G, "action_rotate_right", "hidden");
				showHideLink(G, "action_changebackground", "hidden");
				showHideLink(G, "action_reupload", "hidden");
				showHideLink(G, "resolution", "hidden");
				var B = this.ds.getGuideStatus("Dimensions");
				var ab = parseFloat(this.ds.element.offsetWidth);
				var am = parseFloat(this.ds.element.offsetHeight);
				var aa = 6 * this.ds.zoomFactor;
				var y = 24 * this.ds.zoomFactor;
				var Q = 1 * this.ds.zoomFactor;
				var O = 2 * this.ds.zoomFactor;
				var x = "";
				if (u == this.ds.gobjects[0] && ((B.GuideStatus != HIDDEN && B.GuideStatus != OVERRIDE) || N)) {
					E = WARNED;
					BLEED_MSG = BLEED_MSG_WARN;
					SIZE_TITLE = "";
					var b = "";
					var P = "";
					if (am > ab) {
						b = "tall"
					} else {
						b = "wide"
					}
					if (u.h > u.w) {
						P = "tall"
					} else {
						P = "wide"
					}
					if ((ab >= u.w - O && ab <= u.w + O) && (am >= u.h - O && am <= u.h + O)) {
						x = "perfectlySized"
					} else {
						if ((u.w >= ab - (aa * 2) && u.w <= ab) && (u.h >= am - (aa * 2) && u.h <= am)) {
							x = "sufficientlySized"
						} else {
							if ((u.w > ab && (u.h >= am - (aa * 2) && u.h <= am + (aa * 2))) || ((u.w >= ab - (aa * 2) && u.w <= ab + (aa * 2)) && u.h > am)) {
								x = "sizedtofit"
							} else {
								if (u.w > ab && u.h > am) {
									x = "oversized"
								} else {
									if (b != P && (u.h > am && u.w < ab || u.h < am && u.w > ab)) {
										x = "mixedOrientation"
									} else {
										x = "undersized"
									}
								}
							}
						}
					}
					var J = parseFloat(u.x);
					var at = parseFloat(u.y);
					var I = J + parseFloat(u.w);
					var aq = at + parseFloat(u.h);
					if ((J <= aa && at <= aa) && (I >= ab - aa && aq >= am - aa)) {
						this.dimensionStatus = CHECKED;
						E = CHECKED;
						BLEED_MSG = BLEED_MSG_CHECK;
						if (x == "perfectlySized" || x == "sufficientlySized") {
							SIZE_TITLE = SIZE_TITLE_GOOD
						} else {
							if (x == "sizedtofit") {
								SIZE_TITLE = SIZE_TITLE_SIZED_FIT
							} else {
								if (x == "oversized") {
									this.dimensionStatus = WARNED;
									m = OVER_SIZE_POSITION_OK_MSG;
									showHideLink(G, "action_autosize", "visible");
									showHideLink(G, "action_autocenter", "visible")
								} else {
									this.dimensionStatus = WARNED;
									m = "An error occured (270). Cannot determine size"
								}
							}
						}
					} else {
						if ((J >= y && at >= y) && (I <= ab - y && aq <= am - y)) {
							this.dimensionStatus = WARNED;
							E = HIDDEN;
							m = UNDER_SIZE_POSITION_OK_MSG;
							if (Math.abs(J - (ab - I)) > 1) {
								showHideLink(G, "action_autocenter", "visible")
							}
							showHideLink(G, "action_autosize", "visible");
							showHideLink(G, "action_changebackground", "visible")
						} else {
							if ((at <= y && aq > am - y) && (Math.abs(J - (ab - I)) <= 1)) {
								this.dimensionStatus = WARNED;
								m = POSITION_WARN_MSG;
								showHideLink(G, "action_autosize", "visible")
							} else {
								this.dimensionStatus = WARNED;
								if (x == "perfectlySized") {
									m = POSITION_WARN_MSG;
									showHideLink(G, "action_autoposition", "visible")
								} else {
									if (x == "sufficientlySized") {
										m = POSITION_WARN_MSG;
										showHideLink(G, "action_autocenter", "visible")
									} else {
										if (x == "sizedtofit") {
											m = POSITION_WARN_MSG;
											showHideLink(G, "action_autoposition", "visible")
										} else {
											if (x == "oversized") {
												m = POSITION_WARN_MSG;
												showHideLink(G, "action_autosize", "visible");
												showHideLink(G, "action_autocenter", "visible")
											} else {
												if (x == "mixedOrientation") {
													m = MIXED_POSITION_WARN_MSG;
													showHideLink(G, "action_autosize", "visible");
													showHideLink(G, "action_rotate_left", "visible");
													showHideLink(G, "action_rotate_right", "visible")
												} else {
													if (x == "undersized") {
														m = POSITION_WARN_MSG;
														showHideLink(G, "action_autosize", "visible");
														showHideLink(G, "action_autocenter", "visible")
													} else {
														this.dimensionStatus = WARNED;
														m = "An error occured (312). Cannot determine size"
													}
												}
											}
										}
									}
								}
							}
						}
					}
					B.ComputedGuideStatus = this.dimensionStatus;
					B.dimensionMsg = m;
					if (B.GuideStatus != HIDDEN || N) {
						if (this.dimensionStatus != CHECKED && N) {
							B.GuideStatus = WARNED
						}
						if (B.GuideStatus != this.dimensionStatus && (B.GuideStatus != OVERRIDE || this.dimensionStatus == FAILED)) {
							B.GuideStatus = this.dimensionStatus;
							B.GuideStatusDateTime = A.getTime()
						}
					}
				} else {
					if (G.StationInternalName == "position" && B.GuideStatus == "override" && B.GuideInternalName == "Dimensions" && !(B.ComputedGuideStatus && B.ComputedGuideStatus == CHECKED)) {
						var J = parseFloat(u.x);
						var I = J + parseFloat(u.w);
						B.dimensionMsg = POSITION_WARN_MSG;
						showHideLink(G, "action_autosize", "visible");
						if (Math.abs(J - (ab - I)) > 1) {
							showHideLink(G, "action_autocenter", "visible")
						}
					}
				}
				B = this.ds.getGuideStatus("Resolution");
				var Z = new Array();
				B.RES_MSG_LIST = Z;
				var Y = false;
				var ae = -1;
				var ai = false;
				for (var ak = 0; ak < this.ds.gobjects.length; ak++) {
					if (this.ds.gobjects[ak].type == "image") {
						if (this.ds.gobjects[ak].getImageSrc() == null) {
							continue
						}
						var ao = this.ds.gobjects[ak]["artworkResolution"];
						if (ao == 0) {
							continue
						}
						if (ao < ae || ae == -1) {
							ae = ao
						}
						ai = ak != 0;
						if (ao < 250) {
							var ac = new Object();
							ac.imageFile = this.ds.gobjects[ak].imageFile;
							ac.name = ak == 0 ? this.ds.artworkName: this.ds.gobjects[ak]["name"];
							if (ac.name == null) {
								ac.name = ac.imageFile
							}
							ac.resolution = ao;
							ac.idx = ak;
							Z.push(ac);
							this.ds.gobjects[ak]["isLowRes"] = true
						}
					}
				}
				B.ComputedGuideStatus = null;
				var a = this.ds.getGuideStatus("lowResCheckoff");
				if (ae != -1 && (B.GuideStatus != HIDDEN || (N && L) || V)) {
					var aj = "";
					var q = "";
					if (ae > 0) {
						if (ae >= 300) {
							RESOLUTION_BASE_TITLE = RESOLUTION_BASE_TITLE_OK;
							if (B.GuideStatus != HIDDEN) {
								B.GuideStatus = HIDDEN
							}
							B.ComputedGuideStatus = CHECKED;
							if (ae >= 400) {
								RESOLUTION_QUALITY = RESOLUTION_OPTIMAL_QUALITY_2
							} else {
								RESOLUTION_QUALITY = RESOLUTION_OPTIMAL_QUALITY
							}
							a.GuideStatus = HIDDEN
						} else {
							if (ae >= 250 && ae < 300) {
								RESOLUTION_BASE_TITLE = RESOLUTION_BASE_TITLE_OK;
								B.GuideStatus = CHECKED;
								B.ComputedGuideStatus = CHECKED;
								if (ae >= 275) {
									RESOLUTION_QUALITY = RESOLUTION_OK_QUALITY_2
								} else {
									RESOLUTION_QUALITY = RESOLUTION_OK_QUALITY
								}
								a.GuideStatus = HIDDEN
							} else {
								RESOLUTION_BASE_TITLE = RESOLUTION_BASE_TITLE_WARN;
								B.GuideStatus = WARNED;
								B.ComputedGuideStatus = WARNED;
								a.GuideStatus = WARNED;
								if (ae >= 200) {
									RESOLUTION_QUALITY = RESOLUTION_LOW_QUALITY
								} else {
									if (ae >= 150) {
										RESOLUTION_QUALITY = RESOLUTION_LOW_QUALITY_2
									} else {
										RESOLUTION_QUALITY = RESOLUTION_LOW_QUALITY_3
									}
								}
								var C = false;
								Z = B.RES_MSG_LIST;
								var X = Z.length;
								for (var al = 0; al < X; al++) {
									var ac = Z[al];
									if (ac.idx == 0) {
										C = true
									}
									var W = ac.name;
									if (W == null) {
										W = ""
									}
									if (W.length > 35) {
										W = W.substring(0, 35) + "<br/>" + W.substring(35)
									}
									q += '<p class="imageName" style="cursor:pointer" onmouseover="hoverOnObject(' + ac.idx + '); return false;">' + W + "</p>"
								}
								if (Z.length > 0) {
									var an = B.GuideStatus == OVERRIDE;
									q += '<p class="solutionsTitle">To fix this issue you can:</p>';
									q += '<ul class="solutions">\n';
									q += '<li class="guideBullet2">Resize Image</li>';
									q += '<li class="guideBullet2"><a onclick="designer.changeImage(true);">Replace image</a></li>';
									q += '<li class="guideBullet2">Approve the existing image (click checkbox below)</li>'
								}
								q += "</ul>\n";
								aj = RESOLUTION_LOW_MSG_2;
								aj += q
							}
						}
						Y = true;
						var K = B.ComputedGuideStatus
					} else {
						aj = RESOLUTION_UNKNOWN_MSG;
						B.GuideStatus = CHECKED
					}
					B.resolutionMsg = aj
				} else {
					B.resolutionMsg = RESOLUTION_UNKNOWN_MSG;
					B.GuideStatus = HIDDEN
				}
			}
		}
		this.update0thDwStatus(N);
		B = this.ds.getGuideStatus("designHelp");
		if (K == WARNED || this.dimensionStatus == WARNED) {
			B.GuideStatus = NONE
		} else {
			B.GuideStatus = HIDDEN
		}
		var z = Get_Cookie("galleryprivate");
		if (z == null) {
			z = "false"
		}
		if ((window.location.hostname.indexOf("psprintfordeluxe") != -1) && (z != "false")) {
			B = this.ds.getGuideStatus("designServiceHelp");
			if (B.GuideStatus == HIDDEN && (designer.currentSide == 1)) {
				B.GuideStatus = WARNED;
				this.ds.getGuideStatus("finalCheckoff")["GuideStatus"] = CHECKED
			} else {
				if (designer.currentSide > 1) {
					B.GuideStatus = HIDDEN
				}
			}
		} else {
			B = this.ds.getGuideStatus("designServiceHelp");
			B.GuideStatus = HIDDEN
		}
		var S = false;
		for (var ak = 0; ak < this.ds.gobjects.length; ak++) {
			if (this.ds.gobjects[ak].type == "image") {
				if (this.ds.gobjects[ak].imageFile == null) {
					continue
				}
				S = true;
				break
			}
		}
		B = this.ds.getGuideStatus("Resolution");
		B._not_applicable_ = !S;
		var a = this.ds.getGuideStatus("lowResCheckoff");
		a._not_applicable_ = !S;
		var R = false;
		var ag = 0;
		var U = 0;
		for (var ak = 1; ak < this.ds.gobjects.length; ak++) {
			var af = this.ds.gobjects[ak];
			if (af.type == "image") {
				if (af.imageFile == null) {
					continue
				}
				R = true;
				var ad = af.isReplaced;
				if (ad == null) {
					ad = "false"
				} else {
					ad = ad.toLowerCase()
				}
				if (ad != "true") {
					if (af.logoImage) {
						ag++
					} else {
						if (af.placeHolderImage) {
							U++
						}
					}
				}
			}
		}
		B = this.ds.getGuideStatus("overlayImage");
		if (ag == 0 && U == 0) {
			B.GuideStatus = HIDDEN
		} else {
			if (B.GuideStatus != OVERRIDE) {
				B.GuideStatus = WARNED
			}
		}
		B = this.ds.getGuideStatus("CustomImage");
		B._not_applicable_ = !R;
		B = this.ds.getGuideStatus("Placement");
		if (R && G.StationInternalName == "position") {
			if (B.GuideStatus != WARNED && !B._not_applicable_ && (N || (B.GuideStatus != OVERRIDE && B.GuideStatus != CHECKED))) {
				for (var ak = 1; ak < this.ds.gobjects.length; ak++) {
					u = this.ds.gobjects[ak];
					if (u.type != "image") {
						continue
					}
					var J = parseFloat(u.x);
					var at = parseFloat(u.y);
					var I = J + parseFloat(u.w);
					var aq = at + parseFloat(u.h);
					if (J < y || at < y || (I > ab - y) || (aq > am - y)) {
						B.GuideStatus = WARNED;
						B._not_applicable_ = false;
						break
					}
				}
			}
		}
		this._executeOverlappingObjGuide(N || L || T);
		designer.updateCalloutFlags(this.ds);
		var H = false;
		var F = true;
		for (var ak = 1; ak < this.ds.gobjects.length; ak++) {
			if (this.ds.gobjects[ak].type == "textarea") {
				H = true;
				if (!this.ds.gobjects[ak].changed) {
					F = false
				}
			}
		}
		B = this.ds.getGuideStatus("CustomText");
		B._not_applicable_ = !H;
		if (F) {
			B.GuideStatus = CHECKED
		}
		B = this.ds.getGuideStatus("designName");
		if (designer.wfe.designNameError) {
			B.GuideStatus = WARNED
		} else {
			if (designer.wfe.designName == "") {
				B.GuideStatus = PENDING
			} else {
				B.GuideStatus = CHECKED
			}
		}
		if (this.ds.gobjects[0]["ArtworkSource"] == "custom") {
			B = this.ds.getGuideStatus("uploadFile");
			if (B.GuideStatus != OVERRIDE) {
				B.GuideStatus = this.ds.gobjects[0].bgCleared ? HIDDEN: PENDING
			}
		} else {
			B = this.ds.getGuideStatus("uploadFile");
			B.GuideStatus = HIDDEN
		}
		this.updateDSStatus();
		if (!D) {
			designer.pageNail.updatePagNailStatus();
			this.showMessage(g)
		}
	},
	executeOverlappingObjGuide: function(a) {
		this._executeOverlappingObjGuide(a);
		this.updateDSStatus();
		designer.pageNail.updatePagNailStatus();
		this.showMessage(true)
	},
	_executeOverlappingObjGuide: function(g) {
		var y = designer.wfe.getCurrentStation();
		if (y.StationInternalName == "position") {
			gs = this.ds.getGuideStatus("overlap");
			if (!g && gs.GuideStatus == OVERRIDE) {
				return
			}
			gs.GuideStatus = HIDDEN;
			var o = this.ds.gobjects;
			var m = o.length;
			if (m > 2) {
				var u = false;
				for (var x = 1; x < m; x++) {
					if (o[x].type != "textarea") {
						continue
					}
					var a = o[x].getBound();
					for (var q = x + 1; q < m; q++) {
						if (o[q].type != "textarea") {
							continue
						}
						var b = o[q].getBound();
						if (a.intersects(b)) {
							gs.GuideStatus = WARNED;
							u = true;
							break
						}
					}
					if (u) {
						break
					}
				}
			}
		}
	},
	update0thDwStatus: function(o) {
		var q = this.ds.getGuideStatus("Bleeds")["GuideStatus"];
		if (this.ds.gobjects.length == 0) {
			return
		}
		var g = this.ds.gobjects[0];
		var b = designer.wfe.getCurrentStation();
		if (g.getImageSrc() != null) {
			var m = g.getImageSrc();
			gs = this.ds.getGuideStatus("Bleeds");
			gs._not_applicable_ = g.imageFile == null;
			if ((gs.GuideStatus != OVERRIDE && (b.StationInternalName == "position" || gs.GuideStatus != CHECKED)) && (this.dimensionStatus == WARNED || this.dimensionStatus == CHECKED)) {
				gs.GuideStatus = q;
				gs.bleedMsg = BLEED_MSG
			}
			var a = gs.GuideStatus;
			gs = this.ds.getGuideStatus("Placement");
			if (b.StationInternalName == "position") {
				if (o || (gs.GuideStatus != OVERRIDE && gs.GuideStatus != CHECKED)) {
					if (a == HIDDEN) {
						gs.GuideStatus = HIDDEN;
						gs._not_applicable_ = true
					} else {
						gs.GuideStatus = WARNED;
						gs._not_applicable_ = false
					}
				}
			}
			gs = this.ds.getGuideStatus("Dimensions");
			gs._not_applicable_ = g.imageFile == null
		} else {
			gs = this.ds.getGuideStatus("Bleeds");
			gs._not_applicable_ = true;
			gs = this.ds.getGuideStatus("Placement");
			gs._not_applicable_ = true;
			gs.GuideStatus = HIDDEN;
			gs = this.ds.getGuideStatus("Dimensions");
			gs._not_applicable_ = true
		}
	},
	updateDSStatus: function() {
		if (designer.wfe == null) {
			return
		}
		var b = designer.wfe.getCurrentStation();
		var u = b.guideList[0];
		var o = u.guide;
		var x = designer.getRole();
		var a = CHECKED;
		for (var m = 0; m < o.length; m++) {
			var q = o[m];
			if ((x != "admin" && q.GuideRole == "admin") || q.GuideStatusBy == "none") {
				continue
			}
			var r = this.ds.getGuideStatus(q.GuideInternalName);
			if (r.GuideStatus == NONE || r.GuideStatus == HIDDEN || r._not_applicable_) {
				continue
			}
			if (r.GuideStatus == WARNED && a == CHECKED) {
				a = WARNED
			} else {
				if (r.GuideStatus == PENDING && a != FAILED) {
					a = PENDING
				} else {
					if (r.GuideStatus == FAILED) {
						a = FAILED;
						break
					}
				}
			}
		}
		this.ds.dsStatus = a
	},
	showMessage: function(a) {
		if (designer && designer.wfe != null) {
			if (a) {
				designer.wfe.updateState()
			} else {
				designer.wfe.updateGuideStatus()
			}
		}
		showArtworkDisplayName(designer.wfe.designName);
		designer.setDSStatus(this)
	}
});
PsP.WorkFlowEngine = Class.create({
	initialize: function() {},
	init: function(m) {
		registerAppBubbles(m);
		this.artwork = m;
		this.designName = getDesignName();
		var u = $("annotationTool");
		if (u != null) {
			setDisplayStyle(u, this.artwork.currentStation == "gettingStarted" ? "none": "")
		}
		this.designNameError = false;
		this.numOfPages = 0;
		if (this.artwork.workflow != null && this.artwork.workflow.length) {
			var b = this.artwork.workflow[0]["station"];
			if (b != 0 && b.length) {
				this.numOfPages = b.length
			}
		}
		this.actionSummary = $("actionSummary");
		this.nextButton = $("nextAction");
		var o = this.artwork.currentStation;
		if (this.nextButton != null) {
			this.nextButton.onclick = this.doNextAction.bind(this, o != "position");
			this.page = 0
		} else {
			this.page = 1
		}
		if (o != null) {
			var a = this.getStationIndexByName(o);
			if (a != -1) {
				this.page = a
			}
		}
		this.prevButton = $("previousAction");
		if (this.prevButton != null) {
			this.prevButton.onclick = this.doPreviousAction.bind(this, false)
		}
		var r = $("pdfDownLoad");
		if (r) {
			var q = String(designer.artwork.pdfURL);
			if (q != "" && q != "undefined") {
				if (q.indexOf("/") > 0) {
					r.href = "../gallery/" + designer.artwork.pdfURL + "?ts=" + (new Date()).getTime()
				} else {
					var g = "/";
					if (this.endsWith(previewImageURL, "/") || this.startsWith(designer.artwork.pdfURL, "/")) {
						g = ""
					}
					r.href = previewImageURL + g + designer.artwork.pdfURL + "?ts=" + (new Date()).getTime()
				}
			} else {
				setDisplayStyle("e2", "none")
			}
		}
		designer.wfe = this;
		this.role = designer.getRole();
		if (this.role == null) {
			this.role = "user"
		} else {
			this.role = this.role.toLowerCase();
			if (this.role == "customer" || this.role == "user" || this.role == "") {
				this.role = "user"
			} else {
				this.role = "admin"
			}
		}
		this.computeAllStatusForCurrentStation();
		this.updateState()
	},
	endsWith: function(g, b) {
		var a = false;
		if (g && b) {
			a = g.indexOf(b, g.length - b.length) !== -1
		}
		return a
	},
	startsWith: function(g, b) {
		var a = false;
		if (g && b) {
			a = g.indexOf(b) === 0
		}
		return a
	},
	gotoStation: function(a) {
		this.page = this.getStationIndexByName(a);
		designer.stationChanged(true);
		this.updateState()
	},
	getCurrentStation: function() {
		var a = this.getStation(this.page);
		return a
	},
	isStationScopePage: function(a) {
		var b = a.StationUnitOfWork;
		if (b == null || b == "Page") {
			return true
		}
		return false
	},
	computeAllStatusForCurrentStation: function() {
		for (var a = 0; a < designer.surfaces.length; a++) {
			var b = designer.surfaces[a];
			b.br.update0thDwStatus();
			b.br.updateDSStatus()
		}
		designer.pageNail.updatePagNailStatus()
	},
	guideInErrorOK: function() {
		designer.setEditTextDialogShouldHideFlag(true);
		hideDialogWin();
		var y = this.getStation(this.page);
		var r = y.guideList[0];
		var a = r.guide;
		var x = -1;
		for (var o = 0; o < designer.surfaces.length; o++) {
			var b = designer.surfaces[o];
			for (var q = 0; q < a.length; q++) {
				var u = a[q];
				if (y.StationInternalName == "upload" && u.GuideType != "annotation") {
					continue
				}
				if ((this.role != "admin" && u.GuideRole == "admin") || u.GuideStatusBy == "none") {
					continue
				}
				var m = b.getGuideStatus(u.GuideInternalName);
				if (m.GuideStatus == WARNED || m.GuideStatus == PENDING || m.GuideStatus == FAILED) {
					x = o;
					break
				}
			}
			if (x != -1) {
				break
			}
		}
		if (x != -1 && designer.surfaces[x] != designer.currentSurface) {
			designer.pageNail.selectTN(x, null, true)
		}
	},
	saveDocPlayerMode: function(a) {
		if (designer.currentSide < designer.surfaces.length) {
			var b = designer.currentSide;
			designer.pageNail.selectTN(b, null, true);
			return false
		} else {
			this.page = this.getStationIndexByName("finalReview");
			saveAllTabs();
			if (a == "position") {
				designer.currentSurface.saveObjectsState("position")
			}
			this.saveDoc(a == "position" ? "finalReview": "", true);
			return true
		}
	},
	doNextAction: function(x) {
		designNameSaver.resetDesignNameInStore();
		designer.hideEditorDialogs();
		var D = this.getStation(this.page);
		if (!x && (designer.currentSide < designer.surfaces.length && this.isStationScopePage(D))) {
			var g = designer.currentSide;
			designer.pageNail.selectTN(g, null, true);
			return
		}
		var u = this.getOverallStatus();
		if (u != "checked") {
			var o = GUIDE_CHECK_REQUIRED.text + this.getErrors();
			showMessageDialog(o, "Request", GUIDE_CHECK_REQUIRED.width, -1, this.guideInErrorOK.bind(this));
			return
		}
		if ((designer.artwork.PsPFunction != null && String(designer.artwork.currentStation) == "finalReview") || (String(designer.artwork.paymentStatus) == "Approved" && String(designer.artwork.currentStation) == "finalReview")) {
			$("nextAction").disabled = "disabled";
			var E = readpspURL + "?psp_name=" + designer.pspFile;
			var C = Get_Cookie("pspspassport");
			if (C != null) {
				E = E + "&pspspassport=" + C
			}
			designer.addTag("designStatus", "Approved");
			showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 800000);
			designer.saveDoc(function z() {
				window.location.href = E;
				return
			});
			return
		}
		var D = this.getStation(this.page);
		if (D.StationInternalName == "finishing") {
			var b = D.NextStationInternalName;
			if (D.StationInternalName == "finishing") {
				b = null
			}
			this.saveWithQuoteOptions(b);
			return
		}
		if (this.artwork.templateType == "downloadPDF") {
			var A = $("downloadpdf");
			var E = designer.artwork.pdfURL;
			if (E.indexOf("/") > 0) {
				A.href = "../gallery/" + E + "?" + (new Date()).getTime()
			} else {
				debugA(previewImageURL + E);
				var a = previewImageURL + E;
				window.open(a, "PC", "toolbar=yes,status=yes,scrollbars=yes,location=yes,menubar=yes,directories=yes");
				var B = parseInt(designer.artwork.viewsCount) + 1;
				designer.addTag("viewsCount", B);
				designer.saveDoc(function z() {
					InitializeServiceIndexing(designer.artwork.jobId);
					return
				})
			}
			return false
		}
		var y = false;
		var r = null;
		var q = D.StationInternalName;
		if (this.numOfPages == 1) {
			r = "prevStation";
			y = true
		} else {
			if (this.page < (this.numOfPages - 1)) {
				var m = this.getNextStation();
				var D = this.getStation(m);
				if (designer.artwork.Level && (designer.artwork.Level.toLowerCase() != "private")) {
					this.designNameChanged();
					return
				}
				this.page = m;
				if (q == "finalReview") {
					y = true;
					r = "finishingPage"
				} else {
					if (D != null) {
						y = true;
						r = D.StationInternalName
					} else {
						designer.pageNail.selectTN(0, null)
					}
				}
			} else {
				if (q == "finalReview") {
					y = true;
					r = "finishingPage"
				}
			}
		}
		if (y) {
			if (q == "position" && q != this.getCurrentStation()) {
				designer.currentSurface.saveObjectsState("position");
				if (designer.isGridShown()) {
					designer.gridToggle(false)
				}
			}
		}
		if (r == "finishingPage") {
			if (designer.isGridShown()) {
				designer.gridToggle(false)
			}
			this.saveWithQuoteOptions("finishing");
			return
		} else {
			if (y) {
				this.saveDoc(r)
			}
		}
	},
	getSaveMode: function() {
		var a = null;
		if (this.numOfPages == 1) {
			a = "finalReview"
		} else {
			if (this.page < (this.numOfPages - 1)) {
				var b = this.getStation(this.page);
				if (b != null) {
					a = b.StationInternalName
				}
			}
		}
		return a
	},
	getNextStation: function() {
		var g = this.getStation(this.page);
		var b;
		if (g == null) {
			return page
		}
		if (g.StationInternalName == "upload") {
			b = this.getStation(this.page + 1);
			if (b == null) {
				return page
			}
			if (b.StationInternalName == "position") {
				var q = true;
				var o;
				var a;
				for (var m = 0; m < designer.surfaces.length; m++) {
					o = designer.surfaces[m];
					a = o.getGuideStatus("Dimensions");
					if (a == null || (a.ComputedGuideStatus != CHECKED && !a._not_applicable_)) {
						debugA("Failed Dimension Check for " + m + " " + a.ComputedGuideStatus);
						q = false;
						break
					}
					a = o.getGuideStatus("Resolution");
					if (a == null || (a.ComputedGuideStatus != CHECKED && a.GuideStatus != HIDDEN && !a._not_applicable_)) {
						debugA("Failed Resolution Check for " + m + " " + a.ComputedGuideStatus + " " + a.GuideStatus);
						q = false;
						break
					}
				}
				if (q) {
					b = this.getStation(this.page + 2);
					if (b != null) {
						debugA("Page to be skipped to : " + b.StationInternalName);
						for (var m = 0; m < designer.surfaces.length; m++) {
							o = designer.surfaces[m];
							a = o.getGuideStatus("Bleeds");
							if (a != null) {
								a.GuideStatus = OVERRIDE
							}
							a = o.getGuideStatus("Placement");
							if (a != null) {
								a.GuideStatus = OVERRIDE
							}
						}
						return this.page + 2
					}
				}
			}
		}
		return this.page + 1
	},
	isChangeNeeded: function(m) {
		var a = false;
		for (var o = 0; o < this.artwork.ds.length; o++) {
			var r = this.artwork.ds[o];
			for (var g = 0; g < r.dw.length; g++) {
				var b = r.dw[g];
				if (b.isReplaced == "true") {
					a = true;
					break
				}
			}
			if (r.isReplaced == "true") {
				a = true;
				break
			}
		}
		var q = designer.artwork.pdfGenerated;
		if (q == null) {
			q = ""
		}
		q = q.toLowerCase();
		return ((m == "finalReview" && q != "true") || chgMgr.isSaveNeeded() || a)
	},
	saveWithQuoteOptions: function(b) {
		var a = designer.verify();
		if (a != "") {
			hideModalMessageDialog();
			a = "The following text appears to be default text from the design template. If you would like to continue and leave the text as is, click 'OK'. <br/>Otherwise, click 'Cancel' and remove this text before completing your design.<br/><br/>" + a;
			showConfirmDialog(a, "Warning", 400, 500, f);
			return
		}
		designer.addTag("designStatus", "Approved");
		saveQuoteOptions(b)
	},
	saveDoc: function(a, g) {
		var b = designer.verify();
		if (b != "") {
			hideModalMessageDialog();
			b = "The following text appears to be default text from the design template. If you would like to continue and leave the text as is, click 'OK'. <br/>Otherwise, click 'Cancel' and remove this text before completing your design.<br/><br/>" + b;
			showConfirmDialog(b, "Warning", 400, 500, f);
			return
		}
		if (this.isChangeNeeded(a) || g) {
			designer.saveDocWithMode(a, true)
		} else {
			this.changeStation(a)
		}
	},
	docSaved: function() {
		var a = this.getStation(this.page);
		if (a == null) {
			return
		}
		if (a.StationInternalName == "finalReview" || this.numOfPages == 1) {
			this.showPDFLink(a)
		}
	},
	goToFinishingPage: function() {
		this.changeStation("finishing")
	},
	_goToFinishingPage: function() {
		if (designer.artwork.Category2 == "Contest") {
			if (loggedInEmail && String(designer.artwork.creatorEmail) == "undefined" || String(designer.artwork.creatorEmail) == "" || String(designer.artwork.creatorEmail) == "Guest" || loggedInEmail.toLowerCase() == String(designer.artwork.creatorEmail).toLowerCase()) {
				var m = Get_Cookie("pspspassport");
				var o = loggedInUser;
				var a = loggedInEmail;
				designer.addTag("creatorName", o);
				designer.addTag("creatorEmail", a);
				designer.saveDoc(function g() {
					return
				});
				var b = galleryPageURL + "?fromcde=true";
				b = b + "&node=PsPrint/Contest";
				var m = Get_Cookie("pspspassport");
				if (m != null) {
					b = b + "&pspspassport=" + m
				}
				if (Get_Cookie("logoutuser") != null) {
					b = b + "&logoutuser=1"
				}
				window.location.href = b
			} else {
				showMessageDialog("You are not authorized to Publish this Contest.", "Permission Denied", 300, 100);
				return
			}
		} else {
			window.location.reload()
		}
	},
	getParameter: function(b) {
		var g = designer.artwork.parameter;
		if (g != null) {
			for (var a = 0; a < g.length; a++) {
				debugA(g[a]["name"] + " : " + g[a]["val"]);
				if (g[a]["name"] == b) {
					return g[a]["val"]
				}
			}
		}
		return null
	},
	showPDFLink: function(a) {
		var m = $("downloadPDFContainer");
		var g = $("downloadPDF");
		if (m != null && g != null && designer.artwork != null && designer.artwork.pdfURL != null && designer.artwork.pdfURL != "") {
			setDisplayStyle(m, "");
			var b = designer.artwork.pdfURL;
			if (b.indexOf("/") > 0) {
				g.href = "../gallery/" + designer.artwork.pdfURL + "?" + (new Date()).getTime()
			} else {
				g.href = previewImageURL + "/" + designer.artwork.pdfURL + "?" + (new Date()).getTime()
			}
		}
	},
	showVQCPDF: function() {
		var a = $("vqcFrame");
		this.showGeneratedPDF(a)
	},
	showLegacyTestContent: function(a) {
		var b = $("generatedPdfFrame");
		if (b && b.checked) {
			$("generatedPdfFrameC").style.display = "";
			this.showGeneratedPDF($("generatedPdfFrameElem"))
		} else {
			if (b) {
				$("generatedPdfFrameC").style.display = "none"
			}
		}
		this.showOriginalFile()
	},
	showGeneratedPDF: function(m) {
		if (m != null && designer.artwork != null && designer.artwork.pdfURL != null && designer.artwork.pdfURL != "") {
			m.style.display = "";
			var b = designer.artwork.pdfURL;
			var g = "#statusbar=0";
			var a = this.getParameter("pdfToolbar");
			if (a == "off") {
				g += "&toolbar=0"
			}
			a = this.getParameter("pdfZoom");
			if (a != null) {
				g += "&zoom=" + a
			}
			if (b.indexOf("/") > 0) {
				m.src = "../gallery/" + designer.artwork.pdfURL + g + "?_tick_=" + (new Date()).getTime()
			} else {
				m.src = previewImageURL + "/" + designer.artwork.pdfURL + g + "?_tick_=" + (new Date()).getTime()
			}
		} else {
			if (m != null) {
				$("generatedPdfFrameC").style.display = "none"
			}
		}
	},
	showOriginalFile: function() {
		var m = $("originalFileFrame");
		if (m && !m.checked) {
			if ($("originalFileFrameC")) {
				$("originalFileFrameC").style.display = "none"
			}
			return
		}
		var b = designer.artwork.ds[designer.currentSide - 1].artworkHighResFile;
		if (b != null) {
			if ($("originalFileFrameC")) {
				$("originalFileFrameC").style.display = ""
			}
			if (b.toLowerCase().lastIndexOf(".pdf") == b.length - 4) {
				m = $("originalFileDivElem");
				if (m) {
					m.style.display = "none"
				}
				m = $("originalFileFrameElem");
				if (m) {
					m.style.display = ""
				}
				if (m) {
					var g = "#statusbar=0";
					var a = this.getParameter("pdfToolbar");
					if (a == "off") {
						g += "&toolbar=0"
					}
					a = this.getParameter("pdfZoom");
					if (a != null) {
						g += "&zoom=" + a
					}
					m.src = previewImageURL + "/" + b + g + "?_tick_=" + (new Date()).getTime()
				}
			} else {
				m = $("originalFileFrameElem");
				if (m) {
					m.style.display = "none"
				}
				m = $("originalFileDivElem");
				if (m) {
					m.style.display = ""
				}
				m = $("originalFileImgElem");
				if (m) {
					m.src = previewImageURL + "/" + b + "?_tick_=" + (new Date()).getTime()
				}
			}
		} else {
			if (m != null) {
				if ($("originalFileFrameC")) {
					$("originalFileFrameC").style.display = "none"
				}
			}
		}
	},
	doPreviousAction: function(a) {
		var m = this.getStation(this.page);
		var b = m.StationInternalName;
		if (!a && (designer.currentSide > 1 && this.isStationScopePage(m))) {
			var g = designer.currentSide - 2;
			designer.pageNail.selectTN(g, null, true);
			return
		}
		if (this.page > 0) {
			if (this.page == 1) {
				setDisplayStyle("annotationTool", "none");
				setDisplayStyle("annotationTool", "none");
				setDisplayStyle("addNoteLine", "none")
			}
			var b = m.StationInternalName;
			if (b == "position" && this.page == 1) {
				goBackToGalley()
			} else {
				this.page--;
				var m = this.getStation(this.page);
				if (b == "position" && b != this.getCurrentStation()) {
					designer.currentSurface.saveObjectsState("position")
				}
				if (designer.isGridShown()) {
					designer.gridToggle(false)
				}
				var q = m.StationInternalName;
				this.saveDoc(q)
			}
		} else {
			if (queryString("uploadMode") && queryString("uploadMode") == "true") {
				if (designer.artwork.productGroupName == "Business Cards") {
					window.location.href = baseURL + "productredesign/shared/aspx/cde-shared-main-products.aspx?xmlname=cde-business-cards/xml/cde-business-cards-main-version3.xml&xsltname=shared/xslt/cde-shared-main-products-version3.xslt"
				}
				if (designer.artwork.productGroupName == "Postcards") {
					window.location.href = baseURL + "productredesign/shared/aspx/cde-shared-main-products.aspx?xmlname=cde-postcards/xml/cde-postcards-main-version3.xml&xsltname=shared/xslt/cde-shared-main-products-version3.xslt"
				}
			} else {
				var r = Get_Cookie("pspspassport");
				var o = galleryPageURL;
				var u = designer.artwork.productGroupName;
				if (u) {
					u = u.replace(/ /g, "-");
					o = o + u.toLowerCase() + "/"
				}
				o = o + "?fromcde=true";
				if (r != null) {
					o = o + "&pspspassport=" + r
				}
				if (Get_Cookie("logoutuser") != null) {
					o = o + "&logoutuser=1"
				}
				window.location.href = o
			}
		}
	},
	setParametersAsNewTamplate: function() {
		if (designer.currentSurface.getGuideStatus(GUIDE_INTERNAL_NAME).GuideStatus === OVERRIDE) {
			for (var b = 0; b < designer.surfaces.length; b++) {
				var a = designer.surfaces[b].getGuideStatus(GUIDE_INTERNAL_NAME);
				a.GuideStatus = WARNED;
				a.GuideStatusDateTime = new Date().getTime()
			}
			designer.artwork[NAME_TAG] = TAG_DESIGN_STATUS_VALUE;
			designer.saveDoc(function g() {
				console.log("For reorder, after saveDoc callback is fired");
				InitializeServiceIndexing(designer.artwork_uuid)
			},
			SAVE_MODE, true)
		}
	},
	updateState: function() {
		var D;
		var C = this.getStation(this.page);
		this.nameGuide = null;
		var C = this.getStation(this.page);
		var a = navigator.userAgent.toLowerCase();
		if (a.indexOf("msie ") != -1) {
			var u = parseFloat(a.substring(a.indexOf("msie ") + 5))
		}
		if (C.StationInternalName == "position") {
			this.setParametersAsNewTamplate();
			var y = $("nextLabel");
			if (y) {
				D = designer.currentSide < designer.surfaces.length ? "Continue": "Review";
				y.innerHTML = D;
				if (u < 9) {
					y.style.fontSize = "10px"
				}
			}
			y = $("previuosLabel");
			if (y) {
				var E = isSuperAdmin();
				D = designer.currentSide > 1 ? "BACK": E ? "Design Info": "BACK";
				y.innerHTML = D;
				if (u < 9) {
					y.style.fontSize = "10px"
				}
			}
			y = $("nextAction");
			if (y) {
				D = designer.currentSide < designer.surfaces.length ? "Customize " + designer.surfaces[designer.currentSide]["ArtworkDisplayName"] : "Review the design";
				y.title = D
			}
			y = $("previousAction");
			if (y) {
				D = designer.currentSide > 1 ? "Customize " + designer.surfaces[designer.currentSide - 2]["ArtworkDisplayName"] : "Choose a design to suit your situation";
				y.title = D
			}
			y = $("saveDesign");
			if (y) {
				if (designer.artwork.storeId == "35" || designer.artwork.storeId == "67") {
					setDisplayStyle("saveDesign", "none")
				}
			}
		}
		if (C.StationInternalName == "finalReview") {
			setDisplayStyle("emailink", "none");
			if (String(designer.artwork.CanbePublished) != "undefined" && String(designer.artwork.CanbePublished) != null) {
				if (String(designer.artwork.CanbePublished) == "Yes") {
					setDisplayStyle("saveStoreDiv", "")
				}
			}
		} else {
			setDisplayStyle("emailink", "none");
			setDisplayStyle("emailiboxfinal", "none")
		}
		setDisplayStyle("annotationTool", C.StationInternalName == "gettingStarted" ? "none": "");
		setDisplayStyle("addNoteLine", C.StationInternalName == "gettingStarted" ? "none": "");
		designer.disableEditing(C.StationInternalName != "position");
		designer.disableUpload(C.StationInternalName != "upload");
		y = $("showCalloutContainer");
		if (y != null) {
			setDisplayStyle(y, C.StationInternalName == "position" ? "": "none")
		}
		if (C.StationInternalName == "finalReview") {
			if (C.NextStationInternalName == null) {
				C.NextStationInternalName = "purchase"
			}
			if (C.NextStationDisplayName == null) {
				C.NextStationDisplayName = "Finishing Page"
			}
		}
		if (C == null) {
			this.hideAll();
			return
		}
		if (this.actionSummary != null) {
			setDisplayStyle(this.actionSummary, "");
			this.actionSummary.innerHTML = C.actionSummary
		}
		if (this.nextButton != null) {
			if (designer.currentSide < designer.surfaces.length && this.isStationScopePage(C)) {} else {
				if (this.artwork.templateType == "downloadPDF") {} else {
					var B = this.getStation(this.getNextStation());
					D = null;
					if (B != null) {
						D = B.StationDisplayName
					}
					if (D == null) {
						D = C.NextStationDisplayName
					}
				}
			}
		}
		if (C.guideList != null && C.guideList.length > 0) {
			var x = C.guideList[0];
			y = $("GuideListDisplayName");
			if (y != null) {
				y.innerHTML = x.GuideListDisplayName
			}
		}
		var r = $("GuideListTableBody");
		removeAll(r);
		var z = 0;
		if (C.guideList != null && C.guideList.length > 0) {
			var x = C.guideList[0];
			var b = x.guide;
			if (b != null && b.length) {
				for (var q = 0; q < b.length; q++) {
					var A = b[q];
					var g = designer.currentSurface;
					var o = g.getGuideStatus(A.GuideInternalName);
					if (o._not_applicable_) {
						continue
					}
					if (o.GuideStatus != "hidden") {
						z = z + 1
					}
					this.addGuide(r, b[q], true);
					if (C.StationInternalName == "upload" && b[q]["guideCheckElement"] != null && b.GuideType == "annotation") {
						b[q]["guideCheckElement"].style.visibility = "hidden"
					}
				}
			}
		}
		setDisplayStyle("guideHelpHintsDiv", z == 0 ? "none": "");
		if (C.StationInternalName == "finalReview") {
			var y = $("addProof");
			var m = designer.artwork.parameter;
			if ((m != null) && y) {
				for (var q = 0; q < m.length; q++) {
					optionName = m[q]["displayName"];
					optionValue = m[q]["val"];
					if (optionName != undefined && optionName.match("proof")) {
						if (y) {
							if (optionValue == "None") {
								y.style.display = "";
								y.onclick = this.proofClicked.bindAsEventListener(this)
							} else {
								y.style.display = "none"
							}
						}
					}
				}
			}
			this.showPDFLink(C)
		} else {
			y = $("downloadPDFContainer");
			if (y != null) {
				setDisplayStyle(y, "none")
			}
		}
		showArtworkDisplayName(this.designName);
		designer.refreshAll();
		this.updateGuideStatus();
		if ($("productContent") && (designer.artwork.currentStation == "finishing" || playMode)) {
			$("productContent").style.display = ""
		}
	},
	getSideName: function(a) {
		var g = designer.surfaces[a];
		var b = g.ArtworkDisplayName;
		if (b != null) {
			return b
		}
		if (a == 0) {
			b = "Front Side"
		} else {
			b = "Back Side"
		}
		return b
	},
	getStation: function(b) {
		if (this.artwork.workflow == null) {
			return null
		}
		if (this.artwork.workflow.length == 0) {
			return null
		}
		var a = this.artwork.workflow[0]["station"];
		if (a == null || a.length - 1 < b) {
			return null
		}
		return a[b]
	},
	getStationIndexByName: function(b) {
		var a = this.artwork.workflow[0]["station"];
		if (a == null) {
			return - 1
		}
		for (var g = 0; g < a.length; g++) {
			if (a[g]["StationInternalName"] == b) {
				return g
			}
		}
		return - 1
	},
	updateGuideStatus: function() {
		var m = this.getStation(this.page);
		if (m == null) {
			return
		}
		if (m.guideList == null || (!m.guideList.length > 0)) {
			return null
		}
		var r = m.guideList[0];
		var b = r.guide;
		if (b == null) {
			return
		}
		for (var o = 0; o < b.length; o++) {
			var q = b[o];
			if (this.role != "admin" && q.GuideRole == "admin") {}
			this.updateOneGuideStatus(q, true)
		}
		var a = this.getOverallStatus();
		if (this.nextButton) {}
	},
	getOverallStatus: function() {
		var y = this.getStation(this.page);
		if (y == null) {
			return
		}
		if (y.guideList == null || (!y.guideList.length > 0)) {
			return null
		}
		var r = y.guideList[0];
		var a = r.guide;
		if (a == null) {
			return
		}
		var x = CHECKED;
		for (var o = 0; o < designer.surfaces.length; o++) {
			var b = designer.surfaces[o];
			for (var q = 0; q < a.length; q++) {
				var u = a[q];
				if (y.StationInternalName == "upload" && u.GuideType != "annotation") {
					continue
				}
				if ((this.role != "admin" && u.GuideRole == "admin") || u.GuideStatusBy == "none") {
					continue
				}
				var m = b.getGuideStatus(u.GuideInternalName);
				if (m.GuideStatus == NONE || m.GuideStatus == HIDDEN || m._not_applicable_ || u.GuideInternalName == "designServiceHelp") {
					continue
				}
				if (m.GuideStatus == WARNED && x == CHECKED) {
					x = WARNED
				} else {
					if (m.GuideStatus == PENDING && x != FAILED) {
						x = PENDING
					} else {
						if (m.GuideStatus == FAILED) {
							x = FAILED;
							break
						}
					}
				}
			}
			if (x == FAILED) {
				break
			}
		}
		return x
	},
	proofClicked: function(a) {
		var o = a.target ? a.target: a.srcElement;
		var b = o.id == "yesProof" ? "Standard Hardcopy": "None";
		var m = designer.artwork.parameter;
		if (m != null) {
			for (var g = 0; g < m.length; g++) {
				optionName = m[g]["displayName"];
				optionValue = m[g]["val"];
				if (optionName.match("proof")) {
					optionValue = b;
					alert(optionValue);
					this.saveDoc("finalReview", true);
					return true
				}
			}
		}
	},
	guideChecked: function(b) {
		if (b.GuideInternalName == "finalCheckoff" || b.GuideInternalName == "PDFProof" || b.GuideInternalName == "hardcopyProof" || b.GuideType == "annotation" || b.GuideType == "QuoteToolOptions" || b.GuideType == "QuoteToolPrice") {
			for (var a = 0; a < designer.surfaces.length; a++) {
				this._guideChecked(designer.surfaces[a], b)
			}
		} else {
			this._guideChecked(designer.currentSurface, b)
		}
		return true
	},
	resolutionCheckClicked: function() {
		var a = document.getElementsByClassName("guideCheckBox");
		var o = true;
		var q;
		for (var b = 0; b < a.length; b++) {
			if (!a[b].checked) {
				o = false;
				break
			}
		}
		var m = this.getGuide(this.getStationByName("position"), "Resolution");
		m.guideCheckElement.checked = o;
		this._guideChecked(designer.currentSurface, m);
		a = document.getElementsByClassName("guideCheckBox");
		for (var b = 0; b < a.length; b++) {
			a[b].checked = o
		}
	},
	_guideChecked: function(o, b) {
		var m = o.getGuideStatus(b.GuideInternalName);
		var q = m.GuideStatus;
		if (b.guideCheckElement.checked) {
			if (b.GuideStatusBy == "user") {
				m.GuideStatus = CHECKED
			} else {
				m.GuideStatus = OVERRIDE
			}
			b.guideCheckElement.className = "checkboxChecked"
		} else {
			if (m.ComputedGuideStatus != null) {
				m.GuideStatus = m.ComputedGuideStatus
			} else {
				m.GuideStatus = WARNED
			}
			b.guideCheckElement.className = "checkboxDefault"
		}
		m.GuideStatusDateTime = (new Date()).getTime();
		this._updateOneGuideStatus(o, b, true);
		var a = this.getOverallStatus();
		o.br.updateDSStatus();
		designer.pageNail.updatePagNailStatus();
		designer.updateCalloutFlags(o)
	},
	setGuideValue: function(b) {
		b.gstatus["GuideStatus"] = b.val;
		b.guide["guideCheckElement"].checked = !b.guide["guideCheckElement"].checked;
		this._updateOneGuideStatus(b.ds, b.guide, true);
		var a = this.getOverallStatus();
		b.ds.br.updateDSStatus();
		designer.pageNail.updatePagNailStatus()
	},
	hideAll: function() {
		if (this.actionSummary != null) {
			setDisplayStyle(this.actionSummary, "none")
		}
	},
	localURLClicked: function(m) {
		var q = m.target ? m.target: m.srcElement;
		var a = this.getStation(this.page);
		if (a == null) {
			return
		}
		var b = this.getGuide(a, q.name);
		if (b == null) {
			return
		}
		var o = document.createElement("div");
		o.className = "GuideText";
		if (guideInternalName == "designName") {
			o.innerHTML = ""
		} else {
			o.innerHTML = b.GuideText
		}
		var r = new Af.Dialog2(o, b.GuideDisplayName, null, q);
		r.aligned = "right";
		r.width = "360px";
		r.show2("MainArea");
		this.consumeEvent(m);
		return false
	},
	externalURLClicked: function(o) {
		var r = o.target ? o.target: o.srcElement;
		var b = this.getStation(this.page);
		if (b == null) {
			return
		}
		var m = this.getGuide(b, r.name);
		if (m == null) {
			return
		}
		var q = document.createElement("iframe");
		q.className = "GuideText";
		var u = new Af.Dialog(q, m.GuideDisplayName, null);
		u.width = "600px";
		u.height = "600px";
		u.style.top = "200px";
		u.style.zIndex = "2000001";
		q.style.width = "100%";
		q.style.height = "600px";
		u.show("MainArea");
		q.parentNode.style.border = "2px solid #c2c2c2";
		q.src = m.GuidePopUpURL;
		var a = new Af.Draggable(m.GuideInternalName, u.element);
		dndMgr.registerDraggable(a);
		this.consumeEvent(o);
		return false
	},
	localLinkURLClicked: function(o, m, b) {
		var q = document.createElement("div");
		q.className = "GuideText";
		q.innerHTML = m.GuideLinkText;
		var r = new Af.Dialog2(q, m.GuideLinkDisplayName, null, b);
		r.aligned = "right";
		r.width = "523px";
		r.show2("MainArea");
		return false
	},
	createTriangle: function() {
		var b = document.createElement("div");
		b.className = "poppup_triangle-grey-right";
		var a = document.createElement("div");
		a.className = "triangle";
		b.appendChild(a);
		return b
	},
	externalLinkURLClicked: function(r, q, m) {
		var o = q.GuideLinkURL;
		if (o.match("resources")) {
			o = "http://www.psprint.com" + o;
			window.open(o, "", "location=0,status=0,scrollbars=yes,resizable=no,width=700px,height=425px");
			return false
		}
		var u = document.createElement("iframe");
		u.className = "GuideText";
		var x = new Af.Dialog2(u, q.GuideLinkDisplayName, null, m);
		x.width = "563px";
		x.height = "350px";
		x.top = "10px";
		u.style.width = "100%";
		u.style.height = "350px";
		x.show2("MainArea");
		u.src = q.GuideLinkURL;
		u.style.border = "0px";
		var b = new Af.Draggable(q.GuideLinkInternalName, x.element);
		dndMgr.registerDraggable(b);
		x.element.appendChild(this.createTriangle());
		return false
	},
	showMeURLClicked: function(q, o, m) {
		var r = document.createElement("iframe");
		r.className = "GuideText";
		var u = new Af.Dialog(r, "VIDEO GUIDE: " + o.GuideLinkDisplayName, null);
		u.width = "675px";
		u.height = "425px";
		u.top = "200px";
		r.style.width = "100%";
		r.style.height = "425px";
		u.show("MainArea");
		r.parentNode.style.border = "2px solid #c2c2c2";
		r.src = o.showMeURL;
		r.style.border = "0px";
		var b = new Af.Draggable(o.GuideLinkInternalName, u.element);
		dndMgr.registerDraggable(b);
		return false
	},
	consumeEvent: function(a) {
		if (a.stopPropagation) {
			a.stopPropagation()
		} else {
			a.cancelBubble = true
		}
		a.returnValue = false;
		return false
	},
	getGuide: function(b, r) {
		if (b == null) {
			return null
		}
		if (b.guideList == null || (!b.guideList.length > 0)) {
			return null
		}
		var q = b.guideList[0];
		var a = q.guide;
		if (a == null) {
			return
		}
		for (var m = 0; m < a.length; m++) {
			var o = a[m];
			if (this.role != "admin" && o.GuideRole == "admin") {
				continue
			}
			if (o.GuideInternalName == r) {
				return o
			}
		}
		return null
	},
	getErrors: function() {
		var y = this.getStation(this.page);
		if (y == null) {
			return ""
		}
		if (y.guideList == null || (!y.guideList.length > 0)) {
			return null
		}
		var u = y.guideList[0];
		var a = u.guide;
		if (a == null) {
			return ""
		}
		var b = "";
		for (var q = 0; q < designer.surfaces.length; q++) {
			var m = designer.surfaces[q];
			var A = "";
			var z = false;
			for (var r = 0; r < a.length; r++) {
				var x = a[r];
				if (x.visibility == "hidden") {
					continue
				}
				if ((this.role != "admin" && x.GuideRole == "admin") || x.GuideStatusBy == "none" || x.GuideInternalName == "designServiceHelp") {
					continue
				}
				if (x.GuideInternalName == "PDFProof" || x.GuideInternalName == "hardcopyProof") {
					if (q > 0) {
						continue
					}
				}
				var o = m.getGuideStatus(x.GuideInternalName);
				if (o.GuideStatus == HIDDEN || o.GuideStatus == NONE || o._not_applicable_) {
					continue
				}
				if ((o.GuideStatus == WARNED) || (o.GuideStatus == PENDING) && x.GuideInternalName != "getStartedInstructions") {
					if (A == "") {
						A = '<div style="float:left;width:170px;">';
						A += '<div class="GuideTitle">' + m.ArtworkDisplayName + "</div>"
					}
					A += '<div class="GuideText" style="margin-left:20px">' + x.GuideDisplayName + "</div>"
				}
			}
			A += "</div>";
			b += A
		}
		return b
	},
	updateOneGuideStatus: function(b, a) {
		var m = designer.currentSurface;
		this._updateOneGuideStatus(m, b, a)
	},
	_updateOneGuideStatus: function(a, o, r) {
		var b = a.getGuideStatus(o.GuideInternalName);
		var y = b.GuideStatus;
		if (o.guideStatusElement != null) {
			o.guideStatusElement.style.display = "";
			if (y == CHECKED || y == OVERRIDE || y == NONE) {
				o.guideStatusElement.src = "/psp/images2/icon_checklist_check.png";
				if (r && (b.ComputedGuideStatus != CHECKED && ((y == OVERRIDE) || (y == CHECKED))) || y == NONE) {
					o.guideStatusElement.style.display = "none";
					if (o.guideCheckElement != null) {
						o.guideCheckElement.className = "checkboxChecked"
					}
				}
			} else {
				if (y == FAILED) {
					o.guideStatusElement.src = "/psp/images2/icon_checklist_stop.png"
				} else {
					if (y == PENDING) {
						o.guideStatusElement.src = "/psp/images2/icon_checklist_pending.png"
					} else {
						o.guideStatusElement.src = "/psp/images2/icon_checklist_caution.png";
						o.guideStatusElement.alt = "Click checkbox on left to override";
						o.guideStatusElement.title = "Click checkbox on left to override"
					}
				}
			}
		}
		if (o.guideCheckElement != null) {
			var x = o.guideCheckElement;
			var m = null;
			if (x.parentNode && x.parentNode.className === "approveContainer") {
				m = x.parentNode
			}
			if (b.ComputedGuideStatus != CHECKED && y != NONE && r) {
				m.style.display = ""
			} else {
				m.style.display = "none"
			}
			if (o.guideCheckElement != null) {
				o.guideCheckElement.checked = (y == CHECKED || y == OVERRIDE)
			}
		}
		if (o.GuideInternalName == "Dimensions" && b.dimensionMsg != null) {
			var u = o.guideTextElement;
			if (u == null) {
				return
			}
			var q = $("dimensionMsg");
			if (q != null) {
				q.innerHTML = "<p>" + b.dimensionMsg
			} else {
				u.innerHTML = "<p>" + b.dimensionMsg
			}
			setDisplayStyle("e2", "")
		}
		if (o.GuideInternalName == "Resolution" && b.resolutionMsg != null) {
			var u = o.guideTextElement;
			if (u == null) {
				return
			}
			var q = $("resolutionMsg");
			if (q != null) {
				q.innerHTML = "<p>" + b.resolutionMsg
			} else {
				u.innerHTML = "<p>" + b.resolutionMsg
			}
			setDisplayStyle("e2", "")
		}
		if (o.GuideInternalName == "Bleeds" && b.bleedMsg != null) {
			var u = o.guideTextElement;
			if (u == null) {
				return
			}
			var q = $("bleedMsg");
			if (q != null) {
				q.innerHTML = "<p>" + b.bleedMsg
			} else {
				u.innerHTML = "<p>" + b.bleedMsg
			}
			setDisplayStyle("e2", "")
		}
		if (o.GuideInternalName == "uploadFile") {
			var u = o.guideTextElement;
			if (u == null) {
				return
			}
			var y;
			if (b.GuideStatus == OVERRIDE) {
				y = BLANK_PAGE_MSG.replace("[side]", a.ArtworkDisplayName)
			} else {
				y = ""
			}
			u.innerHTML = o.GuideText + y
		}
	},
	swap: function(o, a) {
		var r = o.guideStatusElement;
		var q = o.guideCheckElement;
		var m = r.parentNode;
		var b = q.parentNode;
		m.removeChild(r);
		b.removeChild(q);
		m.appendChild(q);
		b.appendChild(r)
	},
	guideDisplayNameClicked: function(o, b) {
		shoh(b);
		var r = o.guideLink;
		if (r != null) {
			for (var a = 0; a < r.length; a++) {
				var m = r[a];
				if (m.GuideLinkStatus == "hidden") {
					continue
				}
				var q = m.guideLinkElement;
				if (q == null) {
					continue
				}
				q.style.display = q.style.display == "none" ? "block": "none"
			}
		}
		return false
	},
	addGuide: function(b, Q, I) {
		if (Q.visibility == "hidden") {
			return
		}
		var K = "";
		var H = designer.currentSurface.getGuideStatus(Q.GuideInternalName);
		if (H != null) {
			K = H.GuideStatus
		}
		if (K == "hidden" || H._not_applicable_) {
			return
		}
		Q.guideStatusElement = null;
		Q.guideCheckElement = null;
		Q._tr1_ = null;
		Q._tr2_ = null;
		var V = Q.GuideInternalName;
		var m = Q.GuideDisplayName;
		if (V == "Resolution") {
			m = RESOLUTION_BASE_TITLE + " (" + RESOLUTION_QUALITY + ")"
		}
		if (V == "Dimensions") {
			m = m + " " + SIZE_TITLE
		}
		var X = V + "TitleID";
		var r = V + "TextID";
		var q = V + "LinkID";
		var N = m;
		var M = "";
		if (String(designer.artwork["contributed-by"]) != "undefined") {
			M = "(" + designer.artwork["contributed-by"] + ")"
		}
		if ($("Related")) {
			var R = this.getStation(0);
			var O = R.guideList[0];
			var H = O.guide;
			if (H != null && H.length) {
				for (var P = 0; P < H.length; P++) {
					var W = H[P];
					var E = W.GuideInternalName;
					if (V == E) {
						setDisplayStyle("Related", "block")
					} else {
						setDisplayStyle("Related", "none")
					}
				}
			}
		}
		if (V == "designName" && Q.GuideTextList != null && I) {
			o = document.createElement("tr");
			b.appendChild(o);
			A = document.createElement("td");
			o.appendChild(A);
			A.className = "GuideTextList";
			A.colSpan = "3";
			A.innerHTML = Q.GuideTextList
		}
		if (V != "getStartedInstructions") {
			var o = document.createElement("tr");
			b.appendChild(o);
			Q._tr1_ = o;
			var A = document.createElement("td");
			o.appendChild(A);
			A.name = "cell1";
			A.className = "GuideStyle1";
			A = document.createElement("td");
			o.appendChild(A);
			A.className = "GuideCheck";
			A.name = "cell4";
			A = document.createElement("td");
			o.appendChild(A);
			A.className = "GuideTitle";
			A.id = X;
			A.name = "cell2";
			if (V == "designTips") {
				A.innerHTML = N + M
			} else {
				if (V == "designName") {
					A.innerHTML = ""
				} else {
					if (K == OVERRIDE || K == CHECKED && designer.artwork.currentStation == "finalReview" && V != "finalCheckoff") {
						A.innerHTML = m
					} else {
						A.innerHTML = N
					}
				}
			}
			A = document.createElement("td");
			o.appendChild(A);
			A.className = "GuideStatus";
			A.name = "cell3";
			if (Q.GuideStatusBy != "none") {
				var Y = document.createElement("img");
				Q.guideStatusElement = Y;
				A.appendChild(Y)
			}
		}
		if (I) {
			if (Q.GuideText != null) {
				var F = new Element("tr").insert(new Element("td", {
					height: "16",
					bgcolor: "#f1f1f1",
					colspan: "4"
				}).update("&nbsp;"));
				b.appendChild(F);
				o = document.createElement("tr");
				b.appendChild(o);
				Q._tr2_ = o;
				A = document.createElement("td");
				A.colSpan = "2";
				o.appendChild(A);
				A = document.createElement("td");
				A.className = "GuideText";
				A.colSpan = "2";
				o.appendChild(A);
				if (V == "designName") {
					A.innerHTML = ""
				} else {
					A.innerHTML = Q.GuideText
				}
				A.id = r;
				Q.guideTextElement = A;
				var C = Q.guideLink;
				if (C != null) {
					for (var P = 0; P < C.length; P++) {
						var B = C[P];
						if (B.GuideLinkStatus == "hidden") {
							continue
						}
						var U = document.createElement("a");
						B._a_ = U;
						U.href = "#";
						U.name = B.GuideLinkInternalName;
						U.id = this.page;
						U.className = "notes";
						if (B.GuideLinkPosition != null && B.GuideLinkPosition == "learnMore") {
							var D = document.createElement("span");
							D.className = "learnMore";
							D.title = B.GuideLinkURLLabel;
							U.appendChild(D);
							Element.insert($(X), {
								bottom: U
							})
						} else {
							U.innerHTML = B.GuideLinkURLLabel;
							o = document.createElement("tr");
							b.appendChild(o);
							B._tr_ = o;
							A = document.createElement("td");
							o.appendChild(A);
							A.colSpan = "2";
							A = document.createElement("td");
							o.appendChild(A);
							A.className = "GuideText";
							A.colSpan = "2";
							B.guideLinkElement = A;
							A.appendChild(U);
							U.innerHTML = B.GuideLinkURLLabel
						}
						if (B.GuideLinkURL == "local") {
							U.onclick = this.localLinkURLClicked.bind(this, Q, B, U)
						} else {
							var T = trim(B.GuideLinkURL);
							if (T.indexOf("designer.") == 0) {
								U.onclick = this.executeScript.bind(this, Q, B, U)
							} else {
								U.onclick = this.externalLinkURLClicked.bind(this, Q, B, U)
							}
						}
						if (B.showMeURL != null) {
							var U = document.createElement("a");
							A.appendChild(U);
							U.innerHTML = "[Show Me]";
							U.style.margin = "6px";
							U.style.cursor = "pointer";
							U.onclick = this.showMeURLClicked.bind(this, Q, B, U)
						}
					}
				}
				if (K != "none") {
					var z = "checkboxId_" + Math.floor(Math.random() * (100000 - 0) + 0);
					var S = document.createElement("input");
					S.title = "I approve the text/image as is for print";
					S.onclick = this.guideChecked.bind(this, Q);
					S.type = "checkbox";
					S.id = z;
					if (S.checked == false) {
						S.className = "checkboxDefault"
					} else {
						S.className = "checkboxChecked"
					}
					if ((this.role != "admin" && Q.GuideRole == "admin") || !I) {
						S.disabled = true
					}
					Q.guideCheckElement = S;
					var J = document.createElement("tr");
					var y = document.createElement("td");
					y.colSpan = 4;
					J.appendChild(y);
					var u = document.createElement("label");
					u.htmlFor = z;
					var x = document.createElement("span");
					x.innerHTML = "I approve the text/image as is for print";
					var G = document.createElement("div");
					G.className = "approveContainer";
					G.appendChild(S);
					G.appendChild(u);
					G.appendChild(x);
					y.appendChild(G);
					b.appendChild(J)
				}
				var L = new Element("tr").insert(new Element("td", {
					height: "23",
					bgcolor: "#f1f1f1",
					colspan: "4"
				}).update("&nbsp;"));
				b.appendChild(L)
			}
		}
	},
	executeScript: function(g, ln, a) {
		var scr = trim(ln.GuideLinkURL);
		eval(scr);
		return false
	},
	annotationSaved: function(m, o) {
		var b = this.getStationByName(m);
		if (b == null) {
			return
		}
		o.GuideType = "annotation";
		var q = b.guideList[0];
		var a = q.guide;
		a.push(o);
		this.updateState()
	},
	getStationByName: function(b) {
		var a = this.artwork.workflow[0]["station"];
		if (a == null) {
			return null
		}
		for (var g = 0; g < a.length; g++) {
			if (a[g]["StationInternalName"] == b) {
				return a[g]
			}
		}
		return null
	},
	getDesignName: function(b) {
		var a = trim(b._t.value);
		if (a == "") {
			showMessageDialog(DESIGN_NAME_REQUIRED.text, DESIGN_NAME_REQUIRED.subject, DESIGN_NAME_REQUIRED.width, DESIGN_NAME_REQUIRED.height, null, true);
			b._t.value = this.designName;
			return null
		}
		return a
	},
	designNameChanged: function() {
		if (typeof getSequenceNumberURL == "undefined") {
			return
		}
		var g = getSequenceNumberURL + "getSeqNum";
		var b = document.getElementsByTagName("head").item(0);
		var a = document.createElement("script");
		a.setAttribute("type", "text/javascript");
		a.setAttribute("src", g);
		b.appendChild(a);
		this._designNameChanged()
	},
	_designNameChanged: function() {
		if (designer.artwork.Level && designer.artwork.Level.toLowerCase() == "public") {
			this.isNewDesign = "true"
		}
		var g = Get_Cookie("pspspassport");
		var o = loggedInUser;
		var a = loggedInEmail;
		var m = queryString("dt_cid");
		if (g == false) {
			g = defaultPassport
		}
		if (o == false) {
			o = "Guest"
		}
		if (a == false) {
			a = "Guest"
		}
		req = new Af.DataRequest(svcURL, this.renameRequestCompleted.bind(this), this.renameRequestFailed.bind(this), null, requestTimedoutCommon);
		req.addService("DesignerSvc", "renameDesign");
		req.addParameter("jobId", designer.artwork.jobId);
		req.addParameter("isNew", "" + this.isNewDesign);
		showModalMessageDialog("Preparing design for customization...", "Preparing", 300, 100, 500000);
		req.addParameter("pspspassport", g);
		req.addParameter("LOGGED_IN_USER", o);
		req.addParameter("LOGGED_IN_EMAIL", a);
		req.addParameter("cid", m);
		if (_storeId_) {
			req.addParameter("store", _storeId_);
			console.log("put storeId to call store=" + _storeId_)
		} else {
			console.log("can't put storeId to call _storeId_ is not null or undefined")
		}
		_saveQuoteOptions();
		var b = "<quoteToolParameters>\n" + getQuoteToolXML() + "</quoteToolParameters>\n";
		if (b && b.length > 0) {
			req.xmlDoc = b
		}
	},
	renameRequestCompleted: function(m) {
		var r = Seqnum;
		var o = m.responseText;
		var q = designer.getRole();
		var g = customizationURL;
		var u = "";
		o = o.replace(" ", "-").toLowerCase();
		g = g + "/" + o + "-" + r + ".aspx";
		if (AuthUtil.isLoggedIn()) {
			var x = Get_Cookie("pspspassport");
			var b = Get_Cookie("LOGGED_IN_USER");
			var a = Get_Cookie("LOGGED_IN_EMAIL");
			if (b == "Guest") {
				x = defaultPassport
			}
			u = "?pspspassport=" + x
		} else {
			if (queryString("pspspassport")) {
				u = "?pspspassport=" + x
			}
		}
		if (queryString("dt_cid")) {
			u += "&dt_cid=" + queryString("dt_cid")
		}
		g = g + u;
		location.replace(g)
	},
	renameRequestFailed: function(a, b) {
		hideModalMessageDialog();
		showMessageDialog(b, GENERAL_ERROR.subject, GENERAL_ERROR.width, GENERAL_ERROR.height, null, true);
		designer.currentSurface.br.executeRules()
	},
	changeStation: function(a) {
		showModalMessageDialog("Updating your design ... please wait", "Updating", 300, 100);
		var g = new Af.DataRequest(svcURL, this.changeStationRequestCompleted.bind(this), requestFailedCommon, null, requestTimedoutCommon);
		g.addService("DesignerSvc", "changeStation");
		g.addParameter("jobId", designer.artwork.jobId);
		g.addParameter("newStation", a);
		var b = designer.getViewOptionsBitMask();
		if (b != null) {
			g.addParameter("viewOptions", "" + b)
		}
		ajaxEngine.processRequest(g);
		return false
	},
	changeStationRequestCompleted: function(a) {
		this._goToFinishingPage()
	}
});
function isPastFinalReview(a) {
	if (a == "uploadChecklist" || a == "upload" || a == "position" || a == "finalReview" || a == "mailservice") {
		return false
	}
	return true
}
function getDS(a) {
	if (designer.artwork.ds == null) {
		return null
	}
	var b = designer.pageNail.selectedIndex;
	if (designer.artwork.ds.length > b) {
		return designer.artwork.ds[b]
	}
	return null
}
function showArtworkDisplayName(x) {
	var q = getDS();
	if (q != null) {
		var g = q.ArtworkDisplayName;
		if (g == null) {
			g = ""
		}
		var u = $("ArtworkDisplayName");
		if (u != null) {
			u.innerHTML = g
		}
		var m;
		if (designer.pageNail.selectedIndex == 0) {
			m = "Front Side"
		} else {
			m = "Back Side"
		}
		u = $("sideName");
		if (u != null) {
			u.innerHTML = m
		}
		u = $("sideName2");
		if (u != null) {
			u.innerHTML = m
		}
		if (designer.artwork) {
			u = $("jobId");
			if (u != null) {
				u.innerHTML = x
			}
			u = $("designName_topBar");
			if (u != null) {
				var b;
				if (playMode) {
					var b = designer.wfe.getParameter("playerMessage");
					if (b == null) {
						b = x
					}
				} else {
					b = x
				}
				u.innerHTML = b
			}
		}
	}
	if (designer && designer.wfe != null) {
		var a = designer.wfe.getCurrentStation();
		if (a != null) {
			var u = $("StationDisplayName");
			var o = $("RelatedSpecialOffer");
			var m = $("RelatedSeeDesign");
			var g = $("RelatedMoreSpecials");
			if (u != null) {
				u.innerHTML = a.StationDisplayName
			}
			if (o != null) {
				if (String(a.RelatedSpecialOffer) == "undefined") {
					o.innerHTML = "Special Offer: 25% off on templates"
				} else {
					o.innerHTML = a.RelatedSpecialOffer
				}
			}
			if (m != null) {
				if (String(a.RelatedSeeDesign) == "undefined") {
					m.innerHTML = "See Other Designs by " + designer.artwork.creatorName
				} else {
					m.innerHTML = a.RelatedSeeDesign + " " + designer.artwork.creatorName
				}
			}
			if (g != null) {
				if (String(a.RelatedMoreSpecials) == "undefined") {
					g.innerHTML = "More Specials"
				} else {
					g.innerHTML = a.RelatedMoreSpecials
				}
			}
		}
	}
}
function getDesignName() {
	var b = String((designer.artwork.designName));
	if (b != "" && b != "undefined") {
		return b
	}
	b = String(designer.artwork.cropBaseImageURL);
	if (b != "" && b != "undefined") {
		var a = b.lastIndexOf("//");
		if (a < 0) {
			a = b.lastIndexOf("//")
		}
		if (a >= 0) {
			b = b.substring(0, a);
			a = b.lastIndexOf("/");
			if (a >= 0) {
				b = b.substring(a + 1)
			}
		}
	}
	return b
}
Af.ArmButtonFeature2 = Class.create({
	initialize: function(a) {
		this.element = a;
		this.element.onkeydown = this.keyDown.bindAsEventListener(this)
	},
	keyDown: function(b) {
		var a = b.target ? b.target: b.srcElement;
		var g = b.keyCode ? b.keyCode: b.which;
		if (g == 13) {
			setTimeout(this.loseFocus.bind(this, a), 1)
		}
		return true
	},
	loseFocus: function(a) {
		if (is_ie) {
			try {
				a.blur()
			} catch(b) {}
		}
	}
});
function cancelTab() {
	registerAppBubbles(designer.artwork)
}
function setDisplayStyle(b, a) {
	b = $(b);
	if (b) {
		b.style.display = a
	}
}
function BRUploadcompleted() {
	docuploader.hide();
	designer.uploadDialogClosed(true, docuploader.mainImage)
}
function hoverOnObject(a) {
	designer.currentSurface.selectObject(designer.currentSurface.gobjects[a])
}
function resolutionCheckClicked() {
	designer.wfe.resolutionCheckClicked(designer.currentSurface)
}
function goBackToGalley() {
	if (String(designer.artwork.currentStation) != "gettingStarted") {
		var a = (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"));
		console.log("isDeluxStore=" + a);
		if (!a) {
			showYesNoCancelDialog("Would you like to save your design before leaving this page?", "Save and Exit", 426, 100, c, c1)
		} else {
			showConfirmDialog("By going to gallery your changes will be lost. Would you like to continue?", "Exit", 421, 109, c1)
		}
	} else {
		c1()
	}
}
function c() {
	designer.saveDoc(function a() {
		InitializeServiceIndexing(designer.artwork.jobId);
		setTimeout(afterSaveReload, 1)
	},
	null, true)
}
function afterSaveReload() {
	if (queryString("uploadMode") && queryString("uploadMode") == "true") {
		if (designer.artwork.productGroupName == "Business Cards") {
			window.location.href = businesscardsURL
		}
		if (designer.artwork.productGroupName == "Postcards") {
			window.location.href = postcardsURL
		}
	} else {
		if (isSuperAdmin()) {
			designer.wfe.changeStation("gettingStarted")
		} else {
			var g = Get_Cookie("pspspassport");
			var a = galleryPageURL;
			var m = designer.artwork.productGroupName;
			if (m) {
				m = m.replace(/ /g, "-");
				a = a + m.toLowerCase() + "/"
			}
			a = a + "?fromcde=true";
			if (g != null) {
				a = a + "&pspspassport=" + g
			}
			if (Get_Cookie("logoutuser") != null) {
				a = a + "&logoutuser=1"
			}
			if (Get_Cookie("pspspassport") == null) {
				var b = signupURL + "?mode=login&psp=" + psp + "&redirectURL=" + a;
				GB_showCenter("Login", b, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH);
				return
			} else {
				window.location.href = a
			}
		}
	}
}
function c1() {
	if (isSuperAdmin()) {
		designer.wfe.changeStation("gettingStarted")
	} else {
		var b = Get_Cookie("pspspassport");
		var a = galleryPageURL;
		var g = designer.artwork.productGroupName;
		if (g) {
			g = g.replace(/ /g, "-");
			a = a + g.toLowerCase() + "/"
		}
		a = a + "?fromcde=true";
		if (b != null) {
			a = a + "&pspspassport=" + b
		}
		if (Get_Cookie("logoutuser") != null) {
			a = a + "&logoutuser=1"
		}
		window.location.href = a
	}
}
var MAX_TN = 4;
var TN_SIZE = 48;
PsP.PageNail = Class.create({
	initialize: function(b, a, g) {
		this.element = b;
		this.artwork = a;
		this.dt = g;
		this.draggables = new Array();
		dndMgr.registerDropZone(new Af.Dropzone(this, this.element))
	},
	processDragBegin: function(a) {
		this.dragX = -1;
		this.dragY = -2;
		lockBubblesDisplay()
	},
	processDragged: function(a, b) {
		this.dragX = b.clientX + docScrollLeft();
		this.dragY = b.clientY + docScrollTop()
	},
	processDragComplete: function(A) {
		unlockBubblesDisplay();
		if (A.type == "PaigNailPage") {
			var r = parseInt(A.htmlElement.name);
			var q = -1;
			for (var m = 0; m < this.tnList.length; m++) {
				var z = this.tnList[m]["td"];
				var a = toDocumentPosition(this.tnList[m]["td"]);
				if (this.dragX <= a.x + z.offsetWidth && this.dragY >= a.y && this.dragY < a.y + z.offsetHeight) {
					q = parseInt(z.name);
					break
				}
			}
			if (q == -1 || r == q) {
				if (r != this.selectedIndex) {
					this.selectTN(r, null, true)
				}
				return
			}
			var y = this.artwork.ds;
			var x = y[r]["ArtworkDisplayName"];
			var u = y[q]["ArtworkDisplayName"];
			if (r > q) {
				var b = y[r];
				var g = designer.surfaces[r];
				for (var m = r; m > q; m--) {
					y[m] = y[m - 1];
					designer.surfaces[m] = designer.surfaces[m - 1]
				}
				y[q] = b;
				designer.surfaces[q] = g
			} else {
				var b = y[r];
				var g = designer.surfaces[r];
				for (var m = r; m < q; m++) {
					y[m] = y[m + 1];
					designer.surfaces[m] = designer.surfaces[m + 1]
				}
				y[q] = b;
				designer.surfaces[q] = g
			}
			y[r]["ArtworkDisplayName"] = x;
			y[q]["ArtworkDisplayName"] = u;
			designer.refreshAll();
			this.showPagenails(this.startIndex, false, true);
			setTimeout(this.saveDoc.bind(this, designer.wfe.getSaveMode()), 1)
		}
	},
	saveDoc: function(a) {
		designer.saveDocWithMode(a, true)
	},
	getCurrentStationName: function() {
		if (designer.wfe != null) {
			var a = designer.wfe.getCurrentStation();
			if (a != null) {
				return a.StationInternalName
			}
		} else {
			if (designer.artwork) {
				return designer.artwork.currentStation
			}
		}
		return null
	},
	showPagenails2: function(b, a) {
		this.showPagenails(this.selectedIndex, b, false, a)
	},
	showPagenails: function(g, A, a, q) {
		removeAll(this.element);
		this.selectedCell = null;
		this.selectedIndex = -1;
		var L = document.createElement("table");
		this.tn_table = L;
		this.element.appendChild(L);
		L.className = "ImageDocInfoPageTable";
		L.cellSpacing = "0";
		L.cellPadding = "0";
		var z = document.createElement("tbody");
		L.appendChild(z);
		this.tnList = new Array();
		var B = MAX_TN;
		var u = this.artwork.ds;
		var H = 0;
		var b;
		var y;
		var I;
		this.updateButtons(g);
		var D = this.getCurrentStationName();
		var r = isFinalReviewOrPast(D);
		if (g < 0 || g >= u.length) {
			g = 0
		}
		if (u.length > MAX_TN) {
			this.startIndex = g;
			this.endIndex = this.startIndex + MAX_TN - 1;
			if (this.endIndex >= u.length) {
				var M = this.endIndex - u.length + 1;
				this.startIndex -= M;
				this.endIndex = this.startIndex + MAX_TN - 1
			}
		} else {
			this.startIndex = 0;
			this.endIndex = u.length - 1
		}
		var F = u.length;
		for (var J = this.startIndex; J <= this.endIndex; J++) {
			var E = u[J];
			var o = new Object();
			this.tnList[J] = o;
			b = document.createElement("tr");
			z.appendChild(b);
			y = document.createElement("td");
			b.appendChild(y);
			y.id = "tn_label_td_" + J;
			y.onclick = this.cellClicked.bindAsEventListener(this);
			y.name = "" + J;
			y.className = "ImageDocInfoCell-Label";
			y.align = "center";
			this.tnList[J]["lblTD"] = y;
			var K = E.ArtworkDisplayName;
			var I = document.createElement("span");
			I.name = "" + J;
			this.tnList[J]["lblSpan"] = I;
			y.appendChild(I);
			I.innerHTML = K;
			b = document.createElement("tr");
			z.appendChild(b);
			y = document.createElement("td");
			this.tnList[J]["td"] = y;
			y.id = "" + J;
			y.onclick = this.cellClicked.bindAsEventListener(this);
			y.name = "" + J;
			y.valign = "middle";
			y.align = "center";
			y.className = "ImageDocInfo-Cell";
			b.appendChild(y);
			var C = document.createElement("div");
			if (E.backgroundColor) {
				C.style.backgroundColor = (E.backgroundColor.indexOf("#") == -1) ? "#" + E.backgroundColor: E.backgroundColor
			} else {
				C.style.backgroundColor = "#ffffff"
			}
			this.tnList[J]["div"] = C;
			C.style.position = "relative";
			C.name = "" + J;
			var N = document.createElement("img");
			this.tnList[J]["img"] = N;
			N.alt = E.fileName;
			N.className = "ImageDocInfoCell-Image";
			N.id = "" + J;
			N.name = "" + J;
			N.style.position = "absolute";
			N.onclick = this.cellClicked.bindAsEventListener(this);
			var G = E.dw;
			this.setPosAndSize(E, G[0], N, C);
			y.appendChild(C);
			C.appendChild(N);
			b = document.createElement("tr");
			z.appendChild(b);
			y = document.createElement("td");
			y.name = "" + J;
			b.appendChild(y);
			var x = document.createElement("img");
			this.tnList[J]["statusImg"] = x;
			x.name = "" + J;
			x.className = "TNStatusImage";
			y.appendChild(x);
			N.alt = "";
			if (J == g) {
				this.selectedCell = N;
				this.selectedCell.className = "ImageDocInfoCell-Image-Selected";
				this.selectedCell.parentNode.parentNode.className = "ImageDocInfoCell-Selected";
				this.tnList[J]["lblTD"].className = "ImageDocInfoCell-Label-Selected";
				this.selectedIndex = g
			}
			var D = this.getTNSrc(G[0], E, J);
			if (D == null) {
				N.style.display = "none"
			} else {
				N.src = D
			}
			if (!r) {
				var m = new PsP.SimpleDraggable("PaigNailPage", N);
				dndMgr.registerDraggable(m);
				m.draggableElement = N.cloneNode(true);
				m.draggableElement._width = C.offsetWidth;
				m.draggableElement._height = C.offsetHeight
			}
		}
		this.dt.showSide(this.selectedIndex + 1, A, q);
		if (this.dt.onSideChange != null) {
			this.dt.onSideChange(this.selectedIndex)
		}
		if (this.getCurrentStationName() == "upload" && !a) {
			setTimeout(this.saveDoc.bind(this, designer.wfe.getSaveMode()), 1)
		}
	},
	posSizeChaned: function(g, a) {
		if (this.tnList == null) {
			return
		}
		var b = this.artwork.ds;
		this.setPosAndSize(b[a], g, this.tnList[a]["img"], this.tnList[a]["div"])
	},
	setPosAndSize: function(D, u, J, C) {
		var A = 1.5;
		var B = getDSPhysicalSize(D);
		var a = B.w;
		var r = B.h;
		a += 0.25;
		r += 0.25;
		var H = false;
		if (isFinalReviewOrPast(designer.getCurrentStationName())) {
			var F = designer.artwork.orientation;
			if ((F == "tall" && r < a) || (F == "wide" && a < r)) {
				var z = r;
				r = a;
				a = z;
				H = true
			}
		}
		a = inchToPx(a);
		r = inchToPx(r);
		var I;
		if (r > a) {
			I = TN_SIZE / r;
			a = (a / r) * TN_SIZE;
			r = TN_SIZE
		} else {
			I = TN_SIZE / a;
			r = (r / a) * TN_SIZE;
			a = TN_SIZE
		}
		var b = designer.currentSurface ? designer.currentSurface.zoomFactor: 1;
		I = I / b;
		var m;
		var g;
		var q;
		var G;
		var E = u.imageFile == null || u.imageFile == "undefined";
		if (E || isFinalReviewOrPast(designer.getCurrentStationName())) {
			m = g = 0;
			q = a;
			G = r
		} else {
			m = parseInt(u.x);
			g = parseInt(u.y);
			q = parseInt(u.w);
			G = parseInt(u.h);
			m = m * I;
			g = g * I;
			q = q * I;
			G = G * I
		}
		m = Math.round(m);
		g = Math.round(g);
		q = Math.round(q) * A;
		G = Math.round(G) * A;
		if (C) {
			C.style.height = parseInt(r) * A + "px";
			C.style.width = parseInt(a) * A + "px"
		}
		J.style.height = G + "px";
		J.style.width = q + "px";
		J.style.left = m + "px";
		J.style.top = g + "px";
		a *= A;
		r *= A;
		J.style.clip = "rect(" + ( - g) + "px " + (a - m) + "px " + (r - g) + "px " + ( - m) + "px )"
	},
	updateButtons: function(b) {
		var a = this.artwork.ds;
		var g = $("nextTNPage");
		if (g) {
			g.onclick = this.pageNailNext.bind(this)
		}
		g = $("previousTNPage");
		if (g) {
			g.onclick = this.pageNailPrevious.bind(this)
		}
		var g = document.getElementById("ImageLibraryTitleDiv");
		if (g) {
			g.style.display = "none"
		}
		var g = document.getElementById("ImageLibraryDiv");
		if (g) {
			g.style.display = "none"
		}
	},
	cellClicked: function(a) {
		hideAllBubbles();
		this.selectCell(a)
	},
	selectCell: function(b) {
		var g = b.target ? b.target: b.srcElement;
		if (g == this.selectedCell) {
			return
		}
		var a = parseInt(g.name);
		this.selectTN(a, null, true)
	},
	selectTN: function(a, g, b) {
		if (a >= this.startIndex && a <= this.endIndex) {
			if (this.selectedCell != null) {
				this.selectedCell.className = "ImageDocInfoCell-Image";
				this.selectedCell.parentNode.parentNode.className = "ImageDocInfo-Cell";
				this.tnList[this.selectedIndex]["lblTD"].className = "ImageDocInfoCell-Label"
			}
			this.selectedCell = this.tnList[a]["img"];
			if (this.selectedCell != null) {
				this.selectedCell.className = "ImageDocInfoCell-Image-Selected";
				this.selectedCell.parentNode.parentNode.className = "ImageDocInfoCell-Selected";
				this.tnList[a]["lblTD"].className = "ImageDocInfoCell-Label-Selected";
				this.selectedIndex = a
			} else {
				this.selectedIndex = -1
			}
			if (this.selectedIndex != -1) {
				this.dt.showSide(this.selectedIndex + 1, g, b);
				if (this.dt.onSideChange != null) {
					this.dt.onSideChange(this.selectedIndex)
				}
				if (this.getCurrentStationName() == "upload") {
					setTimeout(this.saveDoc.bind(this, designer.wfe.getSaveMode()), 1)
				}
			}
			this.updateButtons(a)
		} else {
			this.showPagenails(a, g, false, b)
		}
	},
	refreshImages: function() {
		var b = this.artwork.ds;
		for (var m = this.startIndex; m <= this.endIndex; m++) {
			var q = b[m];
			var a = this.tnList[m]["img"];
			var g = q.dw;
			var o = this.getTNSrc(g[0], q, m);
			if (o == null) {
				a.style.display = "none"
			} else {
				a.src = o
			}
		}
	},
	changeCurrentTNImage: function(a) {
		this.setTNImageForIdx(this.selectedIndex, a)
	},
	changeCurrentTN_BGColor: function(b) {
		var a = this.tnList[this.selectedIndex]["div"];
		a.style.backgroundColor = "#" + b
	},
	setTNImageForIdx: function(a, g) {
		var b = this.tnList[a]["img"];
		if (g != null) {
			b.style.display = "";
			b.src = g
		} else {
			b.src = "/psp/images2/Blank.gif"
		}
	},
	getCurrentTNImage: function() {
		var a = this.tnList[this.selectedIndex]["img"];
		return a.src
	},
	previousSide: function() {
		var a = this.selectedIndex - 1;
		if (a < 0) {
			return
		}
		this.selectTN(a, null, true)
	},
	nextSide: function() {
		var a = this.selectedIndex + 1;
		var b = this.artwork.ds;
		if (a >= b.length) {
			return
		}
		this.selectTN(a, null, true)
	},
	getTNSrc: function(a, m, x) {
		var y;
		var q = a.imageFile == null || a.imageFile == "undefined";
		if (q && m.previewImageFile == null) {
			var b = 0;
			var o = null;
			for (r = 0; r < m.dw.length; r++) {
				var g = m.dw[r];
				if (g.imageFile != null && g.imageFile != undefined) {
					if ((g.w * g.h) > b) {
						b = g;
						o = g
					}
				}
			}
			if (o != null) {
				y = baseImageURL + o.imageFile + (o.ts != null ? "?" + o.ts: "")
			} else {
				y = "/psp/images2/Blank.gif"
			}
		} else {
			if ((q || isFinalReviewOrPast(designer.getCurrentStationName())) && m.previewImageFile != null) {
				if (m.previewImageFile != null) {
					y = String(m.previewImageFile).sub("-preview-", "-list-")
				} else {
					var z = "" + (x + 1);
					var u = 3 - z.length;
					for (var r = 0; r < u; r++) {
						z = "0" + z
					}
					y = String(designer.pspFile).sub(".psp", "") + "-list-" + z + ".jpg";
					y = String(y).sub(".psp-", "-list-")
				}
				y = previewImageURL + y + (m.ts != null ? "?ts=" + m.ts: "")
			} else {
				if (a.imageFile.indexOf("/") >= 0) {
					return a.imageFile
				}
				y = baseImageURL + a.imageFile + (a.ts != null ? "?ts=" + a.ts: "")
			}
		}
		return y
	},
	pageNailNext: function() {
		this.nextSide();
		return false
	},
	pageNailPrevious: function() {
		this.previousSide();
		return false
	},
	updatePagNailStatus: function() {
		for (var b = this.startIndex; b <= this.endIndex; b++) {
			if (b < designer.surfaces.length) {
				var m = designer.surfaces[b];
				var g = m.dsStatus;
				var o = this.tnList[b]["statusImg"];
				var a = "visible";
				if (g == CHECKED) {
					o.src = "/psp/images2/icon_checklist_check.png";
					a = "hidden"
				} else {
					if (g == FAILED) {
						o.src = "/psp/images2/icon_checklist_stop.png"
					} else {
						if (g == PENDING) {
							o.src = "/psp/images2/icon_checklist_pending.png"
						} else {
							if (g == WARNED) {
								o.src = "/psp/images2/icon_checklist_caution.png"
							} else {
								a = "hidden"
							}
						}
					}
				}
				o.style.cssFloat = "right";
				o.style.top = "-17px";
				o.style.visibility = a
			}
		}
	}
});
PsP.PageNailDropZone = Class.create();
PsP.PageNailDropZone = Class.create(Af.Dropzone, {
	initialize: function(a) {
		this.htmlElement = a;
		this.absoluteRect = null
	},
	canAccept: function(b) {
		var a = b[0];
		if (a.type == "PaigNailPage") {
			return true
		}
		return false
	},
	accept: function(a) {},
	activate: function(a) {},
	deactivate: function(a) {},
	showHover: function() {},
	hideHover: function() {}
});
PsP.SimpleDraggable = Class.create(Af.Draggable, {
	initialize: function(a, b, g) {
		this.type = a;
		this.htmlElement = b;
		this.selected = false;
		this.draggableElement = null;
		this.allowedTarget = null;
		if (g != null) {
			this.repositionable = g
		} else {
			this.repositionable = false
		}
	},
	select: function() {
		this.selected = true;
		this.showingSelected = true
	},
	deselect: function() {
		this.selected = false;
		if (!this.showingSelected) {
			return
		}
		this.showingSelected = false
	}
});
function doReaderMode() {
	var b = $("frame2");
	if (b == null) {
		return
	}
	if (designer.artwork != null && designer.artwork.pdfURL != null && designer.artwork.pdfURL != "") {
		var a = designer.artwork.pdfURL;
		if (a.indexOf("/") > 0) {
			b.src = "../gallery/" + designer.artwork.pdfURL
		} else {
			b.src = previewImageURL + "/" + designer.artwork.pdfURL
		}
	} else {
		b.style.display = "none"
	}
}
PsP.DataNav = Class.create({
	initialize: function() {
		this.centered = true
	},
	showFirstRow: function(m) {
		this.rows = m;
		this.currentRowIndex = 0;
		var a = designer.currentSurface.gobjects;
		for (var g = 0; g < a.length; g++) {
			var b = a[g];
			b.saveValue()
		}
		this.showAsDialog("MainArea", "Viewing Data File '" + designer.currentSurface.dataFileDisplayName + "'", "300px");
		this.showRow()
	},
	showRow: function() {
		if (this.rows == null || this.rows.length <= this.currentRowIndex) {
			return
		}
		var a = this.rows[this.currentRowIndex];
		var m = designer.currentSurface.gobjects;
		removeAll(this.listTableBody);
		var b = 0;
		for (property in a) {
			if (property == "__parent" || property == "__className" || property == "__id" || property == "__fullId" || property == "__atype" || property == "__index") {
				continue
			}
			var x = a[property];
			if (x == null) {
				x = ""
			}
			if (typeof x != "function") {
				var q = document.createElement("div");
				q.innerHTML = x;
				q.style.position = "absolute";
				q.style.cursor = "pointer";
				q.name = property;
				var u = document.createElement("tr");
				this.listTableBody.appendChild(u);
				var g = document.createElement("td");
				g.className = "DataNavListtdContent1st";
				g.innerHTML = property;
				u.appendChild(g);
				var z = new Af.Draggable("_data_table_header_" + b, g);
				dndMgr.registerDraggable(z);
				z.setDraggableElement(q);
				z.value = x;
				g = document.createElement("td");
				g.innerHTML = x == "" ? "&nbsp;": x;
				g.className = "DataNavListtdContent";
				u.appendChild(g);
				var z = new Af.Draggable("_data_table_cell_" + b, g);
				dndMgr.registerDraggable(z);
				z.setDraggableElement(q);
				z.value = x;
				b++
			}
		}
		for (var o = 0; o < m.length; o++) {
			var y = m[o];
			if (y.name != null && a[y.name] != null) {
				y.setValue(a[y.name])
			}
		}
		this.rowNum.innerHTML = (this.currentRowIndex + 1) + " of " + this.rows.length;
		designer.refreshAll()
	},
	showPrevRow: function() {
		if (this.currentRowIndex > 0) {
			this.currentRowIndex--;
			this.showRow()
		}
		return false
	},
	showNextRow: function() {
		if (this.currentRowIndex < this.rows.length - 1) {
			this.currentRowIndex++;
			this.showRow()
		}
		return false
	},
	closeDialog: function() {
		this.dialog.hide();
		var a = designer.currentSurface.gobjects;
		for (var g = 0; g < a.length; g++) {
			var b = a[g];
			b.restoreValue()
		}
		designer.refreshAll();
		return false
	},
	showAsDialog: function(a, q, g, u) {
		if (this.listTable == null) {
			this.renderTable()
		}
		this.container = $(a);
		var m = false;
		if (this.dialog == null) {
			this.dialog = new Af.Dialog(this.listTable, q, this);
			if (g) {
				this.dialog.width = g
			}
			if (u) {
				this.dialog.height = u
			}
			m = true
		}
		if (!this.centered) {
			var b = toDocumentPosition(designer.currentSurface.element);
			var r = b.x + designer.currentSurface.element.offsetWidth + 20;
			var o = b.y;
			this.dialog.left = r;
			this.dialog.top = o
		}
		this.dialog.show(this.container);
		if (m) {
			var z = new Af.Draggable(q, this.dialog.element, true);
			z.allowedTarget = this.dialog.titleElement;
			dndMgr.registerDraggable(z);
			if (!this.centered) {
				this.dialog.centerDialog()
			}
		} else {
			this.dialog.titleElement.innerHTML = q
		}
	},
	renderTable: function() {
		var r = document.createElement("table");
		r.cellSpacing = "0";
		r.cellPadding = "0";
		r.border = "0";
		r.style.height = "100%";
		r.style.width = "100%";
		r.className = "DataNavList";
		var x = document.createElement("thead");
		r.thead = x;
		r.appendChild(x);
		var u = document.createElement("tr");
		x.appendChild(u);
		var q = document.createElement("th");
		u.appendChild(q);
		q.colSpan = "2";
		q.className = "DataNavListCellHeaderLast";
		var b = document.createElement("a");
		b.className = "DataNavButton";
		var g = document.createElement("img");
		g.src = "/psp/images2/button_previous_datamapper.png";
		g.className = "DataNavButtonImg";
		b.appendChild(g);
		this.backButton = b;
		this.backButton.onclick = this.showPrevRow.bind(this);
		q.appendChild(b);
		var o = document.createElement("span");
		this.rowNum = o;
		o.innerHTML = " 0 of 0";
		q.appendChild(o);
		b = document.createElement("a");
		b.className = "DataNavButton";
		g = document.createElement("img");
		g.src = "/psp/images2/button_next_datamapper.png";
		g.className = "DataNavButtonImg";
		b.appendChild(g);
		this.forwardButton = b;
		this.forwardButton.onclick = this.showNextRow.bind(this);
		q.appendChild(b);
		u = document.createElement("tr");
		x.appendChild(u);
		q = document.createElement("th");
		u.appendChild(q);
		q.innerHTML = "Name";
		q.className = "DataNavListCellHeader1st";
		q = document.createElement("th");
		u.appendChild(q);
		q.innerHTML = "Value";
		q.className = "DataNavListCellHeaderLast";
		var m = document.createElement("tbody");
		m.className = "DataNavTableBody";
		m.title = "Drag data element to add to design";
		r.appendChild(m);
		this.listTableBody = m;
		this.listTable = r
	}
});
PsP.GridListBase = Class.create({
	initialize: function(a, b) {
		this.element = a;
		this.parent = b;
		this.max = 15
	},
	init: function(b, g) {
		this.dl = b;
		this.dl2 = g;
		if (!this.initialized && this.element != null) {
			this.initialized = true;
			var a = new Af.ElementCollection(this.element);
			this.pagenoTd = a.getFirstElementById("pagenoTdId");
			this.table = a.getFirstElementById("tableId");
			this.tb = this.table.tBodies[0];
			this.tr0 = this.tb.rows[0].cloneNode(true);
			this.tr1 = this.tb.rows[1].cloneNode(true);
			this.totalPagesElem = a.getFirstElementById("totalPages");
			this.currentPageElem = a.getFirstElementById("currentPage");
			this.previous = a.getFirstElementById("previousPage");
			this.next = a.getFirstElementById("nextPage");
			this.panelBar = a.getFirstElementById("panelBar")
		}
		this.initDone();
		this.show()
	},
	initDone: function() {},
	show: function() {
		this.renderPageLinks();
		this.renderPage(1)
	},
	renderPageLinks: function() {
		removeAll(this.pagenoTd);
		var r = 1;
		var o = this.max;
		var g = this.dl2.length;
		var m = 1;
		if (o > g) {
			o = g
		}
		while (r <= o) {
			if (r != 1) {
				var q = document.createElement("span");
				q.innerHTML = "&nbsp;|&nbsp;";
				this.pagenoTd.appendChild(q)
			}
			var b = document.createElement("a");
			b.innerHTML = r + "-" + o;
			b.href = "#";
			b.id = m;
			b.onclick = this.renderPage.bind(this, m);
			m++;
			this.pagenoTd.appendChild(b);
			r = o + 1;
			o = r + this.max - 1;
			if (o > g) {
				o = g
			}
		}
		this.totalPages = m - 1
	},
	renderPage: function(a) {
		return false
	},
	nextBack: function(g, m) {
		if (this.next == null) {
			return
		}
		if (this.totalPages == 1) {
			this.next.style.visibility = "hidden";
			this.previous.style.visibility = "hidden"
		} else {
			this.next.style.visibility = "visible";
			this.previous.style.visibility = "visible";
			if (this.currentPage != this.totalPages) {
				var a = this.currentPage + 1;
				this.next.disabled = false
			} else {
				this.next.disabled = true
			}
			if (this.currentPage > 1) {
				var b = this.currentPage - 1;
				this.previous.disabled = false
			} else {
				this.previous.disabled = true
			}
			this.previous.onclick = this.renderPage.bind(this, b);
			this.next.onclick = this.renderPage.bind(this, a)
		}
		return true
	}
});
PsP.List = Class.create(PsP.GridListBase, {
	initialize: function(a, b) {
		this._initialize(a, b)
	},
	_initialize: function(a, b, g) {
		this.element = a;
		this.parent = b;
		this.listCotainer = g;
		this.listTable = null;
		this.pageSize = 8;
		this.selectedItem = null;
		this.currentDesign = 1;
		this.columnList = new Array();
		this.hideHeader = false;
		this.cssClassName = "DefaultList";
		this.ImageWidth = 32;
		this.ImageHeight = 32;
		this.sortAscendImg = "/psp/images/sort_asc.gif";
		this.sortDescendImg = "/psp/images/sort_desc.gif";
		this.sortImageWidth = 9;
		this.sortImageHeight = 5;
		this.currentSortColumn = -1;
		this.dlCopy = null;
		this.centered = true;
		this.selectsList = new Array()
	},
	initDone: function() {
		if (this.dl == null) {
			this.dlCopy = new Array();
			return
		}
		var b = this.dl.length;
		this.dlCopy = new Array(b);
		for (var a = 0; a < b; a++) {
			this.dlCopy[a] = this.dl[a]
		}
	},
	addColumn: function(a) {
		this.columnList.push(a)
	},
	renderPage: function(a) {
		this.selectedItem = null;
		this.currentPage = a;
		if (this.totalPagesElem) {
			this.totalPagesElem.innerHTML = this.totalPages;
			this.currentPageElem.innerHTML = this.currentPage
		}
		this.nextBack(this.currentPage, this.totalPages);
		var g = (a - 1) * this.pageSize;
		var b = g + this.pageSize - 1;
		if (b >= this.dlCopy.length) {
			b = this.dlCopy.length - 1
		}
		if (this.listTable == null) {
			this.renderTable()
		}
		if (this.listCotainer != null) {
			var m = $(this.listCotainer);
			removeAll(m);
			m.appendChild(this.listTable)
		}
		this.renderRows(g, b);
		this.selectElement(0)
	},
	renderTable: function() {
		var x = document.createElement("table");
		x.cellSpacing = "0";
		x.cellPadding = "0";
		x.border = "0";
		x.style.height = "100%";
		x.style.width = "100%";
		x.className = this.cssClassName;
		if (!this.hideHeader) {
			var r = document.createElement("thead");
			x.thead = r;
			x.appendChild(r);
			var u = document.createElement("tr");
			r.appendChild(u);
			var b = this.columnList.length;
			for (var o = 0; o < b; o++) {
				var g = this.columnList[o];
				var a = document.createElement("th");
				g.columnElement = a;
				if (g.sortable) {
					var q = document.createElement("img");
					q.className = "GalleryListSortImgDummy";
					q.width = this.sortImageWidth;
					q.height = this.sortImageHeight;
					q.src = this.sortAscendImg;
					q.style.visibility = "hidden";
					a.appendChild(q)
				}
				a.appendChild(document.createTextNode(g.displayName));
				if (g.sortable) {
					a.style.cursor = "pointer";
					var q = document.createElement("img");
					q.className = "GalleryListSortImg";
					q.width = this.sortImageWidth;
					q.height = this.sortImageHeight;
					q.src = this.sortAscendImg;
					q.style.visibility = "hidden";
					a.appendChild(q);
					g.sortElement = q;
					a.onclick = this.doSort.bind(this, o)
				}
				u.appendChild(a)
			}
		}
		var m = document.createElement("tbody");
		x.appendChild(m);
		this.listTableBody = m;
		this.listTable = x
	},
	renderRows: function(z, u) {
		this.selectsList = new Array();
		removeAll(this.listTableBody);
		for (var r = z; r <= u; r++) {
			tr = document.createElement("tr");
			this.dlCopy[r].rowElem = tr;
			this.listTableBody.appendChild(tr);
			var a = this.columnList.length;
			for (var q = 0; q < a; q++) {
				var m = this.columnList[q];
				var g = document.createElement("td");
				g.onclick = this.selectRow.bind(this, r);
				tr.appendChild(g);
				if (m.colWidth) {
					g.style.width = m.colWidth
				}
				if (m.type == "Image") {
					var x = document.createElement("img");
					x.src = designCenterPageURL + this.dlCopy[r][m.name];
					x.onclick = this.selectElement.bind(this, r);
					this.dlCopy[r].element = x;
					x.id = "img" + r;
					x.style.width = this.ImageWidth + "px";
					x.style.height = "auto";
					if (x.width < x.height) {
						x.style.height = this.ImageHeight + "px";
						x.style.width = "auto"
					} else {
						x.style.width = this.ImageWidth + "px";
						x.style.height = "auto"
					}
					g.appendChild(x)
				} else {
					if (m.type == "Select") {
						var b;
						b = document.createElement("select");
						this.selectsList.push(b);
						if (m.width) {
							b.style.width = m.width
						}
						if (m.options) {
							for (var o = 0; o < m.options.length; o++) {
								var y = m.options[o];
								this.addOption(b, y)
							}
						}
						var A = this.dlCopy[r][m.name];
						if (A == null) {
							A = ""
						}
						for (var o = 0; o < m.options.length; o++) {
							if (A == m.options[o].value) {
								b.selectedIndex = o;
								break
							}
						}
						g.appendChild(b)
					} else {
						var A = this.dlCopy[r][m.name];
						if (A == null) {
							A = "N/A"
						}
						g.innerHTML = A;
						_emptyStyle(g, "color", "#000000")
					}
				}
			}
		}
	},
	addOption: function(b, a) {
		var g = document.createElement("option");
		g.style.textAlign = "center";
		g.value = a.value;
		g.innerHTML = a.label;
		b.appendChild(g)
	},
	selectRow: function(a) {
		if (this.selectedRow != null) {
			this.selectedRow.rowElem.className = "Unselected"
		}
		this.selectedRow = this.dlCopy[a];
		this.selectedRow.rowElem.className = "Selected"
	},
	selectElement: function(a) {
		if (this.selectedItem != null) {
			this.selectedItem.element.className = "Selected"
		}
		this.selectedItem = this.dlCopy[a];
		if ($("currentDesign")) {
			$("currentDesign").innerHTML = a + 1
		}
		this.currentDesign.innerHTML = a + 1;
		if (this.selectedItem.element) {
			this.selectedItem.element.className = "Unselected";
			this.parent.imageSelected(this.selectedItem.link)
		}
	},
	doSort: function(a) {
		var b;
		if (a == this.currentSortColumn) {
			b = this.columnList[this.currentSortColumn];
			if (b.sortDir == "dsc") {
				b.sortDir = "asc";
				b.sortElement.src = this.sortAscendImg
			} else {
				b.sortDir = "dsc";
				b.sortElement.src = this.sortDescendImg
			}
		} else {
			if (this.currentSortColumn != -1) {
				this.columnList[this.currentSortColumn].sortElement.style.visibility = "hidden"
			}
			this.currentSortColumn = a;
			b = this.columnList[this.currentSortColumn];
			if (b.sortDir == "none") {
				b.sortDir = "asc";
				b.sortElement.src = this.sortAscendImg
			}
			b.sortElement.style.visibility = "visible"
		}
		if (b.sortDir == "asc") {
			this.dlCopy.sort(b.doCompareAsc.bind(b))
		} else {
			this.dlCopy.sort(b.doCompareDesc.bind(b))
		}
		this.renderPage(this.currentPage)
	},
	postShow: function() {},
	showAsDialog: function(a, q, g, u) {
		this.container = $(a);
		var m = false;
		if (this.dialog == null) {
			this.dialogPanel = this.getDialogPanel();
			this.dialog = new Af.Dialog(this.dialogPanel, q, this);
			if (g) {
				this.dialog.width = g
			}
			if (u) {
				this.dialog.height = u
			}
			m = true
		}
		if (!this.centered) {
			var b = Af.toDocumentPosition(this.container);
			var r = b.x;
			var o = b.y;
			this.dialog.left = r;
			this.dialog.top = o
		}
		this.dialog.show(this.container);
		if (m) {
			var z = new Af.Draggable(q, this.dialog.element, true);
			z.allowedTarget = this.dialog.titleElement;
			dndMgr.registerDraggable(z)
		}
		this.postShow()
	},
	getDialogPanel: function() {
		var b = document.createElement("table");
		b.cellSpacing = "0px";
		b.cellPadding = "0px";
		b.style.width = "100%";
		var a = document.createElement("tbody");
		b.appendChild(a);
		var m;
		var g;
		this.topTb = this.getTopToolBar();
		if (this.topTb) {
			g = document.createElement("tr");
			a.appendChild(g);
			m = document.createElement("td");
			g.appendChild(m);
			m.appendChild(this.topTb.element)
		}
		g = document.createElement("tr");
		a.appendChild(g);
		m = document.createElement("td");
		m.style.padding = "4px";
		g.appendChild(m);
		m.appendChild(this.listTable);
		this.tb = this.getStandardButtonBar();
		g = document.createElement("tr");
		a.appendChild(g);
		m = document.createElement("td");
		g.appendChild(m);
		m.appendChild(this.tb.element);
		return b
	},
	getTopToolBar: function() {
		return null
	},
	getStandardButtonBar: function() {
		var g = new Af.ButtonBar("buttonsBar");
		g.align = "right";
		var b = g.addButton("ok", "OK");
		var a = g.addButton("cancel", "Cancel");
		g.element = g.render();
		b.element.onclick = this.ok.bind(this);
		a.element.onclick = this.closeDialog.bind(this);
		return g
	},
	ok: function() {
		alert("OK called()");
		this.dialog.hide()
	},
	closeDialog: function(a) {
		this.dialog.hide()
	}
});
PsP.ListColumn = Class.create({
	initialize: function(b, a) {
		this.name = b;
		this.displayName = a;
		this.type = "Text";
		this.width = "auto";
		this.colWidth = null;
		this.cssClassName = null;
		this.sortable = false;
		this.sortDir = "none";
		this.options = new Array()
	},
	addOption: function(b, a) {
		var g = new Object();
		g.label = a;
		g.value = b;
		this.options.push(g)
	},
	doCompareAsc: function(m, g) {
		var b = m[this.name];
		var a = g[this.name];
		b = this.convert(b);
		a = this.convert(a);
		return compareAsc(b, a)
	},
	doCompareDesc: function(m, g) {
		var b = m[this.name];
		var a = g[this.name];
		b = this.convert(b);
		a = this.convert(a);
		return compareDesc(b, a)
	},
	convert: function(g) {
		if (g == null) {
			return g
		}
		if (this.type == "Int") {
			try {
				return parseInt(g)
			} catch(a) {
				return null
			}
		} else {
			if (this.type == "Date") {
				try {
					var b = g.split("/");
					if (b.length == 3) {
						var m = new Date(b[2], b[0], b[1]);
						return m.getTime()
					}
					return null
				} catch(a) {
					return null
				}
			}
		}
		return g
	}
});
function compareAsc(b, a) {
	if (b != null && a != null) {
		if (b < a) {
			return - 1
		} else {
			if (b > a) {
				return 1
			}
		}
	}
	if (b == a) {
		return 0
	}
	if (b == null) {
		return - 1
	} else {
		if (a == null) {
			return 1
		}
	}
	return 0
}
function compareDesc(b, a) {
	if (b != null && a != null) {
		if (b < a) {
			return 1
		} else {
			if (b > a) {
				return - 1
			}
		}
	}
	if (b == a) {
		return 0
	}
	if (b == null) {
		return 1
	} else {
		if (a == null) {
			return - 1
		}
	}
	return 0
}
PsP.DataMapperList = Class.create(PsP.List, {
	initialize: function(a, b, g) {
		this._initialize(a, b, g);
		this.pageSize = 100;
		this.createColumns()
	},
	createColumns: function() {
		var a = new PsP.ListColumn("name", "File Column Name");
		a.type = "Text";
		a.colWidth = "300px";
		this.addColumn(a);
		a = new PsP.ListColumn("standardName", "StandardName");
		a.type = "Select";
		a.width = "300px";
		this.addColumn(a);
		a.addOption("", "--- Select a value ---");
		a.addOption("salutation", "Salutation");
		a.addOption("title", "Title");
		a.addOption("firstName", "First Name");
		a.addOption("lastName", "Last Name");
		a.addOption("middleName", "Middle Initial");
		a.addOption("middleInitial", "Middle Name");
		a.addOption("suffix", "Suffix");
		a.addOption("longName", "Full Name");
		a.addOption("company", "Company");
		a.addOption("department", "Department");
		a.addOption("addressLine1", "Address Line 1");
		a.addOption("addressLine2", "Address Line 2");
		a.addOption("city", "City");
		a.addOption("state", "State");
		a.addOption("zipCode", "Zip/Postal Code");
		a.addOption("country", "Country");
		a.addOption("email", "Email");
		a.addOption("phone", "Phone");
		a.addOption("personalWebSite", "Personal Website");
		a.addOption("businessWebSite", "Business Website");
		a.addOption("usZipPlus4", "US Zip Plus 4");
		a.addOption("userVariable1", "userVariable 1");
		a.addOption("userVariable2", "userVariable 2");
		a.addOption("userVariable3", "userVariable 3");
		a.addOption("image1", "Custom Image 1");
		a.addOption("image2", "Custom Image 2")
	},
	renderPageLinks: function() {},
	selectElement: function(a) {},
	loadDataFile: function(g, b) {
		showModalMessageDialog("Loading file ... please wait", "Loading", 300, 100);
		this.fileName = g;
		var a = new Af.DataRequest(svcURL, this.loadDataFileComplete.bind(this), this.loadDataFileFailed.bind(this), view, this.loadDataFileTimedout.bind(this));
		a.addService("DesignerSvc", "loadDataFileForMapper");
		a.addParameter("dataFile", g);
		a.addParameter("psp", b);
		ajaxEngine.processRequest(a);
		return false
	},
	loadDataFileComplete: function(g) {
		hideModalMessageDialog();
		var a = new Af.XMLToDataSet(g.responseXML);
		this.rows = a.data.row;
		dl = new Array();
		if (this.rows != null && this.rows.length > 0) {
			var q = this.rows[0];
			for (var m in q) {
				var b = q[m];
				if (typeof b != "function") {
					if (m != "__id" && m != "__parent" && m != "__className" && m != "__atype" && m != "__index" && m != "__fullId") {
						var o = new Object();
						o.name = m;
						o.standardName = "";
						dl.push(o)
					}
				}
			}
		}
		dataMapper.init(dl);
		dataMapper.showAsDialog("MainArea", "Map Columns", 650)
	},
	loadDataFileFailed: function(a, b) {
		hideModalMessageDialog();
		hideDialogWin();
		showMessageDialog(b, GENERAL_ERROR.subject, GENERAL_ERROR.width, GENERAL_ERROR.height, null, true)
	},
	loadDataFileTimedout: function(a) {
		hideModalMessageDialog();
		hideDialogWin();
		var b = REQUEST_TIMEOUT.text;
		b = replace([RequestedURL], a.requestURL);
		showMessageDialog(b, REQUEST_TIMEOUT.subject, REQUEST_TIMEOUT.width, REQUEST_TIMEOUT.height, null, true)
	},
	ok: function() {
		this.saveMapping()
	},
	saveMapping: function() {
		showModalMessageDialog("Saving file ... please wait", "Saving", 300, 100);
		var a = new Af.DataRequest(svcURL, this.saveMappingComplete.bind(this), this.saveMappingFailed.bind(this), view, this.saveMappingTimedout.bind(this));
		a.addService("DesignerSvc", "saveMapping");
		a.addParameter("dataFile", this.fileName);
		a.addParameter("psp", designer.pspFile);
		var b = this.getMappingXml();
		a.xmlDoc = b;
		ajaxEngine.processRequest(a);
		return false
	},
	getMappingXml: function() {
		var b = "<Object class='Map'>\n";
		var o = this.dlCopy.length;
		for (var a = 0; a < o; a++) {
			var m = this.dlCopy[a];
			var g = this.selectsList[a];
			b += "<property name='" + m.name + "'>" + g.value + "</property>\n"
		}
		b += "</Object>";
		return b
	},
	saveMappingComplete: function(a) {
		hideModalMessageDialog();
		this.dialog.hide();
		dataMapperSaved()
	},
	saveMappingFailed: function(a, b) {
		hideModalMessageDialog();
		hideDialogWin();
		showMessageDialog(b, GENERAL_ERROR.subject, GENERAL_ERROR.width, GENERAL_ERROR.height, null, true)
	},
	saveMappingTimedout: function(a) {
		hideModalMessageDialog();
		hideDialogWin();
		var b = REQUEST_TIMEOUT.text;
		b = replace([RequestedURL], a.requestURL);
		showMessageDialog(b, REQUEST_TIMEOUT.subject, REQUEST_TIMEOUT.width, REQUEST_TIMEOUT.height, null, true)
	},
	closeDialog: function(a) {
		this.dialog.hide();
		designer.dataMapperCancelled()
	}
});
var dataMapper = null;
function showDataMapper(a, g, b) {
	if (dataMapper == null) {
		dataMapper = new PsP.DataMapperList(null, a)
	}
	dataMapper.loadDataFile(g, b)
}
var cropFunctionOn = false;
ToolbarUtils = {
	FONT_SIZE_TOPIC: "text_font.size",
	FONT_COLOR_TOPIC: "text_font.color",
	FONT_FAMILY_TOPIC: "text_font.family",
	OBJECT_SELECTION_TOPIC: "object_selected",
	PREFIX_ON: "_on",
	PREFIX_OFF: "_off",
	PREFIX_ACTIVE: "_active",
	PREFIX_DISABLE: "_disable",
	NOT_FOUND_ELEMENT: undefined,
	DEFAULT_SELECTED_TEXT_OBJECT: undefined,
	TEXT_OBJECT_TYPE: "textarea",
	off: function(b, a) {
		this.removeAll(b, a);
		b.addClassName(a + this.PREFIX_OFF)
	},
	on: function(b, a) {
		this.removeAll(b, a);
		b.addClassName(a + this.PREFIX_ON)
	},
	active: function(b, a) {
		this.removeAll(b, a);
		b.addClassName(a + this.PREFIX_ACTIVE)
	},
	removeAll: function(b, a) {
		b.removeClassName(a + this.PREFIX_ON);
		b.removeClassName(a + this.PREFIX_OFF);
		b.removeClassName(a + this.PREFIX_ACTIVE);
		b.removeClassName(a + this.PREFIX_DISABLE);
		b.removeClassName(a)
	},
	setCssClass: function(b, a) {
		this.removeAll(b, a);
		b.addClassName(a)
	},
	disable: function(b, a) {
		this.removeAll(b, a);
		b.addClassName(a + this.PREFIX_DISABLE)
	},
	findByClass: function(a) {
		var b = $$(a);
		if (b.length == 0) {
			console.warn("Can't find element by class selector='" + a + "'");
			return this.NOT_FOUND_ELEMENT
		}
		if (b.length > 1) {
			console.warn("More than one element found by class selector='" + a + "' . Return first element")
		}
		return b[0]
	},
	lookupRTEEditor: function() {
		return designer.multiRTEEditor
	},
	getCurrentSelectedTextObject: function() {
		var b = designer.currentSurface.selectedObject,
		a = this.DEFAULT_SELECTED_TEXT_OBJECT;
		if (b && b.type == this.TEXT_OBJECT_TYPE) {
			a = b
		}
		return a
	},
	selectOption: function(b, a) {
		console.log("selectId=" + b + "  valueToSet=" + a);
		var g = "select#" + b + " option";
		console.log("optionsSelector=" + g);
		$$(g).each(function(m) {
			if (m.readAttribute("value") == a) {
				m.selected = true
			}
		})
	}
};
var SelectWidget = Class.create({
	defaults: {
		selectedIndex: 0,
		itemWidth: 100,
		itemsHeight: 100,
		onChange: function(a) {},
		items: [{
			id: "",
			text: "[value]"
		}]
	},
	initialize: function(a, b) {
		this.containerId = a;
		this.$container = $(a);
		this.isOpen = false;
		this.options = this.mergeObjects(b, this.defaults);
		this.selectedIndex = this.options.selectedIndex;
		this.itemWidth = this.options.itemWidth;
		this.itemsHeight = this.options.itemsHeight;
		this.data = this.options.items;
		var g = document.createElement("div");
		g.className = "selectricWrapper";
		g.innerHTML = '<div class="selectric"><p class="label">[value]</p></div>';
		this.$wrapper = g;
		var m = document.createElement("div");
		m.className = "selectricItems";
		m.setStyle({
			width: this.itemWidth + "px",
			height: this.itemsHeight + "px"
		});
		this.$items = m;
		this.render();
		this.setLabelText();
		this.bindEvents();
		this.closeProxy = this.close.bind(this)
	},
	mergeObjects: function(b, m) {
		var a = {};
		for (var g in b) {
			a[g] = b[g]
		}
		for (var g in m) {
			if (typeof b[g] === "undefined") {
				a[g] = m[g]
			}
		}
		return a
	},
	render: function() {
		var m = "<ul>";
		for (var b = 0; b < this.data.length; b++) {
			var g = this.data[b];
			var o = (b === this.selectedIndex) ? "selected": "";
			var a = '<li class="' + o + '" id="' + g.id + '" data-index="' + b + '">' + g.text + "</li>";
			m += a
		}
		m += "</ul>";
		this.$items.innerHTML = m;
		this.$wrapper.appendChild(this.$items);
		this.$container.innerHTML = "";
		this.$container.appendChild(this.$wrapper);
		this.$label = $$("#" + this.containerId + " .label")[0];
		return this.$wrapper
	},
	bindEvents: function() {
		this.$wrapper.observe("click",
		function(m) {
			if (this.isOpen) {
				var g = m.target;
				if (g.tagName.toLowerCase() === "li") {
					var a = parseInt(g.readAttribute("data-index"), 10);
					if (this.selectedIndex !== a) {
						var b = this.data[a];
						var q = g.readAttribute("id");
						var o = b.text;
						this.options.onChange(g, a, q, o)
					}
					this.selectedIndex = a;
					this.setLabelText()
				}
				this.close(m)
			} else {
				this.open(m)
			}
		}.bind(this));
		this.$items.observe("mouseenter", this.unselectAllItems.bind(this))
	},
	setLabelText: function(b) {
		if (typeof b === "undefined") {
			var a = this.data[this.selectedIndex];
			b = a.text
		}
		this.$label.update(b)
	},
	findItemByIndex: function(b) {
		var q = null;
		var a = $$("#" + this.containerId + " li");
		for (var g = 0; g < a.size(); g++) {
			var o = a[g];
			var m = parseInt(o.readAttribute("data-index"), 10);
			if (m === b) {
				q = o;
				break
			}
		}
		return q
	},
	unselectAllItems: function() {
		var a = $$("#" + this.containerId + " li");
		for (var b = 0; b < a.size(); b++) {
			var g = a[b];
			g.removeClassName("selected")
		}
	},
	selectItem: function(a) {
		a.addClassName("selected")
	},
	open: function(b) {
		b.preventDefault();
		b.stopPropagation();
		this.$wrapper.toggleClassName("selectricOpen");
		var a = this.findItemByIndex(this.selectedIndex);
		this.unselectAllItems();
		this.selectItem(a);
		$(document).observe("click", this.closeProxy);
		this.isOpen = true
	},
	close: function(a) {
		$(document).stopObserving("click", this.closeProxy);
		this.$wrapper.toggleClassName("selectricOpen");
		this.isOpen = false
	},
	getDataTextById: function(m) {
		var g = null;
		for (var a = 0; a < this.data.length; a++) {
			var b = this.data[a];
			if (b.id === m) {
				g = b.text;
				break
			}
		}
		return g
	}
});
PsP.FormatButtonView = Class.create({
	TEXT_OBJECT_TYPE: "textarea",
	BUTTON_BASE_CLASS: "t_editTextCDE",
	HIDE_CLASS: "hide",
	BOLD_BUTTON_BASE_CLASS: "t_boxFormat_bold",
	ITALIC_BUTTON_BASE_CLASS: "t_boxFormat_italic",
	UNDERLINE_BUTTON_BASE_CLASS: "t_boxFormat_under",
	FORMAT_MENU_ID: "formatBtn",
	FORMAT_MENU_CLOSE_BUTTON_ID: "formatBtnClose",
	BOLD_BUTTON_ID: "boldBtn",
	ITALIC_BUTTON_ID: "itlaicBtn",
	UNDERLINE_BUTTON_ID: "underlineBtn",
	FONT_COLOR_BUTTON_ID: "fontColorBtn",
	FONT_SELECT_ID: "fontSelect",
	SELECTED_COLOR_INDICATOR_ID: "selectedColorIndicator",
	FONT_SIZE_SELECT_CONTAINER_ID: "fontSizeSelectContainer",
	DEFAULT_COLOR: "#ffffff",
	DISABLED_FONT_FAMILY_VALUE: "[Font Family]",
	DISABLED_FONT_SIZE_VALUE: "Size",
	DISABLED_COLOR_VALUE: "#ffffff",
	FONT_TRIGGER_ID: "formatBtnFontTrigger",
	FONT_SELECTOR_ID: "formatBtnFontSelectContainer",
	FONT_FAMILY_DIV_ID: "fontFamilyDivId",
	COLOR_PICKER_CONTAINER_ID: "MainArea",
	COLOR_PICKER_X_OFFSET: -3,
	COLOR_PICKER_Y_OFFSET: -3,
	initialize: function(a) {
		console.log("intialize");
		this.actionHandler = a;
		this.fontUtils = new Af.FontUtils();
		this.isOpened = false;
		this.isDisabledUIState = true;
		this.bindEvents();
		PubSub.subscribe(ToolbarUtils.FONT_SIZE_TOPIC, this.fontSizeSubscriber.bind(this));
		PubSub.subscribe(ToolbarUtils.FONT_COLOR_TOPIC, this.fontColorSibscriber.bind(this));
		PubSub.subscribe(ToolbarUtils.OBJECT_SELECTION_TOPIC, this.objectSelectionSibscriber.bind(this));
		PubSub.subscribe(ToolbarUtils.FONT_FAMILY_TOPIC, this.fontFamilySubscriber.bind(this));
		var q = $(this.FONT_SELECTOR_ID),
		u = $(this.FONT_FAMILY_DIV_ID);
		this.fontCtxMenu = this.getFontCtxMenu(q, u);
		this.fontTrigger = $(this.FONT_TRIGGER_ID);
		this.fontCtxMenuUtil = new Af.ContexMenuUtil(this.fontCtxMenu);
		var g = this.fontTrigger,
		b = this.fontCtxMenuUtil,
		r = this;
		var m = function(y) {
			if (r.isDisabledUIState) {
				return false
			}
			if (y == null) {
				y = window.event
			}
			b.showContextMenu(g, y);
			return false
		};
		this.fontCtxMenuUtil.addTrigger(this.fontTrigger, m);
		this.fontCtxMenu.addContextMenuListener(new this.FontCtxMenuListener(this.fontCtxMenu, this));
		var o = [{
			id: "",
			text: "[SIZE]"
		},
		{
			id: "8px",
			text: "8 pt"
		},
		{
			id: "9px",
			text: "9 pt"
		},
		{
			id: "10px",
			text: "10 pt"
		},
		{
			id: "11px",
			text: "11 pt"
		},
		{
			id: "12px",
			text: "12 pt"
		},
		{
			id: "13px",
			text: "13 pt"
		},
		{
			id: "14px",
			text: "14 pt"
		},
		{
			id: "16px",
			text: "16 pt"
		},
		{
			id: "18px",
			text: "18 pt"
		},
		{
			id: "20px",
			text: "20 pt"
		},
		{
			id: "22px",
			text: "22 pt"
		},
		{
			id: "24px",
			text: "24 pt"
		},
		{
			id: "26px",
			text: "26 pt"
		},
		{
			id: "28px",
			text: "28 pt"
		},
		{
			id: "30px",
			text: "30 pt"
		},
		{
			id: "36px",
			text: "36 pt"
		},
		{
			id: "40px",
			text: "40 pt"
		},
		{
			id: "44px",
			text: "44 pt"
		},
		{
			id: "48px",
			text: "48 pt"
		},
		{
			id: "52px",
			text: "52 pt"
		},
		{
			id: "56px",
			text: "56 pt"
		},
		{
			id: "60px",
			text: "60 pt"
		},
		{
			id: "70px",
			text: "70 pt"
		},
		{
			id: "72px",
			text: "72 pt"
		},
		{
			id: "80px",
			text: "80 pt"
		},
		{
			id: "84px",
			text: "84 pt"
		},
		{
			id: "90px",
			text: "90 pt"
		},
		{
			id: "96px",
			text: "96 pt"
		},
		{
			id: "100px",
			text: "100 pt"
		}];
		var x = {
			selectedIndex: 0,
			itemWidth: 80,
			itemsHeight: 220,
			onChange: this.fontSizeChanged.bind(this),
			items: o,
		};
		this.fontSizeSelectWidget = new SelectWidget(this.FONT_SIZE_SELECT_CONTAINER_ID, x)
	},
	FontCtxMenuListener: function(a, m) {
		var b = m.fontCtxMenu,
		g = m.fontTrigger;
		this.contextMenuAction = function(q, u) {
			console.log("FormatButtonView FontCtxMenuListener actionName=" + q + "  target=" + u);
			var o = q,
			r = b.getItemDisplayName(o);
			g.innerHTML = r;
			PubSub.publish(ToolbarUtils.FONT_FAMILY_TOPIC, {
				fontFamily: o
			})
		}
	},
	getFontCtxMenu: function(g, m, a) {
		var b = new Af.ContextMenu("font_ctx_menu", null, g, a);
		b.container = m;
		b.cssComp = "fontFamilyContextMenu fontFamilyFontContextMenu fontFamilyContextMenu";
		b.element = b.render();
		return b
	},
	bindEvents: function() {
		var o = $(this.FORMAT_MENU_CLOSE_BUTTON_ID);
		o.observe("click", this.close.bind(this));
		var a = $(this.BOLD_BUTTON_ID);
		a.observe("click", this.boldBtnClick.bind(this));
		var b = $(this.ITALIC_BUTTON_ID);
		b.observe("click", this.italicBtnClick.bind(this));
		var g = $(this.UNDERLINE_BUTTON_ID);
		g.observe("click", this.underlineBtnClick.bind(this));
		var m = $(this.FONT_SELECT_ID);
		m.observe("change", this.fontSelectChanged.bind(this));
		var q = $(this.FONT_COLOR_BUTTON_ID);
		q.observe("click", this.fontColorBtnClick.bind(this))
	},
	objectSelectionSibscriber: function(m, b) {
		console.log("FormatButtonView objectSelectionSibscriber ");
		console.log(b);
		var a = b.selectedObj;
		if (!a) {
			this.setDisabledUIState();
			return
		}
		if (a.type != this.TEXT_OBJECT_TYPE) {
			this.setDisabledUIState();
			return
		}
		this.setIntialStateOfUI();
		var g = this._getCurrentSelectedObjectFontProperties(a);
		this._setUIValues(g)
	},
	fontSizeSubscriber: function(o, m) {
		console.log("FormatButtonView fontSizeSubscriber " + JSON.stringify(m));
		var g = this.FONT_SIZE_SELECT_ID;
		var a = m.fontSize;
		var b = this.fontSizeSelectWidget.getDataTextById(a);
		this.fontSizeSelectWidget.setLabelText(b)
	},
	fontFamilySubscriber: function(q, g) {
		console.log("FormatButtonView fontTypeSubscriber ");
		console.log(g);
		var r = ToolbarUtils.getCurrentSelectedTextObject();
		if (!r) {
			return
		}
		var a = g.fontFamily,
		o = this.fontUtils.supportsBold(a),
		b = this.fontUtils.supportsItalic(a);
		fontSize = this._getCurrentSelectedObjectFontSize(r),
		hexColor = this._getCurrentSelectedObjectFontColor(r);
		var m = {
			fontSize: fontSize,
			fontFamily: a,
			supportsBold: o,
			supportsItalic: b,
			hexColor: hexColor
		};
		this._setUIValues(m)
	},
	boldBtnClick: function(a) {
		console.log("boldBtnClick");
		if (this.isDisabledUIState) {
			return
		}
		ToolbarUtils.lookupRTEEditor().makeTextBold(a)
	},
	italicBtnClick: function(a) {
		console.log("italicBtn");
		if (this.isDisabledUIState) {
			return
		}
		ToolbarUtils.lookupRTEEditor().makeTextItalic(a)
	},
	underlineBtnClick: function(a) {
		console.log("underlineBtn");
		if (this.isDisabledUIState) {
			return
		}
		ToolbarUtils.lookupRTEEditor().makeTextUnderline(a)
	},
	fontSelectChanged: function(m) {
		console.log("FormatButtonView fontSelectChanged");
		var q = $(this.FONT_SELECT_ID);
		var b = q.selectedIndex;
		var g = q.options[b],
		a = g.value;
		console.log("FormatButtonView selectedFontFamily=" + a);
		var o = {
			fontFamily: a
		};
		PubSub.publish(ToolbarUtils.FONT_FAMILY_TOPIC, o)
	},
	fontSizeChanged: function(g, b, o, m) {
		console.log("fontSizeSelectChanged");
		if (b == 0) {
			return
		}
		var a = o;
		console.log("newFontSize=" + a);
		PubSub.publish(ToolbarUtils.FONT_SIZE_TOPIC, {
			fontSize: a
		})
	},
	fontColorBtnClick: function(q) {
		console.log("fontColorBtnClick");
		if (this.isDisabledUIState) {
			return
		}
		var g = this;
		var o = {
			colorSelected: function(u) {
				console.log("colorSelected=" + u);
				var x = "#" + u;
				g._setSelectedColorIndicator(x);
				PubSub.publish(ToolbarUtils.FONT_COLOR_TOPIC, {
					fontColor: u
				});
				b.close()
			}
		};
		var b = new Af.ColorPicker(o);
		b.alignment = "not_existed_value";
		var m = q.element().cumulativeOffset();
		var a = m[0] + this.COLOR_PICKER_X_OFFSET;
		var r = m[1] + this.COLOR_PICKER_Y_OFFSET;
		b.show(this.COLOR_PICKER_CONTAINER_ID, a, r)
	},
	fontColorSibscriber: function(m, g) {
		console.log("FormatButtonView fontColorSibscriber " + JSON.stringify(g));
		var a = g.fontColor;
		var b = "#" + a;
		this._setSelectedColorIndicator(b)
	},
	open: function() {
		console.log("FormatButtonView open");
		if (this.isOpened) {
			return
		}
		if (this.isDisabledUIState) {
			return
		}
		this.actionHandler.addImageButtonView.close();
		this.actionHandler.arrangeButtonView.close();
		this.actionHandler.viewButtonView.close();
		var a = $("formatText");
		ToolbarUtils.active(a, this.BUTTON_BASE_CLASS);
		var b = $(this.FORMAT_MENU_ID);
		b.removeClassName(this.HIDE_CLASS);
		this.isOpened = true;
		this.setIntialStateOfUI()
	},
	_setSelectedColorIndicator: function(a) {
		$(this.SELECTED_COLOR_INDICATOR_ID).setStyle({
			backgroundColor: a
		})
	},
	_getCurrentSelectedObjectFontProperties: function(m) {
		var b = this._getCurrentSelectedObjectFontSize(m);
		fontFamily = m.fontFamily,
		supportsBold = this.fontUtils.supportsBold(fontFamily),
		supportsItalic = this.fontUtils.supportsItalic(fontFamily);
		var a = this._getCurrentSelectedObjectFontColor(m);
		var g = {
			fontSize: b,
			fontFamily: fontFamily,
			supportsBold: supportsBold,
			supportsItalic: supportsItalic,
			hexColor: a
		};
		return g
	},
	_getCurrentSelectedObjectFontSize: function(b) {
		var a = b.oFontSize;
		return a
	},
	_getCurrentSelectedObjectFontColor: function(g) {
		var b = this.DEFAULT_COLOR;
		if (g.words && g.words.length != 0) {
			b = g.words[0]["c"]
		} else {
			if (g.dw && g.dw.dw && g.dw.dw[0]) {
				var a = g.dw.dw[0];
				b = a.color
			} else {
				b = "#" + g.color
			}
		}
		return b
	},
	setIntialStateOfUI: function() {
		var b = ToolbarUtils.getCurrentSelectedTextObject();
		if (!b) {
			this.setDisabledUIState();
			return
		}
		if (!this.isOpened) {
			ToolbarUtils.on($("formatText"), this.BUTTON_BASE_CLASS)
		}
		var a = this._getCurrentSelectedObjectFontProperties(b);
		this._setUIValues(a)
	},
	_setUIValues: function(r) {
		this.isDisabledUIState = false;
		$(this.FONT_SELECT_ID).enable();
		this._setSelectedColorIndicator(r.hexColor);
		var o = this.fontSizeSelectWidget.getDataTextById(r.fontSize);
		this.fontSizeSelectWidget.setLabelText(o);
		var b = r.fontFamily,
		q = this.fontCtxMenu.getItemDisplayName(r.fontFamily);
		this.fontTrigger.innerHTML = q;
		this.fontCtxMenu.setSelectedItem(b);
		var a = $(this.BOLD_BUTTON_ID),
		g = $(this.ITALIC_BUTTON_ID),
		m = $(this.UNDERLINE_BUTTON_ID);
		if (r.supportsBold) {
			ToolbarUtils.setCssClass(a, this.BOLD_BUTTON_BASE_CLASS)
		} else {
			ToolbarUtils.disable(a, this.BOLD_BUTTON_BASE_CLASS)
		}
		if (r.supportsItalic) {
			ToolbarUtils.setCssClass(g, this.ITALIC_BUTTON_BASE_CLASS)
		} else {
			ToolbarUtils.disable(g, this.ITALIC_BUTTON_BASE_CLASS)
		}
		ToolbarUtils.setCssClass(m, this.UNDERLINE_BUTTON_BASE_CLASS)
	},
	setDisabledUIState: function() {
		console.log("FormatButtonView setDisabledUIState");
		this.isDisabledUIState = true;
		this.fontSizeSelectWidget.setLabelText(this.DISABLED_FONT_SIZE_VALUE);
		var a = $(this.FORMAT_MENU_ID);
		a.addClassName(this.HIDE_CLASS);
		this.isOpened = false;
		this.fontTrigger.innerHTML = this.DISABLED_FONT_FAMILY_VALUE;
		this._setSelectedColorIndicator(this.DISABLED_COLOR_VALUE);
		ToolbarUtils.off($("formatText"), this.BUTTON_BASE_CLASS);
		ToolbarUtils.disable($(this.BOLD_BUTTON_ID), this.BOLD_BUTTON_BASE_CLASS);
		ToolbarUtils.disable($(this.ITALIC_BUTTON_ID), this.ITALIC_BUTTON_BASE_CLASS);
		ToolbarUtils.disable($(this.UNDERLINE_BUTTON_ID), this.UNDERLINE_BUTTON_BASE_CLASS)
	},
	close: function() {
		console.log("FormatButtonView close");
		if (!this.isOpened) {
			return
		}
		var a = $(this.FORMAT_MENU_ID);
		a.addClassName(this.HIDE_CLASS);
		this.isOpened = false;
		this.setIntialStateOfUI()
	},
	disable: function() {
		console.log("disable")
	}
});
PsP.AddImageButtonView = Class.create({
	BUTTON_BASE_CLASS: "t_addImageCDE",
	HIDE_CLASS: "hide",
	ADD_IMAGE_MENU_CLOSE_BUTTON_SELECTOR: ".t_boxImage .butn_close",
	ADD_IMAGE_MENU_CLASS_SELECTOR: ".t_boxImage",
	FILL_BUTTON_ID: "fillBtn",
	FILL_BUTTON_BASE_CLASS: "t_boxImage_fill",
	DISABLED_COLOR_VALUE: "#ffffff",
	RECTANGLE_OBJECT_TYPE: "rectangle",
	SELECTED_FILL_COLOR_INDICATOR_ID: "selectedFillColorIndicator",
	FILL_COLOR_BUTTON_ID: "fillColorBtn",
	IMAGE_FROM_COMP_BUTTON_SELECTOR: ".t_boxImage_upload_on",
	IMAGE_FROM_GALLARY_BUTTON_SELECTOR: ".t_boxImage_image_library_on",
	_selectImage: false,
	initialize: function(a) {
		console.log("intialize AddImageButtonView");
		this.actionHandler = a;
		this.isOpened = false;
		PubSub.subscribe(ToolbarUtils.OBJECT_SELECTION_TOPIC, this.objectSelectionSibscriber.bind(this));
		this.bindEvents()
	},
	_isImageSelect: function() {
		return this._selectImage
	},
	setImageSelect: function(a) {
		this._selectImage = a
	},
	bindEvents: function() {
		var m = ToolbarUtils.findByClass(this.ADD_IMAGE_MENU_CLOSE_BUTTON_SELECTOR);
		m.observe("click", this.close.bind(this));
		var g = $(this.FILL_COLOR_BUTTON_ID);
		g.observe("click", this.fillColorBtnClick.bind(this));
		var a = ToolbarUtils.findByClass(this.IMAGE_FROM_COMP_BUTTON_SELECTOR);
		a.observe("click", this.imageFromCompBtnClick.bind(this));
		var b = ToolbarUtils.findByClass(this.IMAGE_FROM_GALLARY_BUTTON_SELECTOR);
		b.observe("click", this.imageFromGalleryBtnClick.bind(this))
	},
	imageFromCompBtnClick: function() {
		if (this._isImageSelect()) {
			designer.changeImage()
		} else {
			designer.imageTool()
		}
	},
	imageFromGalleryBtnClick: function() {
		if (this._isImageSelect()) {
			designer.changeImageFromGallery()
		} else {
			designer.addImageFromGallery()
		}
	},
	fillColorBtnClick: function(a) {
		console.log("fillColorBtnClick");
		if (this.isDisabledUIState) {
			return
		}
		var u = this;
		var r = {
			colorSelected: function(x) {
				console.log("colorSelected=" + x);
				var y = "#" + x;
				u._setSelectedColorIndicator(y);
				u._setObjectFillColor(x);
				b.close()
			}
		};
		var b = new Af.ColorPicker(r);
		b.alignment = "not_existed_value";
		var m = "MainArea";
		var z = 190;
		var g = a.element().cumulativeOffset();
		var q = g[0];
		var o = g[1] - z;
		b.show(m, q, o)
	},
	_setObjectFillColor: function(a) {
		designer.currentSurface.setBackgroundColor(a)
	},
	click: function() {
		console.log("AddImageButtonView click");
		if (this.isOpened) {
			return
		}
		this.actionHandler.arrangeButtonView.close();
		this.actionHandler.viewButtonView.close();
		this.actionHandler.formatButtonView.close();
		var a = $("addImage");
		ToolbarUtils.active(a, this.BUTTON_BASE_CLASS);
		var b = ToolbarUtils.findByClass(this.ADD_IMAGE_MENU_CLASS_SELECTOR);
		b.removeClassName(this.HIDE_CLASS);
		this.isOpened = true
	},
	objectSelectionSibscriber: function(m, g) {
		console.log("AddImageButtonView objectSelectionSibscriber");
		var b = g.selectedObj;
		if (!b) {
			this.setDisabledUIState();
			return
		}
		if (b.type !== this.RECTANGLE_OBJECT_TYPE) {
			this.setDisabledUIState();
			return
		}
		var a = this._getCurrentSelectedObjectColor(b);
		this._setUIValues(a)
	},
	setIntialStateOfUI: function() {
		var b = ToolbarUtils.getCurrentSelectedTextObject();
		if (!b) {
			this.setDisabledUIState();
			return
		}
		var a = this._getCurrentSelectedObjectColor(b);
		this._setUIValues(a)
	},
	_setUIValues: function(a) {
		this.isDisabledUIState = false;
		this._setSelectedColorIndicator(a);
		ToolbarUtils.on($(this.FILL_BUTTON_ID), this.FILL_BUTTON_BASE_CLASS)
	},
	setDisabledUIState: function() {
		console.log("AddImageButtonView setDisabledUIState");
		this.isDisabledUIState = true;
		ToolbarUtils.off($(this.FILL_BUTTON_ID), this.FILL_BUTTON_BASE_CLASS);
		this._setSelectedColorIndicator(this.DISABLED_COLOR_VALUE)
	},
	_setSelectedColorIndicator: function(a) {
		console.log("_setSelectedColorIndicator color=" + a);
		$(this.SELECTED_FILL_COLOR_INDICATOR_ID).setStyle({
			backgroundColor: a
		})
	},
	_getCurrentSelectedObjectColor: function(b) {
		var a = this.DISABLED_COLOR_VALUE;
		if (b && b.backgroundColor) {
			a = "#" + b.backgroundColor
		}
		console.log("_getCurrentSelectedObjectColor color=" + a);
		return a
	},
	close: function() {
		console.log("AddImageButtonView close");
		if (!this.isOpened) {
			return
		}
		var a = $("addImage");
		ToolbarUtils.on(a, this.BUTTON_BASE_CLASS);
		var b = ToolbarUtils.findByClass(this.ADD_IMAGE_MENU_CLASS_SELECTOR);
		b.addClassName(this.HIDE_CLASS);
		this.isOpened = false
	},
	disable: function() {
		console.log("AddImageButtonView disable")
	}
});
PsP.ArrangeButtonView = Class.create({
	BUTTON_BASE_CLASS: "t_arrangeCDE",
	HIDE_CLASS: "hide",
	ARRANGE_MENU_CLOSE_BUTTON_SELECTOR: ".t_boxArrange .butn_close",
	ARRANGE_MENU_CLASS_SELECTOR: ".t_boxArrange",
	ROTATE_LEFT_BUTTON_SELECTOR: ".t_boxArrange_rotate_left_on",
	ROTATE_RIGHT_BUTTON_SELECTOR: ".t_boxArrange_rotate_righ_on",
	ALIGN_LEFT_BUTTON_SELECTOR: ".t_boxArrange_align_left_on",
	ALIGN_CENTER_BUTTON_SELECTOR: ".t_boxArrange_align_center_on",
	ALIGN_RIGHT_BUTTON_SELECTOR: ".t_boxArrange_align_right_on",
	_groupSelection: false,
	initialize: function(a) {
		console.log("intialize");
		this.actionHandler = a;
		this.isOpened = false;
		this.isDisable = true;
		this.bindEvents()
	},
	setGroupSelection: function(a) {
		this._groupSelection = a
	},
	_isGroupSelection: function() {
		return this._groupSelection
	},
	bindEvents: function() {
		var o = ToolbarUtils.findByClass(this.ARRANGE_MENU_CLOSE_BUTTON_SELECTOR);
		o.observe("click", this.close.bind(this));
		var q = ToolbarUtils.findByClass(this.ROTATE_RIGHT_BUTTON_SELECTOR);
		q.observe("click", this.rotateRightBtnClick.bind(this));
		var m = ToolbarUtils.findByClass(this.ROTATE_LEFT_BUTTON_SELECTOR);
		m.observe("click", this.rotateLeftBtnClick.bind(this));
		var g = ToolbarUtils.findByClass(this.ALIGN_LEFT_BUTTON_SELECTOR);
		g.observe("click", this.alignLeftBtnClick.bind(this));
		var a = ToolbarUtils.findByClass(this.ALIGN_CENTER_BUTTON_SELECTOR);
		a.observe("click", this.alignCenterBtnClick.bind(this));
		var b = ToolbarUtils.findByClass(this.ALIGN_RIGHT_BUTTON_SELECTOR);
		b.observe("click", this.alignRightBtnClick.bind(this))
	},
	rotateRightBtnClick: function() {
		if (this._isGroupSelection()) {
			designer.groupRotateRight()
		} else {
			designer.rotateRight()
		}
	},
	rotateLeftBtnClick: function() {
		if (this._isGroupSelection()) {
			designer.groupRotateLeft()
		} else {
			designer.rotateLeft()
		}
	},
	alignLeftBtnClick: function() {
		if (this._isGroupSelection()) {
			designer.groupAlignLeft()
		} else {
			designer.multiRTEEditor.doCommand("justifyleft")
		}
	},
	alignCenterBtnClick: function() {
		if (this._isGroupSelection()) {
			designer.groupAlignCenter()
		} else {
			designer.multiRTEEditor.doCommand("justifycenter")
		}
	},
	alignRightBtnClick: function() {
		if (this._isGroupSelection()) {
			designer.groupAlignRight()
		} else {
			designer.multiRTEEditor.doCommand("justifyright")
		}
	},
	click: function() {
		console.log("ArrangeButtonView click");
		if (this.isOpened) {
			return
		}
		if (this.isDisable) {
			return
		}
		this.actionHandler.addImageButtonView.close();
		this.actionHandler.viewButtonView.close();
		this.actionHandler.formatButtonView.close();
		var a = $("arrange");
		ToolbarUtils.active(a, this.BUTTON_BASE_CLASS);
		var b = ToolbarUtils.findByClass(this.ARRANGE_MENU_CLASS_SELECTOR);
		b.removeClassName(this.HIDE_CLASS);
		this.isOpened = true
	},
	close: function() {
		console.log("ArrangeButtonView close");
		if (!this.isOpened) {
			return
		}
		var a = $("arrange");
		if (this.isDisable) {
			ToolbarUtils.off(a, this.BUTTON_BASE_CLASS)
		} else {
			ToolbarUtils.on(a, this.BUTTON_BASE_CLASS)
		}
		var b = ToolbarUtils.findByClass(this.ARRANGE_MENU_CLASS_SELECTOR);
		b.addClassName(this.HIDE_CLASS);
		this.isOpened = false
	},
	on: function() {
		this.isDisable = false;
		var a = $("arrange");
		ToolbarUtils.on(a, this.BUTTON_BASE_CLASS)
	},
	disable: function() {
		console.log("disable");
		this.isDisable = true;
		var a = $("arrange");
		ToolbarUtils.off(a, this.BUTTON_BASE_CLASS)
	}
});
PsP.ViewButtonView = Class.create({
	BUTTON_BASE_CLASS: "t_viewCDE",
	HIDE_CLASS: "hide",
	VIEW_MENU_CLOSE_BUTTON_SELECTOR: ".t_boxView .butn_close",
	VIEW_MENU_CLASS_SELECTOR: ".t_boxView",
	initialize: function(a) {
		console.log("intialize");
		this.actionHandler = a;
		this.isOpened = false;
		this.bindEvents(a)
	},
	bindEvents: function(m) {
		var g = ToolbarUtils.findByClass(this.VIEW_MENU_CLOSE_BUTTON_SELECTOR);
		g.observe("click", this.close.bind(this));
		var a = ["guideLines", "final_size", "rulers", "grid", "snap"];
		for (var b = 0; b < a.length; b++) {
			$(a[b]).observe("click", this.clicked.bind(this, a[b]))
		}
		$("helpBubbles").observe("click",
		function() {
			if (!$("pop") || $("pop").parentElement.style.display === "none") {
				designer.calloutOptionChanged(true)
			} else {
				designer.calloutOptionChanged(false)
			}
		})
	},
	clicked: function(b) {
		var a = $$('input:checked[type="radio"][name=' + b + "]").first().value;
		switch (b) {
		case "guideLines":
			if (a === "on") {
				designer.trimLinesOptionChanged(false)
			} else {
				designer.trimLinesOptionChanged(true)
			}
			break;
		case "final_size":
			if (a === "on") {
				designer.trimLinesOptionChanged(true)
			} else {
				designer.trimLinesOptionChanged(false)
			}
			break;
		case "rulers":
			if ($("vRuler").style.display === "none" && a === "on") {
				this.actionHandler.toggleRuler()
			} else {
				if ($("vRuler").style.display === "" && a === "off") {
					this.actionHandler.toggleRuler()
				}
			}
			break;
		case "grid":
			designer.gridToggle(a === "on");
			break;
		case "snap":
			designer.snapToggle(a === "on");
			break
		}
	},
	click: function() {
		console.log("ViewButtonView click");
		if (this.isOpened) {
			return
		}
		if (this.actionHandler.arrangeButtonView) {
			this.actionHandler.addImageButtonView.close();
			this.actionHandler.arrangeButtonView.close();
			this.actionHandler.formatButtonView.close()
		}
		var a = $("bleedMaskView");
		ToolbarUtils.active(a, this.BUTTON_BASE_CLASS);
		var b = ToolbarUtils.findByClass(this.VIEW_MENU_CLASS_SELECTOR);
		b.removeClassName(this.HIDE_CLASS);
		this.isOpened = true
	},
	close: function() {
		console.log("ViewButtonView close");
		if (!this.isOpened) {
			return
		}
		var a = $("bleedMaskView");
		ToolbarUtils.on(a, this.BUTTON_BASE_CLASS);
		var b = ToolbarUtils.findByClass(this.VIEW_MENU_CLASS_SELECTOR);
		b.addClassName(this.HIDE_CLASS);
		this.isOpened = false
	},
	disable: function() {
		console.log("disable")
	}
});
PsP.ActionHandler = Class.create({
	initialize: function() {
		this._lineWidth = $("lineWidth");
		if (this._lineWidth) {
			this.lwCtxMenu = this.getLineWidthCtxMenu();
			this.lwCtxMenuUtil = new Af.ContexMenuUtil(this.lwCtxMenu);
			this.lwCtxMenuUtil.addTrigger(this._lineWidth);
			this.lwCtxMenu.addContextMenuListener(new this.LineWidthCtxMenuListener(this.lwCtxMenu, this))
		}
		this._addObject = $("addObject");
		if (this._addObject) {
			this.addObjCtxMenu = this.getAddObjCtxMenu();
			this.addObjCtxMenuUtil = new Af.ContexMenuUtil(this.addObjCtxMenu);
			this.addObjCtxMenuUtil.addTrigger(this._addObject);
			this.addObjCtxMenu.addContextMenuListener(new this.AddObjCtxMenuListener(this.addObjCtxMenu, this))
		}
		this._changeImage = $("changeImage");
		if (this._changeImage) {
			this.changeImageCtxMenu = this.getChangeImageCtxMenu();
			this.changeImageCtxMenuUtil = new Af.ContexMenuUtil(this.changeImageCtxMenu);
			this.changeImageCtxMenuUtil.addTrigger(this._changeImage);
			this.changeImageCtxMenu.addContextMenuListener(new this.ChangeImageCtxMenuListener(this.changeImageCtxMenu, this))
		}
		this._changeBGImage = $("changeBGImage");
		if (this._changeBGImage) {
			this.changeBGImageCtxMenu = this.getChangeBGImageCtxMenu();
			this.changeBGImageCtxMenuUtil = new Af.ContexMenuUtil(this.changeBGImageCtxMenu);
			this.changeBGImageCtxMenuUtil.addTrigger(this._changeBGImage);
			this.changeBGImageCtxMenu.addContextMenuListener(new this.ChangeImageCtxMenuListener(this.changeBGImageCtxMenu, this))
		}
		this._mailList = $("mailList");
		if (this._mailList) {
			this.mailCtxMenu = this.getMailCtxMenu();
			this.mailCtxMenuUtil = new Af.ContexMenuUtil(this.mailCtxMenu);
			this.mailCtxMenuUtil.addTrigger(this._mailList);
			this.mailCtxMenu.addContextMenuListener(new this.AddMailCtxMenuListener(this.mailCtxMenu, this))
		}
		this._align = $("align");
		if (this._align) {
			this.alignCtxMenu = this.getAlignCtxMenu();
			this.alignCtxMenuUtil = new Af.ContexMenuUtil(this.alignCtxMenu);
			this.alignCtxMenuUtil.addTrigger(this._align);
			this.alignCtxMenu.addContextMenuListener(new this.AlignCtxMenuListener(this.alignCtxMenu, this))
		}
		var g = $$(".rotateActionClass");
		for (var b = 0; b < g.length; b++) {
			var a = this.getRotateCtxMenu();
			var o = new Af.ContexMenuUtil(a);
			o.addTrigger(g[b]);
			a.addContextMenuListener(new this.RotateCtxMenuListener(a, this))
		}
		this.selectionGroup = $("selectionGroup");
		this.defaultMsgGroup = $("defaultMsgGroup");
		this.multiSelectionGroup = $("multiSelectionGroup");
		this.bgImageGroup = $("bgImageGroup");
		this.ovlyImageGroup = $("ovlyImageGroup");
		this.textGroup = $("textGroup");
		this.objectGroup = $("objectGroup");
		this.textGroupSep = $("textGroupSep");
		this.imageGroupSep = $("imageGroupSep");
		this.ovlyImageGroupSep = $("ovlyImageGroupSep");
		this.objectGroupSep = $("objectGroupSep");
		this.multiSelectSep = $("multiSelectSep");
		this.defaultMsgGroup2 = $("defaultMsgGroup2");
		if ($("lockElem")) {
			this.lockComp = new PsP.CheckBoxComp($("lockElem"),
			function(m, q) {
				designer.lockObjectToggle(q)
			})
		}
		if ($("aspectRatio")) {
			this.aspectRatioComp = new PsP.CheckBoxComp($("aspectRatio"),
			function(m, q) {
				designer.aspectRatioLocked = q
			})
		}
		if ((pspspassport) && ($("editName"))) {
			Event.observe($("editName"), "click", this.changeName.bindAsEventListener(this))
		}
		if ((pspspassport) && ($("editName1"))) {
			Event.observe($("editName1"), "click", this.changeName.bindAsEventListener(this))
		}
		if ($("saveDesign_topBar")) {
			Event.observe($("saveDesign_topBar"), "click", this.saveDesign.bind(this))
		}
		if ($("textBoxBtn")) {
			$("textBoxBtn").observe("click", this.addNewText.bind(this))
		}
		if (_currentStation_ === "position") {
			if ($("formatText")) {
				this.formatButtonView = new PsP.FormatButtonView(this);
				$("formatText").observe("click", this.formatButtonView.open.bind(this.formatButtonView))
			}
			if ($("addImage")) {
				this.addImageButtonView = new PsP.AddImageButtonView(this);
				$("addImage").observe("click", this.addImageButtonView.click.bind(this.addImageButtonView))
			}
			if ($("arrange")) {
				this.arrangeButtonView = new PsP.ArrangeButtonView(this);
				$("arrange").observe("click", this.arrangeButtonView.click.bind(this.arrangeButtonView))
			}
		}
		if ($("bleedMaskView")) {
			this.viewButtonView = new PsP.ViewButtonView(this);
			$("bleedMaskView").observe("click", this.viewButtonView.click.bind(this.viewButtonView))
		}
		this.disableFunctionalityForDeluxe()
	},
	disableFunctionalityForDeluxe: function() {
		var a = (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"));
		console.log("disableFunctionalityForDeluxe isDeluxStore=" + a);
		if (!a) {
			return
		}
		if ($("saveBtnId")) {
			$("saveBtnId").remove()
		}
		var b = ToolbarUtils.findByClass(".t_boxImage_image_library_on");
		if (b) {
			b.addClassName("hide")
		}
	},
	addNewText: function() {
		designer.setEditTextDialogShouldHideFlag(false);
		this.doAction("addText")
	},
	showUpdateImageDialog: function(g) {
		g.stop();
		var o = $("updateImageBox");
		o.show();
		var b = g.target;
		var m = toDocumentPosition(b);
		o.style.left = m.x + "px";
		o.style.top = (m.y + b.offsetHeight - 2) + "px"
	},
	hideUpdateImageDialog: function(a) {
		a.stop();
		$("updateImageBox").hide()
	},
	artworkLoaded: function(o) {
		var a = o.parameter;
		if (a == null) {
			return
		}
		for (var b = 0; b < a.length; b++) {
			var m = a[b];
			if (m.optionType == "Mail Service" && m.val && m.val.toLowerCase() != "no") {
				if ($("mailList")) {
					$("mailList").style.display = ""
				}
			}
		}
		var g = $("usernameDisplay");
		if (g) {
			g.innerHTML = o.customerName
		}
		g = $("usernameContainer");
		if (g) {
			Element.show(g)
		}
		if (o.customerName != "Guest") {
			g = $("LoginSpan");
			if (g) {
				Element.hide(g)
			}
		}
	},
	getLineWidthCtxMenu: function() {
		var a = new Af.ContextMenu("lw_menu");
		for (var b = 0; b < 10; b++) {
			a.addMenuItem(b, b + " pt")
		}
		a.width = "80px";
		a.element = a.render();
		return a
	},
	getAddObjCtxMenu: function() {
		var a = new Af.ContextMenu("add_obj_menu");
		a.addMenuItem("rectangle", "Rectangle");
		a.addMenuItem("hline", "Horizontal Line");
		a.addMenuItem("vline", "Vertical Line");
		a.width = "90px";
		a.element = a.render();
		return a
	},
	getArrangeCtxMenu: function() {
		var a = new Af.ContextMenu("add_arr_menu");
		a.addMenuItem("bringToFront", "Bring Front");
		a.addMenuItem("sendToBack", "Send Back");
		a.width = "90px";
		a.element = a.render();
		return a
	},
	getAlignCtxMenu: function() {
		var b = new Af.ContextMenu("align_arr_menu");
		b.addMenuItem("left", "Left");
		b.addMenuItem("center", "Center");
		var a = b.addMenuItem("right", "Right");
		a.hasSeparator = true;
		b.addMenuItem("top", "Top");
		b.addMenuItem("middle", "Middle");
		var a = b.addMenuItem("bottom", "Bottom");
		a.hasSeparator = true;
		b.addMenuItem("bringToFront", "Bring Front");
		b.addMenuItem("sendToBack", "Send Back");
		b.width = "90px";
		b.element = b.render();
		return b
	},
	getRotateCtxMenu: function() {
		var a = new Af.ContextMenu("rotate_arr_menu");
		a.addMenuItem("right", "Right");
		a.addMenuItem("left", "Left");
		a.width = "90px";
		a.element = a.render();
		return a
	},
	getChangeImageCtxMenu: function() {
		var a = new Af.ContextMenu("add_image_menu");
		a.addMenuItem("changeImage", "Upload new image");
		var b = (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"));
		if (!b) {
			a.addMenuItem("selectImageToChange", "Image Libraries")
		}
		a.width = "120px";
		a.element = a.render();
		return a
	},
	getChangeBGImageCtxMenu: function() {
		var a = new Af.ContextMenu("add_image_menu");
		a.addMenuItem("changeBGImage", "Upload new image");
		var b = (typeof _storeId_ != "undefined" && (_storeId_ == "35" || _storeId_ == "67"));
		if (!b) {
			a.addMenuItem("selectBGImageToChange", "Image Libraries")
		}
		a.addMenuItem("changeBackgroundColor", "Change Background Color");
		a.width = "150px";
		a.element = a.render();
		return a
	},
	getBleedMaskCtxMenu: function() {
		var g = new Af.ContextMenu("bleed_mask_menu");
		g.addMenuItem("bleed", "Show print guidelines");
		var b = g.addMenuItem("mask", "Show design cut at final size ");
		b.hasSeparator = true;
		var m = (typeof _currentStation_ != "undefined" && _currentStation_ == "position");
		if (m) {
			b = g.addMenuItem("helpBubbles", "Help Bubbles");
			b.checkMark = true;
			b.hasSeparator = true;
			this.helpBubbleComp = b
		}
		b = g.addMenuItem("gridOnOff", "Grid on");
		b.checkMark = true;
		this.gridOnOffComp = b;
		if (typeof _currentStation_ != "undefined" && _currentStation_ == "position") {
			var b = g.addMenuItem("snap", "Snap to Grid");
			b.checkMark = true;
			b.hasSeparator = true;
			this.gridSnapComp = b
		}
		b = g.addMenuItem("rulerOnOff", "Ruler on");
		b.checkMark = true;
		this.rulerOnOffComp = b;
		g.width = "160px";
		g.element = g.render();
		return g
	},
	getMailCtxMenu: function() {
		var a = new Af.ContextMenu("mail_list_menu");
		a.addMenuItem("add", "Add mail list");
		a.addMenuItem("show", "Show mail list");
		a.addMenuItem("map", "Show data mapper");
		a.width = "150px";
		a.element = a.render();
		return a
	},
	LineWidthCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			designer.lineWidthChange(g)
		}
	},
	AddObjCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			designer.addObject(g)
		}
	},
	AddImageCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			this.parent.doAction(g)
		}
	},
	ArrangeCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			if (g == "bringToFront") {
				designer.bringToFront();
				return false
			} else {
				designer.sendToBack();
				return false
			}
		}
	},
	AlignCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			if (g == "left") {
				designer.groupAlignLeft();
				return false
			} else {
				if (g == "center") {
					designer.groupAlignCenter();
					return false
				} else {
					if (g == "right") {
						designer.groupAlignRight();
						return false
					} else {
						if (g == "top") {
							designer.groupAlignTop();
							return false
						} else {
							if (g == "middle") {
								designer.groupAlignMiddle();
								return false
							} else {
								if (g == "bottom") {
									designer.groupAlignBottom();
									return false
								} else {
									if (g == "bringToFront") {
										designer.bringToFront();
										return false
									} else {
										if (g == "sendToBack") {
											designer.sendToBack();
											return false
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	RotateCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			if (g == "left") {
				designer.rotateLeft();
				return false
			} else {
				if (g == "right") {
					designer.rotateRight();
					return false
				}
			}
		}
	},
	ChangeImageCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			this.parent.doAction(g)
		}
	},
	AddBleedMaskCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, q, m) {
			var r = (typeof _currentStation_ != "undefined" && _currentStation_ == "position");
			if (g == "bleed") {
				designer.trimLinesOptionChanged(false);
				this.parent._bleedMaskView.className = r ? "toolSpriteCDE t_viewCDE": "adToolOffSprite ad_view"
			} else {
				if (g == "mask") {
					designer.trimLinesOptionChanged(true);
					this.parent._bleedMaskView.className = r ? "toolSpriteCDE_off t_viewCDE_off": "adToolSprite ad_view"
				} else {
					if (g == "helpBubbles") {
						var o = m.checkbox.checked;
						designer.calloutOptionChanged(o)
					} else {
						if (g == "gridOnOff") {
							designer.gridToggle(m.checkbox.checked)
						} else {
							if (g == "snap") {
								if (m.checkbox.checked) {
									this.parent.gridOnOffComp.checkbox.checked = true;
									designer.gridToggle(true)
								}
								designer.snapToggle(m.checkbox.checked)
							} else {
								if (g == "rulerOnOff") {
									this.parent.toggleRuler()
								} else {
									designer.hideAllGuideLines(true);
									this.parent._bleedMaskView.className = r ? "toolSpriteCDE_off t_viewCDE": "adToolSprite ad_view"
								}
							}
						}
					}
				}
			}
		}
	},
	AddBleedMaskCropCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			var o = (typeof _currentStation_ != "undefined" && _currentStation_ == "position");
			if (g == "bleed") {
				designer.trimLinesOptionChanged(false);
				this.parent._bleedMaskViewCrop.className = o ? "toolSpriteCrop t_viewCrop": "adToolOffSpriteCrop ad_viewCrop"
			} else {
				if (g == "mask") {
					designer.trimLinesOptionChanged(true);
					this.parent._bleedMaskViewCrop.className = o ? "toolSpriteCrop_off t_viewCrop": "adToolSpriteCrop ad_viewCrop"
				} else {
					designer.hideAllGuideLines(true);
					this.parent._bleedMaskView.className = o ? "toolSpriteCrop_off t_viewCrop": "adToolSpriteCrop ad_view"
				}
			}
		}
	},
	AddGridCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, o, m) {
			var q = (typeof _currentStation_ != "undefined" && _currentStation_ == "position");
			if (g == "on") {
				this.parent._grid.className = q ? "toolSpriteCDE t_gridCDE": "adToolSprite ad_grid";
				designer.gridToggle(true)
			} else {
				if (g == "snap") {
					if (m.checkbox.checked) {
						designer.gridToggle(true)
					}
					designer.snapToggle(m.checkbox.checked);
					this.parent._grid.className = (designer.showGrid || m.checkbox.checked) ? (q ? "toolSpriteCDE t_gridCDE": "adToolSprite ad_grid") : (q ? "toolSprite_off t_grid_off": "adToolOffSprite ad_grid")
				} else {
					this.parent._grid.className = (q ? "toolSpriteCDE_off t_gridCDE_off": "adToolOffSprite ad_grid");
					designer.gridToggle(false)
				}
			}
		}
	},
	AddGridCropCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, o, m) {
			var q = (typeof _currentStation_ != "undefined" && _currentStation_ == "position");
			if (g == "on") {
				this.parent._gridCrop.className = q ? "toolSpriteCDE t_gridCDE": "adToolOffSpriteCrop ad_gridCrop";
				designer.gridToggle(true)
			} else {
				if (g == "snap") {
					if (m.checkbox.checked) {
						designer.gridToggle(true)
					}
					designer.snapToggle(m.checkbox.checked);
					this.parent._gridCrop.className = (designer.showGrid || m.checkbox.checked) ? (q ? "toolSpriteCrop t_gridCrop_off": "adToolOffSpriteCrop ad_gridCrop") : (q ? "toolSpriteCrop_off t_gridCrop_off": "adToolOffSprite ad_grid")
				} else {
					this.parent._gridCrop.className = (q ? "toolSpriteCrop_off t_gridCrop_off": "adToolSpriteCrop ad_gridCrop");
					designer.gridToggle(false)
				}
			}
		}
	},
	AddMailCtxMenuListener: function(a, b) {
		this.ctx = a;
		this.parent = b;
		this.contextMenuAction = function(g, m) {
			if (g == "add") {
				designer.addDataFile()
			} else {
				if (g == "map") {
					designer.showDataMapper()
				} else {
					designer.showDataFile()
				}
			}
		}
	},
	doAction: function(g, b) {
		if (g == "addText") {
			designer.textAreaTool()
		} else {
			if (g == "addImage") {
				designer.imageTool()
			} else {
				if (g == "fixOverlap") {
					designer.currentSurface.doCheckTemplateOverlap()
				} else {
					if (g == "autoDistribute") {
						designer.currentSurface.autoDistribute()
					} else {
						if (g == "duplicate") {
							designer.duplicate()
						} else {
							if (g == "deleteObject") {
								designer.deleteObject()
							} else {
								if (g == "lineColor") {
									designer.lineColorChange()
								} else {
									if (g == "fillColor") {
										designer.selectBGColor()
									} else {
										if (g == "changeImage") {
											designer.changeImage()
										} else {
											if (g == "changeBGImage") {
												designer.currentSurface.selectObject(null);
												designer.changeImage()
											} else {
												if (g == "autoSize") {
													designer.makeSameSize()
												} else {
													if (g == "ruler") {
														this.toggleRuler()
													} else {
														if (g == "annotation") {
															designer.annotationTool()
														} else {
															if (g == "prevStation") {
																designer.wfe.doPreviousAction(false)
															} else {
																if (g == "nextStation") {
																	var a = designer.wfe.getCurrentStation();
																	if (isSuperAdmin() && a.StationInternalName == "finalReview") {
																		showMessageDialog("Purchase flow is disabled for a Super Admin User.", "Message", 400, 100, null, true);
																		return
																	}
																	if (b == "orderButton" && a.NextStationInternalName == "finalReview") {
																		showMessageDialog(WORKFLOW_NOTIFICATION_REVIEW.text, WORKFLOW_NOTIFICATION_REVIEW.subject, WORKFLOW_NOTIFICATION_REVIEW.width, WORKFLOW_NOTIFICATION_REVIEW.height, this._doNextAction.bind(this));
																		return false
																	}
																	designer.wfe.doNextAction(true)
																} else {
																	if (g == "editText") {
																		designer.setEditTextDialogShouldHideFlag(false);
																		designer.editText()
																	} else {
																		if (g == "selectImage") {
																			designer.addImageFromGallery()
																		} else {
																			if (g == "selectImageToChange") {
																				designer.changeImageFromGallery()
																			} else {
																				if (g == "selectBGImageToChange") {
																					designer.currentSurface.selectObject(null);
																					designer.changeImageFromGallery()
																				} else {
																					if (g == "changeBackgroundColor") {
																						designer.changeBackgroundColor()
																					} else {
																						if (g == "changeStation") {
																							designer.wfe.changeStation("position")
																						} else {
																							if (g == "undo") {
																								designer.undo()
																							} else {
																								if (g == "redo") {
																									designer.redo()
																								} else {
																									if (g == "acrobat") {
																										this.launchAcrobat()
																									} else {
																										if (g == "pauseResumePlayer") {
																											designerContainer4.togglePlayerPauseResume()
																										} else {
																											if (g == "previewOption") {
																												this.previewOptionChanged(true);
																												return
																											} else {
																												if (g == "cropImage") {
																													designer.cropImage();
																													return
																												} else {
																													if (g == "manageTags") {
																														designer.hideEditorDialogs();
																														showTagMapper(designer)
																													} else {
																														if (g == "generatedPdfFrame" || g == "originalFileFrame") {
																															var m = $(g + "C");
																															if (m) {
																																m.style.display = $(g).checked ? "": "none"
																															}
																															return true
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return false
	},
	_doNextAction: function() {
		hideDialogWin();
		designer.wfe.doNextAction(true)
	},
	playerPauseStatusChanged: function(a) {
		var b = $("pauseResumeButton");
		if (b != null) {
			b.innerHTML = designerContainer4.playerPaused ? (!a ? "Play": "Save & Next") : "Pause"
		}
	},
	cropBack: function(a) {
		if (a == "cancel") {
			this.goBackToOriginatingPage()
		} else {
			if (a == "cropTool") {
				designer.wfe.doPreviousAction(false)
			}
		}
		return false
	},
	goBackToOriginatingPage: function() {
		window.location.href = myJobListURL + "?pspspassport=" + Get_Cookie("pspspassport");
		return
	},
	activateGallery: function(a) {
		var m = Get_Cookie("pspspassport");
		var b = "true";
		if (designer.currentSurface.gobjects[0].ArtworkSource == "custom") {
			a = 0;
			b = "false"
		}
		if (a == 0) {
			b = "false"
		}
		designer.addTag("overlay", b);
		designer.addTag("currentSideIndex", designer.currentSide - 1);
		designer.addTag("objectId", a);
		designer.saveDoc(function g() {
			top.location.href = imageLibraryURL;
			return
		},
		null, true)
	},
	updateSelection: function(y, a) {
		PubSub.publish(ToolbarUtils.OBJECT_SELECTION_TOPIC, {
			selectedObj: y,
			groupSelections: a
		});
		if (this.selectionGroup == null) {
			return
		}
		var u = "none";
		var r = "none";
		var q = "none";
		var q = "none";
		var o = "none";
		var m = "none";
		var g = "none";
		var b = "none";
		if (cropFunctionOn) {
			u = "";
			r = ""
		} else {
			if (a && a.length > 0) {
				g = ""
			} else {
				if (y != null) {
					u = "";
					var x = y.type;
					if (x == "image") {
						if (y.mainImage) {
							r = ""
						} else {
							b = ""
						}
					} else {
						if (x == "textarea" || x == "text") {
							q = ""
						} else {
							o = "";
							$("bgcolorTool2").style.display = x == "hline" || x == "vline" ? "none": ""
						}
					}
				} else {
					m = ""
				}
			}
		}
		if (y && this.lockComp) {
			this.lockComp.setValue("" + y.locked == "true")
		}
		if (r === "") {
			this.aspectRatioComp.setValue(true);
			HandlerButtons.setButtonsActiveForMainImage()
		} else {
			HandlerButtons.setButtonsDeActiveForMainImage(this.aspectRatioComp)
		}
		if (q === "" || b === "" || o === "" || u === "") {
			this.arrangeButtonView.on();
			HandlerButtons.setButtonsActiveForTextImage()
		} else {
			this.arrangeButtonView.disable();
			HandlerButtons.setButtonsDeActiveForTextImage(this.lockComp)
		}
		if (g === "") {
			HandlerButtons.setButtonsActiveForGroup();
			this.arrangeButtonView.on();
			this.arrangeButtonView.setGroupSelection(true);
			HandlerButtons.setButtonsActiveForTextImage()
		} else {
			this.arrangeButtonView.setGroupSelection(false);
			HandlerButtons.setButtonsDeActiveForGroup()
		}
		if (!x) {
			return
		}
		if (b === "") {
			HandlerButtons.setButtonsActiveForImage();
			this.addImageButtonView.setImageSelect(true)
		} else {
			HandlerButtons.setButtonsDeActiveForImage();
			this.addImageButtonView.setImageSelect(false)
		}
	},
	changeName: function(o) {
		if (this.designPropDialog == null) {
			this.designPropDialog = new PsP.DesignPropDialog(true);
			this.designPropDialog.parent = this
		}
		this.designPropDialog.show(325, null, "Change Design Name");
		var m = o.target ? o.target: o.srcElement;
		var g = toDocumentPosition(m);
		var a = g.x;
		var q = g.y;
		this.designPropDialog.setLocation(a - 20, q + 20);
		var b = new Object();
		b.name = designer.wfe.designName;
		this.designPropDialog.setData(b);
		Event.stop(o);
		return false
	},
	saveDesign: function() {
		if (!AuthUtil.isLoggedIn()) {
			LoadLogin("1");
			return
		} else {
			designer.saveDoc(function a() {
				location.replace(location.href)
			})
		}
		showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000)
	},
	saveDesigns: function() {
		designer.saveDoc(function a() {
			location.replace(location.href)
		});
		showModalMessageDialog("Saving Design ... please wait", "Saving", 300, 100, 600000)
	},
	toggleRuler: function() {
		var b = $("vRuler");
		if (b == null) {
			return
		}
		var a = Element.getStyle(b, "display");
		a = a == "none" ? "": "none";
		b.style.display = a;
		$("hRuler").style.display = a;
		$("rulerCut").style.display = a;
		this.positionRuler()
	},
	positionRuler: function() {
		var r = $("vRuler");
		if (r == null) {
			return
		}
		var g = Element.getStyle(r, "display");
		if (g != "none") {
			var q = designer.currentSurface.getDSPhysicalSize();
			var b, m;
			var o = designer.currentSurface.element;
			var a = (designer.currentSurface.bleedLineXMargin * 2 * designer.currentSurface.zoomFactor) + 2;
			b = o.offsetWidth - a - 30;
			b = parseInt(b / 2);
			m = o.offsetHeight - a - 20;
			m = parseInt(m / 2);
			if (b > 0) {
				$("hRuler1").style.width = b + "px";
				$("hRuler2").style.width = b + "px"
			}
			if (m > 0) {
				$("vRuler1").style.height = m + "px";
				$("vRuler2").style.height = m + "px"
			}
			$("hRulerLabel").innerHTML = parseFloat(q.w).toFixed(3) + ' "';
			$("vRulerLabel").innerHTML = parseFloat(q.h).toFixed(3) + ' "';
			r = $("vRuler");
			r.style.top = o.offsetTop + a / 2 + "px";
			r.style.left = (o.offsetLeft + o.offsetWidth + 15) + "px";
			r = $("rulerCut");
			r.style.top = o.offsetTop + a / 2 - 8 + "px";
			r.style.left = (o.offsetLeft + o.offsetWidth + 30) + "px";
			r = $("hRuler");
			r.style.top = (o.offsetTop + o.offsetHeight + 15) + "px";
			r.style.left = (o.offsetLeft + a / 2) + "px";
			$$('input[type="radio"][value="off"][name="rulers"]').first().checked = false;
			$$('input[type="radio"][value="on"][name="rulers"]').first().checked = true
		}
	},
	isRulerVisible: function() {
		var b = $("vRuler");
		var a;
		if (b) {
			a = Element.getStyle(b, "display")
		}
		return a != "none"
	},
	isSnapToGrid: function() {
		if (this.gridSnapComp) {
			return this.gridSnapComp.checkbox.checked
		}
		return false
	},
	setSnapToGrid: function(a) {
		if (this.gridSnapComp) {
			this.gridSnapComp.checkbox.checked = a
		}
	},
	previewOptionChanged: function(a) {
		if (designerContainer4) {
			designerContainer4.setPreviewOption(a)
		}
	},
	launchAcrobat: function() {
		var b = designer.artwork.pdfURL;
		var a = previewImageURL + b;
		window.open(a, "PC", "toolbar=yes,status=yes,scrollbars=yes,location=yes,menubar=yes,directories=yes")
	},
	customizeToolbarClicked: function() {
		shoh("ToolsSection");
		var b = $("customizationTBTitle");
		var a = $("ToolsSection");
		if (b && a) {
			b.innerHTML = a.visible() ? "Customization Tools": "Show Customization Tools"
		}
		return false
	},
	isCustomizeTBVisible: function() {
		var a = $("ToolsSection");
		if (a) {
			return a.visible()
		}
		return false
	},
	setCustomizeTBVisible: function(a) {
		var g = $("customizationTBTitle");
		var b = $("ToolsSection");
		if (g && b) {
			var m = a == b.visible();
			if (!m) {
				shoh("ToolsSection")
			}
			g.innerHTML = b.visible() ? "Customization Tools": "Show Customization Tools"
		}
	}
});
var HandlerButtons = {
	jsonsElementsActionsClassesForGroup: [{
		element: $("autoDistribute"),
		action: "autoDistribute",
		className: "t_boxArrange_distribute_vertical"
	}],
	jsonsElementsActionsClassesForMainImage: [{
		element: $("autoSize"),
		action: "autoSize",
		className: "t_autoSizeCDE"
	}],
	jsonsElementsActionsClassesForImage: [{
		element: $("cropOverlay"),
		action: "cropImage",
		className: "t_cropCDE"
	}],
	jsonsElementsActionsClassesForTextImageRectangle: [{
		element: $("basic_deleteObject"),
		action: "deleteObject",
		className: "t_deleteObjectCDE"
	},
	{
		element: $("basic_copyObject"),
		action: "duplicate",
		className: "t_duplicateCDE"
	}],
	_setObserveOnClick: function(a) {
		a.element.stopObserving("click");
		a.element.observe("click",
		function(b) {
			actionHandler.doAction(a.action)
		})
	},
	_removeObserveOnClick: function(a) {
		a.element.stopObserving("click")
	},
	setButtonsActiveForMainImage: function() {
		this.setButtonsActive(this.jsonsElementsActionsClassesForMainImage)
	},
	setButtonsActiveForImage: function() {
		this.setButtonsActive(this.jsonsElementsActionsClassesForImage)
	},
	setButtonsActiveForTextImage: function() {
		this.setButtonsActive(this.jsonsElementsActionsClassesForTextImageRectangle)
	},
	setButtonsActiveForGroup: function() {
		this.setButtonsActive(this.jsonsElementsActionsClassesForGroup)
	},
	setButtonsDeActiveForMainImage: function(a) {
		if (a) {
			a.setValueDisable()
		}
		this.setButtonsDeActive(this.jsonsElementsActionsClassesForMainImage)
	},
	setButtonsDeActiveForImage: function() {
		this.setButtonsDeActive(this.jsonsElementsActionsClassesForImage)
	},
	setButtonsDeActiveForTextImage: function(a) {
		if (a) {
			a.setValueDisable()
		}
		this.setButtonsDeActive(this.jsonsElementsActionsClassesForTextImageRectangle)
	},
	setButtonsDeActiveForGroup: function() {
		this.setButtonsDeActive(this.jsonsElementsActionsClassesForGroup)
	},
	setButtonsActive: function(b) {
		for (var a = 0; a < b.length; a++) {
			this._setObserveOnClick(b[a]);
			ToolbarUtils.on(b[a].element, b[a].className)
		}
	},
	setButtonsDeActive: function(b) {
		for (var a = 0; a < b.length; a++) {
			this._removeObserveOnClick(b[a]);
			ToolbarUtils.off(b[a].element, b[a].className)
		}
	}
};
PsP.CheckBoxComp = Class.create({
	initialize: function(g, b) {
		this.disable = true;
		this.e = g;
		for (var a = 0; a < g.childNodes.length; a++) {
			if (g.childNodes[a].className) {
				if (g.childNodes[a].className.indexOf("chkImage") != -1) {
					this.imageE = g.childNodes[a];
					break
				}
			}
		}
		this.handler = b;
		Event.observe(g, "click", this.clicked.bind(this))
	},
	clicked: function() {
		if (this.disable) {
			return
		}
		var a = this.imageE;
		if (a == null) {
			return
		}
		a.className = a.className == "chkImage" ? "unchkImage": "chkImage";
		this.handler(this, a.className == "chkImage");
		return false
	},
	setValue: function(a) {
		this.disable = false;
		var b = this.imageE;
		if (b == null) {
			return
		}
		b.className = a ? "chkImage": "unchkImage"
	},
	setValueDisable: function() {
		var a = this.imageE;
		if (a == null) {
			return
		}
		a.className = "unchkImage_disable";
		this.disable = true
	},
	getValue: function() {
		var a = this.imageE;
		if (a == null) {
			return
		}
		return a.className == "chkImage"
	}
});
var actionHandler = null;
imgout = new Image(9, 9);
imgin = new Image(9, 9);
imgout1 = new Image(9, 9);
imgin1 = new Image(9, 9);
imgout2 = new Image(9, 9);
imgin2 = new Image(9, 9);
imgout.src = "/psp/images/collapse_small.png";
imgin.src = "/psp/images/expand_small.png";
imgout1.src = "/psp/images2/circle-plus.png";
imgin1.src = "/psp/images2/circle-minus.png";
function filter(imagename, objectsrc) {
	if (imagename == "imgBillingDiv" || imagename == "imgDeliveryDiv" || imagename == "imgNotesDiv" || imagename == "imgImageLibraryDiv" || imagename == "imgGuideDiv" || imagename == "imgQuoteToolDiv" || imagename == "imgToolsSection") {
		if (objectsrc == "imgin") {
			if (imagename == "imgQuoteToolDiv") {
				document.getElementById("instantTitile").innerHTML = "Hide Instant Price"
			}
			createCookie("expandQT", "true");
			objectsrc = "imgin1"
		}
		if (objectsrc == "imgout") {
			if (imagename == "imgQuoteToolDiv") {
				document.getElementById("instantTitile").innerHTML = "Show Instant Price"
			}
			eraseCookie("expandQT");
			objectsrc = "imgout1"
		}
		if (imagename == "imgToolsSection") {
			designer.refreshAll()
		}
	} else {
		if (imagename == "imgtabsDiv" || imagename == "imgtabDiv1") {
			if (objectsrc == "imgin") {
				objectsrc = "imgin2"
			}
			if (objectsrc == "imgout") {
				objectsrc = "imgout2"
			}
		}
	}
	if (document.images) {
		if (document.images[imagename]) {
			document.images[imagename].src = eval(objectsrc + ".src")
		}
	}
}
function shoh(a) {
	if (document.getElementById) {
		if (document.getElementById(a).style.display == "none") {
			document.getElementById(a).style.display = "block";
			filter(("img" + a), "imgin");
			if (a == "tabsDiv") {
				document.getElementById("imgtabsDiv").title = "Collapse tab"
			}
		} else {
			filter(("img" + a), "imgout");
			document.getElementById(a).style.display = "none";
			if (a == "tabsDiv") {
				document.getElementById("imgtabsDiv").title = "Expand tab"
			}
		}
	} else {
		if (document.layers) {
			if (document.id.display == "none") {
				document.id.display = "block";
				filter(("img" + a), "imgin")
			} else {
				filter(("img" + a), "imgout");
				document.id.display = "none"
			}
		} else {
			if (document.all.id.style.visibility == "none") {
				document.all.id.style.display = "block"
			} else {
				filter(("img" + a), "imgout");
				document.all.id.style.display = "none"
			}
		}
	}
	if (a == "tabsDiv1") {
		shoh("tabsDiv")
	}
}
function ddtabcontent(a) {
	this.tabinterfaceid = a;
	this.tabs = document.getElementById(a).getElementsByTagName("a");
	this.enabletabpersistence = true;
	this.hottabspositions = [];
	this.currentTabIndex = 0;
	this.subcontentids = [];
	this.revcontentids = [];
	this.selectedClassTarget = "link"
}
ddtabcontent.getCookie = function(a) {
	var b = new RegExp(a + "=[^;]+", "i");
	if (document.cookie.match(b)) {
		return document.cookie.match(b)[0].split("=")[1]
	}
	return ""
};
ddtabcontent.setCookie = function(a, b) {
	document.cookie = a + "=" + b + ";path=/"
};
ddtabcontent.prototype = {
	expandit: function(a) {
		this.cancelautorun();
		var b = "";
		try {
			if (typeof a == "string" && document.getElementById(a).getAttribute("rel")) {
				b = document.getElementById(a)
			} else {
				if (parseInt(a) != NaN && this.tabs[a].getAttribute("rel")) {
					b = this.tabs[a]
				}
			}
		} catch(g) {
			alert("Invalid Tab ID or position entered!")
		}
		if (b != "") {
			this.expandtab(b)
		}
	},
	cycleit: function(b, a) {
		if (b == "next") {
			var g = (this.currentTabIndex < this.hottabspositions.length - 1) ? this.currentTabIndex + 1 : 0
		} else {
			if (b == "prev") {
				var g = (this.currentTabIndex > 0) ? this.currentTabIndex - 1 : this.hottabspositions.length - 1
			}
		}
		if (typeof a == "undefined") {
			this.cancelautorun()
		}
		this.expandtab(this.tabs[this.hottabspositions[g]])
	},
	setpersist: function(a) {
		this.enabletabpersistence = a
	},
	setselectedClassTarget: function(a) {
		this.selectedClassTarget = a || "link"
	},
	getselectedClassTarget: function(a) {
		return (this.selectedClassTarget == ("linkparent".toLowerCase())) ? a.parentNode: a
	},
	urlparamselect: function(b) {
		var a = window.location.search.match(new RegExp(b + "=(\\d+)", "i"));
		return (a == null) ? null: parseInt(RegExp.$1)
	},
	expandtab: function(b) {
		var g = b.getAttribute("rel");
		var m = (b.getAttribute("rev")) ? "," + b.getAttribute("rev").replace(/\s+/, "") + ",": "";
		this.expandsubcontent(g);
		this.expandrevcontent(m);
		for (var a = 0; a < this.tabs.length; a++) {
			this.getselectedClassTarget(this.tabs[a]).className = (this.tabs[a].getAttribute("rel") == g) ? "selected": ""
		}
		if (this.enabletabpersistence) {
			ddtabcontent.setCookie(this.tabinterfaceid, b.tabposition)
		}
		this.setcurrenttabindex(b.tabposition)
	},
	expandsubcontent: function(g) {
		for (var b = 0; b < this.subcontentids.length; b++) {
			var a = document.getElementById(this.subcontentids[b]);
			a.style.display = (a.id == g) ? "block": "none"
		}
	},
	expandrevcontent: function(g) {
		var a = this.revcontentids;
		for (var b = 0; b < a.length; b++) {
			document.getElementById(a[b]).style.display = (g.indexOf("," + a[b] + ",") != -1) ? "block": "none"
		}
	},
	setcurrenttabindex: function(a) {
		for (var b = 0; b < this.hottabspositions.length; b++) {
			if (a == this.hottabspositions[b]) {
				this.currentTabIndex = b;
				break
			}
		}
	},
	autorun: function() {
		this.cycleit("next", true)
	},
	cancelautorun: function() {
		if (typeof this.autoruntimer != "undefined") {
			clearInterval(this.autoruntimer)
		}
	},
	init: function(a) {
		var o = ddtabcontent.getCookie(this.tabinterfaceid);
		var m = -1;
		var q = this.urlparamselect(this.tabinterfaceid);
		this.automodeperiod = a || 0;
		for (var g = 0; g < this.tabs.length; g++) {
			this.tabs[g].tabposition = g;
			if (this.tabs[g].getAttribute("rel")) {
				var b = this;
				this.hottabspositions[this.hottabspositions.length] = g;
				this.subcontentids[this.subcontentids.length] = this.tabs[g].getAttribute("rel");
				this.tabs[g].onclick = function() {
					if (! (document.getElementById("tabsDiv") == null)) {
						document.getElementById("tabsDiv").style.display = "block";
						var r = document.getElementById("imgtabsDiv");
						if (r) {
							r.setAttribute("src", "/psp/images/icon_minimize_bluebg.gif");
							r.title = "Collapse tab"
						}
					}
					if (! (document.getElementById("tabsDiv1") == null)) {
						document.getElementById("tabsDiv1").style.display = "block"
					}
					b.expandtab(this);
					b.cancelautorun();
					if (window.event) {
						window.event.cancelBubble = true;
						window.event.retrunValue = false
					}
					return false
				};
				if (this.tabs[g].getAttribute("rev")) {
					this.revcontentids = this.revcontentids.concat(this.tabs[g].getAttribute("rev").split(/\s*,\s*/))
				}
				if (q == g || this.enabletabpersistence && m == -1 && parseInt(o) == g || !this.enabletabpersistence && m == -1 && this.getselectedClassTarget(this.tabs[g]).className == "selected") {
					m = g
				}
			}
		}
		if (m != -1) {
			this.expandtab(this.tabs[m])
		} else {
			this.expandtab(this.tabs[this.hottabspositions[0]])
		}
		if (parseInt(this.automodeperiod) > 500 && this.hottabspositions.length > 1) {
			this.autoruntimer = setInterval(function() {
				b.autorun()
			},
			this.automodeperiod)
		}
	}
};
AuthUtil = (function(a, b) {
	var g = "pspspassport",
	m = "";
	return {
		PSPRINT_STORE_ID: "1",
		AUTH_LOGIN_TYPE: 6,
		isLoggedIn: function() {
			return isLoggedInFlag
		},
		getPspassport: function() {
			var o = a(g);
			if (!o) {
				o = b
			}
			if (o == null) {
				o = m
			}
			return o
		}
	}
})(Get_Cookie, pspspassport);
function LoadLogin(g, m, r) {
	if (typeof m === "undefined" || m === null) {
		m = true
	}
	if (designer != null) {
		var q = String(designer.artwork.currentStation);
		var a = String(designer.artwork.PsPFunction);
		showModalMessageDialog("You must log in to save design", "Loading", 300, 100, 600000);
		eraseCookie("pspspassport");
		eraseCookie("designName");
		eraseCookie("logoutuser");
		designer.addTag("pspspassport", defaultPassport);
		designer.addTag("customerName", "Guest");
		designer.addTag("email", "Guest");
		var b = psp;
		var x = signupURL + "?mode=login&psp=" + b;
		if (g == 1) {
			x = x + "&msg=msg1"
		} else {
			if (g == 2) {
				x = x + "&msg=msg2"
			} else {
				if (g == 3) {
					x = x + "&msg=msg1&nextStation=finishing"
				} else {
					if (g == 4) {
						x = x + "&msg=ratemsg&load=rateit"
					} else {
						if (g == 5) {
							x = x + "&load=imagelibrary"
						} else {
							if (g == 6) {
								x = x
							}
						}
					}
				}
			}
		}
		if (m) {
			designer.saveDoc(function o() {
				GB_showCenter("Login", x, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH, r)
			})
		} else {
			GB_showCenter("Login", x, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH, r)
		}
	} else {
		var b = psp;
		var x = signupURL;
		var u = readpspURL + "?psp_name=" + b + ".psp";
		if (queryString("scid")) {
			u = u + "&scid=" + queryString("scid")
		}
		if (g == 5) {
			x = signupURL + "?mode=login&psp=" + b + "&read=true&readpspURL=" + encodeURIComponent(u)
		} else {
			x = signupURL + "?mode=login&psp=" + b + "&gotohome=true"
		}
		GB_showCenter("Login", x, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH)
	}
}
function InitializeService(m) {
	if (document.domain == "localhost") {
		return
	}
	var g = validateLoginURL + "?passport=" + m + "&Callback=getAuthentication";
	var b = document.getElementsByTagName("head").item(0);
	var a = document.createElement("script");
	a.setAttribute("type", "text/javascript");
	a.setAttribute("src", g);
	b.appendChild(a)
}
function getAuthentication(x) {
	if (x != null) {
		var u = x.ValidateLogin.pspspassport;
		if (u == "invalid") {
			eraseCookie("pspspassport");
			var q = location.search.substring(1, location.search.length);
			var r = location.href;
			var o = "";
			var m = false;
			var g = "";
			var a = false;
			var b = q.split("&");
			for (i = 0; i < b.length; i++) {
				param_name = b[i].substring(0, b[i].indexOf("="));
				if (param_name == "pspspassport") {
					m = b[i].substring(b[i].indexOf("=") + 1);
					o = "?" + param_name + "=" + m
				}
				if (param_name == "storeMode") {
					a = b[i].substring(b[i].indexOf("=") + 1);
					g = "&" + param_name + "=" + a
				}
				r = r.replace(o, "");
				if (a) {
					r = r.replace(g, "")
				}
			}
			createCookie("LoadLogin", true);
			location.replace(r)
		} else {
			createCookie("pspspassport", u);
			if ($("QTFrame")) {
				showModalMessageDialog("Loading Quote tool... please wait", "Loading", 300, 100, 600000);
				loadQuoteTool(quoteURL, loggedInEmail)
			}
		}
	}
}
function createCookie(g, m, o) {
	if (o) {
		var b = new Date();
		b.setTime(b.getTime() + (o * 24 * 60 * 60 * 1000));
		var a = "; expires=" + b.toGMTString()
	} else {
		var a = ""
	}
	document.cookie = g + "=" + m + a + "; path=/"
}
function Get_Cookie(a) {
	var q = document.cookie.split(";");
	var b = "";
	var m = "";
	var o = "";
	var g = false;
	for (i = 0; i < q.length; i++) {
		b = q[i].split("=");
		m = b[0].replace(/^\s+|\s+$/g, "");
		if (m == a) {
			g = true;
			if (b.length > 1) {
				o = unescape(b[1].replace(/^\s+|\s+$/g, ""))
			}
			return o;
			break
		}
		b = null;
		m = ""
	}
	if (!g) {
		return null
	}
}
function eraseCookie(a) {
	createCookie(a, "", -1)
}
PsP.MainUtil = Class.create({
	loadDLPData: function() {
		var a = productGroupName.toLowerCase();
		a = a.replace(" ", "-");
		this.loadProductDetails(psp, a);
		this.loadOrderingDetails(psp, a)
	},
	loadProductDetails: function(m, g) {
		email = Get_Cookie("LOGGED_IN_EMAIL") || "Guest";
		var a = productTabURL + g + "&psp=" + m + ".psp&LOGGED_IN_EMAIL=" + email;
		var b = new Af.DataRequest(a, this.loadProductDetailsCompleted.bind(this), requestFailedCommon, null, requestTimedoutCommon);
		ajaxEngine.processRequest(b)
	},
	loadProductDetailsCompleted: function(a) {
		var b = a.responseText;
		if (b == null) {
			b = ""
		} else {
			b = this.updateHTML(b)
		}
		elem = $("productDetailsContent");
		elem.innerHTML = b
	},
	loadOrderingDetails: function(m, g) {
		email = Get_Cookie("LOGGED_IN_EMAIL") || "Guest";
		var a = orderTabURL + g + "&psp=" + m + ".psp&LOGGED_IN_EMAIL=" + email;
		var b = new Af.DataRequest(a, this.loadOrderingDetailsCompleted.bind(this), requestFailedCommon, null, requestTimedoutCommon);
		ajaxEngine.processRequest(b)
	},
	loadOrderingDetailsCompleted: function(a) {
		var b = a.responseText;
		if (b == null) {
			b = ""
		} else {
			b = this.updateHTML(b)
		}
		elem = $("orderingContent");
		elem.innerHTML = b
	},
	updateHTML: function(a) {
		if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
			if (baseURL == "http://qa.psprint.com/") {
				a = a.replace(/href=\"http:\/\/qadesigntool.psprint.com/g, 'href="http://qa.psprint.com');
				a = a.replace(/href=\"http:\/\/designtool.psprint.com/g, 'href="http://qa.psprint.com');
				a = a.replace(/href=\"http:\/\/designtool2.psprint.com/g, 'href="http://qa.psprint.com');
				a = a.replace(/href=\"http:\/\/colo-designer1.psprint.com/g, 'href="http://qa.psprint.com');
				a = a.replace(/href=\"http:\/\/colo-designer3.psprint.com/g, 'href="http://qa.psprint.com')
			} else {
				a = a.replace(/href=\"http:\/\/designtool.psprint.com/g, 'href="http://www.psprint.com');
				a = a.replace(/href=\"http:\/\/designtool2.psprint.com/g, 'href="http://www.psprint.com');
				a = a.replace(/href=\"http:\/\/colo-designer1.psprint.com/g, 'href="http://www.psprint.com');
				a = a.replace(/href=\"http:\/\/colo-designer3.psprint.com/g, 'href="http://www.psprint.com');
				a = a.replace(/http:\/\/qa.psprint.com/g, "http://www.psprint.com")
			}
		} else {
			a = a.replace(/&lt;(([^&]|\&[^g]|&g[^t]|&gt[^;])+)&gt;/g, "<$1>");
			a = a.replace(/&amp;nbsp;/g, "<br/>");
			if (baseURL == "http://qa.psprint.com/") {
				a = a.replace(/href=\"/g, 'href="http://qa.psprint.com')
			} else {
				a = a.replace(/http:\/\/qa.psprint.com/g, "http://www.psprint.com")
			}
		}
		return a
	}
});
function doQuoteToolInit(b) {
	if (String(b.currentStation) == "finalReview") {
		disableQToptions()
	}
	var a = $("QTFrame");
	if (a != null) {
		if (a.contentWindow.$("QTDiv")) {
			a.style.height = a.contentWindow.$("QTDiv").offsetHeight + "px"
		}
	}
	if (String(b.paymentStatus) == "Approved") {
		if (String(b.currentStation) == "finalReview") {
			$("nextAction").setAttribute("class", "postCropSprite");
			$("nextAction").title = "Approve Your Design"
		}
		if ($("QuoteToolDiv")) {
			$("QuoteToolDiv").style.display = "none";
			$("QuoteToolTitleDiv").style.display = "none";
			$("OrderButtonDiv").style.display = "none"
		}
	}
	if ($("QuoteToolDiv")) {
		$("QuoteToolDiv").style.display = "none";
		if (Get_Cookie("expandQT") != null) {
			$("imgQuoteToolDiv").setAttribute("src", "/psp/images2/circle-minus.png");
			$("instantTitile").innerHTML = "Hide Instant Price";
			$("QuoteToolDiv").style.display = "block"
		}
	}
}
function setDesignDetails(x) {
	var E = x.productGroupName;
	var M = x.finishedDimensionsInches;
	var B = x.jobId;
	var K;
	K = $("designDetail");
	if (K) {
		K.innerHTML = "&nbsp;(" + M + " " + E + ")"
	}
	K = $("cropProductName");
	if (K) {
		K.innerHTML = E
	}
	K = $("cropDesignID");
	if (K) {
		K.innerHTML = B
	}
	var R = String(x.pageTitle);
	if (R != "undefined" && R != "") {
		document.title = R
	}
	var L = x.designName;
	if (L == null) {
		L = ""
	}
	K = $("designName");
	if (K) {
		K.innerHTML = L
	}
	var P = x.creatorName;
	if (String(x.creatorName) != "undefined") {
		K = $("designerName");
		if (K) {
			K.innerHTML = P
		}
		K = $("designerNameTEXT");
		if (K) {
			K.value = P
		}
	}
	K = $("designNameHref");
	if (K) {
		K.href = designerProfileURL + customerID
	}
	K = $("Product");
	if (K) {
		K.innerHTML = E
	}
	K = $("designId");
	var g = x.design_id;
	if (String(x.design_id) == "undefined") {
		g = ""
	}
	if (K) {
		K.value = g
	}
	K = $("designShortName");
	var F = x.design_shortname;
	if (String(x.design_shortname) == "undefined") {
		F = ""
	}
	if (K) {
		K.value = F
	}
	K = $("designLongName");
	var J = x.design_longname;
	if (String(x.design_longname) == "undefined") {
		J = ""
	}
	if (K) {
		K.value = J
	}
	K = $("designURLFullName");
	var o = x.design_url_fullname;
	if (String(x.design_url_fullname) == "undefined") {
		o = ""
	}
	if (K) {
		K.value = o
	}
	K = $("designURLShortName");
	var q = x.design_url_tinyname;
	if (String(x.design_url_tinyname) == "undefined") {
		q = ""
	}
	if (K) {
		K.value = q
	}
	K = $("productDisplay");
	var O = x.productDisplay;
	if (String(O) == "undefined") {
		O = "600"
	}
	if (K) {
		if (K.tagName.toLowerCase() != "select") {
			K.value = O
		} else {
			setSelectValue(K, O)
		}
	}
	K = $("designColorFamily");
	var y = x.designColors;
	if (K) {
		if (K.tagName.toLowerCase() != "select") {
			K.value = y
		} else {
			setSelectValue(K, y)
		}
	}
	K = $("designColorsName");
	var a = x.designColor_Name;
	if (String(a) == "undefined") {
		a = ""
	}
	if (K) {
		if (K.tagName.toLowerCase() != "select") {
			K.value = a
		} else {
			setSelectValue(K, a)
		}
	}
	K = $("designColorsWebValue");
	if (K) {
		var D = x.designColor_webvalue;
		var u = fncIsValidColor(D);
		K.value = D;
		K = $("designColorsWebValueSwatch");
		K.style.backgroundColor = u ? D: "#ffffff"
	}
	D = "";
	K = $("semKeywords");
	var C = x.sem_keyword;
	if (String(x.sem_keyword) == "undefined") {
		C = ""
	}
	if (K) {
		K.value = C
	}
	K = $("basePrice");
	if (K) {
		K.value = x.jobTotal
	}
	K = $("AccountEmail");
	if (K) {
		K.innerHTML = x.creatorEmail
	}
	var m = x.creationDate;
	if (String(x.creationDate) != "undefined") {
		var K = $("createDate");
		if (K) {
			K.innerHTML = m
		}
	}
	K = $("Dimensions");
	if (K) {
		K.innerHTML = x.finishedDimensionsInches
	}
	K = $("Sides");
	if (K) {
		K.innerHTML = x.sides
	}
	K = $("Colors");
	if (K) {
		K.innerHTML = x.designColors
	}
	var H = x.orderCount;
	if (String(x.orderCount) == "undefined" || String(x.orderCount) == "") {
		H = 0
	}
	var r = x.viewsCount;
	if (String(x.viewsCount) == "undefined" || String(x.viewsCount) == "") {
		r = 0
	}
	K = $("TimesOrdered");
	if (K) {
		K.innerHTML = H
	}
	K = $("TimesViewed");
	if (K) {
		K.innerHTML = r
	}
	K = $("productDetailsContent");
	if (K && x.productData) {
		K.innerHTML = x.productData
	}
	K = $("orderingContent");
	if (K && x.orderData) {
		K.innerHTML = x.orderData
	}
	var b = x.metadataKeywords;
	K = $("TagsKeyword");
	if (b && K) {
		var N = new Array();
		N = b.split(",");
		var Q = "";
		for (var I = 0; I < N.length; I++) {
			var G = trim(N[I]);
			if (G.length == 0) {
				continue
			}
			var A = galleryPageURL + "?mode=search&q=" + G + "&t=gallery";
			var z = Get_Cookie("pspspassport");
			if (z != null) {
				A = A + "&pspspassport=" + z
			}
			if (Get_Cookie("logoutuser") != null) {
				A = A + "&logoutuser=1"
			}
			Q += '<a id="metadataKeywordsHref' + I + '" href="' + A + '"><span id="metadataKeywords' + I + '">' + G + "</span></a>, "
		}
		K.innerHTML = Q
	}
	setRatings(x)
}
function setStoreModeDesignDetails(b) {
	var o;
	var u = b.designName;
	if (u == null) {
		u = ""
	}
	var a = b.jobId;
	if (a == null) {
		a = ""
	}
	o = $("designNumber");
	if (o) {
		o.innerHTML = a
	}
	var r = b.psp_dir;
	if (r == null) {
		r = ""
	}
	o = $("psp_dir");
	if (o) {
		o.innerHTML = r
	}
	o = $("tagfullUrl");
	if (o) {
		o.innerHTML = location.href.toString()
	}
	o = $("Title");
	if (o) {
		o.value = u
	}
	o = $("PageTitleTag");
	if (o) {
		o.value = b.pageTitle
	}
	if (String(b.MarkupPricing) == "undefined") {
		o = $("MarkupPricing");
		if (o) {
			o.value = ""
		}
	} else {
		o = $("MarkupPricing");
		if (o) {
			o.value = b.MarkupPricing
		}
	}
	if (String(b.MaxDiscount) == "undefined") {
		o = $("MaxDiscount");
		if (o) {
			o.value = ""
		}
	} else {
		o = $("MaxDiscount");
		if (o) {
			o.value = b.MaxDiscount
		}
	}
	if (String(b.ReturnPricing) == "undefined") {
		o = $("returnPricing");
		if (o) {
			o.value = ""
		}
	} else {
		o = $("returnPricing");
		if (o) {
			o.value = b.ReturnPricing
		}
	}
	if (String(b.GoogleUserDiscount) == "undefined") {
		o = $("googleUserDiscount");
		if (o) {
			o.value = ""
		}
	} else {
		o = $("googleUserDiscount");
		if (o) {
			o.value = b.GoogleUserDiscount
		}
	}
	if (String(b.Designcharge) == "undefined") {
		o = $("Designcharge");
		if (o) {
			o.value = ""
		}
	} else {
		o = $("Designcharge");
		if (o) {
			o.value = b.Designcharge
		}
	}
	if (String(b.creatorEmail) != "undefined") {
		o = $("designerEmail");
		if (o) {
			o.value = b.creatorEmail
		}
	}
	if (String(b.PricingVisible) != "undefined" && b.PricingVisible == "true") {
		if ($("PricingVisible")) {
			$("PricingVisible").checked = true
		}
	} else {
		if ($("PricingNotVisible")) {
			$("PricingNotVisible").checked = true
		}
	}
	if (String(b.Level) != "undefined") {
		if (b.Level == "Private") {
			if ($("PrivateDesign")) {
				$("PrivateDesign").checked = true
			}
		} else {
			if (b.Level == "Public") {
				if ($("PublicDesign")) {
					$("PublicDesign").checked = true
				}
			}
		}
	}
	if (String(b.Portfolio) != "undefined") {
		if (b.Portfolio == "Yes") {
			if ($("PortfolioDesign")) {
				$("PortfolioDesign").checked = true
			}
		}
	}
	if (String(b.RequestPublic) != "undefined") {
		if (b.RequestPublic == "Yes") {
			if ($("RequestPublic")) {
				$("RequestPublic").checked = true
			}
		}
	}
	if (String(b.Audience) != "undefined") {
		if (b.Audience == "G") {
			if ($("AudienceG")) {
				$("AudienceG").checked = true
			}
		}
		if (b.Audience == "PG") {
			if ($("AudiencePG")) {
				$("AudiencePG").checked = true
			}
		}
		if (b.Audience == "R") {
			if ($("AudienceR")) {
				$("AudienceR").checked = true
			}
		}
	}
	if (String(b.GeographicPricing) != "undefined") {
		if (b.GeographicPricing == "W") {
			if ($("WestCoast")) {
				$("WestCoast").checked = true
			}
		}
		if (b.GeographicPricing == "M") {
			if ($("MidWest")) {
				$("MidWest").checked = true
			}
		}
		if (b.GeographicPricing == "E") {
			if ($("EastCoast")) {
				$("EastCoast").checked = true
			}
		}
	}
	if (String(b.MarkUp) != "undefined") {
		if (b.MarkUp == "true") {
			if ($("MarkUp")) {
				$("MarkUp").checked = true
			}
		} else {
			if ($("MarkDown")) {
				$("MarkDown").checked = true
			}
		}
	}
	if (String(b["Eco-Friendly"]) != "undefined" && b["Eco-Friendly"] == "Yes") {
		if ($("Eco-FriendlyYes")) {
			$("Eco-FriendlyYes").checked = true
		}
	} else {
		if ($("Eco-FriendlyNo")) {
			$("Eco-FriendlyNo").checked = true
		}
	}
	if (String(b.DesignAward) != "undefined" && b.DesignAward == "Yes") {
		if ($("DesignAwardYes")) {
			$("DesignAwardYes").checked = true
		}
	} else {
		if ($("DesignAwardNo")) {
			$("DesignAwardNo").checked = true
		}
	}
	if (String(b.PsPrintCertified) != "undefined" && b.PsPrintCertified == "Yes") {
		if ($("PsPrintCertifiedYes")) {
			$("PsPrintCertifiedYes").checked = true
		}
	} else {
		if ($("PsPrintCertifiedNo")) {
			$("PsPrintCertifiedNo").checked = true
		}
	}
	if (String(b.PsPrintColorCertified) != "undefined" && b.PsPrintColorCertified == "Yes") {
		if ($("PsPrintColorCertifiedYes")) {
			$("PsPrintColorCertifiedYes").checked = true
		}
	} else {
		if ($("PsPrintColorCertifiedNo")) {
			$("PsPrintColorCertifiedNo").checked = true
		}
	}
	if (String(b.LowpriceGuarantee) != "undefined" && b.LowpriceGuarantee == "Yes") {
		if ($("LowpriceGuaranteeYes")) {
			$("LowpriceGuaranteeYes").checked = true
		}
	} else {
		if ($("LowpriceGuaranteeNo")) {
			$("LowpriceGuaranteeNo").checked = true
		}
	}
	if (String(b.Customizable_Background) != "undefined" && b.Customizable_Background == "Yes") {
		if ($("Customizable_BackgroundYes")) {
			$("Customizable_BackgroundYes").checked = true
		}
	} else {
		if ($("Customizable_BackgroundNo")) {
			$("Customizable_BackgroundNo").checked = true
		}
	}
	if (String(b.Customizable_Text) != "undefined" && b.Customizable_Text == "Yes") {
		if ($("Customizable_TextYes")) {
			$("Customizable_TextYes").checked = true
		}
	} else {
		if ($("Customizable_TextNo")) {
			$("Customizable_TextNo").checked = true
		}
	}
	if (String(b.Customizable_Images) != "undefined" && b.Customizable_Images == "Yes") {
		if ($("Customizable_ImagesYes")) {
			$("Customizable_ImagesYes").checked = true
		}
	} else {
		if ($("Customizable_ImagesNo")) {
			$("Customizable_ImagesNo").checked = true
		}
	}
	if (String(b.CanbePublished) != "undefined" && b.CanbePublished == "Yes") {
		if ($("CanbePublishedYes")) {
			$("CanbePublishedYes").checked = true
		}
	} else {
		if ($("CanbePublishedNo")) {
			$("CanbePublishedNo").checked = true
		}
	}
	var q = b.metadataDescription;
	if (q == null) {
		q = "No description available"
	}
	o = $("tagmetadataDescription");
	if (o) {
		o.value = q
	}
	var m = b.metadataKeywords;
	if (m == null) {
		m = "No description available"
	}
	o = $("tagmetadataKeywords");
	if (o) {
		o.value = m
	}
	o = $("seoDescription");
	if (o) {
		o.value = b.seo_description ? b.seo_description: ""
	}
	o = $("designDescription");
	if (o) {
		o.value = b.designDescription ? b.designDescription: ""
	}
	o = $("semKeywords");
	if (o) {
		o.value = b.sem_keyword ? b.sem_keyword: ""
	}
	var g = String(b.designColors);
	if (g != null) {
		if (g.match("White")) {
			o = $("White");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Cream")) {
			o = $("Cream");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Red")) {
			o = $("Red");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Yellow")) {
			o = $("Yellow");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Blue")) {
			o = $("Blue");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Brown")) {
			o = $("Brown");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Black")) {
			o = $("Black");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Pink")) {
			o = $("Pink");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Orange")) {
			o = $("Orange");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Green")) {
			o = $("Green");
			if (o) {
				o.checked = "checked"
			}
		}
		if (g.match("Purple")) {
			o = $("Purple");
			if (o) {
				o.checked = "checked"
			}
		}
	}
	doCategoryLogic(b)
}
function doCategoryLogic(b) {
	for (var g = 1; g <= 4; g++) {
		var a = b["Category" + g];
		if (a == null) {
			a = ""
		}
		var m = $("Category" + g);
		if (m) {
			m.value = a
		}
	}
}
function setRatings(A) {
	var u;
	u = $("ratingTableC");
	if (u == null) {
		return
	}
	var a = null;
	var b = A.ratingData;
	if (b && b.length > 0) {
		b = b[0]["designRatings"];
		if (b && b.length > 0) {
			a = b[0]
		}
	}
	if (a == null) {
		$("avgRatingImg").src = "/psp/images/0stars.png";
		$("avgPeoplesVoted").innerHTML = "(0 Votes)";
		u.innerHTML = "<table><tr><td colspan='2' class='bodyText' style='padding: 20px 10px 12px 10px;'><span id='noRatings' style='display: none;'></span></td></tr></table>";
		$("noRatings").style.display = "";
		$("noRatings").innerHTML = "There are no user ratings. Be the first to rate this design!";
		return
	}
	var o = a.userRatingAverage;
	var y = a.userRatingCount;
	if (o != "undefined" && o != "0") {
		if (o == "NaN") {
			o = "0"
		}
		if (y != "undefined" && y != "0") {
			if (Math.round(o) == "5") {
				$("avgRatingImg").src = "/psp/images/5stars.png"
			} else {
				if (Math.round(o) == "4") {
					$("avgRatingImg").src = "/psp/images/4stars.png"
				} else {
					if (Math.round(o) == "3") {
						$("avgRatingImg").src = "/psp/images/3stars.png"
					} else {
						if (Math.round(o) == "2") {
							$("avgRatingImg").src = "/psp/images/2stars.png"
						} else {
							if (Math.round(o) == "1") {
								$("avgRatingImg").src = "/psp/images/1stars.png"
							} else {
								if (Math.round(o) == "0") {
									$("avgRatingImg").src = "/psp/images/0stars.png"
								}
							}
						}
					}
				}
			}
		}
	}
	if (y != "undefined" && y != "0") {
		$("avgPeoplesVoted").innerHTML = "(" + y + " Votes)"
	}
	var z = a.userRating;
	var B = "";
	if (z.length == 0) {
		u.innerHTML = "<table><tr><td colspan='2' class='bodyText' style='padding: 20px 10px 12px 10px;'><span id='noRatings' style='display: none;'></span></td></tr></table>"
	} else {
		B = "<table>";
		for (i = z.length - 1; i >= 0; i--) {
			B += "<tr><td class='dlp-tabcontent-seperator' width='100px' class='dlp-tabcontent-seperator' style='padding:15px 10px 5px 10px;'>";
			var r = z[i]["rating"];
			B += "<img style='vertical-align: bottom; margin-right: 5px' ";
			if (Math.round(r) == "5") {
				B += "src='/psp/images/5stars.png' alt='' />"
			} else {
				if (Math.round(r) == "4") {
					B += "src='/psp/images/4stars.png' alt='' />"
				} else {
					if (Math.round(r) == "3") {
						B += "src='/psp/images/3stars.png' alt='' />"
					} else {
						if (Math.round(r) == "2") {
							B += "src='/psp/images/2stars.png' alt='' />"
						} else {
							if (Math.round(r) == "1") {
								B += "src='/psp/images/1stars.png' alt='' />"
							} else {
								if (Math.round(r) == "0") {
									B += "src='/psp/images/0stars.png' alt='' />"
								}
							}
						}
					}
				}
			}
			if (z[i]["userDisplayName"] != null) {
				var g = z[i]["userDisplayName"];
				if (g == "Guest") {
					g = "Guest User"
				}
			}
			if (z[i]["creationDate"] != null) {
				var m = z[i]["creationDate"];
				m = m.substring(0, m.indexOf(" "))
			}
			if (g != "" || g != "undefined") {
				if (z[i]["comments"] == null) {
					var q = "";
					B += "</td><td rowspan='3' class='dlp-tabcontent-seperator' style='padding:15px 10px 5px 10px;'>No comment added</td></tr><tr><td style='padding-left: 10px;'><span> by " + g + "</span>"
				} else {
					var q = z[i]["comments"]
				}
				if (q != "" && q != "undefined") {
					if (q.length > 0) {
						B += "</td><td rowspan='3' class='dlp-tabcontent-seperator' style='padding:15px 10px 5px 10px;'><p style='margin-top:0' class='rating-comments'> <b>Comments:&nbsp;</b>" + q + "</p></td></tr><tr><td style='padding-left: 10px;'><span> by " + g + "</span>"
					} else {
						B += "</td><td rowspan='3' class='dlp-tabcontent-seperator' style='padding:15px 10px 5px 10px;'><p style='margin-top:0' class='rating-comments'> <b>Comments:&nbsp;</b>No comment added</p></td></tr><tr><td style='padding-left: 10px;'><span> by " + g + "</span>"
					}
				}
			}
			if (m != "" || m != "undefined") {
				B += "</td></tr><tr><td  style='padding-left: 10px;padding-bottom:10px'><span> <b>Date:</b>" + m + "</span>"
			}
			B += "</td></tr>"
		}
		B = "</table>";
		u.innerHTML = B
	}
}
var LoginPopupDimensions = {
	LOGIN_DIALOG_SIZES: [{
		storeId: "1",
		width: 820,
		height: 555
	},
	{
		storeId: "32",
		storeName: "core",
		width: 850,
		height: 600
	},
	{
		storeId: "32",
		storeName: "psprintfordeluxe",
		width: 320,
		height: 320
	},
	{
		storeId: "65",
		width: 820,
		height: 555
	},
	{
		storeId: "69",
		width: 870,
		height: 680
	},
	{
		storeId: "70",
		width: 820,
		height: 555
	}],
	UNDEFINED_DEFAULT_WIDTH: 820,
	UNDEFINED_DEFAULT_HEIGHT: 555,
	DEFAULT_WIDTH: 320,
	DEFAULT_HEIGHT: 320,
	getWidthFor: function(o) {
		if (typeof o == "undefined" || typeof o.storeId == "undefined") {
			return this.UNDEFINED_DEFAULT_WIDTH
		}
		var a = this.DEFAULT_WIDTH;
		var m = this._findByStoreId(o.storeId);
		if (m.length === 1) {
			var g = m[0];
			a = g.width
		} else {
			if (m.length > 1) {
				var b = this._findByStoreName(m, o.storeName);
				if (b) {
					a = b.width
				}
			}
		}
		return a
	},
	getHeightFor: function(o) {
		if (typeof o == "undefined" || typeof o.storeId == "undefined") {
			return this.UNDEFINED_DEFAULT_HEIGHT
		}
		var a = this.DEFAULT_HEIGHT;
		var m = this._findByStoreId(o.storeId);
		if (m.length === 1) {
			var g = m[0];
			a = g.height
		} else {
			if (m.length > 1) {
				var b = this._findByStoreName(m, o.storeName);
				if (b) {
					a = b.height
				}
			}
		}
		return a
	},
	_findByStoreId: function(b) {
		var o = [];
		for (var m = 0, a = this.LOGIN_DIALOG_SIZES.length; m < a; m++) {
			var g = this.LOGIN_DIALOG_SIZES[m];
			if (g.storeId === b) {
				sizeByStoreId = g;
				o.push(g)
			}
		}
		return o
	},
	_findByStoreName: function(q, b) {
		var o;
		for (var m = 0, a = q.length; m < a; m++) {
			var g = q[m];
			if (g.storeName === b) {
				o = g;
				break
			}
		}
		return o
	}
};
var UploadMessageLabel = "<b>Upload Your Design</b>";
var UploadMessageText = "From Computer";
var UploadMessageImageLibrary = "From Image Libraries";
var postMessage = true;
var showFiller = null;
var hideFiller = null;
var THUMBNAIL_HEIGHT = 85;
var uploadMode = null;
var quoteURL = null;
var imageLibraryURL = "#";
var storeInfo = {
	storeId: _storeId_,
	storeName: storeName
};
var LOGIN_DIALOG_WIDTH = LoginPopupDimensions.getWidthFor(storeInfo);
var LOGIN_DIALOG_HEIGHT = LoginPopupDimensions.getHeightFor(storeInfo);
var _gallery_admins = {
	"galleryadmin@psprint.com": 1,
	"testadmin@psprint.com": 1,
	"madhura@vertexlogic.com": 1
};
var pageURL = null;
try {
	if (document.domain != "localhost") {
		pageURL = escape(window.location)
	}
} catch(exc) {}
var chatURL = "http://server.iad.liveperson.net/hc/8436419/?cmd=file&SESSIONVAR!url=" + pageURL + "&file=visitorWantsToChat&site=8436419&byhref=1&imageUrl=http://server.iad.liveperson.net/hcp/Gallery/ChatButton-Gallery/English/General/1a/&referrer='+escape(document.location)";
var hostname = null;
var _is_dlp = false;
function start(g) {
	_is_dlp = g;
	if (typeof creatorEmail == "undefined") {
		creatorEmail = ""
	}
	if (document.domain != "localhost" && !AuthUtil.isLoggedIn() && Get_Cookie("LoadLogin")) {
		LoadLogin("1");
		eraseCookie("LoadLogin");
		return
	}
	if (queryString("LoadLogin")) {
		LoadLogin("5")
	}
	if (queryString("iosu") && (window.opener)) {
		window.opener.close()
	}
	var q = pspspassport;
	var a = psp;
	var r = queryString("uploadMode");
	var o = queryString("storeMode");
	var b = quoteToolURL + "?psp=" + a + ".psp";
	if (o) {
		b = b + "&storeMode=true"
	}
	quoteURL = b;
	if (q) {
		if (Get_Cookie("pspspassport") != null) {
			pspspassport = Get_Cookie("pspspassport")
		} else {
			pspspassport = q
		}
	}
	if ((g || ((typeof Level != "undefined") && (Level == "Private"))) && pspspassport.length > 20) {
		InitializeService(pspspassport);
		var m = document.getElementById("feedbackIcon");
		if (m) {
			m.style.display = "block"
		}
	} else {
		eraseCookie("pspspassport");
		loadQuoteTool(b)
	}
	if (a && typeof dbUpdateRequired != "undefined") {
		InitializeServiceIndexing(a)
	}
	hostname = location.hostname;
	try {} catch(m) {}
	rt_version = true;
	sideChangeFunction = sideChanged;
	systemProps.is_dev_env = false;
	_useFile = false;
	filedownloadURL = null;
	actionHandler = new PsP.ActionHandler();
	setTimeout("initializeUI4()", 1000)
}
function playerStart() {
	hostname = location.hostname;
	try {} catch(a) {}
	rt_version = true;
	sideChangeFunction = sideChanged;
	systemProps.is_dev_env = false;
	_useFile = false;
	filedownloadURL = null;
	actionHandler = new PsP.ActionHandler();
	initializeUI4()
}
function registerAppBubbles(B) {
	try {
		if (_is_dlp) {
			var x;
			if (canAdminTemplate()) {
				x = "DesignROTab";
				u = $("DesignRO");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("DesignROTab");
				if (u) {
					u.parentNode.removeChild(u)
				}
				x = "DesignTab"
			} else {
				x = "DesignROTab";
				u = $("Design");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("DesignTab");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("tagTab");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("tag");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("colorstabTab");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("colorstab");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("pricingTab");
				if (u) {
					u.parentNode.removeChild(u)
				}
				u = $("pricing");
				if (u) {
					u.parentNode.removeChild(u)
				}
			}
			$("productContent").show();
			dlpTabs = new ddtabcontent("storeproductTabs");
			dlpTabs.setpersist(true);
			dlpTabs.setselectedClassTarget("link");
			dlpTabs.init();
			dlpTabs.expandit(x);
			mainUtil = new PsP.MainUtil();
			setDesignDetails(B);
			setStoreModeDesignDetails(B);
			var g = document.getElementsByClassName("DLPActions");
			for (var o = 0; o < g.length; o++) {
				g[o].style.display = ""
			}
			mainUtil.loadDLPData()
		}
		setLogoSettings();
		_registerAppBubbles(B);
		var z = String(B.currentStation).toLowerCase();
		var m = String(B.WorkFlowtype).toLowerCase();
		var r = String(B.templateType).toLowerCase();
		var a = String(B.productGroupName).toLowerCase();
		var u = document.getElementById("searchbarsep");
		if (u) {
			u.style.display = "none"
		}
		var u = document.getElementById("searchbar");
		if (u) {
			u.style.display = "none"
		}
		if (z == String(B.startStation)) {
			var u = document.getElementById("backArrow");
			if (u) {
				u.setAttribute("href", "Javascript:startover();")
			}
		}
		var A = Get_Cookie("pspspassport")
	} catch(y) {}
	if (z == "position") {
		var q = true;
		var b = B.viewOptions;
		if (b != null) {
			b = parseInt(b);
			q = (b & RULER_ON_BITMASK) != 0
		}
		if (q) {
			actionHandler.toggleRuler()
		}
	}
	if (showJobListDialog) {
		doShowMyJobListDialog()
	}
}
function canAdminTemplate() {
	if (typeof accessMode !== "undefined" && accessMode == "direct") {
		return true
	}
	var m = trim(creatorEmail).toLowerCase();
	var a = trim(loggedInEmail).toLowerCase();
	if (a == "") {
		return false
	}
	var b = m == a;
	var g = !!_gallery_admins[a];
	var o = b || g;
	return o
}
function isSuperAdmin() {
	if (typeof accessMode != "undefined" && accessMode == "direct") {
		return true
	}
	var a = trim(loggedInEmail).toLowerCase();
	if (a == "") {
		return false
	}
	var b = !!_gallery_admins[a];
	return b
}
function _registerAppBubbles(q) {
	var A = q.productGroupName;
	var G = q.finishedDimensionsInches;
	var y = q.customerName;
	var x = q.jobId;
	var E;
	if (canAdminTemplate()) {
		$("saveStoreDiv").style.display = "block"
	}
	if (typeof accessMode == "undefined" || accessMode != "direct") {
		if (isSuperAdmin()) {
			setDisplayStyle("divHeaderMenu", "none");
			setDisplayStyle("divSuperAdminHeaderMenu", "");
			if (String(q.currentStation) == "gettingStarted" || String(q.currentStation) == "position" || String(q.currentStation) == "finalReview") {
				setDisplayStyle("saveStoreDiv", "")
			}
			if (String(q.currentStation) == "finalReview") {
				$("nextAction").disabled = "disabled"
			} else {
				$("nextAction").disabled = ""
			}
		}
	}
	E = document.getElementById("designDetail");
	if (E) {
		E.innerHTML = "&nbsp;(" + G + ")"
	}
	var E = document.getElementById("cropProductName");
	if (E) {
		E.innerHTML = A
	}
	var E = document.getElementById("cropDesignID");
	if (E) {
		E.innerHTML = x
	}
	var g = (typeof(accessMode) !== "undefined" && accessMode == "direct");
	if ((typeof Level != "undefined") && (Level == "Private") && !g) {
		var F = trim(q.email);
		if (F == "") {
			F = "guest"
		}
		var D = trim(loggedInEmail);
		if (D == "") {
			D = "guest"
		}
		if (F.toLowerCase() != "guest" && F.toLowerCase() != D.toLowerCase()) {
			var b = B;
			var z = signupURL + "?mode=login&psp=" + b + "&close=no&msg=invalid";
			eraseCookie("pspspassport");
			GB_showCenter("Login", z, LOGIN_DIALOG_HEIGHT, LOGIN_DIALOG_WIDTH)
		}
	}
	if ($("canvasContainer")) {
		$("canvasContainer").style.visibility = "visible"
	}
	if ($("previousTNPage")) {
		$("previousTNPage").style.visibility = "visible"
	}
	if ($("nextTNPage")) {
		$("nextTNPage").style.visibility = "visible"
	}
	var o = document.createElement("meta");
	o.name = "keywords";
	o.content = q.metadataKeywords;
	document.getElementsByTagName("head")[0].appendChild(o);
	var C = document.createElement("meta");
	C.name = "description";
	C.content = q.metadataDescription;
	document.getElementsByTagName("head")[0].appendChild(C);
	var H = String(q.pageTitle);
	if (H != "undefined" && H != "") {
		document.title = H
	}
	displayFoldingCallout(q);
	if (uploadMode == "true" && String(q.currentStation) == "position") {
		designer.imageTool();
		if (window.event) {
			window.event.cancelBubble = true
		}
		return false
	}
	addtoSite();
	var B = q.jobId;
	var m = imgLibraryURL + "?pspid=" + B + ".psp&showbetamode=true";
	var r = Get_Cookie("pspspassport");
	if (r != null) {
		m += "&pspspassport=" + r
	}
	imageLibraryURL = m;
	var u = galleryPageURL + "?fromcde=true";
	var a = homePageURL;
	if (r != null) {
		u = u + "&pspspassport=" + r;
		a = a + "?pspspassport=" + r
	}
	if (Get_Cookie("logoutuser") != null) {
		u = u + "&logoutuser=1"
	}
	var E = document.getElementById("DesignGalleryURL");
	if (E) {
		E.setAttribute("href", "Javascript:gotoGallery('" + u + "');")
	}
	var E = document.getElementById("imghomeicon");
	if (E) {
		E.setAttribute("href", "Javascript:gotoGallery('" + u + "');")
	}
}
function sideChanged(a) {
	designer.hideDefaultCallout();
	displayFoldingCallout()
}
function displayFoldingCallout(a) {
	if (designer.currentSurface != null) {
		for (var b = 0; b < designer.currentSurface.gobjects.length; b++) {
			var m = designer.currentSurface.gobjects[b];
			if (m.subType == "foldLine") {
				if (m.type == "vline") {
					m.element.onmouseover = showVFoldLineCallout
				} else {
					if (m.type == "hline") {
						m.element.onmouseover = showHFoldLineCallout
					}
				}
				m.element.onmouseout = hideDefaultCallout
			}
		}
	}
}
function hideDefaultCallout() {
	designer.hideDefaultCallout()
}
function showHFoldLineCallout(a) {
	a = a || window.event;
	var b = a.target ? a.target: a.srcElement;
	designer.showDefaultCallout(b, "This is a horizontal fold line", 200, b.offsetWidth / 2, 0, a.clientX, a.clientY)
}
function showVFoldLineCallout(a) {
	a = a || window.event;
	var b = a.target ? a.target: a.srcElement;
	designer.showDefaultCallout(b, "This is a vertical fold line", 200, 0, 100, a.clientX, a.clientY)
}
var FooterView = Class.create({
	MY_JOBS_LINK_ID: "footerMyJobsLink",
	MY_ARTWORKS_LINK_ID: "footerMyArtworktLink",
	MY_JOBS_URL: "/myaccount/myjobs/index.aspx?pspspassport=",
	MY_ARTWORK_URL: "/myartwork/index.aspx?pspspassport=",
	DEFAULT_WIDTH: 400,
	DEFAULT_HEIGHT: 400,
	SIGNUP_COMPONENT_URL: "/signupcomponent/signup.aspx?mode=login&psp=",
	initialize: function(m, b, g, a) {
		console.log("initialize FooterView");
		this.authUtil = m;
		this.popupWidth = b || this.DEFAULT_WIDTH;
		this.popupHeight = g || this.DEFAULT_HEIGHT;
		this.popupUrlPath = this.SIGNUP_COMPONENT_URL + a;
		this._bindEvents()
	},
	_bindEvents: function() {
		var b = $(this.MY_JOBS_LINK_ID);
		if (b) {
			b.observe("click", this.myJobsClickHandler.bind(this))
		}
		var a = $(this.MY_ARTWORKS_LINK_ID);
		if (a) {
			a.observe("click", this.myArtworksClickHandler.bind(this))
		}
	},
	myJobsClickHandler: function(b) {
		console.log("myJobsClickHandler");
		Event.stop(b);
		if (this.authUtil.isLoggedIn()) {
			var a = this._buildUrl(this.MY_JOBS_URL);
			this._naviageteTo(a)
		} else {
			GB_ORIGIN = "MyJobs";
			GB_showCenter("Login", this.popupUrlPath, this.popupHeight, this.popupWidth)
		}
	},
	myArtworksClickHandler: function(b) {
		console.log("myArtworksClickHandler");
		Event.stop(b);
		if (this.authUtil.isLoggedIn()) {
			var a = this._buildUrl(this.MY_ARTWORK_URL);
			this._naviageteTo(a)
		} else {
			GB_ORIGIN = "MyArtWork";
			GB_showCenter("Login", this.popupUrlPath, this.popupHeight, this.popupWidth)
		}
	},
	_buildUrl: function(b) {
		var g = this.authUtil.getPspassport();
		var a = b + g;
		return a
	},
	_naviageteTo: function(a) {
		console.log("_naviageteTo url=" + a);
		window.location = a
	}
});
