window.onload = function() {
	function isEmpty(t) {
		t = String(t).trim();
		return t === "null" || t === "undefined" || t === "";
	}

	function urlHasParams() {
		if(window.location.href.includes("?")) {
			return !isEmpty(window.location.href.split("?")[1]);
		}

		return false;
	}

	let
		dark_mode = window.location.href.split("?")[1]?.includes("dark=true"),
		html = document.body.parentNode,
		timeout = 119,
		display = document.getElementById("refresh-display"),
		scrolltop = document.getElementById("scrolltop"),
		scrolldown = document.getElementById("scrolldown"),
		rows = document.querySelectorAll("table tbody tr"),
		search = document.querySelector('input[name="search"]'),
		search_process = document.querySelector('input[name="search-process"]'),
		filter_vital = document.querySelector('input[name="filter_vital"]'),
		filter_daemon = document.querySelector('input[name="filter_daemon"]'),
		filter_system = document.querySelector('input[name="filter_system"]');

	rows.forEach(r => {
		r.onclick = function() {
			rows.forEach(i => i.classList.remove("selected"));

			r.classList.add("selected");
		};
	});

	setInterval(function() {
		display.textContent = timeout;
		timeout--;
	}, 1000);

	setTimeout(function() {
		window.location.href = "";
	}, timeout*1000);

	scrolltop.onclick = function() {
		window.scrollTo(0, 0);
	};

	scrolldown.onclick = function() {
		window.scrollTo(0, document.documentElement.scrollHeight);
	};

	search.onclick = function(e) {
		if(e == undefined || e == null) {
			e = window.event;
		}

		e.preventDefault();

		let params = [];

		if(search_process.value.trim() !== "") {
			params.push("pn=" + btoa(search_process.value));
		}

		if(filter_vital.checked || filter_daemon.checked || filter_system.checked) {
			let filters = [];

			if(filter_vital.checked) {
				filters.push(filter_vital.value);
			}

			if(filter_daemon.checked) {
				filters.push(filter_daemon.value);
			}

			if(filter_system.checked) {
				filters.push(filter_system.value);
			}

			filters = btoa(filters.join(";"));
		}

		params = params.join("&");

		if(params.trim() !== "") {
			window.location.href = "http://localhost:9010/taskmanager.php?" + params;
		}
	};

	if(dark_mode) {
		this.textContent = "Dark mode";
		html.classList.add("dark");
	}

	document.getElementById("btn-mode").onclick = function() {
		let 
			url_has_params = urlHasParams();
			url = "";

		if(!dark_mode) {
			if(url_has_params) {
				url = window.location.href + "&dark=true";
			} else {
				url = window.location.href + "?dark=true";
			}
		}

		window.location.href = url;
	};
};
