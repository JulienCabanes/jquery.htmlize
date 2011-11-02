/**
 * jquery.htmlize
 *
 * Copyright 2011, Zee Agency http://www.zeeagency.com
 * Licensed under the CeCILL-C license
 * 
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html
 *
 * @author: Julien Cabanès
 * @version: 0.4
 */

(function($) {

		// Risky TagNames
	var riskyTagNames = ['input', 'textarea', 'select', 'option'],
		
		// Risky Attributes to backup
		riskyAttributes = ['value', 'selected', 'checked', 'disabled'];
		
	
	// Prepare cloning
	$.fn.htmlizeClone = function(recursive) {
		
		this.each(function() {
			
			var el = this;
			
			if(el.nodeName === 'TEXTAREA') {
			
				el.innerHTML = el.value;
				
			} else if(el.nodeName === 'OPTION') {
				
				if(el.selected) {
				
					el.setAttribute('selected', 'selected');
					
				} else {
				
					el.removeAttribute('selected');
				}
				
			} else if(el.children.length) {
				
				// Recursive won't clone
				$(el).find('textarea, option').htmlizeClone(true);
			}
		
			// Each won't do anything...
		});
		
		return recursive ? this : this.clone();
	};
		
	// Sync Attributes from Node Properties
	$.fn.htmlizeSyncAttributes = function() {
		
		return this.each(function() {
			
			var el = this,
				
				attribute;
			
			for(var i in riskyAttributes) {
				if(riskyAttributes.hasOwnProperty(i)) {
					
					attribute = riskyAttributes[i];
					
					// Need to sync : attribute or property is positive 
					if(	attribute in el 
						&&  (el.getAttribute(attribute) !== null || el[attribute])
						&& !(el.nodeName === 'TEXTAREA' && attribute === 'value')) {
						
						// Sync attribute from property
						el.setAttribute(attribute, el[attribute]);
					}
				}
			}
			
			// Sync Clone's Descendants
			if(el.children.length) {
			
				$(el).find(riskyTagNames.join(', ')).htmlizeSyncAttributes();
				
			}
		});
	};
	
	// returns an outerHTML (by default), concatenates if many elements 
	$.fn.htmlize = function(options) {
	
		// Configuration
		options = $.extend({
			innerHTML: false,
			clone: true
		}, options);
		
		
		// Clone for footprint & outerHTML
		var $el = $(this).htmlizeClone().htmlizeSyncAttributes();
		
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
			return $el.length ? $el.appendTo('<div/>').parent().get(0).innerHTML : '';
		}
	};
})(jQuery);