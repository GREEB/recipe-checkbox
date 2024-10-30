import siteData from './sites.json';

let wakeLock = null;
let checkAllCheckbox = null;

const site = siteData.sites.find(site => window.location.host.includes(site.url)); // Get site data
if (!site) {
	console.error('No site configuration found for the current host.');
}

const containerElement = document.querySelector(site.selector); // Get list from selector in config
if (!containerElement) {
	console.log('No container element found');
}

/**
 * Append elements
 */
containerElement.insertAdjacentElement('afterbegin', setupCheckAll());
if (!site.dontAddWakelock) {
	containerElement.insertAdjacentElement('afterbegin', setupWakeLock());
}

/**
 * Create checkboxes
 */
if (!site.dontAddCheckboxes) {
	for (const listItem of containerElement.querySelectorAll('li:not(.rc-check-all-item)')) { // For each item that is not our select all switch
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'ingredient-checkbox';
		listItem.prepend(checkbox); // Insert at the beginging of the li

		listItem.addEventListener('click', event => { // Click event for li text
			if (event.target.tagName !== 'A' && event.target !== checkbox) {
				checkbox.checked = !checkbox.checked;
				listItem.classList.toggle('rc-checked', checkbox.checked);
			}
		});
		checkbox.addEventListener('change', () => { // Click event for checkbox
			listItem.classList.toggle('rc-checked', checkbox.checked);
		});
	}
}

/**
 * Functions
 */
const changeAllCheckboxChange = () => {
	const allChecked = checkAllCheckbox.checked;
	for (const listItem of containerElement.querySelectorAll('li')) {
		const checkbox = listItem.querySelector('input[type=\'checkbox\']');
		if (checkbox && checkbox !== checkAllCheckbox) {
			checkbox.checked = allChecked;
			listItem.classList.toggle('rc-checked', allChecked);
		}
	}
};

async function setWakeLock(on) {
	if (on) {
		try {
			wakeLock = await navigator.wakeLock.request('screen');
		} catch (error) {
			console.log(`${error.name}, ${error.message}`);
		}
	} else {
		wakeLock.release().then(() => {
			wakeLock = null;
		});
	}
}

function setupCheckAll() {
	const checkAllItem = document.createElement('li');
	checkAllItem.className = 'rc-check-all-item';
	checkAllCheckbox = document.createElement('input');
	checkAllCheckbox.type = 'checkbox';
	checkAllCheckbox.className = 'rc-check-all-checkbox';
	checkAllItem.append(checkAllCheckbox);
	checkAllItem.append(document.createTextNode(' Check All / Uncheck All'));

	checkAllItem.addEventListener('click', () => {
		checkAllCheckbox.checked = !checkAllCheckbox.checked;
		changeAllCheckboxChange();
	});

	checkAllCheckbox.addEventListener('click', () => {
		checkAllCheckbox.checked = !checkAllCheckbox.checked;
		changeAllCheckboxChange();
	});
	return checkAllItem;
}

function setupWakeLock() {
	const container = document.createElement('div');
	container.className = 'rc-wakelock';
	const label = document.createElement('label');
	label.className = 'rc-switch';
	const input = document.createElement('input');
	input.type = 'checkbox';
	const span = document.createElement('span');
	span.className = 'rc-slider rc-round';
	label.append(input);
	label.append(span);
	container.append(document.createTextNode('Prevent your screen from going dark'));
	container.append(label);

	input.addEventListener('change', event => {
		if (event.target.checked) {
			setWakeLock(true);
		} else {
			setWakeLock(false);
		}
	});
	return container;
}
