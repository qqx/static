(function(jQuery) {
	jQuery.hotkeys = {
		version: "0.8+",
		specialKeys: {
			8 : "backspace",
			9 : "tab",
			13 : "return",
			16 : "shift",
			17 : "ctrl",
			18 : "alt",
			19 : "pause",
			20 : "capslock",
			27 : "esc",
			32 : "space",
			33 : "pageup",
			34 : "pagedown",
			35 : "end",
			36 : "home",
			37 : "left",
			38 : "up",
			39 : "right",
			40 : "down",
			45 : "insert",
			46 : "del",
			96 : "0",
			97 : "1",
			98 : "2",
			99 : "3",
			100 : "4",
			101 : "5",
			102 : "6",
			103 : "7",
			104 : "8",
			105 : "9",
			106 : "*",
			107 : "+",
			109 : "-",
			110 : ".",
			111 : "/",
			112 : "f1",
			113 : "f2",
			114 : "f3",
			115 : "f4",
			116 : "f5",
			117 : "f6",
			118 : "f7",
			119 : "f8",
			120 : "f9",
			121 : "f10",
			122 : "f11",
			123 : "f12",
			144 : "numlock",
			145 : "scroll",
			188 : ",",
			190 : ".",
			191 : "/",
			224 : "meta"
		},
		shiftNums: {
			"`": "~",
			"1": "!",
			"2": "@",
			"3": "#",
			"4": "$",
			"5": "%",
			"6": "^",
			"7": "&",
			"8": "*",
			"9": "(",
			"0": ")",
			"-": "_",
			"=": "+",
			";": ": ",
			"'": "\"",
			",": "<",
			".": ">",
			"/": "?",
			"\\": "|"
		}
	};
	function keyHandler(handleObj) {
		var origHandler = handleObj.handler,
		keys = (handleObj.namespace || "").toLowerCase().split(" ");
		keys = jQuery.map(keys,
		function(key) {
			return key.split(".");
		});
		if (keys.length === 1 && (keys[0] === "" || keys[0] === "autocomplete")) {
			return;
		}
		handleObj.handler = function(event) {
			if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) || event.target.type === "text" || $(event.target).prop('contenteditable') == 'true')) {
				return;
			}
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
			character = String.fromCharCode(event.which).toLowerCase(),
			key,
			modif = "",
			possible = {};
			if (event.altKey && special !== "alt") {
				modif += "alt_";
			}
			if (event.ctrlKey && special !== "ctrl") {
				modif += "ctrl_";
			}
			if (event.metaKey && !event.ctrlKey && special !== "meta") {
				modif += "meta_";
			}
			if (event.shiftKey && special !== "shift") {
				modif += "shift_";
			}
			if (special) {
				possible[modif + special] = true;
			} else {
				possible[modif + character] = true;
				possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
				if (modif === "shift_") {
					possible[jQuery.hotkeys.shiftNums[character]] = true;
				}
			}
			for (var i = 0, l = keys.length; i < l; i++) {
				if (possible[keys[i]]) {
					return origHandler.apply(this, arguments);
				}
			}
		};
	}
	jQuery.each(["keydown", "keyup", "keypress"],
	function() {
		jQuery.event.special[this] = {
			add: keyHandler
		};
	});
})(jQuery);
(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(window.jQuery);
	}
} (function($) {
	'use strict';
	var counter = 0;
	$.ajaxTransport('iframe',
	function(options) {
		if (options.async && (options.type === 'POST' || options.type === 'GET')) {
			var form, iframe;
			return {
				send: function(_, completeCallback) {
					form = $('<form style="display:none;"></form>');
					iframe = $('<iframe src="javascript:false;" name="iframe-transport-' + (counter += 1) + '"></iframe>').bind('load',
					function() {
						var fileInputClones, paramNames = $.isArray(options.paramName) ? options.paramName: [options.paramName];
						iframe.unbind('load').bind('load',
						function() {
							var response;
							try {
								response = iframe.contents();
								if (!response.length || !response[0].firstChild) {
									throw new Error();
								}
							} catch(e) {
								response = undefined;
							}
							completeCallback(200, 'success', {
								'iframe': response
							});
							$('<iframe src="javascript:false;"></iframe>').appendTo(form);
							form.remove();
						});
						form.prop('target', iframe.prop('name')).prop('action', options.url).prop('method', options.type);
						if (options.formData) {
							$.each(options.formData,
							function(index, field) {
								$('<input type="hidden"/>').prop('name', field.name).val(field.value).appendTo(form);
							});
						}
						if (options.fileInput && options.fileInput.length && options.type === 'POST') {
							fileInputClones = options.fileInput.clone();
							options.fileInput.after(function(index) {
								return fileInputClones[index];
							});
							if (options.paramName) {
								options.fileInput.each(function(index) {
									$(this).prop('name', paramNames[index] || options.paramName);
								});
							}
							form.append(options.fileInput).prop('enctype', 'multipart/form-data').prop('encoding', 'multipart/form-data');
						}
						form.submit();
						if (fileInputClones && fileInputClones.length) {
							options.fileInput.each(function(index, input) {
								var clone = $(fileInputClones[index]);
								$(input).prop('name', clone.prop('name'));
								clone.replaceWith(input);
							});
						}
					});
					form.append(iframe).appendTo(document.body);
				},
				abort: function() {
					if (iframe) {
						iframe.unbind('load').prop('src', 'javascript'.concat(':false;'));
					}
					if (form) {
						form.remove();
					}
				}
			};
		}
	});
	$.ajaxSetup({
		converters: {
			'iframe text': function(iframe) {
				return $(iframe[0].body).text();
			},
			'iframe json': function(iframe) {
				return $.parseJSON($(iframe[0].body).text());
			},
			'iframe html': function(iframe) {
				return $(iframe[0].body).html();
			},
			'iframe script': function(iframe) {
				return $.globalEval($(iframe[0].body).text());
			}
		}
	});
}));
(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'jquery.ui.widget'], factory);
	} else {
		factory(window.jQuery);
	}
} (function($) {
	'use strict';
	$.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
	$.support.xhrFormDataFileUpload = !!window.FormData;
	$.widget('blueimp.fileupload', {
		options: {
			namespace: undefined,
			dropZone: $(document),
			fileInput: undefined,
			replaceFileInput: true,
			paramName: undefined,
			singleFileUploads: true,
			limitMultiFileUploads: undefined,
			sequentialUploads: false,
			limitConcurrentUploads: undefined,
			forceIframeTransport: false,
			redirect: undefined,
			redirectParamName: undefined,
			postMessage: undefined,
			multipart: true,
			maxChunkSize: undefined,
			uploadedBytes: undefined,
			recalculateProgress: true,
			progressInterval: 100,
			bitrateInterval: 500,
			formData: function(form) {
				return form.serializeArray();
			},
			add: function(e, data) {
				data.submit();
			},
			processData: false,
			contentType: false,
			cache: false
		},
		_refreshOptionsList: ['namespace', 'dropZone', 'fileInput', 'multipart', 'forceIframeTransport'],
		_BitrateTimer: function() {
			this.timestamp = +(new Date());
			this.loaded = 0;
			this.bitrate = 0;
			this.getBitrate = function(now, loaded, interval) {
				var timeDiff = now - this.timestamp;
				if (!this.bitrate || !interval || timeDiff > interval) {
					this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
					this.loaded = loaded;
					this.timestamp = now;
				}
				return this.bitrate;
			};
		},
		_isXHRUpload: function(options) {
			return ! options.forceIframeTransport && ((!options.multipart && $.support.xhrFileUpload) || $.support.xhrFormDataFileUpload);
		},
		_getFormData: function(options) {
			var formData;
			if (typeof options.formData === 'function') {
				return options.formData(options.form);
			}
			if ($.isArray(options.formData)) {
				return options.formData;
			}
			if (options.formData) {
				formData = [];
				$.each(options.formData,
				function(name, value) {
					formData.push({
						name: name,
						value: value
					});
				});
				return formData;
			}
			return [];
		},
		_getTotal: function(files) {
			var total = 0;
			$.each(files,
			function(index, file) {
				total += file.size || 1;
			});
			return total;
		},
		_onProgress: function(e, data) {
			if (e.lengthComputable) {
				var now = +(new Date()),
				total,
				loaded;
				if (data._time && data.progressInterval && (now - data._time < data.progressInterval) && e.loaded !== e.total) {
					return;
				}
				data._time = now;
				total = data.total || this._getTotal(data.files);
				loaded = parseInt(e.loaded / e.total * (data.chunkSize || total), 10) + (data.uploadedBytes || 0);
				this._loaded += loaded - (data.loaded || data.uploadedBytes || 0);
				data.lengthComputable = true;
				data.loaded = loaded;
				data.total = total;
				data.bitrate = data._bitrateTimer.getBitrate(now, loaded, data.bitrateInterval);
				this._trigger('progress', e, data);
				this._trigger('progressall', e, {
					lengthComputable: true,
					loaded: this._loaded,
					total: this._total,
					bitrate: this._bitrateTimer.getBitrate(now, this._loaded, data.bitrateInterval)
				});
			}
		},
		_initProgressListener: function(options) {
			var that = this,
			xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
			if (xhr.upload) {
				$(xhr.upload).bind('progress',
				function(e) {
					var oe = e.originalEvent;
					e.lengthComputable = oe.lengthComputable;
					e.loaded = oe.loaded;
					e.total = oe.total;
					that._onProgress(e, options);
				});
				options.xhr = function() {
					return xhr;
				};
			}
		},
		_initXHRData: function(options) {
			var formData, file = options.files[0],
			multipart = options.multipart || !$.support.xhrFileUpload,
			paramName = options.paramName[0];
			if (!multipart || options.blob) {
				options.headers = $.extend(options.headers, {
					'X-File-Name': file.name,
					'X-File-Type': file.type,
					'X-File-Size': file.size
				});
				if (!options.blob) {
					options.contentType = file.type;
					options.data = file;
				} else if (!multipart) {
					options.contentType = 'application/octet-stream';
					options.data = options.blob;
				}
			}
			if (multipart && $.support.xhrFormDataFileUpload) {
				if (options.postMessage) {
					formData = this._getFormData(options);
					if (options.blob) {
						formData.push({
							name: paramName,
							value: options.blob
						});
					} else {
						$.each(options.files,
						function(index, file) {
							formData.push({
								name: options.paramName[index] || paramName,
								value: file
							});
						});
					}
				} else {
					if (options.formData instanceof FormData) {
						formData = options.formData;
					} else {
						formData = new FormData();
						$.each(this._getFormData(options),
						function(index, field) {
							formData.append(field.name, field.value);
						});
					}
					if (options.blob) {
						formData.append(paramName, options.blob, file.name);
					} else {
						$.each(options.files,
						function(index, file) {
							if (file instanceof Blob) {
								formData.append(options.paramName[index] || paramName, file, file.name);
							}
						});
					}
				}
				options.data = formData;
			}
			options.blob = null;
		},
		_initIframeSettings: function(options) {
			options.dataType = 'iframe ' + (options.dataType || '');
			options.formData = this._getFormData(options);
			if (options.redirect && $('<a></a>').prop('href', options.url).prop('host') !== location.host) {
				options.formData.push({
					name: options.redirectParamName || 'redirect',
					value: options.redirect
				});
			}
		},
		_initDataSettings: function(options) {
			if (this._isXHRUpload(options)) {
				if (!this._chunkedUpload(options, true)) {
					if (!options.data) {
						this._initXHRData(options);
					}
					this._initProgressListener(options);
				}
				if (options.postMessage) {
					options.dataType = 'postmessage ' + (options.dataType || '');
				}
			} else {
				this._initIframeSettings(options, 'iframe');
			}
		},
		_getParamName: function(options) {
			var fileInput = $(options.fileInput),
			paramName = options.paramName;
			if (!paramName) {
				paramName = [];
				fileInput.each(function() {
					var input = $(this),
					name = input.prop('name') || 'files[]',
					i = (input.prop('files') || [1]).length;
					while (i) {
						paramName.push(name);
						i -= 1;
					}
				});
				if (!paramName.length) {
					paramName = [fileInput.prop('name') || 'files[]'];
				}
			} else if (!$.isArray(paramName)) {
				paramName = [paramName];
			}
			return paramName;
		},
		_initFormSettings: function(options) {
			if (!options.form || !options.form.length) {
				options.form = $(options.fileInput.prop('form'));
			}
			options.paramName = this._getParamName(options);
			if (!options.url) {
				options.url = options.form.prop('action') || location.href;
			}
			options.type = (options.type || options.form.prop('method') || '').toUpperCase();
			if (options.type !== 'POST' && options.type !== 'PUT') {
				options.type = 'POST';
			}
		},
		_getAJAXSettings: function(data) {
			var options = $.extend({},
			this.options, data);
			this._initFormSettings(options);
			this._initDataSettings(options);
			return options;
		},
		_enhancePromise: function(promise) {
			promise.success = promise.done;
			promise.error = promise.fail;
			promise.complete = promise.always;
			return promise;
		},
		_getXHRPromise: function(resolveOrReject, context, args) {
			var dfd = $.Deferred(),
			promise = dfd.promise();
			context = context || this.options.context || promise;
			if (resolveOrReject === true) {
				dfd.resolveWith(context, args);
			} else if (resolveOrReject === false) {
				dfd.rejectWith(context, args);
			}
			promise.abort = dfd.promise;
			return this._enhancePromise(promise);
		},
		_chunkedUpload: function(options, testOnly) {
			var that = this,
			file = options.files[0],
			fs = file.size,
			ub = options.uploadedBytes = options.uploadedBytes || 0,
			mcs = options.maxChunkSize || fs,
			slice = file.webkitSlice || file.mozSlice || file.slice,
			upload,
			n,
			jqXHR,
			pipe;
			if (! (this._isXHRUpload(options) && slice && (ub || mcs < fs)) || options.data) {
				return false;
			}
			if (testOnly) {
				return true;
			}
			if (ub >= fs) {
				file.error = 'uploadedBytes';
				return this._getXHRPromise(false, options.context, [null, 'error', file.error]);
			}
			n = Math.ceil((fs - ub) / mcs);
			upload = function(i) {
				if (!i) {
					return that._getXHRPromise(true, options.context);
				}
				return upload(i -= 1).pipe(function() {
					var o = $.extend({},
					options);
					o.blob = slice.call(file, ub + i * mcs, ub + (i + 1) * mcs);
					o.chunkSize = o.blob.size;
					that._initXHRData(o);
					that._initProgressListener(o);
					jqXHR = ($.ajax(o) || that._getXHRPromise(false, o.context)).done(function() {
						if (!o.loaded) {
							that._onProgress($.Event('progress', {
								lengthComputable: true,
								loaded: o.chunkSize,
								total: o.chunkSize
							}), o);
						}
						options.uploadedBytes = o.uploadedBytes += o.chunkSize;
					});
					return jqXHR;
				});
			};
			pipe = upload(n);
			pipe.abort = function() {
				return jqXHR.abort();
			};
			return this._enhancePromise(pipe);
		},
		_beforeSend: function(e, data) {
			if (this._active === 0) {
				this._trigger('start');
				this._bitrateTimer = new this._BitrateTimer();
			}
			this._active += 1;
			this._loaded += data.uploadedBytes || 0;
			this._total += this._getTotal(data.files);
		},
		_onDone: function(result, textStatus, jqXHR, options) {
			if (!this._isXHRUpload(options)) {
				this._onProgress($.Event('progress', {
					lengthComputable: true,
					loaded: 1,
					total: 1
				}), options);
			}
			options.result = result;
			options.textStatus = textStatus;
			options.jqXHR = jqXHR;
			this._trigger('done', null, options);
		},
		_onFail: function(jqXHR, textStatus, errorThrown, options) {
			options.jqXHR = jqXHR;
			options.textStatus = textStatus;
			options.errorThrown = errorThrown;
			this._trigger('fail', null, options);
			if (options.recalculateProgress) {
				this._loaded -= options.loaded || options.uploadedBytes || 0;
				this._total -= options.total || this._getTotal(options.files);
			}
		},
		_onAlways: function(jqXHRorResult, textStatus, jqXHRorError, options) {
			this._active -= 1;
			options.textStatus = textStatus;
			if (jqXHRorError && jqXHRorError.always) {
				options.jqXHR = jqXHRorError;
				options.result = jqXHRorResult;
			} else {
				options.jqXHR = jqXHRorResult;
				options.errorThrown = jqXHRorError;
			}
			this._trigger('always', null, options);
			if (this._active === 0) {
				this._trigger('stop');
				this._loaded = this._total = 0;
				this._bitrateTimer = null;
			}
		},
		_onSend: function(e, data) {
			var that = this,
			jqXHR, slot, pipe, options = that._getAJAXSettings(data),
			send = function(resolve, args) {
				that._sending += 1;
				options._bitrateTimer = new that._BitrateTimer();
				jqXHR = jqXHR || ((resolve !== false && that._trigger('send', e, options) !== false && (that._chunkedUpload(options) || $.ajax(options))) || that._getXHRPromise(false, options.context, args)).done(function(result, textStatus, jqXHR) {
					that._onDone(result, textStatus, jqXHR, options);
				}).fail(function(jqXHR, textStatus, errorThrown) {
					that._onFail(jqXHR, textStatus, errorThrown, options);
				}).always(function(jqXHRorResult, textStatus, jqXHRorError) {
					that._sending -= 1;
					that._onAlways(jqXHRorResult, textStatus, jqXHRorError, options);
					if (options.limitConcurrentUploads && options.limitConcurrentUploads > that._sending) {
						var nextSlot = that._slots.shift();
						while (nextSlot) {
							if (!nextSlot.isRejected()) {
								nextSlot.resolve();
								break;
							}
							nextSlot = that._slots.shift();
						}
					}
				});
				return jqXHR;
			};
			this._beforeSend(e, options);
			if (this.options.sequentialUploads || (this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending)) {
				if (this.options.limitConcurrentUploads > 1) {
					slot = $.Deferred();
					this._slots.push(slot);
					pipe = slot.pipe(send);
				} else {
					pipe = (this._sequence = this._sequence.pipe(send, send));
				}
				pipe.abort = function() {
					var args = [undefined, 'abort', 'abort'];
					if (!jqXHR) {
						if (slot) {
							slot.rejectWith(args);
						}
						return send(false, args);
					}
					return jqXHR.abort();
				};
				return this._enhancePromise(pipe);
			}
			return send();
		},
		_onAdd: function(e, data) {
			var that = this,
			result = true,
			options = $.extend({},
			this.options, data),
			limit = options.limitMultiFileUploads,
			paramName = this._getParamName(options),
			paramNameSet,
			paramNameSlice,
			fileSet,
			i;
			if (! (options.singleFileUploads || limit) || !this._isXHRUpload(options)) {
				fileSet = [data.files];
				paramNameSet = [paramName];
			} else if (!options.singleFileUploads && limit) {
				fileSet = [];
				paramNameSet = [];
				for (i = 0; i < data.files.length; i += limit) {
					fileSet.push(data.files.slice(i, i + limit));
					paramNameSlice = paramName.slice(i, i + limit);
					if (!paramNameSlice.length) {
						paramNameSlice = paramName;
					}
					paramNameSet.push(paramNameSlice);
				}
			} else {
				paramNameSet = paramName;
			}
			data.originalFiles = data.files;
			$.each(fileSet || data.files,
			function(index, element) {
				var newData = $.extend({},
				data);
				newData.files = fileSet ? element: [element];
				newData.paramName = paramNameSet[index];
				newData.submit = function() {
					newData.jqXHR = this.jqXHR = (that._trigger('submit', e, this) !== false) && that._onSend(e, this);
					return this.jqXHR;
				};
				return (result = that._trigger('add', e, newData));
			});
			return result;
		},
		_normalizeFile: function(index, file) {
			if (file.name === undefined && file.size === undefined) {
				file.name = file.fileName;
				file.size = file.fileSize;
			}
		},
		_replaceFileInput: function(input) {
			var inputClone = input.clone(true);
			$('<form></form>').append(inputClone)[0].reset();
			input.after(inputClone).detach();
			$.cleanData(input.unbind('remove'));
			this.options.fileInput = this.options.fileInput.map(function(i, el) {
				if (el === input[0]) {
					return inputClone[0];
				}
				return el;
			});
			if (input[0] === this.element[0]) {
				this.element = inputClone;
			}
		},
		_onChange: function(e) {
			var that = e.data.fileupload,
			data = {
				files: $.each($.makeArray(e.target.files), that._normalizeFile),
				fileInput: $(e.target),
				form: $(e.target.form)
			};
			if (!data.files.length) {
				data.files = [{
					name: e.target.value.replace(/^.*\\/, '')
				}];
			}
			if (that.options.replaceFileInput) {
				that._replaceFileInput(data.fileInput);
			}
			if (that._trigger('change', e, data) === false || that._onAdd(e, data) === false) {
				return false;
			}
		},
		_onPaste: function(e) {
			var that = e.data.fileupload,
			cbd = e.originalEvent.clipboardData,
			items = (cbd && cbd.items) || [],
			data = {
				files: []
			};
			$.each(items,
			function(index, item) {
				var file = item.getAsFile && item.getAsFile();
				if (file) {
					data.files.push(file);
				}
			});
			if (that._trigger('paste', e, data) === false || that._onAdd(e, data) === false) {
				return false;
			}
		},
		_onDrop: function(e) {
			var that = e.data.fileupload,
			dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer,
			data = {
				files: $.each($.makeArray(dataTransfer && dataTransfer.files), that._normalizeFile)
			};
			if (that._trigger('drop', e, data) === false || that._onAdd(e, data) === false) {
				return false;
			}
			e.preventDefault();
		},
		_onDragOver: function(e) {
			if ($.browser.msie) {
				e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
				var dataTransfer = e.dataTransfer;
				var that = e.data.fileupload;
				if (dataTransfer) {
					if (that._trigger('dragover', e) === false) {
						return false;
					}
					if ($.inArray('Files', dataTransfer.types) !== -1) {
						dataTransfer.dropEffect = 'copy';
						e.preventDefault();
					}
				}
			} else {
				var that = e.data.fileupload,
				dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer;
				if (that._trigger('dragover', e) === false) {
					return false;
				}
				if (dataTransfer) {
					dataTransfer.dropEffect = dataTransfer.effectAllowed = 'copy';
				}
				e.preventDefault();
			}
		},
		_initEventHandlers: function() {
			var ns = this.options.namespace;
			if (this._isXHRUpload(this.options)) {
				this.options.dropZone.bind('dragover.' + ns, {
					fileupload: this
				},
				this._onDragOver).bind('drop.' + ns, {
					fileupload: this
				},
				this._onDrop).bind('paste.' + ns, {
					fileupload: this
				},
				this._onPaste);
			}
			this.options.fileInput.bind('change.' + ns, {
				fileupload: this
			},
			this._onChange);
		},
		_destroyEventHandlers: function() {
			var ns = this.options.namespace;
			this.options.dropZone.unbind('dragover.' + ns, this._onDragOver).unbind('drop.' + ns, this._onDrop).unbind('paste.' + ns, this._onPaste);
			this.options.fileInput.unbind('change.' + ns, this._onChange);
		},
		_setOption: function(key, value) {
			var refresh = $.inArray(key, this._refreshOptionsList) !== -1;
			if (refresh) {
				this._destroyEventHandlers();
			}
			$.Widget.prototype._setOption.call(this, key, value);
			if (refresh) {
				this._initSpecialOptions();
				this._initEventHandlers();
			}
		},
		_initSpecialOptions: function() {
			var options = this.options;
			if (options.fileInput === undefined) {
				options.fileInput = this.element.is('input:file') ? this.element: this.element.find('input:file');
			} else if (! (options.fileInput instanceof $)) {
				options.fileInput = $(options.fileInput);
			}
			if (! (options.dropZone instanceof $)) {
				options.dropZone = $(options.dropZone);
			}
		},
		_create: function() {
			var options = this.options;
			$.extend(options, $(this.element[0].cloneNode(false)).data());
			options.namespace = options.namespace || this.widgetName;
			this._initSpecialOptions();
			this._slots = [];
			this._sequence = this._getXHRPromise(true);
			this._sending = this._active = this._loaded = this._total = 0;
			this._initEventHandlers();
		},
		destroy: function() {
			this._destroyEventHandlers();
			$.Widget.prototype.destroy.call(this);
		},
		enable: function() {
			$.Widget.prototype.enable.call(this);
			this._initEventHandlers();
		},
		disable: function() {
			this._destroyEventHandlers();
			$.Widget.prototype.disable.call(this);
		},
		add: function(data) {
			if (!data || this.options.disabled) {
				return;
			}
			data.files = $.each($.makeArray(data.files), this._normalizeFile);
			this._onAdd(null, data);
		},
		send: function(data) {
			if (data && !this.options.disabled) {
				data.files = $.each($.makeArray(data.files), this._normalizeFile);
				if (data.files.length) {
					return this._onSend(null, data);
				}
			}
			return this._getXHRPromise(false, data && data.context);
		}
	});
}));
(function(f, j, k) {
	var l, h, m, n, o;
	n = {
		paneClass: "pane",
		sliderClass: "slider",
		sliderMinHeight: 20,
		contentClass: "content",
		iOSNativeScrolling: !1,
		preventPageScrolling: !1,
		disableResize: !1
	};
	l = "Microsoft Internet Explorer" === j.navigator.appName && /msie 7./i.test(j.navigator.appVersion) && j.ActiveXObject;
	h = null;
	o = function() {
		var b, a;
		b = k.createElement("div");
		a = b.style;
		a.position = "absolute";
		a.width = "100px";
		a.height = "100px";
		a.overflow = "scroll";
		a.top = "-9999px";
		k.body.appendChild(b);
		a = b.offsetWidth - b.clientWidth;
		k.body.removeChild(b);
		return a
	};
	m = function() {
		function b(a, c) {
			this.options = c;
			h || (h = o());
			this.el = f(a);
			this.doc = f(k);
			this.win = f(j);
			this.generate();
			this.createEvents();
			this.addEvents();
			this.reset()
		}
		b.prototype.preventScrolling = function(a, c) {
			switch (a.type) {
			case "DOMMouseScroll":
				("down" === c && 0 < a.originalEvent.detail || "up" === c && 0 > a.originalEvent.detail) && a.preventDefault();
				break;
			case "mousewheel":
				if (!a.originalEvent) break;
				if (!a.originalEvent.wheelDelta) break;
				("down" === c && 0 > a.originalEvent.wheelDelta || "up" === c && 0 < a.originalEvent.wheelDelta) && a.preventDefault()
			}
		};
		b.prototype.createEvents = function() {
			var a = this;
			this.events = {
				down: function(c) {
					a.isBeingDragged = !0;
					a.offsetY = c.clientY - a.slider.offset().top;
					a.pane.addClass("active");
					a.doc.bind("mousemove", a.events.drag).bind("mouseup", a.events.up);
					return ! 1
				},
				drag: function(c) {
					a.sliderY = c.clientY - a.el.offset().top - a.offsetY;
					a.scroll();
					return ! 1
				},
				up: function() {
					a.isBeingDragged = !1;
					a.pane.removeClass("active");
					a.doc.unbind("mousemove", a.events.drag).unbind("mouseup", a.events.up);
					return ! 1
				},
				resize: function() {
					a.reset()
				},
				panedown: function(c) {
					a.sliderY = c.offsetY - 0.5 * a.sliderHeight;
					a.scroll();
					a.events.down(c);
					return ! 1
				},
				scroll: function(c) {
					var b, g, e;
					a.isBeingDragged || (b = a.content[0].scrollHeight - a.content[0].clientHeight, e = a.content[0].scrollTop, g = a.paneHeight - a.sliderHeight, a.slider.css({
						top: e * g / b
					}), null != c && (e >= b ? (a.options.preventPageScrolling && a.preventScrolling(c, "down"), a.el.trigger("scrollend")) : 0 === e && (a.options.preventPageScrolling && a.preventScrolling(c, "up"), a.el.trigger("scrolltop"))))
				},
				wheel: function(c) {
					if (null != c) return a.sliderY += -c.wheelDeltaY || -c.delta,
					a.scroll(),
					!1
				}
			}
		};
		b.prototype.addEvents = function() {
			var a;
			a = this.events;
			this.options.disableResize || this.win.bind("resize", a.resize);
			this.slider.bind("mousedown", a.down);
			this.pane.bind("mousedown", a.panedown).bind("mousewheel", a.wheel).bind("DOMMouseScroll", a.wheel);
			this.content.bind("mousewheel", a.scroll).bind("DOMMouseScroll", a.scroll).bind("touchmove", a.scroll)
		};
		b.prototype.removeEvents = function() {
			var a;
			a = this.events;
			this.options.disableResize || this.win.unbind("resize", a.resize);
			this.slider.unbind("mousedown", a.down);
			this.pane.unbind("mousedown", a.panedown).unbind("mousewheel", a.wheel).unbind("DOMMouseScroll", a.wheel);
			this.content.unbind("mousewheel", a.scroll).unbind("DOMMouseScroll", a.scroll).unbind("touchmove", a.scroll)
		};
		b.prototype.generate = function() {
			var a, c, b, g, e;
			b = this.options;
			g = b.paneClass;
			e = b.sliderClass;
			a = b.contentClass;
			this.el.append('<div class="' + g + '"><div class="' + e + '" /></div>');
			this.content = f(this.el.children("." + a)[0]);
			this.slider = this.el.find("." + e);
			this.pane = this.el.find("." + g);
			h && (c = {
				right: -h
			},
			this.el.addClass("has-scrollbar"));
			b.iOSNativeScrolling && (null == c && (c = {}), c.WebkitOverflowScrolling = "touch");
			null != c && this.content.css(c);
			return this
		};
		b.prototype.elementsExist = function() {
			return this.el.find("." + this.options.paneClass).length
		};
		b.prototype.restore = function() {
			this.stopped = !1;
			this.pane.show();
			return this.addEvents()
		};
		b.prototype.reset = function() {
			var a, b, f, g, e, i, d;
			this.elementsExist() || this.generate().stop();
			this.stopped && this.restore();
			a = this.content[0];
			f = a.style;
			g = f.overflowY;
			l && this.content.css({
				height: this.content.height()
			});
			b = a.scrollHeight + h;
			i = this.pane.outerHeight();
			d = parseInt(this.pane.css("top"), 10);
			e = parseInt(this.pane.css("bottom"), 10);
			e = i + d + e;
			d = Math.round(e / b * e);
			d = d > this.options.sliderMinHeight ? d: this.options.sliderMinHeight;
			"scroll" === g && "scroll" !== f.overflowX && (d += h);
			this.contentHeight = b;
			this.paneHeight = i;
			this.paneOuterHeight = e;
			this.sliderHeight = d;
			this.maxSliderTop = e - d;
			this.slider.height(d);
			this.events.scroll();
			this.pane.show();
			this.paneOuterHeight >= a.scrollHeight && "scroll" !== g ? this.pane.hide() : this.el.height() === a.scrollHeight && "scroll" === g ? this.slider.hide() : this.slider.show();
			return this
		};
		b.prototype.scroll = function() {
			this.sliderY = Math.max(0, this.sliderY);
			this.sliderY = Math.min(this.maxSliderTop, this.sliderY);
			this.content.scrollTop( - 1 * ((this.paneHeight - this.contentHeight + h) * this.sliderY / this.maxSliderTop));
			this.slider.css({
				top: this.sliderY
			});
			return this
		};
		b.prototype.scrollBottom = function(a) {
			this.reset();
			this.content.scrollTop(this.contentHeight - this.content.height() - a).trigger("mousewheel");
			return this
		};
		b.prototype.scrollTop = function(a) {
			this.reset();
			this.content.scrollTop( + a).trigger("mousewheel");
			return this
		};
		b.prototype.scrollTo = function(a) {
			this.reset();
			a = f(a).offset().top;
			a > this.maxSliderTop && (a /= this.contentHeight, this.sliderY = a *= this.maxSliderTop, this.scroll());
			return this
		};
		b.prototype.stop = function() {
			this.stopped = !0;
			this.removeEvents();
			this.pane.hide();
			return this
		};
		return b
	} ();
	f.fn.nanoScroller = function(b) {
		var a, c, h, g, e, i;
		null != b && (h = b.scrollBottom, e = b.scrollTop, g = b.scrollTo, c = b.scroll, i = b.stop);
		a = f.extend({},
		n, b);
		this.each(function() {
			var d;
			if (d = f.data(this, "scrollbar")) f.extend(d.options, b);
			else {
				d = new m(this, a);
				f.data(this, "scrollbar", d)
			}
			return h ? d.scrollBottom(h) : e ? d.scrollTop(e) : g ? d.scrollTo(g) : c === "bottom" ? d.scrollBottom(0) : c === "top" ? d.scrollTop(0) : c instanceof f ? d.scrollTo(c) : i ? d.stop() : d.reset()
		})
	}
})(jQuery, window, document);
(function(jQuery) {
	jQuery.fn.clickoutside = function(callback) {
		var self = $(this);
		self.cb = callback;
		self.outside = 1;
		this.on('click.outside',
		function() {
			self.outside = 0;
		});
		$(document).on('click.outside',
		function(ev) {
			self.outside && self.cb(ev);
			self.outside = 1;
		});
		return self;
	}
})(jQuery);
(function($) {
	function getTransformProperty(element) {
		var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
		var p;
		while (p = properties.shift()) {
			if (typeof element.style[p] != 'undefined') {
				return p;
			}
		}
		return 'transform';
	}
	var _propsObj = null;
	var proxied = $.fn.css;
	$.fn.css = function(arg, val) {
		if (_propsObj === null) {
			if (typeof $.cssProps != 'undefined') {
				_propsObj = $.cssProps;
			} else if (typeof $.props != 'undefined') {
				_propsObj = $.props;
			} else {
				_propsObj = {}
			}
		}
		if (typeof _propsObj['transform'] == 'undefined' && (arg == 'transform' || (typeof arg == 'object' && typeof arg['transform'] != 'undefined'))) {
			_propsObj['transform'] = getTransformProperty(this.get(0));
		}
		if (_propsObj['transform'] != 'transform') {
			if (arg == 'transform') {
				arg = _propsObj['transform'];
				if (typeof val == 'undefined' && jQuery.style) {
					return jQuery.style(this.get(0), arg);
				}
			} else if (typeof arg == 'object' && typeof arg['transform'] != 'undefined') {
				arg[_propsObj['transform']] = arg['transform'];
				delete arg['transform'];
			}
		}
		return proxied.apply(this, arguments);
	};
})(jQuery);
(function() {
	var oldSetOption = $.ui.resizable.prototype._setOption;
	$.ui.resizable.prototype._setOption = function(key, value) {
		oldSetOption.apply(this, arguments);
		if (key === "aspectRatio") {
			this._aspectRatio = !!value;
		}
	};
})();
function monkeyPatch_mouseStart() {
	var oldFn = $.ui.draggable.prototype._mouseStart;
	$.ui.draggable.prototype._mouseStart = function(event) {
		var o = this.options;
		function getViewOffset(node) {
			var x = 0,
			y = 0,
			win = node.ownerDocument.defaultView || window;
			if (node) addOffset(node);
			return {
				left: x,
				top: y
			};
			function getStyle(node) {
				return node.currentStyle || win.getComputedStyle(node, '');
			}
			function addOffset(node) {
				var p = node.offsetParent,
				style, X, Y;
				x += parseInt(node.offsetLeft, 10) || 0;
				y += parseInt(node.offsetTop, 10) || 0;
				if (p) {
					x -= parseInt(p.scrollLeft, 10) || 0;
					y -= parseInt(p.scrollTop, 10) || 0;
					if (p.nodeType == 1) {
						var parentStyle = getStyle(p),
						localName = p.localName,
						parent = node.parentNode;
						if (parentStyle.position != 'static') {
							x += parseInt(parentStyle.borderLeftWidth, 10) || 0;
							y += parseInt(parentStyle.borderTopWidth, 10) || 0;
							if (localName == 'TABLE') {
								x += parseInt(parentStyle.paddingLeft, 10) || 0;
								y += parseInt(parentStyle.paddingTop, 10) || 0;
							} else if (localName == 'BODY') {
								style = getStyle(node);
								x += parseInt(style.marginLeft, 10) || 0;
								y += parseInt(style.marginTop, 10) || 0;
							}
						} else if (localName == 'BODY') {
							x += parseInt(parentStyle.borderLeftWidth, 10) || 0;
							y += parseInt(parentStyle.borderTopWidth, 10) || 0;
						}
						while (p != parent) {
							x -= parseInt(parent.scrollLeft, 10) || 0;
							y -= parseInt(parent.scrollTop, 10) || 0;
							parent = parent.parentNode;
						}
						addOffset(p);
					}
				} else {
					if (node.localName == 'BODY') {
						style = getStyle(node);
						x += parseInt(style.borderLeftWidth, 10) || 0;
						y += parseInt(style.borderTopWidth, 10) || 0;
						var htmlStyle = getStyle(node.parentNode);
						x -= parseInt(htmlStyle.paddingLeft, 10) || 0;
						y -= parseInt(htmlStyle.paddingTop, 10) || 0;
					}
					if ((X = node.scrollLeft)) x += parseInt(X, 10) || 0;
					if ((Y = node.scrollTop)) y += parseInt(Y, 10) || 0;
				}
			}
		}
		this.helper = this._createHelper(event);
		this._cacheHelperProportions();
		if ($.ui.ddmanager) $.ui.ddmanager.current = this;
		this._cacheMargins();
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();
		this.offset = this.positionAbs = getViewOffset(this.element[0]);
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};
		$.extend(this.offset, {
			click: {
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset()
		});
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));
		if (o.containment) this._setContainment();
		if (this._trigger("start", event) === false) {
			this._clear();
			return false;
		}
		this._cacheHelperProportions();
		if ($.ui.ddmanager && !o.dropBehaviour) $.ui.ddmanager.prepareOffsets(this, event);
		this.helper.addClass("ui-draggable-dragging");
		this._mouseDrag(event, true);
		if ($.ui.ddmanager) $.ui.ddmanager.dragStart(this, event);
		return true;
	};
}
monkeyPatch_mouseStart();
(function($, document) {
	var pluses = /\+/g;
	function raw(s) {
		return s;
	}
	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}
	$.cookie = function(key, value, options) {
		if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value == null)) {
			options = $.extend({},
			$.cookie.defaults, options);
			if (value == null) {
				options.expires = -1;
			}
			if (typeof options.expires === 'number') {
				var days = options.expires,
				t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}
			value = String(value);
			return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value: encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
		}
		options = value || $.cookie.defaults || {};
		var decode = options.raw ? raw: decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, parts;
		(parts = cookies[i] && cookies[i].split('=')); i++) {
			if (decode(parts.shift()) === key) {
				return decode(parts.join('='));
			}
		}
		return null;
	};
	$.cookie.defaults = {};
})(jQuery, document);
(function($) {
	'use strict';
	var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
	meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	},
	hasOwn = Object.prototype.hasOwnProperty;
	$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify: function(o) {
		if (o === null) {
			return 'null';
		}
		var pairs, k, name, val, type = $.type(o);
		if (type === 'undefined') {
			return undefined;
		}
		if (type === 'number' || type === 'boolean') {
			return String(o);
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (typeof o.toJSON === 'function') {
			return $.toJSON(o.toJSON());
		}
		if (type === 'date') {
			var month = o.getUTCMonth() + 1,
			day = o.getUTCDate(),
			year = o.getUTCFullYear(),
			hours = o.getUTCHours(),
			minutes = o.getUTCMinutes(),
			seconds = o.getUTCSeconds(),
			milli = o.getUTCMilliseconds();
			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milli < 100) {
				milli = '0' + milli;
			}
			if (milli < 10) {
				milli = '0' + milli;
			}
			return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
		}
		pairs = [];
		if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) {
				pairs.push($.toJSON(o[k]) || 'null');
			}
			return '[' + pairs.join(',') + ']';
		}
		if (typeof o === 'object') {
			for (k in o) {
				if (hasOwn.call(o, k)) {
					type = typeof k;
					if (type === 'number') {
						name = '"' + k + '"';
					} else if (type === 'string') {
						name = $.quoteString(k);
					} else {
						continue;
					}
					type = typeof o[k];
					if (type !== 'function' && type !== 'undefined') {
						val = $.toJSON(o[k]);
						pairs.push(name + ':' + val);
					}
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	};
	$.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse: function(str) {
		return eval('(' + str + ')');
	};
	$.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse: function(str) {
		var filtered = str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
		if (/^[\],:{}\s]*$/.test(filtered)) {
			return eval('(' + str + ')');
		}
		throw new SyntaxError('Error parsing JSON, source is not valid.');
	};
	$.quoteString = function(str) {
		if (str.match(escape)) {
			return '"' + str.replace(escape,
			function(a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + str + '"';
	};
} (jQuery));
(function(b) {
	function d(a) {
		this.input = a;
		a.attr("type") == "password" && this.handlePassword();
		b(a[0].form).submit(function() {
			if (a.hasClass("placeholder") && a[0].value == a.attr("placeholder")) a[0].value = ""
		})
	}
	d.prototype = {
		show: function(a) {
			if (this.input[0].value === "" || a && this.valueIsPlaceholder()) {
				if (this.isPassword) try {
					this.input[0].setAttribute("type", "text")
				} catch(b) {
					this.input.before(this.fakePassword.show()).hide()
				}
				this.input.addClass("placeholder");
				this.input[0].value = this.input.attr("placeholder")
			}
		},
		hide: function() {
			if (this.valueIsPlaceholder() && this.input.hasClass("placeholder") && (this.input.removeClass("placeholder"), this.input[0].value = "", this.isPassword)) {
				try {
					this.input[0].setAttribute("type", "password")
				} catch(a) {}
				this.input.show();
				this.input[0].focus()
			}
		},
		valueIsPlaceholder: function() {
			return this.input[0].value == this.input.attr("placeholder")
		},
		handlePassword: function() {
			var a = this.input;
			a.attr("realType", "password");
			this.isPassword = !0;
			if (b.browser.msie && a[0].outerHTML) {
				var c = b(a[0].outerHTML.replace(/type=(['"])?password\1/gi, "type=$1text$1"));
				this.fakePassword = c.val(a.attr("placeholder")).addClass("placeholder").focus(function() {
					a.trigger("focus");
					b(this).hide()
				});
				b(a[0].form).submit(function() {
					c.remove();
					a.show()
				})
			}
		}
	};
	var e = !!("placeholder" in document.createElement("input"));
	b.fn.placeholder = function() {
		return e ? this: this.each(function() {
			var a = b(this),
			c = new d(a);
			c.show(!0);
			a.focus(function() {
				c.hide()
			});
			a.blur(function() {
				c.show(!1)
			});
			b.browser.msie && (b(window).load(function() {
				a.val() && a.removeClass("placeholder");
				c.show(!0)
			}), a.focus(function() {
				if (this.value == "") {
					var a = this.createTextRange();
					a.collapse(!0);
					a.moveStart("character", 0);
					a.select()
				}
			}))
		})
	}
})(jQuery);
(function($) {
	$.support.touch = 'ontouchend' in document;
	if (!$.support.touch) {
		return;
	}
	var mouseProto = $.ui.mouse.prototype,
	_mouseInit = mouseProto._mouseInit,
	touchHandled;
	function simulateMouseEvent(event, simulatedType) {
		if (event.originalEvent.touches.length > 1) {
			return;
		}
		event.preventDefault();
		var touch = event.originalEvent.changedTouches[0],
		simulatedEvent = document.createEvent('MouseEvents');
		simulatedEvent.initMouseEvent(simulatedType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		event.target.dispatchEvent(simulatedEvent);
	}
	mouseProto._touchStart = function(event) {
		var self = this;
		if (touchHandled) {
			return;
		}
		touchHandled = true;
		self._touchMoved = false;
		simulateMouseEvent(event, 'mouseover');
		simulateMouseEvent(event, 'mousemove');
		simulateMouseEvent(event, 'mousedown');
	};
	mouseProto._touchMove = function(event) {
		if (!touchHandled) {
			return;
		}
		this._touchMoved = true;
		simulateMouseEvent(event, 'mousemove');
	};
	mouseProto._touchEnd = function(event) {
		if (!touchHandled) {
			return;
		}
		simulateMouseEvent(event, 'mouseup');
		simulateMouseEvent(event, 'mouseout');
		if (!this._touchMoved) {
			simulateMouseEvent(event, 'click');
		}
		touchHandled = false;
	};
	mouseProto._mouseInit = function() {
		var self = this;
		self.element.bind('touchstart', $.proxy(self, '_touchStart')).bind('touchmove', $.proxy(self, '_touchMove')).bind('touchend', $.proxy(self, '_touchEnd'));
		_mouseInit.call(self);
	};
})(jQuery);
(function() {
	var warpedTexts = [],
	userAgent = navigator.userAgent.toLowerCase(),
	prefix = cssPref = "",
	hasTransform,
	WarpMachine;
	if (/webkit/gi.test(userAgent)) {
		prefix = "-webkit-";
		cssPref = "Webkit";
	} else if (/msie/gi.test(userAgent)) {
		prefix = "-ms-";
		cssPref = "ms";
	} else if (/mozilla/gi.test(userAgent)) {
		prefix = "-moz-";
		cssPref = "Moz";
	} else if (/opera/gi.test(userAgent)) {
		prefix = "-o-";
		cssPref = "O";
	} else {
		prefix = cssPref = "";
	}
	hasTransform = true;
	function setStyle(target, attr, prop) {
		target.style[attr] = prop;
	}
	function getStyle(target, prop) {
		try {
			var style = document.defaultView.getComputedStyle(target, "");
			return style.getPropertyValue(prop);
		} catch(e) {
			switch (prop) {
			case 'text-shadow':
				return 'none';
				break;
			case 'letter-spacing':
				return 'normal';
				break;
			case 'lineHeight':
				return null;
				break;
			}
		}
	}
	cssWarp = function() {
		if (!hasTransform) {
			return
		};
		for (var i = 0, l = arguments.length; i < l; i++) {
			warpedTexts[i] = new WarpMachine(arguments[i]);
		}
	}
	WarpMachine = function(confObj) {
		this.config = {};
		this.setUp(confObj);
	}
	WarpMachine.prototype.setUp = function(conf) {
		var THIS = this,
		shadowVal, warpCSS = function(letters, transform) {
			return "display: block;" + "visibility: visible;" + "width:" + letters.width + "px;" + "height: " + letters.height + "px;" + prefix + "transform-origin: 50% " + letters.base + "px; " + prefix + "transform: " + transform + ";"
		},
		type,
		customCSS;
		(function init() {
			THIS.config.indent = "0px";
			THIS.config.kerning = "0px";
			THIS.config.rotationMode = "rotate";
			THIS.config.fixshadow = true;
			for (var prop in conf) {
				THIS.config[prop] = conf[prop];
			}
			THIS.config.targets = (function() {
				var targets = conf.targets.replace(/\s*/g, "").split(","),
				nodes = [],
				obj,
				id,
				className,
				name;
				for (var i = 0, l = targets.length; i < l; i++) {
					name = targets[i];
					if (/^#/.test(name)) {
						obj = document.getElementById(name.substring(1));
						if (obj !== null) {
							nodes.push(obj);
						};
					} else if (/^\./.test(name)) {
						obj = document.getElementsByClassName(name.substring(1));
						if (obj.length > 0) {
							nodes = nodes.concat(pushNodes(obj));
						};
					} else {
						obj = document.getElementsByTagName(name);
						if (obj.length > 0) {
							nodes = nodes.concat(pushNodes(obj));
						};
					}
				}
				function pushNodes(list) {
					var nodeArray = [];
					for (var i = 0, l = list.length; i < l; i++) {
						nodeArray.push(list[i]);
					}
					return nodeArray;
				}
				return nodes;
			})();
			if (typeof THIS.config.path === "object" && THIS.config.path instanceof Array) {
				type = "bezier";
			} else if (typeof THIS.config.path === "object") {
				type = "circle";
			} else {
				throw new Error('ERROR: no valid path found in config Object');
				return;
			}
			for (var i = 0, l = THIS.config.targets.length; i < l; i++) {
				if (THIS.config.css) {
					customCSS = THIS.config.targets[i].style.cssText + ";" + THIS.config.css;
					THIS.config.targets[i].style.cssText = customCSS;
				}
				if (! (THIS.config.fixshadow === false)) {
					THIS.config.shadows = [];
					shadowVal = getStyle(THIS.config.targets[i], "text-shadow");
					if (shadowVal !== "" && shadowVal !== "none" && shadowVal !== "#000000") {
						if ($.browser.msie) {
							var cols = shadowVal.match(/#\w{6}/gi);
						} else {
							var cols = shadowVal.match(/r.*?\)/gi);
						}
						shadowVal = shadowVal.replace(/r.*?\)/gi, "").split(",");
						shadowVal.forEach(function(value, index) {
							var x, y, blur, radius;
							shadowVal[index] = value.replace(/^\s*/, "").split(/px\s+/g);
							x = parseFloat(shadowVal[index][0]);
							y = parseFloat(shadowVal[index][1]);
							blur = parseFloat(shadowVal[index][2]);
							radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
							angle = Math.atan2(y, x);
							THIS.config.shadows[index] = {
								col: cols[index],
								blur: blur,
								x: x,
								y: y,
								radius: radius,
								angle: angle
							};
						});
					};
				}
				switch (type) {
				case "bezier":
					attach2Bezier(THIS.config.targets[i]);
					break;
				case "circle":
					attach2Circle(THIS.config.targets[i]);
					break;
				default:
					break;
				}
				if (THIS.config.callback) {
					THIS.config.callback();
				}
				if (THIS.config.showPath) {
					drawPath(THIS.config.targets[i], i);
				}
			}
		})();
		function attach2Bezier(node) {
			var bez = [].concat(THIS.config.path),
			letters = getTextMetrics(node),
			letterCount = 0,
			firstLetterPos = letters.indent - letters[0].width / 2,
			letterPos = firstLetterPos,
			curveStepCount = 0,
			arcStart = 0,
			bezRes = THIS.config.bezAccuracy || 0.004;
			bez[0] = [0, 0, 0, 0].concat(bez[0]);
			if (THIS.config.revertBezier) {
				revertBez();
			};
			for (var i = 0, l = bez.length - 1; i < l; i++) {
				segment = [bez[i][4], bez[i][5], bez[i + 1][4], bez[i + 1][5], bez[i + 1][0], bez[i + 1][1], bez[i + 1][2], bez[i + 1][3]];
				for (var j = letterCount, lg = letters.length; j < lg; j++) {
					breakPoint = transform(j);
					if (breakPoint === true) {
						break;
					}
				}
			}
			return;
			function revertBez() {
				var newBez = [[0, 0, 0, 0]],
				length = bez.length;
				for (var l = length - 1, i = 0; l > i; l--) {
					newBez[length - l] = [];
					newBez[length - l - 1][4] = bez[l][4];
					newBez[length - l - 1][5] = bez[l][5];
					newBez[length - l][0] = bez[l][2];
					newBez[length - l][1] = bez[l][3];
					newBez[length - l][2] = bez[l][0];
					newBez[length - l][3] = bez[l][1];
				}
				newBez[length - l - 1][4] = bez[l][4];
				newBez[length - l - 1][5] = bez[l][5];
				bez = [].concat(newBez);
			}
			function transform(index) {
				letterPos += letters[index].width / 2;
				var arcVals = calcLetterTransform(segment),
				coords,
				angle;
				if (arcVals[2]) {
					letterPos -= arcVals[3] + letters[index].width / 2;
					return true;
				}
				coords = arcVals[0];
				angle = arcVals[1];
				applyTransforms(letters, index, coords, angle);
				letterPos += letters.kerning + letters[index].width / 2;
				letterCount++;
				return arcVals[2];
			}
			function calcLetterTransform(segment) {
				var length = arcStart,
				arcLgt = letterPos,
				sp = findPointOnCurve(segment, curveStepCount),
				increase = false,
				ep;
				for (var i = curveStepCount + bezRes; i < 1; i += bezRes) {
					ep = findPointOnCurve(segment, i);
					length += Math.sqrt(Math.pow((sp[0] - ep[0]), 2) + Math.pow((sp[1] - ep[1]), 2));
					sp = ep;
					if (length >= arcLgt) {
						curveStepCount = i;
						arcStart = arcLgt;
						break;
					}
				}
				if (i >= 1) {
					curveStepCount = arcStart = 0;
					increase = true;
				}
				angle = calcAngle(segment, i);
				return [ep, angle, increase, length];
			}
			function findPointOnCurve(segment, u) {
				var x = Math.pow(u, 3) * (segment[2] + 3 * (segment[4] - segment[6]) - segment[0]) + 3 * Math.pow(u, 2) * (segment[0] - 2 * segment[4] + segment[6]) + 3 * u * (segment[4] - segment[0]) + segment[0],
				y = Math.pow(u, 3) * (segment[3] + 3 * (segment[5] - segment[7]) - segment[1]) + 3 * Math.pow(u, 2) * (segment[1] - 2 * segment[5] + segment[7]) + 3 * u * (segment[5] - segment[1]) + segment[1];
				return [x.toFixed(4), y.toFixed(4)];
			}
			function calcAngle(curve, t) {
				var cp_1 = [curve[4], curve[5]],
				cp_2 = [curve[6], curve[7]],
				p_1 = [curve[0], curve[1]],
				p_2 = [curve[2], curve[3]],
				m_1 = interPolatePoint(cp_1, p_1, t),
				m_2 = interPolatePoint(cp_2, cp_1, t),
				m_3 = interPolatePoint(p_2, cp_2, t),
				h_3 = interPolatePoint(m_2, m_1, t),
				h_4 = interPolatePoint(m_3, m_2, t),
				angle = Math.atan((h_3[1] - h_4[1]) / (h_3[0] - h_4[0])) - (2 * Math.PI);
				if (h_4[0] < h_3[0]) {
					angle -= Math.PI;
				}
				return (angle.toFixed(4));
			}
			function interPolatePoint(p1, p2, d) {
				var dx = (p2[0] - p1[0]) * (1 - d) + p1[0],
				dy = (p2[1] - p1[1]) * (1 - d) + p1[1];
				return [dx, dy];
			}
		}
		function attach2Circle(node) {
			var circle = THIS.config.path,
			letters = getTextMetrics(node),
			arcLength = 0,
			angleIncr = 0,
			arcDir = 1,
			coords,
			angle;
			if (!circle.align) {
				circle.align = "center";
			}
			if (!circle.center) {
				circle.center = [];
				circle.center[0] = Math.floor(node.offsetWidth / 2);
				circle.center[1] = Math.floor(node.offsetHeight / 2);
			}
			if (circle.angle) {
				if (!/rad/gi.test(THIS.config.path.angle)) {
					circle.angle = parseFloat(circle.angle) * Math.PI / 180;
				} else {
					circle.angle = parseFloat(circle.angle);
				}
			} else {
				circle.angle = 0;
			}
			circle.angle -= Math.PI / 2;
			switch (circle.textPosition) {
			case "inside":
				angleIncr += Math.PI;
				arcDir = -1;
				break;
			default:
				angleIncr = 0;
				arcDir = 1;
				break;
			}
			switch (circle.align) {
			case "left":
				arcLength = (letters.indent - letters[0].width / 2) * arcDir;
				break;
			case "right":
				arcLength = (letters[letters.length - 1].width / 2 - letters.lngt) * arcDir;
				break;
			default:
				arcLength = (letters.indent - letters.lngt / 2) * arcDir;
			}
			function polarCoords(arc, letters) {
				var angle = arc / circle.radius + circle.angle,
				cos = Math.cos(angle),
				sin = Math.sin(angle),
				x = circle.radius * cos + circle.center[0],
				y = circle.radius * sin + circle.center[1];
				if (circle.radius < 0) {
					x = (circle.radius - letters.base * 2 / 3) * cos + circle.center[0],
					y = (circle.radius - letters.base * 2 / 3) * sin + circle.center[1];
				}
				return [x, y, angle];
			}
			for (var i = 0, lg = letters.length; i < lg; i++) {
				arcLength += letters[i].width / 2 * arcDir;
				coords = polarCoords(arcLength, letters);
				angle = coords[2] + Math.PI / 2 + angleIncr;
				applyTransforms(letters, i, coords, angle);
				arcLength += (letters[i].width / 2 + letters.kerning) * arcDir;
			}
		}
		function applyTransforms(letters, index, coords, angle) {
			var width = letters[index].width,
			height = letters[index].height,
			top = coords[1] - letters.base,
			left = coords[0] - width / 2,
			cssTransform = "translate(" + left + "px, " + top + "px)";
			switch (THIS.config.rotationMode) {
			case "rotate":
				cssTransform += " rotate(" + angle + "rad)";
				break;
			case "skew":
				var skewX = "skewX(" + angle + "rad)",
				scale = "scaleY(" + Math.cos(angle).toFixed(4) + ")";
				cssTransform += " rotate(" + angle + "rad) " + skewX + " " + scale;
				break;
			default:
				break;
			}
			letters[index].elem.style.cssText += warpCSS(letters, cssTransform);
			if ($.browser.msie && $.browser.version < 9) {
				cssSandpaper.setTransform(letters[index].elem, cssTransform);
				setStyle(letters[index].elem, 'display', 'block');
			}
			if (THIS.config.hasOwnProperty("shadows") && THIS.config.shadows.length > 0) {
				letters[index].elem.style.cssText += "text-shadow: " + fixShadow(angle);
			}
		}
		function fixShadow(angle) {
			var shadows = THIS.config.shadows,
			val = "",
			x, y, alpha;
			for (var i = 0, l = shadows.length; i < l; i++) {
				alpha = shadows[i].angle - angle;
				x = Math.cos(alpha) * shadows[i].radius;
				y = Math.sin(alpha) * shadows[i].radius;
				val += x + "px " + y + "px " + shadows[i].blur + "px " + shadows[i].col;
				if (i < l - 1) {
					val += ", "
				};
			}
			return val;
		}
		function getTextMetrics(node) {
			var text = node.innerText || node.textContent,
			letters = [],
			letterCSS = "overflow: visible; white-space:pre;",
			baseCSS = "position: absolute; display: block; visibility: hidden;" + "margin: 0px; border: 0px; padding: 0px;",
			kerning = getStyle(node, "letter-spacing"),
			letter;
			letters.lngt = 0;
			node.innerHTML = "";
			for (var i = 0, l = text.length; i < l; i++) {
				letters[i] = {};
				letter = document.createTextNode(text.charAt(i));
				letters[i].elem = document.createElement("span");
				letters[i].elem.setAttribute("style", baseCSS + letterCSS);
				letters[i].elem.appendChild(letter);
				node.appendChild(letters[i].elem);
				letters[i].width = letters[i].elem.offsetWidth;
				letters[i].height = letters[i].elem.offsetHeight;
				setStyle(letters[i].elem, "display", "none");
				letters.lngt += letters[i].width;
			}
			letters.kerning = kerning !== "normal" ? parseInt(kerning) : 0;
			letters.indent = calcWidth("indent");
			letters.base = calcBaseline();
			letters.lngt += i * letters.kerning;
			return letters;
			function calcBaseline() {
				var testDiv = document.createElement("div"),
				img = document.createElement("img"),
				lineHeight = getStyle(node, "lineHeight"),
				base;
				img.width = 1;
				img.height = 1;
				img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
				img.style.verticalAlign = "baseline";
				img.style.display = "inline";
				testDiv.style.cssText = baseCSS + 'height:' + letters[0].height + ';line-height:' + lineHeight + 'px;';
				testDiv.innerHTML = "M";
				testDiv.appendChild(img);
				node.appendChild(testDiv);
				base = img.offsetTop;
				node.removeChild(testDiv);
				return base;
			}
			function calcWidth(attr) {
				var val = THIS.config[attr].replace(/\s*/gi, ""),
				testDiv,
				w,
				unit = /em|ex|gd|rem|vw|vh|vm|mm|cm|in|pt|ch|pc|%/gi;
				if (unit.test(val)) {
					testDiv = document.createElement("div");
					node.appendChild(testDiv);
					testDiv.setAttribute("style", baseCSS);
					setStyle(testDiv, "width", val);
					w = testDiv.offsetWidth;
					node.removeChild(testDiv);
					return w;
				} else if (/px/gi.test(val)) {
					return parseInt(val);
				} else {
					return 0;
				}
			}
		}
		function drawPath(target, id) {
			var canvas, ctx, currentBG, w, h, btmCache, strokeWidth = THIS.config.showPath.thickness || 1,
			strokeColor = THIS.config.showPath.color || "black",
			style = target.style.cssText;
			currentBG = getStyle(target, "background-image");
			if (/width/gi.test(style) && /height/gi.test(style)) {
				w = target.offsetWidth;
				h = target.offsetHeight;
				setStyle(target, "backgroundImage", "url(" + createBitmap(w, h) + "), " + currentBG);
			} else {
				if (btmCache === undefined) {
					THIS.config.btmCache = createBitmap(target.offsetWidth, target.offsetHeight);
				}
				setStyle(target, "backgroundImage", "url(" + THIS.config.btmCache + "), " + currentBG);
				return;
			}
			function createBitmap(width, height) {
				canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				if (canvas.getContext) {
					ctx = canvas.getContext('2d');
					ctx.strokeStyle = strokeColor;
					ctx.lineWidth = strokeWidth;
					switch (type) {
					case "bezier":
						drawBezier(ctx, THIS.config.path);
						break;
					default:
						drawCircle(ctx, THIS.config.path);
					}
					return canvas.toDataURL();
				}
				function drawBezier(ctx, path) {
					ctx.beginPath();
					ctx.moveTo(path[0][0], path[0][1]);
					for (var i = 1, l = path.length; i < l; i++) {
						ctx.bezierCurveTo(path[i][0], path[i][1], path[i][2], path[i][3], path[i][4], path[i][5]);
					}
					ctx.stroke();
				}
				function drawCircle(ctx, path) {
					ctx.beginPath();
					ctx.arc(path.center[0], path.center[1], path.radius, 0, Math.PI * 2, true);
					ctx.stroke();
				}
			}
		}
	}
	window.cssWarp = cssWarp;
})();
(function(global) {
	var Neon = {};
	Neon.Interface = function Interface(nameOrNameSpace, name) {
		var nameSpace, interfaceName, factory;
		nameSpace = (nameOrNameSpace && name) ? nameOrNameSpace: this;
		interfaceName = (nameOrNameSpace && name) ? name: (nameOrNameSpace) ? nameOrNameSpace: 'interface' + Math.random().toString();
		factory = function(definition) {
			definition.isInterface = true;
			definition.name = interfaceName;
			nameSpace[interfaceName] = definition;
			return nameSpace[interfaceName];
		};
		return factory;
	};
	Neon.Module = function Module(nameOrNameSpace, name) {
		var nameSpace, moduleName, factory;
		nameSpace = (nameOrNameSpace && name) ? nameOrNameSpace: this;
		moduleName = (nameOrNameSpace && name) ? name: (nameOrNameSpace) ? nameOrNameSpace: 'module' + Math.random().toString();
		factory = function(definition) {
			definition.isModule = true;
			nameSpace[moduleName] = definition;
			return nameSpace[moduleName];
		};
		return factory;
	};
	Neon.Class = function Class(classNameOrNameSpace, className) {
		var nameSpace, newClass, classFactory;
		nameSpace = (classNameOrNameSpace && className) ? classNameOrNameSpace: this;
		className = (classNameOrNameSpace && className) ? className: (classNameOrNameSpace) ? classNameOrNameSpace: 'class' + Math.random().toString();
		newClass = function() {
			if (this.init) {
				this.init.apply(this, arguments);
			}
		};
		newClass.__descendants = [];
		newClass.__implementedInterfaces = [];
		newClass.__includedModules = [];
		newClass.className = className;
		newClass.include = function(module) {
			var property;
			for (property in module) {
				if (module.hasOwnProperty(property) && property != 'prototype' && property != 'constructor' && property != 'isModule' && property != 'superClass') {
					newClass[property] = module[property];
				}
			}
			if (module.hasOwnProperty('prototype') && module.prototype) {
				for (property in module.prototype) {
					if (module.prototype.hasOwnProperty(property)) {
						newClass.prototype[property] = module.prototype[property];
					}
				}
			} else {
				module.prototype = {};
			}
			newClass.__includedModules.push(module);
			return this;
		};
		classFactory = function(classDefinition) {
			var i, il, j, jl, property, classPrototype = classDefinition.prototype;
			if (classPrototype) {
				for (property in classPrototype) {
					if (classPrototype.hasOwnProperty(property)) {
						newClass.prototype[property] = classPrototype[property];
					}
				}
				delete classDefinition.prototype;
			}
			for (property in classDefinition) {
				if (classDefinition.hasOwnProperty(property)) {
					newClass[property] = classDefinition[property];
				}
			}
			for (i = 0, il = newClass.__implementedInterfaces.length; i < il; i++) {
				for (j = 0, jl = newClass.__implementedInterfaces[i].constructor.length; j < jl; j++) {
					if (!newClass[newClass.__implementedInterfaces[i].constructor[j]]) {
						console.log('must implement static ' + newClass.__implementedInterfaces[i].name);
						break;
					}
				}
				if (newClass.__implementedInterfaces[i].hasOwnProperty('prototype') && newClass.__implementedInterfaces[i].prototype) {
					for (j = 0, jl = newClass.__implementedInterfaces[i].prototype.length; j < jl; j++) {
						if (!newClass.prototype[newClass.__implementedInterfaces[i].prototype[j]]) {
							console.log('must implement prototype ' + newClass.__implementedInterfaces[i].name);
							break;
						}
					}
				}
			}
			nameSpace[className] = newClass;
			return newClass;
		};
		classFactory.inherits = function(superClass) {
			var i, inheritedClass;
			newClass.superClass = superClass;
			if (superClass.hasOwnProperty('__descendants')) {
				superClass.__descendants.push(newClass);
			}
			inheritedClass = function() {};
			inheritedClass.prototype = superClass.prototype;
			newClass.prototype = new inheritedClass();
			newClass.prototype.constructor = newClass;
			for (i in superClass) {
				if (superClass.hasOwnProperty(i) && i != 'prototype' && i !== 'className' && i !== 'superClass' && i != '__descendants') {
					newClass[i] = superClass[i];
				}
			}
			delete this.inherits;
			return this;
		};
		classFactory.ensures = function(interfaces) {
			for (var i = 0; i < arguments.length; i++) {
				newClass.__implementedInterfaces.push(arguments[i]);
			}
			delete this.ensures;
			return classFactory;
		};
		classFactory.includes = function() {
			for (var i = 0; i < arguments.length; i++) {
				newClass.include(arguments[i]);
			}
			return classFactory;
		};
		return classFactory;
	};
	if (typeof define === 'function') {
		define(function() {
			return Neon;
		});
	} else {
		if (typeof process !== 'undefined') {
			global.Neon = Neon;
		} else {
			global.Class = Neon.Class;
			global.Module = Neon.Module;
			global.Interface = Neon.Interface;
		}
	}
} (typeof window !== 'undefined' ? window: (typeof exports !== 'undefined' ? exports: null)));
jQuery(function() {
	$.browser.versionNum = parseFloat($.browser.version);
	var version = parseInt($.browser.versionNum);
	if ($.browser.msie) {
		$.browser.ie = {
			eq10: version === 10,
			eq9: version === 9,
			eq8: version === 8,
			eq7: version === 7,
			lt9: $.browser.versionNum < 9,
			lt8: $.browser.versionNum < 8,
			lt7: $.browser.versionNum < 7,
			lt10: $.browser.versionNum < 10,
			gt6: $.browser.versionNum > 6,
			gt7: $.browser.versionNum > 7,
			gt8: $.browser.versionNum > 8,
			gt9: $.browser.versionNum > 9
		};
	} else {
		$.browser.ie = {};
	}
});
(function($, window, document, undefined) {
	var $window = $(window);
	$.fn.lazyload = function(options) {
		var elements = this;
		var $container;
		var lastTimeStamp;
		var isCancel;
		var direct;
		var index = 0;
		var settings = {
			threshold: 0,
			failure_limit: 0,
			event: "scroll",
			effect: "show",
			container: window,
			data_attribute: "original",
			skip_invisible: true,
			appear: null,
			load: null,
			error: null
		};
		function update() {
			var counter = 0;
			elements.each(function() {
				var $this = $(this);
				if (settings.skip_invisible && !$this.is(":visible")) {
					return;
				}
				if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {} else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
					$this.trigger("appear");
					counter = 0;
				} else {
					if (++counter > settings.failure_limit) {
						return false;
					}
				}
			});
		}
		function getDirect(e) {
			var direct = 0;
			e = e || window.event;
			if (e.wheelDelta) {
				if (e.wheelDelta > 0) {
					direct = 1;
				}
			} else if (e.detail) {
				if (e.detail > 0) {
					direct = 1;
				}
			}
			return direct;
		}
		function getIndex(e) {
			if ($.browser.ie.lt8) {
				return 0;
			}
			e = e || window.event;
			var target = e.currentTarget;
			if (target && target.hasChildNodes()) {
				var pane = target.lastChild;
				if (pane && pane.hasChildNodes()) {
					var slider = pane.childNodes[0];
					var top = slider.offsetTop;
					if (top) {
						return parseInt(parseInt(top) * parseInt(elements.length) / (pane.clientHeight - 20)) + 1;
					}
				}
			}
			return 0;
		}
		function updateInviewport() {
			var start = (index - 9) <= 0 ? 0 : index - 9;
			var end = (index + 9) >= elements.length ? elements.length: index + 9;
			if ($.browser.ie.lt8) {
				end = elements.length;
			}
			for (var i = start; i < end; i++) {
				var temp = elements.get(i);
				var $this = $(temp);
				if (isCancel) {
					break;
				}
				if (settings.skip_invisible && !$this.is(":visible")) {
					continue;
				}
				if ($.inviewport(temp, settings)) {
					if (!temp.loaded) {
						$this.trigger("appear");
					}
				}
			}
		}
		if (options) {
			if (undefined !== options.failurelimit) {
				options.failure_limit = options.failurelimit;
				delete options.failurelimit;
			}
			if (undefined !== options.effectspeed) {
				options.effect_speed = options.effectspeed;
				delete options.effectspeed;
			}
			$.extend(settings, options);
		}
		$container = (settings.container === undefined || settings.container === window) ? $window: $(settings.container);
		if (0 === settings.event.indexOf("scroll")) {
			var eventArray = settings.event.split(" ");
			eventArray.push("DOMMouseScroll");
			var namespace = ".lazyload";
			eventArray = $.map(eventArray,
			function(event) {
				return event + namespace;
			});
			$container.unbind(namespace);
			$container.bind(eventArray.join(" "),
			function(event) {
				lastTimeStamp = event.timeStamp
			         setTimeout(function() {
					isCancel = !(lastTimeStamp === event.timeStamp) 
					if (!isCancel) {
						index = getIndex(event);
						updateInviewport();
					}
				},
				300)
			});
		}
		this.each(function() {
			var self = this;
			var $self = $(self);
			self.loaded = false;
			$self.one("appear.lazyload",
			function() {
				if (!this.loaded) {
					if (settings.appear) {
						var elements_left = elements.length;
						settings.appear.call(self, elements_left, settings);
					}
					this.backImage = $("<img />").bind("load",
					function() {
						$self.hide().attr("src", $self.data(settings.data_attribute))[settings.effect](settings.effect_speed);
						self.loaded = true;
						if (settings.load) {
							var elements_left = elements.length;
							settings.load.call(self, elements_left, settings);
						}
					}).attr("src", $self.data(settings.data_attribute)).error(function(event) {
						settings.error && settings.error.call($self, event);
					});
				}
			});
		});
		return this;
	};
	$.belowthefold = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.height() + $window.scrollTop();
		} else {
			fold = $(settings.container).offset().top + $(settings.container).height();
		}
		return fold <= $(element).offset().top - settings.threshold;
	};
	$.rightoffold = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.width() + $window.scrollLeft();
		} else {
			fold = $(settings.container).offset().left + $(settings.container).width();
		}
		return fold <= $(element).offset().left - settings.threshold;
	};
	$.abovethetop = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.scrollTop();
		} else {
			fold = $(settings.container).offset().top;
		}
		return fold >= $(element).offset().top + settings.threshold + $(element).height();
	};
	$.leftofbegin = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.scrollLeft();
		} else {
			fold = $(settings.container).offset().left;
		}
		return fold >= $(element).offset().left + settings.threshold + $(element).width();
	};
	$.inviewport = function(element, settings) {
		return ! $.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
	};
	$.extend($.expr[':'], {
		"below-the-fold": function(a) {
			return $.belowthefold(a, {
				threshold: 0
			});
		},
		"above-the-top": function(a) {
			return ! $.belowthefold(a, {
				threshold: 0
			});
		},
		"right-of-screen": function(a) {
			return $.rightoffold(a, {
				threshold: 0
			});
		},
		"left-of-screen": function(a) {
			return ! $.rightoffold(a, {
				threshold: 0
			});
		},
		"in-viewport": function(a) {
			return $.inviewport(a, {
				threshold: 0
			});
		},
		"above-the-fold": function(a) {
			return ! $.belowthefold(a, {
				threshold: 0
			});
		},
		"right-of-fold": function(a) {
			return $.rightoffold(a, {
				threshold: 0
			});
		},
		"left-of-fold": function(a) {
			return ! $.rightoffold(a, {
				threshold: 0
			});
		}
	});
})(jQuery, window, document);
(function($, undefined) {
	function num(v) {
		return parseInt(v, 10) || 0;
	}
	function isNumber(value) {
		return ! isNaN(parseInt(value, 10));
	}
	$.widget("ui.resizable", $.ui.mouse, {
		version: "1.10.2",
		widgetEventPrefix: "resize",
		options: {
			alsoResize: false,
			animate: false,
			animateDuration: "slow",
			animateEasing: "swing",
			aspectRatio: false,
			autoHide: false,
			containment: false,
			ghost: false,
			grid: false,
			handles: "e,s,se",
			helper: false,
			maxHeight: null,
			maxWidth: null,
			minHeight: 10,
			minWidth: 10,
			zIndex: 90,
			resize: null,
			start: null,
			stop: null
		},
		_create: function() {
			var n, i, handle, axis, hname, that = this,
			o = this.options;
			this.element.addClass("ui-resizable");
			$.extend(this, {
				_aspectRatio: !!(o.aspectRatio),
				aspectRatio: o.aspectRatio,
				originalElement: this.element,
				_proportionallyResizeElements: [],
				_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper": null
			});
			if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
				this.element.wrap($("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				}));
				this.element = this.element.parent().data("ui-resizable", this.element.data("ui-resizable"));
				this.elementIsWrapper = true;
				this.element.css({
					marginLeft: this.originalElement.css("marginLeft"),
					marginTop: this.originalElement.css("marginTop"),
					marginRight: this.originalElement.css("marginRight"),
					marginBottom: this.originalElement.css("marginBottom")
				});
				this.originalElement.css({
					marginLeft: 0,
					marginTop: 0,
					marginRight: 0,
					marginBottom: 0
				});
				this.originalResizeStyle = this.originalElement.css("resize");
				this.originalElement.css("resize", "none");
				this._proportionallyResizeElements.push(this.originalElement.css({
					position: "static",
					zoom: 1,
					display: "block"
				}));
				this.originalElement.css({
					margin: this.originalElement.css("margin")
				});
				this._proportionallyResize();
			}
			this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se": {
				n: ".ui-resizable-n",
				e: ".ui-resizable-e",
				s: ".ui-resizable-s",
				w: ".ui-resizable-w",
				se: ".ui-resizable-se",
				sw: ".ui-resizable-sw",
				ne: ".ui-resizable-ne",
				nw: ".ui-resizable-nw"
			});
			if (this.handles.constructor === String) {
				if (this.handles === "all") {
					this.handles = "n,e,s,w,se,sw,ne,nw";
				}
				n = this.handles.split(",");
				this.handles = {};
				for (i = 0; i < n.length; i++) {
					handle = $.trim(n[i]);
					hname = "ui-resizable-" + handle;
					axis = $("<div class='ui-resizable-handle " + hname + "'></div>");
					axis.css({
						zIndex: o.zIndex
					});
					if ("se" === handle) {
						axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
					}
					this.handles[handle] = ".ui-resizable-" + handle;
					this.element.append(axis);
				}
			}
			this._renderAxis = function(target) {
				var i, axis, padPos, padWrapper;
				target = target || this.element;
				for (i in this.handles) {
					if (this.handles[i].constructor === String) {
						this.handles[i] = $(this.handles[i], this.element).show();
					}
					if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
						axis = $(this.handles[i], this.element);
						padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();
						padPos = ["padding", /ne|nw|n/.test(i) ? "Top": /se|sw|s/.test(i) ? "Bottom": /^e$/.test(i) ? "Right": "Left"].join("");
						target.css(padPos, padWrapper);
						this._proportionallyResize();
					}
					if (!$(this.handles[i]).length) {
						continue;
					}
				}
			};
			this._renderAxis(this.element);
			this._handles = $(".ui-resizable-handle", this.element).disableSelection();
			this._handles.mouseover(function() {
				if (!that.resizing) {
					if (this.className) {
						axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
					}
					that.axis = axis && axis[1] ? axis[1] : "se";
				}
			});
			if (o.autoHide) {
				this._handles.hide();
				$(this.element).addClass("ui-resizable-autohide").mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				}).mouseleave(function() {
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
			}
			this._mouseInit();
		},
		_destroy: function() {
			this._mouseDestroy();
			var wrapper, _destroy = function(exp) {
				$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
			};
			if (this.elementIsWrapper) {
				_destroy(this.element);
				wrapper = this.element;
				this.originalElement.css({
					position: wrapper.css("position"),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css("top"),
					left: wrapper.css("left")
				}).insertAfter(wrapper);
				wrapper.remove();
			}
			this.originalElement.css("resize", this.originalResizeStyle);
			_destroy(this.originalElement);
			return this;
		},
		_mouseCapture: function(event) {
			var i, handle, capture = false;
			for (i in this.handles) {
				handle = $(this.handles[i])[0];
				if (handle === event.target || $.contains(handle, event.target)) {
					capture = true;
				}
			}
			return ! this.options.disabled && capture;
		},
		_mouseStart: function(event) {
			var curleft, curtop, cursor, o = this.options,
			iniPos = this.element.position(),
			el = this.element;
			this.resizing = true;
			if ((/absolute/).test(el.css("position"))) {
				el.css({
					position: "absolute",
					top: el.css("top"),
					left: el.css("left")
				});
			} else if (el.is(".ui-draggable")) {
				el.css({
					position: "absolute",
					top: iniPos.top,
					left: iniPos.left
				});
			}
			this._renderProxy();
			curleft = num(this.helper.css("left"));
			curtop = num(this.helper.css("top"));
			if (o.containment) {
				curleft += $(o.containment).scrollLeft() || 0;
				curtop += $(o.containment).scrollTop() || 0;
			}
			this.offset = this.helper.offset();
			this.position = {
				left: curleft,
				top: curtop
			};
			this.size = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			}: {
				width: el.width(),
				height: el.height()
			};
			this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			}: {
				width: el.width(),
				height: el.height()
			};
			this.originalPosition = {
				left: curleft,
				top: curtop
			};
			this.sizeDiff = {
				width: el.outerWidth() - el.width(),
				height: el.outerHeight() - el.height()
			};
			this.originalMousePosition = {
				left: event.pageX,
				top: event.pageY
			};
			this.aspectRatio = (typeof o.aspectRatio === "number") ? o.aspectRatio: ((this.originalSize.width / this.originalSize.height) || 1);
			cursor = $(".ui-resizable-" + this.axis).css("cursor");
			$("body").css("cursor", cursor === "auto" ? this.axis + "-resize": cursor);
			el.addClass("ui-resizable-resizing");
			this._propagate("start", event);
			return true;
		},
		_mouseDrag: function(event) {
			var data, el = this.helper,
			props = {},
			smp = this.originalMousePosition,
			a = this.axis,
			prevTop = this.position.top,
			prevLeft = this.position.left,
			prevWidth = this.size.width,
			prevHeight = this.size.height,
			dx = (event.pageX - smp.left) || 0,
			dy = (event.pageY - smp.top) || 0,
			trigger = this._change[a];
			if (!trigger) {
				return false;
			}
			data = trigger.apply(this, [event, dx, dy]);
			this._updateVirtualBoundaries(!event.shiftKey);
			if (this._aspectRatio && !event.shiftKey) {
				data = this._updateRatio(data, event);
			}
			data = this._respectSize(data, event);
			this._updateCache(data);
			this._propagate("resize", event);
			if (this.position.top !== prevTop) {
				props.top = this.position.top + "px";
			}
			if (this.position.left !== prevLeft) {
				props.left = this.position.left + "px";
			}
			if (this.size.width !== prevWidth) {
				props.width = this.size.width + "px";
			}
			if (this.size.height !== prevHeight) {
				props.height = this.size.height + "px";
			}
			el.css(props);
			if (!this._helper && this._proportionallyResizeElements.length) {
				this._proportionallyResize();
			}
			if (!$.isEmptyObject(props)) {
				this._trigger("resize", event, this.ui());
			}
			return false;
		},
		_mouseStop: function(event) {
			this.resizing = false;
			var pr, ista, soffseth, soffsetw, s, left, top, o = this.options,
			that = this;
			if (this._helper) {
				pr = this._proportionallyResizeElements;
				ista = pr.length && (/textarea/i).test(pr[0].nodeName);
				soffseth = ista && $.ui.hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
				soffsetw = ista ? 0 : that.sizeDiff.width;
				s = {
					width: (that.helper.width() - soffsetw),
					height: (that.helper.height() - soffseth)
				};
				left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null;
				top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;
				if (!o.animate) {
					this.element.css($.extend(s, {
						top: top,
						left: left
					}));
				}
				that.helper.height(that.size.height);
				that.helper.width(that.size.width);
				if (this._helper && !o.animate) {
					this._proportionallyResize();
				}
			}
			$("body").css("cursor", "auto");
			this.element.removeClass("ui-resizable-resizing");
			this._propagate("stop", event);
			if (this._helper) {
				this.helper.remove();
			}
			return false;
		},
		_updateVirtualBoundaries: function(forceAspectRatio) {
			var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b, o = this.options;
			b = {
				minWidth: isNumber(o.minWidth) ? o.minWidth: 0,
				maxWidth: isNumber(o.maxWidth) ? o.maxWidth: Infinity,
				minHeight: isNumber(o.minHeight) ? o.minHeight: 0,
				maxHeight: isNumber(o.maxHeight) ? o.maxHeight: Infinity
			};
			if (this._aspectRatio || forceAspectRatio) {
				pMinWidth = b.minHeight * this.aspectRatio;
				pMinHeight = b.minWidth / this.aspectRatio;
				pMaxWidth = b.maxHeight * this.aspectRatio;
				pMaxHeight = b.maxWidth / this.aspectRatio;
				if (pMinWidth > b.minWidth) {
					b.minWidth = pMinWidth;
				}
				if (pMinHeight > b.minHeight) {
					b.minHeight = pMinHeight;
				}
				if (pMaxWidth < b.maxWidth) {
					b.maxWidth = pMaxWidth;
				}
				if (pMaxHeight < b.maxHeight) {
					b.maxHeight = pMaxHeight;
				}
			}
			this._vBoundaries = b;
		},
		_updateCache: function(data) {
			this.offset = this.helper.offset();
			if (isNumber(data.left)) {
				this.position.left = data.left;
			}
			if (isNumber(data.top)) {
				this.position.top = data.top;
			}
			if (isNumber(data.height)) {
				this.size.height = data.height;
			}
			if (isNumber(data.width)) {
				this.size.width = data.width;
			}
		},
		_updateRatio: function(data) {
			var cpos = this.position,
			csize = this.size,
			a = this.axis;
			if (isNumber(data.height)) {
				data.width = (data.height * this.aspectRatio);
			} else if (isNumber(data.width)) {
				data.height = (data.width / this.aspectRatio);
			}
			if (a === "sw") {
				data.left = cpos.left + (csize.width - data.width);
				data.top = null;
			}
			if (a === "nw") {
				data.top = cpos.top + (csize.height - data.height);
				data.left = cpos.left + (csize.width - data.width);
			}
			return data;
		},
		_respectSize: function(data) {
			var o = this._vBoundaries,
			a = this.axis,
			ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width),
			ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width),
			isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a),
			ch = /nw|ne|n/.test(a);
			if (isminw) {
				data.width = o.minWidth;
			}
			if (isminh) {
				data.height = o.minHeight;
			}
			if (ismaxw) {
				data.width = o.maxWidth;
			}
			if (ismaxh) {
				data.height = o.maxHeight;
			}
			if (isminw && cw) {
				data.left = dw - o.minWidth;
			}
			if (ismaxw && cw) {
				data.left = dw - o.maxWidth;
			}
			if (isminh && ch) {
				data.top = dh - o.minHeight;
			}
			if (ismaxh && ch) {
				data.top = dh - o.maxHeight;
			}
			if (!data.width && !data.height && !data.left && data.top) {
				data.top = null;
			} else if (!data.width && !data.height && !data.top && data.left) {
				data.left = null;
			}
			return data;
		},
		_proportionallyResize: function() {
			if (!this._proportionallyResizeElements.length) {
				return;
			}
			var i, j, borders, paddings, prel, element = this.helper || this.element;
			for (i = 0; i < this._proportionallyResizeElements.length; i++) {
				prel = this._proportionallyResizeElements[i];
				if (!this.borderDif) {
					this.borderDif = [];
					borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
					paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];
					for (j = 0; j < borders.length; j++) {
						this.borderDif[j] = (parseInt(borders[j], 10) || 0) + (parseInt(paddings[j], 10) || 0);
					}
				}
				prel.css({
					height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
					width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
				});
			}
		},
		_renderProxy: function() {
			var el = this.element,
			o = this.options;
			this.elementOffset = el.offset();
			if (this._helper) {
				this.helper = this.helper || $("<div style='overflow:hidden;'></div>");
				this.helper.addClass(this._helper).css({
					width: this.element.outerWidth() - 1,
					height: this.element.outerHeight() - 1,
					position: "absolute",
					left: this.elementOffset.left + "px",
					top: this.elementOffset.top + "px",
					zIndex: ++o.zIndex
				});
				this.helper.appendTo("body").disableSelection();
			} else {
				this.helper = this.element;
			}
		},
		_change: {
			e: function(event, dx) {
				return {
					width: this.originalSize.width + dx
				};
			},
			w: function(event, dx) {
				var cs = this.originalSize,
				sp = this.originalPosition;
				return {
					left: sp.left + dx,
					width: cs.width - dx
				};
			},
			n: function(event, dx, dy) {
				var cs = this.originalSize,
				sp = this.originalPosition;
				return {
					top: sp.top + dy,
					height: cs.height - dy
				};
			},
			s: function(event, dx, dy) {
				return {
					height: this.originalSize.height + dy
				};
			},
			se: function(event, dx, dy) {
				return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
			},
			sw: function(event, dx, dy) {
				return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
			},
			ne: function(event, dx, dy) {
				return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
			},
			nw: function(event, dx, dy) {
				return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
			}
		},
		_propagate: function(n, event) {
			$.ui.plugin.call(this, n, [event, this.ui()]);
			(n !== "resize" && this._trigger(n, event, this.ui()));
		},
		plugins: {},
		ui: function() {
			return {
				originalElement: this.originalElement,
				element: this.element,
				helper: this.helper,
				position: this.position,
				size: this.size,
				originalSize: this.originalSize,
				originalPosition: this.originalPosition
			};
		}
	});
	$.ui.plugin.add("resizable", "animate", {
		stop: function(event) {
			var that = $(this).data("ui-resizable"),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/textarea/i).test(pr[0].nodeName),
			soffseth = ista && $.ui.hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = {
				width: (that.size.width - soffsetw),
				height: (that.size.height - soffseth)
			},
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null,
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;
			that.element.animate($.extend(style, top && left ? {
				top: top,
				left: left
			}: {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {
					var data = {
						width: parseInt(that.element.css("width"), 10),
						height: parseInt(that.element.css("height"), 10),
						top: parseInt(that.element.css("top"), 10),
						left: parseInt(that.element.css("left"), 10)
					};
					if (pr && pr.length) {
						$(pr[0]).css({
							width: data.width,
							height: data.height
						});
					}
					that._updateCache(data);
					that._propagate("resize", event);
				}
			});
		}
	});
	$.ui.plugin.add("resizable", "containment", {
		start: function() {
			var element, p, co, ch, cw, width, height, that = $(this).data("ui-resizable"),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
			if (!ce) {
				return;
			}
			that.containerElement = $(ce);
			if (/document/.test(oc) || oc === document) {
				that.containerOffset = {
					left: 0,
					top: 0
				};
				that.containerPosition = {
					left: 0,
					top: 0
				};
				that.parentData = {
					element: $(document),
					left: 0,
					top: 0,
					width: $(document).width(),
					height: $(document).height() || document.body.parentNode.scrollHeight
				};
			} else {
				element = $(ce);
				p = [];
				$(["Top", "Right", "Left", "Bottom"]).each(function(i, name) {
					p[i] = num(element.css("padding" + name));
				});
				that.containerOffset = element.offset();
				that.containerPosition = element.position();
				that.containerSize = {
					height: (element.innerHeight() - p[3]),
					width: (element.innerWidth() - p[1])
				};
				co = that.containerOffset;
				ch = that.containerSize.height;
				cw = that.containerSize.width;
				width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth: cw);
				height = ($.ui.hasScroll(ce) ? ce.scrollHeight: ch);
				that.parentData = {
					element: ce,
					left: co.left,
					top: co.top,
					width: width,
					height: height
				};
			}
		},
		resize: function(event) {
			var woset, hoset, isParent, isOffsetRelative, that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset,
			cp = that.position,
			pRatio = that._aspectRatio && !event.shiftKey,
			cop = {
				top: 0,
				left: 0
			},
			ce = that.containerElement;
			if (ce[0] !== document && (/static/).test(ce.css("position"))) {
				cop = co;
			}
			if (cp.left < (that._helper ? co.left: 0)) {
				that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
				if (pRatio) {
					that.size.height = that.size.width / that.aspectRatio;
				}
				that.position.left = o.helper ? co.left: 0;
			}
			if (cp.top < (that._helper ? co.top: 0)) {
				that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
				if (pRatio) {
					that.size.width = that.size.height * that.aspectRatio;
				}
				that.position.top = that._helper ? co.top: 0;
			}
			that.offset.left = that.parentData.left + that.position.left;
			that.offset.top = that.parentData.top + that.position.top;
			woset = Math.abs((that._helper ? that.offset.left - cop.left: (that.offset.left - cop.left)) + that.sizeDiff.width);
			hoset = Math.abs((that._helper ? that.offset.top - cop.top: (that.offset.top - co.top)) + that.sizeDiff.height);
			isParent = that.containerElement.get(0) === that.element.parent().get(0);
			isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));
			if (isParent && isOffsetRelative) {
				woset -= that.parentData.left;
			}
			if (woset + that.size.width >= that.parentData.width) {
				that.size.width = that.parentData.width - woset;
				if (pRatio) {
					that.size.height = that.size.width / that.aspectRatio;
				}
			}
			if (hoset + that.size.height >= that.parentData.height) {
				that.size.height = that.parentData.height - hoset;
				if (pRatio) {
					that.size.width = that.size.height * that.aspectRatio;
				}
			}
		},
		stop: function() {
			var that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $(that.helper),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;
			if (that._helper && !o.animate && (/relative/).test(ce.css("position"))) {
				$(this).css({
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				});
			}
			if (that._helper && !o.animate && (/static/).test(ce.css("position"))) {
				$(this).css({
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				});
			}
		}
	});
	$.ui.plugin.add("resizable", "alsoResize", {
		start: function() {
			var that = $(this).data("ui-resizable"),
			o = that.options,
			_store = function(exp) {
				$(exp).each(function() {
					var el = $(this);
					el.data("ui-resizable-alsoresize", {
						width: parseInt(el.width(), 10),
						height: parseInt(el.height(), 10),
						left: parseInt(el.css("left"), 10),
						top: parseInt(el.css("top"), 10)
					});
				});
			};
			if (typeof(o.alsoResize) === "object" && !o.alsoResize.parentNode) {
				if (o.alsoResize.length) {
					o.alsoResize = o.alsoResize[0];
					_store(o.alsoResize);
				} else {
					$.each(o.alsoResize,
					function(exp) {
						_store(exp);
					});
				}
			} else {
				_store(o.alsoResize);
			}
		},
		resize: function(event, ui) {
			var that = $(this).data("ui-resizable"),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: (that.size.height - os.height) || 0,
				width: (that.size.width - os.width) || 0,
				top: (that.position.top - op.top) || 0,
				left: (that.position.left - op.left) || 0
			},
			_alsoResize = function(exp, c) {
				$(exp).each(function() {
					var el = $(this),
					start = $(this).data("ui-resizable-alsoresize"),
					style = {},
					css = c && c.length ? c: el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
					$.each(css,
					function(i, prop) {
						var sum = (start[prop] || 0) + (delta[prop] || 0);
						if (sum && sum >= 0) {
							style[prop] = sum || null;
						}
					});
					el.css(style);
				});
			};
			if (typeof(o.alsoResize) === "object" && !o.alsoResize.nodeType) {
				$.each(o.alsoResize,
				function(exp, c) {
					_alsoResize(exp, c);
				});
			} else {
				_alsoResize(o.alsoResize);
			}
		},
		stop: function() {
			$(this).removeData("resizable-alsoresize");
		}
	});
	$.ui.plugin.add("resizable", "ghost", {
		start: function() {
			var that = $(this).data("ui-resizable"),
			o = that.options,
			cs = that.size;
			that.ghost = that.originalElement.clone();
			that.ghost.css({
				opacity: 0.25,
				display: "block",
				position: "relative",
				height: cs.height,
				width: cs.width,
				margin: 0,
				left: 0,
				top: 0
			}).addClass("ui-resizable-ghost").addClass(typeof o.ghost === "string" ? o.ghost: "");
			that.ghost.appendTo(that.helper);
		},
		resize: function() {
			var that = $(this).data("ui-resizable");
			if (that.ghost) {
				that.ghost.css({
					position: "relative",
					height: that.size.height,
					width: that.size.width
				});
			}
		},
		stop: function() {
			var that = $(this).data("ui-resizable");
			if (that.ghost && that.helper) {
				that.helper.get(0).removeChild(that.ghost.get(0));
			}
		}
	});
	$.ui.plugin.add("resizable", "grid", {
		resize: function() {
			var that = $(this).data("ui-resizable"),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
			gridX = (grid[0] || 1),
			gridY = (grid[1] || 1),
			ox = Math.round((cs.width - os.width) / gridX) * gridX,
			oy = Math.round((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
			isMinWidth = o.minWidth && (o.minWidth > newWidth),
			isMinHeight = o.minHeight && (o.minHeight > newHeight);
			o.grid = grid;
			if (isMinWidth) {
				newWidth = newWidth + gridX;
			}
			if (isMinHeight) {
				newHeight = newHeight + gridY;
			}
			if (isMaxWidth) {
				newWidth = newWidth - gridX;
			}
			if (isMaxHeight) {
				newHeight = newHeight - gridY;
			}
			if (/^(se|s|e)$/.test(a)) {
				that.size.width = newWidth;
				that.size.height = newHeight;
			} else if (/^(ne)$/.test(a)) {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else if (/^(sw)$/.test(a)) {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.left = op.left - ox;
			} else {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.top = op.top - oy;
				that.position.left = op.left - ox;
			}
		}
	});
})(jQuery);
(function(a) {
	function b(a, b) {
		var c = this,
		d, e;
		return function() {
			return e = Array.prototype.slice.call(arguments, 0),
			d = clearTimeout(d, e),
			d = setTimeout(function() {
				a.apply(c, e),
				d = 0
			},
			b),
			this
		}
	}
	a.extend(a.fn, {
		debounce: function(a, c, d) {
			this.bind(a, b.apply(this, [c, d]))
		}
	})
})(jQuery);
$(function() {
	var rx = /INPUT|SELECT|TEXTAREA/i;
	$(document).bind("keydown keypress",
	function(e) {
		if (e.which == 8) {
			if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
				e.preventDefault();
			}
		}
	});
});
(function($) {
	var jqXhr = {};
	$.ajaxSingle = function(settings) {
		var options = $.extend({
			className: 'DEFEARTNAME'
		},
		$.ajaxSettings, settings);
		if (jqXhr[options.className]) {
			jqXhr[options.className].abort();
		}
		jqXhr[options.className] = $.ajax(options);
	};
})(jQuery);
(function($) {
	var fonts = [];
	fonts.push({
		'name': 'Varsity',
		'path': 'ooshirts/varsity-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ArtBrush',
		'path': 'ooshirts/artbrush-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Bauhaus93',
		'path': 'ooshirts/bauhaus93-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ChocolateBox',
		'path': 'ooshirts/chocolatebox-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Coaster',
		'path': 'ooshirts/coaster-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Freshman',
		'path': 'ooshirts/freshman-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Creampuff',
		'path': 'ooshirts/creampuff-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KoolBeans',
		'path': 'ooshirts/koolbeans-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Lane-Narrow',
		'path': 'ooshirts/lane-narrow-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ZektonFree',
		'path': 'ooshirts/zektonfree-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ArgosGeorge',
		'path': 'ooshirts/argosgeorge-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Belshaw',
		'path': 'ooshirts/belshaw-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BoisterBlack',
		'path': 'ooshirts/boisterblack-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Duvall',
		'path': 'ooshirts/duvall-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Erasmus',
		'path': 'ooshirts/erasmus-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Kells',
		'path': 'ooshirts/martel-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Viking',
		'path': 'ooshirts/viking-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Vinque',
		'path': 'ooshirts/vinque-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CollegiateHeavyOutline',
		'path': 'ooshirts/collegiateheavyoutline-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FMCollegeTeamoutline',
		'path': 'ooshirts/fmcollegeteamoutline-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FMUniversity',
		'path': 'ooshirts/fmuniversity-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Freshman',
		'path': 'ooshirts/freshman-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Jacobi',
		'path': 'ooshirts/jacobi-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'JerseyLetters',
		'path': 'ooshirts/jerseyletters-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Stencil',
		'path': 'ooshirts/stencil-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'SUPER_CHARGERS',
		'path': 'ooshirts/super_chargers-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CityContrast',
		'path': 'ooshirts/citycontrast-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Civilian',
		'path': 'ooshirts/civilian-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Decade',
		'path': 'ooshirts/decade-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Destroy',
		'path': 'ooshirts/destroy-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DESTRUCCION',
		'path': 'ooshirts/destruccion-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'EclipsedMoon',
		'path': 'ooshirts/eclipsedmoon-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Horrendous',
		'path': 'ooshirts/horrendous-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KreepyKrawly',
		'path': 'ooshirts/kreepykrawly-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ModernConformist',
		'path': 'ooshirts/modernconformist-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Rockit',
		'path': 'ooshirts/rockit-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'African',
		'path': 'ooshirts/african-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Aladdin',
		'path': 'ooshirts/aladdin-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Algerian',
		'path': 'ooshirts/algerian-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Chinyen',
		'path': 'ooshirts/chinyen-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Konfuciuz',
		'path': 'ooshirts/konfuciuz-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KoreanCalligraphy',
		'path': 'ooshirts/koreancalligraphy-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Domoaregato',
		'path': 'ooshirts/japan-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Takeout',
		'path': 'ooshirts/takeout-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Airstream',
		'path': 'ooshirts/airstream-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BrockScript',
		'path': 'ooshirts/brockscript-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BuffaloNickel',
		'path': 'ooshirts/buffalonickel-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ChopinScript',
		'path': 'ooshirts/chopinscript-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Creampuff',
		'path': 'ooshirts/creampuff-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'HarlowSolidItalic',
		'path': 'ooshirts/harlowsoliditalic-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'MarcelleScript',
		'path': 'ooshirts/marcellescript-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Magneto',
		'path': 'ooshirts/magneto-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'WrexhamScript',
		'path': 'ooshirts/wrexhamscript-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'PTBananaSplit',
		'path': 'ooshirts/ptbananasplit-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Vivaldi',
		'path': 'ooshirts/vivaldi-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Aldo',
		'path': 'ooshirts/aldo-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Battlestar',
		'path': 'ooshirts/battlestar-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Borg9',
		'path': 'ooshirts/borg9-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FinalFrontierOldStyle',
		'path': 'ooshirts/finalfrontieroldstyle-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Hybrid',
		'path': 'ooshirts/hybrid-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'QuartzBolD',
		'path': 'ooshirts/quartzbold-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Squealer',
		'path': 'ooshirts/squealer-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'StarJedi',
		'path': 'ooshirts/starjedi-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Zorque',
		'path': 'ooshirts/zorque-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BigMisterC',
		'path': 'ooshirts/bigmisterc-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BloklettersBalpen',
		'path': 'ooshirts/bloklettersbalpen-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Daniel',
		'path': 'ooshirts/daniel-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'HelenasHand',
		'path': 'ooshirts/helenashand-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KomikaTitle',
		'path': 'ooshirts/komikatitle-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Mistral',
		'path': 'ooshirts/mistral-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'PPHandwriting',
		'path': 'ooshirts/pphandwriting-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'QuigleyWiggly',
		'path': 'ooshirts/quigleywiggly-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'StreetSoul',
		'path': 'ooshirts/streetsoul-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ToBeContinued',
		'path': 'ooshirts/tobecontinued-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'whoa',
		'path': 'ooshirts/whoa-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'AlcoholLicks',
		'path': 'ooshirts/alcohollicks-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'AlmonteSnow',
		'path': 'ooshirts/almontesnow-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Baubau',
		'path': 'ooshirts/baubau-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'StandingRoomOnly',
		'path': 'ooshirts/broadway-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Circus',
		'path': 'ooshirts/circus-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FirecatContour',
		'path': 'ooshirts/firecatcontour-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'GotNoHeart',
		'path': 'ooshirts/gotnoheart-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'GreenFuz',
		'path': 'ooshirts/greenfuz-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Independence',
		'path': 'ooshirts/independence-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KrooKed',
		'path': 'ooshirts/krooked-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'PlanetBenson2',
		'path': 'ooshirts/planetbenson2-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'WhiteBold',
		'path': 'ooshirts/whitebold-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Variete',
		'path': 'ooshirts/variete-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'AnglicanText',
		'path': 'ooshirts/anglicantext-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Blackletter',
		'path': 'ooshirts/blackletter-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BlackletterShadow',
		'path': 'ooshirts/blacklettershadow-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Canterbury',
		'path': 'ooshirts/canterbury-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Cimbrian',
		'path': 'ooshirts/cimbrian-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Diploma',
		'path': 'ooshirts/diploma-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Maranallo',
		'path': 'ooshirts/maranallo-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Colchester',
		'path': 'ooshirts/oldeenglish-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'PlainGermanica',
		'path': 'ooshirts/plaingermanica-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Ruritania',
		'path': 'ooshirts/ruritania-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'projects',
		'path': 'ooshirts/projects-webfont',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Porscha911',
		'path': 'newFonts/911 Porscha',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'B791RomanItalic',
		'path': 'newFonts/B791-Roman-Italic',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'B791Roman',
		'path': 'newFonts/B791-Roman-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BadaboomBB',
		'path': 'newFonts/BadaBoom BB',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BalloonRegular',
		'path': 'newFonts/Balloon-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BarberShop',
		'path': 'newFonts/Barber shop',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BattyGirl',
		'path': 'newFonts/Batty Girl',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Bellboy',
		'path': 'newFonts/Bellboy-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BetsyFlanagan',
		'path': 'newFonts/BetsyFlanagan-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BettyNoir',
		'path': 'newFonts/Betty Noir',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Biergarten',
		'path': 'newFonts/Biergarten',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BilbaoBlack',
		'path': 'newFonts/Bilbao-Black-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'BloodCrow',
		'path': 'newFonts/Blood Crow',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CasablancaAntique',
		'path': 'newFonts/CasablancaAntique-Heavy-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CaslonBolditalic',
		'path': 'newFonts/Caslon-Medium-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CattyRegular',
		'path': 'newFonts/Catty',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ChainsawGeometric',
		'path': 'newFonts/ChainsawGeometric',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ChantillySerialXlight',
		'path': 'newFonts/ChantillySerial-Xlight-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CharringtonBold',
		'path': 'newFonts/Charrington Bold',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CharringtonRegular',
		'path': 'newFonts/Charrington',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ChopinScript',
		'path': 'newFonts/ChopinScript',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ChuckChillout',
		'path': 'newFonts/Chuck Chillout',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'CirculateBRK',
		'path': 'newFonts/Circulate BRK',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DaddyLonglegs',
		'path': 'newFonts/Daddy Longlegs NF',
		'isLoad': true,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DamnNoisyKids',
		'path': 'newFonts/Damn Noisy Kids',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DecoBlack',
		'path': 'newFonts/DecoBlack-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DeftoneStylus',
		'path': 'newFonts/DeftoneStylus-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DestructoBeam',
		'path': 'newFonts/DestructoBeam BB',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DickVanDyke',
		'path': 'newFonts/DickVanDyke',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DigitalStrip',
		'path': 'newFonts/DigitalStrip 2.0 BB',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DirtStorm',
		'path': 'newFonts/Dirtstorm-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DJFancy',
		'path': 'newFonts/DJ Fancy',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DragonOrder',
		'path': 'newFonts/Dragon Order',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DreamOrphansBold',
		'path': 'newFonts/DreamOrphans-Bold',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DreamOrphans',
		'path': 'newFonts/DreamOrphans-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Droid',
		'path': 'newFonts/Droid Lover',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'DroidLover',
		'path': 'newFonts/Droid-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'E780Blackletter',
		'path': 'newFonts/E780-Blackletter-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'EarwigFactory',
		'path': 'newFonts/EarwigFactory-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Edo',
		'path': 'newFonts/Edo',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'EmbossingTape',
		'path': 'newFonts/Embossing Tape 1 BRK',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'EngebrechtreInk',
		'path': 'newFonts/EngebrechtreInk',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Ennis',
		'path': 'newFonts/Ennis-Book',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Ericott',
		'path': 'newFonts/Ericott',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'EvilGenius',
		'path': 'newFonts/EvilGenius BB',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FatstackBB',
		'path': 'newFonts/FatStack BB',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FederalService',
		'path': 'newFonts/Federal Service Academy Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FenwickOlden',
		'path': 'newFonts/FenwickOlden-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FlagstaffRegular',
		'path': 'newFonts/Flagstaff-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FlorencesansRegular',
		'path': 'newFonts/Florencesans',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Focus',
		'path': 'newFonts/Focus-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FortySecondStreet',
		'path': 'newFonts/Forty-Second Street NF',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Fraktur',
		'path': 'newFonts/Fraktur-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FrankensSteinA',
		'path': 'newFonts/Frankens-SteinA',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FranklingothicNew',
		'path': 'newFonts/FranklinGothicNew-Heavy-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'FrauleinHex',
		'path': 'newFonts/Fraulein Hex',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'GainsboroughSoft',
		'path': 'newFonts/GainsboroughSoft',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'GalaxyMonkey',
		'path': 'newFonts/Galaxy Monkey',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'GalgaRegluar',
		'path': 'newFonts/Galga',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Ghostwriter',
		'path': 'newFonts/Ghostwriter',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'GroteskOu',
		'path': 'newFonts/GroteskOu-Medium-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'HandWritingMutlu',
		'path': 'newFonts/Hand writing Mutlu',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'HarlemNights',
		'path': 'newFonts/HarlemNights-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Harrogate',
		'path': 'newFonts/Harrogate-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'HawkmoonRegular',
		'path': 'newFonts/Hawkmoon Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Hegel',
		'path': 'newFonts/Hegel-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Helsinki',
		'path': 'newFonts/Helsinki',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Hollywoodhills',
		'path': 'newFonts/Hollywood Hills',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Hudson',
		'path': 'newFonts/Hudson-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'HybreaDirty',
		'path': 'newFonts/HybreaDirty-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ICBMSS20',
		'path': 'newFonts/ICBM SS-20',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Iguana',
		'path': 'newFonts/Iguana',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Illuminate',
		'path': 'newFonts/Illuminate',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'IonicCharge',
		'path': 'newFonts/Ionic Charge',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'IrishSpaghetti',
		'path': 'newFonts/Irish Spaghetti',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'JandaCurlygirlChunky',
		'path': 'newFonts/Janda Curlygirl Chunky',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'JeffreyPrint',
		'path': 'newFonts/JeffreyPrint JL',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'JohnnyTorch',
		'path': 'newFonts/Johnny Torch Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KeelhauledBold',
		'path': 'newFonts/Keelhauled BB Bold',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'KnockoutMF',
		'path': 'newFonts/Knockout MF Initials',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Koblenz',
		'path': 'newFonts/Koblenz-Bold-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Magazine',
		'path': 'newFonts/Magazine-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Mainframe',
		'path': 'newFonts/Mainframe BB',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'MeltdownMF',
		'path': 'newFonts/Meltdown MF',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Miserable',
		'path': 'newFonts/Miserable',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Nyxali',
		'path': 'newFonts/Nyxali-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'OctinSpraypaint',
		'path': 'newFonts/OctinSpraypaintARg-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Orkney',
		'path': 'newFonts/Orkney-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ParryHotter',
		'path': 'newFonts/Parry Hotter',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Pittsburgh',
		'path': 'newFonts/Pittsburgh-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'QuantumRoundBRK',
		'path': 'newFonts/Quantum Round BRK',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'QuigleyWiggly',
		'path': 'newFonts/QuigleyWiggly',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'RimouskiLt',
		'path': 'newFonts/RimouskiLt-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Rinse',
		'path': 'newFonts/Rinse-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Salmon',
		'path': 'newFonts/Salmon-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'SansPosterBold3DJLRegular',
		'path': 'newFonts/Sans Poster Bold 3D JL',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Savannah',
		'path': 'newFonts/Savannah-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'SFButtacup',
		'path': 'newFonts/SF Buttacup',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'TeamSpirit',
		'path': 'newFonts/Team Spirit NF',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ThamesSerialHeavyItalic',
		'path': 'newFonts/ThamesSerial-Heavy-Italic',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'TypewriterSerial',
		'path': 'newFonts/TypewriterSerial-Heavy-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Umbrage',
		'path': 'newFonts/Umbrage',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Unicorn',
		'path': 'newFonts/Unicorn',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Usambara',
		'path': 'newFonts/Usambara-Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'WarPriest',
		'path': 'newFonts/War Priest Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'WoodenNickelNF',
		'path': 'newFonts/Wooden Nickel NF',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'XcelsionRegula',
		'path': 'newFonts/Xcelsion',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Zakenstein',
		'path': 'newFonts/Zakenstein Regular',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'ZealotRegular',
		'path': 'newFonts/Zealot',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'OldSansBlack',
		'path': 'newFonts/OldSansBlack',
		'isLoad': true,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Typodermic',
		'path': 'newFonts/typodermic',
		'isLoad': false,
		'hasWoff': true
	});
	fonts.push({
		'name': 'Impact',
		'path': 'newFonts/impact',
		'isLoad': false,
		'hasWoff': true
	});
	var fontsContainer;
	function loadFonts(fontsNames) {
		var unLoadFonts = $.map(fonts,
		function(item) {
			for (var i = 0; i < fontsNames.length; i++) {
				if (item.name === fontsNames[i] && item.isLoad === false) {
					return item;
				}
			}
		});
		if (unLoadFonts.length > 0) {
			var html = [] 
		        html.push('<style type="text/css">');
			$.each(unLoadFonts,
			function() {
				html.push("@font-face {");
				html.push("\tfont-family: '" + this.name + "';");
				html.push("\tsrc: url('" + window.assetsBaseURL + "assets/css/fonts/" + this.path + ".eot');\n");
				woffPath = this.hasWoff ? "url('" + window.assetsBaseURL + "assets/css/fonts/" + this.path + ".woff') format('woff'),\n": "\n";
				html.push("\tsrc: url('" + window.assetsBaseURL + "assets/css/fonts/" + this.path + ".eot?#iefix') format('embedded-opentype'),\n\t\t" + woffPath + "\t\turl('" + window.assetsBaseURL + "assets/css/fonts/" + this.path + ".ttf') format('truetype'),");
				html.push("\t\turl('" + window.assetsBaseURL + "assets/css/fonts/" + this.path + ".svg#svgFontName') format('svg');");
				html.push("}");
				this.isLoad = true;
			});
			html.push('</style>');
			$("head").append(html.join("\n"));
		}
	}
	function isFontAvailable(fontName, callback) {
		var sansSerifDiv, testFontDiv, fontAvailable, testCodePart1 = '<div style="font-family:',
		testCodePart2 = 'DaddyLonglegs;visibility:hidden;position:absolute;">mmmmlil</div>';
		var $bdy = $("body");
		sansSerifDiv = $(testCodePart1 + testCodePart2).appendTo($bdy);
		testFontDiv = $(testCodePart1 + "'" + fontName + "'," + testCodePart2).appendTo($bdy);
		setTimeout(function() {
			if (fontName === 'DaddyLonglegs') {
				callback();
			} else {
				fontAvailable = (sansSerifDiv.width() != testFontDiv.width() || sansSerifDiv.height() != testFontDiv.height());
				if (fontAvailable && callback) {
					callback();
				}
			}
			sansSerifDiv.remove();
			testFontDiv.remove();
		},
		20);
	}
	$.loadFonts = loadFonts;
	$.whenFontLoaded = isFontAvailable;
})(jQuery);
(function() {
	window.Ooshirts = {};
}).call(this);
(function() {
	Module(Ooshirts, 'Serializable')({
		prototype: {
			serializableAttributes: [],
			customSerializations: [],
			customLoads: [],
			isCompleteLoad: false,
			serialize: function() {
				var attr, custom, data, _i, _j, _len, _len1, _ref, _ref1;
				data = {};
				_ref = this.serializableAttributes;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					attr = _ref[_i];
					data[attr] = this[attr];
				}
				_ref1 = this.customSerializations;
				for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
					custom = _ref1[_j];
					this[custom](data);
				}
				return data;
			},
			load: function(data) {
				var attr, custom, _i, _j, _len, _len1, _ref, _ref1;
				_ref = this.serializableAttributes;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					attr = _ref[_i];
					this[attr] = data[attr];
				}
				_ref1 = this.customLoads;
				for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
					custom = _ref1[_j];
					this[custom](data);
				}
				if (this.didLoad) {
					this.didLoad(data);
				}
				this.isCompleteLoad = true;
				return data;
			}
		}
	});
}).call(this);
(function() {
	Module(Ooshirts, 'NodeSupport')({
		prototype: {
			parent: null,
			children: [],
			addChild: function(child) {
				if (child.parent) {
					child.parent.removeChild(child);
				}
				if (!this.hasOwnProperty('children')) {
					this.children = [];
				}
				this.children.push(child);
				this[child.name] = child;
				child.setParent(this);
				return child;
			},
			removeChild: function(child) {
				var c, i, _i, _len, _ref;
				if (typeof child === 'string') {
					child = this[child];
				}
				_ref = this.children;
				for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
					c = _ref[i];
					if (! (c === child)) {
						continue;
					}
					this.children.splice(i, 1);
					delete this[child.name];
					child.setParent(null);
					break;
				}
				return this;
			},
			setParent: function(parent) {
				this.parent = parent;
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'CustomEvent')({
		prototype: {
			bubbles: true,
			cancelable: true,
			currentTarget: null,
			timestamp: 0,
			target: null,
			type: '',
			isPropagationStopped: false,
			isDefaultPrevented: false,
			isImmediatePropagationStopped: false,
			areImmediateHandlersPrevented: false,
			init: function(type, data) {
				this.type = type;
				$.extend(this, data);
				return this;
			},
			stopPropagation: function() {
				this.isPropagationStopped = true;
				return this;
			},
			preventDefault: function() {
				this.isDefaultPrevented = true;
				return this;
			},
			stopImmediatePropagation: function() {
				this.isImmediatePropagationStopped = true;
				return this;
			},
			preventImmediateHandlers: function() {
				this.areImmediateHandlersPrevented = true;
				return this;
			}
		}
	});
}).call(this);
(function() {
	Module(Ooshirts, 'CustomEventSupport')({
		prototype: {
			eventListeners: null,
			oneEventListeners: null,
			bind: function(type, eventHandler) {
				var found, handler, _i, _len, _ref;
				if (!this.eventListeners) {
					this.eventListeners = {};
				}
				if (!this.eventListeners[type]) {
					this.eventListeners[type] = [];
				}
				found = false;
				_ref = this.eventListeners[type];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					handler = _ref[_i];
					if (! (handler === eventHandler)) {
						continue;
					}
					found = true;
					break;
				}
				if (!found) {
					this.eventListeners[type].push(eventHandler);
				}
				return this;
			},
			one: function(type, eventHandler) {
				var found, handler, _i, _len, _ref;
				if (!this.oneEventListeners) {
					this.oneEventListeners = {};
				}
				if (!this.oneEventListeners[type]) {
					this.oneEventListeners[type] = [];
				}
				found = false;
				_ref = this.oneEventListeners[type];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					handler = _ref[_i];
					if (! (handler === eventHandler)) {
						continue;
					}
					found = true;
					break;
				}
				if (!found) {
					this.oneEventListeners[type].push(eventHandler);
				}
				return this;
			},
			unbind: function(type, eventHandler) {
				var handler, i, _i, _len, _ref;
				if (!this.eventListeners) {
					this.eventListeners = {};
				}
				if (typeof eventHandler === 'undefined') {
					this.eventListeners[type] = [];
				}
				_ref = this.eventListeners[type];
				for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
					handler = _ref[i];
					if (! (handler === eventHandler)) {
						continue;
					}
					this.eventListeners[type].splice(i, 1);
					break;
				}
				return this;
			},
			trigger: function(type, data) {
				var event, listener, listeners, _i, _j, _len, _len1;
				if (!this.eventListeners) {
					this.eventListeners = {};
				}
				event = new Ooshirts.CustomEvent(type, data);
				event.target = this;
				listeners = this.eventListeners[type] || [];
				for (_i = 0, _len = listeners.length; _i < _len; _i++) {
					listener = listeners[_i];
					listener.apply(this, [event]);
					if (event.areImmediateHandlersPrevented) {
						break;
					}
				}
				if (!this.oneEventListeners) {
					this.oneEventListeners = {};
				}
				listeners = this.oneEventListeners[type] || [];
				for (_j = 0, _len1 = listeners.length; _j < _len1; _j++) {
					listener = listeners[_j];
					listener.apply(this, [event]);
				}
				this.oneEventListeners[type] = [];
				return event;
			}
		}
	});
}).call(this);
(function() {
	Module(Ooshirts, 'CssTransform')({
		prototype: {
			renderTransform: function(item, action, value) {
				var actionValue, element, order, originalTransformValue, regExp, toReplace, transformProperty, transformValue, transfrom, _i, _len, _ref;
				element = item.element.find(".item-contents");
				transformProperty = element.css('transform');
				if ($.browser.mozilla || $.browser.ie.eq10) {
					transformProperty = element[0].style.transform;
				}
				if ($.browser.ie.eq9) {
					transformProperty = element[0].style.msTransform;
				}
				transformValue = '';
				if (!transformProperty || transformProperty === "none") {
					transformValue = "" + action + "(" + value + ")";
				} else if (transformProperty.search(action) !== -1) {
					regExp = new RegExp("" + action + "\\(-?[a-z0-9\\.]+\\)", 'gi');
					toReplace = transformProperty.match(regExp);
					actionValue = "" + action + "(" + value + ")";
					transformProperty = transformProperty.replace(regExp, actionValue);
					transformValue = transformProperty;
				} else {
					transformValue = "" + transformProperty + " " + action + "(" + value + ")";
				}
				if ($.browser.ie.lt9) {
					if (item.itemType === 'Clipart' || item.itemType === 'Image') {
						originalTransformValue = transformValue;
						transfrom = [];
						_ref = item.transferOrder;
						for (_i = 0, _len = _ref.length; _i < _len; _i++) {
							order = _ref[_i];
							if (order === "rotate") {
								if (item.degrees > 0) {
									transfrom.push("rotate(" + item.degrees + "deg)");
								} else {
									transfrom.push("rotate(0deg)");
								}
							}
							if (order === "flip") {
								if (item.flipState) {
									transfrom.push("scaleX(-1)");
								} else {
									transfrom.push("scaleX(1)");
								}
							}
							if (order === "flop") {
								if (item.flopState) {
									transfrom.push("scaleY(-1)");
								} else {
									transfrom.push("scaleY(1)");
								}
							}
						}
						cssSandpaper.setTransform(element.find('img')[0], transfrom.join(","));
					} else {
						cssSandpaper.setTransform(element.find('.text-arc')[0], transformValue);
					}
				} else if ($.browser.ie.eq9) {
					element.css('-ms-transform', transformValue);
				} else {
					element.css('transform', transformValue);
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	var __slice = [].slice;
	Class(Ooshirts, 'Widget').includes(Ooshirts.NodeSupport, Ooshirts.CustomEventSupport)({
		elementClass: 'ooshirts-widget',
		html: '<div></div>',
		prototype: {
			init: function(attributes) {
				$.extend(true, this, attributes);
				if (!this.element) {
					this.element || (this.element = $(this.constructor.html));
					this.element.addClass(this.constructor.elementClass);
				}
				return this;
			},
			hide: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = this.element.stop(false, true)).hide.apply(_ref, args);
				return this;
			},
			show: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = this.element.stop(false, true)).show.apply(_ref, args);
				return this;
			},
			isVisible: function() {
				return this.element.is(':visible');
			},
			render: function(parent) {
				parent.append(this.element);
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Header').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var that, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.pricePanel = this.element.find('#estimate-price');
				this.qtySelectPanel = this.element.find('#estimate-qty');
				this.$price = this.pricePanel.find('.average-price .price-number');
				this.$quoteloader = this.pricePanel.find('.average-price .quote-loader');
				this.$quantities = this.pricePanel.find("em");
				this.isEditQuantities = false;
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#top-menu-save-design'),
					name: 'saveDesignButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#top-menu-load-design'),
					name: 'loadDesignButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#top-menu-get-help'),
					name: 'getHelpButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#top-menu-start-chat'),
					name: 'startChatButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#top-menu-collaborate'),
					name: 'collaborateButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.buy-now-button'),
					name: 'buyNowButton'
				}));
				that = this;
				this.buyNowButton.bind('click',
				function() {
					_this._hideAllTooltips();
					_this.quoteTooltip.show();
					return false;
				});
				this.saveDesignButton.bind('click',
				function() {
					if (that.saveDesignTooltip.isVisible()) {
						this.element.removeClass('active');
						return that.saveDesignTooltip.hide();
					} else {
						that._hideAllTooltips();
						this.element.addClass('active');
						that.saveDesignTooltip.showSaveDesignTooltip();
						return $("#design_review").show();
					}
				});
				this.loadDesignButton.bind('click',
				function() {
					if (that.loadDesignTooltip.isVisible()) {
						this.element.removeClass('active');
						return that.loadDesignTooltip.hide();
					} else {
						that._hideAllTooltips();
						this.element.addClass('active');
						that.loadDesignTooltip.show();
						if (that.loadDesignTooltip.panelScrollPane) {
							return that.loadDesignTooltip.panelScrollPane.repaint();
						}
					}
				});
				this.getHelpButton.bind('click',
				function() {
					if (that.getHelpTooltip.isVisible()) {
						this.element.removeClass('active');
						return that.getHelpTooltip.hide();
					} else {
						that._hideAllTooltips();
						this.element.addClass('active');
						return that.getHelpTooltip.show();
					}
				});
				this.startChatButton.bind('click',
				function() {
					olark('api.box.expand');
					return olark('api.box.show');
				});
				this.collaborateButton.bind('click',
				function() {
					if (that.collaborateTooltip.isVisible()) {
						this.element.removeClass('active');
						return that.collaborateTooltip.hide();
					} else {
						that._hideAllTooltips();
						this.element.addClass('active');
						return that.collaborateTooltip.show();
					}
				});
				this.addChild(new Ooshirts.Tooltip.SaveDesignTooltip({
					element: this.element.find('#save-design-tooltip'),
					name: 'saveDesignTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip.LoadDesignTooltip({
					element: this.element.find('#load-design-tooltip'),
					name: 'loadDesignTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip({
					element: this.element.find('#get-help-tooltip'),
					name: 'getHelpTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip({
					element: this.element.find('#edit-quantities-tooltip'),
					name: 'editQuantitiesTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip.QuoteTooltip({
					name: 'quoteTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip.CollaborateTooltip({
					name: 'collaborateTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip({
					element: this.element.find('#personalize-notice'),
					name: 'personalizeNotice'
				}));
				this.addChild(new Ooshirts.Tooltip({
					element: this.element.find('#zero-ink-notice'),
					name: 'zeroInkNotice'
				}));
				this.saveDesignTooltip.bind('clickoutside',
				function() {
					return that.saveDesignButton.element.removeClass('active');
				});
				this.loadDesignTooltip.bind('clickoutside',
				function() {
					return that.loadDesignButton.element.removeClass('active');
				});
				this.getHelpTooltip.bind('clickoutside',
				function() {
					return that.getHelpButton.element.removeClass('active');
				});
				this.collaborateTooltip.bind('clickoutside',
				function() {
					return that.collaborateButton.element.removeClass('active');
				});
				this.quoteTooltip.bind('brforeQuoteChanged',
				function(ev) {
					_this.$quoteloader.show();
					_this.$price.hide();
					return _this.$quantities.text('per shirt (..)');
				});
				this.quoteTooltip.bind('quoteChanged',
				function(ev) {
					if (ev.hasItems) {
						_this.checkoutButton.show();
						_this.subtotalButton.show();
						_this.subtotalButton.element.find('.subtotal-price').text("$" + ev.subtotal);
					} else {
						_this.checkoutButton.hide();
						_this.subtotalButton.hide();
					}
					return _this._updateAveragePrice(ev.subtotal);
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.open-quote-tooltip-button'),
					name: 'openTooltipButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.checkout-button').hide(),
					name: 'checkoutButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.subtotal-button').hide(),
					name: 'subtotalButton'
				}));
				this.bind('shirtChange',
				function() {
					var currentShirt;
					_this.quoteTooltip.trigger('load');
					_this.pricePanel.show();
					_this.qtySelectPanel.show();
					currentShirt = _this.quoteTooltip.shirtList.currentShirt;
					if (currentShirt && currentShirt.getTotalQuantities() === 0) {
						return currentShirt.largeQuantityField.setValue(24, true);
					} else {
						window.design.shirt.updateTotalInks();
						return _this.quoteTooltip.updateQuote(function() {
							return _this.quoteTooltip._hideLoader();
						});
					}
				});
				this.openTooltipButton.bind('click',
				function() {
					return _this.saveDesignButton.trigger('click');
				});
				return this;
			},
			_hideAllTooltips: function() {
				this.getHelpButton.element.removeClass('active');
				this.saveDesignButton.element.removeClass('active');
				this.loadDesignButton.element.removeClass('active');
				this.collaborateButton.element.removeClass('active');
				this.saveDesignTooltip.hide();
				this.loadDesignTooltip.hide();
				this.getHelpTooltip.hide();
				this.collaborateTooltip.hide();
				this.editQuantitiesTooltip.hide();
				this.isEditQuantities = true;
				return this;
			},
			_updateAveragePrice: function(subtotal) {
				var averagePrice, child, totalQuantities, _i, _len, _ref;
				totalQuantities = 0;
				averagePrice = '00.00';
				_ref = this.quoteTooltip.shirtList.children;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					child = _ref[_i];
					totalQuantities += child.getTotalQuantities();
				}
				if (totalQuantities !== 0) {
					averagePrice = (subtotal / totalQuantities).toFixed(2);
				}
				this.$price.text(averagePrice);
				this.$quantities.text("per shirt (" + totalQuantities + ")");
				this.$quoteloader.hide();
				return this.$price.show();
			},
			_saveAndCheckout: function() {
				var checker, checkers, _i, _len;
				checkers = [this._checkSpreadsheetInput, this._checkZeroInk, this._checkIsSaved];
				for (_i = 0, _len = checkers.length; _i < _len; _i++) {
					checker = checkers[_i];
					if (!checker.call(this)) {
						return;
					}
				}
				window.design.isSaved = false;
				if (this.quoteTooltip.isVisible()) {
					this.quoteTooltip.hide();
				}
				this.saveDesignTooltip.showSaveAndCheckoutTooltip(false);
				return this.saveDesignTooltip.saveAndCheckoutDesign();
			},
			_checkSpreadsheetInput: function() {
				var namesAndNumbers;
				namesAndNumbers = window.design.controlsPanel.panels.namesAndNumbers;
				if ((namesAndNumbers.namesTemplate || namesAndNumbers.numbersTemplate) && window.design.dialogsManager.spreadsheet.data.length === 0) {
					this.personalizeNotice.show();
					return false;
				}
				return true;
			},
			_checkZeroInk: function() {
				var namesAndNumbers;
				namesAndNumbers = window.design.controlsPanel.panels.namesAndNumbers;
				if (this.quoteTooltip.totalInks === 0 && !(namesAndNumbers.namesTemplate || namesAndNumbers.numbersTemplate)) {
					if (this.quoteTooltip.isVisible()) {
						this.quoteTooltip.hide();
					}
					this.zeroInkNotice.show();
					return false;
				}
				return true;
			},
			_checkIsSaved: function() {
				if (window.design.isSaved === false) {
					if (this.quoteTooltip.isVisible()) {
						this.quoteTooltip.hide();
					}
					this.saveDesignTooltip.showSaveAndCheckoutTooltip(true);
					return false;
				}
				return true;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChatPopup').inherits(Ooshirts.Widget)({
		prototype: {
			init: function() {
				var attributes, _this = this;
				attributes = {
					element: $('footer .chat')
				};
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.chat-conversation'),
					name: 'conversationPane'
				}));
				this.collaboratorsCount = this.element.find('.chat-counter');
				this.chatbody = this.element.find('.chat-body');
				this.chatheader = this.element.find('.chat-header');
				this.messagebar = this.element.find('.message-bar');
				this.chatheader.find('.close-chat').find('img').addClass('arrow-down');
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.input-chat-message'),
					name: 'inputField'
				}));
				this.inputField.bind('submit',
				function(ev) {
					if (ev.value) {
						_this.inputField.reset();
						_this.say('You', ev.value);
						return _this.trigger('sendMessage', {
							message: ev.value
						});
					}
				});
				this.isOpen = false;
				this.element.find('.close-chat').on('click',
				function() {
					if (_this.isOpen) {
						_this.element.animate({
							bottom: -192
						},
						500,
						function() {
							_this.isOpen = false;
							return _this.chatheader.find('.close-chat').find('img').addClass('arrow-down').removeClass('arrow-up');
						});
					} else {
						_this.element.animate({
							bottom: 0
						},
						500,
						function() {
							_this.isOpen = true;
							return _this.chatheader.find('.close-chat').find('img').addClass('arrow-up').removeClass('arrow-down');
						});
					}
					return false;
				});
				this.chatheader.bind('click',
				function(ev) {
					return _this.element.find('.close-chat').trigger('click');
				});
				this.firstShow();
				return this;
			},
			firstShow: function() {
				if (location.hash) {
					return this.show();
				}
			},
			show: function() {
				this.element.addClass('opened').removeClass('closed');
				_gaq.push(['_trackEvent', 'Design App', 'Collaborate']);
				return this;
			},
			hide: function() {
				this.element.addClass('closed').removeClass('opened');
				return this;
			},
			log: function(message) {
				this._appendMessage(message);
				if (!this.isOpen) {
					this.element.find('.close-chat').trigger('click');
				}
				return this;
			},
			say: function(sender, message) {
				this._appendMessage(message, sender);
				if (!this.isOpen) {
					this.element.find('.close-chat').trigger('click');
				}
				return this;
			},
			updateCollaborators: function(count) {
				this.collaboratorsCount.text("(" + count + ")");
				if (this.element.not(":visible") && count !== 0) {
					if (olark) {
						olark('api.box.hide');
					}
					this.show();
				}
				if (count !== 0 && !this.isOpen) {
					this.element.find('.close-chat').trigger('click');
				}
				if (count === 0 && !location.hash) {
					this.hide();
					if (olark) {
						olark('api.box.show');
					}
				}
				return this;
			},
			_appendMessage: function(message, sender) {
				var wrapper;
				wrapper = $('<p class="single-message"/>');
				if (sender) {
					wrapper.append($('<span class="sender bold"/>').text("" + sender + ": "));
					wrapper.append($('<span class="text"/>').text(message));
				} else {
					$('<span class="notification italic"/>').text(message).appendTo(wrapper);
				}
				this.conversationPane.content.append(wrapper);
				this.conversationPane.repaint().scroll('bottom');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'ContextMenu').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				attributes.element || (attributes.element = $('.item-context-menu').first().clone().appendTo('body'));
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this._initButtons();
				return this;
			},
			_initButtons: function() {
				var _this = this;
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.copy'),
					name: 'copyButton'
				}));
				this.copyButton.bind('click',
				function() {
					_this.hide();
					return _this.parent.copyToClipboard();
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.paste'),
					name: 'pasteButton'
				}));
				this.pasteButton.bind('click',
				function() {
					_this.hide();
					return window.design.pasteFromClipboard();
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.delete'),
					name: 'deleteButton'
				}));
				this.deleteButton.bind('click',
				function() {
					_this.hide();
					return _this.parent.moveToTrash();
				});
				return this;
			},
			showAt: function(x, y) {
				this.show();
				this.element.css({
					left: x,
					top: y
				});
				return this;
			},
			destroy: function() {
				this.element.remove();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'ShirtContextMenu').inherits(Ooshirts.Widget.ContextMenu)({
		prototype: {
			init: function(attributes) {
				if (attributes == null) {
					attributes = {};
				}
				attributes = $.extend({
					element: $('.shirt-context-menu')
				},
				attributes);
				Ooshirts.Widget.ContextMenu.prototype.init.apply(this, [attributes]);
				return this;
			},
			_initButtons: function() {
				var _this = this;
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.paste'),
					name: 'pasteButton'
				}));
				this.pasteButton.bind('click',
				function() {
					_this.hide();
					return window.design.pasteFromClipboard();
				});
				return this;
			},
			destroy: function() {
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'HandlersLayout').inherits(Ooshirts.Widget)({
		html: "<div class=\"handlers-layout\">\n    <!--p class=\"message-box warning-message bottom-pointer\">\n        One of your collaborators <br>is editing this object!\n        <span class=\"message-pointer\">\n          <img src=\"assets/images/inv.png\" class=\"icon icon-message-bottom-pointer\" width=\"12\" height=\"6\" alt=\"Notification Pointer\">\n        </span>\n    </p-->\n    <div class=\"handler delete-handler\"><img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon delete\" alt=\"Delete Item\" /></div>\n    <div class=\"handler rotate-handler\"><img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon rotate\" alt=\"Rotate Item\" /></div>\n    <div class=\"handler menu-handler\">\n        <span class=\"icon-layers-button\">\n            <img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon layers\" width=\"11\" height=\"11\" alt=\"Item Position\">\n        </span>\n        <ul class=\"item-menu-options\">\n            <li class=\"item-menu-option\"><a href=\"#\" class=\"bring-front\"><img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon icon-bring-front\" alt=\"Bring Front\">Bring to Front</a></li>\n            <li class=\"item-menu-option\"><a href=\"#\" class=\"send-back\"><img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon icon-send-back\" alt=\"Send Back\">Send Back</a></li>\n            <li class=\"item-menu-option\"><a href=\"#\" class=\"bring-forward\"><img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon icon-bring-forward\" alt=\"Bring Forward\">Bring Forward</a></li>\n            <li class=\"item-menu-option\"><a href=\"#\" class=\"send-backward\"><img src=\"" + assetsBaseURL + "assets/images/inv.png\" class=\"icon icon-send-backward\" alt=\"Bring Backward\">Send Backward</a></li>\n        </ul>\n    </div>\n    <div class=\"tooltip-outline error-tooltip\">\n        <div class=\"clearfix\">\n            <small>Exceeds print boundaries</small>\n        </div>\n        <span class=\"tooltip-pointer\">\n            <img class=\"icon icon-top-pointer\" alt=\"Tooltip pointer\" src=\"" + assetsBaseURL + "assets/images/inv.png\" width=\"12\" height=\"7\">\n        </span>\n    </div>\n    <div class=\"tooltip-outline rotate-notice\">\n        <div class=\"clearfix\">\n            <small>Drag to rotate.</small>\n        </div>\n        <span class=\"tooltip-pointer\">\n            <img class=\"icon icon-top-pointer\" alt=\"Tooltip pointer\" src=\"" + assetsBaseURL + "assets/images/inv.png\" width=\"12\" height=\"7\">\n        </span>\n    </div>\n</div>",
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.selectedItem = null;
				this.rotating = this.resizing = false;
				this.addChild(new Ooshirts.Widget.ContextMenu({
					name: 'contextMenu'
				}));
				this.addChild(new Ooshirts.Widget.LayersMenu({
					element: this.element.find('.menu-handler'),
					name: 'layersMenu'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.delete-handler'),
					name: 'deleteButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.rotate-handler'),
					name: 'rotateButton'
				}));
				this.addChild(new Ooshirts.Tooltip({
					element: this.element.find('.error-tooltip'),
					name: 'errorTooltip'
				}));
				this.addChild(new Ooshirts.Tooltip({
					element: this.element.find('.rotate-notice'),
					name: 'rotateNotice'
				}));
				this.deleteButton.bind('click',
				function(ev) {
					return _this.onItemDelete();
				});
				this.rotateButton.bind('click',
				function(ev) {
					var width;
					width = _this.selectedItem.element.outerWidth();
					_this.rotateNotice.show();
					setTimeout(function() {
						return _this.rotateNotice.hide();
					},
					2000);
					return false;
				});
				this.rotateButton.bind('mousedown',
				function(event) {
					_this.rotating = true;
					_this.startTime = event.originalEvent.timeStamp;
					return _this._onRotateStart(event);
				});
				$("#canvas").bind('mousemove',
				function(event) {
					if (_this.rotating) {
						return _this._onRotate(_this._getEventPorint(event));
					}
				});
				this.rotateButton.bind('mousemove',
				function(event) {
					if (_this.rotating) {
						return _this._onRotate(_this._getEventPorint(event));
					}
				});
				$("html").bind('mouseup',
				function(event) {
					var during;
					during = parseInt(event.timeStamp) - parseInt(_this.startTime);
					if (_this.rotating && during > 200) {
						_this._onRotate(_this._getEventPorint(event), true);
						_this.selectedItem.position = {
							top: parseInt(_this.selectedItem.element.css("top")),
							left: parseInt(_this.selectedItem.element.css("left"))
						};
						if ($.browser.msie) {
							window.avoidPropagation = true;
						}
					}
					_this.rotating = false;
					return true;
				});
				$("html").bind('keyup',
				function(event) {
					if ((_this.selectedItem != null) && (event.target === _this.selectedItem.element[0] || event.target.tagName === 'BODY')) {
						if (event.keyCode === 8 || event.keyCode === 46) {
							_this.onItemDelete();
							return event.preventDefault();
						} else if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
							if (event.keyCode === 37) {
								_this.selectedItem.move( - 5, 0);
							}
							if (event.keyCode === 38) {
								_this.selectedItem.move(0, -5);
							}
							if (event.keyCode === 39) {
								_this.selectedItem.move(5, 0);
							}
							if (event.keyCode === 40) {
								_this.selectedItem.move(0, 5);
							}
							window.design.shirt.trigger('itemMoved');
							return event.preventDefault();
						}
					}
				});
				this.layersMenu.bringFrontButton.bind('click',
				function() {
					return _this.selectedItem.bringToFront();
				});
				this.layersMenu.sendBackButton.bind('click',
				function() {
					return _this.selectedItem.sendToBack();
				});
				this.layersMenu.bringForwardButton.bind('click',
				function() {
					return _this.selectedItem.bringForward();
				});
				this.layersMenu.sendBackwardButton.bind('click',
				function() {
					return _this.selectedItem.sendBackward();
				});
				this.hide();
				return $("#tshirt").hover(function() {
					if (_this.selectedItem && _this.selectedItem.shirtSide === window.design.shirt.side) {
						return _this.show();
					}
				},
				function() {
					return _this.hide();
				});
			},
			bindListeners: function() {
				var _this = this;
				this.parent.bind('itemSelected',
				function(ev) {
					return _this._bindHandlersToItem(ev.item);
				});
				this.parent.bind('itemDeselected',
				function(ev) {
					_this.selectedItem = null;
					if (_this.layersMenu.isOptionsVisible()) {
						_this.layersMenu.hideOptions();
					}
					return _this.hide();
				});
				this.parent.bind('itemRotated',
				function(ev) {
					window.design.updateDraggableContainment(ev.item);
					return _this.setPosition();
				});
				this.parent.bind('itemMoved',
				function(ev) {
					return _this.setPosition();
				});
				this.parent.bind('hideLayersMenu',
				function(ev) {
					if (_this.layersMenu.isOptionsVisible()) {
						return _this.layersMenu.hideOptions();
					}
				});
				this.parent.bind('itemUpdated',
				function(ev) {
					if (_this.selectedItem) {
						_this._bindResizable();
						return _this.setPosition();
					}
				});
				this.parent.bind('itemMouseover',
				function(ev) {
					if (_this.element.hasClass("error-state") && _this.selectedItem && _this.selectedItem === ev.item) {
						return _this.showErrorToolTip();
					}
				});
				this.parent.bind('itemMouseout',
				function(ev) {
					if (_this.selectedItem === ev.item) {
						return _this.hideErrorToolTip();
					}
				});
				return this;
			},
			_bindHandlersToItem: function(item) {
				this.selectedItem = item;
				this.setPosition();
				this._bindResizable();
				this.show();
				return this;
			},
			onItemDelete: function() {
				var itemType;
				itemType = this.selectedItem.itemType;
				if (this.selectedItem.itemType === "TeamText") {
					this.selectedItem.trigger('deleted');
				} else {
					this.selectedItem.moveToTrash();
				}
				if (itemType === "TeamText") {
					window.design.controlsPanel.goTo('namesAndNumbers');
				} else if (itemType === "Text") {
					window.design.controlsPanel.goTo('addText');
				} else if (itemType === "Image") {
					window.design.controlsPanel.goTo('uploadImage');
				} else if (itemType === "Clipart") {
					window.design.controlsPanel.goTo('clipArtCatList');
				}
				this.hide();
				return this;
			},
			_bindResizable: function(aspectRatio) {
				var _this = this;
				if (aspectRatio == null) {
					aspectRatio = true;
				}
				if (!this.isResizableInit) {
					this.element.parent().on('resize',
					function(ev) {
						return false;
					});
					this.element.resizable({
						constraints: "#canvas",
						aspectRatio: aspectRatio,
						maxWidth: 500,
						maxHeight: 600,
						minWidth: 20,
						minHeight: 20,
						handles: 'se',
						start: function(event, ui) {
							_this.resizing = true;
							_this.dragStartContentSize = {
								width: _this.selectedItem.contents.width(),
								height: _this.selectedItem.contents.height()
							};
							_this.selectedItem.lastStatus = {
								arc: _this.selectedItem.arc,
								fontSize: _this.selectedItem.fontSize,
								size: $.extend({},
								_this.dragStartContentSize)
							};
							return window.avoidPropagation = true;
						},
						stop: function(event, ui) {
							_this.resizing = false;
							_this._onResize(event, ui, true);
							_this.setPosition();
							window.design.updateDraggableContainment(_this.selectedItem);
							return setTimeout(function() {
								window.avoidPropagation = false;
								return _this._bindResizable();
							},
							500);
						},
						resize: function(event, ui) {
							if ($.browser.ie.lt8) {
								setTimeout(function() {
									return _this._onResize(event, ui, false);
								},
								0);
							} else {
								_this._onResize(event, ui, false);
							}
							return false;
						}
					});
					this.isResizableInit = true;
				}
				if (this.selectedItem.itemType === 'TeamText') {
					this.element.resizable('disable').find(".ui-resizable-handle").hide();
				} else {
					this.element.resizable('enable').find(".ui-resizable-handle").show();
					this.element.resizable('option', 'aspectRatio', aspectRatio);
				}
				return this;
			},
			_getEventPorint: function(event) {
				var dragStartPoint;
				if ($.browser.msie && $.browser.ie.lt9) {
					dragStartPoint = {
						top: event.originalEvent.clientY,
						left: event.originalEvent.clientX
					};
				} else {
					dragStartPoint = {
						top: event.originalEvent.pageY,
						left: event.originalEvent.pageX
					};
				}
				return dragStartPoint;
			},
			_onRotateStart: function(event) {
				var offset;
				this.dragStartPoint = this._getEventPorint(event);
				offset = this.element.offset();
				this.dragReferencePoint = {
					top: offset.top + this.element.height() / 2,
					left: offset.left + this.element.width() / 2
				};
				this.dragStartItemAngle = this.selectedItem.degrees || 0;
				this.selectedItem.dragStartItemAngle = this.dragStartItemAngle;
				this.selectedItem.dragStartPosition = $.extend({},
				this.selectedItem.position);
				return this.dragStartAngle = this._getAngle(this.dragReferencePoint, this.dragStartPoint);
			},
			_onRotate: function(mousePosition, addToHistroy) {
				var currentAngle, currentDistance, degreesNew;
				if (addToHistroy == null) {
					addToHistroy = false;
				}
				currentDistance = this._getDistance(this.dragReferencePoint, mousePosition);
				if (currentDistance > 10) {
					currentAngle = this._getAngle(this.dragReferencePoint, mousePosition);
					degreesNew = this.dragStartItemAngle + currentAngle - this.dragStartAngle;
					if (degreesNew > 359) {
						degreesNew -= 360;
					} else if (degreesNew < 0) {
						degreesNew += 360;
					}
					if ((85 < degreesNew && degreesNew < 95)) {
						degreesNew = 90;
					} else if ((175 < degreesNew && degreesNew < 195)) {
						degreesNew = 180;
					} else if ((265 < degreesNew && degreesNew < 275)) {
						degreesNew = 270;
					} else if (degreesNew > 355 || degreesNew < 5) {
						degreesNew = 0;
					}
					this.selectedItem.rotate(degreesNew, addToHistroy, false);
					this.setPosition();
				}
				return true;
			},
			_onResize: function(event, ui, persist) {
				var fitted;
				if (this.selectedItem.itemType === 'Text') {
					this.selectedItem.resize(ui.size.width, ui.size.height, persist);
				} else {
					fitted = this._fitRotatedRectangle(this.selectedItem.degrees, this.dragStartContentSize, ui.originalSize, ui.size);
					this.selectedItem.resize(fitted.width, fitted.height, persist);
				}
				return this.setPosition();
			},
			_fitRotatedRectangle: function(degrees, size, originalBounds, newBounds) {
				var a1, a1new, a2, a2new, b1, b1new, b2, b2new, cos, newSize, radians, sin, xScale, yScale;
				xScale = newBounds.width / originalBounds.width;
				yScale = newBounds.height / originalBounds.height;
				radians = this._toRadians(degrees);
				sin = Math.sin(radians);
				cos = Math.cos(radians);
				a1 = size.width * sin;
				b1 = size.width * cos;
				a2 = size.height * cos;
				b2 = size.height * sin;
				a1new = a1 * yScale;
				b1new = b1 * xScale;
				a2new = a2 * yScale;
				b2new = b2 * xScale;
				return newSize = {
					width: Math.round(Math.sqrt(a1new * a1new + b1new * b1new)),
					height: Math.round(Math.sqrt(a2new * a2new + b2new * b2new))
				};
			},
			setPosition: function() {
				var position;
				position = this.selectedItem.element.position();
				this.element.css({
					top: position.top - 1,
					left: position.left - 1,
					width: this.selectedItem.size.width + 16,
					height: this.selectedItem.size.height + 16
				});
				if (this.selectedItem.isInsideDesign() || this.selectedItem.isHoverSideButton) {
					this.element.removeClass("error-state");
					this.hideErrorToolTip();
				} else {
					this.element.addClass("error-state");
					this.showErrorToolTip();
				}
				return this;
			},
			showErrorToolTip: function() {
				var width;
				width = this.selectedItem.element.outerWidth();
				this.errorTooltip.element.css({
					"left": width / 2 - 89
				});
				return this.errorTooltip.show();
			},
			hideErrorToolTip: function() {
				return this.errorTooltip.hide();
			},
			_getDistance: function(pointA, pointB) {
				var a, b, c;
				a = pointA.left - pointB.left;
				b = pointA.top - pointB.top;
				c = Math.sqrt(a * a + b * b);
				return Math.round(c);
			},
			_getAngle: function(pointA, pointB) {
				var a, alpha, b, beta, c;
				a = pointA.left - pointB.left;
				b = pointA.top - pointB.top;
				c = Math.sqrt(a * a + b * b);
				alpha = this._toDegrees(Math.acos(a / c));
				beta = this._toDegrees(Math.asin(b / c));
				return Math.round(180 + (beta > 0 ? alpha: -alpha));
			},
			_toDegrees: function(radians) {
				return radians * (180 / Math.PI);
			},
			_toRadians: function(degrees) {
				return degrees * (Math.PI / 180);
			}
		}
	});
}).call(this);
(function() {
	var __slice = [].slice;
	Class(Ooshirts.Widget, 'LayersMenu').inherits(Ooshirts.Widget)({
		elementClass: 'ooshirts-shirt-item',
		prototype: {
			init: function(attributes) {
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.layersMenuOptions = this.element.find('.item-menu-options');
				this._initButtons();
				return this;
			},
			toggleOptions: function() {
				if (this.isOptionsVisible()) {
					this.hideOptions('slide', {
						direction: 'up'
					},
					'fast');
				} else {
					this.showOptions('slide', {
						direction: 'up'
					},
					'fast');
				}
				return this;
			},
			isOptionsVisible: function() {
				return this.layersMenuOptions.is(':visible');
			},
			hideOptions: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = this.layersMenuOptions.stop(false, true)).hide.apply(_ref, args);
				return this;
			},
			showOptions: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = this.layersMenuOptions.stop(false, true)).show.apply(_ref, args);
				return this;
			},
			_initButtons: function() {
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.icon-layers-button'),
					name: 'iconLayersButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.bring-front'),
					name: 'bringFrontButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.send-back'),
					name: 'sendBackButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.bring-forward'),
					name: 'bringForwardButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.send-backward'),
					name: 'sendBackwardButton'
				}));
				this._bindButtons();
				return true;
			},
			_bindButtons: function() {
				var _this = this;
				this.iconLayersButton.bind('click',
				function() {
					return _this.toggleOptions();
				});
				this.bringFrontButton.bind('click',
				function() {
					return _this.toggleOptions();
				});
				this.sendBackButton.bind('click',
				function() {
					return _this.toggleOptions();
				});
				this.bringForwardButton.bind('click',
				function() {
					return _this.toggleOptions();
				});
				this.sendBackwardButton.bind('click',
				function() {
					return _this.toggleOptions();
				});
				return true;
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts, 'Shirt').inherits(Ooshirts.Widget).includes(Ooshirts.Serializable)({
		all: function(callback) {
			var _this = this;
			if (this._all) {
				callback(this._all);
			} else {
				if (this._fetching) {
					setTimeout(function() {
						return Ooshirts.Shirt.all(callback);
					},
					500);
					return false;
				}
				this._fetching = true;
				$.getJSON('http://www.ooshirts.com/lab/productlist.php?version=2',
				function(data) {
					_this._all || (_this._all = data);
					_this._fetching = false;
					if (callback) {
						return callback(data);
					}
				});
			}
			return null;
		},
		getShirtDetail: function(id, callback) {
			var shirt, _this = this;
			shirt = this.getLocalShirtById(id);
			if (shirt.hasOwnProperty("description")) {
				if (callback) {
					return callback(shirt);
				}
			} else {
				if (this._detail_feaching) {
					setTimeout(function() {
						return Ooshirts.Shirt.getShirtDetail(id, callback);
					},
					500);
				}
				this._detail_feaching = true;
				return $.getJSON("http://www.ooshirts.com/lab/product.php?product_id=" + id,
				function(data) {
					data = _this.addToStore(data);
					_this._detail_feaching = false;
					if (callback) {
						return callback(data);
					}
				});
			}
		},
		addToStore: function(shirt) {
			var product;
			product = this.getLocalShirtById(shirt.id);
			product.description = shirt.description;
			product.has_sleeves = shirt.has_sleeves;
			product.materials = shirt.materials;
			product.colors = shirt.colors;
			product.availableColors = shirt.colors;
			if (shirt.warning) {
				product.warning = shirt.warning;
			}
			return product;
		},
		getLocalShirtById: function(id) {
			var category, product, subcategory, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
			_ref = this._all;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				category = _ref[_i];
				_ref1 = category.subcategories;
				for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
					subcategory = _ref1[_j];
					_ref2 = subcategory.products;
					for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
						product = _ref2[_k];
						if (product.id === id.toString()) {
							product.categoryId = category.id;
							product.subcategoryId = subcategory.id;
							return product;
						}
					}
				}
			}
		},
		prototype: {
			side: 'front',
			serializableAttributes: ['id', 'description', 'name', 'url', 'color', 'category', 'subcategory', 'categoryId', 'subcategoryId'],
			init: function(attributes) {
				var that, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.canvas = $('#canvas');
				this.updateFrame();
				this.sleeveInformation = this.element.find('.sleeve-information');
				this.productWarningBox = $('#product-warning-box');
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#left-sleeve-btn'),
					name: 'leftSleeveBtn'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.productWarningBox.find('#close-warning-button'),
					name: 'closeProductWarningBoxBtn'
				}));
				this.leftSleeveBtn.bind('click',
				function() {
					return window.design.switchShirtSide('left');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#right-sleeve-btn'),
					name: 'rightSleeveBtn'
				}));
				this.rightSleeveBtn.bind('click',
				function() {
					return window.design.switchShirtSide('right');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#back-tshirt-btn'),
					name: 'backShirtBtn'
				}));
				this.backShirtBtn.bind('click',
				function() {
					return window.design.switchShirtSide('back');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#front-tshirt-btn'),
					name: 'frontShirtBtn'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: $('.undo'),
					name: 'undoBtn'
				}));
				if (window.thumb) {
					this.undoBtn.hide();
				}
				this.addChild(new Ooshirts.Widget.HandlersLayout({
					name: 'handlersLayout'
				}));
				this.frontShirtBtn.bind('click',
				function() {
					window.design.switchShirtSide('front');
					return _this.element.removeClass('sleeve');
				});
				this.undoBtn.bind('click',
				function() {
					return window.design.actions.undo();
				});
				this.closeProductWarningBoxBtn.bind('click',
				function() {
					return _this.productWarningBox.hide();
				});
				that = this;
				$('#front-tshirt-btn,#back-tshirt-btn,#right-sleeve-btn,#left-sleeve-btn').droppable({
					accept: ".item-container",
					over: function(event, ui) {
						var currentItem, side, targetId;
						targetId = ui.draggable[0].id;
						currentItem = window.design.findItem(targetId);
						side = that._getSideByElementId(this.id);
						if (that.side !== side) {
							currentItem.isHoverSideButton = true;
							return $("img", this).addClass("item-hover");
						}
					},
					out: function(event, ui) {
						var currentItem, side, targetId;
						targetId = ui.draggable[0].id;
						currentItem = window.design.findItem(targetId);
						side = that._getSideByElementId(this.id);
						if (that.side !== side) {
							currentItem.isHoverSideButton = false;
							return $("img", this).removeClass("item-hover");
						}
					},
					drop: function(event, ui) {
						var currentItem, side, targetId;
						targetId = ui.draggable[0].id;
						currentItem = window.design.findItem(targetId);
						side = that._getSideByElementId(this.id);
						currentItem.position = $.extend({},
						currentItem.originalPosition);
						currentItem.moveTo(currentItem.position.left, currentItem.position.top);
						currentItem.isSwitchSide = true;
						if (that.side !== side) {
							currentItem.shirtSide = side;
							currentItem.didDeselect();
							currentItem.hide();
						} else {
							that.trigger('itemMoved');
						}
						$("img", this).removeClass("item-hover");
						that.updateTotalInks();
						return currentItem.isHoverSideButton = false;
					}
				});
				this.handlersLayout.render(this.element).bindListeners();
				this.element.mouseleave(function() {
					if (_this.element.hasClass('center-guide')) {
						_this.element.removeClass('center-guide');
					}
					return true;
				});
				return this;
			},
			_getSideByElementId: function(id) {
				var side;
				side = 'front';
				switch (id) {
				case 'front-tshirt-btn':
					side = 'front';
					break;
				case 'back-tshirt-btn':
					side = 'back';
					break;
				case 'right-sleeve-btn':
					side = 'right';
					break;
				case 'left-sleeve-btn':
					side = 'left';
				}
				return side;
			},
			updateFrame: function() {
				this.frame = {
					width: this.element.width() - 18,
					height: this.element.height() - 18,
					x: this.element.offset().x,
					y: this.element.offset().y
				};
				return this;
			},
			showSleeve: function(sleeve) {
				this.url = this._buildUrl();
				this.canvas.css({
					backgroundImage: "url(" + this.url + ")"
				});
				this.element.height(280).addClass('sleeve');
				if (sleeve === 'right') {
					this.sleeveInformation.find('.bold').html('Right Sleeve');
				} else {
					this.sleeveInformation.find('.bold').html('Left Sleeve');
				}
				if (!window.thumb) {
					this.sleeveInformation.show();
				}
				return this;
			},
			getColorByName: function(colors, colorName) {
				var color, id;
				for (id in colors) {
					color = colors[id];
					if (color.color.toLowerCase() === colorName.toLowerCase()) {
						return color;
					}
				}
				return null;
			},
			change: function(attributes, callback) {
				var _this = this;
				return Ooshirts.Shirt.all(function(data) {
					var colorId, productId, shirtInfo;
					shirtInfo = null;
					productId = attributes.id;
					colorId = attributes.colorId;
					shirtInfo = Ooshirts.Shirt.getLocalShirtById(productId);
					if (shirtInfo) {
						return Ooshirts.Shirt.getShirtDetail(shirtInfo.id,
						function(shirt) {
							var color, oldId;
							oldId = _this.id;
							_this.name = shirt.name;
							_this.id = shirt.id;
							_this.category = shirt.category;
							_this.subcategory = shirt.subcategory;
							_this.description = shirt.description;
							_this.has_sleeves = shirt.has_sleeves;
							_this.materials = shirt.materials;
							_this.categoryId = shirt.categoryId;
							_this.subcategoryId = shirt.subcategoryId;
							if (isNaN(colorId)) {
								color = _this.getColorByName(shirt.colors, colorId);
								if (!color) {
									_this.change({
										id: '1',
										colorId: '224'
									},
									callback);
									return;
								}
							} else {
								color = shirt.colors[colorId];
							}
							_this.color = {
								id: color.id,
								name: color.color,
								hexcode: color.hex
							};
							_this.availableColors = shirt.colors;
							_this.url = _this._buildUrl();
							if (_this.has_sleeves === '0') {
								_this.leftSleeveBtn.hide();
								_this.rightSleeveBtn.hide();
							} else {
								_this.leftSleeveBtn.show();
								_this.rightSleeveBtn.show();
							}
							if (_this.side === 'left' || _this.side === 'right') {
								_this.canvas.css({
									backgroundImage: "url(" + _this.url + ")"
								});
							} else {
								_this.element.removeClass('sleeve').css({
									backgroundColor: "transparent"
								}).height(409);
								_this.canvas.css({
									backgroundImage: "url(" + _this.url + ")"
								});
							}
							if (shirt.warning) {
								if (!window.thumb && oldId !== _this.id) {
									_this.productWarningBox.find('#warning-message').html('<strong>Notice: </strong>' + shirt.warning);
									_this.productWarningBox.show();
								}
							} else {
								_this.productWarningBox.hide();
							}
							if (callback) {
								callback(true);
							}
							return _this.trigger('shirtChange');
						});
					} else {
						return _this.change({
							id: '1',
							colorId: '224'
						},
						callback);
					}
				});
			},
			updateTotalInks: function(item) {
				var color, data, key, value, _i, _len, _ref, _ref1, _ref2;
				this.tshirtSidesColors = {
					left: {},
					front: {},
					back: {},
					right: {}
				};
				_ref = window.design.items;
				for (item in _ref) {
					if (!__hasProp.call(_ref, item)) continue;
					data = _ref[item];
					switch (data.itemType) {
					case 'Text':
						_ref1 = data.colorsUsed;
						for (key in _ref1) {
							if (!__hasProp.call(_ref1, key)) continue;
							value = _ref1[key];
							this.tshirtSidesColors[data.shirtSide][value] = true;
						}
						break;
					case 'Clipart':
					case 'Image':
						_ref2 = data.colorsUsed;
						for (key in _ref2) {
							if (!__hasProp.call(_ref2, key)) continue;
							value = _ref2[key];
							if (value.constructor.name === 'Array' || value instanceof Array) {
								for (_i = 0, _len = value.length; _i < _len; _i++) {
									color = value[_i];
									this.tshirtSidesColors[data.shirtSide][color] = true;
								}
							} else {
								this.tshirtSidesColors[data.shirtSide][value] = true;
							}
						}
					}
				}
				this.trigger('updateColors', {
					tshirtSidesColors: this.tshirtSidesColors
				});
				return this;
			},
			_buildUrl: function() {
				var colorParam, sideParam;
				sideParam = this.side.toUpperCase().charAt(0);
				colorParam = this.color.name.replace(/\s/g, '-');
				return "" + window.baseProductURL + "/images/lab_shirts/" + colorParam + "-" + this.id + "-" + sideParam + ".jpg";
			},
			load: function(data, callback) {
				var _this = this;
				if (!data.color.colorId) {
					return Ooshirts.Shirt.getShirtDetail(data.id,
					function(shirt) {
						var color, colorId, colorName, _ref;
						colorName = data.color.name;
						_ref = shirt.colors;
						for (colorId in _ref) {
							color = _ref[colorId];
							data.color = color;
							if (!data.color && !colorName || color.color.toLowerCase() === colorName.toLowerCase()) {
								break;
							}
						}
						return callback(data);
					});
				} else {
					Ooshirts.Serializable.prototype.load.call(this, data);
					return callback(data);
				}
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'Button').inherits(Ooshirts.Widget)({
		elementClass: 'button',
		html: '<a href="#"></a>',
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.on('click.button',
				function(ev) {
					_this.trigger('click', {
						originalEvent: ev
					});
					return false;
				});
				this.element.on('mousedown.button',
				function(ev) {
					_this.trigger('mousedown', {
						originalEvent: ev
					});
					return false;
				});
				this.element.on('mousemove.button',
				function(ev) {
					_this.trigger('mousemove', {
						originalEvent: ev
					});
					return false;
				});
				this.element.on('mouseup.button',
				function(ev) {
					_this.trigger('mouseup', {
						originalEvent: ev
					});
					return true;
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'Dropdown').inherits(Ooshirts.Widget)({
		elementClass: 'dropdown',
		prototype: {
			init: function(attributes) {
				var that, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.selectedClass = 'selected';
				this.prompt = this.element.find('a.dropdown-header');
				this.promptLabel = this.prompt.find('.dropdown-header-text');
				this.options = this.element.find('.dropdown-options ul > .dropdown-option');
				this.optionsList = this.element.find('.dropdown-options ul');
				this.value = this.options.filter("." + this.selectedClass).data('value');
				this.prompt.on('click.dropdown',
				function(ev) {
					return _this.toggle();
				});
				that = this;
				this.optionsList.on('click.dropdown', '.dropdown-option',
				function(ev) {
					ev.preventDefault();
					that._selectOption($(this));
					if (that.isOpened()) {
						return that.toggle();
					}
				});
				this._bindOutsideClick();
				return this;
			},
			refreshData: function() {
				return this.options = this.element.find('.dropdown-options ul > .dropdown-option');
			},
			_bindOutsideClick: function() {
				var _this = this;
				this.element.clickoutside(function() {
					return _this.element.find('.dropdown-options').slideUp('fast');
				});
				return this;
			},
			toggle: function() {
				this.optionsList.parent().toggle('slide', {
					direction: 'up'
				},
				'fast');
				return this;
			},
			setValue: function(value, triggerEvent) {
				var option;
				if (triggerEvent == null) {
					triggerEvent = true;
				}
				this.options = this.element.find('.dropdown-options ul > .dropdown-option');
				option = this.options.filter(function() {
					return $(this).data('value') === value;
				});
				if (option.length) {
					this._selectOption(option, triggerEvent);
				}
				return this;
			},
			isOpened: function() {
				return this.optionsList.is(':visible');
			},
			_selectOption: function(option, triggerEvent) {
				var value;
				if (triggerEvent == null) {
					triggerEvent = true;
				}
				value = option.data('value');
				if (value !== this.value) {
					this.options.filter("." + this.selectedClass).removeClass(this.selectedClass);
					option.addClass(this.selectedClass);
					this.value = value;
					this.promptLabel.text(option.text());
					if (triggerEvent) {
						this.trigger('change', {
							value: value,
							option: option
						});
					}
				}
				return this;
			},
			selectFirst: function() {
				return this._selectOption(this.options.first());
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'DropdownColor').inherits(Ooshirts.Widget.Dropdown)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					multiSelect: false,
					pms: true,
					fullColor: false,
					direction: "down"
				},
				attributes);
				Ooshirts.Widget.Dropdown.prototype.init.apply(this, [attributes]);
				this.colorList = [];
				this.options.off();
				this.currentColor = '#000000';
				this.selectedClass = 'color-selected';
				this.promptLabel = this.prompt.find('.dropdown-header-color');
				this.options = this.element.find('a.regular-color-canvas');
				this.customPMSList = this.element.find('.pantone-colors');
				this.customPMSTooltip = this.element.find('.custom-pms');
				this.fullColorBtn = this.element.find('.full-color-btn');
				this.customPMSTemplate = "<li class=\"color-picker-element pantone-color\">\n    <a class=\"color-picker-canvas pantone-color-canvas\">\n        <span class=\"tooltip-outline\">#PMSColor\n            <span class=\"tooltip-bottom-pointer\">\n                <img class=\"icon icon-bottom-tooltip-indicator\" alt=\"Tooltip pointer\" src=\"assets/images/inv.png\" width=\"12\" height=\"7\">\n            </span>\n        </span>\n    </a>\n</li>";
				this.optionsList = this.element.find('.color-picker');
				if (!this.multipleSelect) {
					this.optionsList.hide();
				}
				if (this.fullColor) {
					this.fullColorBtn.show();
				}
				this._bindHandler();
				this.isFullColorMode = false;
				this.fullColorBtn.on('click',
				function(ev) {
					ev.preventDefault();
					if (_this.isFullColorMode) {
						return _this.reset();
					} else {
						return _this.setFullColor();
					}
				});
				this.setDirection(this.direction);
				return this;
			},
			setDirection: function(direction) {
				if (direction === "up") {
					this.element.addClass("up");
					return this.tooltipDirection = "down";
				} else {
					this.element.removeClass("up");
					return this.tooltipDirection = "up";
				}
			},
			setFullColor: function() {
				this.resetColorList();
				this.isFullColorMode = true;
				this.element.find('a.regular-color-canvas, a.pantone-color-canvas').addClass("disabled").off();
				this.customPMSTooltip.find('.tertiary-button').off();
				this.customPMSList.off();
				this.fullColorBtn.text("SELECT COLOR");
				return this.fullColorBtn.attr("title", "SELECT COLOR");
			},
			reset: function() {
				this.element.find('a.regular-color-canvas, a.pantone-color-canvas').removeClass("disabled").off();
				this.customPMSTooltip.find('.tertiary-button').off();
				this.customPMSList.off();
				this.isFullColorMode = false;
				this.fullColorBtn.text("FULL COLOR");
				this.fullColorBtn.attr("title", "FULL COLOR");
				this.resetColorList();
				return this._bindHandler();
			},
			_bindHandler: function() {
				var that;
				that = this;
				this.options.on('click.dropdowncolor dblclick.dropdowncolor',
				function(ev) {
					ev.preventDefault();
					if (!that.multipleSelect) {
						that._selectOptions($(this));
						return that.toggle();
					} else {
						return that._multipleSelectOptions($(this));
					}
				});
				this.customPMSList.on('click.dropdowncolor', 'a.pantone-color-canvas',
				function(ev) {
					ev.preventDefault();
					if (!that.multipleSelect) {
						return that._selectOptions($(this));
					} else {
						return that._multipleSelectOptions($(this));
					}
				});
				this._bindHoverOnColors();
				if (this.pms) {
					this._bindCustomPMSAddButton();
					return this._bindCustomPMSPlusButton();
				} else {
					return this.element.find('.color-picker-info').add(this.customPMSList).hide();
				}
			},
			resetColorList: function() {
				this.colorList = [];
				this.element.find('.color-selected').removeClass('color-selected');
				return this;
			},
			toggle: function() {
				this.element.find('.color-picker').toggle('slide', {
					direction: this.tooltipDirection
				},
				'fast');
				this.addSelectedColorFlag();
				return this;
			},
			addSelectedColorFlag: function() {
				var colors, hex, side, sideColors, tshirtsidesColors, value, _shirt;
				_shirt = window.design.shirt;
				side = _shirt.side || 'front';
				tshirtsidesColors = _shirt.tshirtSidesColors || {
					'front': {},
					'back': {},
					'left': {},
					'right': {}
				};
				sideColors = tshirtsidesColors[side];
				this.element.find('.color-picker-element a.color-picker-canvas').removeClass('color-selected-flag');
				for (hex in sideColors) {
					value = sideColors[hex];
					colors = this.element.find('.color-picker-element a.color-picker-canvas').not(".color-selected");
					colors.each(function() {
						if (hex === $(this).parents('li').data('value')) {
							$(this).addClass('color-selected-flag');
							return false;
						}
					});
				}
				return this;
			},
			togglePMS: function() {
				return this;
			},
			hidePMS: function() {
				return this;
			},
			showColors: function() {
				this.element.find('.color-picker').show('slide', {
					direction: this.tooltipDirection
				},
				'fast');
				return this;
			},
			hideColors: function() {
				this.element.find('.color-picker').hide('slide', {
					direction: this.tooltipDirection
				},
				'fast');
				return this;
			},
			setColor: function(hexValue, triggerChange) {
				var option;
				if (hexValue == null) {
					hexValue = '#000000';
				}
				if (triggerChange == null) {
					triggerChange = true;
				}
				hexValue = hexValue.replace(/#/g, '');
				option = this.element.find('.color-picker-element').filter(function() {
					if ($(this).data('value').replace(/#/g, '') === hexValue) {
						return $(this);
					}
				});
				if (this.multipleSelect) {
					this._multipleSelectOptions(option.find('> a'));
				} else {
					this._selectOptions(option.find('> a'), triggerChange);
				}
				return this;
			},
			_bindOutsideClick: function() {
				var _this = this;
				if (!this.multipleSelect) {
					this.element.clickoutside(function() {
						return _this.element.find('.color-picker').slideUp('fast');
					});
				}
				return this;
			},
			getCurrentColor: function() {
				return this.currentColor;
			},
			_bindCustomPMSPlusButton: function() {
				var button, _this = this;
				button = new Ooshirts.Widget.Button({
					element: this.customPMSList.find('.secondary-button')
				});
				button.bind('click',
				function() {
					return _this.togglePMS();
				});
				return this;
			},
			_bindCustomPMSAddButton: function() {
				var _this = this;
				this.customPMSTooltip.find('.tertiary-button').on('click.dropdowncolor',
				function(ev) {
					var pmsColor;
					ev.preventDefault();
					pmsColor = _this.customPMSTooltip.find('.input-text-1').val();
					if (pmsColor) {
						return Ooshirts.Pantone.toHex(pmsColor,
						function(data) {
							var hexCode;
							if (data.hex) {
								hexCode = "#" + data.hex.toLowerCase();
								if (window.initialColors[hexCode]) {
									return _this._showErrorMessage("Color exist");
								} else {
									window.initialColors[hexCode] = {
										hex: hexCode,
										pantone: data.pms
									};
									return _this._addNewCustomColor(hexCode, "" + data.pms);
								}
							} else {
								return _this._showErrorMessage("Invalid code");
							}
						});
					}
				});
				return this;
			},
			_showErrorMessage: function(message) {
				var inputBox;
				inputBox = this.customPMSTooltip.find('.input-text-1');
				inputBox.val(message);
				inputBox.css("color", "red");
				return inputBox.one("focus",
				function() {
					$(this).val("");
					return $(this).removeAttr("style");
				});
			},
			_addNewCustomColor: function(newColor, pmsCode) {
				var $newCustomColor, customPMSTemplate;
				customPMSTemplate = this.customPMSTemplate.replace(/#PMSColor/, pmsCode);
				$newCustomColor = $(customPMSTemplate);
				$newCustomColor.data('value', newColor).find('.pantone-color-canvas').css('background-color', newColor).attr('title', pmsCode);
				$('.color-picker .pantone-colors').append($newCustomColor);
				this.customPMSTooltip.find('.input-text-1').val('');
				this.togglePMS();
				this.trigger("colorAdded", {
					color: newColor,
					option: $newCustomColor
				});
				return true;
			},
			_selectOptions: function(option, triggerChange) {
				var value;
				if (triggerChange == null) {
					triggerChange = true;
				}
				this.options.filter("." + this.selectedClass).removeClass(this.selectedClass);
				this.customPMSList.find('.pantone-color-canvas').filter("." + this.selectedClass).removeClass(this.selectedClass);
				option.addClass(this.selectedClass);
				value = option.parent('li').data("value");
				this.promptLabel.css('background-color', value);
				this.currentColor = value;
				if (triggerChange === true) {
					this.trigger('change', {
						value: value
					});
				}
				return this;
			},
			_multipleSelectOptions: function(option) {
				var colorPosition, colorValue;
				colorValue = option.parent('li').data('value');
				if (option.hasClass(this.selectedClass)) {
					colorPosition = $.inArray(colorValue, this.colorList);
					this.colorList.splice(colorPosition, 1);
					option.removeClass(this.selectedClass);
				} else {
					option.addClass(this.selectedClass);
					this.colorList.push(colorValue);
				}
				this.trigger('change', {
					value: this.colorList
				});
				return this;
			},
			_bindHoverOnColors: function() {
				this.element.find('.color-picker-list').on('hover', '.color-picker-canvas',
				function(ev) {
					var indicator, indicatorWidth, tooltip, tooltipWidth;
					tooltip = $(this).find('.tooltip-outline');
					indicator = $(this).find('.tooltip-bottom-pointer');
					indicatorWidth = indicator.width();
					tooltipWidth = tooltip.width();
					tooltip.css('left', -((tooltipWidth / 2) - $(this).width() / 2));
					tooltip.css('top', -(tooltip.outerHeight() + 7));
					return indicator.css('left', tooltipWidth / 2 - indicatorWidth / 2);
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'ExpandPane').inherits(Ooshirts.Widget)({
		elementClass: 'expand-pane',
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.handler = this.element.find('.fieldset-legend');
				this.handler.on('click',
				function(ev) {
					_this.toggle();
					_this.trigger('expand', {
						originalEvent: ev
					});
					return false;
				});
				return this;
			},
			toggle: function() {
				this.element.toggleClass('opened');
				this.trigger('toggle');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'Counter').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.counterNumber = this.element.find('.counter-header-number');
				this.upButton = this.element.find('.counter-header-indicator').first();
				this.downButton = this.element.find('.counter-header-indicator').last();
				this.value || (this.value = 0);
				this.minValue = 0;
				this.maxValue = 10;
				this.counterNumber.html('0');
				this._bindUpCounterButton();
				this._bindDownCounterButton();
				return this;
			},
			getValue: function() {
				return this.value;
			},
			updateValue: function(value) {
				if (value === 1 && this.value === this.maxValue) {
					return false;
				} else if (value === -1 && this.value === this.minValue) {
					return false;
				} else {
					this.value += value;
					this.counterNumber.html(this.value);
					this.trigger('change', {
						value: this.value
					});
				}
				return this;
			},
			setValue: function(number) {
				if (number == null) {
					number = 0;
				}
				number = parseInt(number, 10);
				this.counterNumber.html(number);
				this.value = number;
				return this;
			},
			_bindUpCounterButton: function() {
				var _this = this;
				this.upButton.on('click.counter',
				function(ev) {
					return _this.updateValue(1);
				});
				return false;
			},
			_bindDownCounterButton: function() {
				var _this = this;
				this.downButton.on('click.counter',
				function(ev) {
					return _this.updateValue( - 1);
				});
				return false;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'Checkbox').inherits(Ooshirts.Widget)({
		elementClass: 'checkbox',
		html: '<input type="checkbox">',
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.on('click.checkbox',
				function(ev) {
					ev.stopPropagation();
					_this._triggerChange();
					return;
				});
				return this;
			},
			_triggerChange: function() {
				this.trigger('change', {
					isChecked: this.element.is(':checked')
				});
				return this;
			},
			check: function(triggerChange) {
				if (triggerChange == null) {
					triggerChange = true;
				}
				this.element.attr('checked', true);
				if (triggerChange) {
					this._triggerChange();
				}
				return this;
			},
			uncheck: function(triggerChange) {
				if (triggerChange == null) {
					triggerChange = true;
				}
				this.element.removeAttr('checked');
				if (triggerChange) {
					this._triggerChange();
				}
				return this;
			},
			isChecked: function() {
				return this.element.is(':checked');
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'Slider').inherits(Ooshirts.Widget)({
		elementClass: 'slider',
		html: '<a href="#"></a>',
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					minValue: 0,
					maxValue: 100,
					value: 0,
					range: false
				},
				attributes);
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.slider({
					min: this.minValue,
					max: this.maxValue,
					value: this.value,
					range: this.range
				});
				this.element.on('slidechange',
				function(event, ui) {
					_this.value = ui.value;
					if (!_this.silent) {
						_this.trigger('change', {
							value: _this.value
						});
					}
					return true;
				}).on('slidestop',
				function(event, ui) {
					if (!_this.silent) {
						_this.trigger('stop');
					}
					return true;
				}).on('slide',
				function(event, ui) {
					_this.value = ui.value;
					if (!_this.silent) {
						_this.trigger('slide', {
							value: _this.value
						});
					}
					return true;
				}).on('slidestart',
				function(event, ui) {
					if (!_this.silent) {
						return _this.trigger('start');
					}
				});
				return this;
			},
			setValue: function(value, triggerEvent) {
				if (triggerEvent == null) {
					triggerEvent = true;
				}
				if (triggerEvent === false) {
					this.silent = true;
				}
				this.element.slider("value", value);
				this.silent = false;
				return this;
			},
			setMin: function(value) {
				this.element.slider('option', 'min', value);
				return this;
			},
			setMax: function(value) {
				this.element.slider('option', 'max', value);
				return this;
			},
			resetSlider: function() {
				this.element.slider("value", this.element.slider("option", "min"));
				return this;
			},
			setToMin: function() {
				this.element.slider("value", this.minValue);
				return this;
			},
			disable: function() {
				if (this.value !== 0) {
					this.setValue(0);
				}
				return this.element.slider("disable");
			},
			enable: function() {
				return this.element.slider("enable");
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'TextField').inherits(Ooshirts.Widget)({
		elementClass: 'input-text',
		html: '<a href="#"></a>',
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.on('keyup',
				function(ev) {
					if (ev.keyCode === 13) {
						_this.trigger('submit', {
							value: _this.getValue()
						});
					} else {
						if (_this.getValue() !== _this.oldValue) {
							_this.oldValue = _this.getValue();
							_this.trigger('change', {
								value: _this.oldValue
							});
						}
					}
					return true;
				}).on('keydown',
				function(ev) {
					if (ev.keyCode === 13) {
						ev.preventDefault();
						ev.stopImmediatePropagation();
						return false;
					}
				}).change(function(ev) {
					return _this.trigger('input', {
						value: _this.getValue()
					});
				});
				return this;
			},
			getValue: function() {
				return this.element.val();
			},
			setValue: function(value, triggerEvent) {
				if (triggerEvent == null) {
					triggerEvent = false;
				}
				if (this.element.val() !== value) {
					this.oldValue = value;
					this.element.val(value);
					if (triggerEvent) {
						this.trigger('change', {
							value: this.oldValue
						});
						this.trigger('input', {
							value: this.oldValue
						});
					}
				}
				return this;
			},
			reset: function() {
				this.setValue('');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'TextAreaField').inherits(Ooshirts.Widget)({
		elementClass: 'input-text',
		html: '<a href="#"></a>',
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.on('keyup',
				function(ev) {
					if (_this.getValue() !== _this.oldValue) {
						_this.oldValue = _this.getValue();
						_this.trigger('change', {
							value: _this.oldValue
						});
						_this.trigger('input');
					}
					return true;
				});
				return this;
			},
			getValue: function() {
				return this.element.val();
			},
			setValue: function(value, triggerEvent) {
				if (triggerEvent == null) {
					triggerEvent = false;
				}
				if (this.element.val() !== value) {
					this.oldValue = value;
					this.element.val(value);
					if (triggerEvent) {
						this.trigger('change', {
							value: this.oldValue
						});
					}
				}
				return this;
			},
			reset: function() {
				this.setValue('');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'ScrollPane').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.ie7 = $.browser.ie.lt8;
				if (!this.ie7) {
					this.element.nanoScroller();
				}
				this.content = this.element.find('.content');
				return this;
			},
			repaint: function(scrollTo) {
				if (!this.ie7) {
					this.destroy();
					if (this.element.height() < this.content.height()) {
						this.content.attr('style', '');
						if (scrollTo) {
							this.scrollTo(scrollTo);
						} else {
							this.element.nanoScroller();
						}
					} else {
						this.content.css('overflow-y', 'hidden');
						false;
					}
				}
				return this;
			},
			destroy: function() {
				if (!this.ie7) {
					this.element.children('.pane').remove();
					this.content.css('position', 'relative');
				}
				return this;
			},
			disable: function() {
				if (!this.ie7) {
					this.element.nanoScroller({
						stop: true
					});
				}
				return this;
			},
			scroll: function(to) {
				if (!this.ie7) {
					this.element.nanoScroller({
						scroll: to
					});
				}
				return this;
			},
			scrollTo: function(to) {
				if (!this.ie7) {
					this.element.nanoScroller({
						scrollTo: to
					});
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'ButtonsGroup').inherits(Ooshirts.Widget)({
		elementClass: 'buttons-group',
		prototype: {
			init: function(attributes) {
				var button, _i, _len, _ref, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.activeClass = 'active';
				_ref = this.buttons;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					button = _ref[_i];
					button.bind('click',
					function(ev) {
						return _this.selectButton(ev);
					});
				}
				return this;
			},
			selectButton: function(ev) {
				this.element.find('a').removeClass('active');
				ev.target.element.addClass('active');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'DesignListItem').inherits(Ooshirts.Widget)({
		elementClass: 'tooltip-design-item',
		html: '<li class="tooltip-design-item">\
                <span class="tooltip-design-date italic"></span>\
                <span class="tooltip-design-name"></span>\
                <a class="primary-button right" href="#">Load</a>\
            </li>',
		prototype: {
			init: function(attributes) {
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.find('.tooltip-design-date').text(this.getDate());
				this.element.find('.tooltip-design-name').text(this.itemName);
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('#load-design-email'),
					name: 'loadDesignEmail'
				}));
				return this;
			},
			getDate: function() {
				return $.datepicker.formatDate('mm/dd', new Date(parseInt(this.itemDate) * 1000));
			},
			render: function(parent) {
				Ooshirts.Widget.prototype.render.apply(this, [parent]);
				this.afterRender();
				return this;
			},
			afterRender: function() {
				var _this = this;
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.primary-button'),
					name: 'loadItemButton'
				}));
				return this.loadItemButton.bind('click',
				function() {
					$('#save-first-time-form').hide();
					$('#design-name-label').text(_this.itemName);
					$('#save-design-name').val(_this.itemName);
					$('#design-email-label').text($('.tooltip-paragraph > strong').text());
					$('#save-design-email').val($('.tooltip-paragraph > strong').text());
					$('#save-form').show();
					_this.parent.spinner.show();
					return _this.getShirtData();
				});
			},
			getShirtData: function() {
				var _this = this;
				return Ooshirts.Design.fetch(this.itemId,
				function(data) {
					var that;
					window.design.load(data);
					_this.parent.listForm.hide();
					_this.parent.spinner.hide();
					_this.parent.successMsg.show();
					that = _this;
					return setTimeout(function() {
						that.parent.successMsg.hide();
						that.parent.hide();
						return that.parent.listForm.show();
					},
					2000);
				},
				this);
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'TShirtQuoteItem').inherits(Ooshirts.Widget).includes(Ooshirts.Serializable)({
		html: "<li class=\"t-shirt-item\">\n  <img class=\"left clip-art-image\" alt=\"T-Shirt image\" src=\"\" height=\"69\" width=\"52\">\n  <div class=\"t-shirt-information\">\n    <nav class=\"breadcrumb\">\n      <span class=\"font-color-2 category-name\"></span>\n      <span class=\"font-color-2\">&gt;</span>\n      <span class=\"font-color-2 subcategory-name\"></span>\n    </nav>\n    <span class=\"t-shirt-type\">\n      <strong class=\"t-shirt-name\"></strong>\n      <small class=\"t-shirt-remove\">- <a href=\"#\" title=\"Remove shirt style\">Remove</a></small>\n    </span>\n    <span class=\"t-shirt-price-info\"><strong>$</strong><strong class=\"t-shirt-price\"></strong><span class=\"normal\">/ea</span></span>\n  </div>\n  <ul class=\"t-shirt-size-list\">\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">XS</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-xs\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">S</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-s\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">M</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-m\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">L</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-l\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">XL</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-xl\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">2XL</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-2xl\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">3XL</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-3xl\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n      <span class=\"label\">4XL</span>\n      <input type=\"text\" class=\"input-text-1 t-shirt-size-4xl\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n    <span class=\"label\">5XL</span>\n    <input type=\"text\" class=\"input-text-1 t-shirt-size-5xl\" value=\"0\">\n    </li>\n    <li class=\"t-shirt-size\">\n    <span class=\"label\">6XL</span>\n    <input type=\"text\" class=\"input-text-1 t-shirt-size-6xl\" value=\"0\">\n    </li>\n  </ul>\n</li>",
		elementClass: 't-shirt-item',
		prototype: {
			serializableAttributes: ['name', 'url', 'category', 'subcategory', 'shirtName', 'color', 'colorId', 'id', 'index', 'quantities', 'price', 'sizes'],
			customLoads: ['loadQuantities'],
			init: function(attributes) {
				var field, _i, _len, _ref, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.$image = this.element.find('.clip-art-image');
				this.$category = this.element.find('.t-shirt-information .category-name');
				this.$subcategory = this.element.find('.t-shirt-information .subcategory-name');
				this.$name = this.element.find('.t-shirt-information .t-shirt-name');
				this.$removeLink = this.element.find('.t-shirt-information .t-shirt-remove');
				this.$price = this.element.find('.t-shirt-information .t-shirt-price');
				this.quantities = {
					lrg: 0
				};
				this._setProperties();
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-xs'),
					name: 'extraSmallQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-s'),
					name: 'smallQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-m'),
					name: 'mediumQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-l'),
					name: 'largeQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-xl'),
					name: 'extraLargeQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-2xl'),
					name: 'twoExtraLargeQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-3xl'),
					name: 'threeExtraLargeQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-4xl'),
					name: 'fourExtraLargeQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-5xl'),
					name: 'fiveExtraLargeQuantityField'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.t-shirt-size-6xl'),
					name: 'sixExtraLargeQuantityField'
				}));
				this.extraSmallQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xsml', ev.value);
				});
				this.smallQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('sml', ev.value);
				});
				this.mediumQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('med', ev.value);
				});
				this.largeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('lrg', ev.value);
				});
				this.extraLargeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xlg', ev.value);
				});
				this.twoExtraLargeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xxl', ev.value);
				});
				this.threeExtraLargeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xxxl', ev.value);
				});
				this.fourExtraLargeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xxxxl', ev.value);
				});
				this.fiveExtraLargeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xxxxxl', ev.value);
				});
				this.sixExtraLargeQuantityField.bind('input',
				function(ev) {
					return _this._updateQuantities('xxxxxxl', ev.value);
				});
				this.fields = [this.extraSmallQuantityField, this.smallQuantityField, this.mediumQuantityField, this.largeQuantityField, this.extraLargeQuantityField, this.twoExtraLargeQuantityField, this.threeExtraLargeQuantityField, this.fourExtraLargeQuantityField, this.fiveExtraLargeQuantityField, this.sixExtraLargeQuantityField];
				_ref = this.fields;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					field = _ref[_i];
					field.bind('input',
					function() {
						return _this.trigger('input');
					});
				}
				this._hideAllFields();
				if (this.sizes !== null) {
					this._displayTextFields();
				}
				if (this.name === 'currentShirt') {
					this.$removeLink.remove();
				} else {
					this.$removeLink.find('a').on('click',
					function() {
						return _this.destroy();
					});
				}
				return this;
			},
			destroy: function() {
				this.element.remove();
				this.parent.removeChild(this);
				this.trigger('update', {
					garment: null,
					index: this.index
				});
				this.unbind('update');
				return false;
			},
			getTotalQuantities: function() {
				var index, quantities, totalQuantities, _ref;
				totalQuantities = 0;
				_ref = this.quantities;
				for (index in _ref) {
					quantities = _ref[index];
					totalQuantities += parseInt(quantities);
				}
				return totalQuantities;
			},
			_hideAllFields: function() {
				var field, _i, _len, _ref, _results;
				_ref = this.fields;
				_results = [];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					field = _ref[_i];
					_results.push(field.element.parent().hide());
				}
				return _results;
			},
			_isFieldShow: function(field) {
				return field.element.parent().css("display") !== "none";
			},
			loadQuantities: function(data) {
				var field, fieldValueMap, key;
				this.quantities = data.quantities;
				fieldValueMap = {
					'xsml': this.extraSmallQuantityField,
					'sml': this.smallQuantityField,
					'med': this.mediumQuantityField,
					'lrg': this.largeQuantityField,
					'xlg': this.extraLargeQuantityField,
					'xxl': this.twoExtraLargeQuantityField,
					'xxxl': this.threeExtraLargeQuantityField,
					'xxxxl': this.fourExtraLargeQuantityField,
					'xxxxxl': this.fiveExtraLargeQuantityField,
					'xxxxxxl': this.sixExtraLargeQuantityField
				};
				for (key in fieldValueMap) {
					field = fieldValueMap[key];
					if ((data.quantities != null) && parseInt(data.quantities[key]) && this._isFieldShow(field)) {
						field.setValue(data.quantities[key]);
					} else {
						field.setValue(0);
						if ((this.quantities != null) && this.quantities[key] !== "0") {
							delete this.quantities[key];
						}
					}
				}
				return data;
			},
			toHash: function() {
				return $.extend({
					color: this.color,
					pid: this.id,
					sizes: this.quantities
				},
				this.quantities);
			},
			hasAddedItems: function() {
				var field, _i, _len, _ref;
				_ref = this.fields;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					field = _ref[_i];
					if (~~field.getValue()) {
						return true;
					}
				}
				return false;
			},
			updatePrice: function(price) {
				this.price = price;
				this.$price.text(this.price);
				return this;
			},
			_updateQuantities: function(size, quantity) {
				quantity = ~~quantity;
				this.quantities[size] = ~~quantity;
				this.trigger('update', {
					garment: this.toHash(),
					index: this.index
				});
				return this;
			},
			_setProperties: function() {
				this.$image.attr('src', this.url);
				this.$category.text(this.category);
				this.$subcategory.text(this.subcategory);
				this.$name.text(this.shirtName);
				this.$price.text(this.price || '0');
				return this;
			},
			updateInfo: function() {
				this._setProperties();
				this._hideAllFields();
				this._displayTextFields();
				return this.loadQuantities({
					quantities: this.quantities
				});
			},
			_displayTextFields: function() {
				var maxSize, minSize, size, sizesArray, _i;
				sizesArray = this.sizes.split('-');
				minSize = parseInt(sizesArray[0]);
				maxSize = parseInt(sizesArray[1]);
				this.extraSmallQuantityField.element.closest('ul').removeClass('hasxs hasfourx');
				for (size = _i = minSize; minSize <= maxSize ? _i <= maxSize: _i >= maxSize; size = minSize <= maxSize ? ++_i: --_i) {
					switch (size) {
					case 5:
						this.extraSmallQuantityField.element.closest('ul').addClass('hasxs');
						this.extraSmallQuantityField.element.parent().show();
						break;
					case 6:
						this.smallQuantityField.element.parent().show();
						break;
					case 7:
						this.mediumQuantityField.element.parent().show();
						break;
					case 8:
						this.largeQuantityField.element.parent().show();
						break;
					case 9:
						this.extraLargeQuantityField.element.parent().show();
						break;
					case 10:
						this.twoExtraLargeQuantityField.element.parent().show();
						break;
					case 11:
						this.threeExtraLargeQuantityField.element.parent().show();
						break;
					case 12:
						this.fourExtraLargeQuantityField.element.closest('ul').addClass('hasfourx');
						this.fourExtraLargeQuantityField.element.parent().show();
						break;
					case 13:
						this.fiveExtraLargeQuantityField.element.parent().show();
						break;
					case 14:
						this.sixExtraLargeQuantityField.element.parent().show();
					}
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts.Widget, 'ControlsPanel').inherits(Ooshirts.Widget)({
		elementClass: 'controls-panel',
		html: '<section></section>',
		prototype: {
			init: function(attributes) {
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.panels = {};
				this._addPanels();
				this._initControls();
				this.goTo('tshirtSettings');
				return this;
			},
			_initControls: function() {
				var _this = this;
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#nav-text'),
					name: 'addTextButton'
				}));
				this.addTextButton.bind('click',
				function() {
					window.design.deselectAll();
					return _this.goTo('addText');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#nav-clipart'),
					name: 'addClipArtButton'
				}));
				this.addClipArtButton.bind('click',
				function() {
					window.design.deselectAll();
					window.design.controlsPanel.panels.clipArtCategory.clearCurrentClipart();
					return _this.goTo('clipArtCatList');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#nav-upload'),
					name: 'addImageButton'
				}));
				this.addImageButton.bind('click',
				function() {
					window.design.deselectAll();
					return _this.goTo('uploadImage');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#nav-personalize'),
					name: 'addCustomizationsButton'
				}));
				this.addCustomizationsButton.bind('click',
				function() {
					window.design.deselectAll();
					$(_this).addClass('active');
					return _this.goTo('namesAndNumbers', 'down');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: $('#nav-shirt'),
					name: 'changeShirtSettings'
				}));
				this.changeShirtSettings.bind('click',
				function() {
					window.design.deselectAll();
					return _this.goTo('tshirtSettings', 'down');
				});
				return this;
			},
			_addPanels: function() {
				this.panels.welcome = new Ooshirts.Widget({
					element: $('#empty-section')
				});
				this.panels.addText = new Ooshirts.Widget.AddTextPanel({
					element: $('#add-text')
				});
				this.panels.namesAndNumbers = new Ooshirts.Widget.NamesAndNumbersPanel({
					element: $('#names-and-numbers')
				});
				this.panels.textProperties = new Ooshirts.Widget.TextPropertiesPanel({
					element: $('#text-properties')
				});
				this.panels.textFontFamily = new Ooshirts.Widget.FontFamilyPanel({
					element: $('#text-font-family')
				});
				this.panels.clipArtCatList = new Ooshirts.Widget.ClipArtCategoriesListPanel({
					element: $('#clip-art-categories')
				});
				this.panels.clipArtCategory = new Ooshirts.Widget.ClipArtCategoryPanel({
					element: $('#clip-art-cartegory')
				});
				this.panels.customImageSettings = new Ooshirts.Widget.CustomImageSettingsPanel({
					element: $('#custom-image-settings')
				});
				this.panels.tshirtSettings = new Ooshirts.Widget.TshirtSettingsPanel({
					element: $('#t-shirts-settings')
				});
				this.panels.uploadImage = new Ooshirts.Widget.UploadImagePanel({
					element: $('#upload-image')
				});
				this.panels.tShirtConfirmation = new Ooshirts.Widget.TshirtConfirmationPanel({
					element: $('#t-shirt-confirmation')
				});
				this.panels.changeTShirtStyle = new Ooshirts.Widget.ChangeTShirtStyle({
					element: $('#change-t-shirt-style')
				});
				this.panels.clipArtSettings = new Ooshirts.Widget.ClipArtSettingsPanel({
					element: $('#clip-art-settings')
				});
				this.panels.getQuote = new Ooshirts.Widget.ClipArtSettingsPanel({
					element: $('#get-quote')
				});
				return this;
			},
			goTo: function(panelName, direction) {
				var key, nextPanel, panel, _ref;
				if (direction == null) {
					direction = 'right';
				}
				nextPanel = this.panels[panelName];
				$("#toolbar .active").removeClass('active');
				switch (nextPanel.element.selector) {
				case "#empty-section":
					$("#toolbar .active").removeClass('active');
					break;
				case "#t-shirts-settings":
					$("#nav-shirt").addClass('active');
					break;
				case "#t-shirt-confirmation":
					$("#nav-shirt").addClass('active');
					break;
				case "#change-t-shirt-style":
					$("#nav-shirt").addClass('active');
					break;
				case "#add-text":
					$("#nav-text").addClass('active');
					break;
				case "#text-properties":
					$("#nav-text").addClass('active');
					break;
				case "#text-font-family":
					$("#nav-text").addClass('active');
					break;
				case "#names-and-numbers":
					$("#nav-personalize").addClass('active');
					break;
				case "#clip-art-categories":
					$("#nav-clipart").addClass('active');
					break;
				case "#clip-art-category":
					$("#nav-clipart").addClass('active');
					break;
				case "#clip-art-settings":
					$("#nav-clipart").addClass('active');
					break;
				case "#custom-image-settings":
					$("#nav-upload").addClass('active');
					break;
				case "#upload-image":
					$("#nav-upload").addClass('active');
				}
				if (nextPanel) {
					_ref = this.panels;
					for (key in _ref) {
						if (!__hasProp.call(_ref, key)) continue;
						panel = _ref[key];
						if (! (panel.isVisible() === true && panel !== nextPanel)) {
							continue;
						}
						panel.hide();
						break;
					}
					if ($.browser.ie.lt9) {
						if (!nextPanel.isVisible()) {
							nextPanel.show(10,
							function() {
								if (nextPanel.panelScrollPane) {
									return nextPanel.panelScrollPane.repaint();
								}
							});
						}
					} else {
						if (!nextPanel.isVisible()) {
							nextPanel.show('fade', 'slow',
							function() {
								if (nextPanel.panelScrollPane) {
									return nextPanel.panelScrollPane.repaint();
								}
							});
						}
					}
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'SpreadsheetRow').inherits(Ooshirts.Widget)({
		elementClass: '',
		html: "<tr class=\"last-row\">\n    <td><span class=\"index-number\"></span></td>\n    <td><input type=\"text\" class=\"text name-input\" placeholder=\"Enter Name\" /></td>\n    <td><input type=\"text\" class=\"text number-input\" placeholder=\"Enter #\" /></td>\n    <td>\n\n    </td>\n    <td>\n         <a class=\"delete-btn\">\n             <img src=\"" + window.assetsBaseURL + "assets/images/inv.png\">\n         </a>\n    </td>\n</tr>",
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.dropdownHtml = "<div class=\"dropdown\">\n    <a class=\"dropdown-header dropdown-header-title\">\n        <span class=\"dropdown-header-text\">Select a Product</span>\n        <span class=\"dropdown-header-indicator\">\n           <img src=\"" + window.assetsBaseURL + "assets/images/inv.png\" alt=\"Dropdown arrow\" class=\"icon-bottom-indicator icon\" />\n        </span>\n    </a>\n    <div class=\"dropdown-options\">\n        <ul>\n        </ul>\n    </div>\n</div>";
				this.element.find('.index-number').text(this.index);
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.name-input'),
					name: 'inputName'
				}));
				this.inputName.bind('change',
				function(ev) {
					_this.getData().name = ev.value;
					return _this.element.removeClass("error");
				});
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.number-input'),
					name: 'inputNumber'
				}));
				this.inputNumber.bind('change',
				function(ev) {
					var tempValue;
					tempValue = ev.value.replace(/\D/g, '');
					_this.inputNumber.setValue(tempValue, false);
					_this.getData().number = tempValue;
					return _this.element.removeClass("error");
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find(".delete-btn"),
					name: 'deleteBtn'
				}));
				this.deleteBtn.bind('click',
				function() {
					_this.element.remove();
					return _this.trigger("itemDelete");
				});
				this.bind('newRowAdd', this.onNewRowAdd);
				this.updateDropdown(this.options);
				if (this.data) {
					this.setData(this.data);
				}
				if (!this.isNumberAdded) {
					this.element.find(".number-input").attr("disabled", "true");
				}
				if (!this.isNameAdded) {
					this.element.find(".name-input").attr("disabled", "true");
				}
				return this;
			},
			_buildOptions: function(options) {
				var oneOption, optionHtml, optionsHtml, _i, _len;
				optionsHtml = [];
				for (_i = 0, _len = options.length; _i < _len; _i++) {
					oneOption = options[_i];
					if (this.getData().size === oneOption.value) {
						optionHtml = "<li class=\"dropdown-option\" data-value=\"" + oneOption.value + "\" class=\"selected\">\n<a href=\"#\">" + oneOption.text + "</a>\n</li>";
					} else {
						optionHtml = "<li class=\"dropdown-option\" data-value=\"" + oneOption.value + "\">\n<a href=\"#\">" + oneOption.text + "</a>\n</li>";
					}
					optionsHtml.push(optionHtml);
				}
				return optionsHtml.join(' ');
			},
			render: function(parent) {
				Ooshirts.Widget.prototype.render.apply(this, [parent]);
				this.afterRender();
				return this;
			},
			afterRender: function() {
				return this;
			},
			onNewRowAdd: function() {
				return this.element.removeClass('last-row');
			},
			setData: function(data) {
				this.data = $.extend({},
				data);
				if (data.name) {
					this.inputName.setValue(data.name);
				}
				if (data.number) {
					this.inputNumber.setValue(data.number);
				}
				if (this.selectProduct) {
					if (data.size) {
						return this.selectProduct.setValue(data.size, false);
					} else {}
				}
			},
			getData: function() {
				return this.data || (this.data = {
					name: "",
					number: "",
					size: ""
				});
			},
			hasData: function() {
				return this.data.name || this.data.number || this.data.size;
			},
			isLastRow: function() {
				return this.element.hasClass('last-row');
			},
			updateDropdown: function(options) {
				var dropdown, _this = this;
				if (options) {
					this.options = options;
					this.element.find('td:eq(3)').empty();
					this.selectProduct = null;
					dropdown = $(this.dropdownHtml);
					dropdown.find('.dropdown-options ul').append(this._buildOptions(options));
					this.element.find('td:eq(3)').append(dropdown);
					this.addChild(new Ooshirts.Widget.Dropdown({
						element: this.element.find('.dropdown'),
						name: 'selectProduct'
					}));
					this.selectProduct.bind('change',
					function(ev) {
						_this.getData().size = ev.value;
						return _this.selectProduct.element.trigger("change");
					});
					return this.setData(this.data);
				}
			},
			error: function() {
				return this.element.addClass("error");
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'MessageBox').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.close-box'),
					name: 'closeButton'
				}));
				this.closeButton.bind('click',
				function() {
					return _this.hide();
				});
				this.hide();
				this.messageArea = this.element.find(".dialog-contents");
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				this.bind('show',
				function() {
					return _this.panelScrollPane.repaint();
				});
				return this;
			},
			showMessage: function(msg) {
				this.messageArea.html("<p>" + msg + "</p>");
				return this.show();
			},
			showMsg: function(messages) {
				var message, _i, _len, _messages;
				if (messages) {
					this.messageArea.empty();
					_messages = [];
					if (Object.prototype.toString.call(messages) === '[object Array]') {
						for (_i = 0, _len = messages.length; _i < _len; _i++) {
							message = messages[_i];
							_messages.push("<p>" + message + "</p>");
						}
					} else {
						_messages.push('<p>' + messages + '</p>');
					}
					this.messageArea.append(_messages.join(''));
				}
				this.show();
				return this.trigger('show');
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'CustomImageSettingsPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.currentFloodfillColor = '#000000';
				this.floodfillOptions = this.element.find('.floodfill-options');
				this.customImage = this.element.find('.big-thumbnail-frame > img');
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.flip-custom-image'),
					name: 'flipButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.flop-custom-image'),
					name: 'flopButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#remove_white'),
					name: 'removeWhiteButton'
				}));
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.custom-image-setting-option .dropdown'),
					name: 'makeOneColorPicker'
				}));
				this.addChild(new Ooshirts.Widget.Checkbox({
					element: this.element.find('#floodfill'),
					name: 'floodfillCheckbox'
				}));
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.floodfill-color-picker'),
					name: 'floodfillColorPicker'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.floodfill-button'),
					name: 'floodfillButton'
				}));
				this.flipButton.bind('click',
				function(ev) {
					return _this.currentImage.flip();
				});
				this.flopButton.bind('click',
				function(ev) {
					return _this.currentImage.flop();
				});
				this.removeWhiteButton.bind('click',
				function() {
					return _this.currentImage.makeTransparent();
				});
				this.makeOneColorPicker.bind('change',
				function(ev) {
					return _this.currentImage.makeOneColor(ev.value);
				});
				this.floodfillCheckbox.uncheck();
				this.floodfillCheckbox.bind('change',
				function(ev) {
					if (ev.isChecked) {
						return _this.floodfillOptions.addClass('enabled');
					} else {
						_this.floodfillOptions.removeClass('enabled');
						if (_this.currentImage.floodFillCmd) {
							return _this.currentImage.floodFillCmd.unexecute(function(cmd) {
								_this.currentImage.removeColor('floddfill');
								return window.collaboration.itemFloodFilled(_this.currentImage.id, _this.currentImage.url, cmd.item.size.width, cmd.item.size.height);
							});
						}
					}
				});
				this.floodfillColorPicker.bind('change',
				function(ev) {});
				this.floodfillButton.bind('click',
				function(ev) {
					return _this._floodFillImage();
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.new-floodfill-button'),
					name: 'newFloodfillButton'
				}));
				this.newFloodfillButton.bind('click',
				function(ev) {
					_this.imageFloodfill || (_this.imageFloodfill = window.design.dialogsManager.imageFloodfill);
					_this.imageFloodfill.setImageItem(_this.currentImage);
					return _this.imageFloodfill.show();
				});
				this.element.find(".dropdown-wrap-0").hide();
				this.element.find(".edit-link").click(function() {
					return _this.currentImage.customizeColors(true);
				});
				this.element.find(".add-link").click(function() {
					return _this.currentImage.customizeColors(true);
				});
				return this;
			},
			_floodFillImage: function() {
				var _this = this;
				this.currentImage.prepareFloodFill(function(x, y) {
					return _this.currentImage.floodFill(x, y, _this.floodfillColorPicker.getCurrentColor());
				});
				return this;
			},
			_setAttributeToCurrentItem: function(attr, val) {
				return this.currentImage[attr] = val;
			},
			setPropertiesFor: function(item) {
				var allColors, color, colorShow, colorTemplate, whiteClass, _i, _len;
				this.currentImage = item;
				if (item.color) {
					this.makeOneColorPicker.setColor(item.color, false);
					this.makeOneColorPicker.element.addClass('enabled');
				} else {
					this.makeOneColorPicker.element.removeClass('enabled');
				}
				if (item.floodFilled) {
					this.floodfillCheckbox.check(false);
					this.floodfillOptions.addClass('enabled');
				} else {
					this.floodfillCheckbox.uncheck(false);
					this.floodfillOptions.removeClass('enabled');
				}
				allColors = item.getAllColors();
				if (item.isFullColor()) {
					this.element.find(".edit-colors-panel").hide();
					this.element.find(".add-colors-panel").hide();
					this.element.find(".full-colors-panel").show();
				} else if (allColors.length > 0) {
					colorShow = this.element.find(".edit-colors-panel .color-picker-list");
					colorShow.empty();
					for (_i = 0, _len = allColors.length; _i < _len; _i++) {
						color = allColors[_i];
						whiteClass = "";
						if (color.toLowerCase() === "#ffffff" || color.toLowerCase() === "#fff") {
							whiteClass = "white";
						}
						colorTemplate = "<li class=\"color-picker-element regular-color " + whiteClass + "\">\n    <a class=\"color-picker-canvas regular-color-canvas\" style=\"background-color: " + color + ";\"></a>\n</li>";
						colorShow.append(colorTemplate);
					}
					this.element.find(".edit-colors-panel").show();
					this.element.find(".add-colors-panel").hide();
					this.element.find(".full-colors-panel").hide();
				} else {
					this.element.find(".edit-colors-panel").hide();
					this.element.find(".add-colors-panel").show();
					this.element.find(".full-colors-panel").hide();
				}
				this.setImage(this.customImage, item.url);
				return this;
			},
			setImage: function(image, src) {
				var frame, that;
				that = this;
				frame = {
					width: 80,
					height: 80
				};
				image.hide().attr({
					src: '',
					width: '',
					height: ''
				}).load(function() {
					var img;
					img = that.setImageSize(this, frame);
					return $(img).show();
				}).prop('src', src);
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	var __slice = [].slice;
	Class(Ooshirts.Widget, 'ClipArtCategoriesListPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.categoriesList = this.element.find('.categories-list');
				this.dropdownOptions = this.element.find('.clipart-categories-dropdown .dropdown-options > ul');
				this.temporalLinks = this.element.find('.category-link');
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('#search-clip-art-category'),
					name: 'searchTextField'
				}));
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('.clipart-categories-dropdown'),
					name: 'categoryDropdown'
				}));
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.clipart-color-dropdown'),
					name: 'clipartColorDropdown'
				}));
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				this.panelScrollPane.element.bind('load',
				function() {
					return _this.panelScrollPane.repaint();
				});
				this.categoryDropdown.bind('change',
				function(ev) {
					_this.getClipArtCategoryPanel().resetPanel();
					_this.getClipArtCategoryPanel().setCategory(ev.value);
					_this.getClipArtCategoryPanel().generateSubCategoryList(_this.categories[ev.value].s);
					return window.design.controlsPanel.goTo('clipArtCategory');
				});
				this.clipartColorDropdown.bind('change',
				function(ev) {
					_this.getClipArtCategoryPanel().clipartColorDropdown.setColor(_this.clipartColorDropdown.getCurrentColor(), false);
					return _this._generateCatList();
				});
				this.searchTextField.bind('submit',
				function(ev) {
					return _this._triggerSearch(ev.target.element[0].value);
				});
				this.bind('show',
				function() {
					_this._generateCatList();
					return _this.panelScrollPane.element.trigger('load');
				});
				return this;
			},
			getClipArtCategoryPanel: function() {
				return this.clipArtCategoryPanel || (this.clipArtCategoryPanel = window.design.controlsPanel.panels.clipArtCategory);
			},
			getColorDropdown: function() {
				return this.clipartColorDropdown.getCurrentColor().replace(/#/, '');
			},
			_generateCatList: function() {
				var _this = this;
				if (this.categories) {
					this._createCatListMarkUp(this.categories);
				} else {
					this.searchRequest = $.getJSON('http://www.ooshirts.com/lab/clipartcategories.php?images',
					function(data) {
						var category, _i, _len;
						_this.categories = {};
						for (_i = 0, _len = data.length; _i < _len; _i++) {
							category = data[_i];
							_this.categories[category.n] = category;
						}
						window.clipart = _this.categories;
						return _this._createCatListMarkUp(_this.categories);
					});
				}
				return true;
			},
			_createCatListMarkUp: function(categories) {
				var category, categoryItemTemplate, createCategoryDropdownOptions, key, that;
				that = this;
				this.categoriesList.empty();
				createCategoryDropdownOptions = this.dropdownOptions.find('li').length === 0;
				for (key in categories) {
					category = categories[key];
					if (createCategoryDropdownOptions) {
						categoryItemTemplate = "<li class=\"dropdown-option\" data-value=\"" + category.n + "\"><a href=\"#\">" + category.n + "</a></li>";
						this.dropdownOptions.append(categoryItemTemplate);
					}
					categoryItemTemplate = "<li class=\"category-item\" data-value=\"" + category.n + "\">\n    <a href=\"#\" class=\"category-link\">\n         <img data-original=\"http://ooshirts-clipart.s3.amazonaws.com/ooo" + category.p + "-" + (this.getColorDropdown()) + ".gif\" src=\"" + assetsBaseURL + "assets/images/inv.png\" alt=\"" + category.n + "\" class=\"category-image\" />\n    </a>\n    <span class=\"category-title\">" + category.n + "</span>\n</li>";
					this.categoriesList.append(categoryItemTemplate);
				}
				this.categoriesList.find('li:nth-child(3n+1)').addClass('first-row-element');
				that = this;
				this.imageLoad(function() {
					return that.setImageSize(this);
				});
				if (this.isVisible()) {
					this.panelScrollPane.element.trigger('load');
				}
				this._bindCategoriesListItems();
				return true;
			},
			imageLoad: function(callback) {
				this.categoriesList.find('img').each(function() {
					var self;
					self = $(this);
					if (self.attr('data-original')) {
						return self.attr("src", self.attr('data-original'));
					}
				});
				if (callback) {
					return callback.apply(this);
				}
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				frame = {
					width: 80,
					height: 80
				};
				width = image.width;
				height = image.height;
				if ($.browser.msie || $.browser.safari) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			},
			_bindCategoriesListItems: function() {
				var that;
				that = this;
				this.categoriesList.off();
				this.categoriesList.on('click', '.category-item',
				function(ev) {
					var category;
					ev.preventDefault();
					if (this.searchRequest) {
						this.searchRequest.abort();
					}
					category = $(this).data('value');
					that.getClipArtCategoryPanel().resetPanel();
					that.getClipArtCategoryPanel().setCategory(category);
					that.getClipArtCategoryPanel().generateSubCategoryList(that.categories[category].s);
					return window.design.controlsPanel.goTo('clipArtCategory');
				});
				return true;
			},
			_triggerSearch: function(keywords) {
				this.getClipArtCategoryPanel().hideCategoriesDropdown();
				this.getClipArtCategoryPanel().category = 'Search';
				this.getClipArtCategoryPanel().generateItems(keywords);
				window.design.controlsPanel.goTo('clipArtCategory');
				return true;
			},
			show: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = Ooshirts.Widget.prototype.show).call.apply(_ref, [this].concat(__slice.call(args)));
				this.trigger('show');
				return this;
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts.Widget, 'TshirtConfirmationPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var that, tshirtPhotosDialog, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.currentShirt = window.design.shirt;
				this.newShirt = {};
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#back-to-style'),
					name: 'backToTshirtStyleBtn'
				}));
				this.backToTshirtStyleBtn.bind('click',
				function() {
					return window.design.controlsPanel.goTo('changeTShirtStyle', 'left');
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#change-tshirt-btn'),
					name: 'changeTshirtBtn'
				}));
				this.changeTshirtBtn.bind('click',
				function() {
					return window.design.shirt.change({
						id: _this.newShirt.id.toString(),
						colorId: _this.newShirt.color.id.toString(),
						categoryId: _this.newShirt.categoryId,
						subcategoryId: _this.newShirt.subcategoryId
					},
					function() {
						window.design.controlsPanel.panels.tshirtSettings.renderShirt();
						return window.design.controlsPanel.goTo('tshirtSettings', 'right');
					});
				});
				this.addChild(new Ooshirts.Widget.ExpandPane({
					element: this.element.find('.t-shirt-pictures'),
					name: 'tshirtsPicturePane'
				}));
				this.tshirtsPicturePane.bind('expand',
				function() {
					return _this.panelScrollPane.repaint();
				});
				this.addChild(new Ooshirts.Widget.ExpandPane({
					element: this.element.find('.t-shirt-details'),
					name: 'tshirtsDetailsPane'
				}));
				this.tshirtsDetailsPane.bind('expand',
				function() {
					return _this.panelScrollPane.repaint();
				});
				that = this;
				this.element.find('.t-shirt-picture-link').on('click',
				function(ev) {
					that.newTshirtPhotosDialog.showPhoto($(this).data('type'));
					that.newTshirtPhotosDialog.show();
					return false;
				});
				tshirtPhotosDialog = $('.tshirt-photos').clone().prependTo('#dialog-container');
				this.newTshirtPhotosDialog = new Ooshirts.Dialog.TshirtPhotos({
					element: $('.tshirt-photos:first-child')
				});
				this.newTshirtPhotosDialog.bind('show',
				function() {
					if (!this.scrollPane) {
						return this.addChild(new Ooshirts.Widget.ScrollPane({
							element: $('#photo-side-gallery.nano'),
							name: 'scrollPane'
						}));
					}
				});
				return this;
			},
			_bindColorSquareClick: function() {
				var that;
				that = this;
				return this.element.find('.color-picker-canvas').on('click',
				function(ev) {
					$(this).addClass('color-selected');
					$(this).parent().siblings().children().removeClass('color-selected');
					that.newShirt.color = {
						id: $(this).data('id'),
						name: $(this).data('color'),
						hexcode: $(this).data('hex')
					};
					return false;
				});
			},
			setShirtProperties: function(productId) {
				var _this = this;
				Ooshirts.Shirt.all(function(data) {
					var category, color, key, newShirt, product, subcategory, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
					newShirt = null;
					for (_i = 0, _len = data.length; _i < _len; _i++) {
						category = data[_i];
						_ref = category.subcategories;
						for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
							subcategory = _ref[_j];
							_ref1 = subcategory.products;
							for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
								product = _ref1[_k];
								if (product.id === productId.toString()) {
									newShirt = $.extend(product, {
										categoryId: category.id,
										subcategoryId: subcategory.id
									});
								}
							}
						}
					}
					if (newShirt) {
						_this.newShirt.name = newShirt.name;
						_this.newShirt.id = newShirt.id;
						_this.newShirt.category = newShirt.category;
						_this.newShirt.categoryId = newShirt.categoryId;
						_this.newShirt.subcategoryId = newShirt.subcategoryId;
						_this.newShirt.subcategory = newShirt.subcategory;
						_this.newShirt.description = newShirt.description;
						_this.newShirt.materials = newShirt.materials;
						_this.newShirt.availableColors = newShirt.colors;
						_this.newShirt.url = "http://www.ooshirts.com/products/" + newShirt.id + "/front.jpg";
						_ref2 = newShirt.colors;
						for (key in _ref2) {
							if (!__hasProp.call(_ref2, key)) continue;
							color = _ref2[key];
							break;
						}
						return _this.newShirt.color = {
							id: color.id,
							name: color.color,
							hexcode: color.hex
						};
					}
				});
				this._renderShirt(this.newShirt);
				this.newTshirtPhotosDialog.tshirtID = this.newShirt.id;
				this.newTshirtPhotosDialog.renderPhotos();
				this._bindColorSquareClick();
				return this;
			},
			_renderShirt: function(newShirt) {
				var color, colorElement, key, photoTypes, type, _i, _len, _ref;
				this.element.find('.t-shirt-category').text(newShirt.category);
				this.element.find('.t-shirt-type').text(newShirt.name);
				this.setImage(this.element.find('.tshirt-big-thumbnail-image'), newShirt.url);
				this.element.find('.t-shirt-details-information').html(newShirt.description + "</br></br>" + newShirt.materials);
				this.element.find('.color-picker-list').empty();
				_ref = newShirt.availableColors;
				for (key in _ref) {
					if (!__hasProp.call(_ref, key)) continue;
					color = _ref[key];
					if (color.id === this.newShirt.color.id) {
						colorElement = "<li class=\"color-picker-element regular-color\">\n    <a class=\"color-picker-canvas regular-color-canvas color-selected\" data-id=\"" + color.id + "\" data-color=\"" + color.color + "\" data-hex=\"" + color.hex + "\" style=\"background-color: #" + color.hex + ";\" title=\"" + color.color + "\"></a>\n</li>";
					} else {
						colorElement = "<li class=\"color-picker-element regular-color\" data-value=\"" + color.id + "\">\n    <a class=\"color-picker-canvas regular-color-canvas\" data-id=\"" + color.id + "\" data-color=\"" + color.color + "\" data-hex=\"" + color.hex + "\" style=\"background-color: #" + color.hex + ";\" title=\"" + color.color + "\"></a>\n</li>";
					}
					this.element.find('.color-picker-list').append(colorElement);
				}
				photoTypes = ['front', 'back', 'catalog', 'collar', 'sleeve', 'sleevecloseup'];
				for (_i = 0, _len = photoTypes.length; _i < _len; _i++) {
					type = photoTypes[_i];
					this.setImage(this.element.find(".clip-art-image-" + type), "http://www.ooshirts.com/products/" + this.newShirt.id + "/" + type + ".jpg");
				}
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				return this;
			},
			setImage: function(image, src) {
				var frameDetail, frameThubmnail, that;
				that = this;
				frameThubmnail = {
					width: 84,
					height: 94
				};
				frameDetail = {
					width: 26,
					height: 26
				};
				image.hide().attr({
					src: '',
					width: '',
					height: ''
				}).load(function() {
					if (this.className === 'tshirt-big-thumbnail-image') {
						that.setImageSize(this, frameThubmnail);
						that.positionImage($(this), frameThubmnail);
					} else {
						that.setImageSize(this, frameDetail);
						that.positionImage($(this), frameDetail);
					}
					return $(image).show();
				}).prop('src', src);
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						height = frame.height;
						width = height * imageRatio;
					} else {
						width = frame.width;
						height = width / imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			positionImage: function(image, frame) {
				if (frame == null) {
					frame = {};
				}
				image.css({
					'top': Math.round((frame.height - image.outerHeight()) / 2),
					'left': Math.round((frame.width - image.outerWidth()) / 2)
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	var __slice = [].slice;
	Class(Ooshirts.Widget, 'ChangeTShirtStyle').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				Ooshirts.Shirt.all(function(data) {
					return _this.tshirtsData = data;
				});
				this.tshirtStyleList = this.element.find('.t-shirt-style-list');
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#back-to-settings'),
					name: 'backToTshirtSettingsBtn'
				}));
				this.backToTshirtSettingsBtn.bind('click',
				function() {
					return window.design.controlsPanel.goTo('tshirtSettings', 'left');
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#tshirt-styles-dropdown'),
					name: 'tshirtStylesDropdown'
				}));
				this.renderTshirtStylesDropdown();
				this.panelScrollPane.element.bind('load',
				function() {
					return _this.panelScrollPane.repaint();
				});
				this.renderTshirtProducts(window.design.shirt.id);
				this._bindImageThumbnailClick();
				this.tshirtStylesDropdown.bind('change',
				function(ev) {
					return _this.renderTshirtProducts(ev.value);
				});
				this.bind('show',
				function() {
					return _this.panelScrollPane.element.trigger("load");
				});
				return this;
			},
			_bindImageThumbnailClick: function() {
				var that;
				that = this;
				this.element.on('click', '.t-shirt-style-link',
				function(ev) {
					var productid;
					productid = $(this).data('productid');
					Ooshirts.Shirt.getShirtDetail(productid,
					function() {
						window.design.controlsPanel.goTo('tShirtConfirmation', 'right');
						return window.design.controlsPanel.panels.tShirtConfirmation.setShirtProperties(productid);
					});
					return false;
				});
				return this;
			},
			renderTshirtStylesDropdown: function() {
				var listOption, style, _i, _len, _ref;
				_ref = this.tshirtsData;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					style = _ref[_i];
					listOption = "<li class='dropdown-option' data-value= " + style.id + "><a href='#'>" + style.name + "</a></li>";
					this.element.find('.dropdown-options ul').append(listOption);
				}
				return this;
			},
			renderTshirtProducts: function(id) {
				var category, imageTemplate, product, subcategories, that, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
				this.tshirtStyleList.empty();
				_ref = this.tshirtsData;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					category = _ref[_i];
					if (category.id === id.toString()) {
						_ref1 = category.subcategories;
						for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
							subcategories = _ref1[_j];
							_ref2 = subcategories.products;
							for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
								product = _ref2[_k];
								imageTemplate = "<li class='t-shirt-style'>\n    <p class='clip-art-image'>\n        <a href='#' class='t-shirt-style-link' data-productid='" + product.id + "'>\n            <img alt='" + product.id + "' title='" + product.name + "' data-original='" + baseProductURL + "/products/" + product.id + "/front.jpg' src='" + assetsBaseURL + "assets/images/inv.png' />\n        </a>\n    </p>\n    <span class='t-shirt-style-name'>" + product.name + "</span>\n</li>";
								this.tshirtStyleList.append(imageTemplate);
							}
						}
					}
				}
				this.tshirtStyleList.find('li:nth-child(3n+1)').addClass('first-row-element');
				that = this;
				if (this.isVisible()) {
					this.panelScrollPane.element.trigger("load");
				}
				return this;
			},
			setImageSize: function(image) {
				var frame, frameRatio, height, imageRatio, natural, width;
				frame = {
					width: 84,
					height: 94
				};
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						height = frame.height;
						width = height * imageRatio;
					} else {
						width = frame.width;
						height = width / imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			positionImage: function(image) {
				var frame;
				frame = {
					width: 84,
					height: 94
				};
				image.css({
					'top': Math.round((frame.height - image.outerHeight()) / 2),
					'left': Math.round((frame.width - image.outerWidth()) / 2)
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			},
			show: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = Ooshirts.Widget.prototype.show).call.apply(_ref, [this].concat(__slice.call(args)));
				this.trigger('show');
				return this;
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts.Widget, 'ClipArtCategoryPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.categoryLabel = this.element.find('.panel-header h2');
				this.categoryList = this.element.find('.categories-list');
				this.categoryDropdownOptions = this.element.find('.dropdown-options');
				this.categoryDropdownHeader = this.element.find('.dropdown-header-text');
				this.search = this.element.find('.clip-art-search');
				this.scrollWrapper = this.element.find('.scroll-wrapper');
				this.breadcrumbs = this.element.find('.clip-art-breadcrumbs');
				this.breadcrumbsCategory = this.element.find('.clip-art-breadcrumbs-category');
				this.breadcrumbsArrow = this.element.find('.clip-art-breadcrumbs-arrow');
				this.breadcrumbsSubcategory = this.element.find('.clip-art-breadcrumbs-subcategory');
				this.currentMode = 'subCategory';
				this.currentKeywords = '';
				this.elements = [];
				this.currentPage = 1;
				this.isEnd = false;
				this.extension = '.gif';
				this.dropdownOptions = this.element.find('.clipart-categories-dropdown .dropdown-options > ul');
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.back-button'),
					name: 'backButton'
				}));
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('.clipart-categories-dropdown'),
					name: 'categoryDropdown'
				}));
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.clipart-color-dropdown'),
					name: 'clipartColorDropdown'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.clip-art-search-link'),
					name: 'clipartSearchLink'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#expand-btn'),
					name: 'expand'
				}));
				this.isExtand = false;
				this.expand.bind('click',
				function() {
					return _this.onExpand();
				});
				this.clipartSearchLink.bind('click',
				function() {
					_this._triggerSearch(_this.breadcrumbsCategory.html());
					return false;
				});
				this.clipartColorDropdown.bind('change',
				function(ev) {
					_this.getClipArtCatListPanel().clipartColorDropdown.setColor(_this.clipartColorDropdown.getCurrentColor());
					if (_this.currentMode === 'subCategory') {
						return _this.generateSubCategoryList(_this.categories[_this.category].s);
					} else {
						return _this.generateItems(_this.currentKeywords);
					}
				});
				this.categoryDropdown.bind('change',
				function(ev) {
					return _this.generateItems(ev.value);
				});
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('#search-clip-art'),
					name: 'searchTextField'
				}));
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.scroll-wrapper'),
					name: 'scrollPane'
				}));
				this.scrollPane.element.bind('load',
				function() {
					var scrollTo;
					if (_this.currentPage === 1) {
						return _this.scrollPane.repaint();
					} else {
						scrollTo = _this.categoryList.find(".page" + _this.currentPage, 'li').first();
						return _this.scrollPane.repaint(scrollTo);
					}
				});
				this.scrollPane.element.debounce('scrollend',
				function() {
					var clipArt, end, expandClass, extension, index, itemTemplate, start, tempData;
					if (_this.isEnd) {
						return false;
					}
					tempData = [];
					expandClass = "";
					extension = '.gif';
					if (_this.isExpand) {
						expandClass = "expand";
						extension = '.png';
					}
					start = _this.currentPage * 30;
					end = (start + 30) > _this.elements.length ? _this.elements.length: start + 30;
					tempData = (function() {
						var _i, _ref, _results;
						_results = [];
						for (index = _i = start, _ref = end - 1; start <= _ref ? _i <= _ref: _i >= _ref; index = start <= _ref ? ++_i: --_i) {
							_results.push(this.elements[index]);
						}
						return _results;
					}).call(_this);
					_this.currentPage++;
					for (index in tempData) {
						if (!__hasProp.call(tempData, index)) continue;
						clipArt = tempData[index];
						itemTemplate = "<li class=\"subcategory-item " + expandClass + " page" + _this.currentPage + "\"  data-value=\"" + clipArt.name + "\" data-color=\"" + (_this.clipartColorDropdown.getCurrentColor()) + "\">\n<a href=\"#\" class=\"category-link selected\">\n<img data-original=\"http://ooshirts-clipart.s3.amazonaws.com/ooo" + clipArt.name + "-" + (_this.getColorDropdown()) + extension + "\" src=\"" + assetsBaseURL + "assets/images/inv.png\" alt=\"" + clipArt.name + "\" class=\"category-image\" />\n</a>\n</li>";
						_this.categoryList.append(itemTemplate);
					}
					_this.categoryList.find('li:nth-child(3n+1)').addClass('first-row-element');
					if (start === _this.elements.length || end % 30 !== 0) {
						_this.isEnd = true;
					}
					return _this.imageLoad(tempData,
					function() {
						return $(this).parents('li.subcategory-item').draggable({
							helper: 'clone',
							appendTo: '#app-wrap'
						});
					});
				},
				100);
				this.backButton.bind('click',
				function(ev) {
					_this.resetPanel();
					if (ev.target.element.hasClass('toSubcategories') && _this.category !== 'Search') {
						_this.generateSubCategoryList(_this.categories[_this.category].s);
						window.design.controlsPanel.goTo('clipArtCategory', 'left');
					} else {
						_this.setSubcategory();
						window.design.controlsPanel.goTo('clipArtCatList', 'left');
					}
					return false;
				});
				this.searchTextField.bind('submit',
				function(ev) {
					if ((ev.value != null) && ev.value !== '') {
						_this._clearSearchResults();
						_this.generateItems(ev.value);
						return _this.hideCategoriesDropdown();
					} else {
						return false;
					}
				});
				this._bindSubCategoryList();
				this._bindItemList();
				$('#tshirt').droppable({
					activeClass: "ui-state-default",
					hoverClass: "ui-state-hover",
					accept: "li.subcategory-item",
					drop: function(event, ui) {
						var clone, color, name;
						clone = ui.helper;
						color = clone.data("color");
						name = clone.data("value");
						return _this._appendToDesign(name, color);
					}
				});
				return this;
			},
			onExpand: function() {
				var expandWidth, width, _this = this;
				width = 327;
				expandWidth = 760;
				if (!this.isExpand) {
					this.element.animate({
						width: expandWidth
					},
					function() {
						return _this.scrollPane.repaint();
					});
					this.element.find(".subcategory-item img").each(function() {
						var height, i, nowSrc, originSrc;
						originSrc = $(this).attr("data-original");
						i = originSrc.indexOf(".gif");
						nowSrc = originSrc.substr(0, i) + ".png";
						$(this).attr("data-original", nowSrc);
						width = $(this).attr("width");
						height = $(this).attr("height");
						if ($.browser.msie) {
							nowSrc = nowSrc + '?' + Date.parse(new Date());
							width = $(this).width();
							height = $(this).height();
						}
						$(this).attr("src", nowSrc);
						$(this).attr("width", 3 * width);
						return $(this).attr("height", 3 * height);
					});
					this.element.find(".subcategory-item").addClass("expand");
					return this.isExpand = true;
				} else {
					this.element.animate({
						width: width
					},
					function() {
						return _this.scrollPane.repaint();
					});
					this.element.find(".subcategory-item img").each(function() {
						var height, i, nowSrc, originSrc;
						originSrc = $(this).attr("data-original");
						i = originSrc.indexOf(".png");
						nowSrc = originSrc.substr(0, i) + ".gif";
						$(this).attr("data-original", nowSrc);
						width = $(this).attr("width");
						height = $(this).attr("height");
						if ($.browser.msie) {
							nowSrc = nowSrc + '?' + Date.parse(new Date());
							width = $(this).width();
							height = $(this).height();
						}
						$(this).attr("src", nowSrc);
						$(this).attr("width", width / 3);
						return $(this).attr("height", height / 3);
					});
					this.element.find(".subcategory-item").removeClass("expand");
					return this.isExpand = false;
				}
			},
			getClipArtCatListPanel: function() {
				return this.clipArtCatListPanel || (this.clipArtCatListPanel = window.design.controlsPanel.panels.clipArtCatList);
			},
			showCategoriesDropdown: function() {
				this.categoryDropdown.show();
				this.categoryLabel.show();
				return this;
			},
			hideCategoriesDropdown: function() {
				this.categoryDropdown.hide();
				this.categoryLabel.hide();
				return this;
			},
			setCurrentItem: function(selectedItem) {
				if (selectedItem != null) {
					this.currentClipArt = selectedItem;
				} else {
					this.currentClipArt = null;
				}
				return this;
			},
			clearCurrentClipart: function() {
				this.currentClipArt = void 0;
				return this;
			},
			resetPanel: function() {
				if (this.searchRequest) {
					this.searchRequest.abort();
				}
				this.searchTextField.element.val('');
				this._clearSearchResults();
				this.categoryDropdownOptions.find('ul > li').remove();
				this.imageDefaultColor = '000000';
				this.expand.hide();
				if (this.isExpand) {
					this.onExpand();
				}
				return this;
			},
			generateSubCategoryList: function(subcategories) {
				var dropdownCategoryOptionTemplate, index, item, subCategory, subCategoryItemTemplate, tempData, _i, _j, _len, _len1, _ref;
				this.currentMode = 'subCategory';
				$('.categories-list').addClass('loader');
				this.categoryDropdownHeader.text(this.category);
				this.breadcrumbsCategory.html(this.category);
				this.breadcrumbsArrow.hide();
				this.breadcrumbsSubcategory.hide();
				_ref = window.clipart[this.category].s;
				for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
					item = _ref[index];
					dropdownCategoryOptionTemplate = "<li class=\"dropdown-option\" data-value=\"" + item.n + "\"><a href=\"#\">" + item.n + "</a></li>";
					this.dropdownOptions.append(dropdownCategoryOptionTemplate);
				}
				this.setSubcategory();
				if (!this.categories) {
					this._getCategories();
				}
				this.categoryList.find('li').remove();
				if (typeof keywords !== "undefined" && keywords !== null) {
					this.currentKeywords = encodeURI(keywords);
					$(this.searchTextField.element).val(keywords);
					this.breadcrumbs.hide();
				} else {
					this.breadcrumbs.show();
				}
				this.elements = [];
				tempData = [];
				this.isEnd = false;
				this.elements = subcategories;
				if ($.browser.ie.lt8) {
					if (subcategories.length > 200) {
						tempData = subcategories.splice(0, 200);
					} else {
						tempData = subcategories;
					}
				} else {
					if (subcategories.length > 30) {
						tempData = (function() {
							var _j, _results;
							_results = [];
							for (index = _j = 0; _j <= 29; index = ++_j) {
								_results.push(subcategories[index]);
							}
							return _results;
						})();
					} else {
						tempData = subcategories;
						this.isEnd = true;
					}
				}
				this.categoryList.empty();
				this.currentPage = 1;
				for (_j = 0, _len1 = tempData.length; _j < _len1; _j++) {
					subCategory = tempData[_j];
					subCategoryItemTemplate = "<li class=\"category-item page" + this.currentPage + "\" data-value=\"" + subCategory.n + "\">\n    <a href=\"#\" class=\"category-link\">\n        <img data-original=\"http://ooshirts-clipart.s3.amazonaws.com/ooo" + subCategory.p + "-" + (this.getColorDropdown()) + ".gif\" src=\"" + assetsBaseURL + "assets/images/inv.png\" alt=\"" + subCategory.n + "\" class=\"category-image\" />\n    </a>\n    <span class=\"category-title\">" + subCategory.n + "</span>\n</li>";
					this.categoryList.append(subCategoryItemTemplate);
				}
				this.categoryList.find('li:nth-child(3n+1)').addClass('first-row-element');
				this.imageLoad(tempData);
				$('.categories-list').removeClass('loader');
				return this;
			},
			getColorDropdown: function() {
				return this.clipartColorDropdown.getCurrentColor().replace(/#/, '');
			},
			generateItems: function(keywords) {
				var bkw, _this = this;
				this.currentMode = 'item';
				$('.categories-list').addClass('loader');
				this.categoryList.find('li').remove();
				if (keywords != null) {
					this.currentKeywords = encodeURI(keywords);
					$(this.searchTextField.element).val(keywords);
					this.breadcrumbsCategory.html(window.design.controlsPanel.panels.clipArtCategory.category);
					this.breadcrumbsArrow.show();
					bkw = $.map(keywords.split(' '),
					function(word) {
						return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
					}).join(" ");
					this.breadcrumbsSubcategory.html(bkw).show();
				}
				this.searchRequest = $.ajax({
					url: 'http://www.ooshirts.com/lab/clipartsearch.php?keywords=' + this.currentKeywords,
					dataType: 'json',
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						var clipArt, expandClass, index, itemTemplate, tempData;
						if (data && data.length > 0) {
							expandClass = "";
							_this.isEnd = false;
							_this.elements = [];
							tempData = [];
							if (_this.isExpand) {
								expandClass = "expand";
							}
							_this.elements = data;
							if ($.browser.ie.lt8) {
								if (_this.elements.length > 200) {
									tempData = _this.elements.splice(0, 200);
								} else {
									tempData = _this.elements;
								}
							} else {
								if (_this.elements.length > 30) {
									tempData = (function() {
										var _i, _results;
										_results = [];
										for (index = _i = 0; _i <= 29; index = ++_i) {
											_results.push(this.elements[index]);
										}
										return _results;
									}).call(_this);
								} else {
									tempData = data;
									_this.isEnd = true;
								}
							}
							_this.categoryList.empty();
							_this.currentPage = 1;
							for (index in tempData) {
								if (!__hasProp.call(tempData, index)) continue;
								clipArt = tempData[index];
								itemTemplate = "<li class=\"subcategory-item " + expandClass + " page" + _this.currentPage + "\" data-value=\"" + clipArt.name + "\" data-color=\"" + (_this.clipartColorDropdown.getCurrentColor()) + "\">\n    <a href=\"#\" class=\"category-link selected\">\n        <img data-original=\"http://ooshirts-clipart.s3.amazonaws.com/ooo" + clipArt.name + "-" + (_this.getColorDropdown()) + ".gif\" src=\"" + assetsBaseURL + "assets/images/inv.png\" alt=\"" + clipArt.name + "\" class=\"category-image\" />\n    </a>\n</li>";
								_this.categoryList.append(itemTemplate);
							}
							_this.categoryList.find('li:nth-child(3n+1)').addClass('first-row-element');
							_this.imageLoad(tempData,
							function() {
								return $(this).parents('li.subcategory-item').draggable({
									helper: 'clone',
									appendTo: '#app-wrap'
								});
							});
							_this.searchRequest = null;
							_this.expand.show();
						} else {
							_this.categoryList.append('<li style="text-align:center;padding-top:50px;">No results found.</li>');
						}
						window.design.controlsPanel.goTo('clipArtCategory');
						return $('.categories-list').removeClass('loader');
					}
				});
				return this;
			},
			imageLoad: function(elements, callback) {
				var catList, _this = this;
				if (elements == null) {
					elements = [];
				}
				catList = this.categoryList;
				$(elements).each(function() {
					var img, name, self;
					self = this;
					name = self.n || self.name;
					img = catList.find('img[alt="' + name + '"]');
					if (img && img.attr('data-original')) {
						return img.attr("src", img.attr('data-original'));
					}
				});
				if (callback) {
					callback.apply(this);
				}
				return setTimeout(function() {
					return _this.scrollPane.element.trigger('load');
				},
				0);
			},
			setCategory: function(category) {
				if (category == null) {
					category = '';
				}
				if (category) {
					this.category = category;
				} else {
					this.category = '';
				}
				return this;
			},
			setSubcategory: function(subcategory) {
				if (subcategory == null) {
					subcategory = '';
				}
				if (subcategory) {
					this.subcategory = subcategory;
					this.search.removeClass('subcategories');
					this.backButton.element.addClass('toSubcategories');
				} else {
					this.subcategory = '';
					this.search.addClass('subcategories');
					this.backButton.element.removeClass('toSubcategories');
				}
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				if (this.isExpand) {
					frame = {
						width: 240,
						height: 240
					};
				} else {
					frame = {
						width: 80,
						height: 80
					};
				}
				width = image.width;
				height = image.height;
				if ($.browser.msie || $.browser.safari) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			},
			_bindSubCategoryList: function() {
				var that;
				that = this;
				return this.categoryList.on('click', '.category-item',
				function(ev) {
					var $this, name;
					ev.preventDefault();
					$this = $(this);
					name = $this.data('value') + "";
					that.setSubcategory(name);
					that.generateItems(name);
					return false;
				});
			},
			_bindItemList: function() {
				var that;
				that = this;
				this.categoryList.on('click', '.subcategory-item',
				function(ev) {
					var $this, color, name;
					ev.preventDefault();
					$this = $(this);
					name = $this.data('value');
					color = $this.data('color');
					return that._appendToDesign(name, color);
				});
				return this;
			},
			_appendToDesign: function(name, color) {
				var clipArt;
				if (this.currentClipArt === void 0) {
					clipArt = new Ooshirts.Item.Clipart({
						name: name,
						color: color
					});
					clipArt.appendToDesign();
					return this.resetPanel();
				} else {
					return this.currentClipArt.updateClipArt(name, color);
				}
			},
			_clearSearchResults: function() {
				this.categoryList.find('li').remove();
				return true;
			},
			_getCategories: function() {
				var _this = this;
				if (window.design.controlsPanel.panels.clipArtCatList.categories) {
					this.categories = this.getClipArtCatListPanel().categories;
				} else {
					$.getJSON('http://www.ooshirts.com/lab/clipartcategories.php?images',
					function(data) {
						var category, _i, _len, _results;
						_this.categories = {};
						_results = [];
						for (_i = 0, _len = data.length; _i < _len; _i++) {
							category = data[_i];
							_results.push(_this.categories[category.n] = category);
						}
						return _results;
					});
				}
				return this;
			},
			_triggerSearch: function(keywords) {
				this.hideCategoriesDropdown();
				this.category = 'Search';
				this.generateItems(keywords);
				window.design.controlsPanel.goTo('clipArtCategory');
				return true;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'ClipArtSettingsPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.clipArtImage = this.element.find('.clip-art-image > img');
				this.floodfillContainer = this.element.find('.floodfill-container');
				this.currentClipArt || (this.currentClipArt = '');
				this.currentColor = '';
				this.currentClipArtId || (this.currentClipArtId = 0);
				this.currentClipArtName || (this.currentClipArtName = '');
				this.clipArtCategory || (this.clipArtCategory = '');
				this.clipArtSubCategory || (this.clipArtSubCategory = '');
				this.removeWhite || (this.removeWhite = false);
				this.floodfillColor || (this.floodfillColor = false);
				this.floodfilled || (this.floodfilled = false);
				this.elementClass = '.ooshirts-shirt-item.ooshirts-item-image-clipart';
				this.appendedImageClass = '.appended-image';
				this.transparentMethodName = 'maketransparent';
				this.makeOneColorMethodName = 'makeonecolor';
				this.floodfillMethodName = 'floodfill';
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.change-clip-art-button'),
					name: 'changeClipArt'
				}));
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.clip-art-color-picker'),
					name: 'clipArtColorPicker'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#remove_white'),
					name: 'removeWhite'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.flip-clip-art-button'),
					name: 'flipClipArt'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.flop-clip-art-button'),
					name: 'flopClipArt'
				}));
				this.addChild(new Ooshirts.Widget.Checkbox({
					element: this.element.find('#floodfill'),
					name: 'floodfillCheckBox'
				}));
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.floodfill-color-picker'),
					name: 'floodfillColorPicker'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.floodfill-button'),
					name: 'floodfillButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.new-floodfill-button'),
					name: 'newFloodfillButton'
				}));
				this.changeClipArt.bind('click',
				function(ev) {
					window.design.controlsPanel.panels.clipArtCategory.setCurrentItem(_this.currentClipArt);
					return window.design.controlsPanel.goTo('clipArtCatList');
				});
				this.clipArtColorPicker.bind('change',
				function(ev) {
					return _this._updateColor(ev);
				});
				this.flipClipArt.bind('click',
				function(ev) {
					return _this._flipItem();
				});
				this.flopClipArt.bind('click',
				function(ev) {
					return _this._flopItem();
				});
				this.removeWhite.bind('click',
				function(ev) {
					return _this._setTransparent();
				});
				this.floodfillCheckBox.bind('change',
				function(ev) {
					var that;
					that = _this;
					if (ev.isChecked) {
						_this.floodfillContainer.addClass('enabled');
						return _this.floodfillColor = _this.floodfillColorPicker.getCurrentColor();
					} else {
						_this.floodfillContainer.removeClass('enabled');
						if (_this.currentClipArt.floodFillCmd) {
							_this.currentClipArt.floodFillCmd.unexecute(function(cmd) {
								_this.currentClipArt.removeColor('floodfill');
								_this.setImage(_this.clipArtImage, _this.currentClipArt.url);
								return window.collaboration.itemFloodFilled(_this.currentClipArt.id, _this.currentClipArt.url, cmd.item.size.width, cmd.item.size.height);
							});
							return _this.currentClipArt.floodFillCmd = null;
						}
					}
				});
				this.floodfillColorPicker.bind('change',
				function(ev) {
					return _this._updateFloodFillColor(ev);
				});
				this.floodfillButton.bind('click',
				function(ev) {
					return _this._floodFillImage();
				});
				this.newFloodfillButton.bind('click',
				function(ev) {
					_this.imageFloodfill || (_this.imageFloodfill = window.design.dialogsManager.imageFloodfill);
					_this.imageFloodfill.setImageItem(_this.currentClipArt);
					return _this.imageFloodfill.show();
				});
				this.element.find(".dropdown-wrap-0").hide();
				return this;
			},
			setPropertiesFor: function(item) {
				this.currentClipArt = item;
				this.currentClipArtId = this.currentClipArt.id;
				this.currentClipArtName = this.currentClipArt.name;
				this._updateClipArtImageUI(this.currentClipArt.url);
				this.clipArtColorPicker.setColor(this.currentClipArt.color, false);
				this.currentColor = this.currentClipArt.color;
				if (this.currentClipArt.floodFillCmd) {
					this.floodfillCheckBox.check(false);
					this.floodfillContainer.addClass('enabled');
				} else {
					this.floodfillCheckBox.uncheck(false);
					this.floodfillContainer.removeClass('enabled');
				}
				return this;
			},
			_restoreClipArtBeforeFloodfill: function() {
				if (this.currentClipArt.url === this.clipArtUrlBeforeFloodfill) {
					return false;
				} else {
					this.setImage(this.clipArtImage, this.clipArtUrlBeforeFloodfill);
					this.currentClipArt.image.attr('src', this.clipArtUrlBeforeFloodfill);
					this._setAttributeToCurrentItem('url', this.clipArtUrlBeforeFloodfill);
					this._setName(this.clipArtUrlBeforeFloodfill);
				}
				return true;
			},
			_updateClipArtImageUI: function(src) {
				this.setImage(this.clipArtImage, src);
				return true;
			},
			_updateColor: function(ev) {
				var that, _this = this;
				that = this;
				this.currentColor = ev.value;
				this.currentClipArt.makeOneColor(this.currentColor,
				function() {
					return _this.setImage(_this.clipArtImage, _this.currentClipArt.url);
				});
				return true;
			},
			_setTransparent: function() {
				var _this = this;
				this.currentClipArt.makeTransparent(function() {
					return _this.setImage(_this.clipArtImage, _this.currentClipArt.url);
				});
				return this;
			},
			_updateFloodFillColor: function(ev) {
				this.floodfillColor = ev.value;
				return true;
			},
			_floodFillImage: function() {
				var _this = this;
				this.currentClipArt.prepareFloodFill(function(x, y) {
					return _this.currentClipArt.floodFill(x, y, _this.floodfillColorPicker.getCurrentColor(),
					function() {
						return _this.setImage(_this.clipArtImage, _this.currentClipArt.url);
					});
				});
				return true;
			},
			_flipItem: function() {
				this.currentClipArt.flip();
				return true;
			},
			_flopItem: function() {
				this.currentClipArt.flop();
				return true;
			},
			_setAttributeToCurrentItem: function(attr, val) {
				this.currentClipArt[attr] = val;
				return true;
			},
			_setName: function(url) {
				this._setAttributeToCurrentItem('name', url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")));
				return true;
			},
			setImage: function(image, src) {
				var frame, that;
				that = this;
				frame = {
					width: 58,
					height: 58
				};
				image.hide().attr({
					src: '',
					width: '',
					height: ''
				}).load(function() {
					var img;
					img = that.setImageSize(this, frame);
					return $(img).show();
				}).prop('src', src);
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts.Widget, 'TshirtSettingsPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var that, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.currentShirt = window.design.shirt;
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#change-tshirt-style-btn'),
					name: 'changeTshirtStyleBtn'
				}));
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				this.changeTshirtStyleBtn.bind('click',
				function() {
					this.tshirtCatalog || (this.tshirtCatalog = window.design.dialogsManager.tshirtCatalog);
					return this.tshirtCatalog.showAndReset("TshirtSettingsPanel");
				});
				this.addChild(new Ooshirts.Widget.ExpandPane({
					element: this.element.find('.t-shirt-pictures'),
					name: 'tshirtsPicturePane'
				}));
				this.tshirtsPicturePane.bind('expand',
				function() {
					return _this.panelScrollPane.repaint();
				});
				this.addChild(new Ooshirts.Widget.ExpandPane({
					element: this.element.find('.t-shirt-details'),
					name: 'tshirtsDetailsPane'
				}));
				this.tshirtsDetailsPane.bind('expand',
				function() {
					return _this.panelScrollPane.repaint();
				});
				that = this;
				this.element.find('.t-shirt-picture-link').on('click',
				function(ev) {
					that.tshirtPhotosDialog.showPhoto($(this).data('type'));
					that.tshirtPhotosDialog.show();
					return false;
				});
				this.tshirtPhotosDialog = new Ooshirts.Dialog.TshirtPhotos();
				this.renderShirt();
				this.tshirtPhotosDialog.bind('show',
				function() {
					if (!this.scrollPane) {
						return this.addChild(new Ooshirts.Widget.ScrollPane({
							element: $('#photo-side-gallery.nano'),
							name: 'scrollPane'
						}));
					}
				});
				return this;
			},
			onProductSelected: function(ev) {
				var newShirt, _this = this;
				newShirt = ev.product;
				return window.design.shirt.change({
					id: newShirt.id.toString(),
					colorId: newShirt.color.id.toString(),
					categoryId: newShirt.categoryId,
					subcategoryId: newShirt.subcategoryId
				},
				function() {
					_this.renderShirt();
					return window.collaboration.tshirtChanged(newShirt.id.toString(), newShirt.color.id.toString());
				});
			},
			_bindColorSquareClick: function() {
				var that;
				that = this;
				this.element.find('.color-picker-canvas').on('click',
				function(ev) {
					var _this = this;
					$(this).addClass('color-selected');
					$(this).parent().siblings().children().removeClass('color-selected');
					that.currentShirt.color = {
						id: $(this).data('id'),
						name: $(this).data('color'),
						hexcode: $(this).data('hex')
					};
					if ($(this).data('color') === "Charcoal") {
						$('.sleeve-information').css('color', 'white');
					} else {
						if ($('.sleeve-information').css('color') === 'rgb(255, 255, 255)' || $('.sleeve-information').css('color') === 'white') {
							$('.sleeve-information').css('color', '#666');
						}
					}
					window.design.shirt.change({
						id: that.currentShirt.id.toString(),
						colorId: that.currentShirt.color.id.toString(),
						categoryId: that.currentShirt.categoryId,
						subcategoryId: that.currentShirt.subcategoryId
					},
					function() {
						return window.collaboration.tshirtChanged(that.currentShirt.id.toString(), that.currentShirt.color.id.toString());
					});
					return false;
				});
				return this;
			},
			renderShirt: function() {
				var color, colorElement, key, photoTypes, type, _i, _len, _ref;
				this.element.find('.t-shirt-category').text(this.currentShirt.category);
				this.element.find('.t-shirt-type').text(this.currentShirt.name);
				this.setImage(this.element.find('.tshirt-big-thumbnail-image'), ("" + window.baseProductURL + "/products/") + this.currentShirt.id + "/labcatalog.jpg");
				this.element.find('.t-shirt-details-information').html(this.currentShirt.description + "</br></br>" + this.currentShirt.materials);
				this.element.find('.color-picker-list').empty();
				_ref = this.currentShirt.availableColors;
				for (key in _ref) {
					if (!__hasProp.call(_ref, key)) continue;
					color = _ref[key];
					if (color.id === this.currentShirt.color.id) {
						colorElement = "<li class=\"color-picker-element regular-color\">\n    <a class=\"color-picker-canvas regular-color-canvas color-selected\" data-id=\"" + color.id + "\" data-color=\"" + color.color + "\" data-hex=\"" + color.hex + "\" style=\"background-color: #" + color.hex + ";\" title=\"" + color.color + "\"></a>\n</li>";
					} else {
						colorElement = "<li class=\"color-picker-element regular-color\" data-value=\"" + color.id + "\">\n    <a class=\"color-picker-canvas regular-color-canvas\" data-id=\"" + color.id + "\" data-color=\"" + color.color + "\" data-hex=\"" + color.hex + "\" style=\"background-color: #" + color.hex + ";\" title=\"" + color.color + "\"></a>\n</li>";
					}
					this.element.find('.color-picker-list').append(colorElement);
				}
				photoTypes = ['front', 'back', 'catalog', 'collar', 'sleeve', 'sleevecloseup'];
				for (_i = 0, _len = photoTypes.length; _i < _len; _i++) {
					type = photoTypes[_i];
					this.setImage(this.element.find(".clip-art-image-" + type), "" + window.baseProductURL + "/products/" + this.currentShirt.id + "/" + type + "_thumb_small.jpg");
				}
				this.tshirtPhotosDialog.tshirtID = this.currentShirt.id;
				this.tshirtPhotosDialog.renderPhotos();
				this._bindColorSquareClick();
				return this;
			},
			setImage: function(image, src) {
				var frameDetail, frameThubmnail, that;
				that = this;
				frameThubmnail = {
					width: 84,
					height: 94
				};
				frameDetail = {
					width: 26,
					height: 26
				};
				image.hide().attr({
					src: '',
					width: '',
					height: ''
				}).load(function() {
					var img;
					if (this.className === 'tshirt-big-thumbnail-image') {
						img = that.setImageSize(this, frameThubmnail);
					} else {
						img = that.setImageSize(this, frameDetail);
						that.positionImage($(this), frameDetail);
					}
					return $(img).show();
				}).prop('src', src);
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						height = frame.height;
						width = height * imageRatio;
					} else {
						width = frame.width;
						height = width / imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			positionImage: function(image, frame) {
				if (frame == null) {
					frame = {};
				}
				image.css({
					'top': Math.round((frame.height - image.outerHeight()) / 2),
					'left': Math.round((frame.width - image.outerWidth()) / 2)
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	var __slice = [].slice;
	Class(Ooshirts.Widget, 'FontFamilyPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.selectedClass = 'selected';
				this.currentFont || (this.currentFont = '');
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.back-button'),
					name: 'backButton'
				}));
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.scroll-wrapper'),
					name: 'scrollPane'
				}));
				this.backButton.bind('click',
				function() {
					window.design.controlsPanel.goTo('textProperties', 'left');
					if (_this.fontChanged) {
						return window.design.controlsPanel.panels.textProperties.changeFontFamily.setFont(_this.currentFont);
					}
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#font-category-dropdown'),
					name: 'categoryDropdown'
				}));
				this.categoryDropdown.bind('change',
				function(ev) {
					return _this.filterCategory(ev.value);
				});
				this._bindFontButtons();
				this.bind('show',
				function() {
					return _this.scrollPane.repaint();
				});
				this.categoryDropdown.setValue("Standard", true);
				this.scrollPane.element.debounce('scrollend',
				function(ev) {
					_this.categoryDropdown.element.effect('bounce', 'fast');
					return false;
				},
				500);
				return this;
			},
			_bindFontButtons: function() {
				var that;
				that = this;
				this.element.on('click.fontfamilypanel', '.font-option',
				function(ev) {
					return that.selectedOption($(this));
				});
				return this;
			},
			filterCategory: function(category) {
				var filterFontList, font, fontContainer, fontTemplate, fonts, selectClass, _i, _len;
				if (category === 'All') {
					filterFontList = window.fontList;
				} else {
					filterFontList = $.map(window.fontList,
					function(item) {
						if (item.categories.indexOf(category) !== -1) {
							return item;
						}
						return null;
					});
				}
				fonts = $.map(filterFontList,
				function(item) {
					return item.font;
				});
				$.loadFonts(fonts);
				fontContainer = this.element.find(".font-family-list");
				fontContainer.empty();
				for (_i = 0, _len = filterFontList.length; _i < _len; _i++) {
					font = filterFontList[_i];
					selectClass = this.currentFont === font.font ? this.selectedClass: "";
					fontTemplate = "<li class=\"font-option " + selectClass + "\" data-value=\"" + font.font + "\" data-categories=\"" + font.categories + "\">\n    <img class=\"icon icon-tick\" src=\"" + window.assetsBaseURL + "assets/images/inv.png\" alt=\"Tick\" /> <span style=\"font-family:" + font.font + "\">" + font.text + "</span>\n</li>";
					fontContainer.append(fontTemplate);
				}
				this.scrollPane.repaint();
				return this;
			},
			selectedOption: function(option, triggerEvent) {
				var textItem, value;
				if (triggerEvent == null) {
					triggerEvent = true;
				}
				this.fontChanged = true;
				this.element.find('.font-option').filter("." + this.selectedClass).removeClass(this.selectedClass);
				option.addClass(this.selectedClass);
				value = option.data('value');
				this.currentFont = value;
				textItem = window.design.selectedItem();
				textItem.changeFont(this.currentFont, triggerEvent);
				if (triggerEvent) {
					this.trigger('change', {
						value: value
					});
				}
				return this;
			},
			show: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = this.element.stop(false, true)).show.apply(_ref, args);
				this.trigger('show');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'TextPropertiesPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.TextAreaField({
					element: this.element.find('#text-properties-edit-text'),
					name: 'editText'
				}));
				this.editText.bind('change',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					if (ev.value) {
						textItem.changeLabel(ev.value);
						if (textItem.isMultiLine()) {
							return _this.arcRadiusSlider.disable();
						} else {
							return _this.arcRadiusSlider.enable();
						}
					} else {
						textItem.didDeselect();
						return textItem.moveToTrash();
					}
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#text-properties-change-font-family'),
					name: 'changeFontFamily',
					setFont: function(fontFamily) {
						if (fontFamily == null) {
							fontFamily = 'Arial';
						}
						this.font = fontFamily;
						this.element.attr('class', "full tertiary-button " + fontFamily);
						this.element.attr('style', "font-family: " + fontFamily + ";");
						return this.element.children('span').text(fontFamily);
					}
				}));
				this.changeFontFamily.bind('click',
				function() {
					window.design.controlsPanel.panels.textFontFamily.fontChanged = false;
					return window.design.controlsPanel.goTo('textFontFamily', 'right');
				});
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('#font-color-picker'),
					name: 'fontColorPicker'
				}));
				this.fontColorPicker.bind('change',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					return textItem.changeColor(ev.value);
				});
				this.fontColorPicker.bind('colorAdded',
				function(ev) {
					return this.setColor(ev.color);
				});
				this.addChild(new Ooshirts.Widget.Counter({
					element: this.element.find('.counter'),
					name: 'letterSpacing'
				}));
				this.letterSpacing.bind('change',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					return textItem.changeLetterSpacing(ev.value);
				});
				this.addChild(new Ooshirts.Widget.Slider({
					element: this.element.find('#arc-radius-slider'),
					name: 'arcRadiusSlider',
					maxValue: 359,
					minValue: -359,
					value: 0,
					range: 'min'
				}));
				this.arcRadiusSlider.bind('change',
				function(ev) {
					return _this._arcSlideChange(ev, true);
				}).bind('slide',
				function(ev) {
					return _this._arcSlideChange(ev, false);
				}).bind('start',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					return textItem.lastArc = textItem.arc;
				}).bind('stop',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					if (textItem && $.browser.ie.eq8) {
						return textItem.element.css('overflow', 'visible');
					}
				});
				this.arcRadiusSlider.element.hover(function() {
					if ($(this).hasClass('ui-slider-disabled')) {
						return $('#multi-line-advice').fadeIn('fast');
					}
				},
				function() {
					if ($(this).hasClass('ui-slider-disabled')) {
						return $('#multi-line-advice').fadeOut('fast');
					}
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#text-properties-shape'),
					name: 'textShapeDropdown'
				}));
				this.textShapeDropdown.bind('change',
				function(ev) {
					return console.log(ev.value);
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#text-properties-shape-size'),
					name: 'textShapeSizeDropdown'
				}));
				this.textShapeSizeDropdown.bind('change',
				function(ev) {
					return console.log(ev.value);
				});
				this.addChild(new Ooshirts.Widget.Checkbox({
					element: this.element.find('#add-outline-shadow'),
					name: 'addOutlineShadowCheckbox'
				}));
				this.addOutlineShadowCheckbox.bind('change',
				function(ev) {
					var outline, textItem;
					if (!ev.isChecked) {
						$('.outline-shadow-text-options').addClass('invisible');
						textItem = window.design.selectedItem();
						textItem.changeOutline(0);
						return _this.outlineShadowSlider.resetSlider();
					} else {
						$('.outline-shadow-text-options').removeClass('invisible');
						textItem = window.design.selectedItem();
						outline = textItem.outline === 0 ? 1 : textItem.outline;
						textItem.changeOutline(outline);
						return _this.outlineShadowSlider.setValue(outline * 100, false);
					}
				});
				if ($('body').get(0).clientHeight <= 720) {
					this.addChild(new Ooshirts.Widget.DropdownColor({
						element: this.element.find('#outline-shadow-color-picker'),
						name: 'outlineShadowColorPicker',
						direction: "up"
					}));
				} else {
					this.addChild(new Ooshirts.Widget.DropdownColor({
						element: this.element.find('#outline-shadow-color-picker'),
						name: 'outlineShadowColorPicker'
					}));
				}
				this.outlineShadowColorPicker.bind('change',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					textItem.changeOutlineColor(ev.value, true);
					return _this.outlineShadowSlider.setValue(textItem.outline * 100, false);
				});
				this.outlineShadowColorPicker.bind('colorAdded',
				function(ev) {
					return this.setColor(ev.color);
				});
				this.addChild(new Ooshirts.Widget.Slider({
					element: this.element.find('#outline-shadow-text-slider'),
					name: 'outlineShadowSlider',
					minValue: 0,
					maxValue: 100,
					range: 'min'
				}));
				this.outlineShadowSlider.bind('change',
				function(ev) {
					var textItem;
					textItem = window.design.selectedItem();
					return textItem.changeOutline(ev.value / 100);
				});
				if ($.browser.ie.lt9) {
					this.element.find('.dropdown-wrap-1').hide();
				}
				return this;
			},
			_arcSlideChange: function(ev, addToHistoryAndPropagate) {
				var textItem, value;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = false;
				}
				textItem = window.design.selectedItem();
				if (textItem) {
					if (Math.abs(ev.value) < 10) {
						textItem.destroyArc();
						window.design.shirt.trigger('itemRotated', {
							item: textItem
						});
						window.design.shirt.trigger('itemUpdated', {
							item: textItem
						});
					} else {
						value = ev.value;
						textItem.changeRadius(value, addToHistoryAndPropagate);
					}
				}
				return this;
			},
			setPropertiesFor: function(item) {
				var outline;
				this.editText.setValue(item.label);
				this.changeFontFamily.setFont(item.font);
				this.fontColorPicker.setColor(item.color, false);
				this.letterSpacing.setValue(item.letterSpacing);
				if (item.isMultiLine()) {
					this.arcRadiusSlider.disable();
				} else {
					this.arcRadiusSlider.enable();
					this.arcRadiusSlider.setValue(item.arc, false);
				}
				outline = item.outline * 100;
				if (outline === 0) {
					this.addOutlineShadowCheckbox.uncheck(false);
					$('.outline-shadow-text-options').addClass('invisible');
				} else {
					this.addOutlineShadowCheckbox.check(false);
					$('.outline-shadow-text-options').removeClass('invisible');
				}
				this.outlineShadowColorPicker.setColor(item.outlineColor, false);
				this.outlineShadowSlider.setValue(outline, false);
				if ($("[data-value='" + item.font + "']").length) {
					window.design.controlsPanel.panels.textFontFamily.selectedOption($("[data-value='" + item.font + "']"), false);
				} else {
					window.design.controlsPanel.panels.textFontFamily.currentFont = item.font;
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'AddTextPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.textAreaField = new Ooshirts.Widget.TextAreaField({
					element: this.element.find('.input-text-1')
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.primary-button'),
					name: 'addTextButton'
				}));
				this.addTextButton.bind('click',
				function() {
					return _this.addText();
				});
				return this;
			},
			addText: function() {
				var text, value, _this = this;
				if (value = this.textAreaField.getValue()) {
					text = new Ooshirts.Item.Text({
						label: value
					});
					text.appendToDesign();
					this.textAreaField.setValue('');
					text.waitFontLoad(function() {
						var maxHeight, maxWidth;
						maxWidth = $("#tshirt").width() - 8;
						maxHeight = $("#tshirt").height() - 8;
						if (text.size.width > maxWidth || text.size.height > maxHeight) {
							text.resize(Math.min(text.size.width, maxWidth), Math.min(text.size.height, maxHeight), false, false);
						}
						text.centerElement();
						return text.select();
					});
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'NamesAndNumbersPanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var that, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.namesTemplate = null;
				this.numbersTemplate = null;
				this.numbersDisabler = this.element.find('.numbers-disabler');
				this.namesDisabler = this.element.find('.names-disabler');
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#close-names-and-numbers'),
					name: 'closeNamesAndNumbersPanel'
				}));
				this.closeNamesAndNumbersPanel.bind('click',
				function() {
					return window.design.controlsPanel.goTo('addText', 'up');
				});
				this.addChild(new Ooshirts.Widget.Checkbox({
					element: this.element.find('#add_names'),
					name: 'addNameCheckbox'
				}));
				this.addNameCheckbox.bind('change',
				function(ev) {
					if (ev.isChecked) {
						_this._validateShirtSide(_this.nameSideDropdown.value);
						_this.namesTemplate = new Ooshirts.Item.TeamText();
						_this.namesTemplate.appendToDesign();
						_this.namesTemplate.waitFontLoad(function() {
							return _this.namesTemplate.select(false);
						});
						_this.namesTemplate.bind('deleted',
						function() {
							return _this.addNameCheckbox.uncheck();
						});
						_this.nameSideDropdown.setValue(window.design.shirt.side);
						_this.nameSizeDropdown.setValue(20, false);
						_this.nameColorDropdown.setColor('#000000', false);
						return _this.namesDisabler.hide();
					} else {
						_this.namesTemplate.didDeselect();
						_this.namesTemplate.destroy();
						_this.namesTemplate = null;
						_this.namesDisabler.show();
						_this.nameSizeDropdown.setValue(20, false);
						return _this.nameColorDropdown.setColor('#000000', false);
					}
				});
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('#names-color-dropdown'),
					name: 'nameColorDropdown'
				}));
				this.nameColorDropdown.bind('change',
				function(ev) {
					if (_this.namesTemplate) {
						return _this.namesTemplate.changeColor(ev.value);
					}
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#names-side-dropdown'),
					name: 'nameSideDropdown'
				}));
				this.nameSideDropdown.bind('change',
				function(ev) {
					if (_this.namesTemplate) {
						return _this._switchSideForItem(_this.namesTemplate, ev.value);
					}
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#names-size-dropdown'),
					name: 'nameSizeDropdown'
				}));
				this.nameSizeDropdown.bind('change',
				function(ev) {
					if (_this.namesTemplate) {
						return _this.namesTemplate.changeFontSize(ev.value);
					}
				});
				this.addChild(new Ooshirts.Widget.Checkbox({
					element: this.element.find('#add_numbers'),
					name: 'addNumberCheckbox'
				}));
				this.addNumberCheckbox.bind('change',
				function(ev) {
					if (ev.isChecked) {
						_this._validateShirtSide(_this.numberSideDropdown.value);
						_this.numbersTemplate = new Ooshirts.Item.TeamText({
							numbers: true
						});
						_this.numbersTemplate.appendToDesign();
						_this.numbersTemplate.waitFontLoad(function() {
							return _this.numbersTemplate.select(false);
						});
						_this.numbersTemplate.bind('deleted',
						function() {
							return _this.addNumberCheckbox.uncheck();
						});
						_this.numberSideDropdown.setValue(window.design.shirt.side);
						_this.numberSizeDropdown.setValue(40, false);
						_this.numbersColorDropdown.setColor();
						return _this.numbersDisabler.hide();
					} else {
						_this.numbersTemplate.didDeselect();
						_this.numbersTemplate.destroy();
						_this.numbersTemplate = null;
						_this.numbersDisabler.show();
						_this.numberSizeDropdown.setValue(30, false);
						return _this.numbersColorDropdown.setColor('#000000', false);
					}
				});
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('#numbers-color-dropdown'),
					name: 'numbersColorDropdown'
				}));
				this.numbersColorDropdown.bind('change',
				function(ev) {
					if (_this.numbersTemplate) {
						return _this.numbersTemplate.changeColor(ev.value);
					}
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#numbers-side-dropdown'),
					name: 'numberSideDropdown'
				}));
				this.numberSideDropdown.bind('change',
				function(ev) {
					if (_this.numbersTemplate) {
						return _this._switchSideForItem(_this.numbersTemplate, ev.value);
					}
				});
				this.addChild(new Ooshirts.Widget.Dropdown({
					element: this.element.find('#numbers-size-dropdown'),
					name: 'numberSizeDropdown'
				}));
				this.numberSizeDropdown.bind('change',
				function(ev) {
					if (_this.numbersTemplate) {
						return _this.numbersTemplate.changeFontSize(ev.value);
					}
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.opendialog .tertiary-button'),
					name: 'spreadsheetButton'
				}));
				this.spreadsheet || (this.spreadsheet = window.design.dialogsManager.spreadsheet);
				that = this;
				this.spreadsheetButton.bind('click',
				function(ev) {
					return _this.spreadsheet.show(function() {
						return this.opener = that;
					});
				});
				return this;
			},
			_switchSideForItem: function(item, side) {
				item.shirtSide = side;
				if (side !== window.design.shirt.side) {
					item.hide();
					window.design.switchShirtSide(side, false);
				}
				if (!item.isVisible()) {
					item.show();
				}
				item.select();
				return this;
			},
			_validateShirtSide: function(side) {
				if (window.design.shirt.side === 'left' || window.design.shirt.side === 'right') {
					window.design.switchShirtSide(side);
				}
				return this;
			},
			initProperties: function(template) {
				var _this = this;
				if (template.isNumberTemplate) {
					this.numbersTemplate = template;
					this.addNumberCheckbox.check(false);
					this.numbersDisabler.hide();
					this.numbersColorDropdown.setColor(this.numbersTemplate.color, false);
					this.numberSizeDropdown.setValue(this.numbersTemplate.fontSize, false);
					return this.numbersTemplate.bind('deleted',
					function() {
						return _this.addNumberCheckbox.uncheck();
					});
				} else {
					this.namesTemplate = template;
					this.addNameCheckbox.check(false);
					this.namesDisabler.hide();
					this.nameColorDropdown.setColor(this.namesTemplate.color, false);
					this.nameSizeDropdown.setValue(this.namesTemplate.fontSize, false);
					return this.namesTemplate.bind('deleted',
					function() {
						return _this.addNameCheckbox.uncheck();
					});
				}
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Widget, 'UploadImagePanel').inherits(Ooshirts.Widget)({
		prototype: {
			init: function(attributes) {
				var image_form, move, _this = this;
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.uploadimageFile();
				this.textIndications = this.element.find('.upload-image-p');
				this.addChild(new Ooshirts.Widget.Button({
					element: $('.cancel-upload > a'),
					name: 'cancelUploadButton'
				}));
				this.cancelUploadButton.bind('click',
				function() {
					_this.jqXHR && _this.jqXHR.abort();
					$("#upload-loading").hide();
					return $('#upload-image-form').find('fieldset').show();
				});
				if (! ($.browser.ie.gt9 || $.browser.mozilla || $.browser.safari || (navigator.userAgent.indexOf("Chrome") !== -1))) {
					image_form = $('#upload-image-form');
					image_form.find('.drag-drop-notes').hide();
					image_form.find('.drop-zone').css("border", "none");
				}
				if ($.browser.mozilla && parseInt($.browser.version) <= 6) {
					this.element.find("#print-image").addClass("firefox").attr("size", "32");
				} else if ($.browser.ie.lt10) {
					move = function(event) {
						var le, position, to, x, y;
						x = event.clientX;
						y = event.clientY;
						position = $(this).offset();
						le = (x - position.left) - 200;
						to = (y - position.top) - 15;
						return $("#print-image").css({
							top: to,
							left: le,
							outline: 'none'
						});
					};
					this.element.find("#uploadContainer").on("mousemove", move);
				} else {
					this.element.find(".upload-button").bind("click",
					function(event) {
						_this.element.find("#print-image").click();
						return false;
					});
				}
				return this;
			},
			_validateFileExtension: function(file, validExtensions) {
				return validExtensions.test(file.type) || validExtensions.test(file.name);
			},
			uploadimageFile: function() {
				var that;
				that = this;
				$('#upload-image-form').fileupload({
					maxFileSize: 25 * 1024 * 1024,
					acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|eps|psd|ps|tiff|tif|pdf)$/i,
					dropZone: $('#upload-image-drop-zone .drop-zone'),
					dataType: 'text',
					add: function(ev, data) {
						var _this = this;
						$(this).find('.error-message').hide();
						$.each(data.files,
						function(index, file) {
							return $('.filename').text(file.name);
						});
						if (!that._validateFileExtension(data.files[0], ev.data.fileupload.options.acceptFileTypes)) {
							$('#upload-image-unknown-file').show();
							return false;
						}
						setTimeout(function() {
							return that.jqXHR = data.submit();
						},
						300);
						return true;
					},
					start: function() {
						$(this).find('fieldset').hide();
						$(this).find('#upload-loading').show();
						return true;
					},
					progress: function(e, data) {
						var progress;
						progress = parseInt(data.loaded / data.total * 100, 10);
						$("#upload-loading").show();
						$('#upload-loading .loading-bar-progress').show().css("width", progress + "%");
						return true;
					},
					done: function(ev, data) {
						var fileName, image, imgUrl;
						if (!data.result.error) {
							fileName = data.result.replace('\n', '');
							imgUrl = 'http://ooshirts-uploads.s3.amazonaws.com/' + fileName + '.png';
							image = new Ooshirts.Item.Image({
								url: imgUrl
							});
							image.customizeColors();
							$(this).find('fieldset').show();
							$(this).find('#upload-loading').hide();
						}
						return true;
					},
					always: function(ev, data) {
						if (data.result && data.result.error) {
							$(this).find('fieldset').show();
							$(this).find('#upload-loading').hide();
							return $('#upload-image-heavy-file').text(data.result.error).show();
						}
					},
					dragover: function(ev, data) {
						var dropZone, timeout;
						dropZone = $(this).find('.drop-zone');
						timeout = window.dropZoneTimeout;
						if (timeout) {
							clearTimeout(timeout);
						}
						if (ev.currentTarget === dropZone[0]) {
							dropZone.addClass('drop-zone-active');
						} else {
							dropZone.removeClass('drop-zone-active');
						}
						return window.dropZoneTimeout = setTimeout(function() {
							window.dropZoneTimeout = null;
							return dropZone.removeClass('drop-zone-active');
						},
						100);
					}
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	var __slice = [].slice;
	Class(Ooshirts, 'Item').inherits(Ooshirts.Widget)({
		elementClass: 'ooshirts-shirt-item',
		html: '<div class="item-container"  tabindex="-1"></div>',
		prototype: {
			serializableAttributes: ['id', 'color', 'rotation', 'position', 'degrees', 'flipState', 'flopState', 'size', 'shirtSide', 'itemType', 'order', 'transferOrder'],
			init: function(attributes) {
				var that, _this = this;
				attributes = $.extend({
					position: {
						left: 0,
						top: 0
					},
					degrees: 0,
					size: {
						width: 'auto',
						height: 'auto'
					},
					resizeCorner: 'se',
					flipState: false,
					flopState: false,
					id: 'item' + new Date().getTime(),
					colorsUsed: null,
					transferOrder: []
				},
				attributes);
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.element.attr('id', this.id);
				if ($.browser.ie.eq7) {
					this.contents = $("<div>", {
						"class": "item-contents",
						style: "position:absolute;left:8px;"
					});
				} else {
					this.contents = $("<div>", {
						"class": "item-contents",
						style: "position:absolute;"
					});
				}
				this.contents.appendTo(this.element);
				this.selectedClass = 'selected';
				this.addChild(new Ooshirts.Widget.ContextMenu({
					name: 'contextMenu'
				}));
				this.bind('appended',
				function(ev) {
					if (!window.design_data) {
						_this._bindHandlers();
					}
					if (!ev.ignoreCenter) {
						_this.checkBoundry();
						if (!_this.fromLoad) {
							_this.size = {
								width: _this.element.width(),
								height: _this.element.height()
							};
						}
						if (_this.itemType === 'Text' || 'TeamText') {
							return _this.centerElement();
						} else {
							return setTimeout(function() {
								return _this.centerElement();
							},
							500);
						}
					}
				});
				this.element.attr('data-item-id', this.id);
				if (isNaN(this.degrees)) {
					this.degrees = 0;
				} else {
					this.degrees = parseFloat(this.degrees);
				}
				this.position.left = parseFloat(this.position.left);
				this.position.top = parseFloat(this.position.top);
				this.element.css({
					left: this.position.left,
					top: this.position.top,
					position: 'absolute'
				});
				this.order = $('.item-container').length;
				that = this;
				$('#tshirt').bind('updateOrder',
				function(ev) {
					return that._updateOrder();
				});
				return this;
			},
			_addToTransferOrder: function(transferType) {
				var transfer, _i, _len, _ref;
				_ref = this.transferOrder;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					transfer = _ref[_i];
					if (transfer === transferType) {
						return;
					}
				}
				return this.transferOrder.push(transferType);
			},
			_bindHandlers: function() {
				var _this = this;
				this.element.draggable({
					containment: '#canvas',
					start: function() {
						_this.select();
						return _this.originalPosition = $.extend({},
						_this.position);
					},
					drag: function(event, ui) {
						if (_this._itemCentered(ui)) {
							$('#tshirt').addClass('center-guide');
						} else {
							$('#tshirt').removeClass('center-guide');
						}
						if (_this._itemNearTheVerticalCenter(ui)) {
							$('#tshirt').addClass('center-foucs-v');
							_this.centerVerticalElement(ui);
						} else {
							$('#tshirt').removeClass('center-foucs-v');
						}
						return window.design.shirt.trigger('itemMoved');
					},
					stop: function(event, ui) {
						if (_this.isSwitchSide) {
							_this.isSwitchSide = false;
						} else {
							$('#tshirt').removeClass('center-foucs-v');
							if (_this._itemNearTheVerticalCenter(ui)) {
								_this.centerVerticalElement(ui);
							}
							_this.position.left = ui.position.left;
							_this.position.top = ui.position.top;
							window.design.shirt.trigger('itemMoved');
							_this.drag(ui);
						}
						return true;
					}
				});
				this.element.on('click',
				function(ev) {
					_this.contextMenu.hide() === _this.contextMenu.isVisible();
					_this.select();
					return false;
				}).on('mousedown',
				function(ev) {
					return window.design.updateDraggableContainment(_this);
				}).on('mouseover',
				function(ev) {
					return window.design.shirt.trigger('itemMouseover', {
						item: _this
					});
				}).on('mouseout',
				function(ev) {
					return window.design.shirt.trigger('itemMouseout', {
						item: _this
					});
				});
				this.bind('contextMenu',
				function(ev) {
					_this.showContextMenuAt(ev.pageX - 1, ev.pageY - 1);
					return ev.preventDefault();
				});
				return this;
			},
			showContextMenuAt: function(x, y) {
				this.select();
				this.contextMenu.showAt(x, y);
				return this;
			},
			appendToDesign: function() {
				var command, event, _this = this;
				command = new Ooshirts.AppendCommand({
					item: this
				});
				if (this.itemType === 'Image' || this.itemType === 'Clipart') {
					event = "imageLoaded";
					if (this.itemType === 'Image' && this.isLoaded) {
						event = "appended";
					}
					this.bind(event,
					function() {
						_this.unbind(event);
						return window.collaboration.itemAdded(_this.serialize());
					});
				}
				command.execute(function(cmd) {
					window.design.addItem(_this).actions.add(cmd);
					_this.trigger('appended');
					_this.isAppended = true;
					if (! (_this.itemType === 'Image' || _this.itemType === 'Clipart')) {
						return window.collaboration.itemAdded(_this.serialize());
					}
				});
				return this;
			},
			moveToTrash: function() {
				var command, _this = this;
				command = new Ooshirts.DeleteCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.design.deselectAll();
					_this.trigger('deleted');
					return window.collaboration.itemDeleted(_this.id);
				});
				return this;
			},
			rotate: function(degrees, addToHistoryAndPropagate, fromLoad, callback) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (fromLoad == null) {
					fromLoad = false;
				}
				this._addToTransferOrder("rotate");
				command = new Ooshirts.RotateCommand({
					item: this,
					newDegrees: degrees,
					fromLoad: fromLoad
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						window.collaboration.itemRotated(_this.id, degrees);
					}
					$('#tshirt').removeClass('center-guide');
					if (callback) {
						return callback();
					}
				});
				return this;
			},
			moveTo: function(x, y) {
				this.position = {
					top: y,
					left: x
				};
				this.element.css({
					left: x,
					top: y
				});
				return this;
			},
			move: function(leftOffset, topOffset) {
				var command, _this = this;
				if (leftOffset == null) {
					leftOffset = 0;
				}
				if (topOffset == null) {
					topOffset = 0;
				}
				command = new Ooshirts.MoveCommand({
					item: this,
					topOffset: topOffset,
					leftOffset: leftOffset
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					return window.collaboration.itemMove(_this.id, leftOffset, topOffset);
				});
				return this;
			},
			drag: function(object) {
				var command, _this = this;
				command = new Ooshirts.DragCommand({
					item: this,
					dragObj: object
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					return window.collaboration.itemDragged(_this.id, object.position);
				});
				return this;
			},
			flip: function(addToHistoryAndPropagate) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				this._addToTransferOrder("flip");
				command = new Ooshirts.FlipCommand({
					item: this
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						return window.collaboration.itemFlipped(_this.id);
					}
				});
				return this;
			},
			flop: function() {
				var command, _this = this;
				this._addToTransferOrder("flop");
				command = new Ooshirts.FlopCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					return window.collaboration.itemFlopped(_this.id);
				});
				return this;
			},
			resize: function(width, height, addToHistoryAndPropagate, resetToAuto) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (resetToAuto == null) {
					resetToAuto = true;
				}
				command = new Ooshirts.ResizeCommand({
					item: this,
					resizeWidth: width,
					resizeHeight: height,
					resetToAuto: resetToAuto
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						window.collaboration.itemResized(_this.id, width, height, _this.fontSize);
						return $('#tshirt').removeClass('center-guide');
					}
				});
				return this;
			},
			sendBackward: function() {
				var command, that, _this = this;
				that = this;
				command = new Ooshirts.SendBackwardCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemSentBackward(_this.id);
					return $('#tshirt').trigger('updateOrder', [that]);
				});
				return this;
			},
			bringForward: function() {
				var command, that, _this = this;
				that = this;
				command = new Ooshirts.BringForwardCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemSentForward(_this.id);
					return $('#tshirt').trigger('updateOrder', [that]);
				});
				return this;
			},
			sendToBack: function() {
				var command, that, _this = this;
				that = this;
				command = new Ooshirts.SendToBackCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemSentToBack(_this.id);
					return $('#tshirt').trigger('updateOrder', [that]);
				});
				return this;
			},
			bringToFront: function() {
				var command, that, _this = this;
				that = this;
				command = new Ooshirts.BringToFrontCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemSentToFront(_this.id);
					return $('#tshirt').trigger('updateOrder', [that]);
				});
				return this;
			},
			select: function(resetPanels) {
				if (resetPanels == null) {
					resetPanels = true;
				}
				this.element.focus();
				if (window.design.selectedItem() !== this && !window.design_data) {
					this.element.addClass("" + this.selectedClass);
					this.element.draggable("option", "disabled", false);
					if (this.itemType === "Text" || this.itemType === "TeamText") {
						this.checkBoundry(false);
					}
					window.design.selectItem(this, resetPanels);
					window.design.shirt.trigger('itemSelected', {
						item: this
					});
					switch (this.itemType) {
					case "Text":
						window.design.controlsPanel.panels.textProperties.setPropertiesFor(this);
						window.design.controlsPanel.goTo('textProperties');
						break;
					case "Clipart":
						window.design.controlsPanel.panels.clipArtSettings.setPropertiesFor(this);
						window.design.controlsPanel.goTo('clipArtSettings');
						break;
					case "Image":
						window.design.controlsPanel.panels.customImageSettings.setPropertiesFor(this);
						window.design.controlsPanel.goTo('customImageSettings', 'left');
						break;
					case "TeamText":
						window.design.controlsPanel.goTo('namesAndNumbers', 'left');
					}
					window.design.updateDraggableContainment(this);
					window.collaboration.itemSelected(this.id);
				}
				return this;
			},
			refreshSetting: function() {
				switch (this.itemType) {
				case "Text":
					window.design.controlsPanel.panels.textProperties.setPropertiesFor(this);
					window.design.controlsPanel.goTo('textProperties');
					break;
				case "Clipart":
					window.design.controlsPanel.panels.clipArtSettings.setPropertiesFor(this);
					window.design.controlsPanel.goTo('clipArtSettings');
					break;
				case "Image":
					window.design.controlsPanel.panels.customImageSettings.setPropertiesFor(this);
					window.design.controlsPanel.goTo('customImageSettings', 'left');
				}
				return this;
			},
			didDeselect: function() {
				this.element.removeClass("" + this.selectedClass);
				window.collaboration.itemDeselected(this.id);
				window.design.shirt.trigger('itemDeselected');
				return this;
			},
			copyToClipboard: function() {
				this.design.clipboard = this.id;
				return this;
			},
			duplicate: function() {
				var attrsCopy, copy;
				attrsCopy = $.extend(true, {},
				this.serialize());
				delete attrsCopy.id;
				copy = new this.constructor(attrsCopy);
				copy.itemDuplicate = true;
				if (copy.itemType === 'Clipart') {
					copy.fromLoad = true;
					copy.bind('imageLoaded',
					function() {
						return Ooshirts.Item.Image.prototype.appendToDesign.apply(copy);
					});
				} else {
					copy.appendToDesign();
				}
				if (copy.itemType === 'Text') {
					copy.select();
				}
				return copy;
			},
			centerElement: function() {
				var outerHeight, outerSpace, outerWidth;
				outerWidth = this.element.outerWidth();
				outerHeight = this.element.outerHeight();
				if ($.browser.ie.lt8 && (this.itemType === 'Clipart' || this.itemType === 'Image')) {
					outerSpace = parseInt(this.element.css('padding').replace(/px/, '') * 2) + parseInt(this.element.css('borderWidth').replace(/px/, '') * 2);
					outerWidth = this.image.outerWidth() + outerSpace;
					outerHeight = this.image.outerHeight() + outerSpace;
				}
				if (this.itemDuplicate === true) {
					this.position = {
						top: this.position.top + 30
					};
					this.itemDuplicate = false;
				} else {
					this.position = {
						left: Math.round(((this.element.parent().width()) - outerWidth) / 2),
						top: Math.round(((this.element.parent().height()) - outerHeight) / 2)
					};
				}
				this.element.css({
					left: this.position.left,
					top: this.position.top
				});
				return this;
			},
			centerHorizontalElement: function(ui) {
				var outerHeight, outerSpace;
				outerHeight = this.element.outerHeight();
				if ($.browser.ie.lt8 && (this.itemType === 'Clipart' || this.itemType === 'Image')) {
					outerSpace = parseInt(this.element.css('padding').replace(/px/, '') * 2) + parseInt(this.element.css('borderWidth').replace(/px/, '') * 2);
					outerHeight = this.image.outerHeight() + outerSpace;
				}
				if (this.itemDuplicate === true) {
					this.position = {
						top: this.position.top + 30,
						left: ui.position.left
					};
					this.itemDuplicate = false;
				} else {
					this.position = {
						top: Math.round(((this.element.parent().height()) - outerHeight) / 2),
						left: ui.position.left
					};
				}
				this.element.css({
					top: this.position.top,
					left: this.position.left
				});
				return this;
			},
			centerVerticalElement: function(ui) {
				var outerSpace, outerWidth;
				outerWidth = this.element.outerWidth();
				if ($.browser.ie.lt8 && (this.itemType === 'Clipart' || this.itemType === 'Image')) {
					outerSpace = parseInt(this.element.css('padding').replace(/px/, '') * 2) + parseInt(this.element.css('borderWidth').replace(/px/, '') * 2);
					outerWidth = this.image.outerWidth() + outerSpace;
				}
				this.position = {
					left: Math.round(((this.element.parent().width()) - outerWidth) / 2) - 1,
					top: ui.position.top
				};
				this.element.css({
					left: this.position.left,
					top: this.position.top
				});
				return this;
			},
			checkBoundry: function(triggerEvent) {
				var bounds;
				if (triggerEvent == null) {
					triggerEvent = true;
				}
				bounds = this.getBoundingBox();
				this.size = {
					width: bounds.width,
					height: bounds.height
				};
				this.element.width(bounds.width).height(bounds.height);
				if (triggerEvent) {
					if (window.design.selectedItem() === this) {
						window.design.shirt.trigger('itemUpdated');
					}
				}
				return this;
			},
			isInsideDesign: function(margin) {
				var bounds, tshirtHeight, tshirtWidth;
				margin = margin || 8;
				bounds = this.getBoundingBox();
				tshirtWidth = window.design.shirt.element.width();
				tshirtHeight = window.design.shirt.element.height();
				return bounds.top + margin >= 0 && bounds.left + margin >= 0 && bounds.left + bounds.width + margin <= tshirtWidth && bounds.top + bounds.height + margin <= tshirtHeight;
			},
			getBoundingBox: function(degrees) {
				var angle2, boundingBox, cos, height, maxX, maxY, minX, minY, position, sin, width, x1, x2, x3, y1, y2, y3;
				position = this.element.position();
				angle2 = this._toRadians(degrees || this.degrees);
				sin = Math.sin(angle2);
				cos = Math.cos(angle2);
				width = this.contents.width();
				height = this.contents.height();
				x1 = cos * width;
				y1 = sin * width;
				x2 = -sin * height;
				y2 = cos * height;
				x3 = cos * width - sin * height;
				y3 = sin * width + cos * height;
				minX = Math.min(0, x1, x2, x3);
				maxX = Math.max(0, x1, x2, x3);
				minY = Math.min(0, y1, y2, y3);
				maxY = Math.max(0, y1, y2, y3);
				if ($.browser.msie && $.browser.ie.lt8 && (this.itemType === 'Text' || this.itemType === 'TeamText')) {
					return boundingBox = {
						top: position.top,
						left: position.left,
						width: width,
						height: height
					};
				} else {
					return boundingBox = {
						top: position.top,
						left: position.left,
						width: Math.round(maxX - minX),
						height: Math.round(maxY - minY)
					};
				}
			},
			_toRadians: function(degrees) {
				return degrees * (Math.PI / 180);
			},
			destroy: function() {
				this.element.off().resizable('destroy').draggable('destroy').children('.rotate-handler').off();
				this.element.remove();
				this.contextMenu.destroy();
				window.design.trashItem(this);
				return this;
			},
			addColor: function(color, prop) {
				var _base;
				if (prop == null) {
					prop = '';
				}
				switch (this.itemType) {
				case 'TeamText':
					this.colorsUsed = color;
					break;
				case 'Text':
					this.colorsUsed || (this.colorsUsed = {});
					this.colorsUsed[prop] = color;
					break;
				case 'Clipart':
					this.colorsUsed || (this.colorsUsed = {});
					if (prop === 'floodfill') {
						this.colorsUsed[prop] = color;
					} else {
						this.colorsUsed[prop] = color;
					}
					break;
				case 'Image':
					this.colorsUsed || (this.colorsUsed = {});
					if (prop === 'floodfill') {
						this.colorsUsed[prop] = color;
					} else if (prop === 'origColors') { (_base = this.colorsUsed)[prop] || (_base[prop] = []);
						this.colorsUsed[prop] = color;
					} else {
						this.colorsUsed[prop] = color;
					}
				}
				window.design.shirt.updateTotalInks(this);
				return this;
			},
			isFullColor: function() {
				var color, isFullColorExisting, _i, _len, _ref;
				isFullColorExisting = false;
				_ref = this.getAllColors();
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					color = _ref[_i];
					if (color === 'full') {
						isFullColorExisting = true;
						break;
					}
				}
				return isFullColorExisting;
			},
			getAllColors: function() {
				var allColors, color, colorValue, prop, returnValue, temp, tempColor, _i, _len, _ref;
				allColors = {};
				switch (this.itemType) {
				case 'TeamText':
					allColors[this.colorsUsed] = true;
					break;
				case 'Clipart':
				case 'Image':
				case 'Text':
					this.colorsUsed || (this.colorsUsed = {});
					_ref = this.colorsUsed;
					for (prop in _ref) {
						color = _ref[prop];
						if (color.constructor.name === 'Array' || color instanceof Array) {
							for (_i = 0, _len = color.length; _i < _len; _i++) {
								tempColor = color[_i];
								allColors[tempColor] = true;
							}
						} else {
							allColors[color] = true;
						}
					}
				}
				returnValue = [];
				for (colorValue in allColors) {
					temp = allColors[colorValue];
					returnValue.push(colorValue);
				}
				return returnValue;
			},
			removeLastFloodfillColor: function() {
				var _base;
				(_base = this.colorsUsed)['floodfill'] || (_base['floodfill'] = []);
				this.colorsUsed['floodfill'].pop();
				return window.design.shirt.updateTotalInks(this);
			},
			removeColor: function(prop) {
				if (prop == null) {
					prop = '';
				}
				switch (this.itemType) {
				case 'TeamText':
					delete this.colorsUsed;
					break;
				case 'Text':
				case 'Clipart':
				case 'Image':
					this.colorsUsed || (this.colorsUsed = {});
					delete this.colorsUsed[prop];
				}
				window.design.shirt.updateTotalInks(this);
				return this;
			},
			_updateOrder: function() {
				var $item;
				$item = $('#' + this.id);
				this.order = $('.item-container').index($item);
				return this;
			},
			_itemCentered: function(ui) {
				if (this.inverted) {
					return (Math.floor(this.size.height / 2) + ui.position.left + 8) === Math.floor(this.element.parent().width() / 2);
				} else {
					return (Math.floor(this.size.width / 2) + ui.position.left + 8) === Math.floor(this.element.parent().width() / 2);
				}
			},
			_itemNearTheCenter: function(ui) {
				return (Math.floor(this.size.width / 2) + ui.position.left + 8) > (Math.floor(this.element.parent().width() / 2) - 5) && (Math.floor(this.size.width / 2) + ui.position.left + 8) < (Math.floor(this.element.parent().width() / 2) + 5) && (Math.floor(this.size.height / 2) + ui.position.top + 8) > (Math.floor(this.element.parent().height() / 2) - 5) && (Math.floor(this.size.height / 2) + ui.position.top + 8) < (Math.floor(this.element.parent().height() / 2) + 5);
			},
			_itemNearTheHorizontalCenter: function(ui) {
				return (Math.floor(this.size.height / 2) + ui.position.top + 8) > (Math.floor(this.element.parent().height() / 2) - 3) && (Math.floor(this.size.height / 2) + ui.position.top + 8) < (Math.floor(this.element.parent().height() / 2) + 3);
			},
			_itemNearTheVerticalCenter: function(ui) {
				return (Math.floor(this.size.width / 2) + ui.position.left + 8) > (Math.floor(this.element.parent().width() / 2) - 3) && (Math.floor(this.size.width / 2) + ui.position.left + 8) < (Math.floor(this.element.parent().width() / 2) + 3);
			},
			show: function() {
				var args, _ref;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				(_ref = Ooshirts.Widget.prototype.show).call.apply(_ref, [this].concat(__slice.call(args)));
				this.trigger("show");
				return this;
			},
			getPosition: function() {
				return $.extend({},
				this.position);
			},
			resetPosition: function(position) {
				this.position = {
					left: position.left,
					top: position.top
				};
				return this.element.css(this.position);
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Item, 'Text').inherits(Ooshirts.Item).includes(Ooshirts.CssTransform)({
		elementClass: 'ooshirts-shirt-item ooshirts-item-text',
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					label: 'Your text',
					font: 'OldSansBlack',
					fontSize: 20,
					color: '#000000',
					arc: 0,
					shapeType: 'normal',
					outline: 0,
					outlineColor: '#000000',
					letterSpacing: 0
				},
				attributes);
				Ooshirts.Item.prototype.init.apply(this, [attributes]);
				this.itemType = 'Text';
				this.serializableAttributes = this.serializableAttributes.concat(['label', 'font', 'fontSize', 'letterSpacing', 'arc', 'shape', 'outline', 'outlineColor']);
				this.contents.append("<div class='text-arc item-inner' id='" + this.id + "arc'>" + (this.getLabelHtml()) + "</div>");
				this.contents.append("<div class='item-size-test' style='display:none;white-space: nowrap;'>" + (this.getLabelHtml()) + "</div>");
				this.loadInitialPorperties();
				this.bind('appended',
				function() {
					var oldPosition;
					oldPosition = _this.getPosition();
					_this.repaint();
					return _this.waitFontLoad(function() {
						if (_this.shirtSide !== window.design.shirt.side) {
							_this.one("show",
							function() {
								return _this._adjustPosition(oldPosition);
							});
						} else {
							_this._adjustPosition(oldPosition);
						}
						if (_this.shirtSide === 'front') {
							return _this.resetPositionForOldData();
						} else {
							return _this.one("show",
							function() {
								return _this.resetPositionForOldData();
							});
						}
					});
				});
				this.bind('lengthChange',
				function() {
					var oldPosition;
					if (_this.degrees !== 0) {
						oldPosition = _this.getPosition();
						return _this.rotate(_this.degrees, false, false,
						function() {
							return _this.resetPosition(oldPosition);
						});
					}
				});
				return this;
			},
			repaint: function() {
				this.changeColor(this.color, false);
				this.changeFontSize(this.fontSize, false, false);
				this.changeLetterSpacing(this.letterSpacing, false, false, false);
				this.changeOutline(this.outline, false);
				this.changeOutlineColor(this.outlineColor, false);
				return this.changeFont(this.font, false, false, false);
			},
			watchFontLoad: function(font) {
				var count, intervalId, _this = this;
				count = 0;
				return intervalId = setInterval(function() {
					count++;
					if (count > 30) {
						_this.trigger("fontLoaded");
						clearInterval(intervalId);
					}
					return $.whenFontLoaded(font,
					function() {
						_this.trigger("fontLoaded");
						return clearInterval(intervalId);
					});
				},
				50);
			},
			waitFontLoad: function(callback) {
				var _this = this;
				return this.one("fontLoaded",
				function() {
					return callback();
				});
			},
			_adjustPosition: function(oldPosition) {
				if (this.arc !== 0) {
					this.changeRadius(this.arc, false);
				}
				this.trigger("lengthChange");
				return this.resetPosition(oldPosition);
			},
			resetPositionForOldData: function() {
				var height, rows, width, _ref;
				this.checkBoundry(false);
				if (this.centerPosition) {
					rows = this.isMultiLine();
					width = this.size.width + 16;
					height = this.size.height + 16;
					if ((90 < (_ref = this.centerPosition.left) && _ref < 120)) {
						this.position = {
							left: Math.round(((this.element.parent().width()) - width) / 2) - 1,
							top: this.centerPosition.top - height / (2 * (rows + 1))
						};
					} else {
						this.position = {
							left: this.centerPosition.left - width / 2,
							top: this.centerPosition.top - height / (2 * (rows + 1))
						};
					}
					this.element.css({
						left: this.position.left,
						top: this.position.top
					});
					return delete this.centerPosition;
				}
			},
			loadInitialPorperties: function() {
				this.isNumberTemplate = this.isNumberTemplate === 'true' || this.isNumberTemplate === true;
				this.font = this.font.replace(" ", "");
				this.fontSize = parseFloat(this.fontSize);
				this.arc = parseFloat(this.arc);
				this.outline = parseFloat(this.outline);
				this.size.width = parseFloat(this.size.width);
				this.size.height = parseFloat(this.size.height);
				this.letterSpacing = parseFloat(this.letterSpacing);
				return this;
			},
			changeColor: function(newColor, addToHistoryAndPropagate) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (newColor.search('#') !== 0) {
					newColor = '#' + newColor;
				}
				command = new Ooshirts.ChangeColorCommand({
					item: this,
					newColor: newColor
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						return window.collaboration.colorChanged(_this.id, newColor);
					}
				});
				return this;
			},
			changeFontSize: function(size, addToHistoryAndPropagate, triggerUpdate) {
				var command;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (triggerUpdate == null) {
					triggerUpdate = true;
				}
				command = new Ooshirts.ChangeFontSizeCommand({
					item: this,
					fontSize: size
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						window.collaboration.fontSizeChanged(this.id, size);
					}
					if (triggerUpdate) {
						return window.design.shirt.trigger('itemUpdated');
					}
				});
				return this;
			},
			changeLabel: function(label) {
				var command, _this = this;
				command = new Ooshirts.ChangeLabelCommand({
					item: this,
					label: label
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.labelChanged(_this.id, label);
					_this.size = {
						width: _this.element.width(),
						height: _this.element.height()
					};
					return window.design.shirt.trigger('itemUpdated');
				});
				return this;
			},
			changeShape: function(type) {
				var command, _this = this;
				command = new Ooshirts.ChangeShapeCommand({
					item: this,
					shapeType: type
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					return window.collaboration.shapeChanged(_this.id, type);
				});
				return this;
			},
			changeFont: function(font, addToHistoryAndPropagate, triggerUpdate, resetSize) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (triggerUpdate == null) {
					triggerUpdate = true;
				}
				if (resetSize == null) {
					resetSize = true;
				}
				command = new Ooshirts.ChangeFontCommand({
					item: this,
					font: font,
					resetSize: resetSize
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						window.collaboration.fontChanged(_this.id, font);
					}
					if (triggerUpdate) {
						return window.design.shirt.trigger('itemUpdated');
					}
				});
				return this;
			},
			changeOutline: function(outline, addToHistoryAndPropagate, repaintArc) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (repaintArc == null) {
					repaintArc = true;
				}
				command = new Ooshirts.ChangeOutlineCommand({
					item: this,
					outline: outline,
					outlineColor: this.outlineColor,
					repaintArc: repaintArc
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						return window.collaboration.outlineChanged(_this.id, outline);
					}
				});
				return this;
			},
			changeOutlineColor: function(newColor, addToHistoryAndPropagate) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (newColor.search(/#/) !== 0) {
					newColor = '#' + newColor;
				}
				command = new Ooshirts.ChangeOutlineCommand({
					item: this,
					outline: this.outline,
					outlineColor: newColor
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						return window.collaboration.outlineColorChanged(_this.id, newColor);
					}
				});
				return this;
			},
			changeLetterSpacing: function(spacing, addToHistoryAndPropagate, triggerUpdate, resetSize) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				if (triggerUpdate == null) {
					triggerUpdate = true;
				}
				if (resetSize == null) {
					resetSize = true;
				}
				if (spacing < 5 && $.browser.ie.eq8 && this.arc > 0) {
					spacing = 5;
				}
				command = new Ooshirts.ChangeLetterSpacingCommand({
					item: this,
					spacing: spacing,
					resetSize: resetSize
				});
				command.execute(function(cmd) {
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						window.collaboration.letterSpacingChanged(_this.id, spacing);
					}
					if (triggerUpdate) {
						return window.design.shirt.trigger('itemUpdated');
					}
				});
				return this;
			},
			destroyArc: function() {
				var command, _this = this;
				command = new Ooshirts.CreateArcCommand({
					item: this
				});
				command.unexecute(function(cmd) {
					return window.collaboration.itemArcDestroyed(_this.id);
				});
				return this;
			},
			createArc: function() {
				var command, _this = this;
				command = new Ooshirts.CreateArcCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.actions.add(cmd);
					return window.collaboration.itemArcCreated(_this.id);
				});
				return this;
			},
			changeRadius: function(radius, addToHistoryAndPropagate) {
				var command, _this = this;
				if (addToHistoryAndPropagate == null) {
					addToHistoryAndPropagate = true;
				}
				command = new Ooshirts.ChangeRadiusCommand({
					item: this,
					radius: radius
				});
				command.execute(function(cmd) {
					if (_this.outline > 0 && $.browser.msie) {
						_this.changeOutline(_this.outline, false);
					}
					if (addToHistoryAndPropagate) {
						window.design.actions.add(cmd);
						return window.collaboration.itemRadiusChanged(_this.id, radius);
					}
				});
				return this;
			},
			resizeArcBox: function(radius) {
				var arc, deltaX, deltaY, fixRadius, height, radian, textArc, width;
				textArc = this.contents.find(".text-arc");
				this.renderTransform(this, 'rotate', "" + 0 + "deg");
				if (Math.abs(this.arc) <= 180) {
					radius = Math.abs(radius);
					arc = Math.abs(this.arc);
					radian = (2 * Math.PI / 360) * (arc / 2);
					fixRadius = radius + this.originSize.height * 2 / 3;
					width = 2 * (Math.sin(radian) * fixRadius);
					height = (radius - (Math.cos(radian) * radius)) + this.originSize.height * 2 / 3;
				} else {
					radius = Math.abs(radius);
					arc = Math.abs(this.arc);
					radian = (2 * Math.PI / 360) * (180 - arc / 2);
					fixRadius = radius + this.originSize.height * 2 / 3;
					height = Math.cos(radian) * fixRadius + fixRadius;
					width = 2 * fixRadius;
				}
				this.contents.css({
					width: width,
					height: height
				});
				deltaX = -(this.originSize.width - width) / 2;
				deltaY = height - this.originSize.height * 2 / 3;
				if (this.arc > 0) {
					textArc.css({
						left: deltaX
					});
				} else {
					textArc.css({
						left: deltaX,
						top: deltaY
					});
				}
				this.rotate(this.degrees, false, false);
				if (this.outline > 0 && $.browser.ie.eq9) {
					this.changeOutline(this.outline, false, false);
				}
				return this;
			},
			isMultiLine: function() {
				var objs, reg;
				reg = /\n|\r/g;
				objs = this.label.match(reg);
				if (objs) {
					return objs.length;
				} else {
					return 0;
				}
			},
			getLabelHtml: function() {
				var tempLabel;
				tempLabel = this.label;
				return tempLabel.replace(/\r\n/g, '<br>').replace(/\n|\r/g, '<br>').replace(/\s/g, '&nbsp;');
			},
			drawArc: function(resize) {
				var arc, center, radius, textArc, _this = this;
				if (resize == null) {
					resize = true;
				}
				if (this.isMultiLine()) {
					if (Math.abs(this.arc) > 0) {
						this.destroyArc();
						this.arc = 0;
					}
					return;
				}
				if (!this.label) {
					return;
				}
				textArc = this.element.find('.text-arc');
				textArc.empty().text(this.label).width('auto').height('auto').css('top', '').css('left', '');
				this.originSize = this.getOriginSize();
				radius = this.calculateRadius();
				if (this.letterSpacing < 5 && $.browser.ie.eq8 && this.arc > 0) {
					this.letterSpacing = 5;
				}
				if (this.arc < this.minRadius) {
					this.arc = this.minRadius;
				}
				if (this.arc > 0) {
					center = [this.originSize.width / 2, radius + this.originSize.height * 3 / 4];
				} else {
					center = [this.originSize.width / 2, radius];
				}
				arc = {
					path: {
						radius: radius,
						angle: '0deg',
						align: 'center',
						center: center,
						textPosition: 'outside'
					},
					targets: '#' + textArc.attr('id'),
					rotationMode: 'rotate',
					indent: '0em',
					css: "letter-spacing: " + (this.letterSpacing / 2) + "px; font-size: " + this.fontSize + "px;"
				};
				if ($.browser.ie.eq8) {
					this.element.css({
						letterSpacing: '5px',
						overflow: 'hidden'
					});
				}
				cssWarp(arc);
				if ($.browser.ie.lt9) {
					window.setTimeout(function() {
						return _this.resizeArcBox();
					},
					0);
				} else {
					this.resizeArcBox(radius);
				}
				return this;
			},
			calculateRadius: function() {
				var length;
				length = this.label.length;
				return Math.ceil((180 * (this.originSize.width - (this.letterSpacing % 2) * length)) / (this.arc * Math.PI));
			},
			setIEtext: function() {
				var heightupdate, widthUpdate;
				if (this.degrees === 90 || this.degrees === 270) {
					this.element.width('auto');
					this.element.height('auto');
					widthUpdate = this.element.width();
					heightupdate = this.element.height();
					this.element.width(widthUpdate);
					this.element.height(heightupdate);
					this.element.find('.IETransformContainer').find('.text-arc').width(heightupdate);
					return this.element.find('.IETransformContainer').find('.text-arc').height(widthUpdate);
				} else {
					this.element.width('auto');
					this.element.height('auto');
					this.element.find('.IETransformContainer').find('.text-arc').width('auto');
					return this.element.find('.IETransformContainer').find('.text-arc').height('auto');
				}
			},
			appendToDesign: function() {
				var command, _this = this;
				command = new Ooshirts.AppendCommand({
					item: this
				});
				command.execute(function(cmd) {
					window.design.addItem(_this).actions.add(cmd);
					_this.trigger('appended');
					_this.isAppended = true;
					_this.addColor(_this.color, 'fontColor');
					return window.collaboration.itemAdded(_this.serialize());
				});
				return this;
			},
			getOriginSize: function() {
				var size, sizeItem;
				sizeItem = this.element.find('.item-size-test');
				size = {
					width: sizeItem.width(),
					height: sizeItem.height()
				};
				return size;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Item, 'TeamText').inherits(Ooshirts.Item.Text)({
		prototype: {
			init: function(attributes) {
				attributes || (attributes = {});
				if (attributes.isNumberTemplate === "true") {
					this.isNumberTemplate = true;
				} else if (attributes.isNumberTemplate === "false") {
					this.isNumberTemplate = false;
				} else {
					this.isNumberTemplate = !!attributes.numbers;
				}
				attributes = $.extend({
					label: this.isNumberTemplate ? '00': 'sample',
					font: 'Freshman',
					fontSize: this.isNumberTemplate ? 30 : 20,
					arc: 0,
					shapeType: 'normal',
					outline: 0,
					outlineColor: '#000000',
					letterSpacing: 0
				},
				attributes);
				Ooshirts.Item.Text.prototype.init.apply(this, [attributes]);
				this.itemType = 'TeamText';
				this.serializableAttributes = this.serializableAttributes.concat(['isNumberTemplate', 'fontSize']);
				return this;
			},
			repaint: function() {
				this.changeColor(this.color, false);
				this.changeFontSize(this.fontSize, false, false);
				this.changeFont(this.font, false, false, false);
				if (this.fromLoad) {
					return window.design.controlsPanel.panels.namesAndNumbers.initProperties(this);
				}
			},
			restoreFromTrash: function() {
				var command, _this = this;
				command = new Ooshirts.RestoreCommand({
					item: this
				});
				command.execute(function(cmd) {
					return window.design.actions.add(cmd);
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Item, 'Image').inherits(Ooshirts.Item)({
		elementClass: 'ooshirts-shirt-item ooshirts-item-image',
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					url: '/default.png',
					imageRatio: 1,
					size: {
						width: '150',
						height: '150'
					}
				},
				attributes);
				Ooshirts.Item.prototype.init.apply(this, [attributes]);
				this.itemType = 'Image';
				this.transparent = false;
				this.serializableAttributes = this.serializableAttributes.concat(['url', 'flipState', 'flopState', 'colorsUsed', 'originalSize', 'name', 'imageRatio', 'imageSize']);
				this.contents.append('<img class="appended-image item-inner" />');
				this.image = this.element.find('.appended-image');
				if (this.imageRatio != null) {
					this.imageRatio = isNaN(parseFloat(this.imageRatio)) ? this.imageRatio: parseFloat(this.imageRatio);
				}
				if (this.size != null) {
					this.size.width = isNaN(parseFloat(this.size.width)) ? this.size.width: parseFloat(this.size.width);
					this.size.height = isNaN(parseFloat(this.size.height)) ? this.size.height: parseFloat(this.size.height);
					this.contents.css({
						width: this.size.width,
						height: this.size.height
					});
				}
				if (this.originalSize != null) {
					this.originalSize.width = isNaN(parseFloat(this.originalSize.width)) ? this.originalSize.width: parseFloat(this.originalSize.width);
					this.originalSize.height = isNaN(parseFloat(this.originalSize.height)) ? this.originalSize.height: parseFloat(this.originalSize.height);
				}
				if (this.imageSize != null) {
					this.imageSize.width = isNaN(parseFloat(this.imageSize.width)) ? this.imageSize.width: parseFloat(this.imageSize.width);
					this.imageSize.height = isNaN(parseFloat(this.imageSize.height)) ? this.imageSize.height: parseFloat(this.imageSize.height);
				}
				this.showLoader(true);
				this.image.attr({
					src: this.url
				});
				this.isLoaded = false;
				this.bind('appended',
				function(ev) {
					return _this.originalName || (_this.originalName = _this.name);
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			},
			_imageLoaded: function(image) {
				var frame, frameRatio, height, natural, oldPosition, width, _this = this;
				if (!this.fromLoad) {
					frame = window.design.shirt.frame;
					width = image.naturalWidth;
					height = image.naturalHeight;
					if ($.browser.msie) {
						natural = this.getNatural(image);
						width = natural.width;
						height = natural.height;
					}
					this.originalSize || (this.originalSize = {
						width: width,
						height: height
					});
					if (this.updatingClipArt) {
						this.originalSize = {
							width: width,
							height: height
						};
						this.updatingClipArt = false;
					}
					if (width > frame.width || height > frame.height) {
						this.imageRatio = width / height;
						frameRatio = frame.width / frame.height;
						if (this.imageRatio > frameRatio) {
							width = frame.width;
							height = width / this.imageRatio;
						} else {
							height = frame.height;
							width = height * this.imageRatio;
						}
					} else {
						this.imageRatio = width / height;
					}
					this.size = {
						width: width,
						height: height
					};
					this.contents.css({
						width: this.size.width,
						height: this.size.height
					});
					this.imageSize = {
						width: this.size.width,
						height: this.size.height
					};
					this.checkBoundry();
				}
				if (this.fromLoad != null) {
					if (!this.imageSize) {
						this.imageSize = $.extend({},
						this.size);
					}
					this.image.attr(this.imageSize);
					if (this.transferOrder.length === 0 && this.degrees !== 0) {
						this._addToTransferOrder("rotate");
					}
					if (this.transferOrder.length !== 0) {
						this.contents.css(this.imageSize);
						oldPosition = this.getPosition();
						if (this.shirtSide !== window.design.shirt.side) {
							this.one("show",
							function() {
								return _this._loadTransfer(oldPosition);
							});
						} else {
							setTimeout(function() {
								return _this._loadTransfer(oldPosition);
							},
							300);
						}
					} else {
						this.contents.css({
							width: this.size.width,
							height: this.size.height
						});
						this.checkBoundry();
					}
					this.fromLoad = false;
				}
				if (this.fromLoad == null) {
					this.centerElement();
				}
				if (! (this.fromLoad != null) || this.shirtSide === window.design.shirt.side) {
					this.element.show();
				}
				if (this.isAppended) {
					this.select();
				}
				this.trigger('imageLoaded');
				this.isLoaded = true;
				return this;
			},
			_loadTransfer: function(oldPosition) {
				var transferType, _i, _len, _ref;
				_ref = this.transferOrder;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					transferType = _ref[_i];
					if (transferType === 'rotate') {
						this.degrees = parseFloat(this.degrees);
						if (this.degrees) {
							this.rotate(this.degrees, false, true);
						}
					} else if (transferType === 'flip') {
						if (this.flipState === 'true' || this.flipState === true) {
							this.flipState = false;
							this.flip();
						}
					} else if (transferType === 'flop') {
						if (this.flopState === 'true' || this.flopState === true) {
							this.flopState = false;
							this.flop();
						}
					}
				}
				this.resetPosition(oldPosition);
				return this.checkBoundry(false);
			},
			updateImageName: function() {
				this.name = this.url.substring(this.url.lastIndexOf("/") + 1, this.url.lastIndexOf("."));
				return this;
			},
			customizeColors: function(isEdit) {
				if (isEdit == null) {
					isEdit = false;
				}
				if (!window.design.imageColorsDialog) {
					window.design.imageColorsDialog = new Ooshirts.Dialog.UploadedImageSettings({
						image: this,
						closeOnClickOutside: false
					});
				} else {
					window.design.imageColorsDialog.setImage(this);
					window.design.imageColorsDialog.setPreview(this.url);
				}
				window.design.imageColorsDialog.setColorList();
				if (isEdit) {
					window.design.imageColorsDialog.showEditColor();
				} else {
					window.design.imageColorsDialog.showColorPick();
				}
				return this;
			},
			prepareFloodFill: function(callback) {
				var _this = this;
				this.image.parent().css('cursor', 'crosshair');
				this.image.on('click',
				function(ev) {
					var newX, newY, targetOffset, widthFromHalfSize, x, y;
					targetOffset = $(ev.target).offset();
					x = ev.offsetX || (ev.pageX - targetOffset.left);
					y = ev.offsetY || (ev.pageY - targetOffset.top);
					if (_this.flipState && !$.browser.webkit && !$.browser.ie.gt8) {
						widthFromHalfSize = x - (_this.size.width / 2);
						x = (_this.size.width / 2) - widthFromHalfSize;
					}
					if (_this.degrees === 90 && ($.browser.mozilla || $.browser.ie.lt9)) {
						newY = _this.size.width - x;
						newX = _this.size.height - y;
						x = y;
						y = newY;
					}
					if (_this.degrees === 270 && ($.browser.mozilla || $.browser.ie.lt9)) {
						newX = _this.size.height - y;
						y = x;
						x = newX;
					}
					if (_this.degrees === 180 && ($.browser.mozilla || $.browser.ie.lt9)) {
						newX = _this.size.width - x;
						newY = _this.size.height - y;
						x = newX;
						y = newY;
					}
					if (_this.size.width !== _this.originalSize.width && (_this.degrees === 0 || _this.degrees === 180)) {
						x = (x * _this.originalSize.width) / _this.size.width;
						y = (y * _this.originalSize.height) / _this.size.height;
					}
					if (_this.size.width !== _this.originalSize.width && (_this.degrees === 90 || _this.degrees === 270)) {
						x = (x * _this.originalSize.width) / _this.size.height;
						y = (y * _this.originalSize.height) / _this.size.width;
					}
					_this._turnOffFloodfill();
					callback(x, y);
					return false;
				});
				$('body').on('click.floodfill',
				function(ev) {
					_this._turnOffFloodfill();
					return false;
				});
				return this;
			},
			_turnOffFloodfill: function() {
				$('body').off('click');
				this.image.off('click').parent().css('cursor', '');
				return this;
			},
			floodFill: function(x, y, color, callback) {
				var _this = this;
				this.floodFillCmd || (this.floodFillCmd = new Ooshirts.FloodFillCommand({
					item: this
				}));
				this.floodFillCmd.x = x;
				this.floodFillCmd.y = y;
				this.floodFillCmd.color = color;
				this.floodFillCmd.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemFloodFilled(_this.id, _this.url, cmd.item.size.width, cmd.item.size.height, color);
					_this.addColor(color, 'floodfill');
					if (callback) {
						return callback();
					}
				});
				return this;
			},
			changeUrl: function(url, colors, callback) {
				var changeUrl, _this = this;
				changeUrl = new Ooshirts.ChangeUrlCommand({
					item: this,
					url: url,
					colors: colors
				});
				changeUrl.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemFloodFilled(_this.id, url, cmd.item.size.width, cmd.item.size.height, colors);
					if (callback) {
						return callback();
					}
				});
				return this;
			},
			makeOneColor: function(color, callback) {
				var makeOneColorCmd, _this = this;
				makeOneColorCmd = new Ooshirts.MakeOneColorCommand({
					item: this,
					color: color
				});
				makeOneColorCmd.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemMadeOneColor(_this.id, _this.url, cmd.item.size.width, cmd.item.size.height, color);
					_this.fromLoad = true;
					if (callback) {
						return callback();
					}
				});
				return this;
			},
			makeTransparent: function(callback) {
				var noWhiteCmd, _this = this;
				noWhiteCmd = new Ooshirts.RemoveWhiteCommand({
					item: this
				});
				noWhiteCmd.execute(function(cmd) {
					window.design.actions.add(cmd);
					window.collaboration.itemMadeTransparent(_this.id, _this.url, cmd.item.size.width, cmd.item.size.height);
					_this.removeColor('transparent');
					_this.transparent = true;
					if (callback) {
						return callback();
					}
				});
				return this;
			},
			setUrl: function(url) {
				this.url = url;
				this.updateImageName();
				this.image.attr('src', this.url);
				return this;
			},
			setUrlWithSize: function(url, width, height) {
				this.url = url;
				if (width && height) {
					this.image.css({
						width: width,
						height: height
					});
					this.image.attr({
						width: width,
						height: height
					});
				}
				this.updateImageName();
				this.image.attr('src', this.url);
				return this;
			},
			showLoader: function(resetSize) {
				var _this = this;
				if (resetSize == null) {
					resetSize = false;
				}
				this.image.css('opacity', 0).parent().addClass('loader');
				this.image.unbind('load');
				this.image.bind('load',
				function() {
					return $(this).css('opacity', 1).parent().removeClass('loader');
				});
				if (resetSize) {
					return this.image.bind('load',
					function(ev) {
						return _this._imageLoaded(ev.target);
					});
				}
			},
			setImageSize: function() {
				var angle2, cos, cos2, height, newDegrees, sin, sin2, width;
				this.imageSize = {
					height: this.image.height(),
					width: this.image.width()
				};
				if ($.browser.ie.lt9) {
					newDegrees = this.degrees;
					if (newDegrees > 180) {
						newDegrees = newDegrees - 180;
					}
					if (newDegrees > 90) {
						newDegrees = 180 - newDegrees;
					}
					angle2 = this._toRadians(newDegrees);
					sin = Math.sin(angle2);
					cos = Math.cos(angle2);
					sin2 = Math.pow(sin, 2);
					cos2 = Math.pow(cos, 2);
					height = this.image.height() + 1;
					width = this.image.width() + 1;
					return this.imageSize = {
						width: Math.abs(Math.floor((sin * height - cos * width) / (sin2 - cos2))),
						height: Math.abs(Math.floor((cos * height - sin * width) / (cos2 - sin2)))
					};
				}
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Item, 'Clipart').inherits(Ooshirts.Item.Image)({
		elementClass: 'ooshirts-shirt-item ooshirts-item-image-clipart',
		search: function(query, hexcolor, callback) {
			$.getJSON('http://www.ooshirts.com/lab/clipartsearch.php', {
				keywords: query,
				color: hexcolor
			},
			function(clips) {
				var clip, data, _i, _len;
				data = [];
				for (_i = 0, _len = clips.length; _i < _len; _i++) {
					clip = clips[_i];
					data.push(new Ooshirts.Clipart({
						name: clip.name,
						width: clip.x,
						height: clip.y,
						color: hexcolor,
						url: "http://ooshirts-clipart.s3.amazonaws.com/ooo" + clip.name + "-" + hexcolor + ".gif"
					}));
				}
				return callback(data);
			});
			return null;
		},
		prototype: {
			init: function(attributes) {
				attributes = $.extend({},
				attributes);
				Ooshirts.Item.Image.prototype.init.apply(this, [attributes]);
				this.itemType = 'Clipart';
				this.serializableAttributes = this.serializableAttributes.concat(['name']);
				return this;
			},
			appendToDesign: function() {
				var _this = this;
				$.ajax({
					url: 'http://www.ooshirts.com/lab/addclipart.php',
					type: 'post',
					async: false,
					data: {
						name: this.name,
						hex: this.color.replace(/#/, '')
					},
					dataType: 'text',
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						_this.url = "http://ooshirts-uploads.s3.amazonaws.com/" + data + ".png";
						_this.image.attr({
							src: _this.url
						});
						_this.name = data;
						Ooshirts.Item.Image.prototype.appendToDesign.apply(_this);
						return _this.addColor(_this.color, 'stroke');
					}
				});
				return this;
			},
			updateClipArt: function(name, color) {
				var _this = this;
				$.ajax({
					url: 'http://www.ooshirts.com/lab/addclipart.php',
					type: 'post',
					data: {
						name: name,
						hex: color.replace(/#/, '')
					},
					dataType: 'text',
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						_this.url = "http://ooshirts-uploads.s3.amazonaws.com/" + data + ".png";
						_this.image.attr({
							src: _this.url
						});
						_this.name = data;
						_this.originalName = _this.name;
						window.design.deselectAll(false);
						return _this.updatingClipArt = true;
					}
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Dialog').inherits(Ooshirts.Widget)({
		elementClass: 'dialog',
		html: '<div></div>',
		prototype: {
			init: function(attributes) {
				attributes = $.extend({
					dialogContainer: $('#dialog-container'),
					closeOnClickOutside: true
				},
				attributes);
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.bindDialogClick();
				return this;
			},
			bindDialogClick: function() {
				var _this = this;
				this.element.on('click', '.close-link',
				function() {
					if (_this.isVisible()) {
						return _this.hide();
					}
				});
				if (this.closeOnClickOutside) {
					this.element.clickoutside(function(ev) {
						if (_this.isVisible()) {
							return _this.hide();
						}
					});
				}
				return this;
			},
			hide: function() {
				$('body').css('overflow-y', '');
				this.element.fadeOut();
				this.dialogContainer.fadeOut();
				return this;
			},
			show: function(callback) {
				$('body').css('overflow-y', 'hidden');
				this.element.siblings().hide();
				this.dialogContainer.fadeIn();
				this.element.fadeIn('fast');
				if (callback) {
					callback.apply(this);
				}
				this.trigger('show');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'TshirtPhotos').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var that;
				attributes = $.extend({
					element: $('.tshirt-photos')
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				that = this;
				this.element.find('.t-shirt-picture-detail').on('click',
				function(ev) {
					that.showPhoto($(this).data('type'));
					return false;
				});
				return this;
			},
			showPhoto: function(type) {
				return this.setImage(this.element.find('.image-window-photo'), "" + window.baseProductURL + "/products/" + this.tshirtID + "/" + type + ".jpg");
			},
			renderPhotos: function() {
				var photoTypes, type, _i, _len, _results;
				photoTypes = ['front', 'back', 'catalog', 'collar', 'labcatalog', 'sleeve', 'sleevecloseup'];
				_results = [];
				for (_i = 0, _len = photoTypes.length; _i < _len; _i++) {
					type = photoTypes[_i];
					_results.push(this.setImage(this.element.find(".clip-art-image-" + type), "" + window.baseProductURL + "/products/" + this.tshirtID + "/" + type + "_thumb_small.jpg"));
				}
				return _results;
			},
			setImage: function(image, src) {
				var frameDetail, frameFullImage, that;
				that = this;
				frameFullImage = {
					width: 607,
					height: 552
				};
				frameDetail = {
					width: 49,
					height: 49
				};
				image.hide().attr({
					src: '',
					width: '',
					height: ''
				}).load(function() {
					var img;
					if (this.className === 'image-window-photo') {
						img = that.setImageSize(this, frameFullImage);
						that.positionImage($(this), frameFullImage);
					} else {
						img = that.setImageSize(this, frameDetail);
						that.positionImage($(this), frameDetail);
					}
					return $(img).show();
				}).prop('src', src);
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						height = frame.height;
						width = height * imageRatio;
					} else {
						width = frame.width;
						height = width / imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			positionImage: function(image, frame) {
				if (frame == null) {
					frame = {};
				}
				image.css({
					'top': Math.round((frame.height - image.outerHeight()) / 2),
					'left': Math.round((frame.width - image.outerWidth()) / 2)
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'UploadedImageSettings').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('.uploaded-image.dialog')
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.multiple-color-select'),
					multipleSelect: true,
					fullColor: true,
					name: 'multipleColorPicker'
				}));
				this.setPreview(this.image.url);
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.cancel-btn'),
					name: 'cancelButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.ok-btn'),
					name: 'continueButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.finish-btn'),
					name: 'finishButton'
				}));
				this.cancelButton.bind('click',
				function() {
					_this.preview.remove();
					_this.multipleColorPicker.hidePMS();
					_this.element.find(".errorMessage").hide();
					_this.element.find(".placeholder").show();
					_this.hide();
					return _this.element.find('.custom-mage').remove();
				});
				this.continueButton.bind("click",
				function() {
					return _this._onContinueButtonClick();
				});
				this.finishButton.bind("click",
				function() {
					if (_this.multipleColorPicker.colorList.length === 0 && !_this.multipleColorPicker.isFullColorMode) {
						_this.element.find(".errorMessage").show();
						_this.element.find(".placeholder").hide();
						return;
					}
					_this.hide();
					_this.element.find(".errorMessage").hide();
					_this.element.find(".placeholder").show();
					_this.multipleColorPicker.hidePMS();
					_this.element.find('.custom-image').remove();
					_this.image.colorsUsed = null;
					if (_this.multipleColorPicker.isFullColorMode) {
						_this.image.addColor(["full"], 'origColors');
					} else {
						_this.image.addColor(_this.multipleColorPicker.colorList, 'origColors');
					}
					return _this.image.refreshSetting();
				});
				this.multipleColorPicker.bind("colorAdded",
				function(event) {
					return this.setColor(event.color);
				});
				return this;
			},
			showColorPick: function() {
				this.element.removeClass("edit-color");
				this.multipleColorPicker.addSelectedColorFlag();
				return this.show();
			},
			showEditColor: function() {
				this.element.addClass("edit-color");
				this.multipleColorPicker.addSelectedColorFlag();
				return this.show();
			},
			_onContinueButtonClick: function() {
				var event, _this = this;
				if (this.multipleColorPicker.colorList.length === 0 && !this.multipleColorPicker.isFullColorMode) {
					this.element.find(".errorMessage").show();
					this.element.find(".placeholder").hide();
					return;
				}
				this.hide();
				this.element.find(".errorMessage").hide();
				this.element.find(".placeholder").show();
				this.multipleColorPicker.hidePMS();
				this.element.find('.custom-image').remove();
				this.image.updateImageName();
				event = "imageLoaded";
				if (this.image.isLoaded) {
					event = "appended";
				}
				this.image.bind(event,
				function() {
					if (_this.multipleColorPicker.isFullColorMode) {
						_this.image.addColor(["full"], 'origColors');
					} else {
						_this.image.addColor(_this.multipleColorPicker.colorList, 'origColors');
					}
					return _this.image.select();
				});
				return this.image.appendToDesign();
			},
			setPreview: function(url) {
				var imageContainer, that;
				that = this;
				imageContainer = this.element.find('.image-example');
				imageContainer.append('<img alt="Uploaded Image" class="custom-image" />');
				imageContainer.css({
					width: 172,
					height: 150
				});
				this.preview = this.element.find('.custom-image');
				this.preview.css('opacity', 0).parent().addClass('loader');
				this.preview.attr({
					src: '',
					width: '',
					height: ''
				}).load(function() {
					var img;
					img = that.setImageSize(this);
					imageContainer.css({
						width: img.width,
						height: img.height
					});
					return $(this).css('opacity', 1).parent().removeClass('loader');
				}).prop('src', url);
				return this;
			},
			setImage: function(image) {
				this.image = image;
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				frame = {
					width: 172,
					height: 324
				};
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			positionImage: function() {
				this.preview.css({
					'margin-top': Math.round((324 - this.preview.outerHeight()) / 2)
				});
				return this;
			},
			setColorList: function() {
				var allColors, color, _i, _len;
				this.multipleColorPicker.reset();
				allColors = this.image.getAllColors();
				if (allColors.length > 0) {
					if (this.image.isFullColor()) {
						this.multipleColorPicker.setFullColor();
					} else {
						for (_i = 0, _len = allColors.length; _i < _len; _i++) {
							color = allColors[_i];
							this.multipleColorPicker.setColor(color);
						}
					}
				}
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts.Dialog, 'TshirtCatalog').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var that, _this = this;
				attributes = $.extend(attributes, {
					closeOnClickOutside: true
				});
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.currentProduct = '';
				this.dropdownOptions = this.element.find('.dropdown-options > ul');
				this.tshirtStyleList = this.element.find('.t-shirt-style-list');
				this.productInformation = this.element.find('.t-shirt-description');
				this.productCategory = this.productInformation.find('.t-shirt-category');
				this.productType = this.productInformation.find('.t-shirt-type');
				this.productDescription = this.productInformation.find('.description-information');
				this.productMaterials = this.productInformation.find('.materials-information');
				this.dropdownOptionsSubtitleTemplate = "<li class=\"subtitle\">#tshirtcategoryname</li>";
				this.dropdownCategoryOptionTemplate = "<li class=\"dropdown-option\" data-category=\"#tshirtcategoryid\" data-value=\"#tshirtsubcategoryid\"><a href=\"#\">#tshirtsubcategoryname</a></li>";
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.scroll-wrapper'),
					name: 'scrollPane'
				}));
				this.scrollPane.element.bind('load',
				function() {
					return _this.scrollPane.repaint();
				});
				this.categoryDropdown = new Ooshirts.Widget.Dropdown({
					element: this.element.find('.dropdown'),
					name: 'categoryDropdown'
				});
				this.chooseTshirtButton = new Ooshirts.Widget.Button({
					element: this.element.find('.primary-button'),
					name: 'chooseTshirtButton'
				});
				this.closeButton = new Ooshirts.Widget.Button({
					element: this.element.find('.close-link'),
					name: 'closeButton'
				});
				this.categoryDropdown.bind('change',
				function(ev) {
					_this._cleanTshirtStyleList();
					return _this._updateTshirtList(ev);
				});
				this.tshirtStyleList.on('click', '.t-shirt-style',
				function(ev) {
					_this._updateTshirtDescription(ev);
					return false;
				});
				this.chooseTshirtButton.bind('click',
				function(ev) {
					_this.trigger('productSelected', {
						product: _this.currentProduct,
						opener: _this.opener
					});
					return _this.hide();
				});
				this.closeButton.bind('click',
				function() {
					return _this.hide();
				});
				that = this;
				this.element.on('click', '.color-picker-list .color-picker-canvas',
				function(ev) {
					ev.preventDefault();
					$(this).parents(".color-picker-list").find('.color-picker-canvas').removeClass('color-selected');
					$(this).addClass('color-selected');
					this.color = {
						id: $(this).data('id'),
						name: $(this).data('color'),
						hexcode: $(this).data('hex')
					};
					return that.trigger('colorChange', {
						color: this.color
					});
				});
				this.bind('colorChange',
				function(ev) {
					_this.currentProduct.color = ev.color;
					_this.currentProduct.url = _this._buildUrl(ev.color.name, _this.currentProduct.id);
					return _this.productInformation.find('.t-shirt-style-link img').attr('src', _this.currentProduct.url);
				});
				this.bind('show',
				function() {
					return _this.scrollPane.element.trigger('load');
				});
				this.one('show',
				function() {
					var defaultShirt;
					if (window.design.shirt) {
						defaultShirt = window.design.shirt;
						_this.dropdownOptions.find('.dropdown-option').filter(function() {
							return $(this).data('value') === parseInt(defaultShirt.subcategoryId) && $(this).data('category') === parseInt(defaultShirt.categoryId);
						}).trigger('click');
						return _this._updateTshirtInfo(defaultShirt.id, defaultShirt.url);
					} else {
						_this.dropdownOptions.find('.dropdown-option').first().trigger('click');
						return window.setTimeout(function() {
							return that.tshirtStyleList.find('.t-shirt-style').first().trigger('click');
						},
						1000);
					}
				});
				return this;
			},
			_buildUrl: function(colorname, productId) {
				var colorParam, sideParam;
				sideParam = 'F';
				colorParam = colorname.replace(/\s/g, '-');
				return "" + window.baseProductURL + "/images/lab_shirts/" + colorParam + "-" + productId + "-" + sideParam + ".jpg";
			},
			startPopulate: function() {
				var _this = this;
				this.dropdownOptions.empty();
				this.tshirtStyleList.empty();
				this.productInformation.find('.t-shirt-style-link').html('');
				this.productCategory.html('');
				this.productType.html('');
				this.productDescription.html('');
				this.productMaterials.html('');
				Ooshirts.Shirt.all(function(data) {
					_this.tshirtsData = data;
					return _this._populateCategoryDropdown();
				});
				return this;
			},
			showAndReset: function(opener) {
				this.show();
				this.scrollPane.repaint();
				this.opener = opener;
				return this;
			},
			_populateCategoryDropdown: function() {
				var $newSubCategoryItem, anyProductMatches, category, color, key, newCategoryItem, newSubCategoryItem, product, subcategory, that, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
				that = this;
				_ref = this.tshirtsData;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					category = _ref[_i];
					newCategoryItem = this.dropdownOptionsSubtitleTemplate.replace(/#tshirtcategoryname/, category.name);
					this.dropdownOptions.append(newCategoryItem);
					_ref1 = category.subcategories;
					for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
						subcategory = _ref1[_j];
						anyProductMatches = false;
						_ref2 = subcategory.products;
						for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
							product = _ref2[_k];
							if (anyProductMatches) {
								break;
							}
							_ref3 = product.colors;
							for (key in _ref3) {
								color = _ref3[key];
								if (anyProductMatches) {
									break;
								}
								if (color.hex === window.design.shirt.color.hexcode) {
									anyProductMatches = true;
									break;
								}
							}
						}
						newSubCategoryItem = this.dropdownCategoryOptionTemplate.replace(/#tshirtcategoryid/, category.id).replace(/#tshirtsubcategoryid/, subcategory.id).replace(/#tshirtsubcategoryname/, subcategory.name);
						$newSubCategoryItem = $(newSubCategoryItem);
						this.dropdownOptions.append($newSubCategoryItem);
					}
				}
				this.categoryDropdown.value = 0;
				return this;
			},
			_updateTshirtDescription: function(ev) {
				var $item, productId;
				$item = $(ev.currentTarget).clone();
				productId = $item.data('value');
				this._updateTshirtInfo(productId, $('img', ev.target).attr('data-original'));
				return this;
			},
			_updateTshirtInfo: function(productId, url) {
				var _this = this;
				return Ooshirts.Shirt.getShirtDetail(productId,
				function(product) {
					var $image, color, colorElement, key, that, _ref, _results;
					if (product) {
						_this.currentProduct = product;
						_this.currentProduct.url = url;
						that = _this;
						$image = $("<img>").attr("src", _this.currentProduct.url).bind('load',
						function() {
							that._setImageSize(this);
							return that._positionImage($(this));
						});
						_this.productInformation.find('.t-shirt-style-link').empty().append($image);
						_this.productCategory.html(product.category);
						_this.productType.html(product.name);
						_this.productDescription.html(product.description);
						_this.productMaterials.html(product.materials);
						_this.element.find('.color-picker-list').empty();
						_ref = product.colors;
						_results = [];
						for (key in _ref) {
							if (!__hasProp.call(_ref, key)) continue;
							color = _ref[key];
							if (product.id === window.design.shirt.id && color.id === window.design.shirt.color.id) {
								colorElement = "<li class=\"color-picker-element regular-color\">\n<a class=\"color-picker-canvas regular-color-canvas color-selected\" data-id=\"" + color.id + "\" data-color=\"" + color.color + "\" data-hex=\"" + color.hex + "\" style=\"background-color: #" + color.hex + ";\" title=\"" + color.color + "\"></a>\n</li>";
							} else {
								colorElement = "<li class=\"color-picker-element regular-color\" data-value=\"" + color.id + "\">\n<a class=\"color-picker-canvas regular-color-canvas\" data-id=\"" + color.id + "\" data-color=\"" + color.color + "\" data-hex=\"" + color.hex + "\" style=\"background-color: #" + color.hex + ";\" title=\"" + color.color + "\"></a>\n</li>";
							}
							_this.element.find('.color-picker-list').append(colorElement);
							if (product.id !== window.design.shirt.id) {
								_results.push(_this.element.find('.color-picker-list li:first a').click());
							} else {
								_results.push(void 0);
							}
						}
						return _results;
					}
				});
			},
			_cleanTshirtStyleList: function() {
				if (this.element.find('.t-shirt-style-list .t-shirt-style').length > 0) {
					this.element.find('.t-shirt-style-list .t-shirt-style').remove();
				}
				return this;
			},
			_updateTshirtList: function(ev) {
				var appendProduct, cat, category, categoryId, color, imageTemplate, key, product, subCat, subCategory, subCategoryId, that, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
				subCategory = null;
				category = null;
				that = this;
				categoryId = ev.option.data('category') + '';
				subCategoryId = ev.option.data('value') + '';
				_ref = this.tshirtsData;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					cat = _ref[_i];
					if (cat.id === categoryId) {
						category = cat;
						break;
					}
				}
				_ref1 = category.subcategories;
				for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
					subCat = _ref1[_j];
					if (subCat.id === subCategoryId) {
						subCategory = subCat;
						break;
					}
				}
				_ref2 = subCategory.products;
				for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
					product = _ref2[_k];
					appendProduct = false;
					_ref3 = product.colors;
					for (key in _ref3) {
						color = _ref3[key];
						if (color.hex.toString().toLowerCase() === window.design.shirt.color.hexcode.toString().toLowerCase()) {
							appendProduct = true;
							break;
						}
					}
					appendProduct = true;
					if (appendProduct) {
						imageTemplate = "<li class=\"t-shirt-style\" data-value=\"" + product.id + "\" data-category=\"" + categoryId + "\" data-subcategory=\"" + subCategoryId + "\">\n  <p class='clip-art-image'>\n    <a class=\"t-shirt-style-link\" href=\"#\">\n     <img alt=\"\" data-original='" + window.baseProductURL + "/products/" + product.id + "/labcatalog.jpg' src='" + assetsBaseURL + "assets/images/inv.png' src=\"\" data-value=\"" + product.id + "\" data-category=\"" + categoryId + "\" data-subcategory=\"" + subCategoryId + "\">\n    </a>\n  </p>\n  <span class=\"t-shirt-style-name\">" + product.name + "</span>\n</li>";
						this.tshirtStyleList.append(imageTemplate);
					}
				}
				if (this.lazyloadImage) {
					this.lazyloadImage.each(function() {
						if (this.backImage) {
							this.backImage.unbind("load").unbind("error");
							return this.backImage = null;
						}
					});
					this.lazyloadImage.remove();
					this.lazyloadImage.unbind(".lazyload");
					this.scrollPane.element.unbind(".lazyload");
					this.lazyloadImage = null;
				}
				this.lazyloadImage = this.element.find('img[data-original]').lazyload({
					container: this.scrollPane.element,
					skip_invisible: true,
					event: 'scroll mousewheel load',
					effect: 'fadeIn',
					threshold: 100,
					load: function() {
						that._setImageSize(this);
						that._positionImage($(this));
						return this;
					},
					error: function() {
						$(this).parents('li.t-shirt-style').remove();
						return this;
					}
				});
				if (this.isVisible()) {
					return this.scrollPane.element.trigger('load');
				}
			},
			_setImageSize: function(image) {
				var frame, frameRatio, height, imageRatio, natural, width;
				frame = {
					width: 86,
					height: 100
				};
				width = image.width;
				height = image.height;
				if ($.browser.msie) {
					natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				return image;
			},
			_positionImage: function(image) {
				var frame;
				frame = {
					width: 86,
					height: 100
				};
				image.css({
					'top': Math.round((frame.height - image.outerHeight()) / 2),
					'left': Math.round((frame.width - image.outerWidth()) / 2)
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'Nickname').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function() {
				var attributes, _this = this;
				attributes = {
					element: $('.screen-name.dialog'),
					closeOnClickOutside: false
				};
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.input-nickname'),
					name: 'inputNickname'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.primary-button'),
					name: 'confirmNicknameBtn'
				}));
				this.inputNickname.bind('submit',
				function(ev) {
					return _this.submitNickname();
				});
				this.confirmNicknameBtn.bind('click',
				function() {
					return _this.submitNickname();
				});
				return this;
			},
			submitNickname: function() {
				if (!this.inputNickname.getValue()) {
					this.inputNickname.setValue("Guest" + (~~ (Math.random() * 1000)));
				}
				this.nickname = this.inputNickname.getValue().substring(0, 12);
				this.hide();
				this.trigger('submit', {
					nickname: this.nickname
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'SaveComplete').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('.save-complete.dialog'),
					closeOnClickOutside: true
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.sharingUrlRoot = window.baseURL + 'sharing/';
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.input-design-link'),
					name: 'designLink'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.facebook'),
					name: 'facebookButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.twitter'),
					name: 'twitterButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.email'),
					name: 'emailButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.icon-cross'),
					name: 'closeButton'
				}));
				this.addChild(new Ooshirts.Dialog.SendEmail({
					name: 'sendEmailDialog'
				}));
				this.closeButton.bind('click',
				function() {
					return _this.hide();
				});
				return this;
			},
			updateShareLinks: function(id) {
				var url;
				url = this.sharingUrlRoot + id;
				this._updateInputLink(url);
				this._updateFacebookShareLink(url);
				this._updateTwitterShareLink(url);
				this._updateEmailShareLink(url, id);
				this.show();
				return this;
			},
			_updateInputLink: function(url) {
				this.designLink.setValue(url);
				return this;
			},
			_updateFacebookShareLink: function(url) {
				this.facebookButton.bind('click',
				function() {
					return window.open('http://facebook.com/sharer.php?u=' + encodeURIComponent(url), 'shareFacebook', 'status=0,toolbar=0,width=600,height=300,location=0');
				});
				return this;
			},
			_updateTwitterShareLink: function(url) {
				var msg;
				msg = "%40ooshirts Check out my t-shirt design! ";
				this.twitterButton.bind('click',
				function() {
					return window.open("http://twitter.com/intent/tweet?text=" + msg + "&url=" + encodeURIComponent(url), 'shareTwitter', 'status=0,toolbar=0,width=600,height=300,location=0');
				});
				return this;
			},
			_updateEmailShareLink: function(url, id) {
				var _this = this;
				this.emailButton.bind('click',
				function(ev) {
					var data;
					data = {
						url: url,
						designId: id
					};
					_this.sendEmailDialog.fillForm(data);
					return _this.sendEmailDialog.show();
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'SendEmail').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('.send-email.dialog'),
					closeOnClickOutside: false
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.emailRegex = new RegExp(/[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i);
				this.emailGroup = this.element.find('.email-group');
				this.emailGroup.removeClass('error');
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.close-link'),
					name: 'closeButton'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.input-email-to'),
					name: 'emailTo'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.input-name'),
					name: 'nameTo'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('.textarea-message'),
					name: 'message'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.primary-button'),
					name: 'sendEmailButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.secondary-button'),
					name: 'cancelButton'
				}));
				this.notice = this.element.find('.send-button-container > .notice');
				this.closeButton.bind('click',
				function() {
					return _this._cancel();
				});
				this.cancelButton.bind('click',
				function() {
					return _this._cancel();
				});
				this.sendEmailButton.bind('click',
				function() {
					var emailTo, msg;
					if (_this._validateEmail()) {
						_this.sendEmailButton.hide();
						_this.emailGroup.removeClass('error');
						msg = _this.message.getValue();
						emailTo = _this.emailTo.getValue();
						return Ooshirts.Share.send({
							name: _this.nameTo.getValue(),
							mesage: msg,
							emails: _this.emailTo.getValue(),
							design_id: _this.designId
						},
						function() {
							_this.notice.show();
							return setTimeout(function() {
								_this.hide();
								_this.notice.hide();
								return _this.sendEmailButton.show();
							},
							1000);
						},
						function() {
							return alert("There was an error sending the email. Please try again later.");
						});
					} else {
						return _this.emailGroup.addClass('error');
					}
				});
				return this;
			},
			fillForm: function(data) {
				var msg;
				msg = 'Hi! Look at this t-shirt design I just made. ';
				this.message.setValue(msg + data.url);
				this.designId = data.designId;
				return this;
			},
			_validateEmail: function() {
				return this.emailRegex.test(this.emailTo.getValue());
			},
			_cancel: function() {
				this.parent.show();
				this._resetForm();
				return this;
			},
			_resetForm: function() {
				this.emailTo.setValue('');
				this.nameTo.setValue('');
				this.message.setValue('');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'ImageFloodfill').inherits(Ooshirts.Dialog)({
		prototype: {
			init: function() {
				var attributes, _this = this;
				attributes = {
					element: $('.image-floodfill')
				};
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.image = this.element.find('.image-window > img');
				this.image.addClass('paintbucketCursor');
				this.historyFloodfill = new Ooshirts.ActionsHistory();
				this.currentImage || (this.currentImage = '');
				this.colors || (this.colors = []);
				this.addChild(new Ooshirts.Widget.DropdownColor({
					element: this.element.find('.image-floodfill-color-picker'),
					name: 'imageFloodfillColorPicker'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.cancel-btn'),
					name: 'cancelBtn'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.ok-btn'),
					name: 'okBtn'
				}));
				this.imageFloodfillColorPicker.bind('change',
				function(ev) {
					return _this._updateFloodFillColor(ev);
				});
				this.cancelBtn.bind('click',
				function(ev) {
					return _this.hide();
				});
				this.okBtn.bind('click',
				function(ev) {
					return _this.save();
				});
				this.prepareFloodFill(function(x, y) {
					return _this.floodFill(x, y, _this.imageFloodfillColorPicker.getCurrentColor());
				});
				return this;
			},
			getInstance: function() {
				this.instance || (this.instance = new Ooshirts.Dialog.ImageFloodfill());
				return this.instance;
			},
			revert: function() {
				var _this = this;
				return this.historyFloodfill.undo(function(cmd) {
					return _this.colors.pop();
				});
			},
			_updateFloodFillColor: function(ev) {
				this.floodfillColor = ev.value;
				return true;
			},
			setImageItem: function(imageItem) {
				this.currentImageItem = imageItem;
				this.historyFloodfill.reset();
				this.colors = [];
				this.showLoader(true);
				return this.setUrl(imageItem.url);
			},
			setUrl: function(url) {
				this.url = url;
				this.updateImageName();
				this.image.attr({
					src: '',
					width: '',
					height: ''
				}).attr({
					src: url
				});
				return this;
			},
			setUrlWithSize: function(url, width, height) {
				this.url = url;
				if (width && height) {
					this.image.css({
						width: width,
						height: height
					});
				}
				this.image.attr({
					src: '',
					width: width,
					height: height
				});
				this.updateImageName();
				this.image.attr({
					src: this.url
				});
				return this;
			},
			updateImageName: function() {
				this.name = this.url.substring(this.url.lastIndexOf("/") + 1, this.url.lastIndexOf("."));
				return this;
			},
			setImageSize: function(image, frame) {
				var frameRatio, height, imageRatio, natural, width;
				if (frame == null) {
					frame = {};
				}
				width = image.width;
				height = image.height;
				this.originalSize = {
					width: width,
					height: height
				};
				if ($.browser.msie) {
					this.originalSize = natural = this.getNatural(image);
					width = natural.width;
					height = natural.height;
				}
				if (width > frame.width || height > frame.height) {
					imageRatio = width / height;
					frameRatio = frame.width / frame.height;
					if (imageRatio > frameRatio) {
						width = frame.width;
						height = width / imageRatio;
					} else {
						height = frame.height;
						width = height * imageRatio;
					}
				}
				image.width = width;
				image.height = height;
				this.size = {
					width: width,
					height: height
				};
				return image;
			},
			positionImage: function(image, frame) {
				if (frame == null) {
					frame = {};
				}
				image.css({
					'top': Math.round((frame.height - image.outerHeight()) / 2),
					'left': Math.round((frame.width - image.outerWidth()) / 2)
				});
				return this;
			},
			getNatural: function(image) {
				var pic;
				pic = new Image();
				pic.src = image.src;
				return {
					width: pic.width,
					height: pic.height
				};
			},
			prepareFloodFill: function(callback) {
				var _this = this;
				this.image.on('click',
				function(ev) {
					var targetOffset, x, y;
					targetOffset = $(ev.target).offset();
					x = ev.offsetX || (ev.pageX - targetOffset.left);
					y = ev.offsetY || (ev.pageY - targetOffset.top);
					x = x + 4;
					if ($.browser.msie) {
						y = y - 16;
					} else {
						y = y + 16;
					}
					x = (x * _this.originalSize.width) / _this.size.width;
					y = (y * _this.originalSize.height) / _this.size.height;
					callback(x, y);
					return false;
				});
				return this;
			},
			floodFill: function(x, y, color, callback) {
				var floodFillCmd, _this = this;
				floodFillCmd = new Ooshirts.FloodFillCommand({
					item: this,
					x: x,
					y: y,
					color: color
				});
				floodFillCmd.execute(function(cmd) {
					_this.historyFloodfill.add(cmd);
					_this.colors.push(cmd.color);
					if (callback) {
						return callback();
					}
				});
				return this;
			},
			save: function() {
				var _this = this;
				return this.currentImageItem.changeUrl(this.url, this.colors,
				function() {
					return _this.hide();
				});
			},
			_imageLoaded: function(img) {
				var frameFullImage;
				frameFullImage = {
					width: 710,
					height: 373
				};
				this.setImageSize(img, frameFullImage);
				return this.positionImage($(img), frameFullImage);
			},
			showLoader: function(resetSize) {
				var _this = this;
				if (resetSize == null) {
					resetSize = true;
				}
				this.image.css('opacity', 0).parent().addClass('loader');
				this.image.unbind('load');
				this.image.bind('load',
				function() {
					return $(this).css('opacity', 1).parent().removeClass('loader');
				});
				if (resetSize) {
					return this.image.bind('load',
					function(ev) {
						return _this._imageLoaded(ev.target);
					});
				}
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, "MessageBoxDialog").inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('.message-box-dialog.dialog')
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.dialogContents = this.element.find(".dialog-contents");
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				this.bind('show',
				function() {
					return _this.panelScrollPane.repaint();
				});
				return this;
			},
			show: function(messages) {
				var message, _i, _len, _messages;
				if (messages) {
					_messages = [];
					if (Object.prototype.toString.call(messages) === '[object Array]') {
						for (_i = 0, _len = messages.length; _i < _len; _i++) {
							message = messages[_i];
							_messages.push("<p>" + message + "</p>");
						}
					} else {
						_messages.push('<p>' + messages + '</p>');
					}
					this.dialogContents.append(_messages.join(''));
				}
				return Ooshirts.Dialog.prototype.show.call(this);
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, "WelcomeScreen").inherits(Ooshirts.Dialog)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('.welcome-screen.dialog')
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.primary-button.start-btn'),
					name: 'startButton'
				}));
				this.startButton.bind("click",
				function() {
					return _this.hide();
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'Spreadsheet').inherits(Ooshirts.Dialog).includes(Ooshirts.Serializable)({
		prototype: {
			customSerializations: ['serializeData'],
			customLoads: ['loadData'],
			init: function(attributes) {
				var move, that, _this = this;
				attributes = $.extend({
					element: $('.spreadsheet.dialog'),
					closeOnClickOutside: true
				},
				attributes);
				Ooshirts.Dialog.prototype.init.apply(this, [attributes]);
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.close-link'),
					name: 'closeButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('.ok-btn'),
					name: 'saveButton'
				}));
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.nano'),
					name: 'panelScrollPane'
				}));
				this.addChild(new Ooshirts.Widget.MessageBox({
					element: this.element.find("#spreadsheet-tooltip"),
					name: 'messageBox'
				}));
				this.closeButton.bind('click',
				function() {
					return _this._cancel();
				});
				this.saveButton.bind('click',
				function() {
					return _this._save();
				});
				this.tbody = this.element.find('tbody');
				this.dropdowns = [];
				this.rows = [];
				this.data = [];
				that = this;
				this.chooseFileUpload = this.element.find('.choose-file-upload');
				this.uploadingFile = this.element.find('#spreadsheet-upload-loading');
				this.uploadNumberListFile();
				this.element.on('keyup', '.last-row input',
				function() {
					if ($(this).val()) {
						that._addRow();
						that._repaintScrollPane();
					}
					return true;
				});
				this.element.on('change', '.last-row .dropdown',
				function() {
					that._addRow();
					that._repaintScrollPane();
					return true;
				});
				this.element.on('keyup', 'input',
				function() {
					if (!window.header.isEditQuantities) {
						that.messageBox.showMessage("Before entering personalization data, please first enter your order quantities in the quote form.");
						return false;
					}
				});
				this.bind('show',
				function() {
					_this.options = _this._generateOptions();
					_this._reset();
					if (_this.data.length === 0) {
						_this._addRow();
					} else {
						_this.loadData(_this.data);
					}
					_this._repaintScrollPane();
					return _this.messageBox.hide();
				});
				if ($.browser.mozilla && parseInt($.browser.version) <= 6) {
					this.element.find("#name-number-list").addClass("firefox").attr("size", "12");
				} else if ($.browser.ie.lt10) {
					move = function(event) {
						var le, position, to, x, y;
						x = event.clientX;
						y = event.clientY;
						position = $(this).offset();
						le = (x - position.left) - 150;
						to = (y - position.top) - 15;
						return that.element.find("#name-number-list").css({
							top: to,
							left: le,
							outline: 'none'
						});
					};
					this.element.find("#nameNumberUploadContainer").on("mousemove", move);
				} else {
					this.element.find(".name-number-upload-button").bind("click",
					function(event) {
						_this.element.find("#name-number-list").click();
						return false;
					});
				}
				return this;
			},
			_toInch: function(fontSize) {
				switch (fontSize) {
				case 20:
					return 1;
				case 30:
					return 2;
				case 40:
					return 2;
				case 60:
					return 3;
				case 80:
					return 4;
				case 100:
					return 5;
				case 120:
					return 6;
				case 140:
					return 7;
				case 160:
					return 8;
				}
				return 0;
			},
			_updateDropdown: function() {
				var row, _i, _len, _ref, _results;
				_ref = this.rows;
				_results = [];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					row = _ref[_i];
					_results.push(row.updateDropdown(this.options));
				}
				return _results;
			},
			_repaintScrollPane: function() {
				var height;
				height = this.element.find('form.content').height();
				this.element.find('form.content').height(height + 60);
				return this.panelScrollPane.repaint();
			},
			_reset: function() {
				this.tbody.empty();
				return this.rows = [];
			},
			_addRow: function() {
				var newRow, _this = this;
				this._triggleNewRowAdd();
				newRow = new Ooshirts.Widget.SpreadsheetRow({
					index: this.rows.length + 1,
					isNumberAdded: this.opener ? this.opener.numbersTemplate !== null: true,
					isNameAdded: this.opener ? this.opener.namesTemplate !== null: true,
					options: this.options
				});
				newRow.render(this.tbody);
				newRow.bind('itemDelete',
				function() {
					var index, row, _i, _len, _ref;
					_ref = _this.rows;
					for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
						row = _ref[index];
						if (row === newRow) {
							_this.rows.splice(index, 1);
							break;
						}
					}
					return false;
				});
				this.rows.push(newRow);
				return newRow;
			},
			_triggleNewRowAdd: function() {
				var row, _i, _len, _ref, _results;
				_ref = this.rows;
				_results = [];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					row = _ref[_i];
					_results.push(row.trigger('newRowAdd'));
				}
				return _results;
			},
			_generateOptions: function() {
				var options, shirt, _i, _len, _ref, _this = this;
				options = [];
				_ref = window.header.quoteTooltip.shirtList.children;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					shirt = _ref[_i];
					this.eachSize(shirt.sizes,
					function(sizeName, sizeType) {
						var option;
						option = {
							'value': "" + sizeType + "-" + shirt.colorId + "-" + shirt.id,
							'text': "" + sizeName + " " + shirt.color + " " + shirt.shirtName
						};
						return options.push(option);
					});
				}
				return options;
			},
			_cancel: function() {
				this.hide();
				return this;
			},
			serializeData: function(data) {
				data.spreadsheetData = this.data;
				return data;
			},
			_save: function() {
				var msg, row, tempData, _i, _len, _ref, _this = this;
				tempData = [];
				_ref = this.rows;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					row = _ref[_i];
					if (!row.isLastRow() && row.hasData()) {
						tempData.push($.extend({},
						row.getData()));
					}
				}
				msg = this._validateShirtQuantities(tempData);
				if (msg) {
					return this._show(msg);
				} else {
					return this._validateLength(tempData,
					function() {
						_this.data = tempData;
						return _this._cancel();
					});
				}
			},
			_validateLength: function(tempData, success) {
				var name_size, number_size, tempArray, _this = this;
				tempArray = $.map(tempData,
				function(item) {
					return {
						name: item.name,
						number: item.number
					};
				});
				if (!this.opener.numbersTemplate && !this.opener.namesTemplate) {
					this.messageBox.showMessage("You should add a name or a number to design.");
					return;
				}
				if (this.opener.numbersTemplate) {
					number_size = this._toInch(this.opener.numbersTemplate.fontSize);
				} else {
					number_size = 0;
				}
				if (this.opener.namesTemplate) {
					name_size = this._toInch(this.opener.namesTemplate.fontSize);
				} else {
					name_size = 0;
				}
				return $.ajax({
					url: 'http://www.ooshirts.com/lab/validatepersonalization.php',
					dataType: 'json',
					type: 'post',
					data: {
						number_size: number_size,
						name_size: name_size,
						data: $.toJSON(tempArray)
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						var errorIndex, index, _i, _len;
						if (data.success === "false") {
							errorIndex = data.errors;
							for (_i = 0, _len = errorIndex.length; _i < _len; _i++) {
								index = errorIndex[_i];
								_this.rows[index].error();
							}
							return _this.messageBox.showMessage("You inputted too many letters/numbers in this field.");
						} else {
							if (success) {
								return success.apply(_this);
							}
						}
					}
				});
			},
			_show: function(message) {
				return this.messageBox.showMessage(message);
			},
			_validateShirtQuantities: function(data) {
				var key, oneShirt, result, results, selectedShirt, selectedShirts, shirt, shirtInfo, sizeValue, sizeValues, value, _i, _j, _len, _len1, _ref;
				sizeValues = $.map(data,
				function(item) {
					return item.size;
				});
				selectedShirts = {};
				for (_i = 0, _len = sizeValues.length; _i < _len; _i++) {
					sizeValue = sizeValues[_i];
					value = sizeValue.split('-');
					shirtInfo = {
						id: value[2],
						colorId: value[1],
						size: value[0]
					};
					key = "" + shirtInfo.id + "-" + shirtInfo.colorId;
					selectedShirt = selectedShirts[key];
					if (!selectedShirt) {
						selectedShirt = {
							id: shirtInfo.id,
							colorId: shirtInfo.colorId,
							sizes: {}
						};
						selectedShirts[key] = selectedShirt;
					}
					if (!selectedShirt.sizes[shirtInfo.size]) {
						selectedShirt.sizes[shirtInfo.size] = 1;
					} else {
						selectedShirt.sizes[shirtInfo.size] = selectedShirt.sizes[shirtInfo.size] + 1;
					}
				}
				results = [];
				_ref = window.header.quoteTooltip.shirtList.children;
				for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
					shirt = _ref[_j];
					key = "" + shirt.id + "-" + shirt.colorId;
					oneShirt = selectedShirts[key];
					result = this._compareQuantities(shirt, oneShirt);
					result.colorName = shirt.color;
					result.shirtName = shirt.shirtName;
					results.push(result);
				}
				return this._getMessage(results);
			},
			_getMessage: function(results) {
				var key, message, msg, number, result, size, tempMsg, _i, _len, _ref;
				msg = {
					miss: [],
					excess: []
				};
				for (_i = 0, _len = results.length; _i < _len; _i++) {
					result = results[_i];
					_ref = result.sizes;
					for (key in _ref) {
						size = _ref[key];
						number = Math.abs(size.number);
						tempMsg = "- " + number + " " + size.sizeName + " " + result.colorName + " " + result.shirtName;
						if (size.number > 0) {
							msg.miss.push(tempMsg);
						}
						if (size.number < 0) {
							msg.excess.push(tempMsg);
						}
					}
				}
				message = '';
				if (msg.miss.length > 0 || msg.excess.length > 0) {
					message = "The number of garments you inputted data for does not match the quantities inputted into the quote form.</br>\nYou are missing</br>\n" + (msg.miss.join('</br>')) + "</br>\nYou have an excess of:</br>\n" + (msg.excess.join('</br>'));
				}
				return message;
			},
			_compareQuantities: function(shirt, oneShirt) {
				var result, _this = this;
				result = {
					id: shirt.id,
					colorId: shirt.colorId,
					sizes: {}
				};
				if (!oneShirt) {
					oneShirt = {
						id: shirt.id,
						colorId: shirt.colorId,
						sizes: {}
					};
				}
				this.eachSize(shirt.sizes,
				function(sizeName, sizeType) {
					var oneSizeNumber, shirtSizeNumber;
					oneSizeNumber = oneShirt.sizes[sizeType] ? parseInt(oneShirt.sizes[sizeType]) : 0;
					shirtSizeNumber = shirt.quantities[sizeType] ? parseInt(shirt.quantities[sizeType]) : 0;
					return result.sizes[sizeType] = {
						number: shirtSizeNumber - oneSizeNumber,
						sizeName: sizeName
					};
				});
				return result;
			},
			eachSize: function(sizes, callback) {
				var maxSize, minSize, size, sizeName, sizeType, sizesArray, _i, _results;
				sizesArray = sizes.split('-');
				minSize = parseInt(sizesArray[0]);
				maxSize = parseInt(sizesArray[1]);
				sizeName = sizeType = '';
				_results = [];
				for (size = _i = minSize; minSize <= maxSize ? _i <= maxSize: _i >= maxSize; size = minSize <= maxSize ? ++_i: --_i) {
					switch (size) {
					case 5:
						sizeName = 'XS';
						sizeType = 'xsml';
						break;
					case 6:
						sizeName = 'S';
						sizeType = 'sml';
						break;
					case 7:
						sizeName = 'M';
						sizeType = 'med';
						break;
					case 8:
						sizeName = 'L';
						sizeType = 'lrg';
						break;
					case 9:
						sizeName = 'XL';
						sizeType = 'xlg';
						break;
					case 10:
						sizeName = '2XL';
						sizeType = 'xxl';
						break;
					case 11:
						sizeName = '3XL';
						sizeType = 'xxxl';
						break;
					case 12:
						sizeName = '4XL';
						sizeType = 'xxxxl';
					}
					if (callback) {
						_results.push(callback(sizeName, sizeType));
					} else {
						_results.push(void 0);
					}
				}
				return _results;
			},
			loadData: function(data) {
				if (data) {
					this.data = data;
					this._renderData(data);
				}
				return this;
			},
			_renderData: function(data) {
				var newRow, rowData, _i, _len;
				this._reset();
				if (data) {
					for (_i = 0, _len = data.length; _i < _len; _i++) {
						rowData = data[_i];
						newRow = this._addRow();
						newRow.setData(rowData);
					}
					return this._addRow();
				}
			},
			uploadNumberListFile: function() {
				var that;
				that = this;
				this.element.find('#upload-spreadsheet-form').fileupload({
					maxFileSize: 1000000,
					acceptFileTypes: /(\.|\/)(xlsx?|csv|txt)$/i,
					dropZone: null,
					add: function(ev, data) {
						that._setNameAndNumberSize();
						if (!that._validateFileExtension(data.files[0], ev.data.fileupload.options.acceptFileTypes)) {
							that.messageBox.showMessage('Unknown file type, please upload just xls, xlsx, csv, txt');
							return false;
						}
						if (data.files[0].size > ev.data.fileupload.options.maxFileSize) {
							that.messageBox.showMessage('Exceeded maximum file size (1000Kb) Please upload another file');
							return false;
						}
						that.chooseFileUpload.hide();
						that.uploadingFile.show();
						data.submit();
						return true;
					},
					done: function(ev, data) {
						if (data.result) {
							if (data.result.errors) {
								that.messageBox.showMsg(data.result.errors);
							} else {
								that._renderData(that._handleData(data.result));
							}
						}
						return true;
					},
					fail: function(e, data) {
						return that.messageBox.showMessage(data.jqXHR.responseText);
					},
					always: function(ev, data) {
						that.chooseFileUpload.show();
						return that.uploadingFile.hide();
					}
				});
				return this;
			},
			_validateFileExtension: function(file, validExtensions) {
				return validExtensions.test(file.type) || validExtensions.test(file.name);
			},
			_setNameAndNumberSize: function() {
				var nameSize, numberSize;
				if (this.opener.namesTemplate) {
					nameSize = this._toInch(this.opener.namesTemplate.fontSize);
					this.element.find("#nameSize").val(nameSize);
				} else {
					this.element.find("#nameSize").val("");
				}
				if (this.opener.numbersTemplate) {
					numberSize = this._toInch(this.opener.numbersTemplate.fontSize);
					return this.element.find("#numberSize").val(numberSize);
				} else {
					return this.element.find("#numberSize").val("");
				}
			},
			_handleData: function(datas) {
				var batch, data, key, results, _i, _len, _ref;
				results = [];
				if (datas) {
					_ref = datas.data;
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						data = _ref[_i];
						batch = data.batch;
						key = this._generateKey(batch);
						data.size = data.size + "-" + key;
						results.push(data);
					}
				}
				return results;
			},
			_generateKey: function(batch) {
				var key, shirt;
				shirt = window.header.quoteTooltip.shirtList.children[batch - 1];
				return key = shirt.colorId + "-" + shirt.id;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Dialog, 'DialogsManager').includes(Ooshirts.NodeSupport)({
		prototype: {
			init: function() {
				var _this = this;
				this.welcomeScreen = new Ooshirts.Dialog.WelcomeScreen();
				this.spreadsheet = new Ooshirts.Dialog.Spreadsheet();
				this.imageFloodfill = new Ooshirts.Dialog.ImageFloodfill();
				this.tshirtCatalog = new Ooshirts.Dialog.TshirtCatalog({
					element: $('.choose-t-shirt')
				});
				this.tshirtCatalog.bind('productSelected',
				function(ev) {
					if (ev.opener === "QuoteTooltip") {
						return window.header.quoteTooltip.onProductSelected(ev);
					} else {
						return window.design.controlsPanel.panels.tshirtSettings.onProductSelected(ev);
					}
				});
				return $("#dialog-container").click(function(ev) {
					if (_this.welcomeScreen.isVisible() || ev.target.tagName.toLowerCase() === 'input') {
						return true;
					} else {
						return false;
					}
				});
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Tooltip').inherits(Ooshirts.Widget)({
		elementClass: 'tooltip',
		html: '<div class="tooltip"></div>',
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					closeOnClickOutside: true
				},
				attributes);
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				if (this.closeOnClickOutside) {
					this.element.clickoutside(function() {
						_this.trigger('clickoutside');
						return _this.hide();
					});
				}
				this.element.find('.close-tooltip-button').on('click',
				function() {
					_this.hide();
					return false;
				});
				return this;
			},
			show: function() {
				Ooshirts.Widget.prototype.show.apply(this);
				this.trigger('show');
				return this;
			},
			hide: function() {
				Ooshirts.Widget.prototype.hide.apply(this);
				this.trigger('hide');
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Tooltip, 'ClickOutsideDesign').inherits(Ooshirts.Tooltip)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					closeOnClickOutside: true
				},
				attributes);
				Ooshirts.Widget.prototype.init.apply(this, [attributes]);
				this.isBlock = false;
				if (this.closeOnClickOutside) {
					this.element.clickoutside(function() {
						if (!_this.isBlock) {
							_this.trigger('clickoutside');
							return _this.hide();
						}
					});
				}
				this.element.find('.close-tooltip-button').on('click',
				function() {
					_this.hide();
					return false;
				});
				return this;
			},
			block: function() {
				return this.isBlock = true;
			},
			unblock: function() {
				return this.isBlock = false;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Tooltip, 'SaveDesignTooltip').inherits(Ooshirts.Tooltip.ClickOutsideDesign)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('#save-design-tooltip')
				},
				attributes);
				Ooshirts.Tooltip.ClickOutsideDesign.prototype.init.apply(this, [attributes]);
				this.saveFirstTimeForm = this.element.find('#save-first-time-form');
				this.saveForm = this.element.find('#save-form');
				this.designNameLabel = this.element.find('#design-name-label');
				this.designEmailLabel = this.element.find('#design-email-label');
				this.loadingMask = this.element.find('.tooltip-loading');
				this.element.find('.tooltip-edit-field').on('click',
				function(ev) {
					return _this.goBackFirstTimeForm();
				});
				this.element.find('#share_design_link').on('click',
				function(ev) {
					_this.saveCompleteDialog.show();
					return false;
				});
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('#save-design-email'),
					name: 'saveDesignEmail'
				}));
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('#save-design-name'),
					name: 'saveDesignName'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#save-design'),
					name: 'saveDesignButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#save-and-checkout-design'),
					name: 'saveAndCheckoutDesignButton'
				}));
				this.addChild(new Ooshirts.Widget.Button({
					element: this.element.find('#save-as-new-shirt'),
					name: 'saveAsNewShirtButton'
				}));
				this.addChild(new Ooshirts.Dialog.SaveComplete({
					name: 'saveCompleteDialog'
				}));
				this.saveAsNewShirtButton.bind('click',
				function(ev) {
					return _this.goBackFirstTimeForm();
				});
				this.saveDesignEmail.bind('submit',
				function(ev) {
					if (_this.element.hasClass("save-and-checkout")) {
						return _this.saveAndCheckoutDesign();
					} else {
						return _this.saveDesign();
					}
				});
				this.saveDesignName.bind('submit',
				function(ev) {
					if (_this.element.hasClass("save-and-checkout")) {
						return _this.saveAndCheckoutDesign();
					} else {
						return _this.saveDesign();
					}
				});
				this.saveDesignButton.bind('click',
				function(ev) {
					return _this.saveDesign();
				});
				this.saveAndCheckoutDesignButton.bind('click',
				function(ev) {
					return _this.saveAndCheckoutDesign();
				});
				return this;
			},
			saveDesign: function() {
				var _this = this;
				this.showWarning('');
				$('#save-first-time-form input').blur();
				if (this.validate()) {
					this.loadingMask.show();
					this.block();
					window.design.save(this.saveDesignEmail.getValue(), this.saveDesignName.getValue(),
					function(id) {
						_this.loadingMask.hide();
						_this.saveFirstTimeForm.hide();
						_this.fillSaveForm();
						_this._fillSaveCompleteDialog(id);
						_this.hide();
						$('body').append('<img height="1" width="1" style="border-style:none;" alt="" src="http://www.googleadservices.com/pagead/conversion/1058223789/?label=0IqkCI_c0gEQre3M-AM&amp;guid=ON&amp;script=0"/>');
						if (_gaq) {
							_gaq.push(['_trackEvent', 'Design App', 'Save']);
						}
						return _this.unblock();
					},
					function(data) {
						_this.unblock();
						return _this.showWarning(data.error);
					},
					false, $("#design_review_input")[0].checked);
				} else {
					this.showWarning();
				}
				return this;
			},
			saveAndCheckoutDesign: function() {
				var _this = this;
				this.showWarning('');
				if (this.validate()) {
					this.loadingMask.show();
					this.block();
					window.design.save(this.saveDesignEmail.getValue(), this.saveDesignName.getValue(),
					function(id) {
						_this.unblock();
						$('body').append('<img height="1" width="1" style="border-style:none;" alt="" src="http://www.googleadservices.com/pagead/conversion/1058223789/?label=0IqkCI_c0gEQre3M-AM&amp;guid=ON&amp;script=0"/>');
						if (_gaq) {
							_gaq.push(['_trackEvent', 'Design App', 'Save']);
						}
						window.isBuyNow = true;
						return window.location = 'http://www.ooshirts.com/lab/checkout.php?design_id=' + (id || 60059356);
					},
					function(data) {
						_this.showWarning(data.error);
						return _this.unblock();
					},
					true);
				} else {
					this.showWarning();
				}
				return this;
			},
			showSaveDesignTooltip: function() {
				this.showWarning('');
				this.element.removeClass("save-and-checkout");
				if (window.design.isSaved) {
					this.saveForm.show();
					this.saveFirstTimeForm.hide();
				}
				return this.show();
			},
			showSaveAndCheckoutTooltip: function(showError) {
				if (showError) {
					this.showWarning('Please save your design first.');
				} else {
					this.showWarning('');
				}
				this.saveForm.hide();
				this.saveFirstTimeForm.show();
				$("#design_review").hide();
				this.element.addClass("save-and-checkout");
				return this.show();
			},
			validate: function() {
				return this.saveDesignEmail.getValue() !== '' && this.saveDesignName.getValue() !== '';
			},
			fillSaveForm: function() {
				this.designNameLabel.text(this.saveDesignName.getValue());
				this.designEmailLabel.text(this.saveDesignEmail.getValue());
				this.saveForm.show();
				return this;
			},
			showWarning: function(message) {
				if (message == null) {
					message = 'Please verify your info is correct.';
				}
				this.loadingMask.hide();
				if (message) {
					this.element.find('#save-notice').css("display", "block").text(message);
				} else {
					this.element.find('#save-notice').css("display", "none");
				}
				return this;
			},
			goBackFirstTimeForm: function() {
				window.design.isSaved = false;
				this.saveForm.hide();
				this.showWarning('');
				this.saveFirstTimeForm.show();
				return this;
			},
			_fillSaveCompleteDialog: function(id) {
				this.saveCompleteDialog.updateShareLinks(id);
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Tooltip, 'LoadDesignTooltip').inherits(Ooshirts.Tooltip.ClickOutsideDesign)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend({
					element: $('#load-design-tooltip')
				},
				attributes);
				Ooshirts.Tooltip.ClickOutsideDesign.prototype.init.apply(this, [attributes]);
				this.loadForm = this.element.find('#load-design-form');
				this.spinner = this.element.find('.tooltip-loading');
				this.listForm = this.element.find('#designs-list-form');
				this.successMsg = this.element.find('.success-load');
				this.designerName = this.listForm.find('.tooltip-paragraph > strong');
				this.listItems = this.element.find('.tooltip-design-list');
				this.addChild(new Ooshirts.Widget.TextField({
					element: this.element.find('#load-design-email'),
					name: 'loadDesignEmail'
				}));
				this.loadDesignEmail.bind('submit',
				function(ev) {
					return _this.loadDesign();
				});
				this.addChild(new Ooshirts.Widget.Button({
					element: this.loadForm.find('.primary-button'),
					name: 'loadDesignButton'
				}));
				this.loadDesignButton.bind('click',
				function(ev) {
					return _this.loadDesign();
				});
				this.bind("show",
				function() {
					if ($("#designs-list-form").css("display") === 'block') {
						return _this.loadDesign();
					}
				});
				return this;
			},
			loadDesign: function() {
				var _this = this;
				this.showWarning('');
				if (this.validate()) {
					this.spinner.show();
					this.block();
					Ooshirts.Design.fetchAllForEmail(this.loadDesignEmail.getValue(),
					function(data) {
						_this.fillDesignsList(data);
						_this.loadForm.hide();
						_this.spinner.hide();
						_this.listForm.show();
						return _this.panelScrollPane && _this.panelScrollPane.repaint();
					},
					function(data) {
						_this.loadDesignEmail.element.val('');
						return _this.showWarning(data.error);
					});
				} else {
					this.showWarning();
				}
				return this;
			},
			validate: function() {
				return this.loadDesignEmail.getValue() !== '';
			},
			showWarning: function(message) {
				if (message == null) {
					message = 'Please verify your info is correct.';
				}
				this.spinner.hide();
				if (message) {
					this.element.find('#load-notice').css("display", "block").text(message);
				} else {
					this.element.find('#load-notice').css("display", "none");
				}
				return this;
			},
			fillDesignsList: function(data) {
				var listItem, obj, _i, _len;
				this.listItems.empty();
				this.designerName.text(this.loadDesignEmail.getValue());
				for (_i = 0, _len = data.length; _i < _len; _i++) {
					obj = data[_i];
					listItem = this.addChild(new Ooshirts.Widget.DesignListItem({
						itemDate: obj['time'],
						itemName: obj['name'],
						itemId: obj['id'],
						name: "design" + obj['id']
					}));
					listItem.render(this.listItems);
				}
				if (data.length > 11) {
					if (!$.browser.ie.lt8) {
						this.listItems.addClass('content');
						this.listItems.parent().height(300);
					}
					this.panelScrollPane || this.addChild(new Ooshirts.Widget.ScrollPane({
						element: this.element.find('.nano'),
						name: 'panelScrollPane'
					}));
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts.Tooltip, 'QuoteTooltip').inherits(Ooshirts.Tooltip).includes(Ooshirts.Serializable)({
		prototype: {
			serializableAttributes: ['totalInks', 'totalInksPerSide', 'personalizationFlag', 'totalNormalInks', 'totalCustomInks', 'defaultBatchColor', 'tShirtSideColors', 'garments'],
			customSerializations: ['serializeShirts'],
			customLoads: ['initTotalInksPerSide', 'loadShirts', 'loadColors'],
			init: function(attributes) {
				var _this = this;
				attributes = $.extend(attributes, {
					element: $('.get-quote-info-entered'),
					garments: [],
					closeOnClickOutside: false
				});
				Ooshirts.Tooltip.prototype.init.apply(this, [attributes]);
				this.MAXTSHIRTS = 4;
				this.PREFIXTSHIRTS = 'extra';
				this.totalInks = 0;
				this.defaultBatchColor = null;
				this.totalNormalInks = 0;
				this.totalCustomInks = 0;
				this.totalInksPerSide = {
					front: 0,
					right: 0,
					left: 0,
					back: 0
				};
				this.personalizationFlag = 0;
				this.totalPrice = this.element.find('.get-quote-checkout .price');
				this.checkoutBtn = this.element.find('.get-quote-checkout .primary-button');
				this.totalInksQty = this.element.find('.total-inks-quantity');
				this.frontInkList = this.element.find('.front-ink-list');
				this.backInkList = this.element.find('.back-ink-list');
				this.leftInkList = this.element.find('.left-ink-list');
				this.rightInkList = this.element.find('.right-ink-list');
				this.frontInkContainer = this.element.find('.front-ink-colors');
				this.backInkContainer = this.element.find('.back-ink-colors');
				this.leftInkContainer = this.element.find('.left-ink-colors');
				this.rightInkContainer = this.element.find('.right-ink-colors');
				this.headerTitle = this.element.find('.header-title');
				this.loader = this.element.find('.quote-loader');
				this.colorPickerList = this.element.find('.color-picker-list');
				this.inkColorTemplate = "<li class='color-picker-element regular-color'>                  <a class='color-picker-canvas regular-color-canvas' title='#title' alt='#alt'>                    <span class='tooltip-outline'>#colorName<br>#colorPantone                        <span class='tooltip-bottom-pointer'>                            <img class='icon icon-bottom-tooltip-indicator' alt='Tooltip pointer' src='" + assetsBaseURL + "assets/images/inv.png' width='12' height='7'>                        </span>                    </span>                  </a>                </li>";
				this.shirtList = new Ooshirts.Widget({
					element: this.element.find('.t-shirt-list'),
					name: 'shirtList'
				});
				this.addTshirtStyleButton = new Ooshirts.Widget.Button({
					element: this.element.find('.add-t-shirt')
				});
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.scroll-wrapper.nano'),
					name: 'panelScrollPane'
				}));
				this.addChild(new Ooshirts.Widget.ScrollPane({
					element: this.element.find('.get-quote-colors.nano'),
					name: 'colorsPanelScrollPane'
				}));
				this.bind('show',
				function() {
					_this.colorsPanelScrollPane.repaint();
					return _this.updateScrollPane();
				});
				this.bind('load',
				function() {
					return _this.updateShirtList();
				});
				this.one('load',
				function() {
					if (!window.design_data) {
						return _this.getTshirtCatalog().startPopulate();
					}
				});
				this.addTshirtStyleButton.bind('click',
				function() {
					if (_this.shirtList.children.length < _this.MAXTSHIRTS) {
						return _this.getTshirtCatalog().showAndReset("QuoteTooltip");
					}
				});
				this.checkoutBtn.bind('click',
				function() {
					_this.parent._saveAndCheckout();
					return false;
				});
				this._bindHoverActionOnColors();
				return this;
			},
			getTshirtCatalog: function() {
				return this.tshirtCatalog || (this.tshirtCatalog = window.design.dialogsManager.tshirtCatalog);
			},
			onProductSelected: function(ev) {
				var product, tmpName;
				tmpName = this.PREFIXTSHIRTS + (this.shirtList.children.length + 1);
				product = ev.product;
				return this._addItem(tmpName, product);
			},
			serializeShirts: function(data) {
				var shirt, _i, _len, _ref;
				data.shirtList = [];
				_ref = this.shirtList.children;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					shirt = _ref[_i];
					data.shirtList.push(shirt.serialize());
				}
				return data;
			},
			updateShirtList: function() {
				if (this.shirtList.currentShirt) {
					this._updateCurrentShirt(window.design.shirt);
					this.defaultBatchColor || (this.defaultBatchColor = window.design.shirt.color);
				} else {
					this._addItem('currentShirt', window.design.shirt);
					this.defaultBatchColor || (this.defaultBatchColor = window.design.shirt.color);
				}
				return this.updateScrollPane();
			},
			loadShirts: function(data) {
				var currentShirtIndex, index, item, list, shirt, _i, _len;
				if (Object.prototype.toString.call(this.garments) !== '[object Array]') {
					this._garmentsToArray();
				}
				list = this._parseObjectToArray(data.shirtList) || [];
				currentShirtIndex = "0";
				for (index in list) {
					shirt = list[index];
					if (index === "0" && shirt.name === 'currentShirt') {
						break;
					} else {
						if (shirt.name === 'currentShirt') {
							currentShirtIndex = index;
						}
					}
				}
				if (currentShirtIndex !== "0") {
					list.unshift(list.splice(parseInt(currentShirtIndex), 1)[0]);
				}
				item = null;
				for (_i = 0, _len = list.length; _i < _len; _i++) {
					shirt = list[_i];
					shirt.index = this.shirtList.children.length;
					item = this.shirtList.addChild(new Ooshirts.Widget.TShirtQuoteItem(shirt));
					item.load(shirt);
					this._bindAddedItem(item);
				}
				this.show();
				this.updateScrollPane();
				this.hide();
				if (item) {
					item.trigger('update', {
						garment: item.toHash(),
						index: item.index
					});
				}
				return data;
			},
			loadColors: function(data) {
				this.updateColors(data.tShirtSideColors);
				return data;
			},
			initTotalInksPerSide: function(data) {
				if (!this.totalInksPerSide) {
					return this.totalInksPerSide = {};
				}
			},
			setTitle: function(title) {
				this.headerTitle.text(title);
				return this;
			},
			hasAddedItems: function() {
				var child, _i, _len, _ref;
				_ref = this.shirtList.children;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					child = _ref[_i];
					if (child.hasAddedItems()) {
						return true;
					}
				}
				return false;
			},
			updateQuote: function(callback) {
				var child, garment, i, subtotal, _garments, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _this = this;
				if (window.thumb || (!window.design.isCompleteLoad && window.designId)) {
					return;
				}
				if (this.hasAddedItems()) {
					this.trigger('brforeQuoteChanged');
					this._showLoader();
					this._checkForPersonalizedItems();
					_garments = [];
					_ref = this.shirtList.children;
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						child = _ref[_i];
						_garments.push(child.toHash());
					}
					for (i = _j = 0, _len1 = _garments.length; _j < _len1; i = ++_j) {
						garment = _garments[i];
						if (! (garment != null)) {
							_garments.splice(i, 1);
						}
					}
					if (this.totalInksPerSide.front > 11) {
						this.totalInksPerSide.front = 11;
					}
					if (this.totalInksPerSide.back > 11) {
						this.totalInksPerSide.back = 11;
					}
					if (this.totalInksPerSide.left > 11) {
						this.totalInksPerSide.left = 11;
					}
					if (this.totalInksPerSide.right > 11) {
						this.totalInksPerSide.right = 11;
					}
					Ooshirts.Quote.getQuote({
						colors: {
							front: this.totalInksPerSide.front,
							back: this.totalInksPerSide.back,
							left: this.totalInksPerSide.left,
							right: this.totalInksPerSide.right
						},
						garments: this.garments,
						options: {
							pms: this.totalCustomInks,
							personalization: this.personalizationFlag
						}
					},
					function(data) {
						var average, child, index, price, quantities, _k, _len2, _ref1;
						if (!_this.itemsAdded) {
							_this.itemsAdded = true;
							_this.element.removeClass('no-items-added');
						}
						_this.totalPrice.text(data.subtotal.toFixed(2));
						_ref1 = _this.shirtList.children;
						for (index = _k = 0, _len2 = _ref1.length; _k < _len2; index = ++_k) {
							child = _ref1[index];
							price = data.breakdown[index];
							quantities = child.getTotalQuantities();
							average = '0';
							if (quantities !== 0) {
								average = (price / quantities).toFixed(2);
							}
							child.updatePrice(average);
						}
						_this.trigger('quoteChanged', {
							hasItems: true,
							subtotal: data.subtotal.toFixed(2)
						});
						if (callback) {
							return callback(data);
						}
					});
				} else {
					this.itemsAdded = false;
					this.element.addClass('no-items-added');
					subtotal = 0;
					this.totalPrice.text(subtotal);
					_ref1 = this.shirtList.children;
					for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
						child = _ref1[_k];
						child.updatePrice('0');
					}
					this.trigger('quoteChanged', {
						hasItems: false,
						subtotal: 0
					});
				}
				return this;
			},
			updateScrollPane: function() {
				this.panelScrollPane.repaint();
				return this;
			},
			updateColors: function(tshirtSideColors) {
				var color, colorObj, containerToShow, key, listToAppend, newColor, totalCustomInksCounter, totalInksCounter, totalInksPerSide, totalNormalInksCounter, value, _this = this;
				listToAppend = null;
				this._clearInkLists();
				totalInksCounter = 0;
				totalNormalInksCounter = 0;
				totalCustomInksCounter = 0;
				totalInksPerSide = {
					front: 0,
					right: 0,
					left: 0,
					back: 0
				};
				for (key in tshirtSideColors) {
					if (!__hasProp.call(tshirtSideColors, key)) continue;
					value = tshirtSideColors[key];
					switch (key) {
					case 'front':
						listToAppend = this.frontInkList;
						containerToShow = this.frontInkContainer;
						break;
					case 'back':
						listToAppend = this.backInkList;
						containerToShow = this.backInkContainer;
						break;
					case 'left':
						listToAppend = this.leftInkList;
						containerToShow = this.leftInkContainer;
						break;
					case 'right':
						listToAppend = this.rightInkList;
						containerToShow = this.rightInkContainer;
					}
					if ($.isEmptyObject(value)) {
						containerToShow.hide();
					} else {
						containerToShow.show();
						if (value['full']) {
							totalInksPerSide[key] = 11;
							totalNormalInksCounter += 11;
							totalInksCounter += 11;
							continue;
						}
						for (color in value) {
							if (!__hasProp.call(value, color)) continue;
							totalInksCounter++;
							totalInksPerSide[key]++;
							newColor = this.inkColorTemplate;
							colorObj = window.initialColors[color.toLowerCase()];
							if (!colorObj) {
								colorObj = {
									hex: color,
									name: "",
									pantone: ""
								};
							} else {
								if (colorObj.name) {
									totalNormalInksCounter++;
								} else {
									totalCustomInksCounter++;
								}
							}
							if (colorObj.name) {
								newColor = newColor.replace(/#colorName/gi, colorObj.name);
								newColor = newColor.replace(/#title/gi, colorObj.name);
								newColor = newColor.replace(/#alt/gi, colorObj.name);
							} else {
								newColor = newColor.replace(/#colorName<br>/gi, '');
								newColor = newColor.replace(/#title/gi, colorObj.pantone);
								newColor = newColor.replace(/#alt/gi, colorObj.pantone);
							}
							newColor = newColor.replace(/#colorPantone/gi, colorObj.pantone);
							newColor = $(newColor);
							newColor.find('.color-picker-canvas').css('background-color', color);
							if (color === "#FFFFFF") {
								newColor.find('.color-picker-canvas').parent().addClass('white');
							}
							listToAppend.append(newColor);
						}
					}
				}
				this._checkFullColors(tshirtSideColors);
				this.totalInksQty.html(totalInksCounter);
				this.totalInks = totalInksCounter;
				this.totalNormalInks = totalNormalInksCounter;
				this.totalCustomInks = totalCustomInksCounter;
				this.totalInksPerSide = totalInksPerSide;
				this.tShirtSideColors = tshirtSideColors;
				this.colorsPanelScrollPane.repaint();
				if (this.hasAddedItems()) {
					this.updateQuote(function() {
						return _this._hideLoader();
					});
				}
				return this;
			},
			removetShirts: function() {
				var shirt, _i, _len, _ref;
				if (this.shirtList.children.length > 0) {
					_ref = this.shirtList.children;
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						shirt = _ref[_i];
						shirt.destroy();
					}
				}
				return this;
			},
			_addItem: function(name, shirt) {
				var item;
				item = this.shirtList.addChild(new Ooshirts.Widget.TShirtQuoteItem({
					name: name,
					url: shirt.url,
					category: shirt.category,
					categoryId: shirt.categoryId,
					subcategory: shirt.subcategory,
					subcategoryId: shirt.subcategoryId,
					shirtName: shirt.name,
					color: shirt.color.name,
					colorId: shirt.color.id,
					id: shirt.id,
					index: this.shirtList.children.length,
					sizes: shirt.availableColors[shirt.color.id].sizes
				}));
				this.garments || (this.garments = []);
				this.garments[item.index] = item.toHash();
				this._bindAddedItem(item);
				return item;
			},
			_updateCurrentShirt: function(shirt) {
				$.extend(this.shirtList.currentShirt, {
					url: shirt.url,
					category: shirt.category,
					categoryId: shirt.categoryId,
					subcategory: shirt.subcategory,
					subcategoryId: shirt.subcategoryId,
					shirtName: shirt.name,
					color: shirt.color.name,
					colorId: shirt.color.id,
					id: shirt.id,
					sizes: shirt.availableColors[shirt.color.id].sizes
				});
				this.shirtList.currentShirt.updateInfo();
				this.garments || (this.garments = []);
				return this.garments[this.shirtList.currentShirt.index] = this.shirtList.currentShirt.toHash();
			},
			_bindAddedItem: function(item) {
				var _this = this;
				item.bind('update',
				function(ev) {
					var child, _i, _len, _ref;
					_this.garments = [];
					_this._controlAddButton();
					_ref = _this.shirtList.children;
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						child = _ref[_i];
						_this.garments.push(child.toHash());
					}
					return _this.updateQuote(function(data) {
						return _this._hideLoader();
					});
				});
				item.bind('input',
				function() {
					return _this.trigger('input');
				});
				item.render(this.shirtList.element);
				this._controlAddButton();
				this.updateScrollPane();
				return this;
			},
			_controlAddButton: function() {
				if (this.shirtList.children.length >= this.MAXTSHIRTS) {
					return this.addTshirtStyleButton.hide();
				} else {
					return this.addTshirtStyleButton.show();
				}
			},
			_clearInkLists: function() {
				if (this.frontInkList.find('li').length > 0) {
					this.frontInkList.find('li').remove();
				}
				if (this.backInkList.find('li').length > 0) {
					this.backInkList.find('li').remove();
				}
				if (this.leftInkList.find('li').length > 0) {
					this.leftInkList.find('li').remove();
				}
				if (this.rightInkList.find('li').length > 0) {
					this.rightInkList.find('li').remove();
				}
				return this;
			},
			_hideLoader: function() {
				this.loader.hide();
				this.totalPrice.show();
				return this;
			},
			_showLoader: function() {
				this.loader.show();
				this.totalPrice.hide();
				return this;
			},
			_checkForPersonalizedItems: function() {
				var data, hasNames, hasNumbers, item, personalization, _ref;
				personalization = 0;
				hasNumbers = false;
				hasNames = false;
				_ref = window.design.items;
				for (item in _ref) {
					if (!__hasProp.call(_ref, item)) continue;
					data = _ref[item];
					if (data.itemType === 'TeamText') {
						if (data.isNumberTemplate) {
							hasNumbers = true;
						} else {
							hasNames = true;
						}
					}
				}
				if (hasNumbers && hasNames) {
					personalization = 8;
				}
				if (!hasNumbers && hasNames) {
					personalization = 5;
				}
				if (hasNumbers && !hasNames) {
					personalization = 3;
				}
				this.personalizationFlag = personalization;
				return this;
			},
			_parseObjectToArray: function(obj) {
				var array, item, key;
				if (obj && obj instanceof Object) {
					array = [];
					for (key in obj) {
						if (!__hasProp.call(obj, key)) continue;
						item = obj[key];
						array.push(item);
					}
					return array;
				} else {
					return obj;
				}
			},
			_garmentsToArray: function() {
				var data, index, tmpGarments, _ref;
				tmpGarments = [];
				_ref = this.garments;
				for (index in _ref) {
					if (!__hasProp.call(_ref, index)) continue;
					data = _ref[index];
					tmpGarments[index] = data;
				}
				return this.garments = tmpGarments;
			},
			_checkFullColors: function(tshirtSideColors) {
				var $colorSideList, color, colorFull, data, key, side, sideColorCounter;
				colorFull = false;
				for (key in tshirtSideColors) {
					if (!__hasProp.call(tshirtSideColors, key)) continue;
					data = tshirtSideColors[key];
					sideColorCounter = 0;
					side = key;
					for (key in data) {
						if (!__hasProp.call(data, key)) continue;
						color = data[key];
						sideColorCounter++;
						if (sideColorCounter >= 11 || key === 'full') {
							$colorSideList = $('.' + side + '-ink-colors');
							$colorSideList.find('ul').empty().append('<li>Full</li>');
							break;
						}
					}
				}
				return this;
			},
			_bindHoverActionOnColors: function() {
				this.colorPickerList.on('hover', '.color-picker-canvas',
				function() {
					var indicator, indicatorWidth, tooltip, tooltipWidth;
					tooltip = $(this).find('.tooltip-outline');
					indicator = $(this).find('.tooltip-bottom-pointer');
					indicatorWidth = indicator.width();
					tooltipWidth = tooltip.width();
					tooltip.css('left', -((tooltipWidth / 2) - $(this).width() / 2));
					return indicator.css('left', tooltipWidth / 2 - indicatorWidth / 2);
				});
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts.Tooltip, 'CollaborateTooltip').inherits(Ooshirts.Tooltip)({
		prototype: {
			init: function(attributes) {
				var _this = this;
				attributes = $.extend(attributes, {
					element: $('#collaborate-tooltip')
				});
				Ooshirts.Tooltip.prototype.init.apply(this, [attributes]);
				this.urlField = this.element.find('#design-url');
				this.updateUrlField();
				this.urlField.bind('focus',
				function() {
					return _this.urlField[0].select();
				});
				return this;
			},
			updateUrlField: function() {
				if (location.hash && location.hash.replace("#", "")) {
					this.urlField.val(location.href);
				} else {
					this.urlField.val(location.href.replace("#", "") + '#' + window.sessionId);
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ItemCommand')({
		prototype: {
			name: 'command-name',
			init: function(attributes) {
				$.extend(this, attributes);
				return this;
			},
			execute: function(callback) {
				throw 'Not implemented';
				return this;
			},
			unexecute: function(callback) {
				throw 'Not Implemented';
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'AppendCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'append',
			execute: function(callback) {
				var _this = this;
				if (window.design.shirt.element.find('.ooshirts-shirt-item').length > 0) {
					window.design.shirt.element.find('.ooshirts-shirt-item').last().after(this.item.element);
				} else {
					window.design.shirt.element.find('.handlers-layout').before(this.item.element);
				}
				if (this.item.fromLoad) {
					setTimeout(function() {
						return window.design.updateDraggableContainment(_this.item);
					},
					600);
				}
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				var itemType;
				itemType = this.item.itemType;
				this.item.didDeselect();
				this.item.element.remove();
				this.item.trigger('deleted');
				if (callback) {
					callback(this);
				}
				switch (itemType) {
				case "Text":
					window.design.controlsPanel.goTo('addText');
					break;
				case "Clipart":
					window.design.controlsPanel.goTo('clipArtCatList');
					break;
				case "Image":
					window.design.controlsPanel.goTo('uploadImage');
					break;
				default:
					window.design.controlsPanel.goTo('namesAndNumbers');
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'SendBackwardCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'sendBackward',
			execute: function(callback) {
				window.design.sendToBackLayer(this.item);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				window.design.sendToFrontLayer(this.item);
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'BringForwardCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'bringForward',
			execute: function(callback) {
				window.design.sendToFrontLayer(this.item);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				window.design.sendToBackLayer(this.item);
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'SendToBackCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'sendToBack',
			execute: function(callback) {
				window.design.sendToBack(this.item);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				window.design.sendToFront(this.item);
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'BringToFrontCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'bringToFront',
			execute: function(callback) {
				window.design.sendToFront(this.item);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				window.design.sendToBack(this.item);
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeColorCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeColor',
			execute: function(callback) {
				this.oldColor = this.item.color || '';
				this.item.color = this.newColor;
				this.item.element.css("color", this.item.color);
				this.item.addColor(this.newColor, 'fontColor');
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.newColor = this.oldColor;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeLabelCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeLabel',
			execute: function(callback) {
				var maxHeight, maxWidth;
				this.oldLabel = this.item.label;
				this.item.label = this.label;
				this.item.element.find('.text-arc').html(this.item.getLabelHtml());
				this.item.element.find('.item-size-test').html(this.item.getLabelHtml());
				if (Math.abs(this.item.arc) > 0) {
					this.item.drawArc();
					this.item.checkBoundry();
				} else {
					if ($.browser.ie.lt9) {
						this.item.setIEtext();
					}
					if (this.item.outline > 0 && $.browser.ie.eq9) {
						this.item.changeOutline(this.item.outline, false, false);
					}
					this.item.checkBoundry();
					maxWidth = $("#tshirt").width() - this.item.position.left - 8;
					maxHeight = $("#tshirt").height() - this.item.position.top - 8;
					if (this.item.size.width > maxWidth || this.item.size.height > maxHeight) {
						this.item.resize(Math.min(this.item.size.width, maxWidth), Math.min(this.item.size.height, maxHeight), false, false);
					}
				}
				this.item.trigger("lengthChange");
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.label = this.oldLabel;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeShapeCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeShape',
			execute: function(callback) {
				this.oldShapeType = this.item.shapeType;
				this.item.shapeType = this.shapeType;
				this.item.element.css("font-weight", this.item.shapeType);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.shapeType = this.oldShapeType;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeFontCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeFont',
			execute: function(callback) {
				var _this = this;
				this.oldFont = this.item.font || '';
				this.item.font = this.font;
				$.loadFonts([this.font]);
				this.item.element.css("fontFamily", this.item.font);
				this.item.watchFontLoad(this.font);
				this.item.waitFontLoad(function() {
					if (_this.item.arc > 0) {
						_this.item.drawArc();
						_this.item.checkBoundry();
					} else {
						if ($.browser.ie.lt9) {
							_this.item.setIEtext();
						}
						if (_this.resetSize) {
							_this.item.size = {
								width: _this.item.element.width(),
								height: _this.item.element.height()
							};
						}
						_this.item.checkBoundry();
					}
					_this.item.trigger("lengthChange");
					if (callback) {
						return callback(_this);
					}
				});
				return this;
			},
			unexecute: function(callback) {
				this.font = this.oldFont;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeUrlCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeUrl',
			execute: function(callback) {
				this.oldUrl || (this.oldUrl = this.item.url);
				this.oldColorUsed = $.extend(true, {},
				this.item.colorsUsed);
				this.item.showLoader();
				this.item.setUrl(this.url);
				this.item.floodFilled = true;
				this.item.addColor(this.colors, 'floodfill');
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			},
			unexecute: function(callback) {
				this.item.setUrl(this.oldUrl);
				this.item.floodFilled = false;
				this.item.colorsUsed = this.oldColorUsed;
				if (callback) {
					callback(this);
				}
				window.design.shirt.updateTotalInks(this.item);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'DeleteCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'delete',
			execute: function(callback) {
				this.container = this.item.element.parent();
				this.itemIndex = this.item.element.index();
				window.design.trashItem(this.item);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				var prevSibling;
				prevSibling = this.container.children().eq(this.itemIndex - 1);
				window.design.restoreItem(this.item.id);
				if (prevSibling) {
					this.item.element.insertAfter(prevSibling);
				}
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeOutlineCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeOutline',
			execute: function(callback) {
				var $textArc;
				this.oldOutline = this.item.outline;
				this.oldOutlineColor = this.item.outlineColor;
				this.item.outline = this.outline;
				this.item.outlineColor = this.outlineColor;
				if (this.item.outline !== 0) {
					if (Math.abs(this.item.arc) > 0) {
						this._repaintArc(this.item.outline, this.item.outlineColor);
					} else {
						this.item.element.find('.text-arc').css('text-shadow', "" + this.item.outline + "px " + this.item.outline + "px 1px " + this.item.outlineColor + ", " + this.item.outline + "px -" + this.item.outline + "px 1px " + this.item.outlineColor + ", -" + this.item.outline + "px " + this.item.outline + "px 1px " + this.item.outlineColor + ", -" + this.item.outline + "px -" + this.item.outline + "px 1px " + this.item.outlineColor);
						if ($.browser.ie.lt9) {
							$textArc = this.item.element.find('.text-arc');
							$textArc.css('filter', this._filterValue($textArc[0].style.filter, this.item.outline, this.item.outlineColor));
						} else if ($.browser.ie.eq9) {
							this.addOutline('.text-arc', this.item.outline, this.item.outlineColor);
						}
					}
				} else {
					if (Math.abs(this.item.arc) > 0) {
						this._repaintArc(this.item.outline, this.item.outlineColor);
					} else {
						this.item.element.find('.text-arc').css('text-shadow', "none");
						if ($.browser.ie.lt9) {
							$textArc = this.item.element.find('.text-arc');
							$textArc.css('filter', this._clearFilter($textArc[0].style.filter));
						} else if ($.browser.ie.eq9) {
							this.item.element.find('.text-arc .dummyShadow').remove();
						}
					}
				}
				if (this.outline === 0) {
					this.item.removeColor('outlineColor');
				} else {
					this.item.addColor(this.outlineColor, 'outlineColor');
				}
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.outline = this.oldOutline;
				this.outlineColor = this.oldOutlineColor;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			},
			_repaintArc: function(outline, outlineColor) {
				var $textArc;
				if (outline === 0) {
					this.item.element.css('text-shadow', 'none');
					this.item.element.find('.text-arc').css('text-shadow', 'none');
					if (this.repaintArc) {
						this.item.drawArc();
					}
					if ($.browser.ie.lt10) {
						$textArc = this.item.element.find('.text-arc');
						$textArc.css('filter', this._clearFilter($textArc[0].style.filter));
					} else if ($.browser.ie.eq9) {
						this.item.element.find('.text-arc span .dummyShadow').remove();
					}
				} else {
					this.item.element.css('text-shadow', "" + outline + "px " + outline + "px 1px " + outlineColor + ", " + outline + "px -" + outline + "px 1px " + outlineColor + ", -" + outline + "px " + outline + "px 1px " + outlineColor + ", -" + outline + "px -" + outline + "px 1px " + outlineColor);
					this.item.element.find('.text-arc').css('text-shadow', "" + outline + "px " + outline + "px 1px " + outlineColor + ", " + outline + "px -" + outline + "px 1px " + outlineColor + ", -" + outline + "px " + outline + "px 1px " + outlineColor + ", -" + outline + "px -" + outline + "px 1px " + outlineColor);
					if (this.repaintArc) {
						this.item.drawArc();
					}
					if ($.browser.ie.lt9) {
						$textArc = this.item.element.find('.text-arc');
						$textArc.css('filter', this._filterValue($textArc[0].style.filter, this.item.outline, this.item.outlineColor));
						this.item.element.find('.text-arc span').css('filter', this._filterValue($textArc[0].style.filter, this.item.outline, this.item.outlineColor));
					} else if ($.browser.ie.eq9) {
						this.addOutline('.text-arc span', this.item.outline, this.item.outlineColor);
					} else {
						this.item.element.find('.text-arc span').css('text-shadow', "" + outline + "px " + outline + "px 1px " + outlineColor + ", " + outline + "px -" + outline + "px 1px " + outlineColor + ", -" + outline + "px " + outline + "px 1px " + outlineColor + ", -" + outline + "px -" + outline + "px 1px " + outlineColor);
					}
				}
				return this;
			},
			_filterValue: function(filter, width, color) {
				filter = this._clearFilter(filter);
				if (!filter) {
					filter = "";
				}
				if (color === '#000000' || color.toLowerCase() === 'black') {
					return " " + filter + " glow(color=" + color + ",strength=" + width + ")";
				} else {
					return "" + filter + " Chroma(color=" + color + ") Alpha(opacity=100) dropshadow(color=" + color + ",offX=" + width + ",offY=" + width + ") dropshadow(color=" + color + ",offX=-" + width + ",offY=" + width + ") dropshadow(color=" + color + ",offX=" + width + ",offY=-" + width + ") dropshadow(color=" + color + ",offX=-" + width + ",offY=-" + width + ")";
				}
			},
			_clearFilter: function(filter) {
				if (filter) {
					return $.trim(filter.replace(/glow\([^\)]+\),?/gi, '').replace(/Chroma\([^\)]+\),?/gi, '').replace(/Alpha\([^\)]+\),?/gi, '').replace(/dropshadow\([^\)]+\),?/gi, ''));
				}
			},
			addOutline: function(select, outline, outlineColor) {
				this.item.element.find(select).find(".dummyShadow").remove();
				return this.item.element.find(select).each(function() {
					var shadowTemplate, text;
					text = $(this).html();
					shadowTemplate = "<span style=\"left: " + outline + "px; top: " + outline + "px; width: 100%; color: " + outlineColor + "; display: block; position: absolute; z-index: -1;\"  class=\"dummyShadow\">" + text + "</span>\n<span style=\"left: " + outline + "px; top: -" + outline + "px; width: 100%; color: " + outlineColor + "; display: block; position: absolute; z-index: -2;\" class=\"dummyShadow\">" + text + "</span>\n<span style=\"left: -" + outline + "px; top: " + outline + "px; width: 100%; color: " + outlineColor + "; display: block; position: absolute; z-index: -3;\" class=\"dummyShadow\">" + text + "</span>\n<span style=\"left: -" + outline + "px; top: -" + outline + "px; width: 100%; color: " + outlineColor + "; display: block; position: absolute; z-index: -4;\" class=\"dummyShadow\">" + text + "</span>";
					return $(this).html(text).append(shadowTemplate);
				});
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeLetterSpacingCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeLetterSpacing',
			execute: function(callback) {
				this.oldSpacing = this.item.letterSpacing;
				this.item.letterSpacing = this.spacing;
				this.item.element.css("letterSpacing", this.item.letterSpacing + 'px');
				if (Math.abs(this.item.arc) > 0) {
					this.item.drawArc();
					this.item.checkBoundry();
				} else {
					if ($.browser.ie.lt9) {
						this.item.setIEtext();
					}
					if (this.resetSize) {
						if (this.item.degrees === 90 || this.item.degrees === 270) {
							this.item.size = {
								width: this.item.element.height(),
								height: this.item.element.width()
							};
						} else {
							this.item.size = {
								width: this.item.element.width(),
								height: this.item.element.height()
							};
						}
					}
					this.item.checkBoundry();
				}
				this.item.trigger("lengthChange");
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.spacing = this.oldSpacing;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'CreateArcCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'createArc',
			execute: function(callback) {
				this.oldItemSize = this.item.size;
				this.item.arc = 200;
				this.item.drawArc();
				this.item.checkBoundry();
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.item.arc = 0;
				this.item.element.find('.text-arc').html(this.item.getLabelHtml()).attr('style', "");
				this.item.element.find('.item-contents').attr('style', "").css('position', 'absolute');
				this.item.size = this.item.getOriginSize();
				this.item.repaint();
				this.item.checkBoundry();
				if (callback) {
					callback(this);
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'RotateCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'rotate',
			execute: function(callback) {
				var deltaX, deltaY, newBounds, _this = this;
				window.avoidPropagation = true;
				this.oldDegrees = this.item.dragStartItemAngle;
				this.oldPosition = $.extend({},
				this.item.dragStartPosition);
				this.item.degrees = this.newDegrees;
				this.renderTransform(this.item, 'rotate', "" + this.newDegrees + "deg");
				newBounds = this.item.getBoundingBox();
				deltaX = Math.round((this.item.contents.width() - newBounds.width) / 2);
				deltaY = Math.round((this.item.contents.height() - newBounds.height) / 2);
				newBounds.top = this.item.position.top + deltaY;
				newBounds.left = this.item.position.left + deltaX;
				this.item.size = {
					width: newBounds.width,
					height: newBounds.height
				};
				this.item.element.css({
					top: newBounds.top,
					left: newBounds.left,
					width: newBounds.width,
					height: newBounds.height
				});
				if ($.browser.ie.lt9 && (this.item.itemType === "Image" || this.item.itemType === "Clipart")) {
					this.item.contents.css({
						marginTop: 0,
						marginLeft: 0
					});
				} else {
					this.item.contents.css({
						marginTop: -deltaY,
						marginLeft: -deltaX
					});
				}
				window.setTimeout(function() {
					return _this._afterTransform();
				},
				0);
				setTimeout(function() {
					return window.avoidPropagation = false;
				},
				500);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.newDegrees = this.oldDegrees;
				this.execute(callback);
				this.item.resetPosition(this.oldPosition);
				this.item.refreshSetting();
				return this;
			},
			_afterTransform: function() {
				if ($.browser.ie.lt9) {
					if (this.item.itemType !== 'Text') {
						this.item.element.find('.null-object').width(this.item.element.width()).height(this.item.element.height());
					} else {
						this.item.element.find('.null-object').width(this.item.element.height()).height(this.item.element.width());
					}
				}
				if (window.design.selectedItem() === this.item) {
					window.design.shirt.trigger('itemRotated', {
						item: this.item
					});
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'DragCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'dragCommand',
			execute: function(callback) {
				this.oldPosition = this.dragObj.originalPosition;
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.item.position = this.oldPosition;
				this.item.moveTo(this.item.position.left, this.item.position.top);
				if (callback) {
					callback(this);
				}
				this.item.checkBoundry();
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ResizeCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'resizeCommand',
			execute: function(callback) {
				var fontSize, isIncrement, newBounds, step;
				this.lastStatus = this.item.lastStatus;
				isIncrement = false;
				if (this.item.itemType === "Text") {
					if (this.newFontSize) {
						fontSize = this.newFontSize;
					} else {
						if (this.item.element.width() < this.resizeWidth) {
							isIncrement = true;
						}
						fontSize = this.item.fontSize;
						step = 0;
						if (isIncrement) {
							step = Math.abs(Math.floor((this.resizeWidth - this.item.element.width()) / 10));
						} else {
							step = Math.abs(Math.ceil((this.resizeWidth - this.item.element.width()) / 10));
						}
						if (step !== 0) {
							if (isIncrement) {
								fontSize += step;
							} else {
								fontSize -= step;
							}
						}
					}
					if (fontSize < 5) {
						fontSize = 5;
					}
					this.item.element.css({
						fontSize: fontSize
					});
					this.item.fontSize = fontSize;
					if (Math.abs(this.item.arc) > 0) {
						this.item.drawArc();
					}
					this.item.checkBoundry(false);
					this.item.trigger("lengthChange");
					if ($.browser.msie && this.item.outline > 0) {
						if (this.item.fontSize <= 18) {
							window.design.controlsPanel.panels.textProperties.outlineShadowSlider.setMax(100).setValue(100);
						} else if (this.item.fontSize > 18 && this.item.fontSize <= 30) {
							window.design.controlsPanel.panels.textProperties.outlineShadowSlider.setMax(200).setValue(200);
						}
					}
				} else {
					this.item.contents.width(this.resizeWidth);
					this.item.contents.height(this.resizeHeight);
					newBounds = this.item.getBoundingBox();
					if ($.browser.ie.lt9 && (this.item.itemType === "Image" || this.item.itemType === "Clipart")) {
						this.item.contents.css({
							marginTop: 0,
							marginLeft: 0
						});
					} else {
						this.item.contents.css({
							marginTop: -Math.round((this.resizeHeight - newBounds.height) / 2),
							marginLeft: -Math.round((this.resizeWidth - newBounds.width) / 2)
						});
					}
					this.item.element.css({
						width: newBounds.width,
						height: newBounds.height
					});
					this.item.size = {
						width: newBounds.width,
						height: newBounds.height
					};
					this.item.setImageSize();
					this.item.image.removeAttr('width');
					this.item.image.removeAttr('height');
				}
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.item.fontSize = this.lastStatus.fontSize;
				this.item.arc = this.lastStatus.arc;
				this.resizeHeight = this.lastStatus.size.height;
				this.resizeWidth = this.lastStatus.size.width;
				this.execute(callback);
				window.design.shirt.trigger('itemUpdated', {
					item: this.item
				});
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeFontSizeCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeFontSizeCommand',
			execute: function(callback) {
				this.oldFontSize = this.item.fontSize;
				this.item.fontSize = this.fontSize;
				this.item.element.css('font-size', this.item.fontSize);
				this.item.checkBoundry();
				if (Math.abs(this.item.arc) > 0) {
					this.item.drawArc();
					this.item.checkBoundry();
				}
				this.item.trigger("lengthChange");
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.fontSize = this.oldFontSize;
				this.execute(callback);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'FlipCommand').inherits(Ooshirts.ItemCommand).includes(Ooshirts.CssTransform)({
		prototype: {
			name: 'flip',
			execute: function(callback) {
				if (this.item.flipState) {
					this.item.flipState = false;
					this.renderTransform(this.item, 'scaleX', 1);
				} else {
					this.item.flipState = true;
					this.renderTransform(this.item, 'scaleX', -1);
				}
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				if (this.item.flipState) {
					this.renderTransform(this.item, 'scaleX', 1);
					this.item.flipState = false;
				} else {
					this.renderTransform(this.item, 'scaleX', -1);
					this.item.flipState = true;
				}
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'FlopCommand').inherits(Ooshirts.ItemCommand).includes(Ooshirts.CssTransform)({
		prototype: {
			name: 'flop',
			execute: function(callback) {
				if (this.item.flopState) {
					this.item.flopState = false;
					this.renderTransform(this.item, 'scaleY', 1);
				} else {
					this.item.flopState = true;
					this.renderTransform(this.item, 'scaleY', -1);
				}
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				if (this.item.flopState) {
					this.renderTransform(this.item, 'scaleY', 1);
					this.item.flopState = false;
				} else {
					this.renderTransform(this.item, 'scaleY', -1);
					this.item.flopState = true;
				}
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ChangeRadiusCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'changeRadius',
			execute: function(callback) {
				this.oldRadius = this.item.arc;
				this.item.arc = this.radius;
				this.lastArc = this.item.lastArc;
				this.item.drawArc();
				this.item.checkBoundry();
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				if ((!this.lastArc) || (this.lastArc === 0)) {
					this.item.destroyArc();
					this.item.element.css('overflow', 'visible');
					window.design.shirt.trigger('itemUpdated', {
						item: this.item
					});
				} else {
					this.radius = this.lastArc;
					this.execute(callback);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'RemoveWhiteCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'removeWhite',
			execute: function(callback) {
				var _this = this;
				this.oldUrl || (this.oldUrl = this.item.url);
				this.oldName || (this.oldName = this.item.name);
				this.item.showLoader();
				$.ajax({
					url: 'http://www.ooshirts.com/lab/editimage.php',
					type: 'POST',
					dataType: 'text',
					data: {
						operation: 'maketransparent',
						filename: this.item.name,
						hex: this.item.color
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						_this.item.setUrl('http://ooshirts-uploads.s3.amazonaws.com/' + data + '.png');
						if (callback) {
							callback(_this);
						}
						return _this.item.noWhite = true;
					}
				});
				return this;
			},
			unexecute: function(callback) {
				this.item.setUrl(this.oldUrl);
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'FloodFillCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'floodFill',
			execute: function(callback) {
				var hex, x, y, _this = this;
				this.oldUrl || (this.oldUrl = this.item.url);
				this.oldName || (this.oldName = this.item.name);
				this.item.showLoader();
				hex = this.color.replace(/#/, '') || '';
				x = this.x || '';
				y = this.y || '';
				$.ajax({
					url: 'http://www.ooshirts.com/lab/editimage.php',
					type: 'POST',
					dataType: 'text',
					data: {
						operation: 'floodfill',
						filename: this.item.name,
						hex: hex,
						point_x: x,
						point_y: y
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						_this.item.setUrl('http://ooshirts-uploads.s3.amazonaws.com/' + data + '.png');
						_this.item.floodFilled = true;
						if (callback) {
							return callback(_this);
						}
					}
				});
				return this;
			},
			unexecute: function(callback) {
				this.item.setUrl(this.oldUrl);
				this.item.floodFilled = false;
				if (callback) {
					callback(this);
				}
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'MakeOneColorCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'makeOneColor',
			execute: function(callback) {
				var _this = this;
				this.color = this.color.replace(/#/, '');
				this.oldUrl = this.item.url;
				this.oldName = this.item.name;
				this.oldColors = $.extend(true, {},
				this.item.colorsUsed);
				this.item.showLoader();
				$.ajax({
					url: 'http://www.ooshirts.com/lab/editimage.php',
					type: 'POST',
					dataType: 'text',
					data: {
						operation: 'makeonecolor',
						filename: this.item.originalName,
						hex: this.color
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('error');
						return console.log(errorThrown);
					},
					success: function(data) {
						_this.item.color = _this.color;
						_this.item.setUrl('http://ooshirts-uploads.s3.amazonaws.com/' + data + '.png');
						_this.item.colorsUsed = null;
						_this.item.addColor('#' + _this.color, 'makeonecolor');
						if (callback) {
							callback(_this);
						}
						return _this.item.refreshSetting();
					}
				});
				return this;
			},
			unexecute: function(callback) {
				this.item.setUrl(this.oldUrl);
				this.item.name = this.oldName;
				this.item.colorsUsed = this.oldColors;
				if (callback) {
					callback(this);
				}
				window.design.shirt.updateTotalInks(this.item);
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'MoveCommand').inherits(Ooshirts.ItemCommand)({
		prototype: {
			name: 'moveCommand',
			execute: function(callback) {
				var x, y;
				this.oldPosition = $.extend({},
				this.item.position);
				x = this.item.position.left + this.leftOffset;
				y = this.item.position.top + this.topOffset;
				this.item.position = {
					left: x,
					top: y
				};
				this.item.moveTo(x, y);
				if (callback) {
					callback(this);
				}
				return this;
			},
			unexecute: function(callback) {
				this.item.position = this.oldPosition;
				this.item.moveTo(this.item.position.left, this.item.position.top);
				if (callback) {
					callback(this);
				}
				this.item.checkBoundry();
				this.item.refreshSetting();
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'ActionsHistory')({
		prototype: {
			init: function() {
				this.reset();
				return this;
			},
			reset: function() {
				this.history = [];
				return this;
			},
			add: function(command) {
				if (this.history.length === 20) {
					this.history.shift();
				}
				this.history.push(command);
				return this;
			},
			undo: function(callback) {
				var lastAction, _this = this;
				lastAction = this.history.pop();
				if (lastAction) {
					lastAction.unexecute(function(cmd) {
						if (callback) {
							return callback(cmd);
						}
					});
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Collaboration')({
		prototype: {
			init: function() {
				this.chat = new Ooshirts.ChatPopup();
				this.nicknameDialog = new Ooshirts.Dialog.Nickname();
				if (window.now) {
					this._initCallbacks();
				}
				return this;
			},
			_initCallbacks: function() {
				var _this = this;
				this.chat.bind('sendMessage',
				function(ev) {
					return now.distributeMessage(ev.message);
				});
				now.ready(function() {
					now.username = $.cookie('username');
					return _this.joinSession();
				});
				now.receiveMessage = function(name, message) {
					return _this.chat.say(name, message);
				};
				now.receiveNotification = function(message) {
					return _this.chat.log(message);
				};
				now.joined = function(name, count) {
					_this.chat.updateCollaborators(count);
					_this.chat.log("" + name + " has joined the session");
					return window.design.disableUndo();
				};
				now.left = function(name, count) {
					_this.chat.updateCollaborators(count);
					_this.chat.log("" + name + " has left the session");
					if (count === 0) {
						return window.design.enableUndo();
					}
				};
				now.getDesign = function(callback) {
					return callback(window.design.serialize());
				};
				now.disableItem = function(itemId, user) {
					return _this.chat.log("" + user + " selected item " + itemId);
				};
				now.enableItem = function(itemId, user) {
					return _this.chat.log("" + user + " deselected item " + itemId);
				};
				now.addItem = function(item, user) {
					var newItem;
					_this.chat.log("" + user + " added item " + item.id);
					newItem = new Ooshirts.Item[item.itemType]($.extend(item, {
						fromLoad: true
					}));
					window.design.addItem(newItem);
					newItem.shirtSide = item.shirtSide;
					if (item.itemType === 'Image') {
						newItem.addColor(item.colorsUsed['origColors'], 'origColors');
					}
					new Ooshirts.AppendCommand({
						item: newItem
					}).execute();
					newItem.trigger('appended', {
						ignoreCenter: true
					});
					if (newItem.shirtSide !== window.design.shirt.side) {
						newItem.hide();
					}
					if (!window.design.selectedItem()) {
						return newItem.select(true);
					}
				};
				now.dragItem = function(itemId, position, user) {
					var item;
					_this.chat.log("" + user + " moved item " + itemId);
					item = window.design.findItem(itemId);
					item.moveTo(position.left, position.top);
					return window.design.shirt.handlersLayout.setPosition();
				};
				now.moveItem = function(itemId, leftOffset, topOffset, user) {
					var item, x, y;
					_this.chat.log("" + user + " moved item " + itemId);
					item = window.design.findItem(itemId);
					x = item.position.left + leftOffset;
					y = item.position.top + topOffset;
					item.moveTo(x, y);
					return window.design.shirt.handlersLayout.setPosition();
				};
				now.changeColor = function(itemId, color, user) {
					var item;
					_this.chat.log("" + user + " changed color of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeColorCommand({
						item: item,
						newColor: color
					}).execute();
				};
				now.changeFontSize = function(itemId, size, user) {
					var item;
					_this.chat.log("" + user + " changed font size of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeFontSizeCommand({
						item: item,
						inches: size
					}).execute();
				};
				now.changeLabel = function(itemId, label, user) {
					var item;
					_this.chat.log("" + user + " changed label of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeLabelCommand({
						item: item,
						label: label
					}).execute();
				};
				now.changeShape = function(itemId, shape, user) {
					var item;
					_this.chat.log("" + user + " changed shape of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeShapeCommand({
						item: item,
						shapeType: shape
					}).execute();
				};
				now.changeFont = function(itemId, font, user) {
					var item;
					_this.chat.log("" + user + " changed font of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeFontCommand({
						item: item,
						font: font
					}).execute();
				};
				now.changeOutline = function(itemId, pts, user) {
					var item;
					_this.chat.log("" + user + " changed outline of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeOutlineCommand({
						item: item,
						outline: pts,
						outlineColor: item.outlineColor
					}).execute(function() {
						if (pts === 0) {
							return item.removeColor('outlineColor');
						}
					});
				};
				now.changeOutlineColor = function(itemId, color, user) {
					var item;
					_this.chat.log("" + user + " changed outline color of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeOutlineCommand({
						item: item,
						outlineColor: color,
						outline: item.outline
					}).execute(function() {
						if (item.outline > 0) {
							return item.addColor(color, 'outlineColor');
						}
					});
				};
				now.changeLetterSpacing = function(itemId, spacing, user) {
					var item;
					_this.chat.log("" + user + " changed letter spacing of " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeLetterSpacingCommand({
						item: item,
						spacing: spacing
					}).execute();
				};
				now.deleteItem = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " deleted item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.DeleteCommand({
						item: item
					}).execute(function(cmd) {
						if (cmd && !window.design.selectedItem()) {
							return window.design.shirt.handlersLayout.hide();
						}
					});
				};
				now.flipItem = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " flipped item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.FlipCommand({
						item: item
					}).execute();
				};
				now.flopItem = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " flopped item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.FlopCommand({
						item: item
					}).execute();
				};
				now.resizeItem = function(itemId, width, height, fontSize, user) {
					var item;
					_this.chat.log("" + user + " resized item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ResizeCommand({
						item: item,
						resizeWidth: width,
						resizeHeight: height,
						newFontSize: fontSize
					}).execute(function(cmd) {
						return window.design.shirt.handlersLayout.setPosition();
					});
				};
				now.sendBackward = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " sent backward item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.SendBackwardCommand({
						item: item
					}).execute();
				};
				now.sendForward = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " sent forward item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.BringForwardCommand({
						item: item
					}).execute();
				};
				now.sendToBack = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " sent to back item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.SendToBackCommand({
						item: item
					}).execute();
				};
				now.sendToFront = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " sent to front item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.BringToFrontCommand({
						item: item
					}).execute();
				};
				now.createArc = function(itemId, user) {
					var item;
					_this.chat.log("" + user + " create arc for item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.CreateArcCommand({
						item: item
					}).execute();
				};
				now.changeRadius = function(itemId, radius, user) {
					var item;
					_this.chat.log("" + user + " changed radius for item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.ChangeRadiusCommand({
						item: item,
						radius: radius
					}).execute();
				};
				now.destroyArc = function(itemId, radius, user) {
					var item;
					_this.chat.log("" + user + " destroyed arc for item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.CreateArcCommand({
						item: item
					}).unexecute();
				};
				now.rotateItem = function(itemId, degrees, user) {
					var item;
					_this.chat.log("" + user + " rotated item " + itemId);
					item = window.design.findItem(itemId);
					return new Ooshirts.RotateCommand({
						item: item,
						newDegrees: degrees
					}).execute();
				};
				now.floodFillItem = function(itemId, url, width, height, colors, user) {
					var item;
					_this.chat.log("" + user + " floodfilled item " + itemId);
					item = window.design.findItem(itemId);
					item.setUrlWithSize(url, width, height);
					item.addColor(colors, 'floodfill');
					item.fromLoad = true;
					return item.floodFilled = true;
				};
				now.makeOneColorItem = function(itemId, url, width, height, color, user) {
					var item;
					_this.chat.log("" + user + " made one color item " + itemId);
					item = window.design.findItem(itemId);
					item.setUrlWithSize(url, width, height);
					item.colorsUsed = null;
					item.addColor(color, 'makeonecolor');
					return item.fromLoad = true;
				};
				now.makeTransparentItem = function(itemId, url, width, height, user) {
					var item;
					_this.chat.log("" + user + " made transparent item " + itemId);
					item = window.design.findItem(itemId);
					item.setUrlWithSize(url, width, height);
					item.removeColor('transparent');
					return item.fromLoad = true;
				};
				now.tshirtChanged = function(id, colorId, user) {
					_this.chat.log("" + user + " change shirt " + id);
					return window.design.shirt.change({
						id: id,
						colorId: colorId
					},
					function() {
						return window.design.controlsPanel.panels.tshirtSettings.renderShirt();
					});
				};
				return this;
			},
			joinSession: function() {
				var _this = this;
				now.joinSession(window.sessionId,
				function(collaborators, design, callback) {
					if (collaborators === 10) {
						alert("Sorry, there are 10 simultaneous users in this session. You'll be redirected to a one");
						return location.href = "/";
					} else if (collaborators > 0) {
						if (!now.username) {
							_this.nicknameDialog.show();
							return _this.nicknameDialog.bind('submit',
							function(ev) {
								now.username = ev.nickname;
								$.cookie('username', now.username);
								_this._onJoined(collaborators, design);
								return callback();
							});
						} else {
							_this._onJoined(collaborators, design);
							return callback();
						}
					} else {
						return now.username || (now.username = 'Host');
					}
				});
				return this;
			},
			_onJoined: function(collaborators, design) {
				this.chat.updateCollaborators(collaborators);
				window.design.disableUndo();
				window.design.load(design);
				return this;
			},
			itemSelected: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemSelection(itemId);
				}
				return this;
			},
			itemDeselected: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemDeselection(itemId);
				}
				return this;
			},
			itemAdded: function(item) {
				this.checkConnect();
				if (window.now) {
					now.distributeNewItem(item);
				}
				return this;
			},
			itemDragged: function(itemId, position) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemDrag(itemId, position);
				}
				return this;
			},
			itemMove: function(itemId, leftOffset, topOffset) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemMove(itemId, leftOffset, topOffset);
				}
				return this;
			},
			colorChanged: function(itemId, color) {
				this.checkConnect();
				if (window.now) {
					now.distributeColorChange(itemId, color);
				}
				return this;
			},
			fontSizeChanged: function(itemId, size) {
				this.checkConnect();
				if (window.now) {
					now.distributeFontSizeChange(itemId, size);
				}
				return this;
			},
			labelChanged: function(itemId, label) {
				this.checkConnect();
				if (window.now) {
					now.distributeLabelChange(itemId, label);
				}
				return this;
			},
			shapeChanged: function(itemId, shape) {
				this.checkConnect();
				if (window.now) {
					now.distributeShapeChange(itemId, shape);
				}
				return this;
			},
			fontChanged: function(itemId, font) {
				this.checkConnect();
				if (window.now) {
					now.distributeFontChange(itemId, font);
				}
				return this;
			},
			outlineChanged: function(itemId, pts) {
				this.checkConnect();
				if (window.now) {
					now.distributeOutlineChange(itemId, pts);
				}
				return this;
			},
			outlineColorChanged: function(itemId, color) {
				this.checkConnect();
				if (window.now) {
					now.distributeOutlineColorChange(itemId, color);
				}
				return this;
			},
			letterSpacingChanged: function(itemId, spacing) {
				this.checkConnect();
				if (window.now) {
					now.distributeLetterSpacingChange(itemId, spacing);
				}
				return this;
			},
			itemDeleted: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemDeletion(itemId);
				}
				return this;
			},
			itemFlipped: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemFlip(itemId);
				}
				return this;
			},
			itemFlopped: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemFlop(itemId);
				}
				return this;
			},
			itemResized: function(itemId, width, height, fontSize) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemResize(itemId, width, height, fontSize);
				}
				return this;
			},
			itemSentBackward: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemSentBackward(itemId);
				}
				return this;
			},
			itemSentForward: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemSentForward(itemId);
				}
				return this;
			},
			itemSentToBack: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemSentToBack(itemId);
				}
				return this;
			},
			itemSentToFront: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemSentToFront(itemId);
				}
				return this;
			},
			itemArcCreated: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeArcCreation(itemId);
				}
				return this;
			},
			itemRadiusChanged: function(itemId, radius) {
				this.checkConnect();
				if (window.now) {
					now.distributeRadiusChange(itemId, radius);
				}
				return this;
			},
			itemArcDestroyed: function(itemId) {
				this.checkConnect();
				if (window.now) {
					now.distributeArcDestroy(itemId);
				}
				return this;
			},
			itemRotated: function(itemId, degrees) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemRotate(itemId, degrees);
				}
				return this;
			},
			itemFloodFilled: function(itemId, url, width, height, colors) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemFloodFill(itemId, url, width, height, colors);
				}
				return this;
			},
			itemMadeOneColor: function(itemId, url, width, height, color) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemMakeOneColor(itemId, url, width, height, color);
				}
				return this;
			},
			itemMadeTransparent: function(itemId, url, width, height) {
				this.checkConnect();
				if (window.now) {
					now.distributeItemMakeTransparent(itemId, url, width, height);
				}
				return this;
			},
			tshirtChanged: function(id, colorId) {
				this.checkConnect();
				if (window.now) {
					now.distributeTshirtChanged(id, colorId);
				}
				return this;
			},
			checkConnect: function() {
				var _socket;
				if (window.now) {
					_socket = window.now.core.socketio.socket;
					if (!_socket || !_socket.connected) {
						return window.now = null;
					}
				}
			}
		}
	});
}).call(this);
(function() {
	var __hasProp = {}.hasOwnProperty;
	Class(Ooshirts, 'Design').includes(Ooshirts.Serializable, Ooshirts.CustomEventSupport)({
		fetchAllForEmail: function(email, callback, errorCallback) {
			var _this = this;
			$.ajax({
				url: 'http://www.ooshirts.com/lab/load.php',
				dataType: 'json',
				type: 'get',
				data: {
					email: email
				},
				success: function(data) {
					if (callback) {
						return callback(data);
					}
				},
				error: function(xhr) {
					if (errorCallback) {
						return errorCallback({
							error: xhr.responseText
						});
					}
				}
			});
			return this;
		},
		fetch: function(id, callback, scope) {
			$.ajax({
				url: 'http://www.ooshirts.com/lab/load.php',
				dataType: 'json',
				type: 'get',
				data: {
					id: id
				},
				success: function(data) {
					var obj;
					if (data && data.name) {
						data.name = data.name.replace("\"", "\\\"");
						obj = $.parseJSON(data.data.replace(/NaN/g, 0));
						if (callback) {
							return callback.apply(scope, [$.extend(obj, {
								id: id
							})]);
						}
					}
				}
			});
			return;
		},
		prototype: {
			name: 'untitled',
			isSaved: false,
			serializableAttributes: ['id', 'name', 'email'],
			customSerializations: ['serializeItems', 'serializeShirt', 'serializeQuoteItems', 'serializeSpreadsheetData'],
			customLoads: ['loadItems', 'loadShirt', 'resetTrashAndActions', 'loadQuoteItems', 'loadSpreadsheetData'],
			init: function(attributes) {
				var _this = this;
				$.extend(true, this, attributes);
				this.actions = new Ooshirts.ActionsHistory();
				this.shirt || (this.shirt = new Ooshirts.Shirt());
				this.dialogsManager = new Ooshirts.Dialog.DialogsManager();
				this.shirt.design = this;
				this.items = {};
				this.resetTrashAndActions();
				this.contextMenu = new Ooshirts.Widget.ShirtContextMenu();
				document.oncontextmenu = function(ev) {
					var item, itemId, target;
					target = $(ev.target).closest('.item-container');
					itemId = target.attr('id') || target.data('item-id');
					if ((itemId != null) && !isNaN(parseInt(itemId.replace(/item/, ''), 10)) && _this.findItem(itemId).itemType === 'TeamText') {
						return false;
					}
					if (ev.target === _this.shirt.element.get(0) && _this.clipboard) {
						_this.contextMenu.showAt(ev.pageX - 1, ev.pageY - 1);
						return false;
					} else {
						if (itemId) {
							item = _this.findItem(itemId);
							item.trigger('contextMenu', {
								originalTarget: ev.target,
								pageX: ev.pageX,
								pageY: ev.pageY
							});
							return false;
						}
						return true;
					}
				};
				this.enableUndo();
				$(document).on('keyup.ctrl_v',
				function() {
					_this.pasteFromClipboard();
					return true;
				}).on('keyup.ctrl_c',
				function() {
					var item;
					item = _this.selectedItem();
					if (item) {
						item.copyToClipboard();
					}
					return true;
				}).on('keyup.del',
				function() {
					var item;
					item = _this.selectedItem();
					if (item) {
						window.design.shirt.handlersLayout.onItemDelete();
					}
					return true;
				}).on('mouseup',
				function(ev) {
					_this.trigger('mouseup', {
						originalEvent: ev
					});
					if ($.browser.ie.lt9) {
						return true;
					}
					return ! ev.isDefaultPrevented;
				}).on('mousemove',
				function(ev) {
					_this.trigger('mousemove', {
						pageX: ev.pageX,
						pageY: ev.pageY
					});
					if ($.browser.ie.lt9) {
						return true;
					}
					return ! ev.isDefaultPrevented;
				}).on('click',
				function(ev) {
					var id, item, target, _ref;
					if (_this.contextMenu.isVisible()) {
						_this.contextMenu.hide();
					}
					window.design.shirt.trigger('hideLayersMenu');
					_ref = _this.items;
					for (id in _ref) {
						item = _ref[id];
						if (item.contextMenu.isVisible()) {
							item.contextMenu.hide();
						}
					}
					target = $(ev.target);
					window.avoidPropagation = false;
					return;
				});
				return this;
			},
			disableUndo: function() {
				$(document).off('keyup.ctrl_z');
				$(document).on('keyup.ctrl_z',
				function() {
					alert('Undo is disabled when a collaboration session is active.');
					return false;
				});
				return this;
			},
			enableUndo: function() {
				var _this = this;
				$(document).off('keyup.ctrl_z');
				$(document).on('keyup.ctrl_z',
				function() {
					if (window.design.dialogsManager.imageFloodfill.isVisible()) {
						window.design.dialogsManager.imageFloodfill.revert();
					} else {
						_this.actions.undo();
					}
					return true;
				});
				return this;
			},
			findItem: function(id) {
				return this.items[id];
			},
			addItem: function(item) {
				this.items[item.id] = item;
				item.design = this;
				item.shirtSide = this.shirt.side;
				return this;
			},
			itemsBySide: function(sideOrSleeve) {
				var item, key, _ref, _results;
				_ref = this.items;
				_results = [];
				for (key in _ref) {
					if (!__hasProp.call(_ref, key)) continue;
					item = _ref[key];
					if (item.shirtSide === sideOrSleeve) {
						_results.push(item);
					}
				}
				return _results;
			},
			switchShirtSide: function(side, resetPanels) {
				var currentItems, currentSelectItem, item, nextItems, _i, _j, _len, _len1;
				if (resetPanels == null) {
					resetPanels = false;
				}
				currentItems = this.itemsBySide(this.shirt.side);
				currentSelectItem = this.selectedItem();
				this.doDeselectAll = true;
				for (_i = 0, _len = currentItems.length; _i < _len; _i++) {
					item = currentItems[_i];
					item.hide();
				}
				if (this.doDeselectAll) {
					this.deselectAll(resetPanels);
				}
				this.shirt.side = side;
				if (side === 'front' || side === 'back') {
					this.shirt.sleeveInformation.hide();
					this.shirt.change({
						id: this.shirt.id,
						colorId: this.shirt.color.id,
						categoryId: this.shirt.categoryId,
						subcategoryId: this.shirt.subcategoryId
					});
				} else {
					this.shirt.showSleeve(side);
				}
				this.shirt.updateFrame();
				nextItems = this.itemsBySide(this.shirt.side);
				for (_j = 0, _len1 = nextItems.length; _j < _len1; _j++) {
					item = nextItems[_j];
					item.show();
					this.updateDraggableContainment(item);
				}
				$("#shirt-side-select-menu .active").removeClass('active');
				switch (side) {
				case 'front':
					this.shirt.frontShirtBtn.element.addClass('active');
					break;
				case 'back':
					this.shirt.backShirtBtn.element.addClass('active');
					break;
				case 'right':
					this.shirt.rightSleeveBtn.element.addClass('active');
					break;
				case 'left':
					this.shirt.leftSleeveBtn.element.addClass('active');
				}
				if (currentSelectItem) {
					this.goControllPanel(currentSelectItem.itemType);
				}
				return this;
			},
			goControllPanel: function(itemType) {
				switch (itemType) {
				case 'TeamText':
					window.design.controlsPanel.goTo('namesAndNumbers');
					break;
				case 'Text':
					window.design.controlsPanel.goTo('addText');
					break;
				case 'Image':
					window.design.controlsPanel.goTo('uploadImage');
					break;
				case 'Clipart':
					window.design.controlsPanel.goTo('clipArtCatList');
				}
				return this;
			},
			selectItem: function(item, resetPanels) {
				if (resetPanels == null) {
					resetPanels = true;
				}
				if (item !== this.selectedItem()) {
					this.deselectAll(resetPanels);
					this._selectedItemId = item.id;
				}
				return this;
			},
			deselectAll: function(resetPanels) {
				var item;
				if (resetPanels == null) {
					resetPanels = false;
				}
				item = this.selectedItem();
				if (item) {
					item.didDeselect();
				}
				this._selectedItemId = null;
				if (resetPanels) {
					this.controlsPanel.goTo('welcome', 'right');
				}
				return this;
			},
			selectedItem: function() {
				return this.findItem(this._selectedItemId);
			},
			sendToBackLayer: function(item) {
				if (!item.element.is(':first')) {
					item.element.insertBefore(item.element.prev());
				}
				return this;
			},
			sendToFrontLayer: function(item) {
				if (!item.element.is(':last')) {
					item.element.insertAfter(item.element.next());
				}
				return this;
			},
			sendToBack: function(item) {
				if (!item.element.is(':first')) {
					item.element.insertBefore(item.element.siblings('.ooshirts-shirt-item').first());
				}
				return this;
			},
			sendToFront: function(item) {
				if (!item.element.is(':last')) {
					item.element.insertAfter(item.element.siblings().last());
				}
				return this;
			},
			trashItem: function(item) {
				this.trash[item.id] = item;
				delete this.items[item.id];
				item.element.remove();
				window.design.shirt.updateTotalInks(this);
				return this;
			},
			restoreItem: function(itemId) {
				var command, item;
				item = this.trash[itemId];
				if (item) {
					this.trash[itemId] = null;
					this.addItem(item);
					command = new Ooshirts.AppendCommand({
						item: item
					});
					command.execute(function() {
						return item.trigger('appended');
					});
				}
				return this;
			},
			pasteFromClipboard: function() {
				var item;
				if (this.clipboard) {
					item = this.findItem(this.clipboard) || this.trash[this.clipboard];
					return item.duplicate();
				} else {
					return null;
				}
			},
			save: function(email, name, callback, errorCallback, isCheckoutSave, isDesignReview) {
				var checkout, design_review, postData, _this = this;
				if (isCheckoutSave == null) {
					isCheckoutSave = false;
				}
				if (isDesignReview == null) {
					isDesignReview = false;
				}
				if (!this.isSaved) {
					this.name = name;
					this.email = email;
					if (isCheckoutSave) {
						checkout = 1;
					}
					if (isDesignReview) {
						design_review = 1;
					}
					postData = {
						name: name,
						email: email,
						data: $.toJSON(this.serialize()),
						checkout: checkout,
						design_review: design_review
					};
					$.ajax({
						url: 'http://www.ooshirts.com/lab/save.php',
						dataType: 'text',
						type: 'post',
						data: postData,
						success: function(data) {
							_this.id = data;
							_this.isSaved = true;
							_this.trigger('saved', {
								name: name,
								email: email,
								id: _this.id
							});
							if (callback) {
								return callback(_this.id);
							}
						},
						error: function(xhr) {
							if (errorCallback) {
								return errorCallback({
									error: xhr.responseText
								});
							}
						}
					});
				}
				return this;
			},
			serializeItems: function(data) {
				var id, ids, _i, _len;
				ids = this.sortItemIds();
				data.items = [];
				for (_i = 0, _len = ids.length; _i < _len; _i++) {
					id = ids[_i];
					data.items.push(this.items[id].serialize());
				}
				return data;
			},
			sortItemIds: function() {
				var ids, _this = this;
				ids = [];
				ids = $.map($('#canvas').find('.item-container'),
				function(item) {
					return item.id;
				});
				return ids;
			},
			serializeShirt: function(data) {
				data.shirt = this.shirt.serialize();
				return data;
			},
			serializeQuoteItems: function(data) {
				data.quoteShirts = window.header.quoteTooltip.serialize();
				return data;
			},
			serializeSpreadsheetData: function(data) {
				data.spreadsheetData = this.dialogsManager.spreadsheet.serialize().spreadsheetData;
				return data;
			},
			loadSpreadsheetData: function(data) {
				this.dialogsManager.spreadsheet.load(data.spreadsheetData);
				return data;
			},
			loadQuoteItems: function(data) {
				if (!window.design_data) {
					if (data.quoteShirts) {
						window.header.quoteTooltip.removetShirts();
						window.header.quoteTooltip.load(data.quoteShirts);
						window.header.quoteTooltip.setTitle(data.name);
					}
				}
				return data;
			},
			loadItems: function(data) {
				var cmd, item, key, newItem, _i, _len, _ref, _ref1;
				this.deselectAll();
				this._destroyItems();
				this.items = {};
				this.itemsArray = [];
				_ref = data.items;
				for (key in _ref) {
					if (!__hasProp.call(_ref, key)) continue;
					item = _ref[key];
					this.itemsArray.push(item);
				}
				_ref1 = this.itemsArray;
				for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
					item = _ref1[_i];
					if (!item.itemType) {
						continue;
					}
					newItem = new Ooshirts.Item[item.itemType]($.extend(item, {
						fromLoad: true
					}));
					this.addItem(newItem);
					newItem.shirtSide = item.shirtSide;
					cmd = new Ooshirts.AppendCommand({
						item: newItem
					});
					cmd.execute();
					newItem.trigger('appended', {
						ignoreCenter: true
					});
					if (newItem.shirtSide !== this.shirt.side) {
						newItem.hide();
					}
				}
				this.deselectAll();
				return data;
			},
			loadShirt: function(data) {
				var _this = this;
				this.shirt.load(data.shirt,
				function(data) {
					window.design.shirt.change({
						id: data.id,
						colorId: data.color.id,
						categoryId: data.categoryId,
						subcategoryId: data.subcategoryId
					});
					return window.design.controlsPanel.panels.tshirtSettings.renderShirt();
				});
				return data;
			},
			resetTrashAndActions: function(data) {
				this.actions.reset();
				this.trash = {};
				return data;
			},
			updateDraggableContainment: function(item) {
				return this;
			},
			_destroyItems: function() {
				var item, key, _ref;
				_ref = this.items;
				for (key in _ref) {
					if (!__hasProp.call(_ref, key)) continue;
					item = _ref[key];
					item.destroy();
				}
				return this;
			}
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Quote')({
		getQuote: function(params, callback) {
			var _this = this;
			if (this.lastParams !== $.param(params)) {
				$.ajaxSingle({
					url: baseURL + 'api/quote.json',
					type: 'post',
					dataType: 'json',
					data: params,
					success: function(data) {
						_this.lastParams = $.param(params);
						_this.lastData = data;
						if (callback) {
							return callback(data);
						}
					}
				});
			} else {
				if (callback) {
					callback(this.lastData);
				}
			}
			return null;
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Pantone')({
		toHex: function(pms, callback) {
			$.ajax({
				url: 'http://www.ooshirts.com/lab/pantone.php',
				type: 'post',
				dataType: 'text',
				data: {
					pantone: pms
				},
				success: function(data) {
					var result;
					result = '{"hex": "' + data + '", "pms": "' + pms + '"}';
					if (callback) {
						return callback($.parseJSON(result));
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var result;
					result = '{"hex": null, "pms": "' + pms + '"}';
					if (callback) {
						return callback($.parseJSON(result));
					}
				}
			});
			return null;
		}
	});
}).call(this);
(function() {
	Class(Ooshirts, 'Share')({
		send: function(attributes, callback, errorCallback) {
			$.ajax({
				url: baseURL + 'api/share.json',
				type: 'post',
				dataType: 'json',
				data: attributes,
				success: function() {
					if (callback) {
						return callback();
					}
				},
				error: function() {
					if (errorCallback) {
						return errorCallback();
					}
				}
			});
			return this;
		}
	});
}).call(this);
(function() {
	jQuery(function() {
		var autoSave, onDataLoad, resetHeightAndWidth, shirt, shirtConfig, sylvesterScript, _this = this;
		if (!window.design_data) {
			window.header = new Ooshirts.Header({
				element: $('body > header')
			});
		}
		shirt = new Ooshirts.Shirt({
			element: $('#tshirt')
		});
		autoSave = new Ooshirts.AutoSave();
		shirtConfig = $.extend({
			id: '1',
			colorId: '224'
		},
		window.default_shirt || {});
		if (window.designId) {
			Ooshirts.Design.fetch(window.designId,
			function(data) {
				if (data) {
					data.shirt = data.shirt || {
						id: '1',
						color: {
							name: 'White'
						}
					};
					shirtConfig = $.extend(shirtConfig, {
						id: data.shirt.id,
						colorId: data.shirt.color.name
					});
					if (!shirtConfig.id || !shirtConfig.colorId) {
						shirtConfig = {
							id: '1',
							colorId: 'White'
						};
						data.shirt = {
							id: '1',
							color: {
								name: 'White'
							}
						};
					}
					return onDataLoad(shirtConfig, data);
				}
			});
		} else {
			autoSave.load(function(data) {
				if (data) {
					shirtConfig = $.extend({
						id: '1',
						colorId: '224'
					},
					{
						id: data.shirt_data.shirt.id,
						colorId: data.shirt_data.shirt.color.name
					},
					window.default_shirt || {});
					data.shirt_data.shirt = {
						id: shirtConfig.id,
						color: {
							name: shirtConfig.colorId
						}
					};
					return onDataLoad(shirtConfig, data.shirt_data, data.shirt_side);
				} else {
					return onDataLoad(shirtConfig);
				}
			});
		}
		onDataLoad = function(shirtConfig, data, side) {
			if (side == null) {
				side = "front";
			}
			if (!window.thumb) {
			    //////////////////////_gaq.push(['_trackEvent', 'Design App', 'Loaded']);
			}
			return shirt.change(shirtConfig,
			function() {
				var _this = this;
				window.design = new Ooshirts.Design({
					name: 'design',
					shirt: shirt
				});
				window.design.controlsPanel = new Ooshirts.Widget.ControlsPanel({
					element: $('#controls')
				});
				window.collaboration = new Ooshirts.Collaboration();
				if (!window.design_data) {
					window.design.bind('saved',
					function(ev) {
						return window.header.quoteTooltip.setTitle(ev.name);
					});
				} else {}
				$(window).resize(function() {
					if (window.design.selectedItem()) {
						window.design.updateDraggableContainment(window.design.selectedItem());
						return window.design.shirt.trigger('itemMoved');
					}
				});
				shirt.bind('shirtChange',
				function() {
					if (window.header) {
						return window.header.trigger('shirtChange');
					}
				});
				$("#app-wrap").show();
				$("#app-loader").hide();
				if (data) {
					if (side !== 'front') {
						window.design.switchShirtSide(side);
					}
					window.design.load(data);
				}
				if (window.thumb) {
					window.design.dialogsManager.welcomeScreen.hide();
				}
				if (!window.thumb) {
					autoSave.start();
					if (window.default_shirt) {
						return setTimeout(function() {
							return window.forceChangeShirtShow();
						},
						50);
					}
				}
			});
		};
		if (window.thumb) {
			$('footer').hide();
			$("#estimate").hide();
		}
		if ($.browser.mozilla && $.browser.versionNum < 2) {
			sylvesterScript = '<script src="' + window.sylvester_assets_path + '"></script>';
			$('head').append(sylvesterScript);
		}
		if ($.browser.ie.lt10) {
			try {
				$("body :not(input[type='text'], textarea, input[type='email'])").attr('unselectable', 'on');
			} catch(e) {}
		}
		resetHeightAndWidth = function() {
			var bodyElement, colorPicker, height, width;
			bodyElement = $('body').get(0);
			height = bodyElement.clientHeight;
			width = bodyElement.clientWidth;
			$('#app-wrap').height(height - 134);
			if (height <= 840) {
				$("html").addClass("heightlt768");
			} else {
				$("html").removeClass("heightlt768");
			}
			if (height <= 620) {
				$("html").addClass("heightlt610");
			} else {
				$("html").removeClass("heightlt610");
			}
			if (width >= 1500) {
				$("html").addClass("widthgt1500");
			} else {
				$("html").removeClass("widthgt1500");
			}
			if (window.design && window.design.controlsPanel) {
				colorPicker = window.design.controlsPanel.panels.textProperties.outlineShadowColorPicker;
				if (height <= 720) {
					return colorPicker.setDirection("up");
				} else {
					return colorPicker.setDirection("down");
				}
			}
		};
		resetHeightAndWidth();
		$(window).resize(function() {
			return resetHeightAndWidth();
		});
		if ($.browser.msie && !$("html").hasClass("ie")) {
			$("html").addClass("ie");
		}
		if (!window.design_data) {
			shirt.bind('updateColors',
			function(ev) {
				return window.header.quoteTooltip.updateColors(ev.tshirtSidesColors);
			});
		}
		$('input[placeholder], textarea[placeholder]').placeholder();
		$(window).on('beforeunload',
		function(ev) {
			var message, oEvent;
			oEvent = ev || window.event;
			message = null;
			if (!window.design.isSaved && !window.isBuyNow) {
				message = 'Are you sure you want to leave this page?';
				oEvent.returnValue = message;
			}
			return message;
		});
		window.forceSideButtonsRight = function() {
			return $("html").addClass("force-side-button-right");
		};
		return window.forceChangeShirtShow = function() {
			return window.design.dialogsManager.tshirtCatalog.show();
		};
	});
}).call(this);
(function() {
	Class(Ooshirts, 'AutoSave')({
		prototype: {
			init: function() {
				return this.threadNum = 0;
			},
			save: function(params, callback) {
				var _this = this;
				if (this.lastParams !== $.param(params)) {
					return $.ajax({
						url: 'http://www.ooshirts.com/lab/autosave.php',
						type: 'post',
						dataType: 'text',
						data: {
							data: $.toJSON({
								shirt_side: params.shirt_side,
								shirt_data: params.data
							}),
							session_id: window.selfSessionId
						},
						success: function(data) {
							_this.lastParams = $.param(params);
							if (callback) {
								return callback(data);
							}
						}
					});
				}
			},
			load: function(callback) {
				var _this = this;
				return $.ajax({
					url: 'http://www.ooshirts.com/lab/autoload.php',
					type: 'post',
					data: {
						session_id: window.selfSessionId
					},
					dataType: 'json',
					success: function(data) {
						if (callback) {
							return callback(data);
						}
					},
					error: function(xhr) {
						if (callback) {
							return callback(null);
						}
					}
				});
			},
			start: function() {
				var _this = this;
				return this.threadNum = setInterval(function() {
					return _this.save({
						shirt_side: window.design.shirt.side,
						data: window.design.serialize()
					});
				},
				15 * 1000);
			},
			stop: function() {
				return clearInterval(this.threadNum);
			}
		}
	});
}).call(this);
