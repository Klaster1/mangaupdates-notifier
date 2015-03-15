'use strict'

try {
	self.port.emit('series', document.querySelector('#list_table').outerHTML)
}
catch (e) {
	self.port.emit('error', 'Not authorised.')
}