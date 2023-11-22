const SERVER_URL = 'https://timbratori.cedolino.net/timbra2test.asp';

const httpRequest = (url = '', timeout = 5 * 1000, body = '') => {
	if (!url) return;

	return new Promise((resolve, reject) => {
		const controller = new AbortController();

		const timeoutId = setTimeout(() => {
			controller.abort();
			resolve(null);
		}, timeout);

		try {
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body,
				signal: controller.signal
			}).then((response) => {
				clearTimeout(timeoutId);
				resolve(response);
			});
		} catch (err) {
			resolve(null);
		}
	});
};

export const getSettingsFromServer = async (deviceId = '') => {
	const res = await httpRequest(`${SERVER_URL}?ope=GETSETTINGS&device=${deviceId}`, 20 * 1000);
	if (!res) return null;

	try {
		const data = await res.json();
		return data;
	} catch (err) {
		return null;
	}
};

export const getUid = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
	);
};

export const getGuestsFromServer = async (companyCode = '') => {
	const params = `ope=VISGET&azi=${companyCode}`;

	const res = await httpRequest(`${SERVER_URL}?${params}`);

	try {
		const json = await res.json();
		return json;
	} catch (err) {
		return null;
	}
};

export const signUpGuest = async (data) => {
	let params = '';

	for (const key of Object.keys(data)) {
		if (params !== '') params += '&';
		params += `${key}=${encodeURIComponent(data[key])}`;
	}

	const res = await httpRequest(`${SERVER_URL}?ope=VISIN`, 5 * 1000, params);

	if (!res || (res && res.status !== 200)) {
		return 'Ospite registrato offline';
	}

	try {
		const text = await res.text();
		return text;
	} catch (err) {
		return 'Ospite registrato offline';
	}
};

export const signOutGuest = async (companyCode = '', uid = '', signature = '', datetime = '') => {
	const params = `vis_codice=${uid}&azi=${companyCode}&vis_firma_uscita=${signature}&ora=${datetime}`;

	const res = await httpRequest(`${SERVER_URL}?ope=VISOUT`, 5 * 1000, params);

	if (!res || (res && res.status !== 200)) {
		return 'Uscita registrata offline';
	}

	try {
		const text = await res.text();
		return text;
	} catch (err) {
		return 'Uscita registrata offline';
	}
};

export const getGuestDataByUid = async (companyCode = '', uid = '') => {
	const res = await httpRequest(
		`${SERVER_URL}?ope=chkguest&azienda=${companyCode}&uid=${uid}`,
		5 * 1000
	);

	if (!res || (res && res.status !== 200)) {
		return false;
	}

	try {
		const json = await res.json();
		return json;
	} catch (err) {
		return false;
	}
};

export const checkQrCode = async (companyCode = '', uid = '') => {
	const params = `ope=QRCUPD&uuid=${uid}&azi=${companyCode}`;

	const res = await httpRequest(`${SERVER_URL}?${params}`, 2 * 1000);

	try {
		const data = await res.text();
		return data;
	} catch (err) {
		return false;
	}
};

export const saveQrCode = async (companyCode = '', uid = '') => {
	const params = `ope=QRCIN&uuid=${uid}&azi=${companyCode}`;

	await httpRequest(`${SERVER_URL}?${params}`, 3 * 1000);
	return;
};
