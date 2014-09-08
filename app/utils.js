

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// Context menu helpers
var globalSelectedIndex = -1;

function menuSetCallback(name) {
	globalSelectedIndex = name;
}
		
function initializeContextMenuOn(elementsPrefix, menuId, menuSetCallback) {
	var mozilla=document.getElementById && !document.all
	var ie=document.all
	var contextisvisible=0
	var elements=$("[id^='" + elementsPrefix + "']")

	function iebody(){
		return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
	}

	function displaymenu(index){
		return function (e) {
			el=document.getElementById(menuId)
			contextisvisible=1
			if (mozilla){
				el.style.left=pageXOffset+e.clientX+"px"
				el.style.top=pageYOffset+e.clientY+"px"
				el.style.visibility="visible"
				e.preventDefault()
				menuSetCallback(elementsPrefix + index, index)
				return false
			}
			else if (ie){
				el.style.left=iebody().scrollLeft+event.clientX
				el.style.top=iebody().scrollTop+event.clientY
				el.style.visibility="visible"
				menuSetCallback(elementsPrefix + index, index)
				return false
			}};
	}

	function hidemenu(index) {
		return function(index) {
			if (typeof el!="undefined" && contextisvisible){
				el.style.visibility="hidden"
				contextisvisible=0
			}};
	}

	if (mozilla){
		for (var i=0; i< elements.length; i++)
			elements[i].addEventListener("contextmenu", displaymenu(i), true)
		document.addEventListener("click", hidemenu(i), true)
	}
	else if (ie){
		for (var i=0; i< elements.length; i++)
			elements[i].attachEvent("oncontextmenu", displaymenu(i))
		document.attachEvent("onclick", hidemenu(i))
	}
}