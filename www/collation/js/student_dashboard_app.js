function showDashboardFragment ()							{
	alert													("Inside student_dashboard_app.js");
	try														{
	const  serverUrl										=  localStorage.getItem (STORAGE_KEY_SERVER_URL);
	const  loginToken										=  localStorage.getItem (STORAGE_KEY_LOGIN_TOKEN);
	const  sibling_reg_id_const								=  document.querySelector ("#main_frame #sibling_reg_id");
	$.get													(serverUrl + "/servlets/three60.Collation.Dashboard.GetDashboardObject", "login_token=" + loginToken + "&frontend_type=app",
		function  (dashboard_object)						{
			if  (!rightsIsAuthorised (dashboard_object, FRONTEND_TYPE_APP))		{
				return;
			}
			$("#main_frame #card_container").html			(Mustache.render ($("#main_frame #blank_card").html(), dashboard_object));
			$(".clickable_card").on							("click", _onCardClick);
		},  "json"
	);

	$.get													(serverUrl + "/servlets/three60.Administration.StudentProfile.GetSiblingArrays", "login_token=" + loginToken,
		function  (sibling_arrays)							{
			if  (sibling_arrays.length  ==  0)				{
				return;
			}
			htmlPopulateSelect								(sibling_reg_id_const, sibling_arrays, true, "Switch to Sibling");
			sibling_div.style.display						=  "";
		},  "json"
	);

	function _onCardClick ()								{
		const  url											=  this.getAttribute ("url");
		if  (url  ==  "")									{
			return;
		}
		$("#main_frame").load								(url);
	};

	sibling_reg_id_const.addEventListener ("change", function	()	{
		htmlPost											(serverUrl + "/servlets/three60.Infrastructure.Login.LoginAsSibling",
			"sibling_reg_id=" + sibling_reg_id_const.value + "&login_token=" + loginToken + "&frontend_type=app",
			function  (login_response_object)				{
				if  (login_response_object.login_status  ==  "success")		{
					localStorage.setItem					(STORAGE_KEY_LOGIN_TOKEN, login_response_object.login_token);
					window.location.reload					();
				}
			},  HTML_POST_JSON_DATATYPE
		);
	});
	}
	catch  (err)											{
		alert												("Error inside student_dashboard_app.js " + err.message);
	}
}
