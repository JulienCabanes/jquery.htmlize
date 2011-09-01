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
		riskyAttributes = ['value', 'selected', 'checked', 'disabled'],
	
		// Sync Attributes from Node Properties
		syncAttributes = function() {
			
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
		};
	
	// returns an outerHTML (by default) concatenation, if this contains many elements
	$.fn.htmlize = function(options) {
	
		// Configuration
		options = $.extend({
			innerHTML: false,
			clone: true
		}, options);
		
		// Clone for footprint & outerHTML
		var $el = options.clone ? this.clone() : this;
		
		// Syncing
		$el
			// Sync Clone
			.each(syncAttributes)
				
			// Sync Clone's Descendants
			.find(riskyTagNames.join(', ')).each(syncAttributes);
		
		// Serialization
		if(options.innerHTML) {
			
			// innerHTML
			var result = '';
			
			$el.each(function() {
				result += this.innerHTML;
			});
			
			return result;
		
		} else {
			
			// outerHTML
			return $el.appendTo('<div/>').parent().get(0).innerHTML;
		}
	};
})(jQuery);