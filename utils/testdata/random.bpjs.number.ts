import bpjsData from '../../data/data.bpjs.json';

export function pickRandomBpjsNumber(): string {
	const values = Object.values(bpjsData);
	if (values.length === 0) throw new Error('data.bpjs.json kosong, tidak bisa memilih nomor BPJS');
	return values[Math.floor(Math.random() * values.length)];
}

export function pickUniqueRandomBpjsNumbers(count: number): string[] {
	const values = Object.values(bpjsData);
	if (values.length === 0) throw new Error('data.bpjs.json kosong, tidak bisa memilih nomor BPJS');
	if (count <= 0) return [];
	const shuffled = [...values];
	for (let i = shuffled.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled.slice(0, Math.min(count, shuffled.length));
}

