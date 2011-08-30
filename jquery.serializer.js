/**
 * jquery.serializer
 *
 * Copyright 2011, Zee Agency
 * Licensed under the CeCILL-C license
 * 
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html
 *
 * @author: Julien Cabanès
 * @version: 0.1
 */

(function($) {
		// Prefix backup
	var backupDataPrefix = 'backup_',
		
		// Risky TagNames
		riskyTagNames = ['input', 'textarea', 'select', 'option'],
		
		// Risky Attributes to backup
		riskyAttributes = ['value', 'selected', 'checked', 'disabled'],
	
		// Remove the risky attributes and restore it with backup data
		cleanHtmlCode = function(htmlCode) {
			//console.log('htmlCode', htmlCode);
			
			// Remove attributes
			for(var i in riskyAttributes) {
				if(riskyAttributes.hasOwnProperty(i)) {
					
					htmlCode = htmlCode.replace(new RegExp(' '+riskyAttributes[i]+'="[^"]*"', 'gi'), '');
				}
			}
			
			// Restore attributes
			return htmlCode.replace(new RegExp(backupDataPrefix, 'gi'), '');
		
		},
		
		// Setting data-*, Cross Browser…
		setData = document.body.dataset ? 
			// el.dataset
			function(el, attributeName) {
				
				if(el[attributeName]) {
					el.dataset[backupDataPrefix + attributeName] = el[attributeName];
				}
			} : 
			
			// el.setAttribute
			function(el, attributeName) {
			
				if(el[attributeName]) {
					el.setAttribute['data-' + backupDataPrefix + attributeName] = el[attributeName];
				}
			};
	
	// Backup attributes
	$.fn.serializerBackup = function() {

		return this.each(function() {
			
			// Risky attributes are backed up to data-* (ie. value --> data-backup_value)
			for(var i in riskyAttributes) {
				if(riskyAttributes.hasOwnProperty(i)) {
				
					setData(this, riskyAttributes[i]);
				}
			}
		});
	};
	
	// Serialize me (returns an outerHTML)
	$.fn.serializer = function() {
			
		return cleanHtmlCode(
		
			// Prepare textarea for cloning
			this.find('textarea')
				.each(function() {
					this.innerHTML = this.value;
				})
				.end()
			
			// Clone
			.clone()
			
			// Serialize the Clone
			.serializerBackup()
			
			// Serialize Clone's Descendants
			.find(riskyTagNames.join(', '))
				.serializerBackup()
				.end()
			
			// outerHTML
			.appendTo('<div/>')
			.parent()
			.get(0)
			.innerHTML
		);
	};
})(jQuery);