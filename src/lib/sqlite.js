import { get } from 'svelte/store';
import { DB } from './stores';
import { SQLite } from './cordova-plugins';

export const initializeDB = () => {
	if (!SQLite) return;

	return new Promise((resolve, reject) => {
		const db = SQLite.openDatabase('ospitidb', '1.0', '', 1, () => {
			if (!db) return;

			//create tables
			db.transaction(async (tx) => {
				await tx.executeSql('CREATE TABLE IF NOT EXISTS settings (json)');

				DB.set(db);

				resolve(db);
			});
		});
	});
};

export const transaction = () => {
	return new Promise(async (resolve, reject) => {
		let db = get(DB);
		if (!db) db = await initializeDB();

		db.transaction((tx) => resolve(tx));
	});
};

export const executeSql = (query, data = []) => {
	return new Promise(async (resolve, reject) => {
		const tx = await transaction();

		tx.executeSql(query, data, (tx, rs) => resolve([tx, rs]), reject);
	});
};
