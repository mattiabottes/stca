const SERVER_URL = 'https://srv.cedolino.net/timbra2.asp';

export const sendNFC = async (nfc = '') => {
	try {
		const res = await fetch(`${SERVER_URL}?nfc=${nfc}&ope=PASTO`);
		const message = await res.text();

		return {
			ok: true,
			message
		};
	} catch (err) {
		return {
			ok: false,
			message: 'Errore server, riprova più tardi'
		};
	}
};
