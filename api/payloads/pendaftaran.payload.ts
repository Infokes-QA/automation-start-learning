export type JenisKelamin = 'L' | 'P';

export interface PasienStorePayloadInput {
	token: string;

	nik: string;
	nama: string;
	tanggalLahir: string; // DD-MM-YYYY

	jenisKelamin?: JenisKelamin;
	tempatLahir?: string;

	asuransiId?: string;
	noKk?: string;
	noAsuransi?: string;

	noHp?: string;
	email?: string;
	alamat?: string;

	/** handle untuk tambahan raw key/value (contoh: MPasien[ktp_rt], propinsi_nama, umur_tahun, dll.) */
	overrides?: Record<string, string | undefined>;
}

function computeUmurFields(tanggalLahir: string, now: Date = new Date()): {
	umur_tahun: string;
	umur_bulan: string;
	umur_hari: string;
} {
	const match = tanggalLahir.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!match) return { umur_tahun: '', umur_bulan: '', umur_hari: '' };

	const day = Number(match[1]);
	const monthIndex = Number(match[2]) - 1;
	const year = Number(match[3]);
	const birth = new Date(year, monthIndex, day);
	if (Number.isNaN(birth.getTime())) return { umur_tahun: '', umur_bulan: '', umur_hari: '' };

	let years = now.getFullYear() - birth.getFullYear();
	let months = now.getMonth() - birth.getMonth();
	let days = now.getDate() - birth.getDate();

	if (days < 0) {
		const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		days += prevMonth.getDate();
		months -= 1;
	}
	if (months < 0) {
		months += 12;
		years -= 1;
	}

	return {
		umur_tahun: String(Math.max(0, years)),
		umur_bulan: String(Math.max(0, months)),
		umur_hari: String(Math.max(0, days)),
	};
}

/**
 * Dynamic Builder:
 * POST /pasien/store payload builder class
 */
export class PasienStorePayloadBuilder {
	private readonly form: Record<string, string>;

	constructor(token: string) {
		this.form = {
			_token: token,
			cekBpjs: 'default',
			cari_pasien: '',

			'MPasien[id]': '',
			'MPasien[asuransi_id]': '0000',
			'MPasien[no_asuransi]': '',
			'MPasien[no_kk]': '',
			'MPasien[nik]': '',
			'MPasien[ihs_number]': '',
			'MPasien[nama]': '',
			'MPasien[status_keluarga]': '',
			'MPasien[ibu_id]': '',
			nik_ibu: '',
			'MPasien[jenis_kelamin]': 'L',
			'MPasien[tanggal_lahir]': '',

			umur_tahun: '',
			umur_bulan: '',
			umur_hari: '',

			'MPasien[tempat_lahir]': '',
			'MPasien[no_dok_rm]': '',
			'MPasien[no_rm_lama]': '',
			'MPasien[gol_darah]': '',
			'MPasien[email]': '',
			'MPasien[no_hp]': '',

			'MPasien[propinsi_id]': '',
			propinsi_nama: '',
			'MPasien[kota_id]': '',
			kota_nama: '',
			'MPasien[kecamatan_id]': '',
			kecamatan_nama: '',
			'MPasien[kelurahan_id]': '',
			kelurahan_nama: '',
			'MPasien[dusun_id]': '',
			dusun_nama: '',

			'MPasien[alamat]': '',
			'MPasien[rt]': '',
			'MPasien[rw]': '',

			'MPasien[ktp_propinsi_id]': '',
			ktp_propinsi_nama: '',
			'MPasien[ktp_kota_id]': '',
			ktp_kota_nama: '',
			'MPasien[ktp_kecamatan_id]': '',
			ktp_kecamatan_nama: '',
			'MPasien[ktp_kelurahan_id]': '',
			ktp_kelurahan_nama: '',
			'MPasien[ktp_dusun_id]': '',
			ktp_dusun_nama: '',
			'MPasien[ktp_alamat]': '',
			'MPasien[ktp_rt]': '',
			'MPasien[ktp_rw]': '',

			'MPasien[pekerjaan_id]': '',
			pekerjaan_nama: '',
			'MPasien[pekerjaan_suami_id]': '',
			pekerjaan_suami_nama: '',
			'MPasien[instansi]': '',
			'MPasien[agama]': '',
			'MPasien[pendidikan]': '',
			'MPasien[status_perkawinan]': '',
			'MPasien[tanggal_menikah]': '',
			'MPasien[warganegara]': '',
			'MPasien[no_paspor]': '',
			'MPasien[negara_asal]': '',
			'MPasien[nama_ayah]': '',
			'MPasien[nama_ibu]': '',
		};
	}

	set(key: string, value: string | undefined): this {
		if (value === undefined) return this;
		this.form[key] = value;
		return this;
	}

	setMPasien(field: string, value: string | undefined): this {
		return this.set(`MPasien[${field}]`, value);
	}

	withNik(nik: string): this {
		return this.setMPasien('nik', nik);
	}

	withNama(nama: string): this {
		return this.setMPasien('nama', nama);
	}

	withTanggalLahir(tanggalLahir: string): this {
		this.setMPasien('tanggal_lahir', tanggalLahir);
		const umur = computeUmurFields(tanggalLahir);
		this.set('umur_tahun', umur.umur_tahun);
		this.set('umur_bulan', umur.umur_bulan);
		this.set('umur_hari', umur.umur_hari);
		return this;
	}

	withJenisKelamin(jenisKelamin: JenisKelamin): this {
		return this.setMPasien('jenis_kelamin', jenisKelamin);
	}

	withTempatLahir(tempatLahir: string): this {
		return this.setMPasien('tempat_lahir', tempatLahir);
	}

	withAsuransiId(asuransiId: string): this {
		return this.setMPasien('asuransi_id', asuransiId);
	}

	withNoKk(noKk: string): this {
		return this.setMPasien('no_kk', noKk);
	}

	withNoAsuransi(noAsuransi: string): this {
		return this.setMPasien('no_asuransi', noAsuransi);
	}

	withEmail(email: string): this {
		return this.setMPasien('email', email);
	}

	withNoHp(noHp: string): this {
		return this.setMPasien('no_hp', noHp);
	}

	withAlamat(alamat: string): this {
		return this.setMPasien('alamat', alamat);
	}

	apply(overrides: Record<string, string | undefined> | undefined): this {
		if (!overrides) return this;
		for (const [key, value] of Object.entries(overrides)) {
			this.set(key, value);
		}
		return this;
	}

	clone(): PasienStorePayloadBuilder {
		const token = this.form['_token'] ?? '';
		const cloned = new PasienStorePayloadBuilder(token);
		for (const [key, value] of Object.entries(this.form)) {
			cloned.form[key] = value;
		}
		return cloned;
	}

	build(): Record<string, string> {
		return { ...this.form };
	}
}

/** Factory: one-shot payload object (Record<string,string>) */
export function buildPasienStorePayload(input: PasienStorePayloadInput): Record<string, string> {
	const builder = new PasienStorePayloadBuilder(input.token)
		.withNik(input.nik)
		.withNama(input.nama)
		.withTanggalLahir(input.tanggalLahir)
		.withJenisKelamin(input.jenisKelamin ?? 'L')
		.withAsuransiId(input.asuransiId ?? '0000');

	if (input.tempatLahir) builder.withTempatLahir(input.tempatLahir);
	if (input.noKk) builder.withNoKk(input.noKk);
	if (input.noAsuransi) builder.withNoAsuransi(input.noAsuransi);
	if (input.email) builder.withEmail(input.email);
	if (input.noHp) builder.withNoHp(input.noHp);
	if (input.alamat) builder.withAlamat(input.alamat);

	builder.apply(input.overrides);
	return builder.build();
}

