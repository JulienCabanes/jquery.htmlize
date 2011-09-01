/**
 * jquery.serializer
 *
 * Copyright 2011, Zee Agency http://www.zeeagency.com
 * Licensed under the CeCILL-C license
 * 
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html
 *
 * @author: Julien Cabanès
 * @version: 0.2
 */

(function($) {

		// Risky TagNames
	var riskyTagNames = ['input', 'textarea', 'select', 'option'],
		
		// Risky Attributes to backup
		riskyAttributes = ['value', 'selected', 'checked', 'disabled'];
	
	
	// Syncing attributes
	$.fn.serializerSync = function() {

		return this.each(function() {
			
			var attribute;
			
			for(var i in riskyAttributes) {
				if(riskyAttributes.hasOwnProperty(i)) {
					
					attribute = riskyAttributes[i];
					
					// Need to sync : attribute or property is positive 
					if(attribute in this && (this.getAttribute(attribute) !== null || this[attribute])) {
						
						if(this.nodeName === 'TEXTAREA' && attribute === 'value') {
							// Special case : textarea needs innerHTML sync, not value
							this.innerHTML = this.value;
							
						} else { 
							// Sync attribute from property
							this.setAttribute(attribute, this[attribute]);
						}
					}
				}
			}
		});
	};
	
	// Serializer : returns an outerHTML concatenation by default
	$.fn.serializer = function(returnInnerHTML) {
		
		var $clone = this
						
						// Clone for footprint & outerHTML
						.clone()
						
						// Sync Clone
						.serializerSync()
							
						// Sync Clone's Descendants
						.find(riskyTagNames.join(', '))
							.serializerSync()
							.end();
		
		// Serialization
		
		if(returnInnerHTML) {
			// innerHTML
			var result = '';
			
			$clone.each(function() {
				result += this.innerHTML;
			});
			
			return result;
		
		} else {
			// outerHTML
			return $clone.appendTo('<div/>').parent().get(0).innerHTML;
		}
	};
})(jQuery);
/**/
