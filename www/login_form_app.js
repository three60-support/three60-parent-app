document.addEventListener ("DOMContentLoaded", function ()	{
	login_button.addEventListener							("click", function (event)	{
		event.preventDefault								();
		localStorage.setItem								(STORAGE_KEY_SERVER_URL, "https://intranet.gdgoenkadwarka.com");
		try													{
		$.post												("https://intranet.gdgoenkadwarka.com" + "/servlets/three60.Infrastructure.Login.doLogin", $("#login_form").serialize(),
			function (login_response_object)				{
				if  (login_response_object.login_status  !=  "success")				{
					password.value							=  "";
					error_message.style.display				=  "inline";
					setTimeout								(function ()			{
						error_message.style.display			=  "none";
					}, 3700);
					return;
				}
				localStorage.setItem						(STORAGE_KEY_LOGIN_TOKEN, login_response_object.login_token);
				window.location.href						=  "./collation/student_homepage_app.html";
			},  "json"
		);
		/*.fail (function (response)							{
			alert											("Error " + response.responseText);
		});*/
		}
		catch  (err)										{
			alert											("Error : " + err.message);
		}
	});
});
