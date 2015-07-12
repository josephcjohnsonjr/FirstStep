$('document').ready(function(){

	$("#goBackToChooseRole").click(function(e){
		$("#chooseRole").show();
		$("#chooseInterests").hide();
		$(".done").hide();
		$(".next").show();
		$("#selectInterests").removeClass("current"); 
		$("#selectRole").addClass("current");
		$("#titleInfo").text("Select your role:");
	});

	$("#cancelAccountCreation").click(function(e){
		parent.history.back();
		e.preventDefault();
	});

	$("#goToChooseInterests").click(function(e){
		console.log("hi");
		
		$("#selectInterests").addClass("current"); 
		$("#selectRole").removeClass("current");
		$("#chooseRole").hide();
		$("#chooseInterests").show();
		$(".done").show();
		$(".next").hide();
	});
});