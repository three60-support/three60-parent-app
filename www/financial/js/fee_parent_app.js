function appShowFeeFragment ()								{
	const  serverUrl										=  localStorage.getItem (STORAGE_KEY_SERVER_URL);
	const  loginToken										=  localStorage.getItem (STORAGE_KEY_LOGIN_TOKEN);

	_getFeePayable											();

	function  _getFeePayable ()								{
		$.get												(serverUrl + "/servlets/in.three60.financial.fee.GetFeePayableObject", "login_token=" + loginToken,
			function  (fee_payable_object)					{
				$("#main_frame #online_fee_payment_div").html	(Mustache.render ($("#main_frame #online_fee_payment_template").html(), fee_payable_object.data));
				$("#main_frame #online_fee_payment_div #online_fee_payment_button").on		("click", function (event)	{
					event.preventDefault					();
					const  online_fee_payment_browser		=  cordova.InAppBrowser.open (serverUrl + "/servlets/three60.Financial.Fee.OnlineFeePaymentRequest?" +
																	$("#main_frame #online_fee_payment_div #online_fee_payment_form").serialize() + "&login_token=" + loginToken, "_blank", "location=no");
					
					online_fee_payment_browser.addEventListener	("exit", function ()		{
						//_getFeePayable						();
					});
				});
			},  "json"
		);
	}
}
