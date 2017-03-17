$(function(){
	render();
	removeNote();
	clearNotes();
	downloadNotes();
	analytics();
});

function analytics(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-92674858-1', 'auto');
  ga('send', 'pageview');
}

function render(){
	chrome.storage.sync.get({text:[]}, function(data){
		var closeButton = "<span title='Remove note'><a href='#'><i class='fa fa-times' aria-hidden='true'></i></a></span>";
		var notes = data.text;
		for(var i=0;i<notes.length;i++){
			var text = validateData(notes[i]);
			$('ul').append("<li>"+closeButton +text+"</li>");
		}
		showHideButton();
	});
	
}
function validateData(text){
	if(text.indexOf("<") > -1){
		 var newText = text.replace(new RegExp("<" , 'g'), "&lt");
		 text = newText.replace(new RegExp(">", 'g'), "&gt")
	}
	return text;
}
function showHideButton(){
	if($('ul li').length==0){
		$('#stripe').hide();
		$('#pretext').show();
	}
	else{
		$('#stripe').show();
		$('#pretext').hide();
	}
}
function removeNote(){
	$('ul').on('click', 'span', function(){
		$(this).parent().fadeOut(500, function(){
			var index = $(this).parent().index();
			$(this).remove();
			removeFromStorage(index);
			showHideButton();
	});
});	
}
//Remove data from the storage
function removeFromStorage(removeNote){
	chrome.storage.sync.get({text:[]}, function(data){
			var newData = data.text;
			newData.pop(newData[removeNote]);
			chrome.storage.sync.set({'text': newData});
	});
}

//event for the clear button
function clearNotes(){
	$('#clearNotes').on('click', function(){
		var newNotes = [];
		chrome.storage.sync.set({text: newNotes});
		$('ul').empty();
		showHideButton();
	});
}

//download button event to dwld doc
function downloadNotes(){
	$('#download').on('click', function(){
		chrome.storage.sync.get({text:[]}, function(data){
			var list = parseData(data.text);
			downloadDoc(list);
	});

	});
}
function parseData(list){
	var text = "";
	for(var i=0;i<list.length;i++){
		text = text+ "\u2022" + list[i] + "\r\n";
	}
	return text;
}
function downloadDoc(list){

	var blob = new Blob(['\ufeff', list], {
     type: 'text/plain'
   });
   var url = URL.createObjectURL(blob);
   var link = document.createElement('A');
   link.href = url;
   link.download = 'MyNotes';  // default name without extension 
   document.body.appendChild(link);
   if (navigator.msSaveOrOpenBlob ) 
   		navigator.msSaveOrOpenBlob( blob, 'MyNotes.doc'); // IE10-11
    else link.click();  // other browsers
   document.body.removeChild(link);

}





