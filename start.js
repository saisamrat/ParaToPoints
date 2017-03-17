 
var selectionItem ={
	"id": "ParaToNote",
	"title": "ParaToNote",
	"contexts": ["selection"]
};
chrome.contextMenus.create(selectionItem);

//Listener for context click
chrome.contextMenus.onClicked.addListener(function(data){
	if(data.menuItemId == "ParaToNote" && data.selectionText){
		//var text = closeButton+'<li>'+ data.selectionText +'</li>';
		var text = data.selectionText;
		alert(text);
		var splitedText = splitText(text);
		alert(splitedText);
		splitedText = formatData(splitedText);
		updateNotes(splitedText);
	}

});

function splitText(text){
	var splitedText = text.split(". ");
	alert(splitedText);
	return splitedText;
}
function formatData(splitText){
	var formatedText = [];
	for(var i=0;i<splitText.length;i++){
		var capText = splitText[i].charAt(0).toUpperCase();
		capText = capText + splitText[i].substring(1);
		formatedText.push(capText);
	}

	return formatedText;
}
//Update the storage element
function updateNotes(newPoints){
	chrome.storage.sync.get({text:[]}, function(oldData){
		var notes = oldData.text;
		if(notes.length ==0){
			notes = [];
		}
		for(var i=0;i<newPoints.length;i++){
			notes.push(newPoints[i]);
		}
		
		// text = text + newNote
		 chrome.storage.sync.set({text: notes});
	});
	
}