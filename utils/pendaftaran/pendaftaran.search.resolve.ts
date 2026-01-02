import type { pasienData } from '../../data/pendaftaran.data';

export type PasienDataSnapshot = typeof pasienData;

function isOneOf(value: string, candidates: string[]): boolean {
	return candidates.includes(value);
}

function resolveRequired(value: string | null | undefined, label: string): string {
	if (!value) throw new Error(`${label} belum tersedia di pasienData`);
	return value;
}

export function resolvePendaftaranSearchValue(key: string, data: PasienDataSnapshot): string {
	const normalized = key.trim().toLowerCase();

	if (isOneOf(normalized, ['bpjsnumber', '<bpjsnumber>'])) {
		return resolveRequired(data.bpjsNumber, 'bpjsNumber');
	}

	if (isOneOf(normalized, ['bpjsnumberjalan', '<bpjsnumberjalan>', 'bpjs_jalan', '<bpjs_jalan>'])) {
		return resolveRequired(data.BPJSNumberJalan, 'BPJSNumberJalan');
	}

	if (isOneOf(normalized, ['bpjsnumberinap', '<bpjsnumberinap>', 'bpjs_inap', '<bpjs_inap>'])) {
		return resolveRequired(data.BPJSNumberInap, 'BPJSNumberInap');
	}

	if (isOneOf(normalized, ['nik', '<nik>'])) {
		return resolveRequired(data.createdPasien?.nik, 'createdPasien.nik');
	}

	if (
		normalized === 'patientname' ||
		normalized === '<patientname>' ||
		normalized === 'name' ||
		normalized === '<name>'
	) {
		return resolveRequired(data.createdPasien?.nama, 'createdPasien.nama');
	}

	return key;
}

export function resolvePendaftaranExpectedName(key: string, data: PasienDataSnapshot): string {
	const normalized = key.trim().toLowerCase();
	if (isOneOf(normalized, ['bpjsnumber', '<bpjsnumber>'])) {
		return resolveRequired(data.createdPasien?.nama, 'createdPasien.nama');
	}

	if (isOneOf(normalized, ['bpjsnumberjalan', '<bpjsnumberjalan>', 'bpjs_jalan', '<bpjs_jalan>'])) {
		return resolveRequired(
			data.lastSelectedPatientName ?? data.createdPasien?.nama,
			'lastSelectedPatientName/createdPasien.nama',
		);
	}
	if (isOneOf(normalized, ['bpjsnumberinap', '<bpjsnumberinap>', 'bpjs_inap', '<bpjs_inap>'])) {
		return resolveRequired(
			data.lastSelectedPatientName ?? data.createdPasien?.nama,
			'lastSelectedPatientName/createdPasien.nama',
		);
	}

	if (isOneOf(normalized, ['nik', '<nik>'])) {
		return data.createdPasien?.nama ?? resolveRequired(data.createdPasien?.nik, 'createdPasien.nik');
	}

	if (
		normalized === 'patientname' ||
		normalized === '<patientname>' ||
		normalized === 'name' ||
		normalized === '<name>'
	) {
		return resolveRequired(data.createdPasien?.nama, 'createdPasien.nama');
	}

	return key;
}
