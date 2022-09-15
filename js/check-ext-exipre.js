var callback = [],
	checkExipreObj = {
		isCheckActivate: function(e) {
			var t = !1;
			sendMessage({
				command: "getSettings"
			}, function(i) {
				if (checkExipreObj.uiSettings = i.uiSettings, "" != checkExipreObj.uiSettings.activate_date) {
					var a = new Date(parseInt(atob(checkExipreObj.uiSettings.activate_date)));
					if ("Invalid Date" != a) {
						var n = checkExipreObj.daysBetween(new Date(a).getTime(), (new Date).getTime());
						n = parseInt(n), t = n <= 90
					} else t = !1
				} else t = !1;
				e(t)
			})
		},
		treatAsUTC: function(e) {
			var t = new Date(e);
			return t.setMinutes(t.getMinutes() - t.getTimezoneOffset()), t
		},
		daysBetween: function(e, t) {
			return (checkExipreObj.treatAsUTC(t) - checkExipreObj.treatAsUTC(e)) / 864e5
		}
	};