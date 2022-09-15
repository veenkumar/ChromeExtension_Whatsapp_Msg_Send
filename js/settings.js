var e = [],
	t = {
		uiSettings: {},
		load: function() {
			$.material.init(), t.addEvents(), t.initSettings()
		},
		initSettings: function() {
			sendMessage({
				command: "getSettings"
			}, function(e) {
				t.uiSettings = e.uiSettings, $("#user_email").val(t.uiSettings.username), $("#user_key").val(t.uiSettings.key), 1 == t.uiSettings.userTrialIsStarted ? ($(".loginResSection").show(), $(".start-free-trial-btn").hide(), $(".loginResSection").html('<div class="alert alert-warning alert-dismissible text-center"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> <i class="fa fa-info-circle"></i> Your "Free Version" already active!<br><br><button class="btn btn-default btn-lg btn-theme-yellow go-to-free-trial-btn">Go To Free Version</button></div>')) : $(".start-free-trial-btn").show()
			})
		},
		addEvents: function() {
			$(document).on("click", ".start-free-trial-btn", function(e) {
				e.preventDefault(), $(".loginResSection").hide(), sendMessage({
					command: "getSettings"
				}, function(e) {
					t.uiSettings = e.uiSettings, 0 == t.uiSettings.userTrialIsStarted ? (t.uiSettings.userTrialIsStarted = !0, t.uiSettings.userFreeTrialStarted = !0, t.uiSettings.authUser = !0, sendMessage({
						command: "saveUISettings",
						data: t.uiSettings
					}, function(e) {
						$(".loginResSection").show(), $(".loginResSection").html('<div class="alert alert-success alert-dismissible text-center"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong> <i class="fa fa-check-circle"></i> Your "Free Version" has been started!</strong></div>'), setTimeout(function() {
							location.href = "index.html"
						}, 2e3)
					})) : ($(".loginResSection").show(), $(".loginResSection").html('<div class="alert alert-warning alert-dismissible text-center"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> <i class="fa fa-info-circle"></i> Your "Free Version" already active!<br><br><button class="btn btn-default btn-lg btn-theme-yellow go-to-free-trial-btn">Go To Free Trial</button></div>'))
				})
			}), $(document).on("click", ".go-to-free-trial-btn", function(e) {
				e.preventDefault(), $(".loginResSection").hide(), sendMessage({
					command: "getSettings"
				}, function(e) {
					t.uiSettings = e.uiSettings, t.uiSettings.userFreeTrialStarted = !0, t.uiSettings.authUser = !0, sendMessage({
						command: "saveUISettings",
						data: t.uiSettings
					}, function(e) {
						location.href = "index.html"
					})
				})
			}), $("#ext_activate_form").unbind("submit"), $("#ext_activate_form").submit(function(e) {
				var s, a;
				return e.preventDefault(), $("#msgInfoSection").html(""), "" == (s = $("#user_email").val()) ? ($("#user_email").parent().addClass("has-error"), $("#user_email").focus(), !1) : 0 == t.validateEmail(s) ? ($("#user_email").parent().addClass("has-error"), $("#user_email").focus(), !1) : ($("#user_email").parent().removeClass("has-error"), "" == (a = $("#user_key").val()) ? ($("#user_key").parent().addClass("has-error"), $("#user_key").focus(), !1) : ($("#user_email").parent().removeClass("has-error"), void checkExipreObj.isCheckActivate(function(e) {
					var i, n;
					i = (new Date).getDate() + "/" + ((new Date).getMonth() + 1) + "/" + (new Date).getFullYear() ? sendMessage({
						command: "saveUserToServer",
						data: {
							key: a,
							user_email: s
						}
					}, function(e) {
						console.log("user_response >> ", e), e && "success" == e.result ? (t.uiSettings.authUser = !0, t.uiSettings.userFreeTrialStarted = !1, t.uiSettings.authName = s, t.uiSettings.key = a, t.uiSettings.username = s, t.uiSettings.activate_date = btoa((new Date).getTime()), sendMessage({
							command: "saveUISettings",
							data: t.uiSettings
						}, function(e) {
							$("#saveBtn").val("SAVED!"), $("#msgInfoSection").html('<div class="alert alert-success alert-dismissible" role="alert"><strong>Great!</strong> Your settings are saved, and extension is now functional.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'), setTimeout(function() {
								$("#msgInfoSection").html(""), location.href = "index.html"
							}, 5e3), setTimeout(function() {
								$("#saveBtn").val("SAVE")
							}, 1e3), t.initSettings()
						})) : ($("#msgInfoSection").show(), $("#msgInfoSection").html('<div class="alert alert-danger alert-dismissible" role="alert"><strong>Error!</strong> ' + e.msg + '.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'))
					}) : ($("#msgInfoSection").show(), $("#msgInfoSection").html('<div class="alert alert-danger alert-dismissible" role="alert"><strong>Error!</strong> Your entered key is invalid.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'))
				})))
			})
		},
		validateEmail: function(e) {
			var t = new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi),
				s = t.test(e);
			return !!s
		}
	};

function sendMessage(t, s) {
	null != s && (e.push(s), t.callback = "yes"), chrome.runtime.sendMessage(t, s)
}

function handleMessage(s, a) {
	switch (s.command) {
		case "rec_getSettings":
			t.uiSettings = s.data.uiSettings
	}
	if (void 0 !== s.data && void 0 !== s.callback && "yes" == s.callback) e.pop()
}
window.addEventListener("load", function() {
	chrome.runtime.onMessage.addListener(handleMessage), t.load()
});