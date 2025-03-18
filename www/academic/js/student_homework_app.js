function showHomeworkFragment ()							{
	const	homework_as_on_element							=  document.querySelector ("#main_frame #homework_as_on");
	const	get_homework_button_element						=  document.querySelector ("#main_frame #get_homework_button");
	const	homework_tbody_element							=  document.querySelector ("#main_frame #homework_tbody");
	const	homework_modal_element							=  document.querySelector ("#main_frame #homework_modal");
	const	homework_subject_div_element					=  document.querySelector ("#main_frame #homework_subject_div");
	const	given_on_div_element							=  document.querySelector ("#main_frame #given_on_div");
	const	due_date_div_element							=  document.querySelector ("#main_frame #due_date_div");
	const	homework_div_element							=  document.querySelector ("#main_frame #homework_div");
	const	serverUrl										=  localStorage.getItem (STORAGE_KEY_SERVER_URL);
	const	loginToken										=  localStorage.getItem (STORAGE_KEY_LOGIN_TOKEN);
	var		homeworkId;
	$(homework_as_on_element).datepicker					({
		format												:  "dd-mm-yyyy",
		autoclose											:  true,
		endDate												:  "+0d"
	}).datepicker											("setDate", 'now');
	const  homeworkDatatable								=  new DataTable ("#main_frame #homework_table", {
		columns												:  [
			{	visible										:  false		},
			{	title										:  "Subject"	},
			{	title										:  "Given On"	},
			{	title										:  "Due Date"	},
			{	visible										:  false		},
			{	title										:  "View",
				defaultContent								:  "<a href='#'> <img src='../infrastructure/img/view_icon.png' class='view_homework' height='17px'> </a>"	}
		],
		info												:  false,
		paging												:  false,
		searching											:  false,
		ordering											:  false
	});

	_getHomework											();
	get_homework_button_element.addEventListener			("click", function (event)	{
		event.preventDefault								();
		_getHomework										();
	});

	homework_tbody_elememt.addEventListener					("click", function (event)	{
		const  event_target									=  event.target;
		if  (event_target)									{
			if  (event_target.className  ==  "view_homework")	{
				_viewHomework								(event_target);
			}
		}
	});

	homework_modal_element.addEventListener					("click", function (event)	{
		const  event_target									=  event.target;
		if  (event_target)									{
			if  (event_target.className  ==  "attachment_link")			{
				_onAttachmentClick							(event_target);
			}
		}
	});


	function  _getHomework ()								{
		htmlPost											(serverUrl + "/servlets/three60.Academic.Homework.GetStudentHomeworkMetaArrays",
			"homework_as_on=" + homework_as_on_element.value + "&login_token=" + loginToken,
			function  (homework_meta_arrays)				{
				if  (!rightsIsAuthorised (homework_meta_arrays, FRONTEND_TYPE_APP))		{
					return;
				}
				const  datatable_arrays						=  [];
				for  (var h = 0, h_length = homework_meta_arrays.length;  h < h_length;  h++)	{
					const	homework_meta_array				=  homework_meta_arrays[h];
					const	datatable_array					=  [];
					for  (var i = 0;  i < 4;  i++)			{
						datatable_array.push				(homework_meta_array[i]);
					}
					var		homework_text					=  homework_meta_array[4];
					const	attachment_array				=  homework_meta_array[5];
					const	attachment_length				=  attachment_array.length;
					if  (attachment_length > 0)				{
						var	attachment_html					=  "<b>Attachments: </b>";
						for  (var a = 0;  a < attachment_length;  a++)	{
							attachment_html					+= ("<a href='#' class='attachment_link'>" + attachment_array[a] + "</a>");
							if  (a  <  (attachment_length - 1))	{
								attachment_html				+= ", ";
							}
						}
						homework_text						+= ("<br>" + attachment_html);
					}
					datatable_array.push					(homework_text);
					datatable_arrays.push					(datatable_array);
				}
				homeworkDatatable.clear().rows.add			(datatable_arrays).draw();
			},  HTML_POST_JSON_DATATYPE
		);
	}


	function _viewHomework (event_target)					{
		const  homework_data								=  homeworkDatatable.row ($(event_target).parents("tr")).data();
		homeworkId											=  homework_data [0];
		homework_subject_div_element.textContent			=  homework_data [1];
		given_on_div_element.textContent					=  homework_data [2];
		due_date_div_element.textContent					=  homework_data [3];
		homework_div_element.innerHTML						=  homework_data [4];
		$("#main_frame #homework_modal").modal				("show");
	}


	function _onAttachmentClick (event_target)				{
		window.open											(serverUrl + "/servlets/three60.Infrastructure.VisibleData.GetVisibleDataFile?module_id=" + MODULE_ID_HOMEWORK + "&dep_id=" +
																homeworkId + "&file_name=" + event_target.textContent + "&login_token=" + loginToken, "_system");
	}
}
