document.addEventListener ("DOMContentLoaded", function ()	{
	alert													("on DOMContentLoaded");
	error_message.style.display								=  "inline";
	setTimeout												(function ()			{
		error_message.style.display							=  "none";
	}, 3700);
	alert													("Before setting listener");
	login_button.addEventListener							("click", function (event)	{
		event.preventDefault								();
		alert												("On button click.");
		//localStorage.setItem								(STORAGE_KEY_SERVER_URL, "https://intranet.gdgoenkadwarka.com");
		alert												("About to post " + $("#login_form").serialize());
		try													{
		htmlPost											("https://intranet.gdgoenkadwarka.com" + "/servlets/three60.Infrastructure.Login.doLogin", $("#login_form").serialize(),
			function (login_response_object)				{
				alert										("Login Success");
				if  (login_response_object.login_status  !=  "success")				{
					password.value							=  "";
					error_message.style.display				=  "inline";
					setTimeout								(function ()			{
						error_message.style.display			=  "none";
					}, 3700);
					return;
				}
				window.localStorage.setItem					(STORAGE_KEY_LOGIN_TOKEN, login_response_object.login_token);
				window.location.href						=  login_response_object.redirect_url;
			},  HTML_POST_JSON_DATATYPE
		);
		/*.fail (function (response)							{
			alert											("Error " + response.responseText);
		});*/
		alert												("Posted");
		}
		catch  (err)										{
			alert											("Catch Error : " + err.message);
		}
	});
	alert													("After setting listener");
});
