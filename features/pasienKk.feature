Feature: Pasien & KK

Background:
    Given user navigates to login page
    When user enters 'valid' username and password
    And user clicks login button
    Then user will be directed to the select puskesmas page
    When user selects puskesmas
    Then user will be directed to the home page

@Regression @pendaftaran @umum @laki-laki @rawatJalan @kunjunganSakit
Scenario: User successfully register Patient with Asuransi Umum, Status Kunjungan Sakit and Instalasi Rawat Jalan
    Given user in pendaftaran pasien & kk page
    And user already have pasien 'laki-laki' with asuransi 'umum'
    When user search pasien asuransi umum with '<nik>'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks pendaftaran button
    And user selects 'Kunjungan Sakit' in the Status field
    And user selects 'Umum' as the Asuransi
    And user selects 'Rawat Jalan' as the Instalasi
    And user selects the Poli 'UMUM'
    And user selects the Jadwal Dokter 'TEST_PEGAWAI_0000002605'
    And user clicks the Simpan button
    Then user should see a success message
    When user navigates to the Pendaftaran Pasien
    And user inputs '<patientName>' in the search field
    And user clicks the Cari button
    Then patient registration data should be visible with name '<patientName>'
    And Ruangan daftar should be 'Umum'
    And Asuransi should be 'Umum'

@Regression @pendaftaran @umum @laki-laki @rawatJalan @kunjunganSehat
Scenario: User successfully register Patient with Asuransi Umum, Status Kunjungan Sehat and Instalasi Rawat Jalan
    Given user in pendaftaran pasien & kk page
    And user already have pasien 'laki-laki' with asuransi 'umum'
    When user search pasien asuransi umum with '<nik>'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks pendaftaran button
    And user selects 'Kunjungan Sehat' in the Status field
    And user selects 'Umum' as the Asuransi
    And user selects 'Rawat Jalan' as the Instalasi
    And user selects the Poli 'KONSELING'
    And user selects the Jadwal Dokter 'TEST_PEGAWAI_0000002605'
    And user clicks the Simpan button
    Then user should see a success message
    When user navigates to the Pendaftaran Pasien
    And user inputs '<patientName>' in the search field
    And user clicks the Cari button
    Then patient registration data should be visible with name '<patientName>'
    And Ruangan daftar should be 'KONSELING'
    And Asuransi should be 'Umum'

@Regression @pendaftaran @umum @laki-laki @rawatInap @kunjunganSakit
Scenario: User successfully register Patient with Asuransi Umum, Status Kunjungan Sakit and Instalasi Rawat Inap
    Given user in pendaftaran pasien & kk page
    And user already have pasien 'laki-laki' with asuransi 'umum'
    When user search pasien asuransi umum with '<nik>'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks pendaftaran button
    And user selects 'Kunjungan Sakit' in the Status field
    And user selects 'Umum' as the Asuransi
    And user selects 'Rawat Inap' as the Instalasi
    And user selects the Poli 'RAWAT INAP PONED'
    And user selects kamar 'inap pon'
    And user selects bed type 'bed 1'
    And user clicks the Simpan button
    Then user should see a success message
    When user navigates to the Pendaftaran Pasien
    And user inputs '<patientName>' in the search field
    And user clicks the Cari button
    Then patient registration data should be visible with name '<patientName>'
    And Ruangan daftar should be 'RAWAT INAP PONED'
    And Asuransi should be 'Umum'

@Regression @pendaftaran @deletePatient @umum @laki-laki @rawatJalan @kunjunganSakit
Scenario: User delete register Patient with Asuransi Umum, Status Kunjungan Sakit and Instalasi Rawat Jalan
   Given user in pendaftaran pasien & kk page
    And user already have pasien 'laki-laki' with asuransi 'umum'
    When user search pasien asuransi umum with '<nik>'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks pendaftaran button
    And user selects 'Kunjungan Sakit' in the Status field
    And user selects 'Umum' as the Asuransi
    And user selects 'Rawat Jalan' as the Instalasi
    And user selects the Poli 'UMUM'
    And user selects the Jadwal Dokter 'TEST_PEGAWAI_0000002605'
    And user clicks the Simpan button
    Then user should see a success message
    When user navigates to the Pendaftaran Pasien
    And user inputs '<patientName>' in the search field
    And user clicks the Cari button
    Then patient registration data should be visible with name '<patientName>'
    And Ruangan daftar should be 'Umum'
    And Asuransi should be 'Umum'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks the Hapus Permanen button
    And user clicks the Hapus Semua Pemeriksaan button
    And user inputs password otorisasi
    And user inputs keterangan "test hapus permanen" for deletion
    And user confirms deletion
    Then user should see a success message

@Regression @pendaftaran @BPJS @laki-laki @rawatJalan @kunjunganSakit
Scenario: User successfully register Patient with Asuransi BPJS Kesehatan, Status Kunjungan Sakit and Instalasi Rawat Jalan
    Given user in pendaftaran pasien & kk page
    When user search pasien asuransi BPJS with '<BPJSNumberJalan>'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks pendaftaran button
    And user selects 'Kunjungan Sakit' in the Status field
    And user selects 'BPJS Kesehatan' as the Asuransi
    And user selects 'Rawat Jalan' as the Instalasi
    And user selects the Poli 'UMUM'
    And user selects the Jadwal Dokter 'TEST_PEGAWAI_0000002605'
    And user clicks the Simpan button
    Then user should see a success message
    When user navigates to the Pendaftaran Pasien
    And user inputs '<BPJSNumberJalan>' in the search field
    And user clicks the Cari button
    Then patient registration data should be visible with name '<BPJSNumberJalan>'
    And system store pendaftaran ID
    And Ruangan daftar should be 'Umum'
    And Asuransi should be 'BPJS Kesehatan'
    And system delete the created pasien registration data
    | pendaftaranId     |                       |
    | passwordOtorisasi |                       |
    | keterangan        | test hapus permanen   |

@Regression @pendaftaran @BPJS @laki-laki @rawatInap @kunjunganSakit
Scenario: User successfully register Patient with Asuransi BPJS Kesehatan, Status Kunjungan Sakit and Instalasi Rawat Inap
    Given user in pendaftaran pasien & kk page
    When user search pasien asuransi BPJS with '<BPJSNumberInap>'
    And user select pasien from search result
    Then user will be directed to pasien detail page
    Given user in the pasien detail page
    When user clicks pendaftaran button
    And user selects 'Kunjungan Sakit' in the Status field
    And user selects 'BPJS Kesehatan' as the Asuransi
    And user selects 'Rawat Inap' as the Instalasi
    And user selects the Poli 'RAWAT INAP PONED'
    And user selects kamar 'inap pon'
    And user selects bed type 'bed 1'
    And user clicks the Simpan button
    Then user should see a success message
    When user navigates to the Pendaftaran Pasien
    And user inputs '<BPJSNumberInap>' in the search field
    And user clicks the Cari button
    Then patient registration data should be visible with name '<BPJSNumberInap>'
    And system store pendaftaran ID
    And Ruangan daftar should be 'RAWAT INAP PONED'
    And Asuransi should be 'BPJS Kesehatan'
    And system delete the created pasien registration data
    | pendaftaranId     |                       |
    | passwordOtorisasi |                       |
    | keterangan        | test hapus permanen   |