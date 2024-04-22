import {$, SystemFn} from "./utilities.js";
import Request from "./request.js";
import Contextmenu from "./html/contextmenu.js";
import Toast from "./html/toast.js";

SystemFn(function() {
	let 
		i = 120,
		typing = false;

	setInterval(function() {
		let text = i + "s";

		if(typing) {
			text += "(paused)";
		} else {
			i--;

			if(i <= 0) {
				window.location.href = "";
			}
		}

		$("#refresh_display").value(text);
	}, 1000);

	// scrolltop functionality
	$("#scrolltop").on("click", function(b) {
		window.scrollTo(0, 0);
	});

	// scrolldown functionality
	$("#scrolldown").on("click", function(b) {
		window.scrollTo(0, document.documentElement.scrollHeight);
	});

	// search processes functionality
	$("#search_process").on("keyup", function(i) {
		$("table tbody tr").each(function(tr) {
			const 
				l = $(tr).children().length -1,
				last = $(tr).children()[l],
				command = last.txt().toLowerCase();

			if(command.includes($(i).value().toLowerCase())) {
				tr.show();
			} else {
				tr.hide();
			}
		});
	});

	$("#search_process").on("focus", function(i) {
		typing = true;
	});

	$("#search_process").on("blur", function(i) {
		typing = false;
	});

	$("table tbody tr")?.each(function(row) {
		$(row).on("contextmenu", function(r) {
			const 
				pid = $(row.children[1])?.value().trim(),
				e = window.event,
				menu = new Contextmenu({
					title: "Process ID: " + pid,
					voices: {
						1: {
							label: "Stop",
							click: function() {
								new Request({
									method: "POST",
									url: "api/kill_process.php",
									data: {
										pid: pid
									},
									done: function(r) {
										if(r.return === "ok") {
											window.location.href = "";
										} else {
											new Toast({
												text: "An error occurred while stopping the process.",
												position: "bot-center",
												timeout: 5,
												appearance: "error"
											});
										}
									}
								});
							}
						}
					}
				});
			
			e.preventDefault();

			$().appendChild(menu).then(() => {
				Contextmenu.setMenuPos(menu);
			});
		});
	});
});