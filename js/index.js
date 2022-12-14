var e = "#upload_error_msg",
	t = "#loading_section",
	n = /.txt$/,
	s = /.csv$/,
	a = /.xlsx$/,
	r = {
		uiSettings: {},
		numbers_arr: [],
		names_arr: [],
		load: function() {
			r.addEvents(), r.setSettingsValues(), r.updateScrapeState(), r.checkAuthStatus()
		},
		addEvents: function() {
			$(".btnAddLabelMsg").on("click", function() {
				var e = $(this).attr("data-label");
				$("#message_input").val();
				insertAtCaret("message_input", e), $("#message_input").change()
			}), $(document).on("click", ".close-popup", function(e) {
				self.close()
			}), $(document).on("click", ".sign-out-btn", function(e) {
				e.preventDefault(), sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings, r.uiSettings.authUser = !1, r.uiSettings.authName = "", sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {
						location.href = "login.html"
					})
				})
			}), $(document).on("click", ".extract-group-number-btn", function(t) {
				t.preventDefault(), $(e).html(""), $(e).hide(), sendMessage({
					command: "getSettings"
				}, function(t) {
					r.uiSettings = t.uiSettings, 1 == r.uiSettings.userFreeTrialStarted ? r.showFreeUserWarning() : chrome.tabs.query({}, function(t) {
						var n, s;
						if (!(t && t.length > 0)) return $(e).html('You need to open <a href="web.whatsapp.com" target="_blank"> web.whatsapp.com </a>'), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						for (n = "", s = 0; s < t.length; s++)
							if (t[s].url && -1 != t[s].url.indexOf("web.whatsapp.com")) {
								n = t[s].id;
								break
							} if ("" == n || !parseInt(n)) return $(e).html('You need to open <a href="https://web.whatsapp.com/" target="_blank"> web.whatsapp.com </a>'), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						chrome.tabs.get(parseInt(n), t => {
							chrome.tabs.sendMessage(parseInt(n), {
								command: "getWGrroupNumbers"
							}, function(s) {
								if (!s) return $(e).html("You need to Refresh whatsapp web tab and again click on extract group number button!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
								if (1 == s.group_found && 1 == s.whatsapp_web_open) chrome.windows.update(t.windowId, {
									focused: !0
								}, function() {}), chrome.tabs.update(parseInt(n), {
									active: !0
								}, function() {});
								else {
									if (0 == s.whatsapp_web_open) return $(e).html("You need to Connect whatsapp web and then open!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
									if (0 == s.group_found) return $(e).html("You need to open that group which you want to extract number!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1
								}
							})
						})
					})
				})
			}), $(document).on("click", ".click-send-self", function(t) {
				t.preventDefault(), $(e).html(""), $(e).hide();
				var n = $(this).attr("tab-id");
				chrome.tabs.get(parseInt(n), e => {
					chrome.windows.update(e.windowId, {
						focused: !0
					}, function() {}), chrome.tabs.update(parseInt(n), {
						active: !0
					}, function() {}), chrome.tabs.sendMessage(parseInt(n), {
						command: "openSelfChat"
					}, function(e) {})
				})
			}), $(document).on("click", ".download-excel-sample-format-btn", function(e) {
				var t, n;
				e.preventDefault(), t = "https://globalgymsoftware.com/sample-file-whatsapp-bulk-sender-globalgymsoftware.xlsx", (n = document.createElement("a")).href = t, n.style = "visibility:hidden", n.download = "", document.body.appendChild(n), n.click()
			}), $(document).on("click", ".download-sample-number-btn", function(e) {
				var t, n;
				e.preventDefault(), t = "data:text/csv;charset=utf-8," + escape("911234567890\n911234567891\n911234567892"), (n = document.createElement("a")).href = t, n.style = "visibility:hidden", n.download = "sample-numbers.txt", document.body.appendChild(n), n.click()
			}), $(document).on("click", ".download-sample-name-btn", function(e) {
				var t, n;
				e.preventDefault(), t = "data:text/csv;charset=utf-8," + escape("Sample Name 1\nSample Name 2\nSample Name 3"), (n = document.createElement("a")).href = t, n.style = "visibility:hidden", n.download = "sample-names.txt", document.body.appendChild(n), n.click()
			}), $(document).on("click", ".send-message-btn", function(t) {
				var i, o, u, c, l;
				if (t.preventDefault(), $(e).html(""), $(e).hide(), !1, $("#authResSection").hide(), "Start Send Message" == (i = $(this)).text().trim()) {
					if ("" == $("#numbers_file").val()) {
						if ("" == $("#numbers_input").val() && 0 == r.numbers_arr.length) return $(e).text("You need to enter a Numbers OR \n You need to select a txt file for Numbers"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						if ("" != $("#numbers_input").val() && (r.numbers_arr = [], (u = -1 != (o = $("#numbers_input").val()).indexOf(",") ? o.split(",") : -1 != o.indexOf("\n") ? o.split("\n") : -1 != o.indexOf("\t") ? o.split("\t") : o.split("\n")).length > 0))
							for (c = 0; c < u.length; c++) u[c].trim() && r.numbers_arr.push(u[c].trim())
					} else if (1 != n.test(String($("#numbers_file").val()).toLowerCase()) && 1 != s.test(String($("#numbers_file").val()).toLowerCase()) && 1 != a.test(String($("#numbers_file").val()).toLowerCase())) return $(e).text("You need to select only .txt|.csv|.xlsx file (Ex : sample-number.txt,sample-number.csv,sample-number.xlsx)"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
					if (0 == r.numbers_arr.length) return $(e).text("Numbers not found!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
					if ("" != $("#names_file").val()) {
						if (1 != n.test(String($("#names_file").val()).toLowerCase()) && 1 != s.test(String($("#names_file").val()).toLowerCase()) && 1 != a.test(String($("#names_file").val()).toLowerCase())) return $(e).text("You need to select only .txt|.csv|.xlsx file (Ex : sample-name.txt,sample-name.csv,sample-name.xlsx)"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						if (0 == r.names_arr.length) return $(e).text("Names not found!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						if (r.numbers_arr.length != r.names_arr.length) return $(e).text("Numbers and names file count does not match! Number Count : " + r.numbers_arr.length + " | Name Count : " + r.names_arr.length), $(e).show(), $(e)[0].scrollIntoView(!1), !1
					}
					if ("" == $("#message_input").val().trim()) return $(e).text("You need to enter message"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
					for (l = [], c = 0; c < r.numbers_arr.length; c++) l.push({
						number: r.numbers_arr[c],
						name: r.names_arr[c] || "",
						status: "Pending"
					});
					if (0 == l.length) return $(e).text("Numbers and Names not found!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
					chrome.tabs.query({}, function(t) {
						var n, s;
						if (!(t && t.length > 0)) return $(e).html('You need to open <a href="web.whatsapp.com" target="_blank"> web.whatsapp.com </a>'), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						for (n = "", s = 0; s < t.length; s++)
							if (t[s].url && -1 != t[s].url.indexOf("web.whatsapp.com")) {
								n = t[s].id;
								break
							} if ("" == n || !parseInt(n)) return $(e).html('You need to open <a href="https://web.whatsapp.com/" target="_blank"> web.whatsapp.com </a>'), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
						chrome.tabs.get(parseInt(n), t => {
							chrome.tabs.sendMessage(parseInt(n), {
								command: "checkInjectJs"
							}, function(t) {
								var s, a;
								if (!t) return $(e).html("You need to Refresh whatsapp web tab and again click on start send message button!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
								s = $("#attachment_input").is(":checked"), a = $("#countryCode").val(), sendMessage({
									command: "getSettings"
								}, function(t) {
									r.uiSettings = t.uiSettings;
									var o = r.uiSettings.userFreeTrialStarted;
									1 == s && 1 == o ? r.showFreeUserWarning() : r.uiSettings.attachment_input = s, r.uiSettings.countryCode = a, sendMessage({
										command: "saveUISettings",
										data: r.uiSettings
									}, function(t) {
										chrome.tabs.sendMessage(parseInt(n), {
											command: "checkLastAttachment"
										}, function(t) {
											if (1 == s && 0 == t) return $(e).html("You need to first send 'attachment' to your 'self', Which 'attachment' you want to send! <a href='#' class='click-send-self' tab-id='" + n + "'> Click here to send your self </a>"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
											i.html('<i class="fa fa-pause-circle"></i> Stop Sending Message'), i.removeClass("start-proccess-btn"), i.addClass("stop-proccess-btn"), $(".clear-data-btn,.export-report-btn").show(), $("#currentProcessedCount").text(0), sendMessage({
												command: "startSearchProcess",
												data: {
													scrapped_items_arr: l
												}
											}, function(e) {})
										})
									})
								})
							})
						})
					})
				} else i.html('<i class="fa fa-paper-plane"></i> Start Send Message'), i.removeClass("stop-proccess-btn"), i.addClass("start-proccess-btn"), sendMessage({
					command: "stopAutoBotProcess",
					reason: "manual_stop"
				}, function(e) {})
			}), $(document).on("click", ".send-group-message-btn", function(t) {
				var n;
				if (t.preventDefault(), $(e).html(""), $(e).hide(), !1, $("#authResSection").hide(), "Start Group Sender" == (n = $(this)).text().trim()) {
					if ("" == $("#group_message_input").val().trim()) return $(e).text("You need to enter group message"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
					sendMessage({
						command: "getSettings"
					}, function(e) {
						r.uiSettings = e.uiSettings, 1 == r.uiSettings.userFreeTrialStarted ? r.showFreeUserWarning() : r.startGroupSenderProcess(n)
					})
				} else n.html('<i class="fa fa-paper-plane"></i> Start Group Sender'), n.removeClass("stop-proccess-btn"), n.addClass("start-proccess-btn"), sendMessage({
					command: "stopAutoBotProcess",
					reason: "manual_stop"
				}, function(e) {})
			}), $(document).on("change", "#numbers_file", function(e) {
				r.uploadNumbersFile(e), $("#numbers_input").attr("disabled", "disabled")
			}), $(document).on("change input", "#numbers_input", function(e) {
				"" != $(this).val() ? $("#numbers_file").attr("disabled", "disabled") : $("#numbers_file").removeAttr("disabled")
			}), $(document).on("change", "#names_file", function(e) {
				sendMessage({
					command: "getSettings"
				}, function(t) {
					if (r.uiSettings = t.uiSettings, 1 == r.uiSettings.userFreeTrialStarted) return r.showFreeUserWarning(), !1;
					r.uploadNamesFile(e)
				})
			}), $(document).on("change keyup input", "#message_input", function(e) {
				var t = $(this).val().trim();
				sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings, r.uiSettings.message_input = t, sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {})
				})
			}), $(document).on("change keyup input", "#interval_break_seconds", function(e) {
				var t = $(this).val().trim();
				sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings, r.uiSettings.interval_break_seconds = parseInt(t), sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {})
				})
			}), $(document).on("change keyup input", "#attachment_input", function(e) {
				var t = $(this).is(":checked");
				sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings;
					var n = r.uiSettings.userFreeTrialStarted;
					if (1 == t && 1 == n) return r.showFreeUserWarning(), $("#attachment_input").prop("checked", !1), !1;
					r.uiSettings.attachment_input = t, sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {})
				})
			}), $(document).on("change keyup input", "#group_message_input", function(e) {
				var t = $(this).val().trim();
				sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings, r.uiSettings.group_message_input = t, sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {})
				})
			}), $(document).on("click", ".export-report-btn", function(e) {
				e.preventDefault();
				var t = $(this).attr("data-type");
				sendMessage({
					command: "getSettings"
				}, function(e) {
					var n, s, a, i;
					if (r.uiSettings = e.uiSettings, 1 == r.uiSettings.userFreeTrialStarted) return r.showFreeUserWarning(), !1;
					for (n = [], s = r.uiSettings.scrapped_items_arr, a = 0; a < s.length; a++) i = s[a].status, "Success" == t && "Sent" == i ? n.push({
						name: s[a].name,
						number: void 0 !== s[a].number ? s[a].number : "",
						date: void 0 !== s[a].date ? new Date(s[a].date).toLocaleString() : ""
					}) : "Fail" == t && "Failed" == i && n.push({
						name: s[a].name,
						number: void 0 !== s[a].number ? s[a].number : "",
						date: void 0 !== s[a].date ? new Date(s[a].date).toLocaleString() : ""
					});
					sendMessage({
						command: "downloadCSV",
						data: n,
						file_name: t + "_items_data_report"
					}, function(e) {})
				})
			}), $(document).on("click", ".clear-data-btn", function(e) {
				confirm("Are you sure you want to clear data!") && (e.preventDefault(), sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings, r.uiSettings.current_processed_count = 0, r.uiSettings.scrapped_items_arr = [], sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {
						location.reload()
					})
				}))
			})
		},
		authUserToServer: function(e, t, n) {
			sendMessage({
				command: "getSettings"
			}, function(e) {
				r.uiSettings = e.uiSettings, $.ajax({
					url: consts.base_api_url + consts.auth_user_api_url,
					type: "POST",
					data: {
						key: r.uiSettings.key,
						user_email: r.uiSettings.username
					},
					cache: !1,
					success: function(e) {
						n(e)
					},
					error: function(e) {
						r.setSettingsValues(), r.updateScrapeState()
					}
				})
			})
		},
		startGroupSenderProcess: function(t) {
			chrome.tabs.query({}, function(n) {
				var s, a;
				if (n && n.length > 0) {
					for (s = "", a = 0; a < n.length; a++)
						if (n[a].url && -1 != n[a].url.indexOf("web.whatsapp.com")) {
							s = n[a].id;
							break
						}
					"" != s && parseInt(s) ? chrome.tabs.get(parseInt(s), n => {
						chrome.tabs.sendMessage(parseInt(s), {
							command: "checkInjectJs"
						}, function(n) {
							if (!n) return $(e).html("You need to Refresh whatsapp web tab and again click on Start Group Sender button!"), $(e).show(), $(e)[0].scrollIntoView(!1), !1;
							r.aopenTabStartGroupSenderProcess(t)
						})
					}) : r.openTabStartGroupSenderProcess(t)
				}
			})
		},
		openTabStartGroupSenderProcess: function(e) {
			e.html('<i class="fa fa-pause-circle"></i> Stop Group Sender'), e.removeClass("start-proccess-btn"), e.addClass("stop-proccess-btn"), $(".clear-data-btn,.export-report-btn").show(), $("#currentProcessedCount").text(0), sendMessage({
				command: "startGroupSenderProcess",
				data: {}
			}, function(e) {})
		},
		browserSupportFileUpload: function() {
			var e = !1;
			return window.File && window.FileReader && window.FileList && window.Blob && (e = !0), e
		},
		uploadNumbersFile: function(t) {
			var i, o, u;
			r.browserSupportFileUpload() ? (null, o = (i = t.target.files[0]).name, u = new FileReader, 1 == n.test(o) ? (u.onload = function(e) {
				try {
					var t = e.target.result;
					t && void 0 !== t && null != t && null != t && r.parseNumberDataFromTXTFile(t)
				} catch (n) {}
			}, u.readAsText(i, "ISO-8859-1")) : 1 == s.test(o) ? (r.numbers_arr = [], u.onload = function(e) {
				var t, n;
				try {
					t = e.target.result, (n = $.csv.toObjects(t)) && void 0 !== n && null != n && null != n && r.parseNameAndNumberDataFromCSV(n)
				} catch (s) {}
			}, u.readAsText(i, "ISO-8859-1")) : 1 == a.test(o) && (r.numbers_arr = [], u.onload = function(e) {
				var t, n;
				try {
					t = e.target.result, (n = XLSX.read(t, {
						type: "binary"
					})).SheetNames.forEach(function(e) {
						var t = XLSX.utils.sheet_to_row_object_array(n.Sheets[e]);
						t && t.length > 0 && r.parseNameAndNumberDataFromXSL(t)
					})
				} catch (s) {}
			}, u.readAsBinaryString(i)), u.onerror = function() {
				$(e).text("Unable to read " + i.name), $(e).show(), $(e)[0].scrollIntoView(!1)
			}) : ($(e).text("The File APIs are not fully supported in this browser!"), $(e).show(), $(e)[0].scrollIntoView(!1))
		},
		uploadNamesFile: function(t) {
			var i, o, u;
			r.browserSupportFileUpload() ? (null, o = (i = t.target.files[0]).name, u = new FileReader, 1 == n.test(o) ? (u.onload = function(e) {
				try {
					var t = e.target.result;
					t && void 0 !== t && null != t && null != t && r.parseNamesDataFromFile(t)
				} catch (n) {}
			}, u.readAsText(i, "ISO-8859-1")) : 1 == s.test(o) ? (u.onload = function(e) {
				var t, n;
				r.names_arr = [];
				try {
					t = e.target.result, (n = $.csv.toObjects(t)) && void 0 !== n && null != n && null != n && r.parseNameAndNumberDataFromCSV(n)
				} catch (s) {}
			}, u.readAsText(i, "ISO-8859-1")) : 1 == a.test(o) && (r.names_arr = [], u.onload = function(e) {
				var t, n;
				try {
					t = e.target.result, (n = XLSX.read(t, {
						type: "binary"
					})).SheetNames.forEach(function(e) {
						var t = XLSX.utils.sheet_to_row_object_array(n.Sheets[e]);
						t && t.length > 0 && r.parseNameAndNumberDataFromXSL(t)
					})
				} catch (s) {}
			}, u.readAsBinaryString(i)), u.onerror = function() {
				$(e).text("Unable to read " + i.name), $(e).show(), $(e)[0].scrollIntoView(!1)
			}) : ($(e).text("The File APIs are not fully supported in this browser!"), $(e).show(), $(e)[0].scrollIntoView(!1))
		},
		parseNumberDataFromTXTFile: function(e) {
			var t, n;
			for (r.numbers_arr = [], t = e.split("\n"), n = 0; n < t.length; n++) t[n].trim() && r.numbers_arr.push(t[n].trim())
		},
		parseNameAndNumberDataFromCSV: function(e) {
			sendMessage({
				command: "getSettings"
			}, function(t) {
				var n, s;
				for (r.uiSettings = t.uiSettings, n = r.uiSettings.userFreeTrialStarted, s = 0; s < e.length; s++) e[s] && null != e[s].number && r.numbers_arr.push(e[s].number), 1 == n || e[s] && null != e[s].name && r.names_arr.push(e[s].name)
			})
		},
		parseNameAndNumberDataFromXSL: function(e) {
			sendMessage({
				command: "getSettings"
			}, function(t) {
				var n, s;
				for (r.uiSettings = t.uiSettings, n = r.uiSettings.userFreeTrialStarted, s = 0; s < e.length; s++) e[s] && null != e[s].number ? r.numbers_arr.push(e[s].number) : e[s] && null != Object.values(e[s]) && Object.values(e[s])[0] && r.numbers_arr.push(Object.values(e[s])[0]), 1 == n || (e[s] && null != e[s].name ? r.names_arr.push(e[s].name) : e[s] && null != Object.values(e[s]) && Object.values(e[s])[1] && r.names_arr.push(Object.values(e[s])[1]))
			})
		},
		parseNamesDataFromFile: function(e) {
			var t, n;
			for (r.names_arr = [], t = e.split("\n"), n = 0; n < t.length; n++) t[n].trim() && r.names_arr.push(t[n].trim())
		},
		checkAuthStatus: function() {
			sendMessage({
				command: "getSettings"
			}, function(e) {
				var t;
				r.uiSettings = e.uiSettings, 1 != r.uiSettings.authUser ? location.href = "login.html" : (t = r.uiSettings.authName, $("#logged-name").text(t))
			}), checkExipreObj.isCheckActivate(function(e) {
				1 == e ? r.authUserToServer({}, "sender", function(e) {
					e && e.result && "success" == e.result ? (r.setSettingsValues(), r.updateScrapeState()) : sendMessage({
						command: "getSettings"
					}, function(e) {
						r.uiSettings = e.uiSettings, r.uiSettings.userFreeTrialStarted = !0, sendMessage({
							command: "saveUISettings",
							data: r.uiSettings
						}, function(e) {})
					})
				}) : sendMessage({
					command: "getSettings"
				}, function(e) {
					r.uiSettings = e.uiSettings, r.uiSettings.userFreeTrialStarted = !0, sendMessage({
						command: "saveUISettings",
						data: r.uiSettings
					}, function(e) {})
				})
			})
		},
		setSettingsValues: function() {
			sendMessage({
				command: "getSettings"
			}, function(e) {
				var t, n, s, a, i, o;
				if (r.uiSettings = e.uiSettings, t = r.uiSettings.scrape_status, n = $(".send-message-btn"), "Finished" == t ? (n.html('<i class="fa fa-paper-plane"></i> Start Send Message'), n.removeClass("stop-proccess-btn"), n.addClass("start-proccess-btn")) : "Inprogress" == t ? (n.html('<i class="fa fa-pause-circle"></i> Stop Sending Message'), n.removeClass("start-proccess-btn"), n.addClass("stop-proccess-btn")) : (n.html('<i class="fa fa-paper-plane"></i> Start Send Message'), n.removeClass("stop-proccess-btn"), n.addClass("start-proccess-btn")), s = r.uiSettings.group_sender_status || "Finished", n = $(".send-group-message-btn"), "Finished" == s ? (n.html('<i class="fa fa-paper-plane"></i> Start Group Sender'), n.removeClass("stop-proccess-btn"), n.addClass("start-proccess-btn")) : "Inprogress" == s ? (n.html('<i class="fa fa-pause-circle"></i> Stop Group Sender'), n.removeClass("start-proccess-btn"), n.addClass("stop-proccess-btn")) : (n.html('<i class="fa fa-paper-plane"></i> Start Group Sender'), n.removeClass("stop-proccess-btn"), n.addClass("start-proccess-btn")), a = r.uiSettings.countryCode || "91", i = r.uiSettings.userFreeTrialStarted, o = r.uiSettings.current_processed_count, 1 == i && o >= 25) return $("#authResSection").show(), $("#authResSection").html('<div class="alert alert-warning alert-dismissible text-center"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> <i class="fa fa-info-circle"></i> FREE VERSION ALLOW TO SEND 25 Text Message Per Batch for more you need to <a class="" href="login.html"> Upgrade PRO </a>.</div>'), $("#authResSection")[0].scrollIntoView(!1), !1;
				$("#countryCode").val(a)
			})
		},
		showScrapeItemsList: function() {
			sendMessage({
				command: "getSettings"
			}, function(e) {
				var t, n, s, a, i;
				for (r.uiSettings = e.uiSettings, t = r.uiSettings.scrapped_items_arr, n = "", s = 0; s < t.length; s++) n += '<tr><td><div style="width: 20px;">' + (s + 1) + ' </div> </td><td><div style="width: 150px;">' + ("" != t[s].name ? t[s].name : "-") + ' </div> </td><td><div style="width: 150px;">' + (void 0 !== t[s].number ? t[s].number : "") + ' </div> </td><td><div style="width: 150px;">' + (void 0 !== t[s].date ? new Date(t[s].date).toLocaleString() : "-") + " </div> </td>", a = "", n += "<td> " + (a += "Sent" == (i = t[s].status) ? '<label class="label label-sm m-r-xs label-success"><i class="fa fa-check-circle"></i>Submitted</label>' : "Failed" == i ? '<label class="label label-sm m-r-xs label-danger"><i class="fa fa-check-circle"></i>Submitted</label>' : '<label class="label label-sm m-r-xs label-warning"><i class="fa fa-exclamation-circle"></i> ' + i + "</label>") + " </td>", n += "</tr>";
				"Finished" == r.uiSettings.scrape_status && t.length > 0 ? $(".clear-data-btn,.export-report-btn").show() : (0 == t.length && (n += '<tr><td class="text-center text-danger" colspan="5"> No data found! </td></tr>'), $(".clear-data-btn,.export-report-btn").hide()), $("#tbl_items_list").html(n)
			})
		},
		updateScrapeState: function() {
			sendMessage({
				command: "getSettings"
			}, function(e) {
				var t, n, s, a, i, o;
				r.uiSettings = e.uiSettings, r.setSettingsValues(), r.showScrapeItemsList(), t = r.uiSettings.total_scrapped_count, n = r.uiSettings.current_processed_count, s = r.uiSettings.message_input, a = r.uiSettings.group_message_input, i = r.uiSettings.interval_break_seconds, $("#currentProcessedCount").text(n), $("#totalScrappedItems").text(t), $("#message_input").val(s), $("#group_message_input").val(a), $("#interval_break_seconds").val(i), o = r.uiSettings.userFreeTrialStarted, r.uiSettings.authUser, 1 == o ? ($(".logged-user-info").hide(), $(".free-user-info").show()) : ($(".free-user-info").hide(), $(".logged-user-info").show())
			})
		},
		showFreeUserWarning: function() {
			$("#authResSection").show(), $("#authResSection").html('<div class="alert alert-warning alert-dismissible text-center"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> <i class="fa fa-info-circle"></i> You Need to upgrade your plan for use this feature. </a>. <br> Click here to <a href="login.html"> Upgrade </a> your plan.</div>'), $("#authResSection")[0].scrollIntoView(!1)
		}
	};

function sendMessage(e, t) {
	null != t && (e.callback = "yes"), chrome.runtime.sendMessage(e, t)
}

function sendMessageActiveTab(e, t) {
	chrome.tabs.query({
		active: !0,
		currentWindow: !0
	}, function(n) {
		chrome.tabs.sendMessage(n[0].id, e, t)
	})
}

function handleMessage(e, t) {
	switch (e.command) {
		case "rec_getSettings":
			r.uiSettings = e.data.uiSettings;
			break;
		case "updateScrapeState":
			r.updateScrapeState()
	}
	void 0 !== e.data && void 0 !== e.data.callback && "yes" == e.data.callback && (callback(), callback = null)
}

function treatAsUTC(e) {
	var t = new Date(e);
	return t.setMinutes(t.getMinutes() - t.getTimezoneOffset()), t
}

function daysBetween(e, t) {
	return (treatAsUTC(t) - treatAsUTC(e)) / 864e5
}

function insertAtCaret(e, t) {
	var n, s, a, r, i, o, u, c = document.getElementById(e);
	c && (n = c.scrollTop, s = 0, "ie" == (a = c.selectionStart || "0" == c.selectionStart ? "ff" : !!document.selection && "ie") ? (c.focus(), (r = document.selection.createRange()).moveStart("character", -c.value.length), s = r.text.length) : "ff" == a && (s = c.selectionStart), i = c.value.substring(0, s), o = c.value.substring(s, c.value.length), c.value = i + t + o, s += t.length, "ie" == a ? (c.focus(), (u = document.selection.createRange()).moveStart("character", -c.value.length), u.moveStart("character", s), u.moveEnd("character", 0), u.select()) : "ff" == a && (c.selectionStart = s, c.selectionEnd = s, c.focus()), c.scrollTop = n)
}
$(document).ready(function() {
	r.load(), chrome.runtime.onMessage.addListener(handleMessage)
});