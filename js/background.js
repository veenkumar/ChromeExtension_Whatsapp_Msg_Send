var e, t = chrome.runtime.getManifest().version,
	a = {
		username: "",
		key: "",
		activate_date: "",
		scrape_status: "Finished",
		group_sender_status: "Finished",
		attachment_input: !1,
		scrapped_items_arr: [],
		total_scrapped_page: 0,
		total_scrapped_count: 0,
		current_processed_count: 0,
		interval_break_seconds: 2,
		authUser: !1,
		userFreeTrialStarted: !1,
		userTrialIsStarted: !1,
		authName: "",
		userRegistered: !1,
		active_search_tab_id: 0,
		last_status_check_time: "",
		message_input: "",
		group_message_input: "",
		countryCode: "91"
	},
	r = {
		search_change: !1,
		onExtMessage: function(t, s, n) {
			var o, i, c;
			switch (r.message = t, t.command) {
				case "saveUISettings":
					a = t.data, r.saveUISettings(t.data, s, n);
					break;
				case "console_logs_myApp":
					e(t.title, t.msg);
					break;
				case "stopAutoBotProcess":
					r.stopAutoBotProcess(t.reason);
					break;
				case "startSearchProcess":
					r.startSearchProcess(t.data, s, n);
					break;
				case "startGroupSenderProcess":
					r.startGroupSenderProcess(t.data, s, n);
					break;
				case "saveUserToServer":
					r.saveUserToServer(t.data, s, n);
					break;
				case "downloadGroupNumbers":
					o = getFormattedTimeFileName(), "" != t.group_name && t.group_name && (file_name = t.group_name + "_" + o), r.V2JSONToCSVConvertor(t.data, file_name, !0);
					break;
				case "downloadCSV":
					r.downloadCSV(t.data, t.file_name);
					break;
				case "checkSearchStatus":
					i = !1, s && s.tab && s.tab.id && parseInt(s.tab.id) == parseInt(a.active_search_tab_id) && (i = !0), n({
						is_search: i
					});
					break;
				case "startAutoBotProcess":
					c = {
						title: "Global Gym Software Bulk Whatsapp Sender",
						msg: "Auto bot proccess has been started"
					}, r.create_notifications(c);
					break;
				case "set_delay_in_bg":
					setTimeout(function() {
						n()
					}, t.timeout);
					break;
				case "getSettings":
					"yes" == t.callback ? n({
						uiSettings: a
					}) : sendMessage(s, {
						command: "rec_getSettings",
						data: {
							uiSettings: a
						}
					})
			}
			return !0
		},
		load: function() {
			r.initStorage()
		},
		initStorage: function(e) {
			chrome.storage.local.get("version", e => {
				const r = e.version;
				r != t ? (null == r || void 0 === r ? chrome.storage.local.set({
					uiSettings: JSON.stringify(a)
				}, function() {
					chrome.storage.local.get("uiSettings", e => {
						a = JSON.parse(e.uiSettings)
					})
				}) : chrome.storage.local.get("uiSettings", e => {
					a = JSON.parse(e.uiSettings)
				}), chrome.storage.local.set({
					version: t
				}, function() {})) : chrome.storage.local.get("uiSettings", e => {
					a = JSON.parse(e.uiSettings)
				})
			}), chrome.storage.local.get("UUID", e => {
				const t = e.UUID;
				null != t && "" != t || chrome.storage.local.set({
					UUID: generateUUID()
				}, function() {})
			})
		},
		saveUISettings: function(e, t, r) {
			chrome.storage.local.set({
				uiSettings: JSON.stringify(a)
			}, function() {}), "function" == typeof r && r({
				uiSettings: a
			})
		},
		create_notifications: function(e) {
			chrome.notifications.create({
				type: "basic",
				iconUrl: "images/default_icon_128.png",
				title: e.title,
				message: e.msg
			}, function() {
				chrome.runtime.lastError
			})
		},
		startSearchProcess: function(e, t, s) {
			a.active_search_tab_id = 0, a.current_processed_count = 0, a.scrape_status = "Finished", a.scrapped_items_arr = [], a.search_keyword = "", r.saveUISettings(), chrome.tabs.query({}, function(t) {
				var s, n, o, i, c, u, d, p, m, l = "";
				if (t && t.length > 0) {
					for (s = 0; s < t.length; s++)
						if (t[s].url && -1 != t[s].url.indexOf("web.whatsapp.com")) {
							l = t[s].id;
							break
						} if (n = e.scrapped_items_arr, 0 != (o = parseInt(a.countryCode) || 0) || 0 != o)
						for (i = 0; i < n.length; i++) c = n[i].number, String(c).length > 10 || (c = String(o) + String(c)), n[i].number = c;
					n[0].status = "Inprogress", u = n[0].number, d = n[0].name, p = (p = a.message_input).replace(/{name}/g, d), m = "https://web.whatsapp.com/send?phone=" + window.encodeURIComponent(u) + "&text=" + window.encodeURIComponent(p), "" != l && parseInt(l) ? chrome.tabs.get(parseInt(l), e => {
						chrome.windows.update(e.windowId, {
							focused: !0
						}, function() {}), chrome.tabs.update(parseInt(l), {
							active: !0
						}, function() {
							a.scrape_status = "Inprogress", a.current_processed_count = 0, a.active_search_tab_id = parseInt(l), a.scrapped_items_arr = n, r.saveUISettings(), sendMessage(a.active_search_tab_id, {
								command: "startPersonSendingMsg"
							}, function(e) {})
						})
					}) : chrome.tabs.create({
						url: m
					}, function(t) {
						a.scrape_status = "Inprogress", a.current_processed_count = 0, a.active_search_tab_id = t.id, a.scrapped_items_arr = e.scrapped_items_arr, r.saveUISettings()
					})
				}
			})
		},
		startGroupSenderProcess: function(e, t, s) {
			a.active_search_tab_id = 0, a.current_processed_count = 0, a.scrape_status = "Finished", a.group_sender_status = "Finished", a.scrapped_items_arr = [], r.saveUISettings(), chrome.tabs.query({}, function(e) {
				var t, s = "";
				if (e && e.length > 0) {
					for (t = 0; t < e.length; t++)
						if (e[t].url && -1 != e[t].url.indexOf("web.whatsapp.com")) {
							s = e[t].id;
							break
						}
					"" != s && parseInt(s) ? chrome.tabs.get(parseInt(s), e => {
						chrome.windows.update(e.windowId, {
							focused: !0
						}, function() {}), chrome.tabs.update(parseInt(s), {
							active: !0
						}, function() {
							a.group_sender_status = "Inprogress", a.active_search_tab_id = parseInt(s), r.saveUISettings(), sendMessage(a.active_search_tab_id, {
								command: "startGroupSendingMsg"
							}, function(e) {})
						})
					}) : chrome.tabs.create({
						url: sendm_sms_url
					}, function(e) {
						a.group_sender_status = "Inprogress", a.active_search_tab_id = e.id, r.saveUISettings()
					})
				}
			})
		},
		stopAutoBotProcess: function(e) {
			var t;
			"next_profile_not_found" == e ? (t = {
				title: "Global Gym Software Bulk Whatsapp Sender",
				msg: "Successfully messages sent."
			}, r.create_notifications(t)) : "register_required" == e ? (t = {
				title: "Global Gym Software Bulk Whatsapp Sender",
				msg: "Auto bot process has been stopped. You need to register for more scrape data."
			}, r.create_notifications(t)) : "user_not_approved" == e ? (t = {
				title: "Global Gym Software Bulk Whatsapp Sender",
				msg: "Auto bot process has been stopped. You are not registered or your account is not approved for more scrape data."
			}, r.create_notifications(t)) : "upgrade_require" == e ? (t = {
				title: "Global Gym Software Bulk Whatsapp Sender",
				msg: "Auto bot process has been stopped. You need to upgrade your account for more send messages."
			}, r.create_notifications(t)) : "manual_stop" == e && (t = {
				title: "Global Gym Software Bulk Whatsapp Sender",
				msg: "Auto bot process has been stopped."
			}, r.create_notifications(t)), sendMessage(a.active_search_tab_id, {
				command: "removeBlocker"
			}, function(e) {}), a.scrape_status = "Finished", a.group_sender_status = "Finished", a.active_search_tab_id = 0, r.saveUISettings(), sendMessage("", {
				command: "updateScrapeState"
			}, function(e) {})
		},
		saveUserToServer: function(e, t, a) {
			$.ajax({
				url: consts.base_api_url + consts.save_user_api_url,
				type: "POST",
				data: {
					key: e.key,
					user_email: e.user_email
				},
				cache: !1,
				success: function(e) {
					a(e)
				},
				error: function(e) {
					console.log("error ", e), a(e)
				}
			})
		},
		updateProcess: function(e, t, a) {
			chrome.storage.local.get("UUID", t => {
				const r = t.UUID;
				$.ajax({
					url: atob(consts.baurl) + atob(consts.uaurl),
					type: "POST",
					data: {
						producttype: e.name,
						email: e.email,
						machineid: r
					},
					cache: !1,
					success: function(e) {
						a(e)
					},
					error: function(e) {
						a(e.statusText || e.responseText || "")
					}
				})
			})
		},
		downloadCSV: function(e, t) {
			var a = getFormattedTimeFileName(),
				s = t + "_" + a;
			r.V2JSONToCSVConvertor(e, s, !0)
		},
		V2JSONToCSVConvertor: function(e, t, a) {
			var s, n, o, i, c, u = "object" != typeof e ? JSON.parse(e) : e,
				d = "";
			if (a) {
				for (n in s = "", u[0]) s += r.getKeyFromMap(n) + ",";
				d += (s = s.slice(0, -1)) + "\r\n"
			}
			for (o = 0; o < u.length; o++) {
				for (n in s = "", u[o]) u[o][n], s += '"' + (void 0 === u[o][n] ? "" : (u[o][n] + "").toString().replace(/["]/gi, "'")) + '",';
				s.slice(0, s.length - 1), d += s + "\r\n"
			}
			"" != d ? (i = "", i += t.replace(/ /g, "_"), c = "data:text/csv;charset=utf-8," + escape(d), chrome.downloads.download({
				url: c,
				filename: "WP_Sender/" + i + ".csv"
			})) : alert("Invalid data")
		},
		getKeyFromMap: function(e) {
			return {
				name: "Name",
				address: "Address",
				zip: "Zip Code",
				latitude: "Latitude",
				phone_number: "Phone Number",
				email: "Email",
				website: "Website",
				longitude: "Longitude"
			} [e] || e
		},
		getParameterByName: function(e, t) {
			t || (t = window.location.href), e = e.replace(/[\[\]]/g, "\\$&");
			var a = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
			return a ? a[2] ? decodeURIComponent(a[2].replace(/\+/g, " ")) : "" : null
		},
		updateQueryStringParameter: function(e, t, a) {
			var r = new RegExp("([?&])" + t + "=.*?(&|$)", "i"),
				s = -1 !== e.indexOf("?") ? "&" : "?";
			return e.match(r) ? e.replace(r, "$1" + t + "=" + a + "$2") : e + s + t + "=" + a
		}
	};

function sendMessage(e, t) {
	e ? chrome.tabs.sendMessage(e, t) : chrome.runtime.sendMessage(t)
}

function generateUUID() {
	var e = (new Date).getTime(),
		t = performance && performance.now && 1e3 * performance.now() || 0;
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
		var r = 16 * Math.random();
		return e > 0 ? (r = (e + r) % 16 | 0, e = Math.floor(e / 16)) : (r = (t + r) % 16 | 0, t = Math.floor(t / 16)), ("x" === a ? r : 3 & r | 8).toString(16)
	})
}

function PopupCenter(e, t, a, r) {
	var s = null != window.screenLeft ? window.screenLeft : screen.left,
		n = null != window.screenTop ? window.screenTop : screen.top,
		o = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
		i = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
		c = o / 2 - a / 2 + s,
		u = i / 2 - r / 2 + n,
		d = window.open(e, t, "scrollbars=yes, width=" + a + ", height=" + r + ", top=" + u + ", left=" + c);
	window.focus && d.focus()
}

function getFormattedTimeFileName() {
	var e = new Date,
		t = e.getFullYear(),
		a = pad(e.getMonth() + 1),
		r = pad(e.getDate()),
		s = pad(e.getHours()),
		n = pad(e.getMinutes()),
		o = pad(e.getSeconds());
	return t + "-" + a + "-" + r + "-" + s + "-" + n + "-" + o
}

function pad(e) {
	return e < 10 ? "0" + e : e
}
chrome.runtime.onMessage.addListener(r.onExtMessage), r.load(), e = function(e, t) {}, chrome.tabs.onRemoved.addListener(function(e, t) {
	a.active_search_tab_id == e && (r.stopAutoBotProcess("manual_stop"), sendMessage("", {
		command: "updateScrapeState"
	}, function(e) {}))
}), chrome.browserAction.onClicked.addListener(function(e) {
	PopupCenter(1 == a.authUser && 0 == a.userFreeTrialStarted ? chrome.runtime.getURL("html/index.html") : chrome.runtime.getURL("html/free-version.html"), "Global Gym Software Bulk Whatsapp Sender", 1050, 650)
});