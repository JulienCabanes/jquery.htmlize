test('cloning textarea', function() {

	var textarea = document.createElement('textarea');
	textarea.value = 'foo';
	
	// No Sync
	var clone1 = textarea.cloneNode(1);
	
	// Sync
	textarea.innerHTML = textarea.value;
	
	var clone2 = textarea.cloneNode(1);
	
	equals(clone1.value, '', 'Cloned value is empty');
	equals(clone2.value, 'foo', 'Synced Cloned value is impacted');
});