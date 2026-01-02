import type { CreatedPasien } from '../api/facades/pasien.facade';

export const pasienData: {
	createdPasien: CreatedPasien | null;
	bpjsNumber: string | null;
	lastSearchKeyword: string | null;
	lastSelectedPatientName: string | null;
	BPJSNumberJalan: string;
	BPJSNumberInap: string;
} = {
	createdPasien: null,
	bpjsNumber: null,
	lastSearchKeyword: null,
	lastSelectedPatientName: null,
	BPJSNumberJalan: "0002086745354",
	BPJSNumberInap: "0002033378673",
};