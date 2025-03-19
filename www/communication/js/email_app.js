function appShowEmailFragment ()							{
	const  serverUrl										=  localStorage.getItem (STORAGE_KEY_SERVER_URL);
	const  loginToken										=  localStorage.getItem (STORAGE_KEY_LOGIN_TOKEN);

	$("#main_frame .datepicker").datepicker					({
		format												:  "dd-mm-yyyy",
		autoclose											:  true,
		endDate												:  "+0d"
	});
	$("#main_frame #from_date").on							("changeDate", function (selected)	{
		$("#main_frame #to_date").datepicker				("setStartDate", new Date (selected.date.valueOf()));
	});
	$("#main_frame #to_date").on							("changeDate", function (selected)	{
		$("#main_frame #from_date").datepicker				("setEndDate", new Date (selected.date.valueOf()));
	});

	const  emailDataTable									=  new DataTable ("#main_frame #email_table", {
		columns												:  [
			{	visible										:  false		},
			{	title										:  "Subject"	},
			{	title										:  "Sent on"	},
			{	title										:  "Read on"	},
			{	title										:  "View",
				defaultContent								:  "<a href='#'> <img src='../infrastructure/img/view_icon.png' height='17px' class='view_email'> </a>"	}
		],
		info												:  false,
		paging												:  false,
		searching											:  false,
		ordering											:  false
	});

	$("#main_frame #get_email_button").on					("click", function (event)	{
		event.preventDefault								();
		_getEmails											();
	});
	_getEmails												();

	$("#main_frame #email_tbody").on						("click", function (event)	{
		const  event_target									=  event.target;
		if  (event_target)									{
			if  (event_target.className  ==  "view_email")	{
				_viewEmail									(event_target);
			}
		}
	});


	function  _getEmails ()									{
		$.get												(serverUrl + "/servlets/three60.Communication.Email.GetEmailArrays", $("#main_frame #get_email_form").serialize() + "&login_token=" +loginToken,
			function (email_arrays)							{
				emailDataTable.clear().rows.add				(email_arrays).draw();
			},  "json"
		);
	}


	function  _viewEmail (event_target)						{
		const  email_row_data								=  emailDataTable.row ($(event_target).parents("tr")).data();
		$.get												(serverUrl + "/servlets/three60.Communication.Email.GetEmailArrays", "mail_id=" + email_row_data[0] + "&login_token=" + loginToken,
			function  (email_array)							{
				$("#main_frame #email_subject_div").text	(email_row_data[1]);
				$("#main_frame #creation_time_div").text	(email_row_data[2]);
				$("#main_frame #body_div").html				(email_array[0]);
				$("#email_modal").modal						("show");
			},  "json"
		);
	}
}
