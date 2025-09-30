import {cModuleName, Translate} from "../utils/PerceptiveUtils.js";

const cBasicIcon = "fa-building-columns";

class WallTabInserter {
	//DECLARATIONS
	static InsertWallTabs(pApp, pHTML, pData) {} //inerts tabs into wall config
	
	//IMPLEMENTATIONS
	static InsertWallTabs(pApp, pHTML, pData) {
		if (!pHTML.querySelector(`nav.sheet-tabs`)) {
				//no tabs yet, insert basic tab
			if (game.release.generation <= 12) {
				//save basic settings content
				let vOriginalContent = pHTML.querySelector(`form`);
				
				if (!vOriginalContent?.length) {
					vOriginalContent = pHTML;
				}
				
				//create tab header with basic settings
				let vTabs = fromHTML(`<nav class="sheet-tabs tabs">
								<a class="item active" data-tab="basic">
									<i class="fas ${cBasicIcon}"></i>
									${Translate("Titles.Basic")}
								</a>
							</nav>`);
				
				//wrap basic settings in tab and place it instead of the settings
				let vBasicTab = fromHTML(`<div class="tab active scrollable" data-tab="basic"></div>`);
				
				Array.from(vOriginalContent.childNodes).forEach(vElement => {
					if (!["FOOTER", "BUTTON"].includes(vElement.tagName)) vBasicTab.append(vElement);
				});
				
				vOriginalContent.append(vBasicTab);
				
				//place tab header at top
				vOriginalContent.prepend(vTabs);

				//place confirm button at bottom
				vOriginalContent.append(vOriginalContent.querySelector(`footer`));
				
				pApp.options.tabs = [{ navSelector: ".tabs", contentSelector: "form", initial: "basic" }];
				pApp._tabs = pApp._createTabHandlers();
				const vElement = pHTML;
				pApp._tabs.forEach(t => t.bind(vElement));
			}
			else {
				//save basic settings content
				let vOriginalContent = pHTML.querySelector(`form`);
				
				if (!vOriginalContent) {
					vOriginalContent = pHTML;
				}
				
				//create tab header with basic settings
				let vTabs = fromHTML(`<nav class="sheet-tabs tabs" aria-roledescription="Form Tab Navigation" data-application-part="tabs">
								<a class="item active" data-tab="basic" data-group="sheet">
									<i class="fas ${cBasicIcon}"></i>
									${Translate("Titles.Basic")}
								</a>
							</nav>`);
				
				//wrap basic settings in tab and place it instead of the settings
				let vBasicTab = fromHTML(`<div class="tab active scrollable" data-tab="basic" data-group="sheet" data-application-part="identity"></div>`);
				vBasicTab.append(vOriginalContent.querySelector("div"));
				
				vOriginalContent.querySelector("section").prepend(vBasicTab);
				
				//place tab header at top
				vOriginalContent.querySelector("section").prepend(vTabs);
				
				vTabs.onclick = (pEvent) => {
					let vTarget = pEvent.target;
					
					let vGroup = vTarget?.getAttribute("data-group");
					let vactiveTab = vTarget?.getAttribute("data-tab");
					
					let vSection = vOriginalContent.querySelector("section");
					
					if (vGroup && vactiveTab) {
						let vContents = vSection.querySelectorAll(`div[data-group="${vGroup}"]`);
						
						Array.from(vContents).forEach(vContent => {
							if (vContent.getAttribute("data-tab") == vactiveTab) {
								vContent.classList.add("active");
							}
							else {
								vContent.classList.remove("active");
							}
						})
					}
				}
			}
		}
	}
}

function fromHTML(pHTML) {
	let vDIV = document.createElement('div');
	
	vDIV.innerHTML = pHTML;
	
	return vDIV.querySelector("*");
}

export {WallTabInserter}